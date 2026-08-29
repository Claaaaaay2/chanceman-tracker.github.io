import{f as y}from"./index-DHKlTJe4.js";const H=["Melee","Melee armours","Ranged","Ranged armours","Magic","Magic armours","Prayer armours","Food","Other skill boosts","Potion","Teleports","Cooking","Construction","Crafting","Farming","Fletching","Fishing","Herblore","Hunter","Mining","Prayer","Runecraft","Sailing","Slayer","Smithing","Woodcutting","God Wars - Armadyl","God Wars - Bandos","God Wars - Saradomin","God Wars - Zamorak"];function a(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function x(e){return String(e).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")}function M(e){return String(e||"").toLowerCase().replace(/[^a-z0-9]/g,"")}function B(e,t){if(!e)return null;const n=String(t||"").toLowerCase();return e.has(n)?e.get(n):null}function O(e,t){const n=e?.amount;if(typeof n=="number")return{value:n,known:!0};if(n&&typeof n=="object"&&n.type==="tiered"){const r=n.basedOn||e?.skill,c=B(t,r);if(c==null)return{value:null,known:!1};const o=Array.isArray(n.tiers)?n.tiers:[];for(const s of o)if(c>=s.min&&c<=s.max)return{value:s.amount,known:!0};return{value:null,known:!1}}return{value:null,known:!1}}async function R(){const e=y.obtained,t=y.rolled;if(!e||!t)return`
            <h1>Unlocks by skill</h1>
            <p>Please upload your files on the Upload page first.</p>
        `;await y.ensureItemsLoaded();const n=y.items||[],r=y.player?.levels||null,c=r?new Map(Object.entries(r).map(([d,m])=>[String(d).toLowerCase(),m])):null,o=new Set(e),s=new Set(t),l=new Map,u=H.map(d=>{const m=x(d)||"section",g=l.get(m)||0;l.set(m,g+1);const S=g?`${m}-${g+1}`:m;return{tag:d,id:S}}),p=u.map(({tag:d,id:m})=>`
        <a class="unlock-jump-link" href="#${a(m)}">${a(d)}</a>
    `).join(""),j=u.map(({tag:d,id:m})=>{const g=n.filter(i=>{const k=i.tags||[];return(Array.isArray(k)?k.includes(d):k===d)?o.has(i.id)&&s.has(i.id):!1});g.sort((i,k)=>i.name.localeCompare(k.name));const S=g.map(i=>{const k=Array.isArray(i.boosts)?i.boosts:[],w=k.length?`
                    <div class="unlock-boosts">
                        ${k.map(L=>{const f=L?.skill||"",v=O(L,c),h=v.known?`+${v.value}`:"+?",I=f?`${f} ${h}`:h,$=M(f),A=$?`<img class="unlock-boost-icon" src="/images/skills/${a($)}.png" alt="${a(f)} icon">`:"",E=$?"":`<span class="unlock-boost-label">${a(I)}</span>`,q=v.known?`${f} ${h}`:`${f} boost (requires player level)`;return`
                                <span class="unlock-boost${v.known?"":" unlock-boost--unknown"}" title="${a(q)}">
                                    ${A}
                                    <span class="unlock-boost-text">${a(h)}</span>
                                    ${E}
                                </span>
                            `}).join("")}
                    </div>
                `:"";return`
                <div class="unlock-item" data-name="${a(i.name.toLowerCase())}">
                    <img class="unlock-item-image" src="/images/${i.image}" alt="${a(i.name)}">
                    <div class="unlock-item-details">
                        <span class="unlock-item-name">${a(i.name)}</span>
                        ${w}
                    </div>
                </div>
            `}).join("");return`
            <section class="unlock-section" id="${a(m)}" data-section="${a(d)}">
                <header class="unlock-section-header">
                    <button class="unlock-toggle" type="button" aria-expanded="true">Hide</button>
                    <h2>${a(d)}</h2>
                    <span class="unlock-count">(${g.length})</span>
                </header>
                <div class="unlock-section-body">
                    <div class="unlock-grid">
                        ${S||'<p class="unlock-empty">No unlocked items yet.</p>'}
                    </div>
                </div>
            </section>
        `}).join("");return`
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
                ${p}
            </div>
        </nav>
        <div class="unlock-list" id="unlockList">
            ${j}
        </div>
    `}function C(e,t){e.classList.toggle("is-collapsed",t);const n=e.querySelector(".unlock-toggle");n&&(n.textContent=t?"Show":"Hide",n.setAttribute("aria-expanded",t?"false":"true"))}function P(e){const t=(document.getElementById("unlockSearch")?.value||"").trim().toLowerCase(),n=e.querySelectorAll(".unlock-section");for(const r of n){let c=0;const o=r.querySelectorAll(".unlock-item");for(const l of o){const u=l.dataset.name||"",p=!t||u.includes(t);l.style.display=p?"":"none",p&&(c+=1)}const s=r.querySelector(".unlock-empty");s&&(s.style.display=c?"none":"",s.textContent=t?"No matching items.":"No unlocked items yet."),r.style.display=c||!t?"":"none"}}let b=null;function W(){U();const e=document.getElementById("unlockList");if(!e)return;const t=[],n=document.querySelector(".unlock-jump");if(n){const o=s=>{const l=s.target.closest(".unlock-jump-link");if(!l)return;const u=l.getAttribute("href")?.slice(1);if(!u)return;const p=document.getElementById(u);p&&(s.preventDefault(),history.replaceState(null,"",`#${u}`),p.scrollIntoView({behavior:"smooth",block:"start"}))};n.addEventListener("click",o),t.push(()=>n.removeEventListener("click",o))}e.querySelectorAll(".unlock-section").forEach(o=>{const s=o.dataset.section||"";localStorage.getItem(`unlock-section:${s}`)==="collapsed"&&C(o,!0)});const r=document.getElementById("unlockSearch");if(r){const o=()=>P(e);r.addEventListener("input",o),t.push(()=>r.removeEventListener("input",o))}const c=o=>{const s=o.target.closest(".unlock-toggle");if(!s)return;const l=s.closest(".unlock-section");if(!l)return;const u=!l.classList.contains("is-collapsed");C(l,u);const p=l.dataset.section||"";localStorage.setItem(`unlock-section:${p}`,u?"collapsed":"expanded")};e.addEventListener("click",c),t.push(()=>e.removeEventListener("click",c)),b=()=>{for(const o of t)o()}}function U(){typeof b=="function"&&b(),b=null}export{R as default,W as init,U as teardown};
