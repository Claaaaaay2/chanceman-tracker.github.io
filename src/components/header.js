import { playerStore } from "../storage/playerStore.js";

export async function Header() {
    const player = await playerStore.get();

    return `
        <nav class="header">
        <span style="float:right">
            ${player ? `Hello, <strong>${player.name}</strong>` : ""}
        </span>
        <span>
            <a data-link href="/items">Items</a> |
            <a data-link href="/quests">Quests</a> |
            <a data-link href="/reupload">Reupload</a>
        </span>
        </nav>
    `;
}
