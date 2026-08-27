import {
    areNpcSkillsMet,
    isNpcBlockedByFilters,
    isNpcObtainable,
    isRuleObtainable,
    isSourceHiddenByFilters
} from "./itemVisibility.js";
import { fileStore } from "../storage/fileStore.js";
import { canReachNpc, evaluateRule } from "./itemAvailability.js";
import { NPC_DATA } from "./npcData.js";
import { isIronmanAccount } from "./playerState.js";
import { hasTelegrabRunes } from "./requirements.js";

/*
    Returns true when a rule contains a direct skill-level requirement.

    This is used to distinguish "Other" sources that are immediately
    obtainable from those that are obtainable but require a skill level.
*/
function ruleContainsSkillRequirement(rule) {
    if (!rule || typeof rule === "string") return false;

    if (Array.isArray(rule)) {
        return rule.some((subRule) => ruleContainsSkillRequirement(subRule));
    }

    if (typeof rule !== "object") return false;

    if (rule.skill && rule.level !== undefined) {
        return true;
    }

    if (
        Array.isArray(rule.skills) &&
        rule.skills.some(
            (req) => req?.skill && req.level !== undefined
        )
    ) {
        return true;
    }

    return (
        ruleContainsSkillRequirement(rule.any) ||
        ruleContainsSkillRequirement(rule.all)
    );
}

function sourceHasSkillRequirement(source) {
    if (!source) return false;

    if (Array.isArray(source.skill)) {
        if (source.skill.length && source.level !== undefined) {
            return true;
        }
    } else if (source.skill && source.level !== undefined) {
        return true;
    }

    return ruleContainsSkillRequirement(source.rule);
}

/*
    Evaluates an "other" source.

    The source's normal rule must always be met first.

    If the source has a houseRule and "Allow other players' houses" is
    disabled, the houseRule must also be met.

    Keeping this logic in one helper prevents the normal source rule and
    house rule from being incorrectly combined into a new { all: [...] }
    rule before evaluation.
*/
async function isOtherSourceObtainable(source, ctx) {
    if (!source) return false;

    const ruleMet = await evaluateRule(source.rule, ctx);

    if (!ruleMet) {
        return false;
    }

    if (
        source.houseRule &&
        !ctx.filters?.allowOthersHouses
    ) {
        return await evaluateRule(source.houseRule, ctx);
    }

    return true;
}

export async function isItemObtainable(item, ctx) {
    const src = item.sources || {};

    /*
        Shops are only obtainable if the item has been rolled.
    */
    if (fileStore.rolled.includes(item.id)) {
        // === Shops ===
        if (src.shops) {
            for (const rule of Object.values(src.shops)) {
                if (await isRuleObtainable(rule, ctx)) {
                    return true;
                }
            }
        }

        // === Spawns ===
        if (src.spawns) {
            for (const rule of Object.values(src.spawns)) {
                if (await isRuleObtainable(rule, ctx)) {
                    return true;
                }
            }
        }
    }

    // === Drops ===
    if (src.drops) {
        for (const npc of Object.keys(src.drops)) {
            if (await isNpcObtainable(npc, ctx)) {
                return true;
            }
        }
    }

    // === Other ===
    if (src.other) {
        for (const obj of Object.values(src.other)) {
            if (isSourceHiddenByFilters(obj, ctx)) continue;

            if (await isOtherSourceObtainable(obj, ctx)) {
                return true;
            }
        }
    }

    return false;
}

