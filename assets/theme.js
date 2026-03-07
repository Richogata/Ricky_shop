(function () {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 8) {
      header.style.boxShadow = '0 8px 20px rgba(15, 23, 42, 0.06)';
    } else {
      header.style.boxShadow = 'none';
    }
  });
})();
