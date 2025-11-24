// ===== HERO MODULE =====
// Handles hero section video and animations

function initHeroSection() {
  const rootHeroSection = document.querySelector(".hero-section");
  
  if (!rootHeroSection) return;
  
  // Remove fade locks and make content immediately visible
  rootHeroSection.querySelectorAll(".fade-lock").forEach(el => el.classList.remove("fade-lock"));
  document.body.classList.add("fade-in-ready");
  
  // Show content immediately with stagger effect
  const contentElements = document.querySelectorAll(".animated-data .content");
  contentElements.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add("fade-in-item");
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, index * 250);
  });
  
  // Start video immediately
  const video = document.querySelector(".video-background video");
  if (video) {
    video.play();
    video.style.opacity = "1";
    const card = document.querySelector(".slider-section .card");
    if (card) {
      card.classList.add("card-shadow-visible");
      setTimeout(() => {
        card.classList.add("fade-bg");
      }, 350);
    }
  }
}

window.heroModule = {
  initHeroSection
};
