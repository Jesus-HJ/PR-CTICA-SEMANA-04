(() => {
  "use strict";

  const canvas = document.querySelector("#gameCanvas");

  const ctx = canvas.getContext("2d");

  const gamesContainer = document.querySelector("#gamesContainer");

  const filters = document.querySelectorAll(".filter");

  const arcadeBtn = document.querySelector("#arcadeBtn");

  const pauseCanvasBtn = document.querySelector("#pauseCanvasBtn");

  const exploreBtn = document.querySelector("#exploreBtn");

  const xpBtn = document.querySelector("#xpBtn");

  const xpValue = document.querySelector("#xpValue");

  const xpProgress = document.querySelector("#xpProgress");

  const levelText = document.querySelector("#levelText");

  const emailInput = document.querySelector("#emailInput");

  const newsletterForm = document.querySelector("#newsletterForm");

  const formMessage = document.querySelector("#formMessage");

  const fpsValue = document.querySelector("#fpsValue");

  const particleValue = document.querySelector("#particleValue");

  const frameValue = document.querySelector("#frameValue");

  const listenersValue = document.querySelector("#listenersValue");

  const optimizationText = document.querySelector("#optimizationText");

  const games = [
    {
      title: "Cyber Strike",
      category: "accion",
      icon: "⚔️",
      description: "Combate futurista y acción intensa.",
    },

    {
      title: "Lost Kingdom",
      category: "aventura",
      icon: "🏰",
      description: "Explora mundos y descubre secretos.",
    },

    {
      title: "Nitro Racing",
      category: "carreras",
      icon: "🏎️",
      description: "Velocidad extrema y competición.",
    },

    {
      title: "Empire War",
      category: "estrategia",
      icon: "♟️",
      description: "Construye tu imperio y conquista.",
    },

    {
      title: "Shadow Hunter",
      category: "accion",
      icon: "🥷",
      description: "Combates rápidos en las sombras.",
    },

    {
      title: "Dragon Quest",
      category: "aventura",
      icon: "🐉",
      description: "Una aventura llena de criaturas.",
    },

    {
      title: "Turbo X",
      category: "carreras",
      icon: "🏁",
      description: "Carreras urbanas a máxima velocidad.",
    },

    {
      title: "Galaxy Commander",
      category: "estrategia",
      icon: "🚀",
      description: "Controla una flota espacial.",
    },
  ];

  const renderGames = (category = "todos") => {
    gamesContainer.innerHTML = "";

    const filteredGames =
      category === "todos"
        ? games
        : games.filter((game) => game.category === category);

    filteredGames.forEach((game) => {
      const article = document.createElement("article");

      article.classList.add("game-card");

      article.innerHTML = `

                <div class="game-image">
                    ${game.icon}
                </div>

                <div class="game-info">

                    <h3>
                        ${game.title}
                    </h3>

                    <p>
                        ${game.description}
                    </p>

                    <span class="game-tag">
                        ${game.category.toUpperCase()}
                    </span>

                </div>
            `;

      gamesContainer.appendChild(article);
    });
  };

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      filters.forEach((item) => item.classList.remove("active"));

      filter.classList.add("active");

      renderGames(filter.dataset.category);
    });
  });

  const createExperienceSystem = (() => {
    let xp = 0;

    return () => {
      xp += 25;

      const level = Math.floor(xp / 100) + 1;

      const progress = xp % 100;

      xpValue.textContent = `${xp} XP`;

      xpProgress.style.width = `${progress}%`;

      levelText.textContent = `Nivel ${level} · ${
        level === 1 ? "Novato" : "Jugador avanzado"
      }`;
    };
  })();

  xpBtn.addEventListener("click", () => createExperienceSystem());

  arcadeBtn.addEventListener("click", () => {
    document.body.classList.toggle("arcade");

    const enabled = document.body.classList.contains("arcade");

    arcadeBtn.textContent = enabled ? "🎮 Arcade activado" : "🎮 Modo Arcade";
  });

  exploreBtn.addEventListener("click", () => {
    document.querySelector("#juegos")?.scrollIntoView({
      behavior: "smooth",
    });
  });

  let animationId = null;

  let running = true;

  let lastTime = 0;

  let frames = 0;

  let fps = 0;

  let fpsTimer = 0;

  const resizeCanvas = () => {
    const ratio = window.devicePixelRatio || 1;

    canvas.width = canvas.clientWidth * ratio;

    canvas.height = canvas.clientHeight * ratio;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  window.addEventListener("resize", resizeCanvas);

  const particles = [];

  const createParticle = () => {
    particles.push({
      x: Math.random() * canvas.clientWidth,

      y: Math.random() * canvas.clientHeight,

      radius: Math.random() * 3 + 1,

      speed: Math.random() * 30 + 20,

      opacity: Math.random() * 0.7 + 0.3,
    });
  };

  for (let i = 0; i < 70; i++) {
    createParticle();
  }

  /* =====================================================
       DIBUJAR PARTÍCULAS
    ====================================================== */

  const drawParticles = () => {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    particles.forEach((particle) => {
      ctx.beginPath();

      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);

      ctx.fillStyle = `rgba(124,58,237,${particle.opacity})`;

      ctx.fill();
    });
  };

  const updateParticles = (dt) => {
    particles.forEach((particle) => {
      particle.y -= particle.speed * dt;

      if (particle.y < -10) {
        particle.y = canvas.clientHeight + 10;

        particle.x = Math.random() * canvas.clientWidth;
      }
    });
  };

  const animate = (timestamp) => {
    if (!running) {
      return;
    }

    if (!lastTime) {
      lastTime = timestamp;
    }

    const dt = Math.min((timestamp - lastTime) / 1000, 0.05);

    lastTime = timestamp;

    updateParticles(dt);

    drawParticles();

    frames++;

    fpsTimer += dt;

    if (fpsTimer >= 1) {
      fps = frames;

      frames = 0;

      fpsTimer = 0;

      fpsValue.textContent = fps;
    }

    frameValue.textContent = Number(frameValue.textContent) + 1;

    particleValue.textContent = particles.length;

    animationId = requestAnimationFrame(animate);
  };

  resizeCanvas();

  animationId = requestAnimationFrame(animate);

  pauseCanvasBtn.addEventListener("click", () => {
    running = !running;

    if (!running) {
      cancelAnimationFrame(animationId);

      pauseCanvasBtn.textContent = "▶ Reanudar efectos";

      optimizationText.textContent =
        "Animación pausada mediante cancelAnimationFrame.";
    } else {
      lastTime = 0;

      pauseCanvasBtn.textContent = "⏸ Pausar efectos";

      optimizationText.textContent =
        "requestAnimationFrame ejecutándose correctamente.";

      animationId = requestAnimationFrame(animate);
    }
  });

  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = emailInput.value.trim();

    if (!email) {
      formMessage.textContent = "⚠ Ingresa un correo electrónico.";

      formMessage.style.color = "#f87171";

      return;
    }

    if (!email.includes("@")) {
      formMessage.textContent = "⚠ El correo no es válido.";

      formMessage.style.color = "#f87171";

      return;
    }

    formMessage.textContent = "✓ Suscripción realizada correctamente.";

    formMessage.style.color = "#22c55e";

    emailInput.value = "";
  });

  const totalListeners = document.querySelectorAll("button, input, a").length;

  listenersValue.textContent = totalListeners;

  renderGames();
})();
