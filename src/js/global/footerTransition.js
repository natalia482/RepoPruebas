
import { gsap } from "../gsap.js";

let activeNews = null;
let activeFooter = null;
let cleanupTransition = null;

// Limpia las capas y animaciones de la transición.
export function destroyFooterTransition() {
  cleanupTransition?.();

  cleanupTransition = null;
  activeNews = null;
  activeFooter = null;
}

// Construye el Footer a medida que avanza el scroll.
export function initFooterTransition() {
  const news = document.getElementById("noticias");
  const footer = document.getElementById("contactanos");

  if (!news || !footer) {
    destroyFooterTransition();
    return;
  }

  if (
    activeNews === news &&
    activeFooter === footer
  ) {
    return;
  }

  destroyFooterTransition();

  activeNews = news;
  activeFooter = footer;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduceMotion) return;

  const topline = footer.querySelector(".footer-topline");
  const title = footer.querySelector(".footer-title");
  const introduction = footer.querySelector(
    ".footer-introduction"
  );
  const cta = footer.querySelector(".footer-main-cta");

  // Las capas son decorativas y no afectan el layout.
  const outgoing = document.createElement("div");
  outgoing.className = "cfp-footer-outgoing";
  outgoing.setAttribute("aria-hidden", "true");

  const incoming = document.createElement("div");
  incoming.className = "cfp-footer-incoming";
  incoming.setAttribute("aria-hidden", "true");

  incoming.innerHTML = `
    <div class="cfp-footer-light"></div>
    <div class="cfp-footer-grid"></div>
  `;

  news.append(outgoing);
  footer.prepend(incoming);

  const light = incoming.querySelector(
    ".cfp-footer-light"
  );

  const grid = incoming.querySelector(
    ".cfp-footer-grid"
  );

  const context = gsap.context(() => {
    gsap.set(outgoing, {
      opacity: 0,
    });

    gsap.set(light, {
      opacity: 0,
      yPercent: 30,
    });

    gsap.set(grid, {
      opacity: 0,
      clipPath: "inset(100% 0% 0% 0%)",
    });

    // Las máscaras no cambian las dimensiones.
    const textElements = [
      topline,
      title,
      introduction,
    ].filter(Boolean);

    if (textElements.length) {
      gsap.set(textElements, {
        clipPath: "inset(0% 0% 100% 0%)",
      });
    }

    // El botón conserva sus efectos magnéticos.
    // Solo animamos opacidad y una máscara visual.
    if (cta) {
      gsap.set(cta, {
        opacity: 0,
        clipPath: "inset(0% 100% 0% 0%)",
      });
    }

    const timeline = gsap.timeline({
      defaults: {
        ease: "none",
      },
      scrollTrigger: {
        trigger: footer,
        start: "top 95%",
        end: "top 8%",
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });

    // Noticias entrega la escena.
    timeline.to(
      outgoing,
      {
        opacity: 0.8,
        duration: 0.3,
      },
      0
    );

    // El Footer recibe la iluminación.
    timeline.to(
      light,
      {
        opacity: 1,
        yPercent: 0,
        duration: 0.55,
      },
      0
    );

    // Se construye la cuadrícula de fondo.
    timeline.to(
      grid,
      {
        opacity: 0.35,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.65,
      },
      0.1
    );

    // Aparece la identificación de la sección.
    if (topline) {
      timeline.to(
        topline,
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.25,
        },
        0.2
      );
    }

    // Se revela el mensaje final.
    if (title) {
      timeline.to(
        title,
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.55,
        },
        0.28
      );
    }

    // La descripción sigue al título.
    if (introduction) {
      timeline.to(
        introduction,
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.35,
        },
        0.55
      );
    }

    // La invitación aparece al final.
    if (cta) {
      timeline.to(
        cta,
        {
          opacity: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.3,
        },
        0.7
      );
    }

    // La luz se estabiliza al finalizar.
    timeline.to(
      light,
      {
        opacity: 0.3,
        duration: 0.25,
      },
      0.78
    );
  }, footer);

  cleanupTransition = () => {
    context.revert();

    outgoing.remove();
    incoming.remove();
  };
}
