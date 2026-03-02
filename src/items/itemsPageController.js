import { initLazyImages } from "../app/lazyImages.js";
import { canReachNpc, evaluateRule } from "../logic/itemAvailability.js";
import { getBoostedRequirementLabel } from "../logic/skillBoosts.js";
import { getHighlightClasses, isItemSourcesChanged, markNewItems, markSourceSignature } from "../logic/highlightState.js";
import { areNpcSkillsMet, getNpcEffectiveLevels, isDropSlayerLocked, isItemHiddenByTag, isNpcBlockedByFilters, isNpcObtainable, isRuleObtainable, isSourceHiddenByFilters } from "../logic/itemVisibility.js";
import { NPC_DATA } from "../logic/npcData.js";
import { has } from "../logic/requirements.js";
import { getObtainabilityRank } from "../logic/sortHelpers.js";
import { capitalizeFirstLetter, parseDropRate } from "../logic/utils.js";
import { fileStore } from "../storage/fileStore.js";
import { loadFromDB, saveToDB } from "../storage/fileStoreHelpers.js";
import { initFiltersOverrides } from "../styles/filtersOverrides.js";
import { getRankedItemsCache, invalidateLogicCaches, setRankedItemsCache } from "./logicCache.js";
import { initNpcFilterUI } from "./npcFilterUI.js";


const ITEM_SECTION_TITLES = {
    1: "Buyable shop Items",
    2: "Pickupable spawns",
    3: "Easy Rolls",
    4: "Other Sources",
    5: "Skill Requirements Met",
    6: "Other Drops",
    7: "Sources for which you do not have the level yet",
    8: "Unobtainable Items"
};

const BUTTERFLY_NET_ID = 10010;
const GOURMET_IMPLING_JAR_ID = 11242;
const EARTH_IMPLING_JAR_ID = 11244;
const ESSENCE_IMPLING_JAR_ID = 11246;
const IMPLING_JAR_LEVEL_DOWNGRADES = new Map([
    [27, 17],
    [32, 22],
    [38, 28],
    [46, 36],
    [52, 42],
    [60, 50],
    [68, 58],
    [75, 65],
    [84, 74],
    [90, 80],
    [93, 83],
    [99, 89],
]);

const NPC_META = new Map(
    Object.entries(NPC_DATA).map(([npcName, npc]) => {
        const tags = new Set(npc?.tags || []);
        return [
            npcName,
            {
                tags,
                isClue: tags.has("clue"),
                isHouse: tags.has("house"),
                isSuperior: tags.has("superior"),
                isBoss: tags.has("boss"),
                isRaid: tags.has("raid"),
                isLMS: tags.has("LMS"),
                isHunterRumour: tags.has("hunterRumour"),
                isJon: tags.has("jon"),
                isNotForIron: tags.has("notForIronmen"),
                skills: npc?.skill || [],
                levels: npc?.level || []
            }
        ];
    })
);

function isItemProfilingEnabled() {
    return typeof window !== "undefined" && window.__profileItems === true;
}

