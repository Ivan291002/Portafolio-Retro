document.addEventListener("DOMContentLoaded", () => {
  // === TYPING EFFECT ===
  const typedTextEl = document.querySelector(".typed-text");
  const phrases = ["Desarrollador Full Stack", "Amante del pixel art"];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 80;

  function typeEffect() {
    const current = phrases[phraseIndex];
    if (!isDeleting) {
      typedTextEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        typeSpeed = 1500;
        setTimeout(typeEffect, typeSpeed);
        return;
      }
      typeSpeed = 80 + Math.random() * 40;
    } else {
      typedTextEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
        setTimeout(typeEffect, typeSpeed);
        return;
      }
      typeSpeed = 40 + Math.random() * 30;
    }
    setTimeout(typeEffect, typeSpeed);
  }

  typeEffect();

  // === RANDOM GLITCH ON ELEMENTS ===
  function randomGlitch() {
    const targets = document.querySelectorAll(
      ".glitch-hover, .section-title, .skill-card, .project-card",
    );
    const el = targets[Math.floor(Math.random() * targets.length)];
    if (!el) return;
    el.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
    el.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
    setTimeout(
      () => {
        el.style.transform = "";
        el.style.filter = "";
      },
      100 + Math.random() * 200,
    );
  }

  setInterval(randomGlitch, 4000 + Math.random() * 3000);

  // === RANDOM SCANLINE FLICKER ===
  const scanlines = document.querySelector(".scanlines");
  setInterval(() => {
    if (Math.random() > 0.92) {
      scanlines.style.opacity = "0.3";
      setTimeout(
        () => {
          scanlines.style.opacity = "1";
        },
        80 + Math.random() * 120,
      );
    }
  }, 3000);

  // === NAVBAR ACTIVE LINK ===
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-links a");

  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });
    navLinks.forEach((link) => {
      link.style.color =
        link.getAttribute("href") === "#" + current ? "var(--cyan)" : "";
    });
  });

  // === MOBILE MENU ===
  const hamburger = document.querySelector(".hamburger");
  const navLinksContainer = document.querySelector(".nav-links");

  hamburger.addEventListener("click", () => {
    navLinksContainer.classList.toggle("active");
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinksContainer.classList.remove("active");
    });
  });

  // === SKILL BAR ANIMATION ON SCROLL ===
  const skillFills = document.querySelectorAll(".skill-fill");
  let skillsAnimated = false;

  function animateSkillBars() {
    if (skillsAnimated) return;
    const skillsSection = document.getElementById("skills");
    const rect = skillsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      skillFills.forEach((fill, i) => {
        const targetWidth = fill.style.width;
        fill.style.width = "0%";
        setTimeout(() => {
          fill.style.transition = "width 1s ease";
          fill.style.width = targetWidth;
        }, i * 200);
      });
      skillsAnimated = true;
    }
  }

  window.addEventListener("scroll", animateSkillBars);
  animateSkillBars();

  // === PARALLAX HERO BG TEXT ===
  const heroBgText = document.querySelector(".hero-bg-text");
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    if (heroBgText) {
      heroBgText.style.transform = `translate(-50%, calc(-50% + ${scrollY * 0.1}px))`;
    }
  });

  // === CONTACT FORM (WEB3FORMS CON CAPAS DE SEGURIDAD) ===
  const WEB3FORMS_ACCESS_KEY = "72fd7cf3-b10a-483d-bea6-d98a1ee44b01";

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    function showFeedback(btn, originalText, message, color, duration = 3000) {
      btn.textContent = message;
      btn.style.background = color;
      btn.style.boxShadow = `0 0 30px ${color}80`;
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = "";
        btn.style.boxShadow = "";
        btn.disabled = false;
      }, duration);
    }

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector("button");
      const originalText = btn.getAttribute("data-text") || "Enviar Mensaje";

      // 1. SEGURIDAD: Detección de Bot (Honeypot en cliente)
      const botField = document.getElementById("bot-check");
      if (botField && botField.value.trim() !== "") {
        // Bot detectado: fingir envío exitoso sin realizar petición
        contactForm.reset();
        showFeedback(btn, originalText, "Mensaje Enviado!", "#00ff41");
        return;
      }

      // 2. SEGURIDAD: Rate Limiting / Cooldown anti-spam (60 segundos)
      const COOLDOWN_SECONDS = 60;
      const lastSend = localStorage.getItem("portfolio_last_message_ts");
      if (lastSend) {
        const elapsed = (Date.now() - parseInt(lastSend, 10)) / 1000;
        if (elapsed < COOLDOWN_SECONDS) {
          const remaining = Math.ceil(COOLDOWN_SECONDS - elapsed);
          showFeedback(btn, originalText, `ESPERA ${remaining}s (ANTI-SPAM)`, "#ff6600");
          return;
        }
      }

      // 3. Sanitización y validación de campos
      const name = (document.getElementById("name").value || "").trim();
      const email = (document.getElementById("email").value || "").trim();
      const message = (document.getElementById("message").value || "").trim();

      if (!name || !email || !message) {
        showFeedback(btn, originalText, "COMPLETA TODOS LOS CAMPOS", "#ff00aa");
        return;
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        showFeedback(btn, originalText, "EMAIL INVALIDO", "#ff00aa");
        return;
      }

      if (name.length > 80 || email.length > 100 || message.length > 1500) {
        showFeedback(btn, originalText, "TEXTO DEMASIADO LARGO", "#ff00aa");
        return;
      }

      if (WEB3FORMS_ACCESS_KEY === "TU_ACCESS_KEY_AQUI") {
        showFeedback(btn, originalText, "FALTA ACCESS KEY EN SCRIPT.JS", "#ff00aa", 4000);
        console.warn("Genera tu Access Key gratis en https://web3forms.com y pégala en script.js");
        return;
      }

      btn.textContent = "Enviando...";
      btn.disabled = true;

      // 4. Envío mediante Web3Forms API
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: name,
          from_name: name,
          email: email,
          message: message,
          subject: `Nuevo contacto de ${name} (Portafolio Retro)`,
          botcheck: ""
        })
      })
      .then(async (response) => {
        const data = await response.json();
        if (response.ok && data.success) {
          localStorage.setItem("portfolio_last_message_ts", Date.now().toString());
          showFeedback(btn, originalText, "Mensaje Enviado!", "#00ff41");
          contactForm.reset();
        } else {
          throw new Error(data.message || "Error al enviar mensaje");
        }
      })
      .catch((error) => {
        console.error("Error Web3Forms:", error);
        showFeedback(btn, originalText, "Error al enviar", "#ff6600");
      });
    });
  }

  // === PIXEL AVATAR RANDOM DRAW ===
  const pixelArtContainer = document.querySelector(".pixel-art");
  if (pixelArtContainer) {
    const size = 8;
    const pixelSize = 180 / size;
    const chars = ["#", "X", "@", "O", "+", ".", " "];
    let pixelHTML = "";
    const pattern = [
      0, 0, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1,
      0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1,
      0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0,
    ];
    for (let i = 0; i < size * size; i++) {
      const on = pattern[i] || Math.random() > 0.5;
      const color = on
        ? Math.random() > 0.5
          ? "var(--cyan)"
          : "var(--magenta)"
        : "transparent";
      pixelHTML += `<span style="display:inline-block;width:${pixelSize}px;height:${pixelSize}px;background:${color};"></span>`;
    }
    pixelArtContainer.innerHTML = pixelHTML;
    pixelArtContainer.style.display = "flex";
    pixelArtContainer.style.flexWrap = "wrap";
    pixelArtContainer.style.justifyContent = "center";
    pixelArtContainer.style.alignItems = "center";
    pixelArtContainer.style.background = "none";
  }

  // === FLOATING PIXEL PARTICLES ===
  const pixelCanvas = document.createElement("canvas");
  pixelCanvas.style.cssText =
    "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;";
  document.body.prepend(pixelCanvas);
  const ctx = pixelCanvas.getContext("2d");
  let particles = [];

  function resizeCanvas() {
    pixelCanvas.width = window.innerWidth;
    pixelCanvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class Pixel {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * pixelCanvas.width;
      this.y = Math.random() * pixelCanvas.height;
      this.size = 2 + Math.random() * 4;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.color = ["#00f0ff", "#ff00aa", "#ffee00", "#00ff41"][
        Math.floor(Math.random() * 4)
      ];
      this.alpha = 0.1 + Math.random() * 0.3;
      this.life = 0;
      this.maxLife = 200 + Math.random() * 300;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life++;
      if (
        this.x < 0 ||
        this.x > pixelCanvas.width ||
        this.y < 0 ||
        this.y > pixelCanvas.height ||
        this.life > this.maxLife
      ) {
        this.reset();
      }
    }
    draw() {
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha * (1 - this.life / this.maxLife);
      ctx.fillRect(this.x, this.y, this.size, this.size);
      ctx.globalAlpha = 1;
    }
  }

  for (let i = 0; i < 60; i++) particles.push(new Pixel());

  function animatePixels() {
    ctx.clearRect(0, 0, pixelCanvas.width, pixelCanvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animatePixels);
  }
  animatePixels();

  // === MOUSE GLOW TRAIL ===
  const glow = document.createElement("div");
  glow.style.cssText = `
    position: fixed;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,240,255,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 1;
    transform: translate(-50%, -50%);
    transition: left 0.1s ease, top 0.1s ease;
  `;
  document.body.appendChild(glow);

  document.addEventListener("mousemove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  });

  document.addEventListener("mouseleave", () => {
    glow.style.opacity = "0";
  });

  document.addEventListener("mouseenter", () => {
    glow.style.opacity = "1";
  });

  console.log(
    "%c> Portafolio Retro Iniciado!",
    "color: #00f0ff; font-size: 16px;",
  );
  console.log("%c> Modo Retro Activado", "color: #ff00aa; font-size: 12px;");
});
