const HOME_MEDIA = {
  video: 'assets/videos/mountain-climb.mp4',
  videoPage: 'https://videos.pexels.com/video-files/34573393/14649858_1920_1080_24fps.mp4',
  poster: {
    local: 'assets/images/climbing/home-climbing-poster.jpg',
    alt: 'Climber scaling a steep rock face',
    credit: 'Pexels',
    license: 'Pexels License',
    page: 'https://images.pexels.com/videos/34573393/pexels-photo-34573393.jpeg'
  }
};

const PAGE_PHOTOS = {
  about: {
    local: 'assets/images/climbing/page-about.jpg',
    alt: 'Climber ascending a snowy mountain'
  },
  contact: {
    local: 'assets/images/climbing/page-contact.jpg',
    alt: 'Climber scaling a rugged cliff face'
  },
  booking: {
    local: 'assets/images/climbing/page-booking.jpg',
    alt: 'Climber preparing gear beside a snowy mountain'
  },
  safety: {
    local: 'assets/images/climbing/page-safety.jpg',
    alt: 'Climber ascending a snowy ridge'
  },
  faq: {
    local: 'assets/images/climbing/page-faq.jpg',
    alt: 'Climber ascending a steep rock face'
  }
};

const imgSrc = m => (m ? (m.local || m.url || '') : '');
const credit = m => (m && m.credit
  ? `<small class="credit">Photo: ${esc(m.credit)} · ${esc(m.license)} · <a href="${esc(m.page)}" rel="noopener">source</a></small>`
  : '');

function pagePhoto() {
  const photo = PAGE_PHOTOS[document.body.dataset.page];
  const heading = document.querySelector('main h1');
  if (!photo || !heading) return;

  const figure = document.createElement('figure');
  figure.className = 'page-photo';
  figure.innerHTML = `<img src="${esc(photo.local)}" alt="${esc(photo.alt)}" loading="lazy" decoding="async">`;
  heading.insertAdjacentElement('afterend', figure);
}

function heroMedia() {
  const hero = document.querySelector('.hero');
  if (!hero || hero.dataset.done) return;
  hero.dataset.done = 'true';

  const poster = HOME_MEDIA.poster;
  const probe = new Image();
  probe.onload = () => {
    hero.style.backgroundImage = `linear-gradient(#33241912 40%,#332419df),url("${probe.src}")`;
    hero.style.backgroundSize = 'cover';
    hero.style.backgroundPosition = 'center';
    hero.classList.add('hasimg');
    const videoCredit = credit({ ...poster, page: HOME_MEDIA.videoPage })
      .replace('Photo:', 'Video and poster:');
    hero.insertAdjacentHTML('beforeend', videoCredit.replace('class="credit"', 'class="credit herocredit"'));
  };
  probe.onerror = () => {
    hero.style.backgroundImage = `linear-gradient(#33241912 40%,#332419df),url("${poster.local}")`;
  };
  probe.src = poster.local;

  // Autoplay stays on the home hero and respects reduced-motion settings.
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const video = document.createElement('video');
  video.className = 'bgv';
  video.src = HOME_MEDIA.video;
  video.autoplay = video.muted = video.loop = video.playsInline = true;
  video.setAttribute('aria-hidden', 'true');
  video.poster = poster.local;
  video.onerror = () => video.remove();
  hero.prepend(video);
}
