import{Q as R}from"./questPoints-DcKLxK_Y.js";import{R as v,f as n}from"./index-CoGxWBTG.js";const F={"Another Cook's Quest":"canCompleteRFDAnotherCooksQuest",Culinaromancer:"canCompleteRecipeForDisasterCulinaromancer","Evil Dave":"canCompleteRFDFreeingEvilDave","King Awowogei":"canCompleteRFDFreeingKingAwowogei","Lumbridge Guide":"canCompleteRFDFreeingTheLumbridgeGuide","Mountain Dwarf":"canCompleteRFDFreeingTheMountainDwarf","Pirate Pete":"canCompleteRFDFreeingPiratePete","Sir Amik Varze":"canCompleteRFDFreeingSirAmikVarse","Skrach Uglogwee":"canCompleteRFDFreeingSkrachUglologwee","Wartface & Bentnoze":"canCompleteRFDFreeingTheGoblinGenerals"};function I(e){return e.replace(/[’']/g,"").replace(/&/g,"and").toLowerCase().replace(/[^a-z0-9]/g,"")}function w(e){return`canComplete${e.replace(/[’']/g,"").replace(/&/g,"and").split(/[^A-Za-z0-9]+/g).filter(Boolean).map(i=>i.charAt(0).toUpperCase()+i.slice(1)).join("")}`}function G(e){return e.replace(/^canComplete/,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/([A-Z])([A-Z][a-z])/g,"$1 $2").trim()}const D=new Map(Object.entries(v).filter(([e])=>e.startsWith("canComplete")).map(([e,a])=>[I(e.replace(/^canComplete/,"")),a]));function M(e){if(e.startsWith("Recipe for Disaster - ")){const i=e.replace("Recipe for Disaster - ",""),o=F[i];return o?{fn:v[o],expectedNames:[o]}:null}const a=[e,e.split(" - ")[0],e.split(":")[0]];for(const i of a){const o=I(i),r=D.get(o);if(r)return{fn:r,expectedNames:a.map(w)}}return{fn:null,expectedNames:a.map(w)}}function E(e,a){const i={skills:[],items:[],itemGroups:[],prereqQuests:[],questPointsRequired:e?.missing?.questPointsRequired??0,questPointsCurrent:e?.missing?.questPointsCurrent};Array.isArray(e?.missing?.skills)&&e.missing.skills.length&&(i.skills=[...e.missing.skills].sort((r,s)=>r.localeCompare(s)));const o=new Set;if(Array.isArray(e?.missing?.itemGroups)&&(i.itemGroups=e.missing.itemGroups.map(r=>{if(Array.isArray(r)){for(const s of r)o.add(s);return r.map(s=>a.get(s)??`Item ${s}`)}if(r?.options){for(const s of r.options)s.length===1&&o.add(s[0]);return{options:r.options.map(s=>s.map(p=>a.get(p)??`Item ${p}`))}}return[]})),e?.missing?.items?.size){for(const r of e.missing.items)o.has(r)||i.items.push(a.get(r)??`Item ${r}`);i.items.sort((r,s)=>r.localeCompare(s))}return Array.isArray(e?.missing?.prereqQuests)&&(i.prereqQuests=[...e.missing.prereqQuests].sort((r,s)=>r.localeCompare(s))),i}function Q(e){const a=Array.isArray(e?.prereqQuests)?e.prereqQuests:[],i=Array.isArray(e?.skills)?e.skills:[],o=Array.isArray(e?.items)?e.items:[],r=Array.isArray(e?.itemGroups)?e.itemGroups:[],s=e?.questPointsRequired??0,p=e?.questPointsCurrent,m=[];if(a.length){const u=a.map(G);m.push(`Missing prerequisite quests: ${u.join(", ")}.`)}if(s&&typeof p=="number"){const u=Math.max(0,s-p);m.push(`Missing quest points: ${u} (need ${s}).`)}if(i.length&&m.push(`Missing levels: ${i.join(", ")}.`),o.length&&m.push(`Missing items: ${o.join(", ")}.`),r.length){const u=r.map(t=>Array.isArray(t)?`Any of: ${t.join(" / ")}`:t?.options?`Any of: ${t.options.map(c=>c.length>1?`(${c.join(" + ")})`:c[0]).join(" / ")}`:"").filter(Boolean).join("; ");m.push(`Missing item options: ${u}.`)}return m.length?m.map(u=>`<div class="quest-missing">${u}</div>`).join(""):'<div class="quest-missing">Missing requirements.</div>'}function A(e){if(!e)return 0;const a=Array.isArray(e.items)?e.items.length:0,i=Array.isArray(e.itemGroups)?e.itemGroups.length:0;return a+i}function S(e){return Array.isArray(e?.prereqQuests)&&e.prereqQuests.length>0}function $({ignoreSkillLevels:e=!1}={}){return{items:n.items,obtained:n.obtained||[],rolled:n.rolled||[],player:n.player,filters:n.filters,ignoreSkillLevels:e,missing:{items:new Set,itemGroups:[],itemGroupKeys:new Set,skills:[],skillKeys:new Set,prereqQuests:[],prereqQuestKeys:new Set,questPointsRequired:0,questPointsCurrent:n.player?.questPoints??0}}}async function x(){if(!n.player)return`
            <h1>Quests</h1>
            <p>Please upload your files and player name on the Upload page first.</p>
        `;await n.ensureItemsLoaded();const e=new Map((n.items||[]).map(t=>[t.id,t.name])),a=Object.keys(R).sort((t,l)=>t.localeCompare(l)),i=[];for(const t of a){const c=(n.player.quests?.[t]??0)===2;let d=!1,h=!1,y={items:[],itemGroups:[]};if(!c){const C=M(t);if(C?.fn){const k=$();try{d=await C.fn(k)}catch(b){console.warn(`[quests] Failed requirement check for: ${t}`,b)}if(!d){y=E(k,e);try{const b=$({ignoreSkillLevels:!0});h=await C.fn(b)}catch(b){console.warn(`[quests] Failed trainable requirement check for: ${t}`,b)}}}else{const k=C?.expectedNames??[w(t)];console.warn(`[quests] Missing requirement check for: ${t}. Expected one of: ${k.join(", ")}`)}}let f="quest-status-blocked",g="Not completed";c?(f="quest-status-complete",g="Completed"):d?(f="quest-status-ready",g="Can complete"):h&&(f="quest-status-trainable",g="Train levels"),!c&&!d&&Q(y),i.push({questName:t,isCompleted:c,isDoable:d,isTrainable:h,missingItems:y,statusClass:f,statusLabel:g})}const o=!!n.filters?.questSortByMissingItems;i.sort((t,l)=>{if(o){const h=S(t.missingItems),y=S(l.missingItems);if(h!==y)return h?1:-1;const f=A(t.missingItems),g=A(l.missingItems);if(f!==g)return f-g}const c=t.isDoable&&!t.isCompleted?0:t.isTrainable&&!t.isCompleted?1:2,d=l.isDoable&&!l.isCompleted?0:l.isTrainable&&!l.isCompleted?1:2;return c!==d?c-d:t.questName.localeCompare(l.questName)});const r=i.map(t=>{const l=!t.isCompleted&&!t.isDoable?Q(t.missingItems):"";return`
            <div class="quest-row ${t.statusClass}"
                data-completed="${t.isCompleted?"true":"false"}"
                data-doable="${t.isDoable?"true":"false"}"
                data-trainable="${t.isTrainable?"true":"false"}"
                data-name="${t.questName.toLowerCase()}">
                <div class="quest-name">${t.questName}</div>
                <div class="quest-status">${t.statusLabel}</div>
                ${l}
            </div>
        `}),s=(n.filters?.questSearch??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;"),p=n.player?.quests?.["Shield of Arrav"]===2,u=(n.filters?.heroesQuestGang??"phoenix")!=="black_arm";return`
        <h1>Quests</h1>
        <div class="quest-filters">
            <label class="quest-filter">
                <span>Search quests</span>
                <input type="search" id="questSearch" value="${s}" placeholder="Quest name">
            </label>
            <label class="quest-filter">
                <input type="checkbox" id="hideCompletedQuests" ${n.filters?.hideCompletedQuests?"checked":""}>
                Hide completed quests
            </label>
            <label class="quest-filter">
                <input type="checkbox" id="hideIncompletableQuests" ${n.filters?.hideIncompletableQuests?"checked":""}>
                Hide incompletable quests
            </label>
            <label class="quest-filter">
                <input type="checkbox" id="hazeelCultLocked" ${n.filters?.hazeelCultLocked?"checked":""}>
                Hazeel Cult locked
            </label>
            <label class="quest-filter">
                <span>Sort A-Z</span>
                <span class="toggle-switch">
                    <input type="checkbox" id="questSortToggle" ${o?"checked":""} aria-label="Sort quests by least missing items">
                    <span class="toggle-slider" aria-hidden="true"></span>
                </span>
                <span>Least missing items</span>
            </label>
            ${p?`
                <label class="quest-filter quest-filter-gang">
                    <span>Black arm gang</span>
                    <span class="toggle-switch">
                        <input type="checkbox" id="heroesQuestGangToggle" ${u?"checked":""} aria-label="Which Shield of Arrav gang?">
                        <span class="toggle-slider" aria-hidden="true"></span>
                    </span>
                    <span>Phoenix gang</span>
                </label>
            `:""}
        </div>
        <div class="quest-list" id="questList">
            ${r.join("")}
        </div>
    `}function P(e){const a=n.filters?.hideCompletedQuests,i=n.filters?.hideIncompletableQuests,o=(n.filters?.questSearch||"").trim().toLowerCase(),r=e.querySelectorAll(".quest-row");for(const s of r){const p=s.dataset.completed==="true",m=s.dataset.doable==="true",u=s.dataset.trainable==="true",t=s.dataset.name||"",l=!o||t.includes(o),d=a&&p||i&&(!p&&!m&&!u)||!l;s.style.display=d?"none":""}}async function q(e,a={}){const i={...n.filters,...e};if(await n.setFilters(i),a.rerender){window.dispatchEvent(new PopStateEvent("popstate"));return}const o=document.getElementById("questList");o&&P(o)}document.addEventListener("change",async e=>{e.target.id==="hideCompletedQuests"&&await q({hideCompletedQuests:e.target.checked}),e.target.id==="hideIncompletableQuests"&&await q({hideIncompletableQuests:e.target.checked}),e.target.id==="hazeelCultLocked"&&await q({hazeelCultLocked:e.target.checked},{rerender:!0}),e.target.id==="heroesQuestGangToggle"&&await q({heroesQuestGang:e.target.checked?"phoenix":"black_arm"},{rerender:!0}),e.target.id==="questSortToggle"&&await q({questSortByMissingItems:e.target.checked},{rerender:!0})});document.addEventListener("input",async e=>{e.target.id==="questSearch"&&await q({questSearch:e.target.value})});window.initQuestsPage=function(){const e=document.getElementById("questList");e&&P(e)};export{x as default};
