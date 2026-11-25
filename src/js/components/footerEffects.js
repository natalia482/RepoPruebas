import { gsap } from "../gsap.js";

let currentFooter = null;
let cleanupEffects = null;

export function destroyFooterEffects() {
  cleanupEffects?.();
  cleanupEffects = null;
  currentFooter = null;
}

export function initFooterEffects() {
  const footer = document.getElementById("contactanos");
  if (!footer || currentFooter === footer) return;

  destroyFooterEffects();
  currentFooter = footer;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  if (reduceMotion) {
    cleanupEffects = () => {};
    return;
  }

  const controller = new AbortController();
  const { signal } = controller;

  const context = gsap.context(() => {
    const ambient = footer.querySelector(".footer-ambient");
    const line = footer.querySelector(".footer-top-line");

    // Movimiento ambiental sutil, sin desplazar el contenido.
    if (ambient) {
      gsap.fromTo(ambient,
        { y: -65, x: 25 },
        {
          y: 75,
          x: -25,
          ease: "none",
          scrollTrigger: {
            trigger: footer,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
            invalidateOnRefresh: true,
          },
        }
      );
    }

    // Revela la línea superior al llegar al Footer.
    if (line) {
      gsap.fromTo(line,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: footer,
            start: "top 95%",
            end: "top 35%",
            scrub: true,
          },
        }
      );
    }

    if (!finePointer) return;

    // Movimiento magnético moderado para enlaces y botones.
    const magneticElements = footer.querySelectorAll(
      ".footer-main-cta, .footer-navigation a, .contact-item, .back-to-top"
    );

    magneticElements.forEach((element) => {
      const moveX = gsap.quickTo(element, "x", {
        duration: 0.4,
        ease: "power3.out",
      });
      const moveY = gsap.quickTo(element, "y", {
        duration: 0.4,
        ease: "power3.out",
      });

      function onPointerMove(event) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        moveX((event.clientX - centerX) * 0.12);
        moveY((event.clientY - centerY) * 0.12);
      }

      function onPointerLeave() {
        moveX(0);
        moveY(0);
      }

      element.addEventListener("pointermove", onPointerMove, { signal });
      element.addEventListener("pointerleave", onPointerLeave, { signal });
      element.addEventListener("blur", onPointerLeave, { signal });
    });
  }, footer);

  cleanupEffects = () => {
    controller.abort();
    context.revert();
  };
}
