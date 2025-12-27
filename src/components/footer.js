export async function Footer() {
    const chancemanTrackerVersion = import.meta.env.VITE_BUILD_TIME;

    return `
        <footer>
            <span>Version: ${chancemanTrackerVersion}</span>
        </footer>
    `;
}
