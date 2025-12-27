import { fileStore } from "../storage/fileStore";

export async function Header() {
    const player = fileStore.player;

    return `
        <nav class="header">
        <span>
        <a data-link href="/items">Items</a> |
        <a data-link href="/quests">Quests</a> |
        <a data-link href="/reupload">Reupload</a> |
        <a data-link href="/bug">Report a bug</a>
        </span>
        <span class="playerName">
            ${player ? `Hello, <strong>${player.name}</strong>` : ""}
        </span>
        </nav>
    `;
}
