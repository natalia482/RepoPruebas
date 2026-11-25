
import { gsap } from "../gsap.js";

let activeCommunity = null;
let activeNews = null;
let cleanupTransition = null;

// Elimina las animaciones y capas de esta transición.
export function destroyNewsTransition() {
  cleanupTransition?.();

  cleanupTransition = null;
  activeCommunity = null;
  activeNews = null;
}

// Conecta la comunidad con la sección de noticias.
export function initNewsTransition() {
  const community = document.getElementById("poblacion");
  const news = document.getElementById("noticias");

  if (!community || !news) return;

  if (
    activeCommunity === community &&
    activeNews === news
  ) {
    return;
  }

  destroyNewsTransition();

  activeCommunity = community;
  activeNews = news;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduceMotion) return;

  const topline = news.querySelector(".news-topline");
  const heading = news.querySelector(".news-heading");
  const introduction = news.querySelector(
    ".news-introduction"
  );

  // Las capas son decorativas y no ocupan espacio.
  const outgoing = document.createElement("div");
  outgoing.className = "cfp-news-outgoing";
  outgoing.setAttribute("aria-hidden", "true");

  const incoming = document.createElement("div");
  incoming.className = "cfp-news-incoming";
  incoming.setAttribute("aria-hidden", "true");

  incoming.innerHTML = `
    <div class="cfp-news-light"></div>
    <div class="cfp-news-grid"></div>
    <div class="cfp-news-line"></div>
  `;

  community.append(outgoing);
  news.prepend(incoming);

  const light = incoming.querySelector(
    ".cfp-news-light"
  );

  const grid = incoming.querySelector(
    ".cfp-news-grid"
  );

  const line = incoming.querySelector(
    ".cfp-news-line"
  );

  const context = gsap.context(() => {
    // Prepara los estados iniciales.
    gsap.set(outgoing, {
      opacity: 0,
    });

    gsap.set(light, {
      opacity: 0,
      yPercent: 25,
    });

    gsap.set(grid, {
      opacity: 0,
      clipPath: "inset(100% 0% 0% 0%)",
    });

    gsap.set(line, {
      scaleX: 0,
      transformOrigin: "left center",
    });

    // Se ocultan solo las partes del encabezado.
    const revealElements = [
      topline,
      heading,
      introduction,
    ].filter(Boolean);

    gsap.set(revealElements, {
      clipPath: "inset(0% 0% 100% 0%)",
    });

    // La construcción sigue el movimiento del usuario.
    const timeline = gsap.timeline({
      defaults: {
        ease: "none",
      },
      scrollTrigger: {
        trigger: news,
        start: "top 95%",
        end: "top 10%",
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });

    // La comunidad comienza a entregar la escena.
    timeline.to(
      outgoing,
      {
        opacity: 0.8,
        duration: 0.3,
      },
      0
    );

    // La luz aparece en la nueva sección.
    timeline.to(
      light,
      {
        opacity: 1,
        yPercent: 0,
        duration: 0.5,
      },
      0
    );

    // La línea conecta visualmente las secciones.
    timeline.to(
      line,
      {
        scaleX: 1,
        duration: 0.45,
      },
      0.08
    );

    // La cuadrícula se descubre desde abajo.
    timeline.to(
      grid,
      {
        opacity: 0.4,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.65,
      },
      0.12
    );

    // Aparece el identificador de Noticias.
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

    // El título se construye progresivamente.
    if (heading) {
      timeline.to(
        heading,
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.55,
        },
        0.3
      );
    }

    // La descripción aparece después del título.
    if (introduction) {
      timeline.to(
        introduction,
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.35,
        },
        0.6
      );
    }

    // Reduce la iluminación cuando termina la entrada.
    timeline.to(
      light,
      {
        opacity: 0.25,
        duration: 0.3,
      },
      0.75
    );
  }, news);

  // El contexto restaura las propiedades originales.
  cleanupTransition = () => {
    context.revert();

    outgoing.remove();
    incoming.remove();
  };
}
