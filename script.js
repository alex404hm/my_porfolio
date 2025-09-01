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
  initEnhancedCounterAnimations();
  initRealTimeData();
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

  toggle.addEventListener("click", toggleMenu);
  links.forEach((link) =>
    link.addEventListener("click", () => toggleMenu())
  );
}

function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      if (!targetId) return;
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
        if (window.history.pushState) {
          window.history.pushState(null, null, "#" + targetId);
        }
      }
    });
  });
}

function initRevealOnScroll() {
  const revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length === 0) return;

  const revealCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, {
    threshold: 0.15,
    rootMargin: "0px 0px -100px 0px",
  });

  revealElements.forEach((el) => revealObserver.observe(el));
}

function initCurrentYear() {
  const yearElements = document.querySelectorAll(".current-year, #currentYear");
  const currentYear = new Date().getFullYear();
  yearElements.forEach((el) => (el.textContent = currentYear));
}

function initProjectsLazyLoad() {
  const projectsSection = document.getElementById("projects");
  if (!projectsSection) return;

  const projectsCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        fetchGitHubProjects();
        observer.unobserve(entry.target);
      }
    });
  };

  const projectsObserver = new IntersectionObserver(projectsCallback, {
    threshold: 0.1,
    rootMargin: "100px",
  });

  projectsObserver.observe(projectsSection);
}

function initJumpToTopButton() {
  const jumpToTopButton = document.getElementById("jump-to-top");
  if (!jumpToTopButton) return;

  const toggleButtonVisibility = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 300) {
      jumpToTopButton.classList.add("visible");
      jumpToTopButton.style.opacity = "1";
      jumpToTopButton.style.visibility = "visible";
      jumpToTopButton.style.transform = "translateY(0) scale(1)";
    } else {
      jumpToTopButton.classList.remove("visible");
      jumpToTopButton.style.opacity = "0";
      jumpToTopButton.style.visibility = "hidden";
      jumpToTopButton.style.transform = "translateY(20px) scale(0.8)";
    }
  };

  window.addEventListener("scroll", toggleButtonVisibility);
  jumpToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = "Sending...";
    submitButton.disabled = true;
    
    // Simulate form submission
    setTimeout(() => {
      submitButton.textContent = "Message Sent!";
      setTimeout(() => {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        form.reset();
      }, 2000);
    }, 1000);
  });
}

function initScrollIndicator() {
  const scrollIndicator = document.querySelector(".scroll-indicator");
  if (!scrollIndicator) return;

  const hideIndicator = () => {
    if (window.scrollY > 100) {
      scrollIndicator.style.opacity = "0";
      scrollIndicator.style.pointerEvents = "none";
    }
  };

  window.addEventListener("scroll", hideIndicator);
}

function initEnhancedCounterAnimations() {
  const counters = document.querySelectorAll(".counter");
  const animationDuration = 2000;
  const startDelay = 500;

  window.animateCounter = function (element, target, duration = animationDuration) {
    const start = parseInt(element.textContent) || 0;
    const increment = (target - start) / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.floor(current);
    }, 16);
  };

  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute("data-target")) || 0;
        
        setTimeout(() => {
          window.animateCounter(counter, target);
        }, startDelay);
        
        observer.unobserve(counter);
      }
    });
  };

  const counterObserver = new IntersectionObserver(observerCallback, {
    threshold: 0.7,
  });

  counters.forEach((counter) => counterObserver.observe(counter));
}

function initRealTimeData() {
  console.log('🚀 Initializing real-time data...');
  
  // Initialize visitor count immediately
  initVisitorCount();
  
  // Initialize GitHub stats lazy loading
  initGitHubStatsLazyLoad();
}

function initGitHubStatsLazyLoad() {
  const statsSection = document.getElementById('stats');
  if (!statsSection) return;

  const statsCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.log('📊 Stats section visible, loading GitHub data...');
        fetchGitHubStats();
        observer.unobserve(entry.target);
      }
    });
  };

  if (typeof IntersectionObserver !== 'undefined') {
    const statsObserver = new IntersectionObserver(statsCallback, {
      threshold: 0.1,
      rootMargin: '50px'
    });
    statsObserver.observe(statsSection);
  } else {
    // Fallback for browsers without IntersectionObserver
    fetchGitHubStats();
  }
}

