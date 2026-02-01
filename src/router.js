import { Footer } from "./components/footer.js";
import { Header } from "./components/header.js";
import { afterRoute } from "./main.js";
import ItemPage from "./pages/item.js";
import ItemsPage from "./pages/items.js";
import SkillUnlocksPage from "./pages/skillUnlocks.js";
import NpcsPage from "./pages/npcs.js";
import NotFoundPage from "./pages/notFound.js";
import QuestsPage from "./pages/quests.js";
import AchievementDiariesPage from "./pages/achievementDiaries.js";
import ClueStepsPage from "./pages/clueSteps.js";
import { BugPage } from "./pages/reportABug.js";
import ReuploadPage from "./pages/reupload.js";
import UploadPage from "./pages/upload.js";
import ItemHistoryPage from "./pages/itemHistory.js";
import { bindThemeToggle, updateThemeIcon } from "./styles/theme.js";
import { bindFiltersOverridesToggle } from "./styles/filtersOverrides.js";

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
    history.pushState({}, "", path);
    router();
}

window.navigate = navigate;

export async function router() {
    setRouteLoading(true);
    await new Promise(requestAnimationFrame);
    const path = window.location.pathname;

    const basePath = path.split("?")[0];

    const routes = {
        "/": UploadPage,
        "/items": ItemsPage,
        "/unlocks": SkillUnlocksPage,
        "/npcs": NpcsPage,
        "/item": ItemPage,
        "/item-history": ItemHistoryPage,
        "/achievement-diaries": AchievementDiariesPage,
        "/clue-steps": ClueStepsPage,
        "/quests": QuestsPage,
        "/reupload": ReuploadPage,
        "/bug": BugPage,
    };

    const page = routes[basePath] || NotFoundPage;
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
        bindThemeToggle();
        bindFiltersOverridesToggle();
        updateThemeIcon();

        afterRoute();
    } finally {
        setRouteLoading(false);
    }
}

