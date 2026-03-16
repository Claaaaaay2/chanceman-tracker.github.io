export function isIronmanAccount(player) {
    const accountType = player?.accountType;
    if (typeof accountType !== "string") return false;

    return accountType === "ironman"
        || accountType === "ultimate_ironman"
        || accountType === "hardcore_ironman"
        || accountType === "group_ironman"
        || accountType === "hardcore_group_ironman";
}

export function hasSuperiorSlayerUnlock(player) {
    return Boolean(player?.slayer?.unlocks?.biggerAndBadder);
}

export function hasBarbarianFiremakingTraining(player) {
    return Number(player?.barbarianTraining?.namedVars?.BRUT_FIRE ?? 0) > 0;
}
