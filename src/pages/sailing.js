import { fileStore } from "../storage/fileStore.js";

/*
 * Sailing page
 *
 * IMPORTANT:
 * - The first level in every table is Sailing.
 * - The second level is Construction.
 * - Material quantities are included in the definitions for reference,
 *   but availability is NOT quantity-based.
 * - An item is considered available only when its item ID exists in BOTH
 *   fileStore.rolled and fileStore.obtained.
 */

const HULLS_RAFT = [
    {
        name: "Wooden base",
        sailing: 1,
        construction: 1,
        materials: [
            ["Logs", 10],
            ["Rope", 6],
            ["Swamp tar", 10]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Wooden_hull"
    },
    {
        name: "Oak base",
        sailing: 20,
        construction: 8,
        materials: [
            ["Oak logs", 10],
            ["Rope", 6],
            ["Swamp tar", 10]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Oak_hull"
    },
    {
        name: "Teak base",
        sailing: 31,
        construction: 23,
        materials: [
            ["Teak logs", 10],
            ["Rope", 6],
            ["Swamp tar", 10],
            ["Lead bar", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Teak_hull"
    },
    {
        name: "Mahogany base",
        sailing: 48,
        construction: 41,
        materials: [
            ["Mahogany logs", 10],
            ["Rope", 6],
            ["Swamp tar", 10],
            ["Lead bar", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Mahogany_hull"
    },
    {
        name: "Camphor base",
        sailing: 67,
        construction: 59,
        materials: [
            ["Camphor logs", 10],
            ["Rope", 6],
            ["Swamp tar", 10],
            ["Lead bar", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Camphor_hull"
    },
    {
        name: "Ironwood base",
        sailing: 81,
        construction: 75,
        materials: [
            ["Ironwood logs", 10],
            ["Rope", 6],
            ["Swamp tar", 10],
            ["Cupronickel bar", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Ironwood_hull"
    },
    {
        name: "Rosewood base",
        sailing: 93,
        construction: 84,
        materials: [
            ["Rosewood logs", 10],
            ["Rope", 6],
            ["Swamp tar", 10],
            ["Cupronickel bar", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Rosewood_hull"
    }
];

const HULLS_SKIFF = [
    {
        name: "Wooden skiff",
        sailing: 15,
        construction: 1,
        materials: [
            ["Wooden hull parts", 10],
            ["Bronze nails", 300],
            ["Swamp tar", 20]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Wooden_hull"
    },
    {
        name: "Oak skiff",
        sailing: 20,
        construction: 8,
        materials: [
            ["Oak hull parts", 10],
            ["Iron nails", 300],
            ["Swamp tar", 20]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Oak_hull"
    },
    {
        name: "Teak skiff",
        sailing: 31,
        construction: 23,
        materials: [
            ["Teak hull parts", 10],
            ["Steel nails", 300],
            ["Swamp tar", 20],
            ["Lead bar", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Teak_hull"
    },
    {
        name: "Mahogany skiff",
        sailing: 48,
        construction: 41,
        materials: [
            ["Mahogany hull parts", 10],
            ["Mithril nails", 300],
            ["Swamp tar", 20],
            ["Lead bar", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Mahogany_hull"
    },
    {
        name: "Camphor skiff",
        sailing: 67,
        construction: 59,
        materials: [
            ["Camphor hull parts", 10],
            ["Adamantite nails", 300],
            ["Swamp tar", 20],
            ["Lead bar", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Camphor_hull"
    },
    {
        name: "Ironwood skiff",
        sailing: 81,
        construction: 75,
        materials: [
            ["Ironwood hull parts", 10],
            ["Rune nails", 300],
            ["Swamp tar", 20],
            ["Cupronickel bar", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Ironwood_hull"
    },
    {
        name: "Rosewood skiff",
        sailing: 93,
        construction: 84,
        materials: [
            ["Rosewood hull parts", 10],
            ["Dragon nails", 300],
            ["Swamp tar", 20],
            ["Cupronickel bar", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Rosewood_hull"
    }
];

const HULLS_SLOOP = [
    {
        name: "Wooden sloop",
        sailing: 50,
        construction: 1,
        materials: [
            ["Large wooden hull parts", 16],
            ["Bronze nails", 600],
            ["Swamp tar", 25]
        ],
        wiki: "https://oldschool.runescape.wiki/w/hull"
    },
    {
        name: "Oak sloop",
        sailing: 50,
        construction: 8,
        materials: [
            ["Large oak hull parts", 16],
            ["Iron nails", 600],
            ["Swamp tar", 25]
        ],
        wiki: "https://oldschool.runescape.wiki/w/hull"
    },
    {
        name: "Teak sloop",
        sailing: 50,
        construction: 23,
        materials: [
            ["Large teak hull parts", 16],
            ["Steel nails", 600],
            ["Swamp tar", 25],
            ["Lead bar", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/hull"
    },
    {
        name: "Mahogany sloop",
        sailing: 50,
        construction: 41,
        materials: [
            ["Large mahogany hull parts", 16],
            ["Mithril nails", 600],
            ["Swamp tar", 25],
            ["Lead bar", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Mahogany_hull"
    },
    {
        name: "Camphor sloop",
        sailing: 67,
        construction: 59,
        materials: [
            ["Large Camphor hull parts", 16],
            ["Adamantite nails", 600],
            ["Swamp tar", 25],
            ["Lead bar", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Camphor_hull"
    },
    {
        name: "Ironwood sloop",
        sailing: 81,
        construction: 75,
        materials: [
            ["Large ironwood hull parts", 16],
            ["Rune nails", 600],
            ["Swamp tar", 25],
            ["Cupronickel bar", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Ironwood_hull"
    },
    {
        name: "Rosewood sloop",
        sailing: 93,
        construction: 84,
        materials: [
            ["Large rosewood hull parts", 16],
            ["Dragon nails", 600],
            ["Swamp tar", 25],
            ["Cupronickel bar", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Rosewood_hull"
    }
];

const HELMS_RAFT = [
    {
        name: "Bronze helm",
        sailing: 1,
        construction: 1,
        materials: [
            ["Plank", 2],
            ["Bronze bar", 4]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Bronze_helm"
    },
    {
        name: "Iron helm",
        sailing: 17,
        construction: 14,
        materials: [
            ["Oak plank", 2],
            ["Iron bar", 4]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Iron_helm"
    },
    {
        name: "Steel helm",
        sailing: 38,
        construction: 30,
        materials: [
            ["Teak plank", 2],
            ["Steel bar", 4]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Steel_helm"
    },
    {
        name: "Mithril helm",
        sailing: 55,
        construction: 47,
        materials: [
            ["Mahogany plank", 2],
            ["Mithril bar", 4]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Mithril_helm"
    },
    {
        name: "Adamant helm",
        sailing: 72,
        construction: 59,
        materials: [
            ["Camphor plank", 2],
            ["Adamantite bar", 4]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Adamant_helm"
    },
    {
        name: "Rune helm",
        sailing: 87,
        construction: 81,
        materials: [
            ["Ironwood plank", 2],
            ["Runite bar", 4]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Rune_helm"
    },
    {
        name: "Dragon helm",
        sailing: 96,
        construction: 86,
        materials: [
            ["Rosewood plank", 2],
            ["Dragon metal sheet", 4]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Dragon_helm"
    }
];

const HELMS_SKIFF = [
    {
        name: "Bronze helm",
        sailing: 1,
        construction: 1,
        materials: [
            ["Plank", 3],
            ["Bronze bar", 6]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Bronze_helm"
    },
    {
        name: "Iron helm",
        sailing: 17,
        construction: 14,
        materials: [
            ["Oak plank", 3],
            ["Iron bar", 6]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Iron_helm"
    },
    {
        name: "Steel helm",
        sailing: 38,
        construction: 30,
        materials: [
            ["Teak plank", 3],
            ["Steel bar", 6]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Steel_helm"
    },
    {
        name: "Mithril helm",
        sailing: 55,
        construction: 47,
        materials: [
            ["Mahogany plank", 3],
            ["Mithril bar", 6]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Mithril_helm"
    },
    {
        name: "Adamant helm",
        sailing: 72,
        construction: 59,
        materials: [
            ["Camphor plank", 3],
            ["Adamantite bar", 6]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Adamant_helm"
    },
    {
        name: "Rune helm",
        sailing: 87,
        construction: 81,
        materials: [
            ["Ironwood plank", 3],
            ["Runite bar", 6]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Rune_helm"
    },
    {
        name: "Dragon helm",
        sailing: 96,
        construction: 86,
        materials: [
            ["Rosewood plank", 3],
            ["Dragon metal sheet", 6]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Dragon_helm"
    }
];

const HELMS_SLOOP = [
    {
        name: "Bronze helm",
        sailing: 1,
        construction: 1,
        materials: [
            ["Plank", 4],
            ["Bronze bar", 8]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Bronze_helm"
    },
    {
        name: "Iron helm",
        sailing: 17,
        construction: 14,
        materials: [
            ["Oak plank", 4],
            ["Iron bar", 8]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Iron_helm"
    },
    {
        name: "Steel helm",
        sailing: 38,
        construction: 30,
        materials: [
            ["Teak plank", 4],
            ["Steel bar", 8]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Steel_helm"
    },
    {
        name: "Mithril helm",
        sailing: 55,
        construction: 47,
        materials: [
            ["Mahogany plank", 4],
            ["Mithril bar", 8]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Mithril_helm"
    },
    {
        name: "Adamant helm",
        sailing: 72,
        construction: 59,
        materials: [
            ["Camphor plank", 4],
            ["Adamantite bar", 8]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Adamant_helm"
    },
    {
        name: "Rune helm",
        sailing: 87,
        construction: 81,
        materials: [
            ["Ironwood plank", 4],
            ["Runite bar", 8]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Rune_helm"
    },
    {
        name: "Dragon helm",
        sailing: 96,
        construction: 86,
        materials: [
            ["Rosewood plank", 4],
            ["Dragon metal sheet", 8]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Dragon_helm"
    }
];

const MASTS_AND_SAILS_RAFT = [
    {
        name: "Wooden mast and linen sails",
        sailing: 1,
        construction: 1,
        materials: [
            ["Logs", 5],
            ["Bronze nails", 20],
            ["Bolt of linen", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Wooden_mast_and_linen_sails"
    },
    {
        name: "Oak mast and linen sails",
        sailing: 24,
        construction: 11,
        materials: [
            ["Oak logs", 5],
            ["Iron nails", 20],
            ["Bolt of linen", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Oak_mast_and_linen_sails"
    },
    {
        name: "Teak mast and canvas sails",
        sailing: 36,
        construction: 26,
        materials: [
            ["Teak logs", 5],
            ["Steel nails", 20],
            ["Bolt of canvas", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Teak_mast_and_canvas_sails"
    },
    {
        name: "Mahogany mast and canvas sails",
        sailing: 52,
        construction: 45,
        materials: [
            ["Mahogany logs", 5],
            ["Mithril nails", 20],
            ["Bolt of canvas", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Mahogany_mast_and_canvas_sails"
    },
    {
        name: "Camphor mast and canvas sails",
        sailing: 68,
        construction: 60,
        materials: [
            ["Camphor logs", 5],
            ["Adamantite nails", 20],
            ["Bolt of canvas", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Camphor_mast_and_canvas_sails"
    },
    {
        name: "Ironwood mast and cotton sails",
        sailing: 83,
        construction: 77,
        materials: [
            ["Ironwood logs", 5],
            ["Rune nails", 20],
            ["Bolt of cotton", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Ironwood_mast_and_cotton_sails"
    },
    {
        name: "Rosewood mast and cotton sails",
        sailing: 94,
        construction: 85,
        materials: [
            ["Rosewood logs", 5],
            ["Dragon nails", 20],
            ["Bolt of cotton", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Rosewood_mast_and_cotton_sails"
    }
];

const MASTS_AND_SAILS_SKIFF = [
    {
        name: "Wooden mast and linen sails",
        sailing: 1,
        construction: 1,
        materials: [
            ["Logs", 10],
            ["Bronze nails", 40],
            ["Bolt of linen", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Wooden_mast_and_linen_sails"
    },
    {
        name: "Oak mast and linen sails",
        sailing: 24,
        construction: 11,
        materials: [
            ["Oak logs", 10],
            ["Iron nails", 40],
            ["Bolt of linen", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Oak_mast_and_linen_sails"
    },
    {
        name: "Teak mast and canvas sails",
        sailing: 36,
        construction: 26,
        materials: [
            ["Teak logs", 10],
            ["Steel nails", 40],
            ["Bolt of canvas", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Teak_mast_and_canvas_sails"
    },
    {
        name: "Mahogany mast and canvas sails",
        sailing: 52,
        construction: 45,
        materials: [
            ["Mahogany logs", 10],
            ["Mithril nails", 40],
            ["Bolt of canvas", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Mahogany_mast_and_canvas_sails"
    },
    {
        name: "Camphor mast and canvas sails",
        sailing: 68,
        construction: 60,
        materials: [
            ["Camphor logs", 10],
            ["Adamantite nails", 40],
            ["Bolt of canvas", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Camphor_mast_and_canvas_sails"
    },
    {
        name: "Ironwood mast and cotton sails",
        sailing: 83,
        construction: 77,
        materials: [
            ["Ironwood logs", 10],
            ["Rune nails", 40],
            ["Bolt of cotton", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Ironwood_mast_and_cotton_sails"
    },
    {
        name: "Rosewood mast and cotton sails",
        sailing: 94,
        construction: 85,
        materials: [
            ["Rosewood logs", 10],
            ["Dragon nails", 40],
            ["Bolt of cotton", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Rosewood_mast_and_cotton_sails"
    }
];

const MASTS_AND_SAILS_SLOOP = [
    {
        name: "Wooden mast and linen sails",
        sailing: 1,
        construction: 1,
        materials: [
            ["Logs", 15],
            ["Bronze nails", 60],
            ["Bolt of linen", 10]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Wooden_mast_and_linen_sails"
    },
    {
        name: "Oak mast and linen sails",
        sailing: 24,
        construction: 11,
        materials: [
            ["Oak logs", 15],
            ["Iron nails", 60],
            ["Bolt of linen", 10]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Oak_mast_and_linen_sails"
    },
    {
        name: "Teak mast and canvas sails",
        sailing: 36,
        construction: 26,
        materials: [
            ["Teak logs", 15],
            ["Steel nails", 60],
            ["Bolt of canvas", 10]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Teak_mast_and_canvas_sails"
    },
    {
        name: "Mahogany mast and canvas sails",
        sailing: 52,
        construction: 45,
        materials: [
            ["Mahogany logs", 15],
            ["Mithril nails", 60],
            ["Bolt of canvas", 10]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Mahogany_mast_and_canvas_sails"
    },
    {
        name: "Camphor mast and canvas sails",
        sailing: 68,
        construction: 60,
        materials: [
            ["Camphor logs", 15],
            ["Adamantite nails", 60],
            ["Bolt of canvas", 10]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Camphor_mast_and_canvas_sails"
    },
    {
        name: "Ironwood mast and cotton sails",
        sailing: 83,
        construction: 77,
        materials: [
            ["Ironwood logs", 15],
            ["Rune nails", 60],
            ["Bolt of cotton", 10]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Ironwood_mast_and_cotton_sails"
    },
    {
        name: "Rosewood mast and cotton sails",
        sailing: 94,
        construction: 85,
        materials: [
            ["Rosewood logs", 15],
            ["Dragon nails", 60],
            ["Bolt of cotton", 10]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Rosewood_mast_and_cotton_sails"
    }
];

const KEELS_SKIFF = [
    {
        name: "Bronze keel",
        sailing: 15,
        construction: 1,
        materials: [
            ["Bronze keel parts", 10]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Bronze_keel"
    },
    {
        name: "Iron keel",
        sailing: 22,
        construction: 17,
        materials: [
            ["Iron keel parts", 10]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Iron_keel"
    },
    {
        name: "Steel keel",
        sailing: 39,
        construction: 32,
        materials: [
            ["Steel keel parts", 10],
            ["Lead bar", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Steel_keel"
    },
    {
        name: "Mithril keel",
        sailing: 54,
        construction: 50,
        materials: [
            ["Mithril keel parts", 10],
            ["Lead bar", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Mithril_keel"
    },
    {
        name: "Adamant keel",
        sailing: 66,
        construction: 62,
        materials: [
            ["Adamant keel parts", 10],
            ["Lead bar", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Adamant_keel"
    },
    {
        name: "Rune keel",
        sailing: 85,
        construction: 78,
        materials: [
            ["Rune keel parts", 10],
            ["Cupronickel bar", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Rune_keel"
    },
    {
        name: "Dragon keel",
        sailing: 97,
        construction: 87,
        materials: [
            ["Dragon keel parts", 10],
            ["Cupronickel bar", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Dragon_keel"
    }
];

const KEELS_SLOOP = [
    {
        name: "Bronze keel",
        sailing: 15,
        construction: 1,
        materials: [
            ["Large bronze keel parts", 16]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Bronze_keel"
    },
    {
        name: "Iron keel",
        sailing: 22,
        construction: 17,
        materials: [
            ["Large iron keel parts", 16]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Iron_keel"
    },
    {
        name: "Steel keel",
        sailing: 39,
        construction: 32,
        materials: [
            ["Large steel keel parts", 16],
            ["Lead bar", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Steel_keel"
    },
    {
        name: "Mithril keel",
        sailing: 54,
        construction: 50,
        materials: [
            ["Large mithril keel parts", 16],
            ["Lead bar", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Mithril_keel"
    },
    {
        name: "Adamant keel",
        sailing: 66,
        construction: 62,
        materials: [
            ["Large adamant keel parts", 16],
            ["Lead bar", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Adamant_keel"
    },
    {
        name: "Rune keel",
        sailing: 85,
        construction: 78,
        materials: [
            ["Large rune keel parts", 16],
            ["Cupronickel bar", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Rune_keel"
    },
    {
        name: "Dragon keel",
        sailing: 97,
        construction: 87,
        materials: [
            ["Large dragon keel parts", 16],
            ["Cupronickel bar", 5]
        ],
        wiki: "https://oldschool.runescape.wiki/w/Dragon_keel"
    }
];

const FACILITIES = [
    {
        name: "Bronze cannon",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 28,
        construction: 21,
        crew: "1 Privateering",
        materials: [
            ["Plank", 4],
            ["Bronze nails", 16],
            ["Bronze bar", 8]
        ],
        xp: 157,
        wiki: "https://oldschool.runescape.wiki/w/Bronze_cannon"
    },
    {
        name: "Iron cannon",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 35,
        construction: 28,
        crew: "2 Privateering",
        materials: [
            ["Oak plank", 4],
            ["Iron nails", 16],
            ["Iron bar", 8]
        ],
        xp: 328,
        wiki: "https://oldschool.runescape.wiki/w/Iron_cannon"
    },
    {
        name: "Steel cannon",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 47,
        construction: 39,
        crew: "2 Privateering",
        materials: [
            ["Teak plank", 4],
            ["Steel nails", 16],
            ["Steel bar", 8]
        ],
        xp: 526,
        wiki: "https://oldschool.runescape.wiki/w/Steel_cannon"
    },
    {
        name: "Mithril cannon",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 57,
        construction: 50,
        crew: "3 Privateering",
        materials: [
            ["Mahogany plank", 4],
            ["Mithril nails", 16],
            ["Mithril bar", 8]
        ],
        xp: 816,
        wiki: "https://oldschool.runescape.wiki/w/Mithril_cannon"
    },
    {
        name: "Adamant cannon",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 69,
        construction: 61,
        crew: "3 Privateering",
        materials: [
            ["Camphor plank", 4],
            ["Adamantite nails", 16],
            ["Adamantite bar", 8]
        ],
        xp: 986,
        wiki: "https://oldschool.runescape.wiki/w/Adamant_cannon"
    },
    {
        name: "Rune cannon",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 80,
        construction: 76,
        crew: "4 Privateering",
        materials: [
            ["Ironwood plank", 4],
            ["Rune nails", 16],
            ["Runite bar", 8]
        ],
        xp: 1359,
        wiki: "https://oldschool.runescape.wiki/w/Rune_cannon"
    },
    {
        name: "Dragon cannon",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 92,
        construction: 84,
        crew: "4 Privateering",
        materials: [
            ["Rosewood plank", 4],
            ["Dragon nails", 16],
            ["Dragon sheet", 8],
            ["Dragon cannon barrel", 1]
        ],
        xp: 1586,
        wiki: "https://oldschool.runescape.wiki/w/Dragon_cannon"
    },

    {
        name: "Bronze salvaging hook",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 15,
        construction: 1,
        crew: "1 Deckhandiness",
        materials: [
            ["Plank", 4],
            ["Bronze nails", 16],
            ["Bronze bar", 6],
            ["Rope", 1]
        ],
        xp: 151,
        wiki: "https://oldschool.runescape.wiki/w/Bronze_salvaging_hook"
    },
    {
        name: "Iron salvaging hook",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 21,
        construction: 9,
        crew: "1 Deckhandiness",
        materials: [
            ["Oak planks", 4],
            ["Iron nails", 16],
            ["Iron bars", 6],
            ["Rope", 1]
        ],
        xp: 312,
        wiki: "https://oldschool.runescape.wiki/w/Iron_salvaging_hook"
    },
    {
        name: "Steel salvaging hook",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 27,
        construction: 18,
        crew: "1 Deckhandiness",
        materials: [
            ["Teak planks", 4],
            ["Steel nails", 16],
            ["Steel bars", 6],
            ["Rope", 1],
            ["Lead bars", 3]
        ],
        xp: 499,
        wiki: "https://oldschool.runescape.wiki/w/Steel_salvaging_hook"
    },
    {
        name: "Mithril salvaging hook",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 44,
        construction: 30,
        crew: "2 Deckhandiness",
        materials: [
            ["Mahogany planks", 4],
            ["Mithril nails", 16],
            ["Mithril bars", 6],
            ["Rope", 1],
            ["Lead bars", 3]
        ],
        xp: 769,
        wiki: "https://oldschool.runescape.wiki/w/Mithril_salvaging_hook"
    },
    {
        name: "Adamant salvaging hook",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 59,
        construction: 52,
        crew: "2 Deckhandiness",
        materials: [
            ["Camphor planks", 4],
            ["Adamantite nails", 16],
            ["Adamantite bars", 6],
            ["Rope", 1],
            ["Lead bars", 3]
        ],
        xp: 919,
        wiki: "https://oldschool.runescape.wiki/w/Adamant_salvaging_hook"
    },
    {
        name: "Rune salvaging hook",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 74,
        construction: 66,
        crew: "3 Deckhandiness",
        materials: [
            ["Ironwood planks", 4],
            ["Rune nails", 16],
            ["Runite bars", 6],
            ["Rope", 1],
            ["Lead bars", 4],
            ["Cupronickel bars", 4]
        ],
        xp: 1233,
        wiki: "https://oldschool.runescape.wiki/w/Rune_salvaging_hook"
    },
    {
        name: "Dragon salvaging hook",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 86,
        construction: 78,
        crew: "4 Deckhandiness",
        materials: [
            ["Rosewood planks", 4],
            ["Dragon nails", 16],
            ["Dragon sheets", 6],
            ["Rope", 1],
            ["Cupronickel bars", 4],
            ["Broken dragon hook", 1]
        ],
        xp: 1537,
        wiki: "https://oldschool.runescape.wiki/w/Dragon_salvaging_hook"
    },

    {
        name: "Rope trawling net",
        boat: [
            "Skiff",
            "Sloop"
        ],
        sailing: 56,
        construction: 45,
        crew: "1 Deckhandiness",
        materials: [
            ["Ropes", 7],
            ["Teak planks", 4],
            ["Steel bars", 4],
            ["Lead bars", 2]
        ],
        xp: 458,
        wiki: "https://oldschool.runescape.wiki/w/Rope_trawling_net"
    },
    {
        name: "Linen trawling net",
        boat: [
            "Skiff",
            "Sloop"
        ],
        sailing: 65,
        construction: 61,
        crew: "2 Deckhandiness",
        materials: [
            ["Linen yarn", 6],
            ["Rope", 1],
            ["Mahogany planks", 4],
            ["Mithril bars", 4],
            ["Lead bars", 2]
        ],
        xp: 783,
        wiki: "https://oldschool.runescape.wiki/w/Linen_trawling_net"
    },
    {
        name: "Hemp trawling net",
        boat: [
            "Skiff",
            "Sloop"
        ],
        sailing: 76,
        construction: 65,
        crew: "3 Deckhandiness",
        materials: [
            ["Hemp yarn", 6],
            ["Ropes", 1],
            ["Camphor planks", 4],
            ["Adamantite bars", 4],
            ["Cupronickel bars", 2],
            ["Ray barbs", 4]
        ],
        xp: 1003,
        wiki: "https://oldschool.runescape.wiki/w/Hemp_trawling_net"
    },
    {
        name: "Cotton trawling net",
        boat: [
            "Skiff",
            "Sloop"
        ],
        sailing: 84,
        construction: 73,
        crew: "4 Deckhandiness",
        materials: [
            ["Cotton yarn", 6],
            ["Ropes", 1],
            ["Ironwood planks", 4],
            ["Runite bars", 4],
            ["Cupronickel bars", 2],
            ["Ray barbs", 8]
        ],
        xp: 1289,
        wiki: "https://oldschool.runescape.wiki/w/Cotton_trawling_net"
    },

    {
        name: "Basic cargo hold",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 1,
        construction: 1,
        crew: "20 (raft), 30 (skiff), 40 (sloop)",
        materials: [
            ["Planks", 8],
            ["Bronze nails", 32]
        ],
        xp: 232,
        wiki: "https://oldschool.runescape.wiki/w/Basic_cargo_hold"
    },
    {
        name: "Oak cargo hold",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 18,
        construction: 11,
        crew: "30 (raft), 45 (skiff), 60 (sloop)",
        materials: [
            ["Oak planks", 8],
            ["Iron nails", 32]
        ],
        xp: 491,
        wiki: "https://oldschool.runescape.wiki/w/Oak_cargo_hold"
    },
    {
        name: "Teak cargo hold",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 29,
        construction: 21,
        crew: "45 (raft), 60 (skiff), 90 (sloop)",
        materials: [
            ["Teak planks", 8],
            ["Steel nails", 32],
            ["Lead bars", 3]
        ],
        xp: 738,
        wiki: "https://oldschool.runescape.wiki/w/Teak_cargo_hold"
    },
    {
        name: "Mahogany cargo hold",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 46,
        construction: 41,
        crew: "60 (raft), 90 (skiff), 120 (sloop)",
        materials: [
            ["Mahogany planks", 8],
            ["Mithril nails", 32],
            ["Lead bars", 3]
        ],
        xp: 1153,
        wiki: "https://oldschool.runescape.wiki/w/Mahogany_cargo_hold"
    },
    {
        name: "Camphor cargo hold",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 60,
        construction: 53,
        crew: "80 (raft), 120 (skiff), 160 (sloop)",
        materials: [
            ["Camphor planks", 8],
            ["Adamantite nails", 32],
            ["Lead bars", 3]
        ],
        xp: 1326,
        wiki: "https://oldschool.runescape.wiki/w/Camphor_cargo_hold"
    },
    {
        name: "Ironwood cargo hold",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 80,
        construction: 77,
        crew: "105 (raft), 150 (skiff), 210 (sloop)",
        materials: [
            ["Ironwood planks", 8],
            ["Rune nails", 32],
            ["Cupronickel bars", 3]
        ],
        xp: 1492,
        wiki: "https://oldschool.runescape.wiki/w/Ironwood_cargo_hold"
    },
    {
        name: "Rosewood cargo hold",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 89,
        construction: 84,
        crew: "120 (raft), 180 (skiff), 240 (sloop)",
        materials: [
            ["Rosewood planks", 8],
            ["Dragon nails", 32],
            ["Cupronickel bars", 3]
        ],
        xp: 1634,
        wiki: "https://oldschool.runescape.wiki/w/Rosewood_cargo_hold"
    },
        {
        name: "Range",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 16,
        construction: 6,
        crew: "N/A",
        materials: [
            ["Steel bars", 4],
            ["Charcoal", 2],
            ["Tinderbox", 1]
        ],
        xp: 90,
        wiki: "https://oldschool.runescape.wiki/w/Range_(facility)"
    },
    {
        name: "Keg",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 33,
        construction: 25,
        crew: "N/A",
        materials: [
            ["Oak planks", 5],
            ["Iron nails", 20],
            ["Barrel stand", 1]
        ],
        xp: 313,
        wiki: "https://oldschool.runescape.wiki/w/Keg_(facility)"
    },
    {
        name: "Innoculation station",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 40,
        construction: 37,
        crew: "N/A",
        materials: [
            ["Teak planks", 8],
            ["Steel nails", 32],
            ["Relicym's balm(4)", 6]
        ],
        xp: 765,
        wiki: "https://oldschool.runescape.wiki/w/Innoculation_station"
    },
    {
        name: "Salvaging station",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 42,
        construction: 34,
        crew: "N/A",
        materials: [
            ["Teak planks", 4],
            ["Steel nails", 16]
        ],
        xp: 366,
        wiki: "https://oldschool.runescape.wiki/w/Salvaging_station_(facility)"
    },
    {
        name: "Chum station",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 56,
        construction: 45,
        crew: "1 Deckhandiness",
        materials: [
            ["Mahogany planks", 10],
            ["Mithril nails", 40],
            ["Steel bars", 2],
            ["Fishing bait", 1000],
            ["Knife", 1]
        ],
        xp: 1522,
        wiki: "https://oldschool.runescape.wiki/w/Chum_station"
    },
    {
        name: "Bosun's workbench",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 63,
        construction: 54,
        crew: "N/A",
        materials: [
            ["Camphor planks", 6],
            ["Adamantite nails", 24],
            ["Lead bars", 5]
        ],
        xp: 1003,
        wiki: "https://oldschool.runescape.wiki/w/Bosun%27s_workbench"
    },
    {
        name: "Advanced chum station",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 68,
        construction: 61,
        crew: "2 Deckhandiness",
        materials: [
            ["Camphor planks", 10],
            ["Adamantite nails", 40],
            ["Steel bars", 2],
            ["Fishing bait", 1000],
            ["Knife", 1]
        ],
        xp: 1738,
        wiki: "https://oldschool.runescape.wiki/w/Advanced_chum_station"
    },
    {
        name: "Chum spreader",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 82,
        construction: 74,
        crew: "2 Deckhandiness",
        materials: [
            ["Ironwood planks", 10],
            ["Rune nails", 40],
            ["Cupronickel bars", 5],
            ["Fishing bait", 10000],
            ["Narwhal horn knife", 1]
        ],
        xp: 2028,
        wiki: "https://oldschool.runescape.wiki/w/Chum_spreader"
    },
    {
        name: "Wind catcher",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 53,
        construction: 47,
        crew: "2 Deckhandiness",
        materials: [
            ["Teak planks", 4],
            ["Steel nails", 16],
            ["Steel bars", 8],
            ["Lead bars", 4],
            ["Air runes", 10000],
            ["Captured wind mote", 1]
        ],
        xp: 741,
        wiki: "https://oldschool.runescape.wiki/w/Wind_catcher"
    },
    {
        name: "Crystal extractor",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 73,
        construction: 67,
        crew: "N/A",
        materials: [
            ["Ironwood planks", 6],
            ["Cupronickel bars", 5],
            ["Magic stones", 2],
            ["Heart of ithell", 1]
        ],
        xp: 3066,
        wiki: "https://oldschool.runescape.wiki/w/Crystal_extractor"
    },
    {
        name: "Gale catcher",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 79,
        construction: 70,
        crew: "3 Deckhandiness",
        materials: [
            ["Camphor planks", 4],
            ["Adamantite nails", 16],
            ["Adamantite bars", 8],
            ["Cupronickel bars", 4],
            ["Air runes", 25000],
            ["Captured wind mote", 1],
            ["Swift albatross feather", 5]
        ],
        xp: 1517,
        wiki: "https://oldschool.runescape.wiki/w/Gale_catcher"
    },
    {
        name: "Anchor",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 37,
        construction: 29,
        crew: "N/A",
        materials: [
            ["Steel bars", 8],
            ["Lead bars", 6],
            ["Rope", 1]
        ],
        xp: 176,
        wiki: "https://oldschool.runescape.wiki/w/Anchor_(facility)"
    },
    {
        name: "Ballistic attractor",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 50,
        construction: 44,
        crew: "N/A",
        materials: [
            ["Mahogany planks", 10],
            ["Water runes", 5000],
            ["Law runes", 1000],
            ["Lead bars", 5],
            ["Steel bars", 5]
        ],
        xp: 2141,
        wiki: "https://oldschool.runescape.wiki/w/Ballistic_attractor"
    },
    {
        name: "Teleport focus",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 55,
        construction: 49,
        crew: "N/A",
        materials: [
            ["Mahogany planks", 8],
            ["Mithril nails", 32],
            ["Lead bars", 4],
            ["Magic stone", 1]
        ],
        xp: 2154,
        wiki: "https://oldschool.runescape.wiki/w/Teleport_focus_(facility)"
    },
    {
        name: "Fathom stone",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 70,
        construction: 62,
        crew: "N/A",
        materials: [
            ["Camphor planks", 10],
            ["Adamantite nails", 40],
            ["Molten glass", 4],
            ["Cupronickel bars", 2]
        ],
        xp: 1652,
        wiki: "https://oldschool.runescape.wiki/w/Fathom_stone"
    },
    {
        name: "Greater teleport focus",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 75,
        construction: 69,
        crew: "N/A",
        materials: [
            ["Ironwood planks", 8],
            ["Rune nails", 32],
            ["Cupronickel bars", 4],
            ["Magic stones", 2],
            ["Bottled storm", 1]
        ],
        xp: 3582,
        wiki: "https://oldschool.runescape.wiki/w/Greater_teleport_focus_(facility)"
    },
    {
        name: "Fathom pearl",
        boat: [
            "Raft",
            "Skiff",
            "Sloop"
        ],
        sailing: 91,
        construction: 83,
        crew: "N/A",
        materials: [
            ["Rosewood planks", 10],
            ["Dragon nails", 40],
            ["Dragon sheets", 2],
            ["Echo pearl", 1]
        ],
        xp: 2307,
        wiki: "https://oldschool.runescape.wiki/w/Fathom_pearl"
    }
];

const FLAGS = [
    {
        name: "Storm chaser's flag",
        sailing: 30,
        construction: 20,
        materials: [
            ["Oak logs", 4],
            ["Rope", 1]
        ],
        requirements: {
            equipment: [
                {
                    type: "helm",
                    minimum: "Iron helm"
                },
                {
                    type: "mast",
                    minimum: "Oak mast and linen sails"
                }
            ]
        },
        xp: 34,
        wiki: "https://oldschool.runescape.wiki/w/Storm_chaser's_flag"
    },
    {
        name: "Swamp cruiser's flag",
        sailing: 55,
        construction: 20,
        materials: [
            ["Oak logs", 4],
            ["Rope", 1]
        ],
        requirements: {
            equipment: [
                {
                    type: "facility",
                    exact: "Innoculation station"
                },
                {
                    type: "helm",
                    minimum: "Mithril helm"
                }
            ]
        },
        xp: 34,
        wiki: "https://oldschool.runescape.wiki/w/Swamp_cruiser's_flag"
    },
    {
        name: "Crystal glider's flag",
        sailing: 72,
        construction: 20,
        materials: [
            ["Oak logs", 4],
            ["Rope", 1]
        ],
        requirements: {
            equipment: [
                {
                    type: "keel",
                    minimum: "Adamant keel"
                }
            ]
        },
        xp: 34,
        wiki: "https://oldschool.runescape.wiki/w/Crystal_glider's_flag"
    }
]

const TRIMS_SKIFF = [
    {
        name: "Inky trim",
        sailing: 25,
        construction: 20,
        materials: [
            ["Inky paint", 1]
        ],
        xp: 20,
        wiki: "https://oldschool.runescape.wiki/w/Trims"
    },
    {
        name: "Shark trim",
        sailing: 25,
        construction: 20,
        materials: [
            ["Shark paint", 1]
        ],
        xp: 20,
        wiki: "https://oldschool.runescape.wiki/w/Trims"
    },
    {
        name: "Barracuda trim",
        sailing: 25,
        construction: 20,
        materials: [
            ["Barracuda paint", 1]
        ],
        xp: 20,
        wiki: "https://oldschool.runescape.wiki/w/Trims"
    },
    {
        name: "Salvor's trim",
        sailing: 73,
        construction: 20,
        materials: [
            ["Salvor's paint", 1]
        ],
        xp: 20,
        wiki: "https://oldschool.runescape.wiki/w/Trims"
    },
    {
        name: "Guthixian trim",
        sailing: 72,
        construction: 20,
        materials: [],
        requirements: {
            equipment: [
                {
                    type: "facility",
                    exact: "Innoculation station"
                },
                {
                    type: "keel",
                    minimum: "Adamant helm"
                }
            ],
            rulesAll: [
                "canGoDiving",
                "canCompletePryingTimes",
                "canCompleteCurrentAffairs"
            ]
        },
        xp: 20,
        wiki: "https://oldschool.runescape.wiki/w/Guthixian_trim"
    },
    {
        name: "Saradominist trim",
        sailing: 38,
        construction: 20,
        materials: [],
        requirements: {
            equipment: [
                {
                    type: "helm",
                    minimum: "Iron helm"
                },
                {
                    type: "mast",
                    minimum: "Oak mast and linen sails"
                }
            ],
            rulesAll: [
                "canGoDiving",
                "canCompletePryingTimes",
                "canCompleteCurrentAffairs"
            ]
        },
        xp: 20,
        wiki: "https://oldschool.runescape.wiki/w/Saradominist_trim"
    },
    {
        name: "Zamorakian  trim",
        sailing: 60,
        construction: 20,
        materials: [
            ["Rope", 1]
        ],
        requirements: {
            rulesAll: [
                "canGoDiving",
                "canCompletePryingTimes",
                "canCompleteCurrentAffairs"
            ]
        },
        xp: 20,
        wiki: "https://oldschool.runescape.wiki/w/Zamorakian_trim"
    },
    {
        name: "Armadylean trim",
        sailing: 78,
        construction: 20,
        materials: [],
        requirements: {
            equipment: [
                {
                    type: "facility",
                    exact: "Eternal brazier"
                }
            ],
            rulesAll: [
                "canGoDiving",
                "canCompletePryingTimes",
                "canCompleteCurrentAffairs"
            ]
        },
        xp: 20,
        wiki: "https://oldschool.runescape.wiki/w/Armadylean_trim"
    },
    {
        name: "Merchant's trim",
        sailing: 25,
        construction: 20,
        materials: [
            ["Merchant's paint", 1]
        ],
        xp: 20,
        wiki: "https://oldschool.runescape.wiki/w/Merchant's_trim"
    },
    {
        name: "Angler's trim",
        sailing: 25,
        construction: 20,
        materials: [
            ["Angler's paint", 1]
        ],
        xp: 20,
        wiki: "https://oldschool.runescape.wiki/w/Angler's_trim"
    },
    {
        name: "Sandy trim",
        sailing: 63,
        construction: 20,
        materials: [],
        xp: 20,
        wiki: "https://oldschool.runescape.wiki/w/Sandy_trim"
    }
];

const TRIMS_SLOOP = [
    {
        name: "Inky trim",
        sailing: 25,
        construction: 20,
        materials: [
            ["Inky paint", 2]
        ],
        xp: 20,
        wiki: "https://oldschool.runescape.wiki/w/Trims"
    },
    {
        name: "Shark trim",
        sailing: 25,
        construction: 20,
        materials: [
            ["Shark paint", 2]
        ],
        xp: 20,
        wiki: "https://oldschool.runescape.wiki/w/Trims"
    },
    {
        name: "Barracuda trim",
        sailing: 25,
        construction: 20,
        materials: [
            ["Barracuda paint", 2]
        ],
        xp: 20,
        wiki: "https://oldschool.runescape.wiki/w/Trims"
    },
    {
        name: "Salvor's trim",
        sailing: 73,
        construction: 20,
        materials: [
            ["Salvor's paint", 2]
        ],
        xp: 20,
        wiki: "https://oldschool.runescape.wiki/w/Trims"
    },
    {
        name: "Guthixian trim",
        sailing: 72,
        construction: 20,
        materials: [],
        requirements: {
            equipment: [
                {
                    type: "facility",
                    exact: "Innoculation station"
                },
                {
                    type: "keel",
                    minimum: "Adamant helm"
                }
            ],
            rulesAll: [
                "canGoDiving",
                "canCompletePryingTimes",
                "canCompleteCurrentAffairs"
            ]
        },
        xp: 20,
        wiki: "https://oldschool.runescape.wiki/w/Guthixian_trim"
    },
    {
        name: "Saradominist trim",
        sailing: 38,
        construction: 20,
        materials: [],
        requirements: {
            equipment: [
                {
                    type: "helm",
                    minimum: "Iron helm"
                },
                {
                    type: "mast",
                    minimum: "Oak mast and linen sails"
                }
            ],
            rulesAll: [
                "canGoDiving",
                "canCompletePryingTimes",
                "canCompleteCurrentAffairs"
            ]
        },
        xp: 20,
        wiki: "https://oldschool.runescape.wiki/w/Saradominist_trim"
    },
    {
        name: "Zamorakian  trim",
        sailing: 60,
        construction: 20,
        materials: [
            ["Rope", 1]
        ],
        requirements: {
            rulesAll: [
                "canGoDiving",
                "canCompletePryingTimes",
                "canCompleteCurrentAffairs"
            ]
        },
        xp: 20,
        wiki: "https://oldschool.runescape.wiki/w/Zamorakian_trim"
    },
    {
        name: "Armadylean trim",
        sailing: 78,
        construction: 20,
        materials: [],
        requirements: {
            equipment: [
                {
                    type: "facility",
                    exact: "Eternal brazier"
                }
            ],
            rulesAll: [
                "canGoDiving",
                "canCompletePryingTimes",
                "canCompleteCurrentAffairs"
            ]
        },
        xp: 20,
        wiki: "https://oldschool.runescape.wiki/w/Armadylean_trim"
    },
    {
        name: "Merchant's trim",
        sailing: 25,
        construction: 20,
        materials: [
            ["Merchant's paint", 2]
        ],
        xp: 20,
        wiki: "https://oldschool.runescape.wiki/w/Merchant's_trim"
    },
    {
        name: "Angler's trim",
        sailing: 25,
        construction: 20,
        materials: [
            ["Angler's paint", 2]
        ],
        xp: 20,
        wiki: "https://oldschool.runescape.wiki/w/Angler's_trim"
    },
    {
        name: "Sandy trim",
        sailing: 63,
        construction: 20,
        materials: [],
        xp: 20,
        wiki: "https://oldschool.runescape.wiki/w/Sandy_trim"
    }
];

const BRAZIERS = [
    {
        name: "Eternal brazier",
        sailing: 78,
        construction: 72,
        materials: [
            ["Ironwood plank", 4],
            ["Rune nails", 16],
            ["Runite bar", 6],
            ["Cupronickel bar", 6],
            ["Te salt", 250],
            ["Efh salt", 250],
            ["Urt salt", 250]
        ],
        xp: 1373,
        wiki: "https://oldschool.runescape.wiki/w/Eternal_brazier"
    }
];

/*
 * Ocean hazards.
 *
 * The hazard state is deliberately independent of ship-building.
 *
 * Green:
 *   Required equipment is present and skill levels are met.
 *
 * Purple:
 *   Required equipment is present, but one or more skill levels are
 *   too low.
 *
 * Red:
 *   Required equipment is missing.
 *
 * If both equipment AND levels are missing, equipment takes precedence
 * and the hazard is red, because the player is missing an actual item.
 */
const OCEAN_HAZARDS = [
    {
        name: "Stormy seas",
        equipment: [
            {
                type: "mast",
                minimum: "Oak mast and linen sails"
            }
        ],
        skills: {
            Sailing: 24,
            Construction: 11
        },
        wiki: "https://oldschool.runescape.wiki/w/Sailing_hazards"
    },
    {
        name: "Jagged reefs",
        equipment: [],
        skills: {},
        impossible: true,
        note: "There is currently no equipment that prevents this hazard.",
        wiki: "https://oldschool.runescape.wiki/w/Sailing_hazards"
    },
    {
        name: "Fetid waters",
        equipment: [
            "Innoculation station"
        ],
        skills: {
            Sailing: 40,
            Construction: 37
        },
        wiki: "https://oldschool.runescape.wiki/w/Sailing_hazards"
    },
    {
        name: "Crystal-flecked waters",
        equipment: [
            {
                type: "keel",
                minimum: "Adamant keel"
            }
        ],
        skills: {
            Sailing: 66,
            Construction: 62
        },
        wiki: "https://oldschool.runescape.wiki/w/Sailing_hazards"
    },
    {
        name: "Tangled kelp",
        equipment: [
            {
                type: "helm",
                minimum: "Adamant helm"
            }
        ],
        skills: {
            Sailing: 72,
            Construction: 59
        },
        wiki: "https://oldschool.runescape.wiki/w/Sailing_hazards"
    },
    {
        name: "Icy seas",
        equipment: [
            "Eternal brazier"
        ],
        skills: {
            Sailing: 78,
            Construction: 72
        },
        wiki: "https://oldschool.runescape.wiki/w/Sailing_hazards"
    },
    {
        name: "Sunbaked seas",
        equipment: [],
        skills: {},
        impossible: true,
        note: "There is currently no equipment that prevents this hazard.",
        wiki: "https://oldschool.runescape.wiki/w/Sailing_hazards"
    },
    {
        name: "Profane waters",
        equipment: [],
        skills: {},
        impossible: true,
        note: "There is currently no equipment that prevents this hazard.",
        wiki: "https://oldschool.runescape.wiki/w/Sailing_hazards"
    },
    {
        name: "Scalding seas",
        equipment: [],
        skills: {},
        impossible: true,
        note: "There is currently no equipment that prevents this hazard.",
        wiki: "https://oldschool.runescape.wiki/w/Sailing_hazards"
    },
    {
        name: "Cursed seas",
        equipment: [],
        skills: {},
        impossible: true,
        note: "There is currently no equipment that prevents this hazard.",
        wiki: "https://oldschool.runescape.wiki/w/Sailing_hazards"
    }
];

const EQUIPMENT_TIERS = {
    mast: [
        "Wooden mast and linen sails",
        "Oak mast and linen sails",
        "Teak mast and canvas sails",
        "Mahogany mast and canvas sails",
        "Camphor mast and canvas sails",
        "Ironwood mast and cotton sails",
        "Rosewood mast and cotton sails"
    ],

    helm: [
        "Bronze helm",
        "Iron helm",
        "Steel helm",
        "Mithril helm",
        "Adamant helm",
        "Rune helm",
        "Dragon helm"
    ],

    keel: [
        "Bronze keel",
        "Iron keel",
        "Steel keel",
        "Mithril keel",
        "Adamant keel",
        "Rune keel",
        "Dragon keel"
    ]
};

function hasMinimumEquipment(
    requirement,
    itemNameMap,
    obtainedSet,
    rolledSet
) {
    const tiers = EQUIPMENT_TIERS[requirement.type];

    if (!tiers) {
        return false;
    }

    const minimumIndex = tiers.indexOf(requirement.minimum);

    if (minimumIndex === -1) {
        return false;
    }

    for (let i = minimumIndex; i < tiers.length; i++) {
        const item = findItemByName(tiers[i], itemNameMap);

        if (!item) continue;

        if (itemIsAvailable(item, obtainedSet, rolledSet)) {
            return true;
        }
    }

    return false;
}

/*
 * Some of the material names in the Wiki tables are pluralized,
 * while items.json may use the singular form, or vice versa.
 *
 * We first try the exact name, then a normalized singular/plural form.
 */
function normalizeText(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}

function normalizeMaterialCandidates(name) {
    const original = String(name || "").trim();
    const candidates = new Set([original]);

    if (original.endsWith("s")) {
        candidates.add(original.slice(0, -1));
    } else {
        candidates.add(`${original}s`);
    }

    /*
     * Common Sailing table wording differences.
     */
    const aliases = {
        "Planks": ["Plank"],
        "Oak planks": ["Oak plank"],
        "Teak planks": ["Teak plank"],
        "Mahogany planks": ["Mahogany plank"],
        "Camphor planks": ["Camphor plank"],
        "Ironwood planks": ["Ironwood plank"],
        "Rosewood planks": ["Rosewood plank"],

        "Bronze bars": ["Bronze bar"],
        "Iron bars": ["Iron bar"],
        "Steel bars": ["Steel bar"],
        "Mithril bars": ["Mithril bar"],
        "Adamantite bars": ["Adamantite bar"],
        "Runite bars": ["Runite bar"],
        "Cupronickel bars": ["Cupronickel bar"],
        "Lead bars": ["Lead bar"],

        "Bronze nails": ["Bronze nails"],
        "Iron nails": ["Iron nails"],
        "Steel nails": ["Steel nails"],
        "Mithril nails": ["Mithril nails"],
        "Adamantite nails": ["Adamantite nails"],
        "Rune nails": ["Rune nails"],
        "Dragon nails": ["Dragon nails"],

        "Ropes": ["Rope"],
        "Ropes ": ["Rope"],
        "Ray barbs": ["Ray barb"],
        "Dragon sheets": ["Dragon sheet"],
        "Dragon metal sheet": ["Dragon metal sheet"],
        "Te salt": ["Te salt"],
        "Efh salt": ["Efh salt"],
        "Urt salt": ["Urt salt"]
    };

    for (const alias of aliases[original] || []) {
        candidates.add(alias);
    }

    return [...candidates];
}

function buildItemNameMap() {
    const map = new Map();

    for (const item of fileStore.items || []) {
        const key = normalizeText(item?.name);
        if (!key) continue;

        if (!map.has(key)) {
            map.set(key, []);
        }

        map.get(key).push(item);
    }

    return map;
}

function findItemByName(name, itemNameMap) {
    for (const candidate of normalizeMaterialCandidates(name)) {
        const items = itemNameMap.get(normalizeText(candidate));

        if (items?.length) {
            return items[0];
        }
    }

    return null;
}

function itemIsAvailable(item, obtainedSet, rolledSet) {
    if (!item) return false;

    return (
        rolledSet.has(item.id) &&
        obtainedSet.has(item.id)
    );
}

function getPlayerSkillLevel(skill) {
    return Number(fileStore.player?.levels?.[skill] ?? 1);
}

function hasCompletedQuest(questName) {
    return Number(fileStore.player?.quests?.[questName] ?? 0) === 2;
}

function hasSailingItem(itemId, obtainedSet, rolledSet) {
    return (
        rolledSet.has(itemId) &&
        obtainedSet.has(itemId)
    );
}

function hasUsableAxe(obtainedSet, rolledSet) {
    const woodcuttingLevel = getPlayerSkillLevel("Woodcutting");

    const axes = [
        { id: 1351, level: 1 },   // Bronze axe
        { id: 1349, level: 1 },   // Iron axe
        { id: 1353, level: 6 },   // Steel axe
        { id: 1361, level: 11 },  // Black axe
        { id: 1355, level: 21 },  // Mithril axe
        { id: 1357, level: 31 },  // Adamant axe
        { id: 1359, level: 41 },  // Rune axe
        { id: 6739, level: 61 },  // Dragon axe
        { id: 20011, level: 61 }, // 3rd age axe
        { id: 13241, level: 61 }, // Infernal axe
        { id: 23862, level: 71 }  // Crystal axe
    ];

    return axes.any(
        (axe) =>
            woodcuttingLevel >= axe.level &&
            hasSailingItem(axe.id, obtainedSet, rolledSet)
    );
}

function canGoDivingSailing(obtainedSet, rolledSet) {
    return (
        hasCompletedQuest("Recipe for Disaster - Another Cook's Quest") &&
        hasSailingItem(6667, obtainedSet, rolledSet)
    );
}

function canCompletePryingTimesSailing(obtainedSet, rolledSet) {
    return (
        getPlayerSkillLevel("Smithing") >= 30 &&
        getPlayerSkillLevel("Sailing") >= 12 &&
        hasCompletedQuest("Pandemonium") &&
        hasCompletedQuest("The Knight's Sword") &&
        hasSailingItem(2347, obtainedSet, rolledSet) &&
        hasSailingItem(2325, obtainedSet, rolledSet) &&
        hasSailingItem(2353, obtainedSet, rolledSet)
    );
}

function canCompleteCurrentAffairsSailing(obtainedSet, rolledSet) {
    return (
        getPlayerSkillLevel("Sailing") >= 22 &&
        getPlayerSkillLevel("Fishing") >= 10 &&
        hasCompletedQuest("Pandemonium") &&
        hasSailingItem(973, obtainedSet, rolledSet)
    );
}

function canCompleteTroubledTortugansSailing(obtainedSet, rolledSet) {
    return (
        getPlayerSkillLevel("Slayer") >= 51 &&
        getPlayerSkillLevel("Construction") >= 48 &&
        getPlayerSkillLevel("Sailing") >= 45 &&
        getPlayerSkillLevel("Hunter") >= 45 &&
        getPlayerSkillLevel("Woodcutting") >= 40 &&
        getPlayerSkillLevel("Crafting") >= 34 &&
        hasCompletedQuest("Pandemonium") &&
        hasUsableAxe(obtainedSet, rolledSet) &&
        hasSailingItem(401, obtainedSet, rolledSet)
    );
}

const sailingRules = {
    canGoDiving: canGoDivingSailing,
    canCompletePryingTimes: canCompletePryingTimesSailing,
    canCompleteCurrentAffairs: canCompleteCurrentAffairsSailing,
    canCompleteTroubledTortugans: canCompleteTroubledTortugansSailing
};

function getMissingSkills(requirements) {
    const missing = [];

    for (const [skill, required] of Object.entries(requirements || {})) {
        const current = getPlayerSkillLevel(skill);

        if (current < required) {
            missing.push({
                skill,
                required,
                current
            });
        }
    }

    return missing;
}

function getMissingEquipmentRequirements(
    requirements,
    itemNameMap,
    obtainedSet,
    rolledSet
) {
    const missing = [];

    for (const requirement of requirements || []) {
        let available = false;

        if (requirement?.type && requirement?.minimum) {
            available = hasMinimumEquipment(
                requirement,
                itemNameMap,
                obtainedSet,
                rolledSet
            );
        } else if (requirement?.exact) {
            const item = findItemByName(
                requirement.exact,
                itemNameMap
            );

            available = itemIsAvailable(
                item,
                obtainedSet,
                rolledSet
            );
        }

        if (!available) {
            missing.push(requirement);
        }
    }

    return missing;
}

function getMaterialStatus(materials, itemNameMap, obtainedSet, rolledSet) {
    const resolved = [];
    const missing = [];

    for (const [name, quantity] of materials) {
        const item = findItemByName(name, itemNameMap);
        const available = itemIsAvailable(item, obtainedSet, rolledSet);

        const material = {
            name,
            quantity,
            item,
            available
        };

        resolved.push(material);

        if (!available) {
            missing.push(material);
        }
    }

    return {
        resolved,
        missing,
        allAvailable: missing.length === 0
    };
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function wikiLink(name, url) {
    if (!url) {
        return escapeHtml(name);
    }

    return `
        <a
            href="${escapeHtml(url)}"
            target="_blank"
            rel="noopener noreferrer"
        >${escapeHtml(name)}</a>
    `;
}

function renderSkillRequirements(item) {
    return `
        <div class="sailing-requirements">
            <span>
                Sailing:
                <strong>${escapeHtml(item.sailing)}</strong>
            </span>
            <span>
                Construction:
                <strong>${escapeHtml(item.construction)}</strong>
            </span>
        </div>
    `;
}

function renderMaterials(materialStatus) {
    return `
        <div class="sailing-materials">
            <div class="sailing-materials-title">Materials</div>
            <div class="sailing-material-list">
                ${materialStatus.resolved.map((material) => `
                    <span
                        class="sailing-material ${material.available ? "sailing-material--available" : "sailing-material--missing"}"
                        title="${
                            material.available
                                ? "Available"
                                : material.item
                                    ? "Not yet rolled and obtained"
                                    : "Item not found in items.json"
                        }"
                    >
                        <span class="sailing-material-indicator">
                            ${material.available ? "✓" : "✗"}
                        </span>
                        ${escapeHtml(material.quantity)} ${escapeHtml(material.name)}
                    </span>
                `).join("")}
            </div>
        </div>
    `;
}

function getBuildStatus(item, itemNameMap, obtainedSet, rolledSet) {
    const materialStatus = getMaterialStatus(
        item.materials || [],
        itemNameMap,
        obtainedSet,
        rolledSet
    );

    const missingSkills = getMissingSkills({
        Sailing: item.sailing,
        Construction: item.construction
    });

    const missingEquipment = getMissingEquipmentRequirements(
        item.requirements?.equipment,
        itemNameMap,
        obtainedSet,
        rolledSet
    );

    const missingRules = [];

    for (const rule of item.requirements?.rulesAll || []) {
        const ruleFunction = sailingRules[rule];

        if (!ruleFunction) {
            console.warn(`Unknown Sailing requirement rule: ${rule}`);
            missingRules.push(rule);
            continue;
        }

        if (!ruleFunction(obtainedSet, rolledSet)) {
            missingRules.push(rule);
        }
    }

    let state = "available";

    if (materialStatus.missing.length) {
        state = "missing-materials";
    } else if (missingEquipment.length) {
        state = "missing-equipment";
    } else if (missingSkills.length) {
        state = "missing-levels";
    } else if (missingRules.length) {
        state = "missing-rules";
    }

    return {
        state,
        materialStatus,
        missingSkills,
        missingEquipment,
        missingRules
    };
}

function renderBuildRow(
    item,
    itemNameMap,
    obtainedSet,
    rolledSet,
    extra = {}
) {
    const status = getBuildStatus(
        item,
        itemNameMap,
        obtainedSet,
        rolledSet
    );

    const missingSkillText = status.missingSkills.length
        ? `
            <div class="sailing-missing sailing-missing--levels">
                ${status.missingSkills.map((entry) => `
                    Requires ${escapeHtml(entry.required)} ${escapeHtml(entry.skill)}
                    <span class="sailing-current">
                        (currently ${escapeHtml(entry.current)})
                    </span>
                `).join("<br>")}
            </div>
        `
        : "";

    const missingMaterialText = status.materialStatus.missing.length
        ? `
            <div class="sailing-missing sailing-missing--materials">
                Missing:
                ${status.materialStatus.missing
                    .map((material) => escapeHtml(material.name))
                    .join(", ")}
            </div>
        `
        : "";

    const missingEquipmentText = status.missingEquipment.length
    ? `
        <div class="sailing-missing sailing-missing--equipment">
            Requires:
            ${status.missingEquipment
                .map((requirement) =>
                    escapeHtml(
                        requirement.minimum
                            ? `${requirement.minimum} or better`
                            : requirement.exact
                    )
                )
                .join(", ")}
        </div>
    `
    : "";

    const missingRulesText = status.missingRules.length
        ? `
            <div class="sailing-missing sailing-missing--rules">
                Requires:
                ${status.missingRules
                    .map((rule) => escapeHtml(rule))
                    .join(", ")}
            </div>
        `
        : "";

    const crewHtml = extra.crew
        ? `
            <div class="sailing-extra">
                Crew:
                <strong>${escapeHtml(extra.crew)}</strong>
            </div>
        `
        : "";

    const xpHtml = Number.isFinite(Number(extra.xp))
        ? `
            <div class="sailing-extra">
                XP:
                <strong>${escapeHtml(extra.xp)}</strong>
            </div>
        `
        : "";

    return `
        <article class="sailing-option sailing-option--${status.state}">
            <div class="sailing-option-header">
                <h3>
                    ${wikiLink(item.name, item.wiki)}
                </h3>

                <span class="sailing-status">
                    ${
                        status.state === "available"
                            ? "Available"
                            : status.state === "missing-levels"
                                ? "Level required"
                                : status.state === "missing-equipment"
                                    ? "Boat equipment required"
                                    : status.state === "missing-rules"
                                        ? "Quest required"
                                        : "Missing materials"
                    }
                </span>
            </div>

            ${renderSkillRequirements(item)}

            ${crewHtml}
            ${xpHtml}

            ${renderMaterials(status.materialStatus)}

            ${missingSkillText}
            ${missingEquipmentText}
            ${missingRulesText}
            ${missingMaterialText}
        </article>
    `;
}

function renderSection(
    title,
    items,
    itemNameMap,
    obtainedSet,
    rolledSet,
    boat = null
) {
    const filteredItems =
        boat && title === "Facilities"
            ? items.filter(
                (item) =>
                    Array.isArray(item.boat) &&
                    item.boat.includes(boat)
            )
            : items;

    const id = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    return `
        <details class="sailing-subsection" id="${escapeHtml(id)}">
            <summary class="sailing-subsection-header">
                <span>${escapeHtml(title)}</span>
            </summary>

            <div class="sailing-options">
                ${filteredItems.map((item) =>
                    renderBuildRow(
                        item,
                        itemNameMap,
                        obtainedSet,
                        rolledSet
                    )
                ).join("")}
            </div>
        </details>
    `;
}

function renderShipSection(
    title,
    sections,
    itemNameMap,
    obtainedSet,
    rolledSet,
    id
) {
    return `
        <details class="sailing-ship-section card" id="${escapeHtml(id)}">
            <summary class="sailing-ship-header">
                <h2>${escapeHtml(title)}</h2>
            </summary>

            <div class="sailing-ship-content">
                ${sections.map((section) => {
                    return renderSection(
                        section.title,
                        section.items,
                        itemNameMap,
                        obtainedSet,
                        rolledSet,
                        title
                    );
                }).join("")}
            </div>
        </details>
    `;
}

function getHazardState(
    hazard,
    itemNameMap,
    obtainedSet,
    rolledSet
) {
    const missingEquipment = [];

    for (const equipmentRequirement of hazard.equipment || []) {
        let equipmentAvailable = false;

        if (typeof equipmentRequirement === "string") {
            // Exact item requirement
            const item = findItemByName(
                equipmentRequirement,
                itemNameMap
            );

            equipmentAvailable = itemIsAvailable(
                item,
                obtainedSet,
                rolledSet
            );

        } else if (equipmentRequirement?.type && equipmentRequirement?.minimum) {
            // Tiered equipment requirement
            equipmentAvailable = hasMinimumEquipment(
                equipmentRequirement,
                itemNameMap,
                obtainedSet,
                rolledSet
            );
        }

        if (!equipmentAvailable) {
            // whatever your existing code does when something is missing
            missingEquipment.push(
                typeof equipmentRequirement === "string"
                    ? equipmentRequirement
                    : `${equipmentRequirement.minimum} or better`
            );
        }
    }

    const missingSkills = getMissingSkills(hazard.skills || {});

    if (hazard.impossible) {
        return {
            state: "red",
            missingEquipment,
            missingSkills,
            reason: hazard.note || "There is no equipment that prevents this hazard."
        };
    }

    if (missingEquipment.length) {
        return {
            state: "red",
            missingEquipment,
            missingSkills,
            reason: null
        };
    }

    if (missingSkills.length) {
        return {
            state: "purple",
            missingEquipment,
            missingSkills,
            reason: null
        };
    }

    return {
        state: "green",
        missingEquipment: [],
        missingSkills: [],
        reason: null
    };
}

function renderHazard(
    hazard,
    itemNameMap,
    obtainedSet,
    rolledSet
) {
    const result = getHazardState(
        hazard,
        itemNameMap,
        obtainedSet,
        rolledSet
    );

    let detail = "";

    if (result.state === "green") {
        detail = `
            <div class="sailing-hazard-message sailing-hazard-message--green">
                Safe to enter.
            </div>
        `;
    }

    if (result.state === "purple") {
        detail = `
            <div class="sailing-hazard-message sailing-hazard-message--purple">
                Requires:
                ${result.missingSkills.map((entry) => `
                    ${escapeHtml(entry.required)} ${escapeHtml(entry.skill)}
                    <span class="sailing-current">
                        (currently ${escapeHtml(entry.current)})
                    </span>
                `).join(", ")}
            </div>
        `;
    }

    if (result.state === "red") {
        const equipmentText = result.missingEquipment.length
            ? `
                <div>
                    Missing:
                    ${result.missingEquipment
                        .map((entry) => escapeHtml(entry))
                        .join(", ")}
                </div>
            `
            : "";

        const skillText = result.missingSkills.length
            ? `
                <div>
                    Also requires:
                    ${result.missingSkills.map((entry) => `
                        ${escapeHtml(entry.required)} ${escapeHtml(entry.skill)}
                    `).join(", ")}
                </div>
            `
            : "";

        detail = `
            <div class="sailing-hazard-message sailing-hazard-message--red">
                ${equipmentText}
                ${skillText}
                ${
                    result.reason
                        ? `<div>${escapeHtml(result.reason)}</div>`
                        : ""
                }
            </div>
        `;
    }

    return `
        <article class="sailing-hazard sailing-hazard--${result.state}">
            <div class="sailing-hazard-header">
                <h3>
                    ${wikiLink(hazard.name, hazard.wiki)}
                </h3>

                <span class="sailing-hazard-status">
                    ${
                        result.state === "green"
                            ? "Safe"
                            : result.state === "purple"
                                ? "Higher level required"
                                : "Equipment required"
                    }
                </span>
            </div>

            <div class="sailing-hazard-details">
                            <div>
                <strong>Equipment:</strong>
                ${
                    hazard.equipment?.length
                        ? hazard.equipment.map((equipment) => {
                            if (typeof equipment === "string") {
                                return escapeHtml(equipment);
                            }

                            if (equipment?.type && equipment?.minimum) {
                                return escapeHtml(
                                    `${equipment.minimum} or better`
                                );
                            }

                            return "";
                        }).join(", ")
                        : "None"
                }
            </div>

                <div>
                    <strong>Skill requirements:</strong>
                    ${
                        Object.keys(hazard.skills || {}).length
                            ? Object.entries(hazard.skills)
                                .map(([skill, level]) =>
                                    `${escapeHtml(skill)} ${escapeHtml(level)}`
                                )
                                .join(", ")
                            : "None"
                    }
                </div>
            </div>

            ${detail}
        </article>
    `;
}

/*
 * Best boat visual representation
 *
 * Shows only the boat with the greatest number of currently
 * available upgrades.
 *
 * Boat availability:
 * - Raft: always available
 * - Skiff: Sailing 15+
 * - Sloop: Sailing 50+
 *
 * For normal upgrade sections, if no upgrade is currently available,
 * the first entry is shown as a fallback.
 *
 * Facilities, Flags, Trims and Braziers remain blank when nothing
 * is currently available.
 */

const BEST_BOAT_FALLBACK_SECTIONS = new Set([
    "Hull",
    "Helm",
    "Mast and sails",
    "Keel"
]);

const BEST_BOAT_OPTIONAL_SECTIONS = new Set([
    "Facilities",
    "Flags",
    "Trims",
    "Braziers"
]);

function getAvailableBoatSections(
    ship,
    itemNameMap,
    obtainedSet,
    rolledSet
) {
    return ship.sections.map((section) => {
        let items = section.items || [];

        // Facilities are already filtered by boat in renderSection().
        // Do the same here for the best-boat display.
        if (section.title === "Facilities") {
            items = items.filter(
                (item) =>
                    Array.isArray(item.boat) &&
                    item.boat.includes(ship.title)
            );
        }

        const availableItems = items.filter((item) => {
            const status = getBuildStatus(
                item,
                itemNameMap,
                obtainedSet,
                rolledSet
            );

            return status.state === "available";
        });

        return {
            ...section,
            items,
            availableItems
        };
    });
}

function getBestBoatForPlayer(
    ships,
    itemNameMap,
    obtainedSet,
    rolledSet
) {
    const sailingLevel = getPlayerSkillLevel("Sailing");

    const eligibleShips = ships.filter((ship) => {
        if (ship.title === "Raft") {
            return true;
        }

        if (ship.title === "Skiff") {
            return sailingLevel >= 15;
        }

        if (ship.title === "Sloop") {
            return sailingLevel >= 50;
        }

        return false;
    });

    let bestShip = null;
    let bestAvailableCount = -1;

    for (const ship of eligibleShips) {
        const sections = getAvailableBoatSections(
            ship,
            itemNameMap,
            obtainedSet,
            rolledSet
        );

        const availableCount = sections.reduce(
            (total, section) =>
                total + section.availableItems.length,
            0
        );

        /*
         * If two boats have the same number of available upgrades,
         * prefer the larger boat.
         *
         * Raft < Skiff < Sloop
         */
        const boatRank = {
            Raft: 1,
            Skiff: 2,
            Sloop: 3
        }[ship.title] || 0;

        const bestBoatRank = bestShip
            ? ({
                Raft: 1,
                Skiff: 2,
                Sloop: 3
            }[bestShip.title] || 0)
            : 0;

        if (
            availableCount > bestAvailableCount ||
            (
                availableCount === bestAvailableCount &&
                boatRank > bestBoatRank
            )
        ) {
            bestShip = {
                ...ship,
                sections
            };

            bestAvailableCount = availableCount;
        }
    }

    return bestShip;
}

function getBestUpgradeForSection(section) {
    /*
     * For Hull, Helm, Mast and sails, and Keel:
     *
     * 1. Use the highest available upgrade.
     * 2. If nothing is available, use the first entry.
     */
    if (section.availableItems.length) {
        return section.availableItems[
            section.availableItems.length - 1
        ];
    }

    if (
        BEST_BOAT_FALLBACK_SECTIONS.has(section.title) &&
        section.items.length
    ) {
        return section.items[0];
    }

    return null;
}

function renderBestBoatUpgradeCell(section) {
    /*
     * Facilities, Flags, Trims and Braziers:
     * Show every currently available item.
     * If none are available, show "None".
     */
    if (BEST_BOAT_OPTIONAL_SECTIONS.has(section.title)) {
        if (!section.availableItems.length) {
            return `
                <td class="sailing-best-boat-cell">
                    <div class="sailing-best-boat-none">
                        None
                    </div>
                </td>
            `;
        }

        return `
            <td class="sailing-best-boat-cell">
                <div class="sailing-best-boat-upgrade-list">
                    ${section.availableItems.map((item) => `
                        <div class="sailing-best-boat-upgrade-name">
                            ${escapeHtml(item.name)}
                        </div>
                    `).join("")}
                </div>
            </td>
        `;
    }

    /*
     * Hull, Helm, Mast and sails, and Keel:
     * Show the best available upgrade.
     * If no upgrade is available, show the first/base entry.
     */
    const item = getBestUpgradeForSection(section);

    if (!item) {
        return `
            <td class="sailing-best-boat-cell">
                <div class="sailing-best-boat-none">
                    None
                </div>
            </td>
        `;
    }

    /*
     * The first item in these sections is ALWAYS considered
     * the base option.
     *
     * This is intentionally NOT based on availability.
     * Therefore, even if the player can build Bronze keel,
     * Bronze keel will still say "Base option" when it is the
     * first entry for that boat.
     */
    const baseItem = section.items[0];
    const isBaseOption = item === baseItem;

    return `
        <td class="sailing-best-boat-cell">
            <div class="sailing-best-boat-upgrade">
                <div class="sailing-best-boat-upgrade-name">
                    ${escapeHtml(item.name)}
                </div>

                <div class="sailing-best-boat-upgrade-status ${
                    isBaseOption
                        ? "sailing-best-boat-upgrade-status--fallback"
                        : "sailing-best-boat-upgrade-status--best"
                }">
                    ${
                        isBaseOption
                            ? "Base option"
                            : "Best upgrade"
                    }
                </div>
            </div>
        </td>
    `;
}

function renderBestBoatVisual(
    ships,
    itemNameMap,
    obtainedSet,
    rolledSet
) {
    const bestBoat = getBestBoatForPlayer(
        ships,
        itemNameMap,
        obtainedSet,
        rolledSet
    );

    if (!bestBoat) {
        return "";
    }

    const sections = bestBoat.sections;

    return `
        <section class="sailing-best-boat card">
            <div class="sailing-best-boat-header">
                <h2>
                    Best boat: ${escapeHtml(bestBoat.title)}
                </h2>

                <div class="sailing-best-boat-image-wrapper">
                    <img
                        src="/images/sailing/${encodeURIComponent(bestBoat.title)}.png"
                        alt="${escapeHtml(bestBoat.title)}"
                        class="sailing-best-boat-image"
                    >
                </div>
            </div>

            <div class="sailing-best-boat-upgrades-title">
                Available upgrades
            </div>

            <div class="sailing-best-boat-table-wrapper">
                <table class="sailing-best-boat-table">
                    <thead>
                        <tr>
                            ${sections.map((section) => `
                                <th scope="col">
                                    ${escapeHtml(section.title)}
                                </th>
                            `).join("")}
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            ${sections.map((section) =>
                                renderBestBoatUpgradeCell(section)
                            ).join("")}
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    `;
}

function getPageStyles() {
    return `
        <style>
            /* =========================================================
            Sailing page
            ========================================================= */

            .sailing-page {
                width: auto;
                max-width: 100%;
                margin: 0 1rem;
                box-sizing: border-box;
            }

            .sailing-intro {
                margin-bottom: 1.5rem;
            }

            .sailing-lockout {
                max-width: 800px;
                margin: 2rem auto;
                padding: 2rem;
                border: 3px solid var(--border-color-darker);
                border-radius: 6px;
                text-align: center;
            }

            .sailing-lockout-message {
                font-size: 1.2rem;
                font-style: italic;
            }


            /* =========================================================
            Shared section styling
            ========================================================= */

            .sailing-best-boat,
            .sailing-ship-section,
            .sailing-hazards-section {
                overflow: hidden;
                border: 3px solid var(--border-color-darker);
                border-radius: 6px;
            }

            .sailing-best-boat,
            .sailing-ship-section {
                margin-bottom: 1.5rem;
            }

            .sailing-hazards-section {
                margin: 1.5rem 0;
            }

            /* =========================================================
            Collapsible section headers
            ========================================================= */

            .sailing-section-header,
            .sailing-ship-header,
            .sailing-subsection-header {
                cursor: pointer;
                list-style: none;
            }

            .sailing-section-header::-webkit-details-marker,
            .sailing-ship-header::-webkit-details-marker,
            .sailing-subsection-header::-webkit-details-marker {
                display: none;
            }

            .sailing-section-header::before,
            .sailing-ship-header::before,
            .sailing-subsection-header::before {
                content: "▶";
                display: inline-block;
                margin-right: 0.65rem;
                font-size: 0.8em;
                transition: transform 0.15s ease;
            }

            details[open] > .sailing-section-header::before,
            details[open] > .sailing-ship-header::before,
            details[open] > .sailing-subsection-header::before {
                transform: rotate(90deg);
            }


            /* =========================================================
            Main section headers
            ========================================================= */

            .sailing-section-header,
            .sailing-ship-header {
                display: flex;
                align-items: center;
                padding: 1rem 1.25rem;
            }

            .sailing-section-header {
                border-bottom: 1px solid var(--border-color-darker);
            }

            .sailing-section-header h2,
            .sailing-ship-header h2 {
                margin: 0;
            }

            .sailing-ship-content,
            .sailing-hazards-content {
                padding: 0 1rem 1rem;
            }


            /* =========================================================
            Ship subsections
            ========================================================= */

            .sailing-subsection {
                margin-top: 0.75rem;
                overflow: hidden;
                border: 1px solid var(--border-color-darker);
                border-radius: 6px;
            }

            .sailing-subsection-header {
                display: flex;
                align-items: center;
                padding: 0.8rem 1rem;
                border-bottom: 1px solid var(--border-color-darker);
                background: var(--surface-1);
                font-weight: 700;
            }


            /* =========================================================
            Ship upgrade options
            ========================================================= */

            .sailing-options {
                display: grid;
                grid-template-columns: repeat(
                    auto-fit,
                    minmax(300px, 1fr)
                );
                gap: 0.75rem;
                padding: 1rem;
            }

            .sailing-option {
                padding: 1rem;
                border: 2px solid var(--border-color-darker);
                border-radius: 6px;
                background: var(--surface-1);
            }

            .sailing-option--available {
                border-color: #2e9b55;
            }

            .sailing-option--missing-levels {
                border-color: #9b65d6;
            }

            .sailing-option--missing-materials,
            .sailing-option--missing-rules,
            .sailing-option--missing-equipment {
                border-color: #c94a4a;
            }


            /* =========================================================
            Upgrade / hazard headers
            ========================================================= */

            .sailing-option-header,
            .sailing-hazard-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 0.75rem;
            }

            .sailing-option-header h3,
            .sailing-hazard-header h3 {
                margin: 0;
                font-size: 1.05rem;
            }

            .sailing-option-header h3 a,
            .sailing-hazard-header h3 a {
                color: inherit;
            }

            .sailing-status,
            .sailing-hazard-status {
                flex: 0 0 auto;
                padding: 0.25rem 0.5rem;
                border-radius: 999px;
                font-size: 0.8rem;
                font-weight: 700;
            }

            .sailing-option--available .sailing-status {
                color: #2e9b55;
            }

            .sailing-option--missing-levels .sailing-status {
                color: #9b65d6;
            }

            .sailing-option--missing-materials .sailing-status,
            .sailing-option--missing-rules .sailing-status,
            .sailing-option--missing-equipment .sailing-status {
                color: #c94a4a;
            }


            /* =========================================================
            Requirements and materials
            ========================================================= */

            .sailing-requirements {
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
                margin-top: 0.75rem;
                font-size: 0.9rem;
            }

            .sailing-extra {
                margin-top: 0.5rem;
                font-size: 0.9rem;
            }

            .sailing-materials {
                margin-top: 1rem;
            }

            .sailing-materials-title {
                margin-bottom: 0.4rem;
                font-weight: 700;
            }

            .sailing-material-list {
                display: flex;
                flex-wrap: wrap;
                gap: 0.4rem;
            }

            .sailing-material {
                display: inline-flex;
                align-items: center;
                gap: 0.3rem;
                padding: 0.25rem 0.5rem;
                border-radius: 6px;
                font-size: 0.82rem;
            }

            .sailing-material--available {
                background: rgba(46, 155, 85, 0.14);
            }

            .sailing-material--missing {
                background: rgba(201, 74, 74, 0.14);
            }

            .sailing-material-indicator {
                font-weight: 800;
            }

            .sailing-material--available .sailing-material-indicator {
                color: #2e9b55;
            }

            .sailing-material--missing .sailing-material-indicator {
                color: #c94a4a;
            }

            .sailing-missing {
                margin-top: 0.75rem;
                padding: 0.6rem;
                border-radius: 6px;
                font-size: 0.85rem;
            }

            .sailing-missing--levels {
                background: rgba(155, 101, 214, 0.12);
            }

            .sailing-missing--materials {
                background: rgba(201, 74, 74, 0.12);
            }

            .sailing-current {
                opacity: 0.75;
            }


            /* =========================================================
            Best boat
            ========================================================= */

            .sailing-best-boat {
                padding: 1.25rem;
            }

            .sailing-best-boat-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1.5rem;
                margin-bottom: 1rem;
            }

            .sailing-best-boat-header h2 {
                margin: 0;
            }

            .sailing-best-boat-image-wrapper {
                display: flex;
                flex: 0 0 auto;
                align-items: center;
                justify-content: center;
            }

            .sailing-best-boat-image {
                display: block;
                width: auto;
                max-width: 180px;
                max-height: 140px;
                object-fit: contain;
            }

            .sailing-best-boat-upgrades-title {
                margin-bottom: 0.75rem;
                font-size: 1.1rem;
                font-weight: 700;
            }

            .sailing-best-boat-table-wrapper {
                width: 100%;
                overflow-x: auto;
            }

            .sailing-best-boat-table {
                width: 100%;
                border-collapse: separate;
                border-spacing: 0;
                table-layout: fixed;
                border: 1px solid var(--border-color-darker);
                border-radius: 6px;
                overflow: hidden;
            }

            .sailing-best-boat-table th {
                padding: 0.65rem;
                border-bottom: 1px solid var(--border-color-darker);
                background: var(--surface-2);
                text-align: center;
                font-weight: 700;
            }

            .sailing-best-boat-table th:not(:last-child),
            .sailing-best-boat-table td:not(:last-child) {
                border-right: 1px solid var(--border-color-darker);
            }

            .sailing-best-boat-cell {
                padding: 0.75rem;
                vertical-align: top;
                text-align: center;
            }

            .sailing-best-boat-upgrade,
            .sailing-best-boat-upgrade-list {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.4rem;
            }

            .sailing-best-boat-upgrade {
                min-height: 60px;
                justify-content: center;
            }

            .sailing-best-boat-upgrade-name {
                font-weight: 600;
                line-height: 1.25;
            }

            .sailing-best-boat-none {
                opacity: 0.6;
                font-style: italic;
            }

            .sailing-best-boat-upgrade-status {
                font-size: 0.75rem;
                font-weight: 700;
                opacity: 0.6;
            }


            /* =========================================================
            Ocean hazards
            ========================================================= */

            .sailing-hazards-intro {
                margin-bottom: 1rem;
            }

            .sailing-hazards {
                display: grid;
                gap: 0.75rem;
            }

            .sailing-hazard {
                padding: 1rem;
                border: 3px solid;
                border-radius: 6px;
            }

            .sailing-hazard--green {
                border-color: #2e9b55;
                background: rgba(46, 155, 85, 0.08);
            }

            .sailing-hazard--purple {
                border-color: #9b65d6;
                background: rgba(155, 101, 214, 0.08);
            }

            .sailing-hazard--red {
                border-color: #c94a4a;
                background: rgba(201, 74, 74, 0.08);
            }

            .sailing-hazard-details {
                display: grid;
                grid-template-columns: repeat(
                    auto-fit,
                    minmax(260px, 1fr)
                );
                gap: 0.5rem 1.5rem;
                margin-top: 0.75rem;
                font-size: 0.9rem;
            }

            .sailing-hazard-message {
                margin-top: 0.75rem;
                padding: 0.6rem;
                border-radius: 6px;
                font-weight: 600;
            }

            .sailing-hazard-message--green {
                background: rgba(46, 155, 85, 0.15);
                color: #2e9b55;
            }

            .sailing-hazard-message--purple {
                background: rgba(155, 101, 214, 0.15);
                color: #9b65d6;
            }

            .sailing-hazard-message--red {
                background: rgba(201, 74, 74, 0.15);
                color: #c94a4a;
            }


            /* =========================================================
            Mobile
            ========================================================= */

            @media (max-width: 700px) {
                .sailing-page {
                    margin-left: 1rem;
                    margin-right: 1rem;
                }

                .sailing-best-boat-header {
                    align-items: flex-start;
                    flex-direction: column;
                }

                .sailing-best-boat-image-wrapper {
                    width: 100%;
                }

                .sailing-best-boat-table {
                    min-width: 700px;
                }

                .sailing-option-header,
                .sailing-hazard-header {
                    align-items: flex-start;
                    flex-direction: column;
                }

                .sailing-options {
                    grid-template-columns: 1fr;
                }
            }
        </style>
    `;
}

export default async function SailingPage() {
    if (
        !fileStore.player ||
        !fileStore.obtained ||
        !fileStore.rolled
    ) {
        return `
            <h1>Sailing</h1>
            <p>
                Please upload your files and player name on the Upload page first.
            </p>
        `;
    }

    await fileStore.ensureItemsLoaded();

    const showProgressAnyway =
        typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).get("showProgress") === "1";

    if (!hasCompletedQuest("Pandemonium") && !showProgressAnyway) {
        return `
            ${getPageStyles()}

            <section class="sailing-page">
                <h1>Sailing</h1>

                <div class="sailing-lockout card">
                    <p class="sailing-lockout-message">
                        Sorry laddie, you need your swimming diploma before you
                        can access a boat.
                    </p>

                    <p>
                        <a href="?showProgress=1">
                            But click here if you want to see your progress anyway
                        </a>
                    </p>
                </div>
            </section>
        `;
    }

    const itemNameMap = buildItemNameMap();

    const obtainedSet = new Set(fileStore.obtained || []);
    const rolledSet = new Set(fileStore.rolled || []);

        const ships = [
    {
        title: "Raft",
        id: "raft",
        sections: [
            {
                title: "Hull",
                items: HULLS_RAFT
            },
            {
                title: "Helm",
                items: HELMS_RAFT
            },
            {
                title: "Mast and sails",
                items: MASTS_AND_SAILS_RAFT
            },
            {
                title: "Facilities",
                items: FACILITIES
            },
            {
                title: "Flags",
                items: FLAGS
            },
            {
                title: "Braziers",
                items: BRAZIERS
            }
        ]
    },
    {
        title: "Skiff",
        id: "skiff",
        sections: [
            {
                title: "Hull",
                items: HULLS_SKIFF
            },
            {
                title: "Helm",
                items: HELMS_SKIFF
            },
            {
                title: "Mast and sails",
                items: MASTS_AND_SAILS_SKIFF
            },
            {
                title: "Keel",
                items: KEELS_SKIFF
            },
            {
                title: "Facilities",
                items: FACILITIES
            },
            {
                title: "Flags",
                items: FLAGS
            },
            {
                title: "Trims",
                items: TRIMS_SKIFF
            },
            {
                title: "Braziers",
                items: BRAZIERS
            }
        ]
    },
    {
        title: "Sloop",
        id: "sloop",
        sections: [
            {
                title: "Hull",
                items: HULLS_SLOOP
            },
            {
                title: "Helm",
                items: HELMS_SLOOP
            },
            {
                title: "Mast and sails",
                items: MASTS_AND_SAILS_SLOOP
            },
            {
                title: "Keel",
                items: KEELS_SLOOP
            },
            {
                title: "Facilities",
                items: FACILITIES
            },
            {
                title: "Flags",
                items: FLAGS
            },
            {
                title: "Trims",
                items: TRIMS_SLOOP
            },
            {
                title: "Braziers",
                items: BRAZIERS
            }
        ]
    }
];

    const shipHtml = ships.map(({ title, id, sections }) =>
        renderShipSection(
            title,
            sections,
            itemNameMap,
            obtainedSet,
            rolledSet,
            id
        )
    ).join("");

    const hazardHtml = OCEAN_HAZARDS.map((hazard) =>
        renderHazard(
            hazard,
            itemNameMap,
            obtainedSet,
            rolledSet
        )
    ).join("");

    const bestBoatHtml = renderBestBoatVisual(
        ships,
        itemNameMap,
        obtainedSet,
        rolledSet
    );

return `
    ${getPageStyles()}

    <section class="sailing-page">

        <header class="sailing-intro">
            <h1>Sailing</h1>

            <p>
                Sweep the decks, hoist the sails, and set course for adventure! Check what things you can build on your ship and which hazards you can traverse!
            </p>
        </header>

        ${bestBoatHtml}

        ${shipHtml}

        <details
            class="sailing-section card sailing-hazards-section"
            id="ocean-hazards"
        >
            <summary class="sailing-section-header sailing-collapsible-header">
                <h2>Ocean Hazards</h2>
            </summary>

            <div class="sailing-hazards-content">
                <div class="sailing-hazards">
                    ${hazardHtml}
                </div>
            </div>
        </details>

    </section>
`;
}