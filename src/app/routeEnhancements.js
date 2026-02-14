import { initLazyImages } from "./lazyImages.js";
import { initNavMenu } from "./navMenu.js";

export function afterRoute() {
    initLazyImages();
    initNavMenu();
}
