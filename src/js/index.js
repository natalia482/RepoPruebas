
import { gsap, ScrollTrigger } from "./gsap.js";
import { scrollToSection } from "./utils/scroll.js";

import {
  initScrollProgress,
  destroyScrollProgress,
} from "../js/global/scrollProgress.js";

import {
  initSectionTransitions,
  destroySectionTransitions,
} from "../js/global/sectionTransition.js";

import {
  initCommunityTransition,
  destroyCommunityTransition,
} from "./global/communityTransition.js";

let cleanup = null;

// Inicializa las funcionalidades generales de la página.
function initPage() {
  cleanup?.();
  cleanup = null;

  // El indicador de progreso no depende del Header.
  initScrollProgress();

  // Inicializa la pagina
  initSectionTransitions();
  initCommunityTransition();

  const header = document.querySelector(".header");
  const navbar = document.getElementById("navbar");
  const navMenu = document.getElementById("navMenu");
  const menuToggle = document.getElementById("menuToggle");

  if (!header || !navbar || !navMenu || !menuToggle) {
    cleanup = () => {
      destroyScrollProgress();
    };

    return;
  }

  const controller = new AbortController();
  const { signal } = controller;

  const animations = [];
  const triggers = [];

  const comparison = document.querySelector(
    ".comparisonSection"
  );

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Controla la visibilidad del Header.
  function showHeader() {
    header.classList.add("visible");
  }

  function hideHeader() {
    header.classList.remove("visible");
    closeMenu();
  }

  function closeMenu() {
    navMenu.classList.remove("open");
    menuToggle.classList.remove("is-open");

    menuToggle.setAttribute(
      "aria-expanded",
      "false"
    );

    menuToggle.setAttribute(
      "aria-label",
      "Abrir menú"
    );
  }

  function openMenu() {
    navMenu.classList.add("open");
    menuToggle.classList.add("is-open");

    menuToggle.setAttribute(
      "aria-expanded",
      "true"
    );

    menuToggle.setAttribute(
      "aria-label",
      "Cerrar menú"
    );
  }

  function updateHeader() {
    if (!comparison || reduceMotion) {
      showHeader();
      return;
    }

    const rect = comparison.getBoundingClientRect();

    if (window.scrollY <= 1 && rect.top >= -1) {
      hideHeader();
    }
  }

  // Menú de navegación móvil.
  menuToggle.addEventListener(
    "click",
    () => {
      if (navMenu.classList.contains("open")) {
        closeMenu();
      } else {
        openMenu();
      }
    },
    { signal }
  );

  document.addEventListener(
    "click",
    (event) => {
      if (
        event.target instanceof Node &&
        !navbar.contains(event.target)
      ) {
        closeMenu();
      }
    },
    { signal }
  );

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Escape") return;
      if (!navMenu.classList.contains("open")) return;

      closeMenu();
      menuToggle.focus();
    },
    { signal }
  );

  const desktopMedia = window.matchMedia(
    "(min-width: 1051px)"
  );

  function onDesktopChange(event) {
    if (event.matches) {
      closeMenu();
    }
  }

  desktopMedia.addEventListener(
    "change",
    onDesktopChange
  );

  // Comparación de imágenes controlada por el scroll.
  if (comparison && !reduceMotion) {
    const afterBox = comparison.querySelector(
      ".afterImage"
    );

    const afterImage = comparison.querySelector(
      ".afterImage .comp-img"
    );

    if (afterBox && afterImage) {
      gsap.set(afterBox, {
        x: 0,
        xPercent: 100,
      });

      gsap.set(afterImage, {
        x: 0,
        xPercent: -100,
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: comparison,
          start: "top top",

          end: () =>
            `+=${Math.max(
              comparison.offsetWidth,
              window.innerHeight * 1.2
            )}`,

          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,

          onEnter: hideHeader,
          onLeave: showHeader,
          onEnterBack: hideHeader,
          onLeaveBack: hideHeader,
        },

        defaults: {
          ease: "none",
        },
      });

      timeline
        .to(
          afterBox,
          {
            xPercent: 0,
            duration: 1,
          },
          0
        )
        .to(
          afterImage,
          {
            xPercent: 0,
            duration: 1,
          },
          0
        );

      animations.push(timeline);
    }
  } else {
    showHeader();
  }

  // Modifica el aspecto del Header al entrar al contenido.
  const aboutSection = document.getElementById(
    "acerca-de"
  );

  if (aboutSection) {
    const trigger = ScrollTrigger.create({
      trigger: aboutSection,
      start: "top 20%",

      onEnter: () => {
        navbar.classList.add("scrolled");
      },

      onLeaveBack: () => {
        navbar.classList.remove("scrolled");
      },
    });

    triggers.push(trigger);
  }

  // Navegación suave entre secciones.
  const navLinks = document.querySelectorAll(
    "#navMenu a[href^='#'], " +
    ".nav-actions a[href^='#'], " +
    ".logo-cfp[href^='#']"
  );

  navLinks.forEach((link) => {
    link.addEventListener(
      "click",
      (event) => {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") {
          return;
        }

        const target = document.getElementById(
          targetId.slice(1)
        );

        if (!target && targetId !== "#inicio") {
          closeMenu();
          return;
        }

        event.preventDefault();
        closeMenu();

        if (targetId === "#inicio") {
          gsap.to(window, {
            duration: reduceMotion ? 0 : 0.85,

            scrollTo: {
              y: 0,
              autoKill: true,
            },

            ease: "power2.inOut",
            overwrite: "auto",
          });

          return;
        }

        scrollToSection(target);
      },
      { signal }
    );
  });

  // Mantiene resaltada la sección visible.
  const sectionLinks = Array.from(
    document.querySelectorAll(
      "#navMenu .nav-item"
    )
  );

  const sections = sectionLinks
    .map((link) => {
      const id = link.getAttribute("href")?.slice(1);

      return {
        link,
        section: id
          ? document.getElementById(id)
          : null,
      };
    })
    .filter((item) => item.section);

  function setActiveLink(activeLink) {
    sectionLinks.forEach((link) => {
      const isActive = link === activeLink;

      link.classList.toggle(
        "active",
        isActive
      );

      if (isActive) {
        link.setAttribute(
          "aria-current",
          "location"
        );
      } else {
        link.removeAttribute(
          "aria-current"
        );
      }
    });
  }

  function updateActiveSection() {
    const referencePosition =
      window.scrollY +
      window.innerHeight * 0.35;

    let activeItem = sections[0];

    sections.forEach((item) => {
      const sectionTop =
        item.section.getBoundingClientRect().top +
        window.scrollY;

      if (sectionTop <= referencePosition) {
        activeItem = item;
      }
    });

    if (activeItem) {
      setActiveLink(activeItem.link);
    }
  }

  window.addEventListener(
    "scroll",
    updateActiveSection,
    {
      passive: true,
      signal,
    }
  );

  window.addEventListener(
    "resize",
    updateActiveSection,
    { signal }
  );

  // Sincroniza las animaciones con la posición actual.
  ScrollTrigger.refresh();

  if (comparison && !reduceMotion) {
    const comparisonTrigger =
      animations[0]?.scrollTrigger;

    if (
      comparisonTrigger &&
      window.scrollY > comparisonTrigger.end
    ) {
      showHeader();
    } else {
      updateHeader();
    }
  }

  updateActiveSection();

  // Limpia los recursos de esta inicialización.
  cleanup = () => {
    controller.abort();

    desktopMedia.removeEventListener(
      "change",
      onDesktopChange
    );

    animations.forEach((animation) => {
      animation.scrollTrigger?.kill();
      animation.kill();
    });

    triggers.forEach((trigger) => {
      trigger.kill();
    });

    gsap.killTweensOf(window);

    destroyScrollProgress();
    destroySectionTransitions();
    destroyCommunityTransition();

    cleanup = null;
  };
}

// Inicialización compatible con Astro.
if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initPage,
    { once: true }
  );
} else {
  initPage();
}

document.addEventListener(
  "astro:page-load",
  initPage
);

document.addEventListener(
  "astro:before-swap",
  () => {
    cleanup?.();
  }
);
