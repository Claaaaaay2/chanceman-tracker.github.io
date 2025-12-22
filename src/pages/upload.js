import { fetchPlayer } from "../api/playerApi.js";
import { fileStore } from "../storage/fileStore.js";

export default function UploadPage() {
    return `
        <h1>Chanceman Tracker Setup</h1>

        <p><strong>Upload your chanceman_rolled.json and chanceman_unlocked.json files.</strong></p>

        <p>Location:<br>
        C:\\Users\\[user]\\.runelite\\chanceman\\[osrs-account]\\chanceman_rolled.json<br>
        C:\\Users\\[user]\\.runelite\\chanceman\\[osrs-account]\\chanceman_unlocked.json
        </p>

        <label>
            Rolled:<br>
            <input type="file" id="rolledInput" accept=".json">
        </label>
        <br><br>

        <label>
            Unlocked:<br>
            <input type="file" id="unlockedInput" accept=".json">
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
    const unlockedInput = app.querySelector("#unlockedInput");
    const playerNameInput = app.querySelector("#playerName");
    const status = app.querySelector("#status");

    try {
        if (rolledInput.files[0]) {
            const json = JSON.parse(await rolledInput.files[0].text());
            await fileStore.setRolled(json);
        }

        if (unlockedInput.files[0]) {
            const json = JSON.parse(await unlockedInput.files[0].text());
            await fileStore.setUnlocked(json);
        }

        if (playerNameInput.value) {
            status.textContent = "Fetching player data...";
            const player = await fetchPlayer(playerNameInput.value);
            await fileStore.setPlayer(player);
        }

        // Redirect to items page
        status.textContent = "Saved! Redirecting...";
        history.pushState(null, "", "/items");
        window.dispatchEvent(new PopStateEvent("popstate"));
    } catch (err) {
        console.error(err);
        status.textContent = err.message || "Error reading files!";
    }
});
