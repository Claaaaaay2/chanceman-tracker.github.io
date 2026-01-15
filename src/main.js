import { canReachNpc, evaluateRule } from "./logic/itemAvailability.js";
import { isItemHiddenByTag, isNpcObtainable } from "./logic/itemVisibility.js";
import { parseDropRate } from "./logic/utils.js";
import { NPC_DATA } from "./logic/npcData.js";
import { getObtainabilityRank } from "./logic/sortHelpers.js";
import { initBugPage } from "./pages/reportABug.js";
import { router } from "./router.js";
import { fileStore } from "./storage/fileStore.js";
import { initFiltersOverrides } from "./styles/filtersOverrides.js";
import "./styles/main.css";
import { initTheme } from "./styles/theme.js";

initTheme();
initFiltersOverrides();

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

let rankedItemsCache = null;

async function computeAllRanksOnce(items, ctx) {
    if (rankedItemsCache) return rankedItemsCache;

    rankedItemsCache = await Promise.all(
        items.map(async item => {
            let bestDropRate = 0;

            if (item.sources?.drops) {
                for (const [npcName, drops] of Object.entries(item.sources.drops)) {

                    if (!(await isNpcObtainable(npcName, ctx))) continue;

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

    const elements = {
        searchInput: document.getElementById("itemSearch"),
        hunterRumoursCompleted: document.getElementById("hunterRumoursCompleted"),
        filterToggle: document.getElementById("filter-overrides-toggle"),
        loading: document.getElementById("itemsLoading"),
        grid: document.getElementById("itemGrid")
    };

    const checkboxConfigs = [
        { id: "hideObtained", key: "hideObtained", defaultValue: true },
        { id: "onlyRolled", key: "onlyRolled", defaultValue: false },
        { id: "hideClueRewardOnly", key: "hideClue", defaultValue: true, invalidate: true },
        { id: "allowOthersHouses", key: "allowOthersHouses", defaultValue: false, invalidate: true },
        { id: "hasFlatpacks", key: "hasFlatpacks", defaultValue: true },
        { id: "hasItemsets", key: "hasItemsets", defaultValue: true },
        { id: "hasSuperiors", key: "hasSuperiors", defaultValue: false, invalidate: true },
        { id: "isIronman", key: "isIronman", defaultValue: false, invalidate: true },
        { id: "hideBosses", key: "hideBosses", defaultValue: false, invalidate: true },
        { id: "hideRaids", key: "hideRaids", defaultValue: false, invalidate: true },
        { id: "isSlayerLocked", key: "isSlayerLocked", defaultValue: false, invalidate: true },
        { id: "isHunterRumourLocked", key: "isHunterRumourLocked", defaultValue: false, invalidate: true },
        { id: "hideLMS", key: "hideLMS", defaultValue: false, invalidate: true },
        { id: "hideJon", key: "hideJon", defaultValue: false, invalidate: true },
        { id: "isFreeToPlay", key: "isFreeToPlay", defaultValue: false, invalidate: true },
        { id: "overrideWoodcutting", key: "overrideWoodcutting", defaultValue: false, invalidate: true },
        { id: "overrideMining", key: "overrideMining", defaultValue: false, invalidate: true },
        { id: "overrideFishing", key: "overrideFishing", defaultValue: false, invalidate: true },
        { id: "overrideCooking", key: "overrideCooking", defaultValue: false, invalidate: true },
        { id: "overrideFletching", key: "overrideFletching", defaultValue: false, invalidate: true },
        { id: "overrideCrafting", key: "overrideCrafting", defaultValue: false, invalidate: true },
        { id: "overrideConstruction", key: "overrideConstruction", defaultValue: false, invalidate: true }
    ];

    const checkboxElements = {};
    for (const config of checkboxConfigs) {
        checkboxElements[config.key] = document.getElementById(config.id);
    }

    const missingElement = !elements.searchInput || !elements.hunterRumoursCompleted || !elements.grid || !elements.loading
        || checkboxConfigs.some((config) => !checkboxElements[config.key]);
    if (missingElement) {
        setTimeout(initItemsPage, 0);
        return;
    }

    const f = fileStore.filters;
    elements.searchInput.value = f.search ?? "";
    elements.hunterRumoursCompleted.value = f.hunterRumoursCompleted ?? 0;
    for (const config of checkboxConfigs) {
        checkboxElements[config.key].checked = f[config.key] ?? config.defaultValue;
    }

    function readFiltersFromUI() {
        const otherDropsToggle = document.getElementById("otherDropsSortByDroprate");
        const otherDropsSortByDroprate = otherDropsToggle
            ? otherDropsToggle.checked
            : (fileStore.filters?.otherDropsSortByDroprate ?? true);
        const nextFilters = {
            search: elements.searchInput.value,
            hunterRumoursCompleted: elements.hunterRumoursCompleted.value,
            otherDropsSortByDroprate
        };
        for (const config of checkboxConfigs) {
            nextFilters[config.key] = checkboxElements[config.key].checked;
        }
        return nextFilters;
    }

    const getFilters = () => readFiltersFromUI();

    function setInputsDisabled(disabled) {
        elements.searchInput.disabled = disabled;
        elements.hunterRumoursCompleted.disabled = disabled;
        if (elements.filterToggle) {
            elements.filterToggle.disabled = disabled;
        }
        for (const config of checkboxConfigs) {
            checkboxElements[config.key].disabled = disabled;
        }
    }

    function setLoading(isLoading) {
        elements.loading.classList.toggle("active", isLoading);
        elements.grid.style.display = isLoading ? "none" : "";
        setInputsDisabled(isLoading);
    }

    async function renderItems() {
        setLoading(true);
        await new Promise(requestAnimationFrame);
        try {
        const {
            search,
            hideObtained,
            onlyRolled,
            hideClue,
            allowOthersHouses,
            hasFlatpacks,
            hasItemsets,
            hasSuperiors,
            isIronman,
            hideBosses,
            hideRaids,
            isSlayerLocked,
            isHunterRumourLocked,
            hideLMS,
            hideJon,
            isFreeToPlay,
            otherDropsSortByDroprate = true
        } = getFilters();

        const items = fileStore.items || [];
        const obtained = fileStore.obtained || [];
        const rolled = fileStore.rolled || [];
        const ranked = await computeAllRanksOnce(items, fileStore);

        // sort async
        const filtered = [];

        for (const entry of ranked) {
            const { item } = entry;
            let sort = { ...entry.sort };

            if (isItemHiddenByTag(item)) {
                continue;
            }
            if (isFreeToPlay && !item.tags?.includes("f2p")) {
                continue;
            }
            if (!item.name.toLowerCase().includes(search.toLowerCase())) continue;
            if (hideObtained && obtained.includes(item.id)) continue;
            if (onlyRolled && !rolled.includes(item.id)) continue;
            if (hideClue && item.tags?.includes("clue-reward-only")) continue;
            if (hideClue && await shouldHideForClueFilter(item, fileStore)) {
                sort.rank = 8;
            }
            if (!allowOthersHouses && await hideTag(item, fileStore, "house")) {
                sort.rank = 8;
            }
            if (!hasSuperiors && await hideTag(item, fileStore, "superior")) {
                sort.rank = 8;
            }
            if (isIronman && await isNonIronItem(item, fileStore)) {
                sort.rank = 8;
            }
            if (!hasFlatpacks && item.tags?.includes("flatpack")) continue;
            if (!hasItemsets && item.tags?.includes("itemset")) continue;
            if (hideBosses && await hideTag(item, fileStore, "boss")) {
                sort.rank = 8;
            }
            if (hideRaids && await hideTag(item, fileStore, "raid")) {
                sort.rank = 8;
            }
            if (isSlayerLocked && await hideSkill(item, fileStore, "Slayer")) {
                sort.rank = 8;
            }
            if (isHunterRumourLocked && await hideTag(item, fileStore, "hunterRumour")) {
                sort.rank = 8;
            }
            if (hideLMS && await hideTag(item, fileStore, "LMS")) {
                sort.rank = 8;
            }
            if (hideJon && await hideTag(item, fileStore, "jon")) {
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
            if (a.sort.rank === 6 && otherDropsSortByDroprate) {
                if (a.bestDropRate !== b.bestDropRate) {
                    return b.bestDropRate - a.bestDropRate;
                }
            }

            // Fallback: alphabetical
            return a.sort.name.localeCompare(b.sort.name);
        });

        if (filtered.length === 0) {
            elements.grid.innerHTML = `
                <p class="empty-state">No drops found for current filters.</p>
            `;
        } else {
            const sectionCounts = filtered.reduce((acc, { sort }) => {
                acc[sort.rank] = (acc[sort.rank] ?? 0) + 1;
                return acc;
            }, {});
            let html = "";
            let lastRank = null;

            for (const { item, sort } of filtered) {
                if (sort.rank !== lastRank) {
                    const isOtherDrops = sort.rank === 6;
                    const sortToggle = isOtherDrops
                    ? `
                        <label class="other-drops-sort">
                            <span>Sort:</span>
                            <span class="other-drops-sort-label">A-Z</span>
                            <span class="toggle-switch">
                                <input type="checkbox" id="otherDropsSortByDroprate" ${otherDropsSortByDroprate ? "checked" : ""}>
                                <span class="toggle-slider" aria-hidden="true"></span>
                            </span>
                            <span>Droprate</span>
                        </label>
                    `
                    : "";
                const sectionCount = sectionCounts[sort.rank] ?? 0;
                html += `
                    <h2 class="item-section-header">
                        <span class="item-section-title">
                            ${ITEM_SECTION_TITLES[sort.rank] ?? "Other Items"}
                            <span class="item-section-count">(${sectionCount})</span>
                        </span>
                        ${sortToggle}
                    </h2>
                `;
                lastRank = sort.rank;
            }

                const isObtained = obtained.includes(item.id);
                const isRolled = rolled.includes(item.id);

                html += `
                    <div class="item-card" onclick="navigate('/item?id=${item.id}')">
                        ${isObtained ? `<span class="badge obtained">Obtained</span>` : ""}
                        ${isRolled ? `<span class="badge rolled">Rolled</span>` : ""}
                        <img class="lazy-img item-image" data-src="/images/${item.image}" src="/images/placeholder.png">
                        ${item.name}
                    </div>
                `;
            }

            elements.grid.innerHTML = html;

            const otherDropsToggle = document.getElementById("otherDropsSortByDroprate");
            if (otherDropsToggle) {
                otherDropsToggle.addEventListener("input", () => {
                    const nextFilters = readFiltersFromUI();
                    nextFilters.otherDropsSortByDroprate = otherDropsToggle.checked;
                    fileStore.setFilters(nextFilters);
                    renderItems();
                });
            }
            setTimeout(() => initLazyImages(), 0);
        }
        } finally {
            setLoading(false);
        }
    }

    function saveFilters() {
        fileStore.setFilters(readFiltersFromUI());
    }

    elements.searchInput.addEventListener("input", () => {
        saveFilters();
        renderItems();
    });

    for (const config of checkboxConfigs) {
        const element = checkboxElements[config.key];
        if (config.key === "isFreeToPlay") {
            element.addEventListener("input", async () => {
                setLoading(true);
                saveFilters();
                invalidateLogicCaches(fileStore);
                await router();
            });
            continue;
        }

        element.addEventListener("input", () => {
            saveFilters();
            if (config.invalidate) {
                invalidateLogicCaches(fileStore);
            }
            renderItems();
        });
    }

    elements.hunterRumoursCompleted.addEventListener("change", () => {
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
    await router();
});

window.addEventListener("popstate", router);

// Allow <a data-link href="/about"> navigation
document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-link]");
    if (!link) return;

    e.preventDefault();
    history.pushState(null, "", link.href);
    router();
});




// Hook into router so your lazy images load after page render
export function afterRoute() {
    initLazyImages();

    if (typeof initItemsPage === "function") {
        initItemsPage();
        initFiltersOverrides();
    }
    if (typeof initBugPage === "function") {
        initBugPage();
    }
    if (typeof initQuestsPage === "function") {
        initQuestsPage();
    }
}

async function shouldHideForClueFilter(item, ctx) {
    let hasAnyClueSource = false;
    let hasReachableNonClueSource = false;

    // Check shops - only count if rolled
    if (ctx.rolled?.includes(item.id) && item.sources?.shops) {
        hasReachableNonClueSource = true;
    }

    // Check spawns - only count if rolled
    if (ctx.rolled?.includes(item.id) && item.sources?.spawns) {
        hasReachableNonClueSource = true;
    }

    // Check NPC drops
    if (item.sources?.drops) {
        for (const npcName of Object.keys(item.sources.drops)) {
            const npc = NPC_DATA[npcName];
            if (!npc) continue;

            const isClueSource = npc.tags?.includes("clue");
            if (isClueSource) hasAnyClueSource = true;

            const reachable = await canReachNpc(npcName, ctx);
            if (!reachable) continue;

            if (!isClueSource) hasReachableNonClueSource = true;
        }
    }

    // Check other sources
    if (item.sources?.other) {
        for (const source of Object.values(item.sources.other)) {
            const isClueSource = source.tags?.includes("clue");
            if (isClueSource) hasAnyClueSource = true;

            const reachable = await canReachSource(source, ctx);
            if (!reachable) continue;

            if (!isClueSource) hasReachableNonClueSource = true;
        }
    }

    // If there are reachable non-clue sources, don't hide
    if (hasReachableNonClueSource) return false;

    // If all sources are clue-related (or unreachable), hide it
    if (hasAnyClueSource) return true;

    return false;
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

    if (ctx.rolled.includes(item.id) && (item.sources?.shops || item.sources?.spawns)) {
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

    if (ctx.rolled.includes(item.id) && (item.sources?.shops || item.sources?.spawns)) {
        return false;
    }

    if (hasReachableNonSkillSource) return false;

    if (hasAnySkillSource && !hasSkillLevel) return true;

    return false;
}

