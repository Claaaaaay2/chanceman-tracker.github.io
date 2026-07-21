import{f as A}from"./index-DvHMxiVj.js";function E(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function O(e){return Array.isArray(e)?e.map(n=>String(n)):[]}function H(e){return String(e||"").trim().toLowerCase()}function M(e,n,s=""){return e==null||e===""?s:n.get(String(e))?.name??`Unknown item (${e})`}function J(e,n){return e.length?`<ol class="roll-name-list">${e.map((t,h)=>{const l=n.get(t),p=M(t,n),c=E(p),y=E(H(p)),v=l?.image?`/images/${l.image}`:"/images/placeholder.png",f=l?.image?`class="lazy-img roll-inline-image" data-src="${v}" src="/images/placeholder.png"`:'class="roll-inline-image" src="/images/placeholder.png"',u=l?`
                <a class="history-item-link history-item-link-list" onclick="navigate('/item?id=${t}')">
                    <img ${f} alt="${c}">
                    <span class="history-item-text">${c}</span>
                </a>
            `:`
                <img ${f} alt="${c}">
                <span class="history-item-text">${c}</span>
            `;return`
            <li class="roll-item-row" data-history-index="${h+1}" data-history-search="${y}" value="${h+1}">
                <span>
                    ${u}
                </span>
            </li>
        `}).join("")}</ol>`:'<p class="roll-empty">No items yet.</p>'}function U(e,n,s){const t=n.length;return`
        <section class="roll-section">
            <h2>${e} <span class="roll-count">(${t})</span></h2>
            ${J(n,s)}
        </section>
    `}function G(e,n,s){if(e==null||e==="")return`
            <div class="history-panel-item is-empty">
                <img class="history-panel-image" src="/images/placeholder.png" alt="${E(s)}">
                <span class="history-panel-name">${E(s)}</span>
            </div>
        `;const t=n.get(e),h=M(e,n,s),l=E(h),p=t?.image?`/images/${t.image}`:"/images/placeholder.png",c=t?.image?`class="lazy-img history-panel-image" data-src="${p}" src="/images/placeholder.png"`:'class="history-panel-image" src="/images/placeholder.png"';return`
        <div class="history-panel-item">
            ${t?`
            <a class="history-item-link history-item-link-panel" onclick="navigate('/item?id=${e}')">
                <img ${c} alt="${l}">
                <span class="history-item-text">${l}</span>
            </a>
        `:`
            <img ${c} alt="${l}">
            <span class="history-item-text">${l}</span>
        `}
        </div>
    `}function Q(e,n,s){const t=Math.max(e.length,n.length);return t?`<div class="history-grid">${Array.from({length:t},(l,p)=>{const c=e[p],y=n[p],v=p+1,f=H(M(c,s)),u=H(M(y,s)),g=E(`${f} ${u}`.trim());return`
            <div class="history-panel card" data-history-index="${v}" data-history-search="${g}">
                <div class="history-panel-index">${v}</div>
                <div class="history-panel-column">
                    <div class="history-panel-label">Obtained</div>
                    ${G(c,s,"Not obtained")}
                </div>
                <div class="history-panel-column">
                    <div class="history-panel-label">Rolled</div>
                    ${G(y,s,"Not rolled")}
                </div>
            </div>
        `}).join("")}</div>`:'<p class="roll-empty">No items yet.</p>'}function W(e,n,s){return`
        ${U("Obtained",e,s)}
        ${U("Rolled",n,s)}
    `}async function Z(){const e=A.obtained,n=A.rolled;if(!e||!n)return`
            <h1>Item history</h1>
            <p>Please upload your files on the Upload page first.</p>
        `;await A.ensureItemsLoaded();const s=new Map((A.items||[]).map(c=>[String(c.id),c])),t=O(e),h=O(n),l=Math.max(t.length,h.length);return`
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
        ${l?`
        <div class="history-filter card">
            <div class="history-filter-header">
                <strong>Filters</strong>
                <label class="history-filter-field" for="historyReverseSort">
                    <input type="checkbox" id="historyReverseSort">
                    <span>Reverse order</span>
                </label>
            </div>
            <label class="history-search-field" for="historySearch">
                <span>Search</span>
                <input type="search" id="historySearch" placeholder="Item name">
            </label>
            <div class="history-filter-row">
                <label class="history-filter-field">
                    <span>Start</span>
                    <input type="number" id="historyRangeStart" min="1" max="${l}" value="1">
                </label>
                <div class="history-filter-slider" id="historyRangeSlider" style="--range-start: 0%; --range-end: 100%;">
                    <div class="history-filter-track" aria-hidden="true"></div>
                    <div class="history-filter-range" aria-hidden="true"></div>
                    <input type="range" id="historyRangeStartSlider" min="1" max="${l}" step="1" value="1" aria-label="History range start">
                    <input type="range" id="historyRangeEndSlider" min="1" max="${l}" step="1" value="${l}" aria-label="History range end">
                </div>
                <label class="history-filter-field">
                    <span>End</span>
                    <input type="number" id="historyRangeEnd" min="1" max="${l}" value="${l}">
                </label>
            </div>
        </div>
        `:""}
        <div class="history-view history-view-panels is-active">
        <p class="roll-intro">Items are paired by position in your uploaded files. If one list is shorter, that side is left blank.</p>
            ${Q(t,h,s)}
        </div>
        <div class="history-view history-view-list">
            ${W(t,h,s)}
        </div>
    `}let R=null;function ee(){X();const e=document.getElementById("itemHistoryViewToggle"),n=document.querySelector(".history-view-panels"),s=document.querySelector(".history-view-list");if(!e||!n||!s)return;const t=[],h="itemHistoryView",p=localStorage.getItem(h)==="list"?"list":"panel",c="itemHistoryReverseSort",y=localStorage.getItem(c);function v(r){const a=r==="list";e.checked=a,n.classList.toggle("is-active",!a),s.classList.toggle("is-active",a),localStorage.setItem(h,a?"list":"panel")}v(p);const f=()=>{v(e.checked?"list":"panel")};e.addEventListener("input",f),t.push(()=>e.removeEventListener("input",f));const u=document.getElementById("historyRangeStart"),g=document.getElementById("historyRangeEnd"),S=document.getElementById("historyRangeStartSlider"),$=document.getElementById("historyRangeEndSlider"),V=document.getElementById("historyRangeSlider"),x=document.getElementById("historySearch"),m=document.getElementById("historyReverseSort");if(m&&(m.checked=y==="true"),!u||!g||!S||!$||!V){R=()=>{for(const r of t)r()};return}const k=Number.parseInt(g.max,10)||1;function I(r,a){const o=Number.parseInt(r,10);return Number.isFinite(o)?o:a}const P=Array.from(n.querySelectorAll("[data-history-index]")),z=Array.from(s.querySelectorAll(".roll-item-row[data-history-index]")),q=n.querySelector(".history-grid"),_=Array.from(s.querySelectorAll(".roll-name-list"));function D(r,a){const o=Math.max(1,k-1),i=Math.min(100,Math.max(0,(r-1)/o*100)),d=Math.min(100,Math.max(0,(a-1)/o*100));V.style.setProperty("--range-start",`${i}%`),V.style.setProperty("--range-end",`${d}%`)}function B(r){const a=H(r);P.forEach(o=>{const i=o.dataset.historySearch||"";o.classList.toggle("history-search-hidden",!!a&&!i.includes(a))}),z.forEach(o=>{const i=o.dataset.historySearch||"";o.classList.toggle("history-search-hidden",!!a&&!i.includes(a))})}function N(r){return r.slice().sort((a,o)=>{const i=I(a.dataset.historyIndex,1),d=I(o.dataset.historyIndex,1);return i-d})}function T(r){if(q){const a=N(Array.from(q.querySelectorAll(".history-panel[data-history-index]")));r&&a.reverse(),a.forEach(o=>q.appendChild(o))}_.forEach(a=>{const o=N(Array.from(a.querySelectorAll(".roll-item-row[data-history-index]")));r&&o.reverse(),o.forEach(i=>a.appendChild(i))})}function b(r,a,o){let i=I(r,1),d=I(a,k);i=Math.max(1,Math.min(i,k)),d=Math.max(1,Math.min(d,k)),i>d&&(o==="start"?i=d:d=i),u.value=i,g.value=d,S.value=i,$.value=d,D(i,d),S.style.zIndex=i===d?5:2,$.style.zIndex=4,P.forEach(w=>{const L=I(w.dataset.historyIndex,1);w.classList.toggle("history-range-hidden",L<i||L>d)}),z.forEach(w=>{const L=I(w.dataset.historyIndex,1);w.classList.toggle("history-range-hidden",L<i||L>d)})}b(u.value,g.value,"init"),B(x?.value||""),T(!!m?.checked);const C=()=>{b(u.value,g.value,"start")};u.addEventListener("input",C),t.push(()=>u.removeEventListener("input",C));const F=()=>{b(u.value,g.value,"end")};g.addEventListener("input",F),t.push(()=>g.removeEventListener("input",F));const j=()=>{b(S.value,$.value,"start")};S.addEventListener("input",j),t.push(()=>S.removeEventListener("input",j));const K=()=>{b(S.value,$.value,"end")};if($.addEventListener("input",K),t.push(()=>$.removeEventListener("input",K)),x){const r=()=>{B(x.value)};x.addEventListener("input",r),t.push(()=>x.removeEventListener("input",r))}if(m){const r=()=>{T(m.checked),localStorage.setItem(c,m.checked?"true":"false")};m.addEventListener("input",r),t.push(()=>m.removeEventListener("input",r))}R=()=>{for(const r of t)r()}}function X(){typeof R=="function"&&R(),R=null}export{Z as default,ee as init,X as teardown};
