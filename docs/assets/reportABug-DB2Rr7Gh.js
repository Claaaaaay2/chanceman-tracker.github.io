import{f as r}from"./index-CoGxWBTG.js";async function s(){return`
        <h1>Report a bug</h1>
        <p>Report your problems here. It will automatically also send your obtained and rolled for me to check :)</p>
        <textarea id="bugText" placeholder="Describe the bug..." cols="50" rows="10"></textarea><br/><br/>
        <button id="reportBug">Report bug</button><br/><br/>
        <p id="bugStatus"></p>
    `}function i(){const e=document.getElementById("reportBug");e&&e.addEventListener("click",async()=>{const t=document.getElementById("bugStatus"),o=document.getElementById("bugText").value.trim();if(!o){t.textContent="Please enter a description.";return}e.disabled=!0,t.textContent="Sending report...";const a={message:o,files:{player:r.player?.name,filters:r.filters,obtained:r.obtained,rolled:r.rolled}};try{if(!(await fetch("https://bug-report-relay.chanceman-tracker.workers.dev",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)})).ok)throw new Error("Failed to send");document.getElementById("bugText").value="",t.textContent="Thank you! Bug report sent."}catch(n){console.error(n),t.textContent="Failed to send bug report."}finally{e.disabled=!1}})}window.initBugPage=i;export{s as BugPage,i as initBugPage};
