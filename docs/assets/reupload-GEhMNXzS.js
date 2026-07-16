import{m as y,f as S}from"./index-DvWMewZo.js";import{s as v}from"./playerImportHelpers-CVUdjuZB.js";import"./questPoints-DoLjXDUj.js";function I(){const e=sessionStorage.getItem("uploadReturnPath");if(!e)return"/items";const t=e.split("?")[0].split("#")[0];return t==="/upload"||t==="/reupload"?"/items":e}function P(){return`
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
            <a href="https://runelite.net/plugin-hub/show/chanceman-tracker-runelite-sync" target="_blank" rel="noreferrer">Chanceman Tracker Sync blob</a>:<br>
            <textarea id="playerBlobInput" rows="10" placeholder="Paste the JSON blob from the Chanceman Tracker Sync plugin"></textarea>
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
    `}let l=null;function k(){w();const e=document.getElementById("app");if(!e)return;const t=e.querySelector("#rolledInput"),i=e.querySelector("#obtainedInput"),c=e.querySelector("#playerBlobInput"),n=e.querySelector("#status"),u=e.querySelector("#formLoading"),d=e.querySelector("#saveBtn");if(!t||!i||!c||!n||!u||!d)return;const m=[t,i,c,d],p=(a,r)=>{e.classList.toggle("upload-busy",a),u.classList.toggle("active",a),m.forEach(s=>{s.disabled=a}),r!==void 0&&(n.textContent=r)},f=async a=>{if(a.target.id!=="saveBtn")return;const r=t.files[0],s=i.files[0];try{p(!0,"Reading files..."),await new Promise(requestAnimationFrame);let o;r&&(o=JSON.parse(await r.text()));let b;s&&(b=JSON.parse(await s.text())),await v({rolled:o,obtained:b,playerBlobInput:c,setStatus:g=>{n.textContent=g}}),y(S),n.textContent="Saved! Redirecting...";const h=I();sessionStorage.removeItem("uploadReturnPath"),history.pushState(null,"",h),window.dispatchEvent(new PopStateEvent("popstate"))}catch(o){console.error(o),n.textContent=o.message||"Error reading files!"}finally{p(!1)}};document.addEventListener("click",f),l=()=>{document.removeEventListener("click",f)}}function w(){typeof l=="function"&&l(),l=null}export{P as default,k as init,w as teardown};
