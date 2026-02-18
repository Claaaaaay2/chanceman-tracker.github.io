import{f as d,R as L,h as U}from"./index-D-SGbWpC.js";const V={Woodcutting:"overrideWoodcutting",Mining:"overrideMining",Fishing:"overrideFishing",Cooking:"overrideCooking",Farming:"overrideFarming",Fletching:"overrideFletching",Crafting:"overrideCrafting",Construction:"overrideConstruction"},_=["Easy","Medium","Hard","Elite"];function S(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function z(e,t,l){const r=V[t];if(r&&e.filters?.[r])return!0;if(e?.ignoreSkillLevels)return U(e,t);const i=e.player?.levels?.[t];return typeof i=="number"&&i>=l}function P(e,t,l){const r=e.player?.quests?.[t]??0;return l==="completed"?r===2:l==="started"?r>0:!1}function T(e,t){if(!t?.id)return!1;const l=e.obtained||[],r=e.rolled||[];return l.includes(t.id)&&r.includes(t.id)}function j(e,t){return e?.name?e.name:e?.id&&t?.has(e.id)?t.get(e.id):typeof e=="number"&&t?.has(e)?t.get(e):e?.id?`Item ${e.id}`:"Unknown item"}function Q(e){return(e||[]).map(t=>typeof t=="number"?{id:t}:typeof t=="object"?t:{name:String(t)})}async function I(e,t,l){const r={skills:[],quests:[],items:[],itemGroups:[],rules:[],untracked:[]};let i=!0;for(const[o,s]of Object.entries(e?.skills||{}))z(t,o,s)||(r.skills.push(`${o} ${s}`),i=!1);for(const[o,s]of Object.entries(e?.quests||{}))if(!P(t,o,s)){const n=s==="completed"?"completed":"started";r.quests.push(`${o} (${n})`),i=!1}for(const o of e?.items||[])T(t,o)||(r.items.push(j(o,l)),i=!1);for(const o of e?.itemsAny||[]){const s=Q(o);if(!s.some(c=>T(t,c))){const c=s.map(u=>j(u,l));r.itemGroups.push(`Any of: ${c.join(" / ")}`),i=!1}}for(const o of e?.rulesAll||[]){const s=L[o];if(!s){r.rules.push(`${o} (missing)`),i=!1;continue}try{await s(t)||(r.rules.push(o),i=!1)}catch{r.rules.push(`${o} (error)`),i=!1}}const a=e?.rulesAny||[];if(a.length){let o=!1;const s=[];for(const n of a){const c=L[n];if(!c){s.push(`${n} (missing)`);continue}try{await c(t)?o=!0:s.push(n)}catch{s.push(`${n} (error)`)}}o||(r.rules.push(`Any of: ${s.join(" / ")}`),i=!1)}return e?.untracked?.length&&(r.untracked=[...e.untracked],i=!1),{met:i,missing:r}}function W(e){const t=[];return e.skills.length&&t.push(`Missing levels: ${e.skills.join(", ")}.`),e.quests.length&&t.push(`Missing quests: ${e.quests.join(", ")}.`),e.items.length&&t.push(`Missing items: ${e.items.join(", ")}.`),e.itemGroups.length&&t.push(`Missing item options: ${e.itemGroups.join("; ")}.`),e.rules.length&&t.push(`Missing rules: ${e.rules.join(", ")}.`),e.untracked.length&&t.push(`Untracked requirements: ${e.untracked.join(", ")}.`),t.map(l=>`<div class="diary-missing">${S(l)}</div>`).join("")}function R(e={}){return{items:d.items,player:d.player,obtained:d.obtained||[],rolled:d.rolled||[],filters:d.filters,ignoreSkillLevels:!!e.ignoreSkillLevels,missing:{items:new Set}}}async function Z(){if(!d.player)return`
            <h1>Achievement diaries</h1>
            <p>Please upload your files and player name on the Upload page first.</p>
        `;await d.ensureItemsLoaded();const e=new Map((d.items||[]).map(a=>[a.id,a.name])),r=(await(await fetch("/data/achievement_diaries.json")).json())?.diaries||{},i=[];for(const[a,o]of Object.entries(r)){const s=[];for(const n of _.filter(c=>o?.[c]?.length)){const c=o[n]||[];let u=0,h=0,f=0,b=0;const w=[];for(let p=0;p<c.length;p++){const k=c[p],A=!!d.player?.achievementDiaries?.[a]?.[n]?.tasks?.[p];let D=!1,q=!1,y="diary-status-blocked",g="Not completed",E="";if(A)y="diary-status-complete",g="Completed",u+=1;else{const G=R(),{met:N,missing:x}=await I(k.requirements,G,e);if(N)y="diary-status-ready",g="Can complete",D=!0,h+=1;else{const B=R({ignoreSkillLevels:!0}),{met:K}=await I(k.requirements,B,e);K?(y="diary-status-trainable",g="Train levels",q=!0,f+=1):b+=1,E=W(x)}}w.push(`
                    <div class="diary-task ${y}"
                        data-completed="${A?"true":"false"}"
                        data-doable="${D?"true":"false"}"
                        data-trainable="${q?"true":"false"}">
                        <div class="diary-task-name">${S(k.name)}</div>
                        <div class="diary-task-status">${g}</div>
                        ${E}
                    </div>
                `)}const O=b===0&&f===0;s.push(`
                <section class="diary-tier" data-fully-completable="${O?"true":"false"}">
                    <h3 class="diary-tier-header">
                        <button class="diary-toggle diary-tier-toggle" type="button" aria-expanded="true">Hide</button>
                        <span>${n}</span>
                        <span class="diary-tier-counts">
                            (${u} done, ${h} can complete, ${f} trainable, ${b} blocked)
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
                    <h2>${S(a)}</h2>
                </div>
                <div class="diary-region-body">
                    ${s.join("")}
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
    `}function M(e){const t=d.filters?.hideCompletedDiaries,l=d.filters?.hideIncompletableDiaries,r=d.filters?.showOnlyCompletableTiers,i=e.querySelectorAll(".diary-task");for(const s of i){const n=s.dataset.completed==="true",c=s.dataset.doable==="true",u=s.dataset.trainable==="true",f=t&&n||l&&(!n&&!c&&!u);s.style.display=f?"none":""}const a=e.querySelectorAll(".diary-tier");for(const s of a){if(r&&s.dataset.fullyCompletable!=="true"){s.style.display="none";continue}const n=Array.from(s.querySelectorAll(".diary-task")).some(c=>c.style.display!=="none");s.style.display=n?"":"none"}const o=e.querySelectorAll(".diary-region");for(const s of o){const n=Array.from(s.querySelectorAll(".diary-tier")).some(c=>c.style.display!=="none");s.style.display=n?"":"none"}}async function C(e){const t={...d.filters,...e};await d.setFilters(t);const l=document.getElementById("diaryList");l&&M(l)}function H(e,t){e.textContent=t?"Show":"Hide",e.setAttribute("aria-expanded",t?"false":"true")}function v(e,t){e.classList.toggle("is-collapsed",t);const l=e.querySelector(".diary-region-toggle");l&&H(l,t)}function $(e,t){e.classList.toggle("is-collapsed",t);const l=e.querySelector(".diary-tier-toggle");l&&H(l,t)}function F(e,t){e.textContent=t?"Show all tiers":"Show only completable tiers"}let m=null;function ee(){J();const e=document.getElementById("diaryList");e&&M(e);const t=document.getElementById("toggleCompletableTiers");t&&F(t,!!d.filters?.showOnlyCompletableTiers);const l=async i=>{i.target.id==="hideCompletedDiaries"&&await C({hideCompletedDiaries:i.target.checked}),i.target.id==="hideIncompletableDiaries"&&await C({hideIncompletableDiaries:i.target.checked})},r=async i=>{if(i.target.id==="foldAllDiaries"){document.querySelectorAll(".diary-region").forEach(a=>v(a,!0)),document.querySelectorAll(".diary-tier").forEach(a=>$(a,!0));return}if(i.target.id==="unfoldAllDiaries"){document.querySelectorAll(".diary-region").forEach(a=>v(a,!1)),document.querySelectorAll(".diary-tier").forEach(a=>$(a,!1));return}if(i.target.classList.contains("diary-region-toggle")){const a=i.target.closest(".diary-region");a&&v(a,!a.classList.contains("is-collapsed"))}if(i.target.classList.contains("diary-tier-toggle")){const a=i.target.closest(".diary-tier");a&&$(a,!a.classList.contains("is-collapsed"))}if(i.target.id==="toggleCompletableTiers"){const a=!d.filters?.showOnlyCompletableTiers;await C({showOnlyCompletableTiers:a}),F(i.target,a)}};document.addEventListener("change",l),document.addEventListener("click",r),m=()=>{document.removeEventListener("change",l),document.removeEventListener("click",r)}}function J(){typeof m=="function"&&m(),m=null}export{Z as default,ee as init,J as teardown};
