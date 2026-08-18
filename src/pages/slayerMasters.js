import { REQUIREMENT_CHECKS, hasElementalRuneRules, isElementalRuneRule } from "../logic/requirements.js";
import { fileStore } from "../storage/fileStore.js";
import { NPC_DATA } from "../logic/npcData.js";

const SLAYER_RULE_LABELS = {
    canAssignWaterfiendsBarbarianFiremaking1: "Barbarian firemaking 1 completed",
    hasAntiDragonShieldForDragonSlayerTasks: "Obtained Anti-dragon shield",
    canReachWyrmsTask: "Any of: Granite boots / Boots of stone / Boots of brimstone, access to the Charred Dungeon, or can start Perilous Moons and reach Wyrmlings",
    canReachAbyssalSire: "Can reach Abyssal Sire area",
    canReachTrollheim: "Can reach Trollheim",
    canAccessWyrmscraigIsland: "Can access Wyrmscraig Island",
    hasUsableAxe: "Has a usable axe"
};

const LIKE_A_BOSS_MASTERS = new Set([
    "Konar",
    "Nieve",
    "Duradel",
    "Krystilia"
]);

const LIKE_A_BOSS = [
    {
        name: "Abyssal Sire"
    },
    {
        name: "Alchemical Hydra",
        masters: ["Konar"]
    },
    {
        name: "Araxxor"
    },
    {
        name: "Barrows brothers",
        npcs: [
            "Ahrim the Blighted",
            "Dharok the Wretched",
            "Guthan the Infested",
            "Karil the Tainted",
            "Torag the Corrupted",
            "Verac the Defiled"
        ]
    },
    {
        name: "Callisto",
        substitutes: ["Artio"]
    },
    {
        name: "Cerberus"
    },
    {
        name: "Chaos Elemental"
    },
    {
        name: "Chaos Fanatic"
    },
    {
        name: "Commander Zilyana"
    },
    {
        name: "Crazy archaeologist",
        substitutes: ["Deranged archaeologist"]
    },
    {
        name: "Dagannoth Kings",
        npcs: [
            "Dagannoth Prime",
            "Dagannoth Rex",
            "Dagannoth Supreme"
        ]
    },
    {
        name: "Duke Sucellus"
    },
    {
        name: "General Graardor"
    },
    {
        name: "Giant Mole"
    },
    {
        name: "Grotesque Guardians"
    },
    {
        name: "K'ril Tsutsaroth"
    },
    {
        name: "Kalphite Queen"
    },
    {
        name: "King Black Dragon"
    },
    {
        name: "Kraken"
    },
    {
        name: "Kree'arra"
    },
    {
        name: "The Leviathan"
    },
    {
        name: "Maggot King"
    },
    {
        name: "Phantom Muspah"
    },
    {
        name: "Sarachnis"
    },
    {
        name: "Scorpia"
    },
    {
        name: "Shellbane gryphon"
    },
    {
        name: "Thermonuclear smoke devil"
    },
    {
        name: "Vardorvis"
    },
    {
        name: "Venenatis",
        substitutes: ["Spindel"]
    },
    {
        name: "Vet'ion",
        substitutes: ["Calvar'ion"]
    },
    {
        name: "Vorkath"
    },
    {
        name: "The Whisperer"
    },
    {
        name: "Zulrah"
    }
];

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

