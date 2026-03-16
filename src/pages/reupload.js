import { invalidateLogicCaches } from "../items/logicCache.js";
import { importPlayerData } from "./playerImportHelpers.js";
import { fileStore } from "../storage/fileStore.js";

function getReturnPath() {
    const stored = sessionStorage.getItem("uploadReturnPath");
    if (!stored) return "/items";
    const normalized = stored.split("?")[0].split("#")[0];
    if (normalized === "/upload" || normalized === "/reupload") {
        return "/items";
    }
    return stored;
}

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
    `;
}

let teardownReuploadHandlers = null;

export function init() {
    teardown();

    const onReuploadClick = async (event) => {
        if (event.target.id !== "saveBtn") return;

        const app = document.getElementById("app");
        if (!app) return;

        const rolledInput = app.querySelector("#rolledInput");
        const obtainedInput = app.querySelector("#obtainedInput");
        const playerBlobInput = app.querySelector("#playerBlobInput");
        const status = app.querySelector("#status");
        const loading = app.querySelector("#formLoading");
        if (!rolledInput || !obtainedInput || !playerBlobInput || !status || !loading) return;
        const saveBtn = app.querySelector("#saveBtn");
        if (!saveBtn) return;
        const inputs = [rolledInput, obtainedInput, playerBlobInput, saveBtn];

        const rolledFile = rolledInput.files[0];
        const obtainedFile = obtainedInput.files[0];

        const setBusy = (isBusy, message) => {
            app.classList.toggle("upload-busy", isBusy);
            loading.classList.toggle("active", isBusy);
            inputs.forEach((input) => {
                input.disabled = isBusy;
            });
            if (message !== undefined) {
                status.textContent = message;
            }
        };

        try {
            setBusy(true, "Reading files...");
            await new Promise(requestAnimationFrame);

            if (rolledFile) {
                const json = JSON.parse(await rolledFile.text());
                await fileStore.setRolled(json);
            }

            if (obtainedFile) {
                const json = JSON.parse(await obtainedFile.text());
                await fileStore.setObtained(json);
            }

            const player = await importPlayerData({
                playerBlobInput,
                setStatus: (message) => {
                    status.textContent = message;
                }
            });
            await fileStore.setPlayer(player);

            // Clear any state
            invalidateLogicCaches(fileStore);
            // Redirect to items page
            status.textContent = "Saved! Redirecting...";
            const returnPath = getReturnPath();
            sessionStorage.removeItem("uploadReturnPath");
            history.pushState(null, "", returnPath);
            window.dispatchEvent(new PopStateEvent("popstate"));
        } catch (err) {
            console.error(err);
            status.textContent = err.message || "Error reading files!";
        } finally {
            setBusy(false);
        }
    };

    document.addEventListener("click", onReuploadClick);
    teardownReuploadHandlers = () => {
        document.removeEventListener("click", onReuploadClick);
    };
}

export function teardown() {
    if (typeof teardownReuploadHandlers === "function") {
        teardownReuploadHandlers();
    }
    teardownReuploadHandlers = null;
}
