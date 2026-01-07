import { Footer } from "./components/footer.js";
import { Header } from "./components/header.js";
import { afterRoute } from "./main.js";
import ItemPage from "./pages/item.js";
import ItemsPage from "./pages/items.js";
import NotFoundPage from "./pages/notFound.js";
import QuestsPage from "./pages/quests.js";
import { BugPage } from "./pages/reportABug.js";
import ReuploadPage from "./pages/reupload.js";
import UploadPage from "./pages/upload.js";
import { bindThemeToggle, updateThemeIcon } from "./styles/theme.js";
import { bindFiltersOverridesToggle } from "./styles/filtersOverrides.js";

export async function navigate(path) {
    history.pushState({}, "", path);
    router();
}

window.navigate = navigate;

export async function router() {
    const path = window.location.pathname;

    const basePath = path.split("?")[0];

    const routes = {
        "/": UploadPage,
        "/items": ItemsPage,
        "/item": ItemPage,
        "/quests": QuestsPage,
        "/reupload": ReuploadPage,
        "/bug": BugPage,
    };

    const page = routes[basePath] || NotFoundPage;
    const app = document.getElementById("app");

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
}

window.addEventListener("popstate", router);
