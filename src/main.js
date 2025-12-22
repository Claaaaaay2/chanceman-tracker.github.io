import { canReachNpc, evaluateRule } from "./logic/itemAvailability.js";
import { NPC_DATA } from "./logic/npcData.js";
import { getObtainabilityRank } from "./logic/sortHelpers.js";
import { router } from "./router.js";
import { fileStore } from "./storage/fileStore.js";

const ITEM_SECTION_TITLES = {
    1: "Buyable shop Items",
    2: "Pickupable spawns",
    3: "Easy Rolls",
    4: "Other Sources",
    5: "Skill Requirements Met",
    6: "Other Drops",
    7: "Drops for which you do not have the level yet",
    8: "Unobtainable Items"
};

export function parseDropRate(rate) {
    if (!rate || rate === "N/A" || rate === "Unknown") return -1;

    rate = rate.trim();

    if (rate === "Always" || rate === "Once") return 1_000_000;
    if (rate.includes("Varies")) return 1 / 800;
    if (rate === "Common") return 1 / 16;
    if (rate === "Uncommon") return 1 / 64;
    if (rate === "Rare") return 1 / 128;

    // Remove multipliers: "3 × ~1/64" → "~1/64"
    rate = rate.replace(/^\d+\s*×\s*/i, "");

    // Handle percentages: "22.33%-28.11%"
    if (rate.includes("%")) {
        return 1_000_000;
    }

    // Handle multiple rates: "1/8; 1/50"
    if (rate.includes(";")) {
        return Math.min(
            ...rate.split(";").map(r => parseDropRate(r))
        );
    }

    // Handle ranges: "~1/800–~1/1200"
    if (rate.includes("–")) {
        const nums = rate.match(/\d+/g);
        if (!nums) return Infinity;
        return 1 / Math.min(...nums.map(Number));
    }

    // Handle estimates "~1/42"
    const match = rate.match(/(\d+)\s*\/\s*(\d+)/);
    if (match) {
        return Number(match[1]) / Number(match[2]);
    }

    return Infinity;
}

let rankedItemsCache = null;

async function computeAllRanksOnce(items, ctx) {
    if (rankedItemsCache) return rankedItemsCache;

    rankedItemsCache = await Promise.all(
        items.map(async item => {
            let bestDropRate = 0;

            if (item.sources?.drops) {
                for (const [npcName, drops] of Object.entries(item.sources.drops)) {

                    // ONLY consider reachable NPCs
                    if (!(await canReachNpc(npcName, ctx))) continue;

                    if (Array.isArray(drops)) {
                        for (const d of drops) {
                            bestDropRate = Math.max(
                                bestDropRate,
                                parseDropRate(d.droprate)
                            );
                        }
                    } else if (drops?.droprate) {
                        bestDropRate = Math.max(
                            bestDropRate,
                            parseDropRate(drops.droprate)
                        );
                    }
                }
            }

            return {
                item,
                sort: await getObtainabilityRank(item, ctx),
                bestDropRate
            };
        })
    );

    return rankedItemsCache;
}

window.addEventListener("DOMContentLoaded", async () => {
    await fileStore.init(); // load from IndexedDB first
    router();
});

window.addEventListener('DOMContentLoaded', router);
window.addEventListener('popstate', router);

// Allow <a data-link href="/about"> navigation
document.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
        e.preventDefault();
        history.pushState(null, "", e.target.href);
        router();
    }
});

function initLazyImages() {
    const lazyImages = document.querySelectorAll("img.lazy-img");

    const observer = new IntersectionObserver((entries, obs) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;   // load real image
                img.classList.remove("lazy-img");
                obs.unobserve(img);
            }
        }
    });

    lazyImages.forEach(img => observer.observe(img));
}

