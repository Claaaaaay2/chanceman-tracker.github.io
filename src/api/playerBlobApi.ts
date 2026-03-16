import type { Player } from "../types/player";
import { QUEST_POINTS } from "./questPoints";

interface TrackerBlobPlayer {
    name?: string;
    levels?: Record<string, number>;
    quests?: Record<string, number>;
    questPoints?: number;
    achievementDiaries?: Record<string, any>;
    combatAchievements?: {
        count?: number;
        tiers?: Record<string, boolean>;
    };
    hunterRumoursCompleted?: number;
    accountType?: string;
    slayer?: Record<string, any>;
    barbarianTraining?: Record<string, any>;
}

interface TrackerBlob {
    schemaVersion?: number;
    player?: TrackerBlobPlayer;
}

export function parsePlayerBlob(blobText: string): Player {
    const trimmed = blobText.trim();
    if (!trimmed) {
        throw new Error("Player blob is empty");
    }

    let parsed: TrackerBlob;
    try {
        parsed = JSON.parse(trimmed);
    } catch (err) {
        throw new Error("Player blob is not valid JSON");
    }

    if (!parsed || typeof parsed !== "object") {
        throw new Error("Player blob is invalid");
    }

    if (parsed.schemaVersion !== 1) {
        throw new Error(`Unsupported player blob schema: ${parsed.schemaVersion ?? "unknown"}`);
    }

    const player = parsed.player;
    if (!player || typeof player !== "object") {
        throw new Error("Player blob is missing player data");
    }

    const name = String(player.name || "").trim();
    if (!name) {
        throw new Error("Player blob is missing a player name");
    }

    const quests = normalizeQuestStatuses(player.quests);
    const combatAchievementsCount = normalizeNonNegativeNumber(player.combatAchievements?.count);

    return {
        name,
        fetchedAt: Date.now(),
        levels: normalizeNumberMap(player.levels),
        quests,
        questPoints: resolveQuestPoints(player.questPoints, quests),
        achievementDiaries: normalizeAchievementDiaries(player.achievementDiaries),
        combatAchievements: [],
        combatAchievementsCount,
        combatAchievementTiers: normalizeBooleanMap(player.combatAchievements?.tiers),
        collectionLog: [],
        collectionLogItemCount: 0,
        hunterRumoursCompleted: normalizeNonNegativeNumber(player.hunterRumoursCompleted),
        accountType: typeof player.accountType === "string" ? player.accountType : null,
        slayer: player.slayer && typeof player.slayer === "object" ? player.slayer : null,
        barbarianTraining: player.barbarianTraining && typeof player.barbarianTraining === "object"
            ? player.barbarianTraining
            : null
    };
}

function normalizeNumberMap(value: unknown): Record<string, number> {
    if (!value || typeof value !== "object") return {};
    const entries = Object.entries(value as Record<string, unknown>)
        .map(([key, raw]) => [key, Number(raw)] as const)
        .filter(([, numberValue]) => Number.isFinite(numberValue));
    return Object.fromEntries(entries);
}

function normalizeBooleanMap(value: unknown): Record<string, boolean> {
    if (!value || typeof value !== "object") return {};
    const entries = Object.entries(value as Record<string, unknown>)
        .map(([key, raw]) => [key, Boolean(raw)] as const);
    return Object.fromEntries(entries);
}

function normalizeQuestStatuses(value: unknown): Record<string, number> {
    if (!value || typeof value !== "object") return {};
    const entries = Object.entries(value as Record<string, unknown>)
        .map(([key, raw]) => [key, normalizeQuestStatus(raw)] as const);
    return Object.fromEntries(entries);
}

function normalizeQuestStatus(value: unknown) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 0;
    if (numeric >= 2) return 2;
    if (numeric >= 1) return 1;
    return 0;
}

function normalizeNonNegativeNumber(value: unknown) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric < 0) return 0;
    return numeric;
}

function resolveQuestPoints(rawQuestPoints: unknown, quests: Record<string, number>) {
    const numeric = Number(rawQuestPoints);
    if (Number.isFinite(numeric) && numeric >= 0) {
        return numeric;
    }
    return calculateQuestPoints(quests);
}

function calculateQuestPoints(quests: Record<string, number>) {
    let total = 0;

    for (const [questName, status] of Object.entries(quests)) {
        if (status !== 2) continue;

        const points = QUEST_POINTS[questName];
        if (!points && points !== 0) continue;
        total += points;
    }

    return total;
}

function normalizeAchievementDiaries(value: unknown): Record<string, any> {
    if (!value || typeof value !== "object") return {};
    const diaries = value as Record<string, Record<string, any>>;
    const normalized: Record<string, any> = {};

    for (const [regionName, tiers] of Object.entries(diaries)) {
        if (!tiers || typeof tiers !== "object") continue;

        const normalizedTiers: Record<string, any> = {};
        for (const [tierName, tierValue] of Object.entries(tiers)) {
            if (!tierValue || typeof tierValue !== "object") continue;
            normalizedTiers[tierName] = {
                complete: Boolean(tierValue.complete),
                taskStatesAvailable: Boolean(tierValue.taskStatesAvailable),
                tasks: Array.isArray(tierValue.tasks)
                    ? tierValue.tasks.map((task) => Boolean(task))
                    : []
            };
        }

        normalized[regionName] = normalizedTiers;
    }

    return normalized;
}
