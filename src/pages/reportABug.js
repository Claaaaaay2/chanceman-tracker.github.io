import { fileStore } from "../storage/fileStore.js";

export async function BugPage() {
    return `
        <h1>Report a bug</h1>
        <p>Report your problems here. It will automatically also send your obtained and rolled for me to check :)</p>
        <textarea id="bugText" placeholder="Describe the bug..." cols="50" rows="10"></textarea><br/><br/>
        <button id="reportBug">Report bug</button><br/><br/>
        <p id="bugStatus"></p>
    `;
}

export function initBugPage() {
    const btn = document.getElementById("reportBug");
    if (!btn) {
        return;
    }

    btn.addEventListener("click", async () => {
        const status = document.getElementById("bugStatus");
        const message = document.getElementById("bugText").value.trim();

        if (!message) {
            status.textContent = "Please enter a description.";
            return;
        }

        btn.disabled = true;
        status.textContent = "Sending report...";

        const payload = {
            message,
            files: {
                player: fileStore.player?.name,
                filters: fileStore.filters,
                obtained: fileStore.obtained,
                rolled: fileStore.rolled,
            }
        };

        try {
            const res = await fetch("https://bug-report-relay.chanceman-tracker.workers.dev", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Failed to send");

            document.getElementById("bugText").value = "";
            status.textContent = "Thank you! Bug report sent.";
        } catch (e) {
            console.error(e);
            status.textContent = "Failed to send bug report.";
        } finally {
            btn.disabled = false;
        }
    });
}
