const THEME_KEY = "theme";

export function initTheme() {
    const theme = getInitialTheme();
    applyTheme(theme);
    updateThemeIcon();
}

export function bindThemeToggle() {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;

    btn.addEventListener("click", () => {
        toggleTheme();
        updateThemeIcon();
    });
}

function applyTheme(theme) {
    document.documentElement.classList.toggle("dark", theme === "dark");
}

function toggleTheme() {
    const isDark = document.documentElement.classList.contains("dark");
    const next = isDark ? "light" : "dark";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
}

function getInitialTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored) return stored;

    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

export function updateThemeIcon() {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;

    btn.textContent =
        document.documentElement.classList.contains("dark") ? "☀️" : "🌙";
}
