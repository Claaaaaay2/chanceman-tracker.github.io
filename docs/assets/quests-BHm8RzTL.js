import{Q as D}from"./questPoints-DcKLxK_Y.js";import{f as o,R as P}from"./index-Q3tWmWIg.js";const E={"Another Cook's Quest":"canCompleteRFDAnotherCooksQuest",Culinaromancer:"canCompleteRecipeForDisasterCulinaromancer","Evil Dave":"canCompleteRFDFreeingEvilDave","King Awowogei":"canCompleteRFDFreeingKingAwowogei","Lumbridge Guide":"canCompleteRFDFreeingTheLumbridgeGuide","Mountain Dwarf":"canCompleteRFDFreeingTheMountainDwarf","Pirate Pete":"canCompleteRFDFreeingPiratePete","Sir Amik Varze":"canCompleteRFDFreeingSirAmikVarse","Skrach Uglogwee":"canCompleteRFDFreeingSkrachUglologwee","Wartface & Bentnoze":"canCompleteRFDFreeingTheGoblinGenerals"},G={"Demon Slayer":"An untradable Waterskin(3) can be used instead of a Bucket of water. Buy this at Ali Morrisane's."};function M(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function F(e){return e.replace(/[’']/g,"").replace(/&/g,"and").toLowerCase().replace(/[^a-z0-9]/g,"")}function w(e){return`canComplete${e.replace(/[’']/g,"").replace(/&/g,"and").split(/[^A-Za-z0-9]+/g).filter(Boolean).map(i=>i.charAt(0).toUpperCase()+i.slice(1)).join("")}`}function v(e){return e.replace(/^canComplete/,"").replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/([A-Z])([A-Z][a-z])/g,"$1 $2").trim()}const T=new Map(Object.entries(P).filter(([e])=>e.startsWith("canComplete")).map(([e,n])=>[F(e.replace(/^canComplete/,"")),n]));function L(e){if(e.startsWith("Recipe for Disaster - ")){const i=e.replace("Recipe for Disaster - ",""),s=E[i];return s?{fn:P[s],expectedNames:[s]}:null}const n=[e,e.split(" - ")[0],e.split(":")[0]];for(const i of n){const s=F(i),a=T.get(s);if(a)return{fn:a,expectedNames:n.map(w)}}return{fn:null,expectedNames:n.map(w)}}function N(e,n){const i={skills:[],items:[],itemGroups:[],prereqQuests:[],questPointsRequired:e?.missing?.questPointsRequired??0,questPointsCurrent:e?.missing?.questPointsCurrent};Array.isArray(e?.missing?.skills)&&e.missing.skills.length&&(i.skills=[...e.missing.skills].sort((a,r)=>a.localeCompare(r)));const s=new Set;if(Array.isArray(e?.missing?.itemGroups)&&(i.itemGroups=e.missing.itemGroups.map(a=>{if(Array.isArray(a)){for(const r of a)s.add(r);return a.map(r=>n.get(r)??`Item ${r}`)}if(a?.options){for(const r of a.options)r.length===1&&s.add(r[0]);return{options:a.options.map(r=>r.map(m=>n.get(m)??`Item ${m}`))}}return[]})),e?.missing?.items?.size){for(const a of e.missing.items)s.has(a)||i.items.push(n.get(a)??`Item ${a}`);i.items.sort((a,r)=>a.localeCompare(r))}return Array.isArray(e?.missing?.prereqQuests)&&(i.prereqQuests=[...e.missing.prereqQuests].sort((a,r)=>a.localeCompare(r))),i}function A(e){const n=Array.isArray(e?.prereqQuests)?e.prereqQuests:[],i=Array.isArray(e?.skills)?e.skills:[],s=Array.isArray(e?.items)?e.items:[],a=Array.isArray(e?.itemGroups)?e.itemGroups:[],r=e?.questPointsRequired??0,m=e?.questPointsCurrent,d=[];if(n.length){const p=n.map(v);d.push(`Missing prerequisite quests: ${p.join(", ")}.`)}if(r&&typeof m=="number"){const p=Math.max(0,r-m);d.push(`Missing quest points: ${p} (need ${r}).`)}if(i.length&&d.push(`Missing levels: ${i.join(", ")}.`),s.length&&d.push(`Missing items: ${s.join(", ")}.`),a.length){const p=a.map(t=>Array.isArray(t)?`Any of: ${t.join(" / ")}`:t?.options?`Any of: ${t.options.map(u=>u.length>1?`(${u.join(" + ")})`:u[0]).join(" / ")}`:"").filter(Boolean).join("; ");d.push(`Missing item options: ${p}.`)}return d.length?d.map(p=>`<div class="quest-missing">${p}</div>`).join(""):'<div class="quest-missing">Missing requirements.</div>'}function S(e){if(!e)return 0;const n=Array.isArray(e.items)?e.items.length:0,i=Array.isArray(e.itemGroups)?e.itemGroups.length:0;return n+i}function $(e){return Array.isArray(e?.prereqQuests)&&e.prereqQuests.length>0}function I({ignoreSkillLevels:e=!1}={}){return{items:o.items,obtained:o.obtained||[],rolled:o.rolled||[],player:o.player,filters:o.filters,ignoreSkillLevels:e,missing:{items:new Set,itemGroups:[],itemGroupKeys:new Set,skills:[],skillKeys:new Set,prereqQuests:[],prereqQuestKeys:new Set,questPointsRequired:0,questPointsCurrent:o.player?.questPoints??0}}}async function B(){if(!o.player)return`
            <h1>Quests</h1>
            <p>Please upload your files and player name on the Upload page first.</p>
        `;await o.ensureItemsLoaded();const e=new Map((o.items||[]).map(t=>[t.id,t.name])),n=Object.keys(D).sort((t,l)=>t.localeCompare(l)),i=[];for(const t of n){const u=(o.player.quests?.[t]??0)===2;let c=!1,h=!1,y={items:[],itemGroups:[]};if(!u){const C=L(t);if(C?.fn){const k=I();try{c=await C.fn(k)}catch(b){console.warn(`[quests] Failed requirement check for: ${t}`,b)}if(!c){y=N(k,e);try{const b=I({ignoreSkillLevels:!0});h=await C.fn(b)}catch(b){console.warn(`[quests] Failed trainable requirement check for: ${t}`,b)}}}else{const k=C?.expectedNames??[w(t)];console.warn(`[quests] Missing requirement check for: ${t}. Expected one of: ${k.join(", ")}`)}}let f="quest-status-blocked",g="Not completed";u?(f="quest-status-complete",g="Completed"):c?(f="quest-status-ready",g="Can complete"):h&&(f="quest-status-trainable",g="Train levels"),!u&&!c&&A(y),i.push({questName:t,isCompleted:u,isDoable:c,isTrainable:h,missingItems:y,statusClass:f,statusLabel:g})}const s=!!o.filters?.questSortByMissingItems;i.sort((t,l)=>{if(s){const h=$(t.missingItems),y=$(l.missingItems);if(h!==y)return h?1:-1;const f=S(t.missingItems),g=S(l.missingItems);if(f!==g)return f-g}const u=t.isDoable&&!t.isCompleted?0:t.isTrainable&&!t.isCompleted?1:2,c=l.isDoable&&!l.isCompleted?0:l.isTrainable&&!l.isCompleted?1:2;return u!==c?u-c:t.questName.localeCompare(l.questName)});const a=i.map(t=>{const l=!t.isCompleted&&!t.isDoable?A(t.missingItems):"",u=o.filters?.isFreeToPlay?null:G[t.questName],c=u?`<span class="clue-step-info quest-info" tabindex="0" aria-label="Quest information" title="${M(u)}">i</span>`:"";return`
            <div class="quest-row ${t.statusClass}"
                data-completed="${t.isCompleted?"true":"false"}"
                data-doable="${t.isDoable?"true":"false"}"
                data-trainable="${t.isTrainable?"true":"false"}"
                data-name="${t.questName.toLowerCase()}">
                <div class="quest-name">${t.questName}${c}</div>
                <div class="quest-status">${t.statusLabel}</div>
                ${l}
            </div>
        `}),r=(o.filters?.questSearch??"").replace(/&/g,"&amp;").replace(/"/g,"&quot;"),m=o.player?.quests?.["Shield of Arrav"]===2,p=(o.filters?.heroesQuestGang??"phoenix")!=="black_arm";return`
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
            ${m?`
                <label class="quest-filter quest-filter-gang">
                    <span>Black arm gang</span>
                    <span class="toggle-switch">
                        <input type="checkbox" id="heroesQuestGangToggle" ${p?"checked":""} aria-label="Which Shield of Arrav gang?">
                        <span class="toggle-slider" aria-hidden="true"></span>
                    </span>
                    <span>Phoenix gang</span>
                </label>
            `:""}
        </div>
        <div class="quest-list" id="questList">
            ${a.join("")}
        </div>
    `}function R(e){const n=o.filters?.hideCompletedQuests,i=o.filters?.hideIncompletableQuests,s=(o.filters?.questSearch||"").trim().toLowerCase(),a=e.querySelectorAll(".quest-row");for(const r of a){const m=r.dataset.completed==="true",d=r.dataset.doable==="true",p=r.dataset.trainable==="true",t=r.dataset.name||"",l=!s||t.includes(s),c=n&&m||i&&(!m&&!d&&!p)||!l;r.style.display=c?"none":""}}async function q(e,n={}){const i={...o.filters,...e};if(await o.setFilters(i),n.rerender){window.dispatchEvent(new PopStateEvent("popstate"));return}const s=document.getElementById("questList");s&&R(s)}let Q=null;function H(){x();const e=document.getElementById("questList");e&&R(e);const n=async s=>{s.target.id==="hideCompletedQuests"&&await q({hideCompletedQuests:s.target.checked}),s.target.id==="hideIncompletableQuests"&&await q({hideIncompletableQuests:s.target.checked}),s.target.id==="hazeelCultLocked"&&await q({hazeelCultLocked:s.target.checked},{rerender:!0}),s.target.id==="heroesQuestGangToggle"&&await q({heroesQuestGang:s.target.checked?"phoenix":"black_arm"},{rerender:!0}),s.target.id==="questSortToggle"&&await q({questSortByMissingItems:s.target.checked},{rerender:!0})},i=async s=>{s.target.id==="questSearch"&&await q({questSearch:s.target.value})};document.addEventListener("change",n),document.addEventListener("input",i),Q=()=>{document.removeEventListener("change",n),document.removeEventListener("input",i)}}function x(){typeof Q=="function"&&Q(),Q=null}export{B as default,H as init,x as teardown};
