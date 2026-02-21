import { NPC_DATA } from "../logic/npcData.js";
import { buildNpcDropEntries, getBestDropRateValue, getDropRateLabel } from "../logic/npcDropEntries.js";
import { isItemHiddenByTag, isNpcObtainable } from "../logic/itemVisibility.js";
import { isItemObtainable } from "../logic/sortHelpers.js";
import { fileStore } from "../storage/fileStore.js";

const ITEM_SPIN_STEPS = 34;
const ITEM_CHIP_WIDTH = 132;
const ITEM_ANIMATION_MS = 1700;
const NPC_ROW_HEIGHT = 38;
const NPC_ANIMATION_MS = 1900;

let teardownDiceHandlers = null;

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function normalizeIdArray(entries) {
    if (!Array.isArray(entries)) return [];
    return entries.map((entry) => (entry && typeof entry === "object" ? entry.id : entry));
}

function createDiceContext({ items, obtained, rolled, filters }) {
    const allItems = Array.isArray(items) ? items : [];
    const allObtained = normalizeIdArray(obtained);
    const allRolled = normalizeIdArray(rolled);
    const activeFilters = filters || {};

    return {
        items: allItems,
        obtained: allObtained,
        rolled: allRolled,
        player: fileStore.player,
        filters: activeFilters,
        cacheRules: true,
        ruleEvalCache: new Map(),
        ruleEvalKey: "dice",
        npcReachCache: new Map(),
        npcObtainableCache: new Map(),
        missing: {
            items: new Set(),
            itemGroups: [],
            itemGroupKeys: new Set(),
            skills: [],
            skillKeys: new Set(),
            prereqQuests: [],
            prereqQuestKeys: new Set(),
            questPointsRequired: 0,
            questPointsCurrent: fileStore.player?.questPoints ?? 0
        }
    };
}

function isDiceItemEligible(item, filters, obtainedSet) {
    if (!item) return false;
    if (obtainedSet.has(item.id)) return false;
    if (isItemHiddenByTag(item)) return false;
    if (!filters?.hasFlatpacks && item.tags?.includes("flatpack")) return false;
    if (!filters?.hasItemsets && item.tags?.includes("itemset")) return false;
    if (filters?.hideClue && item.tags?.includes("clue-reward-only")) return false;
    return true;
}

function pickRandomIndex(length, currentIndex = -1) {
    if (length <= 0) return -1;
    if (length === 1) return 0;
    let next = currentIndex;
    while (next === currentIndex) {
        next = Math.floor(Math.random() * length);
    }
    return next;
}

function shuffleItems(items) {
    const clone = [...items];
    for (let i = clone.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [clone[i], clone[j]] = [clone[j], clone[i]];
    }
    return clone;
}

function createItemCycler(candidates) {
    let pool = shuffleItems(candidates);
    const refill = () => {
        pool = shuffleItems(candidates);
    };

    return (avoidIds = []) => {
        if (!pool.length) refill();
        const avoid = new Set((avoidIds || []).filter((id) => id !== null && id !== undefined));

        let index = pool.findIndex((item) => !avoid.has(item.id));
        if (index < 0) {
            refill();
            index = pool.findIndex((item) => !avoid.has(item.id));
        }
        if (index < 0) index = 0;

        const [selected] = pool.splice(index, 1);
        return selected;
    };
}

function createNameCycler(names) {
    let pool = shuffleItems(names);
    const refill = () => {
        pool = shuffleItems(names);
    };

    return (avoidNames = []) => {
        if (!pool.length) refill();
        const avoid = new Set((avoidNames || []).filter((name) => Boolean(name)));

        let index = pool.findIndex((name) => !avoid.has(name));
        if (index < 0) {
            refill();
            index = pool.findIndex((name) => !avoid.has(name));
        }
        if (index < 0) index = 0;

        const [selected] = pool.splice(index, 1);
        return selected;
    };
}

