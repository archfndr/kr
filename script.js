const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.track-card');
const menuBtn = document.getElementById('menuBtn');
const nav = document.querySelector('.nav');
const quickFind = document.getElementById('quickFind');
const dialogTitle = document.getElementById('dialogTitle');
const dialogLinks = document.getElementById('dialogLinks');
const dialogClose = document.getElementById('dialogClose');

filters.forEach((button) => {
  button.addEventListener('click', () => {
    filters.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');

    const filter = button.dataset.filter;
    cards.forEach((card) => {
      const tags = card.dataset.tags.split(' ');
      card.classList.toggle('is-hidden', filter !== 'all' && !tags.includes(filter));
    });
  });
});

menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('.archive-row').forEach((row) => {
  row.addEventListener('click', () => {
    const query = row.dataset.query;
    dialogTitle.textContent = row.querySelector('strong').textContent;
    const encoded = encodeURIComponent(query);
    dialogLinks.innerHTML = `
      <a target="_blank" rel="noopener" href="https://open.spotify.com/search/${encoded}">Open in Spotify ↗</a>
      <a target="_blank" rel="noopener" href="https://music.apple.com/us/search?term=${encoded}">Open in Apple Music ↗</a>
      <a target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encoded}">Open in YouTube ↗</a>
    `;
    quickFind.showModal();
  });
});

dialogClose.addEventListener('click', () => quickFind.close());
quickFind.addEventListener('click', (event) => {
  const rect = quickFind.getBoundingClientRect();
  const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (outside) quickFind.close();
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
document.getElementById('year').textContent = new Date().getFullYear();