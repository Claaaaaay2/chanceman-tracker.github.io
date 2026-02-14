let lazyImageObserver = null;

export function initLazyImages() {
    const lazyImages = document.querySelectorAll("img.lazy-img");
    if (!lazyImages.length) return;

    if (!("IntersectionObserver" in window)) {
        lazyImages.forEach((img) => {
            img.src = img.dataset.src;
            img.classList.remove("lazy-img");
        });
        return;
    }

    if (!lazyImageObserver) {
        lazyImageObserver = new IntersectionObserver((entries, obs) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove("lazy-img");
                    obs.unobserve(img);
                }
            }
        }, { rootMargin: "100px 0px" });
    }

    lazyImages.forEach((img) => lazyImageObserver.observe(img));
}
