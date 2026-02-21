import{f as m,R as Y}from"./index-jj8kiPwb.js";const $e={canAssignWaterfiendsBarbarianFiremaking1:"Barbarian firemaking 1 completed",canReachWyrmsTask:"Any of: Granite boots / Boots of stone / Boots of brimstone, access to the Charred Dungeon, or can start Perilous Moons and reach Wyrmlings",canReachAbyssalSire:"Can reach Abyssal Sire area",canReachTrollheim:"Can reach Trollheim",hasUsableAxe:"Has a usable axe"};function y(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;")}function ne(e){return String(e||"").toLowerCase().replace(/[^a-z0-9]/g,"")}function ke(e){return String(e||"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")}function Se(e={}){const t=Number(e.Attack||1),s=Number(e.Strength||1),i=Number(e.Defence||1),n=Number(e.Hitpoints||10),f=Number(e.Prayer||1),l=Number(e.Ranged||1),a=Number(e.Magic||1),r=.25*(i+n+Math.floor(f/2)),c=.325*(t+s),h=.325*Math.floor(l*1.5),o=.325*Math.floor(a*1.5);return Math.floor(r+Math.max(c,h,o))}function X(e,t){return e==="Combat"?Se(t.player?.levels):Number(t.player?.levels?.[e]??1)}function Z(e,t,s){const i=e.player?.quests?.[t]??0;return s==="completed"?i===2:s==="started"?i>0:!1}function ee(e,t){const s=ne(t),i=e.itemNameToIds.get(s)||[];for(const n of i)if(e.rolledSet.has(n)&&e.obtainedSet.has(n))return!0;return!1}function se(e){return $e[e]||e}function F(...e){const t={skills:{},skillsAny:[],quests:{},questsAny:[],items:[],itemsAll:[],itemsAny:[],rulesAll:[],rulesAny:[],untracked:[]};for(const s of e)!s||typeof s!="object"||(Object.assign(t.skills,s.skills||{}),Array.isArray(s.skillsAny)&&t.skillsAny.push(...s.skillsAny),Object.assign(t.quests,s.quests||{}),Array.isArray(s.questsAny)&&t.questsAny.push(...s.questsAny),Array.isArray(s.items)&&t.items.push(...s.items),Array.isArray(s.itemsAll)&&t.itemsAll.push(...s.itemsAll),Array.isArray(s.itemsAny)&&t.itemsAny.push(...s.itemsAny),Array.isArray(s.rulesAll)&&t.rulesAll.push(...s.rulesAll),Array.isArray(s.rulesAny)&&t.rulesAny.push(...s.rulesAny),Array.isArray(s.untracked)&&t.untracked.push(...s.untracked));return t}function te(e,t){if(!t||!e||typeof e!="object")return e||{};const s={...e.skills||{}};for(const n of Object.keys(s))String(n).toLowerCase()==="combat"&&delete s[n];const i=(e.skillsAny||[]).map(n=>{const f={};for(const[l,a]of Object.entries(n||{}))String(l).toLowerCase()!=="combat"&&(f[l]=a);return f}).filter(n=>Object.keys(n).length>0);return{...e,skills:s,skillsAny:i}}async function M(e,t){const s=[];for(const[a,r]of Object.entries(e?.skills||{}))X(a,t)<r&&s.push(`${a} ${r}`);const i=e?.skillsAny||[];if(i.length){let a=!1;const r=[];for(const c of i){const h=Object.entries(c||{}),o=h.map(([u,g])=>`${u} ${g}`);r.push(o.join(" + ")),h.every(([u,g])=>X(u,t)>=g)&&(a=!0)}a||s.push(`Any of: ${r.join(" / ")}`)}for(const[a,r]of Object.entries(e?.quests||{}))if(!Z(t,a,r)){const c=r==="started"?"(started)":"(completed)";s.push(`${a} ${c}`)}const n=e?.questsAny||[];if(n.length){let a=!1;const r=[];for(const c of n){const h=Object.entries(c||{}),o=h.map(([u,g])=>`${u} ${g==="started"?"(started)":"(completed)"}`).join(" + ");r.push(o),h.every(([u,g])=>Z(t,u,g))&&(a=!0)}a||s.push(`Any of: ${r.join(" / ")}`)}const f=[...e?.items||[],...e?.itemsAll||[]];for(const a of f)ee(t,a)||s.push(a);for(const a of e?.itemsAny||[]){if(!Array.isArray(a)||!a.length)continue;a.some(c=>ee(t,c))||(a.length===1?s.push(a[0]):s.push(`Any of: ${a.join(" / ")}`))}for(const a of e?.rulesAll||[]){const r=Y[a],c=se(a);if(!r){s.push(`${c} (rule missing)`);continue}try{await r(t)||s.push(c)}catch{s.push(`${c} (rule error)`)}}const l=e?.rulesAny||[];if(l.length){let a=!1;const r=[];for(const c of l){const h=Y[c],o=se(c);if(!h){r.push(`${o} (rule missing)`);continue}try{await h(t)?a=!0:r.push(o)}catch{r.push(`${o} (rule error)`)}}a||s.push(`Any of: ${r.join(" / ")}`)}if(e?.untracked?.length)for(const a of e.untracked)s.push(`Untracked: ${a}`);return{met:s.length===0,missing:s}}function ve(){const e=m.items||[],t=new Map;for(const s of e){const i=ne(s?.name);i&&(t.has(i)||t.set(i,[]),t.get(i).push(s.id))}return{items:e,player:m.player,obtained:m.obtained||[],rolled:m.rolled||[],obtainedSet:new Set(m.obtained||[]),rolledSet:new Set(m.rolled||[]),filters:m.filters,missing:{items:new Set},itemNameToIds:t}}function A(e){return e.length?e.join(", "):""}function Me(e){return`https://oldschool.runescape.wiki/w/Slayer_task/${encodeURIComponent(String(e||"").replace(/\s+/g,"_"))}`}function W(e,t){return e?`<span class="clue-step-info" tabindex="0" aria-label="${y(t)}" title="${y(e)}">i</span>`:""}function Le(e){return Me(e?.name)}function ae(e,t){return e?t?{statusKey:"reachable",statusLabel:"Assignable and reachable"}:{statusKey:"unreachable",statusLabel:"Unreachable"}:{statusKey:"unassignable",statusLabel:"Unassignable"}}async function Ce(){if(!m.player||!m.obtained||!m.rolled)return`
            <h1>Slayer masters</h1>
            <p>Please upload your files and player name on the Upload page first.</p>
        `;await m.ensureItemsLoaded();const t=await(await fetch("/data/slayer_masters.json")).json(),s=Array.isArray(t?.masters)?t.masters:[],i=new Map,n=s.map(o=>{const d=ke(o?.name)||"slayer-master",u=i.get(d)||0;i.set(d,u+1);const g=u?`${d}-${u+1}`:d;return{master:o,id:g}}),f=n.map(({master:o,id:d})=>`
        <a class="unlock-jump-link slayer-master-jump-link" href="#${y(d)}">${y(o.name)}</a>
    `).join(""),l=ve(),a=m.filters?.hideUnreachableSlayerMasters??!0,r=!!m.filters?.ignoreSlayerMasterCombatLevel,c=!!m.filters?.overrideBarbarianFiremaking1ForWaterfiends,h=[];for(const{master:o,id:d}of n){const u=await M(o.reachRequirements||{},l),g=await M(o.assignmentRequirements||{},l);let L=0,T=0;const x=[];for(const p of o.monsters||[]){const ce=te(p.assignmentRequirements||{},r),J=F(o.assignmentRequirements,ce),z=F(o.reachRequirements,p.reachRequirements),q=await M(J,l),R=await M(z,l),S=Array.isArray(p.locations)?p.locations:[],H=[];let N=0,I=0;for(const b of S){const de=te(b?.assignmentRequirements||{},r),ge=F(J,de),pe=F(z,b?.reachRequirements),O=await M(ge,l),j=await M(pe,l),P=O.met,B=j.met;P&&(N+=1,B&&(I+=1));const w=[];P?!B&&j.missing.length&&w.push(`To reach here: ${A(j.missing)}.`):(O.missing.length&&w.push(`To be assigned here: ${A(O.missing)}.`),!B&&j.missing.length&&w.push(`To reach here: ${A(j.missing)}.`));const G=ae(P,B),V=Array.isArray(b?.notes)?b.notes:[],be=V.length?W(V.join(`
`),`${p.name} ${b?.name||"location"} note`):"";H.push(`
                    <div class="slayer-location slayer-location--${G.statusKey}">
                        <div class="slayer-location-header">
                            <span class="slayer-location-name">${y(b?.name||"Location")}</span>
                            ${be}
                            <span class="slayer-location-status">${G.statusLabel}</span>
                        </div>
                        ${w.length?`<div class="slayer-location-missing">${w.map(Ae=>`<div>${y(Ae)}</div>`).join("")}</div>`:""}
                    </div>
                `)}const $=S.length>0?N>0:q.met,v=S.length>0?I>0:R.met,ue=S.length>0?N:$?1:0,me=S.length>0?I:$&&v?1:0;L+=ue,T+=me;const D=ae($,v),fe=`slayer-monster--${D.statusKey}`;let U=D.statusLabel;const k=[];$?!v&&R.missing.length&&k.push(`To reach: ${A(R.missing)}.`):(q.missing.length&&k.push(`To be assigned: ${A(q.missing)}.`),!v&&R.missing.length&&k.push(`To reach: ${A(R.missing)}.`)),S.length>0&&($&&v?U=`Locations reachable: ${I}/${N}`:!$&&q.met?(U="No assignable locations",k.push("No locations are currently assignable.")):$&&!v&&(U="No reachable assignable locations",k.push("No assignable locations are currently reachable.")));const Q=Array.isArray(p.notes)?p.notes:[],he=Q.length?W(Q.join(`
`),`${p.name} note`):"",ye=H.length?`
                    <div class="slayer-location-list">
                        <div class="slayer-location-list-label">Locations</div>
                        ${H.join("")}
                    </div>
                `:"";x.push(`
                <article class="slayer-monster ${fe}">
                    <div class="slayer-monster-header">
                        <a class="slayer-monster-link" href="${y(Le(p))}" target="_blank" rel="noopener noreferrer">${y(p.name)}</a>
                        ${he}
                        <span class="slayer-monster-status">${U}</span>
                    </div>
                    ${k.length?`<div class="slayer-monster-missing">${k.map(b=>`<div>${y(b)}</div>`).join("")}</div>`:""}
                    ${ye}
                </article>
            `)}const ie=L>0?(T/L*100).toFixed(1):"0.0",K=Array.isArray(o.notes)?o.notes:[],oe=K.length?W(K.join(`
`),`${o.name} note`):"",C=[];u.met||C.push(`Master reach requirements: ${A(u.missing)}.`),g.met||C.push(`Master assignment requirements: ${A(g.missing)}.`);const le=a&&!u.met?' style="display: none;"':"";h.push(`
            <section class="slayer-master card" id="${y(d)}" data-master-reachable="${u.met?"true":"false"}"${le}>
                <header class="slayer-master-header">
                    <h2>
                        ${o.customUrl?`<a href="${y(o.customUrl)}" target="_blank" rel="noopener noreferrer">${y(o.name)}</a>`:y(o.name)}
                        ${oe}
                    </h2>
                    <div class="slayer-master-metrics">
                        <span class="slayer-master-metric">Master reachable: ${u.met?"Yes":"No"}</span>
                        <span class="slayer-master-metric">Assignable reachable: ${ie}% (${T}/${L})</span>
                    </div>
                </header>
                ${C.length?`<div class="slayer-master-missing">${C.map(p=>`<div>${y(p)}</div>`).join("")}</div>`:""}
                <div class="slayer-monster-grid">
                    ${x.join("")}
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
                <input type="checkbox" id="ignoreSlayerMasterCombatLevel" ${r?"checked":""}>
                Ignore combat level
            </label>
            <label class="slayer-master-filter">
                <input
                    type="checkbox"
                    id="overrideBarbarianFiremaking1ForWaterfiends"
                    ${c?"checked":""}
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
    `}function re(e){const t=m.filters?.hideUnreachableSlayerMasters??!0,s=e.querySelectorAll(".slayer-master");for(const n of s){const f=n.dataset.masterReachable==="true",l=t&&!f;n.style.display=l?"none":""}const i=document.querySelectorAll(".slayer-master-jump-link");for(const n of i){const f=n.getAttribute("href")?.slice(1),a=(f?document.getElementById(f):null)?.dataset.masterReachable==="true",r=t&&!a;n.style.display=r?"none":""}}async function _(e,t={}){const s={...m.filters,...e};if(await m.setFilters(s),t.rerender){window.dispatchEvent(new PopStateEvent("popstate"));return}const i=document.getElementById("slayerMasterList");i&&re(i)}let E=null;function qe(){Re();const e=document.getElementById("slayerMasterList");e&&re(e);const t=document.querySelector(".slayer-master-jump"),s=n=>{const f=n.target.closest(".slayer-master-jump-link");if(!f)return;const l=f.getAttribute("href")?.slice(1);if(!l)return;const a=document.getElementById(l);a&&(n.preventDefault(),history.replaceState(null,"",`#${l}`),a.scrollIntoView({behavior:"smooth",block:"start"}))};t&&t.addEventListener("click",s);const i=async n=>{n.target.id==="hideUnreachableSlayerMasters"&&await _({hideUnreachableSlayerMasters:n.target.checked}),n.target.id==="ignoreSlayerMasterCombatLevel"&&await _({ignoreSlayerMasterCombatLevel:n.target.checked},{rerender:!0}),n.target.id==="overrideBarbarianFiremaking1ForWaterfiends"&&await _({overrideBarbarianFiremaking1ForWaterfiends:n.target.checked},{rerender:!0})};document.addEventListener("change",i),E=()=>{t&&t.removeEventListener("click",s),document.removeEventListener("change",i)}}function Re(){typeof E=="function"&&E(),E=null}export{Ce as default,qe as init,Re as teardown};
