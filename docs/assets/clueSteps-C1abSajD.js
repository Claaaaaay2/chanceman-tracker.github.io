import{f as o,R as j,h as P,r as B}from"./index-IntKELAu.js";const z=["Beginner","Easy","Medium","Hard","Elite","Master"];function f(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function K(e,t,a){if(e?.ignoreSkillLevels)return P(e,t);const n=e.player?.levels?.[t];return typeof n=="number"&&n>=a}function V(e,t,a){const n=e.player?.quests?.[t]??0;return a==="completed"?n===2:a==="started"?n>0:!1}function A(e,t){if(!t?.id)return!1;const a=e.obtained||[],n=e.rolled||[];return a.includes(t.id)&&n.includes(t.id)}function M(e,t){return e?.name?e.name:e?.id&&t?.has(e.id)?t.get(e.id):typeof e=="number"&&t?.has(e)?t.get(e):e?.id?`Item ${e.id}`:"Unknown item"}function _(e){return(e||[]).map(t=>typeof t=="number"?{id:t}:typeof t=="object"?t:{name:String(t)})}async function R(e,t,a){const n={skills:[],quests:[],items:[],itemGroups:[],rules:[],untracked:[]};let l=!0;for(const[i,s]of Object.entries(e?.skills||{}))K(t,i,s)||(n.skills.push(`${i} ${s}`),l=!1);for(const[i,s]of Object.entries(e?.quests||{}))if(!V(t,i,s)){const r=s==="completed"?"completed":"started";n.quests.push(`${i} (${r})`),l=!1}for(const i of e?.items||[])A(t,i)||(n.items.push(M(i,a)),l=!1);for(const i of e?.itemsAny||[]){const s=_(i);if(!s.some(c=>A(t,c))){const c=s.map(d=>M(d,a));n.itemGroups.push(`Any of: ${c.join(" / ")}`),l=!1}}for(const i of e?.rulesAll||[]){const s=j[i];if(!s){n.rules.push(`${i} (missing)`),l=!1;continue}try{await s(t)||(n.rules.push(i),l=!1)}catch{n.rules.push(`${i} (error)`),l=!1}}const u=e?.rulesAny||[];if(u.length){let i=!1;const s=[];for(const r of u){const c=j[r];if(!c){s.push(`${r} (missing)`);continue}try{await c(t)?i=!0:s.push(r)}catch{s.push(`${r} (error)`)}}i||(n.rules.push(`Any of: ${s.join(" / ")}`),l=!1)}return e?.untracked?.length&&(n.untracked=[...e.untracked],l=!1),{met:l,missing:n}}function Q(e){const t=[];return e.skills.length&&t.push(`Missing levels: ${e.skills.join(", ")}.`),e.quests.length&&t.push(`Missing quests: ${e.quests.join(", ")}.`),e.items.length&&t.push(`Missing items: ${e.items.join(", ")}.`),e.itemGroups.length&&t.push(`Missing item options: ${e.itemGroups.join("; ")}.`),e.rules.length&&t.push(`Missing rules: ${e.rules.join(", ")}.`),e.untracked.length&&t.push(`Untracked requirements: ${e.untracked.join(", ")}.`),t.map(a=>`<div class="clue-missing">${f(a)}</div>`).join("")}function H(e={}){return{items:o.items,player:o.player,obtained:o.obtained||[],rolled:o.rolled||[],filters:o.filters,ignoreSkillLevels:!!e.ignoreSkillLevels,missing:{items:new Set}}}function W(e){return String(e||"").trim().toLowerCase()}function J(e,t){if(!e?.countWhenAvailableOnly)return!0;const a=e.requirements?.quests||{};for(const[n,l]of Object.entries(a)){const u=t?.quests?.[n]??0;if(l==="completed"&&u!==2||l==="started"&&u<=0)return!1}return!0}async function X(){try{const e=await fetch("/data/clue_steps.json");return e.ok?await e.json():null}catch{return null}}async function le(){const e=!!o.player,t=await X();o.items===null&&await o.ensureItemsLoaded();const a=new Map((o.items||[]).map(s=>[s.id,s.name])),n=t?.tiers||{},l=[];for(const s of z){const r=n?.[s]||[];if(!r.length)continue;let c=0,d=0;const y=[],h=new Map;for(const p of r){const v=!e||J(p,o.player);v&&(d+=1);const k=p.description||p.name||"Untitled step",b=p.type||"Unknown",w=p.specialInfo||"",q=!!w,D=q?`<span class="clue-step-info" tabindex="0" aria-label="Special clue information" title="${f(w)}">i</span>`:"";let E=!1,I=!1,$="clue-status-blocked",g="Incompletable",L="";if(e){const U=H(),{met:N,missing:G}=await R(p.requirements,U,a);if(N)$="clue-status-ready",g="Completable",E=!0,v&&(c+=1);else{const x=H({ignoreSkillLevels:!0}),{met:O}=await R(p.requirements,x,a);O&&($="clue-status-trainable",g="Train levels",I=!0),L=Q(G)}}e||(g="Requires player data"),h.has(b)||(h.set(b,[]),y.push(b)),h.get(b).push(`
                <div class="clue-step ${$}${q?" clue-step-special":""}"
                    data-doable="${E?"true":"false"}"
                    data-trainable="${I?"true":"false"}"
                    data-description="${f(k).toLowerCase()}">
                    <div class="clue-step-name">${f(k)}</div>
                    <div class="clue-step-status">${f(g)}${D}</div>
                    ${L}
                </div>
            `)}const m=d,T=m?Math.round(c/m*100):0;l.push(`
            <section class="clue-tier" data-tier="${s}">
                <h3 class="clue-tier-header">
                    <button class="clue-toggle clue-tier-toggle" type="button" aria-expanded="true">Hide</button>
                    <span>${s}</span>
                    <span class="clue-tier-counts">
                        (${T}% completable, ${c}/${m})
                    </span>
                </h3>
                <div class="clue-tier-body">
                    <div class="clue-step-list">
                        ${y.map(p=>`
                            <section class="clue-type" data-type="${f(p)}">
                                <h4 class="clue-type-header">${f(p)}</h4>
                                ${h.get(p).join("")}
                            </section>
                        `).join("")}
                    </div>
                </div>
            </section>
        `)}const u=(o.filters?.clueSearch??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;");return`
        <h1>Clue steps</h1>
        ${e?"":'<p class="clue-warning">Upload your player data on the Upload page to evaluate requirements.</p>'}
        <div class="clue-filters">
            <label class="clue-filter">
                <span>Search clue steps</span>
                <input type="search" id="clueSearch" value="${u}" placeholder="Step description">
            </label>
            <label class="clue-filter">
                <input type="checkbox" id="hideCompletableClues" ${o.filters?.hideCompletableClues?"checked":""}>
                Hide completable steps
            </label>
            <label class="clue-filter">
                <input type="checkbox" id="hideIncompletableClues" ${o.filters?.hideIncompletableClues?"checked":""}>
                Hide incompletable steps
            </label>
            <label class="clue-filter">
                <input type="checkbox" id="hasDoneEasterEvent" ${o.filters?.hasDoneEasterEvent?"checked":""}>
                Has done Easter event (Eastfloor spade)
            </label>
        </div>
        <div class="clue-list" id="clueList">
            ${l.length?l.join(""):"<p>No clue data loaded yet.</p>"}
        </div>
    `}function F(e){const t=o.filters?.hideCompletableClues,a=o.filters?.hideIncompletableClues,n=W(o.filters?.clueSearch),l=e.querySelectorAll(".clue-step");for(const s of l){const r=s.dataset.doable==="true",c=s.dataset.trainable==="true",d=s.dataset.description||"",y=!n||d.includes(n),m=t&&r||a&&(!r&&!c)||!y;s.style.display=m?"none":""}const u=e.querySelectorAll(".clue-type");for(const s of u){const r=Array.from(s.querySelectorAll(".clue-step")).some(c=>c.style.display!=="none");s.style.display=r?"":"none"}const i=e.querySelectorAll(".clue-tier");for(const s of i){const r=Array.from(s.querySelectorAll(".clue-step")).some(c=>c.style.display!=="none");s.style.display=r?"":"none"}}async function S(e){const t={...o.filters,...e};await o.setFilters(t);const a=document.getElementById("clueList");a&&F(a)}async function Y(e){const t={...o.filters,...e};await o.setFilters(t),await B()}function Z(e,t){e.textContent=t?"Show":"Hide",e.setAttribute("aria-expanded",t?"false":"true")}function ee(e,t){e.classList.toggle("is-collapsed",t);const a=e.querySelector(".clue-tier-toggle");a&&Z(a,t)}let C=null;function ne(){te();const e=document.getElementById("clueList");e&&F(e);const t=async l=>{l.target.id==="hideCompletableClues"&&await S({hideCompletableClues:l.target.checked}),l.target.id==="hideIncompletableClues"&&await S({hideIncompletableClues:l.target.checked}),l.target.id==="hasDoneEasterEvent"&&await Y({hasDoneEasterEvent:l.target.checked})},a=async l=>{l.target.id==="clueSearch"&&await S({clueSearch:l.target.value})},n=async l=>{if(!l.target.classList.contains("clue-tier-toggle"))return;const u=l.target.closest(".clue-tier");u&&ee(u,!u.classList.contains("is-collapsed"))};document.addEventListener("change",t),document.addEventListener("input",a),document.addEventListener("click",n),C=()=>{document.removeEventListener("change",t),document.removeEventListener("input",a),document.removeEventListener("click",n)}}function te(){typeof C=="function"&&C(),C=null}export{le as default,ne as init,te as teardown};
