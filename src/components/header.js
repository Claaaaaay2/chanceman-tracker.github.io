import { fileStore } from "../storage/fileStore";

export async function Header() {
    const loaded = fileStore.obtained && fileStore.rolled

    if (!loaded) {
        return `
        <nav class="header">
            <span class="header-nav">
                <button class="nav-menu-toggle" id="nav-menu-toggle" type="button" aria-expanded="false">
                <span id="nav-current-page">Menu</span>
                <span class="menu-caret" aria-hidden="true">▾</span>
            </button>
            <span class="header-links">
                <a data-link href="/">Home</a><span class="header-separator">|</span>
                <a data-link href="/bug">Report a bug</a>
            </span>
            </span>
        </nav>
        `;
    }

    const player = fileStore.player;

    return `
        <nav class="header">
            <span class="header-nav">
                <button class="nav-menu-toggle" id="nav-menu-toggle" type="button" aria-expanded="false">
                    <span id="nav-current-page">Menu</span>
                    <span class="menu-caret" aria-hidden="true">▾</span>
                </button>
                <span class="header-links">
                    <a data-link href="/items">Items</a><span class="header-separator">|</span>
                <a data-link href="/unlocks">Unlocks</a><span class="header-separator">|</span>
                    <a data-link href="/npcs">NPC drops</a><span class="header-separator">|</span>
                    <a data-link href="/item-history">Item history</a><span class="header-separator">|</span>
                    <a data-link href="/achievement-diaries">Achievement diaries</a><span class="header-separator">|</span>
                    <a data-link href="/clue-steps">Clue steps</a><span class="header-separator">|</span>
                    <a data-link href="/quests">Quests</a><span class="header-separator">|</span>
                    <a data-link href="/reupload">Reupload</a><span class="header-separator">|</span>
                    <a data-link href="/bug">Report a bug</a>
                </span>
            </span>
            <span class="playerName">
                <button id="theme-toggle" title="Toggle dark mode">🌙</button>
                ${player ? `Hello, <strong>${player.name}</strong>` : ""}
            </span>
        </nav>
    `;
}
