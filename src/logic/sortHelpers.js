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

function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
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

            if (npc?.tags?.includes("easy")) {
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
        let hasReachableDrop = false;
        let hasSkillMet = false;
        let skillNotMetYet = false;
        let otherDropSourceNoSkillLevel = false;

        for (const npcName of Object.keys(src.drops)) {
            if (!(await canReachNpc(npcName, ctx))) continue;

            hasReachableDrop = true;

            const npc = NPC_DATA[npcName];

            if (npc?.skill?.length) {
                if (player) {
                    if (npc.skill.length !== npc.level.length) {
                        console.error("npc skill and level not in order: ", npc);
                    }
                    for (let i = 0; i < npc.skill.length; i++) {
                        const skill = npc.skill[i];
                        const level = npc.level[i];

                        if (player.levels[capitalizeFirstLetter(skill)] >= level) { //TODO probleem: wat als je 1 skill wel hebt en 1 skill niet?
                            hasSkillMet = true;
                        } else {
                            skillNotMetYet = true;
                        }
                    }
                }
            } else {
                otherDropSourceNoSkillLevel = true;
            }
        }

        // IMPORTANT: only classify drops if reachable
        if (hasReachableDrop) {
            if (otherDropSourceNoSkillLevel) {
                return { rank: 6, name };
            }

            if (hasSkillMet) {
                return { rank: 5, name };
            }

            if (skillNotMetYet) {
                return { rank: 7, name };
            }
        }
    }

    // 7. Unobtainable
    return { rank: 8, name };
}
