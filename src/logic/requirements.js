
async function has(ctx, id) {
    const item = ctx.items.find(i => i.id === id);
    if (!item) return false;
    return ctx.unlocked.includes(id) && await ctx.rolled.includes(id);
}

export const REQUIREMENT_CHECKS = {
    async canCompleteTaiBwoWannaiTrio(ctx) {
        return await canCompleteTaiBwoWannaiTrio(ctx);
    },
    async canCompleteDragonSlayerII(ctx) {
        return false; // TODO
    },
    async canCompleteDragonSlayerI(ctx) {
        return false; // TODO
    },
    async canCompleteDesertTreasureII(ctx) {
        return false; // TODO
    },
    async canCompleteDesertTreasureI(ctx) {
        return false; // TODO
    },
    async canCompleteGiantsFoundry(ctx) {
        return false; // TODO
    },
    async canCompleteRatcatchers(ctx) {
        return false; // TODO
    },
    async canCompleteMyArmsBigAdventure(ctx) {
        return false; // TODO
    },
    async canCompleteInAidOfTheMyreque(ctx) {
        return false; // TODO
    },
    async canCompleteShadowsOfCustodia(ctx) {
        return false; // TODO
    },
    async canCompleteSongOfTheElves(ctx) {
        return false; // TODO
    },
    async canCompleteWhileGuthixSleeps(ctx) {
        return false; // TODO
    },
    async canCompleteTheGreatBrainRobbery(ctx) {
        return false; // TODO
    },
    async canCompleteATasteOfHope(ctx) {
        return false; // TODO
    },
    async canCompleteSinsOfTheFather(ctx) {
        return false; // TODO
    },
    async canCompleteWhatLiesBelow(ctx) {
        return false; // TODO
    },
    async canStartMageArenaII(ctx) {
        return false; // TODO
    },
    async canCompleteErnestTheChicken(ctx) {
        return await canCompleteErnestTheChicken(ctx);
    },
    async canCompleteTheFremennikExiles(ctx) {
        return false; // TODO
    },
    async canCompleteCabinFever(ctx) {
        return false; // TODO
    },
    async canCompleteWanted(ctx) {
        return false; // TODO
    },
    async canCompleteTheFinalDawn(ctx) {
        return false; // TODO
    },
    async canCompleteShadesOfMortton(ctx) {
        return await canCompleteShadesOfMortton(ctx);
    },
    async canCompleteSleepingGiants(ctx) {
        return false; // TODO
    },
    async canCompleteBelowIceMountain(ctx) {
        return false; // TODO
    },
    async canCompleteAKingdomDivided(ctx) {
        return false; // TODO
    },
    async canCompleteTaleOfTheRighteous(ctx) {
        return false; // TODO
    },
    async canCompleteTheSlugMenace(ctx) {
        return false; // TODO
    },
    async canCompleteTheTouristTrap(ctx) {
        return false; // TODO
    },
    async canCompleteTreeGnomeVillage(ctx) {
        return false; // TODO
    },
    async canCompleteMountainDaughter(ctx) {
        return false; // TODO
    },
    async canCompleteAPorcineOfInterest(ctx) {
        return false; // TODO
    },
    async canCompleteTempleOfIkov(ctx) {
        return false; // TODO
    },
    async canCompleteInSearchOfTheMyreque(ctx) {
        return false; // TODO
    },
    async canCompleteTheCorsairCurse(ctx) {
        return false; // TODO
    },
    async canCompleteTheEyesOfGlouphrie(ctx) {
        return false; // TODO
    },
    async canCompleteCreatureOfFenkenstrain(ctx) {
        return false; // TODO
    },
    async canCompleteRFDFreeingPiratePete(ctx) {
        return false; // TODO
    },
    async canCompleteRFDFreeingSirAmikVarse(ctx) {
        return false; // TODO
    },
    async canCompleteRFDFreeingEvilDave(ctx) {
        return false; // TODO
    },
    async canCompleteRFDFreeingSkrachUglologwee(ctx) {
        return false; // TODO
    },
    async canEnterNightmareZone(ctx) {
        return false; // TODO
    },
    async canEnterLumbridgeSwampCaves(ctx) {
        return false; // TODO
    },
    async canCompleteMakingFriendsWithMyArm(ctx) {
        return false; // TODO
    },
    async canCompleteSwanSong(ctx) {
        return false; // TODO
    },
    async canCompleteGrimTales(ctx) {
        return false; // TODO
    },
    async canCompleteObservatoryQuest(ctx) {
        return false; // TODO
    },
    async canCompleteBetweenARock(ctx) {
        return false; // TODO
    },
    async canGetGoutweed(ctx) {
        return false; // TODO
    },
    async canCompleteRegicide(ctx) {
        return false; // TODO
    },
    async canCompleteTheAscentOfArceuus(ctx) {
        return false; // TODO
    },
    async canCompleteOlafsQuest(ctx) {
        return false; // TODO
    },
    async canCompleteDefenderOfVarrock(ctx) {
        return false; // TODO
    },
    async canCompleteTheCurseOfArrav(ctx) {
        return false; // TODO
    },
    async canCompleteDreamMentor(ctx) {
        return false; // TODO
    },
    async canCompleteTrollRomance(ctx) {
        return false; // TODO
    },
    async canStartMourningsEndPartI(ctx) {
        return false; // TODO
    },
    async canEnterTheChampionsGuild(ctx) {
        return false; // TODO quest points
    },
    async canCompleteMourningsEndPartI(ctx) {
        return false; // TODO
    },
    async canCompleteMourningsEndPartII(ctx) {
        return false; // TODO
    },
    async canCompleteDarknessOfHallowvale(ctx) {
        return false; // TODO
    },
    async canCompleteShadowOfTheStorm(ctx) {
        return false; // TODO
    },
    async canCompleteASoulsBane(ctx) {
        return false; // TODO
    },
    async canCompleteMerlinsCrystal(ctx) {
        return false; // TODO
    },
    async canCompletePlagueCity(ctx) {
        return false; // TODO
    },
    async canCompleteGettingAhead(ctx) {
        return false; // TODO
    },
    async canCompleteFremennikTrials(ctx) {
        return false; // TODO
    },
    async canCompleteTheFeud(ctx) {
        return false; // TODO
    },
    async canCompleteTheFremennikIsles(ctx) {
        return false; // TODO
    },
    async hasAnySlashWeapon(ctx) {
        return false; // TODO
    },
    async canAccessCooksGuild(ctx) {
        return await has(ctx, 1949) && await canTrainCooking(ctx);
    },
    async canCompleteRecipeForDisaster(ctx) {
        return false; // TODO
    },
    async canCompleteRumDeal(ctx) {
        return false; // TODO
    },
    async canCompleteHorrorFromTheDeep(ctx) {
        return false; // TODO
    },
    async canCompleteMeatAndGreet(ctx) {
        return false; // TODO
    },
    async canCompleteNatureSpirit(ctx) {
        return await canCompleteNatureSpirit(ctx);
    },
    async canCompleteSecretsOfTheNorth(ctx) {
        return false; // TODO
    },
    async canCompleteLunarDiplomacy(ctx) {
        return await canCompleteLunarDiplomacy(ctx);
    },
    async canCompleteEaglesPeak(ctx) {
        return false; // TODO
    },
    async canCompleteUndergroundPass(ctx) {
        return false; // TODO
    },
    async canCompleteWatchtower(ctx) {
        return false; // TODO
    },
    async canCompleteFairytaleIICureAQueen(ctx) {
        return false; // TODO
    },
    async canCompleteRecipeForDisaster(ctx) {
        return false; // TODO
    },
    async canCompleteEnakhrasLament(ctx) {
        return false; // TODO
    },
    async canCompleteTheGrandTree(ctx) {
        return false; // TODO
    },
    async canEnterBraindeathIsland(ctx) {
        return false; // TODO
    },
    async canDoMixology(ctx) {
        return false; // TODO
    },
    async canCompleteWildernessDiaryEasy(ctx) {
        return false; // TODO
    },
    async canCompleteWildernessDiaryMedium(ctx) {
        return false; // TODO
    },
    async canCompleteWildernessDiaryHard(ctx) {
        return false; // TODO
    },
    async canCompleteWildernessDiaryElite(ctx) {
        return false; // TODO
    },
    async canDoTombsOfAmascut(ctx) {
        return await canDoTombsOfAmascut(ctx);
    },
    async canCompleteHeroesQuest(ctx) {
        return await canCompleteHeroesQuest(ctx);
    },
    async canCompleteRuneMysteries(ctx) {
        return await canCompleteRuneMysteries(ctx);
    },
    async canBirdSnare(ctx) {
        return await canBirdSnare(ctx);
    },
    async canNooseWand(ctx) {
        return await canNooseWand(ctx);
    },
    async canCatchImplingsInJars(ctx) {
        return await canCatchImplingsInJars(ctx);
    },
    async canDeadfallTrap(ctx) {
        return await canDeadfallTrap(ctx);
    },
    async canPitfallTrap(ctx) {
        return await canPitfallTrap(ctx);
    },
    async canCatchSalamanders(ctx) {
        return await canCatchSalamanders(ctx);
    },
    async canCatchCrabs(ctx) {
        return await canCatchCrabs(ctx);
    },
    async canCatchButterflies(ctx) {
        return await canCatchButterflies(ctx);
    },
    async hasRabbitSnare(ctx) {
        return await has(ctx, 10031);
    },
    async canCompleteTheFrozenDoor(ctx) {
        return await canCompleteTheFrozenDoor(ctx);
    },
    async canStartPerilousMoons(ctx) {
        return await canStartPerilousMoons(ctx);
    },
    async canCompleteFairytaleIGrowingPains(ctx) {
        return await canCompleteFairytaleIGrowingPains(ctx)
    },
    async canCompleteBoneVoyage(ctx) {
        return await canCompleteBoneVoyage(ctx);
    },
    async canCompleteBigChompyBirdHunting(ctx) {
        return await canCompleteBigChompyBirdHunting(ctx);
    },
    async canCompleteThroneOfMiscellania(ctx) {
        return await canCompleteThroneOfMiscellania(ctx);
    },
    async hasLarransKey(ctx) {
        return await has(ctx, 23490);
    },
    async canCompleteDeathPlateau(ctx) {
        return await canCompleteDeathPlateau(ctx);
    },
    async canCompleteJunglePotion(ctx) {
        return await canCompleteJunglePotion(ctx);
    },
    async canCompleteBeneathCursedSands(ctx) {
        return await canCompleteBeneathCursedSands(ctx);
    },
    async canCompleteTheHeartOfDarkness(ctx) {
        return await canCompleteTheHeartOfDarkness(ctx);
    },
    async canStartIcthlarinsLittleHelper(ctx) {
        return await canCompleteIcthlarinsLittleHelper(ctx); // TODO start maybe anders?
    },
    async canCompleteIcthlarinsLittleHelper(ctx) {
        return await canCompleteIcthlarinsLittleHelper(ctx);
    },
    async canReachAbyssalSire(ctx) {
        return await canCompleteEnterTheAbyss(ctx) || await canCompleteFairytaleIGrowingPains(ctx);
    },
    async canReachTrollheim(ctx) {
        return await canReachTrollheim(ctx);
    },
    async canReachPiratesCove(ctx) {
        return false; // TODO
    },
    async canGetBirdNestWyson(ctx) {
        return await canGetBirdNestWyson(ctx);
    },
    async canDoGuardiansOfTheRift(ctx) {
        return await canCompleteTempleOfTheEye(ctx);
    },
    async canTrainFarming(ctx) {
        return await canTrainFarming(ctx);
    },
    async canTrainFishing(ctx) {
        return await canTrainFishing(ctx);
    },
    async canTrainWoodcutting(ctx) {
        return await canTrainWoodcutting(ctx);
    },
    async canTrainMining(ctx) {
        return await canTrainMining(ctx);
    },
    async canTrainCooking(ctx) {
        return await canTrainCooking(ctx);
    },
    async canDoGnomeRestaurant(ctx) {
        return await canDoGnomeRestaurant(ctx);
    },
    async canDoValeTotems(ctx) {
        return await canDoValeTotems(ctx);
    },
    async canDoWintertodt(ctx) {
        return await canDoWintertodt(ctx);
    },
    async canDoHallowedSepulchre(ctx) {
        return false; // TODO
    },
    async canDoSalvaging(ctx) {
        return await canDoSalvaging(ctx);
    },
    async canCompleteMonkeyMadnessII(ctx) {
        return false; // TODO
    },
    async canCompleteMonkeyMadnessI(ctx) {
        return false; // TODO
    },
    async canCompletePryingTimes(ctx) {
        return false; // TODO
    },
    async canReachLunarIsle(ctx) {
        return false; // TODO
    },
    async canCompleteWitchsHouse(ctx) {
        return false; // TODO
    },
    async canDoMahoganyHomes(ctx) {
        return false; // TODO
    },
    async canCompleteOneSmallFavour(ctx) {
        return false; // TODO
    },
    async canCompletePriestInPeril(ctx) {
        return await canCompletePriestInPeril(ctx);
    },
    async canCompleteZogreFleshEaters(ctx) {
        return await canCompleteZogreFleshEaters(ctx);
    },
    async canStartZogreFleshEaters(ctx) {
        return await canCompleteZogreFleshEaters(ctx); // TODO start different from complete?
    },
    async canEnterKaruulmSlayerDungeon(ctx) {
        return await canEnterKaruulmSlayerDungeon(ctx);
    },
    async hasSardine(ctx) {
        return await has(ctx, 327);
    },
    async hasRedSpidersEggs(ctx) {
        return await has(ctx, 223);
    },
    async hasMoleParts(ctx) {
        return await has(ctx, 7418) || await has(ctx, 7416);
    },
    async hasSinisterKey(ctx) {
        return await has(ctx, 993);
    },
    async hasEyeOfNewt(ctx) {
        return await has(ctx, 221);
    },
    async hasOpal(ctx) {
        return await has(ctx, 1625) || await has(ctx, 1609);
    },
    async hasFeather(ctx) {
        return await has(ctx, 314);
    },
    async hasFacemask(ctx) {
        return await has(ctx, 4164);
    },
    async hasUnlitBugLantern(ctx) {
        return await has(ctx, 7051);
    },
    async hasBagOfSalt(ctx) {
        return await has(ctx, 4161);
    },
    async hasBrineSabre(ctx) {
        return await has(ctx, 11037);
    },
    async canKillGargoyles(ctx) {
        return await canKillGargoyles(ctx);
    },
    async canKillDifficultDragons(ctx) {
        return await canKillDifficultDragons(ctx);
    },
    async canKillFossilIslandWyverns(ctx) {
        return await canKillFossilIslandWyverns(ctx);
    },
    async hasAccessToWyvernProtection(ctx) {
        return await hasAccessToWyvernProtection(ctx);
    },
    async canTrainFletching(ctx) {
        return await canTrainFletching(ctx);
    },
    async canTrainSmithing(ctx) {
        return await canTrainSmithing(ctx);
    },
    async canCompleteDwarfCannon(ctx) {
        return await canCompleteDwarfCannon(ctx);
    },
    async canCompleteTroubledTortugans(ctx) {
        return await canCompleteTroubledTortugans(ctx);
    },
    async canLongrange(ctx) {
        return await canLongrange(ctx);
    },
    async canCastStrikeSpells(ctx) {
        return await canCastStrikeSpells(ctx);
    },
    async canShortrange(ctx) {
        return await canShortrange(ctx);
    },
    async canSailToTheNorthernOcean(ctx) {
        return await canSailToTheNorthernOcean(ctx);
    },
    async canDoSailingCombat(ctx) {
        return await canDoSailingCombat(ctx);
    },
    async canEnterTheCharredDungeon(ctx) {
        return await canEnterTheCharredDungeon(ctx);
    },
    async canSailToBrittleIsle(ctx) {
        return await canSailToBrittleIsle(ctx);
    },
    async canSailToYnysdail(ctx) {
        return await canSailToYnysdail(ctx);
    },
    async canSailToGrimstone(ctx) {
        return await canSailToGrimstone(ctx);
    },
    async canEnterAncientCavern(ctx) {
        return await canEnterAncientCavern(ctx);
    },
    async canEnterKalphiteLair(ctx) {
        return await canEnterKalphiteLair(ctx);
    },
    async canCompleteRoyalTrouble(ctx) {
        return await canCompleteRoyalTrouble(ctx);
    },
    async canCompleteTouristTrap(ctx) {
        return await canCompleteTouristTrap(ctx);
    },
    async canCompletePandemonium(ctx) {
        return await canCompletePandemonium(ctx);
    },
    async canCompleteEnchantedKey(ctx) {
        return await canCompleteMakingHistory(ctx);
    },
    async canStartLegendsQuest(ctx) {
        return false; // TODO
    },
    async canReachKharaziJungle(ctx) {
        return false; // TODO
    },
    async canStartQueenOfThieves(ctx) {
        return false; // TODO
    },
    async canCompleteThePathOfGlouphrie(ctx) {
        return false; // TODO
    },
    async canCompleteSeaSlug(ctx) {
        return false; // TODO
    },
    async canCompleteDaddysHome(ctx) {
        return false; // TODO
    },
    async canCompleteSkippyAndTheMogres(ctx) {
        return false; // TODO
    },
    async canCompleteLegendsQuest(ctx) {
        return false; // TODO
    },
    async canDoYama(ctx) {
        return false; // TODO
    },
    async canDoNex(ctx) {
        return await canCompleteTheFrozenDoor(ctx) && false; // TODO
    },
    async canCompleteTheFrozenDoor(ctx) {
        return await canCompleteTheFrozenDoor(ctx);
    },
    async canDoZulrah(ctx) {
        return false; // TODO
    },
    async canCompleteAtFirstLight(ctx) {
        return false; // TODO
    },
    async canCompleteColdWar(ctx) {
        return false; // TODO
    },
    async canDoHuntersRumours(ctx) {
        return await canTrainHunter(ctx);
    },
    async canTrainHunter(ctx) {
        return await canTrainHunter(ctx);
    },
    async canCompleteTheDigSite(ctx) {
        return await canCompleteTheDigSite(ctx);
    },
    async canCompleteAnimalMagnetism(ctx) {
        return await canCompleteAnimalMagnetism(ctx);
    },
    async canCompleteDeathToTheDorgeshuun(ctx) {
        return await canCompleteDeathToTheDorgeshuun(ctx);
    },
    async canCompleteTheLostTribe(ctx) {
        return await canCompleteTheLostTribe(ctx);
    },
    async canCompletePerilousMoons(ctx) {
        return await canCompletePerilousMoons(ctx);
    },
    async canCompletePiratesTreasure(ctx) {
        return await canCompletePiratesTreasure(ctx);
    },
    async canFishFromRewardPool(ctx) {
        return await canFishFromRewardPool(ctx);
    },
    async canReachGemRocks(ctx) {
        return await canReachGemRocks(ctx);
    },
    async hasRawSwordfish(ctx) {
        return await has(ctx, 371);
    },
    async hasRawChicken(ctx) {
        return await has(ctx, 2138);
    },
    async hasCowhide(ctx) {
        return await has(ctx, 1739);
    },
    async hasUnicornHorn(ctx) {
        return await has(ctx, 237);
    },
    async hasGiantFrogLegs(ctx) {
        return await has(ctx, 4517);
    },
    async hasRawCaveEel(ctx) {
        return await has(ctx, 5001);
    },
    async hasRawJubbly(ctx) {
        return await has(ctx, 7566);
    },
    async hasRawLobster(ctx) {
        return await has(ctx, 377);
    },
    async hasBirdhouse(ctx) {
        return await has(ctx, 21512);
    },
    async hasMagicBirdhouse(ctx) {
        return await has(ctx, 22201);
    },
    async hasMahoganyBirdhouse(ctx) {
        return await has(ctx, 22195);
    },
    async hasMapleBirdhouse(ctx) {
        return await has(ctx, 22192);
    },
    async hasOakBirdhouse(ctx) {
        return await has(ctx, 21515);
    },
    async hasRedwoodBirdhouse(ctx) {
        return await has(ctx, 22204);
    },
    async hasTeakBirdhouse(ctx) {
        return await has(ctx, 21521);
    },
    async hasWillowBirdhouse(ctx) {
        return await has(ctx, 21518);
    },
    async hasYewBirdhouse(ctx) {
        return await has(ctx, 22198);
    },
    async hasSteelArrow(ctx) {
        return await has(ctx, 886);
    },
    async hasMithrilArrow(ctx) {
        return await has(ctx, 888);
    },
    async hasSecateurs(ctx) {
        return await has(ctx, 5329);
    },
    async hasGardeningTrowel(ctx) {
        return await has(ctx, 5325);
    },
    async hasSaltpetre(ctx) {
        return await has(ctx, 13421);
    },
    async hasMuddyKey(ctx) {
        return await has(ctx, 991);
    },
    async canCompleteHauntedMine(ctx) {
        return await canCompleteHauntedMine(ctx);
    },
    async hasGrubbyKey(ctx) {
        return await has(ctx, 23499);
    },
    async hasLockpick(ctx) {
        return await has(ctx, 1523);
    },
    async hasSmallFishingNet(ctx) {
        return await has(ctx, 303);
    },
    async hasBigFishingNet(ctx) {
        return await has(ctx, 305);
    },
    async hasHarpoon(ctx) {
        return await has(ctx, 311) || await has(ctx, 10129) || await has(ctx, 21028);
    },
    async hasAnyLantern(ctx) {
        return await hasAnyLantern(ctx);
    },
    async hasFishingRod(ctx) {
        return await has(ctx, 307);
    },
    async hasFishingBait(ctx) {
        return await has(ctx, 313);
    },
    async hasSandworms(ctx) {
        return await has(ctx, 13431);
    },
    async hasLobsterPot(ctx) {
        return await has(ctx, 301);
    },
    async hasFlyFishingRod(ctx) {
        return await has(ctx, 309);
    },
    async hasAnyFeather(ctx) {
        return await hasAnyFeather(ctx);
    },
    async hasStripyFeather(ctx) {
        return await has(ctx, 10087);
    },
    async hasDarkFishingBait(ctx) {
        return await has(ctx, 11940);
    },
    async hasKarambwanVesselBaited(ctx) {
        return await has(ctx, 3159);
    },
    async canAerialFish(ctx) {
        return await has(ctx, 11334) || await has(ctx, 2162);
    },
    async canBarbarianFish(ctx) {
        return await hasAnyFeather(ctx) || await has(ctx, 313) || await has(ctx, 11324) || await has(ctx, 11326);
    },
    async canReachFrogSpawnSpot(ctx) {
        return await this.canCompleteBelowIceMountain(ctx) || await this.canEnterLumbridgeSwampCaves(ctx);
    },
    async hasOgreCoffinKey(ctx) {
        return await has(ctx, 4850);
    },
    async hasZombiePirateKey(ctx) {
        return await has(ctx, 29449);
    },
    async hasMirrorShield(ctx) {
        return await has(ctx, 4156);
    },
    async hasSpinyHelmet(ctx) {
        return await has(ctx, 4551);
    },
    async hasNosePeg(ctx) {
        return await has(ctx, 4168);
    },
    async hasSlayerBell(ctx) {
        return await has(ctx, 10952);
    },
    async hasEarmuffs(ctx) {
        return await has(ctx, 4166);
    },
    async hasCrystalKey(ctx) {
        return await has(ctx, 989);
    },
    async hasMachete(ctx) {
        return await has(ctx, 975) || await has(ctx, 6313) || await has(ctx, 6315) || await has(ctx, 6317);
    },
    async hasSpade(ctx) {
        return await has(ctx, 952);
    },
    async hasBucket(ctx) {
        return await has(ctx, 1925);
    },
    async hasAvantoeSeed(ctx) {
        return await has(ctx, 5298);
    },
    async hasCadantineSeed(ctx) {
        return await has(ctx, 5301);
    },
    async hasDwarfWeedSeed(ctx) {
        return await has(ctx, 5303);
    },
    async hasGuamSeed(ctx) {
        return await has(ctx, 5291);
    },
    async hasHarralanderSeed(ctx) {
        return await has(ctx, 5294);
    },
    async hasHuascaSeed(ctx) {
        return await has(ctx, 30088);
    },
    async hasIritSeed(ctx) {
        return await has(ctx, 5297);
    },
    async hasKwuarmSeed(ctx) {
        return await has(ctx, 5299);
    },
    async hasLantadymeSeed(ctx) {
        return await has(ctx, 5302);
    },
    async hasMarrentillSeed(ctx) {
        return await has(ctx, 5292);
    },
    async hasRanarrSeed(ctx) {
        return await has(ctx, 5295);
    },
    async hasSnapdragonSeed(ctx) {
        return await has(ctx, 5300);
    },
    async hasTarrominSeed(ctx) {
        return await has(ctx, 5293);
    },
    async hasToadflaxSeed(ctx) {
        return await has(ctx, 5296);
    },
    async hasTorstolSeed(ctx) {
        return await has(ctx, 5304);
    },
    async hasAvantoe(ctx) {
        return await has(ctx, 261);
    },
    async hasCadantine(ctx) {
        return await has(ctx, 265);
    },
    async hasDwarfWeed(ctx) {
        return await has(ctx, 267);
    },
    async hasGuam(ctx) {
        return await has(ctx, 249);
    },
    async hasHarralander(ctx) {
        return await has(ctx, 255);
    },
    async hasHuasca(ctx) {
        return await has(ctx, 30097);
    },
    async hasIrit(ctx) {
        return await has(ctx, 259);
    },
    async hasKwuarm(ctx) {
        return await has(ctx, 263);
    },
    async hasLantadyme(ctx) {
        return await has(ctx, 2481);
    },
    async hasMarrentill(ctx) {
        return await has(ctx, 251);
    },
    async hasRanarr(ctx) {
        return await has(ctx, 257);
    },
    async hasSnapdragon(ctx) {
        return await has(ctx, 3000);
    },
    async hasTarromin(ctx) {
        return await has(ctx, 253);
    },
    async hasToadflax(ctx) {
        return await has(ctx, 2998);
    },
    async hasTorstol(ctx) {
        return await has(ctx, 269);
    },
    async hasWillowSapling(ctx) {
        return await has(ctx, 5371);
    },
    async hasOakSapling(ctx) {
        return await has(ctx, 5370);
    },
    async hasYewSapling(ctx) {
        return await has(ctx, 5373);
    },
    async hasMapleSapling(ctx) {
        return await has(ctx, 5372);
    },
    async hasMagicSapling(ctx) {
        return await has(ctx, 5374);
    },
    async hasRedwoodSapling(ctx) {
        return await has(ctx, 22859);
    },
    async hasTeakSapling(ctx) {
        return await has(ctx, 21477);
    },
    async hasMahoganySapling(ctx) {
        return await has(ctx, 21480);
    },
    async hasCamphorSapling(ctx) {
        return await has(ctx, 31502);
    },
    async hasIronwoodSapling(ctx) {
        return await has(ctx, 31505);
    },
    async hasRosewoodSapling(ctx) {
        return await has(ctx, 31508);
    },
    async hasBananaSapling(ctx) {
        return await has(ctx, 5497);
    },
    async hasAppleSapling(ctx) {
        return await has(ctx, 5496);
    },
    async hasCurrySapling(ctx) {
        return await has(ctx, 5499);
    },
    async hasOrangeSapling(ctx) {
        return await has(ctx, 5498);
    },
    async hasPalmSapling(ctx) {
        return await has(ctx, 5502);
    },
    async hasPapayaSapling(ctx) {
        return await has(ctx, 5501);
    },
    async hasPineappleSapling(ctx) {
        return await has(ctx, 5500);
    },
    async hasDragonfruitSapling(ctx) {
        return await has(ctx, 22866);
    },
    async hasMarigoldSeed(ctx) {
        return await has(ctx, 5096);
    },
    async hasNasturtiumSeed(ctx) {
        return await has(ctx, 5098);
    },
    async hasRosemarySeed(ctx) {
        return await has(ctx, 5097);
    },
    async hasWoadSeed(ctx) {
        return await has(ctx, 5099);
    },
    async hasLimpwurtSeed(ctx) {
        return await has(ctx, 5100);
    },
    async hasPotatoSeed(ctx) {
        return await has(ctx, 5318);
    },
    async hasOnionSeed(ctx) {
        return await has(ctx, 5319);
    },
    async hasCabbageSeed(ctx) {
        return await has(ctx, 5324);
    },
    async hasTomatoSeed(ctx) {
        return await has(ctx, 5322);
    },
    async hasSweetcornSeed(ctx) {
        return await has(ctx, 5320);
    },
    async hasStrawberrySeed(ctx) {
        return await has(ctx, 5323);
    },
    async hasWatermelonSeed(ctx) {
        return await has(ctx, 5321);
    },
    async hasSnapeGrassSeed(ctx) {
        return await has(ctx, 22879);
    },
    async hasBarleySeed(ctx) {
        return await has(ctx, 5305);
    },
    async hasJuteSeed(ctx) {
        return await has(ctx, 5306);
    },
    async hasHammerstoneSeed(ctx) {
        return await has(ctx, 5307);
    },
    async hasAsgarnianSeed(ctx) {
        return await has(ctx, 5308);
    },
    async hasYanillianSeed(ctx) {
        return await has(ctx, 5309);
    },
    async hasKrandorianSeed(ctx) {
        return await has(ctx, 5310);
    },
    async hasWildbloodSeed(ctx) {
        return await has(ctx, 5311);
    },
    async hasRedberrySeed(ctx) {
        return await has(ctx, 5101);
    },
    async hasCadavaberrySeed(ctx) {
        return await has(ctx, 5102);
    },
    async hasDwellberrySeed(ctx) {
        return await has(ctx, 5103);
    },
    async hasJangerberrySeed(ctx) {
        return await has(ctx, 5104);
    },
    async hasWhiteberrySeed(ctx) {
        return await has(ctx, 5105);
    },
    async hasPoisonIvySeed(ctx) {
        return await has(ctx, 5106);
    },
    async hasMushroomSpore(ctx) {
        return await has(ctx, 5282);
    },
    async hasSeaweedSpore(ctx) {
        return await has(ctx, 21490);
    },
    async hasCactusSeed(ctx) {
        return await has(ctx, 5280);
    },
    async hasPotatoCactusSeed(ctx) {
        return await has(ctx, 22873);
    },
    async hasCalquatSapling(ctx) {
        return await has(ctx, 5503);
    },
    async hasWhiteLilySeed(ctx) {
        return await has(ctx, 22887);
    },
    async hasCottonSeed(ctx) {
        return await has(ctx, 31545);
    },
    async hasHempSeed(ctx) {
        return await has(ctx, 31543);
    },
    async hasElkhornFrag(ctx) {
        return await has(ctx, 31511);
    },
    async hasPillarFrag(ctx) {
        return await has(ctx, 31513);
    },
    async hasUmbralFrag(ctx) {
        return await has(ctx, 31515);
    },
    async hasCupOfTea(ctx) {
        return await hasCupOfTea(ctx);
    },
    async hasSlashWeapon(ctx) {
        return true; // TODO
    },
    async hasDriftNet(ctx) {
        return await has(ctx, 21652);
    },
    async hasNumulite(ctx) {
        return await has(ctx, 21555);
    },
    async hasHammer(ctx) {
        return await has(ctx, 2347);
    },
    async hasOyster(ctx) {
        return await has(ctx, 407);
    },
    async hasRope(ctx) {
        return await has(ctx, 954);
    },
    async hasCasket(ctx) {
        return await has(ctx, 405);
    },
    async hasPoison(ctx) {
        return await has(ctx, 273);
    },
    async hasAnyGuthixBalance(ctx) {
        return await hasAnyGuthixBalance(ctx);
    },
    async hasAnySerum207(ctx) {
        return await hasAnySerum207(ctx);
    },
    async canPlantTrees(ctx) {
        return await canPlantTrees(ctx);
    },
    async canPlantHardwoodTrees(ctx) {
        return await canPlantHardwoodTrees(ctx);
    },
    async canPlantPlants(ctx) {
        return await canPlantPlants(ctx);
    },
    async hasHunterMeat(ctx) {
        return await hasHunterMeat(ctx);
    },
    async hasAirRuneSource(ctx) {
        return await hasAirRuneSource(ctx);
    },
    async hasWaterRuneSource(ctx) {
        return await hasWaterRuneSource(ctx);
    },
    async hasEarthRuneSource(ctx) {
        return await hasEarthRuneSource(ctx);
    },
    async hasFireRuneSource(ctx) {
        return await hasFireRuneSource(ctx);
    },
    async canEnterGodWarsDungeon(ctx) {
        return false; // TODO
    },
    async canDoCommanderZilyana(ctx) {
        return await canDoCommanderZilyana(ctx);
    },
    async canDoGeneralGraardor(ctx) {
        return await canDoGeneralGraardor(ctx);
    },
    async canDoKreearra(ctx) {
        return await canDoKreearra(ctx);
    },
    async canDoKrilTsutsaroth(ctx) {
        return await canDoKrilTsutsaroth(ctx);
    },
    async canDoNex(ctx) {
        return await canDoNex(ctx);
    },
    async canCompleteBarbarianHerblore(ctx) {
        return await canCompleteBarbarianHerblore(ctx);
    },
    async canCompleteBarbarianSmithing(ctx) {
        return await canCompleteBarbarianSmithing(ctx);
    },
    async canTrainHerblore(ctx) {
        return await canTrainHerblore(ctx);
    },
    async canTrainPrayer(ctx) {
        return await canTrainPrayer(ctx);
    },
    async canTrainCrafting(ctx) {
        return await canTrainCrafting(ctx);
    },
    async canTrainFiremaking(ctx) {
        return await canTrainCrafting(ctx);
    },
    async canBurnLoarShades(ctx) {
        return await canBurnLoarShades(ctx);
    },
    async canBurnPhrinShades(ctx) {
        return await canBurnPhrinShades(ctx);
    },
    async canBurnRiylShades(ctx) {
        return await canBurnRiylShades(ctx);
    },
    async canBurnAsynShades(ctx) {
        return await canBurnAsynShades(ctx);
    },
    async canBurnFiyrShades(ctx) {
        return await canBurnFiyrShades(ctx);
    },
    async canBurnUriumShades(ctx) {
        return await canBurnUriumShades(ctx);
    },
    async never(ctx) {
        return false;
    }
};

