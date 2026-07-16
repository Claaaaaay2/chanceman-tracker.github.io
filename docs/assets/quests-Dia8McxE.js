import{Q as v}from"./questPoints-DoLjXDUj.js";import{f as o,R}from"./index-DvWMewZo.js";const M={"Another Cook's Quest":"canCompleteRFDAnotherCooksQuest",Culinaromancer:"canCompleteRecipeForDisasterCulinaromancer","Evil Dave":"canCompleteRFDFreeingEvilDave","King Awowogei":"canCompleteRFDFreeingKingAwowogei","Lumbridge Guide":"canCompleteRFDFreeingTheLumbridgeGuide","Mountain Dwarf":"canCompleteRFDFreeingTheMountainDwarf","Pirate Pete":"canCompleteRFDFreeingPiratePete","Sir Amik Varze":"canCompleteRFDFreeingSirAmikVarse","Skrach Uglogwee":"canCompleteRFDFreeingSkrachUglologwee","Wartface & Bentnoze":"canCompleteRFDFreeingTheGoblinGenerals"},T={"Clock Tower":"Ice gloves can be used instead of the Bucket of water, requiring 50 Mining.","Demon Slayer":"An untradable Waterskin(3) can be used instead of a Bucket of water. Buy this at Ali Morrisane's.","Mage Arena I":"You can use Surge Sacks instead of needing runes.","The Red Reef":"You can use Surge Sacks instead of needing a cannon. Any other range weapon should also work."};function D(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function F(e){return e.replace(/[’']/g,"").replace(/&/g,"and").toLowerCase().replace(/[^a-z0-9]/g,"")}function S(e){return`canComplete${e.replace(/[’']/g,"").replace(/&/g,"and").split(/[^A-Za-z0-9]+/g).filter(Boolean).map(i=>i.charAt(0).toUpperCase()+i.slice(1)).join("")}`}function E(e){return e.replace(/^canComplete/,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/([A-Z])([A-Z][a-z])/g,"$1 $2").trim()}const G=new Map(Object.entries(R).filter(([e])=>e.startsWith("canComplete")).map(([e,r])=>[F(e.replace(/^canComplete/,"")),r]));function N(e){if(e.startsWith("Recipe for Disaster - ")){const i=e.replace("Recipe for Disaster - ",""),s=M[i];return s?{fn:R[s],expectedNames:[s]}:null}const r=[e,e.split(" - ")[0],e.split(":")[0]];for(const i of r){const s=F(i),a=G.get(s);if(a)return{fn:a,expectedNames:r.map(S)}}return{fn:null,expectedNames:r.map(S)}}function x(e,r){const i={skills:[],items:[],itemGroups:[],prereqQuests:[],questPointsRequired:e?.missing?.questPointsRequired??0,questPointsCurrent:e?.missing?.questPointsCurrent};Array.isArray(e?.missing?.skills)&&e.missing.skills.length&&(i.skills=[...e.missing.skills].sort((a,n)=>a.localeCompare(n)));const s=new Set;if(Array.isArray(e?.missing?.itemGroups)&&(i.itemGroups=e.missing.itemGroups.map(a=>{if(Array.isArray(a)){for(const n of a)s.add(n);return a.map(n=>typeof n=="string"?n:r.get(n)??`Item ${n}`)}if(a?.options){for(const n of a.options)n.length===1&&s.add(n[0]);return{options:a.options.map(n=>n.map(c=>typeof c=="string"?c:r.get(c)??`Item ${c}`))}}return[]})),e?.missing?.items?.size){for(const a of e.missing.items)s.has(a)||i.items.push(r.get(a)??`Item ${a}`);i.items.sort((a,n)=>a.localeCompare(n))}return Array.isArray(e?.missing?.prereqQuests)&&(i.prereqQuests=[...e.missing.prereqQuests].sort((a,n)=>a.localeCompare(n))),i}function A(e){const r=Array.isArray(e?.prereqQuests)?e.prereqQuests:[],i=Array.isArray(e?.skills)?e.skills:[],s=Array.isArray(e?.items)?e.items:[],a=Array.isArray(e?.itemGroups)?e.itemGroups:[],n=e?.questPointsRequired??0,c=e?.questPointsCurrent,d=[];if(r.length){const m=r.map(E);d.push(`Missing prerequisite quests: ${m.join(", ")}.`)}if(n&&typeof c=="number"){const m=Math.max(0,n-c);d.push(`Missing quest points: ${m} (need ${n}).`)}if(i.length&&d.push(`Missing levels: ${i.join(", ")}.`),s.length&&d.push(`Missing items: ${s.join(", ")}.`),a.length){const m=a.map(t=>Array.isArray(t)?`Any of: ${t.join(" / ")}`:t?.options?`Any of: ${t.options.map(u=>u.length>1?`(${u.join(" + ")})`:u[0]).join(" / ")}`:"").filter(Boolean).join("; ");d.push(`Missing item options: ${m}.`)}return d.length?d.map(m=>`<div class="quest-missing">${m}</div>`).join(""):'<div class="quest-missing">Missing requirements.</div>'}function k(e){if(!e)return 0;const r=Array.isArray(e.items)?e.items.length:0,i=Array.isArray(e.itemGroups)?e.itemGroups.length:0;return r+i}function $(e){return Array.isArray(e?.prereqQuests)&&e.prereqQuests.length>0}function I({ignoreSkillLevels:e=!1}={}){return{items:o.items,obtained:o.obtained||[],rolled:o.rolled||[],player:o.player,filters:o.filters,ignoreSkillLevels:e,missing:{items:new Set,itemGroups:[],itemGroupKeys:new Set,skills:[],skillKeys:new Set,prereqQuests:[],prereqQuestKeys:new Set,questPointsRequired:0,questPointsCurrent:o.player?.questPoints??0}}}async function H(){if(!o.player)return`
            <h1>Quests</h1>
            <p>Please upload your files and player name on the Upload page first.</p>
        `;await o.ensureItemsLoaded();const e=new Map((o.items||[]).map(t=>[t.id,t.name])),r=Object.keys(v).sort((t,l)=>t.localeCompare(l)),i=[];for(const t of r){const u=(o.player.quests?.[t]??0)===2;let p=!1,h=!1,q={items:[],itemGroups:[]};if(!u){const C=N(t);if(C?.fn){const w=I();try{p=await C.fn(w)}catch(y){console.warn(`[quests] Failed requirement check for: ${t}`,y)}if(!p){q=x(w,e);try{const y=I({ignoreSkillLevels:!0});h=await C.fn(y)}catch(y){console.warn(`[quests] Failed trainable requirement check for: ${t}`,y)}}}else{const w=C?.expectedNames??[S(t)];console.warn(`[quests] Missing requirement check for: ${t}. Expected one of: ${w.join(", ")}`)}}let f="quest-status-blocked",g="Not completed";u?(f="quest-status-complete",g="Completed"):p?(f="quest-status-ready",g="Can complete"):h&&(f="quest-status-trainable",g="Train levels"),!u&&!p&&A(q),i.push({questName:t,isCompleted:u,isDoable:p,isTrainable:h,missingItems:q,statusClass:f,statusLabel:g})}const s=!!o.filters?.questSortByMissingItems;i.sort((t,l)=>{if(s){const h=$(t.missingItems),q=$(l.missingItems);if(h!==q)return h?1:-1;const f=k(t.missingItems),g=k(l.missingItems);if(f!==g)return f-g}const u=t.isDoable&&!t.isCompleted?0:t.isTrainable&&!t.isCompleted?1:2,p=l.isDoable&&!l.isCompleted?0:l.isTrainable&&!l.isCompleted?1:2;return u!==p?u-p:t.questName.localeCompare(l.questName)});const a=i.map(t=>{const l=!t.isCompleted&&!t.isDoable?A(t.missingItems):"",u=o.filters?.isFreeToPlay?null:T[t.questName],p=u?`<span class="clue-step-info quest-info" tabindex="0" aria-label="Quest information" title="${D(u)}">i</span>`:"";return`
            <div class="quest-row ${t.statusClass}"
                data-completed="${t.isCompleted?"true":"false"}"
                data-doable="${t.isDoable?"true":"false"}"
                data-trainable="${t.isTrainable?"true":"false"}"
                data-name="${t.questName.toLowerCase()}">
                <div class="quest-name">${t.questName}${p}</div>
                <div class="quest-status">${t.statusLabel}</div>
                ${l}
            </div>
        `}),n=(o.filters?.questSearch??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;"),c=o.player?.quests?.["Shield of Arrav"]===2,m=(o.filters?.heroesQuestGang??"phoenix")!=="black_arm";return`
        <h1>Quests</h1>
        <div class="quest-filters">
            <label class="quest-filter">
                <span>Search quests</span>
                <input type="search" id="questSearch" value="${n}" placeholder="Quest name">
            </label>
            <label class="quest-filter">
                <input type="checkbox" id="hideCompletedQuests" ${o.filters?.hideCompletedQuests?"checked":""}>
                Hide completed quests
            </label>
            <label class="quest-filter">
                <input type="checkbox" id="hideIncompletableQuests" ${o.filters?.hideIncompletableQuests?"checked":""}>
                Hide incompletable quests
            </label>
            <label class="quest-filter">
                <span>Sort A-Z</span>
                <span class="toggle-switch">
                    <input type="checkbox" id="questSortToggle" ${s?"checked":""} aria-label="Sort quests by least missing items">
                    <span class="toggle-slider" aria-hidden="true"></span>
                </span>
                <span>Least missing items</span>
            </label>
            ${c?`
                <label class="quest-filter quest-filter-gang">
                    <span>Black arm gang</span>
                    <span class="toggle-switch">
                        <input type="checkbox" id="heroesQuestGangToggle" ${m?"checked":""} aria-label="Which Shield of Arrav gang?">
                        <span class="toggle-slider" aria-hidden="true"></span>
                    </span>
                    <span>Phoenix gang</span>
                </label>
            `:""}
        </div>
        <div class="quest-list" id="questList">
            ${a.join("")}
        </div>
    `}function P(e){const r=o.filters?.hideCompletedQuests,i=o.filters?.hideIncompletableQuests,s=(o.filters?.questSearch||"").trim().toLowerCase(),a=e.querySelectorAll(".quest-row");for(const n of a){const c=n.dataset.completed==="true",d=n.dataset.doable==="true",m=n.dataset.trainable==="true",t=n.dataset.name||"",l=!s||t.includes(s),p=r&&c||i&&(!c&&!d&&!m)||!l;n.style.display=p?"none":""}}async function b(e,r={}){const i={...o.filters,...e};if(r.immediate?o.setFilters(i):await o.setFilters(i),r.rerender){window.dispatchEvent(new PopStateEvent("popstate"));return}const s=document.getElementById("questList");s&&P(s)}let Q=null;function U(){L();const e=document.getElementById("questList");e&&P(e);const r=async s=>{s.target.id==="hideCompletedQuests"&&await b({hideCompletedQuests:s.target.checked}),s.target.id==="hideIncompletableQuests"&&await b({hideIncompletableQuests:s.target.checked}),s.target.id==="heroesQuestGangToggle"&&await b({heroesQuestGang:s.target.checked?"phoenix":"black_arm"},{rerender:!0}),s.target.id==="questSortToggle"&&await b({questSortByMissingItems:s.target.checked},{rerender:!0})},i=s=>{s.target.id==="questSearch"&&b({questSearch:s.target.value},{immediate:!0})};document.addEventListener("change",r),document.addEventListener("input",i),Q=()=>{document.removeEventListener("change",r),document.removeEventListener("input",i)}}function L(){typeof Q=="function"&&Q(),Q=null}export{H as default,U as init,L as teardown};
