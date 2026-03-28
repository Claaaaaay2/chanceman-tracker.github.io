import{f as i,m as y}from"./index-DKhOaEeS.js";import{i as S}from"./playerImportHelpers-CTJLa13n.js";import"./questPoints-CqNPzYWa.js";function v(){const a=sessionStorage.getItem("uploadReturnPath");if(!a)return"/items";const o=a.split("?")[0].split("#")[0];return o==="/upload"||o==="/reupload"?"/items":a}function P(){return`
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
    `}let l=null;function x(){w();const a=async o=>{if(o.target.id!=="saveBtn")return;const e=document.getElementById("app");if(!e)return;const c=e.querySelector("#rolledInput"),u=e.querySelector("#obtainedInput"),p=e.querySelector("#playerBlobInput"),r=e.querySelector("#status"),d=e.querySelector("#formLoading");if(!c||!u||!p||!r||!d)return;const f=e.querySelector("#saveBtn");if(!f)return;const g=[c,u,p,f],b=c.files[0],m=u.files[0],h=(t,s)=>{e.classList.toggle("upload-busy",t),d.classList.toggle("active",t),g.forEach(n=>{n.disabled=t}),s!==void 0&&(r.textContent=s)};try{if(h(!0,"Reading files..."),await new Promise(requestAnimationFrame),b){const n=JSON.parse(await b.text());await i.setRolled(n)}if(m){const n=JSON.parse(await m.text());await i.setObtained(n)}const t=await S({playerBlobInput:p,setStatus:n=>{r.textContent=n}});await i.setPlayer(t),y(i),r.textContent="Saved! Redirecting...";const s=v();sessionStorage.removeItem("uploadReturnPath"),history.pushState(null,"",s),window.dispatchEvent(new PopStateEvent("popstate"))}catch(t){console.error(t),r.textContent=t.message||"Error reading files!"}finally{h(!1)}};document.addEventListener("click",a),l=()=>{document.removeEventListener("click",a)}}function w(){typeof l=="function"&&l(),l=null}export{P as default,x as init,w as teardown};
