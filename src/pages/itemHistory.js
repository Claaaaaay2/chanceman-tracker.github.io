import { fileStore } from "../storage/fileStore.js";

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function normalizeIds(value) {
    if (!Array.isArray(value)) return [];
    return value.map((id) => String(id));
}

function renderItemList(ids, itemsById) {
    if (!ids.length) {
        return `<p class="roll-empty">No items yet.</p>`;
    }

    const rows = ids.map((id) => {
        const item = itemsById.get(id);
        const label = escapeHtml(item?.name ?? `Unknown item (${id})`);
        const content = item
            ? `<a onclick="navigate('/item?id=${id}')">${label}</a>`
            : label;
        const image = item?.image ? `/images/${item.image}` : "/images/placeholder.png";
        const imgAttrs = item?.image
            ? `class="lazy-img roll-inline-image" data-src="${image}" src="/images/placeholder.png"`
            : `class="roll-inline-image" src="/images/placeholder.png"`;

        return `
            <li class="roll-item-row">
                <span class="roll-item-row-content">
                    <img ${imgAttrs} alt="${label}">
                    ${content}
                </span>
            </li>
        `;
    });

    return `<ol class="roll-name-list">${rows.join("")}</ol>`;
}

function renderSection(title, ids, itemsById) {
    const count = ids.length;
    return `
        <section class="roll-section">
            <h2>${title} <span class="roll-count">(${count})</span></h2>
            ${renderItemList(ids, itemsById)}
        </section>
    `;
}

export default async function ItemHistoryPage() {
    const obtained = fileStore.obtained;
    const rolled = fileStore.rolled;

    if (!obtained || !rolled) {
        return `
            <h1>Item history</h1>
            <p>Please upload your files on the Home page first.</p>
        `;
    }

    await fileStore.ensureItemsLoaded();
    const itemsById = new Map((fileStore.items || []).map((item) => [String(item.id), item]));

    const obtainedIds = normalizeIds(obtained);
    const rolledIds = normalizeIds(rolled);

    return `
        <h1>Item history</h1>
        <p class="roll-intro">Items are shown in the same order as your uploaded files.</p>
        ${renderSection("Obtained", obtainedIds, itemsById)}
        ${renderSection("Rolled", rolledIds, itemsById)}
    `;
}
