import{f as e}from"./index-DUsi9hB0.js";function l(){const o=e.obtained&&e.rolled,s=e.player?.name;return`
        <h1>Chanceman Tracker</h1>
        <p>Track your progress, filter for your ruleset, and plan what to chase next.</p>

        <div class="card home-card">
            <h2>Get Started</h2>
            ${o?`<p>Welcome back${s?`, <strong>${s}</strong>`:""}. Your files are loaded.</p>`:"<p>Upload your files to unlock all pages and filters.</p>"}
            <div class="home-actions">
                ${o?`
                        <a data-link class="button-link" href="/items">Go to Items</a>
                        <a data-link class="button-link" href="/reupload">Reupload Files</a>
                    `:`
                        <a data-link class="button-link" href="/upload">Upload Files</a>
                    `}
            </div>
        </div>

        <div class="card home-card">
            <h2>Pages</h2>
            <ul class="home-list">
                <li><strong>Items</strong> - your master list of obtainable, gated, and unobtainable drops.</li>
                <li><strong>Unlocks</strong> - items you have rolled and obtained, grouped by skill tag.</li>
                <li><strong>NPC drops</strong> - each NPC's remaining drops, sortable by drop rate impact.</li>
                <li><strong>Random picker</strong> - roulette-style item and NPC picks for what to chase next.</li>
                <li><strong>Item history</strong> - paired roll/obtain timelines for audits and planning.</li>
                <li><strong>Achievement diaries</strong> - completion and incompletable filters.</li>
                <li><strong>Clue steps</strong> - search and feasibility filters for clue progress.</li>
                <li><strong>Quests</strong> - completion filters and missing item requirements.</li>
                <li><strong>Report a bug</strong> - bugs or wrong data report form, feel free to leave suggestions too.</li>
            </ul>
        </div>

        <div class="card home-card">
            <h2>Filters</h2>
            <ul class="home-list">
                <li><strong>Ironman / F2P</strong> - adapt sources and rules to your account type.</li>
                <li><strong>NPC visibility</strong> - include or exclude specific NPC drops globally.</li>
                <li><strong>Overrides</strong> - preview what lamping a skill would unlock.</li>
                <li><strong>Highlight changes</strong> - optionally glow new items or source changes after filters update.</li>
            </ul>
        </div>

        <div class="card home-card">
            <h2>Quick Refresh</h2>
            <p><strong>Chromium browsers only.</strong> You can connect your files once from the Items page and then refresh them with one click.</p>
            <ul class="home-list">
                <li>Click <strong>Connect files</strong> on Items and select both JSON files.</li>
                <li>Later, click <strong>Refresh files</strong> to reload without reopening the picker.</li>
            </ul>
        </div>
    `}export{l as default};
