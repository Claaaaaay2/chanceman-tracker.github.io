import { readFile } from "node:fs/promises";
import path from "node:path";

const VALIDATION_TARGETS = [
    {
        dataPath: "public/data/items.json",
        schemaPath: "schemas/items.schema.json"
    },
    {
        dataPath: "public/data/items_f2p.json",
        schemaPath: "schemas/items.schema.json"
    },
    {
        dataPath: "public/data/clue_steps.json",
        schemaPath: "schemas/clue_steps.schema.json"
    },
    {
        dataPath: "public/data/achievement_diaries.json",
        schemaPath: "schemas/achievement_diaries.schema.json"
    }
];

function isPlainObject(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getTypeName(value) {
    if (value === null) return "null";
    if (Array.isArray(value)) return "array";
    if (typeof value === "number" && Number.isInteger(value)) return "integer";
    return typeof value;
}

function typeMatches(value, expectedType) {
    if (expectedType === "integer") {
        return typeof value === "number" && Number.isInteger(value);
    }
    if (expectedType === "number") {
        return typeof value === "number";
    }
    if (expectedType === "object") {
        return isPlainObject(value);
    }
    if (expectedType === "array") {
        return Array.isArray(value);
    }
    if (expectedType === "null") {
        return value === null;
    }
    return typeof value === expectedType;
}

function deepEqual(a, b) {
    if (a === b) return true;
    if (typeof a !== typeof b) return false;
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i += 1) {
            if (!deepEqual(a[i], b[i])) return false;
        }
        return true;
    }
    if (isPlainObject(a) && isPlainObject(b)) {
        const aKeys = Object.keys(a);
        const bKeys = Object.keys(b);
        if (aKeys.length !== bKeys.length) return false;
        for (const key of aKeys) {
            if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
            if (!deepEqual(a[key], b[key])) return false;
        }
        return true;
    }
    return false;
}

