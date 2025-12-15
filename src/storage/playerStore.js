import { loadFromDB, saveToDB } from "./fileStoreHelpers.js";

const PLAYER_KEY = "player";
let cachedPlayer = null;

export const playerStore = {
    async get() {
        if (cachedPlayer) return cachedPlayer;
        cachedPlayer = await loadFromDB(PLAYER_KEY);
        return cachedPlayer;
    },

    async set(player) {
        cachedPlayer = player;
        await saveToDB(PLAYER_KEY, player);
    },

    async clear() {
        cachedPlayer = null;
        await saveToDB(PLAYER_KEY, null);
    }
};
