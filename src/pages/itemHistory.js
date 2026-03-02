import { fileStore } from "../storage/fileStore.js";

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function normalizeIds(value) {
    if (!Array.isArray(value)) return [];
    return value.map((id) => String(id));
}

function normalizeSearchText(value) {
    return String(value || "").trim().toLowerCase();
}

function getItemLabel(id, itemsById, emptyLabel = "") {
    if (id === undefined || id === null || id === "") {
        return emptyLabel;
    }

    const item = itemsById.get(String(id));
    return item?.name ?? `Unknown item (${id})`;
}

function renderItemList(ids, itemsById) {
    if (!ids.length) {
        return `<p class="roll-empty">No items yet.</p>`;
    }

    const rows = ids.map((id, index) => {
        const item = itemsById.get(id);
        const rawLabel = getItemLabel(id, itemsById);
        const label = escapeHtml(rawLabel);
        const searchValue = escapeHtml(normalizeSearchText(rawLabel));
        const image = item?.image ? `/images/${item.image}` : "/images/placeholder.png";
        const imgAttrs = item?.image
            ? `class="lazy-img roll-inline-image" data-src="${image}" src="/images/placeholder.png"`
            : `class="roll-inline-image" src="/images/placeholder.png"`;
        const contentMarkup = item
            ? `
                <a class="history-item-link history-item-link-list" onclick="navigate('/item?id=${id}')">
                    <img ${imgAttrs} alt="${label}">
                    <span class="history-item-text">${label}</span>
                </a>
            `
            : `
                <img ${imgAttrs} alt="${label}">
                <span class="history-item-text">${label}</span>
            `;

        return `
            <li class="roll-item-row" data-history-index="${index + 1}" data-history-search="${searchValue}" value="${index + 1}">
                <span>
                    ${contentMarkup}
                </span>
            </li>
        `;
    });

    return `<ol class="roll-name-list">${rows.join("")}</ol>`;
}

function renderSection(title, ids, itemsById) {
    const count = ids.length;
    return `
        <section class="roll-section">
            <h2>${title} <span class="roll-count">(${count})</span></h2>
            ${renderItemList(ids, itemsById)}
        </section>
    `;
}

function renderHistoryItem(id, itemsById, emptyLabel) {
    if (id === undefined || id === null || id === "") {
        return `
            <div class="history-panel-item is-empty">
                <img class="history-panel-image" src="/images/placeholder.png" alt="${escapeHtml(emptyLabel)}">
                <span class="history-panel-name">${escapeHtml(emptyLabel)}</span>
            </div>
        `;
    }

    const item = itemsById.get(id);
    const rawLabel = getItemLabel(id, itemsById, emptyLabel);
    const label = escapeHtml(rawLabel);
    const image = item?.image ? `/images/${item.image}` : "/images/placeholder.png";
    const imgAttrs = item?.image
        ? `class="lazy-img history-panel-image" data-src="${image}" src="/images/placeholder.png"`
        : `class="history-panel-image" src="/images/placeholder.png"`;
    const content = item
        ? `
            <a class="history-item-link history-item-link-panel" onclick="navigate('/item?id=${id}')">
                <img ${imgAttrs} alt="${label}">
                <span class="history-item-text">${label}</span>
            </a>
        `
        : `
            <img ${imgAttrs} alt="${label}">
            <span class="history-item-text">${label}</span>
        `;

    return `
        <div class="history-panel-item">
            ${content}
        </div>
    `;
}

