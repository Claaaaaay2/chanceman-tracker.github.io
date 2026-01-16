function hasItem(ctx, id, options = {}) {
    const item = ctx.items.find(i => i.id === id);
    if (!item) return false;
    const hasItemValue = ctx.rolled.includes(id) && ctx.obtained.includes(id);
    if (!hasItemValue && options.trackMissing !== false && ctx?.missing?.items) {
        ctx.missing.items.add(id);
    }
    return hasItemValue;
}

function addMissingItemGroup(ctx, ids) {
    if (!ctx?.missing) return;
    if (!ctx.missing.itemGroups) {
        ctx.missing.itemGroups = [];
    }
    if (!ctx.missing.itemGroupKeys) {
        ctx.missing.itemGroupKeys = new Set();
    }
    const key = [...ids].sort((a, b) => a - b).join(",");
    if (ctx.missing.itemGroupKeys.has(key)) return;
    ctx.missing.itemGroupKeys.add(key);
    ctx.missing.itemGroups.push(ids);
}

function hasAnyItems(ctx, ids) {
    for (const id of ids) {
        if (hasItem(ctx, id, { trackMissing: false })) {
            return true;
        }
    }
    addMissingItemGroup(ctx, ids);
    return false;
}

function allTrue(checks) {
    let ok = true;
    for (const check of checks) {
        if (!check) {
            ok = false;
        }
    }
    return ok;
}

function hasSkillLevel(ctx, skill, level, options = {}) {
    const overrideKey = options.overrideKey;
    if (overrideKey && ctx.filters?.[overrideKey]) return true;
    const current = ctx.player?.levels?.[skill] ?? 1;
    if (typeof current === "number" && current >= level) return true;
    if (ctx?.missing) {
        if (!ctx.missing.skills) {
            ctx.missing.skills = [];
        }
        if (!ctx.missing.skillKeys) {
            ctx.missing.skillKeys = new Set();
        }
        const key = `${skill} ${level}`;
        if (!ctx.missing.skillKeys.has(key)) {
            ctx.missing.skillKeys.add(key);
            ctx.missing.skills.push(key);
        }
    }
    return false;
}


export function has(ctx, id) {
    return hasItem(ctx, id);
}

function hasQuestPoints(ctx, required) {
    const current = ctx.player?.questPoints ?? 0;
    if (current >= required) return true;
    if (ctx?.missing) {
        const existing = ctx.missing.questPointsRequired ?? 0;
        if (required > existing) {
            ctx.missing.questPointsRequired = required;
            ctx.missing.questPointsCurrent = current;
        }
    }
    return false;
}

