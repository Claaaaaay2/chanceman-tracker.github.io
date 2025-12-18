import { fileStore } from "../storage/fileStore";


export async function Header() {
    const player = fileStore.player;

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
