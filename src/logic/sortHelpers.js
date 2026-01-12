import { capitalizeFirstLetter } from "../main.js";
import { fileStore } from "../storage/fileStore.js";
import { canDoOtherMethod, canReachNpc } from "./itemAvailability.js";
import { NPC_DATA } from "./npcData.js";

export async function isItemObtainable(item, ctx) {
    const src = item.sources || {};

    if (fileStore.unlocked.includes(item.id)) {
        // === Shops ===
        if (src.shops) {
            for (const rule of Object.values(src.shops)) {

                // "No requirements"
                if (rule === "No requirements") return true;

                // string → single rule
                if (typeof rule === "string") {
                    if (await canDoOtherMethod(rule, ctx)) return true;
                }

                // object → any/all
                if (typeof rule === "object") {
                    if (await canDoOtherMethod(rule, ctx)) return true;
                }
            }
        }

        // === Spawns ===
        if (src.spawns) {
            for (const rule of Object.values(src.spawns)) {

                if (rule === "No requirements") return true;

                if (typeof rule === "string") {
                    if (await canDoOtherMethod(rule, ctx)) return true;
                }

                if (typeof rule === "object") {
                    if (await canDoOtherMethod(rule, ctx)) return true;
                }
            }
        }
    }

    // === Drops ===
    if (src.drops) {
        for (const npc of Object.keys(src.drops)) {
            if (await canReachNpc(npc, ctx)) return true;
        }
    }

    // === Other ===
    if (src.other) {
        for (const obj of Object.values(src.other)) {
            if (await canDoOtherMethod(obj.rule, ctx)) return true;
        }
    }

    return false;
}

/*
    LOWER rank = appears first.
    Obtainable → shop/spawn > drop > other → alphabetical
*/
export async function getObtainabilityRank(item, ctx) {
    const src = item.sources || {};
    const name = item.name.toLowerCase();
    const id = item.id;
    const player = ctx.player;

    const unlocked = fileStore.unlocked?.includes(id);

    // 1. Shop (obtainable)
    if (unlocked && src.shops) {
        for (const rule of Object.values(src.shops)) {
            if (rule === "No requirements") {
                return { rank: 1, name };
            }
            if (await canDoOtherMethod(rule, ctx)) {
                return { rank: 1, name };
            }
        }
    }

    // 2. Spawn (obtainable)
    if (unlocked && src.spawns) {
        for (const rule of Object.values(src.spawns)) {
            if (rule === "No requirements") {
                return { rank: 2, name };
            }
            if (await canDoOtherMethod(rule, ctx)) {
                return { rank: 2, name };
            }
        }
    }

    // Drops handling EASY
    if (src.drops) {
        for (const npcName of Object.keys(src.drops)) {
            if (!(await canReachNpc(npcName, ctx))) continue;

            const npc = NPC_DATA[npcName];

            if (npc.tags?.includes("jon") && ctx.filters?.hideJon) continue;
            if (npc.tags?.includes("boss") && ctx.filters?.hideBosses) continue;
            if (npc.tags?.includes("raid") && ctx.filters?.hideRaids) continue;
            if (npc.tags?.includes("superior") && !ctx.filters?.hasSuperiors) continue;
            if (npc.tags?.includes("slayer-task-only") && ctx.filters?.isSlayerLocked) continue;
            if (npc.tags?.includes("notForIronmen") && ctx.filters?.isIronman) continue;
            if (npc.tags?.includes("hunterRumour") && ctx.filters?.isHunterRumourLocked) continue;
            if (npc.tags?.includes("clue") && ctx.filters?.hideClue) continue;
            if (npc?.tags?.includes("easy") || (npc?.tags?.includes("jon") && !ctx.filters?.isIronman)) {
                return { rank: 3, name };
            }
        }
    }

    // Other sources (crafting, etc.)
    if (src.other) {
        for (const obj of Object.values(src.other)) {
            if (await canDoOtherMethod(obj.rule, ctx)) {
                return { rank: 4, name };
            }
        }
    }

    // Drops handling OTHERS
    if (src.drops) {
        let hasAnyReachable = false;
        let hasAnyWithUnmetSkill = false;

        for (const npcName of Object.keys(src.drops)) {
            if (!(await canReachNpc(npcName, ctx))) continue;

            hasAnyReachable = true;

            const npc = NPC_DATA[npcName];
            if (npc.tags?.includes("jon") && ctx.filters?.hideJon) continue;
            if (npc.tags?.includes("boss") && ctx.filters?.hideBosses) continue;
            if (npc.tags?.includes("raid") && ctx.filters?.hideRaids) continue;
            if (npc.tags?.includes("superior") && !ctx.filters?.hasSuperiors) continue;
            if (npc.tags?.includes("slayer-task-only") && ctx.filters?.isSlayerLocked) continue;
            if (npc.tags?.includes("notForIronmen") && ctx.filters?.isIronman) continue;
            if (npc.tags?.includes("hunterRumour") && ctx.filters?.isHunterRumourLocked) continue;
            if (npc.tags?.includes("clue") && ctx.filters?.hideClue) continue;

            // No skill required → reachable drop
            if (!npc?.skill?.length) {
                return { rank: 6, name };
            }

            if (!player) continue;

            let allSkillsMet = true;
            for (let i = 0; i < npc.skill.length; i++) {
                const skill = npc.skill[i];
                const level = npc.level[i];

                if (npcName == 'Reward pool 35–39 Fishing' && (player.levels['Fishing'] > 39 || player.levels['Fishing'] < 35)) { // Special case: Raw herring is removed from higher fishing levels
                    allSkillsMet = false;
                    hasAnyWithUnmetSkill = true;
                    break;
                }

                if (player.levels[capitalizeFirstLetter(skill)] < level) {
                    allSkillsMet = false;
                    hasAnyWithUnmetSkill = true;
                    break;
                }
            }

            if (allSkillsMet) {
                return { rank: 5, name };
            }
        }

        if (hasAnyReachable && hasAnyWithUnmetSkill) {
            return { rank: 7, name };
        }
    }

    // 7. Unobtainable
    return { rank: 8, name };
}
