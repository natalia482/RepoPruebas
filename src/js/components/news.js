
import { gsap } from "../gsap.js";

let currentSection = null;
let cleanupNews = null;

// Elimina observadores y animaciones anteriores.
export function destroyNews() {
  cleanupNews?.();

  cleanupNews = null;
  currentSection = null;
}

// Inicializa las animaciones de entrada de Noticias.
export function initNews() {
  const section = document.getElementById("noticias");

  if (!section) return;
  if (currentSection === section) return;

  destroyNews();

  const header = section.querySelector(".news-header");
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

  // Registra cada animación para poder eliminarla.
  function track(animation) {
    animations.add(animation);
    return animation;
  }

  // Ejecuta una animación cuando el elemento entra en pantalla.
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

  // Aparición del encabezado.
  observeOnce(
    section,
    () => {
      if (!header) return;

      track(
        gsap.fromTo(
          header,
          {
            autoAlpha: 0,
            y: 45,
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

  // Entrada de la noticia destacada.
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

  // Entrada independiente de las noticias secundarias.
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

  // Limpia los recursos cuando Astro abandona la página.
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
        header,
        featured,
        ...secondaryCards,
      ].filter(Boolean),
      {
        clearProps: "all",
      }
    );
  };
}
