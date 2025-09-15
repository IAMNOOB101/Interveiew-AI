// Layout JS for header/footer interactivity

document.addEventListener('DOMContentLoaded', function() {
  // Example: Highlight active nav link
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    if (window.location.pathname === link.getAttribute('href')) {
      link.classList.add('active');
    }
  });

  // Example: Footer year update (if needed)
  const footerYear = document.getElementById('footer-year');
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }
});
