import { fileStore } from "../storage/fileStore.js";

const SECTION_ORDER = [
    "Melee",
    "Melee armours",
    "Ranged",
    "Ranged armours",
    "Magic",
    "Magic armours",
    "Prayer armours",
    "Food",
    "Other skill boosts",
    "Potion",
    "Teleports",
    "Cooking",
    "Construction",
    "Crafting",
    "Farming",
    "Fletching",
    "Fishing",
    "Hunter",
    "Mining",
    "Prayer",
    "Runecraft",
    "Smithing",
    "Woodcutting"
];

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function slugifySection(value) {
    return String(value)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

function normalizeSkillKey(skill) {
    return String(skill || "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}

function getPlayerLevel(levelsMap, skill) {
    if (!levelsMap) return null;
    const key = String(skill || "").toLowerCase();
    if (levelsMap.has(key)) return levelsMap.get(key);
    return null;
}

function resolveBoostAmount(boost, levelsMap) {
    const amount = boost?.amount;
    if (typeof amount === "number") {
        return { value: amount, known: true };
    }
    if (amount && typeof amount === "object" && amount.type === "tiered") {
        const basedOn = amount.basedOn || boost?.skill;
        const level = getPlayerLevel(levelsMap, basedOn);
        if (level === null || level === undefined) {
            return { value: null, known: false };
        }
        const tiers = Array.isArray(amount.tiers) ? amount.tiers : [];
        for (const tier of tiers) {
            if (level >= tier.min && level <= tier.max) {
                return { value: tier.amount, known: true };
            }
        }
        return { value: null, known: false };
    }
    return { value: null, known: false };
}

export default async function SkillUnlocksPage() {
    const obtained = fileStore.obtained;
    const rolled = fileStore.rolled;

    if (!obtained || !rolled) {
        return `
            <h1>Unlocks by skill</h1>
            <p>Please upload your files on the Upload page first.</p>
        `;
    }

    await fileStore.ensureItemsLoaded();

    const items = fileStore.items || [];
    const playerLevels = fileStore.player?.levels || null;
    const levelsMap = playerLevels
        ? new Map(Object.entries(playerLevels).map(([key, value]) => [String(key).toLowerCase(), value]))
        : null;
    const obtainedSet = new Set(obtained);
    const rolledSet = new Set(rolled);

    const sectionIdCounts = new Map();
    const sectionMeta = SECTION_ORDER.map((tag) => {
        const base = slugifySection(tag) || "section";
        const count = sectionIdCounts.get(base) || 0;
        sectionIdCounts.set(base, count + 1);
        const id = count ? `${base}-${count + 1}` : base;
        return { tag, id };
    });

    const jumpLinks = sectionMeta.map(({ tag, id }) => `
        <a class="unlock-jump-link" href="#${escapeHtml(id)}">${escapeHtml(tag)}</a>
    `).join("");

    const sections = sectionMeta.map(({ tag, id }) => {
        const tagged = items.filter((item) => {
            const tags = item.tags || [];
            const hasTag = Array.isArray(tags) ? tags.includes(tag) : tags === tag;
            if (!hasTag) return false;
            return obtainedSet.has(item.id) && rolledSet.has(item.id);
        });

        tagged.sort((a, b) => a.name.localeCompare(b.name));

        const cards = tagged.map((item) => {
            const boosts = Array.isArray(item.boosts) ? item.boosts : [];
            const boostsHtml = boosts.length
                ? `
                    <div class="unlock-boosts">
                        ${boosts.map((boost) => {
                            const skill = boost?.skill || "";
                            const amountInfo = resolveBoostAmount(boost, levelsMap);
                            const amountLabel = amountInfo.known ? `+${amountInfo.value}` : "+?";
                            const fallbackLabel = skill ? `${skill} ${amountLabel}` : amountLabel;
                            const iconKey = normalizeSkillKey(skill);
                            const iconHtml = iconKey
                                ? `<img class="unlock-boost-icon" src="/images/skills/${escapeHtml(iconKey)}.png" alt="${escapeHtml(skill)} icon">`
                                : "";
                            const labelHtml = iconKey
                                ? ""
                                : `<span class="unlock-boost-label">${escapeHtml(fallbackLabel)}</span>`;
                            const title = amountInfo.known
                                ? `${skill} ${amountLabel}`
                                : `${skill} boost (requires player level)`;
                            return `
                                <span class="unlock-boost${amountInfo.known ? "" : " unlock-boost--unknown"}" title="${escapeHtml(title)}">
                                    ${iconHtml}
                                    <span class="unlock-boost-text">${escapeHtml(amountLabel)}</span>
                                    ${labelHtml}
                                </span>
                            `;
                        }).join("")}
                    </div>
                `
                : "";

            return `
                <div class="unlock-item" data-name="${escapeHtml(item.name.toLowerCase())}">
                    <img class="unlock-item-image" src="/images/${item.image}" alt="${escapeHtml(item.name)}">
                    <div class="unlock-item-details">
                        <span class="unlock-item-name">${escapeHtml(item.name)}</span>
                        ${boostsHtml}
                    </div>
                </div>
            `;
        }).join("");

        return `
            <section class="unlock-section" id="${escapeHtml(id)}" data-section="${escapeHtml(tag)}">
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
        <nav class="unlock-jump" aria-label="Jump to section">
            <div class="unlock-jump-label">Jump to section</div>
            <div class="unlock-jump-list">
                ${jumpLinks}
            </div>
        </nav>
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

    const jumpNav = document.querySelector(".unlock-jump");
    if (jumpNav && !jumpNav.dataset.bound) {
        jumpNav.dataset.bound = "true";
        jumpNav.addEventListener("click", (event) => {
            const link = event.target.closest(".unlock-jump-link");
            if (!link) return;
            const targetId = link.getAttribute("href")?.slice(1);
            if (!targetId) return;
            const target = document.getElementById(targetId);
            if (!target) return;
            event.preventDefault();
            history.replaceState(null, "", `#${targetId}`);
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

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