async function canDoTombsOfAmascut(ctx) {
    return await canCompleteBeneathCursedSands(ctx) //
        && await canTrainMining(ctx);
}

async function canCompleteBeneathCursedSands(ctx) {
    return await canCompleteContact(ctx) //
        && await canTrainCrafting(ctx)   //
        && await canTrainFiremaking(ctx) //
        && await has(ctx, 453)  // Coal
        && await has(ctx, 2351) // Iron bar
        && await has(ctx, 590)  // Tinderbox
        && await has(ctx, 952)  // Spade
        && (
            await has(ctx, 2136)     // Raw bear meat
            || await has(ctx, 2134)  // Raw rat meat
            || await has(ctx, 2132)  // Raw beef
            || await has(ctx, 2138)  // Raw chicken
            || await has(ctx, 3226)  // Raw rabbit
            || await has(ctx, 25833) // Raw boar meat
            || await has(ctx, 1859)  // Raw ugthanki meat
            || await has(ctx, 9978)  // Raw bird meat
        );
}

async function hasAnyFeather(ctx) {
    return await has(ctx, 314); // TODO andere feathers
}

async function hasAnyLantern(ctx) {
    return (await canTrainFiremaking(ctx) //
        && (await canDoGuardiansOfTheRift(ctx) //
            || await has(ctx, 4548) // Bullseye lantern
            || await has(ctx, 4532) // Candle lantern (black)
            || await has(ctx, 4529) // Candle lantern (white)
            || await has(ctx, 7051) // Unlit bug lantern
            || await has(ctx, 4537) // Oil lantern
            || await canCompleteDesertTreasureII(ctx) //
        ));
}

