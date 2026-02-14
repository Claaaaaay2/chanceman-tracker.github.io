import { Footer } from "./components/footer.js";
import { Header } from "./components/header.js";
import { afterRoute } from "./app/routeEnhancements.js";
import { initItemsRoute } from "./items/itemsPageController.js";
import { bindThemeToggle, updateThemeIcon } from "./styles/theme.js";
import { bindFiltersOverridesToggle } from "./styles/filtersOverrides.js";

const routeDefinitions = {
    "/": {
        load: async () => import("./pages/home.js")
    },
    "/upload": {
        load: async () => import("./pages/upload.js")
    },
    "/items": {
        load: async () => import("./pages/items.js"),
        init: initItemsRoute
    },
    "/unlocks": {
        load: async () => import("./pages/skillUnlocks.js")
    },
    "/npcs": {
        load: async () => import("./pages/npcs.js")
    },
    "/item": {
        load: async () => import("./pages/item.js")
    },
    "/item-history": {
        load: async () => import("./pages/itemHistory.js")
    },
    "/achievement-diaries": {
        load: async () => import("./pages/achievementDiaries.js")
    },
    "/clue-steps": {
        load: async () => import("./pages/clueSteps.js")
    },
    "/quests": {
        load: async () => import("./pages/quests.js")
    },
    "/reupload": {
        load: async () => import("./pages/reupload.js")
    },
    "/bug": {
        load: async () => import("./pages/reportABug.js")
    }
};

const notFoundRouteDefinition = {
    load: async () => import("./pages/notFound.js")
};

let currentRouteTeardown = null;

function ensureRouteLoadingOverlay() {
    let overlay = document.getElementById("routeLoading");
    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.id = "routeLoading";
    overlay.className = "route-loading-overlay";
    overlay.innerHTML = `
        <div class="spinner" aria-hidden="true"></div>
        <span>Loading...</span>
    `;
    document.body.appendChild(overlay);
    return overlay;
}

function setRouteLoading(isLoading) {
    ensureRouteLoadingOverlay();
    document.body.classList.toggle("route-loading", isLoading);
}

export async function navigate(path) {
    const target = String(path || "");
    const normalized = target.split("?")[0].split("#")[0];
    if (normalized === "/upload" || normalized === "/reupload") {
        const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        if (currentPath !== "/upload" && currentPath !== "/reupload") {
            sessionStorage.setItem("uploadReturnPath", currentPath);
        }
    }
    history.pushState({}, "", path);
    router();
}

window.navigate = navigate;

export async function router() {
    setRouteLoading(true);
    await new Promise(requestAnimationFrame);
    const path = window.location.pathname;

    const basePath = path.split("?")[0];
    const routeDefinition = routeDefinitions[basePath] || notFoundRouteDefinition;
    const routeModule = await routeDefinition.load();
    const page = routeModule.default;
    const routeInit = routeDefinition.init || routeModule.init;
    const routeTeardown = routeModule.teardown;
    const app = document.getElementById("app");

    try {
        if (typeof currentRouteTeardown === "function") {
            await currentRouteTeardown();
            currentRouteTeardown = null;
        }

        app.innerHTML = `
            <div class="layout">
                ${await Header()}
                <main class="content">
                    ${await page()}
                </main>
                ${await Footer()}
            </div>
        `;
        window.scrollTo(0, 0);
        bindThemeToggle();
        bindFiltersOverridesToggle();
        updateThemeIcon();

        afterRoute();
        if (typeof routeInit === "function") {
            await routeInit();
        }
        currentRouteTeardown = typeof routeTeardown === "function" ? routeTeardown : null;
    } finally {
        setRouteLoading(false);
    }
}

