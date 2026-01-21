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

function renderItemList(ids, itemsById) {
    if (!ids.length) {
        return `<p class="roll-empty">No items yet.</p>`;
    }

    const rows = ids.map((id) => {
        const item = itemsById.get(id);
        const label = escapeHtml(item?.name ?? `Unknown item (${id})`);
        const content = item
            ? `<a onclick="navigate('/item?id=${id}')">${label}</a>`
            : label;
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
            <li class="roll-item-row">
                <span class="roll-item-row-content">
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
    const label = escapeHtml(item?.name ?? `Unknown item (${id})`);
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

        return `
            <div class="history-panel card">
                <div class="history-panel-index">${index + 1}</div>
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
            <p>Please upload your files on the Home page first.</p>
        `;
    }

    await fileStore.ensureItemsLoaded();
    const itemsById = new Map((fileStore.items || []).map((item) => [String(item.id), item]));

    const obtainedIds = normalizeIds(obtained);
    const rolledIds = normalizeIds(rolled);

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
        <p class="roll-intro">Items are paired by position in your uploaded files. If one list is shorter, that side is left blank.</p>
        <div class="history-view history-view-panels is-active">
            ${renderHistoryPanels(obtainedIds, rolledIds, itemsById)}
        </div>
        <div class="history-view history-view-list">
            ${renderClassicHistory(obtainedIds, rolledIds, itemsById)}
        </div>
    `;
}

window.initItemHistoryPage = function () {
    const toggle = document.getElementById("itemHistoryViewToggle");
    const panelView = document.querySelector(".history-view-panels");
    const listView = document.querySelector(".history-view-list");

    if (!toggle || !panelView || !listView) return;

    const storageKey = "itemHistoryView";
    const stored = localStorage.getItem(storageKey);
    const initialView = stored === "list" ? "list" : "panel";

    function setView(view) {
        const isList = view === "list";
        toggle.checked = isList;
        panelView.classList.toggle("is-active", !isList);
        listView.classList.toggle("is-active", isList);
        localStorage.setItem(storageKey, isList ? "list" : "panel");
    }

    setView(initialView);

    toggle.addEventListener("input", () => {
        setView(toggle.checked ? "list" : "panel");
    });
};
