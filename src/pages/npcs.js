import { NPC_DATA } from "../logic/npcData.js";
import { buildNpcDropEntries, formatCumulativeRate, getBestDropRateValue, getDropRateLabel } from "../logic/npcDropEntries.js";
import { initNpcFilterUI } from "../items/npcFilterUI.js";
import { fileStore } from "../storage/fileStore.js";

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function isClueRewardCasketSource(sourceName) {
    return /^Reward casket \(/i.test(sourceName || "");
}

export default async function NpcsPage() {
    if (!fileStore.player) {
        return `
            <h1>NPC drops</h1>
            <p>Please upload your files and player name on the Upload page first.</p>
        `;
    }

    await fileStore.ensureItemsLoaded();

    const filters = fileStore.filters || {};
    const collapseDrops = Boolean(filters.npcCollapseDrops);
    const { entries: results, rolledSet } = await buildNpcDropEntries({
        items: fileStore.items || [],
        obtained: fileStore.obtained || [],
        rolled: fileStore.rolled || [],
        player: fileStore.player,
        filters
    });

    const cards = results.map((entry) => {
        const itemCount = entry.items.length;
        const itemLabel = itemCount === 1 ? "item" : "items";
        const npcWiki = NPC_DATA[entry.npcName]?.wiki;
        const showClueRollInfo = isClueRewardCasketSource(entry.npcName);
        const clueRollInfoHtml = showClueRollInfo
            ? `<span class="clue-step-info npc-drop-rate-info" tabindex="0" aria-label="Clue casket roll information" title="Chance for a new roll is per roll inside the casket, not per casket.">i</span>`
            : "";
        const npcNameHtml = npcWiki
            ? `<a class="npc-drop-name-link" href="${npcWiki}" target="_blank" rel="noreferrer">${escapeHtml(entry.npcName)}</a>`
            : `<span class="npc-drop-name-text">${escapeHtml(entry.npcName)}</span>`;
        let itemsHtml = "";
        if (!collapseDrops) {
            itemsHtml = entry.items
                .sort((a, b) => {
                    const aRate = getBestDropRateValue(a.sources?.drops?.[entry.npcName]);
                    const bRate = getBestDropRateValue(b.sources?.drops?.[entry.npcName]);
                    const rateDiff = bRate - aRate;
                    if (rateDiff !== 0) return rateDiff;
                    return a.name.localeCompare(b.name);
                })
                .map((item) => {
                    const drops = item.sources?.drops?.[entry.npcName];
                    const rateLabel = getDropRateLabel(drops);
                    const isRolled = rolledSet.has(item.id);
                    return `
                    <div class="npc-drop-item" onclick="navigate('/item?id=${item.id}')">
                        <img class="npc-drop-item-image" src="/images/${item.image}" alt="${escapeHtml(item.name)}">
                        <span class="npc-drop-item-name">${escapeHtml(item.name)}${escapeHtml(rateLabel)}</span>
                        ${isRolled ? `<span class="badge rolled npc-drop-rolled">Rolled</span>` : ""}
                    </div>
                `;
                })
                .join("");
        }

        const itemNames = entry.items.map((item) => item.name.toLowerCase()).join(" ");

        return `
            <article class="npc-drop-card" data-name="${escapeHtml(entry.npcName.toLowerCase())}" data-items="${escapeHtml(itemNames)}">
                <header class="npc-drop-card-header">
                    <h2 class="npc-drop-name">${npcNameHtml}</h2>
                    <span class="npc-drop-count">${itemCount} ${itemLabel}</span>
                </header>
                <div class="npc-drop-rate">Chance to get a new roll: ${formatCumulativeRate(entry.totalRateScore)}${clueRollInfoHtml}</div>
                ${collapseDrops ? "" : `
                    <div class="npc-drop-items">
                        ${itemsHtml}
                    </div>
                `}
            </article>
        `;
    }).join("");

    const emptyDisplay = results.length ? "none" : "";

    return `
        <h1>NPC drops</h1>
        <div class="npc-drop-filters">
            <label class="npc-drop-filter">
                <span>Search NPCs or items:</span>
                <input type="search" id="npcSearch" value="${escapeHtml(filters.npcSearch ?? "")}" placeholder="NPC or item name">
            </label>
            <label class="npc-drop-sort">
                <span class="npc-drop-sort-title">Sort by:</span>
                <span class="npc-drop-sort-label">Amount of new rolls</span>
                <span class="toggle-switch npc-sort-toggle">
                    <input type="checkbox" id="npcSortToggle" aria-label="Toggle NPC sort order">
                    <span class="toggle-slider" aria-hidden="true"></span>
                </span>
                <span class="npc-drop-sort-label">Chance for new roll</span>
            </label>
            <label class="npc-drop-filter npc-drop-filter--checkbox">
                <input type="checkbox" id="npcOnlyRolledToggle">
                <span>Show only rolled items</span>
            </label>
            <label class="npc-drop-filter npc-drop-filter--checkbox">
                <input type="checkbox" id="npcCollapseDropsToggle">
                <span>Collapse drops</span>
            </label>
            <div class="npc-filter" id="npcFilter">
                <button type="button" id="npcFilterToggle">Hide specific NPCs</button>
                <div class="npc-filter-panel" id="npcFilterPanel">
                    <input type="search" id="npcFilterSearch" placeholder="Search NPCs...">
                    <div class="npc-filter-actions">
                        <button type="button" id="npcFilterAll">All</button>
                        <button type="button" id="npcFilterNone">None</button>
                    </div>
                    <div class="npc-filter-list" id="npcFilterList"></div>
                    <div class="npc-filter-actions npc-filter-actions--apply">
                        <button type="button" id="npcFilterApply">Apply</button>
                    </div>
                </div>
            </div>
        </div>
        <p class="empty-state" id="npcEmptyState" style="display: ${emptyDisplay};">No reachable NPCs with remaining drops for your current filters.</p>
        <section class="npc-drop-list" id="npcDropList">
            ${cards}
        </section>
    `;
}


function applyNpcSearch(container) {
    const searchValue = (fileStore.filters?.npcSearch || "").trim().toLowerCase();
    const cards = container.querySelectorAll(".npc-drop-card");
    let visibleCount = 0;
    for (const card of cards) {
        if (!searchValue) {
            card.style.display = "";
            visibleCount += 1;
            continue;
        }
        const name = card.dataset.name || "";
        const items = card.dataset.items || "";
        const matches = name.includes(searchValue) || items.includes(searchValue);
        card.style.display = matches ? "" : "none";
        if (matches) visibleCount += 1;
    }

    const emptyState = document.getElementById("npcEmptyState");
    if (emptyState) {
        emptyState.style.display = visibleCount ? "none" : "";
    }
}

let teardownNpcsHandlers = null;

export function init() {
    teardown();

    const list = document.getElementById("npcDropList");
    if (list) {
        applyNpcSearch(list);
    }
    const toggle = document.getElementById("npcSortToggle");
    if (toggle) {
        toggle.checked = Boolean(fileStore.filters?.npcSortByRate);
    }
    const onlyRolledToggle = document.getElementById("npcOnlyRolledToggle");
    if (onlyRolledToggle) {
        onlyRolledToggle.checked = Boolean(fileStore.filters?.npcOnlyRolled);
    }
    const collapseDropsToggle = document.getElementById("npcCollapseDropsToggle");
    if (collapseDropsToggle) {
        collapseDropsToggle.checked = Boolean(fileStore.filters?.npcCollapseDrops);
    }
    initNpcFilterUI(() => window.dispatchEvent(new PopStateEvent("popstate")));

    const onNpcSearchInput = async (event) => {
        if (event.target.id !== "npcSearch") return;
        const nextFilters = {
            ...fileStore.filters,
            npcSearch: event.target.value
        };
        await fileStore.setFilters(nextFilters);
        const nextList = document.getElementById("npcDropList");
        if (nextList) {
            applyNpcSearch(nextList);
        }
    };

    const onNpcSortInput = async (event) => {
        if (event.target.id !== "npcSortToggle") return;
        const nextValue = !fileStore.filters?.npcSortByRate;
        await fileStore.setFilters({
            ...fileStore.filters,
            npcSortByRate: nextValue
        });
        window.dispatchEvent(new PopStateEvent("popstate"));
    };

    const onNpcOnlyRolledInput = async (event) => {
        if (event.target.id !== "npcOnlyRolledToggle") return;
        await fileStore.setFilters({
            ...fileStore.filters,
            npcOnlyRolled: event.target.checked
        });
        window.dispatchEvent(new PopStateEvent("popstate"));
    };

    const onNpcCollapseDropsInput = async (event) => {
        if (event.target.id !== "npcCollapseDropsToggle") return;
        await fileStore.setFilters({
            ...fileStore.filters,
            npcCollapseDrops: event.target.checked
        });
        window.dispatchEvent(new PopStateEvent("popstate"));
    };

    document.addEventListener("input", onNpcSearchInput);
    document.addEventListener("input", onNpcSortInput);
    document.addEventListener("input", onNpcOnlyRolledInput);
    document.addEventListener("input", onNpcCollapseDropsInput);

    teardownNpcsHandlers = () => {
        document.removeEventListener("input", onNpcSearchInput);
        document.removeEventListener("input", onNpcSortInput);
        document.removeEventListener("input", onNpcOnlyRolledInput);
        document.removeEventListener("input", onNpcCollapseDropsInput);
    };
}

export function teardown() {
    if (typeof teardownNpcsHandlers === "function") {
        teardownNpcsHandlers();
    }
    teardownNpcsHandlers = null;
}
