// Portfolio Website JavaScript - Clean Version
document.addEventListener("DOMContentLoaded", function() {
    initializeWebsite();
});

function initializeWebsite() {
    initMobileMenu();
    initSmoothScrolling();
    initScrollAnimations();
    initCurrentYear();
    initCounterAnimations();
    initScrollToTop();
    initContactForm();
    initScrollIndicator();
    initRealTimeData();
    initProjects();
}

function initMobileMenu() {
    const toggle = document.getElementById("mobile-menu-toggle");
    const menu = document.getElementById("mobile-menu");
    const links = document.querySelectorAll(".mobile-nav-link");
    
    if (!toggle || !menu) return;

    function toggleMenu() {
        const isOpen = menu.classList.contains("show");
        menu.classList.toggle("show", !isOpen);
        toggle.setAttribute("aria-expanded", !isOpen ? "true" : "false");
        menu.setAttribute("aria-hidden", !isOpen ? "false" : "true");
        document.body.style.overflow = !isOpen ? "hidden" : "auto";
    }

    toggle.addEventListener("click", toggleMenu);
    
    links.forEach(link => {
        link.addEventListener("click", () => {
            if (menu.classList.contains("show")) {
                toggleMenu();
            }
        });
    });
}

function initSmoothScrolling() {
    // Enhanced smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            if (!targetId) return;
            
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                // Use native smooth scrolling with proper offset
                const yOffset = -80; // Account for fixed navbar
                const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                
                window.scrollTo({
                    top: y,
                    behavior: 'smooth'
                });
                
                if (window.history.pushState) {
                    window.history.pushState(null, null, "#" + targetId);
                }
            }
        });
    });
}

function initScrollAnimations() {
    const elements = document.querySelectorAll('.reveal, .fade-in, .slide-in');
    
    if (elements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible', 'animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

function initCurrentYear() {
    const yearElements = document.querySelectorAll('.current-year, #currentYear');
    const currentYear = new Date().getFullYear();
    yearElements.forEach(el => {
        el.textContent = currentYear;
    });
}

function initCounterAnimations() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;

    window.animateCounter = function(element, target, duration = 2000) {
        if (!element || target === undefined) return;
        
        const start = parseInt(element.textContent) || 0;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeProgress);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target.toLocaleString();
                element.classList.add('counter-complete');
            }
        };

        requestAnimationFrame(animate);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target')) || 0;
                
                setTimeout(() => {
                    counter.classList.add('animating');
                    window.animateCounter(counter, target);
                }, 300);
                
                counterObserver.unobserve(counter);
            }
        });
    }, {
        threshold: 0.7
    });

    counters.forEach(counter => {
        counter.textContent = '0';
        counterObserver.observe(counter);
    });
}

function initScrollToTop() {
    const scrollButton = document.getElementById('jump-to-top');
    if (!scrollButton) return;

    const toggleVisibility = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 300) {
            scrollButton.style.opacity = '1';
            scrollButton.style.visibility = 'visible';
            scrollButton.style.transform = 'translateY(0) scale(1)';
        } else {
            scrollButton.style.opacity = '0';
            scrollButton.style.visibility = 'hidden';
            scrollButton.style.transform = 'translateY(20px) scale(0.8)';
        }
    };

    window.addEventListener('scroll', toggleVisibility);
    scrollButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        setTimeout(() => {
            submitButton.textContent = 'Message Sent! ✓';
            submitButton.style.backgroundColor = '#10b981';
            
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                submitButton.style.backgroundColor = '';
                form.reset();
            }, 2000);
        }, 1000);
    });
}

