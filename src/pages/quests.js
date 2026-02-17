import { QUEST_POINTS } from "../api/questPoints";
import { REQUIREMENT_CHECKS } from "../logic/requirements.js";
import { fileStore } from "../storage/fileStore.js";

const RFD_SUBQUEST_KEYS = {
    "Another Cook's Quest": "canCompleteRFDAnotherCooksQuest",
    "Culinaromancer": "canCompleteRecipeForDisasterCulinaromancer",
    "Evil Dave": "canCompleteRFDFreeingEvilDave",
    "King Awowogei": "canCompleteRFDFreeingKingAwowogei",
    "Lumbridge Guide": "canCompleteRFDFreeingTheLumbridgeGuide",
    "Mountain Dwarf": "canCompleteRFDFreeingTheMountainDwarf",
    "Pirate Pete": "canCompleteRFDFreeingPiratePete",
    "Sir Amik Varze": "canCompleteRFDFreeingSirAmikVarse",
    "Skrach Uglogwee": "canCompleteRFDFreeingSkrachUglologwee",
    "Wartface & Bentnoze": "canCompleteRFDFreeingTheGoblinGenerals"
};

const QUEST_INFO_NOTES = {
    "Demon Slayer": "An untradable Waterskin(3) can be used instead of a Bucket of water. Buy this at Ali Morrisane's."
};

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function normalizeRequirementName(value) {
    return value
        .replace(/[’']/g, "")
        .replace(/&/g, "and")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}

function buildExpectedRequirementName(value) {
    const cleaned = value
        .replace(/[’']/g, "")
        .replace(/&/g, "and")
        .split(/[^A-Za-z0-9]+/g)
        .filter(Boolean)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join("");

    return `canComplete${cleaned}`;
}

function formatRequirementName(value) {
    const withoutPrefix = value.replace(/^canComplete/, "");
    return withoutPrefix
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
        .trim();
}

const REQUIREMENT_INDEX = new Map(
    Object.entries(REQUIREMENT_CHECKS)
        .filter(([key]) => key.startsWith("canComplete"))
        .map(([key, fn]) => [
            normalizeRequirementName(key.replace(/^canComplete/, "")),
            fn
        ])
);

function findRequirementFn(questName) {
    if (questName.startsWith("Recipe for Disaster - ")) {
        const subquest = questName.replace("Recipe for Disaster - ", "");
        const key = RFD_SUBQUEST_KEYS[subquest];
        return key ? { fn: REQUIREMENT_CHECKS[key], expectedNames: [key] } : null;
    }

    const candidates = [
        questName,
        questName.split(" - ")[0],
        questName.split(":")[0]
    ];

    for (const candidate of candidates) {
        const normalized = normalizeRequirementName(candidate);
        const fn = REQUIREMENT_INDEX.get(normalized);
        if (fn) {
            return { fn, expectedNames: candidates.map(buildExpectedRequirementName) };
        }
    }

    return { fn: null, expectedNames: candidates.map(buildExpectedRequirementName) };
}

function getMissingItems(ctx, itemsById) {
    const missing = {
        skills: [],
        items: [],
        itemGroups: [],
        prereqQuests: [],
        questPointsRequired: ctx?.missing?.questPointsRequired ?? 0,
        questPointsCurrent: ctx?.missing?.questPointsCurrent
    };
    if (Array.isArray(ctx?.missing?.skills) && ctx.missing.skills.length) {
        missing.skills = [...ctx.missing.skills].sort((a, b) => a.localeCompare(b));
    }
    const itemGroupIds = new Set();
    if (Array.isArray(ctx?.missing?.itemGroups)) {
        missing.itemGroups = ctx.missing.itemGroups.map((group) => {
            if (Array.isArray(group)) {
                for (const id of group) {
                    itemGroupIds.add(id);
                }
                return group.map((id) => itemsById.get(id) ?? `Item ${id}`);
            }
            if (group?.options) {
                for (const option of group.options) {
                    if (option.length === 1) {
                        itemGroupIds.add(option[0]);
                    }
                }
                return {
                    options: group.options.map((option) =>
                        option.map((id) => itemsById.get(id) ?? `Item ${id}`)
                    )
                };
            }
            return [];
        });
    }
    if (ctx?.missing?.items?.size) {
        for (const id of ctx.missing.items) {
            if (itemGroupIds.has(id)) continue;
            missing.items.push(itemsById.get(id) ?? `Item ${id}`);
        }
        missing.items.sort((a, b) => a.localeCompare(b));
    }
    if (Array.isArray(ctx?.missing?.prereqQuests)) {
        missing.prereqQuests = [...ctx.missing.prereqQuests].sort((a, b) => a.localeCompare(b));
    }
    return missing;
}

function renderQuestMissing(missing) {
    const prereqQuests = Array.isArray(missing?.prereqQuests) ? missing.prereqQuests : [];
    const skills = Array.isArray(missing?.skills) ? missing.skills : [];
    const items = Array.isArray(missing?.items) ? missing.items : [];
    const itemGroups = Array.isArray(missing?.itemGroups) ? missing.itemGroups : [];
    const questPointsRequired = missing?.questPointsRequired ?? 0;
    const questPointsCurrent = missing?.questPointsCurrent;
    const parts = [];
    if (prereqQuests.length) {
        const questNames = prereqQuests.map(formatRequirementName);
        parts.push(`Missing prerequisite quests: ${questNames.join(", ")}.`);
    }
    if (questPointsRequired && typeof questPointsCurrent === "number") {
        const remaining = Math.max(0, questPointsRequired - questPointsCurrent);
        parts.push(`Missing quest points: ${remaining} (need ${questPointsRequired}).`);
    }
    if (skills.length) {
        parts.push(`Missing levels: ${skills.join(", ")}.`);
    }
    if (items.length) {
        parts.push(`Missing items: ${items.join(", ")}.`);
    }
    if (itemGroups.length) {
        const groupText = itemGroups
            .map((group) => {
                if (Array.isArray(group)) {
                    return `Any of: ${group.join(" / ")}`;
                }
                if (group?.options) {
                    const optionText = group.options
                        .map((option) => option.length > 1
                            ? `(${option.join(" + ")})`
                            : option[0]
                        )
                        .join(" / ");
                    return `Any of: ${optionText}`;
                }
                return "";
            })
            .filter(Boolean)
            .join("; ");
        parts.push(`Missing item options: ${groupText}.`);
    }
    if (!parts.length) {
        return `<div class="quest-missing">Missing requirements.</div>`;
    }
    return parts.map((part) => `<div class="quest-missing">${part}</div>`).join("");
}

function countMissingItems(missing) {
    if (!missing) return 0;
    const items = Array.isArray(missing.items) ? missing.items.length : 0;
    const itemGroups = Array.isArray(missing.itemGroups) ? missing.itemGroups.length : 0;
    return items + itemGroups;
}

function hasMissingPrereqQuests(missing) {
    return Array.isArray(missing?.prereqQuests) && missing.prereqQuests.length > 0;
}

function buildRequirementContext({ ignoreSkillLevels = false } = {}) {
    return {
        items: fileStore.items,
        obtained: fileStore.obtained || [],
        rolled: fileStore.rolled || [],
        player: fileStore.player,
        filters: fileStore.filters,
        ignoreSkillLevels,
        missing: {
            items: new Set(),
            itemGroups: [],
            itemGroupKeys: new Set(),
            skills: [],
            skillKeys: new Set(),
            prereqQuests: [],
            prereqQuestKeys: new Set(),
            questPointsRequired: 0,
            questPointsCurrent: fileStore.player?.questPoints ?? 0
        }
    };
}

export default async function QuestsPage() {
    if (!fileStore.player) {
        return `
            <h1>Quests</h1>
            <p>Please upload your files and player name on the Upload page first.</p>
        `;
    }

    await fileStore.ensureItemsLoaded();
    const itemsById = new Map((fileStore.items || []).map(item => [item.id, item.name]));

    const questNames = Object.keys(QUEST_POINTS).sort((a, b) => a.localeCompare(b));
    const questStates = [];

    for (const questName of questNames) {
        const questStatus = fileStore.player.quests?.[questName] ?? 0;
        const isCompleted = questStatus === 2;
        let isDoable = false;
        let isTrainable = false;
        let missingItems = { items: [], itemGroups: [] };

        if (!isCompleted) {
            const requirementMatch = findRequirementFn(questName);
            if (!requirementMatch?.fn) {
                const expectedNames = requirementMatch?.expectedNames ?? [buildExpectedRequirementName(questName)];
                console.warn(
                    `[quests] Missing requirement check for: ${questName}. Expected one of: ${expectedNames.join(", ")}`
                );
            } else {
                const ctx = buildRequirementContext();

                try {
                    isDoable = await requirementMatch.fn(ctx);
                } catch (err) {
                    console.warn(`[quests] Failed requirement check for: ${questName}`, err);
                }

                if (!isDoable) {
                    missingItems = getMissingItems(ctx, itemsById);
                    try {
                        const trainableCtx = buildRequirementContext({ ignoreSkillLevels: true });
                        isTrainable = await requirementMatch.fn(trainableCtx);
                    } catch (err) {
                        console.warn(`[quests] Failed trainable requirement check for: ${questName}`, err);
                    }
                }
            }
        }

        let statusClass = "quest-status-blocked";
        let statusLabel = "Not completed";
        if (isCompleted) {
            statusClass = "quest-status-complete";
            statusLabel = "Completed";
        } else if (isDoable) {
            statusClass = "quest-status-ready";
            statusLabel = "Can complete";
        } else if (isTrainable) {
            statusClass = "quest-status-trainable";
            statusLabel = "Train levels";
        }

        const missingHtml = !isCompleted && !isDoable
            ? renderQuestMissing(missingItems)
            : "";

        questStates.push({
            questName,
            isCompleted,
            isDoable,
            isTrainable,
            missingItems,
            statusClass,
            statusLabel
        });
    }

    const questSortByMissingItems = Boolean(fileStore.filters?.questSortByMissingItems);

    questStates.sort((a, b) => {
        if (questSortByMissingItems) {
            const aHasPrereq = hasMissingPrereqQuests(a.missingItems);
            const bHasPrereq = hasMissingPrereqQuests(b.missingItems);
            if (aHasPrereq !== bHasPrereq) {
                return aHasPrereq ? 1 : -1;
            }
            const aMissing = countMissingItems(a.missingItems);
            const bMissing = countMissingItems(b.missingItems);
            if (aMissing !== bMissing) return aMissing - bMissing;
        }
        const aPriority = a.isDoable && !a.isCompleted
            ? 0
            : (a.isTrainable && !a.isCompleted ? 1 : 2);
        const bPriority = b.isDoable && !b.isCompleted
            ? 0
            : (b.isTrainable && !b.isCompleted ? 1 : 2);
        if (aPriority !== bPriority) return aPriority - bPriority;
        return a.questName.localeCompare(b.questName);
    });

    const rows = questStates.map((quest) => {
        const missingHtml = !quest.isCompleted && !quest.isDoable
            ? renderQuestMissing(quest.missingItems)
            : "";
        const questInfo = fileStore.filters?.isFreeToPlay
            ? null
            : QUEST_INFO_NOTES[quest.questName];
        const questInfoHtml = questInfo
            ? `<span class="clue-step-info quest-info" tabindex="0" aria-label="Quest information" title="${escapeHtml(questInfo)}">i</span>`
            : "";

        return `
            <div class="quest-row ${quest.statusClass}"
                data-completed="${quest.isCompleted ? "true" : "false"}"
                data-doable="${quest.isDoable ? "true" : "false"}"
                data-trainable="${quest.isTrainable ? "true" : "false"}"
                data-name="${quest.questName.toLowerCase()}">
                <div class="quest-name">${quest.questName}${questInfoHtml}</div>
                <div class="quest-status">${quest.statusLabel}</div>
                ${missingHtml}
            </div>
        `;
    });

    const questSearchValue = (fileStore.filters?.questSearch ?? "")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;");
    const shieldOfArravCompleted = fileStore.player?.quests?.["Shield of Arrav"] === 2;
    const heroesQuestGang = fileStore.filters?.heroesQuestGang ?? "phoenix";
    const isPhoenixGang = heroesQuestGang !== "black_arm";

    return `
        <h1>Quests</h1>
        <div class="quest-filters">
            <label class="quest-filter">
                <span>Search quests</span>
                <input type="search" id="questSearch" value="${questSearchValue}" placeholder="Quest name">
            </label>
            <label class="quest-filter">
                <input type="checkbox" id="hideCompletedQuests" ${fileStore.filters?.hideCompletedQuests ? "checked" : ""}>
                Hide completed quests
            </label>
            <label class="quest-filter">
                <input type="checkbox" id="hideIncompletableQuests" ${fileStore.filters?.hideIncompletableQuests ? "checked" : ""}>
                Hide incompletable quests
            </label>
            <label class="quest-filter">
                <input type="checkbox" id="hazeelCultLocked" ${fileStore.filters?.hazeelCultLocked ? "checked" : ""}>
                Hazeel Cult locked
            </label>
            <label class="quest-filter">
                <span>Sort A-Z</span>
                <span class="toggle-switch">
                    <input type="checkbox" id="questSortToggle" ${questSortByMissingItems ? "checked" : ""} aria-label="Sort quests by least missing items">
                    <span class="toggle-slider" aria-hidden="true"></span>
                </span>
                <span>Least missing items</span>
            </label>
            ${shieldOfArravCompleted ? `
                <label class="quest-filter quest-filter-gang">
                    <span>Black arm gang</span>
                    <span class="toggle-switch">
                        <input type="checkbox" id="heroesQuestGangToggle" ${isPhoenixGang ? "checked" : ""} aria-label="Which Shield of Arrav gang?">
                        <span class="toggle-slider" aria-hidden="true"></span>
                    </span>
                    <span>Phoenix gang</span>
                </label>
            ` : ""}
        </div>
        <div class="quest-list" id="questList">
            ${rows.join("")}
        </div>
    `;
}

function applyQuestFilters(container) {
    const hideCompleted = fileStore.filters?.hideCompletedQuests;
    const hideIncompletable = fileStore.filters?.hideIncompletableQuests;
    const search = (fileStore.filters?.questSearch || "").trim().toLowerCase();
    const rows = container.querySelectorAll(".quest-row");
    for (const row of rows) {
        const isCompleted = row.dataset.completed === "true";
        const isDoable = row.dataset.doable === "true";
        const isTrainable = row.dataset.trainable === "true";
        const questName = row.dataset.name || "";
        const matchesSearch = !search || questName.includes(search);
        const isIncompletable = !isCompleted && !isDoable && !isTrainable;
        const shouldHide = (hideCompleted && isCompleted)
            || (hideIncompletable && isIncompletable)
            || !matchesSearch;
        row.style.display = shouldHide ? "none" : "";
    }
}

async function updateQuestFilters(partial, options = {}) {
    const nextFilters = {
        ...fileStore.filters,
        ...partial
    };
    await fileStore.setFilters(nextFilters);
    if (options.rerender) {
        window.dispatchEvent(new PopStateEvent("popstate"));
        return;
    }
    const list = document.getElementById("questList");
    if (list) {
        applyQuestFilters(list);
    }
}

let teardownQuestsHandlers = null;

export function init() {
    teardown();

    const list = document.getElementById("questList");
    if (list) {
        applyQuestFilters(list);
    }

    const onQuestChange = async (event) => {
        if (event.target.id === "hideCompletedQuests") {
            await updateQuestFilters({ hideCompletedQuests: event.target.checked });
        }
        if (event.target.id === "hideIncompletableQuests") {
            await updateQuestFilters({ hideIncompletableQuests: event.target.checked });
        }
        if (event.target.id === "hazeelCultLocked") {
            await updateQuestFilters({ hazeelCultLocked: event.target.checked }, { rerender: true });
        }
        if (event.target.id === "heroesQuestGangToggle") {
            await updateQuestFilters(
                { heroesQuestGang: event.target.checked ? "phoenix" : "black_arm" },
                { rerender: true }
            );
        }
        if (event.target.id === "questSortToggle") {
            await updateQuestFilters(
                { questSortByMissingItems: event.target.checked },
                { rerender: true }
            );
        }
    };

    const onQuestInput = async (event) => {
        if (event.target.id !== "questSearch") return;
        await updateQuestFilters({ questSearch: event.target.value });
    };

    document.addEventListener("change", onQuestChange);
    document.addEventListener("input", onQuestInput);

    teardownQuestsHandlers = () => {
        document.removeEventListener("change", onQuestChange);
        document.removeEventListener("input", onQuestInput);
    };
}

export function teardown() {
    if (typeof teardownQuestsHandlers === "function") {
        teardownQuestsHandlers();
    }
    teardownQuestsHandlers = null;
}
