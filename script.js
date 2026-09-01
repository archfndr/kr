const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.track-card');
const menuBtn = document.getElementById('menuBtn');
const nav = document.querySelector('.nav');
const quickFind = document.getElementById('quickFind');
const dialogTitle = document.getElementById('dialogTitle');
const dialogLinks = document.getElementById('dialogLinks');
const dialogClose = document.getElementById('dialogClose');
const siteHeader = document.querySelector('.site-header');

const headerActions = document.createElement('div');
headerActions.className = 'header-actions';
const langToggle = document.createElement('button');
langToggle.type = 'button';
langToggle.className = 'lang-toggle';
siteHeader.appendChild(headerActions);
headerActions.appendChild(langToggle);
headerActions.appendChild(menuBtn);

const copy = {
  en: {
    title: 'ArchFndr — Curated Music Archive',
    description: 'ArchFndr — a curated archive of music worth finding.',
    discover: 'Discover',
    archive: 'Archive',
    about: 'About',
    menu: 'MENU',
    hero: 'Find what<br>you weren’t<br>looking for.',
    lede: 'A small archive of songs, textures, and moments worth keeping.',
    start: 'Start digging',
    scroll: 'SCROLL TO BROWSE',
    latest: 'LATEST FINDS',
    rotation: 'Current rotation',
    filters: { all: 'ALL', 'late-night': '1', warm: '2', 'left-field': '3' },
    tracks: [
      'Soft edges, grainy intimacy, a room that feels warmer after midnight.',
      'Guitar tones that sound half-corroded, half-heavenly.',
      'Memory stretched thin until it becomes atmosphere.',
      'Dusty drums, daylight through curtains, a feeling that never ages.',
      'For when polished R&B feels too clean and you want the seams exposed.',
      'Melancholy without the melodrama. Close, quiet, replayable.'
    ],
    archiveLabel: 'THE ARCHIVE',
    archiveHeadline: 'Not a playlist.<br>A trail of taste.',
    moods: ['bright / restless', 'warm / intimate', 'hazy / electric', 'late / weightless', 'dusty / tender'],
    aboutLabel: 'ABOUT ARCHFNDR',
    aboutHeadline: 'Human taste,<br>kept visible.',
    aboutP1: 'ArchFndr is a personal curation project for music that deserves a second listen, a screenshot, or a late-night message to a friend.',
    aboutP2: 'No endless feed. No recommendation engine. Just a growing archive of things worth finding.',
    curated: 'CURATED IN SEOUL',
    quick: 'QUICK FIND',
    openSpotify: 'Open in Spotify ↗',
    openApple: 'Open in Apple Music ↗',
    openYoutube: 'Open in YouTube ↗',
    switchLabel: '한국어',
    switchAria: '한국어로 보기'
  },
  ko: {
    title: 'ArchFndr — 음악 아카이브',
    description: 'ArchFndr — 발견할 가치가 있는 음악을 모은 개인 큐레이션 아카이브.',
    discover: '발견',
    archive: '아카이브',
    about: '소개',
    menu: '메뉴',
    hero: '찾고 있지 않았던<br>것을 발견해.',
    lede: '간직할 가치가 있는 노래, 질감, 순간들을 모은 작은 아카이브.',
    start: '찾아보기',
    scroll: '아래로 둘러보기',
    latest: '최근 발견',
    rotation: '요즘 듣는 것들',
    filters: { all: '전체', 'late-night': '1', warm: '2', 'left-field': '3' },
    tracks: [
      '부드러운 결, 거친 친밀감. 자정이 지나면 방 안이 조금 더 따뜻해지는 듯한 곡.',
      '반쯤 부식되고 반쯤 천국 같은 기타 톤.',
      '기억이 아주 얇게 늘어나 결국 분위기 자체가 되는 순간.',
      '먼지 낀 드럼, 커튼 사이의 햇빛, 시간이 지나도 늙지 않는 감정.',
      '매끈한 R&B가 너무 깨끗하게 느껴질 때, 봉제선이 그대로 드러난 음악.',
      '과장 없는 우울. 가까이 있고, 조용하고, 계속 다시 듣게 되는 음악.'
    ],
    archiveLabel: '아카이브',
    archiveHeadline: '플레이리스트가 아니라,<br>취향이 지나온 흔적.',
    moods: ['밝음 / 초조함', '따뜻함 / 친밀함', '몽롱함 / 전기감', '늦은 밤 / 무중력', '먼지 낀 / 다정함'],
    aboutLabel: 'ARCHFNDR 소개',
    aboutHeadline: '사람의 취향을,<br>보이는 곳에.',
    aboutP1: 'ArchFndr는 한 번 더 듣고 싶거나, 캡처해 두고 싶거나, 늦은 밤 친구에게 보내고 싶은 음악을 모으는 개인 큐레이션 프로젝트입니다.',
    aboutP2: '끝없는 피드도, 추천 알고리즘도 없습니다. 발견할 가치가 있는 것들을 차곡차곡 쌓아가는 아카이브입니다.',
    curated: '서울에서 큐레이션',
    quick: '바로 듣기',
    openSpotify: 'Spotify에서 열기 ↗',
    openApple: 'Apple Music에서 열기 ↗',
    openYoutube: 'YouTube에서 열기 ↗',
    switchLabel: 'EN',
    switchAria: 'View in English'
  }
};

