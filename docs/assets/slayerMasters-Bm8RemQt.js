import{f as u,R as Z}from"./index-DmLeSzun.js";const Le={canAssignWaterfiendsBarbarianFiremaking1:"Barbarian firemaking 1 completed",hasAntiDragonShieldForDragonSlayerTasks:"Obtained Anti-dragon shield",canReachWyrmsTask:"Any of: Granite boots / Boots of stone / Boots of brimstone, access to the Charred Dungeon, or can start Perilous Moons and reach Wyrmlings",canReachAbyssalSire:"Can reach Abyssal Sire area",canReachTrollheim:"Can reach Trollheim",hasUsableAxe:"Has a usable axe"};function h(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;")}function ie(e){return String(e||"").toLowerCase().replace(/[^a-z0-9]/g,"")}function ve(e){return String(e||"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")}function Me(e={}){const t=Number(e.Attack||1),s=Number(e.Strength||1),o=Number(e.Defence||1),r=Number(e.Hitpoints||10),f=Number(e.Prayer||1),c=Number(e.Ranged||1),a=Number(e.Magic||1),n=.25*(o+r+Math.floor(f/2)),i=.325*(t+s),m=.325*Math.floor(c*1.5),d=.325*Math.floor(a*1.5);return Math.floor(n+Math.max(i,m,d))}function ee(e,t){return e==="Combat"?Me(t.player?.levels):Number(t.player?.levels?.[e]??1)}function se(e,t,s){const o=e.player?.quests?.[t]??0;return s==="completed"?o===2:s==="started"?o>0:!1}function te(e,t){const s=ie(t),o=e.itemNameToIds.get(s)||[];for(const r of o)if(e.rolledSet.has(r)&&e.obtainedSet.has(r))return!0;return!1}function ae(e){return Le[e]||e}function D(...e){const t={skills:{},skillsAny:[],quests:{},questsAny:[],items:[],itemsAll:[],itemsAny:[],rulesAll:[],rulesAny:[],untracked:[]};for(const s of e)if(!(!s||typeof s!="object")){for(const[o,r]of Object.entries(s.skills||{})){const f=Number(r);if(!Number.isFinite(f)){t.skills[o]=r;continue}const c=Number(t.skills[o]);(!Number.isFinite(c)||f>c)&&(t.skills[o]=f)}Array.isArray(s.skillsAny)&&t.skillsAny.push(...s.skillsAny),Object.assign(t.quests,s.quests||{}),Array.isArray(s.questsAny)&&t.questsAny.push(...s.questsAny),Array.isArray(s.items)&&t.items.push(...s.items),Array.isArray(s.itemsAll)&&t.itemsAll.push(...s.itemsAll),Array.isArray(s.itemsAny)&&t.itemsAny.push(...s.itemsAny),Array.isArray(s.rulesAll)&&t.rulesAll.push(...s.rulesAll),Array.isArray(s.rulesAny)&&t.rulesAny.push(...s.rulesAny),Array.isArray(s.untracked)&&t.untracked.push(...s.untracked)}return t}function ne(e,t){if(!t||!e||typeof e!="object")return e||{};const s={...e.skills||{}};for(const r of Object.keys(s))String(r).toLowerCase()==="combat"&&delete s[r];const o=(e.skillsAny||[]).map(r=>{const f={};for(const[c,a]of Object.entries(r||{}))String(c).toLowerCase()!=="combat"&&(f[c]=a);return f}).filter(r=>Object.keys(r).length>0);return{...e,skills:s,skillsAny:o}}async function M(e,t){const s=[];for(const[a,n]of Object.entries(e?.skills||{}))ee(a,t)<n&&s.push(`${a} ${n}`);const o=e?.skillsAny||[];if(o.length){let a=!1;const n=[];for(const i of o){const m=Object.entries(i||{}),d=m.map(([l,y])=>`${l} ${y}`);n.push(d.join(" + ")),m.every(([l,y])=>ee(l,t)>=y)&&(a=!0)}a||s.push(`Any of: ${n.join(" / ")}`)}for(const[a,n]of Object.entries(e?.quests||{}))if(!se(t,a,n)){const i=n==="started"?"(started)":"(completed)";s.push(`${a} ${i}`)}const r=e?.questsAny||[];if(r.length){let a=!1;const n=[];for(const i of r){const m=Object.entries(i||{}),d=m.map(([l,y])=>`${l} ${y==="started"?"(started)":"(completed)"}`).join(" + ");n.push(d),m.every(([l,y])=>se(t,l,y))&&(a=!0)}a||s.push(`Any of: ${n.join(" / ")}`)}const f=[...e?.items||[],...e?.itemsAll||[]];for(const a of f)te(t,a)||s.push(a);for(const a of e?.itemsAny||[]){if(!Array.isArray(a)||!a.length)continue;a.some(i=>te(t,i))||(a.length===1?s.push(a[0]):s.push(`Any of: ${a.join(" / ")}`))}for(const a of e?.rulesAll||[]){const n=Z[a],i=ae(a);if(!n){s.push(`${i} (rule missing)`);continue}try{await n(t)||s.push(i)}catch{s.push(`${i} (rule error)`)}}const c=e?.rulesAny||[];if(c.length){let a=!1;const n=[];for(const i of c){const m=Z[i],d=ae(i);if(!m){n.push(`${d} (rule missing)`);continue}try{await m(t)?a=!0:n.push(d)}catch{n.push(`${d} (rule error)`)}}a||s.push(`Any of: ${n.join(" / ")}`)}if(e?.untracked?.length)for(const a of e.untracked)s.push(`Untracked: ${a}`);return{met:s.length===0,missing:s}}function Re(){const e=u.items||[],t=new Map;for(const s of e){const o=ie(s?.name);o&&(t.has(o)||t.set(o,[]),t.get(o).push(s.id))}return{items:e,player:u.player,obtained:u.obtained||[],rolled:u.rolled||[],obtainedSet:new Set(u.obtained||[]),rolledSet:new Set(u.rolled||[]),filters:u.filters,missing:{items:new Set},itemNameToIds:t}}function k(e){return e.length?e.join(", "):""}function je(e){return`https://oldschool.runescape.wiki/w/Slayer_task/${encodeURIComponent(String(e||"").replace(/\s+/g,"_"))}`}function _(e,t){return e?`<span class="clue-step-info" tabindex="0" aria-label="${h(t)}" title="${h(e)}">i</span>`:""}function we(e){return je(e?.name)}function qe(e){return/\bdragons?\b/i.test(String(e||""))}function re(e,t){return e?t?{statusKey:"reachable",statusLabel:"Assignable and reachable"}:{statusKey:"unreachable",statusLabel:"Unreachable"}:{statusKey:"unassignable",statusLabel:"Unassignable"}}async function Fe(){if(!u.player||!u.obtained||!u.rolled)return`
            <h1>Slayer masters</h1>
            <p>Please upload your files and player name on the Upload page first.</p>
        `;await u.ensureItemsLoaded();const t=await(await fetch("/data/slayer_masters.json")).json(),s=Array.isArray(t?.masters)?t.masters:[],o=new Map,r=s.map(l=>{const y=ve(l?.name)||"slayer-master",p=o.get(y)||0;o.set(y,p+1);const C=p?`${y}-${p+1}`:y;return{master:l,id:C}}),f=r.map(({master:l,id:y})=>`
        <a class="unlock-jump-link slayer-master-jump-link" href="#${h(y)}">${h(l.name)}</a>
    `).join(""),c=Re(),a=u.filters?.hideUnreachableSlayerMasters??!0,n=!!u.filters?.hideUnassignableSlayerTasks,i=!!u.filters?.ignoreSlayerMasterCombatLevel,m=!!u.filters?.overrideBarbarianFiremaking1ForWaterfiends,d=!!u.filters?.hasAntiDragonShield,b=[];for(const{master:l,id:y}of r){const p=await M(l.reachRequirements||{},c),C=await M(l.assignmentRequirements||{},c);let U=0,O=0;const K=[];for(const g of l.monsters||[]){const me=ne(g.assignmentRequirements||{},i),fe=qe(g.name)?{rulesAll:["hasAntiDragonShieldForDragonSlayerTasks"]}:null,z=D(l.assignmentRequirements,me,fe),Q=D(l.reachRequirements,g.reachRequirements),F=await M(z,c),R=await M(Q,c),L=Array.isArray(g.locations)?g.locations:[],x=[];let B=0,I=0;for(const A of L){const be=ne(A?.assignmentRequirements||{},i),Ae=D(z,be),ke=D(Q,A?.reachRequirements),P=await M(Ae,c),j=await M(ke,c),W=P.met,E=j.met;W&&(B+=1,E&&(I+=1));const w=[];W?!E&&j.missing.length&&w.push(`To reach here: ${k(j.missing)}.`):(P.missing.length&&w.push(`To be assigned here: ${k(P.missing)}.`),!E&&j.missing.length&&w.push(`To reach here: ${k(j.missing)}.`));const Y=re(W,E),X=Array.isArray(A?.notes)?A.notes:[],Se=X.length?_(X.join(`
`),`${g.name} ${A?.name||"location"} note`):"";x.push(`
                    <div class="slayer-location slayer-location--${Y.statusKey}">
                        <div class="slayer-location-header">
                            <span class="slayer-location-name">${h(A?.name||"Location")}</span>
                            ${Se}
                            <span class="slayer-location-status">${Y.statusLabel}</span>
                        </div>
                        ${w.length?`<div class="slayer-location-missing">${w.map($e=>`<div>${h($e)}</div>`).join("")}</div>`:""}
                    </div>
                `)}const S=L.length>0?B>0:F.met,v=L.length>0?I>0:R.met,ye=L.length>0?B:S?1:0,de=L.length>0?I:S&&v?1:0;U+=ye,O+=de;const V=re(S,v),he=`slayer-monster--${V.statusKey}`;let T=V.statusLabel;const $=[];S?!v&&R.missing.length&&$.push(`To reach: ${k(R.missing)}.`):(F.missing.length&&$.push(`To be assigned: ${k(F.missing)}.`),!v&&R.missing.length&&$.push(`To reach: ${k(R.missing)}.`)),L.length>0&&(S&&v?T=`Locations reachable: ${I}/${B}`:!S&&F.met?(T="No assignable locations",$.push("No locations are currently assignable.")):S&&!v&&(T="No reachable assignable locations",$.push("No assignable locations are currently reachable.")));const G=Array.isArray(g.notes)?g.notes:[],ge=G.length?_(G.join(`
`),`${g.name} note`):"",pe=x.length?`
                    <div class="slayer-location-list">
                        <div class="slayer-location-list-label">Locations</div>
                        ${x.join("")}
                    </div>
                `:"";K.push(`
                <article class="slayer-monster ${he}">
                    <div class="slayer-monster-header">
                        <a class="slayer-monster-link" href="${h(we(g))}" target="_blank" rel="noopener noreferrer">${h(g.name)}</a>
                        ${ge}
                        <span class="slayer-monster-status">${T}</span>
                    </div>
                    ${$.length?`<div class="slayer-monster-missing">${$.map(A=>`<div>${h(A)}</div>`).join("")}</div>`:""}
                    ${pe}
                </article>
            `)}const le=U>0?(O/U*100).toFixed(1):"0.0",J=Array.isArray(l.notes)?l.notes:[],ce=J.length?_(J.join(`
`),`${l.name} note`):"",N=[];p.met||N.push(`Master reach requirements: ${k(p.missing)}.`),C.met||N.push(`Master assignment requirements: ${k(C.missing)}.`);const ue=a&&!p.met?' style="display: none;"':"";b.push(`
            <section class="slayer-master card" id="${h(y)}" data-master-reachable="${p.met?"true":"false"}"${ue}>
                <header class="slayer-master-header">
                    <h2>
                        ${l.customUrl?`<a href="${h(l.customUrl)}" target="_blank" rel="noopener noreferrer">${h(l.name)}</a>`:h(l.name)}
                        ${ce}
                    </h2>
                    <div class="slayer-master-metrics">
                        <span class="slayer-master-metric">Master reachable: ${p.met?"Yes":"No"}</span>
                        <span class="slayer-master-metric">Assignable reachable: ${le}% (${O}/${U})</span>
                    </div>
                </header>
                ${N.length?`<div class="slayer-master-missing">${N.map(g=>`<div>${h(g)}</div>`).join("")}</div>`:""}
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
                    ${m?"checked":""}
                >
                Barbarian firemaking 1 completed
            </label>
            <label class="slayer-master-filter">
                <input
                    type="checkbox"
                    id="hasAntiDragonShield"
                    ${d?"checked":""}
                >
                Obtained Anti-dragon shield
            </label>
        </div>
        <nav class="unlock-jump slayer-master-jump" aria-label="Jump to slayer master">
            <div class="unlock-jump-label">Jump to slayer master</div>
            <div class="unlock-jump-list" id="slayerMasterJumpList">
                ${f}
            </div>
        </nav>
        <div class="slayer-master-list" id="slayerMasterList">
            ${b.join("")}
        </div>
    `}function oe(e){const t=u.filters?.hideUnreachableSlayerMasters??!0,s=!!u.filters?.hideUnassignableSlayerTasks,o=e.querySelectorAll(".slayer-master");for(const n of o){const i=n.dataset.masterReachable==="true",m=t&&!i;n.style.display=m?"none":""}const r=e.querySelectorAll(".slayer-monster");for(const n of r){const i=n.classList.contains("slayer-monster--unassignable");n.style.display=s&&i?"none":""}const f=e.querySelectorAll(".slayer-location");for(const n of f){const i=n.classList.contains("slayer-location--unassignable");n.style.display=s&&i?"none":""}const c=e.querySelectorAll(".slayer-location-list");for(const n of c){const i=n.querySelectorAll(".slayer-location"),m=Array.from(i).some(d=>d.style.display!=="none");n.style.display=m?"":"none"}const a=document.querySelectorAll(".slayer-master-jump-link");for(const n of a){const i=n.getAttribute("href")?.slice(1),d=(i?document.getElementById(i):null)?.dataset.masterReachable==="true",b=t&&!d;n.style.display=b?"none":""}}async function q(e,t={}){const s={...u.filters,...e};if(await u.setFilters(s),t.rerender){window.dispatchEvent(new PopStateEvent("popstate"));return}const o=document.getElementById("slayerMasterList");o&&oe(o)}let H=null;function Be(){Ce();const e=document.getElementById("slayerMasterList");e&&oe(e);const t=document.querySelector(".slayer-master-jump"),s=r=>{const f=r.target.closest(".slayer-master-jump-link");if(!f)return;const c=f.getAttribute("href")?.slice(1);if(!c)return;const a=document.getElementById(c);a&&(r.preventDefault(),history.replaceState(null,"",`#${c}`),a.scrollIntoView({behavior:"smooth",block:"start"}))};t&&t.addEventListener("click",s);const o=async r=>{r.target.id==="hideUnreachableSlayerMasters"&&await q({hideUnreachableSlayerMasters:r.target.checked}),r.target.id==="ignoreSlayerMasterCombatLevel"&&await q({ignoreSlayerMasterCombatLevel:r.target.checked},{rerender:!0}),r.target.id==="hideUnassignableSlayerTasks"&&await q({hideUnassignableSlayerTasks:r.target.checked}),r.target.id==="overrideBarbarianFiremaking1ForWaterfiends"&&await q({overrideBarbarianFiremaking1ForWaterfiends:r.target.checked},{rerender:!0}),r.target.id==="hasAntiDragonShield"&&await q({hasAntiDragonShield:r.target.checked},{rerender:!0})};document.addEventListener("change",o),H=()=>{t&&t.removeEventListener("click",s),document.removeEventListener("change",o)}}function Ce(){typeof H=="function"&&H(),H=null}export{Fe as default,Be as init,Ce as teardown};
