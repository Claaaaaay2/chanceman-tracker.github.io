import { prefetchRoutes } from "../router.js";

const LIKELY_NEXT_ROUTES = ["/items", "/npcs"];
let hasScheduledLikelyRoutePrefetch = false;

export function scheduleLikelyRoutePrefetch() {
    if (hasScheduledLikelyRoutePrefetch) return;
    hasScheduledLikelyRoutePrefetch = true;

    const currentPath = window.location.pathname.split("?")[0].split("#")[0];
    const routesToPrefetch = LIKELY_NEXT_ROUTES.filter((path) => path !== currentPath);
    if (!routesToPrefetch.length) return;

    const runPrefetch = () => {
        prefetchRoutes(routesToPrefetch);
    };

    if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(() => runPrefetch(), { timeout: 2000 });
        return;
    }

    window.setTimeout(runPrefetch, 300);
}
