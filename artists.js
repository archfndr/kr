(() => {
  const TRACKS = window.ARCHFNDR_TRACKS || [];
  const list = document.getElementById('artistIndex');
  const pagination = document.getElementById('artistPagination');
  if (!list) return;

  const getLanguage = () => document.documentElement.lang === 'ko' ? 'ko' : 'en';
  const pageSize = 18;

  function getPageParam() {
    const value = Number(new URLSearchParams(location.search).get('page') || '1');
    return Number.isFinite(value) && value > 0 ? value : 1;
  }

  function getArtists() {
    const map = new Map();
    TRACKS.forEach((track) => {
      const key = track.artist.trim().toLowerCase();
      if (!map.has(key)) {
        map.set(key, { name: track.artist, albums: [], tracks: [] });
      }
      const artist = map.get(key);
      artist.tracks.push(track);
      if (track.album && track.album !== '—' && !artist.albums.includes(track.album)) {
        artist.albums.push(track.album);
      }
    });
    return [...map.values()];
  }

  function renderPagination(current, total) {
    if (!pagination) return;
    pagination.innerHTML = '';
    const makeButton = (label, target, disabled = false, active = false) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.disabled = disabled;
      if (active) button.classList.add('active');
      if (!disabled) {
        button.addEventListener('click', () => {
          const url = new URL(location.href);
          url.searchParams.set('page', String(target));
          history.pushState({}, '', url);
          render();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }
      pagination.appendChild(button);
    };

    makeButton('←', current - 1, current <= 1);
    for (let i = 1; i <= total; i += 1) makeButton(String(i).padStart(2, '0'), i, false, i === current);
    makeButton('→', current + 1, current >= total);
  }

  function createArtistNode(artist) {
    const lang = getLanguage();
    const node = document.createElement('article');
    node.className = 'artist-node';

    const albumCount = artist.albums.length;
    const songCount = artist.tracks.length;
    const countText = lang === 'ko'
      ? `앨범 ${albumCount} · 곡 ${songCount}`
      : `${albumCount} ALBUM${albumCount === 1 ? '' : 'S'} · ${songCount} SONG${songCount === 1 ? '' : 'S'}`;

    const albumsMarkup = artist.albums.length
      ? artist.albums.map((album) => `<div class="artist-album">${album}</div>`).join('')
      : `<div class="artist-empty">${lang === 'ko' ? '앨범 정보 없음' : 'NO ALBUM DATA YET'}</div>`;

    const songsMarkup = artist.tracks.map((track) => `
      <button class="artist-song" type="button" data-track-id="${track.id}">
        <span>${track.title}</span><small>${track.album && track.album !== '—' ? track.album : ''}</small>
      </button>`).join('');

    node.innerHTML = `
      <button class="artist-toggle" type="button" aria-expanded="false">
        <span class="artist-name">${artist.name}</span>
        <span class="artist-count">${countText}</span>
        <span class="artist-arrow">›</span>
      </button>
      <div class="artist-children">
        <div class="artist-children-inner">
          <div class="artist-tree">
            <section>
              <p class="artist-tree-label">${lang === 'ko' ? '앨범' : 'ALBUMS'}</p>
              <div class="artist-album-list">${albumsMarkup}</div>
            </section>
            <section>
              <p class="artist-tree-label">${lang === 'ko' ? '노래' : 'SONGS'}</p>
              <div class="artist-song-list">${songsMarkup}</div>
            </section>
          </div>
        </div>
      </div>`;

    const toggle = node.querySelector('.artist-toggle');
    toggle.addEventListener('click', () => {
      const open = !node.classList.contains('open');
      node.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });

    node.querySelectorAll('[data-track-id]').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.stopPropagation();
        const id = Number(button.dataset.trackId);
        if (typeof window.openDrawer === 'function') window.openDrawer(id);
        else {
          const track = TRACKS.find((item) => item.id === id);
          if (track) location.href = `/finds/song/?track=${encodeURIComponent(track.slug)}`;
        }
      });
    });

    return node;
  }

  function render() {
    const artists = getArtists();
    const totalPages = Math.max(1, Math.ceil(artists.length / pageSize));
    const current = Math.min(getPageParam(), totalPages);
    const start = (current - 1) * pageSize;
    list.innerHTML = '';
    artists.slice(start, start + pageSize).forEach((artist) => list.appendChild(createArtistNode(artist)));
    renderPagination(current, totalPages);
  }

  const languageObserver = new MutationObserver((mutations) => {
    if (mutations.some((mutation) => mutation.attributeName === 'lang')) render();
  });
  languageObserver.observe(document.documentElement, { attributes: true });
  window.addEventListener('popstate', render);
  render();
})();
