
import { gsap } from "../gsap.js";

let currentSection = null;
let cleanupEffects = null;

export function destroyAssociatesEffects() {
  cleanupEffects?.();
  cleanupEffects = null;
  currentSection = null;
}

export function initAssociatesEffects() {
  const section = document.getElementById("poblacion");

  if (!section || currentSection === section) return;

  destroyAssociatesEffects();
  currentSection = section;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  if (reduceMotion) return;

  const controller = new AbortController();
  const { signal } = controller;

  const context = gsap.context(() => {
    const background = section.querySelector(
      ".associates-background-image"
    );

    const statsHeading = section.querySelector(
      ".stats-heading"
    );

    // Desplaza la fotografía de fondo a menor velocidad.
    if (background) {
      gsap.fromTo(
        background,
        {
          yPercent: -5,
        },
        {
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
            invalidateOnRefresh: true,
          },
        }
      );
    }

    // Revela el encabezado de las estadísticas.
    if (statsHeading) {
      gsap.fromTo(
        statsHeading,
        {
          autoAlpha: 0,
          y: 35,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          clearProps: "all",
          scrollTrigger: {
            trigger: statsHeading,
            start: "top 85%",
            once: true,
          },
        }
      );
    }

    // Las interacciones del cursor solo se activan en escritorio.
    if (!finePointer) return;

    const carouselCards = section.querySelectorAll(
      ".carousel-card"
    );

    carouselCards.forEach((card) => {
      const image = card.querySelector("img");

      if (!image) return;

      const moveX = gsap.quickTo(image, "x", {
        duration: 0.65,
        ease: "power3.out",
      });

      const moveY = gsap.quickTo(image, "y", {
        duration: 0.65,
        ease: "power3.out",
      });

      const scale = gsap.quickTo(image, "scale", {
        duration: 0.65,
        ease: "power3.out",
      });

      function onPointerMove(event) {
        const rect = card.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) / rect.width - 0.5;

        const y =
          (event.clientY - rect.top) / rect.height - 0.5;

        moveX(x * -14);
        moveY(y * -14);
        scale(1.1);
      }

      function onPointerLeave() {
        moveX(0);
        moveY(0);
        scale(1);
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

    // Ilumina las estadísticas según la posición del cursor.
    const statCards = section.querySelectorAll(
      ".stat-card"
    );

    statCards.forEach((card) => {
      function onPointerMove(event) {
        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        card.style.setProperty("--light-x", `${x}px`);
        card.style.setProperty("--light-y", `${y}px`);
      }

      function onPointerLeave() {
        card.style.removeProperty("--light-x");
        card.style.removeProperty("--light-y");
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

  cleanupEffects = () => {
    controller.abort();
    context.revert();

    section.querySelectorAll(".stat-card").forEach((card) => {
      card.style.removeProperty("--light-x");
      card.style.removeProperty("--light-y");
    });
  };
}
