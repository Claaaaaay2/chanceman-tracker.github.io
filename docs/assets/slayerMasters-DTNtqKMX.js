import{f as m,R as X}from"./index-BJviACmJ.js";const $e={canAssignWaterfiendsBarbarianFiremaking1:"Barbarian firemaking 1 completed",canReachWyrmsTask:"Any of: Granite boots / Boots of stone / Boots of brimstone, access to the Charred Dungeon, or can start Perilous Moons and reach Wyrmlings",canReachAbyssalSire:"Can reach Abyssal Sire area",canReachTrollheim:"Can reach Trollheim",hasUsableAxe:"Has a usable axe"};function d(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;")}function re(e){return String(e||"").toLowerCase().replace(/[^a-z0-9]/g,"")}function Se(e){return String(e||"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")}function ve(e={}){const t=Number(e.Attack||1),s=Number(e.Strength||1),i=Number(e.Defence||1),o=Number(e.Hitpoints||10),g=Number(e.Prayer||1),c=Number(e.Ranged||1),a=Number(e.Magic||1),n=.25*(i+o+Math.floor(g/2)),r=.325*(t+s),u=.325*Math.floor(c*1.5),f=.325*Math.floor(a*1.5);return Math.floor(n+Math.max(r,u,f))}function Z(e,t){return e==="Combat"?ve(t.player?.levels):Number(t.player?.levels?.[e]??1)}function ee(e,t,s){const i=e.player?.quests?.[t]??0;return s==="completed"?i===2:s==="started"?i>0:!1}function se(e,t){const s=re(t),i=e.itemNameToIds.get(s)||[];for(const o of i)if(e.rolledSet.has(o)&&e.obtainedSet.has(o))return!0;return!1}function te(e){return $e[e]||e}function F(...e){const t={skills:{},skillsAny:[],quests:{},questsAny:[],items:[],itemsAll:[],itemsAny:[],rulesAll:[],rulesAny:[],untracked:[]};for(const s of e)!s||typeof s!="object"||(Object.assign(t.skills,s.skills||{}),Array.isArray(s.skillsAny)&&t.skillsAny.push(...s.skillsAny),Object.assign(t.quests,s.quests||{}),Array.isArray(s.questsAny)&&t.questsAny.push(...s.questsAny),Array.isArray(s.items)&&t.items.push(...s.items),Array.isArray(s.itemsAll)&&t.itemsAll.push(...s.itemsAll),Array.isArray(s.itemsAny)&&t.itemsAny.push(...s.itemsAny),Array.isArray(s.rulesAll)&&t.rulesAll.push(...s.rulesAll),Array.isArray(s.rulesAny)&&t.rulesAny.push(...s.rulesAny),Array.isArray(s.untracked)&&t.untracked.push(...s.untracked));return t}function ae(e,t){if(!t||!e||typeof e!="object")return e||{};const s={...e.skills||{}};for(const o of Object.keys(s))String(o).toLowerCase()==="combat"&&delete s[o];const i=(e.skillsAny||[]).map(o=>{const g={};for(const[c,a]of Object.entries(o||{}))String(c).toLowerCase()!=="combat"&&(g[c]=a);return g}).filter(o=>Object.keys(o).length>0);return{...e,skills:s,skillsAny:i}}async function L(e,t){const s=[];for(const[a,n]of Object.entries(e?.skills||{}))Z(a,t)<n&&s.push(`${a} ${n}`);const i=e?.skillsAny||[];if(i.length){let a=!1;const n=[];for(const r of i){const u=Object.entries(r||{}),f=u.map(([h,y])=>`${h} ${y}`);n.push(f.join(" + ")),u.every(([h,y])=>Z(h,t)>=y)&&(a=!0)}a||s.push(`Any of: ${n.join(" / ")}`)}for(const[a,n]of Object.entries(e?.quests||{}))if(!ee(t,a,n)){const r=n==="started"?"(started)":"(completed)";s.push(`${a} ${r}`)}const o=e?.questsAny||[];if(o.length){let a=!1;const n=[];for(const r of o){const u=Object.entries(r||{}),f=u.map(([h,y])=>`${h} ${y==="started"?"(started)":"(completed)"}`).join(" + ");n.push(f),u.every(([h,y])=>ee(t,h,y))&&(a=!0)}a||s.push(`Any of: ${n.join(" / ")}`)}const g=[...e?.items||[],...e?.itemsAll||[]];for(const a of g)se(t,a)||s.push(a);for(const a of e?.itemsAny||[]){if(!Array.isArray(a)||!a.length)continue;a.some(r=>se(t,r))||(a.length===1?s.push(a[0]):s.push(`Any of: ${a.join(" / ")}`))}for(const a of e?.rulesAll||[]){const n=X[a],r=te(a);if(!n){s.push(`${r} (rule missing)`);continue}try{await n(t)||s.push(r)}catch{s.push(`${r} (rule error)`)}}const c=e?.rulesAny||[];if(c.length){let a=!1;const n=[];for(const r of c){const u=X[r],f=te(r);if(!u){n.push(`${f} (rule missing)`);continue}try{await u(t)?a=!0:n.push(f)}catch{n.push(`${f} (rule error)`)}}a||s.push(`Any of: ${n.join(" / ")}`)}if(e?.untracked?.length)for(const a of e.untracked)s.push(`Untracked: ${a}`);return{met:s.length===0,missing:s}}function Le(){const e=m.items||[],t=new Map;for(const s of e){const i=re(s?.name);i&&(t.has(i)||t.set(i,[]),t.get(i).push(s.id))}return{items:e,player:m.player,obtained:m.obtained||[],rolled:m.rolled||[],obtainedSet:new Set(m.obtained||[]),rolledSet:new Set(m.rolled||[]),filters:m.filters,missing:{items:new Set},itemNameToIds:t}}function A(e){return e.length?e.join(", "):""}function Me(e){return`https://oldschool.runescape.wiki/w/Slayer_task/${encodeURIComponent(String(e||"").replace(/\s+/g,"_"))}`}function _(e,t){return e?`<span class="clue-step-info" tabindex="0" aria-label="${d(t)}" title="${d(e)}">i</span>`:""}function Re(e){return Me(e?.name)}function ne(e,t){return e?t?{statusKey:"reachable",statusLabel:"Assignable and reachable"}:{statusKey:"unreachable",statusLabel:"Unreachable"}:{statusKey:"unassignable",statusLabel:"Unassignable"}}async function Ce(){if(!m.player||!m.obtained||!m.rolled)return`
            <h1>Slayer masters</h1>
            <p>Please upload your files and player name on the Upload page first.</p>
        `;await m.ensureItemsLoaded();const t=await(await fetch("/data/slayer_masters.json")).json(),s=Array.isArray(t?.masters)?t.masters:[],i=new Map,o=s.map(l=>{const h=Se(l?.name)||"slayer-master",y=i.get(h)||0;i.set(h,y+1);const M=y?`${h}-${y+1}`:h;return{master:l,id:M}}),g=o.map(({master:l,id:h})=>`
        <a class="unlock-jump-link slayer-master-jump-link" href="#${d(h)}">${d(l.name)}</a>
    `).join(""),c=Le(),a=m.filters?.hideUnreachableSlayerMasters??!0,n=!!m.filters?.hideUnassignableSlayerTasks,r=!!m.filters?.ignoreSlayerMasterCombatLevel,u=!!m.filters?.overrideBarbarianFiremaking1ForWaterfiends,f=[];for(const{master:l,id:h}of o){const y=await L(l.reachRequirements||{},c),M=await L(l.assignmentRequirements||{},c);let q=0,O=0;const K=[];for(const p of l.monsters||[]){const ue=ae(p.assignmentRequirements||{},r),z=F(l.assignmentRequirements,ue),D=F(l.reachRequirements,p.reachRequirements),U=await L(z,c),R=await L(D,c),S=Array.isArray(p.locations)?p.locations:[],x=[];let N=0,I=0;for(const b of S){const ge=ae(b?.assignmentRequirements||{},r),pe=F(z,ge),be=F(D,b?.reachRequirements),P=await L(pe,c),j=await L(be,c),W=P.met,T=j.met;W&&(N+=1,T&&(I+=1));const w=[];W?!T&&j.missing.length&&w.push(`To reach here: ${A(j.missing)}.`):(P.missing.length&&w.push(`To be assigned here: ${A(P.missing)}.`),!T&&j.missing.length&&w.push(`To reach here: ${A(j.missing)}.`));const G=ne(W,T),Y=Array.isArray(b?.notes)?b.notes:[],Ae=Y.length?_(Y.join(`
`),`${p.name} ${b?.name||"location"} note`):"";x.push(`
                    <div class="slayer-location slayer-location--${G.statusKey}">
                        <div class="slayer-location-header">
                            <span class="slayer-location-name">${d(b?.name||"Location")}</span>
                            ${Ae}
                            <span class="slayer-location-status">${G.statusLabel}</span>
                        </div>
                        ${w.length?`<div class="slayer-location-missing">${w.map(ke=>`<div>${d(ke)}</div>`).join("")}</div>`:""}
                    </div>
                `)}const k=S.length>0?N>0:U.met,v=S.length>0?I>0:R.met,me=S.length>0?N:k?1:0,ye=S.length>0?I:k&&v?1:0;q+=me,O+=ye;const Q=ne(k,v),fe=`slayer-monster--${Q.statusKey}`;let B=Q.statusLabel;const $=[];k?!v&&R.missing.length&&$.push(`To reach: ${A(R.missing)}.`):(U.missing.length&&$.push(`To be assigned: ${A(U.missing)}.`),!v&&R.missing.length&&$.push(`To reach: ${A(R.missing)}.`)),S.length>0&&(k&&v?B=`Locations reachable: ${I}/${N}`:!k&&U.met?(B="No assignable locations",$.push("No locations are currently assignable.")):k&&!v&&(B="No reachable assignable locations",$.push("No assignable locations are currently reachable.")));const V=Array.isArray(p.notes)?p.notes:[],he=V.length?_(V.join(`
`),`${p.name} note`):"",de=x.length?`
                    <div class="slayer-location-list">
                        <div class="slayer-location-list-label">Locations</div>
                        ${x.join("")}
                    </div>
                `:"";K.push(`
                <article class="slayer-monster ${fe}">
                    <div class="slayer-monster-header">
                        <a class="slayer-monster-link" href="${d(Re(p))}" target="_blank" rel="noopener noreferrer">${d(p.name)}</a>
                        ${he}
                        <span class="slayer-monster-status">${B}</span>
                    </div>
                    ${$.length?`<div class="slayer-monster-missing">${$.map(b=>`<div>${d(b)}</div>`).join("")}</div>`:""}
                    ${de}
                </article>
            `)}const ie=q>0?(O/q*100).toFixed(1):"0.0",J=Array.isArray(l.notes)?l.notes:[],le=J.length?_(J.join(`
`),`${l.name} note`):"",C=[];y.met||C.push(`Master reach requirements: ${A(y.missing)}.`),M.met||C.push(`Master assignment requirements: ${A(M.missing)}.`);const ce=a&&!y.met?' style="display: none;"':"";f.push(`
            <section class="slayer-master card" id="${d(h)}" data-master-reachable="${y.met?"true":"false"}"${ce}>
                <header class="slayer-master-header">
                    <h2>
                        ${l.customUrl?`<a href="${d(l.customUrl)}" target="_blank" rel="noopener noreferrer">${d(l.name)}</a>`:d(l.name)}
                        ${le}
                    </h2>
                    <div class="slayer-master-metrics">
                        <span class="slayer-master-metric">Master reachable: ${y.met?"Yes":"No"}</span>
                        <span class="slayer-master-metric">Assignable reachable: ${ie}% (${O}/${q})</span>
                    </div>
                </header>
                ${C.length?`<div class="slayer-master-missing">${C.map(p=>`<div>${d(p)}</div>`).join("")}</div>`:""}
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
                <input type="checkbox" id="ignoreSlayerMasterCombatLevel" ${r?"checked":""}>
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
                ${g}
            </div>
        </nav>
        <div class="slayer-master-list" id="slayerMasterList">
            ${f.join("")}
        </div>
    `}function oe(e){const t=m.filters?.hideUnreachableSlayerMasters??!0,s=!!m.filters?.hideUnassignableSlayerTasks,i=e.querySelectorAll(".slayer-master");for(const n of i){const r=n.dataset.masterReachable==="true",u=t&&!r;n.style.display=u?"none":""}const o=e.querySelectorAll(".slayer-monster");for(const n of o){const r=n.classList.contains("slayer-monster--unassignable");n.style.display=s&&r?"none":""}const g=e.querySelectorAll(".slayer-location");for(const n of g){const r=n.classList.contains("slayer-location--unassignable");n.style.display=s&&r?"none":""}const c=e.querySelectorAll(".slayer-location-list");for(const n of c){const r=n.querySelectorAll(".slayer-location"),u=Array.from(r).some(f=>f.style.display!=="none");n.style.display=u?"":"none"}const a=document.querySelectorAll(".slayer-master-jump-link");for(const n of a){const r=n.getAttribute("href")?.slice(1),f=(r?document.getElementById(r):null)?.dataset.masterReachable==="true",l=t&&!f;n.style.display=l?"none":""}}async function E(e,t={}){const s={...m.filters,...e};if(await m.setFilters(s),t.rerender){window.dispatchEvent(new PopStateEvent("popstate"));return}const i=document.getElementById("slayerMasterList");i&&oe(i)}let H=null;function Ue(){je();const e=document.getElementById("slayerMasterList");e&&oe(e);const t=document.querySelector(".slayer-master-jump"),s=o=>{const g=o.target.closest(".slayer-master-jump-link");if(!g)return;const c=g.getAttribute("href")?.slice(1);if(!c)return;const a=document.getElementById(c);a&&(o.preventDefault(),history.replaceState(null,"",`#${c}`),a.scrollIntoView({behavior:"smooth",block:"start"}))};t&&t.addEventListener("click",s);const i=async o=>{o.target.id==="hideUnreachableSlayerMasters"&&await E({hideUnreachableSlayerMasters:o.target.checked}),o.target.id==="ignoreSlayerMasterCombatLevel"&&await E({ignoreSlayerMasterCombatLevel:o.target.checked},{rerender:!0}),o.target.id==="hideUnassignableSlayerTasks"&&await E({hideUnassignableSlayerTasks:o.target.checked}),o.target.id==="overrideBarbarianFiremaking1ForWaterfiends"&&await E({overrideBarbarianFiremaking1ForWaterfiends:o.target.checked},{rerender:!0})};document.addEventListener("change",i),H=()=>{t&&t.removeEventListener("click",s),document.removeEventListener("change",i)}}function je(){typeof H=="function"&&H(),H=null}export{Ce as default,Ue as init,je as teardown};
