import{f as y}from"./playerApi-ls5qQEYU.js";import{f as o,h as b}from"./index-CoGxWBTG.js";import"./questPoints-DcKLxK_Y.js";function h(){const t=sessionStorage.getItem("uploadReturnPath");if(!t)return"/items";const e=t.split("?")[0].split("#")[0];return e==="/upload"||e==="/reupload"?"/items":t}function S(){return`
        <h1>Reupload Files</h1>

        <p><strong>Replace your chanceman_obtained.json and chanceman_rolled.json files.</strong></p>

        <p>Location:<br>
        C:\\Users\\[user]\\.runelite\\chanceman\\[osrs-account]\\chanceman_obtained.json<br>
        C:\\Users\\[user]\\.runelite\\chanceman\\[osrs-account]\\chanceman_rolled.json
        </p>

        <label>
            Obtained:<br>
            <input type="file" id="obtainedInput" accept=".json">
        </label>
        <br><br>

        <label>
            Rolled:<br>
            <input type="file" id="rolledInput" accept=".json">
        </label>
        <br><br>

        <label>
            Player name: (Only works with Runelite's <a href="https://oldschool.runescape.wiki/w/RuneScape:WikiSync">WikiSync</a>)<br>
            <input type="text" id="playerName" placeholder="OSRS username" value="${o.player?.name??""}">
        </label>
        <br><br>

        <div class="form-actions">
            <button id="saveBtn">Save & Continue</button>
            <span id="formLoading" class="form-loading" aria-live="polite">
                <span class="spinner" aria-hidden="true"></span>
                <span>Processing files...</span>
            </span>
        </div>

        <p id="status"></p>
    `}document.addEventListener("click",async t=>{if(window.location.pathname!=="/reupload"||t.target.id!=="saveBtn")return;const e=document.getElementById("app"),r=e.querySelector("#rolledInput"),l=e.querySelector("#obtainedInput"),i=e.querySelector("#playerName"),s=e.querySelector("#status"),d=e.querySelector("#formLoading"),m=[r,l,i,e.querySelector("#saveBtn")],c=r.files[0],p=l.files[0],u=(a,n)=>{e.classList.toggle("upload-busy",a),d.classList.toggle("active",a),m.forEach(f=>{f.disabled=a}),n!==void 0&&(s.textContent=n)};try{if(u(!0,"Reading files..."),await new Promise(requestAnimationFrame),c){const n=JSON.parse(await c.text());await o.setRolled(n)}if(p){const n=JSON.parse(await p.text());await o.setObtained(n)}if(i.value){s.textContent="Fetching player data...";const n=await y(i.value);await o.setPlayer(n)}b(o),window.__itemsPageData=null,s.textContent="Saved! Redirecting...";const a=h();sessionStorage.removeItem("uploadReturnPath"),history.pushState(null,"",a),window.dispatchEvent(new PopStateEvent("popstate"))}catch(a){console.error(a),s.textContent=a.message||"Error reading files!"}finally{u(!1)}});document.addEventListener("keydown",t=>{if(window.location.pathname!=="/reupload"||t.key!=="Enter"||t.target?.id!=="playerName")return;const r=document.getElementById("app")?.querySelector("#saveBtn");!r||r.disabled||(t.preventDefault(),r.click())});export{S as default};