function escapeJsonPointer(key) {
    return key.replace(/~/g, "~0").replace(/\//g, "~1");
}

function resolveRef(rootSchema, ref) {
    if (!ref.startsWith("#/")) {
        throw new Error(`Unsupported $ref "${ref}". Only local refs are supported.`);
    }
    const parts = ref.slice(2).split("/").map((part) => part.replace(/~1/g, "/").replace(/~0/g, "~"));
    let node = rootSchema;
    for (const part of parts) {
        if (!isPlainObject(node) || !Object.prototype.hasOwnProperty.call(node, part)) {
            throw new Error(`Could not resolve $ref "${ref}". Missing part "${part}".`);
        }
        node = node[part];
    }
    return node;
}

function validateAnyOf(value, anyOfSchemas, context) {
    for (const optionSchema of anyOfSchemas) {
        const nestedErrors = [];
        const nestedContext = {
            ...context,
            errors: nestedErrors
        };
        if (validateValue(value, optionSchema, nestedContext)) {
            return true;
        }
    }
    context.errors.push(`${context.path}: did not match any allowed schema variant`);
    return false;
}

function validateType(value, schema, context) {
    if (schema.type === undefined) return true;

    const expectedTypes = Array.isArray(schema.type) ? schema.type : [schema.type];
    for (const type of expectedTypes) {
        if (typeMatches(value, type)) return true;
    }

    const actualType = getTypeName(value);
    context.errors.push(`${context.path}: expected ${expectedTypes.join(" | ")}, got ${actualType}`);
    return false;
}

function validateObject(value, schema, context) {
    if (!isPlainObject(value)) return true;

    const required = Array.isArray(schema.required) ? schema.required : [];
    for (const requiredKey of required) {
        if (!Object.prototype.hasOwnProperty.call(value, requiredKey)) {
            context.errors.push(`${context.path}: missing required property "${requiredKey}"`);
        }
    }

    if (typeof schema.minProperties === "number") {
        const propertyCount = Object.keys(value).length;
        if (propertyCount < schema.minProperties) {
            context.errors.push(`${context.path}: expected at least ${schema.minProperties} properties, got ${propertyCount}`);
        }
    }

    const propertySchemas = isPlainObject(schema.properties) ? schema.properties : {};
    const patternPropertySchemas = isPlainObject(schema.patternProperties) ? schema.patternProperties : {};
    const patternEntries = Object.entries(patternPropertySchemas).map(([pattern, patternSchema]) => ({
        regex: new RegExp(pattern),
        schema: patternSchema
    }));
    const additionalProperties = schema.additionalProperties;

    for (const [key, keyValue] of Object.entries(value)) {
        let wasValidated = false;

        if (Object.prototype.hasOwnProperty.call(propertySchemas, key)) {
            validateValue(keyValue, propertySchemas[key], {
                ...context,
                path: `${context.path}/${escapeJsonPointer(key)}`
            });
            wasValidated = true;
        }

        for (const patternEntry of patternEntries) {
            if (!patternEntry.regex.test(key)) continue;
            validateValue(keyValue, patternEntry.schema, {
                ...context,
                path: `${context.path}/${escapeJsonPointer(key)}`
            });
            wasValidated = true;
        }

        if (wasValidated) continue;

        if (additionalProperties === false) {
            context.errors.push(`${context.path}: unexpected property "${key}"`);
            continue;
        }

        if (isPlainObject(additionalProperties)) {
            validateValue(keyValue, additionalProperties, {
                ...context,
                path: `${context.path}/${escapeJsonPointer(key)}`
            });
        }
    }

    return true;
}

function validateArray(value, schema, context) {
    if (!Array.isArray(value)) return true;

    if (typeof schema.minItems === "number" && value.length < schema.minItems) {
        context.errors.push(`${context.path}: expected at least ${schema.minItems} items, got ${value.length}`);
    }

    if (schema.items !== undefined) {
        for (let index = 0; index < value.length; index += 1) {
            validateValue(value[index], schema.items, {
                ...context,
                path: `${context.path}/${index}`
            });
        }
    }

    return true;
}

function validateValue(value, schema, context) {
    if (schema === true || schema === undefined) return true;
    if (schema === false) {
        context.errors.push(`${context.path}: schema explicitly disallows this value`);
        return false;
    }

    if (schema.$ref) {
        const resolved = resolveRef(context.rootSchema, schema.$ref);
        return validateValue(value, resolved, context);
    }

    if (Array.isArray(schema.anyOf)) {
        const matched = validateAnyOf(value, schema.anyOf, context);
        if (!matched) return false;
    }

    if (!validateType(value, schema, context)) {
        return false;
    }

    if (Array.isArray(schema.enum)) {
        const inEnum = schema.enum.some((allowedValue) => deepEqual(value, allowedValue));
        if (!inEnum) {
            context.errors.push(`${context.path}: value is not in enum [${schema.enum.map((entry) => JSON.stringify(entry)).join(", ")}]`);
        }
    }

    if (Object.prototype.hasOwnProperty.call(schema, "const") && !deepEqual(value, schema.const)) {
        context.errors.push(`${context.path}: value does not match const ${JSON.stringify(schema.const)}`);
    }

    validateObject(value, schema, context);
    validateArray(value, schema, context);

    return true;
}

function validateAgainstSchema(value, schema) {
    const errors = [];
    validateValue(value, schema, {
        rootSchema: schema,
        path: "$",
        errors
    });
    return errors;
}

function validateCanifisClueStep(clueData) {
    const errors = [];
    const easySteps = clueData?.tiers?.Easy;

    if (!Array.isArray(easySteps)) {
        errors.push("custom clue check: tiers.Easy is not an array");
        return errors;
    }

    const step = easySteps.find((entry) => entry?.description === "Search the crates in Canifis.");
    if (!step) {
        errors.push("custom clue check: missing step \"Search the crates in Canifis.\"");
        return errors;
    }

    if (step?.requirements?.quests?.["Priest in Peril"] !== "completed") {
        errors.push("custom clue check: \"Search the crates in Canifis.\" must require Priest in Peril = completed");
    }
    if (step?.countWhenAvailableOnly !== true) {
        errors.push("custom clue check: \"Search the crates in Canifis.\" must set countWhenAvailableOnly = true");
    }
    if (typeof step?.specialInfo !== "string" || step.specialInfo.trim() === "") {
        errors.push("custom clue check: \"Search the crates in Canifis.\" must include a non-empty specialInfo");
    }

    return errors;
}

async function loadJsonFile(filePath) {
    const absolutePath = path.resolve(filePath);
    const raw = await readFile(absolutePath, "utf8");
    return JSON.parse(raw);
}

async function main() {
    const allErrors = [];
    const dataCache = new Map();
    const schemaCache = new Map();

    for (const target of VALIDATION_TARGETS) {
        if (!schemaCache.has(target.schemaPath)) {
            schemaCache.set(target.schemaPath, await loadJsonFile(target.schemaPath));
        }
        if (!dataCache.has(target.dataPath)) {
            dataCache.set(target.dataPath, await loadJsonFile(target.dataPath));
        }

        const schema = schemaCache.get(target.schemaPath);
        const data = dataCache.get(target.dataPath);
        const errors = validateAgainstSchema(data, schema);
        for (const error of errors) {
            allErrors.push(`${target.dataPath}: ${error}`);
        }
    }

    const clueData = dataCache.get("public/data/clue_steps.json");
    const clueErrors = validateCanifisClueStep(clueData);
    for (const error of clueErrors) {
        allErrors.push(`public/data/clue_steps.json: ${error}`);
    }

    if (allErrors.length > 0) {
        console.error(`Data validation failed with ${allErrors.length} error(s):`);
        for (const error of allErrors) {
            console.error(`- ${error}`);
        }
        process.exit(1);
    }

    console.log(`Data validation passed for ${VALIDATION_TARGETS.length} file(s).`);
}

main().catch((error) => {
    console.error("Data validation crashed:", error);
    process.exit(1);
});
