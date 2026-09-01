const footerStylesheet = document.createElement('link');
footerStylesheet.rel = 'stylesheet';
footerStylesheet.href = '/footer.css?v=20260901-1';
document.head.appendChild(footerStylesheet);

const TRACKS = window.ARCHFNDR_TRACKS || [];
const body = document.body;
const page = body.dataset.page || 'home';
const langToggle = document.querySelector('.lang-toggle');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const drawer = document.getElementById('trackDrawer');
const drawerContent = document.getElementById('drawerContent');
let currentLanguage = 'en';

function coverStyle(track) {
  if (track.cover) return `background-image:url("${track.cover}")`;
  return '';
}

function toneClass(track) {
  return track.cover ? '' : ` tone-${track.tone || 'grey'}`;
}

function applyStaticLanguage() {
  document.documentElement.lang = currentLanguage;
  document.querySelectorAll('[data-en][data-ko]').forEach((el) => {
    el.textContent = el.dataset[currentLanguage];
  });
  if (langToggle) {
    const label = currentLanguage === 'en' ? '한국어로 보기' : 'View in English';
    langToggle.setAttribute('aria-label', label);
    langToggle.setAttribute('title', label);
  }
  if (page === 'home') renderHome();
  if (page === 'finds') renderFinds();
  if (page === 'archive') renderArchive();
  if (drawer?.classList.contains('open')) {
    const id = Number(drawer.dataset.trackId);
    const track = TRACKS.find((item) => item.id === id);
    if (track) renderDrawer(track);
  }
  try { localStorage.setItem('archfndr-language', currentLanguage); } catch (_) {}
}

function setLanguage(lang) {
  currentLanguage = lang === 'ko' ? 'ko' : 'en';
  applyStaticLanguage();
}

function visualCard(track) {
  const button = document.createElement('button');
  button.className = 'visual-card';
  button.type = 'button';
  button.dataset.track = String(track.id);
  button.innerHTML = `
    <div class="visual-art${toneClass(track)}" style='${coverStyle(track)}'></div>
    <div class="visual-meta">
      <div><h3>${track.title}</h3><p>${track.artist}</p></div>
      <span class="visual-index">${String(track.id).padStart(3,'0')}</span>
    </div>`;
  button.addEventListener('click', () => openDrawer(track.id));
  return button;
}

function renderHome() {
  const homeGrid = document.getElementById('homeGrid');
  const featuredCover = document.getElementById('featuredCover');
  if (featuredCover && TRACKS[0]) {
    featuredCover.style.backgroundImage = TRACKS[0].cover ? `url("${TRACKS[0].cover}")` : '';
    if (!TRACKS[0].cover) featuredCover.classList.add(`tone-${TRACKS[0].tone || 'grey'}`);
  }
  if (homeGrid) {
    homeGrid.innerHTML = '';
    TRACKS.slice(1,4).forEach((track) => homeGrid.appendChild(visualCard(track)));
  }
  document.querySelectorAll('[data-track="1"]').forEach((el) => {
    el.onclick = () => openDrawer(1);
  });
}

function getPageParam() {
  const value = Number(new URLSearchParams(location.search).get('page') || '1');
  return Number.isFinite(value) && value > 0 ? value : 1;
}

function renderPagination(container, current, total, onChange) {
  if (!container) return;
  container.innerHTML = '';
  const prev = document.createElement('button');
  prev.textContent = '←';
  prev.disabled = current <= 1;
  prev.addEventListener('click', () => onChange(current - 1));
  container.appendChild(prev);
  for (let i = 1; i <= total; i += 1) {
    const btn = document.createElement('button');
    btn.textContent = String(i).padStart(2,'0');
    if (i === current) btn.classList.add('active');
    btn.addEventListener('click', () => onChange(i));
    container.appendChild(btn);
  }
  const next = document.createElement('button');
  next.textContent = '→';
  next.disabled = current >= total;
  next.addEventListener('click', () => onChange(current + 1));
  container.appendChild(next);
}