let currentLanguage = 'en';
let currentDialogQuery = null;

function setLeadingText(element, text) {
  if (!element) return;
  const node = Array.from(element.childNodes).find((item) => item.nodeType === Node.TEXT_NODE);
  if (node) node.nodeValue = `${text} `;
}

function renderDialogLinks(query) {
  if (!query) return;
  const encoded = encodeURIComponent(query);
  const t = copy[currentLanguage];
  dialogLinks.innerHTML = `
    <a target="_blank" rel="noopener" href="https://open.spotify.com/search/${encoded}">${t.openSpotify}</a>
    <a target="_blank" rel="noopener" href="https://music.apple.com/us/search?term=${encoded}">${t.openApple}</a>
    <a target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encoded}">${t.openYoutube}</a>
  `;
}

function applyLanguage(language) {
  currentLanguage = language === 'ko' ? 'ko' : 'en';
  const t = copy[currentLanguage];
  document.documentElement.lang = currentLanguage;
  document.title = t.title;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) metaDescription.setAttribute('content', t.description);

  const navLinks = nav.querySelectorAll('a');
  if (navLinks[0]) navLinks[0].textContent = t.discover;
  if (navLinks[1]) navLinks[1].textContent = t.archive;
  if (navLinks[2]) navLinks[2].textContent = t.about;
  menuBtn.textContent = t.menu;
  langToggle.textContent = t.switchLabel;
  langToggle.setAttribute('aria-label', t.switchAria);

  const heroTitle = document.querySelector('.hero-copy h1');
  if (heroTitle) {
    heroTitle.innerHTML = t.hero;
    heroTitle.style.lineHeight = '0.98';
  }
  const heroLede = document.querySelector('.hero-lede');
  if (heroLede) heroLede.textContent = t.lede;
  setLeadingText(document.querySelector('.hero .text-link'), t.start);
  setLeadingText(document.querySelector('.scroll-note'), t.scroll);

  const discoverLabel = document.querySelector('.discover-section .section-head .eyebrow');
  if (discoverLabel) discoverLabel.textContent = t.latest;
  const rotation = document.querySelector('.discover-section .section-head h2');
  if (rotation) rotation.textContent = t.rotation;
  filters.forEach((button) => {
    button.textContent = t.filters[button.dataset.filter] || button.textContent;
  });
  document.querySelectorAll('.track-card > p').forEach((paragraph, index) => {
    if (t.tracks[index]) paragraph.textContent = t.tracks[index];
  });

  const archiveLabel = document.querySelector('.archive-intro .eyebrow');
  if (archiveLabel) archiveLabel.textContent = t.archiveLabel;
  const archiveHeadline = document.querySelector('.archive-intro h2');
  if (archiveHeadline) archiveHeadline.innerHTML = t.archiveHeadline;
  document.querySelectorAll('.archive-row small').forEach((mood, index) => {
    if (t.moods[index]) mood.textContent = t.moods[index];
  });

  const aboutLabel = document.querySelector('.about-grid .eyebrow');
  if (aboutLabel) aboutLabel.textContent = t.aboutLabel;
  const aboutHeadline = document.querySelector('.about-grid h2');
  if (aboutHeadline) aboutHeadline.innerHTML = t.aboutHeadline;
  const aboutParagraphs = document.querySelectorAll('.about-copy p');
  if (aboutParagraphs[0]) aboutParagraphs[0].textContent = t.aboutP1;
  if (aboutParagraphs[1]) aboutParagraphs[1].textContent = t.aboutP2;

  const curated = document.querySelector('.footer-meta > span:first-child');
  if (curated) curated.textContent = t.curated;
  const quickLabel = quickFind.querySelector('.eyebrow');
  if (quickLabel) quickLabel.textContent = t.quick;
  dialogClose.setAttribute('aria-label', currentLanguage === 'ko' ? '닫기' : 'Close');
  if (currentDialogQuery) renderDialogLinks(currentDialogQuery);

  try {
    localStorage.setItem('archfndr-language', currentLanguage);
  } catch (_) {}
}

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

langToggle.addEventListener('click', () => {
  applyLanguage(currentLanguage === 'en' ? 'ko' : 'en');
});

document.querySelectorAll('.nav a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  });
});

document.querySelectorAll('.archive-row').forEach((row) => {
  row.addEventListener('click', () => {
    currentDialogQuery = row.dataset.query;
    dialogTitle.textContent = row.querySelector('strong').textContent;
    renderDialogLinks(currentDialogQuery);
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

let savedLanguage = 'en';
try {
  savedLanguage = localStorage.getItem('archfndr-language') || 'en';
} catch (_) {}
applyLanguage(savedLanguage);