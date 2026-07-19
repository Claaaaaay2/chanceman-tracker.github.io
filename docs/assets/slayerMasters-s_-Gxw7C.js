import{f as m,j as $e,k as Se,R as X}from"./index-C-tFkq-G.js";const Me={canAssignWaterfiendsBarbarianFiremaking1:"Barbarian firemaking 1 completed",hasAntiDragonShieldForDragonSlayerTasks:"Obtained Anti-dragon shield",canReachWyrmsTask:"Any of: Granite boots / Boots of stone / Boots of brimstone, access to the Charred Dungeon, or can start Perilous Moons and reach Wyrmlings",canReachAbyssalSire:"Can reach Abyssal Sire area",canReachTrollheim:"Can reach Trollheim",hasUsableAxe:"Has a usable axe"};function h(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;")}function ae(e){return String(e||"").toLowerCase().replace(/[^a-z0-9]/g,"")}function Le(e){return String(e||"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")}function Re(e={}){const t=Number(e.Attack||1),s=Number(e.Strength||1),o=Number(e.Defence||1),r=Number(e.Hitpoints||10),y=Number(e.Prayer||1),l=Number(e.Ranged||1),d=Number(e.Magic||1),c=.25*(o+r+Math.floor(y/2)),n=.325*(t+s),i=.325*Math.floor(l*1.5),a=.325*Math.floor(d*1.5);return Math.floor(c+Math.max(n,i,a))}function Z(e,t){return e==="Combat"?Re(t.player?.levels):Number(t.player?.levels?.[e]??1)}function ee(e,t,s){const o=e.player?.quests?.[t]??0;return s==="completed"?o===2:s==="started"?o>0:!1}function se(e,t){const s=ae(t),o=e.itemNameToIds.get(s)||[];for(const r of o)if(e.rolledSet.has(r)&&e.obtainedSet.has(r))return!0;return!1}function P(e){return Me[e]||e}function B(...e){const t={skills:{},skillsAny:[],quests:{},questsAny:[],items:[],itemsAll:[],itemsAny:[],rulesAll:[],rulesAny:[],untracked:[]};for(const s of e)if(!(!s||typeof s!="object")){for(const[o,r]of Object.entries(s.skills||{})){const y=Number(r);if(!Number.isFinite(y)){t.skills[o]=r;continue}const l=Number(t.skills[o]);(!Number.isFinite(l)||y>l)&&(t.skills[o]=y)}Array.isArray(s.skillsAny)&&t.skillsAny.push(...s.skillsAny),Object.assign(t.quests,s.quests||{}),Array.isArray(s.questsAny)&&t.questsAny.push(...s.questsAny),Array.isArray(s.items)&&t.items.push(...s.items),Array.isArray(s.itemsAll)&&t.itemsAll.push(...s.itemsAll),Array.isArray(s.itemsAny)&&t.itemsAny.push(...s.itemsAny),Array.isArray(s.rulesAll)&&t.rulesAll.push(...s.rulesAll),Array.isArray(s.rulesAny)&&t.rulesAny.push(...s.rulesAny),Array.isArray(s.untracked)&&t.untracked.push(...s.untracked)}return t}function te(e,t){if(!t||!e||typeof e!="object")return e||{};const s={...e.skills||{}};for(const r of Object.keys(s))String(r).toLowerCase()==="combat"&&delete s[r];const o=(e.skillsAny||[]).map(r=>{const y={};for(const[l,d]of Object.entries(r||{}))String(l).toLowerCase()!=="combat"&&(y[l]=d);return y}).filter(r=>Object.keys(r).length>0);return{...e,skills:s,skillsAny:o}}async function v(e,t){const s=[];for(const[n,i]of Object.entries(e?.skills||{}))Z(n,t)<i&&s.push(`${n} ${i}`);const o=e?.skillsAny||[];if(o.length){let n=!1;const i=[];for(const a of o){const u=Object.entries(a||{}),f=u.map(([p,b])=>`${p} ${b}`);i.push(f.join(" + ")),u.every(([p,b])=>Z(p,t)>=b)&&(n=!0)}n||s.push(`Any of: ${i.join(" / ")}`)}for(const[n,i]of Object.entries(e?.quests||{}))if(!ee(t,n,i)){const a=i==="started"?"(started)":"(completed)";s.push(`${n} ${a}`)}const r=e?.questsAny||[];if(r.length){let n=!1;const i=[];for(const a of r){const u=Object.entries(a||{}),f=u.map(([p,b])=>`${p} ${b==="started"?"(started)":"(completed)"}`).join(" + ");i.push(f),u.every(([p,b])=>ee(t,p,b))&&(n=!0)}n||s.push(`Any of: ${i.join(" / ")}`)}const y=[...e?.items||[],...e?.itemsAll||[]];for(const n of y)se(t,n)||s.push(n);for(const n of e?.itemsAny||[]){if(!Array.isArray(n)||!n.length)continue;n.some(a=>se(t,a))||(n.length===1?s.push(n[0]):s.push(`Any of: ${n.join(" / ")}`))}const l=(e?.rulesAll||[]).filter($e),d=new Set(l);l.length&&(Se(t,l,{trackMissing:!1})||s.push(l.map(P).join(" + ")));for(const n of e?.rulesAll||[]){if(d.has(n))continue;const i=X[n],a=P(n);if(!i){s.push(`${a} (rule missing)`);continue}try{await i(t)||s.push(a)}catch{s.push(`${a} (rule error)`)}}const c=e?.rulesAny||[];if(c.length){let n=!1;const i=[];for(const a of c){const u=X[a],f=P(a);if(!u){i.push(`${f} (rule missing)`);continue}try{await u(t)?n=!0:i.push(f)}catch{i.push(`${f} (rule error)`)}}n||s.push(`Any of: ${i.join(" / ")}`)}if(e?.untracked?.length)for(const n of e.untracked)s.push(`Untracked: ${n}`);return{met:s.length===0,missing:s}}function ve(){const e=m.items||[],t=new Map;for(const s of e){const o=ae(s?.name);o&&(t.has(o)||t.set(o,[]),t.get(o).push(s.id))}return{items:e,player:m.player,obtained:m.obtained||[],rolled:m.rolled||[],obtainedSet:new Set(m.obtained||[]),rolledSet:new Set(m.rolled||[]),filters:m.filters,missing:{items:new Set},itemNameToIds:t}}function $(e){return e.length?e.join(", "):""}function je(e){return`https://oldschool.runescape.wiki/w/Slayer_task/${encodeURIComponent(String(e||"").replace(/\s+/g,"_"))}`}function _(e,t){return e?`<span class="clue-step-info" tabindex="0" aria-label="${h(t)}" title="${h(e)}">i</span>`:""}function we(e){return je(e?.name)}function qe(e){return/\bdragons?\b/i.test(String(e||""))}function ne(e,t){return e?t?{statusKey:"reachable",statusLabel:"Assignable and reachable"}:{statusKey:"unreachable",statusLabel:"Unreachable"}:{statusKey:"unassignable",statusLabel:"Unassignable"}}async function Ie(){if(!m.player||!m.obtained||!m.rolled)return`
            <h1>Slayer masters</h1>
            <p>Please upload your files and player name on the Upload page first.</p>
        `;await m.ensureItemsLoaded();const t=await(await fetch("/data/slayer_masters.json")).json(),s=Array.isArray(t?.masters)?t.masters:[],o=new Map,r=s.map(a=>{const u=Le(a?.name)||"slayer-master",f=o.get(u)||0;o.set(u,f+1);const A=f?`${u}-${f+1}`:u;return{master:a,id:A}}),y=r.map(({master:a,id:u})=>`
        <a class="unlock-jump-link slayer-master-jump-link" href="#${h(u)}">${h(a.name)}</a>
    `).join(""),l=ve(),d=m.filters?.hideUnreachableSlayerMasters??!0,c=!!m.filters?.hideUnassignableSlayerTasks,n=!!m.filters?.ignoreSlayerMasterCombatLevel,i=[];for(const{master:a,id:u}of r){const f=await v(a.reachRequirements||{},l),A=await v(a.assignmentRequirements||{},l);let p=0,b=0;const H=[];for(const g of a.monsters||[]){const ce=te(g.assignmentRequirements||{},n),ue=qe(g.name)?{rulesAll:["hasAntiDragonShieldForDragonSlayerTasks"]}:null,z=B(a.assignmentRequirements,ce,ue),Q=B(a.reachRequirements,g.reachRequirements),U=await v(z,l),j=await v(Q,l),L=Array.isArray(g.locations)?g.locations:[],O=[];let N=0,I=0;for(const k of L){const ge=te(k?.assignmentRequirements||{},n),pe=B(z,ge),be=B(Q,k?.reachRequirements),D=await v(pe,l),w=await v(be,l),K=D.met,E=w.met;K&&(N+=1,E&&(I+=1));const q=[];K?!E&&w.missing.length&&q.push(`To reach here: ${$(w.missing)}.`):(D.missing.length&&q.push(`To be assigned here: ${$(D.missing)}.`),!E&&w.missing.length&&q.push(`To reach here: ${$(w.missing)}.`));const G=ne(K,E),Y=Array.isArray(k?.notes)?k.notes:[],Ae=Y.length?_(Y.join(`
`),`${g.name} ${k?.name||"location"} note`):"";O.push(`
                    <div class="slayer-location slayer-location--${G.statusKey}">
                        <div class="slayer-location-header">
                            <span class="slayer-location-name">${h(k?.name||"Location")}</span>
                            ${Ae}
                            <span class="slayer-location-status">${G.statusLabel}</span>
                        </div>
                        ${q.length?`<div class="slayer-location-missing">${q.map(ke=>`<div>${h(ke)}</div>`).join("")}</div>`:""}
                    </div>
                `)}const S=L.length>0?N>0:U.met,R=L.length>0?I>0:j.met,me=L.length>0?N:S?1:0,ye=L.length>0?I:S&&R?1:0;p+=me,b+=ye;const V=ne(S,R),fe=`slayer-monster--${V.statusKey}`;let T=V.statusLabel;const M=[];S?!R&&j.missing.length&&M.push(`To reach: ${$(j.missing)}.`):(U.missing.length&&M.push(`To be assigned: ${$(U.missing)}.`),!R&&j.missing.length&&M.push(`To reach: ${$(j.missing)}.`)),L.length>0&&(S&&R?T=`Locations reachable: ${I}/${N}`:!S&&U.met?(T="No assignable locations",M.push("No locations are currently assignable.")):S&&!R&&(T="No reachable assignable locations",M.push("No assignable locations are currently reachable.")));const W=Array.isArray(g.notes)?g.notes:[],he=W.length?_(W.join(`
`),`${g.name} note`):"",de=O.length?`
                    <div class="slayer-location-list">
                        <div class="slayer-location-list-label">Locations</div>
                        ${O.join("")}
                    </div>
                `:"";H.push(`
                <article class="slayer-monster ${fe}">
                    <div class="slayer-monster-header">
                        <a class="slayer-monster-link" href="${h(we(g))}" target="_blank" rel="noopener noreferrer">${h(g.name)}</a>
                        ${he}
                        <span class="slayer-monster-status">${T}</span>
                    </div>
                    ${M.length?`<div class="slayer-monster-missing">${M.map(k=>`<div>${h(k)}</div>`).join("")}</div>`:""}
                    ${de}
                </article>
            `)}const oe=p>0?(b/p*100).toFixed(1):"0.0",J=Array.isArray(a.notes)?a.notes:[],ie=J.length?_(J.join(`
`),`${a.name} note`):"",C=[];f.met||C.push(`Master reach requirements: ${$(f.missing)}.`),A.met||C.push(`Master assignment requirements: ${$(A.missing)}.`);const le=d&&!f.met?' style="display: none;"':"";i.push(`
            <section class="slayer-master card" id="${h(u)}" data-master-reachable="${f.met?"true":"false"}"${le}>
                <header class="slayer-master-header">
                    <h2>
                        ${a.customUrl?`<a href="${h(a.customUrl)}" target="_blank" rel="noopener noreferrer">${h(a.name)}</a>`:h(a.name)}
                        ${ie}
                    </h2>
                    <div class="slayer-master-metrics">
                        <span class="slayer-master-metric">Master reachable: ${f.met?"Yes":"No"}</span>
                        <span class="slayer-master-metric">Assignable reachable: ${oe}% (${b}/${p})</span>
                    </div>
                </header>
                ${C.length?`<div class="slayer-master-missing">${C.map(g=>`<div>${h(g)}</div>`).join("")}</div>`:""}
                <div class="slayer-monster-grid">
                    ${H.join("")}
                </div>
            </section>
        `)}return`
        <h1>Slayer masters</h1>
        <div class="slayer-master-filters">
            <label class="slayer-master-filter">
                <input type="checkbox" id="hideUnreachableSlayerMasters" ${d?"checked":""}>
                Hide unreachable slayer masters
            </label>
            <label class="slayer-master-filter">
                <input type="checkbox" id="hideUnassignableSlayerTasks" ${c?"checked":""}>
                Hide unassignable tasks
            </label>
            <label class="slayer-master-filter">
                <input type="checkbox" id="ignoreSlayerMasterCombatLevel" ${n?"checked":""}>
                Ignore combat level
            </label>
        </div>
        <nav class="unlock-jump slayer-master-jump" aria-label="Jump to slayer master">
            <div class="unlock-jump-label">Jump to slayer master</div>
            <div class="unlock-jump-list" id="slayerMasterJumpList">
                ${y}
            </div>
        </nav>
        <div class="slayer-master-list" id="slayerMasterList">
            ${i.join("")}
        </div>
    `}function re(e){const t=m.filters?.hideUnreachableSlayerMasters??!0,s=!!m.filters?.hideUnassignableSlayerTasks,o=e.querySelectorAll(".slayer-master");for(const c of o){const n=c.dataset.masterReachable==="true",i=t&&!n;c.style.display=i?"none":""}const r=e.querySelectorAll(".slayer-monster");for(const c of r){const n=c.classList.contains("slayer-monster--unassignable");c.style.display=s&&n?"none":""}const y=e.querySelectorAll(".slayer-location");for(const c of y){const n=c.classList.contains("slayer-location--unassignable");c.style.display=s&&n?"none":""}const l=e.querySelectorAll(".slayer-location-list");for(const c of l){const n=c.querySelectorAll(".slayer-location"),i=Array.from(n).some(a=>a.style.display!=="none");c.style.display=i?"":"none"}const d=document.querySelectorAll(".slayer-master-jump-link");for(const c of d){const n=c.getAttribute("href")?.slice(1),a=(n?document.getElementById(n):null)?.dataset.masterReachable==="true",u=t&&!a;c.style.display=u?"none":""}}async function x(e,t={}){const s={...m.filters,...e};if(await m.setFilters(s),t.rerender){window.dispatchEvent(new PopStateEvent("popstate"));return}const o=document.getElementById("slayerMasterList");o&&re(o)}let F=null;function Te(){Ce();const e=document.getElementById("slayerMasterList");e&&re(e);const t=document.querySelector(".slayer-master-jump"),s=r=>{const y=r.target.closest(".slayer-master-jump-link");if(!y)return;const l=y.getAttribute("href")?.slice(1);if(!l)return;const d=document.getElementById(l);d&&(r.preventDefault(),history.replaceState(null,"",`#${l}`),d.scrollIntoView({behavior:"smooth",block:"start"}))};t&&t.addEventListener("click",s);const o=async r=>{r.target.id==="hideUnreachableSlayerMasters"&&await x({hideUnreachableSlayerMasters:r.target.checked}),r.target.id==="ignoreSlayerMasterCombatLevel"&&await x({ignoreSlayerMasterCombatLevel:r.target.checked},{rerender:!0}),r.target.id==="hideUnassignableSlayerTasks"&&await x({hideUnassignableSlayerTasks:r.target.checked})};document.addEventListener("change",o),F=()=>{t&&t.removeEventListener("click",s),document.removeEventListener("change",o)}}function Ce(){typeof F=="function"&&F(),F=null}export{Ie as default,Te as init,Ce as teardown};
