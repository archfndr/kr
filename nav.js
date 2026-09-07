(() => {
  const branch = document.querySelector('.nav-branch');
  const toggle = document.querySelector('.nav-branch-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (!branch || !toggle) return;

  const setOpen = (open) => {
    branch.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  toggle.addEventListener('click', (event) => {
    event.stopPropagation();
    setOpen(!branch.classList.contains('open'));
  });

  document.addEventListener('click', (event) => {
    if (!branch.contains(event.target)) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });

  document.querySelectorAll('.nav-submenu a').forEach((link) => {
    link.addEventListener('click', () => {
      setOpen(false);
      if (window.innerWidth <= 700) mainNav?.classList.remove('open');
    });
  });

  const path = location.pathname;
  if (path.startsWith('/finds/')) toggle.classList.add('active');
  document.querySelectorAll('.nav-submenu a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href && path.startsWith(href)) link.classList.add('active');
  });
})();
