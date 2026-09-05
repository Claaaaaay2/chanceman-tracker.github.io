import{f as d,j as G,k as x,R as q}from"./index-TUJUZm-6.js";const N=["Easy","Medium","Hard","Elite"];function v(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function K(e,t,o){const n=e.player?.levels?.[t];return typeof n=="number"&&n>=o}function U(e,t,o){const n=e.player?.quests?.[t]??0;return o==="completed"?n===2:o==="started"?n>0:!1}function T(e,t){if(!t?.id)return!1;const o=e.obtained||[],n=e.rolled||[];return o.includes(t.id)&&n.includes(t.id)}function L(e,t){return e?.name?e.name:e?.id&&t?.has(e.id)?t.get(e.id):typeof e=="number"&&t?.has(e)?t.get(e):e?.id?`Item ${e.id}`:"Unknown item"}function V(e){return(e||[]).map(t=>typeof t=="number"?{id:t}:typeof t=="object"?t:{name:String(t)})}async function _(e,t,o){const n={skills:[],quests:[],items:[],itemGroups:[],rules:[],untracked:[]};let s=!0;for(const[l,a]of Object.entries(e?.skills||{}))K(t,l,a)||(n.skills.push(`${l} ${a}`),s=!1);for(const[l,a]of Object.entries(e?.quests||{}))if(!U(t,l,a)){const c=a==="completed"?"completed":"started";n.quests.push(`${l} (${c})`),s=!1}for(const l of e?.items||[])T(t,l)||(n.items.push(L(l,o)),s=!1);for(const l of e?.itemsAny||[]){const a=V(l);if(!a.some(u=>T(t,u))){const u=a.map(f=>L(f,o));n.itemGroups.push(`Any of: ${u.join(" / ")}`),s=!1}}const i=(e?.rulesAll||[]).filter(G),p=new Set(i);i.length&&(x(t,i,{trackMissing:!1})||(n.rules.push(i.join(" + ")),s=!1));for(const l of e?.rulesAll||[]){if(p.has(l))continue;const a=q[l];if(!a){n.rules.push(`${l} (missing)`),s=!1;continue}try{await a(t)||(n.rules.push(l),s=!1)}catch{n.rules.push(`${l} (error)`),s=!1}}const r=e?.rulesAny||[];if(r.length){let l=!1;const a=[];for(const c of r){const u=q[c];if(!u){a.push(`${c} (missing)`);continue}try{await u(t)?l=!0:a.push(c)}catch{a.push(`${c} (error)`)}}l||(n.rules.push(`Any of: ${a.join(" / ")}`),s=!1)}return e?.untracked?.length&&(n.untracked=[...e.untracked],s=!1),{met:s,missing:n}}function z(e){const t=[];return e.skills.length&&t.push(`Missing levels: ${e.skills.join(", ")}.`),e.quests.length&&t.push(`Missing quests: ${e.quests.join(", ")}.`),e.items.length&&t.push(`Missing items: ${e.items.join(", ")}.`),e.itemGroups.length&&t.push(`Missing item options: ${e.itemGroups.join("; ")}.`),e.rules.length&&t.push(`Missing rules: ${e.rules.join(", ")}.`),e.untracked.length&&t.push(`Untracked requirements: ${e.untracked.join(", ")}.`),t.map(o=>`<div class="diary-missing">${v(o)}</div>`).join("")}function P(){return{items:d.items,player:d.player,obtained:d.obtained||[],rolled:d.rolled||[],filters:d.filters,missing:{items:new Set}}}async function X(){if(!d.player)return`
            <h1>Achievement diaries</h1>
            <p>Please upload your files and player name on the Upload page first.</p>
        `;await d.ensureItemsLoaded();const e=new Map((d.items||[]).map(i=>[i.id,i.name])),n=(await(await fetch("/data/achievement_diaries.json")).json())?.diaries||{},s=[];for(const[i,p]of Object.entries(n)){const r=[];for(const l of N.filter(a=>p?.[a]?.length)){const a=p[l]||[];let c=0,u=0,f=0,k=0;const A=[];for(let g=0;g<a.length;g++){const S=a[g],D=!!d.player?.achievementDiaries?.[i]?.[l]?.tasks?.[g];let E=!1,R=!1,h="diary-status-blocked",m="Blocked",j="";if(D)h="diary-status-complete",m="Done",c+=1;else{const B=P(),{met:F,missing:y}=await _(S.requirements,B,e);F?(h="diary-status-ready",m="Ready",E=!0,u+=1):y.skills.length>0&&y.quests.length===0&&y.items.length===0&&y.itemGroups.length===0&&y.rules.length===0&&y.untracked.length===0?(h="diary-status-trainable",m="Train levels",R=!0,f+=1):(h="diary-status-blocked",m="Blocked",k+=1),j=z(y)}A.push(`
                    <div class="diary-task ${h}"
                        data-completed="${D?"true":"false"}"
                        data-doable="${E?"true":"false"}"
                        data-trainable="${R?"true":"false"}">
                        <div class="diary-task-name">
                            ${v(S.name)}
                        </div>

                        <div class="diary-task-status">
                            ${m}
                        </div>

                        ${j}
                    </div>
                `)}const O=k===0;r.push(`
                <section
                    class="diary-tier"
                    data-fully-completable="${O?"true":"false"}"
                >
                    <h3 class="diary-tier-header">
                        <button
                            class="diary-toggle diary-tier-toggle"
                            type="button"
                            aria-expanded="true"
                        >
                            Hide
                        </button>

                        <span>${l}</span>

                        <span class="diary-tier-counts">
                            (${c} done,
                            ${u} ready,
                            ${f} trainable,
                            ${k} blocked)
                        </span>
                    </h3>

                    <div class="diary-tier-body">
                        <div class="diary-task-list">
                            ${A.join("")}
                        </div>
                    </div>
                </section>
            `)}s.push(`
            <section class="diary-region">
                <div class="diary-region-header">
                    <button
                        class="diary-toggle diary-region-toggle"
                        type="button"
                        aria-expanded="true"
                    >
                        Hide
                    </button>

                    <h2>${v(i)}</h2>
                </div>

                <div class="diary-region-body">
                    ${r.join("")}
                </div>
            </section>
        `)}return`
        <h1>Achievement diaries</h1>

        <div class="diary-filters">
            <label class="diary-filter">
                <input
                    type="checkbox"
                    id="hideCompletedDiaries"
                    ${d.filters?.hideCompletedDiaries?"checked":""}
                >
                Hide completed tasks
            </label>

            <label class="diary-filter">
                <input
                    type="checkbox"
                    id="hideIncompletableDiaries"
                    ${d.filters?.hideIncompletableDiaries?"checked":""}
                >
                Hide blocked tasks
            </label>

            <button
                class="diary-action"
                type="button"
                id="toggleCompletableTiers"
            ></button>

            <button
                class="diary-action"
                type="button"
                id="foldAllDiaries"
            >
                Hide all
            </button>

            <button
                class="diary-action"
                type="button"
                id="unfoldAllDiaries"
            >
                Show all
            </button>
        </div>

        <div class="diary-list" id="diaryList">
            ${s.length?s.join(""):"<p>No diary data loaded yet.</p>"}
        </div>
    `}function H(e){const t=d.filters?.hideCompletedDiaries,o=d.filters?.hideIncompletableDiaries,n=d.filters?.showOnlyCompletableTiers,s=e.querySelectorAll(".diary-task");for(const r of s){const l=r.dataset.completed==="true",a=r.dataset.doable==="true",c=r.dataset.trainable==="true",f=t&&l||o&&(!l&&!a&&!c);r.style.display=f?"none":""}const i=e.querySelectorAll(".diary-tier");for(const r of i){if(n&&r.dataset.fullyCompletable!=="true"){r.style.display="none";continue}const l=Array.from(r.querySelectorAll(".diary-task")).some(a=>a.style.display!=="none");r.style.display=l?"":"none"}const p=e.querySelectorAll(".diary-region");for(const r of p){const l=Array.from(r.querySelectorAll(".diary-tier")).some(a=>a.style.display!=="none");r.style.display=l?"":"none"}}async function $(e){const t={...d.filters,...e};await d.setFilters(t);const o=document.getElementById("diaryList");o&&H(o)}function M(e,t){e.textContent=t?"Show":"Hide",e.setAttribute("aria-expanded",t?"false":"true")}function C(e,t){e.classList.toggle("is-collapsed",t);const o=e.querySelector(".diary-region-toggle");o&&M(o,t)}function w(e,t){e.classList.toggle("is-collapsed",t);const o=e.querySelector(".diary-tier-toggle");o&&M(o,t)}function I(e,t){e.textContent=t?"Show all tiers":"Show only completable tiers"}let b=null;function Y(){Q();const e=document.getElementById("diaryList");e&&H(e);const t=document.getElementById("toggleCompletableTiers");t&&I(t,!!d.filters?.showOnlyCompletableTiers);const o=async s=>{s.target.id==="hideCompletedDiaries"&&await $({hideCompletedDiaries:s.target.checked}),s.target.id==="hideIncompletableDiaries"&&await $({hideIncompletableDiaries:s.target.checked})},n=async s=>{if(s.target.id==="foldAllDiaries"){document.querySelectorAll(".diary-region").forEach(i=>C(i,!0)),document.querySelectorAll(".diary-tier").forEach(i=>w(i,!0));return}if(s.target.id==="unfoldAllDiaries"){document.querySelectorAll(".diary-region").forEach(i=>C(i,!1)),document.querySelectorAll(".diary-tier").forEach(i=>w(i,!1));return}if(s.target.classList.contains("diary-region-toggle")){const i=s.target.closest(".diary-region");i&&C(i,!i.classList.contains("is-collapsed"))}if(s.target.classList.contains("diary-tier-toggle")){const i=s.target.closest(".diary-tier");i&&w(i,!i.classList.contains("is-collapsed"))}if(s.target.id==="toggleCompletableTiers"){const i=!d.filters?.showOnlyCompletableTiers;await $({showOnlyCompletableTiers:i}),I(s.target,i)}};document.addEventListener("change",o),document.addEventListener("click",n),b=()=>{document.removeEventListener("change",o),document.removeEventListener("click",n)}}function Q(){typeof b=="function"&&b(),b=null}export{X as default,Y as init,Q as teardown};
