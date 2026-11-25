import { gsap, ScrollTrigger } from "../gsap.js";

let currentSection = null;
let cleanupProjects = null;

// Libera los eventos y animaciones de la sección.
export function destroyProjectsVision() {
  cleanupProjects?.();

  cleanupProjects = null;
  currentSection = null;
}

// Inicializa las pestañas y animaciones.
export function initProjectsVision() {
  const section = document.getElementById("proyectos");

  if (!section) return;
  if (currentSection === section) return;

  destroyProjectsVision();

  const tabs = Array.from(
    section.querySelectorAll('[role="tab"]')
  );

  const panels = Array.from(
    section.querySelectorAll('[role="tabpanel"]')
  );

  if (tabs.length !== 2 || panels.length !== 2) return;

  currentSection = section;

  const controller = new AbortController();
  const { signal } = controller;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let currentIndex = 0;
  let isTransitioning = false;
  let hasEntered = false;

  const animations = new Set();

  function track(animation) {
    animations.add(animation);

    return animation;
  }

  // Actualiza el estado accesible y visual de las pestañas.
  function updateTabs(index) {
    tabs.forEach((tab, tabIndex) => {
      const selected = tabIndex === index;

      tab.classList.toggle("is-active", selected);

      tab.setAttribute(
        "aria-selected",
        String(selected)
      );

      tab.tabIndex = selected ? 0 : -1;
    });
  }

  // Muestra el panel seleccionado y oculta el anterior.
  function showPanel(index) {
    panels.forEach((panel, panelIndex) => {
      panel.hidden = panelIndex !== index;
    });

    currentIndex = index;
    updateTabs(index);
  }

  // Anima la aparición del contenido de un panel.
  function animatePanel(panel) {
    if (reduceMotion) return;

    const heading = panel.querySelector(".panel-heading");
    const cards = panel.querySelectorAll(".project-card");

    const timeline = track(
      gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      })
    );

    if (heading) {
      timeline.fromTo(
        heading,
        {
          autoAlpha: 0,
          y: 16,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          clearProps: "all",
        }
      );
    }

    if (cards.length) {
      timeline.fromTo(
        cards,
        {
          autoAlpha: 0,
          y: 45,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.12,
          clearProps: "all",
        },
        heading ? "-=0.15" : 0
      );
    }
  }

  // Cambia de pestaña con una transición corta.
  function switchTab(index) {
    if (index === currentIndex || isTransitioning) return;

    const outgoing = panels[currentIndex];
    const incoming = panels[index];

    if (reduceMotion) {
      showPanel(index);
      ScrollTrigger.refresh();
      return;
    }

    isTransitioning = true;

    const timeline = track(
      gsap.timeline({
        onComplete: () => {
          isTransitioning = false;
          ScrollTrigger.refresh();
        },
      })
    );

    timeline.to(outgoing, {
      autoAlpha: 0,
      y: -12,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        gsap.set(outgoing, {
          clearProps: "all",
        });

        showPanel(index);

        gsap.set(incoming, {
          autoAlpha: 0,
          y: 18,
        });
      },
    });

    timeline.to(incoming, {
      autoAlpha: 1,
      y: 0,
      duration: 0.45,
      ease: "power3.out",
      clearProps: "all",
    });
  }

  // Permite cambiar entre pestañas mediante el teclado.
  function onTabKeydown(event, index) {
    let nextIndex = null;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (index + 1) % tabs.length;
        break;

      case "ArrowLeft":
        nextIndex =
          (index - 1 + tabs.length) % tabs.length;
        break;

      case "Home":
        nextIndex = 0;
        break;

      case "End":
        nextIndex = tabs.length - 1;
        break;

      default:
        return;
    }

    event.preventDefault();

    if (isTransitioning) return;

    tabs[nextIndex].focus();
    switchTab(nextIndex);
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener(
      "click",
      () => switchTab(index),
      { signal }
    );

    tab.addEventListener(
      "keydown",
      (event) => onTabKeydown(event, index),
      { signal }
    );
  });

  // Ejecuta la animación inicial cuando la sección es visible.
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries[0]?.isIntersecting || hasEntered) return;

      hasEntered = true;

      observer.disconnect();

      if (reduceMotion) return;

      const header = section.querySelector(".projects-header");
      const navigation = section.querySelector(".projects-tabs");

      const timeline = track(
        gsap.timeline({
          defaults: {
            ease: "power3.out",
          },
        })
      );

      if (navigation) {
        timeline.fromTo(
          navigation,
          {
            autoAlpha: 0,
            y: 20,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            clearProps: "all",
          },
          "-=0.25"
        );
      }

      timeline.call(() => {
        animatePanel(panels[currentIndex]);
      });
    },
    {
      root: null,
      threshold: 0.1,
    }
  );

  observer.observe(section);

  // Restaura el componente antes de una navegación de Astro.
  cleanupProjects = () => {
    controller.abort();
    observer.disconnect();

    animations.forEach((animation) => {
      animation.kill();
    });

    animations.clear();

    gsap.set(
      [
        ...panels,
        ...section.querySelectorAll(".project-card"),
        ...section.querySelectorAll(".panel-heading"),
        section.querySelector(".projects-header"),
        section.querySelector(".projects-tabs"),
      ].filter(Boolean),
      {
        clearProps: "all",
      }
    );

    panels.forEach((panel) => {
      panel.hidden = false;
    });

    showPanel(0);
  };
}
