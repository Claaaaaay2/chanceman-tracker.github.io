import { QUEST_POINTS } from "../api/questPoints";
import { REQUIREMENT_CHECKS } from "../logic/requirements.js";
import { fileStore } from "../storage/fileStore.js";

const RFD_SUBQUEST_KEYS = {
    "Another Cook's Quest": "canCompleteRFDAnotherCooksQuest",
    "Evil Dave": "canCompleteRFDFreeingEvilDave",
    "King Awowogei": "canCompleteRFDFreeingKingAwowogei",
    "Lumbridge Guide": "canCompleteRFDFreeingTheLumbridgeGuide",
    "Mountain Dwarf": "canCompleteRFDFreeingTheMountainDwarf",
    "Pirate Pete": "canCompleteRFDFreeingPiratePete",
    "Sir Amik Varze": "canCompleteRFDFreeingSirAmikVarse",
    "Skrach Uglogwee": "canCompleteRFDFreeingSkrachUglologwee",
    "Wartface & Bentnoze": "canCompleteRFDFreeingTheGoblinGenerals"
};

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
    if (!ctx?.missing?.items?.size) return [];
    const missing = [];
    for (const id of ctx.missing.items) {
        missing.push(itemsById.get(id) ?? `Item ${id}`);
    }
    return missing.sort((a, b) => a.localeCompare(b));
}

export default async function QuestsPage() {
    if (!fileStore.player) {
        return `
            <h1>Quests</h1>
            <p>Please upload your files and player name on the Home page first.</p>
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
        let missingItems = [];

        if (!isCompleted) {
            const requirementMatch = findRequirementFn(questName);
            if (!requirementMatch?.fn) {
                const expectedNames = requirementMatch?.expectedNames ?? [buildExpectedRequirementName(questName)];
                console.warn(
                    `[quests] Missing requirement check for: ${questName}. Expected one of: ${expectedNames.join(", ")}`
                );
            } else {
                const ctx = {
                    items: fileStore.items,
                    rolled: fileStore.rolled || [],
                    unlocked: fileStore.unlocked || [],
                    player: fileStore.player,
                    filters: fileStore.filters,
                    missing: { items: new Set() }
                };

                try {
                    isDoable = await requirementMatch.fn(ctx);
                } catch (err) {
                    console.warn(`[quests] Failed requirement check for: ${questName}`, err);
                }

                if (!isDoable) {
                    missingItems = getMissingItems(ctx, itemsById);
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
        }

        const missingHtml = !isCompleted && !isDoable
            ? `<div class="quest-missing">${
                missingItems.length
                    ? `Missing items: ${missingItems.join(", ")}.`
                    : "Missing requirements."
            }</div>`
            : "";

        questStates.push({
            questName,
            isCompleted,
            isDoable,
            missingItems,
            statusClass,
            statusLabel
        });
    }

    questStates.sort((a, b) => {
        const aPriority = a.isDoable && !a.isCompleted ? 0 : 1;
        const bPriority = b.isDoable && !b.isCompleted ? 0 : 1;
        if (aPriority !== bPriority) return aPriority - bPriority;
        return a.questName.localeCompare(b.questName);
    });

    const rows = questStates.map((quest) => {
        const missingHtml = !quest.isCompleted && !quest.isDoable
            ? `<div class="quest-missing">${
                quest.missingItems.length
                    ? `Missing items: ${quest.missingItems.join(", ")}.`
                    : "Missing requirements."
            }</div>`
            : "";

        return `
            <div class="quest-row ${quest.statusClass}" data-completed="${quest.isCompleted ? "true" : "false"}">
                <div class="quest-name">${quest.questName}</div>
                <div class="quest-status">${quest.statusLabel}</div>
                ${missingHtml}
            </div>
        `;
    });

    return `
        <h1>Quests</h1>
        <label class="quest-filter">
            <input type="checkbox" id="hideCompletedQuests" ${fileStore.filters?.hideCompletedQuests ? "checked" : ""}>
            Hide completed quests
        </label>
        <div class="quest-list" id="questList">
            ${rows.join("")}
        </div>
    `;
}

function applyQuestFilters(container) {
    const hideCompleted = fileStore.filters?.hideCompletedQuests;
    const rows = container.querySelectorAll(".quest-row");
    for (const row of rows) {
        const isCompleted = row.dataset.completed === "true";
        row.style.display = hideCompleted && isCompleted ? "none" : "";
    }
}

document.addEventListener("change", async (e) => {
    if (e.target.id !== "hideCompletedQuests") return;
    const nextFilters = {
        ...fileStore.filters,
        hideCompletedQuests: e.target.checked
    };
    await fileStore.setFilters(nextFilters);
    const list = document.getElementById("questList");
    if (list) {
        applyQuestFilters(list);
    }
});

window.initQuestsPage = function () {
    const list = document.getElementById("questList");
    if (list) {
        applyQuestFilters(list);
    }
};
