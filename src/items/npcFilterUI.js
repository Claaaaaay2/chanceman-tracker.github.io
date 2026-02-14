import { NPC_DATA } from "../logic/npcData.js";
import { fileStore } from "../storage/fileStore.js";
import { invalidateLogicCaches } from "./logicCache.js";

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

export function initNpcFilterUI(onApply) {
    const elements = {
        npcFilter: document.getElementById("npcFilter"),
        npcFilterToggle: document.getElementById("npcFilterToggle"),
        npcFilterPanel: document.getElementById("npcFilterPanel"),
        npcFilterSearch: document.getElementById("npcFilterSearch"),
        npcFilterList: document.getElementById("npcFilterList"),
        npcFilterAll: document.getElementById("npcFilterAll"),
        npcFilterNone: document.getElementById("npcFilterNone"),
        npcFilterApply: document.getElementById("npcFilterApply")
    };

    if (
        !elements.npcFilter || !elements.npcFilterToggle || !elements.npcFilterPanel
        || !elements.npcFilterSearch || !elements.npcFilterList
        || !elements.npcFilterAll || !elements.npcFilterNone || !elements.npcFilterApply
    ) {
        return;
    }

    if (elements.npcFilter.dataset.bound === "true") {
        return;
    }
    elements.npcFilter.dataset.bound = "true";

    let pendingNpcExclusions = new Set(fileStore.filters?.npcDropExclusions || []);

    function buildNpcFilterList(filters) {
        const npcNames = Object.keys(NPC_DATA).sort((a, b) => a.localeCompare(b));
        const exclusions = new Set(filters?.npcDropExclusions || []);
        pendingNpcExclusions = new Set(exclusions);
        elements.npcFilterList.innerHTML = npcNames.map((npcName) => `
            <label class="npc-filter-item">
                <input type="checkbox" data-npc="${escapeHtml(npcName)}" ${pendingNpcExclusions.has(npcName) ? "" : "checked"}>
                <span>${escapeHtml(npcName)}</span>
            </label>
        `).join("");
    }

    function updateNpcFilterVisibility() {
        const query = elements.npcFilterSearch.value.trim().toLowerCase();
        const items = elements.npcFilterList.querySelectorAll(".npc-filter-item");
        for (const item of items) {
            const label = item.textContent?.toLowerCase() || "";
            item.style.display = !query || label.includes(query) ? "" : "none";
        }
    }

    async function setNpcExclusions(nextExclusions) {
        const nextFilters = {
            ...fileStore.filters,
            npcDropExclusions: nextExclusions
        };
        await fileStore.setFilters(nextFilters);
        fileStore.npcDropExclusionSet = null;
        invalidateLogicCaches(fileStore);
        if (typeof onApply === "function") {
            onApply();
        }
    }

    function ensureNpcFilterToggleBinding() {
        if (document.documentElement.dataset.npcFilterToggleBound === "true") return;
        document.documentElement.dataset.npcFilterToggleBound = "true";

        let ignoreOutsideClickUntil = 0;

        document.addEventListener("click", (event) => {
            const toggle = event.target.closest("#npcFilterToggle");
            if (toggle) {
                const npcFilter = document.getElementById("npcFilter");
                if (!npcFilter || toggle.disabled) return;
                event.preventDefault();
                event.stopPropagation();
                npcFilter.classList.toggle("is-open");
                ignoreOutsideClickUntil = Date.now() + 150;
                return;
            }

            const npcFilter = document.getElementById("npcFilter");
            if (!npcFilter || !npcFilter.classList.contains("is-open")) return;
            if (Date.now() < ignoreOutsideClickUntil) return;
            if (event.target.closest("#npcFilter")) return;
            npcFilter.classList.remove("is-open");
        });
    }

    function getNpcFilterVisibleItems() {
        const query = elements.npcFilterSearch.value.trim().toLowerCase();
        const items = elements.npcFilterList.querySelectorAll(".npc-filter-item");
        const visible = [];
        for (const item of items) {
            const label = item.textContent?.toLowerCase() || "";
            if (!query || label.includes(query)) {
                visible.push(item);
            }
        }
        return visible;
    }

    buildNpcFilterList(fileStore.filters);
    updateNpcFilterVisibility();
    ensureNpcFilterToggleBinding();

    elements.npcFilterSearch.addEventListener("input", updateNpcFilterVisibility);

    elements.npcFilterList.addEventListener("change", (event) => {
        const checkbox = event.target.closest("input[type=\"checkbox\"][data-npc]");
        if (!checkbox) return;
        const npcName = checkbox.dataset.npc;
        if (checkbox.checked) {
            pendingNpcExclusions.delete(npcName);
        } else {
            pendingNpcExclusions.add(npcName);
        }
    });

    elements.npcFilterAll.addEventListener("click", async () => {
        const visibleItems = getNpcFilterVisibleItems();
        for (const item of visibleItems) {
            const checkbox = item.querySelector("input[type=\"checkbox\"][data-npc]");
            if (!checkbox) continue;
            checkbox.checked = true;
            pendingNpcExclusions.delete(checkbox.dataset.npc);
        }
    });

    elements.npcFilterNone.addEventListener("click", async () => {
        const visibleItems = getNpcFilterVisibleItems();
        for (const item of visibleItems) {
            const checkbox = item.querySelector("input[type=\"checkbox\"][data-npc]");
            if (!checkbox) continue;
            checkbox.checked = false;
            pendingNpcExclusions.add(checkbox.dataset.npc);
        }
    });

    elements.npcFilterApply.addEventListener("click", async () => {
        await setNpcExclusions([...pendingNpcExclusions]);
        elements.npcFilter.classList.remove("is-open");
    });
}