function renderHistoryPanels(obtainedIds, rolledIds, itemsById) {
    const total = Math.max(obtainedIds.length, rolledIds.length);

    if (!total) {
        return `<p class="roll-empty">No items yet.</p>`;
    }

    const panels = Array.from({ length: total }, (_, index) => {
        const obtainedId = obtainedIds[index];
        const rolledId = rolledIds[index];
        const displayIndex = index + 1;
        const obtainedSearch = normalizeSearchText(getItemLabel(obtainedId, itemsById));
        const rolledSearch = normalizeSearchText(getItemLabel(rolledId, itemsById));
        const panelSearchValue = escapeHtml(`${obtainedSearch} ${rolledSearch}`.trim());

        return `
            <div class="history-panel card" data-history-index="${displayIndex}" data-history-search="${panelSearchValue}">
                <div class="history-panel-index">${displayIndex}</div>
                <div class="history-panel-column">
                    <div class="history-panel-label">Obtained</div>
                    ${renderHistoryItem(obtainedId, itemsById, "Not obtained")}
                </div>
                <div class="history-panel-column">
                    <div class="history-panel-label">Rolled</div>
                    ${renderHistoryItem(rolledId, itemsById, "Not rolled")}
                </div>
            </div>
        `;
    });

    return `<div class="history-grid">${panels.join("")}</div>`;
}

function renderClassicHistory(obtainedIds, rolledIds, itemsById) {
    return `
        ${renderSection("Obtained", obtainedIds, itemsById)}
        ${renderSection("Rolled", rolledIds, itemsById)}
    `;
}

export default async function ItemHistoryPage() {
    const obtained = fileStore.obtained;
    const rolled = fileStore.rolled;

    if (!obtained || !rolled) {
        return `
            <h1>Item history</h1>
            <p>Please upload your files on the Upload page first.</p>
        `;
    }

    await fileStore.ensureItemsLoaded();
    const itemsById = new Map((fileStore.items || []).map((item) => [String(item.id), item]));

    const obtainedIds = normalizeIds(obtained);
    const rolledIds = normalizeIds(rolled);
    const maxLength = Math.max(obtainedIds.length, rolledIds.length);

    const rangeFilter = maxLength
        ? `
        <div class="history-filter card">
            <div class="history-filter-header">
                <strong>Filters</strong>
                <label class="history-filter-field" for="historyReverseSort">
                    <input type="checkbox" id="historyReverseSort">
                    <span>Reverse order</span>
                </label>
            </div>
            <label class="history-search-field" for="historySearch">
                <span>Search</span>
                <input type="search" id="historySearch" placeholder="Item name">
            </label>
            <div class="history-filter-row">
                <label class="history-filter-field">
                    <span>Start</span>
                    <input type="number" id="historyRangeStart" min="1" max="${maxLength}" value="1">
                </label>
                <div class="history-filter-slider" id="historyRangeSlider" style="--range-start: 0%; --range-end: 100%;">
                    <div class="history-filter-track" aria-hidden="true"></div>
                    <div class="history-filter-range" aria-hidden="true"></div>
                    <input type="range" id="historyRangeStartSlider" min="1" max="${maxLength}" step="1" value="1" aria-label="History range start">
                    <input type="range" id="historyRangeEndSlider" min="1" max="${maxLength}" step="1" value="${maxLength}" aria-label="History range end">
                </div>
                <label class="history-filter-field">
                    <span>End</span>
                    <input type="number" id="historyRangeEnd" min="1" max="${maxLength}" value="${maxLength}">
                </label>
            </div>
        </div>
        `
        : "";

    return `
        <div class="history-header">
            <h1>Item history</h1>
            <label class="history-view-toggle">
                <span class="history-view-option">Panels</span>
                <span class="toggle-switch">
                    <input type="checkbox" id="itemHistoryViewToggle" aria-label="Toggle item history view">
                    <span class="toggle-slider" aria-hidden="true"></span>
                </span>
                <span class="history-view-option">List</span>
            </label>
        </div>
        ${rangeFilter}
        <div class="history-view history-view-panels is-active">
        <p class="roll-intro">Items are paired by position in your uploaded files. If one list is shorter, that side is left blank.</p>
            ${renderHistoryPanels(obtainedIds, rolledIds, itemsById)}
        </div>
        <div class="history-view history-view-list">
            ${renderClassicHistory(obtainedIds, rolledIds, itemsById)}
        </div>
    `;
}

