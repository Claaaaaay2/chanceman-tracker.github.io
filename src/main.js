import { canReachNpc, evaluateRule } from "./logic/itemAvailability.js";
import { areNpcSkillsMet, isItemHiddenByTag, isNpcBlockedByFilters, isNpcObtainable, isSourceHiddenByFilters } from "./logic/itemVisibility.js";
import { capitalizeFirstLetter, parseDropRate } from "./logic/utils.js";
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
function getCurrentPageLabel() {
    const path = window.location.pathname;
    if (path === "/") return "Home";
    if (path === "/items") return "Items";
    if (path === "/npcs") return "NPC drops";
    if (path === "/item-history") return "Item history";
    if (path === "/achievement-diaries") return "Achievement diaries";
    if (path === "/clue-steps") return "Clue steps";
    if (path === "/quests") return "Quests";
    if (path === "/reupload") return "Reupload";
    if (path === "/bug") return "Report a bug";
    return "Menu";
}

function initNavMenu() {
    const header = document.querySelector(".header");
    const toggle = document.getElementById("nav-menu-toggle");
    const label = document.getElementById("nav-current-page");
    if (!header || !toggle) return;

    if (label) {
        label.textContent = getCurrentPageLabel();
    }

    header.classList.remove("is-menu-open");
    toggle.setAttribute("aria-expanded", "false");

    if (toggle.dataset.bound) return;
    toggle.dataset.bound = "true";

    toggle.addEventListener("click", () => {
        const isOpen = header.classList.toggle("is-menu-open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    header.addEventListener("click", (event) => {
        if (!event.target.closest("[data-link]")) return;
        header.classList.remove("is-menu-open");
        toggle.setAttribute("aria-expanded", "false");
    });

    document.addEventListener("click", (event) => {
        if (event.target.closest(".header")) return;
        header.classList.remove("is-menu-open");
        toggle.setAttribute("aria-expanded", "false");
    });
}


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



function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
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
        importButton: document.getElementById("import-item-filters"),
        importInput: document.getElementById("import-item-filters-input"),
        loading: document.getElementById("itemsLoading"),
        grid: document.getElementById("itemGrid")
    };

    const checkboxConfigs = [
        { id: "hideObtained", key: "hideObtained", defaultValue: true },
        { id: "onlyRolled", key: "onlyRolled", defaultValue: false },
        { id: "hideUnobtainable", key: "hideUnobtainable", defaultValue: true },
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
        { id: "overrideFarming", key: "overrideFarming", defaultValue: false, invalidate: true },
        { id: "overrideFletching", key: "overrideFletching", defaultValue: false, invalidate: true },
        { id: "overrideCrafting", key: "overrideCrafting", defaultValue: false, invalidate: true },
        { id: "overrideConstruction", key: "overrideConstruction", defaultValue: false, invalidate: true }
    ];

    const checkboxElements = {};
    for (const config of checkboxConfigs) {
        checkboxElements[config.key] = document.getElementById(config.id);
    }

    const missingElement = !elements.searchInput || !elements.hunterRumoursCompleted || !elements.grid || !elements.loading
        || !elements.importButton || !elements.importInput
        || checkboxConfigs.some((config) => !checkboxElements[config.key]);
    if (missingElement) {
        setTimeout(initItemsPage, 0);
        return;
    }

    function applyFiltersToUI(filters) {
        elements.searchInput.value = filters.search ?? "";
        elements.hunterRumoursCompleted.value = filters.hunterRumoursCompleted ?? 0;
        for (const config of checkboxConfigs) {
            checkboxElements[config.key].checked = filters[config.key] ?? config.defaultValue;
        }
    }

    const f = fileStore.filters;
    applyFiltersToUI(f);

    function readFiltersFromUI() {
        const otherDropsToggle = document.getElementById("otherDropsSortByDroprate");
        const otherDropsSortByDroprate = otherDropsToggle
            ? otherDropsToggle.checked
            : (fileStore.filters?.otherDropsSortByDroprate ?? true);
        const nextFilters = {
            ...fileStore.filters,
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
        if (elements.importButton) {
            elements.importButton.disabled = disabled;
        }
        if (elements.importInput) {
            elements.importInput.disabled = disabled;
        }
        for (const config of checkboxConfigs) {
            checkboxElements[config.key].disabled = disabled;
        }
    }

    function getOtherSourceRule(source) {
        if (!source) return null;
        let rule = source.rule;
        if (source.tags?.includes("house") && source.houseRule && !fileStore.filters.allowOthersHouses) {
            rule = {
                all: [
                    rule,
                    source.houseRule
                ]
            };
        }
        return rule;
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

    function getLevelIgnoredCtx(ctx) {
        return {
            ...ctx,
            ignoreSkillLevels: true,
            suppressMissing: true,
            missing: {
                ...(ctx?.missing ?? {}),
                suppressMissing: true,
            },
        };
    }

    function normalizeSkillLabel(skill) {
        return capitalizeFirstLetter(String(skill).trim());
    }

    function addSkill(skills, skill, level) {
        const label = normalizeSkillLabel(skill);
        if (!label) return;
        if (level === undefined || level === null || Number.isNaN(level)) {
            if (!skills.has(label)) {
                skills.set(label, null);
            }
            return;
        }
        const existing = skills.get(label);
        if (existing === null || existing === undefined || level > existing) {
            skills.set(label, level);
        }
    }

    function collectSkillsFromRule(rule, skills, includeLevels) {
        if (!rule) return;
        if (typeof rule === "string") return;
        if (Array.isArray(rule)) {
            for (const sub of rule) {
                collectSkillsFromRule(sub, skills, includeLevels);
            }
            return;
        }
        if (typeof rule !== "object") return;

        if (rule.skill && rule.level !== undefined) {
            addSkill(skills, rule.skill, includeLevels ? rule.level : null);
        }

        if (Array.isArray(rule.skills)) {
            for (const req of rule.skills) {
                if (!req?.skill || req.level === undefined) continue;
                addSkill(skills, req.skill, includeLevels ? req.level : null);
            }
        }

        if (rule.any) {
            collectSkillsFromRule(rule.any, skills, includeLevels);
        }

        if (rule.all) {
            collectSkillsFromRule(rule.all, skills, includeLevels);
        }
    }

    async function getItemSkillLabels(item, ctx, rank) {
        if (rank !== 5 && rank !== 7) return [];

        const skills = new Map();
        const includeLevels = rank === 7;

        if (item.sources?.drops) {
            for (const npcName of Object.keys(item.sources.drops)) {
                if (isNpcBlockedByFilters(npcName, ctx)) continue;
                if (!(await canReachNpc(npcName, ctx))) continue;

                const npc = NPC_DATA[npcName];
                if (!npc?.skill?.length) continue;

                const skillsMet = areNpcSkillsMet(npcName, ctx);
                if (rank === 5 && !skillsMet) continue;
                if (rank === 7 && skillsMet) continue;

                for (let i = 0; i < npc.skill.length; i++) {
                    const skill = npc.skill[i];
                    const level = npc.level?.[i];
                    addSkill(skills, skill, includeLevels ? level : null);
                }

                if (rank === 5 && npc?.rule) {
                    collectSkillsFromRule(npc.rule, skills, false);
                }
            }
        }

        if (item.sources?.other) {
            const levelIgnoredCtx = getLevelIgnoredCtx(ctx);
            for (const source of Object.values(item.sources.other)) {
                if (isSourceHiddenByFilters(source, ctx)) continue;
                if (!source?.rule) continue;

                if (rank === 7) {
                    const obtainableWithIgnoredLevels = await evaluateRule(source.rule, levelIgnoredCtx);
                    if (!obtainableWithIgnoredLevels) continue;

                    const obtainableNow = await evaluateRule(source.rule, ctx);
                    if (obtainableNow) continue;
                } else if (rank === 5) {
                    const obtainableNow = await evaluateRule(source.rule, ctx);
                    if (!obtainableNow) continue;
                } else {
                    continue;
                }

                if (Array.isArray(source.skill)) {
                    for (const skill of source.skill) {
                        addSkill(skills, skill, includeLevels ? source.level : null);
                    }
                }

                collectSkillsFromRule(source.rule, skills, includeLevels);
            }
        }

        return [...skills.entries()]
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([skill, level]) => (includeLevels && level !== null && level !== undefined)
                ? `${level} ${skill}`
                : skill);
    }

    async function getObtainableSources(item, ctx, rolled) {
        const sources = [];

        if (item.sources?.drops) {
            for (const [npcName, drops] of Object.entries(item.sources.drops)) {
                if (await isNpcObtainable(npcName, ctx)) {
                    const rateLabel = getDropRateLabel(drops);
                    sources.push(`Drop: ${npcName}${rateLabel}`);
                }
            }
        }

        if (item.sources?.other) {
            for (const [name, source] of Object.entries(item.sources.other)) {
                if (isSourceHiddenByFilters(source, ctx)) continue;
                const rule = getOtherSourceRule(source);
                if (!rule || rule === "No requirements" || await evaluateRule(rule, ctx)) {
                    sources.push(name);
                }
            }
        }

        if (rolled.includes(item.id) && item.sources?.shops) {
            for (const shopName of Object.keys(item.sources.shops)) {
                sources.push(`Shop: ${shopName}`);
            }
        }

        if (rolled.includes(item.id) && item.sources?.spawns) {
            for (const spawnName of Object.keys(item.sources.spawns)) {
                sources.push(`Spawn: ${spawnName}`);
            }
        }

        return sources;
    }

    async function buildTooltipHtml(item, ctx, rolled) {
        const sources = await getObtainableSources(item, ctx, rolled);
        if (!sources.length) {
            return `
                <div class="item-tooltip">
                    <div class="item-tooltip-title">Obtainable sources</div>
                    <div class="item-tooltip-empty">None for current filters</div>
                </div>
            `;
        }

        const list = sources
            .sort((a, b) => a.localeCompare(b))
            .map((source) => `<li>${escapeHtml(source)}</li>`)
            .join("");

        return `
            <div class="item-tooltip">
                <div class="item-tooltip-title">Obtainable sources</div>
                <ul class="item-tooltip-list">${list}</ul>
            </div>
        `;
    }

    function setLoading(isLoading) {
        elements.loading.classList.toggle("active", isLoading);
        elements.grid.style.display = isLoading ? "none" : "";
        setInputsDisabled(isLoading);
    }

    async function importFiltersFromFile(file) {
        let parsed = null;
        try {
            parsed = JSON.parse(await file.text());
        } catch (err) {
            alert("Could not parse that file. Please import a valid JSON filters file.");
            return;
        }

        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
            alert("The imported filters file must be a JSON object.");
            return;
        }

        const previousFilters = fileStore.filters || {};
        const nextFilters = { ...previousFilters, ...parsed };

        if (typeof nextFilters.hunterRumoursCompleted === "string") {
            const trimmed = nextFilters.hunterRumoursCompleted.trim();
            if (trimmed === "") {
                nextFilters.hunterRumoursCompleted = 0;
            } else {
                const parsedNumber = Number(trimmed);
                nextFilters.hunterRumoursCompleted = Number.isNaN(parsedNumber)
                    ? (previousFilters.hunterRumoursCompleted ?? 0)
                    : parsedNumber;
            }
        }

        await fileStore.setFilters(nextFilters);
        applyFiltersToUI(nextFilters);

        const f2pChanged = previousFilters.isFreeToPlay !== nextFilters.isFreeToPlay;
        const hunterChanged = (previousFilters.hunterRumoursCompleted ?? 0) != (nextFilters.hunterRumoursCompleted ?? 0);
        let shouldInvalidate = hunterChanged;

        for (const config of checkboxConfigs) {
            if (!config.invalidate) continue;
            if (previousFilters[config.key] !== nextFilters[config.key]) {
                shouldInvalidate = true;
                break;
            }
        }

        if (f2pChanged) {
            invalidateLogicCaches(fileStore);
            await router();
            return;
        }

        if (shouldInvalidate) {
            invalidateLogicCaches(fileStore);
        }

        renderItems();
    }

    async function renderItems() {
        setLoading(true);
        await new Promise(requestAnimationFrame);
        try {
        const {
            search,
            hideObtained,
            onlyRolled,
            hideUnobtainable,
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
            if (hideUnobtainable && sort.rank === 8) continue;

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
                const skillLabels = await getItemSkillLabels(item, fileStore, sort.rank);
                const skillHtml = skillLabels.length
                    ? `
                        <div class="item-skill-tags">
                            ${skillLabels.map((skill) => `<span class="item-skill-tag">${escapeHtml(skill)}</span>`).join("")}
                        </div>
                    `
                    : "";

                const tooltipHtml = await buildTooltipHtml(item, fileStore, rolled);
                html += `
                    <div class="item-card" onclick="navigate('/item?id=${item.id}')">
                        ${isObtained ? `<span class="badge obtained">Obtained</span>` : ""}
                        ${isRolled ? `<span class="badge rolled">Rolled</span>` : ""}
                        <img class="lazy-img item-image" data-src="/images/${item.image}" src="/images/placeholder.png">
                        <span class="item-card-name">${item.name}</span>
                        ${skillHtml}
                        ${tooltipHtml}
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

    elements.importButton.addEventListener("click", () => {
        elements.importInput.click();
    });

    elements.importInput.addEventListener("change", async () => {
        const file = elements.importInput.files?.[0];
        if (!file) return;
        try {
            await importFiltersFromFile(file);
        } finally {
            elements.importInput.value = "";
        }
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
    if (typeof initAchievementDiariesPage === "function") {
        initAchievementDiariesPage();
    }
    if (typeof initClueStepsPage === "function") {
        initClueStepsPage();
    }
    if (typeof initItemHistoryPage === "function") {
        initItemHistoryPage();
    }
    if (typeof initNpcsPage === "function") {
        initNpcsPage();
    }
    if (typeof initSkillUnlocksPage === "function") {
        initSkillUnlocksPage();
    }
    initNavMenu();
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
            if (isNpcBlockedByFilters(npcName, ctx)) continue;

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
            if (isSourceHiddenByFilters(source, ctx)) continue;
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

    if (item.sources?.other) {
        for (const source of Object.values(item.sources.other)) {
            const reachable = await canReachSource(source, ctx);
            if (!reachable) continue;

            hasReachableSource = true;

            const isNonIron = source.tags?.includes("notForIronmen") || source.tags?.includes("jon");
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
            if (isNpcBlockedByFilters(npcName, ctx)) continue;

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
            const isHiddenByFilters = isSourceHiddenByFilters(source, ctx);
            const isIgnoredTagSource = (tag === "LMS" && source.tags?.includes("LMS"))
                || (tag === "jon" && source.tags?.includes("jon"));

            if (isHiddenByFilters && !isIgnoredTagSource) continue;

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
            if (isNpcBlockedByFilters(npcName, ctx)) continue;

            const isSlayerLockTag = skill === "Slayer"
                && (npc.tags?.includes("slayer-task-only") || npc.tags?.includes("superior"));
            const needsSkill = npc.skill?.includes(skill) || isSlayerLockTag;
            if (needsSkill) hasAnySkillSource = true;
            if (!ctx.filters?.isSlayerLocked && skillLevel >= npc.level[0]) hasSkillLevel = true;

            const reachable = await canReachNpc(npcName, ctx);
            if (!reachable) continue;

            if (!needsSkill) hasReachableNonSkillSource = true;
        }
    }

    // Other sources (crafting, house actions, etc)
    if (item.sources?.other) {
        for (const source of Object.values(item.sources.other)) {
            if (isSourceHiddenByFilters(source, ctx)) continue;

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

