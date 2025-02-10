export default function nav () {
  const navbar = document.querySelector('#nav')
  const menuBtn = document.querySelector('#menu-btn')
  const closeBtn = document.querySelector('#close-btn')

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      navbar?.classList.toggle('active')
    })
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      navbar?.classList.remove('active')
    })
  }

  const navLinks = document.querySelectorAll('[data-nav]')

  if (navLinks) {
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navbar?.classList.remove('active')
      })
      const href = link.getAttribute('href')

      if (window.location.pathname === href) {
        link.classList.add('active')
      } else {
        link.classList.remove('active')
      }

    })
  }
}

