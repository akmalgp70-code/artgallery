async function initSite(){
  let artworks = [];
  try{
    const res = await fetch('artworks.json');
    artworks = await res.json();
  }catch(err){
    console.error('Could not load artworks.json', err);
    return;
  }

  initHeroCarousel(artworks);
  initGalleryStrip(artworks);
}

/* ---------- HERO CAROUSEL ---------- */
function initHeroCarousel(artworks){
  const carousel = document.getElementById('heroCarousel');
  const caption = document.getElementById('heroCaption');
  const dotsWrap = document.getElementById('heroDots');
  if(!carousel) return;

  let current = 0;
  let autoplayTimer = null;

  // build one slide per artwork
  artworks.forEach((art, i) => {
    const slide = document.createElement('div');
    slide.className = 'hero-slide' + (i === 0 ? ' active' : '');
    slide.innerHTML = `<img src="${art.image}" alt="${art.title}">`;
    carousel.insertBefore(slide, caption);

    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Show ${art.title}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(index){
    const slides = carousel.querySelectorAll('.hero-slide');
    const dots = dotsWrap.querySelectorAll('button');
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + artworks.length) % artworks.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    caption.textContent = artworks[current].caption || artworks[current].title;
    resetAutoplay();
  }

  function resetAutoplay(){
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(() => goTo(current + 1), 5000);
  }

  document.getElementById('heroPrev').addEventListener('click', () => goTo(current - 1));
  document.getElementById('heroNext').addEventListener('click', () => goTo(current + 1));

  caption.textContent = artworks[0].caption || artworks[0].title;
  resetAutoplay();
}

/* ---------- GALLERY STRIP ---------- */
function initGalleryStrip(artworks){
  const track = document.getElementById('stripTrack');
  if(!track) return;

  artworks.forEach((art, i) => {
    const card = document.createElement('div');
    card.className = 'strip-card';
    card.innerHTML = `
      <div class="thumb"><img src="${art.image}" alt="${art.title}"></div>
      <div class="meta">
        <div class="title">${art.title}</div>
        <div class="sub">${art.price || ''}${art.price && art.size ? ' · ' : ''}${art.size || ''}</div>
      </div>
    `;
    card.querySelector('.thumb').addEventListener('click', () => openLightbox(art));
    track.appendChild(card);
  });

  document.getElementById('galPrev').addEventListener('click', () => {
    track.scrollBy({ left: -300, behavior: 'smooth' });
  });
  document.getElementById('galNext').addEventListener('click', () => {
    track.scrollBy({ left: 300, behavior: 'smooth' });
  });
}

/* ---------- LIGHTBOX ---------- */
function openLightbox(art){
  const lightbox = document.getElementById('lightbox');
  if(!lightbox) return;

  document.getElementById('lightboxImg').src = art.image;
  document.getElementById('lightboxImg').alt = art.title;
  document.getElementById('lightboxTitle').textContent = art.title;
  document.getElementById('lightboxMeta').textContent =
    [art.medium, art.year, art.size].filter(Boolean).join(' · ');
  document.getElementById('lightboxPrice').textContent = art.price || '';
  document.getElementById('lightboxDesc').textContent = art.description || '';

  lightbox.classList.add('open');
}

/* ---------- NAV MENU TOGGLE ---------- */
function initMenu(){
  const toggle = document.getElementById('menuToggle');
  const overlay = document.getElementById('menuOverlay');
  if(!toggle || !overlay) return;

  function closeMenu(){
    toggle.classList.remove('open');
    overlay.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = overlay.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // close when clicking a link, or anywhere outside the menu
  overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('click', (e) => {
    if(!overlay.contains(e.target) && !toggle.contains(e.target)) closeMenu();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initSite();
  initMenu();
  initLightbox();
});