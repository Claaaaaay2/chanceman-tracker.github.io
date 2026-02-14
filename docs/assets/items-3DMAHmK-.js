import{f as e}from"./index-CCEyWozr.js";async function t(){return await e.ensureItemsLoaded(),`
        <div class="items-header">
            <h1>Items</h1>
            <button id="filter-overrides-toggle" title="Toggle filters and overrides">
                Hide filters and overrides
            </button>
            <button id="import-item-filters" title="Import item filters from a file">
                Import filters
            </button>
            <input
                type="file"
                id="import-item-filters-input"
                accept="application/json,.json,.txt"
                style="display: none;"
            />
        </div>

        <div class="items-top-filters">
            <input type="search" id="itemSearch" placeholder="Filter items..." />
            <div class="items-top-actions">
                <label class="items-summary-toggle">
                    <input type="checkbox" id="showSectionCounts">
                    Show section counts
                </label>
                <button type="button" id="connectFilesBtn">Connect files</button>
                <button type="button" id="refreshFilesBtn">Refresh files</button>
                <div class="npc-filter" id="npcFilter">
                    <button type="button" id="npcFilterToggle">Hide specific NPCs</button>
                    <div class="npc-filter-panel" id="npcFilterPanel">
                        <input type="search" id="npcFilterSearch" placeholder="Search NPCs...">
                        <div class="npc-filter-actions">
                            <button type="button" id="npcFilterAll">All</button>
                            <button type="button" id="npcFilterNone">None</button>
                        </div>
                        <div class="npc-filter-list" id="npcFilterList"></div>
                        <div class="npc-filter-actions npc-filter-actions--apply">
                            <button type="button" id="npcFilterApply">Apply</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="items-section-summary" id="itemsSectionSummary" hidden></div>

        <div class="filters-overrides">
            <div class="item-filters">

                <label>
                    <input type="checkbox" id="hideObtained">
                    Hide obtained
                </label>

                <label>
                    <input type="checkbox" id="onlyRolled">
                    Only rolled
                </label>

                <label>
                    <input type="checkbox" id="hideUnobtainable">
                    Hide unobtainable
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

                <label id="hideSourcelessItemsRow">
                    <input type="checkbox" id="hideSourcelessItems">
                    Hide sourceless items
                </label>

                <label>
                    <input type="checkbox" id="hasEasyCasCompleted">
                    Easy CA's completed
                </label>

                <label>
                    <input type="checkbox" id="highlightChanges">
                    Highlight new/changed items
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
                    <input type="checkbox" id="overrideFarming">
                    Override farming
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

                <label>
                    <input type="checkbox" id="overrideSmithing">
                    Override smithing
                </label>
            </div>
        </div>

        <div id="itemsLoading" class="items-loading" aria-live="polite">
            <div class="spinner" aria-hidden="true"></div>
            <span>Loading items...</span>
        </div>
        <div class="item-grid" id="itemGrid"></div>
    `}export{t as default};
