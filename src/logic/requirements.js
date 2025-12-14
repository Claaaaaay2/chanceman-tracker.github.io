import { canDoOtherMethod, canReachNpc } from "./itemAvailability.js";

function has(ctx, id) {
    const item = ctx.items.find(i => i.id === id);
    if (!item) return false;
    return ctx.unlocked.includes(id) && canObtainItem(item, ctx, ctx.items);
}

export function canObtainItem(item, ctx, allItems, visited = new Set()) {
    if (!item) return false;

    // Stop cycles
    if (visited.has(item.id)) return false;
    visited.add(item.id);

    // 1. Already rolled
    if (ctx.rolled.includes(item.id)) return true;

    // 2. Droppable by killable NPC
    if (item.sources?.drops) {
        for (const [npcName] of Object.entries(item.sources.drops)) {
            if (canReachNpc(npcName, ctx)) return true;
        }
    }

    // 3. Other methods
    if (item.sources?.other) {
        for (const [method, obj] of Object.entries(item.sources.other)) {
            if (canDoOtherMethod(obj.rule, ctx)) {
                return true;
            }
        }
    }

    // 4. Processable (crafting)
    if (item.processable) {
        for (const [resultId, ingredientList] of Object.entries(item.processable)) {
            //
            // NOTE: The item itself is the **result**, not the ingredient.
            // Processable is like:
            //     "9143": "9380"
            //
            // That means item 9380 -> item 9143
            //
            // So if the current item is 9143, ingredients are 9380.
            //

            if (Number(resultId) !== item.id) continue;

            const ingredients = ingredientList.split(",");

            let allIngredientsObtainable = true;

            for (const ingId of ingredients) {
                const ingObj = allItems.find(i => i.id == ingId);

                if (!ingObj || !canObtainItem(ingObj, ctx, allItems, visited)) {
                    allIngredientsObtainable = false;
                    break;
                }
            }

            if (allIngredientsObtainable) return true;
        }
    }

    // Nothing worked
    return false;
}

