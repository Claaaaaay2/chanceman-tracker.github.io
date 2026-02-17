import{f as E}from"./index-CIVIkReU.js";function b(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function P(e){return Array.isArray(e)?e.map(n=>String(n)):[]}function z(e,n){return e.length?`<ol class="roll-name-list">${e.map((t,a)=>{const i=n.get(t),r=b(i?.name??`Unknown item (${t})`),p=i?.image?`/images/${i.image}`:"/images/placeholder.png",u=i?.image?`class="lazy-img roll-inline-image" data-src="${p}" src="/images/placeholder.png"`:'class="roll-inline-image" src="/images/placeholder.png"',c=i?`
                <a class="history-item-link history-item-link-list" onclick="navigate('/item?id=${t}')">
                    <img ${u} alt="${r}">
                    <span class="history-item-text">${r}</span>
                </a>
            `:`
                <img ${u} alt="${r}">
                <span class="history-item-text">${r}</span>
            `;return`
            <li class="roll-item-row" data-history-index="${a+1}" value="${a+1}">
                <span>
                    ${c}
                </span>
            </li>
        `}).join("")}</ol>`:'<p class="roll-empty">No items yet.</p>'}function V(e,n,s){const t=n.length;return`
        <section class="roll-section">
            <h2>${e} <span class="roll-count">(${t})</span></h2>
            ${z(n,s)}
        </section>
    `}function A(e,n,s){if(e==null||e==="")return`
            <div class="history-panel-item is-empty">
                <img class="history-panel-image" src="/images/placeholder.png" alt="${b(s)}">
                <span class="history-panel-name">${b(s)}</span>
            </div>
        `;const t=n.get(e),a=b(t?.name??`Unknown item (${e})`),i=t?.image?`/images/${t.image}`:"/images/placeholder.png",r=t?.image?`class="lazy-img history-panel-image" data-src="${i}" src="/images/placeholder.png"`:'class="history-panel-image" src="/images/placeholder.png"';return`
        <div class="history-panel-item">
            ${t?`
            <a class="history-item-link history-item-link-panel" onclick="navigate('/item?id=${e}')">
                <img ${r} alt="${a}">
                <span class="history-item-text">${a}</span>
            </a>
        `:`
            <img ${r} alt="${a}">
            <span class="history-item-text">${a}</span>
        `}
        </div>
    `}function q(e,n,s){const t=Math.max(e.length,n.length);return t?`<div class="history-grid">${Array.from({length:t},(i,r)=>{const p=e[r],u=n[r],c=r+1;return`
            <div class="history-panel card" data-history-index="${c}">
                <div class="history-panel-index">${c}</div>
                <div class="history-panel-column">
                    <div class="history-panel-label">Obtained</div>
                    ${A(p,s,"Not obtained")}
                </div>
                <div class="history-panel-column">
                    <div class="history-panel-label">Rolled</div>
                    ${A(u,s,"Not rolled")}
                </div>
            </div>
        `}).join("")}</div>`:'<p class="roll-empty">No items yet.</p>'}function B(e,n,s){return`
        ${V("Obtained",e,s)}
        ${V("Rolled",n,s)}
    `}async function O(){const e=E.obtained,n=E.rolled;if(!e||!n)return`
            <h1>Item history</h1>
            <p>Please upload your files on the Upload page first.</p>
        `;await E.ensureItemsLoaded();const s=new Map((E.items||[]).map(p=>[String(p.id),p])),t=P(e),a=P(n),i=Math.max(t.length,a.length);return`
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
        ${i?`
        <div class="history-filter card">
            <div class="history-filter-header">
                <strong>Range filter</strong>
            </div>
            <div class="history-filter-row">
                <label class="history-filter-field">
                    <span>Start</span>
                    <input type="number" id="historyRangeStart" min="1" max="${i}" value="1">
                </label>
                <div class="history-filter-slider" id="historyRangeSlider" style="--range-start: 0%; --range-end: 100%;">
                    <div class="history-filter-track" aria-hidden="true"></div>
                    <div class="history-filter-range" aria-hidden="true"></div>
                    <input type="range" id="historyRangeStartSlider" min="1" max="${i}" step="1" value="1" aria-label="History range start">
                    <input type="range" id="historyRangeEndSlider" min="1" max="${i}" step="1" value="${i}" aria-label="History range end">
                </div>
                <label class="history-filter-field">
                    <span>End</span>
                    <input type="number" id="historyRangeEnd" min="1" max="${i}" value="${i}">
                </label>
            </div>
        </div>
        `:""}
        <div class="history-view history-view-panels is-active">
        <p class="roll-intro">Items are paired by position in your uploaded files. If one list is shorter, that side is left blank.</p>
            ${q(t,a,s)}
        </div>
        <div class="history-view history-view-list">
            ${B(t,a,s)}
        </div>
    `}let I=null;function C(){T();const e=document.getElementById("itemHistoryViewToggle"),n=document.querySelector(".history-view-panels"),s=document.querySelector(".history-view-list");if(!e||!n||!s)return;const t=[],a="itemHistoryView",r=localStorage.getItem(a)==="list"?"list":"panel";function p(d){const g=d==="list";e.checked=g,n.classList.toggle("is-active",!g),s.classList.toggle("is-active",g),localStorage.setItem(a,g?"list":"panel")}p(r);const u=()=>{p(e.checked?"list":"panel")};e.addEventListener("input",u),t.push(()=>e.removeEventListener("input",u));const c=document.getElementById("historyRangeStart"),m=document.getElementById("historyRangeEnd"),h=document.getElementById("historyRangeStartSlider"),y=document.getElementById("historyRangeEndSlider"),L=document.getElementById("historyRangeSlider");if(!c||!m||!h||!y||!L){I=()=>{for(const d of t)d()};return}const w=Number.parseInt(m.max,10)||1;function x(d,g){const v=Number.parseInt(d,10);return Number.isFinite(v)?v:g}function N(d,g){const v=Math.max(1,w-1),l=Math.min(100,Math.max(0,(d-1)/v*100)),o=Math.min(100,Math.max(0,(g-1)/v*100));L.style.setProperty("--range-start",`${l}%`),L.style.setProperty("--range-end",`${o}%`)}function f(d,g,v){let l=x(d,1),o=x(g,w);l=Math.max(1,Math.min(l,w)),o=Math.max(1,Math.min(o,w)),l>o&&(v==="start"?l=o:o=l),c.value=l,m.value=o,h.value=l,y.value=o,N(l,o),h.style.zIndex=l===o?5:2,y.style.zIndex=4,n.querySelectorAll("[data-history-index]").forEach($=>{const S=x($.dataset.historyIndex,1);$.classList.toggle("history-range-hidden",S<l||S>o)}),s.querySelectorAll(".roll-item-row[data-history-index]").forEach($=>{const S=x($.dataset.historyIndex,1);$.classList.toggle("history-range-hidden",S<l||S>o)})}f(c.value,m.value,"init");const R=()=>{f(c.value,m.value,"start")};c.addEventListener("input",R),t.push(()=>c.removeEventListener("input",R));const k=()=>{f(c.value,m.value,"end")};m.addEventListener("input",k),t.push(()=>m.removeEventListener("input",k));const M=()=>{f(h.value,y.value,"start")};h.addEventListener("input",M),t.push(()=>h.removeEventListener("input",M));const H=()=>{f(h.value,y.value,"end")};y.addEventListener("input",H),t.push(()=>y.removeEventListener("input",H)),I=()=>{for(const d of t)d()}}function T(){typeof I=="function"&&I(),I=null}export{O as default,C as init,T as teardown};
