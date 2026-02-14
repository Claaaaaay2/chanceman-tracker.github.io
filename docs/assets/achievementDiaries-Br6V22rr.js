import{f as n,R as E,g as K}from"./index-CoGxWBTG.js";const U={Woodcutting:"overrideWoodcutting",Mining:"overrideMining",Fishing:"overrideFishing",Cooking:"overrideCooking",Farming:"overrideFarming",Fletching:"overrideFletching",Crafting:"overrideCrafting",Construction:"overrideConstruction"},V=["Easy","Medium","Hard","Elite"];function C(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function _(e,t,s){const l=U[t];if(l&&e.filters?.[l])return!0;if(e?.ignoreSkillLevels)return K(e,t);const o=e.player?.levels?.[t];return typeof o=="number"&&o>=s}function P(e,t,s){const l=e.player?.quests?.[t]??0;return s==="completed"?l===2:s==="started"?l>0:!1}function L(e,t){if(!t?.id)return!1;const s=e.obtained||[],l=e.rolled||[];return s.includes(t.id)&&l.includes(t.id)}function T(e,t){return e?.name?e.name:e?.id&&t?.has(e.id)?t.get(e.id):typeof e=="number"&&t?.has(e)?t.get(e):e?.id?`Item ${e.id}`:"Unknown item"}function z(e){return(e||[]).map(t=>typeof t=="number"?{id:t}:typeof t=="object"?t:{name:String(t)})}async function j(e,t,s){const l={skills:[],quests:[],items:[],itemGroups:[],rules:[],untracked:[]};let o=!0;for(const[a,i]of Object.entries(e?.skills||{}))_(t,a,i)||(l.skills.push(`${a} ${i}`),o=!1);for(const[a,i]of Object.entries(e?.quests||{}))if(!P(t,a,i)){const r=i==="completed"?"completed":"started";l.quests.push(`${a} (${r})`),o=!1}for(const a of e?.items||[])L(t,a)||(l.items.push(T(a,s)),o=!1);for(const a of e?.itemsAny||[]){const i=z(a);if(!i.some(d=>L(t,d))){const d=i.map(u=>T(u,s));l.itemGroups.push(`Any of: ${d.join(" / ")}`),o=!1}}for(const a of e?.rulesAll||[]){const i=E[a];if(!i){l.rules.push(`${a} (missing)`),o=!1;continue}try{await i(t)||(l.rules.push(a),o=!1)}catch{l.rules.push(`${a} (error)`),o=!1}}const c=e?.rulesAny||[];if(c.length){let a=!1;const i=[];for(const r of c){const d=E[r];if(!d){i.push(`${r} (missing)`);continue}try{await d(t)?a=!0:i.push(r)}catch{i.push(`${r} (error)`)}}a||(l.rules.push(`Any of: ${i.join(" / ")}`),o=!1)}return e?.untracked?.length&&(l.untracked=[...e.untracked],o=!1),{met:o,missing:l}}function Q(e){const t=[];return e.skills.length&&t.push(`Missing levels: ${e.skills.join(", ")}.`),e.quests.length&&t.push(`Missing quests: ${e.quests.join(", ")}.`),e.items.length&&t.push(`Missing items: ${e.items.join(", ")}.`),e.itemGroups.length&&t.push(`Missing item options: ${e.itemGroups.join("; ")}.`),e.rules.length&&t.push(`Missing rules: ${e.rules.join(", ")}.`),e.untracked.length&&t.push(`Untracked requirements: ${e.untracked.join(", ")}.`),t.map(s=>`<div class="diary-missing">${C(s)}</div>`).join("")}function I(e={}){return{items:n.items,player:n.player,obtained:n.obtained||[],rolled:n.rolled||[],filters:n.filters,ignoreSkillLevels:!!e.ignoreSkillLevels,missing:{items:new Set}}}async function X(){if(!n.player)return`
            <h1>Achievement diaries</h1>
            <p>Please upload your files and player name on the Upload page first.</p>
        `;await n.ensureItemsLoaded();const e=new Map((n.items||[]).map(c=>[c.id,c.name])),l=(await(await fetch("/data/achievement_diaries.json")).json())?.diaries||{},o=[];for(const[c,a]of Object.entries(l)){const i=[];for(const r of V.filter(d=>a?.[d]?.length)){const d=a[r]||[];let u=0,m=0,f=0,h=0;const S=[];for(let p=0;p<d.length;p++){const b=d[p],w=!!n.player?.achievementDiaries?.[c]?.[r]?.tasks?.[p];let A=!1,D=!1,y="diary-status-blocked",g="Not completed",q="";if(w)y="diary-status-complete",g="Completed",u+=1;else{const O=I(),{met:G,missing:N}=await j(b.requirements,O,e);if(G)y="diary-status-ready",g="Can complete",A=!0,m+=1;else{const x=I({ignoreSkillLevels:!0}),{met:B}=await j(b.requirements,x,e);B?(y="diary-status-trainable",g="Train levels",D=!0,f+=1):h+=1,q=Q(N)}}S.push(`
                    <div class="diary-task ${y}"
                        data-completed="${w?"true":"false"}"
                        data-doable="${A?"true":"false"}"
                        data-trainable="${D?"true":"false"}">
                        <div class="diary-task-name">${C(b.name)}</div>
                        <div class="diary-task-status">${g}</div>
                        ${q}
                    </div>
                `)}const H=h===0&&f===0;i.push(`
                <section class="diary-tier" data-fully-completable="${H?"true":"false"}">
                    <h3 class="diary-tier-header">
                        <button class="diary-toggle diary-tier-toggle" type="button" aria-expanded="true">Hide</button>
                        <span>${r}</span>
                        <span class="diary-tier-counts">
                            (${u} done, ${m} can complete, ${f} trainable, ${h} blocked)
                        </span>
                    </h3>
                    <div class="diary-tier-body">
                        <div class="diary-task-list">
                            ${S.join("")}
                        </div>
                    </div>
                </section>
            `)}o.push(`
            <section class="diary-region">
                <div class="diary-region-header">
                    <button class="diary-toggle diary-region-toggle" type="button" aria-expanded="true">Hide</button>
                    <h2>${C(c)}</h2>
                </div>
                <div class="diary-region-body">
                    ${i.join("")}
                </div>
            </section>
        `)}return`
        <h1>Achievement diaries</h1>
        <div class="diary-filters">
            <label class="diary-filter">
                <input type="checkbox" id="hideCompletedDiaries" ${n.filters?.hideCompletedDiaries?"checked":""}>
                Hide completed tasks
            </label>
            <label class="diary-filter">
                <input type="checkbox" id="hideIncompletableDiaries" ${n.filters?.hideIncompletableDiaries?"checked":""}>
                Hide incompletable tasks
            </label>
            <button class="diary-action" type="button" id="toggleCompletableTiers"></button>
            <button class="diary-action" type="button" id="foldAllDiaries">Hide all</button>
            <button class="diary-action" type="button" id="unfoldAllDiaries">Show all</button>
        </div>
        <div class="diary-list" id="diaryList">
            ${o.length?o.join(""):"<p>No diary data loaded yet.</p>"}
        </div>
    `}function R(e){const t=n.filters?.hideCompletedDiaries,s=n.filters?.hideIncompletableDiaries,l=n.filters?.showOnlyCompletableTiers,o=e.querySelectorAll(".diary-task");for(const i of o){const r=i.dataset.completed==="true",d=i.dataset.doable==="true",u=i.dataset.trainable==="true",f=t&&r||s&&(!r&&!d&&!u);i.style.display=f?"none":""}const c=e.querySelectorAll(".diary-tier");for(const i of c){if(l&&i.dataset.fullyCompletable!=="true"){i.style.display="none";continue}const r=Array.from(i.querySelectorAll(".diary-task")).some(d=>d.style.display!=="none");i.style.display=r?"":"none"}const a=e.querySelectorAll(".diary-region");for(const i of a){const r=Array.from(i.querySelectorAll(".diary-tier")).some(d=>d.style.display!=="none");i.style.display=r?"":"none"}}async function $(e){const t={...n.filters,...e};await n.setFilters(t);const s=document.getElementById("diaryList");s&&R(s)}document.addEventListener("change",async e=>{e.target.id==="hideCompletedDiaries"&&await $({hideCompletedDiaries:e.target.checked}),e.target.id==="hideIncompletableDiaries"&&await $({hideIncompletableDiaries:e.target.checked})});function F(e,t){e.textContent=t?"Show":"Hide",e.setAttribute("aria-expanded",t?"false":"true")}function v(e,t){e.classList.toggle("is-collapsed",t);const s=e.querySelector(".diary-region-toggle");s&&F(s,t)}function k(e,t){e.classList.toggle("is-collapsed",t);const s=e.querySelector(".diary-tier-toggle");s&&F(s,t)}document.addEventListener("click",async e=>{if(e.target.id==="foldAllDiaries"){document.querySelectorAll(".diary-region").forEach(t=>v(t,!0)),document.querySelectorAll(".diary-tier").forEach(t=>k(t,!0));return}if(e.target.id==="unfoldAllDiaries"){document.querySelectorAll(".diary-region").forEach(t=>v(t,!1)),document.querySelectorAll(".diary-tier").forEach(t=>k(t,!1));return}if(e.target.classList.contains("diary-region-toggle")){const t=e.target.closest(".diary-region");t&&v(t,!t.classList.contains("is-collapsed"))}if(e.target.classList.contains("diary-tier-toggle")){const t=e.target.closest(".diary-tier");t&&k(t,!t.classList.contains("is-collapsed"))}if(e.target.id==="toggleCompletableTiers"){const t=!n.filters?.showOnlyCompletableTiers;await $({showOnlyCompletableTiers:t}),M(e.target,t)}});function M(e,t){e.textContent=t?"Show all tiers":"Show only completable tiers"}window.initAchievementDiariesPage=function(){const e=document.getElementById("diaryList");e&&R(e);const t=document.getElementById("toggleCompletableTiers");t&&M(t,!!n.filters?.showOnlyCompletableTiers)};export{X as default};