async function waitForTransition(element, fallbackMs) {
    await new Promise((resolve) => {
        let done = false;
        const finish = () => {
            if (done) return;
            done = true;
            element.removeEventListener("transitionend", onEnd);
            clearTimeout(timer);
            resolve();
        };
        const onEnd = (event) => {
            if (event.target !== element) return;
            finish();
        };
        const timer = setTimeout(finish, fallbackMs);
        element.addEventListener("transitionend", onEnd);
    });
}

function getItemImageSrc(item) {
    return item?.image ? `/images/${item.image}` : "/images/placeholder.png";
}

function renderItemChip(item, fallbackLabel = "No obtainable items") {
    if (!item) {
        return `<div class="dice-chip"><span class="dice-chip-label">${escapeHtml(fallbackLabel)}</span></div>`;
    }
    const itemName = item.name || "Unknown item";
    const imageSrc = getItemImageSrc(item);
    return `
        <div class="dice-chip" title="${escapeHtml(itemName)}">
            <img class="dice-chip-image" src="${imageSrc}" alt="${escapeHtml(itemName)}">
        </div>
    `;
}

function setItemTrackStatic(track, item) {
    if (!track) return;
    const viewportWidth = track.parentElement?.clientWidth || ITEM_CHIP_WIDTH;
    const padX = Math.max(0, (viewportWidth - ITEM_CHIP_WIDTH) / 2);
    track.innerHTML = `
        <div class="dice-chip dice-chip--spacer" style="width:${padX}px;min-width:${padX}px;" aria-hidden="true"></div>
        ${renderItemChip(item)}
        <div class="dice-chip dice-chip--spacer" style="width:${padX}px;min-width:${padX}px;" aria-hidden="true"></div>
    `;
    track.style.transition = "none";
    track.style.transform = "translateX(0px)";
}

function setNpcTrackStatic(track, label) {
    if (!track) return;
    const viewportHeight = track.parentElement?.clientHeight || NPC_ROW_HEIGHT;
    const padY = Math.max(0, (viewportHeight - NPC_ROW_HEIGHT) / 2);
    track.innerHTML = `
        <div class="dice-row dice-row--spacer" style="height:${padY}px;min-height:${padY}px;" aria-hidden="true"></div>
        <div class="dice-row">${escapeHtml(label)}</div>
        <div class="dice-row dice-row--spacer" style="height:${padY}px;min-height:${padY}px;" aria-hidden="true"></div>
    `;
    track.style.transition = "none";
    track.style.transform = "translateY(0px)";
}

function buildItemSpinLabels(candidates, target) {
    const randomSteps = Math.max(10, Math.min(ITEM_SPIN_STEPS, candidates.length * 2));
    const trailingSteps = Math.max(5, Math.min(9, candidates.length + 1));
    const prefixCount = randomSteps;
    const suffixCount = trailingSteps;

    const availableWithoutTarget = candidates.filter((item) => item.id !== target.id);
    const canRenderFullyUnique = availableWithoutTarget.length >= (prefixCount + suffixCount);
    if (canRenderFullyUnique) {
        const unique = shuffleItems(availableWithoutTarget).slice(0, prefixCount + suffixCount);
        const items = [
            ...unique.slice(0, prefixCount),
            target,
            ...unique.slice(prefixCount)
        ];
        return { items, targetIndex: prefixCount };
    }

    const items = [];
    const nextFromCycle = createItemCycler(candidates);
    let previousId = null;

    for (let index = 0; index < randomSteps; index++) {
        const next = nextFromCycle([previousId, target.id]);
        items.push(next);
        previousId = next.id;
    }

    const targetIndex = items.length;
    items.push(target);
    previousId = target.id;

    for (let index = 0; index < trailingSteps; index++) {
        const next = nextFromCycle([previousId, target.id]);
        items.push(next);
        previousId = next.id;
    }

    return { items, targetIndex };
}

