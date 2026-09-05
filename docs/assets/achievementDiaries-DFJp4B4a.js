import{f as r,j as B,k as F,R as E}from"./index-C5b1YBn4.js";const x=["Easy","Medium","Hard","Elite"];function C(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function G(e,t,o){const n=e.player?.levels?.[t];return typeof n=="number"&&n>=o}function N(e,t,o){const n=e.player?.quests?.[t]??0;return o==="completed"?n===2:o==="started"?n>0:!1}function R(e,t){if(!t?.id)return!1;const o=e.obtained||[],n=e.rolled||[];return o.includes(t.id)&&n.includes(t.id)}function j(e,t){return e?.name?e.name:e?.id&&t?.has(e.id)?t.get(e.id):typeof e=="number"&&t?.has(e)?t.get(e):e?.id?`Item ${e.id}`:"Unknown item"}function K(e){return(e||[]).map(t=>typeof t=="number"?{id:t}:typeof t=="object"?t:{name:String(t)})}async function U(e,t,o){const n={skills:[],quests:[],items:[],itemGroups:[],rules:[],untracked:[]};let s=!0;for(const[l,a]of Object.entries(e?.skills||{}))G(t,l,a)||(n.skills.push(`${l} ${a}`),s=!1);for(const[l,a]of Object.entries(e?.quests||{}))if(!N(t,l,a)){const c=a==="completed"?"completed":"started";n.quests.push(`${l} (${c})`),s=!1}for(const l of e?.items||[])R(t,l)||(n.items.push(j(l,o)),s=!1);for(const l of e?.itemsAny||[]){const a=K(l);if(!a.some(u=>R(t,u))){const u=a.map(y=>j(y,o));n.itemGroups.push(`Any of: ${u.join(" / ")}`),s=!1}}const i=(e?.rulesAll||[]).filter(B),f=new Set(i);i.length&&(F(t,i,{trackMissing:!1})||(n.rules.push(i.join(" + ")),s=!1));for(const l of e?.rulesAll||[]){if(f.has(l))continue;const a=E[l];if(!a){n.rules.push(`${l} (missing)`),s=!1;continue}try{await a(t)||(n.rules.push(l),s=!1)}catch{n.rules.push(`${l} (error)`),s=!1}}const d=e?.rulesAny||[];if(d.length){let l=!1;const a=[];for(const c of d){const u=E[c];if(!u){a.push(`${c} (missing)`);continue}try{await u(t)?l=!0:a.push(c)}catch{a.push(`${c} (error)`)}}l||(n.rules.push(`Any of: ${a.join(" / ")}`),s=!1)}return e?.untracked?.length&&(n.untracked=[...e.untracked],s=!1),{met:s,missing:n}}function V(e){const t=[];return e.skills.length&&t.push(`Missing levels: ${e.skills.join(", ")}.`),e.quests.length&&t.push(`Missing quests: ${e.quests.join(", ")}.`),e.items.length&&t.push(`Missing items: ${e.items.join(", ")}.`),e.itemGroups.length&&t.push(`Missing item options: ${e.itemGroups.join("; ")}.`),e.rules.length&&t.push(`Missing rules: ${e.rules.join(", ")}.`),e.untracked.length&&t.push(`Untracked requirements: ${e.untracked.join(", ")}.`),t.map(o=>`<div class="diary-missing">${C(o)}</div>`).join("")}function _(){return{items:r.items,player:r.player,obtained:r.obtained||[],rolled:r.rolled||[],filters:r.filters,missing:{items:new Set}}}async function J(){if(!r.player)return`
            <h1>Achievement diaries</h1>
            <p>Please upload your files and player name on the Upload page first.</p>
        `;await r.ensureItemsLoaded();const e=new Map((r.items||[]).map(i=>[i.id,i.name])),n=(await(await fetch("/data/achievement_diaries.json")).json())?.diaries||{},s=[];for(const[i,f]of Object.entries(n)){const d=[];for(const l of x.filter(a=>f?.[a]?.length)){const a=f[l]||[];let c=0,u=0,y=0;const w=[];for(let p=0;p<a.length;p++){const A=a[p],S=!!r.player?.achievementDiaries?.[i]?.[l]?.tasks?.[p];let v=!1,h="diary-status-blocked",m="Blocked",D="";if(S)h="diary-status-complete",m="Done",c+=1;else{const H=_(),{met:M,missing:O}=await U(A.requirements,H,e);M?(h="diary-status-ready",m="Ready",v=!0,u+=1):(h="diary-status-blocked",m="Blocked",y+=1,D=V(O))}w.push(`
                    <div class="diary-task ${h}"
                        data-completed="${S?"true":"false"}"
                        data-doable="${v?"true":"false"}">
                        <div class="diary-task-name">
                            ${C(A.name)}
                        </div>

                        <div class="diary-task-status">
                            ${m}
                        </div>

                        ${D}
                    </div>
                `)}const I=y===0;d.push(`
                <section
                    class="diary-tier"
                    data-fully-completable="${I?"true":"false"}"
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
                            ${y} blocked)
                        </span>
                    </h3>

                    <div class="diary-tier-body">
                        <div class="diary-task-list">
                            ${w.join("")}
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

                    <h2>${C(i)}</h2>
                </div>

                <div class="diary-region-body">
                    ${d.join("")}
                </div>
            </section>
        `)}return`
        <h1>Achievement diaries</h1>

        <div class="diary-filters">
            <label class="diary-filter">
                <input
                    type="checkbox"
                    id="hideCompletedDiaries"
                    ${r.filters?.hideCompletedDiaries?"checked":""}
                >
                Hide completed tasks
            </label>

            <label class="diary-filter">
                <input
                    type="checkbox"
                    id="hideIncompletableDiaries"
                    ${r.filters?.hideIncompletableDiaries?"checked":""}
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
    `}function L(e){const t=r.filters?.hideCompletedDiaries,o=r.filters?.hideIncompletableDiaries,n=r.filters?.showOnlyCompletableTiers,s=e.querySelectorAll(".diary-task");for(const d of s){const l=d.dataset.completed==="true",a=d.dataset.doable==="true",u=t&&l||o&&(!l&&!a);d.style.display=u?"none":""}const i=e.querySelectorAll(".diary-tier");for(const d of i){if(n&&d.dataset.fullyCompletable!=="true"){d.style.display="none";continue}const l=Array.from(d.querySelectorAll(".diary-task")).some(a=>a.style.display!=="none");d.style.display=l?"":"none"}const f=e.querySelectorAll(".diary-region");for(const d of f){const l=Array.from(d.querySelectorAll(".diary-tier")).some(a=>a.style.display!=="none");d.style.display=l?"":"none"}}async function b(e){const t={...r.filters,...e};await r.setFilters(t);const o=document.getElementById("diaryList");o&&L(o)}function T(e,t){e.textContent=t?"Show":"Hide",e.setAttribute("aria-expanded",t?"false":"true")}function k(e,t){e.classList.toggle("is-collapsed",t);const o=e.querySelector(".diary-region-toggle");o&&T(o,t)}function $(e,t){e.classList.toggle("is-collapsed",t);const o=e.querySelector(".diary-tier-toggle");o&&T(o,t)}function q(e,t){e.textContent=t?"Show all tiers":"Show only completable tiers"}let g=null;function W(){z();const e=document.getElementById("diaryList");e&&L(e);const t=document.getElementById("toggleCompletableTiers");t&&q(t,!!r.filters?.showOnlyCompletableTiers);const o=async s=>{s.target.id==="hideCompletedDiaries"&&await b({hideCompletedDiaries:s.target.checked}),s.target.id==="hideIncompletableDiaries"&&await b({hideIncompletableDiaries:s.target.checked})},n=async s=>{if(s.target.id==="foldAllDiaries"){document.querySelectorAll(".diary-region").forEach(i=>k(i,!0)),document.querySelectorAll(".diary-tier").forEach(i=>$(i,!0));return}if(s.target.id==="unfoldAllDiaries"){document.querySelectorAll(".diary-region").forEach(i=>k(i,!1)),document.querySelectorAll(".diary-tier").forEach(i=>$(i,!1));return}if(s.target.classList.contains("diary-region-toggle")){const i=s.target.closest(".diary-region");i&&k(i,!i.classList.contains("is-collapsed"))}if(s.target.classList.contains("diary-tier-toggle")){const i=s.target.closest(".diary-tier");i&&$(i,!i.classList.contains("is-collapsed"))}if(s.target.id==="toggleCompletableTiers"){const i=!r.filters?.showOnlyCompletableTiers;await b({showOnlyCompletableTiers:i}),q(s.target,i)}};document.addEventListener("change",o),document.addEventListener("click",n),g=()=>{document.removeEventListener("change",o),document.removeEventListener("click",n)}}function z(){typeof g=="function"&&g(),g=null}export{J as default,W as init,z as teardown};