export const REQUIREMENT_CHECKS = {
    canCompleteDeviousMinds(ctx) {
        canCompleteDeviousMinds(ctx);
    },
    canCompleteGoblinDiplomacy(ctx) {
        return canCompleteGoblinDiplomacy(ctx);
    },
    canEnterCraftingGuild(ctx) {
        return canEnterCraftingGuild(ctx);
    },
    hasHighLevelHerb(ctx) {
        return has(ctx, 211)  // Grimy avantoe
            || has(ctx, 261)  // Avantoe
            || has(ctx, 213)  // Grimy kwuarm
            || has(ctx, 263)  // Kwuarm
            || has(ctx, 3051) // Grimy snapdragon
            || has(ctx, 3000) // Snapdragon
            || has(ctx, 215)  // Grimy cadantine
            || has(ctx, 265)  // Cadantine
            || has(ctx, 2485) // Grimy lantadyme
            || has(ctx, 2481) // Lantadyme
            || has(ctx, 217)  // Grimy dwarf weed
            || has(ctx, 267)  // Dwarf weed
            || has(ctx, 219)  // Grimy torstol
            || has(ctx, 269); // Torstol
    },
    canCompleteMisthalinMystery(ctx) {
        return canCompleteMisthalinMystery(ctx);
    },
    hasFishForFineOffcuts(ctx) {
        return has(ctx, 383)   // Raw shark
            || has(ctx, 395)   // Raw sea turtle
            || has(ctx, 13439) // Raw anglerfish
            || has(ctx, 11934) // Raw dark crab
            || has(ctx, 32325) // Raw yellowfin
            || has(ctx, 32333) // Raw halibut
            || has(ctx, 32341) // Raw bluefin
            || has(ctx, 31561) // Raw jumbo squid
            || has(ctx, 32349) // Raw marlin
            || has(ctx, 389);  // Raw manta ray
    },
    hasFishForOffcuts(ctx) {
        return has(ctx, 11328) // Leaping trout
            || has(ctx, 11330) // Leaping salmon
            || has(ctx, 11332) // Leaping sturgeon
            || has(ctx, 22826) // Bluegill
            || has(ctx, 22829) // Common tench
            || has(ctx, 22832) // Mottled eel
            || has(ctx, 22835) // Greater siren
            || has(ctx, 317)   // Raw shrimps
            || has(ctx, 321)   // Raw anchovies
            || has(ctx, 335)   // Raw trout
            || has(ctx, 331)   // Raw salmon
            || has(ctx, 377)   // Raw lobster
            || has(ctx, 341)   // Raw cod
            || has(ctx, 349)   // Raw pike
            || has(ctx, 353)   // Raw mackerel
            || has(ctx, 363)   // Raw bass
            || has(ctx, 345)   // Raw herring
            || has(ctx, 7944)  // Raw monkfish
            || has(ctx, 327)   // Raw sardine
            || has(ctx, 371)   // Raw swordfish
            || has(ctx, 32309) // Raw giant krill
            || has(ctx, 32317) // Raw haddock
            || has(ctx, 31553) // Raw swordtip squid
            || has(ctx, 359);  // Raw tuna
    },
    canCompleteTempleOfTheEye(ctx) {
        return canCompleteTempleOfTheEye(ctx);
    },
    has50HunterRumoursDone(ctx) {
        return (!ctx.filters?.isHunterRumourLocked && canTrainHunter(ctx)) //
            || ctx.filters?.hunterRumoursCompleted >= 50;
    },
    has25HunterRumoursDone(ctx) {
        return (!ctx.filters?.isHunterRumourLocked && canTrainHunter(ctx)) //
            || ctx.filters?.hunterRumoursCompleted >= 25;
    },
    canEnterNightmareZone(ctx) {
        return canEnterNightmareZone(ctx);
    },
    canCompleteRecruitmentDrive(ctx) {
        return canCompleteRecruitmentDrive(ctx);
    },
    canFillFishFoodBox(ctx) {
        return canFillFishFoodBox(ctx);
    },
    hasAnyFilledBowl(ctx) {
        return hasAnyFilledBowl(ctx);
    },
    hasAnyFilledVial(ctx) {
        return hasAnyFilledVial(ctx);
    },
    hasAnyFilledCup(ctx) {
        return hasAnyFilledCup(ctx);
    },
    hasAnyFilledBucket(ctx) {
        return hasAnyFilledBucket(ctx);
    },
    hasAnyFilledJug(ctx) {
        return hasAnyFilledJug(ctx);
    },
    hasAnyFilledPot(ctx) {
        return hasAnyFilledPot(ctx);
    },
    hasAnyAle(ctx) {
        return hasAnyAle(ctx);
    },
    canMakeSplitLog(ctx) {
        return canMakeSplitLog(ctx);
    },
    canCureYakHide(ctx) {
        return canCureYakHide(ctx);
    },
    canMakeYakhideArmour(ctx) {
        return canMakeYakhideArmour(ctx);
    },
    canMakeNeitiznotShield(ctx) {
        return canMakeNeitiznotShield(ctx);
    },
    hasAnyLog(ctx) {
        return hasAnyLog(ctx);
    },
    hasAnyFletchableLog(ctx) {
        return hasAnyFletchableLog(ctx);
    },
    canUseSilverSickle(ctx) {
        return canUseSilverSickle(ctx);
    },
    canCompleteRogueTrader(ctx) {
        return canCompleteRogueTrader(ctx);
    },
    canMakeWoodenCats(ctx) {
        return canMakeWoodenCats(ctx);
    },
    canGetWillowBlackjack(ctx) {
        return canGetWillowBlackjack(ctx);
    },
    hasAnyNormalCape(ctx) {
        return hasAnyItems(ctx, [
            1023,
            1007,
            1021,
            1019,
            1031,
            6959,
            1029,
            1027
        ]);
    },
    hasAnyCookedMeatFish(ctx) {
        return hasAnyCookedMeatFish(ctx);
    },
    hasAnyLeaves(ctx) {
        return hasAnyItems(ctx, [
            6020,
            6030,
            6028,
            6022,
            6024,
            6026
        ]);
    },
    hasAnyNails(ctx) {
        return hasAnyNails(ctx);
    },
    canMakeWoodenWorkbench(ctx) {
        return canTrainConstruction(ctx) //
            && hasAnyNails(ctx) //
            && has(ctx, 8794) // Saw
            && has(ctx, 2347) // Hammer
            && has(ctx, 960); // Plank
    },
    canMakeOakWorkbench(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 8778); // Oak plank
    },
    canMakeSteelFramedWorkbench(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 8778)  // Oak plank
            && has(ctx, 2353); // Steel bar
    },
    canMakeCraftingTableI(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 8778); // Oak plank
    },
    canMakeCraftingTableII(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 8778)  // Oak plank
            && has(ctx, 1775); // Molten glass
    },
    canMakeRepairBench(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 8778); // Oak plank
    },
    canMakeWhetstone(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 8778)  // Oak plank
            && has(ctx, 3420); // Limestone brick
    },
    canMakeArmourStand(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 8778)  // Oak plank
            && has(ctx, 3420); // Limestone brick
    },
    canMakeToolStore(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 8778); // Oak plank
    },
    canMakeWoodenLarder(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794) // Saw
            && has(ctx, 2347) // Hammer
            && hasAnyNails(ctx) //
            && has(ctx, 960); // Plank
    },
    canMakeOakLarder(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 8778); // Oak plank
    },
    canMakeTeakLarder(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 8790)  // Bolt of cloth
            && has(ctx, 8780); // Teak plank
    },
    canMakeWoodenShelvesI(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794) // Saw
            && has(ctx, 2347) // Hammer
            && hasAnyNails(ctx) //
            && has(ctx, 960); // Plank
    },
    canMakeWoodenShelvesII(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794) // Saw
            && has(ctx, 2347) // Hammer
            && hasAnyNails(ctx) //
            && has(ctx, 1761) // Soft clay
            && has(ctx, 960); // Plank
    },
    canMakeOakShelves(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 1761)  // Soft clay
            && has(ctx, 8778); // Oak plank
    },
    canMakeTeakShelvesI(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 1761)  // Soft clay
            && has(ctx, 8780); // Teak plank
    },
    canMakeTeakShelvesII(ctx) {
        return canTrainConstruction(ctx) //
            && has(ctx, 8794)  // Saw
            && has(ctx, 2347)  // Hammer
            && has(ctx, 1761)  // Soft clay
            && has(ctx, 8780)  // Teak plank
            && has(ctx, 8784); // Gold leaf
    },
    canCompleteTaiBwoWannaiTrio(ctx) {
        return canCompleteTaiBwoWannaiTrio(ctx);
    },
    canCompleteGertrudesCat(ctx) {
        return canCompleteGertrudesCat(ctx);
    },
    canCompleteGhostsAhoy(ctx) {
        return canCompleteGhostsAhoy(ctx);
    },
    canCompleteHazeelCult(ctx) {
        return canCompleteHazeelCult(ctx);
    },
    canCompleteHisFaithfulServants(ctx) {
        return canCompleteHisFaithfulServants(ctx);
    },
    canCompleteDeathOnTheIsle(ctx) {
        return true;
    },
    canCompleteFightArena(ctx) {
        return true;
    },
    canCompleteHolyGrail(ctx) {
        return canCompleteHolyGrail(ctx);
    },
    canCompleteHopespearsWill(ctx) {
        return canCompleteHopespearsWill(ctx);
    },
    canCompleteLandOfTheGoblins(ctx) {
        return canCompleteLandOfTheGoblins(ctx);
    },
    canCompleteMageArenaI(ctx) {
        return canCompleteMageArenaI(ctx);
    },
    canCompleteMageArenaII(ctx) {
        return canCompleteMageArenaII(ctx);
    },
    canCompleteMakingHistory(ctx) {
        return canCompleteMakingHistory(ctx);
    },
    canCompleteMeatAndGreet(ctx) {
        return canCompleteMeatAndGreet(ctx);
    },
    canGetKPSpears(ctx) {
        return canGetKPSpears(ctx);
    },
    canGetKarambwanVessel(ctx) {
        return canGetKarambwanVessel(ctx);
    },
    canCompleteDragonSlayerII(ctx) {
        return canCompleteDragonSlayerII(ctx);
    },
    canCompleteDragonSlayerI(ctx) {
        return canCompleteDragonSlayerI(ctx);
    },
    canCompleteDesertTreasureII(ctx) {
        return canCompleteDesertTreasureII(ctx);
    },
    canCompleteDesertTreasureI(ctx) {
        return canCompleteDesertTreasureI(ctx);
    },
    canCompleteRatcatchers(ctx) {
        return canCompleteRatcatchers(ctx);
    },
    canCompleteMyArmsBigAdventure(ctx) {
        return canCompleteMyArmsBigAdventure(ctx);
    },
    canCompleteInAidOfTheMyreque(ctx) {
        return canCompleteInAidOfTheMyreque(ctx);
    },
    canCompleteShadowsOfCustodia(ctx) {
        return canCompleteShadowsOfCustodia(ctx);
    },
    canCompleteSongOfTheElves(ctx) {
        return canCompleteSongOfTheElves(ctx);
    },
    canCompleteWhileGuthixSleeps(ctx) {
        return canCompleteWhileGuthixSleeps(ctx);
    },
    canCompleteTheGreatBrainRobbery(ctx) {
        return canCompleteTheGreatBrainRobbery(ctx);
    },
    canCompleteEthicallyAcquiredAntiquities(ctx) {
        return canCompleteEthicallyAcquiredAntiquities(ctx);
    },
    canCompleteBlackKnightsFortress(ctx) {
        return canCompleteBlackKnightsFortress(ctx);
    },
    canCompleteBiohazard(ctx) {
        return canCompleteBiohazard(ctx);
    },
    canCompleteClientOfKourend(ctx) {
        return canCompleteClientOfKourend(ctx);
    },
    canCompleteCurseOfTheEmptyLord(ctx) {
        return canCompleteCurseOfTheEmptyLord(ctx);
    },
    canCompleteBearYourSoul(ctx) {
        return canCompleteBearYourSoul(ctx);
    },
    canCompleteFishingContest(ctx) {
        return canCompleteFishingContest(ctx);
    },
    canCompleteInSearchOfKnowledge(ctx) {
        return canCompleteInSearchOfKnowledge(ctx);
    },
    canCompleteKingsRansom(ctx) {
        return canCompleteKingsRansom(ctx);
    },
    canCompleteLairOfTarnRazorlor(ctx) {
        return canCompleteLairOfTarnRazorlor(ctx);
    },
    canCompleteIntoTheTombs(ctx) {
        return canCompleteIntoTheTombs(ctx);
    },
    canCompleteTheGeneralsShadow(ctx) {
        return canCompleteTheGeneralsShadow(ctx);
    },
    canCompleteValeTotems(ctx) {
        return canDoValeTotems(ctx);
    },
    canCompleteVampyreSlayer(ctx) {
        return canCompleteVampyreSlayer(ctx);
    },
    canCompleteWitchsPotion(ctx) {
        return canCompleteWitchsPotion(ctx);
    },
    canCompleteXMarksTheSpot(ctx) {
        return canCompleteXMarksTheSpot(ctx);
    },
    canStartATasteOfHope(ctx) {
        return canStartATasteOfHope(ctx);
    },
    canCompleteATasteOfHope(ctx) {
        return canCompleteATasteOfHope(ctx);
    },
    canCompleteTrollStronghold(ctx) {
        return canCompleteTrollStronghold(ctx);
    },
    canCompleteSinsOfTheFather(ctx) {
        return canCompleteSinsOfTheFather(ctx);
    },
    canCompleteWhatLiesBelow(ctx) {
        return canCompleteWhatLiesBelow(ctx);
    },
    canStartMageArenaII(ctx) {
        return canStartMageArenaII(ctx);
    },
    canCompleteErnestTheChicken(ctx) {
        return canCompleteErnestTheChicken(ctx);
    },
    canCompleteTheFremennikExiles(ctx) {
        return canCompleteTheFremennikExiles(ctx);
    },
    canCompleteCabinFever(ctx) {
        return canCompleteCabinFever(ctx);
    },
    canCompleteWanted(ctx) {
        return canCompleteWanted(ctx);
    },
    canCompleteTheFinalDawn(ctx) {
        return canCompleteTheFinalDawn(ctx);
    },
    canCompleteShadesOfMortton(ctx) {
        return canCompleteShadesOfMortton(ctx);
    },
    canCompleteSleepingGiants(ctx) {
        return canCompleteSleepingGiants(ctx);
    },
    canCompleteBelowIceMountain(ctx) {
        return canCompleteBelowIceMountain(ctx);
    },
    canCompleteAKingdomDivided(ctx) {
        return canCompleteAKingdomDivided(ctx);
    },
    canCompleteTaleOfTheRighteous(ctx) {
        return canCompleteTaleOfTheRighteous(ctx);
    },
    canCompleteTheSlugMenace(ctx) {
        return canCompleteTheSlugMenace(ctx);
    },
    canCompleteTreeGnomeVillage(ctx) {
        return canCompleteTreeGnomeVillage(ctx);
    },
    canCompleteMountainDaughter(ctx) {
        return canCompleteMountainDaughter(ctx);
    },
    canCompleteAPorcineOfInterest(ctx) {
        return canCompleteAPorcineOfInterest(ctx);
    },
    canCompleteTempleOfIkov(ctx) {
        return canCompleteTempleOfIkov(ctx);
    },
    canCompleteInSearchOfTheMyreque(ctx) {
        return canCompleteInSearchOfTheMyreque(ctx);
    },
    canCompleteTheCorsairCurse(ctx) {
        return canCompleteTheCorsairCurse(ctx);
    },
    hasNarwhalKnife(ctx) {
        return hasNarwhalKnife(ctx);
    },
    canCompleteTheEyesOfGlouphrie(ctx) {
        return canCompleteTheEyesOfGlouphrie(ctx);
    },
    canCompleteCreatureOfFenkenstrain(ctx) {
        return canCompleteCreatureOfFenkenstrain(ctx);
    },
    canStartHazeelCult(ctx) {
        return ctx.player.quests["Hazeel Cult"] < 2;
    },
    canCompleteRFDAnotherCooksQuest(ctx) {
        return canCompleteRFDAnotherCooksQuest(ctx);
    },
    canCompleteRFDFreeingTheMountainDwarf(ctx) {
        return canCompleteRFDFreeingTheMountainDwarf(ctx);
    },
    canCompleteRFDFreeingTheGoblinGenerals(ctx) {
        return canCompleteRFDFreeingTheGoblinGenerals(ctx);
    },
    canCompleteRFDFreeingPiratePete(ctx) {
        return canCompleteRFDFreeingPiratePete(ctx);
    },
    canCompleteRFDFreeingTheLumbridgeGuide(ctx) {
        return canCompleteRFDFreeingTheLumbridgeGuide(ctx);
    },
    canCompleteRFDFreeingEvilDave(ctx) {
        return canCompleteRFDFreeingEvilDave(ctx);
    },
    canCompleteRFDFreeingSkrachUglologwee(ctx) {
        return canCompleteRFDFreeingSkrachUglologwee(ctx);
    },
    canCompleteRFDFreeingSirAmikVarse(ctx) {
        return canCompleteRFDFreeingSirAmikVarse(ctx);
    },
    canCompleteRFDFreeingKingAwowogei(ctx) {
        return canCompleteRFDFreeingKingAwowogei(ctx);
    },
    canCompleteRecipeForDisasterCulinaromancer(ctx) {
        return canCompleteRecipeForDisasterCulinaromancer(ctx);
    },
    canCompleteTheEnchantedKey(ctx) {
        return canCompleteTheEnchantedKey(ctx);
    },
    canCompleteTheGardenOfDeath(ctx) {
        return canCompleteTheGardenOfDeath(ctx);
    },
    canCompleteShiloVillage(ctx) {
        return canCompleteShiloVillage(ctx);
    },
    canEnterLumbridgeSwampCaves(ctx) {
        return canEnterLumbridgeSwampCaves(ctx);
    },
    canCompleteMakingFriendsWithMyArm(ctx) {
        return canCompleteMakingFriendsWithMyArm(ctx);
    },
    canCompleteSwanSong(ctx) {
        return canCompleteSwanSong(ctx);
    },
    canCompleteGrimTales(ctx) {
        return canCompleteGrimTales(ctx);
    },
    canCompleteObservatoryQuest(ctx) {
        return canCompleteObservatoryQuest(ctx);
    },
    canCompleteBetweenARock(ctx) {
        return canCompleteBetweenARock(ctx);
    },
    canGetGoutweed(ctx) {
        return canGetGoutweed(ctx);
    },
    canCompleteRegicide(ctx) {
        return canCompleteRegicide(ctx);
    },
    canCompleteTheAscentOfArceuus(ctx) {
        return canCompleteTheAscentOfArceuus(ctx);
    },
    canCompleteOlafsQuest(ctx) {
        return canCompleteOlafsQuest(ctx);
    },
    canCompleteDefenderOfVarrock(ctx) {
        return canCompleteDefenderOfVarrock(ctx);
    },
    canCompleteTheCurseOfArrav(ctx) {
        return canCompleteTheCurseOfArrav(ctx);
    },
    canCompleteDreamMentor(ctx) {
        return canCompleteDreamMentor(ctx);
    },
    canCompleteTrollRomance(ctx) {
        return canCompleteTrollRomance(ctx);
    },
    canCompleteRovingElves(ctx) {
        return canCompleteRovingElves(ctx);
    },
    canEnterTheChampionsGuild(ctx) {
        return hasQuestPoints(ctx, 32);
    },
    canStartDragonSlayerI(ctx) {
        return canStartDragonSlayerI(ctx);
    },
    canStartMourningsEndPartI(ctx) {
        return canStartMourningsEndPartI(ctx);
    },
    canCompleteMourningsEndPartI(ctx) {
        return canCompleteMourningsEndPartI(ctx);
    },
    canCompleteMourningsEndPartII(ctx) {
        return canCompleteMourningsEndPartII(ctx);
    },
    has50JunkItems(ctx) {
        return has50JunkItems(ctx);
    },
    canStartDarknessOfHallowvale(ctx) {
        return canStartDarknessOfHallowvale(ctx);
    },
    canCompleteDarknessOfHallowvale(ctx) {
        return canCompleteDarknessOfHallowvale(ctx);
    },
    canCompleteGardenOfTranquillity(ctx) {
        return canCompleteGardenOfTranquillity(ctx);
    },
    canCompleteLostCity(ctx) {
        return canCompleteLostCity(ctx);
    },
    canAccessChampionsGuild(ctx) {
        return hasQuestPoints(ctx, 32);
    },
    canCompleteShadowOfTheStorm(ctx) {
        return canCompleteShadowOfTheStorm(ctx);
    },
    canCompleteASoulsBane(ctx) {
        return canCompleteASoulsBane(ctx);
    },
    canCompleteMerlinsCrystal(ctx) {
        return canCompleteMerlinsCrystal(ctx);
    },
    canCompletePlagueCity(ctx) {
        return canCompletePlagueCity(ctx);
    },
    canCompleteGettingAhead(ctx) {
        return canCompleteGettingAhead(ctx);
    },
    canCompleteTheFremennikTrials(ctx) {
        return canCompleteTheFremennikTrials(ctx);
    },
    canCompleteTheFeud(ctx) {
        return canCompleteTheFeud(ctx);
    },
    canCompleteTheFremennikIsles(ctx) {
        return canCompleteTheFremennikIsles(ctx);
    },
    canCompletePrinceAliRescue(ctx) {
        return canCompletePrinceAliRescue(ctx);
    },
    canCompleteTowerOfLife(ctx) {
        return canCompleteTowerOfLife(ctx);
    },
    canCompleteEnlightenedJourney(ctx) {
        return canCompleteEnlightenedJourney(ctx);
    },
    canAccessCooksGuild(ctx) {
        return (has(ctx, 1949) || has(ctx, 20205)) && canTrainCooking(ctx);
    },
    canCompleteRumDeal(ctx) {
        return canCompleteRumDeal(ctx);
    },
    canCompleteTheGiantDwarf(ctx) {
        return canCompleteTheGiantDwarf(ctx);
    },
    canCompleteAnotherSliceOfHAM(ctx) {
        return canCompleteAnotherSliceOfHAM(ctx);
    },
    canCompleteHorrorFromTheDeep(ctx) {
        return canCompleteHorrorFromTheDeep(ctx);
    },
    canCompleteNatureSpirit(ctx) {
        return canCompleteNatureSpirit(ctx);
    },
    canCompleteSecretsOfTheNorth(ctx) {
        return canCompleteSecretsOfTheNorth(ctx);
    },
    canCompleteLunarDiplomacy(ctx) {
        return canCompleteLunarDiplomacy(ctx);
    },
    canReachLunarIsle(ctx) {
        return canReachLunarIsle(ctx);
    },
    canReachPiratesCove(ctx) {
        return canReachPiratesCove(ctx);
    },
    canCompleteEaglesPeak(ctx) {
        return canCompleteEaglesPeak(ctx);
    },
    canCompleteUndergroundPass(ctx) {
        return canCompleteUndergroundPass(ctx);
    },
    canCompleteWatchtower(ctx) {
        return canCompleteWatchtower(ctx);
    },
    canCompleteFairytaleIICureAQueen(ctx) {
        return canCompleteFairytaleIICureAQueen(ctx);
    },
    canCompleteRecipeForDisaster(ctx) {
        return canCompleteRecipeForDisaster(ctx);
    },
    canCompleteRecipeForDisaster0(ctx) {
        return canCompleteRecipeForDisaster0(ctx);
    },
    canCompleteRecipeForDisaster1(ctx) {
        return canCompleteRecipeForDisaster1(ctx);
    },
    canCompleteRecipeForDisaster2(ctx) {
        return canCompleteRecipeForDisaster2(ctx);
    },
    canCompleteRecipeForDisaster3(ctx) {
        return canCompleteRecipeForDisaster3(ctx);
    },
    canCompleteRecipeForDisaster4(ctx) {
        return canCompleteRecipeForDisaster4(ctx);
    },
    canCompleteRecipeForDisaster5(ctx) {
        return canCompleteRecipeForDisaster5(ctx);
    },
    canCompleteRecipeForDisaster6(ctx) {
        return canCompleteRecipeForDisaster6(ctx);
    },
    canCompleteRecipeForDisaster7(ctx) {
        return canCompleteRecipeForDisaster7(ctx);
    },
    canCompleteRecipeForDisaster8(ctx) {
        return canCompleteRecipeForDisaster8(ctx);
    },
    canCompleteEnakhrasLament(ctx) {
        return canCompleteEnakhrasLament(ctx);
    },
    canCompleteScorpionCatcher(ctx) {
        return canCompleteScorpionCatcher(ctx);
    },
    canCompleteTheGrandTree(ctx) {
        return canCompleteTheGrandTree(ctx);
    },
    canEnterBraindeathIsland(ctx) {
        return canEnterBraindeathIsland(ctx);
    },
    canDoMixology(ctx) {
        return canDoMixology(ctx);
    },
    canDoMageTrainingArena(ctx) {
        return canDoMageTrainingArena(ctx);
    },
    canCompleteVarrockDiaryEasy(ctx) {
        return ctx.player.achievementDiaries.Varrock.Easy.complete;
    },
    canCompleteVarrockDiaryMedium(ctx) {
        return ctx.player.achievementDiaries.Varrock.Medium.complete;
    },
    canCompleteVarrockDiaryHard(ctx) {
        return ctx.player.achievementDiaries.Varrock.Hard.complete;
    },
    canCompleteVarrockDiaryElite(ctx) {
        return ctx.player.achievementDiaries.Varrock.Elite.complete;
    },
    canCompleteWildernessDiaryEasy(ctx) {
        return ctx.player.achievementDiaries.Wilderness.Easy.complete;
    },
    canCompleteWildernessDiaryMedium(ctx) {
        return ctx.player.achievementDiaries.Wilderness.Medium.complete;
    },
    canCompleteWildernessDiaryHard(ctx) {
        return ctx.player.achievementDiaries.Wilderness.Hard.complete;
    },
    canCompleteWildernessDiaryElite(ctx) {
        return ctx.player.achievementDiaries.Wilderness.Elite.complete;
    },
    canDoTombsOfAmascut(ctx) {
        return canDoTombsOfAmascut(ctx);
    },
    canCompleteHeroesQuest(ctx) {
        return canCompleteHeroesQuest(ctx);
    },
    canCompleteRuneMysteries(ctx) {
        return canCompleteRuneMysteries(ctx);
    },
    canBirdSnare(ctx) {
        return canBirdSnare(ctx);
    },
    canNooseWand(ctx) {
        return canNooseWand(ctx);
    },
    canCatchImplingsInJars(ctx) {
        return canCatchImplingsInJars(ctx);
    },
    canDeadfallTrap(ctx) {
        return canDeadfallTrap(ctx);
    },
    canPitfallTrap(ctx) {
        return canPitfallTrap(ctx);
    },
    canCatchSalamanders(ctx) {
        return canCatchSalamanders(ctx);
    },
    canCatchCrabs(ctx) {
        return canCatchCrabs(ctx);
    },
    canCatchButterflies(ctx) {
        return canCatchButterflies(ctx);
    },
    hasRabbitSnare(ctx) {
        return has(ctx, 10031);
    },
    hasBoxTrap(ctx) {
        return has(ctx, 10008);
    },
    canCompleteTheFrozenDoor(ctx) {
        return canCompleteTheFrozenDoor(ctx);
    },
    canStartPerilousMoons(ctx) {
        return canStartPerilousMoons(ctx);
    },
    canCompleteFairytaleIGrowingPains(ctx) {
        return canCompleteFairytaleIGrowingPains(ctx)
    },
    canCompleteBoneVoyage(ctx) {
        return canCompleteBoneVoyage(ctx);
    },
    canGet50Kudos(ctx) {
        return canGet50Kudos(ctx);
    },
    canGet153Kudos(ctx) {
        return canGet153Kudos(ctx);
    },
    canCompleteShieldOfArrav(ctx) {
        return canCompleteShieldOfArrav(ctx);
    },
    canCompleteSheepHerder(ctx) {
        return canCompleteSheepHerder(ctx);
    },
    canCompleteScrambled(ctx) {
        return canCompleteScrambled(ctx);
    },
    canCompleteChildrenOfTheSun(ctx) {
        return canCompleteChildrenOfTheSun(ctx);
    },
    canCompleteTheRestlessGhost(ctx) {
        return canCompleteTheRestlessGhost(ctx);
    },
    canCompleteRomeoAndJuliet(ctx) {
        return canCompleteRomeoAndJuliet(ctx);
    },
    canCompleteRagAndBoneManI(ctx) {
        return canCompleteRagAndBoneManI(ctx);
    },
    canCompleteRagAndBoneManII(ctx) {
        return canCompleteRagAndBoneManII(ctx);
    },
    canCompleteTwilightsPromise(ctx) {
        return canCompleteTwilightsPromise(ctx);
    },
    canCompleteTheForsakenTower(ctx) {
        return canCompleteTheForsakenTower(ctx);
    },
    canCompleteTheDepthsOfDespair(ctx) {
        return canCompleteTheDepthsOfDespair(ctx);
    },
    canCompleteTearsOfGuthix(ctx) {
        return canCompleteTearsOfGuthix(ctx);
    },
    canCompleteSpiritsOfTheElid(ctx) {
        return canCompleteSpiritsOfTheElid(ctx);
    },
    canCompleteMurderMystery(ctx) {
        return canCompleteMurderMystery(ctx);
    },
    canCompleteMonksFriend(ctx) {
        return canCompleteMonksFriend(ctx);
    },
    canCompleteBigChompyBirdHunting(ctx) {
        return canCompleteBigChompyBirdHunting(ctx);
    },
    canCompleteTheGolem(ctx) {
        return canCompleteTheGolem(ctx);
    },
    canCompleteSheepShearer(ctx) {
        return canCompleteSheepShearer(ctx);
    },
    canCompleteATailOfTwoCats(ctx) {
        return canCompleteATailOfTwoCats(ctx);
    },
    canCompleteANightAtTheTheatre(ctx) {
        return canCompleteANightAtTheTheatre(ctx);
    },
    canCompleteThroneOfMiscellania(ctx) {
        return canCompleteThroneOfMiscellania(ctx);
    },
    hasLarransKey(ctx) {
        return has(ctx, 23490) && (ctx.filters.isIronman ? canTrainSlayer(ctx) : true);
    },
    canCompleteDeathPlateau(ctx) {
        return canCompleteDeathPlateau(ctx);
    },
    canCompleteJunglePotion(ctx) {
        return canCompleteJunglePotion(ctx);
    },
    canCompleteBeneathCursedSands(ctx) {
        return canCompleteBeneathCursedSands(ctx);
    },
    canCompleteTheHeartOfDarkness(ctx) {
        return canCompleteTheHeartOfDarkness(ctx);
    },
    canStartIcthlarinsLittleHelper(ctx) {
        return canStartIcthlarinsLittleHelper(ctx);
    },
    canCompleteIcthlarinsLittleHelper(ctx) {
        return canCompleteIcthlarinsLittleHelper(ctx);
    },
    canCompleteEadgarsRuse(ctx) {
        return canCompleteEadgarsRuse(ctx);
    },
    canCompleteCooksAssistant(ctx) {
        return canCompleteCooksAssistant(ctx);
    },
    canCompleteContact(ctx) {
        return canCompleteContact(ctx);
    },
    canCompleteClockTower(ctx) {
        return canCompleteClockTower(ctx);
    },
    canCompleteDruidicRitual(ctx) {
        return canCompleteDruidicRitual(ctx);
    },
    canCompleteDoricsQuest(ctx) {
        return canCompleteDoricsQuest(ctx);
    },
    canCompleteDemonSlayer(ctx) {
        return canCompleteDemonSlayer(ctx);
    },
    canCompleteCurrentAffairs(ctx) {
        return canCompleteCurrentAffairs(ctx);
    },
    canCompleteEnterTheAbyss(ctx) {
        return canCompleteEnterTheAbyss(ctx);
    },
    canCompleteForgettableTale(ctx) {
        return canCompleteForgettableTale(ctx);
    },
    canReachAbyssalSire(ctx) {
        return !ctx.filters.isSlayerLocked //
            && (canCompleteEnterTheAbyss(ctx)
                || canCompleteFairytaleIGrowingPains(ctx)
            );
    },
    canReachTrollheim(ctx) {
        return canReachTrollheim(ctx);
    },
    canGetBirdNestWyson(ctx) {
        return canGetBirdNestWyson(ctx);
    },
    canDoGuardiansOfTheRift(ctx) {
        return canDoGuardiansOfTheRift(ctx);
    },
    canTrainFarming(ctx) {
        return canTrainFarming(ctx);
    },
    canTrainFishing(ctx) {
        return canTrainFishing(ctx);
    },
    canTrainWoodcutting(ctx) {
        return canTrainWoodcutting(ctx);
    },
    canTrainMining(ctx) {
        return canTrainMining(ctx);
    },
    canTrainCooking(ctx) {
        return canTrainCooking(ctx);
    },
    canDoGnomeRestaurant(ctx) {
        return canDoGnomeRestaurant(ctx);
    },
    canDoValeTotems(ctx) {
        return canDoValeTotems(ctx);
    },
    canDoWintertodt(ctx) {
        return canDoWintertodt(ctx);
    },
    canDoHallowedSepulchre(ctx) {
        return canCompleteSinsOfTheFather(ctx);
    },
    canDoSalvaging(ctx) {
        return canDoSalvaging(ctx);
    },
    canCompleteMonkeyMadnessII(ctx) {
        return canCompleteMonkeyMadnessII(ctx);
    },
    canCompleteMonkeyMadnessI(ctx) {
        return canCompleteMonkeyMadnessI(ctx);
    },
    canCompletePryingTimes(ctx) {
        return canCompletePryingTimes(ctx);
    },
    canCompleteWitchsHouse(ctx) {
        return canCompleteWitchsHouse(ctx);
    },
    canDoMahoganyHomes(ctx) {
        return canDoMahoganyHomes(ctx);
    },
    canCompleteOneSmallFavour(ctx) {
        return canCompleteOneSmallFavour(ctx);
    },
    canMakePotLids(ctx) {
        return canMakePotLids(ctx);
    },
    canMakeAirtightPot(ctx) {
        return canMakeAirtightPot(ctx);
    },
    canMakeGuthixRests(ctx) {
        return canMakeGuthixRests(ctx);
    },
    canCompletePriestInPeril(ctx) {
        return canCompletePriestInPeril(ctx);
    },
    canCompleteZogreFleshEaters(ctx) {
        return canCompleteZogreFleshEaters(ctx);
    },
    canStartZogreFleshEaters(ctx) {
        return canStartZogreFleshEaters(ctx);
    },
    canEnterKaruulmSlayerDungeon(ctx) {
        return canEnterKaruulmSlayerDungeon(ctx);
    },
    canCompleteTheHandInTheSand(ctx) {
        return canCompleteTheHandInTheSand(ctx);
    },
    canCompleteWaterfallQuest(ctx) {
        return canCompleteWaterfallQuest(ctx);
    },
    hasSardine(ctx) {
        return has(ctx, 327);
    },
    hasRedSpidersEggs(ctx) {
        return has(ctx, 223);
    },
    hasMoleParts(ctx) {
        return has(ctx, 7418) || has(ctx, 7416);
    },
    hasSinisterKey(ctx) {
        return has(ctx, 993);
    },
    hasEyeOfNewt(ctx) {
        return has(ctx, 221);
    },
    hasOpal(ctx) {
        return has(ctx, 1625) || has(ctx, 1609);
    },
    hasFeather(ctx) {
        return has(ctx, 314);
    },
    hasFacemask(ctx) {
        return has(ctx, 4164);
    },
    hasUnlitBugLantern(ctx) {
        return has(ctx, 7051);
    },
    hasBagOfSalt(ctx) {
        return has(ctx, 4161);
    },
    hasBrineSabre(ctx) {
        return has(ctx, 11037);
    },
    canKillGargoyles(ctx) {
        return canKillGargoyles(ctx);
    },
    canKillDifficultDragons(ctx) {
        return canKillDifficultDragons(ctx);
    },
    canKillFossilIslandWyverns(ctx) {
        return canKillFossilIslandWyverns(ctx);
    },
    hasAccessToWyvernProtection(ctx) {
        return hasAccessToWyvernProtection(ctx);
    },
    canTrainFletching(ctx) {
        return canTrainFletching(ctx);
    },
    canFishKarambwan(ctx) {
        return canFishKarambwan(ctx);
    },
    canTrainSmithing(ctx) {
        return canTrainSmithing(ctx);
    },
    canCompleteDwarfCannon(ctx) {
        return canCompleteDwarfCannon(ctx);
    },
    canCompleteTheKnightsSword(ctx) {
        return canCompleteTheKnightsSword(ctx);
    },
    canCompleteBarbarianTraining(ctx) {
        return canCompleteBarbarianTraining(ctx);
    },
    canCompleteTheRestlessGhost(ctx) {
        return true;
    },
    canCompleteTheRibbitingTaleOfALilyPadLabourDispute(ctx) {
        return canCompleteTheRibbitingTaleOfALilyPadLabourDispute(ctx);
    },
    canCompleteAlfredGrimhandsBarcrawl(ctx) {
        return canCompleteAlfredGrimhandsBarcrawl(ctx);
    },
    canCompleteAnExistentialCrisis(ctx) {
        return canCompleteAnExistentialCrisis(ctx);
    },
    canCompleteImpendingChaos(ctx) {
        return canCompleteImpendingChaos(ctx);
    },
    canCompleteBurialAtSea(ctx) {
        return canCompleteBurialAtSea(ctx);
    },
    canCompleteTheRedReef(ctx) {
        return canCompleteTheRedReef(ctx);
    },
    canCompleteFamilyPest(ctx) {
        return canCompleteFamilyPest(ctx);
    },
    canCompleteTroubledTortugans(ctx) {
        return canCompleteTroubledTortugans(ctx);
    },
    canLongrange(ctx) {
        return canLongrange(ctx);
    },
    canCastStrikeSpells(ctx) {
        return canCastStrikeSpells(ctx);
    },
    canShortrange(ctx) {
        return canShortrange(ctx);
    },
    canSailToTheNorthernOcean(ctx) {
        return canSailToTheNorthernOcean(ctx);
    },
    canDoSailingCombat(ctx) {
        return canDoSailingCombat(ctx);
    },
    canEnterTheCharredDungeon(ctx) {
        return canEnterTheCharredDungeon(ctx);
    },
    canSailToBrittleIsle(ctx) {
        return canSailToBrittleIsle(ctx);
    },
    canSailToGrimstone(ctx) {
        return canSailToGrimstone(ctx);
    },
    canEnterAncientCavern(ctx) {
        return canEnterAncientCavern(ctx);
    },
    canEnterKalphiteLair(ctx) {
        return canEnterKalphiteLair(ctx);
    },
    canCompleteRoyalTrouble(ctx) {
        return canCompleteRoyalTrouble(ctx);
    },
    canCompleteTheTouristTrap(ctx) {
        return canCompleteTheTouristTrap(ctx);
    },
    canCompletePandemonium(ctx) {
        return canCompletePandemonium(ctx);
    },
    canCompleteEnchantedKey(ctx) {
        return canCompleteMakingHistory(ctx);
    },
    canStartLegendsQuest(ctx) {
        return canStartLegendsQuest(ctx);
    },
    canReachKharaziJungle(ctx) {
        return canReachKharaziJungle(ctx);
    },
    canEnterHardwoodGrove(ctx) {
        return canEnterHardwoodGrove(ctx);
    },
    canStartTheQueenOfThieves(ctx) {
        return canStartTheQueenOfThieves(ctx);
    },
    canCompleteTheQueenOfThieves(ctx) {
        canCompleteTheQueenOfThieves(ctx);
    },
    canCompleteTribalTotem(ctx) {
        return true;
    },
    canCompleteThePathOfGlouphrie(ctx) {
        return canCompleteThePathOfGlouphrie(ctx);
    },
    canCompleteSeaSlug(ctx) {
        return canCompleteSeaSlug(ctx);
    },
    canCompleteDaddysHome(ctx) {
        return canCompleteDaddysHome(ctx);
    },
    canCompleteSkippyAndTheMogres(ctx) {
        return canCompleteSkippyAndTheMogres(ctx);
    },
    canCompleteLegendsQuest(ctx) {
        return canCompleteLegendsQuest(ctx);
    },
    canCompleteFamilyCrest(ctx) {
        return canCompleteFamilyCrest(ctx);
    },
    canDoYama(ctx) {
        return canCompleteAKingdomDivided(ctx);
    },
    canDoNex(ctx) {
        return canCompleteTheFrozenDoor(ctx);
    },
    canCompleteTheFrozenDoor(ctx) {
        return canCompleteTheFrozenDoor(ctx);
    },
    canDoZulrah(ctx) {
        return canDoZulrah(ctx);
    },
    canStartAtFirstLight(ctx) {
        return canStartAtFirstLight(ctx);
    },
    canCompleteAtFirstLight(ctx) {
        return canCompleteAtFirstLight(ctx);
    },
    canCompleteColdWar(ctx) {
        return canCompleteColdWar(ctx);
    },
    canDoHuntersRumours(ctx) {
        return canTrainHunter(ctx);
    },
    canTrainHunter(ctx) {
        return canTrainHunter(ctx);
    },
    canCompleteTheDigSite(ctx) {
        return canCompleteTheDigSite(ctx);
    },
    canCompleteAnimalMagnetism(ctx) {
        return canCompleteAnimalMagnetism(ctx);
    },
    canCompleteDeathToTheDorgeshuun(ctx) {
        return canCompleteDeathToTheDorgeshuun(ctx);
    },
    canCompleteTheLostTribe(ctx) {
        return canCompleteTheLostTribe(ctx);
    },
    canCompletePerilousMoons(ctx) {
        return canCompletePerilousMoons(ctx);
    },
    canCompletePiratesTreasure(ctx) {
        return canCompletePiratesTreasure(ctx);
    },
    canFishFromRewardPool(ctx) {
        return canFishFromRewardPool(ctx);
    },
    canReachGemRocks(ctx) {
        return canReachGemRocks(ctx);
    },
    hasRawSwordfish(ctx) {
        return has(ctx, 371);
    },
    hasRawChicken(ctx) {
        return has(ctx, 2138);
    },
    hasCowhide(ctx) {
        return has(ctx, 1739);
    },
    hasUnicornHorn(ctx) {
        return has(ctx, 237);
    },
    hasGiantFrogLegs(ctx) {
        return has(ctx, 4517);
    },
    hasRawCaveEel(ctx) {
        return has(ctx, 5001);
    },
    hasRawJubbly(ctx) {
        return has(ctx, 7566);
    },
    hasRawLobster(ctx) {
        return has(ctx, 377);
    },
    hasBirdhouse(ctx) {
        return has(ctx, 21512);
    },
    hasMagicBirdhouse(ctx) {
        return has(ctx, 22201);
    },
    hasMahoganyBirdhouse(ctx) {
        return has(ctx, 22195);
    },
    hasMapleBirdhouse(ctx) {
        return has(ctx, 22192);
    },
    hasOakBirdhouse(ctx) {
        return has(ctx, 21515);
    },
    hasRedwoodBirdhouse(ctx) {
        return has(ctx, 22204);
    },
    hasTeakBirdhouse(ctx) {
        return has(ctx, 21521);
    },
    hasWillowBirdhouse(ctx) {
        return has(ctx, 21518);
    },
    hasYewBirdhouse(ctx) {
        return has(ctx, 22198);
    },
    hasSteelArrow(ctx) {
        return has(ctx, 886);
    },
    hasMithrilArrow(ctx) {
        return has(ctx, 888);
    },
    hasSecateurs(ctx) {
        return has(ctx, 5329);
    },
    hasGardeningTrowel(ctx) {
        return has(ctx, 5325);
    },
    hasSaltpetre(ctx) {
        return has(ctx, 13421);
    },
    hasMuddyKey(ctx) {
        return has(ctx, 991);
    },
    canCompleteHauntedMine(ctx) {
        return canCompleteHauntedMine(ctx);
    },
    hasGrubbyKey(ctx) {
        return has(ctx, 23499);
    },
    hasLockpick(ctx) {
        return has(ctx, 1523);
    },
    hasSmallFishingNet(ctx) {
        return has(ctx, 303);
    },
    hasBigFishingNet(ctx) {
        return has(ctx, 305);
    },
    hasHarpoon(ctx) {
        return has(ctx, 311) || has(ctx, 10129) || has(ctx, 21028);
    },
    hasAnyLantern(ctx) {
        return hasAnyLantern(ctx);
    },
    hasFishingRod(ctx) {
        return has(ctx, 307);
    },
    hasFishingBait(ctx) {
        return has(ctx, 313);
    },
    hasSandworms(ctx) {
        return has(ctx, 13431);
    },
    hasLobsterPot(ctx) {
        return has(ctx, 301);
    },
    hasFlyFishingRod(ctx) {
        return has(ctx, 309);
    },
    hasAnyFeather(ctx) {
        return hasAnyFeather(ctx);
    },
    hasAnyFeatherButStripy(ctx) {
        return hasAnyFeatherButStripy(ctx);
    },
    hasStripyFeather(ctx) {
        return has(ctx, 10087);
    },
    hasDarkFishingBait(ctx) {
        return has(ctx, 11940);
    },
    hasKarambwanVesselBaited(ctx) {
        return has(ctx, 3159);
    },
    canCompleteElementalWorkshopI(ctx) {
        return canCompleteElementalWorkshopI(ctx);
    },
    canCompleteElementalWorkshopII(ctx) {
        return canCompleteElementalWorkshopII(ctx);
    },
    canCompleteImpCatcher(ctx) {
        return canCompleteImpCatcher(ctx);
    },
    canAerialFish(ctx) {
        return has(ctx, 11334) || has(ctx, 2162);
    },
    canBarbarianFish(ctx) {
        return has(ctx, 314) || has(ctx, 313) || has(ctx, 11324) || has(ctx, 11326);
    },
    canReachFrogSpawnSpot(ctx) {
        return canCompleteBelowIceMountain(ctx) || canEnterLumbridgeSwampCaves(ctx);
    },
    hasOgreCoffinKey(ctx) {
        return has(ctx, 4850);
    },
    hasZombiePirateKey(ctx) {
        return has(ctx, 29449);
    },
    hasMirrorShield(ctx) {
        return has(ctx, 4156);
    },
    hasSpinyHelmet(ctx) {
        return has(ctx, 4551);
    },
    hasNosePeg(ctx) {
        return has(ctx, 4168);
    },
    hasSlayerBell(ctx) {
        return has(ctx, 10952);
    },
    hasEarmuffs(ctx) {
        return has(ctx, 4166);
    },
    hasCrystalKey(ctx) {
        return has(ctx, 989);
    },
    hasMachete(ctx) {
        return hasMachete(ctx);
    },
    hasSpade(ctx) {
        return has(ctx, 952);
    },
    hasBucket(ctx) {
        return has(ctx, 1925);
    },
    hasAvantoeSeed(ctx) {
        return has(ctx, 5298);
    },
    hasCadantineSeed(ctx) {
        return has(ctx, 5301);
    },
    hasDwarfWeedSeed(ctx) {
        return has(ctx, 5303);
    },
    hasGuamSeed(ctx) {
        return has(ctx, 5291);
    },
    hasHarralanderSeed(ctx) {
        return has(ctx, 5294);
    },
    hasHuascaSeed(ctx) {
        return has(ctx, 30088);
    },
    hasIritSeed(ctx) {
        return has(ctx, 5297);
    },
    hasKwuarmSeed(ctx) {
        return has(ctx, 5299);
    },
    hasLantadymeSeed(ctx) {
        return has(ctx, 5302);
    },
    hasMarrentillSeed(ctx) {
        return has(ctx, 5292);
    },
    hasRanarrSeed(ctx) {
        return has(ctx, 5295);
    },
    hasSnapdragonSeed(ctx) {
        return has(ctx, 5300);
    },
    hasTarrominSeed(ctx) {
        return has(ctx, 5293);
    },
    hasToadflaxSeed(ctx) {
        return has(ctx, 5296);
    },
    hasTorstolSeed(ctx) {
        return has(ctx, 5304);
    },
    hasAvantoe(ctx) {
        return has(ctx, 261);
    },
    hasCadantine(ctx) {
        return has(ctx, 265);
    },
    hasDwarfWeed(ctx) {
        return has(ctx, 267);
    },
    hasGuam(ctx) {
        return has(ctx, 249);
    },
    hasHarralander(ctx) {
        return has(ctx, 255);
    },
    hasHuasca(ctx) {
        return has(ctx, 30097);
    },
    hasIrit(ctx) {
        return has(ctx, 259);
    },
    hasKwuarm(ctx) {
        return has(ctx, 263);
    },
    hasLantadyme(ctx) {
        return has(ctx, 2481);
    },
    hasMarrentill(ctx) {
        return has(ctx, 251);
    },
    hasRanarr(ctx) {
        return has(ctx, 257);
    },
    hasSnapdragon(ctx) {
        return has(ctx, 3000);
    },
    hasTarromin(ctx) {
        return has(ctx, 253);
    },
    hasToadflax(ctx) {
        return has(ctx, 2998);
    },
    hasTorstol(ctx) {
        return has(ctx, 269);
    },
    hasWillowSapling(ctx) {
        return has(ctx, 5371);
    },
    hasOakSapling(ctx) {
        return has(ctx, 5370);
    },
    hasYewSapling(ctx) {
        return has(ctx, 5373);
    },
    hasMapleSapling(ctx) {
        return has(ctx, 5372);
    },
    hasMagicSapling(ctx) {
        return has(ctx, 5374);
    },
    hasRedwoodSapling(ctx) {
        return has(ctx, 22859);
    },
    hasTeakSapling(ctx) {
        return has(ctx, 21477);
    },
    hasMahoganySapling(ctx) {
        return has(ctx, 21480);
    },
    hasCamphorSapling(ctx) {
        return has(ctx, 31502);
    },
    hasIronwoodSapling(ctx) {
        return has(ctx, 31505);
    },
    hasRosewoodSapling(ctx) {
        return has(ctx, 31508);
    },
    hasBananaSapling(ctx) {
        return has(ctx, 5497);
    },
    hasAppleSapling(ctx) {
        return has(ctx, 5496);
    },
    hasCurrySapling(ctx) {
        return has(ctx, 5499);
    },
    hasOrangeSapling(ctx) {
        return has(ctx, 5498);
    },
    hasPalmSapling(ctx) {
        return has(ctx, 5502);
    },
    hasPapayaSapling(ctx) {
        return has(ctx, 5501);
    },
    hasPineappleSapling(ctx) {
        return has(ctx, 5500);
    },
    hasDragonfruitSapling(ctx) {
        return has(ctx, 22866);
    },
    hasCelastrusSapling(ctx) {
        return has(ctx, 22856);
    },
    hasGrapeSeed(ctx) {
        return has(ctx, 13657);
    },
    hasMarigoldSeed(ctx) {
        return has(ctx, 5096);
    },
    hasNasturtiumSeed(ctx) {
        return has(ctx, 5098);
    },
    hasRosemarySeed(ctx) {
        return has(ctx, 5097);
    },
    hasWoadSeed(ctx) {
        return has(ctx, 5099);
    },
    hasLimpwurtSeed(ctx) {
        return has(ctx, 5100);
    },
    hasPotatoSeed(ctx) {
        return has(ctx, 5318);
    },
    hasOnionSeed(ctx) {
        return has(ctx, 5319);
    },
    hasCabbageSeed(ctx) {
        return has(ctx, 5324);
    },
    hasTomatoSeed(ctx) {
        return has(ctx, 5322);
    },
    hasSweetcornSeed(ctx) {
        return has(ctx, 5320);
    },
    hasStrawberrySeed(ctx) {
        return has(ctx, 5323);
    },
    hasWatermelonSeed(ctx) {
        return has(ctx, 5321);
    },
    hasSnapeGrassSeed(ctx) {
        return has(ctx, 22879);
    },
    hasBarleySeed(ctx) {
        return has(ctx, 5305);
    },
    hasJuteSeed(ctx) {
        return has(ctx, 5306);
    },
    hasHammerstoneSeed(ctx) {
        return has(ctx, 5307);
    },
    hasAsgarnianSeed(ctx) {
        return has(ctx, 5308);
    },
    hasYanillianSeed(ctx) {
        return has(ctx, 5309);
    },
    hasKrandorianSeed(ctx) {
        return has(ctx, 5310);
    },
    hasWildbloodSeed(ctx) {
        return has(ctx, 5311);
    },
    hasRedberrySeed(ctx) {
        return has(ctx, 5101);
    },
    hasCadavaberrySeed(ctx) {
        return has(ctx, 5102);
    },
    hasDwellberrySeed(ctx) {
        return has(ctx, 5103);
    },
    hasJangerberrySeed(ctx) {
        return has(ctx, 5104);
    },
    hasWhiteberrySeed(ctx) {
        return has(ctx, 5105);
    },
    hasPoisonIvySeed(ctx) {
        return has(ctx, 5106);
    },
    hasMushroomSpore(ctx) {
        return has(ctx, 5282);
    },
    hasSeaweedSpore(ctx) {
        return has(ctx, 21490);
    },
    hasCactusSeed(ctx) {
        return has(ctx, 5280);
    },
    hasPotatoCactusSeed(ctx) {
        return has(ctx, 22873);
    },
    hasCalquatSapling(ctx) {
        return has(ctx, 5503);
    },
    hasWhiteLilySeed(ctx) {
        return has(ctx, 22887);
    },
    hasCottonSeed(ctx) {
        return has(ctx, 31545);
    },
    hasHempSeed(ctx) {
        return has(ctx, 31543);
    },
    hasElkhornFrag(ctx) {
        return has(ctx, 31511);
    },
    hasPillarFrag(ctx) {
        return has(ctx, 31513);
    },
    hasUmbralFrag(ctx) {
        return has(ctx, 31515);
    },
    hasCupOfTea(ctx) {
        return hasCupOfTea(ctx);
    },
    hasLeatherGloves(ctx) {
        return has(ctx, 1059);
    },
    hasSlashWeapon(ctx) {
        return hasSlashWeapon(ctx);
    },
    hasSlashWeaponOrKnife(ctx) {
        return hasSlashWeaponOrKnife(ctx);
    },
    hasDriftNet(ctx) {
        return has(ctx, 21652);
    },
    hasNumulite(ctx) {
        return has(ctx, 21555);
    },
    hasHammer(ctx) {
        return has(ctx, 2347);
    },
    hasOyster(ctx) {
        return has(ctx, 407);
    },
    hasRope(ctx) {
        return has(ctx, 954);
    },
    hasCasket(ctx) {
        return has(ctx, 405);
    },
    hasPoison(ctx) {
        return has(ctx, 273);
    },
    hasAnyGuthixBalance(ctx) {
        return hasAnyGuthixBalance(ctx);
    },
    hasAnySerum207(ctx) {
        return hasAnySerum207(ctx);
    },
    canPlantTrees(ctx) {
        return canPlantTrees(ctx);
    },
    canPlantHardwoodTrees(ctx) {
        return canPlantHardwoodTrees(ctx);
    },
    canPlantPlants(ctx) {
        return canPlantPlants(ctx);
    },
    hasHunterMeat(ctx) {
        return hasHunterMeat(ctx);
    },
    hasAirRuneSource(ctx) {
        return hasAirRuneSource(ctx);
    },
    hasWaterRuneSource(ctx) {
        return hasWaterRuneSource(ctx);
    },
    hasEarthRuneSource(ctx) {
        return hasEarthRuneSource(ctx);
    },
    hasFireRuneSource(ctx) {
        return hasFireRuneSource(ctx);
    },
    canEnterGodWarsDungeon(ctx) {
        return canEnterGodWarsDungeon(ctx);
    },
    canDoCommanderZilyana(ctx) {
        return canDoCommanderZilyana(ctx);
    },
    canDoGeneralGraardor(ctx) {
        return canDoGeneralGraardor(ctx);
    },
    canDoKreearra(ctx) {
        return canDoKreearra(ctx);
    },
    canDoKrilTsutsaroth(ctx) {
        return canDoKrilTsutsaroth(ctx);
    },
    canDoNex(ctx) {
        return canDoNex(ctx);
    },
    canCompleteBarbarianHerblore(ctx) {
        return canCompleteBarbarianHerblore(ctx);
    },
    canCompleteBarbarianSmithing(ctx) {
        return canCompleteBarbarianSmithing(ctx);
    },
    canCompleteBarbarianFiremaking1(ctx) {
        return canCompleteBarbarianFiremaking1(ctx);
    },
    canCompleteBarbarianFiremaking2(ctx) {
        return canCompleteBarbarianFiremaking2(ctx);
    },
    canTrainHerblore(ctx) {
        return canTrainHerblore(ctx);
    },
    canTrainPrayer(ctx) {
        return canTrainPrayer(ctx);
    },
    canTrainCrafting(ctx) {
        return canTrainCrafting(ctx);
    },
    canTrainFiremaking(ctx) {
        return canTrainFiremaking(ctx);
    },
    canBurnLoarShades(ctx) {
        return canBurnLoarShades(ctx);
    },
    canBurnPhrinShades(ctx) {
        return canBurnPhrinShades(ctx);
    },
    canBurnRiylShades(ctx) {
        return canBurnRiylShades(ctx);
    },
    canBurnAsynShades(ctx) {
        return canBurnAsynShades(ctx);
    },
    canBurnFiyrShades(ctx) {
        return canBurnFiyrShades(ctx);
    },
    canBurnUriumShades(ctx) {
        return canBurnUriumShades(ctx);
    },
    hasFremennikTrialsStartingOres(ctx) {
        return hasFremennikTrialsStartingOres(ctx);
    },
    canUseFairyRings(ctx) {
        return canCompleteFairytaleIGrowingPains(ctx);
    },
    hasBlightedIceSack(ctx) {
        return has(ctx, 24607);
    },
    hasIceBarrageRunes(ctx) {
        return hasWaterRuneSource(ctx) //
            && has(ctx, 560)  // Death rune
            && has(ctx, 565); // Blood rune
    },
    hasFaladorTeleportRunes(ctx) {
        return hasWaterRuneSource(ctx) //
            && hasAirRuneSource(ctx) //
            && has(ctx, 563); // Law rune
    },
    hasVarrockTeleportRunes(ctx) {
        return hasFireRuneSource(ctx) //
            && hasAirRuneSource(ctx) //
            && has(ctx, 563); // Law rune
    },
    hasLumbridgeTeleportRunes(ctx) {
        return hasEarthRuneSource(ctx) //
            && hasAirRuneSource(ctx) //
            && has(ctx, 563); // Law rune
    },
    hasCamelotTeleportRunes(ctx) {
        return hasAirRuneSource(ctx) //
            && has(ctx, 563); // Law rune
    },
    hasTrollheimTeleportRunes(ctx) {
        return hasFireRuneSource(ctx) //
            && has(ctx, 563); // Law rune
    },
    hasWaterbirthIslandTeleportRunes(ctx) {
        return hasWaterRuneSource(ctx) //
            && has(ctx, 9075) // Astral rune
            && has(ctx, 563); // Law rune
    },
    hasCatherbyTeleportRunes(ctx) {
        return hasWaterRuneSource(ctx) //
            && has(ctx, 9075) // Astral rune
            && has(ctx, 563); // Law rune
    },
    hasGhorrockTeleportRunes(ctx) {
        return hasWaterRuneSource(ctx) //
            && has(ctx, 563); // Law rune
    },
    hasHumidifyRunes(ctx) {
        return hasWaterRuneSource(ctx) //
            && hasFireRuneSource(ctx) //
            && has(ctx, 9075); // Astral rune
    },
    hasTelegrabRunes(ctx) {
        return hasTelegrabRunes(ctx);
    },
    hasChargeWaterOrbRunes(ctx) {
        return has(ctx, 564) // Cosmic rune
            && hasWaterRuneSource(ctx);
    },
    hasChargeEarthOrbRunes(ctx) {
        return has(ctx, 564) // Cosmic rune
            && hasEarthRuneSource(ctx);
    },
    hasChargeAirOrbRunes(ctx) {
        return has(ctx, 564) // Cosmic rune
            && hasAirRuneSource(ctx);
    },
    hasMonsterExamineRunes(ctx) {
        return has(ctx, 564)  // Cosmic rune
            && has(ctx, 9075) // Astral rune
            && has(ctx, 558); // Mind rune
    },
    hasApeAtollTeleportRunes(ctx) {
        return hasFireRuneSource(ctx) //
            && hasWaterRuneSource(ctx) //
            && has(ctx, 563); // Law rune
    },
    hasApeAtollStandardTeleportRunes(ctx) {
        return (has(ctx, 566) || has(ctx, 30843)) // Soul rune or Aether rune
            && has(ctx, 565)  // Blood rune
            && has(ctx, 563); // Law rune
    },
    hasLvl4EnchantRunes(ctx) {
        return (has(ctx, 564) || has(ctx, 30843)) // Cosmic rune or Aether rune
            && hasEarthRuneSource(ctx);
    },
    hasTeleportToPaddewwaRunes(ctx) {
        return hasFireRuneSource(ctx) //
            && hasAirRuneSource(ctx) //
            && has(ctx, 563); // Law rune
    },
    hasPlankMakeRunes(ctx) {
        return has(ctx, 9075) // Astral rune
            && has(ctx, 561); // Nature rune
    },
    canCastFertileSoil(ctx) {
        return has(ctx, 561)  // Nature rune
            && has(ctx, 9075) // Astral rune
            && hasEarthRuneSource(ctx);
    },
    canEnterMindAltar(ctx) {
        return canEnterMindAltar(ctx);
    },
    canEnterAirAltar(ctx) {
        return canEnterAirAltar(ctx);
    },
    canEnterWaterAltar(ctx) {
        return canEnterWaterAltar(ctx);
    },
    canEnterEarthAltar(ctx) {
        return canEnterEarthAltar(ctx);
    },
    canEnterChaosAltar(ctx) {
        return canEnterChaosAltar(ctx);
    },
    canEnterNatureAltar(ctx) {
        return canEnterNatureAltar(ctx);
    },
    canEnterFireAltar(ctx) {
        return canEnterFireAltar(ctx);
    },
    canEnterCosmicAltar(ctx) {
        return canEnterCosmicAltar(ctx);
    },
    canGetFishbowlWithWater(ctx) {
        return canGetFishbowlWithWater(ctx);
    },
    canKillMogreSailing(ctx) {
        return canKillMogreSailing(ctx);
    },
    hasBonesForBonesToPeaches(ctx) {
        return hasBonesForBonesToPeaches(ctx);
    },
    hasAFullBarrowsSet(ctx) {
        return hasAFullBarrowsSet(ctx);
    },
    never(ctx) {
        return false;
    }
};

