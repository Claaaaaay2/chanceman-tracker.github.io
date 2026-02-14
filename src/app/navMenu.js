function getCurrentPageLabel() {
    const path = window.location.pathname;
    if (path === "/") return "Home";
    if (path === "/upload") return "Upload";
    if (path === "/items") return "Items";
    if (path === "/npcs") return "NPC drops";
    if (path === "/item-history") return "Item history";
    if (path === "/achievement-diaries") return "Achievement diaries";
    if (path === "/clue-steps") return "Clue steps";
    if (path === "/quests") return "Quests";
    if (path === "/reupload") return "Reupload";
    if (path === "/bug") return "Report a bug";
    return "Menu";
}

export function initNavMenu() {
    const header = document.querySelector(".header");
    const toggle = document.getElementById("nav-menu-toggle");
    const label = document.getElementById("nav-current-page");
    if (!header || !toggle) return;

    if (label) {
        label.textContent = getCurrentPageLabel();
    }

    header.classList.remove("is-menu-open");
    toggle.setAttribute("aria-expanded", "false");

    if (toggle.dataset.bound) return;
    toggle.dataset.bound = "true";

    toggle.addEventListener("click", () => {
        const isOpen = header.classList.toggle("is-menu-open");
        toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    header.addEventListener("click", (event) => {
        if (!event.target.closest("[data-link]")) return;
        header.classList.remove("is-menu-open");
        toggle.setAttribute("aria-expanded", "false");
    });

    document.addEventListener("click", (event) => {
        if (event.target.closest(".header")) return;
        header.classList.remove("is-menu-open");
        toggle.setAttribute("aria-expanded", "false");
    });
}
