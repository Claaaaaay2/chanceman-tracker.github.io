import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_ITEMS_PATH = "public/data/items.json";
const DEFAULT_MAPPING_URL = "https://prices.runescape.wiki/api/v1/osrs/mapping";
const DEFAULT_PREVIEW_LIMIT = 50;
const DEFAULT_REPORT_PATH = "scripts/item-mapping-coverage-report.json";
const IGNORED_MAPPING_IDS = new Set([
    2203, 4595, 7228, 7466, 8624, 8626, 8628, 13190, 22610, 22613, 22616,
    22619, 22625, 22628, 22631, 22634, 22636, 22638, 22641, 22644, 22650,
    22653, 22656, 22818, 24609, 24611, 25991, 25994, 25997, 26000, 26003,
    26006, 26009, 26012, 26015, 26018, 26021, 26024, 26027, 26030, 26033,
    26036, 26039, 26042, 26045, 26048, 26051, 26054, 26057, 26060, 26063,
    26066, 26069, 26072, 26075, 26078, 26081, 26084, 26087, 26090, 26093,
    26096, 26099, 26102, 26105, 26108, 26111, 26114, 26117, 26120, 26123,
    26126, 26129, 26132, 26135, 26138, 26141, 26144, 26147, 26602, 28220,
    28223, 28478, 28481, 28484, 28487, 28490, 28493, 28496, 28499, 28502,
    28505, 28508, 28511, 28514, 28517, 28520, 28523, 28526, 28529, 28839,
    28842, 28845, 28848, 28851, 28854, 28857, 28860, 29098, 29649, 29652,
    29655, 29658, 29661, 29664, 29667, 29670, 29673, 29676, 29679, 30576,
    30682, 31454, 33012, 33015, 33018, 33038, 33041, 33044, 33047, 33050
]);

function printUsage() {
    console.log(`Usage: node scripts/check-item-mapping-coverage.mjs [options]

Options:
  --items <path>           Path to tracker items JSON. Default: ${DEFAULT_ITEMS_PATH}
  --api <url>              Mapping endpoint URL. Default: ${DEFAULT_MAPPING_URL}
  --limit <number>         Number of rows to print per section. Default: ${DEFAULT_PREVIEW_LIMIT}
  --report <path>          Write full comparison report JSON. Default: ${DEFAULT_REPORT_PATH}
  --write-missing <path>   Write missing wiki mapping entries to a JSON file
  --strict                 Exit with code 1 if coverage issues are found
  --help                   Show this help text
`);
}

function parseArgs(argv) {
    const options = {
        itemsPath: DEFAULT_ITEMS_PATH,
        mappingUrl: DEFAULT_MAPPING_URL,
        previewLimit: DEFAULT_PREVIEW_LIMIT,
        reportPath: DEFAULT_REPORT_PATH,
        writeMissingPath: null,
        strict: false
    };

    for (let index = 0; index < argv.length; index += 1) {
        const arg = argv[index];

        if (arg === "--help") {
            printUsage();
            process.exit(0);
        }

        if (arg === "--strict") {
            options.strict = true;
            continue;
        }

        if (arg === "--items" || arg === "--api" || arg === "--limit" || arg === "--report" || arg === "--write-missing") {
            const value = argv[index + 1];
            if (!value || value.startsWith("--")) {
                throw new Error(`Missing value for ${arg}`);
            }

            if (arg === "--items") {
                options.itemsPath = value;
            } else if (arg === "--api") {
                options.mappingUrl = value;
            } else if (arg === "--limit") {
                const parsedLimit = Number.parseInt(value, 10);
                if (!Number.isInteger(parsedLimit) || parsedLimit < 0) {
                    throw new Error(`Invalid --limit value "${value}"`);
                }
                options.previewLimit = parsedLimit;
            } else if (arg === "--report") {
                options.reportPath = value;
            } else if (arg === "--write-missing") {
                options.writeMissingPath = value;
            }

            index += 1;
            continue;
        }

        throw new Error(`Unknown argument "${arg}"`);
    }

    return options;
}

async function loadJsonFile(filePath) {
    const absolutePath = path.resolve(filePath);
    const raw = await readFile(absolutePath, "utf8");
    return JSON.parse(raw);
}

async function fetchMapping(mappingUrl) {
    const response = await fetch(mappingUrl, {
        headers: {
            "User-Agent": "chanceman-tracker item coverage checker"
        }
    });

    if (!response.ok) {
        throw new Error(`Mapping fetch failed with ${response.status} ${response.statusText}`);
    }

    return response.json();
}

