
import { gsap } from "../gsap.js";

let activeAbout = null;
let activeProjects = null;
let cleanupTransition = null;

// Limpia los efectos y las capas decorativas.
export function destroySectionTransitions() {
  cleanupTransition?.();

  cleanupTransition = null;
  activeAbout = null;
  activeProjects = null;
}

// Construye la entrada de Proyectos mediante el scroll.
export function initSectionTransitions() {
  const about = document.getElementById("acerca-de");
  const projects = document.getElementById("proyectos");

  if (!about || !projects) return;

  if (
    activeAbout === about &&
    activeProjects === projects
  ) {
    return;
  }

  destroySectionTransitions();

  activeAbout = about;
  activeProjects = projects;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduceMotion) {
    cleanupTransition = () => {};
    return;
  }

  const title = projects.querySelector(".projects-title");
  const introduction = projects.querySelector(
    ".projects-introduction"
  );

  // Se añaden capas dentro de las secciones existentes.
  const outgoing = document.createElement("div");
  outgoing.className = "cfp-transition-outgoing";
  outgoing.setAttribute("aria-hidden", "true");

  const incoming = document.createElement("div");
  incoming.className = "cfp-transition-incoming";
  incoming.setAttribute("aria-hidden", "true");

  incoming.innerHTML = `
    <div class="cfp-transition-glow"></div>
    <div class="cfp-transition-grid"></div>
    <div class="cfp-transition-line"></div>
  `;

  about.append(outgoing);
  projects.prepend(incoming);

  const glow = incoming.querySelector(
    ".cfp-transition-glow"
  );

  const grid = incoming.querySelector(
    ".cfp-transition-grid"
  );

  const line = incoming.querySelector(
    ".cfp-transition-line"
  );

  const context = gsap.context(() => {
    // Estado inicial de las capas.
    gsap.set(outgoing, {
      opacity: 0,
    });

    gsap.set(glow, {
      opacity: 0,
      yPercent: 30,
    });

    gsap.set(grid, {
      opacity: 0,
      clipPath: "inset(100% 0% 0% 0%)",
    });

    gsap.set(line, {
      scaleX: 0,
      transformOrigin: "left center",
    });

    // Las máscaras no modifican la posición de los textos.
    if (title) {
      gsap.set(title, {
        clipPath: "inset(0% 0% 100% 0%)",
      });
    }

    if (introduction) {
      gsap.set(introduction, {
        clipPath: "inset(0% 0% 100% 0%)",
      });
    }

    const timeline = gsap.timeline({
      defaults: {
        ease: "none",
      },
      scrollTrigger: {
        trigger: projects,
        start: "top 95%",
        end: "top 12%",
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });

    // La iluminación nace al terminar Aboutme.
    timeline.to(
      outgoing,
      {
        opacity: 0.75,
        duration: 0.25,
      },
      0
    );

    // La nueva sección comienza a recibir luz.
    timeline.to(
      glow,
      {
        opacity: 1,
        yPercent: 0,
        duration: 0.5,
      },
      0
    );

    // Una línea conecta visualmente ambas secciones.
    timeline.to(
      line,
      {
        scaleX: 1,
        duration: 0.45,
      },
      0.1
    );

    // La cuadrícula se construye desde abajo.
    timeline.to(
      grid,
      {
        opacity: 0.45,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.65,
      },
      0.12
    );

    // El título se revela progresivamente.
    if (title) {
      timeline.to(
        title,
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.6,
        },
        0.25
      );
    }

    // La descripción completa la entrada.
    if (introduction) {
      timeline.to(
        introduction,
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.4,
        },
        0.55
      );
    }

    // La luz disminuye cuando la sección ya está construida.
    timeline.to(
      glow,
      {
        opacity: 0.25,
        duration: 0.3,
      },
      0.8
    );
  }, projects);

  cleanupTransition = () => {
    context.revert();

    outgoing.remove();
    incoming.remove();
  };
}