async function canCompleteContact(ctx) {
    return await canCompletePrinceAliRescue(ctx) //
        && await canCompleteIcthlarinsLittleHelper(ctx); //
}

async function canCompletePrinceAliRescue(ctx) {
    return await has(ctx, 1761) // Soft clay
        && await has(ctx, 1759) // Ball of wool
        && await has(ctx, 1765) // Yellow dye
        && await has(ctx, 1951) // Redberries
        && await has(ctx, 592)  // Ashes
        && (await has(ctx, 1929) || await has(ctx, 1937) || await has(ctx, 1921)) // Bucket of water or Jug of water or Bowl of water
        && await has(ctx, 1933) // Pot of flour
        && await has(ctx, 2349) // Bronze bar
        && await has(ctx, 1013) // Pink skirt
        && await has(ctx, 1917) // Beer
        && await has(ctx, 954); //  Rope
}

async function canCompleteHauntedMine(ctx) {
    return await canCompletePriestInPeril(ctx) //
        && await canTrainCrafting(ctx) //
        && await has(ctx, 1755); // Chisel
}

async function canCompleteShadesOfMortton(ctx) {
    return await canCompletePriestInPeril(ctx) //
        && await canTrainCrafting(ctx) //
        && await canTrainHerblore(ctx) //
        && await canTrainFiremaking(ctx) //
        && await has(ctx, 3410)  // Serum 207 (3)
        && await has(ctx, 95)    // Tarromin potion (unf) (might not be needed?)
        && await has(ctx, 592)   // Ashes (might not be needed?)
        && await has(ctx, 590)   // Tinderbox (might not be needed?)
        && await has(ctx, 1511)  // Logs (might not be needed?)
        && (await has(ctx, 2347) || await has(ctx, 3678)) // Hammer of Flamtaer hammer
        && (
            await has(ctx, 3438)     // Pyre logs
            || await has(ctx, 3440)  // Oak pyre logs
            || await has(ctx, 3442)  // Willow pyre logs
            || await has(ctx, 6211)  // Teak pyre logs
            || await has(ctx, 10808) // Arctic pyre logs
            || await has(ctx, 3444)  // Maple pyre logs
            || await has(ctx, 6213)  // Mahogany pyre logs
            || await has(ctx, 31383) // Camphor pyre logs
            || await has(ctx, 3446)  // Yew pyre logs
            || await has(ctx, 3448)  // Magic pyre logs
            || await has(ctx, 31386) // Ironwood pyre logs
            || await has(ctx, 19672) // Redwood pyre logs
            || await has(ctx, 31389) // Rosewood pyre logs
        )
        && await has(ctx, 3396); // Loar remains

}