async function computeAllRanksOnce(items, ctx) {
    const rankedItemsCache = getRankedItemsCache();
    if (rankedItemsCache) return rankedItemsCache;

    const profileItems = isItemProfilingEnabled();
    const ranksStart = profileItems ? performance.now() : 0;

    ctx.npcObtainableCache ??= new Map();
    const npcNames = new Set();
    for (const item of items) {
        const drops = item.sources?.drops;
        if (!drops) continue;
        for (const npcName of Object.keys(drops)) {
            if (!ctx.npcObtainableCache.has(npcName)) {
                npcNames.add(npcName);
            }
        }
    }

    if (npcNames.size) {
        await Promise.all(
            [...npcNames].map((npcName) => isNpcObtainable(npcName, ctx))
        );
    }

    const nextRankedItemsCache = await Promise.all(
        items.map(async item => {
            let bestDropRate = 0;

            if (item.sources?.drops) {
                for (const [npcName, drops] of Object.entries(item.sources.drops)) {
                    if (ctx.filters?.isSlayerLocked && isDropSlayerLocked(item, npcName, drops)) continue;

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

    if (profileItems) {
        const ranksElapsed = performance.now() - ranksStart;
        console.log(`[Items] computeAllRanksOnce: ${ranksElapsed.toFixed(1)}ms`);
    }

    setRankedItemsCache(nextRankedItemsCache);
    return nextRankedItemsCache;
}



function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

export async function initItemsPage() {
    await fileStore.ensureItemsLoaded();

    const elements = {
        searchInput: document.getElementById("itemSearch"),
        hunterRumoursCompleted: document.getElementById("hunterRumoursCompleted"),
        filterToggle: document.getElementById("filter-overrides-toggle"),
        importButton: document.getElementById("import-item-filters"),
        importInput: document.getElementById("import-item-filters-input"),
        itemsSectionSummary: document.getElementById("itemsSectionSummary"),
        connectFilesBtn: document.getElementById("connectFilesBtn"),
        refreshFilesBtn: document.getElementById("refreshFilesBtn"),
        npcFilterToggle: document.getElementById("npcFilterToggle"),
        npcFilterSearch: document.getElementById("npcFilterSearch"),
        npcFilterAll: document.getElementById("npcFilterAll"),
        npcFilterNone: document.getElementById("npcFilterNone"),
        npcFilterApply: document.getElementById("npcFilterApply"),
        npcFilterList: document.getElementById("npcFilterList"),
        loading: document.getElementById("itemsLoading"),
        f2pSourcelessRow: document.getElementById("hideSourcelessItemsRow"),
        grid: document.getElementById("itemGrid")
    };
    let currentItemsById = new Map();
    let currentRolledSet = new Set();
    let tooltipCache = new Map();

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
        { id: "hideSourcelessItems", key: "hideSourcelessItems", defaultValue: false },
        { id: "hasEasyCasCompleted", key: "hasEasyCasCompleted", defaultValue: false, invalidate: true },
        { id: "countSkillBoosts", key: "countSkillBoosts", defaultValue: false, invalidate: true },
        { id: "highlightChanges", key: "highlightChanges", defaultValue: false },
        { id: "overrideWoodcutting", key: "overrideWoodcutting", defaultValue: false, invalidate: true },
        { id: "overrideMining", key: "overrideMining", defaultValue: false, invalidate: true },
        { id: "overrideFishing", key: "overrideFishing", defaultValue: false, invalidate: true },
        { id: "overrideCooking", key: "overrideCooking", defaultValue: false, invalidate: true },
        { id: "overrideFarming", key: "overrideFarming", defaultValue: false, invalidate: true },
        { id: "overrideFletching", key: "overrideFletching", defaultValue: false, invalidate: true },
        { id: "overrideCrafting", key: "overrideCrafting", defaultValue: false, invalidate: true },
        { id: "overrideConstruction", key: "overrideConstruction", defaultValue: false, invalidate: true },
        { id: "overrideSmithing", key: "overrideSmithing", defaultValue: false, invalidate: true },
        { id: "showSectionCounts", key: "showSectionCounts", defaultValue: false }
    ];

    const checkboxElements = {};
    for (const config of checkboxConfigs) {
        checkboxElements[config.key] = document.getElementById(config.id);
    }

    const missingElement = !elements.searchInput || !elements.hunterRumoursCompleted || !elements.grid || !elements.loading
        || !elements.importButton || !elements.importInput
        || !elements.f2pSourcelessRow
        || !elements.itemsSectionSummary
        || !elements.connectFilesBtn || !elements.refreshFilesBtn
        || checkboxConfigs.some((config) => !checkboxElements[config.key]);
    if (missingElement) {
        if (window.location.pathname === "/items") {
            setTimeout(initItemsPage, 0);
        }
        return;
    }

    function applyFiltersToUI(filters) {
        elements.searchInput.value = filters.search ?? "";
        elements.hunterRumoursCompleted.value = filters.hunterRumoursCompleted ?? 0;
        for (const config of checkboxConfigs) {
            checkboxElements[config.key].checked = filters[config.key] ?? config.defaultValue;
        }
        updateF2pDependentFilters(filters);
    }

    const f = fileStore.filters;
    applyFiltersToUI(f);
    initNpcFilterUI(renderItems);
    bindFileRefreshUI();

    async function readHandleJson(handle) {
        if (!handle) return null;
        if (handle.queryPermission) {
            const permission = await handle.queryPermission({ mode: "read" });
            if (permission !== "granted") {
                const requested = await handle.requestPermission({ mode: "read" });
                if (requested !== "granted") {
                    throw new Error("File permission not granted.");
                }
            }
        }
        const file = await handle.getFile();
        return JSON.parse(await file.text());
    }

    async function loadStoredHandles() {
        const rolledHandle = await loadFromDB("fileHandle:rolled");
        const obtainedHandle = await loadFromDB("fileHandle:obtained");
        return { rolledHandle, obtainedHandle };
    }

    async function storeHandles(rolledHandle, obtainedHandle) {
        await saveToDB("fileHandle:rolled", rolledHandle);
        await saveToDB("fileHandle:obtained", obtainedHandle);
    }

    function pickHandlesFromSelection(handles) {
        const byName = (keyword) => handles.find((handle) => handle.name.toLowerCase().includes(keyword));
        const rolledHandle = byName("rolled");
        const obtainedHandle = byName("obtained");
        return { rolledHandle, obtainedHandle };
    }

    async function connectFileHandles() {
        if (!window.showOpenFilePicker) {
            alert("Your browser does not support connecting files. Please use the Upload or Reupload page.");
            return;
        }
        const handles = await window.showOpenFilePicker({
            multiple: true,
            types: [
                {
                    description: "Chanceman JSON",
                    accept: { "application/json": [".json"] }
                }
            ]
        });
        const { rolledHandle, obtainedHandle } = pickHandlesFromSelection(handles);
        if (!rolledHandle || !obtainedHandle) {
            alert("Please select both chanceman_rolled.json and chanceman_obtained.json.");
            return;
        }
        await storeHandles(rolledHandle, obtainedHandle);
        await refreshFilesFromHandles({ rolledHandle, obtainedHandle });
    }

    async function refreshFilesFromHandles(loadedHandles) {
        const { rolledHandle, obtainedHandle } = loadedHandles || await loadStoredHandles();
        if (!rolledHandle || !obtainedHandle) {
            alert("No connected files found. Click \"Connect files\" first.");
            return;
        }
        const rolled = await readHandleJson(rolledHandle);
        const obtained = await readHandleJson(obtainedHandle);
        await fileStore.setRolled(rolled);
        await fileStore.setObtained(obtained);
        invalidateLogicCaches(fileStore);
        renderItems();
    }


    function bindFileRefreshUI() {
        if (!window.showOpenFilePicker) {
            elements.connectFilesBtn.hidden = true;
            elements.refreshFilesBtn.hidden = true;
            return;
        }
        elements.connectFilesBtn.addEventListener("click", async () => {
            try {
                setInputsDisabled(true);
                await connectFileHandles();
            } catch (err) {
                console.error(err);
                alert(err.message || "Failed to connect files.");
            } finally {
                setInputsDisabled(false);
            }
        });

        elements.refreshFilesBtn.addEventListener("click", async () => {
            try {
                setInputsDisabled(true);
                await refreshFilesFromHandles();
            } catch (err) {
                console.error(err);
                alert(err.message || "Failed to refresh files.");
            } finally {
                setInputsDisabled(false);
            }
        });
    }

    function updateF2pDependentFilters(filters) {
        if (!elements.f2pSourcelessRow) return;
        elements.f2pSourcelessRow.hidden = !filters?.isFreeToPlay;
    }

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
        elements.connectFilesBtn.disabled = disabled;
        elements.refreshFilesBtn.disabled = disabled;
        elements.npcFilterToggle.disabled = disabled;
        elements.npcFilterSearch.disabled = disabled;
        elements.npcFilterAll.disabled = disabled;
        elements.npcFilterNone.disabled = disabled;
        elements.npcFilterApply.disabled = disabled;
        const npcCheckboxes = elements.npcFilterList.querySelectorAll("input[type=\"checkbox\"][data-npc]");
        for (const checkbox of npcCheckboxes) {
            checkbox.disabled = disabled;
        }
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

    function bindSectionSummaryNavigation() {
        if (!elements.itemsSectionSummary || elements.itemsSectionSummary.dataset.navBound === "true") return;
        elements.itemsSectionSummary.dataset.navBound = "true";

        elements.itemsSectionSummary.addEventListener("click", (event) => {
            const link = event.target.closest("a[href^=\"#items-section-\"]");
            if (!link) return;

            event.preventDefault();
            const targetId = link.getAttribute("href")?.slice(1);
            if (!targetId) return;

            const target = document.getElementById(targetId);
            if (!target) return;

            const nextUrl = `${window.location.pathname}${window.location.search}#${targetId}`;
            history.replaceState(history.state ?? {}, "", nextUrl);
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
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

    function hasAnyItemSource(item, meta) {
        if (meta?.hasAnySource !== undefined) return meta.hasAnySource;
        const sources = item?.sources;
        if (!sources || typeof sources !== "object") return false;
        const hasEntries = (value) => value && typeof value === "object" && Object.keys(value).length > 0;
        return hasEntries(sources.drops)
            || hasEntries(sources.shops)
            || hasEntries(sources.spawns)
            || hasEntries(sources.other);
    }

    function getLevelIgnoredCtx(ctx) {
        return {
            ...ctx,
            ignoreSkillLevels: true,
            suppressMissing: true,
            ruleEvalKey: `${ctx.ruleEvalKey || "base"}:ignoreLevels`,
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

    function addSkillMin(skills, skill, level) {
        const label = normalizeSkillLabel(skill);
        if (!label) return;
        if (level === undefined || level === null || Number.isNaN(level)) {
            if (!skills.has(label)) {
                skills.set(label, null);
            }
            return;
        }
        const existing = skills.get(label);
        if (existing === null || existing === undefined || level < existing) {
            skills.set(label, level);
        }
    }

    function hasMagicButterflyNetRequirement(ctx) {
        const hunterLevel = ctx?.player?.levels?.Hunter;
        if (typeof hunterLevel !== "number" || hunterLevel < 17) return false;
        return has(ctx, GOURMET_IMPLING_JAR_ID)
            && has(ctx, EARTH_IMPLING_JAR_ID)
            && has(ctx, ESSENCE_IMPLING_JAR_ID);
    }

    function adjustImplingJarRuleLevelsForSkills(rule, ctx) {
        if (!rule?.all || !ctx || !(has(ctx, BUTTERFLY_NET_ID) || hasMagicButterflyNetRequirement(ctx))) return null;

        let hasImplingJar = false;
        let hunterRuleIndex = -1;
        let hunterLevel = null;

        for (let i = 0; i < rule.all.length; i++) {
            const sub = rule.all[i];
            if (sub?.has === 11260) hasImplingJar = true;
            if (sub?.skill && sub?.level !== undefined) {
                const skillName = capitalizeFirstLetter(sub.skill);
                if (skillName === "Hunter") {
                    hunterRuleIndex = i;
                    hunterLevel = sub.level;
                }
            }
        }

        if (!hasImplingJar || hunterRuleIndex < 0) return null;
        const loweredLevel = IMPLING_JAR_LEVEL_DOWNGRADES.get(hunterLevel);
        if (!loweredLevel) return null;

        const adjusted = {
            ...rule,
            all: [...rule.all],
        };
        adjusted.all[hunterRuleIndex] = {
            ...rule.all[hunterRuleIndex],
            level: loweredLevel,
        };
        return adjusted;
    }

    function collectSkillsFromRule(rule, skills, includeLevels, ctx) {
        if (!rule) return;
        if (typeof rule === "string") return;
        if (Array.isArray(rule)) {
            for (const sub of rule) {
                collectSkillsFromRule(sub, skills, includeLevels, ctx);
            }
            return;
        }
        if (typeof rule !== "object") return;

        const adjustedRule = adjustImplingJarRuleLevelsForSkills(rule, ctx);
        if (adjustedRule) {
            collectSkillsFromRule(adjustedRule, skills, includeLevels, ctx);
            return;
        }

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
            collectSkillsFromRule(rule.any, skills, includeLevels, ctx);
        }

        if (rule.all) {
            collectSkillsFromRule(rule.all, skills, includeLevels, ctx);
        }
    }

    function collectSkillsFromRuleMin(rule, skills, includeLevels, ctx) {
        if (!rule) return;
        if (typeof rule === "string") return;
        if (Array.isArray(rule)) {
            for (const sub of rule) {
                collectSkillsFromRuleMin(sub, skills, includeLevels, ctx);
            }
            return;
        }
        if (typeof rule !== "object") return;

        const adjustedRule = adjustImplingJarRuleLevelsForSkills(rule, ctx);
        if (adjustedRule) {
            collectSkillsFromRuleMin(adjustedRule, skills, includeLevels, ctx);
            return;
        }

        if (rule.skill && rule.level !== undefined) {
            addSkillMin(skills, rule.skill, includeLevels ? rule.level : null);
        }

        if (Array.isArray(rule.skills)) {
            for (const req of rule.skills) {
                if (!req?.skill || req.level === undefined) continue;
                addSkillMin(skills, req.skill, includeLevels ? req.level : null);
            }
        }

        if (rule.any) {
            collectSkillsFromRuleMin(rule.any, skills, includeLevels, ctx);
        }

        if (rule.all) {
            collectSkillsFromRuleMin(rule.all, skills, includeLevels, ctx);
        }
    }

    function formatSkillRequirementLabel(skill, level, rank, ctx, includeLevels) {
        if (level === null || level === undefined || Number.isNaN(level)) {
            return skill;
        }

        const boostedLabel = getBoostedRequirementLabel(ctx, skill, level);
        if (boostedLabel) {
            return boostedLabel;
        }

        if (!includeLevels || rank === 5) {
            return skill;
        }

        return `${level} ${skill}`;
    }

    async function getItemSkillLabels(item, ctx, rank) {
        if (rank !== 5 && rank !== 6 && rank !== 7) return [];

        const skills = new Map();
        const includeLevels = rank === 7 || rank === 6 || Boolean(ctx?.filters?.countSkillBoosts);
        const addSkillForRank = rank === 7 ? addSkillMin : addSkill;
        const collectSkillsForRank = rank === 7 ? collectSkillsFromRuleMin : collectSkillsFromRule;

        if (item.sources?.drops) {
            for (const npcName of Object.keys(item.sources.drops)) {
                if (isNpcBlockedByFilters(npcName, ctx)) continue;
                if (!(await canReachNpc(npcName, ctx))) continue;

                const npc = NPC_DATA[npcName];
                if (!npc?.skill?.length) continue;

                const skillsMet = areNpcSkillsMet(npcName, ctx);
                if (rank === 5 && !skillsMet) continue;
                if (rank === 7 && skillsMet) continue;

                const levels = getNpcEffectiveLevels(npcName, ctx);
                for (let i = 0; i < npc.skill.length; i++) {
                    const skill = npc.skill[i];
                    const level = levels?.[i];
                    addSkillForRank(skills, skill, includeLevels ? level : null);
                }

                if ((rank === 5 || rank === 6) && npc?.rule) {
                    collectSkillsForRank(npc.rule, skills, false, ctx);
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
                } else if (rank === 5 || rank === 6) {
                    const obtainableNow = await evaluateRule(source.rule, ctx);
                    if (!obtainableNow) continue;
                } else {
                    continue;
                }

                if (Array.isArray(source.skill)) {
                    for (const skill of source.skill) {
                        addSkillForRank(skills, skill, includeLevels ? source.level : null);
                    }
                }

                collectSkillsForRank(source.rule, skills, includeLevels, ctx);
            }
        }

        return [...skills.entries()]
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([skill, level]) => formatSkillRequirementLabel(skill, level, rank, ctx, includeLevels));
    }

    async function getDeferredSkillLabels(item, ctx, rank) {
        if (rank !== 6) return [];
        if (!item?.sources?.other) return [];

        const levelIgnoredCtx = getLevelIgnoredCtx(ctx);
        const skills = new Map();

        for (const source of Object.values(item.sources.other)) {
            if (isSourceHiddenByFilters(source, ctx)) continue;
            if (!source?.rule) continue;

            const obtainableWithIgnoredLevels = await evaluateRule(source.rule, levelIgnoredCtx);
            if (!obtainableWithIgnoredLevels) continue;

            const obtainableNow = await evaluateRule(source.rule, ctx);
            if (obtainableNow) continue;

            if (Array.isArray(source.skill)) {
                for (const skill of source.skill) {
                    addSkill(skills, skill, source.level);
                }
            } else if (source.skill) {
                addSkill(skills, source.skill, source.level);
            }

            collectSkillsFromRule(source.rule, skills, true, ctx);
        }

        return [...skills.entries()]
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([skill, level]) => formatSkillRequirementLabel(skill, level, rank, ctx, true));
    }

    async function getObtainableSources(item, ctx, rolledSet) {
        const sources = [];

        if (item.sources?.drops) {
            for (const [npcName, drops] of Object.entries(item.sources.drops)) {
                if (ctx.filters?.isSlayerLocked && isDropSlayerLocked(item, npcName, drops)) continue;
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

        if (rolledSet?.has(item.id) && item.sources?.shops) {
            for (const [shopName, rule] of Object.entries(item.sources.shops)) {
                if (await isRuleObtainable(rule, ctx)) {
                    sources.push(`Shop: ${shopName}`);
                }
            }
        }

        if (rolledSet?.has(item.id) && item.sources?.spawns) {
            for (const [spawnName, rule] of Object.entries(item.sources.spawns)) {
                if (await isRuleObtainable(rule, ctx)) {
                    sources.push(`Spawn: ${spawnName}`);
                }
            }
        }

        return sources;
    }

    async function buildTooltipHtml(item, ctx, rolledSet) {
        const sources = await getObtainableSources(item, ctx, rolledSet);
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

    function initTooltipLoader() {
        if (!elements.grid || elements.grid.dataset.tooltipBound) return;
        elements.grid.dataset.tooltipBound = "true";

        const positionTooltip = (card) => {
            const tooltip = card.querySelector(".item-tooltip");
            if (!tooltip) return;
            tooltip.classList.remove("item-tooltip--top");
            requestAnimationFrame(() => {
                const rect = tooltip.getBoundingClientRect();
                const padding = 8;
                if (rect.bottom > window.innerHeight - padding) {
                    tooltip.classList.add("item-tooltip--top");
                }
            });
        };

        const handleTooltipTrigger = async (event) => {
            const card = event.target.closest(".item-card");
            if (!card) return;
            if (card.dataset.tooltipLoaded === "true" || card.dataset.tooltipLoading === "true") return;

            const itemId = Number(card.dataset.itemId);
            if (!itemId) return;

            const cached = tooltipCache.get(itemId);
            if (cached) {
                const tooltip = card.querySelector(".item-tooltip");
                if (tooltip) {
                    tooltip.outerHTML = cached;
                }
                positionTooltip(card);
                card.dataset.tooltipLoaded = "true";
                return;
            }

            const item = currentItemsById.get(itemId);
            if (!item) return;

            card.dataset.tooltipLoading = "true";
            try {
                const html = await buildTooltipHtml(item, fileStore, currentRolledSet);
                tooltipCache.set(itemId, html);
                const tooltip = card.querySelector(".item-tooltip");
                if (tooltip) {
                    tooltip.outerHTML = html;
                }
                positionTooltip(card);
                card.dataset.tooltipLoaded = "true";
            } finally {
                card.dataset.tooltipLoading = "false";
            }
        };

        elements.grid.addEventListener("mouseenter", handleTooltipTrigger, true);
        elements.grid.addEventListener("mouseenter", (event) => {
            const card = event.target.closest(".item-card");
            if (!card) return;
            positionTooltip(card);
        }, true);
        elements.grid.addEventListener("focusin", handleTooltipTrigger);
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
            window.dispatchEvent(new PopStateEvent("popstate"));
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
        let previousCacheRules;
        let previousRuleEvalCache;
        let previousRuleEvalKey;
        try {
        const profileItems = isItemProfilingEnabled();
        const renderStart = profileItems ? performance.now() : 0;
        previousCacheRules = fileStore.cacheRules;
        previousRuleEvalCache = fileStore.ruleEvalCache;
        previousRuleEvalKey = fileStore.ruleEvalKey;
        fileStore.cacheRules = true;
        fileStore.ruleEvalCache = new Map();
        fileStore.ruleEvalKey = "base";
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
            hideSourcelessItems,
            otherDropsSortByDroprate = true,
            highlightChanges = false,
            showSectionCounts = false
        } = getFilters();

        const items = fileStore.items || [];
        const itemMeta = fileStore.itemMeta;
        const obtainedSet = new Set(fileStore.obtained || []);
        const rolledSet = new Set(fileStore.rolled || []);
        const searchLower = String(search || "").toLowerCase();
        currentItemsById = new Map(items.map(item => [item.id, item]));
        currentRolledSet = rolledSet;
        tooltipCache = new Map();
        const ranked = await computeAllRanksOnce(items, fileStore);

        // sort async
        const filtered = [];

        const visibleItemIds = [];
        for (const entry of ranked) {
            const { item } = entry;
            const meta = itemMeta?.get(item.id);
            let sort = { ...entry.sort };

            if (isItemHiddenByTag(item)) {
                continue;
            }
            if (isFreeToPlay && hideSourcelessItems && !hasAnyItemSource(item, meta)) {
                continue;
            }
            const itemNameLower = meta?.nameLower ?? item.name.toLowerCase();
            if (!itemNameLower.includes(searchLower)) continue;
            if (hideObtained && obtainedSet.has(item.id)) continue;
            if (onlyRolled && !rolledSet.has(item.id)) continue;
            const isClueRewardOnly = meta?.isClueRewardOnly ?? item.tags?.includes("clue-reward-only");
            if (hideClue && isClueRewardOnly) continue;
            if (hideClue && await shouldHideForClueFilter(item, fileStore, rolledSet)) {
                sort.rank = 8;
            }
            if (!allowOthersHouses && await hideTag(item, fileStore, "house", rolledSet)) {
                sort.rank = 8;
            }
            if (!hasSuperiors && await hideTag(item, fileStore, "superior", rolledSet)) {
                sort.rank = 8;
            }
            if (isIronman && await isNonIronItem(item, fileStore, rolledSet)) {
                sort.rank = 8;
            }
            const hasFlatpackTag = meta?.hasFlatpack ?? item.tags?.includes("flatpack");
            if (!hasFlatpacks && hasFlatpackTag) continue;
            const hasItemsetTag = meta?.hasItemset ?? item.tags?.includes("itemset");
            if (!hasItemsets && hasItemsetTag) continue;
            if (hideBosses && await hideTag(item, fileStore, "boss", rolledSet)) {
                sort.rank = 8;
            }
            if (hideRaids && await hideTag(item, fileStore, "raid", rolledSet)) {
                sort.rank = 8;
            }
            if (isSlayerLocked && await hideSkill(item, fileStore, "Slayer", rolledSet)) {
                sort.rank = 8;
            }
            if (isHunterRumourLocked && await hideTag(item, fileStore, "hunterRumour", rolledSet)) {
                sort.rank = 8;
            }
            if (hideLMS && await hideTag(item, fileStore, "LMS", rolledSet)) {
                sort.rank = 8;
            }
            if (hideJon && await hideTag(item, fileStore, "jon", rolledSet)) {
                sort.rank = 8;
            }
            if (hideUnobtainable && sort.rank === 8) continue;

            filtered.push({ ...entry, sort });
            visibleItemIds.push(item.id);
        }

        if (highlightChanges) {
            markNewItems(visibleItemIds);
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
            const summaryParts = [];

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
                const sectionId = `items-section-${sort.rank}`;
                if (showSectionCounts) {
                    summaryParts.push(
                        `<a href="#${sectionId}">${escapeHtml(ITEM_SECTION_TITLES[sort.rank] ?? "Other Items")} (${sectionCount})</a>`
                    );
                }
                html += `
                    <h2 class="item-section-header" id="${sectionId}">
                        <span class="item-section-title">
                            ${ITEM_SECTION_TITLES[sort.rank] ?? "Other Items"}
                            <span class="item-section-count">(${sectionCount})</span>
                        </span>
                        ${sortToggle}
                    </h2>
                `;
                lastRank = sort.rank;
            }

                const isObtained = obtainedSet.has(item.id);
                const isRolled = rolledSet.has(item.id);
                const skillLabels = await getItemSkillLabels(item, fileStore, sort.rank);
                const deferredSkillLabels = await getDeferredSkillLabels(item, fileStore, sort.rank);
                const combinedSkillLabels = new Map();
                for (const label of skillLabels) {
                    combinedSkillLabels.set(label, false);
                }
                for (const label of deferredSkillLabels) {
                    combinedSkillLabels.set(label, true);
                }
                const formatLabel = (label) => {
                    if (sort.rank !== 6) return label;
                    return `or ${label}`;
                };
                const skillHtml = combinedSkillLabels.size
                    ? `
                        <div class="item-skill-tags${sort.rank === 6 ? " item-skill-tags--or" : ""}">
                            ${[...combinedSkillLabels.entries()]
                                .map(([label, isDeferred]) => `
                                <span class="item-skill-tag${isDeferred ? " item-skill-tag--warn" : ""}">${escapeHtml(formatLabel(label))}</span>
                            `).join("")}
                        </div>
                    `
                    : "";

                const tooltipHtml = `
                    <div class="item-tooltip item-tooltip-loading">
                        <div class="item-tooltip-title">Obtainable sources</div>
                        <div class="item-tooltip-empty">Hover to load</div>
                    </div>
                `;
                const highlightClass = highlightChanges ? getHighlightClasses(item.id) : "";
                html += `
                    <div class="item-card${highlightClass ? ` ${highlightClass}` : ""}" data-item-id="${item.id}" onclick="navigate('/item?id=${item.id}')">
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
            if (showSectionCounts) {
                elements.itemsSectionSummary.hidden = false;
                elements.itemsSectionSummary.innerHTML = summaryParts.join("");
                bindSectionSummaryNavigation();
            } else {
                elements.itemsSectionSummary.hidden = true;
                elements.itemsSectionSummary.innerHTML = "";
            }

        if (highlightChanges) {
            const signatureTargets = filtered.map(({ item }) => item);
            setTimeout(async () => {
                for (const item of signatureTargets) {
                    try {
                        const sources = await getObtainableSources(item, fileStore, rolledSet);
                        const signature = sources.sort((a, b) => a.localeCompare(b)).join("||");
                        markSourceSignature(item.id, signature);
                        if (isItemSourcesChanged(item.id)) {
                            const card = elements.grid.querySelector(`.item-card[data-item-id="${item.id}"]`);
                            if (card) {
                                card.classList.add("is-sources-changed");
                            }
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }
            }, 0);
        }

            const otherDropsToggle = document.getElementById("otherDropsSortByDroprate");
            if (otherDropsToggle) {
                otherDropsToggle.addEventListener("input", () => {
                    const nextFilters = readFiltersFromUI();
                    nextFilters.otherDropsSortByDroprate = otherDropsToggle.checked;
                    fileStore.setFilters(nextFilters);
                    renderItems();
                });
            }
            initTooltipLoader();
            setTimeout(() => initLazyImages(), 0);
        }
        if (profileItems) {
            const renderElapsed = performance.now() - renderStart;
            console.log(`[Items] renderItems: ${renderElapsed.toFixed(1)}ms`);
        }
        } finally {
            fileStore.cacheRules = previousCacheRules;
            fileStore.ruleEvalCache = previousRuleEvalCache;
            fileStore.ruleEvalKey = previousRuleEvalKey;
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
                window.dispatchEvent(new PopStateEvent("popstate"));
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
}

export async function initItemsRoute() {
    await initItemsPage();
    initFiltersOverrides();
}

async function shouldHideForClueFilter(item, ctx, rolledSet) {
    let hasAnyClueSource = false;
    let hasReachableNonClueSource = false;
    const meta = fileStore.itemMeta?.get(item.id);
    const dropNpcs = meta?.dropNpcs ?? (item.sources?.drops ? Object.keys(item.sources.drops) : []);
    const otherSources = meta?.otherSources ?? (item.sources?.other ? Object.values(item.sources.other) : []);

    // Check shops - only count if rolled
    if (rolledSet?.has(item.id) && item.sources?.shops) {
        hasReachableNonClueSource = true;
    }

    // Check spawns - only count if rolled
    if (rolledSet?.has(item.id) && item.sources?.spawns) {
        hasReachableNonClueSource = true;
    }

    // Check NPC drops
    if (dropNpcs.length) {
        for (const npcName of dropNpcs) {
            const npcMeta = NPC_META.get(npcName);
            const npc = NPC_DATA[npcName];
            if (!npc) continue;
            if (isNpcBlockedByFilters(npcName, ctx)) continue;

            const isClueSource = npcMeta?.isClue ?? npc.tags?.includes("clue");
            if (isClueSource) hasAnyClueSource = true;

            const reachable = await canReachNpc(npcName, ctx);
            if (!reachable) continue;

            if (!isClueSource) hasReachableNonClueSource = true;
        }
    }

    // Check other sources
    if (otherSources.length) {
        for (const source of otherSources) {
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

async function isNonIronItem(item, ctx, rolledSet) {
    let hasReachableIronSource = false;
    let hasReachableSource = false;
    let hasReachableNonIronmanSource = false;
    const meta = fileStore.itemMeta?.get(item.id);
    const dropNpcs = meta?.dropNpcs ?? (item.sources?.drops ? Object.keys(item.sources.drops) : []);
    const otherSources = meta?.otherSources ?? (item.sources?.other ? Object.values(item.sources.other) : []);

    if (dropNpcs.length) {
        for (const npcName of dropNpcs) {
            const npcMeta = NPC_META.get(npcName);
            const npc = NPC_DATA[npcName];
            if (!npc) continue;

            const reachable = await canReachNpc(npcName, ctx);
            if (!reachable) continue;

            hasReachableSource = true;

            const isNonIron = npcMeta
                ? (npcMeta.isNotForIron || npcMeta.isJon)
                : (npc.tags?.includes("notForIronmen") || npc.tags?.includes("jon"));

            if (isNonIron) {
                hasReachableNonIronmanSource = true;
            } else {
                hasReachableIronSource = true;
            }
        }
    }

    if (otherSources.length) {
        for (const source of otherSources) {
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

async function hideTag(item, ctx, tag, rolledSet) {
    let hasAnyTagSource = false;
    let hasReachableNonTagSource = false;
    const meta = fileStore.itemMeta?.get(item.id);
    const dropNpcs = meta?.dropNpcs ?? (item.sources?.drops ? Object.keys(item.sources.drops) : []);
    const otherSources = meta?.otherSources ?? (item.sources?.other ? Object.values(item.sources.other) : []);

    // NPC drops
    if (dropNpcs.length) {
        for (const npcName of dropNpcs) {
            const npcMeta = NPC_META.get(npcName);
            const npc = NPC_DATA[npcName];
            if (!npc) continue;
            if (isNpcBlockedByFilters(npcName, ctx)) continue;

            const isTag = npcMeta?.tags?.has(tag) ?? npc.tags?.includes(tag);
            if (isTag) hasAnyTagSource = true;

            const reachable = await canReachNpc(npcName, ctx);
            if (!reachable) continue;

            if (!isTag) hasReachableNonTagSource = true;
        }
    }

    // Other sources (crafting, house actions, etc)
    if (otherSources.length) {
        for (const source of otherSources) {
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

    if (rolledSet?.has(item.id) && (item.sources?.shops || item.sources?.spawns)) {
        return false;
    }

    if (hasReachableNonTagSource) return false;

    if (hasAnyTagSource) return true;

    return false;
}

async function hideSkill(item, ctx, skill, rolledSet) {
    const skillLevel = ctx.player?.levels[skill];
    let hasAnySkillSource = false;
    let hasSkillLevel = false;
    let hasReachableNonSkillSource = false;
    const meta = fileStore.itemMeta?.get(item.id);
    const dropNpcs = meta?.dropNpcs ?? (item.sources?.drops ? Object.keys(item.sources.drops) : []);
    const otherSources = meta?.otherSources ?? (item.sources?.other ? Object.values(item.sources.other) : []);

    // NPC drops
    if (dropNpcs.length) {
        for (const npcName of dropNpcs) {
            const drop = item.sources?.drops?.[npcName];
            const isDropTagged = isDropSlayerLocked(item, npcName, drop);
            const npcMeta = NPC_META.get(npcName);
            const npc = NPC_DATA[npcName];
            if (!npc) {
                if (isDropTagged) {
                    hasAnySkillSource = true;
                } else {
                    hasReachableNonSkillSource = true;
                }
                continue;
            }
            if (isNpcBlockedByFilters(npcName, ctx)) continue;

            const isSlayerLockTag = skill === "Slayer"
                && (isDropTagged
                    || npcMeta?.tags?.has("slayer-task-only") || npcMeta?.isSuperior
                    || npc.tags?.includes("slayer-task-only") || npc.tags?.includes("superior"));
            const skills = npcMeta?.skills ?? npc.skill;
            const levels = getNpcEffectiveLevels(npcName, ctx);
            const needsSkill = skills?.includes(skill) || isSlayerLockTag;
            if (needsSkill) hasAnySkillSource = true;
            if (levels?.length && skillLevel >= levels[0]) hasSkillLevel = true;

            const reachable = await canReachNpc(npcName, ctx);
            if (!reachable) continue;

            if (!needsSkill) hasReachableNonSkillSource = true;
        }
    }

    // Other sources (crafting, house actions, etc)
    if (otherSources.length) {
        for (const source of otherSources) {
            if (isSourceHiddenByFilters(source, ctx)) continue;

            const isTag = source.skill?.includes(skill);
            if (isTag) hasAnySkillSource = true;

            const reachable = await canReachSource(source, ctx);
            if (!reachable) continue;

            if (!isTag) hasReachableNonSkillSource = true;
        }
    }

    if (rolledSet?.has(item.id) && (item.sources?.shops || item.sources?.spawns)) {
        return false;
    }

    if (hasReachableNonSkillSource) return false;

    if (hasAnySkillSource && !hasSkillLevel) return true;

    return false;
}

