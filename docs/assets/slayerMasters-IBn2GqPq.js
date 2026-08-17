import{f as g,j as Ne,k as Ue,R as le,N as ce}from"./index-DPrrfeCF.js";const Te={canAssignWaterfiendsBarbarianFiremaking1:"Barbarian firemaking 1 completed",hasAntiDragonShieldForDragonSlayerTasks:"Obtained Anti-dragon shield",canReachWyrmsTask:"Any of: Granite boots / Boots of stone / Boots of brimstone, access to the Charred Dungeon, or can start Perilous Moons and reach Wyrmlings",canReachAbyssalSire:"Can reach Abyssal Sire area",canReachTrollheim:"Can reach Trollheim",canAccessWyrmscraigIsland:"Can access Wyrmscraig Island",hasUsableAxe:"Has a usable axe"},Q=new Set(["Konar","Nieve","Duradel","Krystilia"]),qe=[{name:"Abyssal Sire"},{name:"Alchemical Hydra",masters:["Konar"]},{name:"Araxxor"},{name:"Barrows brothers",npcs:["Ahrim the Blighted","Dharok the Wretched","Guthan the Infested","Karil the Tainted","Torag the Corrupted","Verac the Defiled"]},{name:"Callisto",substitutes:["Artio"]},{name:"Cerberus"},{name:"Chaos Elemental"},{name:"Chaos Fanatic"},{name:"Commander Zilyana"},{name:"Crazy archaeologist",substitutes:["Deranged archaeologist"]},{name:"Dagannoth Kings",npcs:["Dagannoth Prime","Dagannoth Rex","Dagannoth Supreme"]},{name:"Duke Sucellus"},{name:"General Graardor"},{name:"Giant Mole"},{name:"Grotesque Guardians"},{name:"K'ril Tsutsaroth"},{name:"Kalphite Queen"},{name:"King Black Dragon"},{name:"Kraken"},{name:"Kree'arra"},{name:"The Leviathan"},{name:"Maggot King"},{name:"Phantom Muspah"},{name:"Sarachnis"},{name:"Scorpia"},{name:"Shellbane gryphon"},{name:"Thermonuclear smoke devil"},{name:"Vardorvis"},{name:"Venenatis",substitutes:["Spindel"]},{name:"Vet'ion",substitutes:["Calvar'ion"]},{name:"Vorkath"},{name:"The Whisperer"},{name:"Zulrah"}];function y(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;")}function de(e){return String(e||"").toLowerCase().replace(/[^a-z0-9]/g,"")}function Be(e){return String(e||"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")}function Ke(e={}){const t=Number(e.Attack||1),s=Number(e.Strength||1),o=Number(e.Defence||1),n=Number(e.Hitpoints||10),d=Number(e.Prayer||1),c=Number(e.Ranged||1),p=Number(e.Magic||1),m=.25*(o+n+Math.floor(d/2)),a=.325*(t+s),i=.325*Math.floor(c*1.5),u=.325*Math.floor(p*1.5);return Math.floor(m+Math.max(a,i,u))}function ue(e,t){return e==="Combat"?Ke(t.player?.levels):Number(t.player?.levels?.[e]??1)}function me(e,t,s){const o=e.player?.quests?.[t]??0;return s==="completed"?o===2:s==="started"?o>0:!1}function he(e,t){const s=de(t),o=e.itemNameToIds.get(s)||[];for(const n of o)if(e.rolledSet.has(n)&&e.obtainedSet.has(n))return!0;return!1}function Y(e){return Te[e]||e}function P(...e){const t={skills:{},skillsAny:[],quests:{},questsAny:[],items:[],itemsAll:[],itemsAny:[],rulesAll:[],rulesAny:[],untracked:[]};for(const s of e)if(!(!s||typeof s!="object")){for(const[o,n]of Object.entries(s.skills||{})){const d=Number(n);if(!Number.isFinite(d)){t.skills[o]=n;continue}const c=Number(t.skills[o]);(!Number.isFinite(c)||d>c)&&(t.skills[o]=d)}Array.isArray(s.skillsAny)&&t.skillsAny.push(...s.skillsAny),Object.assign(t.quests,s.quests||{}),Array.isArray(s.questsAny)&&t.questsAny.push(...s.questsAny),Array.isArray(s.items)&&t.items.push(...s.items),Array.isArray(s.itemsAll)&&t.itemsAll.push(...s.itemsAll),Array.isArray(s.itemsAny)&&t.itemsAny.push(...s.itemsAny),Array.isArray(s.rulesAll)&&t.rulesAll.push(...s.rulesAll),Array.isArray(s.rulesAny)&&t.rulesAny.push(...s.rulesAny),Array.isArray(s.untracked)&&t.untracked.push(...s.untracked)}return t}function fe(e,t){if(!t||!e||typeof e!="object")return e||{};const s={...e.skills||{}};for(const n of Object.keys(s))String(n).toLowerCase()==="combat"&&delete s[n];const o=(e.skillsAny||[]).map(n=>{const d={};for(const[c,p]of Object.entries(n||{}))String(c).toLowerCase()!=="combat"&&(d[c]=p);return d}).filter(n=>Object.keys(n).length>0);return{...e,skills:s,skillsAny:o}}async function j(e,t){const s=[];for(const[a,i]of Object.entries(e?.skills||{}))ue(a,t)<i&&s.push(`${a} ${i}`);const o=e?.skillsAny||[];if(o.length){let a=!1;const i=[];for(const u of o){const r=Object.entries(u||{}),h=r.map(([l,f])=>`${l} ${f}`);i.push(h.join(" + ")),r.every(([l,f])=>ue(l,t)>=f)&&(a=!0)}a||s.push(`Any of: ${i.join(" / ")}`)}for(const[a,i]of Object.entries(e?.quests||{}))if(!me(t,a,i)){const u=i==="started"?"(started)":"(completed)";s.push(`${a} ${u}`)}const n=e?.questsAny||[];if(n.length){let a=!1;const i=[];for(const u of n){const r=Object.entries(u||{}),h=r.map(([l,f])=>`${l} ${f==="started"?"(started)":"(completed)"}`).join(" + ");i.push(h),r.every(([l,f])=>me(t,l,f))&&(a=!0)}a||s.push(`Any of: ${i.join(" / ")}`)}const d=[...e?.items||[],...e?.itemsAll||[]];for(const a of d)he(t,a)||s.push(a);for(const a of e?.itemsAny||[]){if(!Array.isArray(a)||!a.length)continue;a.some(u=>he(t,u))||(a.length===1?s.push(a[0]):s.push(`Any of: ${a.join(" / ")}`))}const c=(e?.rulesAll||[]).filter(Ne),p=new Set(c);c.length&&(Ue(t,c,{trackMissing:!1})||s.push(c.map(Y).join(" + ")));for(const a of e?.rulesAll||[]){if(p.has(a))continue;const i=le[a],u=Y(a);if(!i){s.push(`${u} (rule missing)`);continue}try{await i(t)||s.push(u)}catch{s.push(`${u} (rule error)`)}}const m=e?.rulesAny||[];if(m.length){let a=!1;const i=[];for(const u of m){const r=le[u],h=Y(u);if(!r){i.push(`${h} (rule missing)`);continue}try{await r(t)?a=!0:i.push(h)}catch{i.push(`${h} (rule error)`)}}a||s.push(`Any of: ${i.join(" / ")}`)}if(e?.untracked?.length)for(const a of e.untracked)s.push(`Untracked: ${a}`);return{met:s.length===0,missing:s}}function Ie(){const e=g.items||[],t=new Map;for(const s of e){const o=de(s?.name);o&&(t.has(o)||t.set(o,[]),t.get(o).push(s.id))}return{items:e,player:g.player,obtained:g.obtained||[],rolled:g.rolled||[],obtainedSet:new Set(g.obtained||[]),rolledSet:new Set(g.rolled||[]),filters:g.filters,missing:{items:new Set},itemNameToIds:t}}function L(e){return e.length?e.join(", "):""}function Ee(e){return`https://oldschool.runescape.wiki/w/Slayer_task/${encodeURIComponent(String(e||"").replace(/\s+/g,"_"))}`}function Z(e,t){return e?`<span class="clue-step-info" tabindex="0" aria-label="${y(t)}" title="${y(e)}">i</span>`:""}function ye(e){return Ee(e?.name)}function De(e){return/\bdragons?\b/i.test(String(e||""))}function X(e,t){return e?t?{statusKey:"reachable",statusLabel:"Assignable and reachable"}:{statusKey:"unreachable",statusLabel:"Unreachable"}:{statusKey:"unassignable",statusLabel:"Unassignable"}}async function Fe(e,t,s){const n=(e.npcs?.length?e.npcs:[e.name]).map(l=>ce[l]).filter(Boolean),d=(e.substitutes||[]).map(l=>ce[l]).filter(Boolean);if(e.masters&&!e.masters.includes(t.name))return{assignable:!1,reachable:!1,statusLabel:"Not assigned by this master",missingLines:[],statusKey:"unassignable"};if(t.name==="Krystilia"){const l=["Callisto","Chaos Elemental","Chaos Fanatic","Crazy archaeologist","Scorpia","Venenatis","Vet'ion"].includes(e.name),f=e.name==="King Black Dragon";if(!l&&!f)return{assignable:!1,reachable:!1,statusLabel:"Not assigned by this master",missingLines:[],statusKey:"unassignable"}}if(!n.length)return{assignable:!1,reachable:!1,statusLabel:"No NPC data",missingLines:[],statusKey:"unassignable"};const c=async l=>{const f={skills:{},rulesAll:[]};for(const[k,q]of Object.entries(l.skill||{}))f.skills[k]=q;for(const k of l.rule||[])f.rulesAll.push(k);return j(f,s)},p=[];for(const l of n)p.push({npc:l,status:await c(l)});const m=[];for(const l of d)m.push({npc:l,status:await c(l)});const a=[...p,...m],u=a.filter(({status:l})=>l.met).length>0,r=u,h=[];if(!u){const l=[];for(const{status:k}of a)k.missing.length&&l.push(...k.missing);const f=[...new Set(l)];f.length&&h.push(`To be assigned/reached: ${L(f)}.`)}const A=X(u,r);return{assignable:u,reachable:r,statusLabel:A.statusLabel,statusKey:A.statusKey,missingLines:h}}async function xe(){if(!g.player||!g.obtained||!g.rolled)return`
            <h1>Slayer masters</h1>
            <p>Please upload your files and player name on the Upload page first.</p>
        `;await g.ensureItemsLoaded();const t=await(await fetch("/data/slayer_masters.json")).json(),s=Array.isArray(t?.masters)?t.masters:[],o=new Map,n=s.map(r=>{const h=Be(r?.name)||"slayer-master",A=o.get(h)||0;o.set(h,A+1);const l=A?`${h}-${A+1}`:h;return{master:r,id:l}}),d=n.map(({master:r,id:h})=>`
        <a class="unlock-jump-link slayer-master-jump-link" href="#${y(h)}">${y(r.name)}</a>
    `).join(""),c=Ie(),p=g.filters?.hideUnreachableSlayerMasters??!0,m=!!g.filters?.hideUnassignableSlayerTasks,a=!!g.filters?.ignoreSlayerMasterCombatLevel,i=!!g.filters?.likeABossUnlocked,u=[];for(const{master:r,id:h}of n){const A=await j(r.reachRequirements||{},c),l=await j(r.assignmentRequirements||{},c);let f=0,k=0;const q=[];for(const b of r.monsters||[]){const $=fe(b.assignmentRequirements||{},a),G=De(b.name)?{rulesAll:["hasAntiDragonShieldForDragonSlayerTasks"]}:null,I=P(r.assignmentRequirements,$,G),ae=P(r.reachRequirements,b.reachRequirements),E=await j(I,c),N=await j(ae,c),w=Array.isArray(b.locations)?b.locations:[],W=[];let D=0,F=0;for(const v of w){const Re=fe(v?.assignmentRequirements||{},a),Me=P(I,Re),je=P(ae,v?.reachRequirements),z=await j(Me,c),U=await j(je,c),J=z.met,O=U.met;J&&(D+=1,O&&(F+=1));const T=[];J?!O&&U.missing.length&&T.push(`To reach here: ${L(U.missing)}.`):(z.missing.length&&T.push(`To be assigned here: ${L(z.missing)}.`),!O&&U.missing.length&&T.push(`To reach here: ${L(U.missing)}.`));const ie=X(J,O),oe=Array.isArray(v?.notes)?v.notes:[],we=oe.length?Z(oe.join(`
`),`${b.name} ${v?.name||"location"} note`):"";W.push(`
                    <div class="slayer-location slayer-location--${ie.statusKey}">
                        <div class="slayer-location-header">
                            <span class="slayer-location-name">${y(v?.name||"Location")}</span>
                            ${we}
                            <span class="slayer-location-status">${ie.statusLabel}</span>
                        </div>
                        ${T.length?`<div class="slayer-location-missing">${T.map(Ce=>`<div>${y(Ce)}</div>`).join("")}</div>`:""}
                    </div>
                `)}const R=w.length>0?D>0:E.met,C=w.length>0?F>0:N.met,ke=w.length>0?D:R?1:0,$e=w.length>0?F:R&&C?1:0;f+=ke,k+=$e;const ne=X(R,C),Se=`slayer-monster--${ne.statusKey}`;let _=ne.statusLabel;const M=[];R?!C&&N.missing.length&&M.push(`To reach: ${L(N.missing)}.`):(E.missing.length&&M.push(`To be assigned: ${L(E.missing)}.`),!C&&N.missing.length&&M.push(`To reach: ${L(N.missing)}.`)),w.length>0&&(R&&C?_=`Locations reachable: ${F}/${D}`:!R&&E.met?(_="No assignable locations",M.push("No locations are currently assignable.")):R&&!C&&(_="No reachable assignable locations",M.push("No assignable locations are currently reachable.")));const re=Array.isArray(b.notes)?b.notes:[],Le=re.length?Z(re.join(`
`),`${b.name} note`):"",ve=W.length?`
                    <div class="slayer-location-list">
                        <div class="slayer-location-list-label">Locations</div>
                        ${W.join("")}
                    </div>
                `:"";q.push(`
                <article class="slayer-monster ${Se}">
                    <div class="slayer-monster-header">
                        <a class="slayer-monster-link" href="${y(ye(b))}" target="_blank" rel="noopener noreferrer">${y(b.name)}</a>
                        ${Le}
                        <span class="slayer-monster-status">${_}</span>
                    </div>
                    ${M.length?`<div class="slayer-monster-missing">${M.map(v=>`<div>${y(v)}</div>`).join("")}</div>`:""}
                    ${ve}
                </article>
            `)}const be=f>0?(k/f*100).toFixed(1):"0.0";let S=0,B=0;const V=[];if(i&&Q.has(r.name))for(const b of qe){const $=await Fe(b,r,c);if($.statusKey==="unassignable"&&$.statusLabel==="Not assigned by this master")continue;$.assignable&&(S++,$.reachable&&B++);const G=`slayer-monster--${$.statusKey}`;V.push(`
                    <article class="slayer-monster ${G}">
                        <div class="slayer-monster-header">
                            <a
                                class="slayer-monster-link"
                                href="${y(ye({name:b.name}))}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >${y(b.name)}</a>

                            <span class="slayer-monster-status">
                                ${y($.statusLabel)}
                            </span>
                        </div>

                        ${$.missingLines.length?`
                                    <div class="slayer-monster-missing">
                                        ${$.missingLines.map(I=>`<div>${y(I)}</div>`).join("")}
                                    </div>
                                `:""}
                    </article>
                `)}const ee=S>0?(B/S*100).toFixed(1):"0.0",se=S>0?(100/S).toFixed(1):"0.0",te=Array.isArray(r.notes)?r.notes:[],pe=te.length?Z(te.join(`
`),`${r.name} note`):"",K=[];A.met||K.push(`Master reach requirements: ${L(A.missing)}.`),l.met||K.push(`Master assignment requirements: ${L(l.missing)}.`);const Ae=p&&!A.met?' style="display: none;"':"";u.push(`
            <section class="slayer-master card" id="${y(h)}" data-master-reachable="${A.met?"true":"false"}"${Ae}>
                <header class="slayer-master-header">
                    <h2>
                        ${r.customUrl?`<a href="${y(r.customUrl)}" target="_blank" rel="noopener noreferrer">${y(r.name)}</a>`:y(r.name)}
                        ${pe}
                    </h2>
                    <div class="slayer-master-metrics">
                        <span class="slayer-master-metric">
                            Master reachable: ${A.met?"Yes":"No"}
                        </span>

                        <span class="slayer-master-metric">
                            Assignable reachable: ${be}% (${k}/${f})
                        </span>

                        ${i&&Q.has(r.name)&&S>0?`
                                    <span class="slayer-master-metric">
                                        Boss tasks: ${ee}% reachable
                                        (${B}/${S})
                                        — ${se}% each
                                        <a
                                            class="unlock-jump-link slayer-boss-jump-link"
                                            href="#${y(`${h}-bosses`)}"
                                        >Jump to breakdown</a>
                                    </span>
                                `:""}
                    </div>
                </header>
                ${K.length?`<div class="slayer-master-missing">${K.map(b=>`<div>${y(b)}</div>`).join("")}</div>`:""}
                <div class="slayer-monster-grid">
                    ${q.join("")}
                </div>

                ${i&&Q.has(r.name)&&V.length?`
                            <section
                                class="slayer-boss-breakdown"
                                id="${y(`${h}-bosses`)}"
                            >
                                <h3>Like a boss</h3>

                                <div class="slayer-master-metrics">
                                    <span class="slayer-master-metric">
                                        Assignable bosses: ${S}
                                    </span>

                                    <span class="slayer-master-metric">
                                        Reachable: ${ee}%
                                        (${B}/${S})
                                    </span>

                                    <span class="slayer-master-metric">
                                        Each boss: ${se}%
                                    </span>
                                </div>

                                <div class="slayer-monster-grid">
                                    ${V.join("")}
                                </div>
                            </section>
                        `:""}
            </section>
        `)}return`
        <h1>Slayer masters</h1>
        <div class="slayer-master-filters">
            <label class="slayer-master-filter">
                <input type="checkbox" id="hideUnreachableSlayerMasters" ${p?"checked":""}>
                Hide unreachable slayer masters
            </label>
            <label class="slayer-master-filter">
                <input type="checkbox" id="hideUnassignableSlayerTasks" ${m?"checked":""}>
                Hide unassignable tasks
            </label>
            <label class="slayer-master-filter">
                <input type="checkbox" id="ignoreSlayerMasterCombatLevel" ${a?"checked":""}>
                Ignore combat level
            </label>
            <label class="slayer-master-filter">
                <input type="checkbox" id="likeABossUnlocked" ${i?"checked":""}>
                "Like a boss" unlocked
            </label>
        </div>
        <nav class="unlock-jump slayer-master-jump" aria-label="Jump to slayer master">
            <div class="unlock-jump-label">Jump to slayer master</div>
            <div class="unlock-jump-list" id="slayerMasterJumpList">
                ${d}
            </div>
        </nav>
        <div class="slayer-master-list" id="slayerMasterList">
            ${u.join("")}
        </div>
    `}function ge(e){const t=g.filters?.hideUnreachableSlayerMasters??!0,s=!!g.filters?.hideUnassignableSlayerTasks,o=e.querySelectorAll(".slayer-master");for(const m of o){const a=m.dataset.masterReachable==="true",i=t&&!a;m.style.display=i?"none":""}const n=e.querySelectorAll(".slayer-monster");for(const m of n){const a=m.classList.contains("slayer-monster--unassignable");m.style.display=s&&a?"none":""}const d=e.querySelectorAll(".slayer-location");for(const m of d){const a=m.classList.contains("slayer-location--unassignable");m.style.display=s&&a?"none":""}const c=e.querySelectorAll(".slayer-location-list");for(const m of c){const a=m.querySelectorAll(".slayer-location"),i=Array.from(a).some(u=>u.style.display!=="none");m.style.display=i?"":"none"}const p=document.querySelectorAll(".slayer-master-jump-link");for(const m of p){const a=m.getAttribute("href")?.slice(1),u=(a?document.getElementById(a):null)?.dataset.masterReachable==="true",r=t&&!u;m.style.display=r?"none":""}}async function x(e,t={}){const s={...g.filters,...e};if(await g.setFilters(s),t.rerender){window.dispatchEvent(new PopStateEvent("popstate"));return}const o=document.getElementById("slayerMasterList");o&&ge(o)}let H=null;function He(){_e();const e=document.getElementById("slayerMasterList");e&&ge(e);const t=document.querySelector(".slayer-master-jump"),s=n=>{const d=n.target.closest(".slayer-master-jump-link");if(!d)return;const c=d.getAttribute("href")?.slice(1);if(!c)return;const p=document.getElementById(c);p&&(n.preventDefault(),history.replaceState(null,"",`#${c}`),p.scrollIntoView({behavior:"smooth",block:"start"}))};t&&t.addEventListener("click",s);const o=async n=>{n.target.id==="hideUnreachableSlayerMasters"&&await x({hideUnreachableSlayerMasters:n.target.checked}),n.target.id==="ignoreSlayerMasterCombatLevel"&&await x({ignoreSlayerMasterCombatLevel:n.target.checked},{rerender:!0}),n.target.id==="hideUnassignableSlayerTasks"&&await x({hideUnassignableSlayerTasks:n.target.checked}),n.target.id==="likeABossUnlocked"&&await x({likeABossUnlocked:n.target.checked},{rerender:!0})};document.addEventListener("change",o),H=()=>{t&&t.removeEventListener("click",s),document.removeEventListener("change",o)}}function _e(){typeof H=="function"&&H(),H=null}export{xe as default,He as init,_e as teardown};
