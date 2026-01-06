import { canReachNpc, evaluateRule } from "./logic/itemAvailability.js";
import { NPC_DATA } from "./logic/npcData.js";
import { getObtainabilityRank } from "./logic/sortHelpers.js";
import { initBugPage } from "./pages/reportABug.js";
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
    const hasSuperiors = document.getElementById("hasSuperiors");
    const isIronman = document.getElementById("isIronman");
    const hideBosses = document.getElementById("hideBosses");
    const isSlayerLocked = document.getElementById("isSlayerLocked");
    const isHunterRumourLocked = document.getElementById("isHunterRumourLocked");
    let hunterRumoursCompleted = document.getElementById("hunterRumoursCompleted");
    const hideLMS = document.getElementById("hideLMS");
    const hideJon = document.getElementById("hideJon");
    const overrideWoodcutting = document.getElementById("overrideWoodcutting");
    const overrideMining = document.getElementById("overrideMining");
    const overrideFishing = document.getElementById("overrideFishing");
    const overrideCooking = document.getElementById("overrideCooking");
    const overrideFletching = document.getElementById("overrideFletching");
    const overrideCrafting = document.getElementById("overrideCrafting");
    const overrideConstruction = document.getElementById("overrideConstruction");
    const grid = document.getElementById("itemGrid");

    if (!searchInput || !hideJon || !hideBosses || !isSlayerLocked  || !isHunterRumourLocked || !hunterRumoursCompleted || !hideLMS || !hideRolled || !onlyUnlocked || !onlyObtainable || !hideClue || !allowOthersHouses || !hasFlatpacks || !hasItemsets || !hasSuperiors || !isIronman || !overrideWoodcutting || !overrideMining || !overrideFishing || !overrideCooking || !overrideFletching || !overrideCrafting || !overrideConstruction || !grid) {
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
    hasSuperiors.checked = f.hasSuperiors ?? false;
    isIronman.checked = f.isIronman ?? false;
    hideBosses.checked = f.hideBosses ?? false;
    isSlayerLocked.checked = f.isSlayerLocked ?? false;
    isHunterRumourLocked.checked = f.isHunterRumourLocked ?? false;
    hunterRumoursCompleted.value = f.hunterRumoursCompleted ?? 0;
    hideLMS.checked = f.hideLMS ?? false;
    hideJon.checked = f.hideJon ?? false;
    overrideWoodcutting.checked = f.overrideWoodcutting ?? false;
    overrideMining.checked = f.overrideMining ?? false;
    overrideFishing.checked = f.overrideFishing ?? false;
    overrideCooking.checked = f.overrideCooking ?? false;
    overrideFletching.checked = f.overrideFletching ?? false;
    overrideCrafting.checked = f.overrideCrafting ?? false;
    overrideConstruction.checked = f.overrideConstruction ?? false;

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
        const hasSup = hasSuperiors.checked;
        const isIron = isIronman.checked;
        const hideBoss = hideBosses.checked;
        const slayLock = isSlayerLocked.checked;
        const huntRumourLock = isHunterRumourLocked.checked;
        const hideLms = hideLMS.checked;
        const hJon = hideJon.checked;

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
            if (!allowHo && await hideTag(item, fileStore, "house")) {
                sort.rank = 8;
            }
            if (!hasSup && await hideTag(item, fileStore, "superior")) {
                sort.rank = 8;
            }
            if (isIron && await isNonIronItem(item, fileStore)) {
                sort.rank = 8;
            }
            if (onlyO && (sort.rank === 7 || sort.rank === 8)) continue;
            if (!hasFl && item.tags?.includes("flatpack")) continue;
            if (!hasIt && item.tags?.includes("itemset")) continue;
            if (hideBoss && await hideTag(item, fileStore, "boss")) {
                sort.rank = 8;
            }
            if (slayLock && await hideSkill(item, fileStore, "Slayer")) {
                sort.rank = 8;
            }
            if (huntRumourLock && await hideTag(item, fileStore, "hunterRumour")) {
                sort.rank = 8;
            }
            if (hideLms && await hideTag(item, fileStore, "LMS")) {
                sort.rank = 8;
            }
            if (hJon && await hideTag(item, fileStore, "jon")) {
                sort.rank = 8;
            }

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
            hasItemsets: hasItemsets.checked,
            hasSuperiors: hasSuperiors.checked,
            isIronman: isIronman.checked,
            hideBosses: hideBosses.checked,
            isSlayerLocked: isSlayerLocked.checked,
            isHunterRumourLocked: isHunterRumourLocked.checked,
            hunterRumoursCompleted: hunterRumoursCompleted.value,
            hideLMS: hideLMS.checked,
            hideJon: hideJon.checked,
            overrideWoodcutting: overrideWoodcutting.checked,
            overrideMining: overrideMining.checked,
            overrideFishing: overrideFishing.checked,
            overrideCooking: overrideCooking.checked,
            overrideFletching: overrideFletching.checked,
            overrideCrafting: overrideCrafting.checked,
            overrideConstruction: overrideConstruction.checked
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

    hasSuperiors.addEventListener("input", () => {
        saveFilters();
        renderItems();
    });

    isIronman.addEventListener("input", () => {
        saveFilters();
        renderItems();
    });

    hideBosses.addEventListener("input", () => {
        saveFilters();
        renderItems();
    });

    isSlayerLocked.addEventListener("input", () => {
        saveFilters();
        renderItems();
    });

    isHunterRumourLocked.addEventListener("input", () => {
        saveFilters();
        invalidateLogicCaches(fileStore);
        renderItems();
    });

    hunterRumoursCompleted.addEventListener("change", () => {
        saveFilters();
        invalidateLogicCaches(fileStore);
        renderItems();
    });

    hideLMS.addEventListener("input", () => {
        saveFilters();
        renderItems();
    });

    hideJon.addEventListener("input", () => {
        saveFilters();
        renderItems();
    });

    overrideWoodcutting.addEventListener("input", () => {
        saveFilters();
        invalidateLogicCaches(fileStore);
        renderItems();
    });

    overrideMining.addEventListener("input", () => {
        saveFilters();
        invalidateLogicCaches(fileStore);
        renderItems();
    });

    overrideFishing.addEventListener("input", () => {
        saveFilters();
        invalidateLogicCaches(fileStore);
        renderItems();
    });

    overrideCooking.addEventListener("input", () => {
        saveFilters();
        invalidateLogicCaches(fileStore);
        renderItems();
    });

    overrideFletching.addEventListener("input", () => {
        saveFilters();
        invalidateLogicCaches(fileStore);
        renderItems();
    });

    overrideCrafting.addEventListener("input", () => {
        saveFilters();
        invalidateLogicCaches(fileStore);
        renderItems();
    });

    overrideConstruction.addEventListener("input", () => {
        saveFilters();
        invalidateLogicCaches(fileStore);
        renderItems();
    });

    renderItems();
};

