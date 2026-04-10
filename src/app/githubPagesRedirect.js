export const GITHUB_PAGES_REDIRECT_KEY = "redirect";
export const GITHUB_PAGES_REDIRECT_QUERY_PARAM = "redirect";

export function consumeGithubPagesRedirect(options = {}) {
    const {
        sessionStorageLike = window.sessionStorage,
        locationLike = window.location
    } = options;

    const redirectFromSearch = readRedirectFromSearch(locationLike);
    const redirectFromSession = sessionStorageLike.getItem(GITHUB_PAGES_REDIRECT_KEY);
    const redirect = redirectFromSearch || redirectFromSession;
    if (!redirect) {
        return null;
    }

    if (redirectFromSession !== null) {
        sessionStorageLike.removeItem(GITHUB_PAGES_REDIRECT_KEY);
    }

    const normalizedRedirect = String(redirect).trim();
    if (!normalizedRedirect.startsWith("/") || normalizedRedirect.startsWith("//")) {
        return null;
    }

    const currentPath = `${locationLike.pathname}${locationLike.search}${locationLike.hash}`;
    if (normalizedRedirect === currentPath) {
        return null;
    }

    return normalizedRedirect;
}

function readRedirectFromSearch(locationLike) {
    const search = String(locationLike.search || "");
    if (!search) {
        return null;
    }

    const params = new URLSearchParams(search);
    return params.get(GITHUB_PAGES_REDIRECT_QUERY_PARAM);
}