function hasAFullBarrowsSet(ctx) {
    return (has(ctx, 4757) && has(ctx, 4755) && has(ctx, 4753) && has(ctx, 4759)) //
        || (has(ctx, 4708) && has(ctx, 4712) && has(ctx, 4714) && has(ctx, 4710)) //
        || (has(ctx, 4732) && has(ctx, 4736) && has(ctx, 4738) && has(ctx, 4734)) //
        || (has(ctx, 4716) && has(ctx, 4720) && has(ctx, 4722) && has(ctx, 4718)) //
        || (has(ctx, 4745) && has(ctx, 4749) && has(ctx, 4751) && has(ctx, 4747)) //
        || (has(ctx, 4724) && has(ctx, 4728) && has(ctx, 4730) && has(ctx, 4726));
}

function hasBonesForBonesToPeaches(ctx) {
    return has(ctx, 526)  // Bones
        || has(ctx, 528)  // Burnt bones
        || has(ctx, 530)  // Bat bones
        || canBurnLoarShades(ctx) // For bleached bones from Undead zealots
        || has(ctx, 3125) // Jogre bones
        || has(ctx, 2859) // Wolf bones
        || has(ctx, 3183) // Monkey bones
        || has(ctx, 532); // Big bones
}

function canGetFishbowlWithWater(ctx) {
    return (canTrainSlayer(ctx) || ctx.player.levels.Slayer >= 32) //
        || has(ctx, 6667); // Empty fishbowl
}

function canKillMogreSailing(ctx) {
    return (canTrainSlayer(ctx) || ctx.player.levels.Slayer >= 32) //
        || (canShortrange(ctx) || canDoSailingCombat(ctx));
}

function canEnterMindAltar(ctx) {
    return canCompleteEnterTheAbyss(ctx) //
        || has(ctx, 1448) // Mind talisman
        || has(ctx, 5529) // Mind tiara
        || canDoGuardiansOfTheRift(ctx);
}

function canEnterAirAltar(ctx) {
    return canCompleteEnterTheAbyss(ctx) //
        || has(ctx, 1438) // Air talisman
        || has(ctx, 5527) // Air tiara
        || canDoGuardiansOfTheRift(ctx);
}

function canEnterWaterAltar(ctx) {
    return canCompleteEnterTheAbyss(ctx) //
        || has(ctx, 1444) // Water talisman
        || has(ctx, 5531) // Water tiara
        || canDoGuardiansOfTheRift(ctx);
}

function canEnterEarthAltar(ctx) {
    return canCompleteEnterTheAbyss(ctx) //
        || has(ctx, 1440) // Earth talisman
        || has(ctx, 5535) // Earth tiara
        || canDoGuardiansOfTheRift(ctx);
}

function canEnterChaosAltar(ctx) {
    return canCompleteEnterTheAbyss(ctx) //
        || has(ctx, 1452) // Chaos talisman
        || has(ctx, 5543) // Chaos tiara
        || canDoGuardiansOfTheRift(ctx);
}

function canEnterNatureAltar(ctx) {
    return canCompleteEnterTheAbyss(ctx) //
        || has(ctx, 1462) // Nature talisman
        || has(ctx, 5541) // Nature tiara
        || canDoGuardiansOfTheRift(ctx);
}

function canEnterFireAltar(ctx) {
    return canCompleteEnterTheAbyss(ctx) //
        || has(ctx, 1442) // Fire talisman
        || has(ctx, 5537) // Fire tiara
        || canDoGuardiansOfTheRift(ctx);
}

function canEnterCosmicAltar(ctx) {
    return canCompleteEnterTheAbyss(ctx) //
        || has(ctx, 1454) // Cosmic talisman
        || has(ctx, 5539) // Cosmic tiara
        || canDoGuardiansOfTheRift(ctx);
}

function canDoTombsOfAmascut(ctx) {
    return canCompleteIntoTheTombs(ctx) //
        && canTrainMining(ctx);
}

function canDoMageTrainingArena(ctx) {
    return has(ctx, 564) // Cosmic rune
        && has(ctx, 561) // Nature rune
        && has(ctx, 563) // Law rune
        && hasAirRuneSource(ctx) //
        && hasWaterRuneSource(ctx) //
        && hasEarthRuneSource(ctx) //
        && hasFireRuneSource(ctx);
}

function canCompleteBeneathCursedSands(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 62),
        hasSkillLevel(ctx, "Crafting", 55),
        hasSkillLevel(ctx, "Firemaking", 55),
        canCompleteContact(ctx), //
        canTrainCrafting(ctx), //
        canTrainFiremaking(ctx), //
        has(ctx, 453), // Coal
        has(ctx, 2351), // Iron bar
        has(ctx, 590), // Tinderbox
        has(ctx, 952), // Spade
        hasAnyItems(ctx, [2136, 2134, 2132, 2138, 3226, 25833, 1859, 9978]),
    ]);
}

function hasAnyFeather(ctx) {
    return hasAnyItems(ctx, [
        314,   // Feather
        10089, // Blue feather
        10091, // Orange feather
        10088, // Red feather
        10087, // Stripy feather
        10090  // Yellow feather
    ]);
}

function hasAnyFeatherButStripy(ctx) {
    return hasAnyItems(ctx, [
        314,   // Feather
        10089, // Blue feather
        10091, // Orange feather
        10088, // Red feather
        10090  // Yellow feather
    ]);
}

function hasAnyLantern(ctx) {
    return canTrainFiremaking(ctx) //
        && has(ctx, 590) // Tinderbox
        && (canDoGuardiansOfTheRift(ctx) //
            || has(ctx, 4548) // Bullseye lantern
            || has(ctx, 4532) // Candle lantern (black)
            || has(ctx, 4529) // Candle lantern (white)
            || has(ctx, 7051) // Unlit bug lantern
            || has(ctx, 4537) // Oil lantern
            || canCompleteDesertTreasureII(ctx) //
        );
}

function canCompleteContact(ctx) {
    return allTrue([
        canCompletePrinceAliRescue(ctx), //
        canCompleteIcthlarinsLittleHelper(ctx),
    ]); //
}

function canCompleteTowerOfLife(ctx) {
    return allTrue([
        canTrainConstruction(ctx), //
        has(ctx, 2347), // Hammer
        has(ctx, 8794), // Saw
        has(ctx, 1917),
    ]); // Beer
}

function canCompletePrinceAliRescue(ctx) {
    return allTrue([
        has(ctx, 1761), // Soft clay
        has(ctx, 1759), // Ball of wool
        has(ctx, 1765), // Yellow dye
        has(ctx, 1951), // Redberries
        has(ctx, 592), // Ashes
        hasAnyItems(ctx, [1929, 1937, 1921]),
        has(ctx, 1933), // Pot of flour
        has(ctx, 2349), // Bronze bar
        has(ctx, 1013), // Pink skirt
        has(ctx, 1917), // Beer
        has(ctx, 954),
    ]); //  Rope
}

function canCompleteHauntedMine(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Crafting", 35),
        canCompletePriestInPeril(ctx), //
        canTrainCrafting(ctx), //
        has(ctx, 1755),
    ]); // Chisel
}

function canEnterLumbridgeSwampCaves(ctx) {
    return has(ctx, 954) // Rope
        || canStartTheLostTribe(ctx) && canTrainMining(ctx);
}

function canStartTheLostTribe(ctx) {
    return canCompleteGoblinDiplomacy(ctx) //
        && canCompleteRuneMysteries(ctx);
}

function canStartMourningsEndPartI(ctx) {
    return ctx.player.levels.Ranged >= 60 //
        && ctx.player.levels.Thieving >= 50 //
        && canCompleteRovingElves(ctx) //
        && canCompleteBigChompyBirdHunting(ctx) //
        && canCompleteSheepHerder(ctx);
}

function canCompleteMourningsEndPartI(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Ranged", 60),
        hasSkillLevel(ctx, "Thieving", 50),
        canStartMourningsEndPartI(ctx), //
        has(ctx, 948), // Bear fur
        has(ctx, 950), // Silk
        has(ctx, 1763), // Red dye
        has(ctx, 1765), // Yellow dye
        has(ctx, 1771), // Green dye
        has(ctx, 1767), // Blue dye
        has(ctx, 1929), // Bucket of water
        has(ctx, 314), // Feather
        hasAnyItems(ctx, [2217, 2243]),
        has(ctx, 1513), // Magic logs
        has(ctx, 1741), // Leather
        has(ctx, 3216), // Barrel
        has(ctx, 453),
    ]); // Coal
}

function canCompleteMourningsEndPartII(ctx) {
    return allTrue([
        canCompleteMourningsEndPartI(ctx), //
        has(ctx, 1755), // Chisel
        has(ctx, 954), // Rope
        hasDeathTalismanSource(ctx),
    ]);
}

function hasDeathTalismanSource(ctx) {
    return has(ctx, 1456) // Death talisman
        || has(ctx, 5547) // Death tiara
        || canDoGuardiansOfTheRift(ctx) // For Catalytic talisman
        || ctx.player.levels.Runecraft >= 99
        || has50JunkItems(ctx)
}

function has50JunkItems(ctx) {
    return has(ctx, 534)  // Babydragon bones
        && has(ctx, 1759) // Ball of wool
        && has(ctx, 2349) // Bronze bar
        && has(ctx, 1139) // Bronze med helm
        && has(ctx, 1927) // Bucket of milk
        && has(ctx, 1887) // Cake tin
        && has(ctx, 1985) // Cheese
        && has(ctx, 1755) // Chisel
        && has(ctx, 2142) // Cooked meat
        && has(ctx, 1944) // Egg
        && has(ctx, 4164) // Facemask
        && has(ctx, 307)  // Fishing rod
        && has(ctx, 1779) // Flax
        && has(ctx, 1635) // Gold ring
        && has(ctx, 2347) // Hammer
        && has(ctx, 1349) // Iron axe
        && has(ctx, 4820) // Iron nails
        && has(ctx, 1267) // Iron pickaxe
        && has(ctx, 1993) // Jug of wine
        && has(ctx, 1971) // Kebab
        && has(ctx, 946)  // Knife
        && has(ctx, 1061) // Leather boots
        && has(ctx, 1059) // Leather gloves
        && has(ctx, 301)  // Lobster pot
        && has(ctx, 1523) // Lockpick
        && has(ctx, 1597) // Necklace mould
        && has(ctx, 1733) // Needle
        && has(ctx, 1521) // Oak logs
        && has(ctx, 2313) // Pie dish
        && has(ctx, 960)  // Plank
        && has(ctx, 1933) // Pot of flour
        && has(ctx, 3138) // Potato cactus
        && has(ctx, 5438) // Potatoes(10)
        && has(ctx, 7936) // Pure essence
        && has(ctx, 1951) // Redberries
        && has(ctx, 954)  // Rope
        && has(ctx, 1735) // Shears
        && has(ctx, 952)  // Spade
        && has(ctx, 1941) // Swamp paste
        && has(ctx, 1734) // Thread
        && has(ctx, 590)  // Tinderbox
        && has(ctx, 235)  // Unicorn horn dust
        && has(ctx, 227)  // Vial of water
        && has(ctx, 1005) // White apron
        && has(ctx, 239); // White berries
}

function canCompleteSheepHerder(ctx) {
    return true;
}

function canCompleteRovingElves(ctx) {
    return allTrue([
        canCompleteRegicide(ctx), //
        canCompleteWaterfallQuest(ctx), //
        has(ctx, 952), // Spade
        has(ctx, 954),
    ]); // Rope
}

function canCompleteRegicide(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Crafting", 10),
        hasSkillLevel(ctx, "Agility", 56),
        canCompleteUndergroundPass(ctx), //
        canTrainCrafting(ctx) //
        , // Bow and arrows needed, but thats a huge one... TODO
        has(ctx, 453), // Coal
        has(ctx, 954), // Rope
        has(ctx, 952), // Spade
        has(ctx, 3211), // Limestone
        has(ctx, 590), // Tinderbox
        has(ctx, 1759), // Ball of wool
        has(ctx, 233), // Pestle and mortar
        has(ctx, 1931), // Pot
        hasAnyItems(ctx, [3228, 7223]),
    ]); // Roast rabbit
}

function canCompleteEaglesPeak(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Hunter", 27),
        has(ctx, 1765), // Yellow dye
        has(ctx, 1939),
    ]); // Swamp tar
}

function canCompleteWatchtower(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Magic", 14),
        hasSkillLevel(ctx, "Thieving", 15),
        hasSkillLevel(ctx, "Agility", 25),
        hasSkillLevel(ctx, "Herblore", 14),
        hasSkillLevel(ctx, "Mining", 40),
        canTrainHerblore(ctx), //
        canTrainMining(ctx), //
        has(ctx, 560), // Death rune
        has(ctx, 2357), // Gold bar
        has(ctx, 536), // Dragon bones
        has(ctx, 954), // Rope
        has(ctx, 91), // Guam potion (unf)
        has(ctx, 233), // Pestle and mortar
        has(ctx, 530), // Bat bones
        has(ctx, 247),
    ]); // Jangerberries
}

function canCompleteUndergroundPass(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Ranged", 25),
        canCompleteBiohazard(ctx) //
        , // Bow and arrows needed, but thats a huge one... TODO
        has(ctx, 954), // Rope
        has(ctx, 952), // Spade
        has(ctx, 1925), // Bucket
        has(ctx, 590),
    ]); // Tinderbox
}

function canCompleteBelowIceMountain(ctx) {
    return allTrue([
        hasQuestPoints(ctx, 16), //
        has(ctx, 2142), // Cooked meat
        has(ctx, 2309), // Bread
        has(ctx, 946), // Knife
        hasAnyItems(ctx, [1917, 1905, 1913, 1907]),
    ]); // Beer, Asgarnian ale, Dwarven stout or Wizard's mind bomb
}

function canCompleteSleepingGiants(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Smithing", 15),
        canTrainSmithing(ctx), //
        hasAnyNails(ctx), //
        has(ctx, 2142), // Oak logs
        has(ctx, 2309), // Wool
        has(ctx, 2347), // Hammer
        has(ctx, 1755), // Chisel
        (has(ctx, 1929)  // Bucket of water
            || canTrainMining(ctx) // For Ice gloves
        ),
    ]);
}

function canCompleteTheFinalDawn(ctx) {
    return allTrue([
        canCompleteTheHeartOfDarkness(ctx), //
        canCompletePerilousMoons(ctx), //
        canTrainRunecraft(ctx), //
        canTrainFletching(ctx), //
        has(ctx, 946), // Knife
        has(ctx, 1917), // Beer
        hasAnyItems(ctx, [3183, 4834, 4832, 3123, 31726, 22124, 2859, 22780, 28899, 6812, 4812, 534, 530, 532, 526, 528, 6729, 536, 22783, 4830, 31729, 22786, 3125, 11943, 2136, 2134, 2132, 25833, 10816, 2142]),
    ]);
}

function canCompleteShadesOfMortton(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Crafting", 20),
        hasSkillLevel(ctx, "Herblore", 15),
        hasSkillLevel(ctx, "Firemaking", 5),
        canCompletePriestInPeril(ctx), //
        canTrainCrafting(ctx), //
        canTrainHerblore(ctx), //
        canTrainFiremaking(ctx), //
        has(ctx, 3410), // Serum 207 (3)
        has(ctx, 95), // Tarromin potion (unf) (might not be needed?)
        has(ctx, 592), // Ashes (might not be needed?)
        has(ctx, 590), // Tinderbox (might not be needed?)
        has(ctx, 1511), // Logs (might not be needed?)
        hasAnyItems(ctx, [2347, 3678]),
        hasAnyItems(ctx, [3438, 3440, 3442, 6211, 10808, 3444, 6213, 31383, 3446, 3448, 31386, 19672, 31389]),
        has(ctx, 3396),
    ]); // Loar remains
}

function canBurnLoarShades(ctx) {
    return canCompleteShadesOfMortton(ctx);
}

function canBurnPhrinShades(ctx) {
    return canBurnLoarShades(ctx) //
        && has(ctx, 3398); // Phrin remains
}

function canBurnRiylShades(ctx) {
    return canBurnPhrinShades(ctx) //
        && has(ctx, 3400) // Riyl remains
        && (
            has(ctx, 3442)     // Willow pyre logs
            || has(ctx, 6211)  // Teak pyre logs
            || has(ctx, 10808) // Arctic pyre logs
            || has(ctx, 3444)  // Maple pyre logs
            || has(ctx, 6213)  // Mahogany pyre logs
            || has(ctx, 31383) // Camphor pyre logs
            || has(ctx, 3446)  // Yew pyre logs
            || has(ctx, 3448)  // Magic pyre logs
            || has(ctx, 31386) // Ironwood pyre logs
            || has(ctx, 19672) // Redwood pyre logs
            || has(ctx, 31389) // Rosewood pyre logs
        );
}

function canBurnAsynShades(ctx) {
    return canBurnRiylShades(ctx) //
        && has(ctx, 3402) // Asyn remains
        && (
            has(ctx, 31383)    // Camphor pyre logs
            || has(ctx, 3446)  // Yew pyre logs
            || has(ctx, 3448)  // Magic pyre logs
            || has(ctx, 31386) // Ironwood pyre logs
            || has(ctx, 19672) // Redwood pyre logs
            || has(ctx, 31389) // Rosewood pyre logs
        );
}

function canBurnFiyrShades(ctx) {
    return canBurnAsynShades(ctx) //
        && has(ctx, 3404) // Fiyr remains
        && (
            has(ctx, 3448)     // Magic pyre logs
            || has(ctx, 31386) // Ironwood pyre logs
            || has(ctx, 19672) // Redwood pyre logs
            || has(ctx, 31389) // Rosewood pyre logs
        );
}

function canBurnUriumShades(ctx) {
    return canBurnFiyrShades(ctx) //
        && has(ctx, 25419) // Urium remains
        && (
            has(ctx, 19672) // Redwood pyre logs
            || has(ctx, 31389) // Rosewood pyre logs
        );
}

function hasCupOfTea(ctx) {
    return has(ctx, 1978) // Cup of tea
        || (has(ctx, 1980) && has(ctx, 1921)) // Empty cup and Bowl of water
}

function hasAnyGuthixBalance(ctx) {
    return hasAnyItems(ctx, [
        7660, // Guthix balance(4)
        7662, // Guthix balance(3)
        7664, // Guthix balance(2)
        7666  // Guthix balance(1)
    ]);
}

function hasAnySerum207(ctx) {
    return hasAnyItems(ctx, [
        3408, // Serum 207(4)
        3410, // Serum 207(3)
        3412, // Serum 207(2)
        3414  // Serum 207(1)
    ]);
}

function hasAirRuneSource(ctx) {
    return hasAnyItems(ctx, [
        556,   // Air rune
        4696,  // Dust rune
        4697,  // Smoke rune
        4695,  // Mist rune
        1381,  // Staff of air
        1397,  // Air battlestaff
        1405,  // Mystic air staff
        20736, // Dust battlestaff
        20739, // Mystic dust staff
        11998, // Smoke battlestaff
        12000, // Mystic smoke staff
        20730, // Mist battlestaff
        20733  // Mystic mist staff
    ]);
}

function hasWaterRuneSource(ctx) {
    return hasAnyItems(ctx, [
        555,   // Water rune
        4698,  // Mud rune
        4694,  // Steam rune
        4695,  // Mist rune
        1383,  // Staff of water
        1395,  // Water battlestaff
        1403,  // Mystic water staff
        6562,  // Mud battlestaff
        6563,  // Mystic mud staff
        11787, // Steam battlestaff
        11789, // Mystic steam staff
        20730, // Mist battlestaff
        20733  // Mystic mist staff
    ]) || (has(ctx, 25576) && has(ctx, 25578)); // Tome of water and Soaked page
}

function hasEarthRuneSource(ctx) {
    return hasAnyItems(ctx, [
        557,   // Earth rune
        4696,  // Dust rune
        4698,  // Mud rune
        4699,  // Lava rune
        1385,  // Staff of earth
        1399,  // Earth battlestaff
        1407,  // Mystic earth staff
        20736, // Dust battlestaff
        20739, // Mystic dust staff
        6562,  // Mud battlestaff
        6563,  // Mystic mud staff
        3053,  // Lava battlestaff
        3054   // Mystic lava staff
    ]) || (has(ctx, 30066) && has(ctx, 30068)); // Tome of earth and Soiled page
}

function hasFireRuneSource(ctx) {
    return hasAnyItems(ctx, [
        554,   // Fire rune
        4699,  // Lava rune
        4697,  // Smoke rune
        4694,  // Steam rune
        28929, // Sunfire rune
        1387,  // Staff of fire
        1393,  // Fire battlestaff
        1401,  // Mystic fire staff
        3053,  // Lava battlestaff
        3054,  // Mystic lava staff
        11998, // Smoke battlestaff
        12000, // Mystic smoke staff
        11787, // Steam battlestaff
        11789  // Mystic steam staff
    ]) || (has(ctx, 20716) && has(ctx, 20718)); // Tome of fire and Burnt page
}

function canReachTrollheim(ctx) {
    return canCompleteDeathPlateau(ctx) //
        || ctx.player?.combatAchievements.length >= 38;
}

function hasHunterMeat(ctx) {
    return has(ctx, 29104)
        || has(ctx, 29122)
        || has(ctx, 29101)
        || has(ctx, 29119)
        || has(ctx, 29125)
        || has(ctx, 29110)
        || has(ctx, 29116)
        || has(ctx, 29107)
        || has(ctx, 29113)
}

function canGetBirdNestWyson(ctx) {
    return has(ctx, 7418)  // Mole skin
        && has(ctx, 7416); // Mole claw
}

function hasRope(ctx) {
    return has(ctx, 954); // Rope
}

function hasHammer(ctx) {
    return has(ctx, 2347); // Hammer
}

function canEnterGodWarsDungeon(ctx) {
    return canReachTrollheim(ctx) //
        && hasRope(ctx);
}

function canDoCommanderZilyana(ctx) {
    return canEnterGodWarsDungeon(ctx) //
        && ctx.player.levels.Agility >= 70
        && hasRope(ctx);
}

function canDoGeneralGraardor(ctx) {
    return canEnterGodWarsDungeon(ctx) //
        && ctx.player.levels.Strength >= 70
        && hasGWDBandosAreaSuitableHammer(ctx);
}

function hasGWDBandosAreaSuitableHammer(ctx) {
    return ( // Any hammer/warhammer https://oldschool.runescape.wiki/w/Warhammer#Other_warhammers < these dont work
        hasHammer(ctx) //
        || has(ctx, 1345)  // Adamant warhammer
        || has(ctx, 1341)  // Black warhammer
        || has(ctx, 1337)  // Bronze warhammer
        || has(ctx, 13576) // Dragon warhammer
        || has(ctx, 1335)  // Iron warhammer
        || has(ctx, 1343)  // Mithril warhammer
        || has(ctx, 1347)  // Rune warhammer
        || has(ctx, 1339)  // Steel warhammer
        || has(ctx, 6613)  // White warhammer
        || has(ctx, 21003) // Elder maul
    );
}

function canDoKreearra(ctx) {
    return canEnterGodWarsDungeon(ctx) //
        && ctx.player.levels.Ranged >= 70
        && has(ctx, 9419); // Mith Grapple (phoenix crossbow is available)
}

function canDoKrilTsutsaroth(ctx) {
    return canEnterGodWarsDungeon(ctx) //
        && ctx.player.levels.Hitpoints >= 70;
}

function canDoNex(ctx) {
    return canCompleteTheFrozenDoor(ctx);
}

function canBirdSnare(ctx) {
    return canTrainHunter(ctx) //
        && has(ctx, 10006); // Bird snare
}

function canNooseWand(ctx) {
    return canTrainHunter(ctx) //
        && has(ctx, 10150); // Bird snare
}

function canCatchImplingsInJars(ctx) {
    return canTrainHunter(ctx) //
        && has(ctx, 10010)  // Butterfly net
        && has(ctx, 11260); // Impling jar
}

function canDeadfallTrap(ctx) {
    return canTrainHunter(ctx) //
        && has(ctx, 946) // Knife
        && hasAnyLog(ctx);
}

function hasAnyLog(ctx) {
    return has(ctx, 1511)  // Logs
        || has(ctx, 1521)  // Oak logs
        || has(ctx, 1519)  // Willow logs
        || has(ctx, 6333)  // Teak logs
        || has(ctx, 1517)  // Maple logs
        || has(ctx, 6332)  // Mahogany logs
        || has(ctx, 32904) // Camphor logs
        || has(ctx, 1515)  // Yew logs
        || has(ctx, 1513)  // Magic logs
        || has(ctx, 32907) // Ironwood logs
        || has(ctx, 32910) // Rosewood logs
        || has(ctx, 19669) // Redwood logs
        || canTrainWoodcutting(ctx); // for untradable Juniper logs
}

function canEnterCraftingGuild(ctx) {
    return canTrainCrafting(ctx) //
        && has(ctx, 20208) // Golden apron
        && has(ctx, 1757); // Brown apron
}

function canCompleteMisthalinMystery(ctx) {
    return allTrue([
        has(ctx, 1925), // Bucket
        has(ctx, 590), // Tinderbox
        has(ctx, 946),
    ]); //
}

