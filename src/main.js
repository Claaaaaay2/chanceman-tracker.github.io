import { consumeGithubPagesRedirect } from "./app/githubPagesRedirect.js";
import { scheduleLikelyRoutePrefetch } from "./app/routePrefetch.js";
import { navigate, router } from "./router.js";
import { fileStore } from "./storage/fileStore.js";
import { initFiltersOverrides } from "./styles/filtersOverrides.js";
import "./styles/main.css";
import { initTheme } from "./styles/theme.js";

initTheme();
initFiltersOverrides();

window.addEventListener("DOMContentLoaded", async () => {
    const githubPagesRedirect = consumeGithubPagesRedirect();
    if (githubPagesRedirect) {
        history.replaceState(history.state ?? {}, "", githubPagesRedirect);
    }

    await fileStore.init();
    await router();
    scheduleLikelyRoutePrefetch();
});

window.addEventListener("popstate", router);

document.addEventListener("mouseover", (event) => {
    const target = event.target.closest(".is-new, .is-sources-changed");
    if (!target) return;
    target.classList.remove("is-new", "is-sources-changed");
});

// Allow <a data-link href="/about"> navigation
document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-link]");
    if (!link) return;

    event.preventDefault();
    const url = new URL(link.href);
    navigate(`${url.pathname}${url.search}${url.hash}`);
});
