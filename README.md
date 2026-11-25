# 🌱 Campesinos Forjadores de Paz (CFP)
### Landing Page Institucional | Silvania, Cundinamarca, Colombia

<p align="center">
  <img src="https://img.shields.io/badge/Astro-Framework-BC52EE?style=for-the-badge&logo=astro&logoColor=white" alt="Astro">
  <img src="https://img.shields.io/badge/GSAP-Animations-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP">
  <img src="https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/TypeScript-Language-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/CSS3-Styles-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
</p>

---

## 📖 Sobre el proyecto

**Campesinos Forjadores de Paz (CFP)** es una landing page institucional desarrollada para fortalecer la presencia digital y visibilizar el trabajo de una asociación rural ubicada en **Silvania, Cundinamarca, Colombia**, en la región del Sumapaz.

La asociación está conformada principalmente por mujeres rurales y productores agropecuarios que trabajan por el fortalecimiento de la calidad de vida del campesinado, el desarrollo de proyectos productivos y el crecimiento de las comunidades rurales.

Este proyecto busca transmitir su identidad, presentar sus iniciativas, compartir sus avances y acercar la asociación a nuevas oportunidades de colaboración.

### 🎯 Objetivo

Desarrollar una experiencia web moderna, interactiva y adaptable a diferentes dispositivos que permita comunicar la identidad de CFP, destacar sus proyectos agrícolas y facilitar el acceso a su información institucional.

---

## 🖥️ Vista previa

<p align="center">
  <img src="RUTA_DE_TU_CAPTURA_PRINCIPAL" alt="Página principal de Campesinos Forjadores de Paz" width="100%">
</p>

<p align="center">
  <em>Vista principal de la landing page.</em>
</p>

<!-- Puedes agregar más capturas de las secciones internas y de la versión móvil. -->

---

## ✨ Características principales

### 🌿 1. Animación de entrada interactiva (Hero Reveal)
- Máscara SVG tipográfica con las iniciales **CFP**.
- Animación de expansión mediante GSAP ScrollTrigger.
- Revelación progresiva de la identidad visual de la asociación.
- Experiencia de navegación dinámica desde el primer contacto.

### 🧭 2. Navegación flotante adaptativa
- Barra de navegación con efecto Glassmorphism.
- Desplazamiento suave entre secciones mediante GSAP ScrollToPlugin.
- Menú desplegable adaptable a dispositivos móviles.
- Interfaz intuitiva y navegación fluida.

### 🌱 3. Portafolio dinámico: proyectos y visión
Sistema de pestañas interactivas que permite visualizar las iniciativas de la asociación.

**Proyectos actuales:**
- Subsidio Tarjeta Campesina.
- Insumos Agrícolas.
- Mujeres Arandaneras.

**Proyectos y metas a futuro:**
- CFP App.
- Mejoramiento de la sede de la asociación.

### 🍇 4. Carrusel infinito y contadores de impacto
- Galería horizontal de imágenes con desplazamiento continuo.
- Animaciones reactivas a la velocidad del scroll.
- Contadores numéricos animados para representar el impacto comunitario.

### 📰 5. Noticias y actualizaciones
- Espacio para eventos y actividades de la asociación.
- Publicación de capacitaciones y procesos formativos.
- Visibilización de alianzas institucionales, incluyendo iniciativas relacionadas con el SENA y la Secretaría de Mujer y Género.
- Microinteracciones para mejorar la experiencia de navegación.

### ⚡ 6. Optimización de recursos
- Procesamiento de imágenes mediante `astro:assets`.
- Organización modular de componentes.
- Uso de recursos optimizados para mejorar los tiempos de carga.

### 📱 7. Diseño adaptable (Responsive Design)
- Adaptación de la interfaz a diferentes tamaños de pantalla.
- Organización flexible de componentes.
- Ajustes de navegación y contenido para dispositivos móviles y tabletas.

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Descripción |
|---|---|
| [Astro](https://astro.build/) | Framework principal para el desarrollo de la landing page. |
| [GSAP](https://gsap.com/) | Biblioteca para animaciones e interacciones. |
| [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) | Animaciones vinculadas al desplazamiento. |
| [ScrollToPlugin](https://gsap.com/docs/v3/Plugins/ScrollToPlugin/) | Desplazamiento animado entre secciones. |
| [JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript) | Lógica e interactividad de la aplicación. |
| [TypeScript](https://www.typescriptlang.org/) | Tipado y soporte para el desarrollo. |
| [HTML5](https://developer.mozilla.org/es/docs/Web/HTML) | Estructura semántica del contenido. |
| [CSS3](https://developer.mozilla.org/es/docs/Web/CSS) | Estilos, animaciones y diseño responsive. |

---

## 📂 Estructura del proyecto

```text
landingpage-cfp/
│
├── public/
│   └── Archivos estáticos (favicon, recursos públicos, etc.)
│
├── src/
│   ├── assets/
│   │   └── Imágenes optimizadas (proyectos, noticias y galería)
│   │
│   ├── components/
│   │   └── Componentes modulares de Astro
│   │       ├── Header
│   │       ├── Entrada
│   │       ├── Proyectos
│   │       ├── Población
│   │       ├── Noticias
│   │       └── Footer
│   │
│   ├── css/
│   │   └── Hojas de estilo adicionales
│   │
│   ├── js/
│   │   └── Scripts de GSAP y lógica interactiva
│   │
│   ├── layouts/
│   │   └── Layout.astro
│   │
│   └── pages/
│       └── index.astro
│
├── astro.config.mjs
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

## 🚀 Instalación y ejecución local

Sigue estos pasos para ejecutar el proyecto en tu entorno de desarrollo.

### 1. Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (versión compatible con el proyecto).
- npm (incluido con Node.js).
- [Git](https://git-scm.com/).

### 2. Clonar el repositorio

```bash
git clone https://github.com/natalia482/landingpage-cfp.git
```

### 3. Acceder al directorio

```bash
cd landingpage-cfp
```

### 4. Instalar dependencias

```bash
npm install
```

### 5. Iniciar el servidor de desarrollo

```bash
npm run dev
```

El proyecto estará disponible en:

```text
http://localhost:4321
```

### 6. Compilar para producción

```bash
npm run build
```

### 7. Previsualizar la compilación

```bash
npm run preview
```

---

## 📜 Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run build` | Genera la versión de producción. |
| `npm run preview` | Permite visualizar localmente la compilación. |

---

## 👩‍💻 Desarrollo y autoría

**Briyit Natalia Villalobos Rodríguez**

Ingeniera de Sistemas y Computación  
Desarrollo Backend | Desarrollo Frontend

<p align="left">
  <a href="https://github.com/natalia482">
    <img src="https://img.shields.io/badge/GitHub-natalia482-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  </a>
  <a href="https://www.linkedin.com/in/briyit-natalia-villalobos-rodriguez-ingeniera-de-sistemas/">
    <img src="https://img.shields.io/badge/LinkedIn-Perfil_profesional-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
  </a>
</p>

---

## 🤝 Contacto de la asociación

**Asociación Campesinos Forjadores de Paz (CFP)**

- 📍 Ubicación: Silvania, Cundinamarca, Colombia.
- 📱 WhatsApp: [+57 313 803 7661](https://wa.me/573138037661).
- 📘 Facebook: Asociación Campesinos Forjadores de Paz.

---

<p align="center">
  🌱 <strong>Campesinos Forjadores de Paz</strong>
  <br>
  <em>Trabajando por el campo, construyendo oportunidades y fortaleciendo comunidades.</em>
</p>