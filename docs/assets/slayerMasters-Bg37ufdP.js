import{f as m,R as N}from"./index-DJfkluCI.js";function d(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;")}function O(e){return String(e||"").toLowerCase().replace(/[^a-z0-9]/g,"")}function D(e){return String(e||"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")}function V(e={}){const t=Number(e.Attack||1),s=Number(e.Strength||1),i=Number(e.Defence||1),o=Number(e.Hitpoints||10),f=Number(e.Prayer||1),u=Number(e.Ranged||1),r=Number(e.Magic||1),a=.25*(i+o+Math.floor(f/2)),n=.325*(t+s),l=.325*Math.floor(u*1.5),c=.325*Math.floor(r*1.5);return Math.floor(a+Math.max(n,l,c))}function C(e,t){return e==="Combat"?V(t.player?.levels):Number(t.player?.levels?.[e]??1)}function E(e,t,s){const i=e.player?.quests?.[t]??0;return s==="completed"?i===2:s==="started"?i>0:!1}function H(e,t){const s=O(t),i=e.itemNameToIds.get(s)||[];for(const o of i)if(e.rolledSet.has(o)&&e.obtainedSet.has(o))return!0;return!1}function F(...e){const t={skills:{},skillsAny:[],quests:{},questsAny:[],items:[],itemsAll:[],itemsAny:[],rulesAll:[],rulesAny:[],untracked:[]};for(const s of e)!s||typeof s!="object"||(Object.assign(t.skills,s.skills||{}),Array.isArray(s.skillsAny)&&t.skillsAny.push(...s.skillsAny),Object.assign(t.quests,s.quests||{}),Array.isArray(s.questsAny)&&t.questsAny.push(...s.questsAny),Array.isArray(s.items)&&t.items.push(...s.items),Array.isArray(s.itemsAll)&&t.itemsAll.push(...s.itemsAll),Array.isArray(s.itemsAny)&&t.itemsAny.push(...s.itemsAny),Array.isArray(s.rulesAll)&&t.rulesAll.push(...s.rulesAll),Array.isArray(s.rulesAny)&&t.rulesAny.push(...s.rulesAny),Array.isArray(s.untracked)&&t.untracked.push(...s.untracked));return t}async function k(e,t){const s=[];for(const[r,a]of Object.entries(e?.skills||{}))C(r,t)<a&&s.push(`${r} ${a}`);const i=e?.skillsAny||[];if(i.length){let r=!1;const a=[];for(const n of i){const l=Object.entries(n||{}),c=l.map(([y,h])=>`${y} ${h}`);a.push(c.join(" + ")),l.every(([y,h])=>C(y,t)>=h)&&(r=!0)}r||s.push(`Any of: ${a.join(" / ")}`)}for(const[r,a]of Object.entries(e?.quests||{}))if(!E(t,r,a)){const n=a==="started"?"(started)":"(completed)";s.push(`${r} ${n}`)}const o=e?.questsAny||[];if(o.length){let r=!1;const a=[];for(const n of o){const l=Object.entries(n||{}),c=l.map(([y,h])=>`${y} ${h==="started"?"(started)":"(completed)"}`).join(" + ");a.push(c),l.every(([y,h])=>E(t,y,h))&&(r=!0)}r||s.push(`Any of: ${a.join(" / ")}`)}const f=[...e?.items||[],...e?.itemsAll||[]];for(const r of f)H(t,r)||s.push(r);for(const r of e?.itemsAny||[]){if(!Array.isArray(r)||!r.length)continue;r.some(n=>H(t,n))||s.push(`Any of: ${r.join(" / ")}`)}for(const r of e?.rulesAll||[]){const a=N[r];if(!a){s.push(`${r} (rule missing)`);continue}try{await a(t)||s.push(r)}catch{s.push(`${r} (rule error)`)}}const u=e?.rulesAny||[];if(u.length){let r=!1;const a=[];for(const n of u){const l=N[n];if(!l){a.push(`${n} (rule missing)`);continue}try{await l(t)?r=!0:a.push(n)}catch{a.push(`${n} (rule error)`)}}r||s.push(`Any of: ${a.join(" / ")}`)}if(e?.untracked?.length)for(const r of e.untracked)s.push(`Untracked: ${r}`);return{met:s.length===0,missing:s}}function G(){const e=m.items||[],t=new Map;for(const s of e){const i=O(s?.name);i&&(t.has(i)||t.set(i,[]),t.get(i).push(s.id))}return{items:e,player:m.player,obtained:m.obtained||[],rolled:m.rolled||[],obtainedSet:new Set(m.obtained||[]),rolledSet:new Set(m.rolled||[]),filters:m.filters,missing:{items:new Set},itemNameToIds:t}}function b(e){return e.length?e.join(", "):""}function Y(e){return`https://oldschool.runescape.wiki/w/${encodeURIComponent(String(e||"").replace(/\s+/g,"_"))}`}function T(e,t){return e?`<span class="clue-step-info" tabindex="0" aria-label="${d(t)}" title="${d(e)}">i</span>`:""}function W(e){return e?.customUrl?e.customUrl:e?.wikiUrl?e.wikiUrl:Y(e?.name)}async function te(){if(!m.player||!m.obtained||!m.rolled)return`
            <h1>Slayer masters</h1>
            <p>Please upload your files and player name on the Upload page first.</p>
        `;await m.ensureItemsLoaded();const t=await(await fetch("/data/slayer_masters.json")).json(),s=Array.isArray(t?.masters)?t.masters:[],i=new Map,o=s.map(n=>{const l=D(n?.name)||"slayer-master",c=i.get(l)||0;i.set(l,c+1);const g=c?`${l}-${c+1}`:l;return{master:n,id:g}}),f=o.map(({master:n,id:l})=>`
        <a class="unlock-jump-link slayer-master-jump-link" href="#${d(l)}">${d(n.name)}</a>
    `).join(""),u=G(),r=m.filters?.hideUnreachableSlayerMasters??!0,a=[];for(const{master:n,id:l}of o){const c=await k(n.reachRequirements||{},u),g=await k(n.assignmentRequirements||{},u);let y=0,h=0;const S=[];for(const p of n.monsters||[]){const z=F(n.assignmentRequirements,p.assignmentRequirements),K=F(n.reachRequirements,p.reachRequirements),L=await k(z,u),j=await k(K,u),U=L.met,v=j.met;U&&(y+=1,v&&(h+=1));let w="slayer-monster--reachable",R="Assignable and reachable";const A=[];U?v||(w="slayer-monster--unreachable",R="Unreachable",A.push(`To reach: ${b(j.missing)}.`)):(w="slayer-monster--unassignable",R="Unassignable",A.push(`To be assigned: ${b(L.missing)}.`),v||A.push(`To reach: ${b(j.missing)}.`));const I=Array.isArray(p.notes)?p.notes:[],Q=I.length?T(I.join(`
`),`${p.name} note`):"";S.push(`
                <article class="slayer-monster ${w}">
                    <div class="slayer-monster-header">
                        <a class="slayer-monster-link" href="${d(W(p))}" target="_blank" rel="noopener noreferrer">${d(p.name)}</a>
                        ${Q}
                        <span class="slayer-monster-status">${R}</span>
                    </div>
                    ${A.length?`<div class="slayer-monster-missing">${A.map(x=>`<div>${d(x)}</div>`).join("")}</div>`:""}
                </article>
            `)}const B=y>0?(h/y*100).toFixed(1):"0.0",q=Array.isArray(n.notes)?n.notes:[],_=q.length?T(q.join(`
`),`${n.name} note`):"",$=[];c.met||$.push(`Master reach requirements: ${b(c.missing)}.`),g.met||$.push(`Master assignment requirements: ${b(g.missing)}.`);const J=r&&!c.met?' style="display: none;"':"";a.push(`
            <section class="slayer-master card" id="${d(l)}" data-master-reachable="${c.met?"true":"false"}"${J}>
                <header class="slayer-master-header">
                    <h2>
                        ${n.customUrl?`<a href="${d(n.customUrl)}" target="_blank" rel="noopener noreferrer">${d(n.name)}</a>`:d(n.name)}
                        ${_}
                    </h2>
                    <div class="slayer-master-metrics">
                        <span class="slayer-master-metric">Master reachable: ${c.met?"Yes":"No"}</span>
                        <span class="slayer-master-metric">Assignable reachable: ${B}% (${h}/${y})</span>
                    </div>
                </header>
                ${$.length?`<div class="slayer-master-missing">${$.map(p=>`<div>${d(p)}</div>`).join("")}</div>`:""}
                <div class="slayer-monster-grid">
                    ${S.join("")}
                </div>
            </section>
        `)}return`
        <h1>Slayer masters</h1>
        <div class="slayer-master-filters">
            <label class="slayer-master-filter">
                <input type="checkbox" id="hideUnreachableSlayerMasters" ${r?"checked":""}>
                Hide unreachable slayer masters
            </label>
        </div>
        <nav class="unlock-jump slayer-master-jump" aria-label="Jump to slayer master">
            <div class="unlock-jump-label">Jump to slayer master</div>
            <div class="unlock-jump-list" id="slayerMasterJumpList">
                ${f}
            </div>
        </nav>
        <div class="slayer-master-list" id="slayerMasterList">
            ${a.join("")}
        </div>
    `}function P(e){const t=m.filters?.hideUnreachableSlayerMasters??!0,s=e.querySelectorAll(".slayer-master");for(const o of s){const f=o.dataset.masterReachable==="true",u=t&&!f;o.style.display=u?"none":""}const i=document.querySelectorAll(".slayer-master-jump-link");for(const o of i){const f=o.getAttribute("href")?.slice(1),r=(f?document.getElementById(f):null)?.dataset.masterReachable==="true",a=t&&!r;o.style.display=a?"none":""}}async function X(e){const t={...m.filters,...e};await m.setFilters(t);const s=document.getElementById("slayerMasterList");s&&P(s)}let M=null;function re(){Z();const e=document.getElementById("slayerMasterList");e&&P(e);const t=document.querySelector(".slayer-master-jump"),s=o=>{const f=o.target.closest(".slayer-master-jump-link");if(!f)return;const u=f.getAttribute("href")?.slice(1);if(!u)return;const r=document.getElementById(u);r&&(o.preventDefault(),history.replaceState(null,"",`#${u}`),r.scrollIntoView({behavior:"smooth",block:"start"}))};t&&t.addEventListener("click",s);const i=async o=>{o.target.id==="hideUnreachableSlayerMasters"&&await X({hideUnreachableSlayerMasters:o.target.checked})};document.addEventListener("change",i),M=()=>{t&&t.removeEventListener("click",s),document.removeEventListener("change",i)}}function Z(){typeof M=="function"&&M(),M=null}export{te as default,re as init,Z as teardown};