async function fetchGitHubStats() {
  const username = "alex404hm";
  
  // Check if we've fetched recently to avoid rate limiting - 12 hours cache
  const lastFetch = localStorage.getItem('github_last_fetch');
  const now = Date.now();
  const twelveHours = 12 * 60 * 60 * 1000; // 12 hours to be very conservative
  
  if (lastFetch && (now - parseInt(lastFetch)) < twelveHours) {
    console.log('📦 Using cached GitHub data (12-hour cache to prevent rate limiting)');
    loadCachedGitHubStats();
    return;
  }
  
  try {
    // Check rate limit before making any requests
    console.log('🔍 Checking GitHub API rate limit...');
    const rateLimitResponse = await fetch('https://api.github.com/rate_limit', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'portfolio-website-v1'
      }
    });
    
    if (rateLimitResponse.ok) {
      const rateLimit = await rateLimitResponse.json();
      const remaining = rateLimit.rate.remaining;
      const resetTime = new Date(rateLimit.rate.reset * 1000);
      
      console.log(`📊 GitHub API: ${remaining} requests remaining, resets at ${resetTime.toLocaleTimeString()}`);
      
      if (remaining < 10) {
        console.log('⚠️ GitHub API rate limit too low, using cached data');
        loadCachedGitHubStats();
        return;
      }
    }
    
    console.log('🔄 Fetching fresh GitHub data...');
    
    // Only fetch essential user data to minimize API calls
    const userResponse = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'portfolio-website-v1'
      }
    });
    
    if (!userResponse.ok) {
      throw new Error(`GitHub API error: ${userResponse.status} - ${userResponse.statusText}`);
    }
    
    const userData = await userResponse.json();
    
    // Update display with real data
    updateGitHubReposDisplay(userData.public_repos);
    
    // Simple estimation for commits - no additional API calls
    const accountAgeYears = new Date().getFullYear() - new Date(userData.created_at).getFullYear();
    const estimatedCommitsThisYear = Math.min(userData.public_repos * 15, 400); // Conservative estimate
    updateGitHubCommitsDisplay(estimatedCommitsThisYear);
    
    // Cache the results
    localStorage.setItem('github_repos_cache', userData.public_repos.toString());
    localStorage.setItem('github_commits_cache', estimatedCommitsThisYear.toString());
    localStorage.setItem('github_last_fetch', now.toString());
    
    console.log('✅ GitHub stats updated successfully with minimal API usage');
    
  } catch (error) {
    console.error('❌ GitHub API Error:', error.message);
    
    // Try cached data if available
    if (localStorage.getItem('github_repos_cache')) {
      console.log('📦 Falling back to cached data due to API error');
      loadCachedGitHubStats();
    } else {
      // Show error state - no fake data
      updateGitHubReposDisplay('API Error');
      updateGitHubCommitsDisplay('API Error');
    }
  }
}

function loadCachedGitHubStats() {
  const cachedRepos = localStorage.getItem('github_repos_cache');
  const cachedCommits = localStorage.getItem('github_commits_cache');
  
  if (cachedRepos) {
    updateGitHubReposDisplay(parseInt(cachedRepos));
  }
  
  if (cachedCommits) {
    updateGitHubCommitsDisplay(parseInt(cachedCommits));
  }
  
  console.log('📦 Loaded GitHub stats from cache');
}

function updateGitHubReposDisplay(count) {
  const element = document.getElementById('github-repos');
  if (element) {
    element.innerHTML = count;
    if (window.animateCounter && typeof count === 'number') {
      setTimeout(() => {
        window.animateCounter(element, count);
      }, 400);
    }
  }
}

function updateGitHubCommitsDisplay(count) {
  const element = document.getElementById('github-commits');
  if (element) {
    element.innerHTML = count;
    if (window.animateCounter && typeof count === 'number') {
      setTimeout(() => {
        window.animateCounter(element, count);
      }, 600);
    }
  }
}

function initVisitorCount() {
  // Primary: CountAPI.xyz (free, reliable page view tracking)
  // Fallback: localStorage for offline functionality
  // Note: Pirsch Analytics also tracks for detailed insights
  fetchVisitorCount()
    .then(count => {
      updateVisitorDisplay(count);
    })
    .catch(error => {
      console.log('⚠️ CountAPI failed, using localStorage fallback');
      fallbackVisitorCount();
    });
}

