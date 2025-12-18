import { fetchPlayer } from "../api/playerApi.js";
import { fileStore } from "../storage/fileStore.js";

export default function ReuploadPage() {
    return `
        <h1>Reupload Files</h1>

        <p>Replace your chanceman_rolled.json and chanceman_unlocked.json files.</p>

        <input type="file" id="rolledInput" accept=".json"><br><br>
        <input type="file" id="unlockedInput" accept=".json"><br><br>
        <label>
            Player name: (Only works with Runelite's <a href="https://oldschool.runescape.wiki/w/RuneScape:WikiSync">WikiSync</a>)<br>
            <input type="text" id="playerName">
        </label>
        <br><br>

        <button id="saveBtn">Save</button>

        <p id="status"></p>
    `;
}

document.addEventListener("click", async (e) => {
    if (e.target.id !== "saveBtn") return;

    const app = document.getElementById("app");

    const rolledInput = app.querySelector("#rolledInput");
    const unlockedInput = app.querySelector("#unlockedInput");
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
            const player = await fetchPlayer(playerNameInput.value);
            await fileStore.setPlayer(player);
        }

        status.textContent = "Updated!";
    } catch (err) {
        status.textContent = "Error!";
    }
});
