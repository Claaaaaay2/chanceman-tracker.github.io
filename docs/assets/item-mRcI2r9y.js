import{f as r,c as g,d as w,e as $,a as y,p as u,N as j,g as O,h as p,j as S}from"./index-B0_DWJKU.js";async function I(){const e=r.obtained,s=r.rolled;if(!e||!s)return"<h1>Please upload your files on the Upload page first.</h1>";const l=new URLSearchParams(window.location.search).get("id");if(!l)return"<h1>No item selected</h1>";await r.ensureItemsLoaded();const i=r.items,a=i.find(n=>n.id==l);if(!a||g(a))return"<h1>Item not found</h1>";const c=await k(a,a.sources),t=P(a.processable,i);return`
        <h1>${a.name}</h1>

        <div class="item-header">
            <img src="/images/${a.image}" style="margin: 1rem" />
            <a href="https://oldschool.runescape.wiki/w/${a.name}" target="_blank">
                <img src="/images/wiki.png" style="width: 32px" />
            </a>
        </div>

        <h2>Where to get it</h2>
        ${c}

        <h2>Processable into:</h2>
        ${t}
    `}async function k(e,s={}){const d=["drops","other","shops","spawns"],l=[];for(const i of d)l.push(`
            <div class="source-section">
                <h3>${N(i)}</h3>
                ${await R(i,s[i],e)}
            </div>
        `);return l.join("")}function N(e){return e.charAt(0).toUpperCase()+e.slice(1)}async function R(e,s,d){if(!s||Object.keys(s).length===0)return"<p><em>No data.</em></p>";const l=new URLSearchParams(window.location.search),i=Number(l.get("id"));if(e==="drops"){const a=[];for(const[t,n]of Object.entries(s)){const o=r.filters?.isSlayerLocked&&w(d,t,n);if($(t,r)){a.push({name:t,data:n,obtainable:!1});continue}const h=!o&&await y(t,r);a.push({name:t,data:n,obtainable:h})}return a.sort((t,n)=>{if(t.obtainable!==n.obtainable)return t.obtainable?-1:1;const o=u(t.data.droprate),h=u(n.data.droprate);return h!==o?h-o:t.name.localeCompare(n.name)}),`
            <table class="osrs-table">
                <tr>
                    <th>Source</th>
                    <th>Droprate</th>
                    <th>Obtainable?</th>
                </tr>
                ${a.map(({name:t,data:n,obtainable:o})=>`
            <tr>
                <td><a href="${j[t]?.wiki||"#"}" target="_blank">${t}</a></td>
                <td>${n.droprate}</td>
                <td>${o?b():f()}</td>
            </tr>
        `).join("")}
            </table>
        `}if(e==="other"){const a=[];for(const[c,t]of Object.entries(s)){const{notes:n,rule:o}=t,h=O(t,r)?!1:await p(o,r);a.push(`
                <tr>
                    <td>${c}</td>
                    <td>${n||""}</td>
                    <td>${h?b():f()}</td>
                </tr>
            `)}return`
            <table class="osrs-table">
                <tr>
                    <th>How</th>
                    <th>Notes</th>
                    <th>Obtainable?</th>
                </tr>
                ${a.join("")}
            </table>
        `}if(e==="shops"){const a=[];for(const[c,t]of Object.entries(s)){let n=!1;r.rolled.includes(i)&&(typeof t=="string"?n=await p(t,r):typeof t=="object"&&(n=await p(t,r))),a.push(`
                <tr>
                    <td>${m(t)}</td>
                    <td>${n?b():f()}</td>
                </tr>
            `)}return`
            <table class="osrs-table">
                <tr><th>Requirement</th><th>Obtainable?</th></tr>
                ${a.join("")}
            </table>
        `}if(e==="spawns"){const a=[],c=new Set((r.rolled||[]).map(Number));for(const[t,n]of Object.entries(s)){const h=c.has(Number(d.id))||await S(n,r);a.push(`
                <tr>
                    <td>${m(n)}</td>
                    <td>${h?b():f()}</td>
                </tr>
            `)}return`
            <table class="osrs-table">
                <tr><th>Requirement</th><th>Obtainable?</th></tr>
                ${a.join("")}
            </table>
        `}}function P(e={},s){return!e||Object.keys(e).length===0?"<p><em>Not processable.</em></p>":`
        <table class="osrs-table">
            <tr><th>Creates</th><th>Ingredients</th></tr>
            ${Object.entries(e).map(([d,l])=>{const i=s.find(t=>t.id==d),c=l.split(",").map(t=>{const n=s.find(o=>o.id==t);return n?`<a onclick="navigate('/item?id=${t}')">${n.name}</a>`:t}).join(", ");return`
                    <tr>
                        <td><a onclick="navigate('/item?id=${d}')">${i.name}</a></td>
                        <td>${c}</td>
                    </tr>
                `}).join("")}
        </table>
    `}function b(){return'<span class="obtainable yes">✔</span>'}function f(){return'<span class="obtainable no">✘</span>'}function m(e){return e?typeof e=="string"?e:e.any?"Any: "+e.any.join(", "):e.all?"All: "+e.all.map(s=>typeof s=="object"?JSON.stringify(s):s).join(", "):e.has!==void 0?`Has item ${e.has}`:JSON.stringify(e):""}export{I as default};
