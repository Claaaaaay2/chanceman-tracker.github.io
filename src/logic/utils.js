export function parseDropRate(rate) {
    if (!rate || rate == "N/A" || rate == "Unknown") return -1;

    rate = rate.trim();

    if (rate == "Always" || rate == "Once") return 1_000_000;
    if (rate.includes("Varies")) return 1 / 800;
    if (rate == "Common") return 1 / 16;
    if (rate == "Uncommon") return 1 / 64;
    if (rate == "Rare") return 1 / 128;

    // Remove multipliers like "3 x ~1/64"
    rate = rate.replace(/^\d+\s*[^0-9/]+/i, "");

    // Handle percentages: "22.33%-28.11%"
    if (rate.includes("%")) {
        return 1_000_000;
    }

    // Handle multiple rates: "1/8; 1/50"
    if (rate.includes(";")) {
        return Math.min(
            ...rate.split(";").map(r => parseDropRate(r))
        );
    }

    // Handle fractions and ranges like "1/800-1/1200"
    const matches = [...rate.matchAll(/(\d+)\s*\/\s*(\d+)/g)];
    if (matches.length) {
        const values = matches.map(match => Number(match[1]) / Number(match[2]));
        return Math.max(...values);
    }

    return Infinity;
}

export function capitalizeFirstLetter(val) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}
