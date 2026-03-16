export interface Player {
    name: string;
    fetchedAt: number;
    levels: Record<string, number>;
    quests: Record<string, number>; // 0 = not completed, 1 = started, 2 = completed
    questPoints: number;
    achievementDiaries: Record<string, any>;
    combatAchievements: number[];
    combatAchievementsCount?: number;
    combatAchievementTiers?: Record<string, boolean>;
    collectionLog: number[];
    collectionLogItemCount: number;
    accountType?: string | null;
    slayer?: Record<string, any> | null;
    barbarianTraining?: Record<string, any> | null;
    hunterRumoursCompleted?: number;
}
