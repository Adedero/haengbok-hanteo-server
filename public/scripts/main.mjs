import nav from "./nav.js";

// eslint-disable-next-line no-undef
AOS.init({
  once: true,
  duration: 800
});

nav()

const backBtn = document.querySelector('[data-back-btn]')
if (backBtn) backBtn.addEventListener('click', () => history.back())