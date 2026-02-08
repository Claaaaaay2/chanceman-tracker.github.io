import { REQUIREMENT_CHECKS, canTrainSkill } from "../logic/requirements.js";
import { router } from "../router.js";
import { fileStore } from "../storage/fileStore.js";

const CLUE_TIERS = ["Beginner", "Easy", "Medium", "Hard", "Elite", "Master"];
function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function hasSkillRequirement(ctx, skill, level) {
    if (ctx?.ignoreSkillLevels) {
        return canTrainSkill(ctx, skill);
    }
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
    return parts.map((part) => `<div class="clue-missing">${escapeHtml(part)}</div>`).join("");
}

function buildRequirementContext(options = {}) {
    return {
        items: fileStore.items,
        player: fileStore.player,
        obtained: fileStore.obtained || [],
        rolled: fileStore.rolled || [],
        filters: fileStore.filters,
        ignoreSkillLevels: Boolean(options.ignoreSkillLevels),
        missing: { items: new Set() }
    };
}

function normalizeSearch(value) {
    return String(value || "").trim().toLowerCase();
}

async function loadClueData() {
    try {
        const response = await fetch("/data/clue_steps.json");
        if (!response.ok) return null;
        return await response.json();
    } catch (err) {
        return null;
    }
}

export default async function ClueStepsPage() {
    const hasPlayer = Boolean(fileStore.player);
    const clueData = await loadClueData();

    if (fileStore.items === null) {
        await fileStore.ensureItemsLoaded();
    }
    const itemsById = new Map((fileStore.items || []).map(item => [item.id, item.name]));

    const tiers = clueData?.tiers || {};
    const tierSections = [];

    for (const tier of CLUE_TIERS) {
        const steps = tiers?.[tier] || [];
        if (!steps.length) continue;

        let doableCount = 0;
        const typesInOrder = [];
        const rowsByType = new Map();

        for (const step of steps) {
            const description = step.description || step.name || "Untitled step";
            const type = step.type || "Unknown";
            let isDoable = false;
            let isTrainable = false;
            let statusClass = "clue-status-blocked";
            let statusLabel = "Incompletable";
            let missingHtml = "";

            if (hasPlayer) {
                const ctx = buildRequirementContext();
                const { met, missing } = await evaluateRequirements(step.requirements, ctx, itemsById);

                if (met) {
                    statusClass = "clue-status-ready";
                    statusLabel = "Completable";
                    isDoable = true;
                    doableCount += 1;
                } else {
                    const trainableCtx = buildRequirementContext({ ignoreSkillLevels: true });
                    const { met: trainableMet } = await evaluateRequirements(step.requirements, trainableCtx, itemsById);
                    if (trainableMet) {
                        statusClass = "clue-status-trainable";
                        statusLabel = "Train levels";
                        isTrainable = true;
                    }
                    missingHtml = renderMissing(missing);
                }
            }

            if (!hasPlayer) {
                statusLabel = "Requires player data";
            }

            if (!rowsByType.has(type)) {
                rowsByType.set(type, []);
                typesInOrder.push(type);
            }

            rowsByType.get(type).push(`
                <div class="clue-step ${statusClass}"
                    data-doable="${isDoable ? "true" : "false"}"
                    data-trainable="${isTrainable ? "true" : "false"}"
                    data-description="${escapeHtml(description).toLowerCase()}">
                    <div class="clue-step-name">${escapeHtml(description)}</div>
                    <div class="clue-step-status">${statusLabel}</div>
                    ${missingHtml}
                </div>
            `);
        }

        const totalCount = steps.length;
        const percentCompletable = totalCount ? Math.round((doableCount / totalCount) * 100) : 0;

        tierSections.push(`
            <section class="clue-tier" data-tier="${tier}">
                <h3 class="clue-tier-header">
                    <button class="clue-toggle clue-tier-toggle" type="button" aria-expanded="true">Hide</button>
                    <span>${tier}</span>
                    <span class="clue-tier-counts">
                        (${percentCompletable}% completable, ${doableCount}/${totalCount})
                    </span>
                </h3>
                <div class="clue-tier-body">
                    <div class="clue-step-list">
                        ${typesInOrder.map((type) => `
                            <section class="clue-type" data-type="${escapeHtml(type)}">
                                <h4 class="clue-type-header">${escapeHtml(type)}</h4>
                                ${rowsByType.get(type).join("")}
                            </section>
                        `).join("")}
                    </div>
                </div>
            </section>
        `);
    }

    const clueSearchValue = (fileStore.filters?.clueSearch ?? "")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;");

    const missingPlayerNote = hasPlayer
        ? ""
        : `<p class="clue-warning">Upload your player data on the Upload page to evaluate requirements.</p>`;

    return `
        <h1>Clue steps</h1>
        ${missingPlayerNote}
        <div class="clue-filters">
            <label class="clue-filter">
                <span>Search clue steps</span>
                <input type="search" id="clueSearch" value="${clueSearchValue}" placeholder="Step description">
            </label>
            <label class="clue-filter">
                <input type="checkbox" id="hideCompletableClues" ${fileStore.filters?.hideCompletableClues ? "checked" : ""}>
                Hide completable steps
            </label>
            <label class="clue-filter">
                <input type="checkbox" id="hideIncompletableClues" ${fileStore.filters?.hideIncompletableClues ? "checked" : ""}>
                Hide incompletable steps
            </label>
            <label class="clue-filter">
                <input type="checkbox" id="hasDoneEasterEvent" ${fileStore.filters?.hasDoneEasterEvent ? "checked" : ""}>
                Has done Easter event (Eastfloor spade)
            </label>
        </div>
        <div class="clue-list" id="clueList">
            ${tierSections.length ? tierSections.join("") : "<p>No clue data loaded yet.</p>"}
        </div>
    `;
}

