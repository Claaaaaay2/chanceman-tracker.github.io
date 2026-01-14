import { fileStore } from "../storage/fileStore.js";

export default async function ItemsPage() {
    await fileStore.ensureItemsLoaded();

    return `
        <div class="items-header">
            <h1>Items</h1>
            <button id="filter-overrides-toggle" title="Toggle filters and overrides">
                Hide filters and overrides
            </button>
        </div>

        <div class="filters-overrides">
            <div class="item-filters">
                <input type="search" id="itemSearch" placeholder="Filter items..." />

                <label>
                    <input type="checkbox" id="hideRolled">
                    Hide obtained
                </label>

                <label>
                    <input type="checkbox" id="onlyUnlocked">
                    Only rolled
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

                <label>
                    <input type="checkbox" id="isIronman">
                    I am an ironman
                </label>

                <label>
                    <input type="checkbox" id="hideBosses">
                    Hide bosses
                </label>

                <label>
                    <input type="checkbox" id="hideRaids">
                    Hide raids
                </label>

                <label>
                    <input type="checkbox" id="isSlayerLocked">
                    I am slayer locked
                </label>

                <label>
                    <input type="checkbox" id="isHunterRumourLocked">
                    I am hunter rumour locked
                </label>

                <div>
                    Nr of hunter rumours done:
                    <input type="number" id="hunterRumoursCompleted">
                </div>

                <label>
                    <input type="checkbox" id="hideLMS">
                    Hide the LMS shop
                </label>

                <label>
                    <input type="checkbox" id="hideJon">
                    Hide Adventurer Jon
                </label>

                <label>
                    <input type="checkbox" id="isFreeToPlay">
                    I am free to play
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
        </div>

        <div id="itemsLoading" class="items-loading" aria-live="polite">
            <div class="spinner" aria-hidden="true"></div>
            <span>Loading items...</span>
        </div>
        <div class="item-grid" id="itemGrid"></div>
    `;
}