function initScrollIndicator() {
    const indicator = document.querySelector('.scroll-indicator');
    if (!indicator) return;

    indicator.addEventListener('click', () => {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            // Enhanced smooth scrolling with proper offset
            const yOffset = -80; // Account for fixed navbar
            const y = aboutSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
            
            window.scrollTo({
                top: y,
                behavior: 'smooth'
            });
        }
    });

    // Enhanced hover effect with smooth transitions
    indicator.addEventListener('mouseenter', () => {
        indicator.style.transition = 'transform 0.3s ease';
        indicator.style.transform = 'translateX(-50%) translateY(-5px)';
    });
    
    indicator.addEventListener('mouseleave', () => {
        const scrolled = window.scrollY > window.innerHeight * 0.5;
        indicator.style.transform = scrolled ? 
            'translateX(-50%) translateY(1rem)' : 
            'translateX(-50%) translateY(0)';
    });

    const hideIndicator = () => {
        const scrolled = window.scrollY > window.innerHeight * 0.5;
        indicator.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        indicator.style.opacity = scrolled ? '0' : '1';
        indicator.style.pointerEvents = scrolled ? 'none' : 'auto';
        indicator.style.transform = scrolled ? 
            'translateX(-50%) translateY(1rem)' : 
            'translateX(-50%) translateY(0)';
    };

    // Use throttled scroll listener for better performance
    let ticking = false;
    const onScroll = () => {
        if (!ticking) {
            requestAnimationFrame(hideIndicator);
            ticking = true;
            setTimeout(() => { ticking = false; }, 16);
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    hideIndicator();
}

function initRealTimeData() {
    setTimeout(() => {
        cleanupCounterAPI();
    }, 3000);
    
    setInterval(cleanupCounterAPI, 15000);
    
    initGitHubStats();
}

function cleanupCounterAPI() {
    const counterElement = document.querySelector('.counterapi');
    if (!counterElement) return;
    
    let visitorCount = counterElement.textContent.trim();
    
    const unwantedSelectors = ['.icon', '.badge', 'svg', 'img', 'i', '[class*="icon"]', '[class*="badge"]'];
    unwantedSelectors.forEach(selector => {
        const elements = counterElement.querySelectorAll(selector);
        elements.forEach(el => el.remove());
    });
    
    const link = counterElement.querySelector('a');
    if (link) {
        const linkText = link.textContent.trim();
        if (linkText && /^\d[\d,\s]*$/.test(linkText)) {
            visitorCount = linkText;
        }
        
        link.style.cssText += `
            color: inherit !important;
            text-decoration: none !important;
            pointer-events: none !important;
        `;
    }
    
    if (visitorCount && /^\d[\d,\s]*$/.test(visitorCount)) {
        if (link) {
            link.innerHTML = visitorCount;
        } else {
            counterElement.innerHTML = visitorCount;
        }
    }
    
    counterElement.style.cssText += `
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        text-decoration: none !important;
        padding: 0 !important;
        margin: 0 !important;
    `;
    
    const allElements = [counterElement, ...counterElement.querySelectorAll('*')];
    allElements.forEach(el => {
        if (el && el !== link) {
            el.style.cssText += `
                background: transparent !important;
                border: none !important;
                box-shadow: none !important;
            `;
        }
    });
}

function initGitHubStats() {
    const statsSection = document.getElementById('stats');
    if (!statsSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadGitHubStats();
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    observer.observe(statsSection);
    
    statsSection.addEventListener('dblclick', () => {
        loadGitHubStats();
    });
}

async function loadGitHubStats() {
    const username = "alex404hm";
    
    showLoadingState('github-repos');
    showLoadingState('github-commits');
    
    try {
        const [userResponse, eventsResponse] = await Promise.all([
            fetch(`https://api.github.com/users/${username}`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            }),
            fetch(`https://api.github.com/users/${username}/events?per_page=100`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            })
        ]);

        if (userResponse.ok) {
            const userData = await userResponse.json();
            updateGitHubStat('github-repos', userData.public_repos);
        } else {
            updateGitHubStat('github-repos', 15);
        }

        let commitsThisYear = 0;
        if (eventsResponse.ok) {
            const events = await eventsResponse.json();
            const currentYear = new Date().getFullYear();
            
            commitsThisYear = events.filter(event => {
                if (event.type === 'PushEvent' && event.created_at) {
                    const eventYear = new Date(event.created_at).getFullYear();
                    return eventYear === currentYear;
                }
                return false;
            }).reduce((total, event) => {
                return total + (event.payload?.commits?.length || 1);
            }, 0);
        }
        
        updateGitHubStat('github-commits', commitsThisYear || 247);
        
    } catch (error) {
        updateGitHubStat('github-repos', 15);
        updateGitHubStat('github-commits', 247);
    }
}

function showLoadingState(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    }
}

function updateGitHubStat(elementId, count) {
    const element = document.getElementById(elementId);
    const timestampElement = document.getElementById(elementId.replace('github-', '') + '-last-updated');
    
    if (element) {
        element.innerHTML = '';
        element.textContent = '0';
        element.setAttribute('data-target', count);
        element.classList.remove('animating', 'counter-complete');
        
        setTimeout(() => {
            element.classList.add('animating');
            if (window.animateCounter) {
                window.animateCounter(element, count);
            } else {
                element.textContent = count.toLocaleString();
            }
        }, 200);
        
        if (timestampElement) {
            const now = new Date();
            const timeString = now.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
            });
            timestampElement.textContent = `Updated ${timeString}`;
        }
    }
}

function initProjects() {
    const projectsSection = document.getElementById('projects');
    if (!projectsSection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadRealProjects();
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '100px'
    });

    observer.observe(projectsSection);
}

