import{f as r,k as z,l as V,R as L,m as W,n as _,r as J}from"./index-B0_DWJKU.js";const Q=["Beginner","Easy","Medium","Hard","Elite","Master"];function h(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function X(e,t,a){if(e?.ignoreSkillLevels)return W(e,t);const l=e.player?.levels?.[t];return typeof l=="number"&&l>=a?!0:_(e,t,a)}function Y(e,t,a){const l=e.player?.quests?.[t]??0;return a==="completed"?l===2:a==="started"?l>0:!1}function R(e,t){if(!t?.id)return!1;const a=e.obtained||[],l=e.rolled||[];return a.includes(t.id)&&l.includes(t.id)}function A(e,t){return e?.name?e.name:e?.id&&t?.has(e.id)?t.get(e.id):typeof e=="number"&&t?.has(e)?t.get(e):e?.id?`Item ${e.id}`:"Unknown item"}function Z(e){return(e||[]).map(t=>typeof t=="number"?{id:t}:typeof t=="object"?t:{name:String(t)})}async function F(e,t,a){const l={skills:[],quests:[],items:[],itemGroups:[],rules:[],untracked:[]};let s=!0;for(const[n,i]of Object.entries(e?.skills||{}))X(t,n,i)||(l.skills.push(`${n} ${i}`),s=!1);for(const[n,i]of Object.entries(e?.quests||{}))if(!Y(t,n,i)){const u=i==="completed"?"completed":"started";l.quests.push(`${n} (${u})`),s=!1}for(const n of e?.items||[])R(t,n)||(l.items.push(A(n,a)),s=!1);for(const n of e?.itemsAny||[]){const i=Z(n);if(!i.some(d=>R(t,d))){const d=i.map(f=>A(f,a));l.itemGroups.push(`Any of: ${d.join(" / ")}`),s=!1}}const c=(e?.rulesAll||[]).filter(z),y=new Set(c);c.length&&(V(t,c,{trackMissing:!1})||(l.rules.push(c.join(" + ")),s=!1));for(const n of e?.rulesAll||[]){if(y.has(n))continue;const i=L[n];if(!i){l.rules.push(`${n} (missing)`),s=!1;continue}try{await i(t)||(l.rules.push(n),s=!1)}catch{l.rules.push(`${n} (error)`),s=!1}}const o=e?.rulesAny||[];if(o.length){let n=!1;const i=[];for(const u of o){const d=L[u];if(!d){i.push(`${u} (missing)`);continue}try{await d(t)?n=!0:i.push(u)}catch{i.push(`${u} (error)`)}}n||(l.rules.push(`Any of: ${i.join(" / ")}`),s=!1)}return e?.untracked?.length&&(l.untracked=[...e.untracked],s=!1),{met:s,missing:l}}function ee(e){const t=[];return e.skills.length&&t.push(`Missing levels: ${e.skills.join(", ")}.`),e.quests.length&&t.push(`Missing quests: ${e.quests.join(", ")}.`),e.items.length&&t.push(`Missing items: ${e.items.join(", ")}.`),e.itemGroups.length&&t.push(`Missing item options: ${e.itemGroups.join("; ")}.`),e.rules.length&&t.push(`Missing rules: ${e.rules.join(", ")}.`),e.untracked.length&&t.push(`Untracked requirements: ${e.untracked.join(", ")}.`),t.map(a=>`<div class="clue-missing">${h(a)}</div>`).join("")}function H(e={}){return{items:r.items,player:r.player,obtained:r.obtained||[],rolled:r.rolled||[],filters:r.filters,ignoreSkillLevels:!!e.ignoreSkillLevels,missing:{items:new Set}}}function te(e){return String(e||"").trim().toLowerCase()}function se(e,t){if(!e?.countWhenAvailableOnly)return!0;const a=e.requirements?.quests||{};for(const[l,s]of Object.entries(a)){const c=t?.quests?.[l]??0;if(s==="completed"&&c!==2||s==="started"&&c<=0)return!1}return!0}async function le(){try{const e=await fetch("/data/clue_steps.json");return e.ok?await e.json():null}catch{return null}}async function oe(){const e=!!r.player,t=await le();r.items===null&&await r.ensureItemsLoaded();const a=new Map((r.items||[]).map(o=>[o.id,o.name])),l=t?.tiers||{},s=[];for(const o of Q){const n=l?.[o]||[];if(!n.length)continue;let i=0,u=0;const d=[],f=new Map;for(const p of n){const S=!e||se(p,r.player);S&&(u+=1);const $=p.description||p.name||"Untitled step",b=p.type||"Unknown",E=p.specialInfo||"",q=!!E,U=q?`<span class="clue-step-info" tabindex="0" aria-label="Special clue information" title="${h(E)}">i</span>`:"";let w=!1,M=!1,C="clue-status-blocked",m="Incompletable",I="";const N=o==="Master"&&p.type==="Cryptic clues"&&r.filters?.juggleMasterCryptics,G=o==="Elite"&&$.startsWith("Show this to Sherlock.")&&r.filters?.juggleSherlockClues;if(e)if(G||N)C="clue-status-ready",m="Completable",w=!0,S&&(i+=1);else{const x=H(),{met:B,missing:O}=await F(p.requirements,x,a);if(B)C="clue-status-ready",m="Completable",w=!0,S&&(i+=1);else{const P=H({ignoreSkillLevels:!0}),{met:K}=await F(p.requirements,P,a);K&&(C="clue-status-trainable",m="Train levels",M=!0),I=ee(O)}}e||(m="Requires player data"),f.has(b)||(f.set(b,[]),d.push(b)),f.get(b).push(`
                <div class="clue-step ${C}${q?" clue-step-special":""}"
                    data-doable="${w?"true":"false"}"
                    data-trainable="${M?"true":"false"}"
                    data-description="${h($).toLowerCase()}">
                    <div class="clue-step-name">${h($)}</div>
                    <div class="clue-step-status">${h(m)}${U}</div>
                    ${I}
                </div>
            `)}const g=u,D=g?Math.round(i/g*100):0;s.push(`
            <section class="clue-tier" data-tier="${o}">
                <h3 class="clue-tier-header">
                    <button class="clue-toggle clue-tier-toggle" type="button" aria-expanded="true">Hide</button>
                    <span>${o}</span>
                    <span class="clue-tier-counts">
                        (${D}% completable, ${i}/${g})
                    </span>
                </h3>
                <div class="clue-tier-body">
                    <div class="clue-step-list">
                        ${d.map(p=>`
                            <section class="clue-type" data-type="${h(p)}">
                                <h4 class="clue-type-header">${h(p)}</h4>
                                ${f.get(p).join("")}
                            </section>
                        `).join("")}
                    </div>
                </div>
            </section>
        `)}const c=(r.filters?.clueSearch??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;");return`
        <h1>Clue steps</h1>
        ${e?"":'<p class="clue-warning">Upload your player data on the Upload page to evaluate requirements.</p>'}
        <div class="clue-filters">
            <label class="clue-filter">
                <span>Search clue steps</span>
                <input type="search" id="clueSearch" value="${c}" placeholder="Step description">
            </label>
            <label class="clue-filter">
                <input type="checkbox" id="hideCompletableClues" ${r.filters?.hideCompletableClues?"checked":""}>
                Hide completable steps
            </label>
            <label class="clue-filter">
                <input type="checkbox" id="hideIncompletableClues" ${r.filters?.hideIncompletableClues?"checked":""}>
                Hide incompletable steps
            </label>
            <label class="clue-filter">
                <input type="checkbox" id="hasDoneEasterEvent" ${r.filters?.hasDoneEasterEvent?"checked":""}>
                Has done Easter event (Eastfloor spade)
            </label>
            <label class="clue-filter">
                <input type="checkbox" id="juggleSherlockClues" ${r.filters?.juggleSherlockClues?"checked":""}>
                I want to juggle good Sherlock clues (Elite clues only)
            </label>
            <label class="clue-filter">
                <input type="checkbox" id="juggleMasterCryptics" ${r.filters?.juggleMasterCryptics?"checked":""}>
                I want to juggle good Cryptic clues (Master clues only)
            </label>
        </div>
        <div class="clue-list" id="clueList">
            ${s.length?s.join(""):"<p>No clue data loaded yet.</p>"}
        </div>
    `}function T(e){const t=r.filters?.hideCompletableClues,a=r.filters?.hideIncompletableClues,l=te(r.filters?.clueSearch),s=e.querySelectorAll(".clue-step");for(const o of s){const n=o.dataset.doable==="true",i=o.dataset.trainable==="true",u=o.dataset.description||"",d=!l||u.includes(l),g=t&&n||a&&(!n&&!i)||!d;o.style.display=g?"none":""}const c=e.querySelectorAll(".clue-type");for(const o of c){const n=Array.from(o.querySelectorAll(".clue-step")).some(i=>i.style.display!=="none");o.style.display=n?"":"none"}const y=e.querySelectorAll(".clue-tier");for(const o of y){const n=Array.from(o.querySelectorAll(".clue-step")).some(i=>i.style.display!=="none");o.style.display=n?"":"none"}}async function v(e,t={}){const a={...r.filters,...e};t.immediate?r.setFilters(a):await r.setFilters(a);const l=document.getElementById("clueList");l&&T(l)}async function j(e){const t={...r.filters,...e};await r.setFilters(t),await J()}function ne(e,t){e.textContent=t?"Show":"Hide",e.setAttribute("aria-expanded",t?"false":"true")}function ae(e,t){e.classList.toggle("is-collapsed",t);const a=e.querySelector(".clue-tier-toggle");a&&ne(a,t)}let k=null;function ce(){ie();const e=document.getElementById("clueList");e&&T(e);const t=async s=>{s.target.id==="hideCompletableClues"&&await v({hideCompletableClues:s.target.checked}),s.target.id==="hideIncompletableClues"&&await v({hideIncompletableClues:s.target.checked}),s.target.id==="hasDoneEasterEvent"&&await j({hasDoneEasterEvent:s.target.checked}),s.target.id==="juggleSherlockClues"&&await j({juggleSherlockClues:s.target.checked}),s.target.id==="juggleMasterCryptics"&&await j({juggleMasterCryptics:s.target.checked})},a=s=>{s.target.id==="clueSearch"&&v({clueSearch:s.target.value},{immediate:!0})},l=async s=>{if(!s.target.classList.contains("clue-tier-toggle"))return;const c=s.target.closest(".clue-tier");c&&ae(c,!c.classList.contains("is-collapsed"))};document.addEventListener("change",t),document.addEventListener("input",a),document.addEventListener("click",l),k=()=>{document.removeEventListener("change",t),document.removeEventListener("input",a),document.removeEventListener("click",l)}}function ie(){typeof k=="function"&&k(),k=null}export{oe as default,ce as init,ie as teardown};
