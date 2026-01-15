import { NPC_DATA } from "../logic/npcData.js";
import { isItemHiddenByTag, isNpcObtainable, isRuleObtainable } from "../logic/itemVisibility.js";
import { parseDropRate } from "../logic/utils.js";
import { fileStore } from "../storage/fileStore.js";

export default async function ItemPage() {
    const obtained = fileStore.obtained;
    const rolled = fileStore.rolled;

    if (!obtained || !rolled)
        return `<h1>Please upload your files on the Home page first.</h1>`;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (!id) return `<h1>No item selected</h1>`;

    await fileStore.ensureItemsLoaded();
    const items = fileStore.items;
    const item = items.find(x => x.id == id);

    if (!item) return `<h1>Item not found</h1>`;
    if (isItemHiddenByTag(item)) return `<h1>Item not found</h1>`;

    const sourcesHtml = await renderSources(item.sources);
    const processableHtml = renderProcessable(item.processable, items);

    return `
        <h1>${item.name}</h1>

        <div class="item-header">
            <img src="/images/${item.image}" style="margin: 1rem" />
            <a href="https://oldschool.runescape.wiki/w/${item.name}" target="_blank">
                <img src="/images/wiki.png" style="width: 32px" />
            </a>
        </div>

        <h2>Where to get it</h2>
        ${sourcesHtml}

        <h2>Processable into:</h2>
        ${processableHtml}
    `;
}


/* ===========================================================
   SOURCE SECTIONS
   =========================================================== */
async function renderSources(sources = {}) {
    const sections = ["drops", "other", "shops", "spawns"];

    const htmlParts = [];

    for (const section of sections) {
        htmlParts.push(`
            <div class="source-section">
                <h3>${capitalize(section)}</h3>
                ${await renderSourceTable(section, sources[section])}
            </div>
        `);
    }

    return htmlParts.join("");
}

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}


/* ===========================================================
   INDIVIDUAL TABLE RENDERING
   =========================================================== */
async function renderSourceTable(section, entries) {
    if (!entries || Object.keys(entries).length === 0)
        return `<p><em>No data.</em></p>`;

    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));

    // ---------------------------
    // DROPS TABLE
    // ---------------------------
    if (section === "drops") {
        const rows = [];

        for (const [name, data] of Object.entries(entries)) {
            const obtainable = await isNpcObtainable(name, fileStore);
            rows.push({
                name,
                data,
                obtainable
            });
        }

        rows.sort((a, b) => {
            // 1. Obtainable first
            if (a.obtainable !== b.obtainable) {
                return a.obtainable ? -1 : 1;
            }

            // 2. Droprate (better first)
            const rateA = parseDropRate(a.data.droprate);
            const rateB = parseDropRate(b.data.droprate);
            if (rateB !== rateA) {
                return rateB - rateA;
            }

            // 3. Alphabetical fallback
            return a.name.localeCompare(b.name);
        });

        const htmlRows = rows.map(({ name, data, obtainable }) => `
            <tr>
                <td><a href="${NPC_DATA[name]?.wiki || "#"}" target="_blank">${name}</a></td>
                <td>${data.droprate}</td>
                <td>${obtainable ? yes() : no()}</td>
            </tr>
        `).join("");

        return `
            <table class="osrs-table">
                <tr>
                    <th>Source</th>
                    <th>Droprate</th>
                    <th>Obtainable?</th>
                </tr>
                ${htmlRows}
            </table>
        `;
    }


    // ---------------------------
    // OTHER TABLE
    // ---------------------------
    if (section === "other") {
        const rows = [];

        for (const [method, info] of Object.entries(entries)) {
            const { notes, rule } = info;

            const obtainable = await isRuleObtainable(rule, fileStore);

            rows.push(`
                <tr>
                    <td>${method}</td>
                    <td>${notes || ""}</td>
                    <td>${obtainable ? yes() : no()}</td>
                </tr>
            `);
        }

        return `
            <table class="osrs-table">
                <tr>
                    <th>How</th>
                    <th>Notes</th>
                    <th>Obtainable?</th>
                </tr>
                ${rows.join("")}
            </table>
        `;
    }


    // ---------------------------
    // SHOPS
    // ---------------------------
    if (section === "shops") {
        const rows = [];

        for (const [label, rule] of Object.entries(entries)) {
            let obtainable = false;

            if (fileStore.rolled.includes(id)) {
                // Rule is a string
                if (typeof rule === "string") {
                    obtainable = await isRuleObtainable(rule, fileStore);
                }
                // Rule is an object (e.g. any/all)
                else if (typeof rule === "object") {
                    obtainable = await isRuleObtainable(rule, fileStore);
                }
            }

            rows.push(`
                <tr>
                    <td>${formatRule(rule)}</td>
                    <td>${obtainable ? yes() : no()}</td>
                </tr>
            `);
        }

        return `
            <table class="osrs-table">
                <tr><th>Requirement</th><th>Obtainable?</th></tr>
                ${rows.join("")}
            </table>
        `;
    }


    // ---------------------------
    // SPAWNS
    // ---------------------------
    if (section === "spawns") {
        const rows = [];

        for (const [label, rule] of Object.entries(entries)) {
            let obtainable = false;

            if (fileStore.rolled.includes(id)) {
                // Rule is a string
                if (typeof rule === "string") {
                    obtainable = await isRuleObtainable(rule, fileStore);
                }
                // Rule is an object (e.g. any/all)
                else if (typeof rule === "object") {
                    obtainable = await isRuleObtainable(rule, fileStore);
                }
            }

            rows.push(`
                <tr>
                    <td>${formatRule(rule)}</td>
                    <td>${obtainable ? yes() : no()}</td>
                </tr>
            `);
        }

        return `
            <table class="osrs-table">
                <tr><th>Requirement</th><th>Obtainable?</th></tr>
                ${rows.join("")}
            </table>
        `;
    }
}


/* ===========================================================
   PROCESSABLE SECTION
   =========================================================== */
function renderProcessable(processable = {}, allItems) {
    if (!processable || Object.keys(processable).length === 0)
        return `<p><em>Not processable.</em></p>`;

    return `
        <table class="osrs-table">
            <tr><th>Creates</th><th>Ingredients</th></tr>
            ${Object.entries(processable).map(([resultId, components]) => {
        const resultItem = allItems.find(x => x.id == resultId);
        const ingredientIds = components.split(",");

        const ingredients = ingredientIds.map(cid => {
            const ing = allItems.find(x => x.id == cid);
            return ing
                ? `<a onclick="navigate('/item?id=${cid}')">${ing.name}</a>`
                : cid;
        }).join(", ");

        return `
                    <tr>
                        <td><a onclick="navigate('/item?id=${resultId}')">${resultItem.name}</a></td>
                        <td>${ingredients}</td>
                    </tr>
                `;
    }).join("")}
        </table>
    `;
}


/* ===========================================================
   HELPERS
   =========================================================== */
function yes() {
    return `<span class="obtainable yes">✔</span>`;
}

function no() {
    return `<span class="obtainable no">✘</span>`;
}

function formatRule(rule) {
    if (!rule) return "";
    if (typeof rule === "string") return rule;

    if (rule.any)
        return "Any: " + rule.any.join(", ");

    if (rule.all)
        return "All: " + rule.all.map(r => typeof r === "object" ? JSON.stringify(r) : r).join(", ");

    if (rule.has !== undefined)
        return `Has item ${rule.has}`;

    return JSON.stringify(rule);
}