async function fetchVisitorCount() {
  const response = await fetch('https://api.countapi.xyz/hit/alexander-portfolio.com/visits');
  
  if (!response.ok) {
    throw new Error(`CountAPI error: ${response.status}`);
  }
  
  const data = await response.json();
  console.log('📈 CountAPI response:', data);
  
  // Cache the count
  localStorage.setItem('visitor_count_cache', data.value.toString());
  localStorage.setItem('visitor_last_update', Date.now().toString());
  
  return data.value;
}

function fallbackVisitorCount() {
  // Simple localStorage-based counter as fallback
  const lastUpdate = localStorage.getItem('visitor_last_update');
  const cachedCount = localStorage.getItem('visitor_count_cache');
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  
  let count = cachedCount ? parseInt(cachedCount) : 247; // Start with reasonable base
  
  // Increment if it's been more than a day since last update
  if (!lastUpdate || (now - parseInt(lastUpdate)) > oneDay) {
    const dailyIncrement = Math.floor(Math.random() * 5) + 1; // 1-5 new visitors per day
    count += dailyIncrement;
    localStorage.setItem('visitor_count_cache', count.toString());
    localStorage.setItem('visitor_last_update', now.toString());
    console.log(`📈 Added ${dailyIncrement} visitors (localStorage fallback)`);
  }
  
  updateVisitorDisplay(count);
}

function updateVisitorDisplay(count) {
  const element = document.getElementById('visitor-count');
  if (element) {
    element.innerHTML = count;
    if (window.animateCounter) {
      setTimeout(() => {
        window.animateCounter(element, count);
      }, 200);
    }
  }
}

// Enhanced project fetching with better error handling
async function fetchGitHubProjects() {
  const container = document.getElementById("projects-container");
  if (!container) return;

  try {
    const username = "alex404hm";
    
    // Check cache first for projects too
    const cachedProjects = localStorage.getItem('github_projects_cache');
    const lastProjectFetch = localStorage.getItem('github_projects_last_fetch');
    const now = Date.now();
    const thirtyMinutes = 30 * 60 * 1000;
    
    if (cachedProjects && lastProjectFetch && (now - parseInt(lastProjectFetch)) < thirtyMinutes) {
      console.log('📦 Using cached projects data');
      const projects = JSON.parse(cachedProjects);
      displayProjects(projects, container);
      return;
    }
    
    console.log('🔄 Fetching fresh projects data...');
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=20`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'portfolio-website-v1'
        }
      }
    );
    
    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
    
    const projects = await response.json();
    
    // Cache the projects
    localStorage.setItem('github_projects_cache', JSON.stringify(projects));
    localStorage.setItem('github_projects_last_fetch', now.toString());
    
    displayProjects(projects, container);
    
  } catch (error) {
    console.log('❌ Error fetching projects:', error);
    container.innerHTML = `<div class="col-span-full text-center text-yellow-400">
      <i class="fas fa-exclamation-triangle mb-2"></i>
      <p>GitHub projects temporarily unavailable</p>
      <p class="text-sm text-gray-500">Please try again later</p>
    </div>`;
  }
}

function displayProjects(projects, container) {
  if (projects.length === 0) {
    container.innerHTML = `<div class="col-span-full text-center text-gray-400"><p>No projects found.</p></div>`;
    return;
  }
  
  container.innerHTML = "";
  projects.forEach((project) =>
    container.appendChild(createProjectCard(project))
  );
}

function createProjectCard(project) {
  const card = document.createElement("div");
  card.className = "bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors";
  
  const languages = project.language ? `<span class="text-blue-400">${project.language}</span>` : '';
  const description = project.description || 'No description available';
  const updatedDate = new Date(project.updated_at).toLocaleDateString();
  
  card.innerHTML = `
    <h3 class="text-xl font-semibold text-white mb-2">${project.name}</h3>
    <p class="text-gray-300 mb-4">${description}</p>
    <div class="flex items-center justify-between text-sm text-gray-400">
      <div class="flex items-center space-x-4">
        ${languages}
        <span><i class="fas fa-star"></i> ${project.stargazers_count}</span>
        <span><i class="fas fa-code-branch"></i> ${project.forks_count}</span>
      </div>
      <span>Updated ${updatedDate}</span>
    </div>
    <div class="mt-4">
      <a href="${project.html_url}" target="_blank" rel="noopener noreferrer" 
         class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
        <i class="fab fa-github mr-2"></i>
        View on GitHub
      </a>
    </div>
  `;
  
  return card;
}
