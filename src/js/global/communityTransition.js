
import { gsap } from "../gsap.js";

let activeProjects = null;
let activeCommunity = null;
let cleanupCommunity = null;

// Elimina los efectos antes de una nueva inicialización.
export function destroyCommunityTransition() {
  cleanupCommunity?.();

  cleanupCommunity = null;
  activeProjects = null;
  activeCommunity = null;
}

// Conecta visualmente los proyectos con la comunidad.
export function initCommunityTransition() {
  const projects = document.getElementById("proyectos");
  const community = document.getElementById("poblacion");

  if (!projects || !community) return;

  if (
    activeProjects === projects &&
    activeCommunity === community
  ) {
    return;
  }

  destroyCommunityTransition();

  activeProjects = projects;
  activeCommunity = community;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduceMotion) return;

  const title = community.querySelector(
    ".associates-title"
  );

  const introduction = community.querySelector(
    ".associates-introduction"
  );

  const topline = community.querySelector(
    ".associates-topline"
  );

  const background = community.querySelector(
    ".associates-background"
  );

  // Las capas se integran en las secciones existentes.
  const outgoing = document.createElement("div");
  outgoing.className = "cfp-community-outgoing";
  outgoing.setAttribute("aria-hidden", "true");

  const incoming = document.createElement("div");
  incoming.className = "cfp-community-incoming";
  incoming.setAttribute("aria-hidden", "true");

  incoming.innerHTML = `
    <div class="cfp-community-light"></div>
    <div class="cfp-community-grid"></div>
    <div class="cfp-community-line"></div>
  `;

  projects.append(outgoing);
  community.prepend(incoming);

  const light = incoming.querySelector(
    ".cfp-community-light"
  );

  const grid = incoming.querySelector(
    ".cfp-community-grid"
  );

  const line = incoming.querySelector(
    ".cfp-community-line"
  );

  const context = gsap.context(() => {
    gsap.set(outgoing, { opacity: 0 });

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

    // Solo se animan propiedades que no afectan
    // el desplazamiento ni la escala del carrusel.
    if (background) {
      gsap.set(background, {
        clipPath: "inset(65% 0% 0% 0%)",
      });
    }

    if (topline) {
      gsap.set(topline, {
        clipPath: "inset(0% 0% 100% 0%)",
      });
    }

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
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: community,
        start: "top 95%",
        end: "top 10%",
        scrub: 0.8,
        invalidateOnRefresh: true,
      },
    });

    // Los proyectos entregan la escena.
    timeline.to(
      outgoing,
      {
        opacity: 0.85,
        duration: 0.3,
      },
      0
    );

    // La luz continúa hacia la comunidad.
    timeline.to(
      light,
      {
        opacity: 1,
        yPercent: 0,
        duration: 0.5,
      },
      0
    );

    timeline.to(
      line,
      {
        scaleX: 1,
        duration: 0.45,
      },
      0.08
    );

    timeline.to(
      grid,
      {
        opacity: 0.4,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.65,
      },
      0.1
    );

    // La fotografía se descubre progresivamente.
    if (background) {
      timeline.to(
        background,
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.7,
        },
        0.12
      );
    }

    // El encabezado se construye por etapas.
    if (topline) {
      timeline.to(
        topline,
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.25,
        },
        0.22
      );
    }

    if (title) {
      timeline.to(
        title,
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.55,
        },
        0.3
      );
    }

    if (introduction) {
      timeline.to(
        introduction,
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.35,
        },
        0.58
      );
    }

    timeline.to(
      light,
      {
        opacity: 0.25,
        duration: 0.25,
      },
      0.75
    );
  }, community);

  cleanupCommunity = () => {
    context.revert();

    outgoing.remove();
    incoming.remove();
  };
}