window.initItemsPage = async function () {
    await fileStore.ensureItemsLoaded();

    const data = window.__itemsPageData;
    if (!data) return;

    const searchInput = document.getElementById("itemSearch");
    const hideRolled = document.getElementById("hideRolled");
    const onlyUnlocked = document.getElementById("onlyUnlocked");
    const onlyObtainable = document.getElementById("onlyObtainable");
    const hideClue = document.getElementById("hideClueRewardOnly");
    const allowOthersHouses = document.getElementById("allowOthersHouses");
    const hasFlatpacks = document.getElementById("hasFlatpacks");
    const hasItemsets = document.getElementById("hasItemsets");
    const grid = document.getElementById("itemGrid");

    if (!searchInput || !hideRolled || !onlyUnlocked || !onlyObtainable || !hideClue || !allowOthersHouses || !hasFlatpacks || !hasItemsets || !grid) {
        setTimeout(initItemsPage, 0);
        return;
    }

    const f = fileStore.filters;
    searchInput.value = f.search ?? "";
    hideRolled.checked = f.hideRolled ?? true;
    onlyUnlocked.checked = f.onlyUnlocked ?? false;
    onlyObtainable.checked = f.onlyObtainable ?? false;
    hideClue.checked = f.hideClue ?? true;
    allowOthersHouses.checked = f.allowOthersHouses ?? false;
    hasFlatpacks.checked = f.hasFlatpacks ?? true;
    hasItemsets.checked = f.hasItemsets ?? true;

    const { items, rolled, unlocked } = data;

    async function renderItems() {
        const search = searchInput.value.toLowerCase();
        const hideR = hideRolled.checked;
        const onlyU = onlyUnlocked.checked;
        const onlyO = onlyObtainable.checked;
        const hideCl = hideClue.checked;
        const allowHo = allowOthersHouses.checked;
        const hasFl = hasFlatpacks.checked;
        const hasIt = hasItemsets.checked;

        const ranked = await computeAllRanksOnce(items, fileStore);

        // sort async
        const filtered = [];

        for (const entry of ranked) {
            const { item } = entry;
            let sort = { ...entry.sort };

            if (!item.name.toLowerCase().includes(search)) continue;
            if (hideR && rolled.includes(item.id)) continue;
            if (onlyU && !unlocked.includes(item.id)) continue;
            if (hideCl && item.tags?.includes("clue-reward-only")) continue;
            if (onlyO && sort.rank === 7) continue;
            if (allowHo && await isHouseOnlyItem(item, fileStore)) {
                sort.rank = 8;
            }
            if (!hasFl && item.tags?.includes("flatpack")) continue;
            if (!hasIt && item.tags?.includes("itemset")) continue;

            filtered.push({ ...entry, sort });
        }

        filtered.sort((a, b) => {
            // Primary: rank
            if (a.sort.rank !== b.sort.rank) {
                return a.sort.rank - b.sort.rank;
            }

            // Secondary: droprate for drop ranks
            if (a.sort.rank === 6) {
                if (a.bestDropRate !== b.bestDropRate) {
                    return b.bestDropRate - a.bestDropRate;
                }
            }

            // Fallback: alphabetical
            return a.sort.name.localeCompare(b.sort.name);
        });

        let html = "";
        let lastRank = null;

        for (const { item, sort } of filtered) {
            if (sort.rank !== lastRank) {
                html += `
                    <h2 class="item-section-header">
                        ${ITEM_SECTION_TITLES[sort.rank] ?? "Other Items"}
                    </h2>
                `;
                lastRank = sort.rank;
            }

            const isRolled = rolled.includes(item.id);
            const isUnlocked = unlocked.includes(item.id);

            html += `
                <div class="item-card" onclick="navigate('/item?id=${item.id}')">
                    ${isRolled ? `<span class="badge rolled">Rolled</span>` : ""}
                    ${isUnlocked ? `<span class="badge unlocked">Unlocked</span>` : ""}
                    <img class="lazy-img item-image" data-src="/images/${item.image}" src="/images/placeholder.png">
                    ${item.name}
                </div>
            `;
        }

        grid.innerHTML = html;

        setTimeout(() => initLazyImages(), 0);
    }

    function saveFilters() {
        fileStore.setFilters({
            search: searchInput.value,
            hideRolled: hideRolled.checked,
            onlyUnlocked: onlyUnlocked.checked,
            onlyObtainable: onlyObtainable.checked,
            hideClue: hideClue.checked,
            allowOthersHouses: allowOthersHouses.checked,
            hasFlatpacks: hasFlatpacks.checked,
            hasItemsets: hasItemsets.checked
        });
    }

    searchInput.addEventListener("input", () => {
        saveFilters();
        renderItems();
    });

    hideRolled.addEventListener("input", () => {
        saveFilters();
        renderItems();
    });

    onlyUnlocked.addEventListener("input", () => {
        saveFilters();
        renderItems();
    });

    onlyObtainable.addEventListener("input", () => {
        saveFilters();
        renderItems();
    });

    hideClue.addEventListener("input", () => {
        saveFilters();
        renderItems();
    });

    allowOthersHouses.addEventListener("input", () => {
        saveFilters();
        renderItems();
    });

    hasFlatpacks.addEventListener("input", () => {
        saveFilters();
        renderItems();
    });

    hasItemsets.addEventListener("input", () => {
        saveFilters();
        renderItems();
    });

    renderItems();
};

