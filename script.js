const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const reveals = document.querySelectorAll(".reveal");
if (reducedMotion || !("IntersectionObserver" in window)) {
  reveals.forEach((element) => element.classList.add("visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px" }
  );
  reveals.forEach((element) => revealObserver.observe(element));
}

const nav = document.querySelector(".nav");
const burger = document.querySelector(".nav__burger");
const navLinks = document.querySelector(".nav__links");

const updateNav = () => nav.classList.toggle("scrolled", window.scrollY > 16);
window.addEventListener("scroll", updateNav, { passive: true });
updateNav();

burger.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  burger.setAttribute("aria-expanded", String(isOpen));
  burger.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Abrir menú");
  });
});

document.querySelectorAll(".work__media video").forEach((video) => {
  const work = video.closest(".work");
  work.addEventListener("mouseenter", () => video.play().catch(() => {}));
  work.addEventListener("mouseleave", () => {
    video.pause();
    video.currentTime = 0.5;
  });
});

const lightbox = document.getElementById("lightbox");
const lightboxVideo = lightbox.querySelector(".lightbox__video");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxMeta = document.getElementById("lightbox-meta");
const closeButton = lightbox.querySelector(".lightbox__close");
let previousFocus = null;

function keepFocusInsideLightbox(event) {
  if (event.key !== "Tab" || lightbox.hidden) return;
  const focusable = [...lightbox.querySelectorAll("button, video[controls]")];
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function openLightbox(trigger) {
  previousFocus = trigger;
  lightboxVideo.src = trigger.dataset.openVideo;
  lightboxTitle.textContent = trigger.dataset.title || "Proyecto seleccionado";
  lightboxMeta.textContent = trigger.dataset.meta || "Edición y producción con IA";
  lightbox.hidden = false;
  document.body.classList.add("modal-open");
  closeButton.focus();
  lightboxVideo.play().catch(() => {});
}

function closeLightbox() {
  lightboxVideo.pause();
  lightboxVideo.removeAttribute("src");
  lightboxVideo.load();
  lightbox.hidden = true;
  document.body.classList.remove("modal-open");
  previousFocus?.focus();
}

document.querySelectorAll("[data-open-video]").forEach((trigger) => trigger.addEventListener("click", () => openLightbox(trigger)));
closeButton.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
  keepFocusInsideLightbox(event);
});

const copyButton = document.querySelector(".copy-email");
copyButton.addEventListener("click", async () => {
  const email = copyButton.dataset.copy;
  try {
    await navigator.clipboard.writeText(email);
    copyButton.textContent = "Email copiado ✓";
  } catch {
    copyButton.textContent = email;
  }
  window.setTimeout(() => { copyButton.textContent = "Copiar email"; }, 2200);
});
