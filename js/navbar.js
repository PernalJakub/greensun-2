// ===== NAVBAR MODULE =====
// Handles navigation, hamburger menu, scroll behavior

function loadGlobalSVGIcons() {
  const icons = [
    { class: "icon-logo", path: "./media/icons/logo.svg" },
    { class: "icon-facebook", path: "./media/icons/facebook.svg" },
    { class: "icon-instagram", path: "./media/icons/instagram.svg" },
    { class: "icon-linkedin", path: "./media/icons/linkedin.svg" },
    { class: "icon-tiktok", path: "./media/icons/tiktok.svg" },
    { class: "icon-booksy", path: "./media/icons/booksy.svg" },
    { class: "icon-facebook-mobile", path: "./media/icons/facebook.svg" },
    { class: "icon-instagram-mobile", path: "./media/icons/instagram.svg" },
    { class: "icon-linkedin-mobile", path: "./media/icons/linkedin.svg" },
    { class: "icon-tiktok-mobile", path: "./media/icons/tiktok.svg" },
    { class: "icon-booksy-mobile", path: "./media/icons/booksy.svg" },
    { class: "icon-facebook-footer", path: "./media/icons/facebook.svg" },
    { class: "icon-instagram-footer", path: "./media/icons/instagram.svg" },
    { class: "icon-linkedin-footer", path: "./media/icons/linkedin.svg" },
    { class: "icon-tiktok-footer", path: "./media/icons/tiktok.svg" },
    { class: "icon-booksy-footer", path: "./media/icons/booksy.svg" },
    { class: "icon-facebook-card", path: "./media/icons/facebook.svg" },
    { class: "icon-instagram-card", path: "./media/icons/instagram.svg" },
    { class: "icon-tiktok-card", path: "./media/icons/tiktok.svg" },
    { class: "icon-booksy-card", path: "./media/icons/booksy.svg" },
    { class: "icon-facebook-button", path: "./media/icons/facebook.svg" },
    { class: "icon-instagram-button", path: "./media/icons/instagram.svg" },
    { class: "icon-tiktok-button", path: "./media/icons/tiktok.svg" },
    { class: "icon-booksy-button", path: "./media/icons/booksy.svg" },
    { class: "icon-button-narrowup", path: "./media/icons/narrowup.svg" },
    { class: "icon-button-narrowdown", path: "./media/icons/narrowdown.svg" },
    { class: "icon-button-linkedin", path: "./media/icons/linkedin.svg" },
    { class: "icon-button-lesson", path: "./media/icons/lesson.svg" }
  ];

  icons.forEach(icon => {
    fetch(icon.path)
      .then(response => response.text())
      .then(data => {
        const containers = document.querySelectorAll(`.${icon.class}`);
        containers.forEach(container => {
          container.innerHTML = data;
          const svg = container.querySelector('svg');
          if (svg) {
            svg.classList.add('global-icon-svg');
            svg.setAttribute('fill', 'currentColor');
            if (icon.class.includes("footer") || icon.class.includes("card")) {
              svg.classList.add('footer-icon-white');
            }
            if (icon.class.includes("button")) {
              svg.classList.remove('global-icon-svg');
              svg.classList.add('global-icon-svg-button');
            }
          }
        });
      });
  });
}

function initNavbarSection() {
  const root = document.querySelector(".navbar-section");
  if (!root) return;
  const links = root.querySelectorAll(".nav-link");
  
  function updateActiveLink() {
    const scrollPos = window.scrollY + window.innerHeight / 2;
    links.forEach(link => {
      const section = document.getElementById(link.dataset.section);
      if (section) {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        if (scrollPos >= top && scrollPos < bottom) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      }
    });
  }
  
  window.addEventListener("scroll", updateActiveLink);
  updateActiveLink();

  links.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const hamburger = document.querySelector(".hamburger-icon");
      const overlay = document.querySelector(".mobile-nav-overlay");
      if (hamburger && overlay && overlay.classList.contains("active")) {
        hamburger.classList.remove("active");
        overlay.classList.add("hiding");
        document.body.classList.remove("no-scroll");
        setTimeout(() => {
          overlay.classList.remove("active");
          overlay.classList.remove("hiding");
        }, 600);
      }

      const navbar = document.querySelector(".navbar-container");
      navbar.classList.add("disable-auto-hide");
      setTimeout(() => {
        navbar.classList.remove("disable-auto-hide");
        navbar.classList.remove("hide-navbar");
      }, 1000);
      
      const section = document.getElementById(link.dataset.section);
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        let targetScroll;
        
        if (link.dataset.section === 'contact-section') {
          const navbarHeight = 65;
          targetScroll = sectionTop - navbarHeight + 20;
        } else {
          targetScroll = sectionTop - (window.innerHeight / 2) + (sectionHeight / 2);
        }

        window.scrollTo({
          top: targetScroll,
          behavior: "smooth"
        });
      }
    });
  });
}

function setupHamburgerMenu() {
  const navbar = document.querySelector(".navbar-container");
  navbar.classList.remove("start-show-navbar");
  navbar.classList.remove("hide-navbar");

  const hamburger = document.querySelector(".hamburger-icon");
  const overlay = document.querySelector(".mobile-nav-overlay");

  hamburger.addEventListener("click", () => {
    const navbarContainer = document.querySelector(".navbar-container");
    
    if (overlay.classList.contains("active")) {
      overlay.classList.add("hiding");
      hamburger.classList.remove("active");
      navbarContainer.classList.remove("menu-open");
      document.body.classList.remove("no-scroll");

      setTimeout(() => {
        overlay.classList.remove("active");
        overlay.classList.remove("hiding");
      }, 600);
    } else {
      overlay.classList.add("active");
      hamburger.classList.add("active");
      navbarContainer.classList.add("menu-open");
      document.body.classList.add("no-scroll");
    }
  });
}

function setupNavbarScroll() {
  let lastScrollTop = window.scrollY;
  let ticking = false;

  function handleNavbarVisibility() {
    const currentScroll = window.scrollY;
    const navbar = document.querySelector(".navbar-container");

    if (currentScroll > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(handleNavbarVisibility);
      ticking = true;
    }
  });
}

function setupLogoClick() {
  const logoElements = document.querySelectorAll('.navbar-logo');
  logoElements.forEach(logo => {
    logo.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });
}

window.navbarModule = {
  loadGlobalSVGIcons,
  initNavbarSection,
  setupHamburgerMenu,
  setupNavbarScroll,
  setupLogoClick
};
