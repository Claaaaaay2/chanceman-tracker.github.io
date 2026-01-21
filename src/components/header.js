import { fileStore } from "../storage/fileStore";

export async function Header() {
    const loaded = fileStore.obtained && fileStore.rolled

    if (!loaded) {
        return `
        <nav class="header">
            <span>
                <a data-link href="/">Home</a> |
                <a data-link href="/bug">Report a bug</a>
            </span>
        </nav>
        `;
    }

    const player = fileStore.player;

    return `
        <nav class="header">
            <span>
                <a data-link href="/items">Items</a> |
                <a data-link href="/item-history">Item history</a> |
                <a data-link href="/achievement-diaries">Achievement diaries</a> |
                <a data-link href="/clue-steps">Clue steps</a> |
                <a data-link href="/quests">Quests</a> |
                <a data-link href="/reupload">Reupload</a> |
                <a data-link href="/bug">Report a bug</a>
            </span>
            <span class="playerName">
                <button id="theme-toggle" title="Toggle dark mode">🌙</button>
                ${player ? `Hello, <strong>${player.name}</strong>` : ""}
            </span>
        </nav>
    `;
}
