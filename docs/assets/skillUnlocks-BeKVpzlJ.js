import{f as y}from"./index-zP2e84ue.js";const x=["Melee","Melee armours","Ranged","Ranged armours","Magic","Magic armours","Prayer armours","Food","Other skill boosts","Potion","Teleports","Cooking","Construction","Crafting","Farming","Fletching","Fishing","Hunter","Mining","Prayer","Runecraft","Smithing","Woodcutting"];function a(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function H(e){return String(e).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")}function M(e){return String(e||"").toLowerCase().replace(/[^a-z0-9]/g,"")}function O(e,n){if(!e)return null;const t=String(n||"").toLowerCase();return e.has(t)?e.get(t):null}function P(e,n){const t=e?.amount;if(typeof t=="number")return{value:t,known:!0};if(t&&typeof t=="object"&&t.type==="tiered"){const i=t.basedOn||e?.skill,c=O(n,i);if(c==null)return{value:null,known:!1};const o=Array.isArray(t.tiers)?t.tiers:[];for(const s of o)if(c>=s.min&&c<=s.max)return{value:s.amount,known:!0};return{value:null,known:!1}}return{value:null,known:!1}}async function R(){const e=y.obtained,n=y.rolled;if(!e||!n)return`
            <h1>Unlocks by skill</h1>
            <p>Please upload your files on the Upload page first.</p>
        `;await y.ensureItemsLoaded();const t=y.items||[],i=y.player?.levels||null,c=i?new Map(Object.entries(i).map(([d,m])=>[String(d).toLowerCase(),m])):null,o=new Set(e),s=new Set(n),l=new Map,u=x.map(d=>{const m=H(d)||"section",g=l.get(m)||0;l.set(m,g+1);const $=g?`${m}-${g+1}`:m;return{tag:d,id:$}}),p=u.map(({tag:d,id:m})=>`
        <a class="unlock-jump-link" href="#${a(m)}">${a(d)}</a>
    `).join(""),j=u.map(({tag:d,id:m})=>{const g=t.filter(r=>{const k=r.tags||[];return(Array.isArray(k)?k.includes(d):k===d)?o.has(r.id)&&s.has(r.id):!1});g.sort((r,k)=>r.name.localeCompare(k.name));const $=g.map(r=>{const k=Array.isArray(r.boosts)?r.boosts:[],w=k.length?`
                    <div class="unlock-boosts">
                        ${k.map(L=>{const f=L?.skill||"",v=P(L,c),h=v.known?`+${v.value}`:"+?",I=f?`${f} ${h}`:h,S=M(f),E=S?`<img class="unlock-boost-icon" src="/images/skills/${a(S)}.png" alt="${a(f)} icon">`:"",A=S?"":`<span class="unlock-boost-label">${a(I)}</span>`,q=v.known?`${f} ${h}`:`${f} boost (requires player level)`;return`
                                <span class="unlock-boost${v.known?"":" unlock-boost--unknown"}" title="${a(q)}">
                                    ${E}
                                    <span class="unlock-boost-text">${a(h)}</span>
                                    ${A}
                                </span>
                            `}).join("")}
                    </div>
                `:"";return`
                <div class="unlock-item" data-name="${a(r.name.toLowerCase())}">
                    <img class="unlock-item-image" src="/images/${r.image}" alt="${a(r.name)}">
                    <div class="unlock-item-details">
                        <span class="unlock-item-name">${a(r.name)}</span>
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
                        ${$||'<p class="unlock-empty">No unlocked items yet.</p>'}
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
    `}function C(e,n){e.classList.toggle("is-collapsed",n);const t=e.querySelector(".unlock-toggle");t&&(t.textContent=n?"Show":"Hide",t.setAttribute("aria-expanded",n?"false":"true"))}function U(e){const n=(document.getElementById("unlockSearch")?.value||"").trim().toLowerCase(),t=e.querySelectorAll(".unlock-section");for(const i of t){let c=0;const o=i.querySelectorAll(".unlock-item");for(const l of o){const u=l.dataset.name||"",p=!n||u.includes(n);l.style.display=p?"":"none",p&&(c+=1)}const s=i.querySelector(".unlock-empty");s&&(s.style.display=c?"none":"",s.textContent=n?"No matching items.":"No unlocked items yet."),i.style.display=c||!n?"":"none"}}let b=null;function F(){B();const e=document.getElementById("unlockList");if(!e)return;const n=[],t=document.querySelector(".unlock-jump");if(t){const o=s=>{const l=s.target.closest(".unlock-jump-link");if(!l)return;const u=l.getAttribute("href")?.slice(1);if(!u)return;const p=document.getElementById(u);p&&(s.preventDefault(),history.replaceState(null,"",`#${u}`),p.scrollIntoView({behavior:"smooth",block:"start"}))};t.addEventListener("click",o),n.push(()=>t.removeEventListener("click",o))}e.querySelectorAll(".unlock-section").forEach(o=>{const s=o.dataset.section||"";localStorage.getItem(`unlock-section:${s}`)==="collapsed"&&C(o,!0)});const i=document.getElementById("unlockSearch");if(i){const o=()=>U(e);i.addEventListener("input",o),n.push(()=>i.removeEventListener("input",o))}const c=o=>{const s=o.target.closest(".unlock-toggle");if(!s)return;const l=s.closest(".unlock-section");if(!l)return;const u=!l.classList.contains("is-collapsed");C(l,u);const p=l.dataset.section||"";localStorage.setItem(`unlock-section:${p}`,u?"collapsed":"expanded")};e.addEventListener("click",c),n.push(()=>e.removeEventListener("click",c)),b=()=>{for(const o of n)o()}}function B(){typeof b=="function"&&b(),b=null}export{R as default,F as init,B as teardown};