function buildNpcSpinLabels(candidates, targetIndex) {
    const names = candidates.map((entry) => entry.npcName);
    if (!names.length) return { labels: [], targetIndex: -1 };
    const targetName = names[targetIndex];
    const randomSteps = Math.max(12, Math.min(32, names.length * 3));
    const trailingSteps = Math.max(5, Math.min(9, names.length + 1));
    const prefixCount = randomSteps;
    const suffixCount = trailingSteps;

    const availableWithoutTarget = names.filter((name) => name !== targetName);
    const canRenderFullyUnique = availableWithoutTarget.length >= (prefixCount + suffixCount);
    if (canRenderFullyUnique) {
        const unique = shuffleItems(availableWithoutTarget).slice(0, prefixCount + suffixCount);
        const labels = [
            ...unique.slice(0, prefixCount),
            targetName,
            ...unique.slice(prefixCount)
        ];
        return { labels, targetIndex: prefixCount };
    }

    const labels = [];
    const nextFromCycle = createNameCycler(names);
    let previousName = "";

    for (let index = 0; index < randomSteps; index++) {
        const next = nextFromCycle([previousName, targetName]);
        labels.push(next);
        previousName = next;
    }

    const chosenIndex = labels.length;
    labels.push(targetName);
    previousName = targetName;

    for (let index = 0; index < trailingSteps; index++) {
        const next = nextFromCycle([previousName, targetName]);
        labels.push(next);
        previousName = next;
    }

    return { labels, targetIndex: chosenIndex };
}

async function animateHorizontalRoll(track, items, targetIndex) {
    if (!track || !items.length) return;
    const viewportWidth = track.parentElement?.clientWidth || ITEM_CHIP_WIDTH;
    const padX = Math.max(0, (viewportWidth - ITEM_CHIP_WIDTH) / 2);
    track.innerHTML = [
        `<div class="dice-chip dice-chip--spacer" style="width:${padX}px;min-width:${padX}px;" aria-hidden="true"></div>`,
        ...items.map((item) => renderItemChip(item)),
        `<div class="dice-chip dice-chip--spacer" style="width:${padX}px;min-width:${padX}px;" aria-hidden="true"></div>`
    ].join("");
    track.style.transition = "none";
    track.style.transform = "translateX(0px)";
    void track.offsetWidth;

    const slotWidth = track.querySelector(".dice-chip:not(.dice-chip--spacer)")?.getBoundingClientRect().width || ITEM_CHIP_WIDTH;
    const finalIndex = Math.max(0, Math.min(items.length - 1, Number.isFinite(targetIndex) ? targetIndex : items.length - 1));
    const targetOffset = finalIndex * slotWidth;

    track.style.transition = `transform ${ITEM_ANIMATION_MS}ms cubic-bezier(0.12, 0.82, 0.2, 1)`;
    track.style.transform = `translateX(-${targetOffset}px)`;
    await waitForTransition(track, ITEM_ANIMATION_MS + 150);
}

async function animateVerticalRoll(track, labels, targetIndex) {
    if (!track || !labels.length) return;
    const viewportHeight = track.parentElement?.clientHeight || NPC_ROW_HEIGHT;
    const padY = Math.max(0, (viewportHeight - NPC_ROW_HEIGHT) / 2);
    track.innerHTML = [
        `<div class="dice-row dice-row--spacer" style="height:${padY}px;min-height:${padY}px;" aria-hidden="true"></div>`,
        ...labels.map((label) => `<div class="dice-row">${escapeHtml(label)}</div>`),
        `<div class="dice-row dice-row--spacer" style="height:${padY}px;min-height:${padY}px;" aria-hidden="true"></div>`
    ].join("");
    track.style.transition = "none";
    track.style.transform = "translateY(0px)";
    void track.offsetWidth;

    const rowHeight = track.querySelector(".dice-row:not(.dice-row--spacer)")?.getBoundingClientRect().height || NPC_ROW_HEIGHT;
    const finalIndex = Math.max(0, Math.min(labels.length - 1, Number.isFinite(targetIndex) ? targetIndex : labels.length - 1));
    const targetOffset = finalIndex * rowHeight;

    track.style.transition = `transform ${NPC_ANIMATION_MS}ms cubic-bezier(0.12, 0.82, 0.2, 1)`;
    track.style.transform = `translateY(-${targetOffset}px)`;
    await waitForTransition(track, NPC_ANIMATION_MS + 150);
}

