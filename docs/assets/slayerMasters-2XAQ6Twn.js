import{f as m,R as X}from"./index-DODFCPhU.js";const $e={canAssignWaterfiendsBarbarianFiremaking1:"Barbarian firemaking 1 completed",canReachWyrmsTask:"Any of: Granite boots / Boots of stone / Boots of brimstone, access to the Charred Dungeon, or can start Perilous Moons and reach Wyrmlings",canReachAbyssalSire:"Can reach Abyssal Sire area",canReachTrollheim:"Can reach Trollheim",hasUsableAxe:"Has a usable axe"};function g(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;")}function re(e){return String(e||"").toLowerCase().replace(/[^a-z0-9]/g,"")}function Se(e){return String(e||"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")}function ve(e={}){const t=Number(e.Attack||1),s=Number(e.Strength||1),o=Number(e.Defence||1),r=Number(e.Hitpoints||10),f=Number(e.Prayer||1),l=Number(e.Ranged||1),a=Number(e.Magic||1),n=.25*(o+r+Math.floor(f/2)),i=.325*(t+s),u=.325*Math.floor(l*1.5),h=.325*Math.floor(a*1.5);return Math.floor(n+Math.max(i,u,h))}function Z(e,t){return e==="Combat"?ve(t.player?.levels):Number(t.player?.levels?.[e]??1)}function ee(e,t,s){const o=e.player?.quests?.[t]??0;return s==="completed"?o===2:s==="started"?o>0:!1}function se(e,t){const s=re(t),o=e.itemNameToIds.get(s)||[];for(const r of o)if(e.rolledSet.has(r)&&e.obtainedSet.has(r))return!0;return!1}function te(e){return $e[e]||e}function T(...e){const t={skills:{},skillsAny:[],quests:{},questsAny:[],items:[],itemsAll:[],itemsAny:[],rulesAll:[],rulesAny:[],untracked:[]};for(const s of e)if(!(!s||typeof s!="object")){for(const[o,r]of Object.entries(s.skills||{})){const f=Number(r);if(!Number.isFinite(f)){t.skills[o]=r;continue}const l=Number(t.skills[o]);(!Number.isFinite(l)||f>l)&&(t.skills[o]=f)}Array.isArray(s.skillsAny)&&t.skillsAny.push(...s.skillsAny),Object.assign(t.quests,s.quests||{}),Array.isArray(s.questsAny)&&t.questsAny.push(...s.questsAny),Array.isArray(s.items)&&t.items.push(...s.items),Array.isArray(s.itemsAll)&&t.itemsAll.push(...s.itemsAll),Array.isArray(s.itemsAny)&&t.itemsAny.push(...s.itemsAny),Array.isArray(s.rulesAll)&&t.rulesAll.push(...s.rulesAll),Array.isArray(s.rulesAny)&&t.rulesAny.push(...s.rulesAny),Array.isArray(s.untracked)&&t.untracked.push(...s.untracked)}return t}function ae(e,t){if(!t||!e||typeof e!="object")return e||{};const s={...e.skills||{}};for(const r of Object.keys(s))String(r).toLowerCase()==="combat"&&delete s[r];const o=(e.skillsAny||[]).map(r=>{const f={};for(const[l,a]of Object.entries(r||{}))String(l).toLowerCase()!=="combat"&&(f[l]=a);return f}).filter(r=>Object.keys(r).length>0);return{...e,skills:s,skillsAny:o}}async function L(e,t){const s=[];for(const[a,n]of Object.entries(e?.skills||{}))Z(a,t)<n&&s.push(`${a} ${n}`);const o=e?.skillsAny||[];if(o.length){let a=!1;const n=[];for(const i of o){const u=Object.entries(i||{}),h=u.map(([d,y])=>`${d} ${y}`);n.push(h.join(" + ")),u.every(([d,y])=>Z(d,t)>=y)&&(a=!0)}a||s.push(`Any of: ${n.join(" / ")}`)}for(const[a,n]of Object.entries(e?.quests||{}))if(!ee(t,a,n)){const i=n==="started"?"(started)":"(completed)";s.push(`${a} ${i}`)}const r=e?.questsAny||[];if(r.length){let a=!1;const n=[];for(const i of r){const u=Object.entries(i||{}),h=u.map(([d,y])=>`${d} ${y==="started"?"(started)":"(completed)"}`).join(" + ");n.push(h),u.every(([d,y])=>ee(t,d,y))&&(a=!0)}a||s.push(`Any of: ${n.join(" / ")}`)}const f=[...e?.items||[],...e?.itemsAll||[]];for(const a of f)se(t,a)||s.push(a);for(const a of e?.itemsAny||[]){if(!Array.isArray(a)||!a.length)continue;a.some(i=>se(t,i))||(a.length===1?s.push(a[0]):s.push(`Any of: ${a.join(" / ")}`))}for(const a of e?.rulesAll||[]){const n=X[a],i=te(a);if(!n){s.push(`${i} (rule missing)`);continue}try{await n(t)||s.push(i)}catch{s.push(`${i} (rule error)`)}}const l=e?.rulesAny||[];if(l.length){let a=!1;const n=[];for(const i of l){const u=X[i],h=te(i);if(!u){n.push(`${h} (rule missing)`);continue}try{await u(t)?a=!0:n.push(h)}catch{n.push(`${h} (rule error)`)}}a||s.push(`Any of: ${n.join(" / ")}`)}if(e?.untracked?.length)for(const a of e.untracked)s.push(`Untracked: ${a}`);return{met:s.length===0,missing:s}}function Le(){const e=m.items||[],t=new Map;for(const s of e){const o=re(s?.name);o&&(t.has(o)||t.set(o,[]),t.get(o).push(s.id))}return{items:e,player:m.player,obtained:m.obtained||[],rolled:m.rolled||[],obtainedSet:new Set(m.obtained||[]),rolledSet:new Set(m.rolled||[]),filters:m.filters,missing:{items:new Set},itemNameToIds:t}}function A(e){return e.length?e.join(", "):""}function Me(e){return`https://oldschool.runescape.wiki/w/Slayer_task/${encodeURIComponent(String(e||"").replace(/\s+/g,"_"))}`}function _(e,t){return e?`<span class="clue-step-info" tabindex="0" aria-label="${g(t)}" title="${g(e)}">i</span>`:""}function Re(e){return Me(e?.name)}function ne(e,t){return e?t?{statusKey:"reachable",statusLabel:"Assignable and reachable"}:{statusKey:"unreachable",statusLabel:"Unreachable"}:{statusKey:"unassignable",statusLabel:"Unassignable"}}async function Ce(){if(!m.player||!m.obtained||!m.rolled)return`
            <h1>Slayer masters</h1>
            <p>Please upload your files and player name on the Upload page first.</p>
        `;await m.ensureItemsLoaded();const t=await(await fetch("/data/slayer_masters.json")).json(),s=Array.isArray(t?.masters)?t.masters:[],o=new Map,r=s.map(c=>{const d=Se(c?.name)||"slayer-master",y=o.get(d)||0;o.set(d,y+1);const M=y?`${d}-${y+1}`:d;return{master:c,id:M}}),f=r.map(({master:c,id:d})=>`
        <a class="unlock-jump-link slayer-master-jump-link" href="#${g(d)}">${g(c.name)}</a>
    `).join(""),l=Le(),a=m.filters?.hideUnreachableSlayerMasters??!0,n=!!m.filters?.hideUnassignableSlayerTasks,i=!!m.filters?.ignoreSlayerMasterCombatLevel,u=!!m.filters?.overrideBarbarianFiremaking1ForWaterfiends,h=[];for(const{master:c,id:d}of r){const y=await L(c.reachRequirements||{},l),M=await L(c.assignmentRequirements||{},l);let q=0,O=0;const K=[];for(const p of c.monsters||[]){const ue=ae(p.assignmentRequirements||{},i),z=T(c.assignmentRequirements,ue),D=T(c.reachRequirements,p.reachRequirements),U=await L(z,l),R=await L(D,l),S=Array.isArray(p.locations)?p.locations:[],x=[];let N=0,I=0;for(const b of S){const ge=ae(b?.assignmentRequirements||{},i),pe=T(z,ge),be=T(D,b?.reachRequirements),P=await L(pe,l),j=await L(be,l),W=P.met,F=j.met;W&&(N+=1,F&&(I+=1));const w=[];W?!F&&j.missing.length&&w.push(`To reach here: ${A(j.missing)}.`):(P.missing.length&&w.push(`To be assigned here: ${A(P.missing)}.`),!F&&j.missing.length&&w.push(`To reach here: ${A(j.missing)}.`));const G=ne(W,F),Y=Array.isArray(b?.notes)?b.notes:[],Ae=Y.length?_(Y.join(`
`),`${p.name} ${b?.name||"location"} note`):"";x.push(`
                    <div class="slayer-location slayer-location--${G.statusKey}">
                        <div class="slayer-location-header">
                            <span class="slayer-location-name">${g(b?.name||"Location")}</span>
                            ${Ae}
                            <span class="slayer-location-status">${G.statusLabel}</span>
                        </div>
                        ${w.length?`<div class="slayer-location-missing">${w.map(ke=>`<div>${g(ke)}</div>`).join("")}</div>`:""}
                    </div>
                `)}const k=S.length>0?N>0:U.met,v=S.length>0?I>0:R.met,me=S.length>0?N:k?1:0,fe=S.length>0?I:k&&v?1:0;q+=me,O+=fe;const Q=ne(k,v),ye=`slayer-monster--${Q.statusKey}`;let B=Q.statusLabel;const $=[];k?!v&&R.missing.length&&$.push(`To reach: ${A(R.missing)}.`):(U.missing.length&&$.push(`To be assigned: ${A(U.missing)}.`),!v&&R.missing.length&&$.push(`To reach: ${A(R.missing)}.`)),S.length>0&&(k&&v?B=`Locations reachable: ${I}/${N}`:!k&&U.met?(B="No assignable locations",$.push("No locations are currently assignable.")):k&&!v&&(B="No reachable assignable locations",$.push("No assignable locations are currently reachable.")));const V=Array.isArray(p.notes)?p.notes:[],he=V.length?_(V.join(`
`),`${p.name} note`):"",de=x.length?`
                    <div class="slayer-location-list">
                        <div class="slayer-location-list-label">Locations</div>
                        ${x.join("")}
                    </div>
                `:"";K.push(`
                <article class="slayer-monster ${ye}">
                    <div class="slayer-monster-header">
                        <a class="slayer-monster-link" href="${g(Re(p))}" target="_blank" rel="noopener noreferrer">${g(p.name)}</a>
                        ${he}
                        <span class="slayer-monster-status">${B}</span>
                    </div>
                    ${$.length?`<div class="slayer-monster-missing">${$.map(b=>`<div>${g(b)}</div>`).join("")}</div>`:""}
                    ${de}
                </article>
            `)}const oe=q>0?(O/q*100).toFixed(1):"0.0",J=Array.isArray(c.notes)?c.notes:[],le=J.length?_(J.join(`
`),`${c.name} note`):"",C=[];y.met||C.push(`Master reach requirements: ${A(y.missing)}.`),M.met||C.push(`Master assignment requirements: ${A(M.missing)}.`);const ce=a&&!y.met?' style="display: none;"':"";h.push(`
            <section class="slayer-master card" id="${g(d)}" data-master-reachable="${y.met?"true":"false"}"${ce}>
                <header class="slayer-master-header">
                    <h2>
                        ${c.customUrl?`<a href="${g(c.customUrl)}" target="_blank" rel="noopener noreferrer">${g(c.name)}</a>`:g(c.name)}
                        ${le}
                    </h2>
                    <div class="slayer-master-metrics">
                        <span class="slayer-master-metric">Master reachable: ${y.met?"Yes":"No"}</span>
                        <span class="slayer-master-metric">Assignable reachable: ${oe}% (${O}/${q})</span>
                    </div>
                </header>
                ${C.length?`<div class="slayer-master-missing">${C.map(p=>`<div>${g(p)}</div>`).join("")}</div>`:""}
                <div class="slayer-monster-grid">
                    ${K.join("")}
                </div>
            </section>
        `)}return`
        <h1>Slayer masters</h1>
        <div class="slayer-master-filters">
            <label class="slayer-master-filter">
                <input type="checkbox" id="hideUnreachableSlayerMasters" ${a?"checked":""}>
                Hide unreachable slayer masters
            </label>
            <label class="slayer-master-filter">
                <input type="checkbox" id="hideUnassignableSlayerTasks" ${n?"checked":""}>
                Hide unassignable tasks
            </label>
            <label class="slayer-master-filter">
                <input type="checkbox" id="ignoreSlayerMasterCombatLevel" ${i?"checked":""}>
                Ignore combat level
            </label>
            <label class="slayer-master-filter">
                <input
                    type="checkbox"
                    id="overrideBarbarianFiremaking1ForWaterfiends"
                    ${u?"checked":""}
                >
                Barbarian firemaking 1 completed
            </label>
        </div>
        <nav class="unlock-jump slayer-master-jump" aria-label="Jump to slayer master">
            <div class="unlock-jump-label">Jump to slayer master</div>
            <div class="unlock-jump-list" id="slayerMasterJumpList">
                ${f}
            </div>
        </nav>
        <div class="slayer-master-list" id="slayerMasterList">
            ${h.join("")}
        </div>
    `}function ie(e){const t=m.filters?.hideUnreachableSlayerMasters??!0,s=!!m.filters?.hideUnassignableSlayerTasks,o=e.querySelectorAll(".slayer-master");for(const n of o){const i=n.dataset.masterReachable==="true",u=t&&!i;n.style.display=u?"none":""}const r=e.querySelectorAll(".slayer-monster");for(const n of r){const i=n.classList.contains("slayer-monster--unassignable");n.style.display=s&&i?"none":""}const f=e.querySelectorAll(".slayer-location");for(const n of f){const i=n.classList.contains("slayer-location--unassignable");n.style.display=s&&i?"none":""}const l=e.querySelectorAll(".slayer-location-list");for(const n of l){const i=n.querySelectorAll(".slayer-location"),u=Array.from(i).some(h=>h.style.display!=="none");n.style.display=u?"":"none"}const a=document.querySelectorAll(".slayer-master-jump-link");for(const n of a){const i=n.getAttribute("href")?.slice(1),h=(i?document.getElementById(i):null)?.dataset.masterReachable==="true",c=t&&!h;n.style.display=c?"none":""}}async function E(e,t={}){const s={...m.filters,...e};if(await m.setFilters(s),t.rerender){window.dispatchEvent(new PopStateEvent("popstate"));return}const o=document.getElementById("slayerMasterList");o&&ie(o)}let H=null;function Ue(){je();const e=document.getElementById("slayerMasterList");e&&ie(e);const t=document.querySelector(".slayer-master-jump"),s=r=>{const f=r.target.closest(".slayer-master-jump-link");if(!f)return;const l=f.getAttribute("href")?.slice(1);if(!l)return;const a=document.getElementById(l);a&&(r.preventDefault(),history.replaceState(null,"",`#${l}`),a.scrollIntoView({behavior:"smooth",block:"start"}))};t&&t.addEventListener("click",s);const o=async r=>{r.target.id==="hideUnreachableSlayerMasters"&&await E({hideUnreachableSlayerMasters:r.target.checked}),r.target.id==="ignoreSlayerMasterCombatLevel"&&await E({ignoreSlayerMasterCombatLevel:r.target.checked},{rerender:!0}),r.target.id==="hideUnassignableSlayerTasks"&&await E({hideUnassignableSlayerTasks:r.target.checked}),r.target.id==="overrideBarbarianFiremaking1ForWaterfiends"&&await E({overrideBarbarianFiremaking1ForWaterfiends:r.target.checked},{rerender:!0})};document.addEventListener("change",o),H=()=>{t&&t.removeEventListener("click",s),document.removeEventListener("change",o)}}function je(){typeof H=="function"&&H(),H=null}export{Ce as default,Ue as init,je as teardown};
