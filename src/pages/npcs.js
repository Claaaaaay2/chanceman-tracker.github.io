import { isItemHiddenByTag, isNpcObtainable } from "../logic/itemVisibility.js";
import { parseDropRate } from "../logic/utils.js";
import { fileStore } from "../storage/fileStore.js";

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
            <p>Please upload your files and player name on the Home page first.</p>
        `;
    }

    await fileStore.ensureItemsLoaded();

    const items = fileStore.items || [];
    const obtained = fileStore.obtained || [];
    const rolled = fileStore.rolled || [];
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
        if (filters.onlyRolled && !rolled.includes(item.id)) return false;
        if (isItemHiddenByTag(item)) return false;
        if (filters.isFreeToPlay && !item.tags?.includes("f2p")) return false;
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
            const list = itemsByNpc.get(npcName) || [];
            list.push(item);
            itemsByNpc.set(npcName, list);
        }
    }

    const results = [];
    for (const [npcName, npcItems] of itemsByNpc.entries()) {
        if (!npcItems.length) continue;
        if (!(await isNpcObtainable(npcName, ctx))) continue;
        results.push({ npcName, items: npcItems });
    }

    results.sort((a, b) => {
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
        const itemsHtml = entry.items
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((item) => {
                const drops = item.sources?.drops?.[entry.npcName];
                const rateLabel = getDropRateLabel(drops);
                return `
                <div class="npc-drop-item" onclick="navigate('/item?id=${item.id}')">
                    <img class="npc-drop-item-image" src="/images/${item.image}" alt="${escapeHtml(item.name)}">
                    <span class="npc-drop-item-name">${escapeHtml(item.name)}${escapeHtml(rateLabel)}</span>
                </div>
            `;
            })
            .join("");

        const itemNames = entry.items.map((item) => item.name.toLowerCase()).join(" ");

        return `
            <article class="npc-drop-card" data-name="${escapeHtml(entry.npcName.toLowerCase())}" data-items="${escapeHtml(itemNames)}">
                <header class="npc-drop-card-header">
                    <h2 class="npc-drop-name">${escapeHtml(entry.npcName)}</h2>
                    <span class="npc-drop-count">${itemCount} ${itemLabel}</span>
                </header>
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
};
