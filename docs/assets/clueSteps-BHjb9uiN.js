import{f as i,k as z,l as V,R as H,m as _,n as Q,r as X}from"./index-CXw6pCER.js";const Y=["Beginner","Easy","Medium","Hard","Elite","Master"];function h(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Z(e,t,a){if(e?.ignoreSkillLevels)return _(e,t);const l=e.player?.levels?.[t];return typeof l=="number"&&l>=a?!0:Q(e,t,a)}function ee(e,t,a){const l=e.player?.quests?.[t]??0;return a==="completed"?l===2:a==="started"?l>0:!1}function A(e,t){if(!t?.id)return!1;const a=e.obtained||[],l=e.rolled||[];return a.includes(t.id)&&l.includes(t.id)}function F(e,t){return e?.name?e.name:e?.id&&t?.has(e.id)?t.get(e.id):typeof e=="number"&&t?.has(e)?t.get(e):e?.id?`Item ${e.id}`:"Unknown item"}function te(e){return(e||[]).map(t=>typeof t=="number"?{id:t}:typeof t=="object"?t:{name:String(t)})}async function T(e,t,a){const l={skills:[],quests:[],items:[],itemGroups:[],rules:[],untracked:[]};let s=!0;for(const[n,r]of Object.entries(e?.skills||{}))Z(t,n,r)||(l.skills.push(`${n} ${r}`),s=!1);for(const[n,r]of Object.entries(e?.quests||{}))if(!ee(t,n,r)){const u=r==="completed"?"completed":"started";l.quests.push(`${n} (${u})`),s=!1}for(const n of e?.items||[])A(t,n)||(l.items.push(F(n,a)),s=!1);for(const n of e?.itemsAny||[]){const r=te(n);if(!r.some(p=>A(t,p))){const p=r.map(f=>F(f,a));l.itemGroups.push(`Any of: ${p.join(" / ")}`),s=!1}}const c=(e?.rulesAll||[]).filter(z),b=new Set(c);c.length&&(V(t,c,{trackMissing:!1})||(l.rules.push(c.join(" + ")),s=!1));for(const n of e?.rulesAll||[]){if(b.has(n))continue;const r=H[n];if(!r){l.rules.push(`${n} (missing)`),s=!1;continue}try{await r(t)||(l.rules.push(n),s=!1)}catch{l.rules.push(`${n} (error)`),s=!1}}const o=e?.rulesAny||[];if(o.length){let n=!1;const r=[];for(const u of o){const p=H[u];if(!p){r.push(`${u} (missing)`);continue}try{await p(t)?n=!0:r.push(u)}catch{r.push(`${u} (error)`)}}n||(l.rules.push(`Any of: ${r.join(" / ")}`),s=!1)}return e?.untracked?.length&&(l.untracked=[...e.untracked],s=!1),{met:s,missing:l}}function se(e){const t=[];return e.skills.length&&t.push(`Missing levels: ${e.skills.join(", ")}.`),e.quests.length&&t.push(`Missing quests: ${e.quests.join(", ")}.`),e.items.length&&t.push(`Missing items: ${e.items.join(", ")}.`),e.itemGroups.length&&t.push(`Missing item options: ${e.itemGroups.join("; ")}.`),e.rules.length&&t.push(`Missing rules: ${e.rules.join(", ")}.`),e.untracked.length&&t.push(`Untracked requirements: ${e.untracked.join(", ")}.`),t.map(a=>`<div class="clue-missing">${h(a)}</div>`).join("")}function J(e={}){return{items:i.items,player:i.player,obtained:i.obtained||[],rolled:i.rolled||[],filters:i.filters,ignoreSkillLevels:!!e.ignoreSkillLevels,missing:{items:new Set}}}function le(e){return String(e||"").trim().toLowerCase()}function ne(e,t){if(!e?.countWhenAvailableOnly)return!0;const a=e.requirements?.quests||{};for(const[l,s]of Object.entries(a)){const c=t?.quests?.[l]??0;if(s==="completed"&&c!==2||s==="started"&&c<=0)return!1}return!0}async function ae(){try{const e=await fetch("/data/clue_steps.json");return e.ok?await e.json():null}catch{return null}}async function ue(){const e=!!i.player,t=await ae();i.items===null&&await i.ensureItemsLoaded();const a=new Map((i.items||[]).map(o=>[o.id,o.name])),l=t?.tiers||{},s=[];for(const o of Y){const n=l?.[o]||[];if(!n.length)continue;let r=0,u=0;const p=[],f=new Map;for(const d of n){const j=!e||ne(d,i.player);j&&(u+=1);const k=d.description||d.name||"Untitled step",C=d.type||"Unknown",q=d.specialInfo||"",I=!!q,N=I?`<span class="clue-step-info" tabindex="0" aria-label="Special clue information" title="${h(q)}">i</span>`:"";let v=!1,L=!1,S="clue-status-blocked",y="Incompletable",R="";const O=k.startsWith("Buried beneath the ground, who knows where it's found.")&&i.filters?.ignoreMakingHistoryJorral,x=o==="Master"&&d.type==="Cryptic clues"&&i.filters?.juggleMasterCryptics,B=o==="Elite"&&k.startsWith("Show this to Sherlock.")&&i.filters?.juggleSherlockClues;if(e)if(B||x)S="clue-status-ready",y="Completable",v=!0,j&&(r+=1);else{const G=J();let g=d.requirements;O&&g.quests?.["Making History"]&&(g={...g,quests:Object.fromEntries(Object.entries(g.quests).filter(([E])=>E!=="Making History"))});const{met:P,missing:K}=await T(g,G,a);if(P)S="clue-status-ready",y="Completable",v=!0,j&&(r+=1);else{const E=J({ignoreSkillLevels:!0}),{met:W}=await T(g,E,a);W&&(S="clue-status-trainable",y="Train levels",L=!0),R=se(K)}}e||(y="Requires player data"),f.has(C)||(f.set(C,[]),p.push(C)),f.get(C).push(`
                <div class="clue-step ${S}${I?" clue-step-special":""}"
                    data-doable="${v?"true":"false"}"
                    data-trainable="${L?"true":"false"}"
                    data-description="${h(k).toLowerCase()}">
                    <div class="clue-step-name">${h(k)}</div>
                    <div class="clue-step-status">${h(y)}${N}</div>
                    ${R}
                </div>
            `)}const m=u,U=m?Math.round(r/m*100):0;s.push(`
            <section class="clue-tier" data-tier="${o}">
                <h3 class="clue-tier-header">
                    <button class="clue-toggle clue-tier-toggle" type="button" aria-expanded="true">Hide</button>
                    <span>${o}</span>
                    <span class="clue-tier-counts">
                        (${U}% completable, ${r}/${m})
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
        `)}const c=(i.filters?.clueSearch??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;");return`
        <h1>Clue steps</h1>
        ${e?"":'<p class="clue-warning">Upload your player data on the Upload page to evaluate requirements.</p>'}
        <div class="clue-filters">
            <label class="clue-filter">
                <span>Search clue steps</span>
                <input type="search" id="clueSearch" value="${c}" placeholder="Step description">
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
            <label class="clue-filter">
                <input type="checkbox" id="juggleSherlockClues" ${i.filters?.juggleSherlockClues?"checked":""}>
                I want to juggle good Sherlock clues (Elite clues only)
            </label>
            <label class="clue-filter">
                <input type="checkbox" id="juggleMasterCryptics" ${i.filters?.juggleMasterCryptics?"checked":""}>
                I want to juggle good Cryptic clues (Master clues only)
            </label>
            <label class="clue-filter">
                <input type="checkbox" id="ignoreMakingHistoryJorral" ${i.filters?.ignoreMakingHistoryJorral?"checked":""}>
                I want to dig in all available Jorral spots manually
            </label>
        </div>
        <div class="clue-list" id="clueList">
            ${s.length?s.join(""):"<p>No clue data loaded yet.</p>"}
        </div>
    `}function D(e){const t=i.filters?.hideCompletableClues,a=i.filters?.hideIncompletableClues,l=le(i.filters?.clueSearch),s=e.querySelectorAll(".clue-step");for(const o of s){const n=o.dataset.doable==="true",r=o.dataset.trainable==="true",u=o.dataset.description||"",p=!l||u.includes(l),m=t&&n||a&&(!n&&!r)||!p;o.style.display=m?"none":""}const c=e.querySelectorAll(".clue-type");for(const o of c){const n=Array.from(o.querySelectorAll(".clue-step")).some(r=>r.style.display!=="none");o.style.display=n?"":"none"}const b=e.querySelectorAll(".clue-tier");for(const o of b){const n=Array.from(o.querySelectorAll(".clue-step")).some(r=>r.style.display!=="none");o.style.display=n?"":"none"}}async function M(e,t={}){const a={...i.filters,...e};t.immediate?i.setFilters(a):await i.setFilters(a);const l=document.getElementById("clueList");l&&D(l)}async function $(e){const t={...i.filters,...e};await i.setFilters(t),await X()}function ie(e,t){e.textContent=t?"Show":"Hide",e.setAttribute("aria-expanded",t?"false":"true")}function re(e,t){e.classList.toggle("is-collapsed",t);const a=e.querySelector(".clue-tier-toggle");a&&ie(a,t)}let w=null;function pe(){oe();const e=document.getElementById("clueList");e&&D(e);const t=async s=>{s.target.id==="hideCompletableClues"&&await M({hideCompletableClues:s.target.checked}),s.target.id==="hideIncompletableClues"&&await M({hideIncompletableClues:s.target.checked}),s.target.id==="hasDoneEasterEvent"&&await $({hasDoneEasterEvent:s.target.checked}),s.target.id==="juggleSherlockClues"&&await $({juggleSherlockClues:s.target.checked}),s.target.id==="juggleMasterCryptics"&&await $({juggleMasterCryptics:s.target.checked}),s.target.id==="ignoreMakingHistoryJorral"&&await $({ignoreMakingHistoryJorral:s.target.checked})},a=s=>{s.target.id==="clueSearch"&&M({clueSearch:s.target.value},{immediate:!0})},l=async s=>{if(!s.target.classList.contains("clue-tier-toggle"))return;const c=s.target.closest(".clue-tier");c&&re(c,!c.classList.contains("is-collapsed"))};document.addEventListener("change",t),document.addEventListener("input",a),document.addEventListener("click",l),w=()=>{document.removeEventListener("change",t),document.removeEventListener("input",a),document.removeEventListener("click",l)}}function oe(){typeof w=="function"&&w(),w=null}export{ue as default,pe as init,oe as teardown};
