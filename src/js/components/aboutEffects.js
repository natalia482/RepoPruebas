
import { gsap, ScrollTrigger } from "../gsap.js";

let cleanup = null;
let currentSection = null;

export function destroyAboutEffects() {
  cleanup?.();
  cleanup = null;
  currentSection = null;
}

export function initAboutEffects() {
  const section = document.getElementById("acerca-de");

  if (!section || currentSection === section) return;

  destroyAboutEffects();
  currentSection = section;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  if (reduceMotion) return;

  const context = gsap.context(() => {
    const glow = section.querySelector(".about-glow");
    const orbitOne = section.querySelector(".about-orbit-one");
    const orbitTwo = section.querySelector(".about-orbit-two");

    // Cada elemento se desplaza a una velocidad diferente.
    const layers = [
    { element: glow, y: -130, x: -55 },
    { element: orbitOne, y: -180, x: -85 },
    { element: orbitTwo, y: -240, x: 100 },
    ];

    layers.forEach(({ element, x, y }) => {
      if (!element) return;

      gsap.fromTo(
        element,
        {
          x: 0,
          y: 0,
        },
        {
          x,
          y,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.4,
            invalidateOnRefresh: true,
          },
        }
      );
    });

    // Las líneas decorativas aparecen progresivamente.
    const highlightBorders = section.querySelector(
      ".about-highlights"
    );

    if (highlightBorders) {
      gsap.fromTo(
        highlightBorders,
        {
          "--about-line-progress": "0%",
        },
        {
          "--about-line-progress": "100%",
          ease: "none",
          scrollTrigger: {
            trigger: highlightBorders,
            start: "top 90%",
            end: "top 40%",
            scrub: true,
          },
        }
      );
    }

    // El efecto magnético se limita a dispositivos con cursor.
    if (!finePointer) return;

    const button = section.querySelector(".about-button");

    if (!button) return;

    const moveX = gsap.quickTo(button, "x", {
      duration: 0.45,
      ease: "power3.out",
    });

    const moveY = gsap.quickTo(button, "y", {
      duration: 0.45,
      ease: "power3.out",
    });

    function onPointerMove(event) {
      const rect = button.getBoundingClientRect();

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const x = (event.clientX - centerX) * 0.18;
      const y = (event.clientY - centerY) * 0.22;

      moveX(x);
      moveY(y);
    }

    function onPointerLeave() {
      moveX(0);
      moveY(0);
    }

    button.addEventListener("pointermove", onPointerMove);
    button.addEventListener("pointerleave", onPointerLeave);

    // Se liberan los eventos al destruir la sección.
    const previousCleanup = cleanup;

    cleanup = () => {
      button.removeEventListener(
        "pointermove",
        onPointerMove
      );

      button.removeEventListener(
        "pointerleave",
        onPointerLeave
      );

      previousCleanup?.();
    };
  }, section);

  const effectCleanup = cleanup;

  cleanup = () => {
    effectCleanup?.();
    context.revert();
  };
}
