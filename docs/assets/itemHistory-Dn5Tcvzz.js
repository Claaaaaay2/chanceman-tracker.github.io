import{f as L}from"./index--KK4mh_2.js";function f(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function T(e){return Array.isArray(e)?e.map(n=>String(n)):[]}function R(e){return String(e||"").trim().toLowerCase()}function k(e,n,a=""){return e==null||e===""?a:n.get(String(e))?.name??`Unknown item (${e})`}function C(e,n){return e.length?`<ol class="roll-name-list">${e.map((t,p)=>{const s=n.get(t),u=k(t,n),r=f(u),v=f(R(u)),g=s?.image?`/images/${s.image}`:"/images/placeholder.png",c=s?.image?`class="lazy-img roll-inline-image" data-src="${g}" src="/images/placeholder.png"`:'class="roll-inline-image" src="/images/placeholder.png"',m=s?`
                <a class="history-item-link history-item-link-list" onclick="navigate('/item?id=${t}')">
                    <img ${c} alt="${r}">
                    <span class="history-item-text">${r}</span>
                </a>
            `:`
                <img ${c} alt="${r}">
                <span class="history-item-text">${r}</span>
            `;return`
            <li class="roll-item-row" data-history-index="${p+1}" data-history-search="${v}" value="${p+1}">
                <span>
                    ${m}
                </span>
            </li>
        `}).join("")}</ol>`:'<p class="roll-empty">No items yet.</p>'}function B(e,n,a){const t=n.length;return`
        <section class="roll-section">
            <h2>${e} <span class="roll-count">(${t})</span></h2>
            ${C(n,a)}
        </section>
    `}function F(e,n,a){if(e==null||e==="")return`
            <div class="history-panel-item is-empty">
                <img class="history-panel-image" src="/images/placeholder.png" alt="${f(a)}">
                <span class="history-panel-name">${f(a)}</span>
            </div>
        `;const t=n.get(e),p=k(e,n,a),s=f(p),u=t?.image?`/images/${t.image}`:"/images/placeholder.png",r=t?.image?`class="lazy-img history-panel-image" data-src="${u}" src="/images/placeholder.png"`:'class="history-panel-image" src="/images/placeholder.png"';return`
        <div class="history-panel-item">
            ${t?`
            <a class="history-item-link history-item-link-panel" onclick="navigate('/item?id=${e}')">
                <img ${r} alt="${s}">
                <span class="history-item-text">${s}</span>
            </a>
        `:`
            <img ${r} alt="${s}">
            <span class="history-item-text">${s}</span>
        `}
        </div>
    `}function O(e,n,a){const t=Math.max(e.length,n.length);return t?`<div class="history-grid">${Array.from({length:t},(s,u)=>{const r=e[u],v=n[u],g=u+1,c=R(k(r,a)),m=R(k(v,a)),y=f(`${c} ${m}`.trim());return`
            <div class="history-panel card" data-history-index="${g}" data-history-search="${y}">
                <div class="history-panel-index">${g}</div>
                <div class="history-panel-column">
                    <div class="history-panel-label">Obtained</div>
                    ${F(r,a,"Not obtained")}
                </div>
                <div class="history-panel-column">
                    <div class="history-panel-label">Rolled</div>
                    ${F(v,a,"Not rolled")}
                </div>
            </div>
        `}).join("")}</div>`:'<p class="roll-empty">No items yet.</p>'}function U(e,n,a){return`
        ${B("Obtained",e,a)}
        ${B("Rolled",n,a)}
    `}async function D(){const e=L.obtained,n=L.rolled;if(!e||!n)return`
            <h1>Item history</h1>
            <p>Please upload your files on the Upload page first.</p>
        `;await L.ensureItemsLoaded();const a=new Map((L.items||[]).map(r=>[String(r.id),r])),t=T(e),p=T(n),s=Math.max(t.length,p.length);return`
        <div class="history-header">
            <h1>Item history</h1>
            <label class="history-view-toggle">
                <span class="history-view-option">Panels</span>
                <span class="toggle-switch">
                    <input type="checkbox" id="itemHistoryViewToggle" aria-label="Toggle item history view">
                    <span class="toggle-slider" aria-hidden="true"></span>
                </span>
                <span class="history-view-option">List</span>
            </label>
        </div>
        ${s?`
        <div class="history-filter card">
            <div class="history-filter-header">
                <strong>Filters</strong>
            </div>
            <label class="history-search-field" for="historySearch">
                <span>Search</span>
                <input type="search" id="historySearch" placeholder="Item name">
            </label>
            <div class="history-filter-row">
                <label class="history-filter-field">
                    <span>Start</span>
                    <input type="number" id="historyRangeStart" min="1" max="${s}" value="1">
                </label>
                <div class="history-filter-slider" id="historyRangeSlider" style="--range-start: 0%; --range-end: 100%;">
                    <div class="history-filter-track" aria-hidden="true"></div>
                    <div class="history-filter-range" aria-hidden="true"></div>
                    <input type="range" id="historyRangeStartSlider" min="1" max="${s}" step="1" value="1" aria-label="History range start">
                    <input type="range" id="historyRangeEndSlider" min="1" max="${s}" step="1" value="${s}" aria-label="History range end">
                </div>
                <label class="history-filter-field">
                    <span>End</span>
                    <input type="number" id="historyRangeEnd" min="1" max="${s}" value="${s}">
                </label>
            </div>
        </div>
        `:""}
        <div class="history-view history-view-panels is-active">
        <p class="roll-intro">Items are paired by position in your uploaded files. If one list is shorter, that side is left blank.</p>
            ${O(t,p,a)}
        </div>
        <div class="history-view history-view-list">
            ${U(t,p,a)}
        </div>
    `}let b=null;function G(){K();const e=document.getElementById("itemHistoryViewToggle"),n=document.querySelector(".history-view-panels"),a=document.querySelector(".history-view-list");if(!e||!n||!a)return;const t=[],p="itemHistoryView",u=localStorage.getItem(p)==="list"?"list":"panel";function r(l){const o=l==="list";e.checked=o,n.classList.toggle("is-active",!o),a.classList.toggle("is-active",o),localStorage.setItem(p,o?"list":"panel")}r(u);const v=()=>{r(e.checked?"list":"panel")};e.addEventListener("input",v),t.push(()=>e.removeEventListener("input",v));const g=document.getElementById("historyRangeStart"),c=document.getElementById("historyRangeEnd"),m=document.getElementById("historyRangeStartSlider"),y=document.getElementById("historyRangeEndSlider"),M=document.getElementById("historyRangeSlider"),$=document.getElementById("historySearch");if(!g||!c||!m||!y||!M){b=()=>{for(const l of t)l()};return}const w=Number.parseInt(c.max,10)||1;function x(l,o){const d=Number.parseInt(l,10);return Number.isFinite(d)?d:o}const H=Array.from(n.querySelectorAll("[data-history-index]")),V=Array.from(a.querySelectorAll(".roll-item-row[data-history-index]"));function j(l,o){const d=Math.max(1,w-1),i=Math.min(100,Math.max(0,(l-1)/d*100)),h=Math.min(100,Math.max(0,(o-1)/d*100));M.style.setProperty("--range-start",`${i}%`),M.style.setProperty("--range-end",`${h}%`)}function A(l){const o=R(l);H.forEach(d=>{const i=d.dataset.historySearch||"";d.classList.toggle("history-search-hidden",!!o&&!i.includes(o))}),V.forEach(d=>{const i=d.dataset.historySearch||"";d.classList.toggle("history-search-hidden",!!o&&!i.includes(o))})}function S(l,o,d){let i=x(l,1),h=x(o,w);i=Math.max(1,Math.min(i,w)),h=Math.max(1,Math.min(h,w)),i>h&&(d==="start"?i=h:h=i),g.value=i,c.value=h,m.value=i,y.value=h,j(i,h),m.style.zIndex=i===h?5:2,y.style.zIndex=4,H.forEach(I=>{const E=x(I.dataset.historyIndex,1);I.classList.toggle("history-range-hidden",E<i||E>h)}),V.forEach(I=>{const E=x(I.dataset.historyIndex,1);I.classList.toggle("history-range-hidden",E<i||E>h)})}S(g.value,c.value,"init"),A($?.value||"");const z=()=>{S(g.value,c.value,"start")};g.addEventListener("input",z),t.push(()=>g.removeEventListener("input",z));const P=()=>{S(g.value,c.value,"end")};c.addEventListener("input",P),t.push(()=>c.removeEventListener("input",P));const N=()=>{S(m.value,y.value,"start")};m.addEventListener("input",N),t.push(()=>m.removeEventListener("input",N));const q=()=>{S(m.value,y.value,"end")};if(y.addEventListener("input",q),t.push(()=>y.removeEventListener("input",q)),$){const l=()=>{A($.value)};$.addEventListener("input",l),t.push(()=>$.removeEventListener("input",l))}b=()=>{for(const l of t)l()}}function K(){typeof b=="function"&&b(),b=null}export{D as default,G as init,K as teardown};
