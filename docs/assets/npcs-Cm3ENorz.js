import{i as A,p as w,a as D,f as l,N as L,b as $}from"./index-CRaUb4Kp.js";const F=new Set([23490,21257]);function P(e,t,o){if(!o?.isSlayerLocked)return!1;const n=Number(e?.id);return!(!F.has(n)||n===23490&&t?.includes("Muddy chest"))}function T(e){return!Number.isFinite(e)||e<=0?0:e>1?1:e}function k(e){return Array.isArray(e)?e.map(t=>t&&typeof t=="object"?t.id:t):[]}function B(e,t,o,n){return!(!e||t.has(e.id)||n.onlyRolled&&!o.has(e.id)||n.npcOnlyRolled&&!o.has(e.id)||D(e)||!n.hasFlatpacks&&e.tags?.includes("flatpack")||!n.hasItemsets&&e.tags?.includes("itemset")||n.hideClue&&e.tags?.includes("clue-reward-only"))}function x(e){return new Set(k(e))}function E(e){if(!e)return 0;let t=0;if(Array.isArray(e))for(const o of e){if(!o?.droprate)continue;const n=w(o.droprate);n>t&&(t=n)}else e?.droprate&&(t=w(e.droprate));return!Number.isFinite(t)||t<0?0:t}function O(e){if(!e)return"";let t=null,o=0;if(Array.isArray(e))for(const n of e){if(!n?.droprate)continue;const p=w(n.droprate);p>o&&(o=p,t=n.droprate)}else e?.droprate&&(t=e.droprate);return t?` (${t})`:""}function H(e){if(!Number.isFinite(e)||e<=0)return"0%";const o=Math.min(e,1)*100;return e>1?">=100%":`${o.toFixed(2)}%`}async function _({items:e,obtained:t,rolled:o,player:n,filters:p}){const d=Array.isArray(e)?e:[],r=k(t),f=Array.isArray(o)?o:[],a=p||{},m=x(f),N=new Set(r),C={items:d,obtained:r,rolled:f,player:n,filters:a},S=new Map;for(const c of d){if(!B(c,N,m,a))continue;const s=c.sources?.drops;if(s)for(const i of Object.keys(s)){if(P(c,i,a))continue;const u=S.get(i)||[];u.push(c),S.set(i,u)}}const b=[];for(const[c,s]of S.entries()){if(!s.length||!await A(c,C))continue;let i=0;for(const u of s){const g=u.sources?.drops?.[c];if(!g)continue;let y=-1/0;if(Array.isArray(g))for(const R of g)R?.droprate&&(y=Math.max(y,w(R.droprate)));else g?.droprate&&(y=w(g.droprate));i+=T(y)}b.push({npcName:c,items:s,totalRateScore:i})}return b.sort((c,s)=>{if(a.npcSortByRate){const u=s.totalRateScore-c.totalRateScore;if(u!==0)return u}const i=s.items.length-c.items.length;return i!==0?i:c.npcName.localeCompare(s.npcName)}),{entries:b,rolledSet:m}}function h(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function j(e){return/^Reward casket \(/i.test(e||"")}async function q(){if(!l.player)return`
            <h1>NPC drops</h1>
            <p>Please upload your files and player name on the Upload page first.</p>
        `;await l.ensureItemsLoaded();const e=l.filters||{},t=!!e.npcCollapseDrops,{entries:o,rolledSet:n}=await _({items:l.items||[],obtained:l.obtained||[],rolled:l.rolled||[],player:l.player,filters:e});if(!o.length)return`
            <h1>NPC drops</h1>
            <p class="empty-state">No reachable NPCs with remaining drops for your current filters.</p>
        `;const p=o.map(r=>{const f=r.items.length,a=f===1?"item":"items",m=L[r.npcName]?.wiki,C=j(r.npcName)?'<span class="clue-step-info npc-drop-rate-info" tabindex="0" aria-label="Clue casket roll information" title="Chance for a new roll is per roll inside the casket, not per casket.">i</span>':"",S=m?`<a class="npc-drop-name-link" href="${m}" target="_blank" rel="noreferrer">${h(r.npcName)}</a>`:`<span class="npc-drop-name-text">${h(r.npcName)}</span>`;let b="";t||(b=r.items.sort((s,i)=>{const u=E(s.sources?.drops?.[r.npcName]),y=E(i.sources?.drops?.[r.npcName])-u;return y!==0?y:s.name.localeCompare(i.name)}).map(s=>{const i=s.sources?.drops?.[r.npcName],u=O(i),g=n.has(s.id);return`
                    <div class="npc-drop-item" onclick="navigate('/item?id=${s.id}')">
                        <img class="npc-drop-item-image" src="/images/${s.image}" alt="${h(s.name)}">
                        <span class="npc-drop-item-name">${h(s.name)}${h(u)}</span>
                        ${g?'<span class="badge rolled npc-drop-rolled">Rolled</span>':""}
                    </div>
                `}).join(""));const c=r.items.map(s=>s.name.toLowerCase()).join(" ");return`
            <article class="npc-drop-card" data-name="${h(r.npcName.toLowerCase())}" data-items="${h(c)}">
                <header class="npc-drop-card-header">
                    <h2 class="npc-drop-name">${S}</h2>
                    <span class="npc-drop-count">${f} ${a}</span>
                </header>
                <div class="npc-drop-rate">Chance to get a new roll: ${H(r.totalRateScore)}${C}</div>
                ${t?"":`
                    <div class="npc-drop-items">
                        ${b}
                    </div>
                `}
            </article>
        `}).join(""),d=o.length?"none":"";return`
        <h1>NPC drops</h1>
        <div class="npc-drop-filters">
            <label class="npc-drop-filter">
                <span>Search NPCs or items:</span>
                <input type="search" id="npcSearch" value="${h(e.npcSearch??"")}" placeholder="NPC or item name">
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
    `}function I(e){const t=(l.filters?.npcSearch||"").trim().toLowerCase(),o=e.querySelectorAll(".npc-drop-card");let n=0;for(const d of o){if(!t){d.style.display="",n+=1;continue}const r=d.dataset.name||"",f=d.dataset.items||"",a=r.includes(t)||f.includes(t);d.style.display=a?"":"none",a&&(n+=1)}const p=document.getElementById("npcEmptyState");p&&(p.style.display=n?"none":"")}let v=null;function z(){M();const e=document.getElementById("npcDropList");e&&I(e);const t=document.getElementById("npcSortToggle");t&&(t.checked=!!l.filters?.npcSortByRate);const o=document.getElementById("npcOnlyRolledToggle");o&&(o.checked=!!l.filters?.npcOnlyRolled);const n=document.getElementById("npcCollapseDropsToggle");n&&(n.checked=!!l.filters?.npcCollapseDrops),$(()=>window.dispatchEvent(new PopStateEvent("popstate")));const p=async a=>{if(a.target.id!=="npcSearch")return;const m={...l.filters,npcSearch:a.target.value};await l.setFilters(m);const N=document.getElementById("npcDropList");N&&I(N)},d=async a=>{if(a.target.id!=="npcSortToggle")return;const m=!l.filters?.npcSortByRate;await l.setFilters({...l.filters,npcSortByRate:m}),window.dispatchEvent(new PopStateEvent("popstate"))},r=async a=>{a.target.id==="npcOnlyRolledToggle"&&(await l.setFilters({...l.filters,npcOnlyRolled:a.target.checked}),window.dispatchEvent(new PopStateEvent("popstate")))},f=async a=>{a.target.id==="npcCollapseDropsToggle"&&(await l.setFilters({...l.filters,npcCollapseDrops:a.target.checked}),window.dispatchEvent(new PopStateEvent("popstate")))};document.addEventListener("input",p),document.addEventListener("input",d),document.addEventListener("input",r),document.addEventListener("input",f),v=()=>{document.removeEventListener("input",p),document.removeEventListener("input",d),document.removeEventListener("input",r),document.removeEventListener("input",f)}}function M(){typeof v=="function"&&v(),v=null}export{q as default,z as init,M as teardown};