/*
    Determines which item section an obtainable item belongs to.

    Lower rank = appears earlier on the Items page.

    1 = Buyable shop items
    2 = Pickupable spawns
    3 = Easy rolls
    4 = Other sources
    5 = Skill requirements met
    6 = Other drops
    7 = Sources for which you do not have the level yet
    8 = Clue rewards
    9 = Unobtainable

    IMPORTANT:
    Rank 8 is reserved for clue rewards at the display level.
    Unobtainable items now use rank 9 directly, so there is no longer
    a rank-8-to-rank-9 conversion elsewhere in the application.
*/
export async function getObtainabilityRank(item, ctx) {
    const src = item.sources || {};
    const name = item.name.toLowerCase();
    const id = item.id;

    const rolled = fileStore.rolled?.includes(id);
    const isIronman = isIronmanAccount(ctx.player);

    // ================================================================
    // Rank 1: Buyable shop items
    // ================================================================
    if (rolled && src.shops) {
        for (const rule of Object.values(src.shops)) {
            if (await isRuleObtainable(rule, ctx)) {
                return { rank: 1, name };
            }
        }
    }

    // ================================================================
    // Rank 2: Pickupable spawns
    // ================================================================
    if (src.spawns) {
        // Normal spawn
        if (rolled) {
            for (const rule of Object.values(src.spawns)) {
                if (await isRuleObtainable(rule, ctx)) {
                    return { rank: 2, name };
                }
            }
        }

        /*
            Telegrab can make a spawn obtainable even when the normal
            spawn method is not available.

            The spawn's own rule is still respected.
        */
        if (
            ctx?.filters?.allowTelegrab &&
            await hasTelegrabRunes(ctx)
        ) {
            for (const rule of Object.values(src.spawns)) {
                if (!rule || rule === "No requirements") {
                    return { rank: 2, name };
                }

                if (await evaluateRule(rule, ctx)) {
                    return { rank: 2, name };
                }
            }
        }
    }

    // ================================================================
    // Rank 3: Easy rolls
    // ================================================================
    if (src.drops) {
        for (const npcName of Object.keys(src.drops)) {
            if (!(await isNpcObtainable(npcName, ctx))) {
                continue;
            }

            const npc = NPC_DATA[npcName];

            if (
                npc?.tags?.includes("easy") ||
                (npc?.tags?.includes("jon") && !isIronman)
            ) {
                return { rank: 3, name };
            }
        }
    }

    // ================================================================
    // Ranks 4/5: Other sources | Skill reqs
    //
    // Rank 4 = obtainable other source without a skill requirement
    // Rank 5 = obtainable other source with a skill requirement
    // ================================================================
    if (src.other) {
        let hasObtainableOtherWithSkill = false;
        let hasObtainableOtherWithoutSkill = false;

        for (const obj of Object.values(src.other)) {
            if (isSourceHiddenByFilters(obj, ctx)) continue;

            /*
                Use the centralized other-source evaluation so that
                houseRule is respected here as well.
            */
            if (await isOtherSourceObtainable(obj, ctx)) {
                if (sourceHasSkillRequirement(obj)) {
                    hasObtainableOtherWithSkill = true;
                } else {
                    hasObtainableOtherWithoutSkill = true;
                }
            }
        }

        if (hasObtainableOtherWithoutSkill) {
            return { rank: 4, name };
        }

        if (hasObtainableOtherWithSkill) {
            return { rank: 5, name };
        }
    }

    // ================================================================
    // Rank 7: Other sources that are trainable but level-gated
    //
    // Ignore numeric skill levels to determine whether the source
    // becomes obtainable once the required skill level is reached.
    // House rules are still respected.
    // ================================================================
    if (src.other) {
        const levelIgnoredCtx = {
            ...ctx,

            // Ignore numeric skill levels while preserving the rest
            // of the rule evaluation.
            ignoreSkillLevels: true,
            suppressMissing: true,

            ruleEvalKey: `${ctx.ruleEvalKey || "base"}:ignoreLevels`,

            missing: {
                ...ctx.missing,
                suppressMissing: true,
            },
        };

        for (const obj of Object.values(src.other)) {
            if (isSourceHiddenByFilters(obj, ctx)) continue;
            if (!obj?.rule) continue;

            /*
                First check the source's normal rule with skill levels
                ignored. This determines whether the source is
                trainable in principle.

                Then separately check the houseRule. A source in another
                player's house should not become rank 7 merely because
                its normal skill requirements can eventually be met.
            */
            const ruleMetWithoutLevels = await evaluateRule(
                obj.rule,
                levelIgnoredCtx
            );

            if (!ruleMetWithoutLevels) {
                continue;
            }

            if (
                obj.houseRule &&
                !ctx.filters?.allowOthersHouses
            ) {
                const houseRuleMet = await evaluateRule(
                    obj.houseRule,
                    ctx
                );

                if (!houseRuleMet) {
                    continue;
                }
            }

            return { rank: 7, name };
        }
    }

    // ================================================================
    // Ranks 5/6/7: NPC drops
    //
    // Rank 5 = NPC skill requirements met
    // Rank 6 = reachable NPC with no skill requirement
    // Rank 7 = reachable NPC whose skill requirement is not met
    // ================================================================
    if (src.drops) {
        let hasSkillMetDrop = false;
        let hasNoSkillDrop = false;
        let hasUnmetSkillDrop = false;

        for (const npcName of Object.keys(src.drops)) {
            if (!(await canReachNpc(npcName, ctx))) {
                continue;
            }

            if (isNpcBlockedByFilters(npcName, ctx)) {
                continue;
            }

            const npc = NPC_DATA[npcName];

            if (!npc?.skill?.length) {
                hasNoSkillDrop = true;
                continue;
            }

            if (areNpcSkillsMet(npcName, ctx)) {
                hasSkillMetDrop = true;
            } else {
                hasUnmetSkillDrop = true;
            }
        }

        if (hasSkillMetDrop) {
            return { rank: 5, name };
        }

        if (hasNoSkillDrop) {
            return { rank: 6, name };
        }

        if (hasUnmetSkillDrop) {
            return { rank: 7, name };
        }
    }

    // ================================================================
    // Rank 9: Unobtainable
    // ================================================================
    return { rank: 9, name };
}