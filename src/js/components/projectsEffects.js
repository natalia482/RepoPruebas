
import { gsap, ScrollTrigger } from "../gsap.js";

let cleanup = null;
let currentSection = null;

export function destroyProjectsEffects() {
  cleanup?.();
  cleanup = null;
  currentSection = null;
}

export function initProjectsEffects() {
  const section = document.getElementById("proyectos");

  if (!section || currentSection === section) return;

  destroyProjectsEffects();
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
    const cards = section.querySelectorAll(".project-card");

    cards.forEach((card) => {
      const image = card.querySelector(".project-image img");
      const content = card.querySelector(".project-card-inner");

      if (!image || !content) return;

      // La fotografía se desplaza dentro de su contenedor.
      gsap.fromTo(
        image,
        {
          yPercent: -6,
        },
        {
          yPercent: 6,
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

      if (!finePointer) return;

      const rotateX = gsap.quickTo(content, "rotationX", {
        duration: 0.55,
        ease: "power3.out",
      });

      const rotateY = gsap.quickTo(content, "rotationY", {
        duration: 0.55,
        ease: "power3.out",
      });

      const moveX = gsap.quickTo(image, "x", {
        duration: 0.7,
        ease: "power3.out",
      });

      const moveY = gsap.quickTo(image, "y", {
        duration: 0.7,
        ease: "power3.out",
      });

      function onPointerMove(event) {
        const rect = card.getBoundingClientRect();

        const x = (
          event.clientX - rect.left
        ) / rect.width;

        const y = (
          event.clientY - rect.top
        ) / rect.height;

        const normalizedX = (x - 0.5) * 2;
        const normalizedY = (y - 0.5) * 2;

        rotateX(-normalizedY * 4);
        rotateY(normalizedX * 5);

        moveX(-normalizedX * 9);
        moveY(-normalizedY * 9);

        card.style.setProperty(
          "--pointer-x",
          `${x * 100}%`
        );

        card.style.setProperty(
          "--pointer-y",
          `${y * 100}%`
        );
      }

      function onPointerLeave() {
        rotateX(0);
        rotateY(0);

        moveX(0);
        moveY(0);
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

  cleanup = () => {
    controller.abort();
    context.revert();

    section.querySelectorAll(".project-card").forEach((card) => {
      card.style.removeProperty("--pointer-x");
      card.style.removeProperty("--pointer-y");
    });
  };
}
