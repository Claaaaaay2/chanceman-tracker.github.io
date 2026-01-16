import { REQUIREMENT_CHECKS } from "../logic/requirements.js";
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

function resolveItemName(item, itemsById) {
    if (item?.name) return item.name;
    if (item?.id && itemsById?.has(item.id)) return itemsById.get(item.id);
    if (typeof item === "number" && itemsById?.has(item)) return itemsById.get(item);
    return item?.id ? `Item ${item.id}` : "Unknown item";
}

function normalizeItemGroup(group) {
    return (group || []).map((entry) => {
        if (typeof entry === "number") return { id: entry };
        if (typeof entry === "object") return entry;
        return { name: String(entry) };
    });
}

async function evaluateRequirements(requirements, ctx, itemsById) {
    const missing = {
        skills: [],
        quests: [],
        items: [],
        itemGroups: [],
        rules: [],
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
            missing.items.push(resolveItemName(item, itemsById));
            met = false;
        }
    }

    for (const group of requirements?.itemsAny || []) {
        const normalizedGroup = normalizeItemGroup(group);
        const hasAny = normalizedGroup.some((entry) => hasItemRequirement(ctx, entry));
        if (!hasAny) {
            const names = normalizedGroup.map((entry) => resolveItemName(entry, itemsById));
            missing.itemGroups.push(`Any of: ${names.join(" / ")}`);
            met = false;
        }
    }

    for (const ruleKey of requirements?.rulesAll || []) {
        const ruleFn = REQUIREMENT_CHECKS[ruleKey];
        if (!ruleFn) {
            missing.rules.push(`${ruleKey} (missing)`);
            met = false;
            continue;
        }
        try {
            const ok = await ruleFn(ctx);
            if (!ok) {
                missing.rules.push(ruleKey);
                met = false;
            }
        } catch (err) {
            missing.rules.push(`${ruleKey} (error)`);
            met = false;
        }
    }

    const anyRules = requirements?.rulesAny || [];
    if (anyRules.length) {
        let anyMet = false;
        const failed = [];
        for (const ruleKey of anyRules) {
            const ruleFn = REQUIREMENT_CHECKS[ruleKey];
            if (!ruleFn) {
                failed.push(`${ruleKey} (missing)`);
                continue;
            }
            try {
                if (await ruleFn(ctx)) {
                    anyMet = true;
                } else {
                    failed.push(ruleKey);
                }
            } catch (err) {
                failed.push(`${ruleKey} (error)`);
            }
        }
        if (!anyMet) {
            missing.rules.push(`Any of: ${failed.join(" / ")}`);
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
    if (missing.itemGroups.length) {
        parts.push(`Missing item options: ${missing.itemGroups.join("; ")}.`);
    }
    if (missing.rules.length) {
        parts.push(`Missing rules: ${missing.rules.join(", ")}.`);
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

    await fileStore.ensureItemsLoaded();
    const itemsById = new Map((fileStore.items || []).map(item => [item.id, item.name]));

    const response = await fetch("/data/achievement_diaries.json");
    const data = await response.json();
    const diaries = data?.diaries || {};

    const ctx = {
        items: fileStore.items,
        player: fileStore.player,
        obtained: fileStore.obtained || [],
        rolled: fileStore.rolled || [],
        filters: fileStore.filters,
        missing: { items: new Set() }
    };

    const diarySections = [];
    for (const [diaryName, tiers] of Object.entries(diaries)) {
        const tierSections = [];
        for (const tier of TIER_ORDER.filter((candidate) => tiers?.[candidate]?.length)) {
            const tasks = tiers[tier] || [];
            let completedCount = 0;
            let readyCount = 0;
            let blockedCount = 0;
            const rows = [];

            for (let index = 0; index < tasks.length; index++) {
                const task = tasks[index];
                const diaryState = ctx.player?.achievementDiaries?.[diaryName]?.[tier];
                const isCompleted = Boolean(diaryState?.tasks?.[index]);
                let isDoable = false;
                let statusClass = "diary-status-blocked";
                let statusLabel = "Not completed";
                let missingHtml = "";

                if (isCompleted) {
                    statusClass = "diary-status-complete";
                    statusLabel = "Completed";
                    completedCount += 1;
                } else {
                    const { met, missing } = await evaluateRequirements(task.requirements, ctx, itemsById);
                    if (met) {
                        statusClass = "diary-status-ready";
                        statusLabel = "Can complete";
                        isDoable = true;
                        readyCount += 1;
                    } else {
                        blockedCount += 1;
                        missingHtml = renderMissing(missing);
                    }
                }

                rows.push(`
                    <div class="diary-task ${statusClass}"
                        data-completed="${isCompleted ? "true" : "false"}"
                        data-doable="${isDoable ? "true" : "false"}">
                        <div class="diary-task-name">${escapeHtml(task.name)}</div>
                        <div class="diary-task-status">${statusLabel}</div>
                        ${missingHtml}
                    </div>
                `);
            }

            tierSections.push(`
                <section class="diary-tier">
                    <h3 class="diary-tier-header">
                        <button class="diary-toggle diary-tier-toggle" type="button" aria-expanded="true">Hide</button>
                        <span>${tier}</span>
                        <span class="diary-tier-counts">
                            (${completedCount} done, ${readyCount} can complete, ${blockedCount} blocked)
                        </span>
                    </h3>
                    <div class="diary-tier-body">
                        <div class="diary-task-list">
                            ${rows.join("")}
                        </div>
                    </div>
                </section>
            `);
        }

        diarySections.push(`
            <section class="diary-region">
                <div class="diary-region-header">
                    <button class="diary-toggle diary-region-toggle" type="button" aria-expanded="true">Hide</button>
                    <h2>${escapeHtml(diaryName)}</h2>
                </div>
                <div class="diary-region-body">
                    ${tierSections.join("")}
                </div>
            </section>
        `);
    }

    return `
        <h1>Achievement diaries</h1>
        <div class="diary-filters">
            <label class="diary-filter">
                <input type="checkbox" id="hideCompletedDiaries" ${fileStore.filters?.hideCompletedDiaries ? "checked" : ""}>
                Hide completed tasks
            </label>
            <label class="diary-filter">
                <input type="checkbox" id="hideIncompletableDiaries" ${fileStore.filters?.hideIncompletableDiaries ? "checked" : ""}>
                Hide incompletable tasks
            </label>
            <button class="diary-action" type="button" id="foldAllDiaries">Hide all</button>
            <button class="diary-action" type="button" id="unfoldAllDiaries">Show all</button>
        </div>
        <div class="diary-list" id="diaryList">
            ${diarySections.length ? diarySections.join("") : "<p>No diary data loaded yet.</p>"}
        </div>
    `;
}

function applyDiaryFilters(container) {
    const hideCompleted = fileStore.filters?.hideCompletedDiaries;
    const hideIncompletable = fileStore.filters?.hideIncompletableDiaries;
    const rows = container.querySelectorAll(".diary-task");
    for (const row of rows) {
        const isCompleted = row.dataset.completed === "true";
        const isDoable = row.dataset.doable === "true";
        const isIncompletable = !isCompleted && !isDoable;
        const shouldHide = (hideCompleted && isCompleted) || (hideIncompletable && isIncompletable);
        row.style.display = shouldHide ? "none" : "";
    }

    const tiers = container.querySelectorAll(".diary-tier");
    for (const tier of tiers) {
        const hasVisibleTask = Array.from(tier.querySelectorAll(".diary-task"))
            .some((task) => task.style.display !== "none");
        tier.style.display = hasVisibleTask ? "" : "none";
    }

    const regions = container.querySelectorAll(".diary-region");
    for (const region of regions) {
        const hasVisibleTier = Array.from(region.querySelectorAll(".diary-tier"))
            .some((tier) => tier.style.display !== "none");
        region.style.display = hasVisibleTier ? "" : "none";
    }
}

async function updateDiaryFilters(partial) {
    const nextFilters = {
        ...fileStore.filters,
        ...partial
    };
    await fileStore.setFilters(nextFilters);
    const list = document.getElementById("diaryList");
    if (list) {
        applyDiaryFilters(list);
    }
}

document.addEventListener("change", async (e) => {
    if (e.target.id === "hideCompletedDiaries") {
        await updateDiaryFilters({ hideCompletedDiaries: e.target.checked });
    }
    if (e.target.id === "hideIncompletableDiaries") {
        await updateDiaryFilters({ hideIncompletableDiaries: e.target.checked });
    }
});

function setToggleState(toggle, collapsed) {
    toggle.textContent = collapsed ? "Show" : "Hide";
    toggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
}

function setRegionCollapsed(region, collapsed) {
    region.classList.toggle("is-collapsed", collapsed);
    const toggle = region.querySelector(".diary-region-toggle");
    if (toggle) {
        setToggleState(toggle, collapsed);
    }
}

function setTierCollapsed(tier, collapsed) {
    tier.classList.toggle("is-collapsed", collapsed);
    const toggle = tier.querySelector(".diary-tier-toggle");
    if (toggle) {
        setToggleState(toggle, collapsed);
    }
}

document.addEventListener("click", (e) => {
    if (e.target.id === "foldAllDiaries") {
        document.querySelectorAll(".diary-region").forEach((region) => setRegionCollapsed(region, true));
        document.querySelectorAll(".diary-tier").forEach((tier) => setTierCollapsed(tier, true));
        return;
    }
    if (e.target.id === "unfoldAllDiaries") {
        document.querySelectorAll(".diary-region").forEach((region) => setRegionCollapsed(region, false));
        document.querySelectorAll(".diary-tier").forEach((tier) => setTierCollapsed(tier, false));
        return;
    }
    if (e.target.classList.contains("diary-region-toggle")) {
        const region = e.target.closest(".diary-region");
        if (region) {
            setRegionCollapsed(region, !region.classList.contains("is-collapsed"));
        }
    }
    if (e.target.classList.contains("diary-tier-toggle")) {
        const tier = e.target.closest(".diary-tier");
        if (tier) {
            setTierCollapsed(tier, !tier.classList.contains("is-collapsed"));
        }
    }
});

window.initAchievementDiariesPage = function () {
    const list = document.getElementById("diaryList");
    if (list) {
        applyDiaryFilters(list);
    }
};