function hasAnyFletchableLog(ctx) {
    return has(ctx, 1511)   // Logs
        || has(ctx, 1521)   // Oak logs
        || has(ctx, 1519)   // Willow logs
        || has(ctx, 1517)   // Maple logs
        || has(ctx, 1515)   // Yew logs
        || has(ctx, 1513)   // Magic logs
        || has(ctx, 19669); // Redwood logs
}

function canPitfallTrap(ctx) {
    return canTrainHunter(ctx) //
        && has(ctx, 946) // Knife
        && (has(ctx, 10029) || has(ctx, 29305)) // Teasing stick of Hunter's spear
        && (
            has(ctx, 1511)     // logs
            || has(ctx, 1521)  // Oak logs
            || has(ctx, 1519)  // Willow logs
            || has(ctx, 6333)  // Teak logs
            || has(ctx, 1517)  // Maple logs
            || has(ctx, 6332)  // Mahogany logs
            || has(ctx, 32904) // Camphor logs
            || has(ctx, 1515)  // Yew logs
            || has(ctx, 1513)  // Magic logs
            || has(ctx, 32907) // Ironwood logs
            || has(ctx, 32910) // Rosewood logs
            || canTrainWoodcutting(ctx) // for untradable Juniper logs
        );
}

function canCatchSalamanders(ctx) {
    return canTrainHunter(ctx) //
        && has(ctx, 954) // Rope
        && has(ctx, 303); // Small fishing net
}

function canCatchCrabs(ctx) {
    return canTrainConstruction(ctx) //
        && canTrainHunter(ctx) //
        && has(ctx, 2347)      // Hammer
        && has(ctx, 8794)      // Saw
        && has(ctx, 1925)      // Bucket
        && has(ctx, 960)       // Plank
        && hasAnyNails(ctx);
}

function canCatchButterflies(ctx) {
    return canTrainHunter(ctx) //
        && has(ctx, 10010)     // Butterfly net
        && has(ctx, 10012);    // Butterfly jar
}

function hasAnyNails(ctx) {
    return hasAnyItems(ctx, [
        4819,  // Bronze nails
        4820,  // Iron nails
        1539,  // Steel nails
        4821,  // Black nails
        4822,  // Mithril nails
        4823,  // Adamantite nails
        4824,  // Rune nails
        31406  // Dragon nails
    ]);
}

function canEnterKalphiteLair(ctx) {
    return has(ctx, 954); // Rope
}

function canEnterAncientCavern(ctx) {
    return canCompleteBarbarianFiremaking1(ctx);
}

function canCompleteBarbarianFiremaking1(ctx) {
    return allTrue([
        has(ctx, 1521), // Oak logs
        hasAnyItems(ctx, [841, 839, 843, 845, 849, 847, 853, 851, 857, 855, 861, 859]),
    ]);
}

function canCompleteBarbarianFiremaking2(ctx) {
    return allTrue([
        canCompleteBarbarianFiremaking1(ctx), //
        has(ctx, 590), // Tinderbox
        hasAnyLog(ctx),
    ]);
}

function canCompleteBarbarianFishing(ctx) {
    return canTrainFishing(ctx);
}

function canCompleteBarbarianHerblore(ctx) {
    return allTrue([
        canCompleteDruidicRitual(ctx), //
        canCompleteBarbarianFiremaking1(ctx), //
        canCompleteBarbarianFishing(ctx), //
        has(ctx, 123), // Attack potion(2)
        hasAnyItems(ctx, [11324, 11326]),
    ]); // Roe or Caviar
}

function canCompleteBarbarianSmithing(ctx) {
    return canCompleteBarbarianFishing(ctx) //
        && canCompleteTaiBwoWannaiTrio(ctx) //
        && canTrainSmithing(ctx) //
        && ( //
            (has(ctx, 2349) && has(ctx, 1511)) // Bronze bar & Logs
            || (has(ctx, 2351) && has(ctx, 1521)) // Iron bar & Oak Logs
            || (has(ctx, 2353) && has(ctx, 1519)) // Steel bar & Willow Logs
            || (has(ctx, 2359) && has(ctx, 1517)) // Mithril bar & Maple Logs
            || (has(ctx, 2361) && has(ctx, 1515)) // Adamantite bar & Yew Logs
            || (has(ctx, 2363) && has(ctx, 1513)) // Runite bar & Magic Logs
        )
}

function canFishKarambwan(ctx) {
    return canCompleteJunglePotion(ctx) //
        && has(ctx, 3157) // Karambwan vessel
        && has(ctx, 3159) // Karambwan vessel (baited)
        && has(ctx, 303); // Small fishing net
}

function canGetKarambwanVessel(ctx) {
    return canCompleteJunglePotion(ctx) //
        && has(ctx, 303); // Small fishing net
}

function canGetKPSpears(ctx) {
    return canCompleteJunglePotion(ctx) //
        && canTrainCooking(ctx) //
        && has(ctx, 303)  // Small fishing net
        && has(ctx, 3157) // Karambwan vessel
        && has(ctx, 3159) // Karambwan vessel (baited)
        && has(ctx, 3142) // Raw Karambwan
        // && has(ctx, 233) // Pestle and mortar not needed because crusher guy in Nardah
        && (
            has(ctx, 1237)    // Bronze spear
            && has(ctx, 1239) // Iron spear
            && has(ctx, 1241) // Steel spear
            && has(ctx, 1243) // Mithril spear
            && has(ctx, 1245) // Adamant spear
            && has(ctx, 1247) // Rune spear
            && has(ctx, 1249) // Dragon spear
        )
}

function canCompleteTaiBwoWannaiTrio(ctx) {
    return allTrue([
        canCompleteJunglePotion(ctx), //
        canTrainCooking(ctx), //
        hasSlashWeapon(ctx), //
        has(ctx, 3162), // Sliced banana
        has(ctx, 303)  // Small fishing net
        , // && has(ctx, 233) // Pestle and mortar not needed because crusher guy in Nardah
        has(ctx, 3032), // Agility potion(4)
        canShortrange(ctx), //
        has(ctx, 3125), // Jogre bones
        has(ctx, 401), // Seaweed
        (
            has(ctx, 1239)    // Iron spear
            && has(ctx, 1241) // Steel spear
            && has(ctx, 1243) // Mithril spear
            && has(ctx, 1245) // Adamant spear
            && has(ctx, 1247) // Rune spear
            && has(ctx, 1249) // Dragon spear
        ),
        has(ctx, 3157), // Karambwan vessel
        has(ctx, 3159), // Karambwan vessel (baited)
        has(ctx, 3142),
    ]); // Raw Karambwan
}

function canDoZulrah(ctx) {
    return canShortrange(ctx) //
        && canCompleteRegicide(ctx);
}

function canStartAtFirstLight(ctx) {
    return canTrainHunter(ctx) //
        && canTrainHerblore(ctx) //
        && canTrainConstruction(ctx) //
        && canCompleteEaglesPeak(ctx); //
}

function canCompleteAtFirstLight(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Hunter", 46),
        hasSkillLevel(ctx, "Herblore", 30),
        hasSkillLevel(ctx, "Construction", 27),
        canTrainHunter(ctx), //
        canTrainHerblore(ctx), //
        canTrainConstruction(ctx), //
        canCompleteEaglesPeak(ctx), //
        has(ctx, 4055), // Toy mouse (wound)
        has(ctx, 29166), // Jerboa tail
        has(ctx, 2347),
    ]); // Hammer
}

function canCompleteTheFrozenDoor(ctx) {
    return allTrue([
        canCompleteDesertTreasureI(ctx), //
        canDoKreearra(ctx), //
        canDoGeneralGraardor(ctx), //
        canDoCommanderZilyana(ctx), //
        canDoKrilTsutsaroth(ctx),
    ]);
}

function canCompleteMakingHistory(ctx) {
    return allTrue([
        canCompletePriestInPeril(ctx),
        has(ctx, 1694), // Sapphire amulet
        has(ctx, 952),
    ]); // Spade
}

function canCompleteMeatAndGreet(ctx) {
    return canCompleteChildrenOfTheSun(ctx);
}

function canSailToTheNorthernOcean(ctx) {
    return canCompletePandemonium(ctx) //
        && canTrainConstruction(ctx) //
        && has(ctx, 31435) // Ironwood plank
        && has(ctx, 4824)  // Rune nails
        && has(ctx, 32892) // Cupronickel bar
        && has(ctx, 22593) // Te salt
        && has(ctx, 22595) // Efh salt
        && has(ctx, 22597) // Urt salt
        && has(ctx, 2363); // Runite bar
}

function canSailToGrimstone(ctx) {
    return canSailToTheNorthernOcean(ctx);
}

function canSailToBrittleIsle(ctx) {
    return canSailToTheNorthernOcean(ctx);
}

function canEnterTheCharredDungeon(ctx) {
    return canCompletePandemonium(ctx) //
        && has(ctx, 954); // Rope
}

function canLongrange(ctx) {
    return (has(ctx, 882) || has(ctx, 884)) // Bronze arrow or Iron arrow (with cursed goblin bow)
        || has(ctx, 877) // Bronze bolts (with phoenix crossbow)
        || (hasAirRuneSource(ctx) //
            && (has(ctx, 558) || has(ctx, 562) || has(ctx, 560) || has(ctx, 565)) // Mind rune, Chaos rune, Death rune or Blood rune
        ); //
}

function canCastStrikeSpells(ctx) {
    return hasAirRuneSource(ctx) //
        && has(ctx, 558); // Mind rune
}

function canShortrange(ctx) {
    return canLongrange(ctx) //
        || has(ctx, 864)   // Bronze knife
        || has(ctx, 870)   // Bronze knife(p)
        || has(ctx, 863)   // Iron knife
        || has(ctx, 865)   // Steel knife
        || has(ctx, 869)   // Black knife
        || has(ctx, 866)   // Mithril knife
        || has(ctx, 867)   // Adamant knife
        || has(ctx, 868)   // Rune knife
        || has(ctx, 5667)  // Rune knife(p++)
        || has(ctx, 22804) // Dragon knife
        || has(ctx, 806)   // Bronze dart
        || has(ctx, 807)   // Iron dart
        || has(ctx, 813)   // Iron dart(p)
        || has(ctx, 808)   // Steel dart
        || has(ctx, 3093)  // Black dart
        || has(ctx, 809)   // Mithril dart
        || has(ctx, 810)   // Adamant dart
        || has(ctx, 816)   // Adamant dart(p)
        || has(ctx, 811)   // Rune dart
        || has(ctx, 817)   // Rune dart(p)
        || has(ctx, 11230) // Dragon dart
        || has(ctx, 6522)  // Toktz-xil-ul
        || has(ctx, 10033) // Chinchompa
        || has(ctx, 10034) // Red chinchompa
        || has(ctx, 11959) // Black chinchompa
        || has(ctx, 800)   // Bronze thrownaxe
        || has(ctx, 801)   // Iron thrownaxe
        || has(ctx, 802)   // Steel thrownaxe
        || has(ctx, 803)   // Mithril thrownaxe
        || has(ctx, 804)   // Adamant thrownaxe
        || has(ctx, 805)   // Rune thrownaxe
        || has(ctx, 20849);// Dragon thrownaxe
}

function canKillGargoyles(ctx) {
    return has(ctx, 4162)   // Rock hammer
        || has(ctx, 21754); // Rock thrownhammer
}

function canKillDifficultDragons(ctx) {
    return hasQuestPoints(ctx, 32);
}

function canEnterKaruulmSlayerDungeon(ctx) {
    return has(ctx, 23037)  // Boots of stone
        || has(ctx, 21643); // Granite boots
}

function canKillFossilIslandWyverns(ctx) {
    return canCompleteBoneVoyage(ctx) && hasAccessToWyvernProtection(ctx);
}

function hasAccessToWyvernProtection(ctx) {
    return canCompleteElementalWorkshopI(ctx) //
        && (has(ctx, 2890) // Elemental shield
            || (has(ctx, 9731) && canCompleteElementalWorkshopII(ctx)) // Mind shield
        );
}

function canCompleteAnimalMagnetism(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Slayer", 18),
        hasSkillLevel(ctx, "Crafting", 19),
        hasSkillLevel(ctx, "Ranged", 30),
        hasSkillLevel(ctx, "Woodcutting", 35),
        canCompleteErnestTheChicken(ctx), //
        canCompletePriestInPeril(ctx), //
        has(ctx, 1355), // Mithril axe
        has(ctx, 2351), // Iron bar
        has(ctx, 2347), // Hammer
        has(ctx, 1743), // Hard leather
        has(ctx, 1718), // Holy symbol
        has(ctx, 10496), // Polished buttons
        has(ctx, 1931),
    ]); // Pot
}

function canCompleteErnestTheChicken(ctx) {
    return allTrue([
        has(ctx, 952), // Spade
        has(ctx, 272), // Fish food
        has(ctx, 273),
    ]); // Poison (item)
}

function canCompleteDeathToTheDorgeshuun(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 23),
        hasSkillLevel(ctx, "Thieving", 23),
        canCompleteTheLostTribe(ctx), //
        has(ctx, 4310), // Ham boots
        has(ctx, 4304), // Ham cloak
        has(ctx, 4308), // Ham gloves
        has(ctx, 4302), // Ham hood
        has(ctx, 4306), // Ham logo
        has(ctx, 4300), // Ham robe
        has(ctx, 4298),
    ]); // Ham shirt
}

function canCompleteTheLostTribe(ctx) {
    return allTrue([
        canCompleteGoblinDiplomacy(ctx), //
        canCompleteRuneMysteries(ctx), //
        canTrainMining(ctx),
    ]); //
}

function canCompleteGoblinDiplomacy(ctx) {
    return allTrue([
        has(ctx, 288), // Goblin mail
        has(ctx, 1769), // Orange dye
        has(ctx, 1767),
    ]); // Blue dye
}

function canStartPerilousMoons(ctx) {
    return canCompleteTwilightsPromise(ctx) //
        && canTrainHunter(ctx) //
        && canTrainFishing(ctx) //
        && canTrainRunecraft(ctx) //
        && canTrainConstruction(ctx);
}

function canCompleteTwilightsPromise(ctx) {
    return canShortrange(ctx);
}

function canCompletePerilousMoons(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Slayer", 48),
        hasSkillLevel(ctx, "Hunter", 20),
        hasSkillLevel(ctx, "Fishing", 20),
        hasSkillLevel(ctx, "Runecraft", 20),
        hasSkillLevel(ctx, "Construction", 10),
        canStartPerilousMoons(ctx), //
        has(ctx, 946), // Knife
        has(ctx, 305), // Big fishing net
        has(ctx, 954), // Rope
        has(ctx, 233),
    ]); // Pestle and mortar
}

function canCompletePiratesTreasure(ctx) {
    return allTrue([
        has(ctx, 1005), // White apron
        has(ctx, 952), // Spade
        has(ctx, 1963),
    ]); // Banana
}

function canReachGemRocks(ctx) {
    return canCompletePandemonium(ctx) //
        || canCompleteShiloVillage(ctx) //
        || canReachLunarIsle(ctx);
}

function canCompleteLunarDiplomacy(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Herblore", 5),
        hasSkillLevel(ctx, "Crafting", 61),
        hasSkillLevel(ctx, "Defence", 40),
        hasSkillLevel(ctx, "Firemaking", 49),
        hasSkillLevel(ctx, "Magic", 65),
        hasSkillLevel(ctx, "Mining", 60),
        hasSkillLevel(ctx, "Woodcutting", 55),
        canCompleteTheFremennikTrials(ctx), //
        canCompleteLostCity(ctx), //
        canCompleteRuneMysteries(ctx), //
        canCompleteShiloVillage(ctx), //
        canTrainCrafting(ctx), //
        canTrainFiremaking(ctx), //
        canTrainMining(ctx), //
        canTrainWoodcutting(ctx), //
        has(ctx, 590), // Tinderbox
        has(ctx, 249), // Guam leaf
        has(ctx, 251), // Marrentill
        has(ctx, 233), // Pestle and mortar
        has(ctx, 2347), // Hammer
        has(ctx, 952), // Spade
        has(ctx, 4548), // Bullseye lantern
        (canDoGuardiansOfTheRift(ctx) //
            || canCompleteEnterTheAbyss(ctx) //
            || (
                (has(ctx, 1438) || has(ctx, 5527)) // Air talisman or Air tiara
                && (has(ctx, 1444) || has(ctx, 5531)) // Water talisman or Water tiara
                && (has(ctx, 1440) || has(ctx, 5535)) // Earth talisman or Earth tiara
                && (has(ctx, 1442) || has(ctx, 5537)) // Fire talisman or Fire tiara
            )
        ),
    ]);
}

function canReachLunarIsle(ctx) {
    return canReachPiratesCove(ctx) //
        && has(ctx, 590)   // Tinderbox
        && has(ctx, 4548); // Bullseye lantern
}

function canReachPiratesCove(ctx) {
    return canCompleteTheFremennikTrials(ctx) //
        && canCompleteLostCity(ctx) //
        && canCompleteRuneMysteries(ctx) //
        && canCompleteShiloVillage(ctx) //
        && canTrainCrafting(ctx) //
        && canTrainFiremaking(ctx) //
        && canTrainMining(ctx) //
        && canTrainWoodcutting(ctx); //
}

function canCompleteShiloVillage(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Crafting", 20),
        hasSkillLevel(ctx, "Agility", 32),
        canCompleteJunglePotion(ctx), //
        canTrainCrafting(ctx), //
        has(ctx, 952), // Spade
        has(ctx, 954), // Rope
        has(ctx, 1794), // Bronze wire
        has(ctx, 1755), // Chisel
        has(ctx, 526),
    ]); // Bones
}

function canFishFromRewardPool(ctx) {
    return has(ctx, 305)  // Big fishing net
        || has(ctx, 303); // Small fishing net
}

function canCompleteEnterTheAbyss(ctx) {
    return canCompleteRuneMysteries(ctx);
}

function canCompleteForgettableTale(ctx) {
    return allTrue([
        canCompleteTheGiantDwarf(ctx), //
        canCompleteFishingContest(ctx), //
        canTrainCooking(ctx), //
        canTrainFarming(ctx), //
        has(ctx, 6008), // Barley malt
        has(ctx, 1929), // Bucket of water
        has(ctx, 5341), // Rake
        has(ctx, 5767), // Ale yeast
        has(ctx, 1971), // Kebab
        has(ctx, 1917), // Beer
        has(ctx, 1919),
    ]); // Beer glass
}

function canCompleteRuneMysteries(ctx) {
    return has(ctx, 1438); // Air talisman
}

function canCompleteFairytaleIGrowingPains(ctx) {
    return allTrue([
        canCompleteLostCity(ctx), //
        canCompleteNatureSpirit(ctx), //
        has(ctx, 5329), // Secateurs
        has(ctx, 952)  // Spade
        , // TODO other item reqs?
    ]);
}

function canCompleteFairytaleIICureAQueen(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Thieving", 40),
        hasSkillLevel(ctx, "Farming", 49),
        hasSkillLevel(ctx, "Herblore", 57),
        canCompleteFairytaleIGrowingPains(ctx), //
        canTrainFarming(ctx), //
        canTrainHerblore(ctx), //
        has(ctx, 227),
    ]); // Vial of water
}

function canDoGuardiansOfTheRift(ctx) {
    return canCompleteTempleOfTheEye(ctx);
}

function canCompleteLostCity(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Crafting", 31),
        hasSkillLevel(ctx, "Woodcutting", 36),
        canTrainCrafting(ctx),
        has(ctx, 1351), // Bronze axe
        has(ctx, 946),
    ]); // Knife
}

function canCompleteNatureSpirit(ctx) {
    return allTrue([
        canCompletePriestInPeril(ctx), //
        canTrainCrafting(ctx), //
        hasAnyItems(ctx, [2970, 2974, 2972]),
        has(ctx, 2961), // Silver sickle
        has(ctx, 2355), // Silver bar
        has(ctx, 2976),
    ]); // Sickle mould
}

const DYES = [
    hasRedDye,
    hasYellowDye,
    hasBlueDye,
    hasGreenDye,
    hasPurpleDye,
    hasOrangeDye,
];

function hasRedDye(ctx) {
    return has(ctx, 1763);
}

function hasYellowDye(ctx) {
    return has(ctx, 1765);
}

function hasBlueDye(ctx) {
    return has(ctx, 1767);
}

function hasGreenDye(ctx) {
    return has(ctx, 1771);
}

function hasPurpleDye(ctx) {
    return has(ctx, 1773);
}

function hasOrangeDye(ctx) {
    return has(ctx, 1769);
}

function countDyes(ctx) {
    return DYES.filter(fn => fn(ctx)).length;
}

function canCompleteRogueTrader(ctx) {
    return allTrue([
        canCompleteTheFeud(ctx), //
        canCompleteRuneMysteries(ctx), //
        canCompleteIcthlarinsLittleHelper(ctx), //
        countDyes(ctx) >= 3, //
        hasAnyItems(ctx, [1739, 958, 6289, 948, 1737]),
    ]);
}

function canUseSilverSickle(ctx) {
    return canCompletePriestInPeril(ctx) //
        && canTrainCrafting(ctx) //
        && has(ctx, 2961)  // Silver sickle
        && has(ctx, 2355)  // Silver bar
        && has(ctx, 2976); // Sickle mould
}

function canCompleteTempleOfTheEye(ctx) {
    return allTrue([
        canTrainRunecraft(ctx), //
        canTrainMining(ctx), //
        has(ctx, 1929), // Bucket of water
        has(ctx, 1755),
    ]); // Chisel
}

function canCompleteDeathPlateau(ctx) {
    return allTrue([
        has(ctx, 2309), // Bread
        has(ctx, 333), // Trout
        has(ctx, 2351), // Iron bar
        has(ctx, 1905), // Asgarnian ale
        has(ctx, 3105),
    ]); // Climbing boots
}

function canCompleteRoyalTrouble(ctx) {
    return allTrue([
        canCompleteThroneOfMiscellania(ctx), //
        has(ctx, 954), // Rope
        has(ctx, 453), // Coal
        has(ctx, 960),
    ]); // Plank
}

function canCompleteTheTouristTrap(ctx) {
    return allTrue([
        canTrainFletching(ctx), //
        canTrainSmithing(ctx), //
        has(ctx, 1833), // Desert shirt
        has(ctx, 1835), // Desert robe
        has(ctx, 1837), // Desert boots
        has(ctx, 2347), // Hammer
        has(ctx, 2349), // Bronze bar
        has(ctx, 314),
    ]); // Feather
}

function canCompleteThroneOfMiscellania(ctx) {
    return allTrue([
        canCompleteHeroesQuest(ctx), //
        canCompleteTheFremennikTrials(ctx), //
        has(ctx, 2351), // Iron bar
        hasAnyItems(ctx, [1635, 1637, 1639, 1641, 1643]),
        has(ctx, 1511),
    ]); // Logs
}

function canCompleteHeroesQuest(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Cooking", 53),
        hasSkillLevel(ctx, "Fishing", 53),
        hasSkillLevel(ctx, "Herblore", 25),
        hasSkillLevel(ctx, "Mining", 50),
        hasQuestPoints(ctx, 55), //
        canCompleteLostCity(ctx), //
        canCompleteMerlinsCrystal(ctx), //
        canCompleteDragonSlayerI(ctx), //
        canTrainMining(ctx), //
        canTrainHerblore(ctx), //
        canTrainFishing(ctx), //
        canTrainCooking(ctx), //
        has(ctx, 307), // Fishing rod
        has(ctx, 313), // Fishing bait
        has(ctx, 97), // Harralander potion (unf)
        has(ctx, 255), // Harralander
        has(ctx, 227),
    ]); // Vial of water
}

function canCompleteTheDigSite(ctx) {
    return allTrue([
        canCompleteDruidicRitual(ctx), //
        has(ctx, 233), // Pestle and mortar
        has(ctx, 229), // Vial
        has(ctx, 590), // Tinderbox
        hasCupOfTea(ctx), //
        has(ctx, 954), // Rope
        hasAnyItems(ctx, [1609, 1625]),
        has(ctx, 973),
    ]); // Charcoal
}

function canCompleteMerlinsCrystal(ctx) {
    return allTrue([
        has(ctx, 2309), // Bread
        has(ctx, 590), // Tinderbox
        has(ctx, 30), // Bucket of wax
        has(ctx, 1925), // Bucket
        has(ctx, 28), // Insect repellent
        has(ctx, 530),
    ]); // Bat bones
}

function canStartDragonSlayerI(ctx) {
    return hasQuestPoints(ctx, 32);
}

function canCompleteDragonSlayerI(ctx) {
    return allTrue([
        hasQuestPoints(ctx, 32), //
        has(ctx, 1791), // Unfired bowl
        has(ctx, 1761), // Soft clay
        has(ctx, 1907), // Wizards mind bomb
        has(ctx, 301), // Lobster pot
        has(ctx, 950), // Silk
        has(ctx, 1540), // Anti-dragon shield
        has(ctx, 2347), // Hammer
        has(ctx, 1539), // Steel nails
        has(ctx, 960),
    ]);  // Plank
}

function canCompleteXMarksTheSpot(ctx) {
    return has(ctx, 952); // Spade
}

function canCompleteClientOfKourend(ctx) {
    return allTrue([
        canCompleteXMarksTheSpot(ctx), //
        hasAnyFeather(ctx),
    ]);
}

function canCompleteGhostsAhoy(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 25),
        hasSkillLevel(ctx, "Cooking", 20),
        canCompletePriestInPeril(ctx), //
        canTrainCooking(ctx), //
        has(ctx, 1927), // Bucket of milk
        has(ctx, 950), // Silk
        has(ctx, 1763), // Red dye
        has(ctx, 1765), // Yellow dye
        has(ctx, 1767), // Blue dye
        has(ctx, 952), // Spade
        has(ctx, 845), // Oak longbow
        has(ctx, 1921), // Bowl of water for Nettle tea
        has(ctx, 946),
    ]); // Knife
}

function canCompleteANightAtTheTheatre(ctx) {
    return allTrue([
        canCompleteATasteOfHope(ctx), //
        canTrainWoodcutting(ctx), //
        has(ctx, 8794),
    ]); // Saw
}

function canCompleteAlfredGrimhandsBarcrawl(ctx) {
    return true;
}

function canCompleteAnExistentialCrisis(ctx) {
    return false; // TODO
}

function canCompleteImpendingChaos(ctx) {
    return false; // TODO
}

function canCompleteBurialAtSea(ctx) {
    return false; // TODO
}

function canCompleteTheRedReef(ctx) {
    return false; // TODO
}

function canCompleteFamilyPest(ctx) {
    return canCompleteFamilyCrest(ctx);
}

function canCompleteBarbarianTraining(ctx) {
    return canCompleteBarbarianFishing(ctx) //
        && canCompleteBarbarianFiremaking2(ctx) //
        && canCompleteBarbarianFarming(ctx) //
        && canCompleteBarbarianSmithing(ctx) //
        && canCompleteBarbarianHerblore(ctx) //
}

function canCompleteBarbarianFarming(ctx) {
    return allTrue([
        canPlantTrees(ctx), //
        hasAnySapling(ctx),
    ]);
}

function hasAnySapling(ctx) {
    return false; // TODO
}

function canCompleteATailOfTwoCats(ctx) {
    return allTrue([
        canCompleteIcthlarinsLittleHelper(ctx), //
        has(ctx, 560), // Death rune
        has(ctx, 1897), // Chocolate cake
        has(ctx, 1511), // Logs
        has(ctx, 590), // Tinderbox
        has(ctx, 1927), // Bucket of milk
        has(ctx, 1735), // Shears
        has(ctx, 5318), // Potato seed
        has(ctx, 5341), // Rake
        has(ctx, 227), // Vial of water
        hasAnyItems(ctx, [1833, 540]),
        hasAnyItems(ctx, [1835, 538]),
    ]); // Desert robe or Druid's robe
}

function canCompleteTrollRomance(ctx) {
    return allTrue([
        canCompleteTrollStronghold(ctx), //
        has(ctx, 2351), // Iron bar
        hasAnyItems(ctx, [1517, 1515]),
        canReachTrollheim(ctx), //
        has(ctx, 30), // Bucket of wax
        has(ctx, 1887), // Cake tin
        has(ctx, 1939), // Swamp tar
        has(ctx, 954),
    ]); // Rope
}

function canCompleteTheCurseOfArrav(ctx) {
    return allTrue([
        canCompleteDefenderOfVarrock(ctx), //
        canCompleteTrollRomance(ctx), //
        canTrainMining(ctx), //
        (canTrainSlayer(ctx) || ctx.player.levels.Slayer >= 37), //
        has(ctx, 2126), // Dwellberries
        has(ctx, 2570), // Ring of life
        has(ctx, 9419), // Mith grapple
        has(ctx, 7159),
    ]); // Insulated boots
}

function canCompleteDreamMentor(ctx) {
    return allTrue([
        canCompleteLunarDiplomacy(ctx), //
        canCompleteEadgarsRuse(ctx), //
        has(ctx, 9075), // Astral rune
        has(ctx, 590), // Tinderbox
        has(ctx, 2347), // Hammer
        has(ctx, 233),
    ]); // Pestle and mortar
}

function canCompleteEadgarsRuse(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Herblore", 31),
        canCompleteDruidicRitual(ctx), //
        canCompleteTrollStronghold(ctx), //
        canTrainHerblore(ctx), //
        has(ctx, 3105), // Climbing boots
        has(ctx, 2015), // Vodka
        has(ctx, 2116), // Pineapple chunks
        has(ctx, 1511), // Logs
        has(ctx, 1947), // Grain
        has(ctx, 2138), // Raw chicken
        has(ctx, 233), // Pestle and mortar
        has(ctx, 99),
    ]);  // Rannar potion (unf)
}

function canCompleteSkippyAndTheMogres(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Cooking", 20),
        has(ctx, 1929), // Bucket of water
        has(ctx, 1927), // Bucket of milk
        has(ctx, 1975), // Chocolate dust
        has(ctx, 1921), // Bowl of water
        has(ctx, 231),
    ]); // Snape grass
}

