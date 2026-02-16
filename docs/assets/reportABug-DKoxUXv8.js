import{f as n}from"./index-CRaUb4Kp.js";let o=null,t=null;async function d(){return`
        <h1>Report a bug</h1>
        <p>Report your problems here. It will automatically also send your obtained and rolled for me to check :)</p>
        <textarea id="bugText" placeholder="Describe the bug..." cols="50" rows="10"></textarea><br/><br/>
        <button id="reportBug">Report bug</button><br/><br/>
        <p id="bugStatus"></p>
    `}function c(){i();const e=document.getElementById("reportBug");e&&(o=e,t=async()=>{const r=document.getElementById("bugStatus"),l=document.getElementById("bugText").value.trim();if(!l){r.textContent="Please enter a description.";return}e.disabled=!0,r.textContent="Sending report...";const u={message:l,files:{player:n.player?.name,filters:n.filters,obtained:n.obtained,rolled:n.rolled}};try{if(!(await fetch("https://bug-report-relay.chanceman-tracker.workers.dev",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(u)})).ok)throw new Error("Failed to send");document.getElementById("bugText").value="",r.textContent="Thank you! Bug report sent."}catch(a){console.error(a),r.textContent="Failed to send bug report."}finally{e.disabled=!1}},e.addEventListener("click",t))}function i(){o&&t&&o.removeEventListener("click",t),o=null,t=null}export{d as default,c as init,i as teardown};
