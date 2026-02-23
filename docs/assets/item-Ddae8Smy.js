import{f as r,c as g,d as w,e as $,a as y,p as u,N as j,g as O,h as f}from"./index-BJviACmJ.js";async function B(){const e=r.obtained,s=r.rolled;if(!e||!s)return"<h1>Please upload your files on the Upload page first.</h1>";const l=new URLSearchParams(window.location.search).get("id");if(!l)return"<h1>No item selected</h1>";await r.ensureItemsLoaded();const o=r.items,n=o.find(a=>a.id==l);if(!n||g(n))return"<h1>Item not found</h1>";const c=await k(n,n.sources),t=R(n.processable,o);return`
        <h1>${n.name}</h1>

        <div class="item-header">
            <img src="/images/${n.image}" style="margin: 1rem" />
            <a href="https://oldschool.runescape.wiki/w/${n.name}" target="_blank">
                <img src="/images/wiki.png" style="width: 32px" />
            </a>
        </div>

        <h2>Where to get it</h2>
        ${c}

        <h2>Processable into:</h2>
        ${t}
    `}async function k(e,s={}){const d=["drops","other","shops","spawns"],l=[];for(const o of d)l.push(`
            <div class="source-section">
                <h3>${S(o)}</h3>
                ${await N(o,s[o],e)}
            </div>
        `);return l.join("")}function S(e){return e.charAt(0).toUpperCase()+e.slice(1)}async function N(e,s,d){if(!s||Object.keys(s).length===0)return"<p><em>No data.</em></p>";const l=new URLSearchParams(window.location.search),o=Number(l.get("id"));if(e==="drops"){const n=[];for(const[t,a]of Object.entries(s)){const i=r.filters?.isSlayerLocked&&w(d,t,a);if($(t,r)){n.push({name:t,data:a,obtainable:!1});continue}const h=!i&&await y(t,r);n.push({name:t,data:a,obtainable:h})}return n.sort((t,a)=>{if(t.obtainable!==a.obtainable)return t.obtainable?-1:1;const i=u(t.data.droprate),h=u(a.data.droprate);return h!==i?h-i:t.name.localeCompare(a.name)}),`
            <table class="osrs-table">
                <tr>
                    <th>Source</th>
                    <th>Droprate</th>
                    <th>Obtainable?</th>
                </tr>
                ${n.map(({name:t,data:a,obtainable:i})=>`
            <tr>
                <td><a href="${j[t]?.wiki||"#"}" target="_blank">${t}</a></td>
                <td>${a.droprate}</td>
                <td>${i?b():p()}</td>
            </tr>
        `).join("")}
            </table>
        `}if(e==="other"){const n=[];for(const[c,t]of Object.entries(s)){const{notes:a,rule:i}=t,h=O(t,r)?!1:await f(i,r);n.push(`
                <tr>
                    <td>${c}</td>
                    <td>${a||""}</td>
                    <td>${h?b():p()}</td>
                </tr>
            `)}return`
            <table class="osrs-table">
                <tr>
                    <th>How</th>
                    <th>Notes</th>
                    <th>Obtainable?</th>
                </tr>
                ${n.join("")}
            </table>
        `}if(e==="shops"){const n=[];for(const[c,t]of Object.entries(s)){let a=!1;r.rolled.includes(o)&&(typeof t=="string"?a=await f(t,r):typeof t=="object"&&(a=await f(t,r))),n.push(`
                <tr>
                    <td>${m(t)}</td>
                    <td>${a?b():p()}</td>
                </tr>
            `)}return`
            <table class="osrs-table">
                <tr><th>Requirement</th><th>Obtainable?</th></tr>
                ${n.join("")}
            </table>
        `}if(e==="spawns"){const n=[];for(const[c,t]of Object.entries(s)){let a=!1;r.rolled.includes(o)&&(typeof t=="string"?a=await f(t,r):typeof t=="object"&&(a=await f(t,r))),n.push(`
                <tr>
                    <td>${m(t)}</td>
                    <td>${a?b():p()}</td>
                </tr>
            `)}return`
            <table class="osrs-table">
                <tr><th>Requirement</th><th>Obtainable?</th></tr>
                ${n.join("")}
            </table>
        `}}function R(e={},s){return!e||Object.keys(e).length===0?"<p><em>Not processable.</em></p>":`
        <table class="osrs-table">
            <tr><th>Creates</th><th>Ingredients</th></tr>
            ${Object.entries(e).map(([d,l])=>{const o=s.find(t=>t.id==d),c=l.split(",").map(t=>{const a=s.find(i=>i.id==t);return a?`<a onclick="navigate('/item?id=${t}')">${a.name}</a>`:t}).join(", ");return`
                    <tr>
                        <td><a onclick="navigate('/item?id=${d}')">${o.name}</a></td>
                        <td>${c}</td>
                    </tr>
                `}).join("")}
        </table>
    `}function b(){return'<span class="obtainable yes">✔</span>'}function p(){return'<span class="obtainable no">✘</span>'}function m(e){return e?typeof e=="string"?e:e.any?"Any: "+e.any.join(", "):e.all?"All: "+e.all.map(s=>typeof s=="object"?JSON.stringify(s):s).join(", "):e.has!==void 0?`Has item ${e.has}`:JSON.stringify(e):""}export{B as default};