async function canBurnLoarShades(ctx) {
    return await canCompleteShadesOfMortton(ctx);
}

async function canBurnPhrinShades(ctx) { //TODO shades from temple tracking
    return await canBurnLoarShades(ctx) //
        && await has(ctx, 3398); // Phrin remains
}

async function canBurnRiylShades(ctx) {
    return await canBurnPhrinShades(ctx) //
        && await has(ctx, 3400) // Riyl remains
        && (
            await has(ctx, 3442)     // Willow pyre logs
            || await has(ctx, 6211)  // Teak pyre logs
            || await has(ctx, 10808) // Arctic pyre logs
            || await has(ctx, 3444)  // Maple pyre logs
            || await has(ctx, 6213)  // Mahogany pyre logs
            || await has(ctx, 31383) // Camphor pyre logs
            || await has(ctx, 3446)  // Yew pyre logs
            || await has(ctx, 3448)  // Magic pyre logs
            || await has(ctx, 31386) // Ironwood pyre logs
            || await has(ctx, 19672) // Redwood pyre logs
            || await has(ctx, 31389) // Rosewood pyre logs
        );
}

async function canBurnAsynShades(ctx) {
    return await canBurnRiylShades(ctx) //
        && await has(ctx, 3402) // Asyn remains
        && (
            await has(ctx, 31383)    // Camphor pyre logs
            || await has(ctx, 3446)  // Yew pyre logs
            || await has(ctx, 3448)  // Magic pyre logs
            || await has(ctx, 31386) // Ironwood pyre logs
            || await has(ctx, 19672) // Redwood pyre logs
            || await has(ctx, 31389) // Rosewood pyre logs
        );
}

async function canBurnFiyrShades(ctx) {
    return await canBurnAsynShades(ctx) //
        && await has(ctx, 3404) // Fiyr remains
        && (
            await has(ctx, 3448)     // Magic pyre logs
            || await has(ctx, 31386) // Ironwood pyre logs
            || await has(ctx, 19672) // Redwood pyre logs
            || await has(ctx, 31389) // Rosewood pyre logs
        );
}

async function canBurnUriumShades(ctx) {
    return await canBurnFiyrShades(ctx) //
        && await has(ctx, 25419) // Urium remains
        && (
            await has(ctx, 19672) // Redwood pyre logs
            || await has(ctx, 31389) // Rosewood pyre logs
        );
}

async function hasCupOfTea(ctx) {
    return await has(ctx, 1978) // Cup of tea
        || (await has(ctx, 1980) && await has(ctx, 1921)) // Empty cup and Bowl of water
}

async function hasAnyGuthixBalance(ctx) {
    return await has(ctx, 7660) // Guthix balance(4)
        || await has(ctx, 7662) // Guthix balance(3)
        || await has(ctx, 7664) // Guthix balance(2)
        || await has(ctx, 7666) // Guthix balance(1)
}

