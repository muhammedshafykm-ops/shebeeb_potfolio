document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const loader = document.querySelector(".loader");
  const toast = document.querySelector(".toast");
  const backToTop = document.querySelector(".back-to-top");
  const nav = document.querySelector(".nav");
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
  const revealItems = document.querySelectorAll(".reveal");
  const progressBar = document.querySelector(".scroll-progress");
  const typingText = document.getElementById("typing-text");
  const counters = document.querySelectorAll("[data-count]");
  const contactForm = document.getElementById("contact-form");
  const resumeDownload = document.getElementById("resume-download");

  const typingPhrases = [
    "build innovative engineering solutions.",
    "design reliable validation workflows.",
    "create smart IoT-driven systems.",
  ];

  const toastTimer = { id: null };
  const letters = ["text", "html", "css", "javascript"];

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer.id);
    toastTimer.id = window.setTimeout(() => toast.classList.remove("is-visible"), 2800);
  };

  const updateProgress = () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const value = total > 0 ? (window.scrollY / total) * 100 : 0;
    progressBar.style.width = `${value}%`;
    backToTop.classList.toggle("is-visible", window.scrollY > 500);
  };

  const setActiveNav = () => {
    const sections = navLinks
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    const offset = window.innerHeight * 0.35;
    let activeId = "#home";

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= offset && rect.bottom >= offset) {
        activeId = `#${section.id}`;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === activeId);
    });
  };

  const closeMobileNav = () => {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileNav();
    });
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", () => {
    updateProgress();
    setActiveNav();
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const countElement = entry.target;
        const target = Number(countElement.dataset.count || 0);
        const duration = 1400;
        const start = performance.now();

        const animate = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const value = Math.floor(progress * target);
          countElement.textContent = `${value}+`;
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            countElement.textContent = `${target}+`;
          }
        };

        requestAnimationFrame(animate);
        counterObserver.unobserve(countElement);
      });
    },
    { threshold: 0.65 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  const typePhrase = async (phrase) => {
    typingText.textContent = "";
    for (let index = 0; index < phrase.length; index += 1) {
      typingText.textContent += phrase[index];
      await new Promise((resolve) => setTimeout(resolve, 42));
    }
    await new Promise((resolve) => setTimeout(resolve, 1200));
    for (let index = phrase.length; index >= 0; index -= 1) {
      typingText.textContent = phrase.slice(0, index);
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
  };

  const runTypingLoop = async () => {
    while (true) {
      for (const phrase of typingPhrases) {
        await typePhrase(phrase);
      }
    }
  };

  // Typing animation disabled per user request.
  // runTypingLoop();
  if (typingText && typingPhrases.length) typingText.textContent = typingPhrases[0];

  const buildResumeText = () => `Muhammed Shebeeb K M
R&D Engineer | Electrical & Electronics Engineer
Location: Ernakulam, Kerala, India
Email: shebeebkm6@gmail.com
Phone: +91 8089965560

Summary
Passionate and results-driven R&D Engineer specializing in product validation, embedded systems, IoT, and innovative engineering solutions.

Experience
KCM Appliances Pvt Ltd (Impex) | Engineer - R&D
Aug 2024 - Mar 2026
- Product validation
- Appliance benchmarking
- Power BI dashboards
- BOM preparation
- Competitor teardown analysis
- ERP coordination
- Design modifications
- Cross-team collaboration

Highlights
- Continuous Passive Motion (CPM) Machine
- IEEE leadership roles
- National innovation and research recognition`;

  resumeDownload.addEventListener("click", (event) => {
    event.preventDefault();
    const blob = new Blob([buildResumeText()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Muhammed-Shebeeb-K-M-Resume.txt";
    document.body.appendChild(link);
    link.click();
    window.setTimeout(() => {
      URL.revokeObjectURL(url);
      link.remove();
    }, 500);
    showToast("Resume download started.");
  });

  const validateContact = (formData) => {
    const errors = {};
    const name = formData.get("name", "").trim();
    const email = formData.get("email", "").trim();
    const message = formData.get("message", "").trim();

    if (!name) errors.name = "Please enter your name.";
    if (!email) {
      errors.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!message || message.length < 10) errors.message = "Message should be at least 10 characters.";

    return errors;
  };

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const errors = validateContact(formData);

    document.querySelectorAll(".error").forEach((error) => {
      error.textContent = "";
    });

    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(([key, message]) => {
        const target = document.querySelector(`[data-error-for="${key}"]`);
        if (target) target.textContent = message;
      });
      showToast("Please fix the highlighted fields.");
      return;
    }

    contactForm.reset();
    showToast("Message sent successfully. I’ll get back to you soon.");
  });

  // cursor glow removed per user request

  window.addEventListener("resize", () => {
    updateProgress();
    if (window.innerWidth > 860) {
      closeMobileNav();
    }
  });

  const canvas = document.getElementById("particle-canvas");
  const context = canvas.getContext("2d");
  const particles = [];
  const particleCount = 58;

  const resizeCanvas = () => {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    context.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  };

  const createParticle = () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    radius: 0.6 + Math.random() * 1.8,
    vx: -0.2 + Math.random() * 0.4,
    vy: -0.2 + Math.random() * 0.4,
    alpha: 0.18 + Math.random() * 0.42,
  });

  const initParticles = () => {
    particles.length = 0;
    for (let index = 0; index < particleCount; index += 1) {
      particles.push(createParticle());
    }
  };

  const drawParticles = () => {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < -20) particle.x = window.innerWidth + 20;
      if (particle.x > window.innerWidth + 20) particle.x = -20;
      if (particle.y < -20) particle.y = window.innerHeight + 20;
      if (particle.y > window.innerHeight + 20) particle.y = -20;

      context.beginPath();
      context.fillStyle = `rgba(0, 255, 213, ${particle.alpha})`;
      context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      context.fill();

      for (let otherIndex = index + 1; otherIndex < particles.length; otherIndex += 1) {
        const other = particles[otherIndex];
        const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
        if (distance < 140) {
          context.beginPath();
          context.strokeStyle = `rgba(0, 183, 255, ${0.12 - distance / 1200})`;
          context.lineWidth = 1;
          context.moveTo(particle.x, particle.y);
          context.lineTo(other.x, other.y);
          context.stroke();
        }
      }
    });

    requestAnimationFrame(drawParticles);
  };

  resizeCanvas();
  initParticles();
  drawParticles();

  window.addEventListener("resize", () => {
    resizeCanvas();
    initParticles();
  });

  window.addEventListener("load", () => {
    setTimeout(() => loader.classList.add("is-hidden"), 700);
    updateProgress();
    setActiveNav();
    showToast("Portfolio loaded.");
  });
});
