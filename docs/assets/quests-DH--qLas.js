import{Q as R}from"./questPoints-C622DSjb.js";import{f as o,R as F}from"./index-xUyDLGGs.js";const M={"Another Cook's Quest":"canCompleteRFDAnotherCooksQuest",Culinaromancer:"canCompleteRecipeForDisasterCulinaromancer","Evil Dave":"canCompleteRFDFreeingEvilDave","King Awowogei":"canCompleteRFDFreeingKingAwowogei","Lumbridge Guide":"canCompleteRFDFreeingTheLumbridgeGuide","Mountain Dwarf":"canCompleteRFDFreeingTheMountainDwarf","Pirate Pete":"canCompleteRFDFreeingPiratePete","Sir Amik Varze":"canCompleteRFDFreeingSirAmikVarse","Skrach Uglogwee":"canCompleteRFDFreeingSkrachUglologwee","Wartface & Bentnoze":"canCompleteRFDFreeingTheGoblinGenerals"},D={"Clock Tower":"Ice gloves can be used instead of the Bucket of water, requiring 50 Mining.","Demon Slayer":"An untradable Waterskin(3) can be used instead of a Bucket of water. Buy this at Ali Morrisane's."};function E(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function P(e){return e.replace(/[’']/g,"").replace(/&/g,"and").toLowerCase().replace(/[^a-z0-9]/g,"")}function A(e){return`canComplete${e.replace(/[’']/g,"").replace(/&/g,"and").split(/[^A-Za-z0-9]+/g).filter(Boolean).map(i=>i.charAt(0).toUpperCase()+i.slice(1)).join("")}`}function G(e){return e.replace(/^canComplete/,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/([A-Z])([A-Z][a-z])/g,"$1 $2").trim()}const T=new Map(Object.entries(F).filter(([e])=>e.startsWith("canComplete")).map(([e,n])=>[P(e.replace(/^canComplete/,"")),n]));function N(e){if(e.startsWith("Recipe for Disaster - ")){const i=e.replace("Recipe for Disaster - ",""),s=M[i];return s?{fn:F[s],expectedNames:[s]}:null}const n=[e,e.split(" - ")[0],e.split(":")[0]];for(const i of n){const s=P(i),a=T.get(s);if(a)return{fn:a,expectedNames:n.map(A)}}return{fn:null,expectedNames:n.map(A)}}function x(e,n){const i={skills:[],items:[],itemGroups:[],prereqQuests:[],questPointsRequired:e?.missing?.questPointsRequired??0,questPointsCurrent:e?.missing?.questPointsCurrent};Array.isArray(e?.missing?.skills)&&e.missing.skills.length&&(i.skills=[...e.missing.skills].sort((a,r)=>a.localeCompare(r)));const s=new Set;if(Array.isArray(e?.missing?.itemGroups)&&(i.itemGroups=e.missing.itemGroups.map(a=>{if(Array.isArray(a)){for(const r of a)s.add(r);return a.map(r=>typeof r=="string"?r:n.get(r)??`Item ${r}`)}if(a?.options){for(const r of a.options)r.length===1&&s.add(r[0]);return{options:a.options.map(r=>r.map(c=>typeof c=="string"?c:n.get(c)??`Item ${c}`))}}return[]})),e?.missing?.items?.size){for(const a of e.missing.items)s.has(a)||i.items.push(n.get(a)??`Item ${a}`);i.items.sort((a,r)=>a.localeCompare(r))}return Array.isArray(e?.missing?.prereqQuests)&&(i.prereqQuests=[...e.missing.prereqQuests].sort((a,r)=>a.localeCompare(r))),i}function S(e){const n=Array.isArray(e?.prereqQuests)?e.prereqQuests:[],i=Array.isArray(e?.skills)?e.skills:[],s=Array.isArray(e?.items)?e.items:[],a=Array.isArray(e?.itemGroups)?e.itemGroups:[],r=e?.questPointsRequired??0,c=e?.questPointsCurrent,d=[];if(n.length){const m=n.map(G);d.push(`Missing prerequisite quests: ${m.join(", ")}.`)}if(r&&typeof c=="number"){const m=Math.max(0,r-c);d.push(`Missing quest points: ${m} (need ${r}).`)}if(i.length&&d.push(`Missing levels: ${i.join(", ")}.`),s.length&&d.push(`Missing items: ${s.join(", ")}.`),a.length){const m=a.map(t=>Array.isArray(t)?`Any of: ${t.join(" / ")}`:t?.options?`Any of: ${t.options.map(u=>u.length>1?`(${u.join(" + ")})`:u[0]).join(" / ")}`:"").filter(Boolean).join("; ");d.push(`Missing item options: ${m}.`)}return d.length?d.map(m=>`<div class="quest-missing">${m}</div>`).join(""):'<div class="quest-missing">Missing requirements.</div>'}function k(e){if(!e)return 0;const n=Array.isArray(e.items)?e.items.length:0,i=Array.isArray(e.itemGroups)?e.itemGroups.length:0;return n+i}function $(e){return Array.isArray(e?.prereqQuests)&&e.prereqQuests.length>0}function I({ignoreSkillLevels:e=!1}={}){return{items:o.items,obtained:o.obtained||[],rolled:o.rolled||[],player:o.player,filters:o.filters,ignoreSkillLevels:e,missing:{items:new Set,itemGroups:[],itemGroupKeys:new Set,skills:[],skillKeys:new Set,prereqQuests:[],prereqQuestKeys:new Set,questPointsRequired:0,questPointsCurrent:o.player?.questPoints??0}}}async function H(){if(!o.player)return`
            <h1>Quests</h1>
            <p>Please upload your files and player name on the Upload page first.</p>
        `;await o.ensureItemsLoaded();const e=new Map((o.items||[]).map(t=>[t.id,t.name])),n=Object.keys(R).sort((t,l)=>t.localeCompare(l)),i=[];for(const t of n){const u=(o.player.quests?.[t]??0)===2;let p=!1,h=!1,q={items:[],itemGroups:[]};if(!u){const C=N(t);if(C?.fn){const Q=I();try{p=await C.fn(Q)}catch(y){console.warn(`[quests] Failed requirement check for: ${t}`,y)}if(!p){q=x(Q,e);try{const y=I({ignoreSkillLevels:!0});h=await C.fn(y)}catch(y){console.warn(`[quests] Failed trainable requirement check for: ${t}`,y)}}}else{const Q=C?.expectedNames??[A(t)];console.warn(`[quests] Missing requirement check for: ${t}. Expected one of: ${Q.join(", ")}`)}}let f="quest-status-blocked",g="Not completed";u?(f="quest-status-complete",g="Completed"):p?(f="quest-status-ready",g="Can complete"):h&&(f="quest-status-trainable",g="Train levels"),!u&&!p&&S(q),i.push({questName:t,isCompleted:u,isDoable:p,isTrainable:h,missingItems:q,statusClass:f,statusLabel:g})}const s=!!o.filters?.questSortByMissingItems;i.sort((t,l)=>{if(s){const h=$(t.missingItems),q=$(l.missingItems);if(h!==q)return h?1:-1;const f=k(t.missingItems),g=k(l.missingItems);if(f!==g)return f-g}const u=t.isDoable&&!t.isCompleted?0:t.isTrainable&&!t.isCompleted?1:2,p=l.isDoable&&!l.isCompleted?0:l.isTrainable&&!l.isCompleted?1:2;return u!==p?u-p:t.questName.localeCompare(l.questName)});const a=i.map(t=>{const l=!t.isCompleted&&!t.isDoable?S(t.missingItems):"",u=o.filters?.isFreeToPlay?null:D[t.questName],p=u?`<span class="clue-step-info quest-info" tabindex="0" aria-label="Quest information" title="${E(u)}">i</span>`:"";return`
            <div class="quest-row ${t.statusClass}"
                data-completed="${t.isCompleted?"true":"false"}"
                data-doable="${t.isDoable?"true":"false"}"
                data-trainable="${t.isTrainable?"true":"false"}"
                data-name="${t.questName.toLowerCase()}">
                <div class="quest-name">${t.questName}${p}</div>
                <div class="quest-status">${t.statusLabel}</div>
                ${l}
            </div>
        `}),r=(o.filters?.questSearch??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;"),c=o.player?.quests?.["Shield of Arrav"]===2,m=(o.filters?.heroesQuestGang??"phoenix")!=="black_arm";return`
        <h1>Quests</h1>
        <div class="quest-filters">
            <label class="quest-filter">
                <span>Search quests</span>
                <input type="search" id="questSearch" value="${r}" placeholder="Quest name">
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
    `}function v(e){const n=o.filters?.hideCompletedQuests,i=o.filters?.hideIncompletableQuests,s=(o.filters?.questSearch||"").trim().toLowerCase(),a=e.querySelectorAll(".quest-row");for(const r of a){const c=r.dataset.completed==="true",d=r.dataset.doable==="true",m=r.dataset.trainable==="true",t=r.dataset.name||"",l=!s||t.includes(s),p=n&&c||i&&(!c&&!d&&!m)||!l;r.style.display=p?"none":""}}async function b(e,n={}){const i={...o.filters,...e};if(n.immediate?o.setFilters(i):await o.setFilters(i),n.rerender){window.dispatchEvent(new PopStateEvent("popstate"));return}const s=document.getElementById("questList");s&&v(s)}let w=null;function U(){L();const e=document.getElementById("questList");e&&v(e);const n=async s=>{s.target.id==="hideCompletedQuests"&&await b({hideCompletedQuests:s.target.checked}),s.target.id==="hideIncompletableQuests"&&await b({hideIncompletableQuests:s.target.checked}),s.target.id==="heroesQuestGangToggle"&&await b({heroesQuestGang:s.target.checked?"phoenix":"black_arm"},{rerender:!0}),s.target.id==="questSortToggle"&&await b({questSortByMissingItems:s.target.checked},{rerender:!0})},i=s=>{s.target.id==="questSearch"&&b({questSearch:s.target.value},{immediate:!0})};document.addEventListener("change",n),document.addEventListener("input",i),w=()=>{document.removeEventListener("change",n),document.removeEventListener("input",i)}}function L(){typeof w=="function"&&w(),w=null}export{H as default,U as init,L as teardown};