async function hasAnySerum207(ctx) {
    return await has(ctx, 3408) // Serum 207(4)
        || await has(ctx, 3410) // Serum 207(3)
        || await has(ctx, 3412) // Serum 207(2)
        || await has(ctx, 3414) // Serum 207(1)
}

async function hasAirRuneSource(ctx) {
    return await has(ctx, 556) // Air rune
        || await has(ctx, 4696) // Dust rune
        || await has(ctx, 4697) // Smoke rune
        || await has(ctx, 4695) // Mist rune
        || await has(ctx, 1381) // Staff of air
        || await has(ctx, 1397) // Air battlestaff
        || await has(ctx, 1405) // Mystic air staff
        || await has(ctx, 20736) // Dust battlestaff
        || await has(ctx, 20739) // Mystic dust staff
        || await has(ctx, 11998) // Smoke battlestaff
        || await has(ctx, 12000) // Mystic smoke staff
        || await has(ctx, 20730) // Mist battlestaff
        || await has(ctx, 20733); // Mystic mist staff
}

async function hasWaterRuneSource(ctx) {
    return await has(ctx, 555) // Water rune
        || await has(ctx, 4698) // Mud rune
        || await has(ctx, 4694) // Steam rune
        || await has(ctx, 4695) // Mist rune
        || await has(ctx, 1383) // Staff of water
        || await has(ctx, 1395) // Water battlestaff
        || await has(ctx, 1403) // Mystic water staff
        || await has(ctx, 6562) // Mud battlestaff
        || await has(ctx, 6563) // Mystic mud staff
        || await has(ctx, 11787) // Steam battlestaff
        || await has(ctx, 11789) // Mystic steam staff
        || await has(ctx, 20730) // Mist battlestaff
        || await has(ctx, 20733) // Mystic mist staff
        || (await has(ctx, 25576) && await has(ctx, 25578)); // Tome of water and Soaked page
}

async function hasEarthRuneSource(ctx) {
    return await has(ctx, 557) // Earth rune
        || await has(ctx, 4696) // Dust rune
        || await has(ctx, 4698) // Mud rune
        || await has(ctx, 4699) // Lava rune
        || await has(ctx, 1385) // Staff of earth
        || await has(ctx, 1399) // Earth battlestaff
        || await has(ctx, 1407) // Mystic earth staff
        || await has(ctx, 20736) // Dust battlestaff
        || await has(ctx, 20739) // Mystic dust staff
        || await has(ctx, 6562) // Mud battlestaff
        || await has(ctx, 6563) // Mystic mud staff
        || await has(ctx, 3053) // Lava battlestaff
        || await has(ctx, 3054) // Mystic lava staff
        || (await has(ctx, 30066) && await has(ctx, 30068)); // Tome of earth and Soiled page
}

async function hasFireRuneSource(ctx) {
    return await has(ctx, 554) // Fire rune
        || await has(ctx, 4699) // Lava rune
        || await has(ctx, 4697) // Smoke rune
        || await has(ctx, 4694) // Steam rune
        || await has(ctx, 28929) // Sunfire rune
        || await has(ctx, 1387) // Staff of fire
        || await has(ctx, 1393) // Fire battlestaff
        || await has(ctx, 1401) // Mystic fire staff
        || await has(ctx, 3053) // Lava battlestaff
        || await has(ctx, 3054) // Mystic lava staff
        || await has(ctx, 11998) // Smoke battlestaff
        || await has(ctx, 12000) // Mystic smoke staff
        || await has(ctx, 11787) // Steam battlestaff
        || await has(ctx, 11789) // Mystic steam staff
        || (await has(ctx, 20716) && await has(ctx, 20718)); // Tome of fire and Burnt page
}

async function canReachTrollheim(ctx) {
    return await canCompleteDeathPlateau(ctx); // TODO achievement diaries
}

async function hasHunterMeat(ctx) {
    return await has(ctx, 29104)
        || await has(ctx, 29122)
        || await has(ctx, 29101)
        || await has(ctx, 29119)
        || await has(ctx, 29125)
        || await has(ctx, 29110)
        || await has(ctx, 29116)
        || await has(ctx, 29107)
        || await has(ctx, 29113)
}

async function canGetBirdNestWyson(ctx) {
    return await has(ctx, 7418)  // Mole skin
        && await has(ctx, 7416); // Mole claw
}

async function canDoCommanderZilyana(ctx) {
    return false; // TODO
}

async function canDoGeneralGraardor(ctx) {
    return false; // TODO
}

async function canDoKreearra(ctx) {
    return false; // TODO
}

async function canDoKrilTsutsaroth(ctx) {
    return false; // TODO
}

async function canDoNex(ctx) {
    return false; // TODO
}

async function canBirdSnare(ctx) {
    return await canTrainHunter(ctx) //
        && await has(ctx, 10006); // Bird snare
}

async function canNooseWand(ctx) {
    return await canTrainHunter(ctx) //
        && await has(ctx, 10150); // Bird snare
}

async function canCatchImplingsInJars(ctx) {
    return await canTrainHunter(ctx) //
        && await has(ctx, 10010)  // Butterfly net
        && await has(ctx, 11260); // Impling jar
}

async function canDeadfallTrap(ctx) {
    return await canTrainHunter(ctx) //
        && await has(ctx, 946) // Knife
        && (
            await has(ctx, 1511)     // logs
            || await has(ctx, 1521)  // Oak logs
            || await has(ctx, 1519)  // Willow logs
            || await has(ctx, 6333)  // Teak logs
            || await has(ctx, 1517)  // Maple logs
            || await has(ctx, 6332)  // Mahogany logs
            || await has(ctx, 32904) // Camphor logs
            || await has(ctx, 1515)  // Yew logs
            || await has(ctx, 1513)  // Magic logs
            || await has(ctx, 32907) // Ironwood logs
            || await has(ctx, 32910) // Rosewood logs
            || await canTrainWoodcutting(ctx) // for untradable Juniper logs
        );
}

async function canPitfallTrap(ctx) {
    return await canTrainHunter(ctx) //
        && await has(ctx, 946) // Knife
        && (await has(ctx, 10029) || await has(ctx, 29305)) // Teasing stick of Hunter's spear
        && (
            await has(ctx, 1511)     // logs
            || await has(ctx, 1521)  // Oak logs
            || await has(ctx, 1519)  // Willow logs
            || await has(ctx, 6333)  // Teak logs
            || await has(ctx, 1517)  // Maple logs
            || await has(ctx, 6332)  // Mahogany logs
            || await has(ctx, 32904) // Camphor logs
            || await has(ctx, 1515)  // Yew logs
            || await has(ctx, 1513)  // Magic logs
            || await has(ctx, 32907) // Ironwood logs
            || await has(ctx, 32910) // Rosewood logs
            || await canTrainWoodcutting(ctx) // for untradable Juniper logs
        );
}

async function canCatchSalamanders(ctx) {
    return await canTrainHunter(ctx) //
        && await has(ctx, 954) // Rope
        && await has(ctx, 303); // Small fishing net
}

async function canCatchCrabs(ctx) {
    return await canTrainConstruction(ctx) //
        && await canTrainHunter(ctx) //
        && await has(ctx, 2347)      // Hammer
        && await has(ctx, 8794)      // Saw
        && await has(ctx, 1925)      // Bucket
        && await has(ctx, 960)       // Plank
        && await hasAnyNails(ctx);
}

async function canCatchButterflies(ctx) {
    return await canTrainHunter(ctx) //
        && await has(ctx, 10010)     // Butterfly net
        && await has(ctx, 10012);    // Butterfly jar
}

async function hasAnyNails(ctx) {
    return await has(ctx, 4819)      // Bronze nails
        || await has(ctx, 4820)  // Iron nails
        || await has(ctx, 1539)  // Steel nails
        || await has(ctx, 4821)  // Black nails
        || await has(ctx, 4822)  // Mithril nails
        || await has(ctx, 4823)  // Adamantite nails
        || await has(ctx, 4824)  // Rune nails
        || await has(ctx, 31406);// Dragon nails
}

async function canEnterKalphiteLair(ctx) {
    return await has(ctx, 954); // Rope
}

async function canEnterAncientCavern(ctx) {
    return await canCompleteBarbarianFiremaking(ctx);
}

async function canCompleteBarbarianFiremaking(ctx) {
    return await has(ctx, 1521) // Oak logs
        && ( //
            await has(ctx, 841) // Shortbow
            || await has(ctx, 839) // Longbow
            || await has(ctx, 843) // Oak shortbow
            || await has(ctx, 845) // Oak longbow
            || await has(ctx, 849) // Willow shortbow
            || await has(ctx, 847) // Willow longbow
            || await has(ctx, 853) // Maple shortbow
            || await has(ctx, 851) // Maple longbow
            || await has(ctx, 857) // Yew shortbow
            || await has(ctx, 855) // Yew longbow
            || await has(ctx, 861) // Magic shortbow
            || await has(ctx, 859) // Magic longbow
        );
}

async function canCompleteBarbarianFishing(ctx) {
    return await canTrainFishing(ctx);
}

async function canCompleteBarbarianHerblore(ctx) {
    return await canCompleteDruidicRitual(ctx) //
        && await canCompleteBarbarianFiremaking(ctx) //
        && await canCompleteBarbarianFishing(ctx) //
        && await has(ctx, 123) // Attack potion(2)
        && (await has(ctx, 11324) || await has(ctx, 11326)); // Roe or Caviar
}

async function canCompleteBarbarianSmithing(ctx) {
    return await canCompleteBarbarianFishing(ctx) //
        && await canCompleteTaiBwoWannaiTrio(ctx) //
        && await canTrainSmithing(ctx) //
        && ( //
            (await has(ctx, 2349) && await has(ctx, 1511)) // Bronze bar & Logs
            || (await has(ctx, 2351) && await has(ctx, 1521)) // Iron bar & Oak Logs
            || (await has(ctx, 2353) && await has(ctx, 1519)) // Steel bar & Willow Logs
            || (await has(ctx, 2359) && await has(ctx, 1517)) // Mithril bar & Maple Logs
            || (await has(ctx, 2361) && await has(ctx, 1515)) // Adamantite bar & Yew Logs
            || (await has(ctx, 2363) && await has(ctx, 1513)) // Runite bar & Magic Logs
        )
}

async function canCompleteTaiBwoWannaiTrio(ctx) {
    return false; // TODO
}

async function canCompleteTheFrozenDoor(ctx) {
    return await canDoKreearra(ctx) //
        && await canDoGeneralGraardor(ctx) //
        && await canDoCommanderZilyana(ctx) //
        && await canDoKrilTsutsaroth(ctx);
}

