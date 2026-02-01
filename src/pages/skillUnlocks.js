import { fileStore } from "../storage/fileStore.js";

const SECTION_ORDER = [
    "Melee",
    "Melee armours",
    "Ranged",
    "Ranged armours",
    "Magic",
    "Magic armours",
    "Prayer",
    "Woodcutting",
    "Mining",
    "Fishing",
    "Hunter"
];

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

export default async function SkillUnlocksPage() {
    const obtained = fileStore.obtained;
    const rolled = fileStore.rolled;

    if (!obtained || !rolled) {
        return `
            <h1>Unlocks by skill</h1>
            <p>Please upload your files on the Home page first.</p>
        `;
    }

    await fileStore.ensureItemsLoaded();

    const items = fileStore.items || [];
    const obtainedSet = new Set(obtained);
    const rolledSet = new Set(rolled);

    const sections = SECTION_ORDER.map((tag) => {
        const tagged = items.filter((item) => {
            const tags = item.tags || [];
            const hasTag = Array.isArray(tags) ? tags.includes(tag) : tags === tag;
            if (!hasTag) return false;
            return obtainedSet.has(item.id) && rolledSet.has(item.id);
        });

        tagged.sort((a, b) => a.name.localeCompare(b.name));

        const cards = tagged.map((item) => `
            <div class="unlock-item" data-name="${escapeHtml(item.name.toLowerCase())}">
                <img class="unlock-item-image" src="/images/${item.image}" alt="${escapeHtml(item.name)}">
                <span class="unlock-item-name">${escapeHtml(item.name)}</span>
            </div>
        `).join("");

        return `
            <section class="unlock-section" data-section="${escapeHtml(tag)}">
                <header class="unlock-section-header">
                    <button class="unlock-toggle" type="button" aria-expanded="true">Hide</button>
                    <h2>${escapeHtml(tag)}</h2>
                    <span class="unlock-count">(${tagged.length})</span>
                </header>
                <div class="unlock-section-body">
                    <div class="unlock-grid">
                        ${cards || `<p class="unlock-empty">No unlocked items yet.</p>`}
                    </div>
                </div>
            </section>
        `;
    }).join("");

    return `
        <h1>Unlocks by skill</h1>
        <div class="unlock-filters">
            <label class="unlock-filter">
                <span>Search unlocked items</span>
                <input type="search" id="unlockSearch" placeholder="Item name">
            </label>
        </div>
        <div class="unlock-list" id="unlockList">
            ${sections}
        </div>
    `;
}

function setSectionCollapsed(section, collapsed) {
    section.classList.toggle("is-collapsed", collapsed);
    const toggle = section.querySelector(".unlock-toggle");
    if (toggle) {
        toggle.textContent = collapsed ? "Show" : "Hide";
        toggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
    }
}

function applyUnlockSearch(container) {
    const query = (document.getElementById("unlockSearch")?.value || "").trim().toLowerCase();
    const sections = container.querySelectorAll(".unlock-section");
    for (const section of sections) {
        let visibleCount = 0;
        const cards = section.querySelectorAll(".unlock-item");
        for (const card of cards) {
            const name = card.dataset.name || "";
            const match = !query || name.includes(query);
            card.style.display = match ? "" : "none";
            if (match) visibleCount += 1;
        }
        const empty = section.querySelector(".unlock-empty");
        if (empty) {
            empty.style.display = visibleCount ? "none" : "";
            empty.textContent = query ? "No matching items." : "No unlocked items yet.";
        }
        section.style.display = visibleCount || !query ? "" : "none";
    }
}

window.initSkillUnlocksPage = function () {
    const list = document.getElementById("unlockList");
    if (!list) return;

    list.querySelectorAll(".unlock-section").forEach((section) => {
        const key = section.dataset.section || "";
        const stored = localStorage.getItem(`unlock-section:${key}`);
        if (stored === "collapsed") {
            setSectionCollapsed(section, true);
        }
    });

    const search = document.getElementById("unlockSearch");
    if (search) {
        search.addEventListener("input", () => applyUnlockSearch(list));
    }

    list.addEventListener("click", (event) => {
        const toggle = event.target.closest(".unlock-toggle");
        if (!toggle) return;
        const section = toggle.closest(".unlock-section");
        if (!section) return;
        const collapsed = !section.classList.contains("is-collapsed");
        setSectionCollapsed(section, collapsed);
        const key = section.dataset.section || "";
        localStorage.setItem(`unlock-section:${key}`, collapsed ? "collapsed" : "expanded");
    });
};
