import { fetchPlayer } from "../api/playerApi.js";
import { fileStore } from "../storage/fileStore.js";
import { invalidateLogicCaches } from "../main.js";

export default function ReuploadPage() {
    return `
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
            <input type="text" id="playerName" placeholder="OSRS username" value="${fileStore.player?.name ?? ""}">
        </label>
        <br><br>

        <button id="saveBtn">Save & Continue</button>

        <p id="status"></p>
    `;
}

document.addEventListener("click", async (e) => {
    if (e.target.id !== "saveBtn") return;

    const app = document.getElementById("app");

    const rolledInput = app.querySelector("#rolledInput");
    const obtainedInput = app.querySelector("#obtainedInput");
    const playerNameInput = app.querySelector("#playerName");
    const status = app.querySelector("#status");

    try {
        if (rolledInput.files[0]) {
            const json = JSON.parse(await rolledInput.files[0].text());
            await fileStore.setUnlocked(json);
        }

        if (obtainedInput.files[0]) {
            const json = JSON.parse(await obtainedInput.files[0].text());
            await fileStore.setRolled(json);
        }

        if (playerNameInput.value) {
            status.textContent = "Fetching player data...";
            const player = await fetchPlayer(playerNameInput.value);
            await fileStore.setPlayer(player);
        }

        // Clear any state
        invalidateLogicCaches(fileStore);
        window.__itemsPageData = null;

        // Redirect to items page
        status.textContent = "Saved! Redirecting...";
        history.pushState(null, "", "/items");
        window.dispatchEvent(new PopStateEvent("popstate"));
    } catch (err) {
        console.error(err);
        status.textContent = err.message || "Error reading files!";
    }
});