async function canCompleteMakingHistory(ctx) {
    return await canCompletePriestInPeril(ctx)
        && await has(ctx, 1694) //Sapphire amulet
        && await has(ctx, 952); // Spade
}

async function canSailToTheNorthernOcean(ctx) {
    return await canCompletePandemonium(ctx) //
        && false; // TODO sailing stuff
}

async function canSailToTheWesternOcean(ctx) {
    return await canCompletePandemonium(ctx) //
        && false; // TODO sailing stuff
}

async function canSailToYnysdail(ctx) {
    return await canSailToTheWesternOcean(ctx);
}

async function canSailToGrimstone(ctx) {
    return await canSailToTheNorthernOcean(ctx);
}

async function canSailToBrittleIsle(ctx) {
    return await canSailToTheNorthernOcean(ctx);
}

async function canEnterTheCharredDungeon(ctx) {
    return await canCompletePandemonium(ctx) //
        && await has(ctx, 954); // Rope
}

async function canLongrange(ctx) {
    return ((await has(ctx, 841) || await has(ctx, 839)) // Shortbow or Longbow
        && (await has(ctx, 882) || await has(ctx, 884))) // Bronze arrow or Iron arrow
        || ((await has(ctx, 837) || await has(ctx, 9174)) // Crossbow or Bronze crossbow
            && await has(ctx, 877)) // Bronze bolts
        || ((await has(ctx, 556) || await has(ctx, 4696) || await has(ctx, 1381) || await has(ctx, 1397)) // Air rune, Dust rune, Staff of air or Air battlestaff
            && (await has(ctx, 558) || await has(ctx, 562) || await has(ctx, 560) || await has(ctx, 565))) // Mind rune, Chaos rune, Death rune or Blood rune
}

async function canCastStrikeSpells(ctx) {
    return ((await has(ctx, 556) || await has(ctx, 4696) || await has(ctx, 1381) || await has(ctx, 1397)) // Air rune, Dust rune, Staff of air or Air battlestaff
        && await has(ctx, 558)) // Mind rune
}

async function canShortrange(ctx) {
    return await canLongrange(ctx) //
        || await has(ctx, 864) // Bronze knife
        || await has(ctx, 870) // Bronze knife(p)
        || await has(ctx, 863) // Iron knife
        || await has(ctx, 865) // Steel knife
        || await has(ctx, 869) // Black knife
        || await has(ctx, 866) // Mithril knife
        || await has(ctx, 867) // Adamant knife
        || await has(ctx, 868) // Rune knife
        || await has(ctx, 5667) // Rune knife(p++)
        || await has(ctx, 806) // Bronze dart
        || await has(ctx, 807) // Iron dart
        || await has(ctx, 813) // Iron dart(p)
        || await has(ctx, 808) // Steel dart
        || await has(ctx, 3093) // Black dart
        || await has(ctx, 809) // Mithril dart
        || await has(ctx, 810) // Adamant dart
        || await has(ctx, 816) // Adamant dart(p)
        || await has(ctx, 811) // Rune dart
        || await has(ctx, 817) // Rune dart(p)
        || await has(ctx, 6522) // Toktz-xil-ul
        || await has(ctx, 10033) // Chinchompa
        || await has(ctx, 10034) // Red chinchompa
        || await has(ctx, 11959) // Black chinchompa
        || await has(ctx, 800) // Bronze thrownaxe
        || await has(ctx, 801) // Iron thrownaxe
        || await has(ctx, 802) // Steel thrownaxe
        || await has(ctx, 803) // Mithril thrownaxe
        || await has(ctx, 804) // Adamant thrownaxe
        || await has(ctx, 805); // Rune thrownaxe
}

async function canKillGargoyles(ctx) {
    return await has(ctx, 4162)       // Rock hammer
        || await has(ctx, 21754); // Rock thrownhammer
}

async function canKillDifficultDragons(ctx) {
    return false; // TODO: need to implement quest points
}

async function canEnterKaruulmSlayerDungeon(ctx) {
    return await has(ctx, 23037) // Boots of stone
        || await has(ctx, 21643); // Granite boots
}

async function canKillFossilIslandWyverns(ctx) {
    return await canCompleteBoneVoyage(ctx) && await hasAccessToWyvernProtection(ctx);
}

async function hasAccessToWyvernProtection(ctx) {
    return await canCompleteElementalWorkshopI(ctx) //
        && (await has(ctx, 2890) // Elemental shield
            || (await has(ctx, 9731) && await canCompleteElementalWorkshopII(ctx)) // Mind shield
        );
}

async function canCompleteAnimalMagnetism(ctx) {
    return await canCompleteErnestTheChicken(ctx) //
        && await canCompletePriestInPeril(ctx) //
        && await has(ctx, 1355) // Mithril axe
        && await has(ctx, 2351) // Iron bar
        && await has(ctx, 2347) // Hammer
        && await has(ctx, 1743) // Hard leather
        && await has(ctx, 1718) // Holy symbol
        && await has(ctx, 10496) // Polished buttons
        && await has(ctx, 1931); // Pot
}

async function canCompleteErnestTheChicken(ctx) {
    return await has(ctx, 952) // Spade
        && await has(ctx, 272) // Fish food
        && await has(ctx, 273); // Poison (item)
}

async function canCompleteDeathToTheDorgeshuun(ctx) {
    return await canCompleteTheLostTribe(ctx) //
        && await has(ctx, 4310) // Ham boots
        && await has(ctx, 4304) // Ham cloak
        && await has(ctx, 4308) // Ham gloves
        && await has(ctx, 4302) // Ham hood
        && await has(ctx, 4306) // Ham logo
        && await has(ctx, 4300) // Ham robe
        && await has(ctx, 4298); // Ham shirt
}

async function canCompleteTheLostTribe(ctx) {
    return await canCompleteGoblinDiplomacy(ctx) //
        && await canCompleteRuneMysteries(ctx) //
        && await canTrainMining(ctx); //
}

async function canCompleteGoblinDiplomacy(ctx) {
    return await has(ctx, 288) // Goblin mail
        && await has(ctx, 1769) // Orange dye
        && await has(ctx, 1767); // Blue dye
}

async function canStartPerilousMoons(ctx) {
    return await canCompleteTwilightsPromise(ctx) //
        && await canTrainHunter(ctx) //
        && await canTrainFishing(ctx) //
        && await canTrainRunecraft(ctx) //
        && await canTrainConstruction(ctx);
}

async function canCompleteTwilightsPromise(ctx) {
    return false; //TODO
}

async function canCompletePerilousMoons(ctx) {
    return await canStartPerilousMoons(ctx) //
        && await has(ctx, 946)  // Knife
        && await has(ctx, 305)  // Big fishing net
        && await has(ctx, 954)  // Rope
        && await has(ctx, 233); // Pestle and mortar
}

async function canCompletePiratesTreasure(ctx) {
    return await has(ctx, 1005)  // White apron
        && await has(ctx, 952)   // Spade
        && await has(ctx, 1963); // Banana
}

async function canReachGemRocks(ctx) {
    return await canCompletePandemonium(ctx) //
        || await canCompleteShiloVillage(ctx) //
        || await canCompleteLunarDiplomacy(ctx);
}

async function canCompleteLunarDiplomacy(ctx) {
    return false; // TODO
}

async function canCompleteShiloVillage(ctx) {
    return false; // TODO
}

async function canFishFromRewardPool(ctx) {
    return await has(ctx, 305)  // Big fishing net
        || await has(ctx, 303); // Small fishing net
}

async function canCompleteEnterTheAbyss(ctx) {
    return await canCompleteRuneMysteries(ctx);
}

async function canCompleteRuneMysteries(ctx) {
    return await has(ctx, 1438); // Air talisman
}

async function canCompleteFairytaleIGrowingPains(ctx) {
    return await canCompleteLostCity(ctx) //
        && await canCompleteNatureSpirit(ctx) //
        && await has(ctx, 5329) // Secateurs
        && await has(ctx, 952)  // Spade
        // TODO other item reqs?
        ;
}

async function canCompleteLostCity(ctx) {
    return await has(ctx, 1351)     // Bronze axe
        && await has(ctx, 946)  // Knife
        && await canTrainCrafting(ctx);
}

async function canCompleteNatureSpirit(ctx) {
    return await has(ctx, 2961)     // Silver sickle
        && await has(ctx, 2355) // Silver bar
        && await has(ctx, 2976) // Sickle mould
        && await canTrainCrafting(ctx);
}

async function canCompleteTempleOfTheEye(ctx) {
    return await has(ctx, 1929) // Bucket of water
        && await has(ctx, 1755) // Chisel
        && (await has(ctx, 1265) || await has(ctx, 1267)) // A bronze or iron pickaxe
        && await canTrainRunecraft(ctx);
}

async function canCompleteDeathPlateau(ctx) {
    return await has(ctx, 2309)  // Bread
        && await has(ctx, 333)   // Trout
        && await has(ctx, 2351)  // Iron bar
        && await has(ctx, 1905)  // Asgarnian ale
        && await has(ctx, 3105); // Climbing boots
}

async function canCompleteRoyalTrouble(ctx) {
    return await canCompleteThroneOfMiscellania(ctx) //
        && await has(ctx, 954)  // Rope
        && await has(ctx, 453)  // Coal
        && await has(ctx, 960); // Plank
}

async function canCompleteTouristTrap(ctx) {
    return await canTrainFletching(ctx) //
        && await canTrainSmithing(ctx) //
        && await has(ctx, 1833) // Desert shirt
        && await has(ctx, 1835) // Desert robe
        && await has(ctx, 1837) // Desert boots
        && await has(ctx, 2347) // Hammer
        && await has(ctx, 2349) // Bronze bar
        && await has(ctx, 314); // Feather
}

async function canCompleteThroneOfMiscellania(ctx) {
    return await canCompleteHeroesQuest(ctx) //
        && await canCompleteTheFremennikTrials(ctx) //
        && await has(ctx, 2351)      // Iron bar
        && (await has(ctx, 1635)     // Gold ring
            || await has(ctx, 1637)  // Sapphire ring
            || await has(ctx, 1639)  // Emerald ring
            || await has(ctx, 1641)  // Ruby ring
            || await has(ctx, 1643)) // Diamond ring
        && await has(ctx, 1511); // Logs
}

