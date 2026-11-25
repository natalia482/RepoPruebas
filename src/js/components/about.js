import { gsap } from "../gsap.js";

let aboutContext = null;
let aboutObserver = null;
let currentSection = null;

// Elimina las animaciones y observadores anteriores.
export function destroyAbout() {
  aboutObserver?.disconnect();
  aboutObserver = null;

  aboutContext?.revert();
  aboutContext = null;

  currentSection = null;
}

// Inicializa la secuencia de entrada de About.
export function initAbout() {
  const section = document.getElementById("acerca-de");

  if (!section) return;
  if (currentSection === section) return;

  destroyAbout();
  currentSection = section;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduceMotion) return;

  aboutContext = gsap.context(() => {
    const eyebrow = section.querySelector(".about-eyebrow");
    const titleLines = section.querySelectorAll(".about-title span");
    const intro = section.querySelector(".about-intro");
    const description = section.querySelector(".about-description");
    const highlights = section.querySelectorAll(".highlight-item");

    const elements = [
      eyebrow,
      ...titleLines,
      intro,
      description,
      ...highlights,
    ].filter(Boolean);

    // Oculta los elementos antes de reproducir la secuencia.
    gsap.set(elements, {
      autoAlpha: 0,
      y: 55,
    });

    const timeline = gsap.timeline({
      paused: true,
      defaults: {
        ease: "power3.out",
      },
    });

    if (eyebrow) {
      timeline.to(eyebrow, {
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
      });
    }

    if (titleLines.length) {
      timeline.to(titleLines, {
        autoAlpha: 1,
        y: 0,
        duration: 1.1,
        stagger: 0.25,
      });
    }

    if (intro) {
      timeline.to(intro, {
        autoAlpha: 1,
        y: 0,
        duration: 0.85,
      }, "-=0.2");
    }

    if (description) {
      timeline.to(description, {
        autoAlpha: 1,
        y: 0,
        duration: 0.85,
      }, "-=0.3");
    }

    if (highlights.length) {
      timeline.to(highlights, {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.18,
      }, "-=0.2");
    }

    // Detecta la aparición real de About en la ventana.
    aboutObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry?.isIntersecting) return;

        timeline.play();

        // La animación se reproduce una sola vez.
        aboutObserver?.disconnect();
        aboutObserver = null;
      },
      {
        root: null,
        threshold: 0.15,
      }
    );

    aboutObserver.observe(section);
  }, section);
}