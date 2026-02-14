import { Footer } from "./components/footer.js";
import { Header } from "./components/header.js";
import { afterRoute } from "./main.js";
import { bindThemeToggle, updateThemeIcon } from "./styles/theme.js";
import { bindFiltersOverridesToggle } from "./styles/filtersOverrides.js";

const routePageLoaders = {
    "/": async () => (await import("./pages/home.js")).default,
    "/upload": async () => (await import("./pages/upload.js")).default,
    "/items": async () => (await import("./pages/items.js")).default,
    "/unlocks": async () => (await import("./pages/skillUnlocks.js")).default,
    "/npcs": async () => (await import("./pages/npcs.js")).default,
    "/item": async () => (await import("./pages/item.js")).default,
    "/item-history": async () => (await import("./pages/itemHistory.js")).default,
    "/achievement-diaries": async () => (await import("./pages/achievementDiaries.js")).default,
    "/clue-steps": async () => (await import("./pages/clueSteps.js")).default,
    "/quests": async () => (await import("./pages/quests.js")).default,
    "/reupload": async () => (await import("./pages/reupload.js")).default,
    "/bug": async () => (await import("./pages/reportABug.js")).BugPage
};

const loadNotFoundPage = async () => (await import("./pages/notFound.js")).default;

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

    const pageLoader = routePageLoaders[basePath] || loadNotFoundPage;
    const page = await pageLoader();
    const app = document.getElementById("app");

    try {
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
    } finally {
        setRouteLoading(false);
    }
}

