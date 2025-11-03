// src/utils/navbar.js
export function handleNavbarScroll() {
    let lastScrollY = window.scrollY;
    const navbar = document.querySelector(".navbar-container");

    window.addEventListener("scroll", () => {
        if (!navbar) return;

        if (window.scrollY > lastScrollY) {
            // scroll vers le bas → cacher navbar
            navbar.classList.add("navbar-hidden");
        } else {
            // scroll vers le haut → afficher navbar
            navbar.classList.remove("navbar-hidden");
        }
        lastScrollY = window.scrollY;
    });
}
