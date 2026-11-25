
import { gsap } from "../gsap.js";

let currentSection = null;
let cleanupAssociates = null;

// Libera los recursos de la sección.
export function destroyAssociates() {
  cleanupAssociates?.();

  cleanupAssociates = null;
  currentSection = null;
}

// Inicializa el carrusel y las estadísticas.
export function initAssociates() {
  const section = document.getElementById("poblacion");

  if (!section) return;
  if (currentSection === section) return;

  destroyAssociates();

  const viewport = section.querySelector(".carousel-viewport");
  const track = section.querySelector("[data-associates-track]");
  const group = section.querySelector("[data-carousel-group]");
  const toggle = section.querySelector("[data-carousel-toggle]");
  const toggleLabel = section.querySelector(
    "[data-carousel-toggle-label]"
  );
  const toggleIcon = section.querySelector(
    "[data-carousel-toggle-icon]"
  );

  const statsGrid = section.querySelector(".stats-grid");
  const statCards = section.querySelectorAll(".stat-card");

  if (!viewport || !track || !group || !toggle) return;

  currentSection = section;

  const controller = new AbortController();
  const { signal } = controller;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const animations = new Set();
  const observers = [];

  let carouselAnimation = null;
  let pausedByUser = reduceMotion;
  let pausedByHover = false;
  let pausedByVisibility = false;
  let statsAnimated = false;

  function trackAnimation(animation) {
    animations.add(animation);
    return animation;
  }

  // Actualiza el estado del botón y del movimiento.
  function updateCarouselState() {
    const shouldPause =
      pausedByUser ||
      pausedByHover ||
      pausedByVisibility;

    if (carouselAnimation) {
      carouselAnimation.paused(shouldPause);
    }

    toggle.setAttribute(
      "aria-pressed",
      String(pausedByUser)
    );

    toggle.setAttribute(
      "aria-label",
      pausedByUser
        ? "Reanudar carrusel"
        : "Pausar carrusel"
    );

    if (toggleLabel) {
      toggleLabel.textContent = pausedByUser
        ? "Reanudar"
        : "Pausar";
    }

    if (toggleIcon) {
      toggleIcon.textContent = pausedByUser
        ? "▶"
        : "Ⅱ";
    }
  }

  // Crea un bucle continuo según la anchura real del grupo.
  function buildCarousel() {
    if (carouselAnimation) {
      carouselAnimation.kill();
      animations.delete(carouselAnimation);
      carouselAnimation = null;
    }

    gsap.set(track, { x: 0 });

    if (reduceMotion) {
      updateCarouselState();
      return;
    }

    const distance = group.getBoundingClientRect().width;

    if (!distance) return;

    // Velocidad constante: 35 píxeles por segundo.
    const duration = distance / 35;

    carouselAnimation = trackAnimation(
      gsap.to(track, {
        x: -distance,
        duration,
        repeat: -1,
        ease: "none",
      })
    );

    updateCarouselState();
  }

  // Detiene temporalmente el carrusel durante la interacción.
  viewport.addEventListener(
    "pointerenter",
    (event) => {
      if (event.pointerType === "touch") return;

      pausedByHover = true;
      updateCarouselState();
    },
    { signal }
  );

  viewport.addEventListener(
    "pointerleave",
    () => {
      pausedByHover = false;
      updateCarouselState();
    },
    { signal }
  );

  viewport.addEventListener(
    "focusin",
    () => {
      pausedByHover = true;
      updateCarouselState();
    },
    { signal }
  );

  viewport.addEventListener(
    "focusout",
    () => {
      pausedByHover = false;
      updateCarouselState();
    },
    { signal }
  );

  toggle.addEventListener(
    "click",
    () => {
      pausedByUser = !pausedByUser;
      updateCarouselState();
    },
    { signal }
  );

  // Pausa la animación cuando la sección no está visible.
  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      pausedByVisibility = !entries[0]?.isIntersecting;
      updateCarouselState();
    },
    {
      threshold: 0,
    }
  );

  visibilityObserver.observe(section);
  observers.push(visibilityObserver);

  // Reconstruye el carrusel al cambiar el tamaño disponible.
  let resizeFrame = null;

  const resizeObserver = new ResizeObserver(() => {
    if (resizeFrame !== null) {
      cancelAnimationFrame(resizeFrame);
    }

    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = null;
      buildCarousel();
    });
  });

  resizeObserver.observe(group);

  // Animación de entrada del encabezado y la galería.
  const entryObserver = new IntersectionObserver(
    (entries) => {
      if (!entries[0]?.isIntersecting) return;

      entryObserver.disconnect();

      if (reduceMotion) return;

      const elements = [
        section.querySelector(".associates-gallery"),
      ].filter(Boolean);

      trackAnimation(
        gsap.fromTo(
          elements,
          {
            autoAlpha: 0,
            y: 35,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.18,
            ease: "power3.out",
            clearProps: "all",
          }
        )
      );
    },
    {
      threshold: 0.1,
    }
  );

  entryObserver.observe(section);
  observers.push(entryObserver);

  // Anima las cifras una sola vez cuando entran en pantalla.
  if (statsGrid) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || statsAnimated) {
          return;
        }

        statsAnimated = true;
        statsObserver.disconnect();

        if (reduceMotion) return;

        trackAnimation(
          gsap.fromTo(
            statCards,
            {
              autoAlpha: 0,
              y: 35,
            },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.75,
              stagger: 0.12,
              ease: "power3.out",
              clearProps: "all",
            }
          )
        );

        statCards.forEach((card) => {
          const number = card.querySelector(".stat-number");

          if (!number) return;

          const target = Number(number.dataset.target);

          if (!Number.isFinite(target)) return;

          const counter = { value: 0 };

          trackAnimation(
            gsap.to(counter, {
              value: target,
              duration: 2,
              ease: "power2.out",
              onUpdate: () => {
                number.textContent = String(
                  Math.round(counter.value)
                );
              },
              onComplete: () => {
                number.textContent = String(target);
              },
            })
          );
        });
      },
      {
        threshold: 0.15,
      }
    );

    statsObserver.observe(statsGrid);
    observers.push(statsObserver);
  }

  // Espera a que el navegador calcule las dimensiones.
  buildCarousel();

  cleanupAssociates = () => {
    controller.abort();

    observers.forEach((observer) => {
      observer.disconnect();
    });

    resizeObserver.disconnect();

    if (resizeFrame !== null) {
      cancelAnimationFrame(resizeFrame);
    }

    animations.forEach((animation) => {
      animation.kill();
    });

    animations.clear();

    gsap.set(track, {
      clearProps: "all",
    });

    gsap.set(
      [
        section.querySelector(".associates-header"),
        section.querySelector(".associates-gallery"),
        ...statCards,
      ].filter(Boolean),
      {
        clearProps: "all",
      }
    );

    statCards.forEach((card) => {
      const number = card.querySelector(".stat-number");

      if (number) {
        number.textContent = number.dataset.target;
      }
    });
  };
}
