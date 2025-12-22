import { fileStore } from "../storage/fileStore.js";

export default async function ItemsPage() {
    const items = await fetch("/data/items.json").then(r => r.json());
    fileStore.items = items;

    const rolled = fileStore.rolled || [];
    const unlocked = fileStore.unlocked || [];

    window.__itemsPageData = {
        items,
        rolled,
        unlocked
    };

    return `
        <h1>Items</h1>

        <div class="item-filters">
            <input type="text" id="itemSearch" placeholder="Filter items..." />

            <label>
                <input type="checkbox" id="hideRolled">
                Hide rolled
            </label>

            <label>
                <input type="checkbox" id="onlyUnlocked">
                Only unlocked
            </label>

            <label>
                <input type="checkbox" id="onlyObtainable">
                Only obtainable
            </label>

            <label>
                <input type="checkbox" id="hideClueRewardOnly">
                Hide clue items
            </label>

            <label>
                <input type="checkbox" id="allowOthersHouses">
                Allow other players' houses
            </label>

            <label>
                <input type="checkbox" id="hasFlatpacks">
                I play with flatpacks
            </label>

            <label>
                <input type="checkbox" id="hasItemsets">
                I play with item sets
            </label>

            <label>
                <input type="checkbox" id="hasSuperiors">
                'Bigger and Badder' unlocked
            </label>
        </div>

        <p class="marginOneRem">Overrides (e.g. when you've lamped a skill or want to see what lamping one can bring you)</p>
        <div class="skill-filters">
            <label>
                <input type="checkbox" id="overrideWoodcutting">
                Override woodcutting
            </label>

            <label>
                <input type="checkbox" id="overrideMining">
                Override mining
            </label>

            <label>
                <input type="checkbox" id="overrideFishing">
                Override fishing
            </label>

            <label>
                <input type="checkbox" id="overrideCooking">
                Override cooking
            </label>

            <label>
                <input type="checkbox" id="overrideFletching">
                Override fletching
            </label>

            <label>
                <input type="checkbox" id="overrideCrafting">
                Override crafting
            </label>

            <label>
                <input type="checkbox" id="overrideConstruction">
                Override construction
            </label>
        </div>

        <div class="item-grid" id="itemGrid"></div>
    `;
}
