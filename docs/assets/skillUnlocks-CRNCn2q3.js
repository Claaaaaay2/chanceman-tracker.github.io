import{f as g}from"./index-CoGxWBTG.js";const q=["Melee","Melee armours","Ranged","Ranged armours","Magic","Magic armours","Prayer armours","Food","Other skill boosts","Potion","Teleports","Cooking","Construction","Crafting","Farming","Fletching","Fishing","Hunter","Mining","Prayer","Runecraft","Smithing","Woodcutting"];function a(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function x(e){return String(e).toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")}function H(e){return String(e||"").toLowerCase().replace(/[^a-z0-9]/g,"")}function M(e,n){if(!e)return null;const t=String(n||"").toLowerCase();return e.has(t)?e.get(t):null}function P(e,n){const t=e?.amount;if(typeof t=="number")return{value:t,known:!0};if(t&&typeof t=="object"&&t.type==="tiered"){const s=t.basedOn||e?.skill,o=M(n,s);if(o==null)return{value:null,known:!1};const l=Array.isArray(t.tiers)?t.tiers:[];for(const c of l)if(o>=c.min&&o<=c.max)return{value:c.amount,known:!0};return{value:null,known:!1}}return{value:null,known:!1}}async function B(){const e=g.obtained,n=g.rolled;if(!e||!n)return`
            <h1>Unlocks by skill</h1>
            <p>Please upload your files on the Upload page first.</p>
        `;await g.ensureItemsLoaded();const t=g.items||[],s=g.player?.levels||null,o=s?new Map(Object.entries(s).map(([r,u])=>[String(r).toLowerCase(),u])):null,l=new Set(e),c=new Set(n),m=new Map,f=q.map(r=>{const u=x(r)||"section",k=m.get(u)||0;m.set(u,k+1);const v=k?`${u}-${k+1}`:u;return{tag:r,id:v}}),y=f.map(({tag:r,id:u})=>`
        <a class="unlock-jump-link" href="#${a(u)}">${a(r)}</a>
    `).join(""),C=f.map(({tag:r,id:u})=>{const k=t.filter(i=>{const d=i.tags||[];return(Array.isArray(d)?d.includes(r):d===r)?l.has(i.id)&&c.has(i.id):!1});k.sort((i,d)=>i.name.localeCompare(d.name));const v=k.map(i=>{const d=Array.isArray(i.boosts)?i.boosts:[],S=d.length?`
                    <div class="unlock-boosts">
                        ${d.map(w=>{const p=w?.skill||"",b=P(w,o),h=b.known?`+${b.value}`:"+?",j=p?`${p} ${h}`:h,$=H(p),I=$?`<img class="unlock-boost-icon" src="/images/skills/${a($)}.png" alt="${a(p)} icon">`:"",A=$?"":`<span class="unlock-boost-label">${a(j)}</span>`,E=b.known?`${p} ${h}`:`${p} boost (requires player level)`;return`
                                <span class="unlock-boost${b.known?"":" unlock-boost--unknown"}" title="${a(E)}">
                                    ${I}
                                    <span class="unlock-boost-text">${a(h)}</span>
                                    ${A}
                                </span>
                            `}).join("")}
                    </div>
                `:"";return`
                <div class="unlock-item" data-name="${a(i.name.toLowerCase())}">
                    <img class="unlock-item-image" src="/images/${i.image}" alt="${a(i.name)}">
                    <div class="unlock-item-details">
                        <span class="unlock-item-name">${a(i.name)}</span>
                        ${S}
                    </div>
                </div>
            `}).join("");return`
            <section class="unlock-section" id="${a(u)}" data-section="${a(r)}">
                <header class="unlock-section-header">
                    <button class="unlock-toggle" type="button" aria-expanded="true">Hide</button>
                    <h2>${a(r)}</h2>
                    <span class="unlock-count">(${k.length})</span>
                </header>
                <div class="unlock-section-body">
                    <div class="unlock-grid">
                        ${v||'<p class="unlock-empty">No unlocked items yet.</p>'}
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
                ${y}
            </div>
        </nav>
        <div class="unlock-list" id="unlockList">
            ${C}
        </div>
    `}function L(e,n){e.classList.toggle("is-collapsed",n);const t=e.querySelector(".unlock-toggle");t&&(t.textContent=n?"Show":"Hide",t.setAttribute("aria-expanded",n?"false":"true"))}function O(e){const n=(document.getElementById("unlockSearch")?.value||"").trim().toLowerCase(),t=e.querySelectorAll(".unlock-section");for(const s of t){let o=0;const l=s.querySelectorAll(".unlock-item");for(const m of l){const f=m.dataset.name||"",y=!n||f.includes(n);m.style.display=y?"":"none",y&&(o+=1)}const c=s.querySelector(".unlock-empty");c&&(c.style.display=o?"none":"",c.textContent=n?"No matching items.":"No unlocked items yet."),s.style.display=o||!n?"":"none"}}window.initSkillUnlocksPage=function(){const e=document.getElementById("unlockList");if(!e)return;const n=document.querySelector(".unlock-jump");n&&!n.dataset.bound&&(n.dataset.bound="true",n.addEventListener("click",s=>{const o=s.target.closest(".unlock-jump-link");if(!o)return;const l=o.getAttribute("href")?.slice(1);if(!l)return;const c=document.getElementById(l);c&&(s.preventDefault(),history.replaceState(null,"",`#${l}`),c.scrollIntoView({behavior:"smooth",block:"start"}))})),e.querySelectorAll(".unlock-section").forEach(s=>{const o=s.dataset.section||"";localStorage.getItem(`unlock-section:${o}`)==="collapsed"&&L(s,!0)});const t=document.getElementById("unlockSearch");t&&t.addEventListener("input",()=>O(e)),e.addEventListener("click",s=>{const o=s.target.closest(".unlock-toggle");if(!o)return;const l=o.closest(".unlock-section");if(!l)return;const c=!l.classList.contains("is-collapsed");L(l,c);const m=l.dataset.section||"";localStorage.setItem(`unlock-section:${m}`,c?"collapsed":"expanded")})};export{B as default};
