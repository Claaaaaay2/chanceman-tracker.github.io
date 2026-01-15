import { fileStore } from "../storage/fileStore.js";

const SKILL_OVERRIDES = {
    Woodcutting: "overrideWoodcutting",
    Mining: "overrideMining",
    Fishing: "overrideFishing",
    Cooking: "overrideCooking",
    Fletching: "overrideFletching",
    Crafting: "overrideCrafting",
    Construction: "overrideConstruction"
};

const TIER_ORDER = ["Easy", "Medium", "Hard", "Elite"];

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function hasSkillRequirement(ctx, skill, level) {
    const overrideKey = SKILL_OVERRIDES[skill];
    if (overrideKey && ctx.filters?.[overrideKey]) return true;
    const current = ctx.player?.levels?.[skill];
    return typeof current === "number" && current >= level;
}

function hasQuestRequirement(ctx, questName, requirementType) {
    const status = ctx.player?.quests?.[questName] ?? 0;
    if (requirementType === "completed") return status === 2;
    if (requirementType === "started") return status > 0;
    return false;
}

function hasItemRequirement(ctx, item) {
    if (!item?.id) return false;
    const obtained = ctx.obtained || [];
    const rolled = ctx.rolled || [];
    return obtained.includes(item.id) && rolled.includes(item.id);
}

function evaluateRequirements(requirements, ctx) {
    const missing = {
        skills: [],
        quests: [],
        items: [],
        untracked: []
    };
    let met = true;

    for (const [skill, level] of Object.entries(requirements?.skills || {})) {
        if (!hasSkillRequirement(ctx, skill, level)) {
            missing.skills.push(`${skill} ${level}`);
            met = false;
        }
    }

    for (const [questName, requirementType] of Object.entries(requirements?.quests || {})) {
        if (!hasQuestRequirement(ctx, questName, requirementType)) {
            const label = requirementType === "completed" ? "completed" : "started";
            missing.quests.push(`${questName} (${label})`);
            met = false;
        }
    }

    for (const item of requirements?.items || []) {
        if (!hasItemRequirement(ctx, item)) {
            missing.items.push(item?.name ?? `Item ${item?.id ?? "unknown"}`);
            met = false;
        }
    }

    if (requirements?.untracked?.length) {
        // TODO: Map untracked requirements into structured checks.
        missing.untracked = [...requirements.untracked];
        met = false;
    }

    return { met, missing };
}

function renderMissing(missing) {
    const parts = [];
    if (missing.skills.length) {
        parts.push(`Missing levels: ${missing.skills.join(", ")}.`);
    }
    if (missing.quests.length) {
        parts.push(`Missing quests: ${missing.quests.join(", ")}.`);
    }
    if (missing.items.length) {
        parts.push(`Missing items: ${missing.items.join(", ")}.`);
    }
    if (missing.untracked.length) {
        parts.push(`Untracked requirements: ${missing.untracked.join(", ")}.`);
    }
    return parts.map((part) => `<div class="diary-missing">${escapeHtml(part)}</div>`).join("");
}

export default async function AchievementDiariesPage() {
    if (!fileStore.player) {
        return `
            <h1>Achievement diaries</h1>
            <p>Please upload your files and player name on the Home page first.</p>
        `;
    }

    const response = await fetch("/data/achievement_diaries.json");
    const data = await response.json();
    const diaries = data?.diaries || {};

    const ctx = {
        player: fileStore.player,
        obtained: fileStore.obtained || [],
        rolled: fileStore.rolled || [],
        filters: fileStore.filters
    };

    const diarySections = Object.entries(diaries).map(([diaryName, tiers]) => {
        const tierSections = TIER_ORDER.filter((tier) => tiers?.[tier]?.length).map((tier) => {
            const tasks = tiers[tier] || [];
            let completedCount = 0;
            let readyCount = 0;
            let blockedCount = 0;

            const rows = tasks.map((task, index) => {
                const diaryState = ctx.player?.achievementDiaries?.[diaryName]?.[tier];
                const isCompleted = Boolean(diaryState?.tasks?.[index]);
                let statusClass = "diary-status-blocked";
                let statusLabel = "Not completed";
                let missingHtml = "";

                if (isCompleted) {
                    statusClass = "diary-status-complete";
                    statusLabel = "Completed";
                    completedCount += 1;
                } else {
                    const { met, missing } = evaluateRequirements(task.requirements, ctx);
                    if (met) {
                        statusClass = "diary-status-ready";
                        statusLabel = "Can complete";
                        readyCount += 1;
                    } else {
                        blockedCount += 1;
                        missingHtml = renderMissing(missing);
                    }
                }

                return `
                    <div class="diary-task ${statusClass}">
                        <div class="diary-task-name">${escapeHtml(task.name)}</div>
                        <div class="diary-task-status">${statusLabel}</div>
                        ${missingHtml}
                    </div>
                `;
            }).join("");

            return `
                <section class="diary-tier">
                    <h3 class="diary-tier-header">
                        <span>${tier}</span>
                        <span class="diary-tier-counts">
                            (${completedCount} done, ${readyCount} can complete, ${blockedCount} blocked)
                        </span>
                    </h3>
                    <div class="diary-task-list">
                        ${rows}
                    </div>
                </section>
            `;
        }).join("");

        return `
            <section class="diary-region">
                <h2>${escapeHtml(diaryName)}</h2>
                ${tierSections}
            </section>
        `;
    }).join("");

    return `
        <h1>Achievement diaries</h1>
        <div class="diary-list">
            ${diarySections || "<p>No diary data loaded yet.</p>"}
        </div>
    `;
}
