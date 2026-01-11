export function has(ctx, id) {
    const item = ctx.items.find(i => i.id === id);
    if (!item) return false;
    return ctx.unlocked.includes(id) && ctx.rolled.includes(id);
}

export const REQUIREMENT_CHECKS = {
    canTelegrab(ctx) {
        return has(ctx, 563) // Law rune
            && hasAirRuneSource(ctx);
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
        return has(ctx, 1023) //
            && has(ctx, 1007) //
            && has(ctx, 1021) //
            && has(ctx, 1019) //
            && has(ctx, 1031) //
            && has(ctx, 6959) //
            && has(ctx, 1029) //
            && has(ctx, 1027);//
    },
    hasAnyCookedMeatFish(ctx) {
        return has(ctx, 315) //
            && has(ctx, 325) //
            && has(ctx, 2140) //
            && has(ctx, 2142) //
            && has(ctx, 1861) //
            && has(ctx, 3228) //
            && has(ctx, 325) //
            && has(ctx, 347) //
            && has(ctx, 355) //
            && has(ctx, 333) //
            && has(ctx, 351) //
            && has(ctx, 339) //
            && has(ctx, 2142) //
            && has(ctx, 329) //
            && has(ctx, 3381) //
            && has(ctx, 361) //
            && has(ctx, 3144) //
            && has(ctx, 29217) //
            && has(ctx, 10136) //
            && has(ctx, 5003) //
            && has(ctx, 379) //
            && has(ctx, 7568) //
            && has(ctx, 365) //
            && has(ctx, 373) //
            && has(ctx, 7946) //
            && has(ctx, 32312) //
            && has(ctx, 32320) //
            && has(ctx, 32328) //
            && has(ctx, 385) //
            && has(ctx, 397) //
            && has(ctx, 32336) //
            && has(ctx, 13441) //
            && has(ctx, 32344) //
            && has(ctx, 11936) //
            && has(ctx, 391) //
            && has(ctx, 32352); //
    },
    hasAnyLeaves(ctx) {
        return has(ctx, 6020) //
            && has(ctx, 6030) //
            && has(ctx, 6028) //
            && has(ctx, 6022) //
            && has(ctx, 6024) //
            && has(ctx, 6026);
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
    hasNarwhalKnife(ctx){
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
        return ctx.player.questPoints >= 32;
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
        return ctx.player.questPoints >= 32;
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
    canCompleteBigChompyBirdHunting(ctx) {
        return canCompleteBigChompyBirdHunting(ctx);
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
    canReachAbyssalSire(ctx) {
        return !ctx.filters.slayerLocked //
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
    canStartTheQueenOfThieves(ctx) {
        return canStartTheQueenOfThieves(ctx);
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
    never(ctx) {
        return false;
    }
};

function canDoTombsOfAmascut(ctx) {
    return canCompleteBeneathCursedSands(ctx) //
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
    return canCompleteContact(ctx) //
        && canTrainCrafting(ctx)   //
        && canTrainFiremaking(ctx) //
        && has(ctx, 453)  // Coal
        && has(ctx, 2351) // Iron bar
        && has(ctx, 590)  // Tinderbox
        && has(ctx, 952)  // Spade
        && (
            has(ctx, 2136)     // Raw bear meat
            || has(ctx, 2134)  // Raw rat meat
            || has(ctx, 2132)  // Raw beef
            || has(ctx, 2138)  // Raw chicken
            || has(ctx, 3226)  // Raw rabbit
            || has(ctx, 25833) // Raw boar meat
            || has(ctx, 1859)  // Raw ugthanki meat
            || has(ctx, 9978)  // Raw bird meat
        );
}

function hasAnyFeather(ctx) {
    return has(ctx, 314)    // Feather
        || has(ctx, 10089)  // Blue feather
        || has(ctx, 10091)  // Orange feather
        || has(ctx, 10088)  // Red feather
        || has(ctx, 10087)  // Stripy feather
        || has(ctx, 10090); // Yellow feather
}

function hasAnyFeatherButStripy(ctx) {
    return has(ctx, 314)    // Feather
        || has(ctx, 10089)  // Blue feather
        || has(ctx, 10091)  // Orange feather
        || has(ctx, 10088)  // Red feather
        || has(ctx, 10090); // Yellow feather
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
    return canCompletePrinceAliRescue(ctx) //
        && canCompleteIcthlarinsLittleHelper(ctx); //
}

function canCompleteTowerOfLife(ctx) {
    return canTrainConstruction(ctx) //
        && has(ctx, 2347)  // Hammer
        && has(ctx, 8794)  // Saw
        && has(ctx, 1917); // Beer
}

function canCompletePrinceAliRescue(ctx) {
    return has(ctx, 1761) // Soft clay
        && has(ctx, 1759) // Ball of wool
        && has(ctx, 1765) // Yellow dye
        && has(ctx, 1951) // Redberries
        && has(ctx, 592)  // Ashes
        && (has(ctx, 1929) || has(ctx, 1937) || has(ctx, 1921)) // Bucket of water or Jug of water or Bowl of water
        && has(ctx, 1933) // Pot of flour
        && has(ctx, 2349) // Bronze bar
        && has(ctx, 1013) // Pink skirt
        && has(ctx, 1917) // Beer
        && has(ctx, 954); //  Rope
}

function canCompleteHauntedMine(ctx) {
    return canCompletePriestInPeril(ctx) //
        && canTrainCrafting(ctx) //
        && has(ctx, 1755); // Chisel
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
    return canStartMourningsEndPartI(ctx) //
        && has(ctx, 948)  // Bear fur
        && has(ctx, 950)  // Silk
        && has(ctx, 1763) // Red dye
        && has(ctx, 1765) // Yellow dye
        && has(ctx, 1771) // Green dye
        && has(ctx, 1767) // Blue dye
        && has(ctx, 1929) // Bucket of water
        && has(ctx, 314)  // Feather
        && (has(ctx, 2217) || has(ctx, 2243))  // Toad cruncies or Premade t'd crunch
        && has(ctx, 1513) // Magic logs
        && has(ctx, 1741) // Leather
        && has(ctx, 3216) // Barrel
        && has(ctx, 453); // Coal
}

function canCompleteMourningsEndPartII(ctx) {
    return canCompleteMourningsEndPartI(ctx) //
        && has(ctx, 1755) // Chisel
        && has(ctx, 954)  // Rope
        && hasDeathTalismanSource(ctx);
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
    return canCompleteRegicide(ctx) //
        && canCompleteWaterfallQuest(ctx) //
        && has(ctx, 952)  // Spade
        && has(ctx, 954); // Rope
}

function canCompleteRegicide(ctx) {
    return canCompleteUndergroundPass(ctx) //
        && canTrainCrafting(ctx) //
        // Bow and arrows needed, but thats a huge one... TODO
        && has(ctx, 453)  // Coal
        && has(ctx, 954)  // Rope
        && has(ctx, 952)  // Spade
        && has(ctx, 3211) // Limestone
        && has(ctx, 590)  // Tinderbox
        && has(ctx, 1759) // Ball of wool
        && has(ctx, 233)  // Pestle and mortar
        && has(ctx, 1931) // Pot
        && (has(ctx, 3228)  // Cooked rabbit
        || has(ctx, 7223)); // Roast rabbit
}

function canCompleteEaglesPeak(ctx) {
    return has(ctx, 1765)  // Yellow dye
        && has(ctx, 1939); // Swamp tar
}

function canCompleteWatchtower(ctx) {
    return canTrainHerblore(ctx) //
        && canTrainMining(ctx) //
        && has(ctx, 560)  // Death rune
        && has(ctx, 2357) // Gold bar
        && has(ctx, 536)  // Dragon bones
        && has(ctx, 954)  // Rope
        && has(ctx, 91)   // Guam potion (unf)
        && has(ctx, 233)  // Pestle and mortar
        && has(ctx, 530)  // Bat bones
        && has(ctx, 247); // Jangerberries
}

function canCompleteUndergroundPass(ctx) {
    return canCompleteBiohazard(ctx) //
        // Bow and arrows needed, but thats a huge one... TODO
        && has(ctx, 954)  // Rope
        && has(ctx, 952)  // Spade
        && has(ctx, 1925) // Bucket
        && has(ctx, 590); // Tinderbox
}

function canCompleteBelowIceMountain(ctx) {
    return ctx.player.questPoints >= 16 //
        && has(ctx, 2142) // Cooked meat
        && has(ctx, 2309) // Bread
        && has(ctx, 946)  // Knife
        && (has(ctx, 1917) || has(ctx, 1905) || has(ctx, 1913) || has(ctx, 1907)); // Beer, Asgarnian ale, Dwarven stout or Wizard's mind bomb
}

function canCompleteSleepingGiants(ctx) {
    return canTrainSmithing(ctx) //
        && hasAnyNails(ctx) //
        && has(ctx, 2142)   // Oak logs
        && has(ctx, 2309)   // Wool
        && has(ctx, 2347)   // Hammer
        && has(ctx, 1755)   // Chisel
        && (has(ctx, 1929)  // Bucket of water
            || canTrainMining(ctx) // For Ice gloves
        );
}

function canCompleteTheFinalDawn(ctx) {
    return canCompleteTheHeartOfDarkness(ctx) //
        && canCompletePerilousMoons(ctx) //
        && canTrainRunecraft(ctx) //
        && canTrainFletching(ctx) //
        && has(ctx, 946)  // Knife
        && has(ctx, 1917) // Beer
        && (has(ctx, 3183)     // Monkey bones
            || has(ctx, 4834)  // Ourg bones
            || has(ctx, 4832)  // Raurg bones
            || has(ctx, 3123)  // Shaikahan bones
            || has(ctx, 31726) // Strykewyrm bones
            || has(ctx, 22124) // Superior dragon bones
            || has(ctx, 2859)  // Wolf bones
            || has(ctx, 22780) // Wyrm bones
            || has(ctx, 28899) // Wyrmling bones
            || has(ctx, 6812)  // Wyvern bones
            || has(ctx, 4812)  // Zogre bones
            || has(ctx, 534)   // Babydragon bones
            || has(ctx, 530)   // Bat bones
            || has(ctx, 532)   // Big bones
            || has(ctx, 526)   // Bones
            || has(ctx, 528)   // Burnt bones
            || has(ctx, 6729)  // Dagannoth bones
            || has(ctx, 536)   // Dragon bones
            || has(ctx, 22783) // Drake bones
            || has(ctx, 4830)  // Fayrg bones
            || has(ctx, 31729) // Frost dragon bones
            || has(ctx, 22786) // Hydra bones
            || has(ctx, 3125)  // Jogre bones
            || has(ctx, 11943) // Lava dragon bones
            || has(ctx, 2136)  // Raw bear meat
            || has(ctx, 2134)  // Raw rat meat
            || has(ctx, 2132)  // Raw beef
            || has(ctx, 25833) // Raw boar meat
            || has(ctx, 10816) // Raw yak meat
            || has(ctx, 2142)  // Cooked meat
        );
}

function canCompleteShadesOfMortton(ctx) {
    return canCompletePriestInPeril(ctx) //
        && canTrainCrafting(ctx) //
        && canTrainHerblore(ctx) //
        && canTrainFiremaking(ctx) //
        && has(ctx, 3410)  // Serum 207 (3)
        && has(ctx, 95)    // Tarromin potion (unf) (might not be needed?)
        && has(ctx, 592)   // Ashes (might not be needed?)
        && has(ctx, 590)   // Tinderbox (might not be needed?)
        && has(ctx, 1511)  // Logs (might not be needed?)
        && (has(ctx, 2347) || has(ctx, 3678)) // Hammer of Flamtaer hammer
        && (
            has(ctx, 3438)     // Pyre logs
            || has(ctx, 3440)  // Oak pyre logs
            || has(ctx, 3442)  // Willow pyre logs
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
        )
        && has(ctx, 3396); // Loar remains
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
    return has(ctx, 7660) // Guthix balance(4)
        || has(ctx, 7662) // Guthix balance(3)
        || has(ctx, 7664) // Guthix balance(2)
        || has(ctx, 7666) // Guthix balance(1)
}

function hasAnySerum207(ctx) {
    return has(ctx, 3408) // Serum 207(4)
        || has(ctx, 3410) // Serum 207(3)
        || has(ctx, 3412) // Serum 207(2)
        || has(ctx, 3414) // Serum 207(1)
}

function hasAirRuneSource(ctx) {
    return has(ctx, 556) // Air rune
        || has(ctx, 4696) // Dust rune
        || has(ctx, 4697) // Smoke rune
        || has(ctx, 4695) // Mist rune
        || has(ctx, 1381) // Staff of air
        || has(ctx, 1397) // Air battlestaff
        || has(ctx, 1405) // Mystic air staff
        || has(ctx, 20736) // Dust battlestaff
        || has(ctx, 20739) // Mystic dust staff
        || has(ctx, 11998) // Smoke battlestaff
        || has(ctx, 12000) // Mystic smoke staff
        || has(ctx, 20730) // Mist battlestaff
        || has(ctx, 20733); // Mystic mist staff
}

function hasWaterRuneSource(ctx) {
    return has(ctx, 555) // Water rune
        || has(ctx, 4698) // Mud rune
        || has(ctx, 4694) // Steam rune
        || has(ctx, 4695) // Mist rune
        || has(ctx, 1383) // Staff of water
        || has(ctx, 1395) // Water battlestaff
        || has(ctx, 1403) // Mystic water staff
        || has(ctx, 6562) // Mud battlestaff
        || has(ctx, 6563) // Mystic mud staff
        || has(ctx, 11787) // Steam battlestaff
        || has(ctx, 11789) // Mystic steam staff
        || has(ctx, 20730) // Mist battlestaff
        || has(ctx, 20733) // Mystic mist staff
        || (has(ctx, 25576) && has(ctx, 25578)); // Tome of water and Soaked page
}

function hasEarthRuneSource(ctx) {
    return has(ctx, 557) // Earth rune
        || has(ctx, 4696) // Dust rune
        || has(ctx, 4698) // Mud rune
        || has(ctx, 4699) // Lava rune
        || has(ctx, 1385) // Staff of earth
        || has(ctx, 1399) // Earth battlestaff
        || has(ctx, 1407) // Mystic earth staff
        || has(ctx, 20736) // Dust battlestaff
        || has(ctx, 20739) // Mystic dust staff
        || has(ctx, 6562) // Mud battlestaff
        || has(ctx, 6563) // Mystic mud staff
        || has(ctx, 3053) // Lava battlestaff
        || has(ctx, 3054) // Mystic lava staff
        || (has(ctx, 30066) && has(ctx, 30068)); // Tome of earth and Soiled page
}

function hasFireRuneSource(ctx) {
    return has(ctx, 554) // Fire rune
        || has(ctx, 4699) // Lava rune
        || has(ctx, 4697) // Smoke rune
        || has(ctx, 4694) // Steam rune
        || has(ctx, 28929) // Sunfire rune
        || has(ctx, 1387) // Staff of fire
        || has(ctx, 1393) // Fire battlestaff
        || has(ctx, 1401) // Mystic fire staff
        || has(ctx, 3053) // Lava battlestaff
        || has(ctx, 3054) // Mystic lava staff
        || has(ctx, 11998) // Smoke battlestaff
        || has(ctx, 12000) // Mystic smoke staff
        || has(ctx, 11787) // Steam battlestaff
        || has(ctx, 11789) // Mystic steam staff
        || (has(ctx, 20716) && has(ctx, 20718)); // Tome of fire and Burnt page
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
        && ( // Any hammer/warhammer https://oldschool.runescape.wiki/w/Warhammer#Other_warhammers < these dont work
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
    return has(ctx, 1925) // Bucket
        && has(ctx, 590)  // Tinderbox
        && has(ctx, 946); //
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
    return has(ctx, 4819)  // Bronze nails
        || has(ctx, 4820)  // Iron nails
        || has(ctx, 1539)  // Steel nails
        || has(ctx, 4821)  // Black nails
        || has(ctx, 4822)  // Mithril nails
        || has(ctx, 4823)  // Adamantite nails
        || has(ctx, 4824)  // Rune nails
        || has(ctx, 31406);// Dragon nails
}

function canEnterKalphiteLair(ctx) {
    return has(ctx, 954); // Rope
}

function canEnterAncientCavern(ctx) {
    return canCompleteBarbarianFiremaking(ctx);
}

function canCompleteBarbarianFiremaking(ctx) {
    return has(ctx, 1521) // Oak logs
        && ( //
            has(ctx, 841) // Shortbow
            || has(ctx, 839) // Longbow
            || has(ctx, 843) // Oak shortbow
            || has(ctx, 845) // Oak longbow
            || has(ctx, 849) // Willow shortbow
            || has(ctx, 847) // Willow longbow
            || has(ctx, 853) // Maple shortbow
            || has(ctx, 851) // Maple longbow
            || has(ctx, 857) // Yew shortbow
            || has(ctx, 855) // Yew longbow
            || has(ctx, 861) // Magic shortbow
            || has(ctx, 859) // Magic longbow
        );
}

function canCompleteBarbarianFishing(ctx) {
    return canTrainFishing(ctx);
}

function canCompleteBarbarianHerblore(ctx) {
    return canCompleteDruidicRitual(ctx) //
        && canCompleteBarbarianFiremaking(ctx) //
        && canCompleteBarbarianFishing(ctx) //
        && has(ctx, 123) // Attack potion(2)
        && (has(ctx, 11324) || has(ctx, 11326)); // Roe or Caviar
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
    return canCompleteJunglePotion(ctx) //
        && canTrainCooking(ctx) //
        && hasSlashWeapon(ctx) //
        && has(ctx, 3162) // Sliced banana
        && has(ctx, 303)  // Small fishing net
        // && has(ctx, 233) // Pestle and mortar not needed because crusher guy in Nardah
        && has(ctx, 3032) // Agility potion(4)
        && canShortrange(ctx) //
        && has(ctx, 3125) // Jogre bones
        && has(ctx, 401)  // Seaweed
        && (
            has(ctx, 1239)    // Iron spear
            && has(ctx, 1241) // Steel spear
            && has(ctx, 1243) // Mithril spear
            && has(ctx, 1245) // Adamant spear
            && has(ctx, 1247) // Rune spear
            && has(ctx, 1249) // Dragon spear
        )
        && has(ctx, 3157)  // Karambwan vessel
        && has(ctx, 3159)  // Karambwan vessel (baited)
        && has(ctx, 3142); // Raw Karambwan
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
    return canTrainHunter(ctx) //
        && canTrainHerblore(ctx) //
        && canTrainConstruction(ctx) //
        && canCompleteEaglesPeak(ctx) //
        && has(ctx, 4055) // Toy mouse (wound)
        && has(ctx, 29166) // Jerboa tail
        && has(ctx, 2347); // Hammer
}

function canCompleteTheFrozenDoor(ctx) {
    return canCompleteDesertTreasureI(ctx) //
        && canDoKreearra(ctx) //
        && canDoGeneralGraardor(ctx) //
        && canDoCommanderZilyana(ctx) //
        && canDoKrilTsutsaroth(ctx);
}

function canCompleteMakingHistory(ctx) {
    return canCompletePriestInPeril(ctx)
        && has(ctx, 1694) // Sapphire amulet
        && has(ctx, 952); // Spade
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
    return ctx.player.questPoints >= 32;
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
    return canCompleteErnestTheChicken(ctx) //
        && canCompletePriestInPeril(ctx) //
        && has(ctx, 1355) // Mithril axe
        && has(ctx, 2351) // Iron bar
        && has(ctx, 2347) // Hammer
        && has(ctx, 1743) // Hard leather
        && has(ctx, 1718) // Holy symbol
        && has(ctx, 10496) // Polished buttons
        && has(ctx, 1931); // Pot
}

function canCompleteErnestTheChicken(ctx) {
    return has(ctx, 952) // Spade
        && has(ctx, 272) // Fish food
        && has(ctx, 273); // Poison (item)
}

function canCompleteDeathToTheDorgeshuun(ctx) {
    return canCompleteTheLostTribe(ctx) //
        && has(ctx, 4310) // Ham boots
        && has(ctx, 4304) // Ham cloak
        && has(ctx, 4308) // Ham gloves
        && has(ctx, 4302) // Ham hood
        && has(ctx, 4306) // Ham logo
        && has(ctx, 4300) // Ham robe
        && has(ctx, 4298); // Ham shirt
}

function canCompleteTheLostTribe(ctx) {
    return canCompleteGoblinDiplomacy(ctx) //
        && canCompleteRuneMysteries(ctx) //
        && canTrainMining(ctx); //
}

function canCompleteGoblinDiplomacy(ctx) {
    return has(ctx, 288)   // Goblin mail
        && has(ctx, 1769)  // Orange dye
        && has(ctx, 1767); // Blue dye
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
    return canStartPerilousMoons(ctx) //
        && has(ctx, 946)  // Knife
        && has(ctx, 305)  // Big fishing net
        && has(ctx, 954)  // Rope
        && has(ctx, 233); // Pestle and mortar
}

function canCompletePiratesTreasure(ctx) {
    return has(ctx, 1005)  // White apron
        && has(ctx, 952)   // Spade
        && has(ctx, 1963); // Banana
}

function canReachGemRocks(ctx) {
    return canCompletePandemonium(ctx) //
        || canCompleteShiloVillage(ctx) //
        || canReachLunarIsle(ctx);
}

function canCompleteLunarDiplomacy(ctx) {
    return canCompleteTheFremennikTrials(ctx) //
        && canCompleteLostCity(ctx) //
        && canCompleteRuneMysteries(ctx) //
        && canCompleteShiloVillage(ctx) //
        && canTrainCrafting(ctx) //
        && canTrainFiremaking(ctx) //
        && canTrainMining(ctx) //
        && canTrainWoodcutting(ctx) //
        && has(ctx, 590)  // Tinderbox
        && has(ctx, 249)  // Guam leaf
        && has(ctx, 251)  // Marrentill
        && has(ctx, 233)  // Pestle and mortar
        && has(ctx, 2347) // Hammer
        && has(ctx, 952)  // Spade
        && has(ctx, 4548) // Bullseye lantern
        && (canDoGuardiansOfTheRift(ctx) //
            || canCompleteEnterTheAbyss(ctx) //
            || (
                (has(ctx, 1438) || has(ctx, 5527)) // Air talisman or Air tiara
                && (has(ctx, 1444) || has(ctx, 5531)) // Water talisman or Water tiara
                && (has(ctx, 1440) || has(ctx, 5535)) // Earth talisman or Earth tiara
                && (has(ctx, 1442) || has(ctx, 5537)) // Fire talisman or Fire tiara
            )
        );
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
    return canCompleteJunglePotion(ctx) //
        && canTrainCrafting(ctx) //
        && has(ctx, 952)  // Spade
        && has(ctx, 954)  // Rope
        && has(ctx, 1794) // Bronze wire
        && has(ctx, 1755) // Chisel
        && has(ctx, 526); // Bones
}

function canFishFromRewardPool(ctx) {
    return has(ctx, 305)  // Big fishing net
        || has(ctx, 303); // Small fishing net
}

function canCompleteEnterTheAbyss(ctx) {
    return canCompleteRuneMysteries(ctx);
}

function canCompleteRuneMysteries(ctx) {
    return has(ctx, 1438); // Air talisman
}

function canCompleteFairytaleIGrowingPains(ctx) {
    return canCompleteLostCity(ctx) //
        && canCompleteNatureSpirit(ctx) //
        && has(ctx, 5329) // Secateurs
        && has(ctx, 952)  // Spade
        // TODO other item reqs?
        ;
}

function canCompleteFairytaleIICureAQueen(ctx) {
    return canCompleteFairytaleIGrowingPains(ctx) //
        && canTrainFarming(ctx) //
        && canTrainHerblore(ctx) //
        && has(ctx, 227); // Vial of water
}

function canDoGuardiansOfTheRift(ctx) {
    return canCompleteTempleOfTheEye(ctx);
}

function canCompleteLostCity(ctx) {
    return canTrainCrafting(ctx)
        && has(ctx, 1351) // Bronze axe
        && has(ctx, 946); // Knife
}

function canCompleteNatureSpirit(ctx) {
    return canCompletePriestInPeril(ctx) //
        && canTrainCrafting(ctx) //
        && (has(ctx, 2970) || has(ctx, 2974) || has(ctx, 2972)) // Mort myre Fungus, Mort myre pear of Mort myre stem
        && has(ctx, 2961)  // Silver sickle
        && has(ctx, 2355)  // Silver bar
        && has(ctx, 2976); // Sickle mould
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
    return canCompleteTheFeud(ctx) //
        && canCompleteRuneMysteries(ctx) //
        && canCompleteIcthlarinsLittleHelper(ctx) //
        && countDyes(ctx) >= 3 //
        && (
            has(ctx, 1739)    // Cowhide
            || has(ctx, 958)  // Grey wolf fur
            || has(ctx, 6289) // Snakeskin
            || has(ctx, 948)  // Bear fur
            || has(ctx, 1737) // Wool
        );
}

function canUseSilverSickle(ctx) {
    return canCompletePriestInPeril(ctx) //
        && canTrainCrafting(ctx) //
        && has(ctx, 2961)  // Silver sickle
        && has(ctx, 2355)  // Silver bar
        && has(ctx, 2976); // Sickle mould
}

function canCompleteTempleOfTheEye(ctx) {
    return canTrainRunecraft(ctx) //
        && canTrainMining(ctx) //
        && has(ctx, 1929)  // Bucket of water
        && has(ctx, 1755); // Chisel
}

function canCompleteDeathPlateau(ctx) {
    return has(ctx, 2309)  // Bread
        && has(ctx, 333)   // Trout
        && has(ctx, 2351)  // Iron bar
        && has(ctx, 1905)  // Asgarnian ale
        && has(ctx, 3105); // Climbing boots
}

function canCompleteRoyalTrouble(ctx) {
    return canCompleteThroneOfMiscellania(ctx) //
        && has(ctx, 954)  // Rope
        && has(ctx, 453)  // Coal
        && has(ctx, 960); // Plank
}

function canCompleteTheTouristTrap(ctx) {
    return canTrainFletching(ctx) //
        && canTrainSmithing(ctx) //
        && has(ctx, 1833) // Desert shirt
        && has(ctx, 1835) // Desert robe
        && has(ctx, 1837) // Desert boots
        && has(ctx, 2347) // Hammer
        && has(ctx, 2349) // Bronze bar
        && has(ctx, 314); // Feather
}

function canCompleteThroneOfMiscellania(ctx) {
    return canCompleteHeroesQuest(ctx) //
        && canCompleteTheFremennikTrials(ctx) //
        && has(ctx, 2351)      // Iron bar
        && (has(ctx, 1635)     // Gold ring
            || has(ctx, 1637)  // Sapphire ring
            || has(ctx, 1639)  // Emerald ring
            || has(ctx, 1641)  // Ruby ring
            || has(ctx, 1643)) // Diamond ring
        && has(ctx, 1511); // Logs
}

function canCompleteHeroesQuest(ctx) {
    return ctx.player.questPoints >= 55 //
        && canCompleteLostCity(ctx) //
        && canCompleteMerlinsCrystal(ctx) //
        && canCompleteDragonSlayerI(ctx) //
        && canTrainMining(ctx) //
        && canTrainHerblore(ctx) //
        && canTrainFishing(ctx) //
        && canTrainCooking(ctx) //
        && has(ctx, 307) // Fishing rod
        && has(ctx, 313) // Fishing bait
        && has(ctx, 97)  // Harralander potion (unf)
        && has(ctx, 255) // Harralander
        && has(ctx, 227); // Vial of water
}

function canCompleteTheDigSite(ctx) {
    return canCompleteDruidicRitual(ctx) //
        && has(ctx, 233) // Pestle and mortar
        && has(ctx, 229) // Vial
        && has(ctx, 590) // Tinderbox
        && hasCupOfTea(ctx) //
        && has(ctx, 954) // Rope
        && (has(ctx, 1609) || has(ctx, 1625)) // Opal or Uncut opal
        && has(ctx, 973); // Charcoal
}

function canCompleteMerlinsCrystal(ctx) {
    return has(ctx, 2309) // Bread
        && has(ctx, 590)  // Tinderbox
        && has(ctx, 30)   // Bucket of wax
        && has(ctx, 1925) // Bucket
        && has(ctx, 28)   // Insect repellent
        && has(ctx, 530); // Bat bones
}

function canStartDragonSlayerI(ctx) {
    return ctx.player.questPoints >= 32;
}

function canCompleteDragonSlayerI(ctx) {
    return ctx.player.questPoints >= 32 //
        && has(ctx, 1791)  // Unfired bowl
        && has(ctx, 1761)  // Soft clay
        && has(ctx, 1907)  // Wizards mind bomb
        && has(ctx, 301)   // Lobster pot
        && has(ctx, 950)   // Silk
        && has(ctx, 1540)  // Anti-dragon shield
        && has(ctx, 2347)  // Hammer
        && has(ctx, 1539)  // Steel nails
        && has(ctx, 960);  // Plank
}

function canCompleteXMarksTheSpot(ctx) {
    return has(ctx, 952); // Spade
}

function canCompleteClientOfKourend(ctx) {
    return canCompleteXMarksTheSpot(ctx) //
        && hasAnyFeather(ctx);
}

function canCompleteGhostsAhoy(ctx) {
    return canCompletePriestInPeril(ctx) //
        && canTrainCooking(ctx) //
        && has(ctx, 1927) // Bucket of milk
        && has(ctx, 950)  // Silk
        && has(ctx, 1763) // Red dye
        && has(ctx, 1765) // Yellow dye
        && has(ctx, 1767) // Blue dye
        && has(ctx, 952)  // Spade
        && has(ctx, 845)  // Oak longbow
        && has(ctx, 1921) // Bowl of water for Nettle tea
        && has(ctx, 946); // Knife
}

function canCompleteATailOfTwoCats(ctx) {
    return canCompleteIcthlarinsLittleHelper(ctx) //
        && has(ctx, 560)  // Death rune
        && has(ctx, 1897) // Chocolate cake
        && has(ctx, 1511) // Logs
        && has(ctx, 590)  // Tinderbox
        && has(ctx, 1927) // Bucket of milk
        && has(ctx, 1735) // Shears
        && has(ctx, 5318) // Potato seed
        && has(ctx, 5341) // Rake
        && has(ctx, 227)  // Vial of water
        && (has(ctx, 1833) || has(ctx, 540)) // Desert shirt or Druid's robe top
        && (has(ctx, 1835) || has(ctx, 538)); // Desert robe or Druid's robe
}

function canCompleteTrollRomance(ctx) {
    return canCompleteTrollStronghold(ctx) //
        && has(ctx, 2351) // Iron bar
        && (has(ctx, 1517) || has(ctx, 1515)) // Maple logs or Yew logs
        && canReachTrollheim(ctx) //
        && has(ctx, 30)   // Bucket of wax
        && has(ctx, 1887) // Cake tin
        && has(ctx, 1939) // Swamp tar
        && has(ctx, 954); // Rope
}

function canCompleteTheCurseOfArrav(ctx) {
    return canCompleteDefenderOfVarrock(ctx) //
        && canCompleteTrollRomance(ctx) //
        && canTrainMining(ctx) //
        && (canTrainSlayer(ctx) || ctx.player.levels.Slayer >= 37) //
        && has(ctx, 2126)  // Dwellberries
        && has(ctx, 2570)  // Ring of life
        && has(ctx, 9419)  // Mith grapple
        && has(ctx, 7159); // Insulated boots
}

function canCompleteDreamMentor(ctx) {
    return canCompleteLunarDiplomacy(ctx) //
        && canCompleteEadgarsRuse(ctx) //
        && has(ctx, 9075) // Astral rune
        && has(ctx, 590)  // Tinderbox
        && has(ctx, 2347) // Hammer
        && has(ctx, 233); // Pestle and mortar
}

function canCompleteEadgarsRuse(ctx) {
    return canCompleteDruidicRitual(ctx) //
        && canCompleteTrollStronghold(ctx) //
        && canTrainHerblore(ctx) //
        && has(ctx, 3105) // Climbing boots
        && has(ctx, 2015) // Vodka
        && has(ctx, 2116) // Pineapple chunks
        && has(ctx, 1511) // Logs
        && has(ctx, 1947) // Grain
        && has(ctx, 2138) // Raw chicken
        && has(ctx, 233)  // Pestle and mortar
        && has(ctx, 99);  // Rannar potion (unf)
}

function canCompleteSkippyAndTheMogres(ctx) {
    return has(ctx, 1929) // Bucket of water
        && has(ctx, 1927) // Bucket of milk
        && has(ctx, 1975) // Chocolate dust
        && has(ctx, 1921) // Bowl of water
        && has(ctx, 231); // Snape grass
}

function canCompleteLegendsQuest(ctx) {
    return ctx.player.questPoints >= 107 //
        && canTrainCrafting(ctx) //
        && canTrainHerblore(ctx) //
        && canTrainMining(ctx) //
        && canTrainPrayer(ctx) //
        && canTrainSmithing(ctx) //
        && canTrainWoodcutting(ctx) //
        && canCompleteFamilyCrest(ctx) //
        && canCompleteHeroesQuest(ctx) //
        && canCompleteShiloVillage(ctx) //
        && canCompleteUndergroundPass(ctx) //
        && canCompleteWaterfallQuest(ctx) //
        && hasMachete(ctx) //
        && has(ctx, 2357) // Gold bar
        && has(ctx, 2347) // Hammer
        && has(ctx, 954)  // Rope
        && (has(ctx, 1359) || has(ctx, 6739)) // Rune axe or Dragon axe
        && has(ctx, 973)  // Charcoal
        && has(ctx, 970)  // Papyrus
        && has(ctx, 1523) // Lockpick
        && has(ctx, 227)  // Vial of water
        && has(ctx, 1607) // Sapphire
        && has(ctx, 1605) // Emerald
        && has(ctx, 1603) // Ruby
        && has(ctx, 1601) // Diamond
        && has(ctx, 1611) // Jade
        && has(ctx, 1609) // Opal
        && has(ctx, 1613) // Red topaz
        && has(ctx, 566)  // Soul rune
        && has(ctx, 558)  // Mind rune
        && has(ctx, 563)  // Law rune
        && has(ctx, 557)  // Earth rune
        && has(ctx, 567)  // Unpowered orb
        && has(ctx, 564)  // Cosmic rune
        && (hasAirRuneSource(ctx) || hasFireRuneSource(ctx) || hasWaterRuneSource(ctx));
}

function hasMachete(ctx) {
    return has(ctx, 975) || has(ctx, 6313) || has(ctx, 6315) || has(ctx, 6317);
}

function canCompleteFamilyCrest(ctx) {
    return canTrainMining(ctx) //
        && canTrainSmithing(ctx) //
        && canTrainCrafting(ctx) //
        && has(ctx, 315)  // Shrimps
        && has(ctx, 329)  // Salmon
        && has(ctx, 361)  // Tuna
        && has(ctx, 365)  // Bass
        && has(ctx, 373)  // Swordfish
        && has(ctx, 1603) // Ruby
        && has(ctx, 1592) // Ring mould
        && has(ctx, 1597) // Necklace mould
        && has(ctx, 560)  // Death rune
        && hasAirRuneSource(ctx) //
        && hasWaterRuneSource(ctx) //
        && hasEarthRuneSource(ctx) //
        && hasFireRuneSource(ctx) //
        && (
            has(ctx, 185)      // Superantipoison(1)
            || has(ctx, 183)   // Superantipoison(2)
            || has(ctx, 181)   // Superantipoison(3)
            || has(ctx, 2448)  // Superantipoison(4)
            || has(ctx, 11475) // Anti-poison supermix(1)
            || has(ctx, 11473) // Anti-poison supermix(2)
            || has(ctx, 11435) // Antipoison mix(1)
            || has(ctx, 11433) // Antipoison mix(2)
            || has(ctx, 179)   // Antipoison(1)
            || has(ctx, 177)   // Antipoison(2)
            || has(ctx, 175)   // Antipoison(3)
            || has(ctx, 2446)  // Antipoison(4)
            || has(ctx, 5949)  // Antidote+(1)
            || has(ctx, 5947)  // Antidote+(2)
            || has(ctx, 5945)  // Antidote+(3)
            || has(ctx, 5943)  // Antidote+(4)
            || has(ctx, 5958)  // Antidote++(1)
            || has(ctx, 5956)  // Antidote++(2)
            || has(ctx, 5954)  // Antidote++(3)
            || has(ctx, 5952)  // Antidote++(4)
            || has(ctx, 11503) // Antidote+ mix(1)
            || has(ctx, 11501) // Antidote+ mix(2)
            || has(ctx, 10931) // Sanfew serum(1)
            || has(ctx, 10929) // Sanfew serum(2)
            || has(ctx, 10927) // Sanfew serum(3)
            || has(ctx, 10925) // Sanfew serum(4)
            || has(ctx, 464)   // Strange fruit
            || has(ctx, 29784) // Araxyte venom sack
            || has(ctx, 12911) // Anti-venom(1)
            || has(ctx, 12909) // Anti-venom(2)
            || has(ctx, 12907) // Anti-venom(3)
            || has(ctx, 12905) // Anti-venom(4)
            || has(ctx, 12919) // Anti-venom+(1)
            || has(ctx, 12917) // Anti-venom+(2)
            || has(ctx, 12915) // Anti-venom+(3)
            || has(ctx, 12913) // Anti-venom+(4)
            || has(ctx, 29833) // Extended anti-venom+(1)
            || has(ctx, 29830) // Extended anti-venom+(2)
            || has(ctx, 29827) // Extended anti-venom+(3)
            || has(ctx, 29824) // Extended anti-venom+(4)
        );
}

function canCompleteDragonSlayerII(ctx) {
    return ctx.player?.questPoints >= 200 //
        && canCompleteLegendsQuest(ctx) //
        && canCompleteDreamMentor(ctx) //
        && canCompleteATailOfTwoCats(ctx) //
        && canCompleteAnimalMagnetism(ctx) //
        && canCompleteGhostsAhoy(ctx) //
        && canCompleteBoneVoyage(ctx) //
        && canCompleteClientOfKourend(ctx) //
        && canEnterAncientCavern(ctx) //
        && canTrainSmithing(ctx) //
        && canTrainMining(ctx) //
        && canTrainCrafting(ctx) //
        && canTrainConstruction(ctx) //
        && canTrainWoodcutting(ctx) //
        && has(ctx, 8778) // Oak plank
        && has(ctx, 1941) // Swamp paste
        && hasAnyNails(ctx) //
        && has(ctx, 2347) // Hammer
        && has(ctx, 975)  // Machete
        && has(ctx, 8794) // Saw
        && has(ctx, 1615) // Dragonstone
        && has(ctx, 1775) // Molten glass
        && has(ctx, 1785) // Glassblowing pipe
        && has(ctx, 952)  // Spade
        && has(ctx, 9075) // Astral rune
        && has(ctx, 590)  // Tinderbox
        && has(ctx, 233)  // Pestle and mortar
        && hasFireRuneSource(ctx) //
        && hasAirRuneSource(ctx) //
        && has(ctx, 565); // Blood rune
}

function canCompleteMyArmsBigAdventure(ctx) {
    return canCompleteEadgarsRuse(ctx) //
        && canCompleteTheFeud(ctx) //
        && canCompleteJunglePotion(ctx) //
        && canTrainFarming(ctx) //
        && canTrainWoodcutting(ctx) //
        && hasMachete(ctx) //
        && has(ctx, 1925) // Bucket
        && has(ctx, 6034) // Supercompost
        && has(ctx, 952)  // Spade
        && has(ctx, 5341) // Rake
        && has(ctx, 5343) // Seed dibber
        && canReachTrollheim(ctx);
}

function canCompleteMakingFriendsWithMyArm(ctx) {
    return canCompleteMyArmsBigAdventure(ctx) //
        && canCompleteSwanSong(ctx) //
        && canCompleteColdWar(ctx) //
        && canCompleteRomeoAndJuliet(ctx) //
        && canTrainFiremaking(ctx) //
        && canTrainMining(ctx) //
        && canTrainConstruction(ctx) //
        && has(ctx, 1925) // Bucket
        && has(ctx, 8794) // Saw
        && has(ctx, 8790) // Bolt of cloth
        && has(ctx, 8782) // Mahogany plank
        && has(ctx, 753)  // Cadava berries
        && has(ctx, 1929) // Bucket of water
        && has(ctx, 2347) // Hammer
        && has(ctx, 954); // Rope
}

function canCompleteGrimTales(ctx) {
    return canCompleteWitchsHouse(ctx) //
        && canTrainFarming(ctx) //
        && canTrainHerblore(ctx) //
        && canTrainWoodcutting(ctx) //
        && has(ctx, 95); // Tarromin potion (unf)
}

function canCompleteObservatoryQuest(ctx) {
    return has(ctx, 2349) // Bronze bar
        && has(ctx, 1775) // Molten glass
        && has(ctx, 960); // Plank
}

function canGetGoutweed(ctx) {
    return canCompleteEadgarsRuse(ctx) // Goutweed crate
        || (has(ctx, 6311) && canTrainFarming(ctx)) // Gout tuber
        || (canReachTrollheim(ctx) && canDoGnomeRestaurant(ctx)); // Brambickle
}

function canCompleteBetweenARock(ctx) {
    return canCompleteDwarfCannon(ctx) //
        && canCompleteFishingContest(ctx) //
        && canTrainMining(ctx) //
        && canTrainSmithing(ctx) //
        && has(ctx, 2357)  // Gold bar
        && has(ctx, 2347); // Hammer
}

function canCompleteSwanSong(ctx) {
    return canCompleteOneSmallFavour(ctx) //
        && canCompleteGardenOfTranquillity(ctx) //
        && ctx.player.questPoints >= 100
        && canTrainCooking(ctx) //
        && canTrainFishing(ctx) //
        && canTrainSmithing(ctx) //
        && canTrainFiremaking(ctx) //
        && canTrainCrafting(ctx) //
        && has(ctx, 4695) // Mist rune
        && has(ctx, 4699) // Lava rune
        && has(ctx, 565)  // Blood rune
        && has(ctx, 4436) // Airtight pot
        && has(ctx, 2351) // Iron bar
        && hasAnyLog(ctx) //
        && has(ctx, 590)  // Tinderbox
        && has(ctx, 2347) // Hammer
        && has(ctx, 303)  // Small fishing net
        && has(ctx, 1757) // Brown apron
        && has(ctx, 7944) // Raw monkfish
        && has(ctx, 526); // Bones
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
        && has(ctx, 4436); // Airtight pot
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
    return canCompleteMerlinsCrystal(ctx); //
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
    canStartLegendsQuest,
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
    return canCompleteCreatureOfFenkenstrain(ctx) //
        && canTrainFarming(ctx) //
        && has(ctx, 5341) // Rake
        && has(ctx, 952)  // Spade
        && has(ctx, 5329) // Secateurs
        && has(ctx, 5331) // Watering can
        && has(ctx, 5325) // Gardening trowel
        && has(ctx, 6036) // Plant cure
        && has(ctx, 5096) // Marigold seed
        && has(ctx, 5324) // Cabbage seed
        && has(ctx, 5319) // Onion seed
        && has(ctx, 2347) // Hammer
        && (has(ctx, 7936) || has(ctx, 1436)) // Pure essence or Rune essence
        && has(ctx, 233)  // Pestle and mortar
        && has(ctx, 5354) // Filled plant pot
        && (has(ctx, 6032) || has(ctx, 6034) || has(ctx, 21483)); // Compost, Supercompost or Ultracompost
}

function canCompleteColdWar(ctx) {
    return canTrainCrafting(ctx) //
        && canTrainConstruction(ctx) //
        && has(ctx, 8778) // Oak plank
        && has(ctx, 1539) // Steel nails
        && has(ctx, 2347) // Hammer
        && has(ctx, 952)  // Spade
        && has(ctx, 8792) // Clockwork
        && has(ctx, 960)  // Plank
        && has(ctx, 950)  // Silk
        && (has(ctx, 341) || canCompleteGardenOfTranquillity(ctx)) // Raw cod or Ring of Charos (a)
        && has(ctx, 1939) // Swamp tar
        && has(ctx, 8782) // Mahogany plank
        && has(ctx, 1741) // Leather
        && has(ctx, 2347) // Hammer
        && has(ctx, 314); // Feather
}

function canCompleteRomeoAndJuliet(ctx) {
    return has(ctx, 753); // Cadava berries
}

function canCompleteRatcatchers(ctx) {
    return canCompleteIcthlarinsLittleHelper(ctx) //
        && has(ctx, 1985) // Cheese
        && has(ctx, 251)  // Marrentill
        && has(ctx, 235)  // Unicorn horn dust
        && has(ctx, 1927) // Bucket of milk
        && has(ctx, 6055) // Weeds
        && has(ctx, 1931) // Pot
        && has(ctx, 590); // Tinderbox
}

function canCompleteDesertTreasureI(ctx) {
    return canCompleteTheDigSite(ctx) //
        && canCompleteTempleOfIkov(ctx) //
        && canCompleteTheTouristTrap(ctx) //
        && canCompleteTrollStronghold(ctx) //
        && canCompletePriestInPeril(ctx) //
        && canCompleteWaterfallQuest(ctx) //
        && canReachTrollheim(ctx)
        && (has(ctx, 2126) || has(ctx, 4164)) // Dwellberries for gas mask or Facemask
        && has(ctx, 1513) // Magic logs
        && has(ctx, 2353) // Steel bar
        && has(ctx, 1775) // Molten glass
        && has(ctx, 592)  // Ashes
        && has(ctx, 973)  // Charcoal
        && has(ctx, 565)  // Blood rune
        && has(ctx, 526)  // Bones
        && has(ctx, 2355) // Silver bar
        && has(ctx, 4668) // Garlic powder
        && has(ctx, 2007) // Spice
        && has(ctx, 3107) // Spiked boots
        && has(ctx, 1523) // Lockpick
        && has(ctx, 590); // Tinderbox
}

function canCompleteDesertTreasureII(ctx) {
    return canCompleteDesertTreasureI(ctx) //
        && canCompleteSecretsOfTheNorth(ctx) //
        && canCompleteEnakhrasLament(ctx) //
        && canCompleteTempleOfTheEye(ctx) //
        && canCompleteGardenOfDeath(ctx) //
        && canCompleteBelowIceMountain(ctx) //
        && canCompleteHisFaithfulServants(ctx) //
        && canTrainFiremaking(ctx) //
        && canTrainHerblore(ctx) //
        && canTrainRunecraft(ctx) //
        && canTrainConstruction(ctx) //
        && canTrainMining(ctx) //
        && has(ctx, 560)  // Death rune
        && has(ctx, 565)  // Blood rune
        && has(ctx, 562)  // Chaos rune
        && has(ctx, 566)  // Soul rune
        && hasAirRuneSource(ctx) //
        && hasWaterRuneSource(ctx) //
        && hasFireRuneSource(ctx) //
        && has(ctx, 590)  // Tinderbox
        && has(ctx, 4164) // Facemask
        && has(ctx, 233); // Pestle and mortar
}

function canCompleteSecretsOfTheNorth(ctx) {
    return canCompleteMakingFriendsWithMyArm(ctx) //
        && canCompleteTheGeneralsShadow(ctx) //
        && canCompleteDeviousMinds(ctx) //
        && has(ctx, 1523) // Lockpick
        && has(ctx, 590); // Tinderbox
}

function canCompleteTheGeneralsShadow(ctx) {
    return canCompleteCurseOfTheEmptyLord(ctx);
}

function canCompleteCurseOfTheEmptyLord(ctx) {
    return canCompleteDesertTreasureI(ctx) //
        && canTrainPrayer(ctx);
}

function canCompleteDeviousMinds(ctx) {
    return canCompleteWanted(ctx) //
        && canCompleteTrollStronghold(ctx) //
        && canCompleteDoricsQuest(ctx) //
        && canTrainSmithing(ctx) //
        && canTrainRunecraft(ctx) //
        && canTrainFletching(ctx) //
        && has(ctx, 1315)  // Mithril 2h sword
        && has(ctx, 1777); // Bow string
}

function canCompleteWanted(ctx) {
    return canCompleteRecruitmentDrive(ctx) //
        && canCompleteTheLostTribe(ctx) //
        && canCompletePriestInPeril(ctx) //
        && canCompleteEnterTheAbyss(ctx)  //
        && (has(ctx, 7936) || has(ctx, 1436)) // Pure essence or Rune essence
        && ctx.player.questPoints >= 32;
}

function canCompleteRecruitmentDrive(ctx) {
    return canCompleteBlackKnightsFortress(ctx) //
        && canCompleteDruidicRitual(ctx) //
        && (has(ctx, 946) || has(ctx, 1755) || has(ctx, 1794)); // Knife, Chisel or Bronze wire
}

function canCompleteBlackKnightsFortress(ctx) {
    return ctx.player.questPoints >= 12 //
        && has(ctx, 1965)  // Cabbage
        && has(ctx, 1101)  // Iron chainbody
        && has(ctx, 1139); // Bronze med helm
}

function canCompleteDoricsQuest(ctx) {
    return has(ctx, 440)  // Iron ore
        && has(ctx, 436)  // Copper ore
        && has(ctx, 434); // Clay
}

function canCompleteGardenOfDeath(ctx) {
    return canTrainFarming(ctx) //
        && has(ctx, 5329);
}

function canCompleteHisFaithfulServants(ctx) {
    return canCompletePriestInPeril(ctx) //
        && has(ctx, 952); // Spade
}

function canCompleteTempleOfIkov(ctx) {
    return has(ctx, 225)       // Limpwurt root
        && (has(ctx, 864)      // Bronze knife
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
            || has(ctx, 20849) // Dragon thrownaxe
            || has(ctx, 857)   // Yew shortbow
            || has(ctx, 855)   // Yew longbow
            || has(ctx, 10282) // Yew comp bow
            || has(ctx, 861)   // Magic shortbow
            || has(ctx, 859)   // Magic longbow
            || has(ctx, 10284) // Magic comp bow
            || has(ctx, 11235) // Dark bow
        );
}

function canCompleteTheGreatBrainRobbery(ctx) {
    return canCompleteCreatureOfFenkenstrain(ctx) //
        && canCompleteCabinFever(ctx) //
        && canCompleteRFDFreeingPiratePete(ctx) //
        && canTrainCrafting(ctx) //
        && canTrainConstruction(ctx) //
        && canTrainPrayer(ctx) //
        && has(ctx, 10891)  // Wooden cat
        && has(ctx, 2347)   // Hammer
        && hasAnyNails(ctx) //
        && has(ctx, 960)    // Plank
        && has(ctx, 1718);  // Holy symbol
}

function canCompleteCreatureOfFenkenstrain(ctx) {
    return canCompletePriestInPeril(ctx) //
        && canTrainCrafting(ctx) //
        && has(ctx, 2355) // Silver bar
        && has(ctx, 1794) // Bronze wire
        && has(ctx, 1733) // Needle
        && has(ctx, 1734) // Thread
        && has(ctx, 952); // Spade
}

function hasNarwhalKnife(ctx) {
    return canTrainCrafting(ctx) //
        && has(ctx, 31954) // Narwhal horn
        && has(ctx, 1755); // Chisel
}

function canCompleteTheEyesOfGlouphrie(ctx) {
    return canCompleteTheGrandTree(ctx) //
        && canTrainConstruction(ctx) //
        && has(ctx, 4687) // Bucket of sap
        && has(ctx, 4698) // Mud rune
        && has(ctx, 1517) // Maple logs
        && has(ctx, 1521) // Oak logs
        && has(ctx, 2347) // Hammer
        && has(ctx, 8794) // Saw
        && has(ctx, 233); // Pestle and mortar
}

function canCompleteTheCorsairCurse(ctx) {
    return has(ctx, 590)  // Tinderbox
        && has(ctx, 952); // Spade
}

function canCompleteCabinFever(ctx) {
    return canCompletePiratesTreasure(ctx) //
        && canCompleteRumDeal(ctx) //
        && canTrainCrafting(ctx) //
        && canTrainSmithing(ctx) //
        && has(ctx, 590)  // Tinderbox
        && has(ctx, 2347) // Hammer
        && has(ctx, 1941) // Swamp paste
        && has(ctx, 954); // Rope
}

function canCompleteRumDeal(ctx) {
    return canCompleteZogreFleshEaters(ctx) //
        && canCompletePriestInPeril(ctx) //
        && canTrainCrafting(ctx) //
        && canTrainFarming(ctx) //
        && canTrainFishing(ctx) //
        && canTrainPrayer(ctx) //
        && (canTrainSlayer(ctx) || ctx.player.levels.Slayer >= 42) //
        && has(ctx, 5341)  // Rake
        && has(ctx, 1925); // Bucket
}

function canCompleteCooksAssistant(ctx) {
    return has(ctx, 1944)  // Egg
        && has(ctx, 1927)  // Bucket of milk
        && has(ctx, 1933); // Pot of flour
}

function canCompleteFishingContest(ctx) {
    return canTrainFishing(ctx) //
        && has(ctx, 1550) // Garlic
        && has(ctx, 307)  // Fishing rod
        && has(ctx, 952); // Spade
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
        && ctx.player.questPoints >= 175
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
    return canCompleteCooksAssistant(ctx) //
        && canTrainCooking(ctx) //
        && has(ctx, 221)  // Eye of newt
        && has(ctx, 1909) // Greenman's ale
        && has(ctx, 2084) // Fruit blast
        && has(ctx, 592); // Ashes
}

function canCompleteRFDFreeingTheMountainDwarf(ctx) {
    return canCompleteRFDAnotherCooksQuest(ctx) //
        && canCompleteFishingContest(ctx) //
        && has(ctx, 1944)  // Egg
        && has(ctx, 1927)  // Bucket of milk
        && has(ctx, 1933)  // Pot of flour
        && has(ctx, 1921)  // Bowl of water
        && has(ctx, 1905); // Asgarnian ale
}

function canCompleteRFDFreeingTheGoblinGenerals(ctx) {
    return canCompleteRFDAnotherCooksQuest(ctx) //
        && canCompleteGoblinDiplomacy(ctx) //
        && has(ctx, 2309) // Bread
        && has(ctx, 2112) // Orange slices
        && (has(ctx, 1767) || has(ctx, 1771) || has(ctx, 1773) || (has(ctx, 229) && has(ctx, 233))) // Blue dye, Green dye, Purple dye or a Vial and Pestle and mortar for black dye
        && (has(ctx, 2007) || has(ctx, 2169)) // Spice or Gnome spice
        && has(ctx, 313)  // Fishing bait
        && has(ctx, 1929) // Bucket of water
        && has(ctx, 973); // Charcoal
}
function canCompleteRFDFreeingPiratePete(ctx) {
    return canCompleteRFDAnotherCooksQuest(ctx) //
        && canTrainCooking(ctx) //
        && has(ctx, 341)  // Raw cod
        && has(ctx, 233)  // Pestle and mortar
        && has(ctx, 2309) // Bread
        && has(ctx, 6667) // Empty fishbowl
        && has(ctx, 1794) // Bronze wire
        && has(ctx, 1733) // Needle
        && has(ctx, 946); // Knife
}

function canCompleteRFDFreeingTheLumbridgeGuide(ctx) {
    return canCompleteRFDAnotherCooksQuest(ctx) //
        && canCompleteBigChompyBirdHunting(ctx) //
        && canCompleteBiohazard(ctx) //
        && canCompleteDemonSlayer(ctx) //
        && canCompleteMurderMystery(ctx) //
        && canCompleteNatureSpirit(ctx) //
        && canCompleteWitchsHouse(ctx) //
        && canTrainCooking(ctx) //
        && has(ctx, 1927)  // Bucket of milk
        && has(ctx, 1944)  // Egg
        && has(ctx, 1933)  // Pot of flour
        && has(ctx, 1887); // Cake tin
}

function canCompleteRFDFreeingEvilDave(ctx) {
    return canCompleteRFDAnotherCooksQuest(ctx) //
        && canCompleteGertrudesCat(ctx) //
        && canCompleteShadowOfTheStorm(ctx) //
        && canTrainCooking(ctx) //
        && has(ctx, 2003); // Stew
}

function canCompleteRFDFreeingSkrachUglologwee(ctx) {
    return canCompleteRFDAnotherCooksQuest(ctx) //
        && canCompleteBigChompyBirdHunting(ctx) //
        && canTrainCooking(ctx) //
        && canTrainFiremaking(ctx) //
        && canTrainWoodcutting(ctx) //
        && has(ctx, 2876)  // Raw chompy
        && has(ctx, 7225)  // Iron spit
        && has(ctx, 1759)  // Ball of wool
        && has(ctx, 7566); // Raw Jubbly
}

function canCompleteRFDFreeingSirAmikVarse(ctx) {
    return ctx.player.questPoints >= 107
        && canCompleteRFDAnotherCooksQuest(ctx) //
        && canStartLegendsQuest(ctx) //
        && canReachKharaziJungle(ctx) //
        && has(ctx, 1927) // Bucket of milk
        && has(ctx, 2130) // Pot of cream
        && has(ctx, 7468) // Pot of cornflour
        && has(ctx, 2138) // Raw chicken
        && has(ctx, 233); // Pestle and mortar
}

function canCompleteRFDFreeingKingAwowogei(ctx) {
    return canCompleteRFDAnotherCooksQuest(ctx) //
        && canCompleteMonkeyMadnessI(ctx) //
        && canTrainCooking(ctx) //
        && has(ctx, 954) // Rope
        && hasSlashWeapon(ctx) //
        && has(ctx, 233); // Pestle and mortar
}

function canCompletePryingTimes(ctx) {
    return canCompletePandemonium(ctx) //
        && canCompleteTheKnightsSword(ctx) //
        && canTrainSmithing(ctx) //
        && has(ctx, 2347)  // Hammer
        && has(ctx, 2325)  // Redberry pie
        && has(ctx, 2353); // Steel bar
}

function canCompleteTheKnightsSword(ctx) {
    return canTrainMining(ctx) //
        && has(ctx, 2351)  // Iron bar
        && has(ctx, 2325); // Redberry pie
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
    return canCompleteEnlightenedJourney(ctx) //
        && canTrainFiremaking(ctx) //
        && has(ctx, 1513) // Magic logs
        && canCompleteTheEyesOfGlouphrie(ctx) //
        && canCompleteRFDFreeingKingAwowogei(ctx) //
        && canCompleteTrollStronghold(ctx) //
        && (canTrainSlayer(ctx) || ctx.player.levels.Slayer >= 69) //
        && canTrainCrafting(ctx) //
        && canTrainHunter(ctx) //
        && has(ctx, 2102) // Lemon
        && has(ctx, 1987) // Grapes
        && has(ctx, 1511) // Logs
        && has(ctx, 2347) // Hammer
        && has(ctx, 1755) // Chisel
        && has(ctx, 233); // Pestle and mortar
}

function hasSlashWeapon(ctx) {
    return true; // TODO
}

function canCompleteWitchsHouse(ctx) {
    return has(ctx, 1985); // Cheese
}

function canCompleteBiohazard(ctx) {
    return canCompletePlagueCity(ctx) //
        && has(ctx, 428)  // Priest gown (bottom)
        && has(ctx, 426); // Priest gown (top)
}

function canCompletePlagueCity(ctx) {
    return has(ctx, 2126) // Dwellberries
        && has(ctx, 952)  // Spade
        && has(ctx, 1929) // Bucket of water
        && has(ctx, 1927) // Bucket of milk
        && has(ctx, 1975) // Chocolate dust
        && has(ctx, 231)  // Snape grass
        && has(ctx, 954); // Rope
}

function canCompleteDemonSlayer(ctx) {
    return has(ctx, 1929) // Bucket of water
        && has(ctx, 526); // Bones
}

function canCompleteMurderMystery(ctx) {
    return has(ctx, 1933); // Pot of flour
}

function canCompleteShadowOfTheStorm(ctx) {
    return canCompleteDemonSlayer(ctx) //
        && canCompleteTheGolem(ctx) //
        && canTrainCrafting(ctx) //
        && (has(ctx, 229) && has(ctx, 233)) // Vial and Pestle and mortar for black dye
        && has(ctx, 2355); // Silver bar
}

function canCompleteTheGolem(ctx) {
    return canTrainCrafting(ctx) //
        && has(ctx, 229)  // Vial
        && has(ctx, 233)  // Pestle and mortar
        && has(ctx, 1761) // Soft clay
        && has(ctx, 970); // Papyrus
}

function canCompleteHorrorFromTheDeep(ctx) {
    return has(ctx, 556)  // Air rune
        && has(ctx, 555)  // Water rune
        && has(ctx, 557)  // Earth rune
        && has(ctx, 554)  // Fire rune
        // This assumes ice arrows can be used and swords/longsword from an event/castle wars
        && has(ctx, 1775) // Molten glass
        && has(ctx, 590)  // Tinderbox
        && has(ctx, 2347) // Hammer
        && has(ctx, 1539) // Steel nails
        && has(ctx, 1939) // Swamp tar
        && has(ctx, 960); // Plank
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
    return canTrainCrafting(ctx) //
        && canTrainConstruction(ctx) //
        && (has(ctx, 948)     // Bear fur
            || has(ctx, 6814) // Fur
            || has(ctx, 958)  // Grey wolf fur
        )
        && has(ctx, 1761) // Soft clay
        && has(ctx, 2347) // Hammer
        && has(ctx, 8794) // Saw
        && has(ctx, 960)  // Plank
        && hasAnyNails(ctx) //
        && has(ctx, 1763) // Red dye
        && has(ctx, 1933) // Pot of flour
        && has(ctx, 946); // Knife
}

function canCompleteTheFeud(ctx) {
    return has(ctx, 4591)  // Kharidian headpiece
        && has(ctx, 4593)  // Fake beard
        && has(ctx, 1917)  // Beer
        && has(ctx, 1925); // Bucket
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
    return canCompleteTheFremennikTrials(ctx) //
        && canTrainConstruction(ctx) //
        && has(ctx, 359)   // Raw tuna
        && (ctx.player.levels.Mining === 1 //
            ? has(ctx, 438) // Tin ore
            : ctx.player.levels.Mining <= 54 //
                ? has(ctx, 453) // Coal
                : has(ctx, 447)) // Mithril ore
        && has(ctx, 10812) // Split log
        && has(ctx, 10826) // Neitiznot shield
        && has(ctx, 10824) // Yak-hide armour (legs)
        && has(ctx, 10822) // Yak-hide armour (top)
        && has(ctx, 954);  // Rope
}

function canCompleteMountainDaughter(ctx) {
    return canTrainMining(ctx) //
        && canTrainWoodcutting(ctx) //
        && has(ctx, 954)  // Rope
        && has(ctx, 960); // Plank
}

function canCompleteTheFremennikExiles(ctx) {
    return canCompleteTheFremennikIsles(ctx) //
        && canCompleteLunarDiplomacy(ctx) //
        && canCompleteMountainDaughter(ctx) //
        && canCompleteHeroesQuest(ctx) //
        && canTrainCrafting(ctx) //
        && (canTrainSlayer(ctx) || ctx.player.levels.Slayer >= 60) //
        && canTrainSmithing(ctx) //
        && canTrainFishing(ctx) //
        && canTrainRunecraft(ctx) //
        && canTrainMining(ctx) //
        && has(ctx, 4156)  // Mirror shield
        && has(ctx, 3801)  // Keg of beer
        && has(ctx, 1775)  // Molten glass
        && has(ctx, 9075)  // Astral rune
        && (has(ctx, 307)  // Fishing rod
            || has(ctx, 309)) // Fly fishing rod
        && has(ctx, 2347)  // Hammer
        && has(ctx, 1785); // Glassblowing pipe
}

function canCompleteScorpionCatcher(ctx) {
    return canTrainPrayer(ctx);
}

function canCompleteEnakhrasLament(ctx) {
    return canTrainCrafting(ctx) //
        && canTrainFiremaking(ctx) //
        && canTrainPrayer(ctx)
        && has(ctx, 1755) // Chisel
        && has(ctx, 590)  // Tinderbox
        && has(ctx, 36)   // Candle
        && has(ctx, 1511) // Logs
        && has(ctx, 1521) // Oak logs
        && has(ctx, 1519) // Willow logs
        && has(ctx, 1517) // Maple logs
        && has(ctx, 1761) // Soft clay
        && has(ctx, 453)  // Coal
        && (has(ctx, 6977) || has(ctx, 6971) || has(ctx, 6973) || has(ctx, 6975)) // Any sandstone
        && has(ctx, 6983) // Granite (5kg)
        && hasAirRuneSource(ctx) //
        && hasFireRuneSource(ctx) //
        && hasEarthRuneSource(ctx) //
        && has(ctx, 562); // Chaos rune
}

function canReachKharaziJungle(ctx) {
    return canStartLegendsQuest(ctx)
        && canTrainWoodcutting(ctx) //
        && hasMachete(ctx);
}

function canStartLegendsQuest(ctx) {
    return ctx.player.questPoints >= 107 //
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
    return canCompleteInAidOfTheMyreque(ctx) //
        && canTrainConstruction(ctx) //
        && canTrainMining(ctx) //
        && canTrainCrafting(ctx) //
        && hasAnyNails(ctx) //
        && has(ctx, 960)  // Plank
        && has(ctx, 2347) // Hammer
        && has(ctx, 946)  // Knife
        && hasAirRuneSource(ctx) //
        && has(ctx, 563); // Law rune
}

function canStartATasteOfHope(ctx) {
    return canCompleteDarknessOfHallowvale(ctx) //
        && canTrainCrafting(ctx) //
        && (canTrainSlayer(ctx) || ctx.player.levels.Slayer >= 38) //
        && canTrainHerblore(ctx) //
        && canTrainMining(ctx); //
}

function canCompleteATasteOfHope(ctx) {
    return canCompleteDarknessOfHallowvale(ctx) //
        && canTrainCrafting(ctx) //
        && (canTrainSlayer(ctx) || ctx.player.levels.Slayer >= 38) //
        && canTrainHerblore(ctx) //
        && canTrainMining(ctx) //
        && has(ctx, 1605) // Emerald
        && has(ctx, 1755) // Chisel
        && has(ctx, 233)  // Pestle and mortar
        && has(ctx, 227)  // Vial of water
        && has(ctx, 946) || has(ctx, 2961); // Knife or Silver sickle
}

function canCompleteVampyreSlayer(ctx) {
    return has(ctx, 1917)  // Beer
        && has(ctx, 2347)  // Hammer
        && has(ctx, 1550); // Garlic
}

function canCompleteSinsOfTheFather(ctx) {
    return canCompleteVampyreSlayer(ctx) //
        && canCompleteATasteOfHope(ctx) //
        && canTrainWoodcutting(ctx) //
        && canTrainFletching(ctx) //
        && canTrainCrafting(ctx) //
        && (canTrainSlayer(ctx) || ctx.player.levels.Slayer >= 50) //
        && has(ctx, 1603) // Ruby
        && has(ctx, 1755) // Chisel
        && has(ctx, 2347) // Hammer
        && has(ctx, 946); // Knife
}

function canCompleteTrollStronghold(ctx) {
    return canCompleteDeathPlateau(ctx);
}

function canStartMageArenaII(ctx) {
    return has(ctx, 565) // Blood rune
        && hasAirRuneSource(ctx) //
        && hasFireRuneSource(ctx); //
}

function canCompleteWhatLiesBelow(ctx) {
    return canCompleteRuneMysteries(ctx) //
        && canTrainRunecraft(ctx) //
        && has(ctx, 1923) // Bowl
        && has(ctx, 562)  // Chaos rune
        && (
            has(ctx, 1452)    // Chaos talisman
            || has(ctx, 5543) // Chaos tiara
            || canCompleteEnterTheAbyss(ctx) //
            || canDoGuardiansOfTheRift(ctx)
        );
}

function canCompleteOlafsQuest(ctx) {
    return canTrainFiremaking(ctx) //
        && canTrainWoodcutting(ctx) //
        && has(ctx, 590)  // Tinderbox
        && has(ctx, 952)  // Spade
        && has(ctx, 954); // Rope
}

function canCompleteDefenderOfVarrock(ctx) {
    return canCompleteTempleOfIkov(ctx) //
        && canCompleteBelowIceMountain(ctx) //
        && canCompleteFamilyCrest(ctx) //
        && canCompleteGardenOfTranquillity(ctx) //
        && canCompleteWhatLiesBelow(ctx) //
        && canCompleteRomeoAndJuliet(ctx) //
        && canCompleteDemonSlayer(ctx) //
        && canTrainSmithing(ctx) //
        && canTrainHunter(ctx) //
        && canTrainMining(ctx);
}

function canCompleteTreeGnomeVillage(ctx) {
    return has(ctx, 1511); // Logs
}

function canCompleteTheSlugMenace(ctx) {
    return canCompleteWanted(ctx) //
        && canCompleteSeaSlug(ctx) //
        && canTrainCrafting(ctx) //
        && canTrainRunecraft(ctx) //
        && (canTrainSlayer(ctx) || ctx.player.levels.Slayer >= 30) //
        && has(ctx, 1941) // Swamp paste
        && (has(ctx, 1436) || has(ctx, 7936)) // Rune essence or Pure essence
        && has (ctx, 1755) // Chisel
        && (
            canDoGuardiansOfTheRift(ctx) //
            || canCompleteEnterTheAbyss(ctx) //
            || (
                (has(ctx, 1438) || has(ctx, 5527)) // Air talisman or Air tiara
                && (has(ctx, 1444) || has(ctx, 5531)) // Water talisman or Water tiara
                && (has(ctx, 1440) || has(ctx, 5535)) // Earth talisman or Earth tiara
                && (has(ctx, 1442) || has(ctx, 5537)) // Fire talisman or Fire tiara
            )
        );
}

function canCompleteDaddysHome(ctx) {
    return has(ctx, 960)    // Plank
        && has(ctx, 8790)   // Bolt of cloth
        && hasAnyNails(ctx) //
        && has(ctx, 2347)   // Hammer
        && has(ctx, 8794);  // Saw
}

function canCompleteSeaSlug(ctx) {
    return canTrainFiremaking(ctx) //
        && has(ctx, 1941) // Swamp paste
        && has(ctx, 596); // Unlit torch
}

function canCompleteTaleOfTheRighteous(ctx) {
    return canCompleteClientOfKourend(ctx) //
        && canTrainMining(ctx)
        && has(ctx, 954) // Rope
        && hasAirRuneSource(ctx) //
        && (has(ctx, 558) || has(ctx, 562) || has(ctx, 560) || has(ctx, 565)); // Mind rune, Chaos rune, Death rune or Blood rune
}

function canCompleteTheDepthsOfDespair(ctx) {
    return canCompleteClientOfKourend(ctx);
}

function canStartTheQueenOfThieves(ctx) {
    return canCompleteClientOfKourend(ctx);
}

function canCompleteTheQueenOfThieves(ctx) {
    return canCompleteClientOfKourend(ctx)
        && has(ctx, 2003); // Stew
}

function canCompleteTheAscentOfArceuus(ctx) {
    return canCompleteClientOfKourend(ctx)
        && (ctx.player.levels.Hunter >= 12 || canTrainHunter(ctx));
}

function canCompleteTheForsakenTower(ctx) {
    return canCompleteClientOfKourend(ctx)
        && has(ctx, 590); // Tinderbox
}

function canCompleteASoulsBane(ctx) {
    return has(ctx, 954); // Rope
}

function canCompleteAPorcineOfInterest(ctx) {
    return has(ctx, 954); // Rope
}

function canCompleteAKingdomDivided(ctx) {
    return canCompleteTheDepthsOfDespair(ctx) //
        && canCompleteTheQueenOfThieves(ctx) //
        && canCompleteTheAscentOfArceuus(ctx) //
        && canCompleteTheForsakenTower(ctx) //
        && canCompleteTaleOfTheRighteous(ctx) //
        && canTrainWoodcutting(ctx) //
        && canTrainHerblore(ctx) //
        && canTrainMining(ctx) //
        && canTrainCrafting(ctx) //
        && hasAirRuneSource(ctx) //
        && hasFireRuneSource(ctx) //
        && (has(ctx, 558) || has(ctx, 562) || has(ctx, 560) || has(ctx, 565)) // Mind rune, Chaos rune, Death rune or Blood rune
        && (has(ctx, 133) || has(ctx, 2432)) // Defence potion(3) or Defence potion(4)
        && (has(ctx, 2126) || has(ctx, 4164)) // Dwellberries for gas mask or Facemask
        && has(ctx, 1775)  // Molten glass
        && has(ctx, 1755); // Chisel
}

function canCompleteThePathOfGlouphrie(ctx) {
    return canCompleteTheEyesOfGlouphrie(ctx) //
        && canCompleteWaterfallQuest(ctx) //
        && canCompleteTreeGnomeVillage(ctx) //
        && (canTrainSlayer(ctx) || ctx.player.levels.Slayer >= 56) //
        && has(ctx, 9419); // Mith Grapple (phoenix crossbow is available)
}

function canCompleteTheHandInTheSand(ctx) {
    return canTrainCrafting(ctx) //
        && has(ctx, 1917) // Beer
        && has(ctx, 229)  // Vial
        && has(ctx, 1951) // Redberries
        && has(ctx, 239)  // White berries
        && has(ctx, 4542) // Lantern lens
        && has(ctx, 1783) // Bucket of sand
        && has(ctx, 557); // Earth rune
}

function canCompleteTearsOfGuthix(ctx) {
    return ctx.player.questPoints >= 43 //
        && canTrainCrafting(ctx) //
        && canTrainMining(ctx) //
        && canTrainFiremaking(ctx) //
        && has(ctx, 4548) // Bullseye lantern
        && has(ctx, 1607) // Sapphire
        && has(ctx, 1755) // Chisel
        && has(ctx, 590)  // Tinderbox
        && canEnterLumbridgeSwampCaves(ctx);
}

function canCompleteWhileGuthixSleeps(ctx) {
    return ctx.player.questPoints >= 180 //
        && canCompleteDefenderOfVarrock(ctx) //
        && canCompleteThePathOfGlouphrie(ctx) //
        && canCompleteDreamMentor(ctx) //
        && canCompleteTheHandInTheSand(ctx) //
        && canCompleteWanted(ctx) //
        && canCompleteTempleOfTheEye(ctx) //
        && canCompleteTearsOfGuthix(ctx) //
        && canCompleteNatureSpirit(ctx) //
        && canCompleteATailOfTwoCats(ctx) //
        && canTrainFarming(ctx) //
        && canTrainHerblore(ctx) //
        && canTrainHunter(ctx) //
        && has(ctx, 946)  // Knife
        && has(ctx, 4542) // Lantern lens
        && has(ctx, 567)  // Unpowered orb
        && has(ctx, 1139) // Bronze med helm
        && has(ctx, 1101) // Iron chainbody
        && has(ctx, 4548) // Bullseye lantern
        && has(ctx, 1607) // Sapphire
        && has(ctx, 1951) // Redberries
        && has(ctx, 239)  // White berries
        && hasAirRuneSource(ctx) //
        && has(ctx, 564)  // Cosmic rune
        && has(ctx, 9075) // Astral rune
        && hasWaterRuneSource(ctx) //
        && hasEarthRuneSource(ctx) //
        && hasFireRuneSource(ctx) //
        && (has(ctx, 559) || has(ctx, 566)) // Body rune or Soul rune
        && has(ctx, 561)  // Nature rune
        && has(ctx, 563)  // Law rune
        && has(ctx, 558)  // Mind rune
        && has(ctx, 560)  // Death rune
        && has(ctx, 2970) // Mort myre fungus
        && hasAnyLog(ctx) //
        && has(ctx, 5300) // Snapdragon seed
        && has(ctx, 2430) // Restore potion(4)
        && has(ctx, 970)  // Papyrus
        && has(ctx, 973); // Charcoal
}

function canCompleteSongOfTheElves(ctx) {
    return canCompleteMourningsEndPartII(ctx) //
        && canCompleteMakingHistory(ctx) //
        && canCompleteDruidicRitual(ctx) //
        && canTrainConstruction(ctx) //
        && canTrainFarming(ctx) //
        && canTrainHerblore(ctx) //
        && canTrainHunter(ctx) //
        && canTrainMining(ctx) //
        && canTrainSmithing(ctx) //
        && canTrainWoodcutting(ctx) //
        && has(ctx, 1157) // Steel full helm
        && has(ctx, 1119) // Steel platebody
        && has(ctx, 1069) // Steel platelegs
        && has(ctx, 1763) // Red dye
        && has(ctx, 1773) // Purple dye
        && has(ctx, 950)  // Silk
        && has(ctx, 2363) // Runite bar
        && has(ctx, 3420) // Limestone brick
        && has(ctx, 590)  // Tinderbox
        && has(ctx, 954)  // Rope
        && has(ctx, 561)  // Nature rune
        && (
            has(ctx, 2472)    // Mixed flowers
            || has(ctx, 2462) // Red flowers
            || has(ctx, 2466) // Yellow flowers
            || has(ctx, 2464) // Blue flowers
            || has(ctx, 2470) // Orange flowers
            || has(ctx, 2468) // Purple flowers
            || has(ctx, 2460) // Assorted flowers
            || has(ctx, 2476) // Black flowers
            || has(ctx, 2474) // White flowers
            || has(ctx, 259)  // Irit leaf
        )
        && has(ctx, 1111) // Adamant chainbody
        && (has(ctx, 245) // Wine of zamorak
            || has(ctx, 2450) // Zamorak brew(4)
        )
        // && has(ctx, 1965) // Cabbage, draynor cabbage might be used?
        && (has(ctx, 869) // Black knife
            || has(ctx, 1217) // Black dagger
        )
        && has(ctx, 5301) // Cadantine seed
        && has(ctx, 227)  // Vial of water
        && has(ctx, 233)  // Pestle and mortar
        && has(ctx, 2347) // Hammer
        && has(ctx, 8794) // Saw
        && has(ctx, 952); // Spade
}

function canCompleteShadowsOfCustodia(ctx) {
    return (canTrainSlayer(ctx) || ctx.player.levels.Slayer >= 54) //
        && canTrainFishing(ctx) //
        && canTrainConstruction(ctx) //
        && canTrainHunter(ctx) //
        && has(ctx, 847)  // Willow longbow
        && has(ctx, 1517) // Maple logs
        && has(ctx, 2347) // Hammer
        && has(ctx, 307); // Fishing rod
}

function canCompleteInAidOfTheMyreque(ctx) {
    return canCompleteInSearchOfTheMyreque(ctx) //
        && canTrainCrafting(ctx) //
        && canTrainMining(ctx) //
        && has(ctx, 952) // Spade
        && has(ctx, 1925) // Bucket
        && has(ctx, 2347) // Hammer
        && has(ctx, 960)  // Plank
        && hasAnyNails(ctx) //
        && has(ctx, 1941) // Swamp paste
        && ( //
            has(ctx, 353) // Raw mackerel
            || has(ctx, 355) // Mackerel
            || has(ctx, 3363) // Thin snail
            || has(ctx, 3365) // Lean snail
            || has(ctx, 3367) // Fat snail
        ) //
        && has(ctx, 1351) // Bronze axe
        && has(ctx, 590)  // Tinderbox
        && has(ctx, 2353) // Steel bar
        && has(ctx, 453)  // Coal
        && has(ctx, 1761) // Soft clay
        && has(ctx, 2355) // Silver bar
        && has(ctx, 2359) // Mithril bar
        && has(ctx, 1607) // Sapphire
        && has(ctx, 954); // Rope
}

function canCompleteInSearchOfTheMyreque(ctx) {
    return canCompleteNatureSpirit(ctx) //
        && has(ctx, 1295) // Steel longsword
        && has(ctx, 1281) // Stel sword
        && has(ctx, 1424) // Steel mace
        && has(ctx, 1339) // Steel warhammer
        && has(ctx, 1207) // Steel dagger
        && has(ctx, 1539) // Steel nails
        && has(ctx, 2347) // Hammer
        && has(ctx, 960); // Plank
}

function canCompleteWaterfallQuest(ctx) {
    return has(ctx, 556)  // Air rune
        && has(ctx, 555)  // Water rune
        && has(ctx, 557)  // Earth rune
        && has(ctx, 954); // Rope
}

function canCompleteDwarfCannon(ctx) {
    return has(ctx, 2347); // Hammer
}

function canCompleteTroubledTortugans(ctx) {
    return canTrainCrafting(ctx) //
        && canTrainHunter(ctx) //
        && canTrainWoodcutting(ctx) //
        && canTrainConstruction(ctx) //
        && canCompletePandemonium(ctx) //
        && has(ctx, 401);     // Seaweed
}

function canCompleteTheFremennikTrials(ctx) {
    return has(ctx, 1917) // Beer
        && has(ctx, 590)  // Tinderbox
        && (has(ctx, 383) // Raw shark
            || (canTrainFishing(ctx) && (has(ctx, 389) || has(ctx, 395))))  // Raw manta ray or Raw sea turtle
}

function canCompleteDruidicRitual(ctx) {
    return has(ctx, 2136)  // Raw bear meat
        && has(ctx, 2134)  // Raw rat meat
        && has(ctx, 2132)  // Raw beef
        && has(ctx, 2138); // Raw chicken
}

function canCompletePandemonium(ctx) {
    return has(ctx, 2347)  // Hammer
        && has(ctx, 8794); // Saw
}

function canCompleteTheHeartOfDarkness(ctx) {
    return canTrainMining(ctx);
}

function canStartIcthlarinsLittleHelper(ctx) {
    return canCompleteGertrudesCat(ctx);
}

function canCompleteIcthlarinsLittleHelper(ctx) {
    return canCompleteGertrudesCat(ctx) //
        && has(ctx, 590)   // Tinderbox
        && has(ctx, 1519)  // Willow logs
        && (has(ctx, 4161) || (has(ctx, 1925) && has(ctx, 4689))) // Bag of salt or (Bucket and Pile of salt)
        && has(ctx, 4687)  // Bucket of sap
        && has(ctx, 1823)  // Waterskin(4)
        && has(ctx, 4684); // Linen
}

function canCompleteGertrudesCat(ctx) {
    return has(ctx, 1927)  // Bucket of milk
        && has(ctx, 1552); // Seasoned sardine
}

function canCompleteEnlightenedJourney(ctx) {
    return ctx.player.questPoints >= 20 //
        && canTrainFiremaking(ctx) //
        && canTrainFarming(ctx) //
        && canTrainCrafting(ctx) //
        && has(ctx, 970)  // Papyrus
        && has(ctx, 1759) // Ball of wool
        && has(ctx, 5438) // Potatoes(10)
        && has(ctx, 5418) // Empty sack
        && hasCandle(ctx) //
        && has(ctx, 1765) // Yellow dye
        && has(ctx, 1763) // Red dye
        && has(ctx, 950)  // Silk
        && has(ctx, 1923) // Bowl
        && has(ctx, 1511) // Logs
        && has(ctx, 1511) // Logs
        && has(ctx, 5933) // Willow branch
        && has(ctx, 590); // Tinderbox
}

function hasCandle(ctx) {
    return has(ctx, 36) // Candle
        || has(ctx, 30) // Bucket of wax (For black candle)
}

function canCompletePriestInPeril(ctx) {
    return has(ctx, 1925)  // Bucket
        && (has(ctx, 7936) // Pure essence
            || has(ctx, 1436) // or Rune essence
        );
}

function canCompleteShieldOfArrav(ctx) {
    return true;
}

function canCompleteHazeelCult(ctx) {
    return true; // TODO might be uncompletable if wrong path chosen
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

function canCompleteBoneVoyage(ctx) {
    return canCompleteTheDigSite(ctx) //
        && has(ctx, 2015) // Vodka
        && has(ctx, 93)   // Marrentill potion (unf)
        // 100 kudos needed
        // 28 kudos from natural history museum quiz
        // 50 from cleaning finds
        && has(ctx, 1059) // Leather gloves
        && has(ctx, 1061) // Leather boots
        // 22 kudos needed = 5 quests
        && countCompletableKudosquests(ctx) >= 5;
}

function canCompleteElementalWorkshopI(ctx) {
    return canTrainMining(ctx) //
        && canTrainCrafting(ctx) //
        && has(ctx, 2347) // Hammer
        && has(ctx, 1733) // Needle
        && has(ctx, 1734) // Thread
        && has(ctx, 1741) // Leather
        && has(ctx, 453); // Coal
}

function canCompleteElementalWorkshopII(ctx) {
    return canCompleteElementalWorkshopI(ctx);
}

function canCompleteAnotherSliceOfHAM(ctx) {
    return canCompleteDeathToTheDorgeshuun(ctx) //
        && canCompleteTheGiantDwarf(ctx) //
        && canCompleteTheDigSite(ctx) //
        && canTrainPrayer(ctx); //
}

function canCompleteTheGiantDwarf(ctx) {
    return canTrainCrafting(ctx) //
        && canTrainFiremaking(ctx) //
        && has(ctx, 563)  // Law rune
        && hasAirRuneSource(ctx) //
        && hasAnyLog(ctx) //
        && has(ctx, 453)  // Coal
        && has(ctx, 2351) // Iron bar
        && has(ctx, 1607) // Sapphire
        && has(ctx, 2325) // Redberry pie
        && has(ctx, 590); // Tinderbox
}

function canCompleteImpCatcher(ctx) {
    return has(ctx, 1470)  // Red bead
        && has(ctx, 1472)  // Yellow bead
        && has(ctx, 1474)  // Black bead
        && has(ctx, 1476); // White bead
}

function canCompleteZogreFleshEaters(ctx) {
    return canCompleteBigChompyBirdHunting(ctx) //
        && canCompleteJunglePotion(ctx) //
        && canTrainSmithing(ctx);
}

function canStartZogreFleshEaters(ctx) {
    return canCompleteBigChompyBirdHunting(ctx) //
        && canCompleteJunglePotion(ctx);
}

function canCompleteJunglePotion(ctx) {
    return canCompleteDruidicRitual(ctx);
}

function canCompleteBigChompyBirdHunting(ctx) {
    return canTrainFletching(ctx) //
        && canTrainCooking(ctx) //
        && canTrainWoodcutting(ctx) //
        && has(ctx, 314)  // Feather
        && has(ctx, 946)  // Knife
        && has(ctx, 1755) // Chisel
        && has(ctx, 1965) // Cabbage
        && has(ctx, 1982) // Tomato
        && has(ctx, 1957) // Onion
        && has(ctx, 1942) // Potato
        && has(ctx, 2128) // Equa leaves
        && has(ctx, 1573) // Doogle leaves
        && has(ctx, 2862) // Achey tree logs
        && has(ctx, 2864) // Ogre arrow shaft
        && has(ctx, 2865) // Flighted ogre arrow
        && has(ctx, 2859) // Wolf bones
        && has(ctx, 2861) // Wolfbone arrowtips
        && has(ctx, 2866) // Ogre arrow
        && has(ctx, 2876);// Raw chompy
}

function canTrainCrafting(ctx) {
    if (ctx.filters?.overrideCrafting) return true;
    return true; // TODO implement this beast (true because lamps and buttons)
}

function canTrainPrayer(ctx) {
    return has(ctx, 3183) // Monkey bones
        || has(ctx, 4834) // Ourg bones
        || has(ctx, 4832) // Raurg bones
        || has(ctx, 3123) // Shaikahan bones
        || has(ctx, 31726) // Strykewyrm bones
        || has(ctx, 22124) // Superior dragon bones
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
    return has(ctx, 1351)  // Bronze axe
        || has(ctx, 1349); // Iron axe
}

function canTrainMining(ctx) {
    if (ctx.filters?.overrideMining) return true;
    return has(ctx, 1265)  // Bronze pickaxe
        || has(ctx, 1267)  // Iron pickaxe
        || has(ctx, 1269); // Steel pickaxe
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
    if (ctx.filters?.slayerLocked) return false;
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