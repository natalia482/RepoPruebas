
let cleanupWaterText = null;
let currentWrapper = null;

// Elimina los eventos y libera los recursos del efecto.
export function destroyWaterText() {
  if (cleanupWaterText) {
    cleanupWaterText();
    cleanupWaterText = null;
  }

  currentWrapper = null;
}

// Inicializa la deformación del título mediante Canvas.
export function initWaterText() {
  const wrapper = document.querySelector("[data-about-water]");

  if (!wrapper) return;
  if (currentWrapper === wrapper) return;

  destroyWaterText();

  const title = wrapper.querySelector(".about-title");
  const canvas = wrapper.querySelector(".about-water-canvas");

  if (!title || !canvas) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  if (reduceMotion || !finePointer) return;

  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  const source = document.createElement("canvas");
  const sourceCtx = source.getContext("2d");

  if (!sourceCtx) return;

  currentWrapper = wrapper;

  const controller = new AbortController();
  const { signal } = controller;

  let width = 0;
  let height = 0;
  let scale = 1;

  let frame = null;
  let active = false;
  let waves = [];
  let lastWave = 0;

  // Reproduce el título en un Canvas auxiliar.
  function renderSource() {
    const bounds = wrapper.getBoundingClientRect();

    width = Math.max(1, bounds.width);
    height = Math.max(1, bounds.height);

    scale = Math.min(
      window.devicePixelRatio || 1,
      2
    );

    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);

    source.width = canvas.width;
    source.height = canvas.height;

    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    sourceCtx.setTransform(
      scale,
      0,
      0,
      scale,
      0,
      0
    );

    sourceCtx.clearRect(0, 0, width, height);

    const lines = title.querySelectorAll("span");

    lines.forEach((line) => {
      const rect = line.getBoundingClientRect();
      const styles = window.getComputedStyle(line);

      // La posición se obtiene sin depender del transform de GSAP.
      const x = line.offsetLeft;
      const y = line.offsetTop;

      sourceCtx.save();

      sourceCtx.font = [
        styles.fontStyle,
        styles.fontWeight,
        styles.fontSize,
        styles.fontFamily,
      ].join(" ");

      sourceCtx.fillStyle = styles.color;
      sourceCtx.textBaseline = "top";
      sourceCtx.textAlign = "left";

      if ("letterSpacing" in sourceCtx) {
        sourceCtx.letterSpacing = styles.letterSpacing;
      }

      // Ajusta la línea al espacio disponible.
      const text = line.textContent.trim();

      const measuredWidth = sourceCtx.measureText(text).width;
      const availableWidth = Math.max(
        1,
        Math.min(rect.width, width - x)
      );

      const textScale =
        measuredWidth > availableWidth
          ? availableWidth / measuredWidth
          : 1;

      sourceCtx.translate(x, y);
      sourceCtx.scale(textScale, 1);

      // Centra visualmente el texto dentro de su altura de línea.
      const fontSize = parseFloat(styles.fontSize);
      const lineHeight = parseFloat(styles.lineHeight) || fontSize;

      const verticalOffset = Math.max(
        0,
        (lineHeight - fontSize) / 2
      );

      sourceCtx.fillText(
        text,
        0,
        verticalOffset
      );

      sourceCtx.restore();
    });
  }

  // Registra una onda con posición, intensidad y tiempo de inicio.
  function addWave(x, y, strength = 12) {
    waves.push({
      x,
      y,
      strength,
      start: performance.now(),
    });

    if (waves.length > 8) {
      waves.shift();
    }
  }

  // Calcula el desplazamiento radial de cada fragmento.
  function getDisplacement(x, y, time) {
    let dx = 0;
    let dy = 0;

    for (const wave of waves) {
      const age = (time - wave.start) / 1000;
      const duration = 2.8;

      if (age < 0 || age > duration) continue;

      const offsetX = x - wave.x;
      const offsetY = y - wave.y;

      const distance = Math.hypot(
        offsetX,
        offsetY
      );

      const radius = age * 85;

      const ring = Math.exp(
        -Math.pow(
          (distance - radius) / 48,
          2
        )
      );

      const oscillation = Math.sin(
        (distance - radius) * 0.13
      );

      const fade = 1 - age / duration;

      const displacement =
        oscillation *
        ring *
        wave.strength *
        fade;

      if (distance > 0.001) {
        dx +=
          (offsetX / distance) *
          displacement;

        dy +=
          (offsetY / distance) *
          displacement;
      }
    }

    return { dx, dy };
  }

  // Dibuja el texto desplazando pequeños fragmentos.
  function draw(time) {
    if (!active) {
      frame = null;
      return;
    }

    ctx.clearRect(0, 0, width, height);

    waves = waves.filter(
      (wave) => time - wave.start < 2800
    );

    if (!waves.length) {
      ctx.drawImage(
        source,
        0,
        0,
        width,
        height
      );
    } else {
      const tileWidth = 12;
      const tileHeight = 5;

      for (let y = 0; y < height; y += tileHeight) {
        for (let x = 0; x < width; x += tileWidth) {
          const tileW = Math.min(
            tileWidth,
            width - x
          );

          const tileH = Math.min(
            tileHeight,
            height - y
          );

          const movement = getDisplacement(
            x + tileW / 2,
            y + tileH / 2,
            time
          );

          ctx.drawImage(
            source,
            x * scale,
            y * scale,
            tileW * scale,
            tileH * scale,
            x + movement.dx,
            y + movement.dy,
            tileW + 0.5,
            tileH + 0.5
          );
        }
      }
    }

    frame = requestAnimationFrame(draw);
  }

  // Obtiene la posición del cursor dentro del título.
  function getPointerPosition(event) {
    const rect = wrapper.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  // Activa el Canvas cuando el título está listo.
  function onPointerEnter(event) {
    const lines = title.querySelectorAll("span");

    const isAnimating = Array.from(lines).some(
      (line) => {
        const styles = window.getComputedStyle(line);

        return (
          styles.visibility === "hidden" ||
          Number(styles.opacity) < 0.99
        );
      }
    );

    if (isAnimating) return;

    renderSource();

    active = true;
    wrapper.classList.add("water-active");

    const { x, y } = getPointerPosition(event);

    addWave(x, y, 15);

    if (frame === null) {
      frame = requestAnimationFrame(draw);
    }
  }

  // Genera ondas suaves durante el movimiento.
  function onPointerMove(event) {
    if (!active) return;

    const now = performance.now();

    if (now - lastWave < 100) return;

    lastWave = now;

    const { x, y } = getPointerPosition(event);

    addWave(x, y, 9);
  }

  // Genera una onda más intensa al presionar.
  function onPointerDown(event) {
    if (!active) return;

    const { x, y } = getPointerPosition(event);

    addWave(x, y, 26);
  }

  // Recupera el título HTML al salir del área.
  function onPointerLeave() {
    active = false;
    waves = [];

    wrapper.classList.remove("water-active");

    if (frame !== null) {
      cancelAnimationFrame(frame);
      frame = null;
    }
  }

  wrapper.addEventListener(
    "pointerenter",
    onPointerEnter,
    { signal }
  );

  wrapper.addEventListener(
    "pointermove",
    onPointerMove,
    { signal }
  );

  wrapper.addEventListener(
    "pointerdown",
    onPointerDown,
    { signal }
  );

  wrapper.addEventListener(
    "pointerleave",
    onPointerLeave,
    { signal }
  );

  // Mantiene las dimensiones sincronizadas con el diseño.
  const resizeObserver = new ResizeObserver(() => {
    if (active) {
      renderSource();
    }
  });

  resizeObserver.observe(wrapper);

  // Actualiza la representación cuando termina de cargar la fuente.
  document.fonts?.ready.then(() => {
    if (active && currentWrapper === wrapper) {
      renderSource();
    }
  });

  cleanupWaterText = () => {
    onPointerLeave();
    controller.abort();
    resizeObserver.disconnect();
  };
}