function canCompleteLegendsQuest(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 50),
        hasSkillLevel(ctx, "Crafting", 50),
        hasSkillLevel(ctx, "Herblore", 45),
        hasSkillLevel(ctx, "Magic", 56),
        hasSkillLevel(ctx, "Mining", 52),
        hasSkillLevel(ctx, "Prayer", 42),
        hasSkillLevel(ctx, "Smithing", 50),
        hasSkillLevel(ctx, "Strength", 50),
        hasSkillLevel(ctx, "Thieving", 50),
        hasSkillLevel(ctx, "Woodcutting", 50),
        hasQuestPoints(ctx, 107), //
        canTrainCrafting(ctx), //
        canTrainHerblore(ctx), //
        canTrainMining(ctx), //
        canTrainPrayer(ctx), //
        canTrainSmithing(ctx), //
        canTrainWoodcutting(ctx), //
        canCompleteFamilyCrest(ctx), //
        canCompleteHeroesQuest(ctx), //
        canCompleteShiloVillage(ctx), //
        canCompleteUndergroundPass(ctx), //
        canCompleteWaterfallQuest(ctx), //
        hasMachete(ctx), //
        has(ctx, 2357), // Gold bar
        has(ctx, 2347), // Hammer
        has(ctx, 954), // Rope
        hasAnyItems(ctx, [1359, 6739]),
        has(ctx, 973), // Charcoal
        has(ctx, 970), // Papyrus
        has(ctx, 1523), // Lockpick
        has(ctx, 227), // Vial of water
        has(ctx, 1607), // Sapphire
        has(ctx, 1605), // Emerald
        has(ctx, 1603), // Ruby
        has(ctx, 1601), // Diamond
        has(ctx, 1611), // Jade
        has(ctx, 1609), // Opal
        has(ctx, 1613), // Red topaz
        has(ctx, 566), // Soul rune
        has(ctx, 558), // Mind rune
        has(ctx, 563), // Law rune
        has(ctx, 557), // Earth rune
        has(ctx, 567), // Unpowered orb
        has(ctx, 564), // Cosmic rune
        (hasAirRuneSource(ctx) || hasFireRuneSource(ctx) || hasWaterRuneSource(ctx)),
    ]);
}

function hasMachete(ctx) {
    return has(ctx, 975) || has(ctx, 6313) || has(ctx, 6315) || has(ctx, 6317);
}

function canCompleteFamilyCrest(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Mining", 40),
        hasSkillLevel(ctx, "Smithing", 40),
        hasSkillLevel(ctx, "Magic", 59),
        hasSkillLevel(ctx, "Crafting", 40),
        canTrainMining(ctx), //
        canTrainSmithing(ctx), //
        canTrainCrafting(ctx), //
        has(ctx, 315), // Shrimps
        has(ctx, 329), // Salmon
        has(ctx, 361), // Tuna
        has(ctx, 365), // Bass
        has(ctx, 373), // Swordfish
        has(ctx, 1603), // Ruby
        has(ctx, 1592), // Ring mould
        has(ctx, 1597), // Necklace mould
        has(ctx, 560), // Death rune
        hasAirRuneSource(ctx), //
        hasWaterRuneSource(ctx), //
        hasEarthRuneSource(ctx), //
        hasFireRuneSource(ctx), //
        hasAnyItems(ctx, [185, 183, 181, 2448, 11475, 11473, 11435, 11433, 179, 177, 175, 2446, 5949, 5947, 5945, 5943, 5958, 5956, 5954, 5952, 11503, 11501, 10931, 10929, 10927, 10925, 464, 29784, 12911, 12909, 12907, 12905, 12919, 12917, 12915, 12913, 29833, 29830, 29827, 29824]),
    ]);
}

function canCompleteDragonSlayerII(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Magic", 75),
        hasSkillLevel(ctx, "Smithing", 70),
        hasSkillLevel(ctx, "Mining", 68),
        hasSkillLevel(ctx, "Crafting", 62),
        hasSkillLevel(ctx, "Agility", 60),
        hasSkillLevel(ctx, "Thieving", 60),
        hasSkillLevel(ctx, "Construction", 50),
        hasSkillLevel(ctx, "Hitpoints", 50),
        hasQuestPoints(ctx, 200), //
        canCompleteLegendsQuest(ctx), //
        canCompleteDreamMentor(ctx), //
        canCompleteATailOfTwoCats(ctx), //
        canCompleteAnimalMagnetism(ctx), //
        canCompleteGhostsAhoy(ctx), //
        canCompleteBoneVoyage(ctx), //
        canCompleteClientOfKourend(ctx), //
        canEnterAncientCavern(ctx), //
        canTrainSmithing(ctx), //
        canTrainMining(ctx), //
        canTrainCrafting(ctx), //
        canTrainConstruction(ctx), //
        canTrainWoodcutting(ctx), //
        has(ctx, 8778), // Oak plank
        has(ctx, 1941), // Swamp paste
        hasAnyNails(ctx), //
        has(ctx, 2347), // Hammer
        has(ctx, 975), // Machete
        has(ctx, 8794), // Saw
        has(ctx, 1615), // Dragonstone
        has(ctx, 1775), // Molten glass
        has(ctx, 1785), // Glassblowing pipe
        has(ctx, 952), // Spade
        has(ctx, 9075), // Astral rune
        has(ctx, 590), // Tinderbox
        has(ctx, 233), // Pestle and mortar
        hasFireRuneSource(ctx), //
        hasAirRuneSource(ctx), //
        has(ctx, 565),
    ]); // Blood rune
}

function canCompleteMyArmsBigAdventure(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Farming", 29),
        hasSkillLevel(ctx, "Woodcutting", 10),
        canCompleteEadgarsRuse(ctx), //
        canCompleteTheFeud(ctx), //
        canCompleteJunglePotion(ctx), //
        canTrainFarming(ctx), //
        canTrainWoodcutting(ctx), //
        hasMachete(ctx), //
        has(ctx, 1925), // Bucket
        has(ctx, 6034), // Supercompost
        has(ctx, 952), // Spade
        has(ctx, 5341), // Rake
        has(ctx, 5343), // Seed dibber
        canReachTrollheim(ctx),
    ]);
}

function canCompleteMakingFriendsWithMyArm(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Firemaking", 66),
        hasSkillLevel(ctx, "Mining", 72),
        hasSkillLevel(ctx, "Construction", 35),
        hasSkillLevel(ctx, "Agility", 68),
        canCompleteMyArmsBigAdventure(ctx), //
        canCompleteSwanSong(ctx), //
        canCompleteColdWar(ctx), //
        canCompleteRomeoAndJuliet(ctx), //
        canTrainFiremaking(ctx), //
        canTrainMining(ctx), //
        canTrainConstruction(ctx), //
        has(ctx, 1925), // Bucket
        has(ctx, 8794), // Saw
        has(ctx, 8790), // Bolt of cloth
        has(ctx, 8782), // Mahogany plank
        has(ctx, 753), // Cadava berries
        has(ctx, 1929), // Bucket of water
        has(ctx, 2347), // Hammer
        has(ctx, 954),
    ]); // Rope
}

function canCompleteGrimTales(ctx) {
    return allTrue([
        canCompleteWitchsHouse(ctx), //
        canTrainFarming(ctx), //
        canTrainHerblore(ctx), //
        canTrainWoodcutting(ctx), //
        has(ctx, 95),
    ]); // Tarromin potion (unf)
}

function canCompleteObservatoryQuest(ctx) {
    return allTrue([
        has(ctx, 2349), // Bronze bar
        has(ctx, 1775), // Molten glass
        has(ctx, 960),
    ]); // Plank
}

function canGetGoutweed(ctx) {
    return canCompleteEadgarsRuse(ctx) // Goutweed crate
        || (has(ctx, 6311) && canTrainFarming(ctx)) // Gout tuber
        || (canReachTrollheim(ctx) && canDoGnomeRestaurant(ctx)); // Brambickle
}

function canCompleteBetweenARock(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Defence", 30),
        hasSkillLevel(ctx, "Mining", 40),
        hasSkillLevel(ctx, "Smithing", 50),
        canCompleteDwarfCannon(ctx), //
        canCompleteFishingContest(ctx), //
        canTrainMining(ctx), //
        canTrainSmithing(ctx), //
        has(ctx, 2357), // Gold bar
        has(ctx, 2347),
    ]); // Hammer
}

function canCompleteSwanSong(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Magic", 66),
        hasSkillLevel(ctx, "Cooking", 62),
        hasSkillLevel(ctx, "Fishing", 62),
        hasSkillLevel(ctx, "Smithing", 45),
        hasSkillLevel(ctx, "Firemaking", 42),
        hasSkillLevel(ctx, "Crafting", 40),
        canCompleteOneSmallFavour(ctx), //
        canCompleteGardenOfTranquillity(ctx), //
        hasQuestPoints(ctx, 100),
        canTrainCooking(ctx), //
        canTrainFishing(ctx), //
        canTrainSmithing(ctx), //
        canTrainFiremaking(ctx), //
        canTrainCrafting(ctx), //
        has(ctx, 4695), // Mist rune
        has(ctx, 4699), // Lava rune
        has(ctx, 565), // Blood rune
        has(ctx, 4436), // Airtight pot
        has(ctx, 2351), // Iron bar
        hasAnyLog(ctx), //
        has(ctx, 590), // Tinderbox
        has(ctx, 2347), // Hammer
        has(ctx, 303), // Small fishing net
        has(ctx, 1757), // Brown apron
        has(ctx, 7944), // Raw monkfish
        has(ctx, 526),
    ]); // Bones
}

function canDoMahoganyHomes(ctx) {
    return canTrainConstruction(ctx) //
        && has(ctx, 2347) // Hammer
        && has(ctx, 8794) // Saw
        && has(ctx, 2353) // Steel bar
        && (has(ctx, 960)     // Plank
            || has(ctx, 8778) // Oak plank
            || has(ctx, 8780) // Teak plank
            || has(ctx, 8782) // Mahogany plank
        );
}

function canCompleteOneSmallFavour(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 36),
        hasSkillLevel(ctx, "Crafting", 25),
        hasSkillLevel(ctx, "Herblore", 18),
        hasSkillLevel(ctx, "Smithing", 30),
        canCompleteRuneMysteries(ctx), //
        canCompleteShiloVillage(ctx), //
        canTrainCrafting(ctx), //
        canTrainHerblore(ctx), //
        canTrainSmithing(ctx), //
        has(ctx, 2353), // Steel bar
        has(ctx, 2349), // Bronze bar
        has(ctx, 2351), // Iron bar
        has(ctx, 1755), // Chisel
        has(ctx, 4419), // Guthix rest(3)
        has(ctx, 2347), // Hammer
        has(ctx, 1931), // Pot
        has(ctx, 1761), // Soft clay
        has(ctx, 1609), // Opal
        has(ctx, 1611), // Jade
        has(ctx, 1613), // Red topaz
        has(ctx, 1607), // Sapphire
        has(ctx, 4436),
    ]); // Airtight pot
}

function canMakeGuthixRests(ctx) {
    return canCompleteRuneMysteries(ctx) //
        && canCompleteShiloVillage(ctx) //
        && canTrainCrafting(ctx) //
        && canTrainHerblore(ctx) //
        && canTrainSmithing(ctx) //
        && has(ctx, 2353); // Steel bar
}

function canMakePotLids(ctx) {
    return canCompleteRuneMysteries(ctx) //
        && canCompleteShiloVillage(ctx) //
        && canTrainCrafting(ctx) //
        && canTrainHerblore(ctx) //
        && canTrainSmithing(ctx) //
        && has(ctx, 2353) // Steel bar
        && has(ctx, 2349) // Bronze bar
        && has(ctx, 2351) // Iron bar
        && has(ctx, 1755) // Chisel
        && has(ctx, 4419) // Guthix rest(3)
        && has(ctx, 2347) // Hammer
        && has(ctx, 1761) // Soft clay
        && has(ctx, 1609) // Opal
        && has(ctx, 1611) // Jade
        && has(ctx, 1613) // Red topaz
        && has(ctx, 1607); // Sapphire
}

function canMakeAirtightPot(ctx) {
    return canCompleteRuneMysteries(ctx) //
        && canCompleteShiloVillage(ctx) //
        && canTrainCrafting(ctx) //
        && canTrainHerblore(ctx) //
        && canTrainSmithing(ctx) //
        && has(ctx, 2353) // Steel bar
        && has(ctx, 2349) // Bronze bar
        && has(ctx, 2351) // Iron bar
        && has(ctx, 1755) // Chisel
        && has(ctx, 4419) // Guthix rest(3)
        && has(ctx, 2347) // Hammer
        && has(ctx, 1931) // Pot
        && has(ctx, 1761) // Soft clay
        && has(ctx, 1609) // Opal
        && has(ctx, 1611) // Jade
        && has(ctx, 1613) // Red topaz
        && has(ctx, 1607) // Sapphire
        && has(ctx, 4440); // Pot lid
}

function canCompleteFightArena(ctx) {
    return true;
}

function canCompleteHolyGrail(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Attack", 20),
        canCompleteMerlinsCrystal(ctx),
    ]);
}

function canCompleteHopespearsWill(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Prayer", 50),
        canCompleteTheRestlessGhost(ctx), //
        canCompleteDesertTreasureI(ctx), //
        canCompleteFairytaleIICureAQueen(ctx), //
        canCompleteLandOfTheGoblins(ctx), //
        canTrainPrayer(ctx), //
        has(ctx, 3002),
    ]); // Toadflax potion (unf)
}

function canCompleteLandOfTheGoblins(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 38),
        hasSkillLevel(ctx, "Fishing", 40),
        hasSkillLevel(ctx, "Thieving", 45),
        hasSkillLevel(ctx, "Herblore", 48),
        canCompleteAnotherSliceOfHAM(ctx), //
        canCompleteFishingContest(ctx), //
        canTrainHerblore(ctx), //
        canTrainFishing(ctx), //
        has(ctx, 3002), // Toadflax potion (unf)
        has(ctx, 288), // Goblin mail
        has(ctx, 1765), // Yellow dye
        has(ctx, 1767), // Blue dye
        has(ctx, 1769), // Orange dye
        has(ctx, 1773), // Purple dye
        has(ctx, 229), // Vial
        has(ctx, 233), // Pestle and mortar
        has(ctx, 3379), // Raw slimy eel
        has(ctx, 307),
    ]); // Fishing rod
}

const NMZ_QUESTS = [
    canCompleteTheAscentOfArceuus,
    canCompleteTheDepthsOfDespair,
    canCompleteDreamMentor,
    canCompleteFightArena,
    canCompleteTheGrandTree,
    canCompleteHauntedMine,
    canCompleteInSearchOfTheMyreque,
    canCompleteLunarDiplomacy,
    canCompleteMyArmsBigAdventure,
    canCompleteRovingElves,
    canCompleteSongOfTheElves,
    canCompleteTrollRomance,
    canCompleteWhatLiesBelow,
    canCompleteContact,
    canCompleteDesertTreasureI,
    canCompleteFairytaleIGrowingPains,
    canCompleteTheFremennikIsles,
    canCompleteTheGreatBrainRobbery,
    canCompleteHolyGrail,
    canCompleteLegendsQuest,
    canCompleteMonkeyMadnessI,
    canCompleteOneSmallFavour,
    canCompleteShadowOfTheStorm,
    canCompleteTaleOfTheRighteous,
    canCompleteTrollStronghold,
    canCompleteWitchsHouse,
    canCompleteTheCorsairCurse,
    canCompleteDragonSlayerI,
    canCompleteFamilyCrest,
    canCompleteGettingAhead,
    canCompleteGrimTales,
    canCompleteHorrorFromTheDeep,
    canCompleteLostCity,
    canCompleteMountainDaughter,
    canCompleteRecipeForDisaster,
    canCompleteShiloVillage,
    canCompleteTreeGnomeVillage,
    canCompleteVampyreSlayer,
];

function countCompletableNMZQuests(ctx) {
    return NMZ_QUESTS.filter(fn => fn(ctx)).length;
}

function canEnterNightmareZone(ctx) {
    return (countCompletableNMZQuests(ctx) >= 5) && !ctx.filters?.isIronman;
}

function canCompleteGardenOfTranquillity(ctx) {
    return allTrue([
        canCompleteCreatureOfFenkenstrain(ctx), //
        canTrainFarming(ctx), //
        has(ctx, 5341), // Rake
        has(ctx, 952), // Spade
        has(ctx, 5329), // Secateurs
        has(ctx, 5331), // Watering can
        has(ctx, 5325), // Gardening trowel
        has(ctx, 6036), // Plant cure
        has(ctx, 5096), // Marigold seed
        has(ctx, 5324), // Cabbage seed
        has(ctx, 5319), // Onion seed
        has(ctx, 2347), // Hammer
        hasAnyItems(ctx, [7936, 1436]),
        has(ctx, 233), // Pestle and mortar
        has(ctx, 5354), // Filled plant pot
        hasAnyItems(ctx, [6032, 6034, 21483]),
    ]); // Compost, Supercompost or Ultracompost
}

function canCompleteColdWar(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Hunter", 10),
        hasSkillLevel(ctx, "Agility", 30),
        hasSkillLevel(ctx, "Crafting", 30),
        hasSkillLevel(ctx, "Construction", 34),
        hasSkillLevel(ctx, "Thieving", 15),
        canTrainCrafting(ctx), //
        canTrainConstruction(ctx), //
        has(ctx, 8778), // Oak plank
        has(ctx, 1539), // Steel nails
        has(ctx, 2347), // Hammer
        has(ctx, 952), // Spade
        has(ctx, 8792), // Clockwork
        has(ctx, 960), // Plank
        has(ctx, 950), // Silk
        (has(ctx, 341) || canCompleteGardenOfTranquillity(ctx)), // Raw cod or Ring of Charos (a)
        has(ctx, 1939), // Swamp tar
        has(ctx, 8782), // Mahogany plank
        has(ctx, 1741), // Leather
        has(ctx, 2347), // Hammer
        has(ctx, 314),
    ]); // Feather
}

function canCompleteRomeoAndJuliet(ctx) {
    return has(ctx, 753); // Cadava berries
}

function canCompleteRagAndBoneManI(ctx) {
    return allTrue([
        has(ctx, 1931), // Pot
        has(ctx, 590), // Tinderbox
        hasAnyLog(ctx),
    ]);
}

function canCompleteRagAndBoneManII(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Slayer", 40),
        hasSkillLevel(ctx, "Defence", 20),
        canCompleteRagAndBoneManI(ctx), //
        has(ctx, 1931), // Pot
        has(ctx, 590), // Tinderbox
        hasAnyLog(ctx), //
        (canTrainSlayer(ctx) || ctx.player.levels.Slayer >= 40), //
        (canCompleteSkippyAndTheMogres(ctx) || canShortrange(ctx)), //
        (canStartZogreFleshEaters(ctx) || (hasTelegrabRunes(ctx) && canShortrange(ctx))), //
        canCompletePriestInPeril(ctx), //
        canCompleteCreatureOfFenkenstrain(ctx), //
        canEnterLumbridgeSwampCaves(ctx),
    ]); //
}

function canCompleteRatcatchers(ctx) {
    return allTrue([
        canCompleteIcthlarinsLittleHelper(ctx), //
        has(ctx, 1985), // Cheese
        has(ctx, 251), // Marrentill
        has(ctx, 235), // Unicorn horn dust
        has(ctx, 1927), // Bucket of milk
        has(ctx, 6055), // Weeds
        has(ctx, 1931), // Pot
        has(ctx, 590),
    ]); // Tinderbox
}

function canCompleteDesertTreasureI(ctx) {
    return allTrue([
        canCompleteTheDigSite(ctx), //
        canCompleteTempleOfIkov(ctx), //
        canCompleteTheTouristTrap(ctx), //
        canCompleteTrollStronghold(ctx), //
        canCompletePriestInPeril(ctx), //
        canCompleteWaterfallQuest(ctx), //
        canReachTrollheim(ctx),
        hasAnyItems(ctx, [2126, 4164]),
        has(ctx, 1513), // Magic logs
        has(ctx, 2353), // Steel bar
        has(ctx, 1775), // Molten glass
        has(ctx, 592), // Ashes
        has(ctx, 973), // Charcoal
        has(ctx, 565), // Blood rune
        has(ctx, 526), // Bones
        has(ctx, 2355), // Silver bar
        has(ctx, 4668), // Garlic powder
        has(ctx, 2007), // Spice
        has(ctx, 3107), // Spiked boots
        has(ctx, 1523), // Lockpick
        has(ctx, 590),
    ]); // Tinderbox
}

function canCompleteDesertTreasureII(ctx) {
    return allTrue([
        canCompleteDesertTreasureI(ctx), //
        canCompleteSecretsOfTheNorth(ctx), //
        canCompleteEnakhrasLament(ctx), //
        canCompleteTempleOfTheEye(ctx), //
        canCompleteGardenOfDeath(ctx), //
        canCompleteBelowIceMountain(ctx), //
        canCompleteHisFaithfulServants(ctx), //
        canTrainFiremaking(ctx), //
        canTrainHerblore(ctx), //
        canTrainRunecraft(ctx), //
        canTrainConstruction(ctx), //
        canTrainMining(ctx), //
        has(ctx, 560), // Death rune
        has(ctx, 565), // Blood rune
        has(ctx, 562), // Chaos rune
        has(ctx, 566), // Soul rune
        hasAirRuneSource(ctx), //
        hasWaterRuneSource(ctx), //
        hasFireRuneSource(ctx), //
        has(ctx, 590), // Tinderbox
        has(ctx, 4164), // Facemask
        has(ctx, 233),
    ]); // Pestle and mortar
}

function canCompleteSecretsOfTheNorth(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 69),
        hasSkillLevel(ctx, "Thieving", 64),
        hasSkillLevel(ctx, "Hunter", 56),
        canCompleteMakingFriendsWithMyArm(ctx), //
        canCompleteTheGeneralsShadow(ctx), //
        canCompleteDeviousMinds(ctx), //
        has(ctx, 1523), // Lockpick
        has(ctx, 590),
    ]); // Tinderbox
}

function canCompleteTheGeneralsShadow(ctx) {
    return canCompleteCurseOfTheEmptyLord(ctx);
}

function canCompleteCurseOfTheEmptyLord(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Prayer", 31),
        hasSkillLevel(ctx, "Thieving", 53),
        canCompleteDesertTreasureI(ctx), //
        canTrainPrayer(ctx),
    ]);
}

function canCompleteBearYourSoul(ctx) {
    return has(ctx, 952); // Spade
}

function canCompleteDeviousMinds(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Smithing", 65),
        hasSkillLevel(ctx, "Runecraft", 50),
        hasSkillLevel(ctx, "Fletching", 50),
        canCompleteWanted(ctx), //
        canCompleteTrollStronghold(ctx), //
        canCompleteDoricsQuest(ctx), //
        canTrainSmithing(ctx), //
        canTrainRunecraft(ctx), //
        canTrainFletching(ctx), //
        has(ctx, 1315), // Mithril 2h sword
        has(ctx, 1777),
    ]); // Bow string
}

function canCompleteWanted(ctx) {
    return allTrue([
        canCompleteRecruitmentDrive(ctx), //
        canCompleteTheLostTribe(ctx), //
        canCompletePriestInPeril(ctx), //
        canCompleteEnterTheAbyss(ctx), //
        hasAnyItems(ctx, [7936, 1436]),
        hasQuestPoints(ctx, 32),
    ]);
}

function canCompleteRecruitmentDrive(ctx) {
    return allTrue([
        canCompleteBlackKnightsFortress(ctx), //
        canCompleteDruidicRitual(ctx), //
        hasAnyItems(ctx, [946, 1755, 1794]),
    ]); // Knife, Chisel or Bronze wire
}

function canCompleteBlackKnightsFortress(ctx) {
    return allTrue([
        hasQuestPoints(ctx, 12), //
        has(ctx, 1965), // Cabbage
        has(ctx, 1101), // Iron chainbody
        has(ctx, 1139),
    ]); // Bronze med helm
}

function canCompleteDoricsQuest(ctx) {
    return allTrue([
        has(ctx, 440), // Iron ore
        has(ctx, 436), // Copper ore
        has(ctx, 434),
    ]); // Clay
}

function canCompleteGardenOfDeath(ctx) {
    return allTrue([
        canTrainFarming(ctx), //
        has(ctx, 5329),
    ]);
}

function canCompleteHisFaithfulServants(ctx) {
    return allTrue([
        canCompletePriestInPeril(ctx), //
        has(ctx, 952),
    ]); // Spade
}

function canCompleteTempleOfIkov(ctx) {
    return allTrue([
        has(ctx, 225), // Limpwurt root
        hasAnyItems(ctx, [864, 870, 863, 865, 869, 866, 867, 868, 5667, 22804, 806, 807, 813, 808, 3093, 809, 810, 816, 811, 817, 11230, 6522, 10033, 10034, 11959, 800, 801, 802, 803, 804, 805, 20849, 857, 855, 10282, 861, 859, 10284, 11235]),
    ]);
}

function canCompleteEthicallyAcquiredAntiquities(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Thieving", 25),
        canCompleteChildrenOfTheSun(ctx), //
        canCompleteShieldOfArrav(ctx),
    ]);
}

function canCompleteTheGreatBrainRobbery(ctx) {
    return allTrue([
        canCompleteCreatureOfFenkenstrain(ctx), //
        canCompleteCabinFever(ctx), //
        canCompleteRFDFreeingPiratePete(ctx), //
        canTrainCrafting(ctx), //
        canTrainConstruction(ctx), //
        canTrainPrayer(ctx), //
        has(ctx, 10891), // Wooden cat
        has(ctx, 2347), // Hammer
        hasAnyNails(ctx), //
        has(ctx, 960), // Plank
        has(ctx, 1718),
    ]);  // Holy symbol
}

function canCompleteCreatureOfFenkenstrain(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Crafting", 20),
        hasSkillLevel(ctx, "Thieving", 25),
        canCompletePriestInPeril(ctx), //
        canTrainCrafting(ctx), //
        has(ctx, 2355), // Silver bar
        has(ctx, 1794), // Bronze wire
        has(ctx, 1733), // Needle
        has(ctx, 1734), // Thread
        has(ctx, 952),
    ]); // Spade
}

function hasNarwhalKnife(ctx) {
    return canTrainCrafting(ctx) //
        && has(ctx, 31954) // Narwhal horn
        && has(ctx, 1755); // Chisel
}

function canCompleteTheEyesOfGlouphrie(ctx) {
    return allTrue([
        canCompleteTheGrandTree(ctx), //
        canTrainConstruction(ctx), //
        has(ctx, 4687), // Bucket of sap
        has(ctx, 4698), // Mud rune
        has(ctx, 1517), // Maple logs
        has(ctx, 1521), // Oak logs
        has(ctx, 2347), // Hammer
        has(ctx, 8794), // Saw
        has(ctx, 233),
    ]); // Pestle and mortar
}

function canCompleteTheCorsairCurse(ctx) {
    return allTrue([
        has(ctx, 590), // Tinderbox
        has(ctx, 952),
    ]); // Spade
}

function canCompleteCabinFever(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 42),
        hasSkillLevel(ctx, "Crafting", 45),
        hasSkillLevel(ctx, "Smithing", 50),
        hasSkillLevel(ctx, "Ranged", 40),
        canCompletePiratesTreasure(ctx), //
        canCompleteRumDeal(ctx), //
        canTrainCrafting(ctx), //
        canTrainSmithing(ctx), //
        has(ctx, 590), // Tinderbox
        has(ctx, 2347), // Hammer
        has(ctx, 1941), // Swamp paste
        has(ctx, 954),
    ]); // Rope
}

function canCompleteRumDeal(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Crafting", 42),
        hasSkillLevel(ctx, "Farming", 40),
        hasSkillLevel(ctx, "Prayer", 47),
        hasSkillLevel(ctx, "Slayer", 42),
        hasSkillLevel(ctx, "Fishing", 50),
        canCompleteZogreFleshEaters(ctx), //
        canCompletePriestInPeril(ctx), //
        canTrainCrafting(ctx), //
        canTrainFarming(ctx), //
        canTrainFishing(ctx), //
        canTrainPrayer(ctx), //
        (canTrainSlayer(ctx) || ctx.player.levels.Slayer >= 42), //
        has(ctx, 5341), // Rake
        has(ctx, 1925),
    ]); // Bucket
}

function canCompleteCooksAssistant(ctx) {
    return allTrue([
        has(ctx, 1944), // Egg
        has(ctx, 1927), // Bucket of milk
        has(ctx, 1933),
    ]); // Pot of flour
}

function canCompleteFishingContest(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Fishing", 10),
        canTrainFishing(ctx), //
        has(ctx, 1550), // Garlic
        has(ctx, 307), // Fishing rod
        has(ctx, 952),
    ]); // Spade
}

function canCompleteInSearchOfKnowledge(ctx) {
    return hasAnyCookedMeatFish(ctx) //
        || has(ctx, 6701)  // Baked potato
        || has(ctx, 1965); // Cabbage
}

function canCompleteLairOfTarnRazorlor(ctx) {
    return allTrue([
        canCompleteHauntedMine(ctx), //
        (canTrainSlayer(ctx) || ctx.player.levels.Slayer >= 40),
    ]);
}

function canCompleteIntoTheTombs(ctx) {
    return allTrue([
        canCompleteBeneathCursedSands(ctx), //
        canTrainMining(ctx),
    ]);
}

function canCompleteKingsRansom(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Magic", 45),
        hasSkillLevel(ctx, "Defence", 65),
        canCompleteBlackKnightsFortress(ctx), //
        canCompleteHolyGrail(ctx), //
        canCompleteMurderMystery(ctx), //
        canCompleteOneSmallFavour(ctx), //
        hasAnyItems(ctx, [6979, 6981, 6983]),
        hasTelegrabRunes(ctx), //
        (
            canCompleteWhileGuthixSleeps(ctx) // For full Elite black armour
            || (
                (has(ctx, 1165) || has(ctx, 2587) || has(ctx, 2595)) // Black full helm, Black full helm (t) or Black full helm (g)
                && (has(ctx, 1125) || has(ctx, 2583) || has(ctx, 2591)) // Black platebody, Black platebody (t) or Black platebody (g)
                && (has(ctx, 1077) || has(ctx, 2585) || has(ctx, 2593) || has(ctx, 1089) || has(ctx, 3472) || has(ctx, 3473)) // Black platelegs, Black platelegs (t), Black platelegs (g), Black plateskirt, Black plateskirt (t) or Black plateskirt (g)
            )
        ), //
        has(ctx, 1139), // Bronze med helm
        has(ctx, 1101),
    ]); // Iron chainbody
}

