import{i as D,p as S,a as $,f as a,N as F}from"./index-CoGxWBTG.js";const k=new Set([23490,21257]);function I(e,t,n){if(!n?.isSlayerLocked)return!1;const s=Number(e?.id);return!(!k.has(s)||s===23490&&t?.includes("Muddy chest"))}function P(e){return!Number.isFinite(e)||e<=0?0:e>1?1:e}function E(e){return Array.isArray(e)?e.map(t=>t&&typeof t=="object"?t.id:t):[]}function L(e,t,n,s){return!(!e||t.has(e.id)||s.onlyRolled&&!n.has(e.id)||s.npcOnlyRolled&&!n.has(e.id)||$(e)||!s.hasFlatpacks&&e.tags?.includes("flatpack")||!s.hasItemsets&&e.tags?.includes("itemset")||s.hideClue&&e.tags?.includes("clue-reward-only"))}function T(e){return new Set(E(e))}function C(e){if(!e)return 0;let t=0;if(Array.isArray(e))for(const n of e){if(!n?.droprate)continue;const s=S(n.droprate);s>t&&(t=s)}else e?.droprate&&(t=S(e.droprate));return!Number.isFinite(t)||t<0?0:t}function B(e){if(!e)return"";let t=null,n=0;if(Array.isArray(e))for(const s of e){if(!s?.droprate)continue;const d=S(s.droprate);d>n&&(n=d,t=s.droprate)}else e?.droprate&&(t=e.droprate);return t?` (${t})`:""}function x(e){if(!Number.isFinite(e)||e<=0)return"0%";const n=Math.min(e,1)*100;return e>1?">=100%":`${n.toFixed(2)}%`}async function O({items:e,obtained:t,rolled:n,player:s,filters:d}){const u=Array.isArray(e)?e:[],o=E(t),g=Array.isArray(n)?n:[],f=d||{},y=T(g),v=new Set(o),N={items:u,obtained:o,rolled:g,player:s,filters:f},h=new Map;for(const r of u){if(!L(r,v,y,f))continue;const c=r.sources?.drops;if(c)for(const l of Object.keys(c)){if(I(r,l,f))continue;const p=h.get(l)||[];p.push(r),h.set(l,p)}}const i=[];for(const[r,c]of h.entries()){if(!c.length||!await D(r,N))continue;let l=0;for(const p of c){const b=p.sources?.drops?.[r];if(!b)continue;let w=-1/0;if(Array.isArray(b))for(const R of b)R?.droprate&&(w=Math.max(w,S(R.droprate)));else b?.droprate&&(w=S(b.droprate));l+=P(w)}i.push({npcName:r,items:c,totalRateScore:l})}return i.sort((r,c)=>{if(f.npcSortByRate){const p=c.totalRateScore-r.totalRateScore;if(p!==0)return p}const l=c.items.length-r.items.length;return l!==0?l:r.npcName.localeCompare(c.npcName)}),{entries:i,rolledSet:y}}function m(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}async function _(){if(!a.player)return`
            <h1>NPC drops</h1>
            <p>Please upload your files and player name on the Upload page first.</p>
        `;await a.ensureItemsLoaded();const e=a.filters||{},t=!!e.npcCollapseDrops,{entries:n,rolledSet:s}=await O({items:a.items||[],obtained:a.obtained||[],rolled:a.rolled||[],player:a.player,filters:e});if(!n.length)return`
            <h1>NPC drops</h1>
            <p class="empty-state">No reachable NPCs with remaining drops for your current filters.</p>
        `;const d=n.map(o=>{const g=o.items.length,f=g===1?"item":"items",y=F[o.npcName]?.wiki,v=y?`<a class="npc-drop-name-link" href="${y}" target="_blank" rel="noreferrer">${m(o.npcName)}</a>`:`<span class="npc-drop-name-text">${m(o.npcName)}</span>`;let N="";t||(N=o.items.sort((i,r)=>{const c=C(i.sources?.drops?.[o.npcName]),p=C(r.sources?.drops?.[o.npcName])-c;return p!==0?p:i.name.localeCompare(r.name)}).map(i=>{const r=i.sources?.drops?.[o.npcName],c=B(r),l=s.has(i.id);return`
                    <div class="npc-drop-item" onclick="navigate('/item?id=${i.id}')">
                        <img class="npc-drop-item-image" src="/images/${i.image}" alt="${m(i.name)}">
                        <span class="npc-drop-item-name">${m(i.name)}${m(c)}</span>
                        ${l?'<span class="badge rolled npc-drop-rolled">Rolled</span>':""}
                    </div>
                `}).join(""));const h=o.items.map(i=>i.name.toLowerCase()).join(" ");return`
            <article class="npc-drop-card" data-name="${m(o.npcName.toLowerCase())}" data-items="${m(h)}">
                <header class="npc-drop-card-header">
                    <h2 class="npc-drop-name">${v}</h2>
                    <span class="npc-drop-count">${g} ${f}</span>
                </header>
                <div class="npc-drop-rate">Chance to get a new roll: ${x(o.totalRateScore)}</div>
                ${t?"":`
                    <div class="npc-drop-items">
                        ${N}
                    </div>
                `}
            </article>
        `}).join(""),u=n.length?"none":"";return`
        <h1>NPC drops</h1>
        <div class="npc-drop-filters">
            <label class="npc-drop-filter">
                <span>Search NPCs or items:</span>
                <input type="search" id="npcSearch" value="${m(e.npcSearch??"")}" placeholder="NPC or item name">
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
        <p class="empty-state" id="npcEmptyState" style="display: ${u};">No reachable NPCs with remaining drops for your current filters.</p>
        <section class="npc-drop-list" id="npcDropList">
            ${d}
        </section>
    `}function A(e){const t=(a.filters?.npcSearch||"").trim().toLowerCase(),n=e.querySelectorAll(".npc-drop-card");let s=0;for(const u of n){if(!t){u.style.display="",s+=1;continue}const o=u.dataset.name||"",g=u.dataset.items||"",f=o.includes(t)||g.includes(t);u.style.display=f?"":"none",f&&(s+=1)}const d=document.getElementById("npcEmptyState");d&&(d.style.display=s?"none":"")}document.addEventListener("input",async e=>{if(e.target.id!=="npcSearch")return;const t={...a.filters,npcSearch:e.target.value};await a.setFilters(t);const n=document.getElementById("npcDropList");n&&A(n)});window.initNpcsPage=function(){const e=document.getElementById("npcDropList");e&&A(e);const t=document.getElementById("npcSortToggle");t&&(t.checked=!!a.filters?.npcSortByRate);const n=document.getElementById("npcOnlyRolledToggle");n&&(n.checked=!!a.filters?.npcOnlyRolled);const s=document.getElementById("npcCollapseDropsToggle");s&&(s.checked=!!a.filters?.npcCollapseDrops),typeof window.initNpcFilterUI=="function"&&window.initNpcFilterUI(()=>window.dispatchEvent(new PopStateEvent("popstate")))};document.addEventListener("input",async e=>{if(e.target.id!=="npcSortToggle")return;const t=!a.filters?.npcSortByRate;await a.setFilters({...a.filters,npcSortByRate:t}),window.dispatchEvent(new PopStateEvent("popstate"))});document.addEventListener("input",async e=>{e.target.id==="npcOnlyRolledToggle"&&(await a.setFilters({...a.filters,npcOnlyRolled:e.target.checked}),window.dispatchEvent(new PopStateEvent("popstate")))});document.addEventListener("input",async e=>{e.target.id==="npcCollapseDropsToggle"&&(await a.setFilters({...a.filters,npcCollapseDrops:e.target.checked}),window.dispatchEvent(new PopStateEvent("popstate")))});export{_ as default};
