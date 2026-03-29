import { saveImportedTrackerState } from "./playerImportHelpers.js";
import { consumeTrackerSyncBridgeImport } from "./trackerSyncBridge.js";

function getReturnPath() {
    const stored = sessionStorage.getItem("uploadReturnPath");
    if (!stored) return "/items";
    const normalized = stored.split("?")[0].split("#")[0];
    if (normalized === "/upload" || normalized === "/reupload") {
        return "/items";
    }
    return stored;
}

export default function UploadPage() {
    return `
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
            <a href="https://runelite.net/plugin-hub/show/chanceman-tracker-runelite-sync" target="_blank" rel="noreferrer">Chanceman Tracker Sync blob</a>:<br>
            <textarea id="playerBlobInput" rows="10" placeholder="Paste the JSON blob from the Chanceman Tracker Sync plugin"></textarea>
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
    `;
}

let teardownUploadHandlers = null;

export function init() {
    teardown();

    const app = document.getElementById("app");
    if (!app) return;

    const rolledInput = app.querySelector("#rolledInput");
    const obtainedInput = app.querySelector("#obtainedInput");
    const playerBlobInput = app.querySelector("#playerBlobInput");
    const status = app.querySelector("#status");
    const loading = app.querySelector("#formLoading");
    const saveBtn = app.querySelector("#saveBtn");
    if (!rolledInput || !obtainedInput || !playerBlobInput || !status || !loading || !saveBtn) return;

    const inputs = [rolledInput, obtainedInput, playerBlobInput, saveBtn];

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

    const finishImport = () => {
        status.textContent = "Saved! Redirecting...";
        const returnPath = getReturnPath();
        sessionStorage.removeItem("uploadReturnPath");
        history.pushState(null, "", returnPath);
        window.dispatchEvent(new PopStateEvent("popstate"));
    };

    const saveTrackerState = async (options) => {
        const {
            rolled,
            obtained,
            playerBlobText
        } = options;

        await saveImportedTrackerState({
            rolled,
            obtained,
            playerBlobInput,
            playerBlobText,
            setStatus: (message) => {
                status.textContent = message;
            }
        });
    };

    const onUploadClick = async (event) => {
        if (event.target.id !== "saveBtn") return;

        const rolledFile = rolledInput.files[0];
        const obtainedFile = obtainedInput.files[0];

        try {
            setBusy(true, "Reading files...");
            await new Promise(requestAnimationFrame);

            let rolled;
            if (rolledFile) {
                rolled = JSON.parse(await rolledFile.text());
            }

            let obtained;
            if (obtainedFile) {
                obtained = JSON.parse(await obtainedFile.text());
            }

            await saveTrackerState({
                rolled,
                obtained
            });

            finishImport();
        } catch (err) {
            console.error(err);
            status.textContent = err.message || "Error reading files!";
        } finally {
            setBusy(false);
        }
    };

    document.addEventListener("click", onUploadClick);
    teardownUploadHandlers = () => {
        document.removeEventListener("click", onUploadClick);
    };

    void (async () => {
        try {
            const bridgeImport = await consumeTrackerSyncBridgeImport({
                currentUrl: window.location.href,
                onImport: async (importData) => {
                    setBusy(true, "Importing tracker data...");
                    await new Promise(requestAnimationFrame);

                    playerBlobInput.value = importData.playerBlobText;
                    await saveTrackerState({
                        rolled: importData.chancemanRolled,
                        obtained: importData.chancemanObtained,
                        playerBlobText: importData.playerBlobText
                    });
                },
                onLocalImportSuccess: ({ sanitizedUrl }) => {
                    history.replaceState(null, "", sanitizedUrl);
                    finishImport();
                },
                onAckFailure: (error, bridgeImportState) => {
                    console.warn("Tracker bridge ack failed after successful local import.", {
                        error,
                        bridgeUrl: bridgeImportState.bridgeUrl
                    });
                }
            });
            if (!bridgeImport) {
                return;
            }
        } catch (err) {
            console.error(err);
            status.textContent = err.message || "Error importing tracker data!";
            setBusy(false);
        }
    })();
}

export function teardown() {
    if (typeof teardownUploadHandlers === "function") {
        teardownUploadHandlers();
    }
    teardownUploadHandlers = null;
}
