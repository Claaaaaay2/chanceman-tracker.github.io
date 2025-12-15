import type { Player } from "../types/player";

const WIKISYNC_URL = "https://sync.runescape.wiki/runelite/player/";

export async function fetchPlayer(playerName: string): Promise<Player> {
    const name = playerName.trim();
    if (!name) throw new Error("No player name");

    const res = await fetch(
        `${WIKISYNC_URL}${encodeURIComponent(name)}/STANDARD`
    );

    if (!res.ok) {
        throw new Error("Player does not have WikiSync enabled");
    }

    const data = await res.json();

    return {
        name: data.username,
        fetchedAt: Date.now(),
        levels: data.levels ?? {},
        quests: data.quests ?? {},
        achievementDiaries: data.achievement_diaries ?? {},
        combatAchievements: data.combat_achievements ?? [],
        collectionLog: data.collection_log ?? [],
        collectionLogItemCount: data.collectionLogItemCount ?? 0,
    };
}