function normalizeName(name) {
    return String(name ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

function sortObjectProperties(value, priorityKeys = []) {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
        return value;
    }

    const priorityLookup = new Map(priorityKeys.map((key, index) => [key, index]));
    const keys = Object.keys(value).sort((left, right) => {
        const leftPriority = priorityLookup.has(left) ? priorityLookup.get(left) : Number.MAX_SAFE_INTEGER;
        const rightPriority = priorityLookup.has(right) ? priorityLookup.get(right) : Number.MAX_SAFE_INTEGER;

        if (leftPriority !== rightPriority) {
            return leftPriority - rightPriority;
        }

        return left.localeCompare(right);
    });

    const sorted = {};
    for (const key of keys) {
        sorted[key] = value[key];
    }
    return sorted;
}

function assertItemArray(data, label) {
    if (!Array.isArray(data)) {
        throw new Error(`${label} must be a JSON array`);
    }
}

function buildTrackerIndex(items) {
    const trackerById = new Map();
    const duplicates = [];
    const invalidEntries = [];

    for (let index = 0; index < items.length; index += 1) {
        const entry = items[index];

        if (typeof entry !== "object" || entry === null || Array.isArray(entry)) {
            invalidEntries.push({
                index,
                reason: "Entry is not an object"
            });
            continue;
        }

        if (!Number.isInteger(entry.id)) {
            invalidEntries.push({
                index,
                reason: `Entry id is not an integer (${JSON.stringify(entry.id)})`
            });
            continue;
        }

        if (trackerById.has(entry.id)) {
            duplicates.push({
                id: entry.id,
                firstIndex: trackerById.get(entry.id).__index,
                duplicateIndex: index,
                name: entry.name ?? null
            });
            continue;
        }

        trackerById.set(entry.id, {
            ...entry,
            __index: index
        });
    }

    return { trackerById, duplicates, invalidEntries };
}

function buildMappingIndex(mappingItems) {
    const mappingById = new Map();
    const duplicates = [];
    const invalidEntries = [];

    for (let index = 0; index < mappingItems.length; index += 1) {
        const entry = mappingItems[index];

        if (typeof entry !== "object" || entry === null || Array.isArray(entry)) {
            invalidEntries.push({
                index,
                reason: "Entry is not an object"
            });
            continue;
        }

        if (!Number.isInteger(entry.id)) {
            invalidEntries.push({
                index,
                reason: `Entry id is not an integer (${JSON.stringify(entry.id)})`
            });
            continue;
        }

        if (mappingById.has(entry.id)) {
            duplicates.push({
                id: entry.id,
                firstName: mappingById.get(entry.id).name ?? null,
                duplicateName: entry.name ?? null
            });
            continue;
        }

        mappingById.set(entry.id, entry);
    }

    return { mappingById, duplicates, invalidEntries };
}

function formatItem(entry) {
    return `${entry.id} | ${entry.name ?? "(no name)"}`;
}

function printSection(title, entries, previewLimit, formatter = formatItem) {
    console.log(`\n${title}: ${entries.length}`);

    if (entries.length === 0) {
        return;
    }

    const previewEntries = entries.slice(0, previewLimit);
    for (const entry of previewEntries) {
        console.log(`  - ${formatter(entry)}`);
    }

    if (entries.length > previewEntries.length) {
        console.log(`  ... ${entries.length - previewEntries.length} more`);
    }
}

async function maybeWriteMissing(writeMissingPath, missingItems) {
    if (!writeMissingPath) {
        return;
    }

    const absolutePath = path.resolve(writeMissingPath);
    await writeFile(absolutePath, `${JSON.stringify(missingItems, null, 2)}\n`, "utf8");
    console.log(`\nWrote missing wiki items to ${absolutePath}`);
}

async function writeReport(reportPath, reportData) {
    const absolutePath = path.resolve(reportPath);
    await writeFile(absolutePath, `${JSON.stringify(reportData, null, 2)}\n`, "utf8");
    console.log(`Report file: ${absolutePath}`);
}

async function main() {
    const options = parseArgs(process.argv.slice(2));
    const trackerItems = await loadJsonFile(options.itemsPath);
    const wikiMapping = await fetchMapping(options.mappingUrl);

    assertItemArray(trackerItems, `Tracker file ${options.itemsPath}`);
    assertItemArray(wikiMapping, `Wiki mapping response from ${options.mappingUrl}`);

    const trackerIndex = buildTrackerIndex(trackerItems);
    const mappingIndex = buildMappingIndex(wikiMapping);
    const generatedAt = new Date().toISOString();

    const ignoredWikiItems = wikiMapping
        .filter((entry) => Number.isInteger(entry?.id) && IGNORED_MAPPING_IDS.has(entry.id))
        .map((entry) => sortObjectProperties(entry, ["name"]));
    const missingInTracker = wikiMapping
        .filter((entry) => Number.isInteger(entry?.id) && !trackerIndex.trackerById.has(entry.id) && !IGNORED_MAPPING_IDS.has(entry.id))
        .map((entry) => sortObjectProperties(entry, ["name"]));
    const extraInTracker = [...trackerIndex.trackerById.values()]
        .filter((entry) => !mappingIndex.mappingById.has(entry.id))
        .map(({ __index, ...entry }) => entry);
    const nameMismatches = [...trackerIndex.trackerById.values()]
        .filter((entry) => mappingIndex.mappingById.has(entry.id))
        .map((entry) => ({
            id: entry.id,
            trackerName: entry.name ?? null,
            wikiName: mappingIndex.mappingById.get(entry.id).name ?? null
        }))
        .filter((entry) => normalizeName(entry.trackerName) !== normalizeName(entry.wikiName));

    const trackerDuplicates = trackerIndex.duplicates.map((entry) => ({
        id: entry.id,
        firstIndex: entry.firstIndex,
        duplicateIndex: entry.duplicateIndex,
        name: entry.name ?? null
    }));
    const invalidTrackerEntries = trackerIndex.invalidEntries.map((entry) => ({
        index: entry.index,
        reason: entry.reason
    }));
    const duplicateWikiIds = mappingIndex.duplicates.map((entry) => ({
        id: entry.id,
        firstName: entry.firstName ?? null,
        duplicateName: entry.duplicateName ?? null
    }));
    const invalidWikiEntries = mappingIndex.invalidEntries.map((entry) => ({
        index: entry.index,
        reason: entry.reason
    }));

    const report = {
        generatedAt,
        trackerFile: path.resolve(options.itemsPath),
        wikiApi: options.mappingUrl,
        summary: {
            trackerItems: trackerItems.length,
            trackerUniqueIds: trackerIndex.trackerById.size,
            geItems: wikiMapping.length,
            ignoredItems: ignoredWikiItems.length,
            missingItems: missingInTracker.length,
            extraItems: extraInTracker.length,
            nameMismatches: nameMismatches.length,
            duplicateTrackerIds: trackerDuplicates.length,
            invalidTrackerEntries: invalidTrackerEntries.length,
            duplicateWikiIds: duplicateWikiIds.length,
            invalidWikiEntries: invalidWikiEntries.length
        },
        ignoredWikiItems,
        missingInTracker,
        extraInTracker,
        nameMismatches,
        duplicateTrackerIds: trackerDuplicates,
        invalidTrackerEntries,
        duplicateWikiIds,
        invalidWikiEntries
    };

    console.log(`Checked tracker coverage on ${generatedAt}`);
    console.log(`Tracker file: ${path.resolve(options.itemsPath)}`);
    console.log(`Wiki API: ${options.mappingUrl}`);
    console.log(`Wiki mapping items: ${wikiMapping.length}`);
    console.log(`Tracker items: ${trackerItems.length}`);
    console.log(`Tracker unique ids: ${trackerIndex.trackerById.size}`);

    printSection("Ignored wiki items", ignoredWikiItems, options.previewLimit);
    printSection("Missing in tracker", missingInTracker, options.previewLimit);
    printSection("Extra in tracker", extraInTracker, options.previewLimit);
    printSection(
        "Name mismatches",
        nameMismatches,
        options.previewLimit,
        (entry) => `${entry.id} | tracker="${entry.trackerName ?? ""}" | wiki="${entry.wikiName ?? ""}"`
    );
    printSection(
        "Duplicate tracker ids",
        trackerDuplicates,
        options.previewLimit,
        (entry) => `${entry.id} | first index ${entry.firstIndex} | duplicate index ${entry.duplicateIndex}`
    );
    printSection(
        "Invalid tracker entries",
        invalidTrackerEntries,
        options.previewLimit,
        (entry) => `index ${entry.index} | ${entry.reason}`
    );
    printSection(
        "Duplicate wiki ids",
        duplicateWikiIds,
        options.previewLimit,
        (entry) => `${entry.id} | first="${entry.firstName ?? ""}" | duplicate="${entry.duplicateName ?? ""}"`
    );
    printSection(
        "Invalid wiki entries",
        invalidWikiEntries,
        options.previewLimit,
        (entry) => `index ${entry.index} | ${entry.reason}`
    );

    await writeReport(options.reportPath, report);
    await maybeWriteMissing(options.writeMissingPath, missingInTracker);

    const hasCoverageIssues =
        missingInTracker.length > 0 ||
        extraInTracker.length > 0 ||
        nameMismatches.length > 0 ||
        trackerDuplicates.length > 0 ||
        invalidTrackerEntries.length > 0 ||
        duplicateWikiIds.length > 0 ||
        invalidWikiEntries.length > 0;

    if (options.strict && hasCoverageIssues) {
        process.exit(1);
    }
}

main().catch((error) => {
    console.error("Item mapping coverage check failed:", error);
    process.exit(1);
});