async function saveSelections(itemId, npcName) {
    await fileStore.setFilters({
        ...fileStore.filters,
        diceSelectedItemId: itemId,
        diceSelectedNpcName: npcName
    });
}

async function collectItemCandidates() {
    const filters = fileStore.filters || {};
    const obtained = normalizeIdArray(fileStore.obtained || []);
    const rolled = normalizeIdArray(fileStore.rolled || []);
    const obtainedSet = new Set(obtained);
    const allItems = fileStore.items || [];
    const ctx = createDiceContext({
        items: allItems,
        obtained,
        rolled,
        filters
    });

    const candidates = [];
    for (const item of allItems) {
        if (!isDiceItemEligible(item, filters, obtainedSet)) continue;
        if (!(await isItemObtainable(item, ctx))) continue;
        candidates.push(item);
    }

    candidates.sort((a, b) => a.name.localeCompare(b.name));
    return { candidates, ctx };
}

async function collectNpcCandidates() {
    const { entries, rolledSet } = await buildNpcDropEntries({
        items: fileStore.items || [],
        obtained: fileStore.obtained || [],
        rolled: fileStore.rolled || [],
        player: fileStore.player,
        filters: fileStore.filters || {}
    });
    return { entries, rolledSet };
}

async function renderItemDetails(item, ctx) {
    if (!item) {
        return `<p class="empty-state">No obtainable items left for your current filters.</p>`;
    }

    const imageSrc = item.image ? `/images/${item.image}` : "/images/placeholder.png";
    const dropSourceEntries = Object.entries(item.sources?.drops || {});
    const dropSourcesWithFlags = await Promise.all(dropSourceEntries.map(async ([npcName, drops]) => ({
        npcName,
        drops,
        obtainable: await isNpcObtainable(npcName, ctx)
    })));

    const dropSources = dropSourcesWithFlags
        .filter((entry) => entry.obtainable)
        .map((entry) => ({
            npcName: entry.npcName,
            drops: entry.drops,
            rateValue: getBestDropRateValue(entry.drops),
            rateLabel: getDropRateLabel(entry.drops)
        }))
        .sort((a, b) => {
            if (a.rateValue !== b.rateValue) return b.rateValue - a.rateValue;
            return a.npcName.localeCompare(b.npcName);
        });

    const dropSourceHtml = dropSources.length
        ? `
            <div class="dice-item-sources">
                <h3 class="dice-item-sources-title">Drop sources</h3>
                <div class="dice-npc-item-list">
                    ${dropSources.map((entry) => {
                        const npcWiki = NPC_DATA[entry.npcName]?.wiki;
                        if (npcWiki) {
                            return `
                                <a class="dice-npc-item" href="${npcWiki}" target="_blank" rel="noopener noreferrer">
                                    <span class="dice-npc-item-name">${escapeHtml(entry.npcName)}</span>
                                    <span class="dice-item-source-rate">${escapeHtml(entry.rateLabel || "")}</span>
                                </a>
                            `;
                        }
                        return `
                            <div class="dice-npc-item">
                                <span class="dice-npc-item-name">${escapeHtml(entry.npcName)}</span>
                                <span class="dice-item-source-rate">${escapeHtml(entry.rateLabel || "")}</span>
                            </div>
                        `;
                    }).join("")}
                </div>
            </div>
        `
        : `<p class="dice-item-sources-empty">No obtainable drop sources for this item with current filters.</p>`;

    return `
        <div class="dice-result-card">
            <a class="dice-result-link" data-link href="/item?id=${item.id}">
                <img class="dice-result-image" src="${imageSrc}" alt="${escapeHtml(item.name)}">
                <span class="dice-result-name">${escapeHtml(item.name)}</span>
            </a>
            ${dropSourceHtml}
        </div>
    `;
}

