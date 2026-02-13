import { isItemHiddenByTag, isNpcObtainable } from "../logic/itemVisibility.js";
import { NPC_DATA } from "../logic/npcData.js";
import { parseDropRate } from "../logic/utils.js";
import { fileStore } from "../storage/fileStore.js";

const SLAYER_TASK_ONLY_ITEM_IDS = new Set([23490, 21257]);

function shouldHideTaskOnlyDropItem(item, npcName, filters) {
    if (!filters?.isSlayerLocked) return false;
    const itemId = Number(item?.id);
    if (!SLAYER_TASK_ONLY_ITEM_IDS.has(itemId)) return false;
    if (itemId === 23490 && npcName?.includes("Muddy chest")) return false;
    return true;
}

function getDropRateLabel(drops) {
    if (!drops) return "";
    let best = null;
    let bestValue = 0;

    if (Array.isArray(drops)) {
        for (const drop of drops) {
            if (!drop?.droprate) continue;
            const value = parseDropRate(drop.droprate);
            if (value > bestValue) {
                bestValue = value;
                best = drop.droprate;
            }
        }
    } else if (drops?.droprate) {
        best = drops.droprate;
    }

    return best ? ` (${best})` : "";
}

function getBestDropRateValue(drops) {
    if (!drops) return 0;
    let bestValue = 0;

    if (Array.isArray(drops)) {
        for (const drop of drops) {
            if (!drop?.droprate) continue;
            const value = parseDropRate(drop.droprate);
            if (value > bestValue) {
                bestValue = value;
            }
        }
    } else if (drops?.droprate) {
        bestValue = parseDropRate(drops.droprate);
    }

    if (!Number.isFinite(bestValue) || bestValue < 0) return 0;
    return bestValue;
}

function normalizeRateScore(value) {
    if (!Number.isFinite(value) || value <= 0) return 0;
    return value > 1 ? 1 : value;
}

function formatCumulativeRate(value) {
    if (!Number.isFinite(value) || value <= 0) return "0%";
    const clamped = Math.min(value, 1);
    const percent = clamped * 100;
    if (value > 1) return ">=100%";
    return `${percent.toFixed(2)}%`;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

export default async function NpcsPage() {
    if (!fileStore.player) {
        return `
            <h1>NPC drops</h1>
            <p>Please upload your files and player name on the Upload page first.</p>
        `;
    }

    await fileStore.ensureItemsLoaded();

    const items = fileStore.items || [];
    const obtained = fileStore.obtained || [];
    const rolled = fileStore.rolled || [];
    const rolledSet = new Set(
        Array.isArray(rolled)
            ? rolled.map((entry) => (entry && typeof entry === "object" ? entry.id : entry))
            : []
    );
    const filters = fileStore.filters || {};
    const ctx = {
        items,
        obtained,
        rolled,
        player: fileStore.player,
        filters
    };

    function isItemEligible(item) {
        if (!item) return false;
        if (obtained.includes(item.id)) return false;
        if (filters.onlyRolled && !rolledSet.has(item.id)) return false;
        if (filters.npcOnlyRolled && !rolledSet.has(item.id)) return false;
        if (isItemHiddenByTag(item)) return false;
        if (!filters.hasFlatpacks && item.tags?.includes("flatpack")) return false;
        if (!filters.hasItemsets && item.tags?.includes("itemset")) return false;
        if (filters.hideClue && item.tags?.includes("clue-reward-only")) return false;
        return true;
    }

    const itemsByNpc = new Map();
    for (const item of items) {
        if (!isItemEligible(item)) continue;
        const drops = item.sources?.drops;
        if (!drops) continue;
        for (const npcName of Object.keys(drops)) {
            if (shouldHideTaskOnlyDropItem(item, npcName, filters)) continue;
            const list = itemsByNpc.get(npcName) || [];
            list.push(item);
            itemsByNpc.set(npcName, list);
        }
    }

    const results = [];
    for (const [npcName, npcItems] of itemsByNpc.entries()) {
        if (!npcItems.length) continue;
        if (!(await isNpcObtainable(npcName, ctx))) continue;

        let totalRateScore = 0;
        for (const item of npcItems) {
            const drops = item.sources?.drops?.[npcName];
            if (!drops) continue;
            let bestRate = -Infinity;
            if (Array.isArray(drops)) {
                for (const drop of drops) {
                    if (!drop?.droprate) continue;
                    bestRate = Math.max(bestRate, parseDropRate(drop.droprate));
                }
            } else if (drops?.droprate) {
                bestRate = parseDropRate(drops.droprate);
            }
            totalRateScore += normalizeRateScore(bestRate);
        }

        results.push({ npcName, items: npcItems, totalRateScore });
    }

    results.sort((a, b) => {
        if (filters.npcSortByRate) {
            const rateDiff = b.totalRateScore - a.totalRateScore;
            if (rateDiff !== 0) return rateDiff;
        }
        const countDiff = b.items.length - a.items.length;
        if (countDiff !== 0) return countDiff;
        return a.npcName.localeCompare(b.npcName);
    });

    if (!results.length) {
        return `
            <h1>NPC drops</h1>
            <p class="empty-state">No reachable NPCs with remaining drops for your current filters.</p>
        `;
    }

    const cards = results.map((entry) => {
        const itemCount = entry.items.length;
        const itemLabel = itemCount === 1 ? "item" : "items";
        const npcWiki = NPC_DATA[entry.npcName]?.wiki;
        const npcNameHtml = npcWiki
            ? `<a class="npc-drop-name-link" href="${npcWiki}" target="_blank" rel="noreferrer">${escapeHtml(entry.npcName)}</a>`
            : `<span class="npc-drop-name-text">${escapeHtml(entry.npcName)}</span>`;
        const itemsHtml = entry.items
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

        const itemNames = entry.items.map((item) => item.name.toLowerCase()).join(" ");

        return `
            <article class="npc-drop-card" data-name="${escapeHtml(entry.npcName.toLowerCase())}" data-items="${escapeHtml(itemNames)}">
                <header class="npc-drop-card-header">
                    <h2 class="npc-drop-name">${npcNameHtml}</h2>
                    <span class="npc-drop-count">${itemCount} ${itemLabel}</span>
                </header>
                <div class="npc-drop-rate">Chance to get a new roll: ${formatCumulativeRate(entry.totalRateScore)}</div>
                <div class="npc-drop-items">
                    ${itemsHtml}
                </div>
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

document.addEventListener("input", async (e) => {
    if (e.target.id !== "npcSearch") return;
    const nextFilters = {
        ...fileStore.filters,
        npcSearch: e.target.value
    };
    await fileStore.setFilters(nextFilters);
    const list = document.getElementById("npcDropList");
    if (list) {
        applyNpcSearch(list);
    }
});

window.initNpcsPage = function () {
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
    if (typeof window.initNpcFilterUI === "function") {
        window.initNpcFilterUI(() => window.dispatchEvent(new PopStateEvent("popstate")));
    }
};

function setNpcSortToggle(button, isEnabled) {
    }

document.addEventListener("input", async (e) => {
    if (e.target.id !== "npcSortToggle") return;
    const nextValue = !fileStore.filters?.npcSortByRate;
    await fileStore.setFilters({
        ...fileStore.filters,
        npcSortByRate: nextValue
    });
    window.dispatchEvent(new PopStateEvent("popstate"));
});

document.addEventListener("input", async (e) => {
    if (e.target.id !== "npcOnlyRolledToggle") return;
    await fileStore.setFilters({
        ...fileStore.filters,
        npcOnlyRolled: e.target.checked
    });
    window.dispatchEvent(new PopStateEvent("popstate"));
});
