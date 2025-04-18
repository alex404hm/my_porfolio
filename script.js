document.addEventListener("DOMContentLoaded", init);

function init() {
  initMobileMenuToggle();
  initSmoothScrolling();
  initTypingEffect();
  initGradientBlobs();
  initScrollToTopButton();
  initCurrentYear();
  fetchGitHubProjects();
}

function initMobileMenuToggle() {
  const toggle = document.getElementById("mobile-menu-toggle");
  const menu = document.getElementById("mobile-menu");
  const links = document.querySelectorAll(".mobile-nav-link");

  function toggleMenu() {
    toggle.classList.toggle("menu-open");
    menu.classList.toggle("opacity-0");
    menu.classList.toggle("pointer-events-none");
    menu.classList.toggle("opacity-100");
    menu.classList.toggle("pointer-events-auto");
    document.body.style.overflow = menu.classList.contains("opacity-0")
      ? "auto"
      : "hidden";
  }

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  document.addEventListener("click", (e) => {
    if (
      !menu.classList.contains("opacity-0") &&
      !menu.contains(e.target) &&
      e.target !== toggle
    ) {
      toggleMenu();
    }
  });

  links.forEach((link) => link.addEventListener("click", toggleMenu));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !menu.classList.contains("opacity-0")) {
      toggleMenu();
    }
  });
}

function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

function initTypingEffect() {
  const phrases = [
    "I'm a Software Developer",
    "I create innovative solutions",
    "I build modern web applications",
    "I'm passionate about coding",
  ];

  const typedText = document.getElementById("typed-text");
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 100;

  function type() {
    const currentPhrase = phrases[phraseIndex];
    typedText.textContent = isDeleting
      ? currentPhrase.substring(0, charIndex - 1)
      : currentPhrase.substring(0, charIndex + 1);

    charIndex = isDeleting ? charIndex - 1 : charIndex + 1;

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      setTimeout(type, 1500);
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      setTimeout(type, 500);
    } else {
      setTimeout(type, typeSpeed);
    }
  }

  setTimeout(type, 1000);
}

function initGradientBlobs() {
  const blobs = document.querySelectorAll(".gradient-blob");

  if (typeof gsap !== "undefined") {
    blobs.forEach((blob, index) => {
      gsap.to(blob, {
        y: 20 + index * 10,
        duration: 3 + index * 0.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(blob, {
        opacity: 0.3 + index * 0.05,
        duration: 4 + index * 0.7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
  }
}

function initScrollToTopButton() {
  const button = document.createElement("button");
  button.id = "scroll-to-top";
  button.className =
    "fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg opacity-0 transition-all duration-300 transform translate-y-10 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 z-50";
  button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>`;
  document.body.appendChild(button);

  window.addEventListener("scroll", () => {
    button.classList.toggle("opacity-0", window.scrollY <= 300);
    button.classList.toggle("translate-y-10", window.scrollY <= 300);
    button.classList.toggle("opacity-100", window.scrollY > 300);
    button.classList.toggle("translate-y-0", window.scrollY > 300);
  });

  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initCurrentYear() {
  const el = document.getElementById("currentYear");
  if (el) el.textContent = new Date().getFullYear();
}

async function fetchGitHubProjects() {
  const container = document.getElementById("projects-container");
  if (!container) return;

  try {
    const username = "alex404hm";
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&direction=desc`
    );
    if (!response.ok) throw new Error("Failed to fetch projects");
    const projects = await response.json();
    container.innerHTML =
      projects.length === 0
        ? `<div class="col-span-full text-center text-gray-400"><p>No projects found.</p></div>`
        : "";
    projects.forEach((project) =>
      container.appendChild(createProjectCard(project))
    );
  } catch (error) {
    container.innerHTML = `<div class="col-span-full text-center text-red-400"><p>Failed to load projects. Please try again later.</p></div>`;
  }
}

function createProjectCard(project) {
  const card = document.createElement("div");
  card.className =
    "bg-gray-800 p-6 rounded-lg border border-gray-700 transform hover:scale-105 transition-all duration-300 shadow-lg";
  card.innerHTML = `
        <h3 class="text-xl font-semibold mb-2 text-white">
            <a href="${
              project.html_url
            }" target="_blank" class="hover:text-blue-400 transition-colors">${
    project.name
  }</a>
        </h3>
        ${
          project.description
            ? `<p class="text-gray-400 mb-4">${project.description}</p>`
            : ""
        }
        <div class="flex space-x-4">
            <a href="${
              project.html_url
            }" target="_blank" class="text-gray-400 hover:text-white transition-colors flex items-center space-x-1">
                <i class="fab fa-github"></i>
                <span>View Code</span>
            </a>
            ${
              project.homepage
                ? `<a href="${project.homepage}" target="_blank" class="text-gray-400 hover:text-white transition-colors flex items-center space-x-1">
                       <i class="fas fa-external-link-alt"></i>
                       <span>Live Site</span>
                   </a>`
                : ""
            }
        </div>
    `;
  return card;
}

// Helper function to validate email
function isValidEmail(email) {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

// Show notification
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-y-20 opacity-0 ${
    type === "success"
      ? "bg-green-600"
      : type === "error"
      ? "bg-red-600"
      : "bg-blue-600"
  } text-white`;
  notification.innerHTML = `
    <div class="flex items-center">
      <span class="mr-2">
        ${
          type === "success"
            ? '<i class="fas fa-check-circle"></i>'
            : type === "error"
            ? '<i class="fas fa-exclamation-circle"></i>'
            : '<i class="fas fa-info-circle"></i>'
        }
      </span>
      <span>${message}</span>
    </div>
  `;

  // Add to DOM
  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.classList.remove("translate-y-20", "opacity-0");
    notification.classList.add("translate-y-0", "opacity-100");
  }, 10);

  // Remove after delay
  setTimeout(() => {
    notification.classList.remove("translate-y-0", "opacity-100");
    notification.classList.add("translate-y-20", "opacity-0");

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 5000);
}
