document.addEventListener("DOMContentLoaded", init);

function init() {
  initMobileMenuToggle();
  initSmoothScrolling();
  initRevealOnScroll();
  initCurrentYear();
  initProjectsLazyLoad();
  initJumpToTopButton();
  initContactForm();
  initScrollIndicator();
}

function initMobileMenuToggle() {
  const toggle = document.getElementById("mobile-menu-toggle");
  const menu = document.getElementById("mobile-menu");
  const links = document.querySelectorAll(".mobile-nav-link");
  if (!toggle || !menu) return;

  function toggleMenu() {
    const willShow = !menu.classList.contains("show");
    menu.classList.toggle("show", willShow);
    toggle.setAttribute("aria-expanded", willShow ? "true" : "false");
    menu.setAttribute("aria-hidden", willShow ? "false" : "true");
    document.body.style.overflow = willShow ? "hidden" : "auto";
  }

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      menu.classList.contains("show") &&
      !menu.contains(e.target) &&
      e.target !== toggle
    ) {
      toggleMenu();
    }
  });

  // Close menu when clicking on links
  links.forEach((link) => {
    link.addEventListener("click", () => {
      toggleMenu();
    });
  });

  // Close menu on escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("show")) {
      toggleMenu();
    }
  });
}

function getHeaderOffset() {
  const header = document.querySelector("header");
  return header ? header.offsetHeight : 0;
}

function smoothScrollTo(targetY, durationMs) {
  const startY = window.pageYOffset;
  const distanceY = targetY - startY;
  const startTime = performance.now();

  function easeInOutQuart(t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
  }

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / durationMs, 1);
    const eased = easeInOutQuart(progress);
    window.scrollTo(0, Math.round(startY + distanceY * eased));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function initSmoothScrolling() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      e.preventDefault();

      const headerOffset = getHeaderOffset();
      const elementPosition =
        targetElement.getBoundingClientRect().top + window.pageYOffset;
      const targetY = Math.max(elementPosition - headerOffset, 0);

      if (prefersReducedMotion) {
        window.scrollTo(0, targetY);
      } else {
        smoothScrollTo(targetY, 900); // Increased duration for smoother scrolling
      }

      if (history.pushState) {
        history.pushState(null, "", targetId);
      } else {
        window.location.hash = targetId;
      }
    });
  });
}

function initRevealOnScroll() {
  const elements = document.querySelectorAll('.reveal');
  if (elements.length === 0) return;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
  );

  elements.forEach((el) => observer.observe(el));
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
    "project-card bg-gray-800 rounded-lg overflow-hidden border border-gray-700 transform transition-all duration-300 hover:scale-105 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20";

  card.innerHTML = `
    <div class="p-6">
      <h3 class="text-xl font-semibold mb-2 text-white group">
        <a href="${
          project.html_url
        }" target="_blank" class="hover:text-blue-400 transition-colors duration-300">
          ${project.name}
        </a>
      </h3>
      <p class="text-gray-400 mb-4 min-h-[3rem]">
        ${project.description || "No description available"}
      </p>
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2 text-sm text-gray-400">
          <i class="fas fa-code-branch"></i>
          <span>${project.language || "N/A"}</span>
        </div>
        <div class="flex space-x-4">
          <a href="${project.html_url}" target="_blank" 
             class="text-gray-400 hover:text-white transition-colors duration-300 flex items-center space-x-1 group">
            <i class="fab fa-github group-hover:scale-110 transition-transform duration-300"></i>
            <span class="group-hover:text-blue-400 transition-colors duration-300">View Code</span>
          </a>
          ${
            project.homepage
              ? `
            <a href="${project.homepage}" target="_blank" 
               class="text-gray-400 hover:text-white transition-colors duration-300 flex items-center space-x-1 group">
              <i class="fas fa-external-link-alt group-hover:scale-110 transition-transform duration-300"></i>
              <span class="group-hover:text-blue-400 transition-colors duration-300">Live Site</span>
            </a>
          `
              : ""
          }
        </div>
      </div>
    </div>
  `;

  return card;
}

function initJumpToTopButton() {
  const jumpToTopButton = document.getElementById("jump-to-top");
  if (!jumpToTopButton) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // Show/hide button based on scroll position with smooth transitions
  function toggleButtonVisibility() {
    const scrolled = window.scrollY > 300;
    if (scrolled) {
      jumpToTopButton.classList.add("visible");
    } else {
      jumpToTopButton.classList.remove("visible");
    }
  }

  // Throttle scroll events for better performance
  let isScrolling = false;
  window.addEventListener("scroll", () => {
    if (!isScrolling) {
      requestAnimationFrame(() => {
        toggleButtonVisibility();
        isScrolling = false;
      });
      isScrolling = true;
    }
  });

  // Enhanced smooth scroll to top
  jumpToTopButton.addEventListener("click", (e) => {
    e.preventDefault();
    
    if (prefersReducedMotion) {
      window.scrollTo(0, 0);
      return;
    }

    // Custom smooth scroll animation
    const startY = window.pageYOffset;
    const duration = Math.min(800 + startY * 0.3, 1500); // Dynamic duration based on scroll distance
    const startTime = performance.now();

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function animateScroll(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      
      window.scrollTo(0, Math.round(startY * (1 - eased)));
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    }

    requestAnimationFrame(animateScroll);
  });

  // Initial check
  toggleButtonVisibility();
}

function initProjectsLazyLoad() {
  const section = document.getElementById("projects");
  if (!section) return;
  const container = document.getElementById("projects-container");
  const triggerFetch = () => {
    fetchGitHubProjects();
    observer.disconnect();
  };
  if (!("IntersectionObserver" in window)) {
    triggerFetch();
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) triggerFetch();
      });
    },
    { rootMargin: "200px 0px" }
  );
  observer.observe(section);
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("contact-status");
  const submitBtn = document.getElementById("contact-submit");
  if (!form || !status || !submitBtn) return;

  function setStatus(message, type) {
    status.textContent = message;
    status.className = "text-sm " + (type === "error" ? "text-red-400" : type === "success" ? "text-green-400" : "text-gray-400");
  }

  form.addEventListener("submit", async (e) => {
    // Let Getform handle submission normally; just show a progress hint.
    setStatus("Sending via secure form...", "info");
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.7";
    // Re-enable after a short delay in case of client-side navigation
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.style.opacity = "1";
    }, 4000);
  });
}

function initScrollIndicator() {
  const scrollIndicator = document.getElementById("scroll-indicator");
  if (!scrollIndicator) return;

  // Hide scroll indicator when user scrolls past hero section
  function handleScroll() {
    const scrolled = window.scrollY > 100;
    if (scrolled) {
      scrollIndicator.classList.add("hidden");
    } else {
      scrollIndicator.classList.remove("hidden");
    }
  }

  // Smooth scroll to about section when clicked
  scrollIndicator.addEventListener("click", (e) => {
    e.preventDefault();
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      const headerOffset = getHeaderOffset();
      const elementPosition = aboutSection.getBoundingClientRect().top + window.pageYOffset;
      const targetY = Math.max(elementPosition - headerOffset, 0);

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        window.scrollTo(0, targetY);
      } else {
        smoothScrollTo(targetY, 900);
      }
    }
  });

  // Listen for scroll events
  let isScrolling = false;
  window.addEventListener("scroll", () => {
    if (!isScrolling) {
      requestAnimationFrame(() => {
        handleScroll();
        isScrolling = false;
      });
      isScrolling = true;
    }
  });

  // Initial check
  handleScroll();
}
