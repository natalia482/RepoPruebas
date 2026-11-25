import { gsap } from "../gsap.js";

let currentFooter = null;
let cleanupFooter = null;

// Limpia los eventos y animaciones del pie de página.
export function destroyFooter() {
  cleanupFooter?.();
  cleanupFooter = null;
  currentFooter = null;
}

export function initFooter() {
  const footer = document.getElementById("contactanos");
  if (!footer || currentFooter === footer) return;

  destroyFooter();
  currentFooter = footer;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const hero = footer.querySelector(".footer-hero");
  const columns = footer.querySelectorAll(
    ".footer-brand, .footer-navigation, .footer-contact"
  );
  const bottom = footer.querySelector(".footer-bottom");
  const backToTop = footer.querySelector("[data-back-to-top]");

  const controller = new AbortController();
  const { signal } = controller;
  const observers = [];
  const animations = new Set();
  let scrollAnimation = null;

  function track(animation) {
    animations.add(animation);
    return animation;
  }

  // Ejecuta una animación una sola vez cuando aparece en pantalla.
  function observeOnce(element, callback) {
    if (!element || reduceMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();
        callback();
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    observers.push(observer);
  }

  observeOnce(hero, () => {
    track(gsap.fromTo(hero,
      { autoAlpha: 0, y: 45 },
      { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", clearProps: "all" }
    ));
  });

  observeOnce(footer.querySelector(".footer-main"), () => {
    track(gsap.fromTo(columns,
      { autoAlpha: 0, y: 35 },
      { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.13, ease: "power3.out", clearProps: "all" }
    ));
  });

  observeOnce(bottom, () => {
    track(gsap.fromTo(bottom,
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out", clearProps: "all" }
    ));
  });

  // Conserva la navegación al inicio y respeta el movimiento reducido.
  backToTop?.addEventListener("click", (event) => {
    event.preventDefault();
    if (reduceMotion) {
      window.scrollTo(0, 0);
      return;
    }

    scrollAnimation?.kill();
    scrollAnimation = gsap.to(window, {
      duration: 1,
      scrollTo: { y: 0, autoKill: true },
      ease: "power2.inOut",
      overwrite: "auto",
      onComplete: () => { scrollAnimation = null; },
    });
  }, { signal });

  cleanupFooter = () => {
    controller.abort();
    observers.forEach((observer) => observer.disconnect());
    animations.forEach((animation) => animation.kill());
    animations.clear();
    scrollAnimation?.kill();
    scrollAnimation = null;
    gsap.set([hero, ...columns, bottom].filter(Boolean), { clearProps: "all" });
  };
}
