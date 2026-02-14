import{i as I,p as S,a as L,f as r,N as $,b as k}from"./index-CCEyWozr.js";const F=new Set([23490,21257]);function P(e,t,s){if(!s?.isSlayerLocked)return!1;const n=Number(e?.id);return!(!F.has(n)||n===23490&&t?.includes("Muddy chest"))}function T(e){return!Number.isFinite(e)||e<=0?0:e>1?1:e}function D(e){return Array.isArray(e)?e.map(t=>t&&typeof t=="object"?t.id:t):[]}function B(e,t,s,n){return!(!e||t.has(e.id)||n.onlyRolled&&!s.has(e.id)||n.npcOnlyRolled&&!s.has(e.id)||L(e)||!n.hasFlatpacks&&e.tags?.includes("flatpack")||!n.hasItemsets&&e.tags?.includes("itemset")||n.hideClue&&e.tags?.includes("clue-reward-only"))}function x(e){return new Set(D(e))}function E(e){if(!e)return 0;let t=0;if(Array.isArray(e))for(const s of e){if(!s?.droprate)continue;const n=S(s.droprate);n>t&&(t=n)}else e?.droprate&&(t=S(e.droprate));return!Number.isFinite(t)||t<0?0:t}function O(e){if(!e)return"";let t=null,s=0;if(Array.isArray(e))for(const n of e){if(!n?.droprate)continue;const p=S(n.droprate);p>s&&(s=p,t=n.droprate)}else e?.droprate&&(t=e.droprate);return t?` (${t})`:""}function H(e){if(!Number.isFinite(e)||e<=0)return"0%";const s=Math.min(e,1)*100;return e>1?">=100%":`${s.toFixed(2)}%`}async function _({items:e,obtained:t,rolled:s,player:n,filters:p}){const d=Array.isArray(e)?e:[],a=D(t),f=Array.isArray(s)?s:[],o=p||{},g=x(f),h=new Set(a),v={items:d,obtained:a,rolled:f,player:n,filters:o},b=new Map;for(const c of d){if(!B(c,h,g,o))continue;const l=c.sources?.drops;if(l)for(const u of Object.keys(l)){if(P(c,u,o))continue;const m=b.get(u)||[];m.push(c),b.set(u,m)}}const i=[];for(const[c,l]of b.entries()){if(!l.length||!await I(c,v))continue;let u=0;for(const m of l){const N=m.sources?.drops?.[c];if(!N)continue;let w=-1/0;if(Array.isArray(N))for(const C of N)C?.droprate&&(w=Math.max(w,S(C.droprate)));else N?.droprate&&(w=S(N.droprate));u+=T(w)}i.push({npcName:c,items:l,totalRateScore:u})}return i.sort((c,l)=>{if(o.npcSortByRate){const m=l.totalRateScore-c.totalRateScore;if(m!==0)return m}const u=l.items.length-c.items.length;return u!==0?u:c.npcName.localeCompare(l.npcName)}),{entries:i,rolledSet:g}}function y(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}async function V(){if(!r.player)return`
            <h1>NPC drops</h1>
            <p>Please upload your files and player name on the Upload page first.</p>
        `;await r.ensureItemsLoaded();const e=r.filters||{},t=!!e.npcCollapseDrops,{entries:s,rolledSet:n}=await _({items:r.items||[],obtained:r.obtained||[],rolled:r.rolled||[],player:r.player,filters:e});if(!s.length)return`
            <h1>NPC drops</h1>
            <p class="empty-state">No reachable NPCs with remaining drops for your current filters.</p>
        `;const p=s.map(a=>{const f=a.items.length,o=f===1?"item":"items",g=$[a.npcName]?.wiki,h=g?`<a class="npc-drop-name-link" href="${g}" target="_blank" rel="noreferrer">${y(a.npcName)}</a>`:`<span class="npc-drop-name-text">${y(a.npcName)}</span>`;let v="";t||(v=a.items.sort((i,c)=>{const l=E(i.sources?.drops?.[a.npcName]),m=E(c.sources?.drops?.[a.npcName])-l;return m!==0?m:i.name.localeCompare(c.name)}).map(i=>{const c=i.sources?.drops?.[a.npcName],l=O(c),u=n.has(i.id);return`
                    <div class="npc-drop-item" onclick="navigate('/item?id=${i.id}')">
                        <img class="npc-drop-item-image" src="/images/${i.image}" alt="${y(i.name)}">
                        <span class="npc-drop-item-name">${y(i.name)}${y(l)}</span>
                        ${u?'<span class="badge rolled npc-drop-rolled">Rolled</span>':""}
                    </div>
                `}).join(""));const b=a.items.map(i=>i.name.toLowerCase()).join(" ");return`
            <article class="npc-drop-card" data-name="${y(a.npcName.toLowerCase())}" data-items="${y(b)}">
                <header class="npc-drop-card-header">
                    <h2 class="npc-drop-name">${h}</h2>
                    <span class="npc-drop-count">${f} ${o}</span>
                </header>
                <div class="npc-drop-rate">Chance to get a new roll: ${H(a.totalRateScore)}</div>
                ${t?"":`
                    <div class="npc-drop-items">
                        ${v}
                    </div>
                `}
            </article>
        `}).join(""),d=s.length?"none":"";return`
        <h1>NPC drops</h1>
        <div class="npc-drop-filters">
            <label class="npc-drop-filter">
                <span>Search NPCs or items:</span>
                <input type="search" id="npcSearch" value="${y(e.npcSearch??"")}" placeholder="NPC or item name">
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
        <p class="empty-state" id="npcEmptyState" style="display: ${d};">No reachable NPCs with remaining drops for your current filters.</p>
        <section class="npc-drop-list" id="npcDropList">
            ${p}
        </section>
    `}function A(e){const t=(r.filters?.npcSearch||"").trim().toLowerCase(),s=e.querySelectorAll(".npc-drop-card");let n=0;for(const d of s){if(!t){d.style.display="",n+=1;continue}const a=d.dataset.name||"",f=d.dataset.items||"",o=a.includes(t)||f.includes(t);d.style.display=o?"":"none",o&&(n+=1)}const p=document.getElementById("npcEmptyState");p&&(p.style.display=n?"none":"")}let R=null;function q(){j();const e=document.getElementById("npcDropList");e&&A(e);const t=document.getElementById("npcSortToggle");t&&(t.checked=!!r.filters?.npcSortByRate);const s=document.getElementById("npcOnlyRolledToggle");s&&(s.checked=!!r.filters?.npcOnlyRolled);const n=document.getElementById("npcCollapseDropsToggle");n&&(n.checked=!!r.filters?.npcCollapseDrops),k(()=>window.dispatchEvent(new PopStateEvent("popstate")));const p=async o=>{if(o.target.id!=="npcSearch")return;const g={...r.filters,npcSearch:o.target.value};await r.setFilters(g);const h=document.getElementById("npcDropList");h&&A(h)},d=async o=>{if(o.target.id!=="npcSortToggle")return;const g=!r.filters?.npcSortByRate;await r.setFilters({...r.filters,npcSortByRate:g}),window.dispatchEvent(new PopStateEvent("popstate"))},a=async o=>{o.target.id==="npcOnlyRolledToggle"&&(await r.setFilters({...r.filters,npcOnlyRolled:o.target.checked}),window.dispatchEvent(new PopStateEvent("popstate")))},f=async o=>{o.target.id==="npcCollapseDropsToggle"&&(await r.setFilters({...r.filters,npcCollapseDrops:o.target.checked}),window.dispatchEvent(new PopStateEvent("popstate")))};document.addEventListener("input",p),document.addEventListener("input",d),document.addEventListener("input",a),document.addEventListener("input",f),R=()=>{document.removeEventListener("input",p),document.removeEventListener("input",d),document.removeEventListener("input",a),document.removeEventListener("input",f)}}function j(){typeof R=="function"&&R(),R=null}export{V as default,q as init,j as teardown};
