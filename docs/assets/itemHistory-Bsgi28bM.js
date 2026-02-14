import{f as x}from"./index-CoGxWBTG.js";function S(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function b(e){return Array.isArray(e)?e.map(s=>String(s)):[]}function L(e,s){return e.length?`<ol class="roll-name-list">${e.map((t,r)=>{const a=s.get(t),n=S(a?.name??`Unknown item (${t})`),l=a?.image?`/images/${a.image}`:"/images/placeholder.png",d=a?.image?`class="lazy-img roll-inline-image" data-src="${l}" src="/images/placeholder.png"`:'class="roll-inline-image" src="/images/placeholder.png"',g=a?`
                <a class="history-item-link history-item-link-list" onclick="navigate('/item?id=${t}')">
                    <img ${d} alt="${n}">
                    <span class="history-item-text">${n}</span>
                </a>
            `:`
                <img ${d} alt="${n}">
                <span class="history-item-text">${n}</span>
            `;return`
            <li class="roll-item-row" data-history-index="${r+1}" value="${r+1}">
                <span>
                    ${g}
                </span>
            </li>
        `}).join("")}</ol>`:'<p class="roll-empty">No items yet.</p>'}function E(e,s,i){const t=s.length;return`
        <section class="roll-section">
            <h2>${e} <span class="roll-count">(${t})</span></h2>
            ${L(s,i)}
        </section>
    `}function R(e,s,i){if(e==null||e==="")return`
            <div class="history-panel-item is-empty">
                <img class="history-panel-image" src="/images/placeholder.png" alt="${S(i)}">
                <span class="history-panel-name">${S(i)}</span>
            </div>
        `;const t=s.get(e),r=S(t?.name??`Unknown item (${e})`),a=t?.image?`/images/${t.image}`:"/images/placeholder.png",n=t?.image?`class="lazy-img history-panel-image" data-src="${a}" src="/images/placeholder.png"`:'class="history-panel-image" src="/images/placeholder.png"';return`
        <div class="history-panel-item">
            ${t?`
            <a class="history-item-link history-item-link-panel" onclick="navigate('/item?id=${e}')">
                <img ${n} alt="${r}">
                <span class="history-item-text">${r}</span>
            </a>
        `:`
            <img ${n} alt="${r}">
            <span class="history-item-text">${r}</span>
        `}
        </div>
    `}function M(e,s,i){const t=Math.max(e.length,s.length);return t?`<div class="history-grid">${Array.from({length:t},(a,n)=>{const l=e[n],d=s[n],g=n+1;return`
            <div class="history-panel card" data-history-index="${g}">
                <div class="history-panel-index">${g}</div>
                <div class="history-panel-column">
                    <div class="history-panel-label">Obtained</div>
                    ${R(l,i,"Not obtained")}
                </div>
                <div class="history-panel-column">
                    <div class="history-panel-label">Rolled</div>
                    ${R(d,i,"Not rolled")}
                </div>
            </div>
        `}).join("")}</div>`:'<p class="roll-empty">No items yet.</p>'}function H(e,s,i){return`
        ${E("Obtained",e,i)}
        ${E("Rolled",s,i)}
    `}async function N(){const e=x.obtained,s=x.rolled;if(!e||!s)return`
            <h1>Item history</h1>
            <p>Please upload your files on the Upload page first.</p>
        `;await x.ensureItemsLoaded();const i=new Map((x.items||[]).map(l=>[String(l.id),l])),t=b(e),r=b(s),a=Math.max(t.length,r.length);return`
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
        ${a?`
        <div class="history-filter card">
            <div class="history-filter-header">
                <strong>Range filter</strong>
            </div>
            <div class="history-filter-row">
                <label class="history-filter-field">
                    <span>Start</span>
                    <input type="number" id="historyRangeStart" min="1" max="${a}" value="1">
                </label>
                <div class="history-filter-slider" id="historyRangeSlider" style="--range-start: 0%; --range-end: 100%;">
                    <div class="history-filter-track" aria-hidden="true"></div>
                    <div class="history-filter-range" aria-hidden="true"></div>
                    <input type="range" id="historyRangeStartSlider" min="1" max="${a}" step="1" value="1" aria-label="History range start">
                    <input type="range" id="historyRangeEndSlider" min="1" max="${a}" step="1" value="${a}" aria-label="History range end">
                </div>
                <label class="history-filter-field">
                    <span>End</span>
                    <input type="number" id="historyRangeEnd" min="1" max="${a}" value="${a}">
                </label>
            </div>
        </div>
        `:""}
        <div class="history-view history-view-panels is-active">
        <p class="roll-intro">Items are paired by position in your uploaded files. If one list is shorter, that side is left blank.</p>
            ${M(t,r,i)}
        </div>
        <div class="history-view history-view-list">
            ${H(t,r,i)}
        </div>
    `}window.initItemHistoryPage=function(){const e=document.getElementById("itemHistoryViewToggle"),s=document.querySelector(".history-view-panels"),i=document.querySelector(".history-view-list");if(!e||!s||!i)return;const t="itemHistoryView",a=localStorage.getItem(t)==="list"?"list":"panel";function n(p){const m=p==="list";e.checked=m,s.classList.toggle("is-active",!m),i.classList.toggle("is-active",m),localStorage.setItem(t,m?"list":"panel")}n(a),e.addEventListener("input",()=>{n(e.checked?"list":"panel")});const l=document.getElementById("historyRangeStart"),d=document.getElementById("historyRangeEnd"),g=document.getElementById("historyRangeStartSlider"),y=document.getElementById("historyRangeEndSlider"),I=document.getElementById("historyRangeSlider");if(!l||!d||!g||!y||!I)return;const f=Number.parseInt(d.max,10)||1;function w(p,m){const h=Number.parseInt(p,10);return Number.isFinite(h)?h:m}function k(p,m){const h=Math.max(1,f-1),o=Math.min(100,Math.max(0,(p-1)/h*100)),c=Math.min(100,Math.max(0,(m-1)/h*100));I.style.setProperty("--range-start",`${o}%`),I.style.setProperty("--range-end",`${c}%`)}function u(p,m,h){let o=w(p,1),c=w(m,f);o=Math.max(1,Math.min(o,f)),c=Math.max(1,Math.min(c,f)),o>c&&(h==="start"?o=c:c=o),l.value=o,d.value=c,g.value=o,y.value=c,k(o,c),g.style.zIndex=o===c?5:2,y.style.zIndex=4,s.querySelectorAll("[data-history-index]").forEach(v=>{const $=w(v.dataset.historyIndex,1);v.classList.toggle("history-range-hidden",$<o||$>c)}),i.querySelectorAll(".roll-item-row[data-history-index]").forEach(v=>{const $=w(v.dataset.historyIndex,1);v.classList.toggle("history-range-hidden",$<o||$>c)})}u(l.value,d.value,"init"),l.addEventListener("input",()=>{u(l.value,d.value,"start")}),d.addEventListener("input",()=>{u(l.value,d.value,"end")}),g.addEventListener("input",()=>{u(g.value,y.value,"start")}),y.addEventListener("input",()=>{u(g.value,y.value,"end")})};export{N as default};
