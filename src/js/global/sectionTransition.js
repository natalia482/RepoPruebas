import { gsap } from "../gsap.js";

let activeAbout = null;
let activeProjects = null;
let cleanupTransition = null;

// Revierte los efectos y retira las capas creadas por esta transición.
export function destroySectionTransitions() {
  cleanupTransition?.();
  cleanupTransition = null;
  activeAbout = null;
  activeProjects = null;
}

// Construye visualmente la entrada de Proyectos mientras se hace scroll.
export function initSectionTransitions() {
  const about = document.getElementById("acerca-de");
  const projects = document.getElementById("proyectos");

  if (!about || !projects) return;
  if (activeAbout === about && activeProjects === projects) return;

  destroySectionTransitions();
  activeAbout = about;
  activeProjects = projects;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduceMotion) return;

  const title = projects.querySelector(".projects-title");
  const introduction = projects.querySelector(".projects-introduction");
  const background = projects.querySelector(".projects-background");

  // Estas capas son decorativas: no añaden altura al documento.
  const outgoing = document.createElement("div");
  outgoing.className = "cfp-build-outgoing";
  outgoing.setAttribute("aria-hidden", "true");

  const incoming = document.createElement("div");
  incoming.className = "cfp-build-incoming";
  incoming.setAttribute("aria-hidden", "true");
  incoming.innerHTML = `
    <div class="cfp-build-light"></div>
    <div class="cfp-build-grid"></div>
    <div class="cfp-build-edge"></div>
  `;

  about.append(outgoing);
  projects.prepend(incoming);

  const light = incoming.querySelector(".cfp-build-light");
  const grid = incoming.querySelector(".cfp-build-grid");
  const edge = incoming.querySelector(".cfp-build-edge");

  // El contexto mantiene separados los efectos de esta transición.
  const context = gsap.context(() => {
    gsap.set(outgoing, { autoAlpha: 0 });
    gsap.set(incoming, { autoAlpha: 1 });
    gsap.set(light, { autoAlpha: 0, yPercent: 35 });
    gsap.set(grid, { autoAlpha: 0, clipPath: "inset(100% 0% 0% 0%)" });
    gsap.set(edge, { scaleX: 0, transformOrigin: "left center" });

    // La máscara actúa sobre hijos del encabezado, no sobre el
    // encabezado que ya anima projectsVision.js.
    if (title) {
      gsap.set(title, { clipPath: "inset(0% 0% 100% 0%)" });
    }
    if (introduction) {
      gsap.set(introduction, { clipPath: "inset(0% 0% 100% 0%)" });
    }

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: projects,
        start: "top 95%",
        end: "top 22%",
        scrub: 1,
        invalidateOnRefresh: true,
      },
    });

    timeline
      .to(outgoing, { autoAlpha: 0.85, duration: 0.3, ease: "none" }, 0)
      .to(light, { autoAlpha: 1, yPercent: 0, duration: 0.55, ease: "none" }, 0)
      .to(edge, { scaleX: 1, duration: 0.55, ease: "none" }, 0.08)
      .to(grid, {
        autoAlpha: 0.45,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.65,
        ease: "none",
      }, 0.12);

    if (background) {
      timeline.fromTo(
        background,
        { filter: "brightness(0.75)" },
        { filter: "brightness(1)", duration: 0.65, ease: "none" },
        0.12
      );
    }

    if (title) {
      timeline.to(title, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.55,
        ease: "none",
      }, 0.22);
    }

    if (introduction) {
      timeline.to(introduction, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 0.4,
        ease: "none",
      }, 0.48);
    }

    timeline.to(light, { autoAlpha: 0.3, duration: 0.35, ease: "none" }, 0.72);
  }, projects);

  cleanupTransition = () => {
    context.revert();
    outgoing.remove();
    incoming.remove();
  };
}
