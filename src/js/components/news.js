
import { gsap } from "../gsap.js";

let currentSection = null;
let cleanupNews = null;

// Elimina observadores y animaciones anteriores.
export function destroyNews() {
  cleanupNews?.();

  cleanupNews = null;
  currentSection = null;
}

// Inicializa las animaciones de las noticias.
export function initNews() {
  const section = document.getElementById("noticias");

  if (!section) return;
  if (currentSection === section) return;

  destroyNews();

  const featured = section.querySelector(
    ".news-card-featured"
  );

  const secondaryCards = section.querySelectorAll(
    ".news-card-secondary"
  );

  currentSection = section;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduceMotion) {
    cleanupNews = () => {};
    return;
  }

  const animations = new Set();
  const observers = [];

  // Guarda las animaciones para limpiarlas después.
  function track(animation) {
    animations.add(animation);
    return animation;
  }

  // Ejecuta una animación una sola vez al entrar en pantalla.
  function observeOnce(
    element,
    callback,
    threshold = 0.15
  ) {
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;

        observer.disconnect();
        callback();
      },
      {
        threshold,
      }
    );

    observer.observe(element);
    observers.push(observer);
  }

  // La noticia destacada entra de forma independiente.
  observeOnce(
    featured,
    () => {
      track(
        gsap.fromTo(
          featured,
          {
            autoAlpha: 0,
            y: 55,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            clearProps: "all",
          }
        )
      );
    },
    0.1
  );

  // Las noticias secundarias aparecen al entrar en pantalla.
  secondaryCards.forEach((card) => {
    observeOnce(
      card,
      () => {
        track(
          gsap.fromTo(
            card,
            {
              autoAlpha: 0,
              y: 40,
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              clearProps: "all",
            }
          )
        );
      },
      0.1
    );
  });

  // Limpia los recursos antes de cambiar de página.
  cleanupNews = () => {
    observers.forEach((observer) => {
      observer.disconnect();
    });

    animations.forEach((animation) => {
      animation.kill();
    });

    animations.clear();

    gsap.set(
      [
        featured,
        ...secondaryCards,
      ].filter(Boolean),
      {
        clearProps: "all",
      }
    );
  };
}
