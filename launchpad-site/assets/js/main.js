// Main JS: nav toggle, theme toggle, SW registration, smooth scroll
(function(){
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (navToggle && navMenu){
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  // Theme toggle with persistence
  const root = document.documentElement;
  const saved = localStorage.getItem('theme');
  if (saved) root.setAttribute('data-theme', saved);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  if (!saved && prefersDark.matches) root.setAttribute('data-theme','dark');

  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn){
    toggleBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', current);
      localStorage.setItem('theme', current);
    });
  }

  // Smooth scroll offset for sticky header
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target){
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({top:y, behavior:'smooth'});
        if (navMenu && navMenu.classList.contains('open')) navMenu.classList.remove('open');
      }
    });
  });

  // Register service worker
  if ('serviceWorker' in navigator){
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(console.warn);
    });
  }
})();