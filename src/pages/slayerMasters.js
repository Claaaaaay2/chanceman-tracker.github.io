import { REQUIREMENT_CHECKS } from "../logic/requirements.js";
import { fileStore } from "../storage/fileStore.js";

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;");
}

function normalizeText(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function slugifyAnchor(value) {
    return String(value || "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

function computeCombatLevel(levels = {}) {
    const attack = Number(levels.Attack || 1);
    const strength = Number(levels.Strength || 1);
    const defence = Number(levels.Defence || 1);
    const hitpoints = Number(levels.Hitpoints || 10);
    const prayer = Number(levels.Prayer || 1);
    const ranged = Number(levels.Ranged || 1);
    const magic = Number(levels.Magic || 1);

    const base = 0.25 * (defence + hitpoints + Math.floor(prayer / 2));
    const melee = 0.325 * (attack + strength);
    const ranger = 0.325 * Math.floor(ranged * 1.5);
    const mage = 0.325 * Math.floor(magic * 1.5);
    return Math.floor(base + Math.max(melee, ranger, mage));
}

function getPlayerSkillLevel(skill, ctx) {
    if (skill === "Combat") {
        return computeCombatLevel(ctx.player?.levels);
    }
    return Number(ctx.player?.levels?.[skill] ?? 1);
}

function hasQuestRequirement(ctx, questName, requirementType) {
    const status = ctx.player?.quests?.[questName] ?? 0;
    if (requirementType === "completed") return status === 2;
    if (requirementType === "started") return status > 0;
    return false;
}

function hasItemByName(ctx, itemName) {
    const key = normalizeText(itemName);
    const ids = ctx.itemNameToIds.get(key) || [];
    for (const id of ids) {
        if (ctx.rolledSet.has(id) && ctx.obtainedSet.has(id)) {
            return true;
        }
    }
    return false;
}

function mergeRequirementSets(...requirementsList) {
    const merged = {
        skills: {},
        skillsAny: [],
        quests: {},
        questsAny: [],
        items: [],
        itemsAll: [],
        itemsAny: [],
        rulesAll: [],
        rulesAny: [],
        untracked: []
    };

    for (const requirements of requirementsList) {
        if (!requirements || typeof requirements !== "object") continue;

        Object.assign(merged.skills, requirements.skills || {});
        if (Array.isArray(requirements.skillsAny)) merged.skillsAny.push(...requirements.skillsAny);

        Object.assign(merged.quests, requirements.quests || {});
        if (Array.isArray(requirements.questsAny)) merged.questsAny.push(...requirements.questsAny);

        if (Array.isArray(requirements.items)) merged.items.push(...requirements.items);
        if (Array.isArray(requirements.itemsAll)) merged.itemsAll.push(...requirements.itemsAll);
        if (Array.isArray(requirements.itemsAny)) merged.itemsAny.push(...requirements.itemsAny);

        if (Array.isArray(requirements.rulesAll)) merged.rulesAll.push(...requirements.rulesAll);
        if (Array.isArray(requirements.rulesAny)) merged.rulesAny.push(...requirements.rulesAny);

        if (Array.isArray(requirements.untracked)) merged.untracked.push(...requirements.untracked);
    }

    return merged;
}

async function evaluateRequirements(requirements, ctx) {
    const missing = [];

    for (const [skill, level] of Object.entries(requirements?.skills || {})) {
        const current = getPlayerSkillLevel(skill, ctx);
        if (current < level) {
            missing.push(`${skill} ${level}`);
        }
    }

    const skillsAny = requirements?.skillsAny || [];
    if (skillsAny.length) {
        let anySkillMet = false;
        const options = [];
        for (const option of skillsAny) {
            const entries = Object.entries(option || {});
            const entryLabels = entries.map(([skill, level]) => `${skill} ${level}`);
            options.push(entryLabels.join(" + "));
            const optionMet = entries.every(([skill, level]) => getPlayerSkillLevel(skill, ctx) >= level);
            if (optionMet) {
                anySkillMet = true;
            }
        }
        if (!anySkillMet) {
            missing.push(`Any of: ${options.join(" / ")}`);
        }
    }

    for (const [questName, requirementType] of Object.entries(requirements?.quests || {})) {
        if (!hasQuestRequirement(ctx, questName, requirementType)) {
            const suffix = requirementType === "started" ? "(started)" : "(completed)";
            missing.push(`${questName} ${suffix}`);
        }
    }

    const questsAny = requirements?.questsAny || [];
    if (questsAny.length) {
        let anyQuestMet = false;
        const options = [];
        for (const option of questsAny) {
            const entries = Object.entries(option || {});
            const optionLabel = entries.map(([questName, requirementType]) => {
                const suffix = requirementType === "started" ? "(started)" : "(completed)";
                return `${questName} ${suffix}`;
            }).join(" + ");
            options.push(optionLabel);

            const optionMet = entries.every(([questName, requirementType]) =>
                hasQuestRequirement(ctx, questName, requirementType)
            );

            if (optionMet) {
                anyQuestMet = true;
            }
        }
        if (!anyQuestMet) {
            missing.push(`Any of: ${options.join(" / ")}`);
        }
    }

    const requiredItems = [
        ...(requirements?.items || []),
        ...(requirements?.itemsAll || [])
    ];

    for (const itemName of requiredItems) {
        if (!hasItemByName(ctx, itemName)) {
            missing.push(itemName);
        }
    }

    for (const itemGroup of requirements?.itemsAny || []) {
        if (!Array.isArray(itemGroup) || !itemGroup.length) continue;
        const hasAny = itemGroup.some((itemName) => hasItemByName(ctx, itemName));
        if (!hasAny) {
            missing.push(`Any of: ${itemGroup.join(" / ")}`);
        }
    }

    for (const ruleKey of requirements?.rulesAll || []) {
        const ruleFn = REQUIREMENT_CHECKS[ruleKey];
        if (!ruleFn) {
            missing.push(`${ruleKey} (rule missing)`);
            continue;
        }
        try {
            const met = await ruleFn(ctx);
            if (!met) {
                missing.push(ruleKey);
            }
        } catch (error) {
            missing.push(`${ruleKey} (rule error)`);
        }
    }

    const rulesAny = requirements?.rulesAny || [];
    if (rulesAny.length) {
        let anyRuleMet = false;
        const failedRules = [];
        for (const ruleKey of rulesAny) {
            const ruleFn = REQUIREMENT_CHECKS[ruleKey];
            if (!ruleFn) {
                failedRules.push(`${ruleKey} (rule missing)`);
                continue;
            }
            try {
                const met = await ruleFn(ctx);
                if (met) {
                    anyRuleMet = true;
                } else {
                    failedRules.push(ruleKey);
                }
            } catch (error) {
                failedRules.push(`${ruleKey} (rule error)`);
            }
        }
        if (!anyRuleMet) {
            missing.push(`Any of: ${failedRules.join(" / ")}`);
        }
    }

    if (requirements?.untracked?.length) {
        for (const requirement of requirements.untracked) {
            missing.push(`Untracked: ${requirement}`);
        }
    }

    return {
        met: missing.length === 0,
        missing
    };
}

function buildRequirementContext() {
    const items = fileStore.items || [];
    const itemNameToIds = new Map();

    for (const item of items) {
        const key = normalizeText(item?.name);
        if (!key) continue;
        if (!itemNameToIds.has(key)) {
            itemNameToIds.set(key, []);
        }
        itemNameToIds.get(key).push(item.id);
    }

    return {
        items,
        player: fileStore.player,
        obtained: fileStore.obtained || [],
        rolled: fileStore.rolled || [],
        obtainedSet: new Set(fileStore.obtained || []),
        rolledSet: new Set(fileStore.rolled || []),
        filters: fileStore.filters,
        missing: {
            items: new Set()
        },
        itemNameToIds
    };
}

function formatMissingParts(parts) {
    if (!parts.length) return "";
    return parts.join(", ");
}

function wikiUrlForMonster(monsterName) {
    const page = encodeURIComponent(String(monsterName || "").replace(/\s+/g, "_"));
    return `https://oldschool.runescape.wiki/w/${page}`;
}

function renderInfoIcon(title, label) {
    if (!title) return "";
    return `<span class="clue-step-info" tabindex="0" aria-label="${escapeHtml(label)}" title="${escapeHtml(title)}">i</span>`;
}

function getMonsterLink(monster) {
    if (monster?.customUrl) return monster.customUrl;
    if (monster?.wikiUrl) return monster.wikiUrl;
    return wikiUrlForMonster(monster?.name);
}

export default async function SlayerMastersPage() {
    if (!fileStore.player || !fileStore.obtained || !fileStore.rolled) {
        return `
            <h1>Slayer masters</h1>
            <p>Please upload your files and player name on the Upload page first.</p>
        `;
    }

    await fileStore.ensureItemsLoaded();

    const response = await fetch("/data/slayer_masters.json");
    const data = await response.json();
    const masters = Array.isArray(data?.masters) ? data.masters : [];
    const masterIdCounts = new Map();
    const masterMeta = masters.map((master) => {
        const base = slugifyAnchor(master?.name) || "slayer-master";
        const count = masterIdCounts.get(base) || 0;
        masterIdCounts.set(base, count + 1);
        const id = count ? `${base}-${count + 1}` : base;
        return { master, id };
    });
    const jumpLinks = masterMeta.map(({ master, id }) => `
        <a class="unlock-jump-link slayer-master-jump-link" href="#${escapeHtml(id)}">${escapeHtml(master.name)}</a>
    `).join("");

    const ctx = buildRequirementContext();
    const hideUnreachableSlayerMasters = fileStore.filters?.hideUnreachableSlayerMasters ?? true;

    const masterHtml = [];

    for (const { master, id } of masterMeta) {
        const masterReach = await evaluateRequirements(master.reachRequirements || {}, ctx);
        const masterAssignment = await evaluateRequirements(master.assignmentRequirements || {}, ctx);

        let assignableCount = 0;
        let reachableAssignableCount = 0;

        const monsterRows = [];

        for (const monster of master.monsters || []) {
            const assignmentReq = mergeRequirementSets(master.assignmentRequirements, monster.assignmentRequirements);
            const reachReq = mergeRequirementSets(master.reachRequirements, monster.reachRequirements);

            const assignmentStatus = await evaluateRequirements(assignmentReq, ctx);
            const reachStatus = await evaluateRequirements(reachReq, ctx);

            const isAssignable = assignmentStatus.met;
            const isReachable = reachStatus.met;

            if (isAssignable) {
                assignableCount += 1;
                if (isReachable) {
                    reachableAssignableCount += 1;
                }
            }

            let statusClass = "slayer-monster--reachable";
            let statusLabel = "Assignable and reachable";
            const missingLines = [];

            if (!isAssignable) {
                statusClass = "slayer-monster--unassignable";
                statusLabel = "Unassignable";
                missingLines.push(`To be assigned: ${formatMissingParts(assignmentStatus.missing)}.`);
                if (!isReachable) {
                    missingLines.push(`To reach: ${formatMissingParts(reachStatus.missing)}.`);
                }
            } else if (!isReachable) {
                statusClass = "slayer-monster--unreachable";
                statusLabel = "Unreachable";
                missingLines.push(`To reach: ${formatMissingParts(reachStatus.missing)}.`);
            }

            const monsterNotes = Array.isArray(monster.notes) ? monster.notes : [];
            const monsterInfo = monsterNotes.length
                ? renderInfoIcon(monsterNotes.join("\n"), `${monster.name} note`)
                : "";

            monsterRows.push(`
                <article class="slayer-monster ${statusClass}">
                    <div class="slayer-monster-header">
                        <a class="slayer-monster-link" href="${escapeHtml(getMonsterLink(monster))}" target="_blank" rel="noopener noreferrer">${escapeHtml(monster.name)}</a>
                        ${monsterInfo}
                        <span class="slayer-monster-status">${statusLabel}</span>
                    </div>
                    ${missingLines.length ? `<div class="slayer-monster-missing">${missingLines.map((line) => `<div>${escapeHtml(line)}</div>`).join("")}</div>` : ""}
                </article>
            `);
        }

        const reachPercent = assignableCount > 0
            ? ((reachableAssignableCount / assignableCount) * 100).toFixed(1)
            : "0.0";

        const masterNotes = Array.isArray(master.notes) ? master.notes : [];
        const masterInfo = masterNotes.length
            ? renderInfoIcon(masterNotes.join("\n"), `${master.name} note`)
            : "";

        const masterMissing = [];
        if (!masterReach.met) {
            masterMissing.push(`Master reach requirements: ${formatMissingParts(masterReach.missing)}.`);
        }
        if (!masterAssignment.met) {
            masterMissing.push(`Master assignment requirements: ${formatMissingParts(masterAssignment.missing)}.`);
        }
        const shouldHideMaster = hideUnreachableSlayerMasters && !masterReach.met;
        const masterVisibilityAttr = shouldHideMaster ? " style=\"display: none;\"" : "";

        masterHtml.push(`
            <section class="slayer-master card" id="${escapeHtml(id)}" data-master-reachable="${masterReach.met ? "true" : "false"}"${masterVisibilityAttr}>
                <header class="slayer-master-header">
                    <h2>
                        ${master.customUrl
                ? `<a href="${escapeHtml(master.customUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(master.name)}</a>`
                : escapeHtml(master.name)
            }
                        ${masterInfo}
                    </h2>
                    <div class="slayer-master-metrics">
                        <span class="slayer-master-metric">Master reachable: ${masterReach.met ? "Yes" : "No"}</span>
                        <span class="slayer-master-metric">Assignable reachable: ${reachPercent}% (${reachableAssignableCount}/${assignableCount})</span>
                    </div>
                </header>
                ${masterMissing.length ? `<div class="slayer-master-missing">${masterMissing.map((line) => `<div>${escapeHtml(line)}</div>`).join("")}</div>` : ""}
                <div class="slayer-monster-grid">
                    ${monsterRows.join("")}
                </div>
            </section>
        `);
    }

    return `
        <h1>Slayer masters</h1>
        <div class="slayer-master-filters">
            <label class="slayer-master-filter">
                <input type="checkbox" id="hideUnreachableSlayerMasters" ${hideUnreachableSlayerMasters ? "checked" : ""}>
                Hide unreachable slayer masters
            </label>
        </div>
        <nav class="unlock-jump slayer-master-jump" aria-label="Jump to slayer master">
            <div class="unlock-jump-label">Jump to slayer master</div>
            <div class="unlock-jump-list" id="slayerMasterJumpList">
                ${jumpLinks}
            </div>
        </nav>
        <div class="slayer-master-list" id="slayerMasterList">
            ${masterHtml.join("")}
        </div>
    `;
}

function applySlayerMasterFilters(container) {
    const hideUnreachableSlayerMasters = fileStore.filters?.hideUnreachableSlayerMasters ?? true;
    const masters = container.querySelectorAll(".slayer-master");
    for (const master of masters) {
        const isReachable = master.dataset.masterReachable === "true";
        const shouldHideMaster = hideUnreachableSlayerMasters && !isReachable;
        master.style.display = shouldHideMaster ? "none" : "";
    }

    const jumpLinks = document.querySelectorAll(".slayer-master-jump-link");
    for (const link of jumpLinks) {
        const targetId = link.getAttribute("href")?.slice(1);
        const target = targetId ? document.getElementById(targetId) : null;
        const isReachable = target?.dataset.masterReachable === "true";
        const shouldHideLink = hideUnreachableSlayerMasters && !isReachable;
        link.style.display = shouldHideLink ? "none" : "";
    }
}

async function updateSlayerMasterFilters(partial) {
    const nextFilters = {
        ...fileStore.filters,
        ...partial
    };
    await fileStore.setFilters(nextFilters);
    const list = document.getElementById("slayerMasterList");
    if (list) {
        applySlayerMasterFilters(list);
    }
}

let teardownSlayerMastersHandlers = null;

export function init() {
    teardown();

    const list = document.getElementById("slayerMasterList");
    if (list) {
        applySlayerMasterFilters(list);
    }

    const jumpNav = document.querySelector(".slayer-master-jump");
    const onSlayerMasterJumpClick = (event) => {
        const link = event.target.closest(".slayer-master-jump-link");
        if (!link) return;
        const targetId = link.getAttribute("href")?.slice(1);
        if (!targetId) return;
        const target = document.getElementById(targetId);
        if (!target) return;
        event.preventDefault();
        history.replaceState(null, "", `#${targetId}`);
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    if (jumpNav) {
        jumpNav.addEventListener("click", onSlayerMasterJumpClick);
    }

    const onSlayerMasterChange = async (event) => {
        if (event.target.id !== "hideUnreachableSlayerMasters") return;
        await updateSlayerMasterFilters({ hideUnreachableSlayerMasters: event.target.checked });
    };

    document.addEventListener("change", onSlayerMasterChange);

    teardownSlayerMastersHandlers = () => {
        if (jumpNav) {
            jumpNav.removeEventListener("click", onSlayerMasterJumpClick);
        }
        document.removeEventListener("change", onSlayerMasterChange);
    };
}

export function teardown() {
    if (typeof teardownSlayerMastersHandlers === "function") {
        teardownSlayerMastersHandlers();
    }
    teardownSlayerMastersHandlers = null;
}
