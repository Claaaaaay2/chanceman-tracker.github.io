const KEY = "filters-overrides-visible";

export function initFiltersOverrides() {
    applyFiltersOverridesState(getInitialState());
    updateToggleText();
}

export function bindFiltersOverridesToggle() {
    const btn = document.getElementById("filter-overrides-toggle");
    if (!btn) return;

    btn.addEventListener("click", () => {
        toggle();
        updateToggleText();
    });
}

function toggle() {
    const visible = isVisible();
    const next = !visible;
    localStorage.setItem(KEY, next ? "true" : "false");
    applyFiltersOverridesState(next);
}

function applyFiltersOverridesState(visible) {
    const el = document.querySelector(".filters-overrides");
    if (!el) return;

    el.style.display = visible ? "" : "none";
}

function updateToggleText() {
    const btn = document.getElementById("filter-overrides-toggle");
    if (!btn) return;

    btn.textContent = isVisible()
        ? "Hide filters and overrides"
        : "Show filters and overrides";
}

function isVisible() {
    return localStorage.getItem(KEY) !== "false";
}

function getInitialState() {
    const stored = localStorage.getItem(KEY);
    if (stored !== null) return stored === "true";
    return true; // default: visible
}