function formatRuleLabel(ruleKey) {
    return SLAYER_RULE_LABELS[ruleKey] || ruleKey;
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

        for (const [skill, rawLevel] of Object.entries(requirements.skills || {})) {
            const level = Number(rawLevel);
            if (!Number.isFinite(level)) {
                merged.skills[skill] = rawLevel;
                continue;
            }
            const existing = Number(merged.skills[skill]);
            if (!Number.isFinite(existing) || level > existing) {
                merged.skills[skill] = level;
            }
        }
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

function maybeIgnoreCombatRequirements(requirements, ignoreCombatLevel) {
    if (!ignoreCombatLevel || !requirements || typeof requirements !== "object") {
        return requirements || {};
    }

    const skills = { ...(requirements.skills || {}) };
    for (const skill of Object.keys(skills)) {
        if (String(skill).toLowerCase() === "combat") {
            delete skills[skill];
        }
    }

    const skillsAny = (requirements.skillsAny || []).map((option) => {
        const nextOption = {};
        for (const [skill, level] of Object.entries(option || {})) {
            if (String(skill).toLowerCase() === "combat") continue;
            nextOption[skill] = level;
        }
        return nextOption;
    }).filter((option) => Object.keys(option).length > 0);

    return {
        ...requirements,
        skills,
        skillsAny
    };
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
            if (itemGroup.length === 1) {
                missing.push(itemGroup[0]);
            } else {
                missing.push(`Any of: ${itemGroup.join(" / ")}`);
            }
        }
    }

    const elementalRuneRules = (requirements?.rulesAll || []).filter(isElementalRuneRule);
    const skippedRuleKeys = new Set(elementalRuneRules);
    if (elementalRuneRules.length) {
        const runeRulesMet = hasElementalRuneRules(ctx, elementalRuneRules, { trackMissing: false });
        if (!runeRulesMet) {
            missing.push(elementalRuneRules.map(formatRuleLabel).join(" + "));
        }
    }

    for (const ruleKey of requirements?.rulesAll || []) {
        if (skippedRuleKeys.has(ruleKey)) continue;
        const ruleFn = REQUIREMENT_CHECKS[ruleKey];
        const ruleLabel = formatRuleLabel(ruleKey);
        if (!ruleFn) {
            missing.push(`${ruleLabel} (rule missing)`);
            continue;
        }
        try {
            const met = await ruleFn(ctx);
            if (!met) {
                missing.push(ruleLabel);
            }
        } catch (error) {
            missing.push(`${ruleLabel} (rule error)`);
        }
    }

    const rulesAny = requirements?.rulesAny || [];
    if (rulesAny.length) {
        let anyRuleMet = false;
        const failedRules = [];
        for (const ruleKey of rulesAny) {
            const ruleFn = REQUIREMENT_CHECKS[ruleKey];
            const ruleLabel = formatRuleLabel(ruleKey);
            if (!ruleFn) {
                failedRules.push(`${ruleLabel} (rule missing)`);
                continue;
            }
            try {
                const met = await ruleFn(ctx);
                if (met) {
                    anyRuleMet = true;
                } else {
                    failedRules.push(ruleLabel);
                }
            } catch (error) {
                failedRules.push(`${ruleLabel} (rule error)`);
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
    return `https://oldschool.runescape.wiki/w/Slayer_task/${page}`;
}

function renderInfoIcon(title, label) {
    if (!title) return "";
    return `<span class="clue-step-info" tabindex="0" aria-label="${escapeHtml(label)}" title="${escapeHtml(title)}">i</span>`;
}

function getMonsterLink(monster) {
    return wikiUrlForMonster(monster?.name);
}

function isDragonSlayerMonster(monsterName) {
    return /\bdragons?\b/i.test(String(monsterName || ""));
}

function getSlayerStatusState(isAssignable, isReachable) {
    if (!isAssignable) {
        return {
            statusKey: "unassignable",
            statusLabel: "Unassignable"
        };
    }
    if (!isReachable) {
        return {
            statusKey: "unreachable",
            statusLabel: "Unreachable"
        };
    }
    return {
        statusKey: "reachable",
        statusLabel: "Assignable and reachable"
    };
}

function isBossAvailableToMaster(boss, masterName) {
    if (!LIKE_A_BOSS_MASTERS.has(masterName)) {
        return false;
    }

    if (masterName === "Krystilia") {
        return (
            WILDERNESS_BOSS_NAMES.has(boss.name) ||
            KRYSTILIA_EXCEPTION_BOSS_NAMES.has(boss.name)
        );
    }

    if (boss.masters && !boss.masters.includes(masterName)) {
        return false;
    }

    return true;
}

function getBossAssignmentRequirements(boss) {
    return boss.assignmentRequirements || {};
}

function getBossReachRequirements(boss) {
    return boss.reachRequirements || {};
}

async function evaluateBossForMaster(boss, master, ctx) {
    if (!isBossAvailableToMaster(boss, master.name)) {
        return {
            assignable: false,
            reachable: false,
            assignmentStatus: { met: false, missing: [] },
            reachStatus: { met: false, missing: [] }
        };
    }

    // Boss assignments ignore combat level.
    const assignmentStatus = await evaluateRequirements(
        getBossAssignmentRequirements(boss),
        ctx
    );

    const reachStatus = await evaluateRequirements(
        getBossReachRequirements(boss),
        ctx
    );

    return {
        assignable: assignmentStatus.met,
        reachable: assignmentStatus.met && reachStatus.met,
        assignmentStatus,
        reachStatus
    };
}

async function processBossTask(boss, master, ctx) {
    const bossNpcNames = boss.npcs?.length
        ? boss.npcs
        : [boss.name];

    const bossNpcs = bossNpcNames
        .map((name) => NPC_DATA[name])
        .filter(Boolean);

    const substituteNpcs = (boss.substitutes || [])
        .map((name) => NPC_DATA[name])
        .filter(Boolean);

    /*
     * If this boss has a master restriction, enforce it here.
     */
    if (boss.masters && !boss.masters.includes(master.name)) {
        return {
            assignable: false,
            reachable: false,
            statusLabel: "Not assigned by this master",
            missingLines: [],
            statusKey: "unassignable"
        };
    }

    /*
 * Krystilia only assigns these Wilderness bosses.
 */
if (master.name === "Krystilia") {
    const krystiliaBosses = [
        "Callisto",
        "Chaos Elemental",
        "Chaos Fanatic",
        "Crazy archaeologist",
        "Scorpia",
        "Venenatis",
        "Vet'ion"
    ];

    if (!krystiliaBosses.includes(boss.name)) {
        return {
            assignable: false,
            reachable: false,
            statusLabel: "Not assigned by this master",
            missingLines: [],
            statusKey: "unassignable"
        };
    }
}

    /*
     * No NPC data means we cannot evaluate the boss.
     * Treat it as unavailable rather than allowing it
     * to accidentally count toward the percentage.
     */
    if (!bossNpcs.length) {
        return {
            assignable: false,
            reachable: false,
            statusLabel: "No NPC data",
            missingLines: [],
            statusKey: "unassignable"
        };
    }

    /*
     * A boss task is assignable if at least one of the
     * applicable NPCs satisfies its requirements.
     *
     * NPC_DATA uses:
     *   skill -> Slayer/other skill requirements
     *   level -> combat/NPC level requirements
     *   rule -> access rules
     *
     * For Slayer-task purposes, the skill and rule data
     * are the important parts.
     */
    const evaluateNpc = async (npc) => {
        const assignmentRequirements = {
            skills: {},
            rulesAll: [],
            rulesAny: []
        };

        for (const [skill, level] of Object.entries(npc.skill || {})) {
            assignmentRequirements.skills[skill] = level;
        }

        if (Array.isArray(npc.rule)) {
            assignmentRequirements.rulesAll.push(...npc.rule);
        } else if (npc.rule && typeof npc.rule === "object") {
            if (Array.isArray(npc.rule.all)) {
                assignmentRequirements.rulesAll.push(...npc.rule.all);
            }

            if (Array.isArray(npc.rule.any)) {
                assignmentRequirements.rulesAny.push(...npc.rule.any);
            }
        }

        return evaluateRequirements(assignmentRequirements, ctx);
    };

    const npcResults = [];

    for (const npc of bossNpcs) {
        npcResults.push({
            npc,
            status: await evaluateNpc(npc)
        });
    }

    /*
     * Substitutes count as alternatives to the boss itself.
     */
    const substituteResults = [];

    for (const npc of substituteNpcs) {
        substituteResults.push({
            npc,
            status: await evaluateNpc(npc)
        });
    }

    const allResults = [
        ...npcResults,
        ...substituteResults
    ];

    const assignableResults = allResults.filter(
        ({ status }) => status.met
    );

    const assignable = assignableResults.length > 0;

    /*
     * For a boss task, reaching ANY valid boss/substitute
     * is enough to make the task reachable.
     *
     * This is particularly important for:
     *   Callisto -> Artio
     *   Crazy archaeologist -> Deranged archaeologist
     *   Venenatis -> Spindel
     *   Vet'ion -> Calvar'ion
     */
    const reachable = assignable;

    const missingLines = [];

    if (!assignable) {
        const missing = [];

        for (const { status } of allResults) {
            if (status.missing.length) {
                missing.push(...status.missing);
            }
        }

        const uniqueMissing = [...new Set(missing)];

        if (uniqueMissing.length) {
            missingLines.push(
                `To be assigned/reached: ${formatMissingParts(uniqueMissing)}.`
            );
        }
    }

    const statusState = getSlayerStatusState(assignable, reachable);

    return {
        assignable,
        reachable,
        statusLabel: statusState.statusLabel,
        statusKey: statusState.statusKey,
        missingLines
    };
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
    const hideUnassignableSlayerTasks = Boolean(fileStore.filters?.hideUnassignableSlayerTasks);
    const ignoreSlayerMasterCombatLevel = Boolean(fileStore.filters?.ignoreSlayerMasterCombatLevel);
    const likeABossUnlocked = Boolean(fileStore.filters?.likeABossUnlocked);

    const masterHtml = [];

    for (const { master, id } of masterMeta) {
        const masterReach = await evaluateRequirements(master.reachRequirements || {}, ctx);
        const masterAssignment = await evaluateRequirements(master.assignmentRequirements || {}, ctx);

        let assignableCount = 0;
        let reachableAssignableCount = 0;

        const monsterRows = [];

        for (const monster of master.monsters || []) {
            const monsterAssignmentReq = maybeIgnoreCombatRequirements(
                monster.assignmentRequirements || {},
                ignoreSlayerMasterCombatLevel
            );
            const dragonSlayerRequirement = isDragonSlayerMonster(monster.name)
                ? { rulesAll: ["hasAntiDragonShieldForDragonSlayerTasks"] }
                : null;
            const assignmentReq = mergeRequirementSets(
                master.assignmentRequirements,
                monsterAssignmentReq,
                dragonSlayerRequirement
            );
            const reachReq = mergeRequirementSets(master.reachRequirements, monster.reachRequirements);

            const assignmentStatus = await evaluateRequirements(assignmentReq, ctx);
            const reachStatus = await evaluateRequirements(reachReq, ctx);

            const locations = Array.isArray(monster.locations) ? monster.locations : [];
            const locationRows = [];
            let assignableLocationCount = 0;
            let reachableAssignableLocationCount = 0;

            for (const location of locations) {
                const locationAssignmentReq = maybeIgnoreCombatRequirements(
                    location?.assignmentRequirements || {},
                    ignoreSlayerMasterCombatLevel
                );
                const mergedLocationAssignmentReq = mergeRequirementSets(assignmentReq, locationAssignmentReq);
                const mergedLocationReachReq = mergeRequirementSets(reachReq, location?.reachRequirements);

                const locationAssignmentStatus = await evaluateRequirements(mergedLocationAssignmentReq, ctx);
                const locationReachStatus = await evaluateRequirements(mergedLocationReachReq, ctx);
                const locationAssignable = locationAssignmentStatus.met;
                const locationReachable = locationReachStatus.met;

                if (locationAssignable) {
                    assignableLocationCount += 1;
                    if (locationReachable) {
                        reachableAssignableLocationCount += 1;
                    }
                }

                const locationMissingLines = [];
                if (!locationAssignable) {
                    if (locationAssignmentStatus.missing.length) {
                        locationMissingLines.push(`To be assigned here: ${formatMissingParts(locationAssignmentStatus.missing)}.`);
                    }
                    if (!locationReachable && locationReachStatus.missing.length) {
                        locationMissingLines.push(`To reach here: ${formatMissingParts(locationReachStatus.missing)}.`);
                    }
                } else if (!locationReachable && locationReachStatus.missing.length) {
                    locationMissingLines.push(`To reach here: ${formatMissingParts(locationReachStatus.missing)}.`);
                }

                const locationState = getSlayerStatusState(locationAssignable, locationReachable);
                const locationNotes = Array.isArray(location?.notes) ? location.notes : [];
                const locationInfo = locationNotes.length
                    ? renderInfoIcon(locationNotes.join("\n"), `${monster.name} ${location?.name || "location"} note`)
                    : "";

                locationRows.push(`
                    <div class="slayer-location slayer-location--${locationState.statusKey}">
                        <div class="slayer-location-header">
                            <span class="slayer-location-name">${escapeHtml(location?.name || "Location")}</span>
                            ${locationInfo}
                            <span class="slayer-location-status">${locationState.statusLabel}</span>
                        </div>
                        ${locationMissingLines.length ? `<div class="slayer-location-missing">${locationMissingLines.map((line) => `<div>${escapeHtml(line)}</div>`).join("")}</div>` : ""}
                    </div>
                `);
            }

            const isAssignable = locations.length > 0 ? assignableLocationCount > 0 : assignmentStatus.met;
            const isReachable = locations.length > 0
                ? reachableAssignableLocationCount > 0
                : reachStatus.met;

            const assignableUnitCount = locations.length > 0
                ? assignableLocationCount
                : (isAssignable ? 1 : 0);
            const reachableAssignableUnitCount = locations.length > 0
                ? reachableAssignableLocationCount
                : (isAssignable && isReachable ? 1 : 0);

            assignableCount += assignableUnitCount;
            reachableAssignableCount += reachableAssignableUnitCount;

            const statusState = getSlayerStatusState(isAssignable, isReachable);
            const statusClass = `slayer-monster--${statusState.statusKey}`;
            let statusLabel = statusState.statusLabel;
            const missingLines = [];

            if (!isAssignable) {
                if (assignmentStatus.missing.length) {
                    missingLines.push(`To be assigned: ${formatMissingParts(assignmentStatus.missing)}.`);
                }
                if (!isReachable && reachStatus.missing.length) {
                    missingLines.push(`To reach: ${formatMissingParts(reachStatus.missing)}.`);
                }
            } else if (!isReachable && reachStatus.missing.length) {
                missingLines.push(`To reach: ${formatMissingParts(reachStatus.missing)}.`);
            }
            if (locations.length > 0) {
                if (isAssignable && isReachable) {
                    statusLabel = `Locations reachable: ${reachableAssignableLocationCount}/${assignableLocationCount}`;
                } else if (!isAssignable && assignmentStatus.met) {
                    statusLabel = "No assignable locations";
                    missingLines.push("No locations are currently assignable.");
                } else if (isAssignable && !isReachable) {
                    statusLabel = "No reachable assignable locations";
                    missingLines.push("No assignable locations are currently reachable.");
                }
            }

            const monsterNotes = Array.isArray(monster.notes) ? monster.notes : [];
            const monsterInfo = monsterNotes.length
                ? renderInfoIcon(monsterNotes.join("\n"), `${monster.name} note`)
                : "";
            const locationBlock = locationRows.length
                ? `
                    <div class="slayer-location-list">
                        <div class="slayer-location-list-label">Locations</div>
                        ${locationRows.join("")}
                    </div>
                `
                : "";

            monsterRows.push(`
                <article class="slayer-monster ${statusClass}">
                    <div class="slayer-monster-header">
                        <a class="slayer-monster-link" href="${escapeHtml(getMonsterLink(monster))}" target="_blank" rel="noopener noreferrer">${escapeHtml(monster.name)}</a>
                        ${monsterInfo}
                        <span class="slayer-monster-status">${statusLabel}</span>
                    </div>
                    ${missingLines.length ? `<div class="slayer-monster-missing">${missingLines.map((line) => `<div>${escapeHtml(line)}</div>`).join("")}</div>` : ""}
                    ${locationBlock}
                </article>
            `);
        }

        const reachPercent = assignableCount > 0
            ? ((reachableAssignableCount / assignableCount) * 100).toFixed(1)
            : "0.0";

        let bossAssignableCount = 0;
        let bossReachableCount = 0;
        const bossRows = [];

        if (likeABossUnlocked && LIKE_A_BOSS_MASTERS.has(master.name)) {
            for (const boss of LIKE_A_BOSS) {
                const bossResult = await processBossTask(
                    boss,
                    master,
                    ctx
                );

                /*
                * Masters that don't assign this boss don't belong
                * in this master's boss pool at all.
                */
                if (
                    bossResult.statusKey === "unassignable" &&
                    bossResult.statusLabel === "Not assigned by this master"
                ) {
                    continue;
                }

                if (bossResult.assignable) {
                    bossAssignableCount++;

                    if (bossResult.reachable) {
                        bossReachableCount++;
                    }
                }

                const statusClass =
                    `slayer-monster--${bossResult.statusKey}`;

                bossRows.push(`
                    <article class="slayer-monster ${statusClass}">
                        <div class="slayer-monster-header">
                            <a
                                class="slayer-monster-link"
                                href="${escapeHtml(getMonsterLink({ name: boss.name }))}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >${escapeHtml(boss.name)}</a>

                            <span class="slayer-monster-status">
                                ${escapeHtml(bossResult.statusLabel)}
                            </span>
                        </div>

                        ${
                            bossResult.missingLines.length
                                ? `
                                    <div class="slayer-monster-missing">
                                        ${bossResult.missingLines
                                            .map((line) => `<div>${escapeHtml(line)}</div>`)
                                            .join("")}
                                    </div>
                                `
                                : ""
                        }
                    </article>
                `);
            }
        }

        const bossReachPercent = bossAssignableCount > 0
            ? ((bossReachableCount / bossAssignableCount) * 100).toFixed(1)
            : "0.0";

        const bossTaskPercent = bossAssignableCount > 0
            ? (100 / bossAssignableCount).toFixed(1)
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
                        <span class="slayer-master-metric">
                            Master reachable: ${masterReach.met ? "Yes" : "No"}
                        </span>

                        <span class="slayer-master-metric">
                            Assignable reachable: ${reachPercent}% (${reachableAssignableCount}/${assignableCount})
                        </span>

                        ${
                            likeABossUnlocked &&
                            LIKE_A_BOSS_MASTERS.has(master.name) &&
                            bossAssignableCount > 0
                                ? `
                                    <span class="slayer-master-metric">
                                        Boss tasks: ${bossReachPercent}% reachable
                                        (${bossReachableCount}/${bossAssignableCount})
                                        — ${bossTaskPercent}% each
                                        <a
                                            class="unlock-jump-link slayer-boss-jump-link"
                                            href="#${escapeHtml(`${id}-bosses`)}"
                                        >Jump to breakdown</a>
                                    </span>
                                `
                                : ""
                        }
                    </div>
                </header>
                ${masterMissing.length ? `<div class="slayer-master-missing">${masterMissing.map((line) => `<div>${escapeHtml(line)}</div>`).join("")}</div>` : ""}
                <div class="slayer-monster-grid">
                    ${monsterRows.join("")}
                </div>

                ${
                    likeABossUnlocked &&
                    LIKE_A_BOSS_MASTERS.has(master.name) &&
                    bossRows.length
                        ? `
                            <section
                                class="slayer-boss-breakdown"
                                id="${escapeHtml(`${id}-bosses`)}"
                            >
                                <h3>Like a boss</h3>

                                <div class="slayer-master-metrics">
                                    <span class="slayer-master-metric">
                                        Assignable bosses: ${bossAssignableCount}
                                    </span>

                                    <span class="slayer-master-metric">
                                        Reachable: ${bossReachPercent}%
                                        (${bossReachableCount}/${bossAssignableCount})
                                    </span>

                                    <span class="slayer-master-metric">
                                        Each boss: ${bossTaskPercent}%
                                    </span>
                                </div>

                                <div class="slayer-monster-grid">
                                    ${bossRows.join("")}
                                </div>
                            </section>
                        `
                        : ""
                }
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
            <label class="slayer-master-filter">
                <input type="checkbox" id="hideUnassignableSlayerTasks" ${hideUnassignableSlayerTasks ? "checked" : ""}>
                Hide unassignable tasks
            </label>
            <label class="slayer-master-filter">
                <input type="checkbox" id="ignoreSlayerMasterCombatLevel" ${ignoreSlayerMasterCombatLevel ? "checked" : ""}>
                Ignore combat level
            </label>
            <label class="slayer-master-filter">
                <input type="checkbox" id="likeABossUnlocked" ${likeABossUnlocked ? "checked" : ""}>
                "Like a boss" unlocked
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
    const hideUnassignableSlayerTasks = Boolean(fileStore.filters?.hideUnassignableSlayerTasks);
    const masters = container.querySelectorAll(".slayer-master");
    for (const master of masters) {
        const isReachable = master.dataset.masterReachable === "true";
        const shouldHideMaster = hideUnreachableSlayerMasters && !isReachable;
        master.style.display = shouldHideMaster ? "none" : "";
    }
    const monsters = container.querySelectorAll(".slayer-monster");
    for (const monster of monsters) {
        const isUnassignable = monster.classList.contains("slayer-monster--unassignable");
        monster.style.display = hideUnassignableSlayerTasks && isUnassignable ? "none" : "";
    }
    const locations = container.querySelectorAll(".slayer-location");
    for (const location of locations) {
        const isUnassignable = location.classList.contains("slayer-location--unassignable");
        location.style.display = hideUnassignableSlayerTasks && isUnassignable ? "none" : "";
    }
    const locationLists = container.querySelectorAll(".slayer-location-list");
    for (const locationList of locationLists) {
        const locationRows = locationList.querySelectorAll(".slayer-location");
        const hasVisibleLocation = Array.from(locationRows).some((row) => row.style.display !== "none");
        locationList.style.display = hasVisibleLocation ? "" : "none";
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

async function updateSlayerMasterFilters(partial, options = {}) {
    const nextFilters = {
        ...fileStore.filters,
        ...partial
    };
    await fileStore.setFilters(nextFilters);
    if (options.rerender) {
        window.dispatchEvent(new PopStateEvent("popstate"));
        return;
    }
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
        if (event.target.id === "hideUnreachableSlayerMasters") {
            await updateSlayerMasterFilters({ hideUnreachableSlayerMasters: event.target.checked });
        }
        if (event.target.id === "ignoreSlayerMasterCombatLevel") {
            await updateSlayerMasterFilters(
                { ignoreSlayerMasterCombatLevel: event.target.checked },
                { rerender: true }
            );
        }
        if (event.target.id === "hideUnassignableSlayerTasks") {
            await updateSlayerMasterFilters({ hideUnassignableSlayerTasks: event.target.checked });
        }

        if (event.target.id === "likeABossUnlocked") {
            await updateSlayerMasterFilters(
                { likeABossUnlocked: event.target.checked },
                { rerender: true }
            );
        }
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
