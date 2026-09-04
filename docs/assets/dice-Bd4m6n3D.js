import{f as o,a as W,N as E,b as q,c as A}from"./index-DM_DUzhz.js";import{a as T,g as C,b as j}from"./npcDropEntries-B0_d72SU.js";const U=34,N=132,B=1700,v=38,M=1900,z=new Set(["Holiday","exclude-from-dice"]),V=new Set(["Mystery box Entrana","Mystery box Free-to-play","Mystery box Members","Bounty crate (tier 1)","Bounty crate (tier 2)","Bounty crate (tier 3)","Bounty crate (tier 4)","Bounty crate (tier 5)","Bounty crate (tier 6)","Bounty crate (tier 7)","Bounty crate (tier 8)","Bounty crate (tier 9)"]);let x=null;function p(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function b(e){return Array.isArray(e)?e.map(t=>t&&typeof t=="object"?t.id:t):[]}function X({items:e,obtained:t,rolled:n,filters:i}){const c=Array.isArray(e)?e:[],s=b(t),d=b(n),a=i||{};return{items:c,obtained:s,rolled:d,player:o.player,filters:a,cacheRules:!0,ruleEvalCache:new Map,ruleEvalKey:"dice",npcReachCache:new Map,npcObtainableCache:new Map,missing:{items:new Set,itemGroups:[],itemGroupKeys:new Set,skills:[],skillKeys:new Set,prereqQuests:[],prereqQuestKeys:new Set,questPointsRequired:0,questPointsCurrent:o.player?.questPoints??0}}}function Y(e,t,n){return!(!e||n.has(e.id)||A(e)||e.tags?.some(i=>z.has(i))||!t?.hasFlatpacks&&e.tags?.includes("flatpack")||!t?.hasItemsets&&e.tags?.includes("itemset")||t?.hideClue&&e.tags?.includes("clue-reward-only"))}function D(e,t=-1){if(e<=0)return-1;if(e===1)return 0;let n=t;for(;n===t;)n=Math.floor(Math.random()*e);return n}function y(e){const t=[...e];for(let n=t.length-1;n>0;n--){const i=Math.floor(Math.random()*(n+1));[t[n],t[i]]=[t[i],t[n]]}return t}function G(e){let t=y(e);const n=()=>{t=y(e)};return(i=[])=>{t.length||n();const c=new Set((i||[]).filter(a=>a!=null));let s=t.findIndex(a=>!c.has(a.id));s<0&&(n(),s=t.findIndex(a=>!c.has(a.id))),s<0&&(s=0);const[d]=t.splice(s,1);return d}}function K(e){let t=y(e);const n=()=>{t=y(e)};return(i=[])=>{t.length||n();const c=new Set((i||[]).filter(a=>!!a));let s=t.findIndex(a=>!c.has(a));s<0&&(n(),s=t.findIndex(a=>!c.has(a))),s<0&&(s=0);const[d]=t.splice(s,1);return d}}async function R(e,t){await new Promise(n=>{let i=!1;const c=()=>{i||(i=!0,e.removeEventListener("transitionend",s),clearTimeout(d),n())},s=a=>{a.target===e&&c()},d=setTimeout(c,t);e.addEventListener("transitionend",s)})}function Q(e){return e?.image?`/images/${e.image}`:"/images/placeholder.png"}function L(e,t="No obtainable items"){if(!e)return`<div class="dice-chip"><span class="dice-chip-label">${p(t)}</span></div>`;const n=e.name||"Unknown item",i=Q(e);return`
        <div class="dice-chip" title="${p(n)}">
            <img class="dice-chip-image" src="${i}" alt="${p(n)}">
        </div>
    `}function J(e,t){if(!e)return;const n=e.parentElement?.clientWidth||N,i=Math.max(0,(n-N)/2);e.innerHTML=`
        <div class="dice-chip dice-chip--spacer" style="width:${i}px;min-width:${i}px;" aria-hidden="true"></div>
        ${L(t)}
        <div class="dice-chip dice-chip--spacer" style="width:${i}px;min-width:${i}px;" aria-hidden="true"></div>
    `,e.style.transition="none",e.style.transform="translateX(0px)"}function Z(e,t){if(!e)return;const n=e.parentElement?.clientHeight||v,i=Math.max(0,(n-v)/2);e.innerHTML=`
        <div class="dice-row dice-row--spacer" style="height:${i}px;min-height:${i}px;" aria-hidden="true"></div>
        <div class="dice-row">${p(t)}</div>
        <div class="dice-row dice-row--spacer" style="height:${i}px;min-height:${i}px;" aria-hidden="true"></div>
    `,e.style.transition="none",e.style.transform="translateY(0px)"}function ee(e,t){const n=Math.max(10,Math.min(U,e.length*2)),i=Math.max(5,Math.min(9,e.length+1)),c=n,s=i,d=e.filter(l=>l.id!==t.id);if(d.length>=c+s){const l=y(d).slice(0,c+s);return{items:[...l.slice(0,c),t,...l.slice(c)],targetIndex:c}}const r=[],g=G(e);let u=null;for(let l=0;l<n;l++){const m=g([u,t.id]);r.push(m),u=m.id}const h=r.length;r.push(t),u=t.id;for(let l=0;l<i;l++){const m=g([u,t.id]);r.push(m),u=m.id}return{items:r,targetIndex:h}}function te(e,t){const n=e.map(f=>f.npcName);if(!n.length)return{labels:[],targetIndex:-1};const i=n[t],c=Math.max(12,Math.min(32,n.length*3)),s=Math.max(5,Math.min(9,n.length+1)),d=c,a=s,r=n.filter(f=>f!==i);if(r.length>=d+a){const f=y(r).slice(0,d+a);return{labels:[...f.slice(0,d),i,...f.slice(d)],targetIndex:d}}const u=[],h=K(n);let l="";for(let f=0;f<c;f++){const I=h([l,i]);u.push(I),l=I}const m=u.length;u.push(i),l=i;for(let f=0;f<s;f++){const I=h([l,i]);u.push(I),l=I}return{labels:u,targetIndex:m}}async function ne(e,t,n){if(!e||!t.length)return;const i=e.parentElement?.clientWidth||N,c=Math.max(0,(i-N)/2);e.innerHTML=[`<div class="dice-chip dice-chip--spacer" style="width:${c}px;min-width:${c}px;" aria-hidden="true"></div>`,...t.map(r=>L(r)),`<div class="dice-chip dice-chip--spacer" style="width:${c}px;min-width:${c}px;" aria-hidden="true"></div>`].join(""),e.style.transition="none",e.style.transform="translateX(0px)",e.offsetWidth;const s=e.querySelector(".dice-chip:not(.dice-chip--spacer)")?.getBoundingClientRect().width||N,a=Math.max(0,Math.min(t.length-1,Number.isFinite(n)?n:t.length-1))*s;e.style.transition=`transform ${B}ms cubic-bezier(0.12, 0.82, 0.2, 1)`,e.style.transform=`translateX(-${a}px)`,await R(e,B+150)}async function ie(e,t,n){if(!e||!t.length)return;const i=e.parentElement?.clientHeight||v,c=Math.max(0,(i-v)/2);e.innerHTML=[`<div class="dice-row dice-row--spacer" style="height:${c}px;min-height:${c}px;" aria-hidden="true"></div>`,...t.map(r=>`<div class="dice-row">${p(r)}</div>`),`<div class="dice-row dice-row--spacer" style="height:${c}px;min-height:${c}px;" aria-hidden="true"></div>`].join(""),e.style.transition="none",e.style.transform="translateY(0px)",e.offsetWidth;const s=e.querySelector(".dice-row:not(.dice-row--spacer)")?.getBoundingClientRect().height||v,a=Math.max(0,Math.min(t.length-1,Number.isFinite(n)?n:t.length-1))*s;e.style.transition=`transform ${M}ms cubic-bezier(0.12, 0.82, 0.2, 1)`,e.style.transform=`translateY(-${a}px)`,await R(e,M+150)}async function S(e,t){await o.setFilters({...o.filters,diceSelectedItemId:e,diceSelectedNpcName:t})}async function ae(){const e=o.filters||{},t=b(o.obtained||[]),n=b(o.rolled||[]),i=new Set(t),c=o.items||[],s=X({items:c,obtained:t,rolled:n,filters:e}),d=[];for(const a of c)Y(a,e,i)&&await q(a,s)&&d.push(a);return d.sort((a,r)=>a.name.localeCompare(r.name)),{candidates:d,ctx:s}}async function ce(){const{entries:e,rolledSet:t}=await j({items:o.items||[],obtained:o.obtained||[],rolled:o.rolled||[],player:o.player,filters:o.filters||{}});return{entries:e.filter(i=>!V.has(i.npcName)),rolledSet:t}}async function F(e,t){if(!e)return'<p class="empty-state">No obtainable items left for your current filters.</p>';const n=e.image?`/images/${e.image}`:"/images/placeholder.png",i=Object.entries(e.sources?.drops||{}),s=(await Promise.all(i.map(async([a,r])=>({npcName:a,drops:r,obtainable:await W(a,t)})))).filter(a=>a.obtainable).map(a=>({npcName:a.npcName,drops:a.drops,rateValue:C(a.drops),rateLabel:T(a.drops)})).sort((a,r)=>a.rateValue!==r.rateValue?r.rateValue-a.rateValue:a.npcName.localeCompare(r.npcName)),d=s.length?`
            <div class="dice-item-sources">
                <h3 class="dice-item-sources-title">Drop sources</h3>
                <div class="dice-npc-item-list">
                    ${s.map(a=>{const r=E[a.npcName]?.wiki;return r?`
                                <a class="dice-npc-item" href="${r}" target="_blank" rel="noopener noreferrer">
                                    <span class="dice-npc-item-name">${p(a.npcName)}</span>
                                    <span class="dice-item-source-rate">${p(a.rateLabel||"")}</span>
                                </a>
                            `:`
                            <div class="dice-npc-item">
                                <span class="dice-npc-item-name">${p(a.npcName)}</span>
                                <span class="dice-item-source-rate">${p(a.rateLabel||"")}</span>
                            </div>
                        `}).join("")}
                </div>
            </div>
        `:'<p class="dice-item-sources-empty">No obtainable drop sources for this item with current filters.</p>';return`
        <div class="dice-result-card">
            <a class="dice-result-link" data-link href="/item?id=${e.id}">
                <img class="dice-result-image" src="${n}" alt="${p(e.name)}">
                <span class="dice-result-name">${p(e.name)}</span>
            </a>
            ${d}
        </div>
    `}function H(e,t){if(!e)return'<p class="empty-state">No reachable NPCs with remaining drops for your current filters.</p>';const n=E[e.npcName]?.wiki,i=n?`<a href="${n}" target="_blank" rel="noopener noreferrer">${p(e.npcName)}</a>`:p(e.npcName),c=e.items.slice().sort((s,d)=>{const a=C(s.sources?.drops?.[e.npcName]),r=C(d.sources?.drops?.[e.npcName]);return a!==r?r-a:s.name.localeCompare(d.name)}).map(s=>{const d=s.image?`/images/${s.image}`:"/images/placeholder.png",a=s.sources?.drops?.[e.npcName],r=T(a),g=t.has(s.id)?'<span class="badge rolled">Rolled</span>':"";return`
                <a class="dice-npc-item" data-link href="/item?id=${s.id}">
                    <img class="dice-npc-item-image" src="${d}" alt="${p(s.name)}">
                    <span class="dice-npc-item-name">${p(s.name)}${p(r)}</span>
                    ${g}
                </a>
            `}).join("");return`
        <div class="dice-result-card">
            <div class="dice-result-header">
                <h3>${i}</h3>
                <span>${e.items.length} remaining item${e.items.length===1?"":"s"}</span>
            </div>
            <div class="dice-npc-item-list">
                ${c}
            </div>
        </div>
    `}function w(e,t){const n=e.busy;t.rollItemBtn.disabled=n||e.itemCandidates.length===0,t.obtainedBtn.disabled=n||!e.selectedItemId,t.rollNpcBtn.disabled=n||e.npcCandidates.length===0,t.finishedBtn.disabled=n||!e.selectedNpcName}async function se(e,t){const n=e.itemCandidates.find(c=>c.id===e.selectedItemId)||null,i=e.npcCandidates.find(c=>c.npcName===e.selectedNpcName)||null;J(t.itemTrack,n),Z(t.npcTrack,i?i.npcName:"No reachable NPCs"),t.itemDetails.innerHTML=await F(n,e.itemCtx),t.npcDetails.innerHTML=H(i,e.rolledSet),w(e,t)}async function P(e,t){const n=e.itemCandidates.find(c=>c.id===e.selectedItemId)||null,i=e.npcCandidates.find(c=>c.npcName===e.selectedNpcName)||null;t.itemDetails.innerHTML=await F(n,e.itemCtx),t.npcDetails.innerHTML=H(i,e.rolledSet),w(e,t)}async function $(e,t,{autoPick:n=!1}={}){const[i,c]=await Promise.all([ae(),ce()]);e.itemCandidates=i.candidates,e.itemCtx=i.ctx,e.npcCandidates=c.entries,e.rolledSet=c.rolledSet;const s=o.filters?.diceSelectedItemId,d=s==null?null:Number(s),a=Number.isFinite(d)?d:null,r=String(o.filters?.diceSelectedNpcName||""),g=a!==null&&e.itemCandidates.some(m=>m.id===a),u=r&&e.npcCandidates.some(m=>m.npcName===r);let h=g?a:null,l=u?r:"";!h&&n&&e.itemCandidates.length&&(h=e.itemCandidates[Math.floor(Math.random()*e.itemCandidates.length)].id),!l&&n&&e.npcCandidates.length&&(l=e.npcCandidates[Math.floor(Math.random()*e.npcCandidates.length)].npcName),e.selectedItemId=h,e.selectedNpcName=l,(a!==h||r!==l)&&await S(h,l),await se(e,t)}async function k(e,t){if(!e.itemCandidates.length)return;const n=e.itemCandidates.findIndex(d=>d.id===e.selectedItemId),i=D(e.itemCandidates.length,n),c=e.itemCandidates[i],s=ee(e.itemCandidates,c);await ne(t.itemTrack,s.items,s.targetIndex),e.selectedItemId=c.id,await S(e.selectedItemId,e.selectedNpcName),await P(e,t)}async function O(e,t){if(!e.npcCandidates.length)return;const n=e.npcCandidates.findIndex(d=>d.npcName===e.selectedNpcName),i=D(e.npcCandidates.length,n),c=e.npcCandidates[i],s=te(e.npcCandidates,i);await ie(t.npcTrack,s.labels,s.targetIndex),e.selectedNpcName=c.npcName,await S(e.selectedItemId,e.selectedNpcName),await P(e,t)}async function _(e){const t=b(o.obtained||[]),n=new Set(t);let i=!1;for(const c of e)n.has(c)||(n.add(c),i=!0);return i?(await o.setObtained([...n]),!0):!1}async function de(e,t){const n=e.itemCandidates.find(i=>i.id===e.selectedItemId);n&&(await _([n.id]),await $(e,t,{autoPick:!1}),e.itemCandidates.length&&await k(e,t))}async function re(e,t){const n=e.npcCandidates.find(i=>i.npcName===e.selectedNpcName);n&&(await _(n.items.map(i=>i.id)),await $(e,t,{autoPick:!1}),e.npcCandidates.length&&await O(e,t))}async function ue(){return!o.player||!o.obtained||!o.rolled?`
            <h1>Random picker</h1>
            <p>Please upload your files and player name on the Upload page first.</p>
        `:`
        <h1>Random picker</h1>
        <p class="dice-intro">Roll a random item and NPC target from currently obtainable content.</p>
        <div class="dice-grid">
            <section class="card dice-card">
                <h2>Next item</h2>
                <div class="dice-reel dice-reel--horizontal">
                    <div id="diceItemTrack" class="dice-reel-track dice-reel-track--horizontal"></div>
                    <div class="dice-reel-indicator dice-reel-indicator--horizontal" aria-hidden="true"></div>
                </div>
                <div class="dice-actions">
                    <button type="button" id="diceRollItemBtn">Roll item</button>
                    <button type="button" id="diceObtainedBtn">Obtained!</button>
                </div>
                <div id="diceItemDetails"></div>
            </section>
            <section class="card dice-card">
                <h2>Next NPC</h2>
                <div class="dice-reel dice-reel--vertical">
                    <div id="diceNpcTrack" class="dice-reel-track dice-reel-track--vertical"></div>
                    <div class="dice-reel-indicator dice-reel-indicator--vertical" aria-hidden="true"></div>
                </div>
                <div class="dice-actions">
                    <button type="button" id="diceRollNpcBtn">Roll NPC</button>
                    <button type="button" id="diceFinishedBtn">Finished!</button>
                </div>
                <div id="diceNpcDetails"></div>
            </section>
        </div>
    `}async function me(){le();const e={itemTrack:document.getElementById("diceItemTrack"),npcTrack:document.getElementById("diceNpcTrack"),rollItemBtn:document.getElementById("diceRollItemBtn"),obtainedBtn:document.getElementById("diceObtainedBtn"),rollNpcBtn:document.getElementById("diceRollNpcBtn"),finishedBtn:document.getElementById("diceFinishedBtn"),itemDetails:document.getElementById("diceItemDetails"),npcDetails:document.getElementById("diceNpcDetails")};if(Object.values(e).some(a=>!a))return;await o.ensureItemsLoaded();const t={busy:!1,itemCandidates:[],itemCtx:null,npcCandidates:[],rolledSet:new Set,selectedItemId:null,selectedNpcName:""},n=async a=>{if(!t.busy){t.busy=!0,w(t,e);try{await a()}finally{t.busy=!1,w(t,e)}}};await n(async()=>{await $(t,e,{autoPick:!0})});const i=async()=>n(async()=>{await k(t,e)}),c=async()=>n(async()=>{await de(t,e)}),s=async()=>n(async()=>{await O(t,e)}),d=async()=>n(async()=>{await re(t,e)});e.rollItemBtn.addEventListener("click",i),e.obtainedBtn.addEventListener("click",c),e.rollNpcBtn.addEventListener("click",s),e.finishedBtn.addEventListener("click",d),x=()=>{e.rollItemBtn.removeEventListener("click",i),e.obtainedBtn.removeEventListener("click",c),e.rollNpcBtn.removeEventListener("click",s),e.finishedBtn.removeEventListener("click",d)}}function le(){typeof x=="function"&&x(),x=null}export{ue as default,me as init,le as teardown};