export const REQUIREMENT_CHECKS = {
    canCompleteTaiBwoWannaiTrio(ctx) {
        return canCompleteTaiBwoWannaiTrio(ctx);
    },
    canCompleteDragonSlayerII(ctx) {
        return false; // TODO
    },
    canCompleteDragonSlayerI(ctx) {
        return false; // TODO
    },
    canCompleteDesertTreasureII(ctx) {
        return false; // TODO
    },
    canCompleteDesertTreasureI(ctx) {
        return false; // TODO
    },
    canCompleteMyArmsBigAdventure(ctx) {
        return false; // TODO
    },
    canCompleteInAidOfTheMyreque(ctx) {
        return false; // TODO
    },
    canCompleteShadowsOfCustodia(ctx) {
        return false; // TODO
    },
    canCompleteSongOfTheElves(ctx) {
        return false; // TODO
    },
    canCompleteWhileGuthixSleeps(ctx) {
        return false; // TODO
    },
    canCompleteTheGreatBrainRobbery(ctx) {
        return false; // TODO
    },
    canCompleteATasteOfHope(ctx) {
        return false; // TODO
    },
    canCompleteSinsOfTheFather(ctx) {
        return false; // TODO
    },
    canCompleteWhatLiesBelow(ctx) {
        return false; // TODO
    },
    canCompleteErnestTheChicken(ctx) {
        return canCompleteErnestTheChicken(ctx);
    },
    canCompleteTheFremennikExiles(ctx) {
        return false; // TODO
    },
    canCompleteCabinFever(ctx) {
        return false; // TODO
    },
    canCompleteWanted(ctx) {
        return false; // TODO
    },
    canCompleteTheFinalDawn(ctx) {
        return false; // TODO
    },
    canCompleteShadesOfMortton(ctx) {
        return canCompleteShadesOfMortton(ctx);
    },
    canCompleteSleepingGiants(ctx) {
        return false; // TODO
    },
    canCompleteBelowIceMountain(ctx) {
        return false; // TODO
    },
    canCompleteAKingdomDivided(ctx) {
        return false; // TODO
    },
    canCompleteTaleOfTheRighteous(ctx) {
        return false; // TODO
    },
    canCompleteTheTouristTrap(ctx) {
        return false; // TODO
    },
    canCompleteTreeGnomeVillage(ctx) {
        return false; // TODO
    },
    canCompleteAPorcineOfInterest(ctx) {
        return false; // TODO
    },
    canCompleteTempleOfIkov(ctx) {
        return false; // TODO
    },
    canCompleteInSearchOfTheMyreque(ctx) {
        return false; // TODO
    },
    canCompleteTheCorsairCurse(ctx) {
        return false; // TODO
    },
    canCompleteTheEyesOfGlouphrie(ctx) {
        return false; // TODO
    },
    canCompleteCreatureOfFenkenstrain(ctx) {
        return false; // TODO
    },
    canCompleteRFDFreeingPiratePete(ctx) {
        return false; // TODO
    },
    canCompleteRFDFreeingSirAmikVarse(ctx) {
        return false; // TODO
    },
    canCompleteRFDFreeingEvilDave(ctx) {
        return false; // TODO
    },
    canCompleteRFDFreeingSkrachUglologwee(ctx) {
        return false; // TODO
    },
    canEnterNightmareZone(ctx) {
        return false; // TODO
    },
    canEnterLumbridgeSwampCaves(ctx) {
        return false; // TODO
    },
    canCompleteMakingFriendsWithMyArm(ctx) {
        return false; // TODO
    },
    canCompleteSwanSong(ctx) {
        return false; // TODO
    },
    canCompleteGrimTales(ctx) {
        return false; // TODO
    },
    canCompleteObservatoryQuest(ctx) {
        return false; // TODO
    },
    canCompleteBetweenARock(ctx) {
        return false; // TODO
    },
    canGetGoutweed(ctx) {
        return false; // TODO
    },
    canCompleteRegicide(ctx) {
        return false; // TODO
    },
    canCompleteDefenderOfVarrock(ctx) {
        return false; // TODO
    },
    canCompleteTheCurseOfArrav(ctx) {
        return false; // TODO
    },
    canCompleteDreamMentor(ctx) {
        return false; // TODO
    },
    canCompleteTrollRomance(ctx) {
        return false; // TODO
    },
    canStartMourningsEndPartI(ctx) {
        return false; // TODO
    },
    canEnterTheChampionsGuild(ctx) {
        return false; // TODO quest points
    },
    canCompleteMourningsEndPartI(ctx) {
        return false; // TODO
    },
    canCompleteMourningsEndPartII(ctx) {
        return false; // TODO
    },
    canCompleteDarknessOfHallowvale(ctx) {
        return false; // TODO
    },
    canCompleteShadowOfTheStorm(ctx) {
        return false; // TODO
    },
    canCompleteASoulsBane(ctx) {
        return false; // TODO
    },
    canCompleteMerlinsCrystal(ctx) {
        return false; // TODO
    },
    canCompletePlagueCity(ctx) {
        return false; // TODO
    },
    canCompleteGettingAhead(ctx) {
        return false; // TODO
    },
    canCompleteFremennikTrials(ctx) {
        return false; // TODO
    },
    canCompleteTheFeud(ctx) {
        return false; // TODO
    },
    canCompleteRecipeForDisaster(ctx) {
        return false; // TODO
    },
    canCompleteRumDeal(ctx) {
        return false; // TODO
    },
    canCompleteHorrorFromTheDeep(ctx) {
        return false; // TODO
    },
    canCompleteMeatAndGreet(ctx) {
        return false; // TODO
    },
    canCompleteNatureSpirit(ctx) {
        return canCompleteNatureSpirit(ctx);
    },
    canCompleteSecretsOfTheNorth(ctx) {
        return false; // TODO
    },
    canCompleteLunarDiplomacy(ctx) {
        return canCompleteLunarDiplomacy(ctx);
    },
    canCompleteEaglesPeak(ctx) {
        return false; // TODO
    },
    canCompleteUndergroundPass(ctx) {
        return false; // TODO
    },
    canCompleteWatchtower(ctx) {
        return false; // TODO
    },
    canCompleteFairytaleIICureAQueen(ctx) {
        return false; // TODO
    },
    canCompleteRecipeForDisaster(ctx) {
        return false; // TODO
    },
    canCompleteEnakhrasLament(ctx) {
        return false; // TODO
    },
    canCompleteTheGrandTree(ctx) {
        return false; // TODO
    },
    canEnterBraindeathIsland(ctx) {
        return false; // TODO
    },
    canDoMixology(ctx) {
        return false; // TODO
    },
    canDoTombsOfAmascut(ctx) {
        return canDoTombsOfAmascut(ctx);
    },
    canCompleteHeroesQuest(ctx) {
        return canCompleteHeroesQuest(ctx);
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
    canDoBirdhouses(ctx) {
        return canDoBirdhouses(ctx);
    },
    canCatchSalamanders(ctx) {
        return canCatchSalamanders(ctx);
    },
    canCatchCrabs(ctx) {
        return canCatchCrabs(ctx);
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
    canCompleteDeathPlateau(ctx) {
        return canCompleteDeathPlateau(ctx);
    },
    canCompleteTheHeartOfDarkness(ctx) {
        return canCompleteTheHeartOfDarkness(ctx);
    },
    canStartIcthlarinsLittleHelper(ctx) {
        return canCompleteIcthlarinsLittleHelper(ctx); // TODO start maybe anders?
    },
    canCompleteIcthlarinsLittleHelper(ctx) {
        return canCompleteIcthlarinsLittleHelper(ctx);
    },
    canReachAbyssalSire(ctx) {
        return canCompleteEnterTheAbyss(ctx) || canCompleteFairytaleIGrowingPains(ctx);
    },
    canReachTrollheim(ctx) {
        return canReachTrollheim(ctx);
    },
    canGetBirdNestWyson(ctx) {
        return canGetBirdNestWyson(ctx);
    },
    canDoGuardiansOfTheRift(ctx) {
        return canCompleteTempleOfTheEye(ctx);
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
        return false; // TODO
    },
    canDoSalvaging(ctx) {
        return canDoSalvaging(ctx);
    },
    canCompleteMonkeyMadnessII(ctx) {
        return false; // TODO
    },
    canCompleteMonkeyMadnessI(ctx) {
        return false; // TODO
    },
    canCompletePryingTimes(ctx) {
        return false; // TODO
    },
    canCompleteOneSmallFavour(ctx) {
        return false; // TODO
    },
    canCompletePriestInPeril(ctx) {
        return canCompletePriestInPeril(ctx);
    },
    canCompleteZogreFleshEaters(ctx) {
        return canCompleteZogreFleshEaters(ctx);
    },
    canEnterKaruulmSlayerDungeon(ctx) {
        return canEnterKaruulmSlayerDungeon(ctx);
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
    canSailToYnysdail(ctx) {
        return canSailToYnysdail(ctx);
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
    canCompleteTouristTrap(ctx) {
        return canCompleteTouristTrap(ctx);
    },
    canCompletePandemonium(ctx) {
        return canCompletePandemonium(ctx);
    },
    canCompleteEnchantedKey(ctx) {
        return canCompleteMakingHistory(ctx);
    },
    canStartLegendsQuest(ctx) {
        return false; // TODO
    },
    canCompleteSeaSlug(ctx) {
        return false; // TODO
    },
    canCompleteLegendsQuest(ctx) {
        return false; // TODO
    },
    canDoYama(ctx) {
        return false; // TODO
    },
    canDoNex(ctx) {
        return canCompleteTheFrozenDoor(ctx) && false; // TODO
    },
    canCompleteTheFrozenDoor(ctx) {
        return canCompleteTheFrozenDoor(ctx);
    },
    canDoZulrah(ctx) {
        return false; // TODO
    },
    canCompleteAtFirstLight(ctx) {
        return false; // TODO
    },
    canCompleteColdWar(ctx) {
        return false; // TODO
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
    hasLobsterPot(ctx) {
        return has(ctx, 301);
    },
    hasFlyFishingRod(ctx) {
        return has(ctx, 309);
    },
    hasAnyFeather(ctx) {
        return hasAnyFeather(ctx); //TODO andere
    },
    hasDarkFishingBait(ctx) {
        return has(ctx, 11940);
    },
    hasKarambwanVesselBaited(ctx) {
        return has(ctx, 3159);
    },
    canAerialFish(ctx) {
        return has(ctx, 11334) || has(ctx, 2162);
    },
    canBarbarianFish(ctx) {
        return hasAnyFeather(ctx) || has(ctx, 313) || has(ctx, 11324) || has(ctx, 11326);
    },
    canReachFrogSpawnSpot(ctx) {
        return this.canCompleteBelowIceMountain(ctx) || this.canEnterLumbridgeSwampCaves(ctx);
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
    hasCrystalKey(ctx) {
        return has(ctx, 989);
    },
    hasMachete(ctx) {
        return has(ctx, 975) || has(ctx, 6313) || has(ctx, 6315) || has(ctx, 6317);
    },
    hasSpade(ctx) {
        return has(ctx, 952);
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
    hasDragonfruitSapling(ctx) {
        return has(ctx, 22866);
    },
    hasRosemarySeed(ctx) {
        return has(ctx, 5097);
    },
    hasCabbageSeed(ctx) {
        return has(ctx, 5324);
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
    hasSlashWeapon(ctx) {
        return true; // TODO
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
    hasFullAdamantArmour(ctx) {
        return has(ctx, 1161) && has(ctx, 1123) && has(ctx, 1073);
    },
    hasFullBlackArmour(ctx) {
        return has(ctx, 1165) && has(ctx, 1125) && has(ctx, 1077);
    },
    hasFullBronzeArmour(ctx) {
        return has(ctx, 1155) && has(ctx, 1117) && has(ctx, 1075);
    },
    hasFullIronArmour(ctx) {
        return has(ctx, 1153) && has(ctx, 1115) && has(ctx, 1067);
    },
    hasFullMithrilArmour(ctx) {
        return has(ctx, 1159) && has(ctx, 1121) && has(ctx, 1071);
    },
    hasFullRuneArmour(ctx) {
        return has(ctx, 1163) && has(ctx, 1127) && has(ctx, 1079);
    },
    hasFullSteelArmour(ctx) {
        return has(ctx, 1157) && has(ctx, 1119) && has(ctx, 1069);
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
        return false; // TODO
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
    canTrainCrafting(ctx) {
        return canTrainCrafting(ctx);
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

function canCompleteBeneathCursedSands(ctx) {
    return canCompleteContact(ctx) //
        && canTrainCrafting(ctx) //
        && canTrainFiremaking(ctx) //
        && has(ctx, 453) // Coal
        && has(ctx, 2351) // Iron bar
        && has(ctx, 590) // Tinderbox
        && has(ctx, 952) // Spade
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
    return has(ctx, 314); // TODO andere feathers
}

function hasAnyLantern(ctx) {
    return (canTrainFiremaking(ctx) //
            && (canDoGuardiansOfTheRift(ctx) //
                || has(ctx, 4548) // Bullseye lantern
                || has(ctx, 4532) // Candle lantern (black)
                || has(ctx, 4529) // Candle lantern (white)
                || has(ctx, 7051) // Unlit bug lantern
                || has(ctx, 4537) // Oil lantern
                || canCompleteDesertTreasureII(ctx) //
            ));
}

function canCompleteContact(ctx) {
    return canCompletePrinceAliRescue(ctx) //
        && canCompleteIcthlarinsLittleHelper(ctx); //
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
    return canCompleteDeathPlateau(ctx); // TODO achievement diaries
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

function canDoCommanderZilyana(ctx) {
    return false; // TODO
}

function canDoGeneralGraardor(ctx) {
    return false; // TODO
}

function canDoKreearra(ctx) {
    return false; // TODO
}

function canDoKrilTsutsaroth(ctx) {
    return false; // TODO
}

function canDoNex(ctx) {
    return false; // TODO
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

function hasAnyNails(ctx) {
    return has(ctx, 4819)      // Bronze nails
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

function canCompleteTaiBwoWannaiTrio(ctx) {
    return false; // TODO
}

function canCompleteTheFrozenDoor(ctx) {
    return canDoKreearra(ctx) //
        && canDoGeneralGraardor(ctx) //
        && canDoCommanderZilyana(ctx) //
        && canDoKrilTsutsaroth(ctx);
}

function canCompleteMakingHistory(ctx) {
    return canCompletePriestInPeril(ctx)
        && has(ctx, 1694) //Sapphire amulet
        && has(ctx, 952); // Spade
}

function canSailToTheNorthernOcean(ctx) {
    return canCompletePandemonium(ctx) //
        && false; // TODO sailing stuff
}

function canSailToTheWesternOcean(ctx) {
    return canCompletePandemonium(ctx) //
        && false; // TODO sailing stuff
}

function canSailToYnysdail(ctx) {
    return canSailToTheWesternOcean(ctx);
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
    return ((has(ctx, 841) || has(ctx, 839)) // Shortbow or Longbow
        && (has(ctx, 882) || has(ctx, 884))) // Bronze arrow or Iron arrow
        || ((has(ctx, 837) || has(ctx, 9174)) // Crossbow or Bronze crossbow
            && has(ctx, 877)) // Bronze bolts
        || ((has(ctx, 556) || has(ctx, 4696) || has(ctx, 1381) || has(ctx, 1397)) // Air rune, Dust rune, Staff of air or Air battlestaff
            && (has(ctx, 558) || has(ctx, 562) || has(ctx, 560) || has(ctx, 565))) // Mind rune, Chaos rune, Death rune or Blood rune
}

function canCastStrikeSpells(ctx) {
    return ((has(ctx, 556) || has(ctx, 4696) || has(ctx, 1381) || has(ctx, 1397)) // Air rune, Dust rune, Staff of air or Air battlestaff
        && has(ctx, 558)) // Mind rune
}

function canShortrange(ctx) {
    return canLongrange(ctx) //
        || has(ctx, 864) // Bronze knife
        || has(ctx, 870) // Bronze knife(p)
        || has(ctx, 863) // Iron knife
        || has(ctx, 865) // Steel knife
        || has(ctx, 869) // Black knife
        || has(ctx, 866) // Mithril knife
        || has(ctx, 867) // Adamant knife
        || has(ctx, 868) // Rune knife
        || has(ctx, 5667) // Rune knife(p++)
        || has(ctx, 806) // Bronze dart
        || has(ctx, 807) // Iron dart
        || has(ctx, 813) // Iron dart(p)
        || has(ctx, 808) // Steel dart
        || has(ctx, 3093) // Black dart
        || has(ctx, 809) // Mithril dart
        || has(ctx, 810) // Adamant dart
        || has(ctx, 816) // Adamant dart(p)
        || has(ctx, 811) // Rune dart
        || has(ctx, 817) // Rune dart(p)
        || has(ctx, 6522) // Toktz-xil-ul
        || has(ctx, 10033) // Chinchompa
        || has(ctx, 10034) // Red chinchompa
        || has(ctx, 11959) // Black chinchompa
        || has(ctx, 800) // Bronze thrownaxe
        || has(ctx, 801) // Iron thrownaxe
        || has(ctx, 802) // Steel thrownaxe
        || has(ctx, 803) // Mithril thrownaxe
        || has(ctx, 804) // Adamant thrownaxe
        || has(ctx, 805); // Rune thrownaxe
}

function canKillGargoyles(ctx) {
    return has(ctx, 4162)       // Rock hammer
        || has(ctx, 21754); // Rock thrownhammer
}

function canKillDifficultDragons(ctx) {
    return false; // TODO: need to implement quest points
}

function canEnterKaruulmSlayerDungeon(ctx) {
    return has(ctx, 23037) // Boots of stone
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
        && has(ctx, 1931) // Pot
        && ( // Bones for Ecto-tokens
            has(ctx, 534)      // Babydragon bones
            || has(ctx, 530)   // Bat bones
            || has(ctx, 532)   // Big bones
            || has(ctx, 526)   // Bones
            || has(ctx, 528)   // Burnt bones
            || has(ctx, 6729)  // Dagannoth bones
            || has(ctx, 536)   // Dragon bones
            || has(ctx, 22783) // Drake bones
            || has(ctx, 31729) // Frost dragon bones
            || has(ctx, 22786) // Hydra bones
            || has(ctx, 3125)  // Jogre bones
            || has(ctx, 11943) // Lava dragon bones
            || has(ctx, 3183)  // Monkey bones
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
        );
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
    return has(ctx, 288) // Goblin mail
        && has(ctx, 1769) // Orange dye
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
    return false; //TODO
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
        || canCompleteLunarDiplomacy(ctx);
}

function canCompleteLunarDiplomacy(ctx) {
    return false; // TODO
}

function canCompleteShiloVillage(ctx) {
    return false; // TODO
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

function canCompleteLostCity(ctx) {
    return has(ctx, 1351)     // Bronze axe
        && has(ctx, 946)  // Knife
        && canTrainCrafting(ctx);
}

function canCompleteNatureSpirit(ctx) {
    return has(ctx, 2961)     // Silver sickle
        && has(ctx, 2355) // Silver bar
        && has(ctx, 2976) // Sickle mould
        && canTrainCrafting(ctx);
}

function canCompleteTempleOfTheEye(ctx) {
    return has(ctx, 1929) // Bucket of water
        && has(ctx, 1755) // Chisel
        && (has(ctx, 1265) || has(ctx, 1267)) // A bronze or iron pickaxe
        && canTrainRunecraft(ctx);
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

function canCompleteTouristTrap(ctx) {
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

function canCompleteHeroesQuest(ctx) { // TODO quest points
    return canCompleteLostCity(ctx) //
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
    return has(ctx, 2309)     // Bread
        && has(ctx, 590)  // Tinderbox
        && has(ctx, 30)   // Bucket of wax
        && has(ctx, 1925) // Bucket
        && has(ctx, 28)   // Insect repellent
        && has(ctx, 530); // Bat bones
}

function canCompleteDragonSlayerI(ctx) { // TODO quest points
    return has(ctx, 1791)      // Unfired bowl
        && has(ctx, 1761)  // Soft clay
        && has(ctx, 1907)  // Wizards mind bomb
        && has(ctx, 301)   // Lobster pot
        && has(ctx, 950)   // Silk
        && has(ctx, 1540)  // Anti-dragon shield
        && has(ctx, 2347)  // Hammer
        && has(ctx, 1539)  // Steel nails
        && has(ctx, 960);  // Plank
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
    return has(ctx, 1917)      // Beer
        && has(ctx, 590)   // Tinderbox
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

function canCompleteIcthlarinsLittleHelper(ctx) {
    return canCompleteGertrudesCat(ctx) //
        && has(ctx, 590) // Tinderbox
        && has(ctx, 1519) // Willow logs
        && (has(ctx, 4161) || (has(ctx, 1925) && has(ctx, 4689))) // Bag of salt or (Bucket and Pile of salt)
        && has(ctx, 4687) // Bucket of sap
        && has(ctx, 1823) // Waterskin(4)
        && has(ctx, 4684); // Linen
}

function canCompleteGertrudesCat(ctx) {
    return has(ctx, 1927) // Bucket of milk
        && has(ctx, 1552); // Seasoned sardine
}

function canCompletePriestInPeril(ctx) {
    return has(ctx, 1925)      // Bucket
        && (has(ctx, 7936) // Pure essence
            || has(ctx, 1436) // or Rune essence
        );
}

function canCompleteBoneVoyage(ctx) {
    return false; // TODO
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

function canCompleteZogreFleshEaters(ctx) {
    return canCompleteBigChompyBirdHunting(ctx) //
        && canCompleteJunglePotion(ctx) //
        && canTrainSmithing(ctx);
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
    return true; // TODO implement this beast (true because lamps and buttons)
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
    return has(ctx, 1351)      // Bronze axe
        || has(ctx, 1349)  // Iron axe
        || has(ctx, 1353); // Steel axe
}

function canTrainMining(ctx) {
    return has(ctx, 1265)      // Bronze pickaxe
        || has(ctx, 1267)  // Iron pickaxe
        || has(ctx, 1269); // Steel pickaxe
}

function canTrainHerblore(ctx) {
    return canCompleteDruidicRitual(ctx) //
        && has(ctx, 199)  // Grimy guam leaf
        && has(ctx, 201)  // Grimy marrentill
        && has(ctx, 203); // Grimy tarromin
}

function canTrainFishing(ctx) {
    return has(ctx, 303)     // Small fishing net
        && has(ctx, 305) // Big fishing net
        && (has(ctx, 307) && has(ctx, 313)); // Fishing rod & Fishing bait
}

function canTrainHunter(ctx) {
    return has(ctx, 10006)     // Bird snare
        && has(ctx, 10150) // Noose wand
        && has(ctx, 10010) // Butterfly net
        ; // TODO or the player's lvl allows for barehanding butterflies (lvl 25)
}

function canTrainCooking(ctx) {
    return has(ctx, 25833)    // Raw boar meat
        && has(ctx, 2132) // Raw beef
        && has(ctx, 2136) // Raw bear meat
        && has(ctx, 2134) // Raw rat meat
        && has(ctx, 2138) // Raw chicken
        && has(ctx, 317)  // Raw shrimps
        && has(ctx, 3226) // Raw rabbit
        && has(ctx, 327)  // Raw sardine
        && has(ctx, 321)  // Raw anchovies
        && has(ctx, 1859) // Raw ugthanki meat
        && has(ctx, 2307) // Bread dough
        && has(ctx, 345); // Raw herring
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
        && has(ctx, 5341) // Rake
        && has(ctx, 5343); // Seed dibber TODO: barbarian farming, possible by training farming in COX
}

function canTrainConstruction(ctx) {
    return has(ctx, 8431) // Bagged plant 1
        && (
            (has(ctx, 2347) && has(ctx, 8794)) // Hammer and Saw
            && (has(ctx, 2351) || (has(ctx, 960) && hasAnyNails(ctx)))  // Iron bar or Plank and any nails
        );
}

function canTrainFletching(ctx) {
    return (has(ctx, 946) && has(ctx, 1511)) // Knife & Logs
        || (has(ctx, 52) && has(ctx, 314)) // Arrow shaft & Feather
        || (has(ctx, 53) && has(ctx, 39)) // Headless arrow & Bronze arrowtip
}

function canTrainFiremaking(ctx) {
    return has(ctx, 590); // Tinderbox
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
        && has(ctx, 946) // Knife
        && ((
            has(ctx, 843) // Oak shortbow
            || has(ctx, 845) // Oak longbow
            || has(ctx, 9442) // Oak stock
            || has(ctx, 22251) // Oak shield
            || (has(ctx, 1521) && (has(ctx, 54) || has(ctx, 56))) // Oak logs & either Oak shortbow (u) or Oak longbow (u)
        ) //
            || (
                has(ctx, 849) // Willow shortbow
                || has(ctx, 847) // Willow longbow
                || has(ctx, 9444) // Willow stock
                || (has(ctx, 1519) && (has(ctx, 60) || has(ctx, 58) || has(ctx, 22254))) // Willow logs & either Willow shortbow (u), Willow longbow (u) or Willow shield
            ) //
            || (
                has(ctx, 853) // Maple shortbow
                || has(ctx, 851) // Maple longbow
                || has(ctx, 9448) // Maple stock
                || (has(ctx, 1517) && (has(ctx, 64) || has(ctx, 62) || has(ctx, 22257))) // Maple logs & either Maple shortbow (u), Maple longbow (u) or Maple shield
            ) //
            || (
                has(ctx, 857) // Yew shortbow
                || has(ctx, 855) // Yew longbow
                || (has(ctx, 1515) && (has(ctx, 68) || has(ctx, 66) || has(ctx, 22260) || has(ctx, 9452))) // Yew logs & either Yew shortbow (u), Yew longbow (u), Yew shield or Yew stock
            ) //
            || (has(ctx, 1513) && (has(ctx, 72) || has(ctx, 70) || has(ctx, 22263) || has(ctx, 21952))) // Magic logs & either Magic shortbow (u), Magic longbow (u), Magic shield or Magic stock
            || (canTrainWoodcutting(ctx) && has(ctx, 19669) && (has(ctx, 31049) || has(ctx, 22266)))); // Redwood logs & either Redwood hiking staff or Redwood shield
}

function canDoWintertodt(ctx) {
    return canTrainFiremaking(ctx) //
        && canTrainWoodcutting(ctx);
}

function canDoSalvaging(ctx) {
    return canCompletePandemonium(ctx) && false; // TODO add different salvaging hooks requirements
}

function canDoSailingCombat(ctx) {
    return canCompletePandemonium(ctx) && false; // TODO sailing combat
}