function hasAnyCookedMeatFish(ctx) {
    return has(ctx, 315)   // Shrimps
        || has(ctx, 325)   // Sardine
        || has(ctx, 303)   // Small fishing net, for untradable karambwanji
        || (has(ctx, 305) && canCompleteBelowIceMountain(ctx)) // Big fishing net, for untradable Tetra and Catfish
        || has(ctx, 2140)  // Cooked chicken
        || has(ctx, 2142)  // Cooked meat
        || has(ctx, 1861)  // Ugthanki meat
        || has(ctx, 3228)  // Cooked rabbit
        || has(ctx, 347)   // Herring
        || has(ctx, 355)   // Mackerel
        || has(ctx, 333)   // Trout
        || has(ctx, 351)   // Pike
        || has(ctx, 339)   // Cod
        || has(ctx, 329)   // Salmon
        || has(ctx, 3381)  // Cooked slimy eel
        || has(ctx, 361)   // Tuna
        || has(ctx, 3144)  // Cooked karambwan
        || has(ctx, 319)   // Anchovies
        || has(ctx, 10136) // Rainbow fish
        || has(ctx, 5003)  // Cave eel
        || has(ctx, 379)   // Lobster
        || has(ctx, 7568)  // Cooked jubbly
        || has(ctx, 365)   // Bass
        || has(ctx, 373)   // Swordfish
        || has(ctx, 7946)  // Monkfish
        || has(ctx, 32312) // Giant krill
        || has(ctx, 31556) // Swordtip squid
        || has(ctx, 31564) // Jumbo squid
        || has(ctx, 32320) // Haddock
        || has(ctx, 32328) // Yellowfin
        || has(ctx, 385)   // Shark
        || has(ctx, 397)   // Sea turtle
        || has(ctx, 32336) // Halibut
        || has(ctx, 13441) // Anglerfish
        || has(ctx, 32344) // Bluefin
        || has(ctx, 11936) // Dark crab
        || has(ctx, 32352) // Marlin
        || has(ctx, 391);  // Manta ray
}

function canCompleteTheEnchantedKey(ctx) {
    return allTrue([
        canCompleteMakingHistory(ctx), //
        has(ctx, 952),
    ]); // Spade
}

function canCompleteTheGardenOfDeath(ctx) {
    return allTrue([
        canTrainFarming(ctx), //
        has(ctx, 5329),
    ]); // Secateurs
}

function canCompleteRecipeForDisaster(ctx) {
    return canCompleteRFDAnotherCooksQuest(ctx) //
        && canCompleteRFDFreeingTheMountainDwarf(ctx) //
        && canCompleteRFDFreeingTheGoblinGenerals(ctx) //
        && canCompleteRFDFreeingPiratePete(ctx) //
        && canCompleteRFDFreeingTheLumbridgeGuide(ctx) //
        && canCompleteRFDFreeingEvilDave(ctx) //
        && canCompleteRFDFreeingSkrachUglologwee(ctx) //
        && canCompleteRFDFreeingSirAmikVarse(ctx) //
        && canCompleteRFDFreeingKingAwowogei(ctx) //
        && canCompleteDesertTreasureI(ctx) //
        && canCompleteHorrorFromTheDeep(ctx) //
        && hasQuestPoints(ctx, 175)
}

const RFD_SUBQUESTS = [
    canCompleteRFDFreeingTheMountainDwarf,
    canCompleteRFDFreeingTheGoblinGenerals,
    canCompleteRFDFreeingPiratePete,
    canCompleteRFDFreeingTheLumbridgeGuide,
    canCompleteRFDFreeingEvilDave,
    canCompleteRFDFreeingSkrachUglologwee,
    canCompleteRFDFreeingSirAmikVarse,
    canCompleteRFDFreeingKingAwowogei,
];

function countCompletableRFDSubquests(ctx) {
    return RFD_SUBQUESTS.filter(fn => fn(ctx)).length;
}

function canCompleteRecipeForDisaster0(ctx) {
    return canCompleteRFDAnotherCooksQuest(ctx);
}

function canCompleteRecipeForDisaster1(ctx) {
    return countCompletableRFDSubquests(ctx) >= 1;
}

function canCompleteRecipeForDisaster2(ctx) {
    return countCompletableRFDSubquests(ctx) >= 2;
}

function canCompleteRecipeForDisaster3(ctx) {
    return countCompletableRFDSubquests(ctx) >= 3;
}

function canCompleteRecipeForDisaster4(ctx) {
    return countCompletableRFDSubquests(ctx) >= 4;
}

function canCompleteRecipeForDisaster5(ctx) {
    return countCompletableRFDSubquests(ctx) >= 5;
}

function canCompleteRecipeForDisaster6(ctx) {
    return countCompletableRFDSubquests(ctx) >= 6;
}

function canCompleteRecipeForDisaster7(ctx) {
    return countCompletableRFDSubquests(ctx) >= 7;
}

function canCompleteRecipeForDisaster8(ctx) {
    return countCompletableRFDSubquests(ctx) >= 8;
}


function canCompleteRFDAnotherCooksQuest(ctx) {
    return allTrue([
        canCompleteCooksAssistant(ctx), //
        canTrainCooking(ctx), //
        has(ctx, 221), // Eye of newt
        has(ctx, 1909), // Greenman's ale
        has(ctx, 2084), // Fruit blast
        has(ctx, 592),
    ]); // Ashes
}

function canCompleteRFDFreeingTheMountainDwarf(ctx) {
    return allTrue([
        canCompleteRFDAnotherCooksQuest(ctx), //
        canCompleteFishingContest(ctx), //
        has(ctx, 1944), // Egg
        has(ctx, 1927), // Bucket of milk
        has(ctx, 1933), // Pot of flour
        has(ctx, 1921), // Bowl of water
        has(ctx, 1905),
    ]); // Asgarnian ale
}

function canCompleteRFDFreeingTheGoblinGenerals(ctx) {
    return allTrue([
        canCompleteRFDAnotherCooksQuest(ctx), //
        canCompleteGoblinDiplomacy(ctx), //
        has(ctx, 2309), // Bread
        has(ctx, 2112), // Orange slices
        (has(ctx, 1767) || has(ctx, 1771) || has(ctx, 1773) || (has(ctx, 229) && has(ctx, 233))), // Blue dye, Green dye, Purple dye or a Vial and Pestle and mortar for black dye
        hasAnyItems(ctx, [2007, 2169]),
        has(ctx, 313), // Fishing bait
        has(ctx, 1929), // Bucket of water
        has(ctx, 973),
    ]); // Charcoal
}
function canCompleteRFDFreeingPiratePete(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Cooking", 31),
        canCompleteRFDAnotherCooksQuest(ctx), //
        canTrainCooking(ctx), //
        has(ctx, 341), // Raw cod
        has(ctx, 233), // Pestle and mortar
        has(ctx, 2309), // Bread
        has(ctx, 6667), // Empty fishbowl
        has(ctx, 1794), // Bronze wire
        has(ctx, 1733), // Needle
        has(ctx, 946),
    ]); // Knife
}

function canCompleteRFDFreeingTheLumbridgeGuide(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Cooking", 40),
        canCompleteRFDAnotherCooksQuest(ctx), //
        canCompleteBigChompyBirdHunting(ctx), //
        canCompleteBiohazard(ctx), //
        canCompleteDemonSlayer(ctx), //
        canCompleteMurderMystery(ctx), //
        canCompleteNatureSpirit(ctx), //
        canCompleteWitchsHouse(ctx), //
        canTrainCooking(ctx), //
        has(ctx, 1927), // Bucket of milk
        has(ctx, 1944), // Egg
        has(ctx, 1933), // Pot of flour
        has(ctx, 1887),
    ]); // Cake tin
}

function canCompleteRFDFreeingEvilDave(ctx) {
    return allTrue([
        canCompleteRFDAnotherCooksQuest(ctx), //
        canCompleteGertrudesCat(ctx), //
        canCompleteShadowOfTheStorm(ctx), //
        canTrainCooking(ctx), //
        has(ctx, 2003),
    ]); // Stew
}

function canCompleteRFDFreeingSkrachUglologwee(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Cooking", 41),
        hasSkillLevel(ctx, "Firemaking", 20),
        canCompleteRFDAnotherCooksQuest(ctx), //
        canCompleteBigChompyBirdHunting(ctx), //
        canTrainCooking(ctx), //
        canTrainFiremaking(ctx), //
        canTrainWoodcutting(ctx), //
        has(ctx, 2876), // Raw chompy
        has(ctx, 7225), // Iron spit
        has(ctx, 1759), // Ball of wool
        has(ctx, 7566),
    ]); // Raw Jubbly
}

function canCompleteRFDFreeingSirAmikVarse(ctx) {
    return allTrue([
        hasQuestPoints(ctx, 107),
        canCompleteRFDAnotherCooksQuest(ctx), //
        canStartLegendsQuest(ctx), //
        canReachKharaziJungle(ctx), //
        has(ctx, 1927), // Bucket of milk
        has(ctx, 2130), // Pot of cream
        has(ctx, 7468), // Pot of cornflour
        has(ctx, 2138), // Raw chicken
        has(ctx, 233),
    ]); // Pestle and mortar
}

function canCompleteRFDFreeingKingAwowogei(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Cooking", 70),
        hasSkillLevel(ctx, "Agility", 48),
        canCompleteRFDAnotherCooksQuest(ctx), //
        canCompleteMonkeyMadnessI(ctx), //
        canTrainCooking(ctx), //
        has(ctx, 954), // Rope
        hasSlashWeapon(ctx), //
        has(ctx, 233),
    ]); // Pestle and mortar
}

function canCompleteRecipeForDisasterCulinaromancer(ctx) {
    return canCompleteRecipeForDisaster(ctx);
}

function canCompletePryingTimes(ctx) {
    return allTrue([
        canCompletePandemonium(ctx), //
        canCompleteTheKnightsSword(ctx), //
        canTrainSmithing(ctx), //
        has(ctx, 2347), // Hammer
        has(ctx, 2325), // Redberry pie
        has(ctx, 2353),
    ]); // Steel bar
}

function canCompleteTheKnightsSword(ctx) {
    return allTrue([
        canTrainMining(ctx), //
        has(ctx, 2351), // Iron bar
        has(ctx, 2325),
    ]); // Redberry pie
}

function canCompleteMonkeyMadnessI(ctx) {
    return canCompleteTheGrandTree(ctx) //
        && canCompleteTreeGnomeVillage(ctx) //
        && has(ctx, 2357) // Gold bar
        && has(ctx, 1759) // Ball of wool
        && has(ctx, 1963) // Bananas
        && (has(ctx, 3183) || canCompleteJunglePotion(ctx)) // Monkey bones or Monkey corpse
}

function canCompleteMonkeyMadnessII(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Slayer", 69),
        hasSkillLevel(ctx, "Crafting", 70),
        hasSkillLevel(ctx, "Hunter", 60),
        hasSkillLevel(ctx, "Agility", 55),
        hasSkillLevel(ctx, "Thieving", 55),
        hasSkillLevel(ctx, "Firemaking", 60),
        canCompleteEnlightenedJourney(ctx), //
        canTrainFiremaking(ctx), //
        has(ctx, 1513), // Magic logs
        canCompleteTheEyesOfGlouphrie(ctx), //
        canCompleteRFDFreeingKingAwowogei(ctx), //
        canCompleteTrollStronghold(ctx), //
        (canTrainSlayer(ctx) || ctx.player.levels.Slayer >= 69), //
        canTrainCrafting(ctx), //
        canTrainHunter(ctx), //
        has(ctx, 2102), // Lemon
        has(ctx, 1987), // Grapes
        has(ctx, 1511), // Logs
        has(ctx, 2347), // Hammer
        has(ctx, 1755), // Chisel
        has(ctx, 233),
    ]); // Pestle and mortar
}

function hasSlashWeapon(ctx) {
    return true; // TODO
}

function hasSlashWeaponOrKnife(ctx) {
    return true; // TODO
}

function canCompleteWitchsHouse(ctx) {
    return has(ctx, 1985); // Cheese
}

function canCompleteBiohazard(ctx) {
    return allTrue([
        canCompletePlagueCity(ctx), //
        has(ctx, 428), // Priest gown (bottom)
        has(ctx, 426),
    ]); // Priest gown (top)
}

function canCompletePlagueCity(ctx) {
    return allTrue([
        has(ctx, 2126), // Dwellberries
        has(ctx, 952), // Spade
        has(ctx, 1929), // Bucket of water
        has(ctx, 1927), // Bucket of milk
        has(ctx, 1975), // Chocolate dust
        has(ctx, 231), // Snape grass
        has(ctx, 954),
    ]); // Rope
}

function canCompleteDemonSlayer(ctx) {
    return allTrue([
        has(ctx, 1929), // Bucket of water
        has(ctx, 526),
    ]); // Bones
}

function canCompleteCurrentAffairs(ctx) {
    return allTrue([
        canCompletePandemonium(ctx), //
        canTrainFishing(ctx), //
        has(ctx, 973),
    ]); // Charcoal
}

function canCompleteMurderMystery(ctx) {
    return has(ctx, 1933); // Pot of flour
}

function canCompleteMonksFriend(ctx) {
    return allTrue([
        has(ctx, 1937), // Jug of water
        hasAnyItems(ctx, [1511, 960]),
    ]); // Logs or Plank
}

function canCompleteShadowOfTheStorm(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Crafting", 30),
        canCompleteDemonSlayer(ctx), //
        canCompleteTheGolem(ctx), //
        canTrainCrafting(ctx), //
        (has(ctx, 229) && has(ctx, 233)), // Vial and Pestle and mortar for black dye
        has(ctx, 2355),
    ]); // Silver bar
}

function canCompleteSheepShearer(ctx) {
    return has(ctx, 1735); // Shears
}

function canCompleteTheGolem(ctx) {
    return allTrue([
        canTrainCrafting(ctx), //
        has(ctx, 229), // Vial
        has(ctx, 233), // Pestle and mortar
        has(ctx, 1761), // Soft clay
        has(ctx, 970),
    ]); // Papyrus
}

function canCompleteHorrorFromTheDeep(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 35),
        has(ctx, 556), // Air rune
        has(ctx, 555), // Water rune
        has(ctx, 557), // Earth rune
        has(ctx, 554)  // Fire rune
        , // This assumes ice arrows can be used and swords/longsword from an event/castle wars
        has(ctx, 1775), // Molten glass
        has(ctx, 590), // Tinderbox
        has(ctx, 2347), // Hammer
        has(ctx, 1539), // Steel nails
        has(ctx, 1939), // Swamp tar
        has(ctx, 960),
    ]); // Plank
}

function canCompleteTheGrandTree(ctx) {
    return true;
}

function canEnterBraindeathIsland(ctx) {
    return canCompletePriestInPeril(ctx) //
        && canCompleteZogreFleshEaters(ctx);
}

function canDoMixology(ctx) {
    return canTrainHerblore(ctx) //
        && (
            has(ctx, 249)    // Guam leaf
            || has(ctx, 251) // Marrentill
            || has(ctx, 253) // Tarromin
            || has(ctx, 255) // Harralander
        )
        && (
            has(ctx, 257)     // Ranarr weed
            || has(ctx, 2998) // Toadflax
            || has(ctx, 261)  // Avantoe
            || has(ctx, 263)  // Kwuarm
            || has(ctx, 3000) // Snapdragon
        )
        && (
            has(ctx, 30097)   // Huasca
            || has(ctx, 259)  // Irit leaf
            || has(ctx, 265)  // Cadantine
            || has(ctx, 2481) // Lantadyme
            || has(ctx, 267)  // Dwarf weed
            || has(ctx, 269)  // Torstol
        );
}

function canCompleteGettingAhead(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Crafting", 30),
        hasSkillLevel(ctx, "Construction", 26),
        canTrainCrafting(ctx), //
        canTrainConstruction(ctx), //
        hasAnyItems(ctx, [948, 6814, 958]),
        has(ctx, 1761), // Soft clay
        has(ctx, 2347), // Hammer
        has(ctx, 8794), // Saw
        has(ctx, 960), // Plank
        hasAnyNails(ctx), //
        has(ctx, 1763), // Red dye
        has(ctx, 1933), // Pot of flour
        has(ctx, 946),
    ]); // Knife
}

function canCompleteTheFeud(ctx) {
    return allTrue([
        has(ctx, 4591), // Kharidian headpiece
        has(ctx, 4593), // Fake beard
        has(ctx, 1917), // Beer
        has(ctx, 1925),
    ]); // Bucket
}

function canMakeSplitLog(ctx) {
    return canCompleteTheFremennikTrials(ctx) //
        && canTrainConstruction(ctx) //
        && (ctx.player.levels.Mining === 1 //
            ? has(ctx, 438) // Tin ore
            : ctx.player.levels.Mining <= 54 //
                ? has(ctx, 453) // Coal
                : has(ctx, 447)) // Mithril ore
        && has(ctx, 10810) // Arctic pine logs
        && has(ctx, 954);  // Rope
}

function canMakeNeitiznotShield(ctx) {
    return canCompleteTheFremennikTrials(ctx) //
        && canTrainConstruction(ctx) //
        && (ctx.player.levels.Mining === 1 //
            ? has(ctx, 438) // Tin ore
            : ctx.player.levels.Mining <= 54 //
                ? has(ctx, 453) // Coal
                : has(ctx, 447)) // Mithril ore
        && has(ctx, 10810) // Arctic pine logs
        && has(ctx, 4819)  // Bronze nails
        && has(ctx, 2347)  // Hammer
        && has(ctx, 954);  // Rope
}

function hasFremennikTrialsStartingOres(ctx) {
    return (ctx.player.levels.Mining === 1 //
        ? has(ctx, 438) // Tin ore
        : ctx.player.levels.Mining <= 54 //
            ? has(ctx, 453) // Coal
            : has(ctx, 447)); // Mithril ore
}

function canMakeYakhideArmour(ctx) {
    return canCompleteTheFremennikTrials(ctx) //
        && canTrainConstruction(ctx) //
        && (ctx.player.levels.Mining === 1 //
            ? has(ctx, 438) // Tin ore
            : ctx.player.levels.Mining <= 54 //
                ? has(ctx, 453) // Coal
                : has(ctx, 447)) // Mithril ore
        && has(ctx, 10812) // Split log
        && has(ctx, 10820) // Cured yak-hide
        && has(ctx, 954);  // Rope
}

function canCureYakHide(ctx) {
    return canCompleteTheFremennikTrials(ctx) //
        && canTrainConstruction(ctx) //
        && (ctx.player.levels.Mining === 1 //
            ? has(ctx, 438) // Tin ore
            : ctx.player.levels.Mining <= 54 //
                ? has(ctx, 453) // Coal
                : has(ctx, 447)) // Mithril ore
        && has(ctx, 10812) // Split log
        && has(ctx, 10818) // Yak-hide
        && has(ctx, 954);  // Rope
}

function canCompleteTheFremennikIsles(ctx) {
    return allTrue([
        canCompleteTheFremennikTrials(ctx), //
        canTrainConstruction(ctx), //
        has(ctx, 359), // Raw tuna
        (ctx.player.levels.Mining === 1 //
            ? has(ctx, 438) // Tin ore
            : ctx.player.levels.Mining <= 54 //
                ? has(ctx, 453) // Coal
                : has(ctx, 447)), // Mithril ore
        has(ctx, 10812), // Split log
        has(ctx, 10826), // Neitiznot shield
        has(ctx, 10824), // Yak-hide armour (legs)
        has(ctx, 10822), // Yak-hide armour (top)
        has(ctx, 954),
    ]);  // Rope
}

function canCompleteMountainDaughter(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 20),
        canTrainMining(ctx), //
        canTrainWoodcutting(ctx), //
        has(ctx, 954), // Rope
        has(ctx, 960),
    ]); // Plank
}

function canCompleteTheFremennikExiles(ctx) {
    return allTrue([
        canCompleteTheFremennikIsles(ctx), //
        canCompleteLunarDiplomacy(ctx), //
        canCompleteMountainDaughter(ctx), //
        canCompleteHeroesQuest(ctx), //
        canTrainCrafting(ctx), //
        (canTrainSlayer(ctx) || ctx.player.levels.Slayer >= 60), //
        canTrainSmithing(ctx), //
        canTrainFishing(ctx), //
        canTrainRunecraft(ctx), //
        canTrainMining(ctx), //
        has(ctx, 4156), // Mirror shield
        has(ctx, 3801), // Keg of beer
        has(ctx, 1775), // Molten glass
        has(ctx, 9075), // Astral rune
        hasAnyItems(ctx, [307, 309]),
        has(ctx, 2347), // Hammer
        has(ctx, 1785),
    ]); // Glassblowing pipe
}

function canCompleteScorpionCatcher(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Prayer", 31),
        canTrainPrayer(ctx),
    ]);
}

function canCompleteEnakhrasLament(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Crafting", 50),
        hasSkillLevel(ctx, "Firemaking", 45),
        hasSkillLevel(ctx, "Prayer", 43),
        hasSkillLevel(ctx, "Magic", 39),
        canTrainCrafting(ctx), //
        canTrainFiremaking(ctx), //
        canTrainPrayer(ctx),
        has(ctx, 1755), // Chisel
        has(ctx, 590), // Tinderbox
        has(ctx, 36), // Candle
        has(ctx, 1511), // Logs
        has(ctx, 1521), // Oak logs
        has(ctx, 1519), // Willow logs
        has(ctx, 1517), // Maple logs
        has(ctx, 1761), // Soft clay
        has(ctx, 453), // Coal
        hasAnyItems(ctx, [6977, 6971, 6973, 6975]),
        has(ctx, 6983), // Granite (5kg)
        hasAirRuneSource(ctx), //
        hasFireRuneSource(ctx), //
        hasEarthRuneSource(ctx), //
        has(ctx, 562),
    ]); // Chaos rune
}

function canReachKharaziJungle(ctx) {
    return canStartLegendsQuest(ctx)
        && canTrainWoodcutting(ctx) //
        && hasMachete(ctx);
}

function canEnterHardwoodGrove(ctx) {
    return canCompleteJunglePotion(ctx) //
        && has(ctx, 6306); // Trading sticks
}

function canStartLegendsQuest(ctx) {
    return hasQuestPoints(ctx, 107) //
        && canCompleteFamilyCrest(ctx) //
        && canCompleteHeroesQuest(ctx) //
        && canCompleteShiloVillage(ctx) //
        && canCompleteUndergroundPass(ctx) //
        && canCompleteWaterfallQuest(ctx); //
}

function canStartDarknessOfHallowvale(ctx) {
    return canCompleteInAidOfTheMyreque(ctx) //
        && canTrainConstruction(ctx) //
        && canTrainMining(ctx) //
        && canTrainCrafting(ctx); //
}

function canCompleteDarknessOfHallowvale(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Construction", 5),
        hasSkillLevel(ctx, "Mining", 20),
        hasSkillLevel(ctx, "Thieving", 22),
        hasSkillLevel(ctx, "Agility", 26),
        hasSkillLevel(ctx, "Crafting", 32),
        hasSkillLevel(ctx, "Magic", 33),
        hasSkillLevel(ctx, "Strength", 40),
        canCompleteInAidOfTheMyreque(ctx), //
        canTrainConstruction(ctx), //
        canTrainMining(ctx), //
        canTrainCrafting(ctx), //
        hasAnyNails(ctx), //
        has(ctx, 960), // Plank
        has(ctx, 2347), // Hammer
        has(ctx, 946), // Knife
        hasAirRuneSource(ctx), //
        has(ctx, 563),
    ]); // Law rune
}

function canStartATasteOfHope(ctx) {
    return canCompleteDarknessOfHallowvale(ctx) //
        && canTrainCrafting(ctx) //
        && (canTrainSlayer(ctx) || ctx.player.levels.Slayer >= 38) //
        && canTrainHerblore(ctx) //
        && canTrainMining(ctx); //
}

function canCompleteATasteOfHope(ctx) {
    return allTrue([
        canCompleteDarknessOfHallowvale(ctx), //
        canTrainCrafting(ctx), //
        (canTrainSlayer(ctx) || ctx.player.levels.Slayer >= 38), //
        canTrainHerblore(ctx), //
        canTrainMining(ctx), //
        has(ctx, 1605), // Emerald
        has(ctx, 1755), // Chisel
        has(ctx, 233), // Pestle and mortar
        has(ctx, 227), // Vial of water
        hasAnyItems(ctx, [946, 2961]),
    ]); // Knife or Silver sickle
}

function canCompleteVampyreSlayer(ctx) {
    return allTrue([
        has(ctx, 1917), // Beer
        has(ctx, 2347), // Hammer
        has(ctx, 1550),
    ]); // Garlic
}

function canCompleteWitchsPotion(ctx) {
    return allTrue([
        has(ctx, 221), // Eye of newt
        has(ctx, 1957),
    ]); // Onion
}

function canCompleteSinsOfTheFather(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Woodcutting", 62),
        hasSkillLevel(ctx, "Fletching", 60),
        hasSkillLevel(ctx, "Crafting", 56),
        hasSkillLevel(ctx, "Agility", 52),
        hasSkillLevel(ctx, "Attack", 50),
        hasSkillLevel(ctx, "Slayer", 50),
        hasSkillLevel(ctx, "Magic", 49),
        canCompleteVampyreSlayer(ctx), //
        canCompleteATasteOfHope(ctx), //
        canTrainWoodcutting(ctx), //
        canTrainFletching(ctx), //
        canTrainCrafting(ctx), //
        (canTrainSlayer(ctx) || ctx.player.levels.Slayer >= 50), //
        has(ctx, 1603), // Ruby
        has(ctx, 1755), // Chisel
        has(ctx, 2347), // Hammer
        has(ctx, 946),
    ]); // Knife
}

function canCompleteTrollStronghold(ctx) {
    return canCompleteDeathPlateau(ctx);
}

function canStartMageArenaII(ctx) {
    return has(ctx, 565) // Blood rune
        && hasAirRuneSource(ctx) //
        && hasFireRuneSource(ctx); //
}

function canCompleteMageArenaI(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Magic", 60),
        hasAirRuneSource(ctx), //
        hasAnyItems(ctx, [
            558, // Mind rune
            562, // Chaos rune
            560, // Death rune
            565  // Blood rune
        ]),
    ]);
}

function canCompleteMageArenaII(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Magic", 75),
        canCompleteMageArenaI(ctx), //
        has(ctx, 565), // Blood rune
        hasAirRuneSource(ctx), //
        hasFireRuneSource(ctx),
    ]); //
}

function canCompleteWhatLiesBelow(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Runecraft", 35),
        canCompleteRuneMysteries(ctx), //
        canTrainRunecraft(ctx), //
        has(ctx, 1923), // Bowl
        has(ctx, 562), // Chaos rune
        (
            has(ctx, 1452)    // Chaos talisman
            || has(ctx, 5543) // Chaos tiara
            || canCompleteEnterTheAbyss(ctx) //
            || canDoGuardiansOfTheRift(ctx)
        ),
    ]);
}

function canCompleteOlafsQuest(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Firemaking", 40),
        hasSkillLevel(ctx, "Woodcutting", 50),
        canTrainFiremaking(ctx), //
        canTrainWoodcutting(ctx), //
        has(ctx, 590), // Tinderbox
        has(ctx, 952), // Spade
        has(ctx, 954),
    ]); // Rope
}

function canCompleteDefenderOfVarrock(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Smithing", 55),
        hasSkillLevel(ctx, "Hunter", 52),
        canCompleteTempleOfIkov(ctx), //
        canCompleteBelowIceMountain(ctx), //
        canCompleteFamilyCrest(ctx), //
        canCompleteGardenOfTranquillity(ctx), //
        canCompleteWhatLiesBelow(ctx), //
        canCompleteRomeoAndJuliet(ctx), //
        canCompleteDemonSlayer(ctx), //
        canTrainSmithing(ctx), //
        canTrainHunter(ctx), //
        canTrainMining(ctx),
    ]);
}

function canCompleteTreeGnomeVillage(ctx) {
    return has(ctx, 1511); // Logs
}

function canCompleteTheSlugMenace(ctx) {
    return allTrue([
        canCompleteWanted(ctx), //
        canCompleteSeaSlug(ctx), //
        canTrainCrafting(ctx), //
        canTrainRunecraft(ctx), //
        (canTrainSlayer(ctx) || ctx.player.levels.Slayer >= 30), //
        has(ctx, 1941), // Swamp paste
        hasAnyItems(ctx, [1436, 7936]),
        has(ctx, 1755), // Chisel
        (
            canDoGuardiansOfTheRift(ctx) //
            || canCompleteEnterTheAbyss(ctx) //
            || (
                (has(ctx, 1438) || has(ctx, 5527)) // Air talisman or Air tiara
                && (has(ctx, 1444) || has(ctx, 5531)) // Water talisman or Water tiara
                && (has(ctx, 1440) || has(ctx, 5535)) // Earth talisman or Earth tiara
                && (has(ctx, 1442) || has(ctx, 5537)) // Fire talisman or Fire tiara
            )
        ),
    ]);
}

function canCompleteDaddysHome(ctx) {
    return allTrue([
        has(ctx, 960), // Plank
        has(ctx, 8790), // Bolt of cloth
        hasAnyNails(ctx), //
        has(ctx, 2347), // Hammer
        has(ctx, 8794),
    ]);  // Saw
}

function canCompleteSeaSlug(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Firemaking", 30),
        canTrainFiremaking(ctx), //
        has(ctx, 1941), // Swamp paste
        has(ctx, 596),
    ]); // Unlit torch
}

function canCompleteTaleOfTheRighteous(ctx) {
    return allTrue([
        canCompleteClientOfKourend(ctx), //
        canTrainMining(ctx),
        has(ctx, 954), // Rope
        hasAirRuneSource(ctx), //
        hasAnyItems(ctx, [558, 562, 560, 565]),
    ]); // Mind rune, Chaos rune, Death rune or Blood rune
}

function canCompleteTheDepthsOfDespair(ctx) {
    return canCompleteClientOfKourend(ctx);
}

function canStartTheQueenOfThieves(ctx) {
    return canCompleteClientOfKourend(ctx);
}

function canCompleteTheQueenOfThieves(ctx) {
    return allTrue([
        canCompleteClientOfKourend(ctx),
        has(ctx, 2003),
    ]); // Stew
}

