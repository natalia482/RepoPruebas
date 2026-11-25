//Funciones compartidas de desplazamiento

import { gsap } from "../gsap.js";

// Desplaza la página a una sección y compensa la altura del encabezado.
export function scrollToSection(target, options = {}) {
  const element =
    typeof target === "string"
      ? document.querySelector(target)
      : target;

  if (!element) return false;

  const header = document.querySelector(".header");

  const offset = options.offset ?? (
    header ? header.getBoundingClientRect().height + 20 : 0
  );

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const position =
    element.getBoundingClientRect().top +
    window.scrollY -
    offset;

  gsap.to(window, {
    duration: reduceMotion ? 0 : (options.duration ?? 0.85),
    scrollTo: {
      y: Math.max(0, position),
      autoKill: true,
    },
    ease: "power2.inOut",
    overwrite: "auto",
  });

  return true;
}