import{f as v}from"./playerApi-ls5qQEYU.js";import{f as c}from"./index-Bxo1fZye.js";import"./questPoints-DcKLxK_Y.js";function S(){const o=sessionStorage.getItem("uploadReturnPath");if(!o)return"/items";const r=o.split("?")[0].split("#")[0];return r==="/upload"||r==="/reupload"?"/items":o}function P(){return`
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
            <input type="text" id="playerName" placeholder="OSRS username" value="${c.player?.name??""}">
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
    `}let u=null;function C(){w();const o=async s=>{if(s.target.id!=="saveBtn")return;const e=document.getElementById("app");if(!e)return;const a=e.querySelector("#rolledInput"),d=e.querySelector("#obtainedInput"),l=e.querySelector("#playerName"),i=e.querySelector("#status"),p=e.querySelector("#formLoading");if(!a||!d||!l||!i||!p)return;const f=e.querySelector("#saveBtn");if(!f)return;const h=[a,d,l,f],m=a.files[0],y=d.files[0],b=(t,n)=>{e.classList.toggle("upload-busy",t),p.classList.toggle("active",t),h.forEach(g=>{g.disabled=t}),n!==void 0&&(i.textContent=n)};try{if(b(!0,"Reading files..."),await new Promise(requestAnimationFrame),m){const n=JSON.parse(await m.text());await c.setRolled(n)}if(y){const n=JSON.parse(await y.text());await c.setObtained(n)}if(l.value){i.textContent="Fetching player data...";const n=await v(l.value);await c.setPlayer(n)}i.textContent="Saved! Redirecting...";const t=S();sessionStorage.removeItem("uploadReturnPath"),history.pushState(null,"",t),window.dispatchEvent(new PopStateEvent("popstate"))}catch(t){console.error(t),i.textContent=t.message||"Error reading files!"}finally{b(!1)}},r=s=>{if(s.key!=="Enter"||s.target?.id!=="playerName")return;const a=document.getElementById("app")?.querySelector("#saveBtn");!a||a.disabled||(s.preventDefault(),a.click())};document.addEventListener("click",o),document.addEventListener("keydown",r),u=()=>{document.removeEventListener("click",o),document.removeEventListener("keydown",r)}}function w(){typeof u=="function"&&u(),u=null}export{P as default,C as init,w as teardown};