function renderNpcDetails(entry, rolledSet) {
    if (!entry) {
        return `<p class="empty-state">No reachable NPCs with remaining drops for your current filters.</p>`;
    }

    const npcWiki = NPC_DATA[entry.npcName]?.wiki;
    const npcTitle = npcWiki
        ? `<a href="${npcWiki}" target="_blank" rel="noopener noreferrer">${escapeHtml(entry.npcName)}</a>`
        : escapeHtml(entry.npcName);

    const itemRows = entry.items
        .slice()
        .sort((a, b) => {
            const aRate = getBestDropRateValue(a.sources?.drops?.[entry.npcName]);
            const bRate = getBestDropRateValue(b.sources?.drops?.[entry.npcName]);
            if (aRate !== bRate) return bRate - aRate;
            return a.name.localeCompare(b.name);
        })
        .map((item) => {
            const imageSrc = item.image ? `/images/${item.image}` : "/images/placeholder.png";
            const drops = item.sources?.drops?.[entry.npcName];
            const rateLabel = getDropRateLabel(drops);
            const rolledLabel = rolledSet.has(item.id) ? `<span class="badge rolled">Rolled</span>` : "";
            return `
                <a class="dice-npc-item" data-link href="/item?id=${item.id}">
                    <img class="dice-npc-item-image" src="${imageSrc}" alt="${escapeHtml(item.name)}">
                    <span class="dice-npc-item-name">${escapeHtml(item.name)}${escapeHtml(rateLabel)}</span>
                    ${rolledLabel}
                </a>
            `;
        })
        .join("");

    return `
        <div class="dice-result-card">
            <div class="dice-result-header">
                <h3>${npcTitle}</h3>
                <span>${entry.items.length} remaining item${entry.items.length === 1 ? "" : "s"}</span>
            </div>
            <div class="dice-npc-item-list">
                ${itemRows}
            </div>
        </div>
    `;
}

function updateControls(state, elements) {
    const disableButtons = state.busy;
    elements.rollItemBtn.disabled = disableButtons || state.itemCandidates.length === 0;
    elements.obtainedBtn.disabled = disableButtons || !state.selectedItemId;
    elements.rollNpcBtn.disabled = disableButtons || state.npcCandidates.length === 0;
    elements.finishedBtn.disabled = disableButtons || !state.selectedNpcName;
}

async function renderCurrentState(state, elements) {
    const selectedItem = state.itemCandidates.find((item) => item.id === state.selectedItemId) || null;
    const selectedNpc = state.npcCandidates.find((entry) => entry.npcName === state.selectedNpcName) || null;

    setItemTrackStatic(elements.itemTrack, selectedItem);
    setNpcTrackStatic(elements.npcTrack, selectedNpc ? selectedNpc.npcName : "No reachable NPCs");

    elements.itemDetails.innerHTML = await renderItemDetails(selectedItem, state.itemCtx);
    elements.npcDetails.innerHTML = renderNpcDetails(selectedNpc, state.rolledSet);

    updateControls(state, elements);
}

async function renderSelectionDetails(state, elements) {
    const selectedItem = state.itemCandidates.find((item) => item.id === state.selectedItemId) || null;
    const selectedNpc = state.npcCandidates.find((entry) => entry.npcName === state.selectedNpcName) || null;

    elements.itemDetails.innerHTML = await renderItemDetails(selectedItem, state.itemCtx);
    elements.npcDetails.innerHTML = renderNpcDetails(selectedNpc, state.rolledSet);

    updateControls(state, elements);
}

