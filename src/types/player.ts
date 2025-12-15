export interface Player {
    name: string;
    fetchedAt: number;
    levels: Record<string, number>;
    quests: Record<string, number>; // 0 = not completed, 1 = started, 2 = completed
    achievementDiaries: Record<string, any>;
    combatAchievements: number[];
    collectionLog: number[];
    collectionLogItemCount: number;
}
