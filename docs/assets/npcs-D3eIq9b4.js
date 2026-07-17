import{f as e,N as R,i as $}from"./index-DIU_JdlZ.js";import{b as k,g as w,a as L,f as D}from"./npcDropEntries-zrEw0NwT.js";function p(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function P(s){return/^Reward casket \(/i.test(s||"")}async function T(){if(!e.player)return`
            <h1>NPC drops</h1>
            <p>Please upload your files and player name on the Upload page first.</p>
        `;await e.ensureItemsLoaded();const s=e.filters||{},a=!!s.npcCollapseDrops,{entries:r,rolledSet:c}=await k({items:e.items||[],obtained:e.obtained||[],rolled:e.rolled||[],player:e.player,filters:s}),i=r.map(t=>{const d=t.items.length,n=d===1?"item":"items",u=R[t.npcName]?.wiki,N=P(t.npcName)?'<span class="clue-step-info npc-drop-rate-info" tabindex="0" aria-label="Clue casket roll information" title="Chance for a new roll is per roll inside the casket, not per casket.">i</span>':"",S=u?`<a class="npc-drop-name-link" href="${u}" target="_blank" rel="noreferrer">${p(t.npcName)}</a>`:`<span class="npc-drop-name-text">${p(t.npcName)}</span>`;let y="";a||(y=t.items.sort((o,m)=>{const h=w(o.sources?.drops?.[t.npcName]),v=w(m.sources?.drops?.[t.npcName])-h;return v!==0?v:o.name.localeCompare(m.name)}).map(o=>{const m=o.sources?.drops?.[t.npcName],h=L(m),b=c.has(o.id);return`
                    <div class="npc-drop-item" onclick="navigate('/item?id=${o.id}')">
                        <img class="npc-drop-item-image" src="/images/${o.image}" alt="${p(o.name)}">
                        <span class="npc-drop-item-name">${p(o.name)}${p(h)}</span>
                        ${b?'<span class="badge rolled npc-drop-rolled">Rolled</span>':""}
                    </div>
                `}).join(""));const E=t.items.map(o=>o.name.toLowerCase()).join(" ");return`
            <article class="npc-drop-card" data-name="${p(t.npcName.toLowerCase())}" data-items="${p(E)}">
                <header class="npc-drop-card-header">
                    <h2 class="npc-drop-name">${S}</h2>
                    <span class="npc-drop-count">${d} ${n}</span>
                </header>
                <div class="npc-drop-rate">Chance to get a new roll: ${D(t.totalRateScore)}${N}</div>
                ${a?"":`
                    <div class="npc-drop-items">
                        ${y}
                    </div>
                `}
            </article>
        `}).join(""),l=r.length?"none":"";return`
        <h1>NPC drops</h1>
        <div class="npc-drop-filters">
            <label class="npc-drop-filter">
                <span>Search NPCs or items:</span>
                <input type="search" id="npcSearch" value="${p(s.npcSearch??"")}" placeholder="NPC or item name">
            </label>
            <label class="npc-drop-sort">
                <span class="npc-drop-sort-title">Sort by:</span>
                <span class="npc-drop-sort-label">Amount of new rolls</span>
                <span class="toggle-switch npc-sort-toggle">
                    <input type="checkbox" id="npcSortToggle" aria-label="Toggle NPC sort order">
                    <span class="toggle-slider" aria-hidden="true"></span>
                </span>
                <span class="npc-drop-sort-label">Chance for new roll</span>
            </label>
            <label class="npc-drop-filter npc-drop-filter--checkbox">
                <input type="checkbox" id="npcOnlyRolledToggle">
                <span>Show only rolled items</span>
            </label>
            <label class="npc-drop-filter npc-drop-filter--checkbox">
                <input type="checkbox" id="npcCollapseDropsToggle">
                <span>Collapse drops</span>
            </label>
            <div class="npc-filter" id="npcFilter">
                <button type="button" id="npcFilterToggle">Hide specific NPCs</button>
                <div class="npc-filter-panel" id="npcFilterPanel">
                    <input type="search" id="npcFilterSearch" placeholder="Search NPCs...">
                    <div class="npc-filter-actions">
                        <button type="button" id="npcFilterAll">All</button>
                        <button type="button" id="npcFilterNone">None</button>
                    </div>
                    <div class="npc-filter-list" id="npcFilterList"></div>
                    <div class="npc-filter-actions npc-filter-actions--apply">
                        <button type="button" id="npcFilterApply">Apply</button>
                    </div>
                </div>
            </div>
        </div>
        <p class="empty-state" id="npcEmptyState" style="display: ${l};">No reachable NPCs with remaining drops for your current filters.</p>
        <section class="npc-drop-list" id="npcDropList">
            ${i}
        </section>
    `}function C(s){const a=(e.filters?.npcSearch||"").trim().toLowerCase(),r=s.querySelectorAll(".npc-drop-card");let c=0;for(const l of r){if(!a){l.style.display="",c+=1;continue}const t=l.dataset.name||"",d=l.dataset.items||"",n=t.includes(a)||d.includes(a);l.style.display=n?"":"none",n&&(c+=1)}const i=document.getElementById("npcEmptyState");i&&(i.style.display=c?"none":"")}let f=null;function x(){I();const s=document.getElementById("npcDropList");s&&C(s);const a=document.getElementById("npcSortToggle");a&&(a.checked=!!e.filters?.npcSortByRate);const r=document.getElementById("npcOnlyRolledToggle");r&&(r.checked=!!e.filters?.npcOnlyRolled);const c=document.getElementById("npcCollapseDropsToggle");c&&(c.checked=!!e.filters?.npcCollapseDrops),$(()=>window.dispatchEvent(new PopStateEvent("popstate")));const i=n=>{if(n.target.id!=="npcSearch")return;const u={...e.filters,npcSearch:n.target.value};e.setFilters(u);const g=document.getElementById("npcDropList");g&&C(g)},l=async n=>{if(n.target.id!=="npcSortToggle")return;const u=!e.filters?.npcSortByRate;await e.setFilters({...e.filters,npcSortByRate:u}),window.dispatchEvent(new PopStateEvent("popstate"))},t=async n=>{n.target.id==="npcOnlyRolledToggle"&&(await e.setFilters({...e.filters,npcOnlyRolled:n.target.checked}),window.dispatchEvent(new PopStateEvent("popstate")))},d=async n=>{n.target.id==="npcCollapseDropsToggle"&&(await e.setFilters({...e.filters,npcCollapseDrops:n.target.checked}),window.dispatchEvent(new PopStateEvent("popstate")))};document.addEventListener("input",i),document.addEventListener("input",l),document.addEventListener("input",t),document.addEventListener("input",d),f=()=>{document.removeEventListener("input",i),document.removeEventListener("input",l),document.removeEventListener("input",t),document.removeEventListener("input",d)}}function I(){typeof f=="function"&&f(),f=null}export{T as default,x as init,I as teardown};
