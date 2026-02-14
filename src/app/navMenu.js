function getMenuFromToggle(header, toggle) {
    const menuId = toggle.getAttribute("aria-controls");
    if (!menuId) return null;
    return header.querySelector(`#${menuId}`);
}

function closeAllMenus(header) {
    const toggles = header.querySelectorAll(".nav-menu-toggle");

    toggles.forEach((toggle) => {
        toggle.setAttribute("aria-expanded", "false");
        const menu = getMenuFromToggle(header, toggle);
        if (menu) {
            menu.hidden = true;
        }
    });
}

let activeHeader = null;
let globalDocumentHandlerBound = false;

export function initNavMenu() {
    const header = document.querySelector(".header");
    if (!header) return;

    activeHeader = header;
    closeAllMenus(header);

    header.querySelectorAll(".nav-menu-toggle").forEach((toggle) => {
        if (toggle.dataset.bound === "true") return;
        toggle.dataset.bound = "true";

        const menu = getMenuFromToggle(header, toggle);
        if (!menu) return;

        menu.hidden = true;
        toggle.addEventListener("click", (event) => {
            event.stopPropagation();
            const isOpen = toggle.getAttribute("aria-expanded") === "true";

            closeAllMenus(header);
            if (!isOpen) {
                toggle.setAttribute("aria-expanded", "true");
                menu.hidden = false;
            }
        });
    });

    if (header.dataset.navBound !== "true") {
        header.dataset.navBound = "true";

        header.addEventListener("click", (event) => {
            if (!event.target.closest("[data-link]")) return;
            closeAllMenus(header);
        });

        header.addEventListener("keydown", (event) => {
            if (event.key !== "Escape") return;
            closeAllMenus(header);
        });
    }

    if (!globalDocumentHandlerBound) {
        globalDocumentHandlerBound = true;

        document.addEventListener("click", (event) => {
            if (!activeHeader) return;
            if (event.target.closest(".header") === activeHeader) return;
            closeAllMenus(activeHeader);
        });
    }
}
