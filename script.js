document.addEventListener("DOMContentLoaded", () => {
// Mobile navigation, gallery lightbox, and current footer year.
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".nav");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    menuButton.textContent = isOpen ? "×" : "☰";
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
      menuButton.textContent = "☰";
    });
  });
}

const lightbox = document.querySelector("#lightbox");
const lightboxImage = lightbox?.querySelector("img");
const closeButton = lightbox?.querySelector(".lightbox-close");
let lastFocusedElement = null;

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  document.body.style.overflow = "";
  lastFocusedElement?.focus();
}

document.querySelectorAll(".gallery-card").forEach((card) => {
  card.addEventListener("click", () => {
    if (!lightbox || !lightboxImage) return;
    lastFocusedElement = card;
    lightboxImage.src = card.dataset.full;
    lightboxImage.alt = card.querySelector("img")?.alt || "Expanded portfolio photo";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeButton?.focus();
  });
});

closeButton?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && lightbox?.classList.contains("open")) closeLightbox();
});

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();


// Cute theme button: Original -> Blue -> Lavender Light.
const themeButton = document.querySelector("#theme-toggle");
const themeLabel = themeButton?.querySelector(".theme-toggle-label");
const themes = [
  { name: "original", label: "Original" },
  { name: "blue", label: "Blue & Light Blue" },
  { name: "lavender", label: "Lavender Light" }
];

function applyTheme(themeName) {
  const selectedTheme = themes.find((theme) => theme.name === themeName) || themes[0];
  document.body.dataset.theme = selectedTheme.name;
  if (themeLabel) themeLabel.textContent = `Theme: ${selectedTheme.label}`;
  if (themeButton) themeButton.setAttribute("aria-label", `Current theme: ${selectedTheme.label}. Click to change colors.`);
  try {
    localStorage.setItem("precious-portfolio-theme", selectedTheme.name);
  } catch (error) {
    // The theme still works if browser storage is unavailable.
  }
}

if (themeButton) {
  let savedTheme = "original";
  try {
    savedTheme = localStorage.getItem("precious-portfolio-theme") || "original";
  } catch (error) {
    // Use the original theme if browser storage is unavailable.
  }
  applyTheme(savedTheme);

  themeButton.addEventListener("click", () => {
    const currentIndex = themes.findIndex((theme) => theme.name === document.body.dataset.theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    applyTheme(nextTheme.name);
  });
}

});
