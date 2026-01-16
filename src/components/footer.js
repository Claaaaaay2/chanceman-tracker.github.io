export async function Footer() {
    const chancemanTrackerVersion = import.meta.env.VITE_BUILD_TIME;

    return `
        <footer>
        <a class="footer-link" href="https://ko-fi.com/kryen" target="_blank" rel="noopener noreferrer">☕ Support on Ko-fi ☕</a>
        <span class="footer-separator">|</span>
        <span>Version: ${chancemanTrackerVersion}</span>
        </footer>
    `;
}
