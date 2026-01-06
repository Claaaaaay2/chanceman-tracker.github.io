import type { Player } from "../types/player";
import { QUEST_POINTS } from "./questPoints";

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

    const questPoints = calculateQuestPoints(data.quests);

    return {
        name: data.username,
        fetchedAt: Date.now(),
        levels: data.levels ?? {},
        quests: data.quests ?? {},
        questPoints,
        achievementDiaries: data.achievement_diaries ?? {},
        combatAchievements: data.combat_achievements ?? [],
        collectionLog: data.collection_log ?? [],
        collectionLogItemCount: data.collectionLogItemCount ?? 0,
    };
}

function calculateQuestPoints(quests: Record<string, number>) {
    let total = 0;

    for (const [questName, status] of Object.entries(quests)) {
        if (status !== 2) continue; // only completed quests

        const points = QUEST_POINTS[questName];

        if (!points && points !== 0) {
            console.warn("Missing quest point value for:", questName);
            continue;
        }

        total += points;
    }

    return total;
}
