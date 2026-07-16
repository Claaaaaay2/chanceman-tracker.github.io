import{f as o,j as x,k as B,R as j,l as K,r as z}from"./index-DvWMewZo.js";const V=["Beginner","Easy","Medium","Hard","Elite","Master"];function h(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function _(e,t,a){if(e?.ignoreSkillLevels)return K(e,t);const l=e.player?.levels?.[t];return typeof l=="number"&&l>=a}function Q(e,t,a){const l=e.player?.quests?.[t]??0;return a==="completed"?l===2:a==="started"?l>0:!1}function R(e,t){if(!t?.id)return!1;const a=e.obtained||[],l=e.rolled||[];return a.includes(t.id)&&l.includes(t.id)}function A(e,t){return e?.name?e.name:e?.id&&t?.has(e.id)?t.get(e.id):typeof e=="number"&&t?.has(e)?t.get(e):e?.id?`Item ${e.id}`:"Unknown item"}function W(e){return(e||[]).map(t=>typeof t=="number"?{id:t}:typeof t=="object"?t:{name:String(t)})}async function M(e,t,a){const l={skills:[],quests:[],items:[],itemGroups:[],rules:[],untracked:[]};let s=!0;for(const[n,i]of Object.entries(e?.skills||{}))_(t,n,i)||(l.skills.push(`${n} ${i}`),s=!1);for(const[n,i]of Object.entries(e?.quests||{}))if(!Q(t,n,i)){const u=i==="completed"?"completed":"started";l.quests.push(`${n} (${u})`),s=!1}for(const n of e?.items||[])R(t,n)||(l.items.push(A(n,a)),s=!1);for(const n of e?.itemsAny||[]){const i=W(n);if(!i.some(p=>R(t,p))){const p=i.map(f=>A(f,a));l.itemGroups.push(`Any of: ${p.join(" / ")}`),s=!1}}const c=(e?.rulesAll||[]).filter(x),y=new Set(c);c.length&&(B(t,c,{trackMissing:!1})||(l.rules.push(c.join(" + ")),s=!1));for(const n of e?.rulesAll||[]){if(y.has(n))continue;const i=j[n];if(!i){l.rules.push(`${n} (missing)`),s=!1;continue}try{await i(t)||(l.rules.push(n),s=!1)}catch{l.rules.push(`${n} (error)`),s=!1}}const r=e?.rulesAny||[];if(r.length){let n=!1;const i=[];for(const u of r){const p=j[u];if(!p){i.push(`${u} (missing)`);continue}try{await p(t)?n=!0:i.push(u)}catch{i.push(`${u} (error)`)}}n||(l.rules.push(`Any of: ${i.join(" / ")}`),s=!1)}return e?.untracked?.length&&(l.untracked=[...e.untracked],s=!1),{met:s,missing:l}}function J(e){const t=[];return e.skills.length&&t.push(`Missing levels: ${e.skills.join(", ")}.`),e.quests.length&&t.push(`Missing quests: ${e.quests.join(", ")}.`),e.items.length&&t.push(`Missing items: ${e.items.join(", ")}.`),e.itemGroups.length&&t.push(`Missing item options: ${e.itemGroups.join("; ")}.`),e.rules.length&&t.push(`Missing rules: ${e.rules.join(", ")}.`),e.untracked.length&&t.push(`Untracked requirements: ${e.untracked.join(", ")}.`),t.map(a=>`<div class="clue-missing">${h(a)}</div>`).join("")}function F(e={}){return{items:o.items,player:o.player,obtained:o.obtained||[],rolled:o.rolled||[],filters:o.filters,ignoreSkillLevels:!!e.ignoreSkillLevels,missing:{items:new Set}}}function X(e){return String(e||"").trim().toLowerCase()}function Y(e,t){if(!e?.countWhenAvailableOnly)return!0;const a=e.requirements?.quests||{};for(const[l,s]of Object.entries(a)){const c=t?.quests?.[l]??0;if(s==="completed"&&c!==2||s==="started"&&c<=0)return!1}return!0}async function Z(){try{const e=await fetch("/data/clue_steps.json");return e.ok?await e.json():null}catch{return null}}async function ae(){const e=!!o.player,t=await Z();o.items===null&&await o.ensureItemsLoaded();const a=new Map((o.items||[]).map(r=>[r.id,r.name])),l=t?.tiers||{},s=[];for(const r of V){const n=l?.[r]||[];if(!n.length)continue;let i=0,u=0;const p=[],f=new Map;for(const d of n){const S=!e||Y(d,o.player);S&&(u+=1);const v=d.description||d.name||"Untitled step",b=d.type||"Unknown",w=d.specialInfo||"",E=!!w,D=E?`<span class="clue-step-info" tabindex="0" aria-label="Special clue information" title="${h(w)}">i</span>`:"";let q=!1,I=!1,$="clue-status-blocked",g="Incompletable",L="";if(e){const U=F(),{met:N,missing:G}=await M(d.requirements,U,a);if(N)$="clue-status-ready",g="Completable",q=!0,S&&(i+=1);else{const O=F({ignoreSkillLevels:!0}),{met:P}=await M(d.requirements,O,a);P&&($="clue-status-trainable",g="Train levels",I=!0),L=J(G)}}e||(g="Requires player data"),f.has(b)||(f.set(b,[]),p.push(b)),f.get(b).push(`
                <div class="clue-step ${$}${E?" clue-step-special":""}"
                    data-doable="${q?"true":"false"}"
                    data-trainable="${I?"true":"false"}"
                    data-description="${h(v).toLowerCase()}">
                    <div class="clue-step-name">${h(v)}</div>
                    <div class="clue-step-status">${h(g)}${D}</div>
                    ${L}
                </div>
            `)}const m=u,T=m?Math.round(i/m*100):0;s.push(`
            <section class="clue-tier" data-tier="${r}">
                <h3 class="clue-tier-header">
                    <button class="clue-toggle clue-tier-toggle" type="button" aria-expanded="true">Hide</button>
                    <span>${r}</span>
                    <span class="clue-tier-counts">
                        (${T}% completable, ${i}/${m})
                    </span>
                </h3>
                <div class="clue-tier-body">
                    <div class="clue-step-list">
                        ${p.map(d=>`
                            <section class="clue-type" data-type="${h(d)}">
                                <h4 class="clue-type-header">${h(d)}</h4>
                                ${f.get(d).join("")}
                            </section>
                        `).join("")}
                    </div>
                </div>
            </section>
        `)}const c=(o.filters?.clueSearch??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;");return`
        <h1>Clue steps</h1>
        ${e?"":'<p class="clue-warning">Upload your player data on the Upload page to evaluate requirements.</p>'}
        <div class="clue-filters">
            <label class="clue-filter">
                <span>Search clue steps</span>
                <input type="search" id="clueSearch" value="${c}" placeholder="Step description">
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
            ${s.length?s.join(""):"<p>No clue data loaded yet.</p>"}
        </div>
    `}function H(e){const t=o.filters?.hideCompletableClues,a=o.filters?.hideIncompletableClues,l=X(o.filters?.clueSearch),s=e.querySelectorAll(".clue-step");for(const r of s){const n=r.dataset.doable==="true",i=r.dataset.trainable==="true",u=r.dataset.description||"",p=!l||u.includes(l),m=t&&n||a&&(!n&&!i)||!p;r.style.display=m?"none":""}const c=e.querySelectorAll(".clue-type");for(const r of c){const n=Array.from(r.querySelectorAll(".clue-step")).some(i=>i.style.display!=="none");r.style.display=n?"":"none"}const y=e.querySelectorAll(".clue-tier");for(const r of y){const n=Array.from(r.querySelectorAll(".clue-step")).some(i=>i.style.display!=="none");r.style.display=n?"":"none"}}async function k(e,t={}){const a={...o.filters,...e};t.immediate?o.setFilters(a):await o.setFilters(a);const l=document.getElementById("clueList");l&&H(l)}async function ee(e){const t={...o.filters,...e};await o.setFilters(t),await z()}function te(e,t){e.textContent=t?"Show":"Hide",e.setAttribute("aria-expanded",t?"false":"true")}function se(e,t){e.classList.toggle("is-collapsed",t);const a=e.querySelector(".clue-tier-toggle");a&&te(a,t)}let C=null;function ie(){le();const e=document.getElementById("clueList");e&&H(e);const t=async s=>{s.target.id==="hideCompletableClues"&&await k({hideCompletableClues:s.target.checked}),s.target.id==="hideIncompletableClues"&&await k({hideIncompletableClues:s.target.checked}),s.target.id==="hasDoneEasterEvent"&&await ee({hasDoneEasterEvent:s.target.checked})},a=s=>{s.target.id==="clueSearch"&&k({clueSearch:s.target.value},{immediate:!0})},l=async s=>{if(!s.target.classList.contains("clue-tier-toggle"))return;const c=s.target.closest(".clue-tier");c&&se(c,!c.classList.contains("is-collapsed"))};document.addEventListener("change",t),document.addEventListener("input",a),document.addEventListener("click",l),C=()=>{document.removeEventListener("change",t),document.removeEventListener("input",a),document.removeEventListener("click",l)}}function le(){typeof C=="function"&&C(),C=null}export{ae as default,ie as init,le as teardown};
