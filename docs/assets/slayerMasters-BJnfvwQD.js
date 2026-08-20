import{f as d,j as Ne,k as qe,R as ue,N as me}from"./index-B5-4lCWg.js";const Ue={canAssignWaterfiendsBarbarianFiremaking1:"Barbarian firemaking 1 completed",hasAntiDragonShieldForDragonSlayerTasks:"Obtained Anti-dragon shield",canReachWyrmsTask:"Any of: Granite boots / Boots of stone / Boots of brimstone, access to the Charred Dungeon, or can start Perilous Moons and reach Wyrmlings",canReachAbyssalSire:"Can reach Abyssal Sire area",canReachTrollheim:"Can reach Trollheim",canAccessWyrmscraigIsland:"Can access Wyrmscraig Island",hasUsableAxe:"Has a usable axe"},se=new Set(["Konar","Nieve","Duradel","Krystilia"]),Te=[{name:"Abyssal Sire"},{name:"Alchemical Hydra",masters:["Konar"]},{name:"Araxxor"},{name:"Barrows brothers",npcs:["Chest (Barrows)"],notes:["You need a spade."]},{name:"Callisto",substitutes:["Artio"]},{name:"Cerberus"},{name:"Chaos Elemental"},{name:"Chaos Fanatic"},{name:"Commander Zilyana"},{name:"Crazy archaeologist",substitutes:["Deranged archaeologist"]},{name:"Dagannoth Kings",npcs:["Dagannoth Prime","Dagannoth Rex","Dagannoth Supreme"]},{name:"Duke Sucellus"},{name:"General Graardor"},{name:"Giant Mole",notes:["You need a spade."]},{name:"Grotesque Guardians"},{name:"K'ril Tsutsaroth"},{name:"Kalphite Queen",notes:["You need a rope."]},{name:"King Black Dragon"},{name:"Kraken"},{name:"Kree'arra",notes:["You need a Mithril grapple and 70 ranged."]},{name:"The Leviathan"},{name:"Maggot King"},{name:"Phantom Muspah"},{name:"Sarachnis"},{name:"Scorpia"},{name:"Shellbane gryphon"},{name:"Thermonuclear smoke devil"},{name:"Vardorvis"},{name:"Venenatis",substitutes:["Spindel"]},{name:"Vet'ion",substitutes:["Calvar'ion"]},{name:"Vorkath"},{name:"The Whisperer"},{name:"Zulrah"}];function f(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;")}function be(e){return String(e||"").toLowerCase().replace(/[^a-z0-9]/g,"")}function Be(e){return String(e||"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")}function Ke(e={}){const t=Number(e.Attack||1),s=Number(e.Strength||1),o=Number(e.Defence||1),r=Number(e.Hitpoints||10),g=Number(e.Prayer||1),c=Number(e.Ranged||1),A=Number(e.Magic||1),m=.25*(o+r+Math.floor(g/2)),a=.325*(t+s),l=.325*Math.floor(c*1.5),u=.325*Math.floor(A*1.5);return Math.floor(m+Math.max(a,l,u))}function he(e,t){return e==="Combat"?Ke(t.player?.levels):Number(t.player?.levels?.[e]??1)}function ye(e,t,s){const o=e.player?.quests?.[t]??0;return s==="completed"?o===2:s==="started"?o>0:!1}function fe(e,t){const s=be(t),o=e.itemNameToIds.get(s)||[];for(const r of o)if(e.rolledSet.has(r)&&e.obtainedSet.has(r))return!0;return!1}function te(e){return Ue[e]||e}function Y(...e){const t={skills:{},skillsAny:[],quests:{},questsAny:[],items:[],itemsAll:[],itemsAny:[],rulesAll:[],rulesAny:[],untracked:[]};for(const s of e)if(!(!s||typeof s!="object")){for(const[o,r]of Object.entries(s.skills||{})){const g=Number(r);if(!Number.isFinite(g)){t.skills[o]=r;continue}const c=Number(t.skills[o]);(!Number.isFinite(c)||g>c)&&(t.skills[o]=g)}Array.isArray(s.skillsAny)&&t.skillsAny.push(...s.skillsAny),Object.assign(t.quests,s.quests||{}),Array.isArray(s.questsAny)&&t.questsAny.push(...s.questsAny),Array.isArray(s.items)&&t.items.push(...s.items),Array.isArray(s.itemsAll)&&t.itemsAll.push(...s.itemsAll),Array.isArray(s.itemsAny)&&t.itemsAny.push(...s.itemsAny),Array.isArray(s.rulesAll)&&t.rulesAll.push(...s.rulesAll),Array.isArray(s.rulesAny)&&t.rulesAny.push(...s.rulesAny),Array.isArray(s.untracked)&&t.untracked.push(...s.untracked)}return t}function ge(e,t){if(!t||!e||typeof e!="object")return e||{};const s={...e.skills||{}};for(const r of Object.keys(s))String(r).toLowerCase()==="combat"&&delete s[r];const o=(e.skillsAny||[]).map(r=>{const g={};for(const[c,A]of Object.entries(r||{}))String(c).toLowerCase()!=="combat"&&(g[c]=A);return g}).filter(r=>Object.keys(r).length>0);return{...e,skills:s,skillsAny:o}}async function w(e,t){const s=[];for(const[a,l]of Object.entries(e?.skills||{}))he(a,t)<l&&s.push(`${a} ${l}`);const o=e?.skillsAny||[];if(o.length){let a=!1;const l=[];for(const u of o){const i=Object.entries(u||{}),h=i.map(([$,n])=>`${$} ${n}`);l.push(h.join(" + ")),i.every(([$,n])=>he($,t)>=n)&&(a=!0)}a||s.push(`Any of: ${l.join(" / ")}`)}for(const[a,l]of Object.entries(e?.quests||{}))if(!ye(t,a,l)){const u=l==="started"?"(started)":"(completed)";s.push(`${a} ${u}`)}const r=e?.questsAny||[];if(r.length){let a=!1;const l=[];for(const u of r){const i=Object.entries(u||{}),h=i.map(([$,n])=>`${$} ${n==="started"?"(started)":"(completed)"}`).join(" + ");l.push(h),i.every(([$,n])=>ye(t,$,n))&&(a=!0)}a||s.push(`Any of: ${l.join(" / ")}`)}const g=[...e?.items||[],...e?.itemsAll||[]];for(const a of g)fe(t,a)||s.push(a);for(const a of e?.itemsAny||[]){if(!Array.isArray(a)||!a.length)continue;a.some(u=>fe(t,u))||(a.length===1?s.push(a[0]):s.push(`Any of: ${a.join(" / ")}`))}const c=(e?.rulesAll||[]).filter(Ne),A=new Set(c);c.length&&(qe(t,c,{trackMissing:!1})||s.push(c.map(te).join(" + ")));for(const a of e?.rulesAll||[]){if(A.has(a))continue;const l=ue[a],u=te(a);if(!l){s.push(`${u} (rule missing)`);continue}try{await l(t)||s.push(u)}catch{s.push(`${u} (rule error)`)}}const m=e?.rulesAny||[];if(m.length){let a=!1;const l=[];for(const u of m){const i=ue[u],h=te(u);if(!i){l.push(`${h} (rule missing)`);continue}try{await i(t)?a=!0:l.push(h)}catch{l.push(`${h} (rule error)`)}}a||s.push(`Any of: ${l.join(" / ")}`)}if(e?.untracked?.length)for(const a of e.untracked)s.push(`Untracked: ${a}`);return{met:s.length===0,missing:s}}function Ie(){const e=d.items||[],t=new Map;for(const s of e){const o=be(s?.name);o&&(t.has(o)||t.set(o,[]),t.get(o).push(s.id))}return{items:e,player:d.player,obtained:d.obtained||[],rolled:d.rolled||[],obtainedSet:new Set(d.obtained||[]),rolledSet:new Set(d.rolled||[]),filters:d.filters,missing:{items:new Set},itemNameToIds:t}}function v(e){return e.length?e.join(", "):""}function Ee(e){return`https://oldschool.runescape.wiki/w/Slayer_task/${encodeURIComponent(String(e||"").replace(/\s+/g,"_"))}`}function ae(e,t){return e?`<span class="clue-step-info" tabindex="0" aria-label="${f(t)}" title="${f(e)}">i</span>`:""}function de(e){return Ee(e?.name)}function Fe(e){return/\bdragons?\b/i.test(String(e||""))}function ne(e,t){return e?t?{statusKey:"reachable",statusLabel:"Assignable and reachable"}:{statusKey:"unreachable",statusLabel:"Unreachable"}:{statusKey:"unassignable",statusLabel:"Unassignable"}}async function De(e,t,s){const r=(e.npcs?.length?e.npcs:[e.name]).map(n=>me[n]).filter(Boolean),g=(e.substitutes||[]).map(n=>me[n]).filter(Boolean);if(e.masters&&!e.masters.includes(t.name))return{assignable:!1,reachable:!1,statusLabel:"Not assigned by this master",missingLines:[],statusKey:"unassignable"};if(t.name==="Krystilia"&&!["Callisto","Chaos Elemental","Chaos Fanatic","Crazy archaeologist","Scorpia","Venenatis","Vet'ion"].includes(e.name))return{assignable:!1,reachable:!1,statusLabel:"Not assigned by this master",missingLines:[],statusKey:"unassignable"};if(!r.length)return{assignable:!1,reachable:!1,statusLabel:"No NPC data",missingLines:[],statusKey:"unassignable"};const c=async n=>{const k={skills:{},rulesAll:[],rulesAny:[]},S={rulesAll:[],rulesAny:[]},C=Array.isArray(n.skill)?n.skill:[],L=Array.isArray(n.level)?n.level:[];for(let y=0;y<C.length;y++){const T=C[y];if(String(T).toLowerCase()!=="slayer")continue;const _=Number(L[y]);Number.isFinite(_)&&(k.skills.Slayer=_)}const j=(y,T)=>{y&&(String(y).startsWith("canComplete")?T.rulesAll.push(y):S.rulesAll.push(y))};if(Array.isArray(n.rule))for(const y of n.rule)j(y,k);else if(n.rule&&typeof n.rule=="object"){if(Array.isArray(n.rule.all))for(const y of n.rule.all)j(y,k);if(Array.isArray(n.rule.any))for(const y of n.rule.any)String(y).startsWith("canComplete")?k.rulesAny.push(y):S.rulesAny.push(y)}const N=await w(k,s),I=await w(S,s);return{assignmentStatus:N,reachStatus:I,assignable:N.met,reachable:N.met&&I.met}},A=[];for(const n of r)A.push({npc:n,...await c(n)});const m=[];for(const n of g)m.push({npc:n,...await c(n)});const a=[...A,...m],u=a.filter(({assignable:n})=>n).length>0,h=a.filter(({reachable:n})=>n).length>0,b=[];if(Array.isArray(e.notes)&&b.push(...e.notes),!u){const n=[];for(const{assignmentStatus:S}of a)S.missing.length&&n.push(...S.missing);const k=[...new Set(n)];k.length&&b.push(`To be assigned: ${v(k)}.`)}if(u&&!h){const n=[];for(const{assignable:S,reachStatus:C}of a)S&&C.missing.length&&n.push(...C.missing);const k=[...new Set(n)];k.length&&b.push(`To reach: ${v(k)}.`)}const $=ne(u,h);return{assignable:u,reachable:h,statusLabel:$.statusLabel,statusKey:$.statusKey,missingLines:b}}async function Oe(){if(!d.player||!d.obtained||!d.rolled)return`
            <h1>Slayer masters</h1>
            <p>Please upload your files and player name on the Upload page first.</p>
        `;await d.ensureItemsLoaded();const t=await(await fetch("/data/slayer_masters.json")).json(),s=Array.isArray(t?.masters)?t.masters:[],o=new Map,r=s.map(i=>{const h=Be(i?.name)||"slayer-master",b=o.get(h)||0;o.set(h,b+1);const $=b?`${h}-${b+1}`:h;return{master:i,id:$}}),g=r.map(({master:i,id:h})=>`
        <a class="unlock-jump-link slayer-master-jump-link" href="#${f(h)}">${f(i.name)}</a>
    `).join(""),c=Ie(),A=d.filters?.hideUnreachableSlayerMasters??!0,m=!!d.filters?.hideUnassignableSlayerTasks,a=!!d.filters?.ignoreSlayerMasterCombatLevel,l=!!d.filters?.likeABossUnlocked,u=[];for(const{master:i,id:h}of r){const b=await w(i.reachRequirements||{},c),$=await w(i.assignmentRequirements||{},c);let n=0,k=0;const S=[];for(const p of i.monsters||[]){const R=ge(p.assignmentRequirements||{},a),Q=Fe(p.name)?{rulesAll:["hasAntiDragonShieldForDragonSlayerTasks"]}:null,H=Y(i.assignmentRequirements,R,Q),re=Y(i.reachRequirements,p.reachRequirements),O=await w(H,c),E=await w(re,c),B=Array.isArray(p.locations)?p.locations:[],Z=[];let x=0,V=0;for(const M of B){const ve=ge(M?.assignmentRequirements||{},a),Me=Y(H,ve),we=Y(re,M?.reachRequirements),X=await w(Me,c),F=await w(we,c),ee=X.met,G=F.met;ee&&(x+=1,G&&(V+=1));const D=[];ee?!G&&F.missing.length&&D.push(`To reach here: ${v(F.missing)}.`):(X.missing.length&&D.push(`To be assigned here: ${v(X.missing)}.`),!G&&F.missing.length&&D.push(`To reach here: ${v(F.missing)}.`));const oe=ne(ee,G),ce=Array.isArray(M?.notes)?M.notes:[],Ce=ce.length?ae(ce.join(`
`),`${p.name} ${M?.name||"location"} note`):"";Z.push(`
                    <div class="slayer-location slayer-location--${oe.statusKey}">
                        <div class="slayer-location-header">
                            <span class="slayer-location-name">${f(M?.name||"Location")}</span>
                            ${Ce}
                            <span class="slayer-location-status">${oe.statusLabel}</span>
                        </div>
                        ${D.length?`<div class="slayer-location-missing">${D.map(je=>`<div>${f(je)}</div>`).join("")}</div>`:""}
                    </div>
                `)}const q=B.length>0?x>0:O.met,K=B.length>0?V>0:E.met,ke=B.length>0?x:q?1:0,$e=B.length>0?V:q&&K?1:0;n+=ke,k+=$e;const ie=ne(q,K),Se=`slayer-monster--${ie.statusKey}`;let W=ie.statusLabel;const U=[];q?!K&&E.missing.length&&U.push(`To reach: ${v(E.missing)}.`):(O.missing.length&&U.push(`To be assigned: ${v(O.missing)}.`),!K&&E.missing.length&&U.push(`To reach: ${v(E.missing)}.`)),B.length>0&&(q&&K?W=`Locations reachable: ${V}/${x}`:!q&&O.met?(W="No assignable locations",U.push("No locations are currently assignable.")):q&&!K&&(W="No reachable assignable locations",U.push("No assignable locations are currently reachable.")));const le=Array.isArray(p.notes)?p.notes:[],Le=le.length?ae(le.join(`
`),`${p.name} note`):"",Re=Z.length?`
                    <div class="slayer-location-list">
                        <div class="slayer-location-list-label">Locations</div>
                        ${Z.join("")}
                    </div>
                `:"";S.push(`
                <article class="slayer-monster ${Se}">
                    <div class="slayer-monster-header">
                        <a class="slayer-monster-link" href="${f(de(p))}" target="_blank" rel="noopener noreferrer">${f(p.name)}</a>
                        ${Le}
                        <span class="slayer-monster-status">${W}</span>
                    </div>
                    ${U.length?`<div class="slayer-monster-missing">${U.map(M=>`<div>${f(M)}</div>`).join("")}</div>`:""}
                    ${Re}
                </article>
            `)}const C=n>0?(k/n*100).toFixed(1):"0.0";let L=0,j=0;const N=[];if(l&&se.has(i.name))for(const p of Te){const R=await De(p,i,c);if(R.statusKey==="unassignable"&&R.statusLabel==="Not assigned by this master")continue;R.assignable&&(L++,R.reachable&&j++);const Q=`slayer-monster--${R.statusKey}`;N.push(`
                    <article class="slayer-monster ${Q}">
                        <div class="slayer-monster-header">
                            <a
                                class="slayer-monster-link"
                                href="${f(de({name:p.name}))}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >${f(p.name)}</a>

                            <span class="slayer-monster-status">
                                ${f(R.statusLabel)}
                            </span>
                        </div>

                        ${R.missingLines.length?`
                                    <div class="slayer-monster-missing">
                                        ${R.missingLines.map(H=>`<div>${f(H)}</div>`).join("")}
                                    </div>
                                `:""}
                    </article>
                `)}const I=L>0?(j/L*100).toFixed(1):"0.0",y=L>0?(100/L).toFixed(1):"0.0",T=Array.isArray(i.notes)?i.notes:[],_=T.length?ae(T.join(`
`),`${i.name} note`):"",P=[];b.met||P.push(`Master reach requirements: ${v(b.missing)}.`),$.met||P.push(`Master assignment requirements: ${v($.missing)}.`);const Ae=A&&!b.met?' style="display: none;"':"";u.push(`
            <section class="slayer-master card" id="${f(h)}" data-master-reachable="${b.met?"true":"false"}"${Ae}>
                <header class="slayer-master-header">
                    <h2>
                        ${i.customUrl?`<a href="${f(i.customUrl)}" target="_blank" rel="noopener noreferrer">${f(i.name)}</a>`:f(i.name)}
                        ${_}
                    </h2>
                    <div class="slayer-master-metrics">
                        <span class="slayer-master-metric">
                            Master reachable: ${b.met?"Yes":"No"}
                        </span>

                        <span class="slayer-master-metric">
                            Assignable reachable: ${C}% (${k}/${n})
                        </span>

                        ${l&&se.has(i.name)&&L>0?`
                                    <span class="slayer-master-metric">
                                        Boss tasks: ${I}% reachable
                                        (${j}/${L})
                                        — ${y}% each
                                        <a
                                            class="unlock-jump-link slayer-boss-jump-link"
                                            href="#${f(`${h}-bosses`)}"
                                        >Jump to breakdown</a>
                                    </span>
                                `:""}
                    </div>
                </header>
                ${P.length?`<div class="slayer-master-missing">${P.map(p=>`<div>${f(p)}</div>`).join("")}</div>`:""}
                <div class="slayer-monster-grid">
                    ${S.join("")}
                </div>

                ${l&&se.has(i.name)&&N.length?`
                            <section
                                class="slayer-boss-breakdown"
                                id="${f(`${h}-bosses`)}"
                            >
                                <h3>Like a boss</h3>

                                <div class="slayer-master-metrics">
                                    <span class="slayer-master-metric">
                                        Assignable bosses: ${L}
                                    </span>

                                    <span class="slayer-master-metric">
                                        Reachable: ${I}%
                                        (${j}/${L})
                                    </span>

                                    <span class="slayer-master-metric">
                                        Each boss: ${y}%
                                    </span>
                                </div>

                                <div class="slayer-monster-grid">
                                    ${N.join("")}
                                </div>
                            </section>
                        `:""}
            </section>
        `)}return`
        <h1>Slayer masters</h1>
        <div class="slayer-master-filters">
            <label class="slayer-master-filter">
                <input type="checkbox" id="hideUnreachableSlayerMasters" ${A?"checked":""}>
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
                <input type="checkbox" id="likeABossUnlocked" ${l?"checked":""}>
                "Like a boss" unlocked
            </label>
        </div>
        <nav class="unlock-jump slayer-master-jump" aria-label="Jump to slayer master">
            <div class="unlock-jump-label">Jump to slayer master</div>
            <div class="unlock-jump-list" id="slayerMasterJumpList">
                ${g}
            </div>
        </nav>
        <div class="slayer-master-list" id="slayerMasterList">
            ${u.join("")}
        </div>
    `}function pe(e){const t=d.filters?.hideUnreachableSlayerMasters??!0,s=!!d.filters?.hideUnassignableSlayerTasks,o=e.querySelectorAll(".slayer-master");for(const m of o){const a=m.dataset.masterReachable==="true",l=t&&!a;m.style.display=l?"none":""}const r=e.querySelectorAll(".slayer-monster");for(const m of r){const a=m.classList.contains("slayer-monster--unassignable");m.style.display=s&&a?"none":""}const g=e.querySelectorAll(".slayer-location");for(const m of g){const a=m.classList.contains("slayer-location--unassignable");m.style.display=s&&a?"none":""}const c=e.querySelectorAll(".slayer-location-list");for(const m of c){const a=m.querySelectorAll(".slayer-location"),l=Array.from(a).some(u=>u.style.display!=="none");m.style.display=l?"":"none"}const A=document.querySelectorAll(".slayer-master-jump-link");for(const m of A){const a=m.getAttribute("href")?.slice(1),u=(a?document.getElementById(a):null)?.dataset.masterReachable==="true",i=t&&!u;m.style.display=i?"none":""}}async function z(e,t={}){const s={...d.filters,...e};if(await d.setFilters(s),t.rerender){window.dispatchEvent(new PopStateEvent("popstate"));return}const o=document.getElementById("slayerMasterList");o&&pe(o)}let J=null;function xe(){_e();const e=document.getElementById("slayerMasterList");e&&pe(e);const t=document.querySelector(".slayer-master-jump"),s=r=>{const g=r.target.closest(".slayer-master-jump-link");if(!g)return;const c=g.getAttribute("href")?.slice(1);if(!c)return;const A=document.getElementById(c);A&&(r.preventDefault(),history.replaceState(null,"",`#${c}`),A.scrollIntoView({behavior:"smooth",block:"start"}))};t&&t.addEventListener("click",s);const o=async r=>{r.target.id==="hideUnreachableSlayerMasters"&&await z({hideUnreachableSlayerMasters:r.target.checked}),r.target.id==="ignoreSlayerMasterCombatLevel"&&await z({ignoreSlayerMasterCombatLevel:r.target.checked},{rerender:!0}),r.target.id==="hideUnassignableSlayerTasks"&&await z({hideUnassignableSlayerTasks:r.target.checked}),r.target.id==="likeABossUnlocked"&&await z({likeABossUnlocked:r.target.checked},{rerender:!0})};document.addEventListener("change",o),J=()=>{t&&t.removeEventListener("click",s),document.removeEventListener("change",o)}}function _e(){typeof J=="function"&&J(),J=null}export{Oe as default,xe as init,_e as teardown};