export function invalidateLogicCaches(ctx) {
    rankedItemsCache = null;
    ctx.itemAvailability = new Map();
    ctx.npcReachCache = new Map();
}

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
    if (typeof initBugPage === "function") {
        initBugPage();
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

async function isNonIronItem(item, ctx) {
    let hasReachableIronSource = false;
    let hasReachableSource = false;
    let hasReachableNonIronmanSource = false;

    if (item.sources?.drops) {
        for (const npcName of Object.keys(item.sources.drops)) {
            const npc = NPC_DATA[npcName];
            if (!npc) continue;

            const reachable = await canReachNpc(npcName, ctx);
            if (!reachable) continue;

            hasReachableSource = true;

            const isNonIron = npc.tags?.includes("notForIronmen") || npc.tags?.includes("jon");

            if (isNonIron) {
                hasReachableNonIronmanSource = true;
            } else {
                hasReachableIronSource = true;
            }
        }
    }

    // If there is any reachable ironman-allowed source → keep it
    if (hasReachableIronSource) return false;

    // If there are reachable sources and all of them are non-iron → hide it
    if (hasReachableSource && hasReachableNonIronmanSource) return true;

    return false;
}

async function hideTag(item, ctx, tag) {
    let hasAnyTagSource = false;
    let hasReachableNonTagSource = false;

    // NPC drops
    if (item.sources?.drops) {
        for (const npcName of Object.keys(item.sources.drops)) {
            const npc = NPC_DATA[npcName];
            if (!npc) continue;

            const isTag = npc.tags?.includes(tag);
            if (isTag) hasAnyTagSource = true;

            const reachable = await canReachNpc(npcName, ctx);
            if (!reachable) continue;

            if (!isTag) hasReachableNonTagSource = true;
        }
    }

    // Other sources (crafting, house actions, etc)
    if (item.sources?.other) {
        for (const source of Object.values(item.sources.other)) {
            const isTag = source.tags?.includes(tag);
            if (isTag) hasAnyTagSource = true;

            const reachable = await canReachSource(source, ctx);
            if (!reachable) continue;

            if (!isTag) hasReachableNonTagSource = true;
        }
    }

    if (ctx.unlocked.includes(item.id) && (item.sources?.shops || item.sources?.spawns)) {
        return false;
    }

    if (hasReachableNonTagSource) return false;

    if (hasAnyTagSource) return true;

    return false;
}

async function hideSkill(item, ctx, skill) {
    const skillLevel = ctx.player?.levels[skill];
    let hasAnySkillSource = false;
    let hasSkillLevel = false;
    let hasReachableNonSkillSource = false;
    
    // NPC drops
    if (item.sources?.drops) {
        for (const npcName of Object.keys(item.sources.drops)) {
            const npc = NPC_DATA[npcName];
            if (!npc) continue;
            
            const needsSkill = npc.skill?.includes(skill);
            if (needsSkill) hasAnySkillSource = true;
            if (skillLevel >= npc.level[0]) hasSkillLevel = true;

            const reachable = await canReachNpc(npcName, ctx);
            if (!reachable) continue;

            if (!needsSkill) hasReachableNonSkillSource = true;
        }
    }

    // Other sources (crafting, house actions, etc)
    if (item.sources?.other) {
        for (const source of Object.values(item.sources.other)) {
            const isTag = source.skill?.includes(skill);
            if (isTag) hasAnySkillSource = true;

            const reachable = await canReachSource(source, ctx);
            if (!reachable) continue;

            if (!isTag) hasReachableNonSkillSource = true;
        }
    }

    if (ctx.unlocked.includes(item.id) && (item.sources?.shops || item.sources?.spawns)) {
        return false;
    }

    if (hasReachableNonSkillSource) return false;

    if (hasAnySkillSource && !hasSkillLevel) return true;

    return false;
}