async function canCompleteHeroesQuest(ctx) { // TODO quest points
    return await canCompleteLostCity(ctx) //
        && await canCompleteMerlinsCrystal(ctx) //
        && await canCompleteDragonSlayerI(ctx) //
        && await canTrainMining(ctx) //
        && await canTrainHerblore(ctx) //
        && await canTrainFishing(ctx) //
        && await canTrainCooking(ctx) //
        && await has(ctx, 307) // Fishing rod
        && await has(ctx, 313) // Fishing bait
        && await has(ctx, 97)  // Harralander potion (unf)
        && await has(ctx, 255) // Harralander
        && await has(ctx, 227); // Vial of water
}

async function canCompleteTheDigSite(ctx) {
    return await canCompleteDruidicRitual(ctx) //
        && await has(ctx, 233) // Pestle and mortar
        && await has(ctx, 229) // Vial
        && await has(ctx, 590) // Tinderbox
        && await hasCupOfTea(ctx) //
        && await has(ctx, 954) // Rope
        && (await has(ctx, 1609) || await has(ctx, 1625)) // Opal or Uncut opal
        && await has(ctx, 973); // Charcoal
}

async function canCompleteMerlinsCrystal(ctx) {
    return await has(ctx, 2309)     // Bread
        && await has(ctx, 590)  // Tinderbox
        && await has(ctx, 30)   // Bucket of wax
        && await has(ctx, 1925) // Bucket
        && await has(ctx, 28)   // Insect repellent
        && await has(ctx, 530); // Bat bones
}

async function canCompleteDragonSlayerI(ctx) { // TODO quest points
    return await has(ctx, 1791)      // Unfired bowl
        && await has(ctx, 1761)  // Soft clay
        && await has(ctx, 1907)  // Wizards mind bomb
        && await has(ctx, 301)   // Lobster pot
        && await has(ctx, 950)   // Silk
        && await has(ctx, 1540)  // Anti-dragon shield
        && await has(ctx, 2347)  // Hammer
        && await has(ctx, 1539)  // Steel nails
        && await has(ctx, 960);  // Plank
}

async function canCompleteDwarfCannon(ctx) {
    return await has(ctx, 2347); // Hammer
}

async function canCompleteTroubledTortugans(ctx) {
    return await canTrainCrafting(ctx) //
        && await canTrainHunter(ctx) //
        && await canTrainWoodcutting(ctx) //
        && await canTrainConstruction(ctx) //
        && await canCompletePandemonium(ctx) //
        && await has(ctx, 401);     // Seaweed
}

async function canCompleteTheFremennikTrials(ctx) {
    return await has(ctx, 1917)      // Beer
        && await has(ctx, 590)   // Tinderbox
        && (await has(ctx, 383) // Raw shark
            || (await canTrainFishing(ctx) && (await has(ctx, 389) || await has(ctx, 395))))  // Raw manta ray or Raw sea turtle
}

async function canCompleteDruidicRitual(ctx) {
    return await has(ctx, 2136)  // Raw bear meat
        && await has(ctx, 2134)  // Raw rat meat
        && await has(ctx, 2132)  // Raw beef
        && await has(ctx, 2138); // Raw chicken
}

async function canCompletePandemonium(ctx) {
    return await has(ctx, 2347)  // Hammer
        && await has(ctx, 8794); // Saw
}

async function canCompleteTheHeartOfDarkness(ctx) {
    return await canTrainMining(ctx);
}

async function canCompleteIcthlarinsLittleHelper(ctx) {
    return await canCompleteGertrudesCat(ctx) //
        && await has(ctx, 590) // Tinderbox
        && await has(ctx, 1519) // Willow logs
        && (await has(ctx, 4161) || (await has(ctx, 1925) && await has(ctx, 4689))) // Bag of salt or (Bucket and Pile of salt)
        && await has(ctx, 4687) // Bucket of sap
        && await has(ctx, 1823) // Waterskin(4)
        && await has(ctx, 4684); // Linen
}

async function canCompleteGertrudesCat(ctx) {
    return await has(ctx, 1927) // Bucket of milk
        && await has(ctx, 1552); // Seasoned sardine
}

async function canCompletePriestInPeril(ctx) {
    return await has(ctx, 1925)      // Bucket
        && (await has(ctx, 7936) // Pure essence
            || await has(ctx, 1436) // or Rune essence
        );
}

async function canCompleteBoneVoyage(ctx) {
    return false; // TODO
}

async function canCompleteElementalWorkshopI(ctx) {
    return await canTrainMining(ctx) //
        && await canTrainCrafting(ctx) //
        && await has(ctx, 2347) // Hammer
        && await has(ctx, 1733) // Needle
        && await has(ctx, 1734) // Thread
        && await has(ctx, 1741) // Leather
        && await has(ctx, 453); // Coal
}

async function canCompleteElementalWorkshopII(ctx) {
    return await canCompleteElementalWorkshopI(ctx);
}

async function canCompleteZogreFleshEaters(ctx) {
    return await canCompleteBigChompyBirdHunting(ctx) //
        && await canCompleteJunglePotion(ctx) //
        && await canTrainSmithing(ctx);
}

async function canCompleteJunglePotion(ctx) {
    return await canCompleteDruidicRitual(ctx);
}

async function canCompleteBigChompyBirdHunting(ctx) {
    return await canTrainFletching(ctx) //
        && await canTrainCooking(ctx) //
        && await canTrainWoodcutting(ctx) //
        && await has(ctx, 314)  // Feather
        && await has(ctx, 946)  // Knife
        && await has(ctx, 1755) // Chisel
        && await has(ctx, 1965) // Cabbage
        && await has(ctx, 1982) // Tomato
        && await has(ctx, 1957) // Onion
        && await has(ctx, 1942) // Potato
        && await has(ctx, 2128) // Equa leaves
        && await has(ctx, 1573) // Doogle leaves
        && await has(ctx, 2862) // Achey tree logs
        && await has(ctx, 2864) // Ogre arrow shaft
        && await has(ctx, 2865) // Flighted ogre arrow
        && await has(ctx, 2859) // Wolf bones
        && await has(ctx, 2861) // Wolfbone arrowtips
        && await has(ctx, 2866) // Ogre arrow
        && await has(ctx, 2876);// Raw chompy
}

async function canTrainCrafting(ctx) {
    return true; // TODO implement this beast (true because lamps and buttons)
}

async function canTrainPrayer(ctx) {
    return await has(ctx, 3183) // Monkey bones
        || await has(ctx, 4834) // Ourg bones
        || await has(ctx, 4832) // Raurg bones
        || await has(ctx, 3123) // Shaikahan bones
        || await has(ctx, 31726) // Strykewyrm bones
        || await has(ctx, 22124) // Superior dragon bones
        || await has(ctx, 2859) // Wolf bones
        || await has(ctx, 22780) // Wyrm bones
        || await has(ctx, 28899) // Wyrmling bones
        || await has(ctx, 6812) // Wyvern bones
        || await has(ctx, 4812) // Zogre bones
        || await has(ctx, 534) // Babydragon bones
        || await has(ctx, 530) // Bat bones
        || await has(ctx, 532) // Big bones
        || await has(ctx, 526) // Bones
        || await has(ctx, 528) // Burnt bones
        || await has(ctx, 6729) // Dagannoth bones
        || await has(ctx, 536) // Dragon bones
        || await has(ctx, 22783) // Drake bones
        || await has(ctx, 4830) // Fayrg bones
        || await has(ctx, 31729) // Frost dragon bones
        || await has(ctx, 22786) // Hydra bones
        || await has(ctx, 3125) // Jogre bones
        || await has(ctx, 11943) // Lava dragon bones
        || await has(ctx, 25769) // Vile ashes
        || await has(ctx, 25775) // Abyssal ashes
        || await has(ctx, 25766) // Fiendish ashes
        || await has(ctx, 25778) // Infernal ashes
        || await has(ctx, 25772) // Malicious ashes
        || ( // Basic reanimation
            (await has(ctx, 559) && await has(ctx, 561)) // Body rune and Nature rune
            && (await has(ctx, 13448) // Ensouled goblin head
                || await has(ctx, 13451) // Ensouled monkey head
                || await has(ctx, 13454) // Ensouled imp head
                || await has(ctx, 13457) // Ensouled minotaur head
                || await has(ctx, 13460) // Ensouled scorpion head
                || await has(ctx, 13463) // Ensouled bear head
                || await has(ctx, 13466) // Ensouled unicorn head
            )
        ) //
        || ( // Adept reanimation
            (await has(ctx, 559) && await has(ctx, 561) && await has(ctx, 566)) // Body rune and Nature rune and Soul rune
            && (await has(ctx, 13469) // Ensouled dog head
                || await has(ctx, 13472) // Ensouled chaos druid head
                || await has(ctx, 13475) // Ensouled giant head
                || await has(ctx, 13478) // Ensouled ogre head
                || await has(ctx, 13481) // Ensouled elf head
                || await has(ctx, 13484) // Ensouled troll head
                || await has(ctx, 13487) // Ensouled horror head
            )
        ) //
        || ( // Expert reanimation
            (await has(ctx, 565) && await has(ctx, 561) && await has(ctx, 566)) // Blood rune and Nature rune and Soul rune
            && (await has(ctx, 13490) // Ensouled kalphite head
                || await has(ctx, 13493) // Ensouled dagannoth head
                || await has(ctx, 13496) // Ensouled bloodveld head
                || await has(ctx, 13499) // Ensouled tzhaar head
                || await has(ctx, 13502) // Ensouled demon head
                || await has(ctx, 26997) // Ensouled hellhound head
            )
        ) //
        || ( // Master reanimation
            (await has(ctx, 565) && await has(ctx, 561) && await has(ctx, 566)) // Blood rune and Nature rune and Soul rune
            && (await has(ctx, 13505) // Ensouled aviansie head
                || await has(ctx, 13508) // Ensouled abyssal head
                || await has(ctx, 13511) // Ensouled dragon head
            )
        ); //
}

async function canTrainRunecraft(ctx) {
    return await canCompleteRuneMysteries(ctx) &&
        (
            await has(ctx, 5525)    // Tiara
            || await has(ctx, 1436) // Rune essence
            || await has(ctx, 7936) // Pure essence
        );
}

async function canTrainWoodcutting(ctx) {
    return await has(ctx, 1351)      // Bronze axe
        || await has(ctx, 1349)  // Iron axe
        || await has(ctx, 1353); // Steel axe
}

async function canTrainMining(ctx) {
    return await has(ctx, 1265)      // Bronze pickaxe
        || await has(ctx, 1267)  // Iron pickaxe
        || await has(ctx, 1269); // Steel pickaxe
}

