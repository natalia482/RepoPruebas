
import { gsap, ScrollTrigger } from "../gsap.js";

let currentSection = null;
let cleanupEffects = null;

// Destruye las animaciones y elimina los eventos.
export function destroyNewsEffects() {
  cleanupEffects?.();

  cleanupEffects = null;
  currentSection = null;
}

// Inicializa los efectos visuales adicionales.
export function initNewsEffects() {
  const section = document.getElementById("noticias");

  if (!section || currentSection === section) return;

  destroyNewsEffects();

  currentSection = section;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  const desktop = window.matchMedia(
    "(min-width: 901px)"
  ).matches;

  if (reduceMotion) {
    cleanupEffects = () => {};
    return;
  }

  const controller = new AbortController();
  const { signal } = controller;

  const context = gsap.context(() => {
    const cards = section.querySelectorAll(".news-card");

    cards.forEach((card) => {
      const image = card.querySelector(".news-image img");
      const inner = card.querySelector(".news-card-inner");

      if (!image || !inner) return;

      // Parallax de la fotografía durante el scroll.
      if (desktop) {
        gsap.fromTo(
          image,
          {
            yPercent: -5,
          },
          {
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
              invalidateOnRefresh: true,
            },
          }
        );
      }

      if (!finePointer) return;

      // Inclinación suave de la capa interna.
      const rotateX = gsap.quickTo(inner, "rotationX", {
        duration: 0.55,
        ease: "power3.out",
      });

      const rotateY = gsap.quickTo(inner, "rotationY", {
        duration: 0.55,
        ease: "power3.out",
      });

      // Movimiento independiente de la fotografía.
      const moveX = gsap.quickTo(image, "x", {
        duration: 0.65,
        ease: "power3.out",
      });

      const moveY = gsap.quickTo(image, "y", {
        duration: 0.65,
        ease: "power3.out",
      });

      function onPointerMove(event) {
        const rect = card.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) / rect.width;

        const y =
          (event.clientY - rect.top) / rect.height;

        const normalizedX = (x - 0.5) * 2;
        const normalizedY = (y - 0.5) * 2;

        rotateX(-normalizedY * 3);
        rotateY(normalizedX * 4);

        moveX(-normalizedX * 8);
        moveY(-normalizedY * 8);

        // Actualiza el centro del reflejo verde.
        card.style.setProperty(
          "--news-pointer-x",
          `${x * 100}%`
        );

        card.style.setProperty(
          "--news-pointer-y",
          `${y * 100}%`
        );
      }

      function onPointerLeave() {
        rotateX(0);
        rotateY(0);

        moveX(0);
        moveY(0);

        card.style.setProperty(
          "--news-pointer-x",
          "50%"
        );

        card.style.setProperty(
          "--news-pointer-y",
          "50%"
        );
      }

      card.addEventListener(
        "pointermove",
        onPointerMove,
        { signal }
      );

      card.addEventListener(
        "pointerleave",
        onPointerLeave,
        { signal }
      );
    });
  }, section);

  // Actualiza las posiciones cuando las imágenes terminan de cargar.
  const images = section.querySelectorAll(".news-image img");

  images.forEach((image) => {
    if (!image.complete) {
      image.addEventListener(
        "load",
        () => ScrollTrigger.refresh(),
        { signal, once: true }
      );
    }
  });

  cleanupEffects = () => {
    controller.abort();

    // Revierte las transformaciones y los ScrollTrigger.
    context.revert();

    section.querySelectorAll(".news-card").forEach((card) => {
      card.style.removeProperty("--news-pointer-x");
      card.style.removeProperty("--news-pointer-y");
    });
  };
}
