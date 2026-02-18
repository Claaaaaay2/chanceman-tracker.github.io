import { fileStore } from "../storage/fileStore";

const CORE_LINKS = [
    { href: "/home", label: "Home" },
    { href: "/items", label: "Items" },
    { href: "/unlocks", label: "Unlocks" },
    { href: "/npcs", label: "NPC drops" },
    { href: "/item-history", label: "Item history" }
];

const PROGRESS_LINKS = [
    { href: "/achievement-diaries", label: "Achievement diaries" },
    { href: "/clue-steps", label: "Clue steps" },
    { href: "/quests", label: "Quests" },
    { href: "/slayer-masters", label: "Slayer masters" }
];

const ACTION_LINKS = [
    { href: "/reupload", label: "Reupload" },
    { href: "/bug", label: "Report a bug" }
];

function isActiveLink(currentPath, href) {
    if (href === "/home") {
        return currentPath === "/" || currentPath === "/home";
    }

    return currentPath === href;
}

function renderLinkList(links, currentPath) {
    return links.map((link) => `
        <a class="${isActiveLink(currentPath, link.href) ? "header-link-active" : ""}" data-link href="${link.href}">
            ${link.label}
        </a>
    `).join("");
}

function renderMenu(menuId, label, links, currentPath) {
    return `
        <span class="header-nav">
            <button
                class="nav-menu-toggle"
                type="button"
                aria-expanded="false"
                aria-controls="${menuId}"
                aria-haspopup="true">
                <span>${label}</span>
                <span class="menu-caret" aria-hidden="true">&#9662;</span>
            </button>
            <span class="header-links" id="${menuId}" hidden>
                ${renderLinkList(links, currentPath)}
            </span>
        </span>
    `;
}

function renderActionLinks(currentPath) {
    return ACTION_LINKS.map((link) => `
        <a
            class="header-action-link ${isActiveLink(currentPath, link.href) ? "header-link-active" : ""}"
            data-link
            href="${link.href}">
            ${link.label}
        </a>
    `).join("");
}

export async function Header() {
    const loaded = fileStore.obtained && fileStore.rolled;
    const player = fileStore.player;
    const currentPath = window.location.pathname;

    const playerSection = loaded
        ? `
            <span class="playerName">
                <button id="theme-toggle" title="Toggle dark mode">&#127769;</button>
                ${player ? `<span class="player-greeting">Hello, <strong>${player.name}</strong></span>` : ""}
            </span>
        `
        : "";

    return `
        <nav class="header">
            <a class="header-home-icon" data-link href="/home" aria-label="Go to home">
                <img src="/favicon.svg" alt="Home" />
            </a>
            <span class="header-menu-groups">
                ${renderMenu("nav-menu-core", "Tracker", CORE_LINKS, currentPath)}
                ${renderMenu("nav-menu-progress", "Progress", PROGRESS_LINKS, currentPath)}
            </span>
            <span class="header-actions">
                ${renderActionLinks(currentPath)}
            </span>
            ${playerSection}
        </nav>
    `;
}