function changePage(pageNumber) {
  const url = new URL(location.href);
  url.searchParams.set('page', pageNumber);
  history.pushState({}, '', url);
  if (page === 'finds') renderFinds();
  if (page === 'archive') renderArchive();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderFinds() {
  const grid = document.getElementById('findGrid');
  const pagination = document.getElementById('findPagination');
  if (!grid) return;
  const pageSize = 9;
  const totalPages = Math.max(1, Math.ceil(TRACKS.length / pageSize));
  const current = Math.min(getPageParam(), totalPages);
  const start = (current - 1) * pageSize;
  grid.innerHTML = '';
  TRACKS.slice(start, start + pageSize).forEach((track) => grid.appendChild(visualCard(track)));
  renderPagination(pagination, current, totalPages, changePage);
}

function renderArchive() {
  const list = document.getElementById('archiveList');
  const pagination = document.getElementById('archivePagination');
  if (!list) return;
  const pageSize = 18;
  const totalPages = Math.max(1, Math.ceil(TRACKS.length / pageSize));
  const current = Math.min(getPageParam(), totalPages);
  const start = (current - 1) * pageSize;
  list.innerHTML = '';
  TRACKS.slice(start, start + pageSize).forEach((track) => {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'archive-row';
    row.innerHTML = `
      <span class="archive-number">[ ${String(track.id).padStart(3,'0')} ]</span>
      <span class="archive-title">${track.title}<small>${track.artist}</small></span>
      <span class="archive-tags">${track.genres.map((genre) => `<span class="tag">${genre}</span>`).join('')}</span>
      <span class="archive-arrow">↗</span>`;
    row.addEventListener('click', () => openDrawer(track.id));
    list.appendChild(row);
  });
  renderPagination(pagination, current, totalPages, changePage);
}

function renderDrawer(track) {
  if (!drawerContent) return;
  const comment = track.comment[currentLanguage] || track.comment.en;
  const description = track.description[currentLanguage] || track.description.en;
  drawerContent.innerHTML = `
    <div class="drawer-cover${toneClass(track)}" style='${coverStyle(track)}'></div>
    <div class="drawer-kicker">ARCHIVE ${track.id}</div>
    <h2 class="drawer-title">${track.title}</h2>
    <p class="drawer-artist">${track.artist}</p>
    <div class="drawer-tags">${track.genres.map((genre) => `<span class="tag">${genre}</span>`).join('')}</div>
    <p class="drawer-quote">“${comment}”</p>
    <p class="drawer-description">${description}</p>
    <div class="drawer-links">
      <a href="${track.spotify}" target="_blank" rel="noopener"><span>SPOTIFY</span><span>↗</span></a>
      <a href="${track.apple}" target="_blank" rel="noopener"><span>APPLE MUSIC</span><span>↗</span></a>
      <a href="${track.youtube}" target="_blank" rel="noopener"><span>YOUTUBE</span><span>↗</span></a>
    </div>`;
}

function openDrawer(id) {
  const track = TRACKS.find((item) => item.id === Number(id));
  if (!drawer || !track) return;
  drawer.dataset.trackId = String(track.id);
  renderDrawer(track);
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden', 'false');
  body.classList.add('drawer-open');
}

function closeDrawer() {
  if (!drawer) return;
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden', 'true');
  body.classList.remove('drawer-open');
}

langToggle?.addEventListener('click', () => setLanguage(currentLanguage === 'en' ? 'ko' : 'en'));
menuToggle?.addEventListener('click', () => {
  mainNav?.classList.toggle('open');
});
document.querySelectorAll('.main-nav a').forEach((link) => link.addEventListener('click', () => mainNav?.classList.remove('open')));
document.querySelectorAll('[data-close-drawer]').forEach((el) => el.addEventListener('click', closeDrawer));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeDrawer(); });
window.addEventListener('popstate', () => { if (page === 'finds') renderFinds(); if (page === 'archive') renderArchive(); });

const currentPath = location.pathname;
document.querySelectorAll('.main-nav a').forEach((link) => {
  if (link.getAttribute('href') === currentPath) link.classList.add('active');
});

document.getElementById('year')?.replaceChildren(String(new Date().getFullYear()));
let savedLanguage = 'en';
try { savedLanguage = localStorage.getItem('archfndr-language') || 'en'; } catch (_) {}
setLanguage(savedLanguage);
