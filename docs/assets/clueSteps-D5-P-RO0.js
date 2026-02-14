import{f as i,R as j,g as x,r as O}from"./index-CoGxWBTG.js";const B=["Beginner","Easy","Medium","Hard","Elite","Master"];function f(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function z(e,t,n){if(e?.ignoreSkillLevels)return x(e,t);const l=e.player?.levels?.[t];return typeof l=="number"&&l>=n}function K(e,t,n){const l=e.player?.quests?.[t]??0;return n==="completed"?l===2:n==="started"?l>0:!1}function L(e,t){if(!t?.id)return!1;const n=e.obtained||[],l=e.rolled||[];return n.includes(t.id)&&l.includes(t.id)}function A(e,t){return e?.name?e.name:e?.id&&t?.has(e.id)?t.get(e.id):typeof e=="number"&&t?.has(e)?t.get(e):e?.id?`Item ${e.id}`:"Unknown item"}function V(e){return(e||[]).map(t=>typeof t=="number"?{id:t}:typeof t=="object"?t:{name:String(t)})}async function M(e,t,n){const l={skills:[],quests:[],items:[],itemGroups:[],rules:[],untracked:[]};let o=!0;for(const[a,s]of Object.entries(e?.skills||{}))z(t,a,s)||(l.skills.push(`${a} ${s}`),o=!1);for(const[a,s]of Object.entries(e?.quests||{}))if(!K(t,a,s)){const r=s==="completed"?"completed":"started";l.quests.push(`${a} (${r})`),o=!1}for(const a of e?.items||[])L(t,a)||(l.items.push(A(a,n)),o=!1);for(const a of e?.itemsAny||[]){const s=V(a);if(!s.some(c=>L(t,c))){const c=s.map(d=>A(d,n));l.itemGroups.push(`Any of: ${c.join(" / ")}`),o=!1}}for(const a of e?.rulesAll||[]){const s=j[a];if(!s){l.rules.push(`${a} (missing)`),o=!1;continue}try{await s(t)||(l.rules.push(a),o=!1)}catch{l.rules.push(`${a} (error)`),o=!1}}const p=e?.rulesAny||[];if(p.length){let a=!1;const s=[];for(const r of p){const c=j[r];if(!c){s.push(`${r} (missing)`);continue}try{await c(t)?a=!0:s.push(r)}catch{s.push(`${r} (error)`)}}a||(l.rules.push(`Any of: ${s.join(" / ")}`),o=!1)}return e?.untracked?.length&&(l.untracked=[...e.untracked],o=!1),{met:o,missing:l}}function _(e){const t=[];return e.skills.length&&t.push(`Missing levels: ${e.skills.join(", ")}.`),e.quests.length&&t.push(`Missing quests: ${e.quests.join(", ")}.`),e.items.length&&t.push(`Missing items: ${e.items.join(", ")}.`),e.itemGroups.length&&t.push(`Missing item options: ${e.itemGroups.join("; ")}.`),e.rules.length&&t.push(`Missing rules: ${e.rules.join(", ")}.`),e.untracked.length&&t.push(`Untracked requirements: ${e.untracked.join(", ")}.`),t.map(n=>`<div class="clue-missing">${f(n)}</div>`).join("")}function R(e={}){return{items:i.items,player:i.player,obtained:i.obtained||[],rolled:i.rolled||[],filters:i.filters,ignoreSkillLevels:!!e.ignoreSkillLevels,missing:{items:new Set}}}function Q(e){return String(e||"").trim().toLowerCase()}function W(e,t){if(!e?.countWhenAvailableOnly)return!0;const n=e.requirements?.quests||{};for(const[l,o]of Object.entries(n)){const p=t?.quests?.[l]??0;if(o==="completed"&&p!==2||o==="started"&&p<=0)return!1}return!0}async function J(){try{const e=await fetch("/data/clue_steps.json");return e.ok?await e.json():null}catch{return null}}async function te(){const e=!!i.player,t=await J();i.items===null&&await i.ensureItemsLoaded();const n=new Map((i.items||[]).map(s=>[s.id,s.name])),l=t?.tiers||{},o=[];for(const s of B){const r=l?.[s]||[];if(!r.length)continue;let c=0,d=0;const y=[],h=new Map;for(const u of r){const C=!e||W(u,i.player);C&&(d+=1);const v=u.description||u.name||"Untitled step",b=u.type||"Unknown",k=u.specialInfo||"",w=!!k,T=w?`<span class="clue-step-info" tabindex="0" aria-label="Special clue information" title="${f(k)}">i</span>`:"";let q=!1,E=!1,$="clue-status-blocked",g="Incompletable",I="";if(e){const D=R(),{met:U,missing:N}=await M(u.requirements,D,n);if(U)$="clue-status-ready",g="Completable",q=!0,C&&(c+=1);else{const G=R({ignoreSkillLevels:!0}),{met:P}=await M(u.requirements,G,n);P&&($="clue-status-trainable",g="Train levels",E=!0),I=_(N)}}e||(g="Requires player data"),h.has(b)||(h.set(b,[]),y.push(b)),h.get(b).push(`
                <div class="clue-step ${$}${w?" clue-step-special":""}"
                    data-doable="${q?"true":"false"}"
                    data-trainable="${E?"true":"false"}"
                    data-description="${f(v).toLowerCase()}">
                    <div class="clue-step-name">${f(v)}</div>
                    <div class="clue-step-status">${f(g)}${T}</div>
                    ${I}
                </div>
            `)}const m=d,H=m?Math.round(c/m*100):0;o.push(`
            <section class="clue-tier" data-tier="${s}">
                <h3 class="clue-tier-header">
                    <button class="clue-toggle clue-tier-toggle" type="button" aria-expanded="true">Hide</button>
                    <span>${s}</span>
                    <span class="clue-tier-counts">
                        (${H}% completable, ${c}/${m})
                    </span>
                </h3>
                <div class="clue-tier-body">
                    <div class="clue-step-list">
                        ${y.map(u=>`
                            <section class="clue-type" data-type="${f(u)}">
                                <h4 class="clue-type-header">${f(u)}</h4>
                                ${h.get(u).join("")}
                            </section>
                        `).join("")}
                    </div>
                </div>
            </section>
        `)}const p=(i.filters?.clueSearch??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;");return`
        <h1>Clue steps</h1>
        ${e?"":'<p class="clue-warning">Upload your player data on the Upload page to evaluate requirements.</p>'}
        <div class="clue-filters">
            <label class="clue-filter">
                <span>Search clue steps</span>
                <input type="search" id="clueSearch" value="${p}" placeholder="Step description">
            </label>
            <label class="clue-filter">
                <input type="checkbox" id="hideCompletableClues" ${i.filters?.hideCompletableClues?"checked":""}>
                Hide completable steps
            </label>
            <label class="clue-filter">
                <input type="checkbox" id="hideIncompletableClues" ${i.filters?.hideIncompletableClues?"checked":""}>
                Hide incompletable steps
            </label>
            <label class="clue-filter">
                <input type="checkbox" id="hasDoneEasterEvent" ${i.filters?.hasDoneEasterEvent?"checked":""}>
                Has done Easter event (Eastfloor spade)
            </label>
        </div>
        <div class="clue-list" id="clueList">
            ${o.length?o.join(""):"<p>No clue data loaded yet.</p>"}
        </div>
    `}function F(e){const t=i.filters?.hideCompletableClues,n=i.filters?.hideIncompletableClues,l=Q(i.filters?.clueSearch),o=e.querySelectorAll(".clue-step");for(const s of o){const r=s.dataset.doable==="true",c=s.dataset.trainable==="true",d=s.dataset.description||"",y=!l||d.includes(l),m=t&&r||n&&(!r&&!c)||!y;s.style.display=m?"none":""}const p=e.querySelectorAll(".clue-type");for(const s of p){const r=Array.from(s.querySelectorAll(".clue-step")).some(c=>c.style.display!=="none");s.style.display=r?"":"none"}const a=e.querySelectorAll(".clue-tier");for(const s of a){const r=Array.from(s.querySelectorAll(".clue-step")).some(c=>c.style.display!=="none");s.style.display=r?"":"none"}}async function S(e){const t={...i.filters,...e};await i.setFilters(t);const n=document.getElementById("clueList");n&&F(n)}async function X(e){const t={...i.filters,...e};await i.setFilters(t),await O()}document.addEventListener("change",async e=>{e.target.id==="hideCompletableClues"&&await S({hideCompletableClues:e.target.checked}),e.target.id==="hideIncompletableClues"&&await S({hideIncompletableClues:e.target.checked}),e.target.id==="hasDoneEasterEvent"&&await X({hasDoneEasterEvent:e.target.checked})});document.addEventListener("input",async e=>{e.target.id==="clueSearch"&&await S({clueSearch:e.target.value})});function Y(e,t){e.textContent=t?"Show":"Hide",e.setAttribute("aria-expanded",t?"false":"true")}function Z(e,t){e.classList.toggle("is-collapsed",t);const n=e.querySelector(".clue-tier-toggle");n&&Y(n,t)}document.addEventListener("click",async e=>{if(e.target.classList.contains("clue-tier-toggle")){const t=e.target.closest(".clue-tier");t&&Z(t,!t.classList.contains("is-collapsed"))}});window.initClueStepsPage=function(){const e=document.getElementById("clueList");e&&F(e)};export{te as default};