window.addEventListener("DOMContentLoaded", async () => {
    await fileStore.init();
    router();
});

// Re-init lazy loader after routing
window.addEventListener("popstate", () => {
    router();
    setTimeout(initLazyImages, 0);
});

// Also listen for clicks that use data-link routing
document.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
        e.preventDefault();
        history.pushState(null, "", e.target.href);
        router();
        setTimeout(initLazyImages, 0);
    }
});

// Hook into router so your lazy images load after page render
export function afterRoute() {
    initLazyImages();

    if (typeof initItemsPage === "function") {
        initItemsPage();
    }
}

async function canReachSource(source, ctx) {
    if (!source?.rule) return true;

    let rule = source.rule;

    // Conditional house requirement
    if (
        source.tags?.includes("house") &&
        source.houseRule &&
        !fileStore.filters.allowOthersHouses
    ) {
        rule = {
            all: [
                rule,
                source.houseRule
            ]
        };
    }

    return evaluateRule(rule, ctx);
}

async function isHouseOnlyItem(item, ctx) {
    let hasAnyHouseSource = false;
    let hasReachableSource = false;
    let hasReachableNonHouseSource = false;

    // NPC drops
    if (item.sources?.drops) {
        for (const npcName of Object.keys(item.sources.drops)) {
            const npc = NPC_DATA[npcName];
            if (!npc) continue;

            const isHouse = npc.tags?.includes("house");
            if (isHouse) hasAnyHouseSource = true;

            const reachable = await canReachNpc(npcName, ctx);
            if (!reachable) continue;

            hasReachableSource = true;
            if (!isHouse) hasReachableNonHouseSource = true;
        }
    }

    // Other sources (crafting, house actions, etc)
    if (item.sources?.other) {
        for (const source of Object.values(item.sources.other)) {
            const isHouse = source.tags?.includes("house");
            if (isHouse) hasAnyHouseSource = true;

            const reachable = await canReachSource(source, ctx);
            if (!reachable) continue;

            hasReachableSource = true;
            if (!isHouse) hasReachableNonHouseSource = true;
        }
    }

    // Shops & spawns ALWAYS override house restrictions
    if (ctx.unlocked.includes(item.id) && (item.sources?.shops || item.sources?.spawns)) {
        return false;
    }

    // If there is ANY reachable non-house source → obtainable
    if (hasReachableNonHouseSource) return false;

    // If there are reachable sources, but ALL are house → house-only
    if (hasReachableSource && hasAnyHouseSource) return true;

    // Otherwise not house-only
    return false;
}