async function canTrainHerblore(ctx) {
    return await canCompleteDruidicRitual(ctx)
        && await has(ctx, 199)  // Grimy guam leaf
        && await has(ctx, 201)  // Grimy marrentill
        && await has(ctx, 203); // Grimy tarromin
}

async function canTrainFishing(ctx) {
    return await has(ctx, 303)     // Small fishing net
        || await has(ctx, 305) // Big fishing net
        || (await has(ctx, 307) && await has(ctx, 313)); // Fishing rod & Fishing bait
}

async function canTrainHunter(ctx) {
    return await has(ctx, 10006) // Bird snare
        || await has(ctx, 10150) // Noose wand
        || await has(ctx, 10010) // Butterfly net
        ; // TODO or the player's lvl allows for barehanding butterflies (lvl 25)
}

async function canTrainCooking(ctx) {
    return await has(ctx, 25833)    // Raw boar meat
        || await has(ctx, 2132) // Raw beef
        || await has(ctx, 2136) // Raw bear meat
        || await has(ctx, 2134) // Raw rat meat
        || await has(ctx, 2138) // Raw chicken
        || await has(ctx, 317)  // Raw shrimps
        || await has(ctx, 3226) // Raw rabbit
        || await has(ctx, 327)  // Raw sardine
        || await has(ctx, 321)  // Raw anchovies
        || await has(ctx, 1859) // Raw ugthanki meat
        || await has(ctx, 2307) // Bread dough
        || await has(ctx, 345); // Raw herring
}

async function canTrainFarming(ctx) {
    return await has(ctx, 5341) // Rake
        || await has(ctx, 8431);// Bagged plant 1
}

async function canPlantTrees(ctx) {
    return await canTrainFarming(ctx) //
        && await has(ctx, 5341) // Rake
        && await has(ctx, 952); // Spade
}

async function canPlantHardwoodTrees(ctx) {
    return await canPlantTrees(ctx) //
        && (
            await canCompleteBoneVoyage(ctx) //
            || await canTrainWoodcutting(ctx) //
            || await canCompletePandemonium(ctx) //
        );
}

async function canPlantPlants(ctx) {
    return await canTrainFarming(ctx) //
        && await has(ctx, 5341) // Rake
        && await has(ctx, 5343); // Seed dibber TODO: barbarian farming, possible by training farming in COX
}

async function canTrainConstruction(ctx) {
    return await has(ctx, 8431) // Bagged plant 1
        || (
            (await has(ctx, 2347) && await has(ctx, 8794)) // Hammer and Saw
            && (await has(ctx, 2351) || (await has(ctx, 960) && await hasAnyNails(ctx)))  // Iron bar or Plank and any nails
        );
}

async function canTrainFletching(ctx) {
    return (await has(ctx, 946) && await has(ctx, 1511)) // Knife & Logs
        || (await has(ctx, 52) && await has(ctx, 314)) // Arrow shaft & Feather
        || (await has(ctx, 53) && await has(ctx, 39)) // Headless arrow & Bronze arrowtip
}

async function canTrainFiremaking(ctx) {
    return await has(ctx, 590); // Tinderbox
}

async function canTrainSmithing(ctx) {
    return await has(ctx, 2347); // Hammer
}

async function canDoGnomeRestaurant(ctx) {
    return await canTrainCooking(ctx) //
        && ( //
            ( // Crunchies
                (await has(ctx, 2171) && await has(ctx, 2165) && await has(ctx, 2169)) // Gianne dough, Crunchy tray & Gnome spice
                && (
                    (await has(ctx, 2128) && await has(ctx, 2217)) // Toad crunchies
                    || (await has(ctx, 2128) && await has(ctx, 2213)) // Spicy crunchies
                    || (await has(ctx, 2128) && await has(ctx, 2162) && await has(ctx, 2205)) // Worm crunchies
                    || (await has(ctx, 1973) && await has(ctx, 1975) && await has(ctx, 2209)) // Chocchip crunchies
                )
            ) //
            || ( // Battas
                (await has(ctx, 2171) && await has(ctx, 2164) && await has(ctx, 2128)) // Gianne dough, Batta tin & Equa leaves
                && (
                    (await has(ctx, 2120) && await has(ctx, 2122) && await has(ctx, 2108) && await has(ctx, 2110) && await has(ctx, 2114) && await has(ctx, 2116) && await has(ctx, 2169) && await has(ctx, 2277)) // Fruit batta
                    || (await has(ctx, 2169) && await has(ctx, 1985) && await has(ctx, 2152) && await has(ctx, 2255)) // Toad Batta
                    || (await has(ctx, 2169) && await has(ctx, 1985) && await has(ctx, 2162) && await has(ctx, 2253)) // Worm Batta
                    || (await has(ctx, 1982) && await has(ctx, 2126) && await has(ctx, 1957) && await has(ctx, 1985) && await has(ctx, 1965) && await has(ctx, 2281)) // Vegetable Batta
                    || (await has(ctx, 1982) && await has(ctx, 1985) && await has(ctx, 2259)) // Cheese+tom batta
                )
            )
            || ( // Gnomebowls
                (await has(ctx, 2171) && await has(ctx, 2166) && await has(ctx, 2128)) // Gianne dough, Gnomebowl & Equa leaves
                && (
                    (await has(ctx, 2162) && await has(ctx, 1957) && await has(ctx, 2169) && await has(ctx, 2191)) // Worm hole
                    || (await has(ctx, 1957) && await has(ctx, 1942) && await has(ctx, 2152) && await has(ctx, 2195)) // Veg bowl
                    || (await has(ctx, 2152) && await has(ctx, 2169) && await has(ctx, 1985) && await has(ctx, 2126) && await has(ctx, 2187)) // Tangled toad's legs
                    || (await has(ctx, 1973) && await has(ctx, 1975) && await has(ctx, 2130) && await has(ctx, 2185)) // Chocolate bomb
                )
            )
            || ( // Cocktails
                (await has(ctx, 2025) && await has(ctx, 2026)) // Cocktail shaker & Cocktail glass
                && (
                    (await has(ctx, 2114) && await has(ctx, 2102) && await has(ctx, 2108) && await has(ctx, 2106) && await has(ctx, 2084)) // Fruit blast
                    || (await has(ctx, 2114) && await has(ctx, 2102) && await has(ctx, 2108) && await has(ctx, 2120) && await has(ctx, 2122) && await has(ctx, 2116) && await has(ctx, 2112) && await has(ctx, 2048)) // Pineapple punch
                    || (await has(ctx, 2015) && await has(ctx, 2019) && await has(ctx, 2120) && await has(ctx, 2102) && await has(ctx, 2114) && await has(ctx, 2108) && await has(ctx, 2116) && await has(ctx, 2124) && await has(ctx, 2054)) // Wizard blizzard
                    || (await has(ctx, 2015) && await has(ctx, 2120) && await has(ctx, 2124) && await has(ctx, 2128) && await has(ctx, 2080)) // Short green guy
                    || (await has(ctx, 2015) && await has(ctx, 2019) && await has(ctx, 2126) && await has(ctx, 2114) && await has(ctx, 2116) && await has(ctx, 2130) && await has(ctx, 2092)) // Drunk dragon
                    || (await has(ctx, 2017) && await has(ctx, 1973) && await has(ctx, 2128) && await has(ctx, 1927) && await has(ctx, 1975) && await has(ctx, 2130) && await has(ctx, 2074)) // Choc saturday
                    || (await has(ctx, 2015) && await has(ctx, 2021) && await has(ctx, 2019) && await has(ctx, 2102) && await has(ctx, 2104) && await has(ctx, 2108) && await has(ctx, 2110) && await has(ctx, 2128) && await has(ctx, 2120) && await has(ctx, 2124) && await has(ctx, 2064)) // Blurberry special
                )
            )
        );
}

async function canDoValeTotems(ctx) {
    return await canTrainFletching(ctx) //
        && await has(ctx, 946) // Knife
        && ( //
            (await has(ctx, 1521) // Oak logs
                && (await has(ctx, 843) // Oak shortbow
                    || await has(ctx, 845) // Oak longbow
                    || await has(ctx, 9442) // Oak stock
                    || await has(ctx, 22251) // Oak shield
                    || await has(ctx, 54) // Oak shortbow (u)
                    || await has(ctx, 56) // Oak longbow (u)
                ) //
            ) //
            || (await has(ctx, 1519) // Willow logs
                && (await has(ctx, 849) // Willow shortbow
                    || await has(ctx, 847) // Willow longbow
                    || await has(ctx, 9444) // Willow stock
                    || await has(ctx, 60)  // Willow shortbow (u)
                    || await has(ctx, 58) // Willow longbow (u)
                    || await has(ctx, 22254) // Willow shield
                ) //
            ) //
            || (await has(ctx, 1517) // Maple logs
                && (await has(ctx, 853) // Maple shortbow
                    || await has(ctx, 851) // Maple longbow
                    || await has(ctx, 9448) // Maple stock
                    || await has(ctx, 64) // Maple shortbow (u)
                    || await has(ctx, 62) // Maple longbow (u)
                    || await has(ctx, 22257) // Maple shield
                ) //
            ) //
            || (await has(ctx, 1515) // Yew logs
                && (await has(ctx, 857) // Yew shortbow
                    || await has(ctx, 855) // Yew longbow
                    || await has(ctx, 68) // Yew shortbow (u)
                    || await has(ctx, 66) // Yew longbow (u)
                    || await has(ctx, 22260) // Yew shield
                    || await has(ctx, 9452) // Yew stock
                ) //
            ) //
            || (await has(ctx, 1513) // Magic logs
                && (await has(ctx, 861) // Magic shortbow
                    || await has(ctx, 859) // Magic longbow
                    || await has(ctx, 72) // Magic shortbow (u)
                    || await has(ctx, 70) // Magic longbow (u)
                    || await has(ctx, 22263) // Magic shield
                    || await has(ctx, 21952) // Magic stock
                ) //
            ) //
            || (await has(ctx, 19669) // Redwood logs
                && (await has(ctx, 31049) // Redwood hiking staff
                    || await has(ctx, 22266) // Redwood shield
                ) //
            ) //
        ); //
}

async function canDoWintertodt(ctx) {
    return await canTrainFiremaking(ctx);
}

async function canDoSalvaging(ctx) {
    return await canCompletePandemonium(ctx) && false; // TODO add different salvaging hooks requirements
}

async function canDoSailingCombat(ctx) {
    return await canCompletePandemonium(ctx) && false; // TODO sailing combat
}