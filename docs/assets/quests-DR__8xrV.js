import{Q as G}from"./questPoints-DcKLxK_Y.js";import{f as o,R as P}from"./index-CNsWtI7f.js";const v={"Another Cook's Quest":"canCompleteRFDAnotherCooksQuest",Culinaromancer:"canCompleteRecipeForDisasterCulinaromancer","Evil Dave":"canCompleteRFDFreeingEvilDave","King Awowogei":"canCompleteRFDFreeingKingAwowogei","Lumbridge Guide":"canCompleteRFDFreeingTheLumbridgeGuide","Mountain Dwarf":"canCompleteRFDFreeingTheMountainDwarf","Pirate Pete":"canCompleteRFDFreeingPiratePete","Sir Amik Varze":"canCompleteRFDFreeingSirAmikVarse","Skrach Uglogwee":"canCompleteRFDFreeingSkrachUglologwee","Wartface & Bentnoze":"canCompleteRFDFreeingTheGoblinGenerals"};function R(e){return e.replace(/[’']/g,"").replace(/&/g,"and").toLowerCase().replace(/[^a-z0-9]/g,"")}function w(e){return`canComplete${e.replace(/[’']/g,"").replace(/&/g,"and").split(/[^A-Za-z0-9]+/g).filter(Boolean).map(i=>i.charAt(0).toUpperCase()+i.slice(1)).join("")}`}function D(e){return e.replace(/^canComplete/,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/([A-Z])([A-Z][a-z])/g,"$1 $2").trim()}const M=new Map(Object.entries(P).filter(([e])=>e.startsWith("canComplete")).map(([e,n])=>[R(e.replace(/^canComplete/,"")),n]));function E(e){if(e.startsWith("Recipe for Disaster - ")){const i=e.replace("Recipe for Disaster - ",""),s=v[i];return s?{fn:P[s],expectedNames:[s]}:null}const n=[e,e.split(" - ")[0],e.split(":")[0]];for(const i of n){const s=R(i),a=M.get(s);if(a)return{fn:a,expectedNames:n.map(w)}}return{fn:null,expectedNames:n.map(w)}}function L(e,n){const i={skills:[],items:[],itemGroups:[],prereqQuests:[],questPointsRequired:e?.missing?.questPointsRequired??0,questPointsCurrent:e?.missing?.questPointsCurrent};Array.isArray(e?.missing?.skills)&&e.missing.skills.length&&(i.skills=[...e.missing.skills].sort((a,r)=>a.localeCompare(r)));const s=new Set;if(Array.isArray(e?.missing?.itemGroups)&&(i.itemGroups=e.missing.itemGroups.map(a=>{if(Array.isArray(a)){for(const r of a)s.add(r);return a.map(r=>n.get(r)??`Item ${r}`)}if(a?.options){for(const r of a.options)r.length===1&&s.add(r[0]);return{options:a.options.map(r=>r.map(p=>n.get(p)??`Item ${p}`))}}return[]})),e?.missing?.items?.size){for(const a of e.missing.items)s.has(a)||i.items.push(n.get(a)??`Item ${a}`);i.items.sort((a,r)=>a.localeCompare(r))}return Array.isArray(e?.missing?.prereqQuests)&&(i.prereqQuests=[...e.missing.prereqQuests].sort((a,r)=>a.localeCompare(r))),i}function A(e){const n=Array.isArray(e?.prereqQuests)?e.prereqQuests:[],i=Array.isArray(e?.skills)?e.skills:[],s=Array.isArray(e?.items)?e.items:[],a=Array.isArray(e?.itemGroups)?e.itemGroups:[],r=e?.questPointsRequired??0,p=e?.questPointsCurrent,m=[];if(n.length){const c=n.map(D);m.push(`Missing prerequisite quests: ${c.join(", ")}.`)}if(r&&typeof p=="number"){const c=Math.max(0,r-p);m.push(`Missing quest points: ${c} (need ${r}).`)}if(i.length&&m.push(`Missing levels: ${i.join(", ")}.`),s.length&&m.push(`Missing items: ${s.join(", ")}.`),a.length){const c=a.map(t=>Array.isArray(t)?`Any of: ${t.join(" / ")}`:t?.options?`Any of: ${t.options.map(u=>u.length>1?`(${u.join(" + ")})`:u[0]).join(" / ")}`:"").filter(Boolean).join("; ");m.push(`Missing item options: ${c}.`)}return m.length?m.map(c=>`<div class="quest-missing">${c}</div>`).join(""):'<div class="quest-missing">Missing requirements.</div>'}function S(e){if(!e)return 0;const n=Array.isArray(e.items)?e.items.length:0,i=Array.isArray(e.itemGroups)?e.itemGroups.length:0;return n+i}function $(e){return Array.isArray(e?.prereqQuests)&&e.prereqQuests.length>0}function I({ignoreSkillLevels:e=!1}={}){return{items:o.items,obtained:o.obtained||[],rolled:o.rolled||[],player:o.player,filters:o.filters,ignoreSkillLevels:e,missing:{items:new Set,itemGroups:[],itemGroupKeys:new Set,skills:[],skillKeys:new Set,prereqQuests:[],prereqQuestKeys:new Set,questPointsRequired:0,questPointsCurrent:o.player?.questPoints??0}}}async function z(){if(!o.player)return`
            <h1>Quests</h1>
            <p>Please upload your files and player name on the Upload page first.</p>
        `;await o.ensureItemsLoaded();const e=new Map((o.items||[]).map(t=>[t.id,t.name])),n=Object.keys(G).sort((t,l)=>t.localeCompare(l)),i=[];for(const t of n){const u=(o.player.quests?.[t]??0)===2;let d=!1,h=!1,y={items:[],itemGroups:[]};if(!u){const b=E(t);if(b?.fn){const k=I();try{d=await b.fn(k)}catch(C){console.warn(`[quests] Failed requirement check for: ${t}`,C)}if(!d){y=L(k,e);try{const C=I({ignoreSkillLevels:!0});h=await b.fn(C)}catch(C){console.warn(`[quests] Failed trainable requirement check for: ${t}`,C)}}}else{const k=b?.expectedNames??[w(t)];console.warn(`[quests] Missing requirement check for: ${t}. Expected one of: ${k.join(", ")}`)}}let f="quest-status-blocked",g="Not completed";u?(f="quest-status-complete",g="Completed"):d?(f="quest-status-ready",g="Can complete"):h&&(f="quest-status-trainable",g="Train levels"),!u&&!d&&A(y),i.push({questName:t,isCompleted:u,isDoable:d,isTrainable:h,missingItems:y,statusClass:f,statusLabel:g})}const s=!!o.filters?.questSortByMissingItems;i.sort((t,l)=>{if(s){const h=$(t.missingItems),y=$(l.missingItems);if(h!==y)return h?1:-1;const f=S(t.missingItems),g=S(l.missingItems);if(f!==g)return f-g}const u=t.isDoable&&!t.isCompleted?0:t.isTrainable&&!t.isCompleted?1:2,d=l.isDoable&&!l.isCompleted?0:l.isTrainable&&!l.isCompleted?1:2;return u!==d?u-d:t.questName.localeCompare(l.questName)});const a=i.map(t=>{const l=!t.isCompleted&&!t.isDoable?A(t.missingItems):"";return`
            <div class="quest-row ${t.statusClass}"
                data-completed="${t.isCompleted?"true":"false"}"
                data-doable="${t.isDoable?"true":"false"}"
                data-trainable="${t.isTrainable?"true":"false"}"
                data-name="${t.questName.toLowerCase()}">
                <div class="quest-name">${t.questName}</div>
                <div class="quest-status">${t.statusLabel}</div>
                ${l}
            </div>
        `}),r=(o.filters?.questSearch??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;"),p=o.player?.quests?.["Shield of Arrav"]===2,c=(o.filters?.heroesQuestGang??"phoenix")!=="black_arm";return`
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
                <input type="checkbox" id="hazeelCultLocked" ${o.filters?.hazeelCultLocked?"checked":""}>
                Hazeel Cult locked
            </label>
            <label class="quest-filter">
                <span>Sort A-Z</span>
                <span class="toggle-switch">
                    <input type="checkbox" id="questSortToggle" ${s?"checked":""} aria-label="Sort quests by least missing items">
                    <span class="toggle-slider" aria-hidden="true"></span>
                </span>
                <span>Least missing items</span>
            </label>
            ${p?`
                <label class="quest-filter quest-filter-gang">
                    <span>Black arm gang</span>
                    <span class="toggle-switch">
                        <input type="checkbox" id="heroesQuestGangToggle" ${c?"checked":""} aria-label="Which Shield of Arrav gang?">
                        <span class="toggle-slider" aria-hidden="true"></span>
                    </span>
                    <span>Phoenix gang</span>
                </label>
            `:""}
        </div>
        <div class="quest-list" id="questList">
            ${a.join("")}
        </div>
    `}function F(e){const n=o.filters?.hideCompletedQuests,i=o.filters?.hideIncompletableQuests,s=(o.filters?.questSearch||"").trim().toLowerCase(),a=e.querySelectorAll(".quest-row");for(const r of a){const p=r.dataset.completed==="true",m=r.dataset.doable==="true",c=r.dataset.trainable==="true",t=r.dataset.name||"",l=!s||t.includes(s),d=n&&p||i&&(!p&&!m&&!c)||!l;r.style.display=d?"none":""}}async function q(e,n={}){const i={...o.filters,...e};if(await o.setFilters(i),n.rerender){window.dispatchEvent(new PopStateEvent("popstate"));return}const s=document.getElementById("questList");s&&F(s)}let Q=null;function j(){T();const e=document.getElementById("questList");e&&F(e);const n=async s=>{s.target.id==="hideCompletedQuests"&&await q({hideCompletedQuests:s.target.checked}),s.target.id==="hideIncompletableQuests"&&await q({hideIncompletableQuests:s.target.checked}),s.target.id==="hazeelCultLocked"&&await q({hazeelCultLocked:s.target.checked},{rerender:!0}),s.target.id==="heroesQuestGangToggle"&&await q({heroesQuestGang:s.target.checked?"phoenix":"black_arm"},{rerender:!0}),s.target.id==="questSortToggle"&&await q({questSortByMissingItems:s.target.checked},{rerender:!0})},i=async s=>{s.target.id==="questSearch"&&await q({questSearch:s.target.value})};document.addEventListener("change",n),document.addEventListener("input",i),Q=()=>{document.removeEventListener("change",n),document.removeEventListener("input",i)}}function T(){typeof Q=="function"&&Q(),Q=null}export{z as default,j as init,T as teardown};