async function refreshCandidates(state, elements, { autoPick = false } = {}) {
    const [itemData, npcData] = await Promise.all([
        collectItemCandidates(),
        collectNpcCandidates()
    ]);

    state.itemCandidates = itemData.candidates;
    state.itemCtx = itemData.ctx;
    state.npcCandidates = npcData.entries;
    state.rolledSet = npcData.rolledSet;

    const filterItemId = fileStore.filters?.diceSelectedItemId;
    const parsedFilterItemId = filterItemId === null || filterItemId === undefined
        ? null
        : Number(filterItemId);
    const validFilterItemId = Number.isFinite(parsedFilterItemId) ? parsedFilterItemId : null;
    const filterNpcName = String(fileStore.filters?.diceSelectedNpcName || "");

    const hasSavedItem = validFilterItemId !== null
        && state.itemCandidates.some((item) => item.id === validFilterItemId);
    const hasSavedNpc = filterNpcName
        && state.npcCandidates.some((entry) => entry.npcName === filterNpcName);

    let nextItemId = hasSavedItem ? validFilterItemId : null;
    let nextNpcName = hasSavedNpc ? filterNpcName : "";

    if (!nextItemId && autoPick && state.itemCandidates.length) {
        nextItemId = state.itemCandidates[Math.floor(Math.random() * state.itemCandidates.length)].id;
    }
    if (!nextNpcName && autoPick && state.npcCandidates.length) {
        nextNpcName = state.npcCandidates[Math.floor(Math.random() * state.npcCandidates.length)].npcName;
    }

    state.selectedItemId = nextItemId;
    state.selectedNpcName = nextNpcName;

    if (validFilterItemId !== nextItemId || filterNpcName !== nextNpcName) {
        await saveSelections(nextItemId, nextNpcName);
    }

    await renderCurrentState(state, elements);
}

async function rollItem(state, elements) {
    if (!state.itemCandidates.length) return;
    const currentIndex = state.itemCandidates.findIndex((item) => item.id === state.selectedItemId);
    const nextIndex = pickRandomIndex(state.itemCandidates.length, currentIndex);
    const target = state.itemCandidates[nextIndex];
    const spin = buildItemSpinLabels(state.itemCandidates, target);

    await animateHorizontalRoll(elements.itemTrack, spin.items, spin.targetIndex);

    state.selectedItemId = target.id;
    await saveSelections(state.selectedItemId, state.selectedNpcName);
    await renderSelectionDetails(state, elements);
}

async function rollNpc(state, elements) {
    if (!state.npcCandidates.length) return;
    const currentIndex = state.npcCandidates.findIndex((entry) => entry.npcName === state.selectedNpcName);
    const nextIndex = pickRandomIndex(state.npcCandidates.length, currentIndex);
    const target = state.npcCandidates[nextIndex];
    const spin = buildNpcSpinLabels(state.npcCandidates, nextIndex);

    await animateVerticalRoll(elements.npcTrack, spin.labels, spin.targetIndex);

    state.selectedNpcName = target.npcName;
    await saveSelections(state.selectedItemId, state.selectedNpcName);
    await renderSelectionDetails(state, elements);
}

async function addObtainedIds(ids) {
    const current = normalizeIdArray(fileStore.obtained || []);
    const set = new Set(current);
    let changed = false;
    for (const id of ids) {
        if (set.has(id)) continue;
        set.add(id);
        changed = true;
    }
    if (!changed) return false;
    await fileStore.setObtained([...set]);
    return true;
}

async function handleItemObtained(state, elements) {
    const item = state.itemCandidates.find((entry) => entry.id === state.selectedItemId);
    if (!item) return;

    await addObtainedIds([item.id]);
    await refreshCandidates(state, elements, { autoPick: false });
    if (state.itemCandidates.length) {
        await rollItem(state, elements);
    }
}

async function handleNpcFinished(state, elements) {
    const npc = state.npcCandidates.find((entry) => entry.npcName === state.selectedNpcName);
    if (!npc) return;

    await addObtainedIds(npc.items.map((item) => item.id));
    await refreshCandidates(state, elements, { autoPick: false });
    if (state.npcCandidates.length) {
        await rollNpc(state, elements);
    }
}

