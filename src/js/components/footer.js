
import { gsap } from "../gsap.js";

let currentFooter = null;
let cleanupFooter = null;

// Limpia los eventos y animaciones del Footer.
export function destroyFooter() {
  cleanupFooter?.();

  cleanupFooter = null;
  currentFooter = null;
}

export function initFooter() {
  const footer = document.getElementById("contactanos");

  if (!footer) return;
  if (currentFooter === footer) return;

  destroyFooter();

  currentFooter = footer;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const main = footer.querySelector(".footer-main");

  const columns = footer.querySelectorAll(
    ".footer-brand, .footer-navigation, .footer-contact"
  );

  const bottom = footer.querySelector(".footer-bottom");

  const backToTop = footer.querySelector(
    "[data-back-to-top]"
  );

  const controller = new AbortController();
  const { signal } = controller;

  const observers = [];
  const animations = new Set();

  let scrollAnimation = null;

  function track(animation) {
    animations.add(animation);
    return animation;
  }

  // Observa cada bloque hasta que aparece en pantalla.
  function observeOnce(element, callback) {
    if (!element || reduceMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;

        observer.disconnect();
        callback();
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(element);
    observers.push(observer);
  }

  // El encabezado ya pertenece a footerTransition.js.

  // Las columnas conservan su animación de entrada.
  observeOnce(main, () => {
    if (!columns.length) return;

    track(
      gsap.fromTo(
        columns,
        {
          autoAlpha: 0,
          y: 35,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.13,
          ease: "power3.out",
          clearProps: "all",
        }
      )
    );
  });

  // La información inferior aparece al final.
  observeOnce(bottom, () => {
    track(
      gsap.fromTo(
        bottom,
        {
          autoAlpha: 0,
          y: 20,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          clearProps: "all",
        }
      )
    );
  });

  // Permite regresar al inicio de la landing.
  backToTop?.addEventListener(
    "click",
    (event) => {
      event.preventDefault();

      scrollAnimation?.kill();

      if (reduceMotion) {
        window.scrollTo(0, 0);
        return;
      }

      scrollAnimation = gsap.to(window, {
        duration: 1,
        scrollTo: {
          y: 0,
          autoKill: true,
        },
        ease: "power2.inOut",
        overwrite: "auto",
        onComplete: () => {
          scrollAnimation = null;
        },
      });
    },
    { signal }
  );

  cleanupFooter = () => {
    controller.abort();

    observers.forEach((observer) => {
      observer.disconnect();
    });

    animations.forEach((animation) => {
      animation.kill();
    });

    animations.clear();

    scrollAnimation?.kill();
    scrollAnimation = null;

    gsap.set(
      [
        ...columns,
        bottom,
      ].filter(Boolean),
      {
        clearProps: "all",
      }
    );
  };
}