function applyClueFilters(container) {
    const hideCompletable = fileStore.filters?.hideCompletableClues;
    const hideIncompletable = fileStore.filters?.hideIncompletableClues;
    const search = normalizeSearch(fileStore.filters?.clueSearch);

    const rows = container.querySelectorAll(".clue-step");
    for (const row of rows) {
        const isDoable = row.dataset.doable === "true";
        const isTrainable = row.dataset.trainable === "true";
        const description = row.dataset.description || "";
        const matchesSearch = !search || description.includes(search);
        const isIncompletable = !isDoable && !isTrainable;
        const shouldHide = (hideCompletable && isDoable)
            || (hideIncompletable && isIncompletable)
            || !matchesSearch;
        row.style.display = shouldHide ? "none" : "";
    }

    const types = container.querySelectorAll(".clue-type");
    for (const type of types) {
        const hasVisibleStep = Array.from(type.querySelectorAll(".clue-step"))
            .some((step) => step.style.display !== "none");
        type.style.display = hasVisibleStep ? "" : "none";
    }

    const tiers = container.querySelectorAll(".clue-tier");
    for (const tier of tiers) {
        const hasVisibleStep = Array.from(tier.querySelectorAll(".clue-step"))
            .some((step) => step.style.display !== "none");
        tier.style.display = hasVisibleStep ? "" : "none";
    }
}

async function updateClueFilters(partial) {
    const nextFilters = {
        ...fileStore.filters,
        ...partial
    };
    await fileStore.setFilters(nextFilters);
    const list = document.getElementById("clueList");
    if (list) {
        applyClueFilters(list);
    }
}

async function updateClueFiltersAndRerender(partial) {
    const nextFilters = {
        ...fileStore.filters,
        ...partial
    };
    await fileStore.setFilters(nextFilters);
    await router();
}

document.addEventListener("change", async (e) => {
    if (e.target.id === "hideCompletableClues") {
        await updateClueFilters({ hideCompletableClues: e.target.checked });
    }
    if (e.target.id === "hideIncompletableClues") {
        await updateClueFilters({ hideIncompletableClues: e.target.checked });
    }
    if (e.target.id === "hasDoneEasterEvent") {
        await updateClueFiltersAndRerender({ hasDoneEasterEvent: e.target.checked });
    }
});

document.addEventListener("input", async (e) => {
    if (e.target.id !== "clueSearch") return;
    await updateClueFilters({ clueSearch: e.target.value });
});

function setToggleState(toggle, collapsed) {
    toggle.textContent = collapsed ? "Show" : "Hide";
    toggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
}

function setTierCollapsed(tier, collapsed) {
    tier.classList.toggle("is-collapsed", collapsed);
    const toggle = tier.querySelector(".clue-tier-toggle");
    if (toggle) {
        setToggleState(toggle, collapsed);
    }
}

document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("clue-tier-toggle")) {
        const tier = e.target.closest(".clue-tier");
        if (tier) {
            setTierCollapsed(tier, !tier.classList.contains("is-collapsed"));
        }
    }
});

window.initClueStepsPage = function () {
    const list = document.getElementById("clueList");
    if (list) {
        applyClueFilters(list);
    }
};