function canCompleteTheAscentOfArceuus(ctx) {
    return allTrue([
        canCompleteClientOfKourend(ctx),
        (ctx.player.levels.Hunter >= 12 || canTrainHunter(ctx)),
    ]);
}

function canCompleteTheForsakenTower(ctx) {
    return allTrue([
        canCompleteClientOfKourend(ctx),
        has(ctx, 590),
    ]); // Tinderbox
}

function canCompleteASoulsBane(ctx) {
    return has(ctx, 954); // Rope
}

function canCompleteAPorcineOfInterest(ctx) {
    return has(ctx, 954); // Rope
}

function canCompleteAKingdomDivided(ctx) {
    return allTrue([
        canCompleteTheDepthsOfDespair(ctx), //
        canCompleteTheQueenOfThieves(ctx), //
        canCompleteTheAscentOfArceuus(ctx), //
        canCompleteTheForsakenTower(ctx), //
        canCompleteTaleOfTheRighteous(ctx), //
        hasSkillLevel(ctx, "Agility", 54), //
        hasSkillLevel(ctx, "Thieving", 52), //
        hasSkillLevel(ctx, "Woodcutting", 52), //
        hasSkillLevel(ctx, "Herblore", 50), //
        hasSkillLevel(ctx, "Mining", 42), //
        hasSkillLevel(ctx, "Crafting", 38), //
        hasSkillLevel(ctx, "Magic", 35), //
        hasAirRuneSource(ctx), //
        hasFireRuneSource(ctx), //
        hasAnyItems(ctx, [558, 562, 560, 565]),
        hasAnyItems(ctx, [133, 2432]),
        hasAnyItems(ctx, [2126, 4164]),
        has(ctx, 1775), // Molten glass
        has(ctx, 1755),
    ]); // Chisel
}

function canCompleteThePathOfGlouphrie(ctx) {
    return allTrue([
        canCompleteTheEyesOfGlouphrie(ctx), //
        canCompleteWaterfallQuest(ctx), //
        canCompleteTreeGnomeVillage(ctx), //
        (canTrainSlayer(ctx) || ctx.player.levels.Slayer >= 56), //
        has(ctx, 9419),
    ]); // Mith Grapple (phoenix crossbow is available)
}

function canCompleteTheHandInTheSand(ctx) {
    return allTrue([
        canTrainCrafting(ctx), //
        has(ctx, 1917), // Beer
        has(ctx, 229), // Vial
        has(ctx, 1951), // Redberries
        has(ctx, 239), // White berries
        has(ctx, 4542), // Lantern lens
        has(ctx, 1783), // Bucket of sand
        has(ctx, 557),
    ]); // Earth rune
}

function canCompleteSpiritsOfTheElid(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Magic", 33),
        hasSkillLevel(ctx, "Ranged", 37),
        hasSkillLevel(ctx, "Mining", 37),
        hasSkillLevel(ctx, "Thieving", 37),
        canTrainMining(ctx), //
        hasTelegrabRunes(ctx), //
        has(ctx, 1733), // Needle
        has(ctx, 1734), // Thread
        has(ctx, 946), // Knife
        has(ctx, 954), // Rope
        canShortrange(ctx),
    ]);
}

function canCompleteShieldOfArrav(ctx) {
    return true;
}

function hasTelegrabRunes(ctx) {
    return has(ctx, 563) // Law rune
        && hasAirRuneSource(ctx);
}

function canCompleteTearsOfGuthix(ctx) {
    return allTrue([
        hasQuestPoints(ctx, 43), //
        canTrainCrafting(ctx), //
        canTrainMining(ctx), //
        canTrainFiremaking(ctx), //
        has(ctx, 4548), // Bullseye lantern
        has(ctx, 1607), // Sapphire
        has(ctx, 1755), // Chisel
        has(ctx, 590), // Tinderbox
        canEnterLumbridgeSwampCaves(ctx),
    ]);
}

function canCompleteWhileGuthixSleeps(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Thieving", 72),
        hasSkillLevel(ctx, "Magic", 67),
        hasSkillLevel(ctx, "Agility", 66),
        hasSkillLevel(ctx, "Farming", 65),
        hasSkillLevel(ctx, "Herblore", 65),
        hasSkillLevel(ctx, "Hunter", 62),
        hasQuestPoints(ctx, 180), //
        canCompleteDefenderOfVarrock(ctx), //
        canCompleteThePathOfGlouphrie(ctx), //
        canCompleteDreamMentor(ctx), //
        canCompleteTheHandInTheSand(ctx), //
        canCompleteWanted(ctx), //
        canCompleteTempleOfTheEye(ctx), //
        canCompleteTearsOfGuthix(ctx), //
        canCompleteNatureSpirit(ctx), //
        canCompleteATailOfTwoCats(ctx), //
        canTrainFarming(ctx), //
        canTrainHerblore(ctx), //
        canTrainHunter(ctx), //
        has(ctx, 946), // Knife
        has(ctx, 4542), // Lantern lens
        has(ctx, 567), // Unpowered orb
        has(ctx, 1139), // Bronze med helm
        has(ctx, 1101), // Iron chainbody
        has(ctx, 4548), // Bullseye lantern
        has(ctx, 1607), // Sapphire
        has(ctx, 1951), // Redberries
        has(ctx, 239), // White berries
        hasAirRuneSource(ctx), //
        has(ctx, 564), // Cosmic rune
        has(ctx, 9075), // Astral rune
        hasWaterRuneSource(ctx), //
        hasEarthRuneSource(ctx), //
        hasFireRuneSource(ctx), //
        hasAnyItems(ctx, [559, 566]),
        has(ctx, 561), // Nature rune
        has(ctx, 563), // Law rune
        has(ctx, 558), // Mind rune
        has(ctx, 560), // Death rune
        has(ctx, 2970), // Mort myre fungus
        hasAnyLog(ctx), //
        has(ctx, 5300), // Snapdragon seed
        has(ctx, 2430), // Restore potion(4)
        has(ctx, 970), // Papyrus
        has(ctx, 973),
    ]); // Charcoal
}

function canCompleteSongOfTheElves(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 70),
        hasSkillLevel(ctx, "Construction", 70),
        hasSkillLevel(ctx, "Farming", 70),
        hasSkillLevel(ctx, "Herblore", 70),
        hasSkillLevel(ctx, "Hunter", 70),
        hasSkillLevel(ctx, "Mining", 70),
        hasSkillLevel(ctx, "Smithing", 70),
        hasSkillLevel(ctx, "Woodcutting", 70),
        canCompleteMourningsEndPartII(ctx), //
        canCompleteMakingHistory(ctx), //
        canCompleteDruidicRitual(ctx), //
        canTrainConstruction(ctx), //
        canTrainFarming(ctx), //
        canTrainHerblore(ctx), //
        canTrainHunter(ctx), //
        canTrainMining(ctx), //
        canTrainSmithing(ctx), //
        canTrainWoodcutting(ctx), //
        has(ctx, 1157), // Steel full helm
        has(ctx, 1119), // Steel platebody
        has(ctx, 1069), // Steel platelegs
        has(ctx, 1763), // Red dye
        has(ctx, 1773), // Purple dye
        has(ctx, 950), // Silk
        has(ctx, 2363), // Runite bar
        has(ctx, 3420), // Limestone brick
        has(ctx, 590), // Tinderbox
        has(ctx, 954), // Rope
        has(ctx, 561), // Nature rune
        hasAnyItems(ctx, [2472, 2462, 2466, 2464, 2470, 2468, 2460, 2476, 2474, 259]),
        has(ctx, 1111), // Adamant chainbody
        hasAnyItems(ctx, [245, 2450]),
        hasAnyItems(ctx, [869, 1217]),
        has(ctx, 5301), // Cadantine seed
        has(ctx, 227), // Vial of water
        has(ctx, 233), // Pestle and mortar
        has(ctx, 2347), // Hammer
        has(ctx, 8794), // Saw
        has(ctx, 952),
    ]); // Spade
}

function canCompleteShadowsOfCustodia(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Slayer", 54),
        hasSkillLevel(ctx, "Fishing", 45),
        hasSkillLevel(ctx, "Construction", 41),
        hasSkillLevel(ctx, "Hunter", 36),
        (canTrainSlayer(ctx) || ctx.player.levels.Slayer >= 54), //
        canTrainFishing(ctx), //
        canTrainConstruction(ctx), //
        canTrainHunter(ctx), //
        has(ctx, 847), // Willow longbow
        has(ctx, 1517), // Maple logs
        has(ctx, 2347), // Hammer
        has(ctx, 307),
    ]); // Fishing rod
}

function canCompleteInAidOfTheMyreque(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 25),
        hasSkillLevel(ctx, "Crafting", 25),
        hasSkillLevel(ctx, "Mining", 15),
        hasSkillLevel(ctx, "Magic", 7),
        canCompleteInSearchOfTheMyreque(ctx), //
        canTrainCrafting(ctx), //
        canTrainMining(ctx), //
        has(ctx, 952), // Spade
        has(ctx, 1925), // Bucket
        has(ctx, 2347), // Hammer
        has(ctx, 960), // Plank
        hasAnyNails(ctx), //
        has(ctx, 1941), // Swamp paste
        hasAnyItems(ctx, [353, 355, 3363, 3365, 3367]),
        has(ctx, 1351), // Bronze axe
        has(ctx, 590), // Tinderbox
        has(ctx, 2353), // Steel bar
        has(ctx, 453), // Coal
        has(ctx, 1761), // Soft clay
        has(ctx, 2355), // Silver bar
        has(ctx, 2359), // Mithril bar
        has(ctx, 1607), // Sapphire
        has(ctx, 954),
    ]); // Rope
}

function canCompleteInSearchOfTheMyreque(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Agility", 25),
        canCompleteNatureSpirit(ctx), //
        has(ctx, 1295), // Steel longsword
        has(ctx, 1281), // Stel sword
        has(ctx, 1424), // Steel mace
        has(ctx, 1339), // Steel warhammer
        has(ctx, 1207), // Steel dagger
        has(ctx, 1539), // Steel nails
        has(ctx, 2347), // Hammer
        has(ctx, 960),
    ]); // Plank
}

function canCompleteWaterfallQuest(ctx) {
    return allTrue([
        has(ctx, 556), // Air rune
        has(ctx, 555), // Water rune
        has(ctx, 557), // Earth rune
        has(ctx, 954),
    ]); // Rope
}

function canCompleteDwarfCannon(ctx) {
    return has(ctx, 2347); // Hammer
}

function canCompleteTheRibbitingTaleOfALilyPadLabourDispute(ctx) {
    return allTrue([
        canTrainWoodcutting(ctx), //
        canCompleteChildrenOfTheSun(ctx),
    ]);
}

function canCompleteChildrenOfTheSun(ctx) {
    return true;
}

function canCompleteScrambled(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Construction", 38),
        hasSkillLevel(ctx, "Cooking", 36),
        hasSkillLevel(ctx, "Smithing", 35),
        canTrainConstruction(ctx), //
        canTrainCooking(ctx), //
        canTrainSmithing(ctx), //
        canCompleteChildrenOfTheSun(ctx), //
        has(ctx, 1921), // Bowl of water
        hasAnyNails(ctx), //
        has(ctx, 2347), // Hammer
        has(ctx, 8794), // Saw
        has(ctx, 960),
    ]); // Plank
}

function canCompleteTheRestlessGhost(ctx) {
    return true;
}

function canCompleteTroubledTortugans(ctx) {
    return allTrue([
        canTrainCrafting(ctx), //
        canTrainHunter(ctx), //
        canTrainWoodcutting(ctx), //
        canTrainConstruction(ctx), //
        canCompletePandemonium(ctx), //
        has(ctx, 401),
    ]);     // Seaweed
}

function canCompleteTheFremennikTrials(ctx) {
    return has(ctx, 1917) // Beer
        && has(ctx, 590)  // Tinderbox
        && (has(ctx, 383) // Raw shark
            || (canTrainFishing(ctx) && (has(ctx, 389) || has(ctx, 395))))  // Raw manta ray or Raw sea turtle
}

function canCompleteDruidicRitual(ctx) {
    return allTrue([
        has(ctx, 2136), // Raw bear meat
        has(ctx, 2134), // Raw rat meat
        has(ctx, 2132), // Raw beef
        has(ctx, 2138),
    ]); // Raw chicken
}

function canCompleteClockTower(ctx) {
    return has(ctx, 1929) // Bucket of water
        || has(ctx, 1937) // Jug of water
        || canTrainMining(ctx); // For Ice gloves
}

function canCompletePandemonium(ctx) {
    return allTrue([
        has(ctx, 2347), // Hammer
        has(ctx, 8794),
    ]); // Saw
}

function canCompleteTheHeartOfDarkness(ctx) {
    return allTrue([
        canTrainMining(ctx), //
        (canTrainSlayer(ctx) || ctx.player.levels.Slayer >= 48),
    ]);
}

function canStartIcthlarinsLittleHelper(ctx) {
    return canCompleteGertrudesCat(ctx);
}

function canCompleteIcthlarinsLittleHelper(ctx) {
    return allTrue([
        canCompleteGertrudesCat(ctx), //
        has(ctx, 590), // Tinderbox
        has(ctx, 1519), // Willow logs
        (has(ctx, 4161) || (has(ctx, 1925) && has(ctx, 4689))), // Bag of salt or (Bucket and Pile of salt)
        has(ctx, 4687), // Bucket of sap
        has(ctx, 1823), // Waterskin(4)
        has(ctx, 4684),
    ]); // Linen
}

function canCompleteGertrudesCat(ctx) {
    return allTrue([
        has(ctx, 1927), // Bucket of milk
        has(ctx, 1552),
    ]); // Seasoned sardine
}

function canCompleteEnlightenedJourney(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Firemaking", 20),
        hasSkillLevel(ctx, "Farming", 30),
        hasSkillLevel(ctx, "Crafting", 36),
        hasQuestPoints(ctx, 20), //
        canTrainFiremaking(ctx), //
        canTrainFarming(ctx), //
        canTrainCrafting(ctx), //
        has(ctx, 970), // Papyrus
        has(ctx, 1759), // Ball of wool
        has(ctx, 5438), // Potatoes(10)
        has(ctx, 5418), // Empty sack
        hasCandle(ctx), //
        has(ctx, 1765), // Yellow dye
        has(ctx, 1763), // Red dye
        has(ctx, 950), // Silk
        has(ctx, 1923), // Bowl
        has(ctx, 1511), // Logs
        has(ctx, 1511), // Logs
        has(ctx, 5933), // Willow branch
        has(ctx, 590),
    ]); // Tinderbox
}

function hasCandle(ctx) {
    return has(ctx, 36) // Candle
        || has(ctx, 30) // Bucket of wax (For black candle)
}

function canCompletePriestInPeril(ctx) {
    return allTrue([
        has(ctx, 1925), // Bucket
        hasAnyItems(ctx, [7936, 1436]),
    ]);
}

function canCompleteHazeelCult(ctx) {
    if (ctx.filters?.hazeelCultLocked) {
        return has(ctx, 273); // Poison (item)
    }
    return true;
}

const BONE_VOYAGE_KUDOS_QUESTS = [
    canCompleteDemonSlayer,
    canCompleteRuneMysteries,
    canCompleteShieldOfArrav,
    canCompleteATailOfTwoCats,
    canCompleteHazeelCult,
    canCompleteInAidOfTheMyreque,
    canCompleteMakingHistory,
    canCompleteMerlinsCrystal,
    canCompleteObservatoryQuest,
    canCompletePriestInPeril,
    canCompleteTempleOfIkov,
    canCompleteTheGrandTree,
    canCompleteWhatLiesBelow,
    canCompleteCurseOfTheEmptyLord,
    canCompleteDefenderOfVarrock,
];

function countCompletableKudosquests(ctx) {
    return BONE_VOYAGE_KUDOS_QUESTS.filter(fn => fn(ctx)).length;
}

function canGet153Kudos(ctx) {
    return canCompleteBoneVoyage(ctx) // 153 kudos needed
        // 28 kudos from natural history museum quiz
        // 50 from cleaning finds
        // 72 from fossils
        // 3 kudos needed = 1 quests
        && countCompletableKudosquests(ctx) >= 1;
}

function canGet50Kudos(ctx) {
    return ( // 50 kudos needed
        // 28 kudos from natural history museum quiz
        canCompleteTheDigSite(ctx) // 50 from cleaning finds
        && has(ctx, 1059) // Leather gloves
        && has(ctx, 1061) // Leather boots
    ) //
        // OR 22 kudos needed = 5 quests
        || countCompletableKudosquests(ctx) >= 5;
}

function canCompleteBoneVoyage(ctx) {
    return allTrue([
        canCompleteTheDigSite(ctx), //
        has(ctx, 2015), // Vodka
        has(ctx, 93)   // Marrentill potion (unf)
        // 100 kudos needed
        // 28 kudos from natural history museum quiz
        , // 50 from cleaning finds
        has(ctx, 1059), // Leather gloves
        has(ctx, 1061) // Leather boots
        , // 22 kudos needed = 5 quests
        countCompletableKudosquests(ctx) >= 5,
    ]);
}

function canCompleteElementalWorkshopI(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Smithing", 20),
        hasSkillLevel(ctx, "Crafting", 20),
        canTrainMining(ctx), //
        canTrainCrafting(ctx), //
        has(ctx, 2347), // Hammer
        has(ctx, 1733), // Needle
        has(ctx, 1734), // Thread
        has(ctx, 1741), // Leather
        has(ctx, 453),
    ]); // Coal
}

function canCompleteElementalWorkshopII(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Magic", 20),
        hasSkillLevel(ctx, "Smithing", 30),
        canCompleteElementalWorkshopI(ctx),
    ]);
}

function canCompleteAnotherSliceOfHAM(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Attack", 15),
        hasSkillLevel(ctx, "Prayer", 25),
        canCompleteDeathToTheDorgeshuun(ctx), //
        canCompleteTheGiantDwarf(ctx), //
        canCompleteTheDigSite(ctx), //
        canTrainPrayer(ctx),
    ]); //
}

function canCompleteTheGiantDwarf(ctx) {
    return allTrue([
        canTrainCrafting(ctx), //
        canTrainFiremaking(ctx), //
        has(ctx, 563), // Law rune
        hasAirRuneSource(ctx), //
        hasAnyLog(ctx), //
        has(ctx, 453), // Coal
        has(ctx, 2351), // Iron bar
        has(ctx, 1607), // Sapphire
        has(ctx, 2325), // Redberry pie
        has(ctx, 590),
    ]); // Tinderbox
}

function canCompleteImpCatcher(ctx) {
    return allTrue([
        has(ctx, 1470), // Red bead
        has(ctx, 1472), // Yellow bead
        has(ctx, 1474), // Black bead
        has(ctx, 1476),
    ]); // White bead
}

function canCompleteZogreFleshEaters(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Smithing", 4),
        hasSkillLevel(ctx, "Herblore", 8),
        hasSkillLevel(ctx, "Ranged", 30),
        canCompleteBigChompyBirdHunting(ctx), //
        canCompleteJunglePotion(ctx), //
        canTrainSmithing(ctx),
    ]);
}

function canStartZogreFleshEaters(ctx) {
    return canCompleteBigChompyBirdHunting(ctx) //
        && canCompleteJunglePotion(ctx);
}

function canCompleteJunglePotion(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Herblore", 3),
        canCompleteDruidicRitual(ctx),
    ]);
}

function canCompleteBigChompyBirdHunting(ctx) {
    return allTrue([
        hasSkillLevel(ctx, "Fletching", 5),
        hasSkillLevel(ctx, "Cooking", 30),
        hasSkillLevel(ctx, "Ranged", 30),
        canTrainFletching(ctx), //
        canTrainCooking(ctx), //
        canTrainWoodcutting(ctx), //
        has(ctx, 314), // Feather
        has(ctx, 946), // Knife
        has(ctx, 1755), // Chisel
        has(ctx, 1965), // Cabbage
        has(ctx, 1982), // Tomato
        has(ctx, 1957), // Onion
        has(ctx, 1942), // Potato
        has(ctx, 2128), // Equa leaves
        has(ctx, 1573), // Doogle leaves
        has(ctx, 2862), // Achey tree logs
        has(ctx, 2864), // Ogre arrow shaft
        has(ctx, 2865), // Flighted ogre arrow
        has(ctx, 2859), // Wolf bones
        has(ctx, 2861), // Wolfbone arrowtips
        has(ctx, 2866), // Ogre arrow
        has(ctx, 2876),
    ]);// Raw chompy
}

function canTrainCrafting(ctx) {
    if (ctx.filters?.overrideCrafting) return true;
    return has(ctx, 1737) // Wool
        || has(ctx, 1761) // Soft clay
        || (has(ctx, 1741) // Leather
            && ctx.filters?.isFreeToPlay //
            ? (has(ctx, 1733) && has(ctx, 1734)) // Needle and Thread
            : true
        ) //
        || (has(ctx, 1775) // Molten glass
            && has(ctx, 1785) // Glassblowing pipe
        )
        || (has(ctx, 1625) // Uncut jade
            && has(ctx, 1755) // Chisel
        )
        || (has(ctx, 1592) // Ring mould
            && has(ctx, 1609) // Opal
            && has(ctx, 2355) // Silver bar
        )
        || (has(ctx, 1592) // Ring mould
            && has(ctx, 2357) // Gold bar
            && ctx.player.levels.Crafting >= 5
        )
        || (has(ctx, 1597) // Necklace mould
            && has(ctx, 2357) // Gold bar
            && ctx.player.levels.Crafting >= 6
        )
        || (has(ctx, 11065) // Bracelet mould
            && has(ctx, 2357) // Gold bar
            && ctx.player.levels.Crafting >= 7
        )
        || (has(ctx, 1595) // Amulet mould
            && has(ctx, 2357) // Gold bar
            && ctx.player.levels.Crafting >= 8
        ); // TODO could add more.
}

function canTrainPrayer(ctx) {
    return has(ctx, 3183) // Monkey bones
        || has(ctx, 4834) // Ourg bones
        || has(ctx, 4832) // Raurg bones
        || has(ctx, 3123) // Shaikahan bones
        || has(ctx, 31726) // Strykewyrm bones
        || (has(ctx, 22124) && ctx.player.levels.Prayer >= 70) // Superior dragon bones
        || has(ctx, 2859) // Wolf bones
        || has(ctx, 22780) // Wyrm bones
        || has(ctx, 28899) // Wyrmling bones
        || has(ctx, 6812) // Wyvern bones
        || has(ctx, 4812) // Zogre bones
        || has(ctx, 534) // Babydragon bones
        || has(ctx, 530) // Bat bones
        || has(ctx, 532) // Big bones
        || has(ctx, 526) // Bones
        || has(ctx, 528) // Burnt bones
        || has(ctx, 6729) // Dagannoth bones
        || has(ctx, 536) // Dragon bones
        || has(ctx, 22783) // Drake bones
        || has(ctx, 4830) // Fayrg bones
        || has(ctx, 31729) // Frost dragon bones
        || has(ctx, 22786) // Hydra bones
        || has(ctx, 3125) // Jogre bones
        || has(ctx, 11943) // Lava dragon bones
        || has(ctx, 25769) // Vile ashes
        || has(ctx, 25775) // Abyssal ashes
        || has(ctx, 25766) // Fiendish ashes
        || has(ctx, 25778) // Infernal ashes
        || has(ctx, 25772) // Malicious ashes
        || ( // Basic reanimation
            (has(ctx, 559) && has(ctx, 561)) // Body rune and Nature rune
            && (has(ctx, 13448) // Ensouled goblin head
                || has(ctx, 13451) // Ensouled monkey head
                || has(ctx, 13454) // Ensouled imp head
                || has(ctx, 13457) // Ensouled minotaur head
                || has(ctx, 13460) // Ensouled scorpion head
                || has(ctx, 13463) // Ensouled bear head
                || has(ctx, 13466) // Ensouled unicorn head
            )
        ) //
        || ( // Adept reanimation
            (has(ctx, 559) && has(ctx, 561) && has(ctx, 566)) // Body rune and Nature rune and Soul rune
            && (has(ctx, 13469) // Ensouled dog head
                || has(ctx, 13472) // Ensouled chaos druid head
                || has(ctx, 13475) // Ensouled giant head
                || has(ctx, 13478) // Ensouled ogre head
                || has(ctx, 13481) // Ensouled elf head
                || has(ctx, 13484) // Ensouled troll head
                || has(ctx, 13487) // Ensouled horror head
            )
        ) //
        || ( // Expert reanimation
            (has(ctx, 565) && has(ctx, 561) && has(ctx, 566)) // Blood rune and Nature rune and Soul rune
            && (has(ctx, 13490) // Ensouled kalphite head
                || has(ctx, 13493) // Ensouled dagannoth head
                || has(ctx, 13496) // Ensouled bloodveld head
                || has(ctx, 13499) // Ensouled tzhaar head
                || has(ctx, 13502) // Ensouled demon head
                || has(ctx, 26997) // Ensouled hellhound head
            )
        ) //
        || ( // Master reanimation
            (has(ctx, 565) && has(ctx, 561) && has(ctx, 566)) // Blood rune and Nature rune and Soul rune
            && (has(ctx, 13505) // Ensouled aviansie head
                || has(ctx, 13508) // Ensouled abyssal head
                || has(ctx, 13511) // Ensouled dragon head
            )
        ); //
}

function canTrainRunecraft(ctx) {
    return canCompleteRuneMysteries(ctx) &&
        (
            has(ctx, 5525)    // Tiara
            || has(ctx, 1436) // Rune essence
            || has(ctx, 7936) // Pure essence
        );
}

function canTrainWoodcutting(ctx) {
    if (ctx.filters?.overrideWoodcutting) return true;
    const level = ctx.player?.levels?.Woodcutting ?? 1;
    const usableAxeIds = [];
    if (level >= 1) {
        usableAxeIds.push(
            1351, // Bronze axe
            1349  // Iron axe
        );
    }
    if (level >= 6) {
        usableAxeIds.push(1353); // Steel axe
    }
    if (level >= 11) {
        usableAxeIds.push(1361); // Black axe
    }
    if (level >= 21) {
        usableAxeIds.push(1355); // Mithril axe
    }
    if (level >= 31) {
        usableAxeIds.push(1357); // Adamant axe
    }
    if (level >= 41) {
        usableAxeIds.push(1359); // Rune axe
    }
    if (level >= 61) {
        usableAxeIds.push(
            6739,  // Dragon axe
            20011  // 3rd age axe
        );
    }
    if (usableAxeIds.length === 0) return false;
    return hasAnyItems(ctx, usableAxeIds);
}

function canTrainMining(ctx) {
    if (ctx.filters?.overrideMining) return true;
    const level = ctx.player?.levels?.Mining ?? 1;
    const usablePickaxeIds = [];
    if (level >= 1) {
        usablePickaxeIds.push(
            1265, // Bronze pickaxe
            1267  // Iron pickaxe
        );
    }
    if (level >= 6) {
        usablePickaxeIds.push(1269); // Steel pickaxe
    }
    if (level >= 11) {
        usablePickaxeIds.push(12297); // Black pickaxe
    }
    if (level >= 21) {
        usablePickaxeIds.push(1273); // Mithril pickaxe
    }
    if (level >= 31) {
        usablePickaxeIds.push(1271); // Adamant pickaxe
    }
    if (level >= 41) {
        usablePickaxeIds.push(1275); // Rune pickaxe
    }
    if (level >= 61) {
        usablePickaxeIds.push(
            11920, // Dragon pickaxe
            20014  // 3rd age pickaxe
        );
    }
    if (usablePickaxeIds.length === 0) return false;
    return hasAnyItems(ctx, usablePickaxeIds);
}

function canTrainHerblore(ctx) {
    return canCompleteDruidicRitual(ctx)
        && has(ctx, 199)  // Grimy guam leaf
        && has(ctx, 201)  // Grimy marrentill
        && has(ctx, 203); // Grimy tarromin
}

function canTrainFishing(ctx) {
    if (ctx.filters?.overrideFishing) return true;
    return has(ctx, 303) // Small fishing net
        || has(ctx, 305) // Big fishing net
        || (has(ctx, 307) && has(ctx, 313)); // Fishing rod & Fishing bait
}

function canTrainSlayer(ctx) {
    if (ctx.filters?.isSlayerLocked) return false;
    return true;
}

function canTrainHunter(ctx) {
    return has(ctx, 10006) // Bird snare
        || has(ctx, 10150) // Noose wand
        || has(ctx, 10010) // Butterfly net
        || ctx.player.levels.Hunter >= 25; // Barehanding butterflies
}

function canTrainCooking(ctx) {
    if (ctx.filters?.overrideCooking) return true;
    return has(ctx, 25833) // Raw boar meat
        || has(ctx, 2132) // Raw beef
        || has(ctx, 2136) // Raw bear meat
        || has(ctx, 2134) // Raw rat meat
        || has(ctx, 2138) // Raw chicken
        || has(ctx, 317)  // Raw shrimps
        || has(ctx, 3226) // Raw rabbit
        || has(ctx, 327)  // Raw sardine
        || has(ctx, 321)  // Raw anchovies
        || has(ctx, 1859) // Raw ugthanki meat
        || has(ctx, 2307) // Bread dough
        || has(ctx, 3142) // Raw karambwan
        || has(ctx, 345); // Raw herring
}

function canFillFishFoodBox(ctx) {
    return has(ctx, 6681) // Ground guam
        && has(ctx, 401); // Seaweed
}

function hasAnyFilledBowl(ctx) {
    return hasAnyItems(ctx, [
        1921, // Bowl of water
        4456, // Bowl of hot water
        2003, // Stew
        4016, // Banana stew
        2011, // Curry
        7074, // Chopped garlic
        1871, // Chopped onion
        1869, // Chopped tomato
        7086, // Chopped tuna
        1873, // Chopped ugthanki
        7070, // Minced meat
        7080, // Sliced mushrooms
        7088, // Sweetcorn (bowl)
        7068, // Tuna and corn
        7076  // Uncooked egg
    ]);
}