let teardownHistoryHandlers = null;

export function init() {
    teardown();

    const toggle = document.getElementById("itemHistoryViewToggle");
    const panelView = document.querySelector(".history-view-panels");
    const listView = document.querySelector(".history-view-list");

    if (!toggle || !panelView || !listView) return;
    const cleanup = [];

    const storageKey = "itemHistoryView";
    const stored = localStorage.getItem(storageKey);
    const initialView = stored === "list" ? "list" : "panel";
    const reverseSortStorageKey = "itemHistoryReverseSort";
    const storedReverseSort = localStorage.getItem(reverseSortStorageKey);

    function setView(view) {
        const isList = view === "list";
        toggle.checked = isList;
        panelView.classList.toggle("is-active", !isList);
        listView.classList.toggle("is-active", isList);
        localStorage.setItem(storageKey, isList ? "list" : "panel");
    }

    setView(initialView);

    const onToggleInput = () => {
        setView(toggle.checked ? "list" : "panel");
    };
    toggle.addEventListener("input", onToggleInput);
    cleanup.push(() => toggle.removeEventListener("input", onToggleInput));

    const rangeStartInput = document.getElementById("historyRangeStart");
    const rangeEndInput = document.getElementById("historyRangeEnd");
    const rangeStartSlider = document.getElementById("historyRangeStartSlider");
    const rangeEndSlider = document.getElementById("historyRangeEndSlider");
    const rangeSlider = document.getElementById("historyRangeSlider");
    const searchInput = document.getElementById("historySearch");
    const reverseSortInput = document.getElementById("historyReverseSort");

    if (reverseSortInput) {
        reverseSortInput.checked = storedReverseSort === "true";
    }

    if (!rangeStartInput || !rangeEndInput || !rangeStartSlider || !rangeEndSlider || !rangeSlider) {
        teardownHistoryHandlers = () => {
            for (const remove of cleanup) {
                remove();
            }
        };
        return;
    }

    const maxLength = Number.parseInt(rangeEndInput.max, 10) || 1;

    function normalizeValue(value, fallback) {
        const parsed = Number.parseInt(value, 10);
        return Number.isFinite(parsed) ? parsed : fallback;
    }

    const panels = Array.from(panelView.querySelectorAll("[data-history-index]"));
    const rows = Array.from(listView.querySelectorAll(".roll-item-row[data-history-index]"));
    const panelGrid = panelView.querySelector(".history-grid");
    const rowLists = Array.from(listView.querySelectorAll(".roll-name-list"));

    function updateRangeStyle(start, end) {
        const maxSpan = Math.max(1, maxLength - 1);
        const startPercent = Math.min(100, Math.max(0, ((start - 1) / maxSpan) * 100));
        const endPercent = Math.min(100, Math.max(0, ((end - 1) / maxSpan) * 100));
        rangeSlider.style.setProperty("--range-start", `${startPercent}%`);
        rangeSlider.style.setProperty("--range-end", `${endPercent}%`);
    }

    function applySearch(searchValue) {
        const normalizedSearch = normalizeSearchText(searchValue);

        panels.forEach((panel) => {
            const panelSearch = panel.dataset.historySearch || "";
            panel.classList.toggle("history-search-hidden", Boolean(normalizedSearch) && !panelSearch.includes(normalizedSearch));
        });

        rows.forEach((row) => {
            const rowSearch = row.dataset.historySearch || "";
            row.classList.toggle("history-search-hidden", Boolean(normalizedSearch) && !rowSearch.includes(normalizedSearch));
        });
    }

    function sortByHistoryIndex(items) {
        return items.slice().sort((a, b) => {
            const left = normalizeValue(a.dataset.historyIndex, 1);
            const right = normalizeValue(b.dataset.historyIndex, 1);
            return left - right;
        });
    }

    function applyReverseSort(shouldReverse) {
        if (panelGrid) {
            const sortedPanels = sortByHistoryIndex(Array.from(panelGrid.querySelectorAll(".history-panel[data-history-index]")));
            if (shouldReverse) {
                sortedPanels.reverse();
            }
            sortedPanels.forEach((panel) => panelGrid.appendChild(panel));
        }

        rowLists.forEach((rowList) => {
            const sortedRows = sortByHistoryIndex(Array.from(rowList.querySelectorAll(".roll-item-row[data-history-index]")));
            if (shouldReverse) {
                sortedRows.reverse();
            }
            sortedRows.forEach((row) => rowList.appendChild(row));
        });
    }

    function applyRange(startValue, endValue, source) {
        let start = normalizeValue(startValue, 1);
        let end = normalizeValue(endValue, maxLength);

        start = Math.max(1, Math.min(start, maxLength));
        end = Math.max(1, Math.min(end, maxLength));

        if (start > end) {
            if (source === "start") {
                start = end;
            } else {
                end = start;
            }
        }

        rangeStartInput.value = start;
        rangeEndInput.value = end;
        rangeStartSlider.value = start;
        rangeEndSlider.value = end;
        updateRangeStyle(start, end);
        rangeStartSlider.style.zIndex = start === end ? 5 : 2;
        rangeEndSlider.style.zIndex = 4;

        panels.forEach((panel) => {
            const index = normalizeValue(panel.dataset.historyIndex, 1);
            panel.classList.toggle("history-range-hidden", index < start || index > end);
        });

        rows.forEach((row) => {
            const index = normalizeValue(row.dataset.historyIndex, 1);
            row.classList.toggle("history-range-hidden", index < start || index > end);
        });
    }

    applyRange(rangeStartInput.value, rangeEndInput.value, "init");
    applySearch(searchInput?.value || "");
    applyReverseSort(Boolean(reverseSortInput?.checked));

    const onRangeStartInput = () => {
        applyRange(rangeStartInput.value, rangeEndInput.value, "start");
    };
    rangeStartInput.addEventListener("input", onRangeStartInput);
    cleanup.push(() => rangeStartInput.removeEventListener("input", onRangeStartInput));

    const onRangeEndInput = () => {
        applyRange(rangeStartInput.value, rangeEndInput.value, "end");
    };
    rangeEndInput.addEventListener("input", onRangeEndInput);
    cleanup.push(() => rangeEndInput.removeEventListener("input", onRangeEndInput));

    const onRangeStartSliderInput = () => {
        applyRange(rangeStartSlider.value, rangeEndSlider.value, "start");
    };
    rangeStartSlider.addEventListener("input", onRangeStartSliderInput);
    cleanup.push(() => rangeStartSlider.removeEventListener("input", onRangeStartSliderInput));

    const onRangeEndSliderInput = () => {
        applyRange(rangeStartSlider.value, rangeEndSlider.value, "end");
    };
    rangeEndSlider.addEventListener("input", onRangeEndSliderInput);
    cleanup.push(() => rangeEndSlider.removeEventListener("input", onRangeEndSliderInput));

    if (searchInput) {
        const onSearchInput = () => {
            applySearch(searchInput.value);
        };
        searchInput.addEventListener("input", onSearchInput);
        cleanup.push(() => searchInput.removeEventListener("input", onSearchInput));
    }

    if (reverseSortInput) {
        const onReverseSortInput = () => {
            applyReverseSort(reverseSortInput.checked);
            localStorage.setItem(reverseSortStorageKey, reverseSortInput.checked ? "true" : "false");
        };
        reverseSortInput.addEventListener("input", onReverseSortInput);
        cleanup.push(() => reverseSortInput.removeEventListener("input", onReverseSortInput));
    }

    teardownHistoryHandlers = () => {
        for (const remove of cleanup) {
            remove();
        }
    };
}

export function teardown() {
    if (typeof teardownHistoryHandlers === "function") {
        teardownHistoryHandlers();
    }
    teardownHistoryHandlers = null;
}