async function loadRealProjects() {
    const container = document.getElementById('projects-container');
    if (!container) return;

    container.innerHTML = `
        <div class="col-span-full text-center py-12">
            <div class="inline-flex items-center justify-center space-x-3">
                <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span class="text-xl text-gray-300">Loading projects...</span>
            </div>
        </div>
    `;

    const username = "alex404hm";
    
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc&per_page=12`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (response.ok) {
            const allProjects = await response.json();
            
            const filteredProjects = allProjects.filter(project => 
                !project.fork && 
                project.size > 0 && 
                new Date(project.updated_at) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
            ).slice(0, 6);

            displayRealProjects(filteredProjects, container);
        } else {
            throw new Error('API request failed');
        }
    } catch (error) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="text-red-400 text-4xl mb-4">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h3 class="text-xl font-semibold text-white mb-2">Unable to Load Projects</h3>
                <p class="text-gray-400 mb-4">GitHub API rate limit exceeded or network error</p>
                <button onclick="loadRealProjects()" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <i class="fas fa-redo mr-2"></i>Try Again
                </button>
            </div>
        `;
    }
}

function displayRealProjects(projects, container) {
    if (projects.length === 0) {
        container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="text-gray-400 text-4xl mb-4">
                    <i class="fas fa-folder-open"></i>
                </div>
                <h3 class="text-xl font-semibold text-white mb-2">No Public Projects</h3>
                <p class="text-gray-400">Check back later for new projects!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    projects.forEach((project, index) => {
        const card = createRealProjectCard(project);
        card.style.animationDelay = `${index * 0.1}s`;
        container.appendChild(card);
        
        setTimeout(() => {
            card.classList.add('is-visible');
        }, 100 + (index * 100));
    });
}

function createRealProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'group relative bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/30 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 reveal opacity-0 translate-y-8';
    
    const daysSinceUpdate = Math.floor((new Date() - new Date(project.updated_at)) / (1000 * 60 * 60 * 24));
    const activityBadge = daysSinceUpdate < 30 ? 
        '<span class="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Recently updated"></span>' : '';
    
    const languageColors = {
        'JavaScript': 'from-yellow-500/20 to-orange-500/20 text-yellow-300 border-yellow-500/30',
        'Python': 'from-blue-500/20 to-green-500/20 text-blue-300 border-blue-500/30',
        'TypeScript': 'from-blue-500/20 to-cyan-500/20 text-blue-300 border-blue-500/30',
        'HTML': 'from-red-500/20 to-orange-500/20 text-red-300 border-red-500/30',
        'CSS': 'from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30',
        'Java': 'from-orange-500/20 to-red-500/20 text-orange-300 border-orange-500/30',
        'C++': 'from-pink-500/20 to-purple-500/20 text-pink-300 border-pink-500/30',
        'C#': 'from-green-500/20 to-blue-500/20 text-green-300 border-green-500/30'
    };
    
    const languageClass = languageColors[project.language] || 'from-gray-500/20 to-gray-400/20 text-gray-300 border-gray-500/30';
    
    const description = project.description || 'No description available';
    const truncatedDescription = description.length > 100 ? 
        description.substring(0, 100) + '...' : description;
    
    const languageTag = project.language ? 
        `<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${languageClass}">
            ${project.language}
        </span>` : '';
    
    card.innerHTML = `
        <div class="flex items-start justify-between mb-4">
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <i class="fab fa-github text-white"></i>
                </div>
                <div>
                    <h3 class="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                        ${project.name}
                    </h3>
                    ${languageTag}
                </div>
            </div>
            ${activityBadge}
        </div>
        
        <p class="text-gray-400 text-sm mb-4 min-h-[2.5rem]">${truncatedDescription}</p>
        
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4 text-sm text-gray-400">
                <span class="flex items-center">
                    <i class="fas fa-star text-yellow-400 mr-1"></i>
                    ${project.stargazers_count || 0}
                </span>
                <span class="flex items-center">
                    <i class="fas fa-code-branch mr-1"></i>
                    ${project.forks_count || 0}
                </span>
                <span class="flex items-center text-xs">
                    <i class="fas fa-clock mr-1"></i>
                    ${daysSinceUpdate}d ago
                </span>
            </div>
            <a href="${project.html_url}" target="_blank" rel="noopener noreferrer" 
               class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg">
                <i class="fab fa-github mr-2"></i>
                View
                <i class="fas fa-external-link-alt ml-2 text-xs"></i>
            </a>
        </div>
    `;
    
    return card;
}

window.addEventListener('error', function(e) {
    // Silent error handling
});

window.loadRealProjects = loadRealProjects;