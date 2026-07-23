import{f as d,j as U,k as V,R as L,l as _}from"./index-CTJoTLka.js";const z={Woodcutting:"overrideWoodcutting",Mining:"overrideMining",Fishing:"overrideFishing",Cooking:"overrideCooking",Farming:"overrideFarming",Fletching:"overrideFletching",Crafting:"overrideCrafting",Construction:"overrideConstruction"},P=["Easy","Medium","Hard","Elite"];function S(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Q(e,t,o){const n=z[t];if(n&&e.filters?.[n])return!0;if(e?.ignoreSkillLevels)return _(e,t);const i=e.player?.levels?.[t];return typeof i=="number"&&i>=o}function W(e,t,o){const n=e.player?.quests?.[t]??0;return o==="completed"?n===2:o==="started"?n>0:!1}function j(e,t){if(!t?.id)return!1;const o=e.obtained||[],n=e.rolled||[];return o.includes(t.id)&&n.includes(t.id)}function q(e,t){return e?.name?e.name:e?.id&&t?.has(e.id)?t.get(e.id):typeof e=="number"&&t?.has(e)?t.get(e):e?.id?`Item ${e.id}`:"Unknown item"}function J(e){return(e||[]).map(t=>typeof t=="number"?{id:t}:typeof t=="object"?t:{name:String(t)})}async function T(e,t,o){const n={skills:[],quests:[],items:[],itemGroups:[],rules:[],untracked:[]};let i=!0;for(const[l,a]of Object.entries(e?.skills||{}))Q(t,l,a)||(n.skills.push(`${l} ${a}`),i=!1);for(const[l,a]of Object.entries(e?.quests||{}))if(!W(t,l,a)){const c=a==="completed"?"completed":"started";n.quests.push(`${l} (${c})`),i=!1}for(const l of e?.items||[])j(t,l)||(n.items.push(q(l,o)),i=!1);for(const l of e?.itemsAny||[]){const a=J(l);if(!a.some(u=>j(t,u))){const u=a.map(f=>q(f,o));n.itemGroups.push(`Any of: ${u.join(" / ")}`),i=!1}}const s=(e?.rulesAll||[]).filter(U),p=new Set(s);s.length&&(V(t,s,{trackMissing:!1})||(n.rules.push(s.join(" + ")),i=!1));for(const l of e?.rulesAll||[]){if(p.has(l))continue;const a=L[l];if(!a){n.rules.push(`${l} (missing)`),i=!1;continue}try{await a(t)||(n.rules.push(l),i=!1)}catch{n.rules.push(`${l} (error)`),i=!1}}const r=e?.rulesAny||[];if(r.length){let l=!1;const a=[];for(const c of r){const u=L[c];if(!u){a.push(`${c} (missing)`);continue}try{await u(t)?l=!0:a.push(c)}catch{a.push(`${c} (error)`)}}l||(n.rules.push(`Any of: ${a.join(" / ")}`),i=!1)}return e?.untracked?.length&&(n.untracked=[...e.untracked],i=!1),{met:i,missing:n}}function X(e){const t=[];return e.skills.length&&t.push(`Missing levels: ${e.skills.join(", ")}.`),e.quests.length&&t.push(`Missing quests: ${e.quests.join(", ")}.`),e.items.length&&t.push(`Missing items: ${e.items.join(", ")}.`),e.itemGroups.length&&t.push(`Missing item options: ${e.itemGroups.join("; ")}.`),e.rules.length&&t.push(`Missing rules: ${e.rules.join(", ")}.`),e.untracked.length&&t.push(`Untracked requirements: ${e.untracked.join(", ")}.`),t.map(o=>`<div class="diary-missing">${S(o)}</div>`).join("")}function I(e={}){return{items:d.items,player:d.player,obtained:d.obtained||[],rolled:d.rolled||[],filters:d.filters,ignoreSkillLevels:!!e.ignoreSkillLevels,missing:{items:new Set}}}async function te(){if(!d.player)return`
            <h1>Achievement diaries</h1>
            <p>Please upload your files and player name on the Upload page first.</p>
        `;await d.ensureItemsLoaded();const e=new Map((d.items||[]).map(s=>[s.id,s.name])),n=(await(await fetch("/data/achievement_diaries.json")).json())?.diaries||{},i=[];for(const[s,p]of Object.entries(n)){const r=[];for(const l of P.filter(a=>p?.[a]?.length)){const a=p[l]||[];let c=0,u=0,f=0,b=0;const w=[];for(let y=0;y<a.length;y++){const k=a[y],A=!!d.player?.achievementDiaries?.[s]?.[l]?.tasks?.[y];let D=!1,E=!1,g="diary-status-blocked",m="Not completed",R="";if(A)g="diary-status-complete",m="Completed",c+=1;else{const G=I(),{met:K,missing:N}=await T(k.requirements,G,e);if(K)g="diary-status-ready",m="Can complete",D=!0,u+=1;else{const B=I({ignoreSkillLevels:!0}),{met:x}=await T(k.requirements,B,e);x?(g="diary-status-trainable",m="Train levels",E=!0,f+=1):b+=1,R=X(N)}}w.push(`
                    <div class="diary-task ${g}"
                        data-completed="${A?"true":"false"}"
                        data-doable="${D?"true":"false"}"
                        data-trainable="${E?"true":"false"}">
                        <div class="diary-task-name">${S(k.name)}</div>
                        <div class="diary-task-status">${m}</div>
                        ${R}
                    </div>
                `)}const O=b===0&&f===0;r.push(`
                <section class="diary-tier" data-fully-completable="${O?"true":"false"}">
                    <h3 class="diary-tier-header">
                        <button class="diary-toggle diary-tier-toggle" type="button" aria-expanded="true">Hide</button>
                        <span>${l}</span>
                        <span class="diary-tier-counts">
                            (${c} done, ${u} can complete, ${f} trainable, ${b} blocked)
                        </span>
                    </h3>
                    <div class="diary-tier-body">
                        <div class="diary-task-list">
                            ${w.join("")}
                        </div>
                    </div>
                </section>
            `)}i.push(`
            <section class="diary-region">
                <div class="diary-region-header">
                    <button class="diary-toggle diary-region-toggle" type="button" aria-expanded="true">Hide</button>
                    <h2>${S(s)}</h2>
                </div>
                <div class="diary-region-body">
                    ${r.join("")}
                </div>
            </section>
        `)}return`
        <h1>Achievement diaries</h1>
        <div class="diary-filters">
            <label class="diary-filter">
                <input type="checkbox" id="hideCompletedDiaries" ${d.filters?.hideCompletedDiaries?"checked":""}>
                Hide completed tasks
            </label>
            <label class="diary-filter">
                <input type="checkbox" id="hideIncompletableDiaries" ${d.filters?.hideIncompletableDiaries?"checked":""}>
                Hide incompletable tasks
            </label>
            <button class="diary-action" type="button" id="toggleCompletableTiers"></button>
            <button class="diary-action" type="button" id="foldAllDiaries">Hide all</button>
            <button class="diary-action" type="button" id="unfoldAllDiaries">Show all</button>
        </div>
        <div class="diary-list" id="diaryList">
            ${i.length?i.join(""):"<p>No diary data loaded yet.</p>"}
        </div>
    `}function F(e){const t=d.filters?.hideCompletedDiaries,o=d.filters?.hideIncompletableDiaries,n=d.filters?.showOnlyCompletableTiers,i=e.querySelectorAll(".diary-task");for(const r of i){const l=r.dataset.completed==="true",a=r.dataset.doable==="true",c=r.dataset.trainable==="true",f=t&&l||o&&(!l&&!a&&!c);r.style.display=f?"none":""}const s=e.querySelectorAll(".diary-tier");for(const r of s){if(n&&r.dataset.fullyCompletable!=="true"){r.style.display="none";continue}const l=Array.from(r.querySelectorAll(".diary-task")).some(a=>a.style.display!=="none");r.style.display=l?"":"none"}const p=e.querySelectorAll(".diary-region");for(const r of p){const l=Array.from(r.querySelectorAll(".diary-tier")).some(a=>a.style.display!=="none");r.style.display=l?"":"none"}}async function C(e){const t={...d.filters,...e};await d.setFilters(t);const o=document.getElementById("diaryList");o&&F(o)}function H(e,t){e.textContent=t?"Show":"Hide",e.setAttribute("aria-expanded",t?"false":"true")}function v(e,t){e.classList.toggle("is-collapsed",t);const o=e.querySelector(".diary-region-toggle");o&&H(o,t)}function $(e,t){e.classList.toggle("is-collapsed",t);const o=e.querySelector(".diary-tier-toggle");o&&H(o,t)}function M(e,t){e.textContent=t?"Show all tiers":"Show only completable tiers"}let h=null;function ie(){Y();const e=document.getElementById("diaryList");e&&F(e);const t=document.getElementById("toggleCompletableTiers");t&&M(t,!!d.filters?.showOnlyCompletableTiers);const o=async i=>{i.target.id==="hideCompletedDiaries"&&await C({hideCompletedDiaries:i.target.checked}),i.target.id==="hideIncompletableDiaries"&&await C({hideIncompletableDiaries:i.target.checked})},n=async i=>{if(i.target.id==="foldAllDiaries"){document.querySelectorAll(".diary-region").forEach(s=>v(s,!0)),document.querySelectorAll(".diary-tier").forEach(s=>$(s,!0));return}if(i.target.id==="unfoldAllDiaries"){document.querySelectorAll(".diary-region").forEach(s=>v(s,!1)),document.querySelectorAll(".diary-tier").forEach(s=>$(s,!1));return}if(i.target.classList.contains("diary-region-toggle")){const s=i.target.closest(".diary-region");s&&v(s,!s.classList.contains("is-collapsed"))}if(i.target.classList.contains("diary-tier-toggle")){const s=i.target.closest(".diary-tier");s&&$(s,!s.classList.contains("is-collapsed"))}if(i.target.id==="toggleCompletableTiers"){const s=!d.filters?.showOnlyCompletableTiers;await C({showOnlyCompletableTiers:s}),M(i.target,s)}};document.addEventListener("change",o),document.addEventListener("click",n),h=()=>{document.removeEventListener("change",o),document.removeEventListener("click",n)}}function Y(){typeof h=="function"&&h(),h=null}export{te as default,ie as init,Y as teardown};
