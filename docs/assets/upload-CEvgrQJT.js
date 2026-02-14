import{f as y}from"./playerApi-ls5qQEYU.js";import{f as s}from"./index-CoGxWBTG.js";import"./questPoints-DcKLxK_Y.js";function b(){const t=sessionStorage.getItem("uploadReturnPath");if(!t)return"/items";const e=t.split("?")[0].split("#")[0];return e==="/upload"||e==="/reupload"?"/items":t}function v(){return`
        <h1>Chanceman Tracker Setup</h1>

        <p><strong>Upload your chanceman_obtained.json and chanceman_rolled.json files.</strong></p>

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
            <input type="text" id="playerName" placeholder="OSRS username" value="${s.player?.name??""}">
        </label>
        <br><br>

        <div class="form-actions">
            <button id="saveBtn" title="Save & Continue">Save & Continue</button>
            <span id="formLoading" class="form-loading" aria-live="polite">
                <span class="spinner" aria-hidden="true"></span>
                <span>Processing files...</span>
            </span>
        </div>

        <p id="status"></p>
    `}document.addEventListener("click",async t=>{if(window.location.pathname!=="/upload"||t.target.id!=="saveBtn")return;const e=document.getElementById("app"),r=e.querySelector("#rolledInput"),l=e.querySelector("#obtainedInput"),i=e.querySelector("#playerName"),o=e.querySelector("#status"),d=e.querySelector("#formLoading"),m=[r,l,i,e.querySelector("#saveBtn")],c=r.files[0],p=l.files[0],u=(n,a)=>{e.classList.toggle("upload-busy",n),d.classList.toggle("active",n),m.forEach(f=>{f.disabled=n}),a!==void 0&&(o.textContent=a)};try{if(u(!0,"Reading files..."),await new Promise(requestAnimationFrame),c){const a=JSON.parse(await c.text());await s.setRolled(a)}if(p){const a=JSON.parse(await p.text());await s.setObtained(a)}if(i.value){o.textContent="Fetching player data...";const a=await y(i.value);await s.setPlayer(a)}o.textContent="Saved! Redirecting...";const n=b();sessionStorage.removeItem("uploadReturnPath"),history.pushState(null,"",n),window.dispatchEvent(new PopStateEvent("popstate"))}catch(n){console.error(n),o.textContent=n.message||"Error reading files!"}finally{u(!1)}});document.addEventListener("keydown",t=>{if(window.location.pathname!=="/upload"||t.key!=="Enter"||t.target?.id!=="playerName")return;const r=document.getElementById("app")?.querySelector("#saveBtn");!r||r.disabled||(t.preventDefault(),r.click())});export{v as default};