function hasAnyFilledVial(ctx) {
    if (ctx.filters?.hideBosses === false) return true;
    return has(ctx, 11463) // Agility mix(1)
        || has(ctx, 11461) // Agility mix(2)
        || has(ctx, 3038) // Agility potion(1)
        || has(ctx, 3036) // Agility potion(2)
        || has(ctx, 3034) // Agility potion(3)
        || has(ctx, 3032) // Agility potion(4)
        || has(ctx, 26346) // Ancient brew(1)
        || has(ctx, 26344) // Ancient brew(2)
        || has(ctx, 26342) // Ancient brew(3)
        || has(ctx, 26340) // Ancient brew(4)
        || has(ctx, 26353) // Ancient mix(1)
        || has(ctx, 26350) // Ancient mix(2)
        || has(ctx, 11475) // Anti-poison supermix(1)
        || has(ctx, 11473) // Anti-poison supermix(2)
        || has(ctx, 12911) // Anti-venom(1)
        || has(ctx, 12909) // Anti-venom(2)
        || has(ctx, 12907) // Anti-venom(3)
        || has(ctx, 12905) // Anti-venom(4)
        || has(ctx, 12919) // Anti-venom+(1)
        || has(ctx, 12917) // Anti-venom+(2)
        || has(ctx, 12915) // Anti-venom+(3)
        || has(ctx, 12913) // Anti-venom+(4)
        || has(ctx, 11503) // Antidote+ mix(1)
        || has(ctx, 11501) // Antidote+ mix(2)
        || has(ctx, 5949) // Antidote+(1)
        || has(ctx, 5947) // Antidote+(2)
        || has(ctx, 5945) // Antidote+(3)
        || has(ctx, 5943) // Antidote+(4)
        || has(ctx, 5958) // Antidote++(1)
        || has(ctx, 5956) // Antidote++(2)
        || has(ctx, 5954) // Antidote++(3)
        || has(ctx, 5952) // Antidote++(4)
        || has(ctx, 11507) // Antifire mix(1)
        || has(ctx, 11505) // Antifire mix(2)
        || has(ctx, 2458) // Antifire potion(1)
        || has(ctx, 2456) // Antifire potion(2)
        || has(ctx, 2454) // Antifire potion(3)
        || has(ctx, 2452) // Antifire potion(4)
        || has(ctx, 11435) // Antipoison mix(1)
        || has(ctx, 11433) // Antipoison mix(2)
        || has(ctx, 179) // Antipoison(1)
        || has(ctx, 177) // Antipoison(2)
        || has(ctx, 175) // Antipoison(3)
        || has(ctx, 2446) // Antipoison(4)
        || has(ctx, 31659) // Armadyl brew(1)
        || has(ctx, 31656) // Armadyl brew(2)
        || has(ctx, 31653) // Armadyl brew(3)
        || has(ctx, 31650) // Armadyl brew(4)
        || has(ctx, 11431) // Attack mix(1)
        || has(ctx, 11429) // Attack mix(2)
        || has(ctx, 125) // Attack potion(1)
        || has(ctx, 123) // Attack potion(2)
        || has(ctx, 121) // Attack potion(3)
        || has(ctx, 2428) // Attack potion(4)
        || has(ctx, 103) // Avantoe potion (unf)
        || has(ctx, 22470) // Bastion potion(1)
        || has(ctx, 22467) // Bastion potion(2)
        || has(ctx, 22464) // Bastion potion(3)
        || has(ctx, 22461) // Bastion potion(4)
        || has(ctx, 22458) // Battlemage potion(1)
        || has(ctx, 22455) // Battlemage potion(2)
        || has(ctx, 22452) // Battlemage potion(3)
        || has(ctx, 22449) // Battlemage potion(4)
        || has(ctx, 29640) // Blighted overload (1)
        || has(ctx, 29637) // Blighted overload (2)
        || has(ctx, 29634) // Blighted overload (3)
        || has(ctx, 29631) // Blighted overload (4)
        || has(ctx, 24598) // Blighted super restore(4)
        || has(ctx, 22443) // Cadantine blood potion (unf)
        || has(ctx, 107) // Cadantine potion (unf)
        || has(ctx, 11447) // Combat mix(1)
        || has(ctx, 11445) // Combat mix(2)
        || has(ctx, 9745) // Combat potion(1)
        || has(ctx, 9743) // Combat potion(2)
        || has(ctx, 9741) // Combat potion(3)
        || has(ctx, 9739) // Combat potion(4)
        || has(ctx, 6476) // Compost potion(1)
        || has(ctx, 6474) // Compost potion(2)
        || has(ctx, 6472) // Compost potion(3)
        || has(ctx, 6470) // Compost potion(4)
        || has(ctx, 11459) // Defence mix(1)
        || has(ctx, 11457) // Defence mix(2)
        || has(ctx, 137) // Defence potion(1)
        || has(ctx, 135) // Defence potion(2)
        || has(ctx, 133) // Defence potion(3)
        || has(ctx, 2432) // Defence potion(4)
        || has(ctx, 24644) // Divine bastion potion(1)
        || has(ctx, 24641) // Divine bastion potion(2)
        || has(ctx, 24638) // Divine bastion potion(3)
        || has(ctx, 24635) // Divine bastion potion(4)
        || has(ctx, 24632) // Divine battlemage potion(1)
        || has(ctx, 24629) // Divine battlemage potion(2)
        || has(ctx, 24626) // Divine battlemage potion(3)
        || has(ctx, 24623) // Divine battlemage potion(4)
        || has(ctx, 23754) // Divine magic potion(1)
        || has(ctx, 23751) // Divine magic potion(2)
        || has(ctx, 23748) // Divine magic potion(3)
        || has(ctx, 23745) // Divine magic potion(4)
        || has(ctx, 23742) // Divine ranging potion(1)
        || has(ctx, 23739) // Divine ranging potion(2)
        || has(ctx, 23736) // Divine ranging potion(3)
        || has(ctx, 23733) // Divine ranging potion(4)
        || has(ctx, 23706) // Divine super attack potion(1)
        || has(ctx, 23703) // Divine super attack potion(2)
        || has(ctx, 23700) // Divine super attack potion(3)
        || has(ctx, 23697) // Divine super attack potion(4)
        || has(ctx, 23694) // Divine super combat potion(1)
        || has(ctx, 23691) // Divine super combat potion(2)
        || has(ctx, 23688) // Divine super combat potion(3)
        || has(ctx, 23685) // Divine super combat potion(4)
        || has(ctx, 23730) // Divine super defence potion(1)
        || has(ctx, 23727) // Divine super defence potion(2)
        || has(ctx, 23724) // Divine super defence potion(3)
        || has(ctx, 23721) // Divine super defence potion(4)
        || has(ctx, 23718) // Divine super strength potion(1)
        || has(ctx, 23715) // Divine super strength potion(2)
        || has(ctx, 23712) // Divine super strength potion(3)
        || has(ctx, 23709) // Divine super strength potion(4)
        || has(ctx, 109) // Dwarf weed potion (unf)
        || has(ctx, 31662) // Elkhorn potion (unf)
        || has(ctx, 11455) // Energy mix(1)
        || has(ctx, 11453) // Energy mix(2)
        || has(ctx, 3014) // Energy potion(1)
        || has(ctx, 3012) // Energy potion(2)
        || has(ctx, 3010) // Energy potion(3)
        || has(ctx, 3008) // Energy potion(4)
        || has(ctx, 29833) // Extended anti-venom+(1)
        || has(ctx, 29830) // Extended anti-venom+(2)
        || has(ctx, 29827) // Extended anti-venom+(3)
        || has(ctx, 29824) // Extended anti-venom+(4)
        || has(ctx, 11962) // Extended antifire mix(1)
        || has(ctx, 11960) // Extended antifire mix(2)
        || has(ctx, 11957) // Extended antifire(1)
        || has(ctx, 11955) // Extended antifire(2)
        || has(ctx, 11953) // Extended antifire(3)
        || has(ctx, 11951) // Extended antifire(4)
        || has(ctx, 31647) // Extended stamina potion(1)
        || has(ctx, 31644) // Extended stamina potion(2)
        || has(ctx, 31641) // Extended stamina potion(3)
        || has(ctx, 31638) // Extended stamina potion(4)
        || has(ctx, 22224) // Extended super antifire mix(1)
        || has(ctx, 22221) // Extended super antifire mix(2)
        || has(ctx, 22218) // Extended super antifire(1)
        || has(ctx, 22215) // Extended super antifire(2)
        || has(ctx, 22212) // Extended super antifire(3)
        || has(ctx, 22209) // Extended super antifire(4)
        || has(ctx, 31623) // Extreme energy potion(1)
        || has(ctx, 31620) // Extreme energy potion(2)
        || has(ctx, 31617) // Extreme energy potion(3)
        || has(ctx, 31614) // Extreme energy potion(4)
        || has(ctx, 11479) // Fishing mix(1)
        || has(ctx, 11477) // Fishing mix(2)
        || has(ctx, 155) // Fishing potion(1)
        || has(ctx, 153) // Fishing potion(2)
        || has(ctx, 151) // Fishing potion(3)
        || has(ctx, 2438) // Fishing potion(4)
        || has(ctx, 27638) // Forgotten brew(1)
        || has(ctx, 27635) // Forgotten brew(2)
        || has(ctx, 27632) // Forgotten brew(3)
        || has(ctx, 27629) // Forgotten brew(4)
        || has(ctx, 30146) // Goading potion(1)
        || has(ctx, 30143) // Goading potion(2)
        || has(ctx, 30140) // Goading potion(3)
        || has(ctx, 30137) // Goading potion(4)
        || has(ctx, 91) // Guam potion (unf)
        || has(ctx, 7666) // Guthix balance(1)
        || has(ctx, 7664) // Guthix balance(2)
        || has(ctx, 7662) // Guthix balance(3)
        || has(ctx, 7660) // Guthix balance(4)
        || has(ctx, 4423) // Guthix rest(1)
        || has(ctx, 4421) // Guthix rest(2)
        || has(ctx, 4419) // Guthix rest(3)
        || has(ctx, 4417) // Guthix rest(4)
        || has(ctx, 97) // Harralander potion (unf)
        || has(ctx, 30100) // Huasca potion (unf)
        || has(ctx, 10004) // Hunter potion(1)
        || has(ctx, 10002) // Hunter potion(2)
        || has(ctx, 10000) // Hunter potion(3)
        || has(ctx, 9998) // Hunter potion(4)
        || has(ctx, 11519) // Hunting mix(1)
        || has(ctx, 11517) // Hunting mix(2)
        || has(ctx, 101) // Irit potion (unf)
        || has(ctx, 105) // Kwuarm potion (unf)
        || has(ctx, 2483) // Lantadyme potion (unf)
        || has(ctx, 11491) // Magic essence mix(1)
        || has(ctx, 11489) // Magic essence mix(2)
        || has(ctx, 11515) // Magic mix(1)
        || has(ctx, 11513) // Magic mix(2)
        || has(ctx, 3046) // Magic potion(1)
        || has(ctx, 3044) // Magic potion(2)
        || has(ctx, 3042) // Magic potion(3)
        || has(ctx, 3040) // Magic potion(4)
        || has(ctx, 93) // Marrentill potion (unf)
        || has(ctx, 27211) // Menaphite remedy(1)
        || has(ctx, 27208) // Menaphite remedy(2)
        || has(ctx, 27205) // Menaphite remedy(3)
        || has(ctx, 27202) // Menaphite remedy(4)
        || has(ctx, 31665) // Pillar potion (unf)
        || has(ctx, 11467) // Prayer mix(1)
        || has(ctx, 11465) // Prayer mix(2)
        || has(ctx, 143) // Prayer potion(1)
        || has(ctx, 141) // Prayer potion(2)
        || has(ctx, 139) // Prayer potion(3)
        || has(ctx, 2434) // Prayer potion(4)
        || has(ctx, 30134) // Prayer regeneration potion(1)
        || has(ctx, 30131) // Prayer regeneration potion(2)
        || has(ctx, 30128) // Prayer regeneration potion(3)
        || has(ctx, 30125) // Prayer regeneration potion(4)
        || has(ctx, 99) // Ranarr potion (unf)
        || has(ctx, 11511) // Ranging mix(1)
        || has(ctx, 11509) // Ranging mix(2)
        || has(ctx, 173) // Ranging potion(1)
        || has(ctx, 171) // Ranging potion(2)
        || has(ctx, 169) // Ranging potion(3)
        || has(ctx, 2444) // Ranging potion(4)
        || has(ctx, 4848) // Relicym's balm(1)
        || has(ctx, 4846) // Relicym's balm(2)
        || has(ctx, 4844) // Relicym's balm(3)
        || has(ctx, 4842) // Relicym's balm(4)
        || has(ctx, 11439) // Relicym's mix(1)
        || has(ctx, 11437) // Relicym's mix(2)
        || has(ctx, 11451) // Restore mix(1)
        || has(ctx, 11449) // Restore mix(2)
        || has(ctx, 131) // Restore potion(1)
        || has(ctx, 129) // Restore potion(2)
        || has(ctx, 127) // Restore potion(3)
        || has(ctx, 2430) // Restore potion(4)
        || has(ctx, 10931) // Sanfew serum(1)
        || has(ctx, 10929) // Sanfew serum(2)
        || has(ctx, 10927) // Sanfew serum(3)
        || has(ctx, 10925) // Sanfew serum(4)
        || has(ctx, 6691) // Saradomin brew(1)
        || has(ctx, 6689) // Saradomin brew(2)
        || has(ctx, 6687) // Saradomin brew(3)
        || has(ctx, 6685) // Saradomin brew(4)
        || has(ctx, 3414) // Serum 207 (1)
        || has(ctx, 3412) // Serum 207 (2)
        || has(ctx, 3410) // Serum 207 (3)
        || has(ctx, 3408) // Serum 207 (4)
        || has(ctx, 3004) // Snapdragon potion (unf)
        || has(ctx, 29201) // Snowy knight mix (1)
        || has(ctx, 29183) // Snowy knight mix (2)
        || has(ctx, 12635) // Stamina mix(1)
        || has(ctx, 12633) // Stamina mix(2)
        || has(ctx, 12631) // Stamina potion(1)
        || has(ctx, 12629) // Stamina potion(2)
        || has(ctx, 12627) // Stamina potion(3)
        || has(ctx, 12625) // Stamina potion(4)
        || has(ctx, 11441) // Strength mix(1)
        || has(ctx, 11443) // Strength mix(2)
        || has(ctx, 119) // Strength potion(1)
        || has(ctx, 117) // Strength potion(2)
        || has(ctx, 115) // Strength potion(3)
        || has(ctx, 113) // Strength potion(4)
        || has(ctx, 21997) // Super antifire mix(1)
        || has(ctx, 21994) // Super antifire mix(2)
        || has(ctx, 21987) // Super antifire potion(1)
        || has(ctx, 21984) // Super antifire potion(2)
        || has(ctx, 21981) // Super antifire potion(3)
        || has(ctx, 21978) // Super antifire potion(4)
        || has(ctx, 149) // Super attack(1)
        || has(ctx, 147) // Super attack(2)
        || has(ctx, 145) // Super attack(3)
        || has(ctx, 2436) // Super attack(4)
        || has(ctx, 12701) // Super combat potion(1)
        || has(ctx, 12699) // Super combat potion(2)
        || has(ctx, 12697) // Super combat potion(3)
        || has(ctx, 12695) // Super combat potion(4)
        || has(ctx, 11499) // Super def. mix(1)
        || has(ctx, 11497) // Super def. mix(2)
        || has(ctx, 167) // Super defence(1)
        || has(ctx, 165) // Super defence(2)
        || has(ctx, 163) // Super defence(3)
        || has(ctx, 2442) // Super defence(4)
        || has(ctx, 11483) // Super energy mix(1)
        || has(ctx, 11481) // Super energy mix(2)
        || has(ctx, 3022) // Super energy(1)
        || has(ctx, 3020) // Super energy(2)
        || has(ctx, 3018) // Super energy(3)
        || has(ctx, 3016) // Super energy(4)
        || has(ctx, 31611) // Super fishing potion(1)
        || has(ctx, 31608) // Super fishing potion(2)
        || has(ctx, 31605) // Super fishing potion(3)
        || has(ctx, 31602) // Super fishing potion(4)
        || has(ctx, 31635) // Super hunter potion(1)
        || has(ctx, 31632) // Super hunter potion(2)
        || has(ctx, 31629) // Super hunter potion(3)
        || has(ctx, 31626) // Super hunter potion(4)
        || has(ctx, 11495) // Super restore mix(1)
        || has(ctx, 11493) // Super restore mix(2)
        || has(ctx, 3030) // Super restore(1)
        || has(ctx, 3028) // Super restore(2)
        || has(ctx, 3026) // Super restore(3)
        || has(ctx, 3024) // Super restore(4)
        || has(ctx, 11487) // Super str. mix(1)
        || has(ctx, 11485) // Super str. mix(2)
        || has(ctx, 161) // Super strength(1)
        || has(ctx, 159) // Super strength(2)
        || has(ctx, 157) // Super strength(3)
        || has(ctx, 2440) // Super strength(4)
        || has(ctx, 185) // Superantipoison(1)
        || has(ctx, 183) // Superantipoison(2)
        || has(ctx, 181) // Superantipoison(3)
        || has(ctx, 2448) // Superantipoison(4)
        || has(ctx, 11471) // Superattack mix(1)
        || has(ctx, 11469) // Superattack mix(2)
        || has(ctx, 95) // Tarromin potion (unf)
        || has(ctx, 3002) // Toadflax potion (unf)
        || has(ctx, 111) // Torstol potion (unf)
        || has(ctx, 31668) // Umbral potion (unf)
        || has(ctx, 3406) // Unfinished potion
        || has(ctx, 22446) // Vial of blood
        || has(ctx, 227) // Vial of water
        || has(ctx, 193) // Zamorak brew(1)
        || has(ctx, 191) // Zamorak brew(2)
        || has(ctx, 189) // Zamorak brew(3)
        || has(ctx, 2450) // Zamorak brew(4)
        || has(ctx, 11523) // Zamorak mix(1)
        || has(ctx, 11521); // Zamorak mix(2)
}

function hasAnyFilledCup(ctx) {
    return hasAnyItems(ctx, [
        4460, // Cup of hot water
        1978, // Cup of tea
        4458, // Cup of water
        4423, // Guthix rest(1)
        4421, // Guthix rest(2)
        4419, // Guthix rest(3)
        4417  // Guthix rest(4)
    ]);
}

function hasAnyFilledBucket(ctx) {
    return hasAnyItems(ctx, [
        1927, // Bucket of milk
        1783, // Bucket of sand
        4687, // Bucket of sap
        1929, // Bucket of water
        30    // Bucket of wax
    ]);
}

function hasAnyFilledJug(ctx) {
    return hasAnyItems(ctx, [
        1937, // Jug of water
        1993  // Jug of wine
    ]);
}

function hasAnyFilledPot(ctx) {
    return hasAnyItems(ctx, [
        1933, // Pot of flour
        7468, // Pot of cornflour
        4436  // Airtight pot
    ]);
}

function hasAnyAle(ctx) {
    return hasAnyItems(ctx, [
        1905,  // Asgarnian ale
        5739,  // Asgarnian ale(m)
        5751,  // Axeman's folly
        5753,  // Axeman's folly(m)
        4627,  // Bandit's brew
        1917,  // Beer
        5755,  // Chef's delight
        5757,  // Chef's delight(m)
        5763,  // Cider
        5929,  // Cider(m)
        1911,  // Dragon bitter
        5745,  // Dragon bitter(m)
        1913,  // Dwarven stout
        5747,  // Dwarven stout(m)
        1909,  // Greenman's ale
        5743,  // Greenman's ale(m)
        1915,  // Grog
        25826, // Lizardkicker
        2955,  // Moonlight mead
        5749,  // Moonlight mead(m)
        5761,  // Slayer's respite
        5761,  // Slayer's respite(m)
        29412, // Steamforge brew
        29409, // Sunbeam ale
        29277, // Trapper's tipple
        24774, // Blood pint
        22430, // Bloody bracer
        22430, // Wizard's mind bomb
        5741,  // Mature wmb
        23948  // Elven dawn
    ]);
}

function canTrainFarming(ctx) {
    return has(ctx, 5341) // Rake
        || has(ctx, 8431);// Bagged plant 1
}

function canPlantTrees(ctx) {
    return canTrainFarming(ctx) //
        && has(ctx, 5341) // Rake
        && has(ctx, 952); // Spade
}

function canPlantHardwoodTrees(ctx) {
    return canPlantTrees(ctx) //
        && (
            canCompleteBoneVoyage(ctx) //
            || canTrainWoodcutting(ctx) //
            || canCompletePandemonium(ctx) //
        );
}

function canPlantPlants(ctx) {
    return canTrainFarming(ctx) //
        && has(ctx, 5341); // Rake
}

function canTrainConstruction(ctx) {
    if (ctx.filters?.overrideConstruction) return true;
    return has(ctx, 8431) // Bagged plant 1
        || (
            (has(ctx, 2347) && has(ctx, 8794)) // Hammer and Saw
            && (has(ctx, 2351) || (has(ctx, 960) && hasAnyNails(ctx)))  // Iron bar or Plank and any nails
        );
}

function canTrainFletching(ctx) {
    if (ctx.filters?.overrideFletching) return true;
    return ((has(ctx, 946) || hasNarwhalKnife(ctx)) && has(ctx, 1511)) // Knife & Logs
        || (has(ctx, 52) && hasAnyFeather(ctx)) // Arrow shaft & Feather
        || (has(ctx, 53) && has(ctx, 39)) // Headless arrow & Bronze arrowtip
}

function canTrainFiremaking(ctx) {
    return has(ctx, 590) // Tinderbox
        || canTrainWoodcutting(ctx); // For training FM in COX
}

function canTrainSmithing(ctx) {
    return has(ctx, 2347); // Hammer
}

function canDoGnomeRestaurant(ctx) {
    return canTrainCooking(ctx) //
        && ( //
            ( // Crunchies
                (has(ctx, 2171) && has(ctx, 2165) && has(ctx, 2169)) // Gianne dough, Crunchy tray & Gnome spice
                && (
                    (has(ctx, 2128) && has(ctx, 2217)) // Toad crunchies
                    || (has(ctx, 2128) && has(ctx, 2213)) // Spicy crunchies
                    || (has(ctx, 2128) && has(ctx, 2162) && has(ctx, 2205)) // Worm crunchies
                    || (has(ctx, 1973) && has(ctx, 1975) && has(ctx, 2209)) // Chocchip crunchies
                )
            ) //
            || ( // Battas
                (has(ctx, 2171) && has(ctx, 2164) && has(ctx, 2128)) // Gianne dough, Batta tin & Equa leaves
                && (
                    (has(ctx, 2120) && has(ctx, 2122) && has(ctx, 2108) && has(ctx, 2110) && has(ctx, 2114) && has(ctx, 2116) && has(ctx, 2169) && has(ctx, 2277)) // Fruit batta
                    || (has(ctx, 2169) && has(ctx, 1985) && has(ctx, 2152) && has(ctx, 2255)) // Toad Batta
                    || (has(ctx, 2169) && has(ctx, 1985) && has(ctx, 2162) && has(ctx, 2253)) // Worm Batta
                    || (has(ctx, 1982) && has(ctx, 2126) && has(ctx, 1957) && has(ctx, 1985) && has(ctx, 1965) && has(ctx, 2281)) // Vegetable Batta
                    || (has(ctx, 1982) && has(ctx, 1985) && has(ctx, 2259)) // Cheese+tom batta
                )
            )
            || ( // Gnomebowls
                (has(ctx, 2171) && has(ctx, 2166) && has(ctx, 2128)) // Gianne dough, Gnomebowl & Equa leaves
                && (
                    (has(ctx, 2162) && has(ctx, 1957) && has(ctx, 2169) && has(ctx, 2191)) // Worm hole
                    || (has(ctx, 1957) && has(ctx, 1942) && has(ctx, 2152) && has(ctx, 2195)) // Veg bowl
                    || (has(ctx, 2152) && has(ctx, 2169) && has(ctx, 1985) && has(ctx, 2126) && has(ctx, 2187)) // Tangled toad's legs
                    || (has(ctx, 1973) && has(ctx, 1975) && has(ctx, 2130) && has(ctx, 2185)) // Chocolate bomb
                )
            )
            || ( // Cocktails
                (has(ctx, 2025) && has(ctx, 2026)) // Cocktail shaker & Cocktail glass
                && (
                    (has(ctx, 2114) && has(ctx, 2102) && has(ctx, 2108) && has(ctx, 2106) && has(ctx, 2084)) // Fruit blast
                    || (has(ctx, 2114) && has(ctx, 2102) && has(ctx, 2108) && has(ctx, 2120) && has(ctx, 2122) && has(ctx, 2116) && has(ctx, 2112) && has(ctx, 2048)) // Pineapple punch
                    || (has(ctx, 2015) && has(ctx, 2019) && has(ctx, 2120) && has(ctx, 2102) && has(ctx, 2114) && has(ctx, 2108) && has(ctx, 2116) && has(ctx, 2124) && has(ctx, 2054)) // Wizard blizzard
                    || (has(ctx, 2015) && has(ctx, 2120) && has(ctx, 2124) && has(ctx, 2128) && has(ctx, 2080)) // Short green guy
                    || (has(ctx, 2015) && has(ctx, 2019) && has(ctx, 2126) && has(ctx, 2114) && has(ctx, 2116) && has(ctx, 2130) && has(ctx, 2092)) // Drunk dragon
                    || (has(ctx, 2017) && has(ctx, 1973) && has(ctx, 2128) && has(ctx, 1927) && has(ctx, 1975) && has(ctx, 2130) && has(ctx, 2074)) // Choc saturday
                    || (has(ctx, 2015) && has(ctx, 2021) && has(ctx, 2019) && has(ctx, 2102) && has(ctx, 2104) && has(ctx, 2108) && has(ctx, 2110) && has(ctx, 2128) && has(ctx, 2120) && has(ctx, 2124) && has(ctx, 2064)) // Blurberry special
                )
            )
        );
}

function canDoValeTotems(ctx) {
    return canTrainFletching(ctx) //
        && (has(ctx, 946) || hasNarwhalKnife(ctx)) // Knife
        && ( //
            (has(ctx, 1521) // Oak logs
                && (has(ctx, 843) // Oak shortbow
                    || has(ctx, 845) // Oak longbow
                    || has(ctx, 9442) // Oak stock
                    || has(ctx, 22251) // Oak shield
                    || has(ctx, 54) // Oak shortbow (u)
                    || has(ctx, 56) // Oak longbow (u)
                ) //
            ) //
            || (has(ctx, 1519) // Willow logs
                && (has(ctx, 849) // Willow shortbow
                    || has(ctx, 847) // Willow longbow
                    || has(ctx, 9444) // Willow stock
                    || has(ctx, 60)  // Willow shortbow (u)
                    || has(ctx, 58) // Willow longbow (u)
                    || has(ctx, 22254) // Willow shield
                ) //
            ) //
            || (has(ctx, 1517) // Maple logs
                && (has(ctx, 853) // Maple shortbow
                    || has(ctx, 851) // Maple longbow
                    || has(ctx, 9448) // Maple stock
                    || has(ctx, 64) // Maple shortbow (u)
                    || has(ctx, 62) // Maple longbow (u)
                    || has(ctx, 22257) // Maple shield
                ) //
            ) //
            || (has(ctx, 1515) // Yew logs
                && (has(ctx, 857) // Yew shortbow
                    || has(ctx, 855) // Yew longbow
                    || has(ctx, 68) // Yew shortbow (u)
                    || has(ctx, 66) // Yew longbow (u)
                    || has(ctx, 22260) // Yew shield
                    || has(ctx, 9452) // Yew stock
                ) //
            ) //
            || (has(ctx, 1513) // Magic logs
                && (has(ctx, 861) // Magic shortbow
                    || has(ctx, 859) // Magic longbow
                    || has(ctx, 72) // Magic shortbow (u)
                    || has(ctx, 70) // Magic longbow (u)
                    || has(ctx, 22263) // Magic shield
                    || has(ctx, 21952) // Magic stock
                ) //
            ) //
            || (has(ctx, 19669) // Redwood logs
                && (has(ctx, 31049) // Redwood hiking staff
                    || has(ctx, 22266) // Redwood shield
                ) //
            ) //
        ); //
}

function canDoWintertodt(ctx) {
    return canTrainFiremaking(ctx);
}

function canDoSalvaging(ctx) {
    return canCompletePandemonium(ctx) //
        && (
            ( // Bronze salvaging hook
                has(ctx, 960)      // Plank
                && has(ctx, 4819)  // Bronze nails
                && has(ctx, 2349)  // Bronze bar
                && has(ctx, 954)   // Rope
            )
            || ( // Iron salvaging hook
                has(ctx, 8778)     // Oak plank
                && has(ctx, 4820)  // Iron nails
                && has(ctx, 2351)  // Iron bar
                && has(ctx, 954)   // Rope
            )
            || ( // Steel salvaging hook
                has(ctx, 8780)     // Teak plank
                && has(ctx, 1539)  // Steel nails
                && has(ctx, 2353)  // Steel bar
                && has(ctx, 954)   // Rope
                && has(ctx, 32889) // Lead bar
            )
            || ( // Mithril salvaging hook
                has(ctx, 8782)     // Mahogany plank
                && has(ctx, 4822)  // Mithril nails
                && has(ctx, 2359)  // Mithril bar
                && has(ctx, 954)   // Rope
                && has(ctx, 32889) // Lead bar
            )
            || ( // Adamant salvaging hook
                has(ctx, 31432)    // Camphor plank
                && has(ctx, 4823)  // Adamantite nails
                && has(ctx, 2361)  // Adamantite bar
                && has(ctx, 954)   // Rope
                && has(ctx, 32889) // Lead bar
            )
            || ( // Rune salvaging hook
                has(ctx, 31435)    // Ironwood plank
                && has(ctx, 4824)  // Rune nails
                && has(ctx, 2363)  // Runite bar
                && has(ctx, 954)   // Rope
                && has(ctx, 32892) // Cupronickel bar
            )
            || ( // Dragon salvaging hook
                has(ctx, 31438)    // Rosewood plank
                && has(ctx, 31406) // Dragon nails
                && has(ctx, 31996) // Dragon metal sheet
                && has(ctx, 954)   // Rope
                && has(ctx, 32892) // Cupronickel bar
                && has(ctx, 31961) // Broken dragon hook
            )
        );
}

function canDoSailingCombat(ctx) {
    return canCompletePandemonium(ctx);
}