export default async function DicePage() {
    if (!fileStore.player || !fileStore.obtained || !fileStore.rolled) {
        return `
            <h1>Random picker</h1>
            <p>Please upload your files and player name on the Upload page first.</p>
        `;
    }

    return `
        <h1>Random picker</h1>
        <p class="dice-intro">Roll a random item and NPC target from currently obtainable content.</p>
        <div class="dice-grid">
            <section class="card dice-card">
                <h2>Next item</h2>
                <div class="dice-reel dice-reel--horizontal">
                    <div id="diceItemTrack" class="dice-reel-track dice-reel-track--horizontal"></div>
                    <div class="dice-reel-indicator dice-reel-indicator--horizontal" aria-hidden="true"></div>
                </div>
                <div class="dice-actions">
                    <button type="button" id="diceRollItemBtn">Roll item</button>
                    <button type="button" id="diceObtainedBtn">Obtained!</button>
                </div>
                <div id="diceItemDetails"></div>
            </section>
            <section class="card dice-card">
                <h2>Next NPC</h2>
                <div class="dice-reel dice-reel--vertical">
                    <div id="diceNpcTrack" class="dice-reel-track dice-reel-track--vertical"></div>
                    <div class="dice-reel-indicator dice-reel-indicator--vertical" aria-hidden="true"></div>
                </div>
                <div class="dice-actions">
                    <button type="button" id="diceRollNpcBtn">Roll NPC</button>
                    <button type="button" id="diceFinishedBtn">Finished!</button>
                </div>
                <div id="diceNpcDetails"></div>
            </section>
        </div>
    `;
}

export async function init() {
    teardown();

    const elements = {
        itemTrack: document.getElementById("diceItemTrack"),
        npcTrack: document.getElementById("diceNpcTrack"),
        rollItemBtn: document.getElementById("diceRollItemBtn"),
        obtainedBtn: document.getElementById("diceObtainedBtn"),
        rollNpcBtn: document.getElementById("diceRollNpcBtn"),
        finishedBtn: document.getElementById("diceFinishedBtn"),
        itemDetails: document.getElementById("diceItemDetails"),
        npcDetails: document.getElementById("diceNpcDetails")
    };

    if (Object.values(elements).some((element) => !element)) return;

    await fileStore.ensureItemsLoaded();

    const state = {
        busy: false,
        itemCandidates: [],
        itemCtx: null,
        npcCandidates: [],
        rolledSet: new Set(),
        selectedItemId: null,
        selectedNpcName: ""
    };

    const runWithLock = async (fn) => {
        if (state.busy) return;
        state.busy = true;
        updateControls(state, elements);
        try {
            await fn();
        } finally {
            state.busy = false;
            updateControls(state, elements);
        }
    };

    await runWithLock(async () => {
        await refreshCandidates(state, elements, { autoPick: true });
    });

    const onRollItem = async () => runWithLock(async () => {
        await rollItem(state, elements);
    });

    const onObtained = async () => runWithLock(async () => {
        await handleItemObtained(state, elements);
    });

    const onRollNpc = async () => runWithLock(async () => {
        await rollNpc(state, elements);
    });

    const onFinished = async () => runWithLock(async () => {
        await handleNpcFinished(state, elements);
    });

    elements.rollItemBtn.addEventListener("click", onRollItem);
    elements.obtainedBtn.addEventListener("click", onObtained);
    elements.rollNpcBtn.addEventListener("click", onRollNpc);
    elements.finishedBtn.addEventListener("click", onFinished);

    teardownDiceHandlers = () => {
        elements.rollItemBtn.removeEventListener("click", onRollItem);
        elements.obtainedBtn.removeEventListener("click", onObtained);
        elements.rollNpcBtn.removeEventListener("click", onRollNpc);
        elements.finishedBtn.removeEventListener("click", onFinished);
    };
}

export function teardown() {
    if (typeof teardownDiceHandlers === "function") {
        teardownDiceHandlers();
    }
    teardownDiceHandlers = null;
}
