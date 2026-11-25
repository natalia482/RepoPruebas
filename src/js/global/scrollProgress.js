
import { gsap, ScrollTrigger } from "../gsap.js";

let progressTween = null;
let progressElement = null;

// Crea la barra de progreso si todavía no existe.
function createProgressBar() {
  let bar = document.querySelector("[data-scroll-progress]");

  if (!bar) {
    bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.dataset.scrollProgress = "";

    bar.setAttribute("aria-hidden", "true");

    document.body.appendChild(bar);
  }

  return bar;
}

// Actualiza el progreso de acuerdo con el scroll.
export function initScrollProgress() {
  destroyScrollProgress();

  const bar = createProgressBar();

  progressElement = bar;

  gsap.set(bar, {
    scaleX: 0,
    transformOrigin: "left center",
  });

  progressTween = gsap.to(bar, {
    scaleX: 1,
    ease: "none",
    paused: true,
  });

  ScrollTrigger.create({
    id: "global-scroll-progress",
    trigger: document.documentElement,
    start: 0,
    end: "max",
    onUpdate: (self) => {
      progressTween?.progress(self.progress);
    },
  });
}

// Elimina la animación antes de cambiar de página.
export function destroyScrollProgress() {
  ScrollTrigger.getById("global-scroll-progress")?.kill();

  progressTween?.kill();

  progressTween = null;

  progressElement?.remove();
  progressElement = null;
}
