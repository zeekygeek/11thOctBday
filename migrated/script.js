const giftContent = {
  recipient: 'Ravi Shankar Jha',
  sender: 'Manu',
  birthdayDate: '11th NOV',
  password: 'birthday',
  openingLine: 'A big birthday hug, a few happy memories, and a little surprise.',
  note: [
    '[Add a first line that sounds like you.]',
    '[A favorite shared story, in your own words.]',
    '[The thing you want him to remember long after today.]',
  ],
  video: {
    src: '',
    poster: 'memory-evening.png',
    title: 'A little film',
    description: 'Hit play for your very own birthday mini-movie.',
  },
  memories: [
    {
      image: 'memory-evening.png',
      alt: 'A bright backyard birthday table with cake, balloons, and confetti',
      caption: '[A moment you still think about]',
      note: '[Add a date, an inside joke, or leave this one without a caption.]',
      composition: 'wide',
    },
    {
      image: 'memory-window.png',
      alt: 'A sunny road trip view with a balloon ribbon in the car window',
      caption: '[Somewhere the two of you have been]',
      composition: 'quiet',
    },
    {
      image: 'memory-table.png',
      alt: 'Two slices of birthday cake and drinks on a confetti-covered table',
      caption: '[An ordinary day that became a favorite]',
      note: '[Replace this sample with a detail only the two of you would recognize.]',
      composition: 'close',
    },
  ],
  signoff: '[Your sign-off]',
  videoUrl: '',
  musicUrl: '',
};

const chapters = ["cover", "note", "film", "memories", "ending"];
const [birthdayDay, birthdayMonth] = giftContent.birthdayDate.split(/\s+/, 2);
const birthdayDayParts = birthdayDay.match(/^(\d+)(st|nd|rd|th)$/i);

const confettiPieces = Array.from({ length: 44 }, (_, index) => ({
  id: index,
  x: `${((index * 83) % 460) - 230}px`,
  y: `${100 + ((index * 47) % 230)}px`,
  spin: `${((index * 137) % 720) - 360}deg`,
  delay: `${(index % 8) * 24}ms`,
  color: ["pink", "yellow", "mint", "orange", "blue"][index % 5],
}));

let state = {
  isUnlocked: false,
  password: '',
  showPassword: false,
  loginError: '',
  chapter: 'cover',
  noteLine: 0,
  memoryIndex: 0,
  playing: false,
  showVideo: false,
  showPhoto: false,
  confettiKey: 0
};
let lastConfettiKey = -1;
let swipeStart = null;

function init() {
  // Populate static content
  document.getElementById('recipient-name-login').textContent = giftContent.recipient + '!';
  document.getElementById('login-date').textContent = giftContent.birthdayDate;
  
  if (giftContent.musicUrl) {
    document.getElementById('bg-audio').src = giftContent.musicUrl;
    document.getElementById('sound-toggle').style.display = 'flex';
  }
  
  document.getElementById('chapter-day').innerHTML = (birthdayDayParts?.[1] ?? birthdayDay) + (birthdayDayParts?.[2] ? `<sup>${birthdayDayParts[2]}</sup>` : '');
  document.getElementById('chapter-month').textContent = birthdayMonth;
  
  document.getElementById('recipient-name-cover').textContent = giftContent.recipient + '!';
  document.getElementById('cover-intro').textContent = giftContent.openingLine;
  document.getElementById('note-to').textContent = `DEAR ${giftContent.recipient.toUpperCase()},`;
  
  document.getElementById('film-title-text').textContent = giftContent.video.title;
  document.getElementById('film-desc').textContent = giftContent.video.description;
  document.getElementById('film-poster').src = giftContent.video.poster;
  
  if (giftContent.videoUrl) {
    document.getElementById('film-play-icon').style.display = 'grid';
    document.getElementById('film-frame-note').textContent = 'TAKE A BREATH. PRESS PLAY.';
  } else {
    document.getElementById('film-placeholder-label').style.display = 'block';
    document.getElementById('film-frame-note').textContent = 'ADD A VIDEO URL IN lib/gift-content.ts';
  }
  
  document.getElementById('recipient-name-ending').textContent = giftContent.recipient + '.';
  document.getElementById('ending-signoff').textContent = giftContent.signoff;
  document.getElementById('ending-signature').textContent = giftContent.sender;
  document.getElementById('footer-made-for').textContent = `MADE FOR ${giftContent.recipient.toUpperCase()}`;
  document.getElementById('footer-date').textContent = giftContent.birthdayDate;

  attachEventListeners();
  update();
  lucide.createIcons();
}

function goTo(nextChapter) {
  if (nextChapter === 'memories') state.memoryIndex = 0;
  if (nextChapter === 'note') state.noteLine = 0;
  state.showVideo = false;
  state.chapter = nextChapter;
  state.confettiKey++;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  update();
}

function next() {
  if (state.chapter === 'note' && state.noteLine < giftContent.note.length - 1) {
    state.noteLine++;
    update();
    return;
  }
  if (state.chapter === 'memories' && state.memoryIndex < giftContent.memories.length - 1) {
    state.memoryIndex++;
    update();
    return;
  }
  const pos = chapters.indexOf(state.chapter);
  if (pos < chapters.length - 1) goTo(chapters[pos + 1]);
}

function previous() {
  if (state.chapter === 'memories' && state.memoryIndex > 0) {
    state.memoryIndex--;
    update();
    return;
  }
  if (state.chapter === 'note' && state.noteLine > 0) {
    state.noteLine--;
    update();
    return;
  }
  const pos = chapters.indexOf(state.chapter);
  if (pos > 0) goTo(chapters[pos - 1]);
}

function attachEventListeners() {
  // Login Form
  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (state.password === giftContent.password) {
      state.loginError = '';
      state.isUnlocked = true;
      state.confettiKey++;
      update();
    } else {
      state.loginError = 'That isn’t quite it. Try again.';
      update();
    }
  });
  
  document.getElementById('birthday-password').addEventListener('input', (e) => {
    state.password = e.target.value;
    state.loginError = '';
    update();
  });
  
  document.getElementById('toggle-password-btn').addEventListener('click', () => {
    state.showPassword = !state.showPassword;
    update();
  });
  
  // Audio
  document.getElementById('sound-toggle').addEventListener('click', async () => {
    const audio = document.getElementById('bg-audio');
    if (!giftContent.musicUrl) return;
    if (state.playing) {
      audio.pause();
      state.playing = false;
    } else {
      try {
        await audio.play();
        state.playing = true;
      } catch (e) {
        state.playing = false;
      }
    }
    update();
  });
  
  // Global keydown
  window.addEventListener('keydown', (e) => {
    if (!state.isUnlocked) return;
    if (state.showPhoto) {
      if (e.key === 'Escape') { state.showPhoto = false; update(); }
      if (e.key === 'ArrowRight') { state.memoryIndex = Math.min(state.memoryIndex + 1, giftContent.memories.length - 1); update(); }
      if (e.key === 'ArrowLeft') { state.memoryIndex = Math.max(state.memoryIndex - 1, 0); update(); }
      return;
    }
    if (state.showVideo) {
      if (e.key === 'Escape') { state.showVideo = false; update(); }
      return;
    }
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') previous();
  });
  
  // Swipe Handlers
  const giftShell = document.getElementById('gift-shell');
  giftShell.addEventListener('pointerdown', (e) => {
    if (state.showPhoto || state.showVideo) { swipeStart = null; return; }
    if (e.pointerType === 'mouse' || e.target.closest('button, a, input, video, audio')) return;
    swipeStart = { x: e.clientX, y: e.clientY };
  });
  giftShell.addEventListener('pointerup', (e) => {
    if (state.showPhoto || state.showVideo) { swipeStart = null; return; }
    if (!swipeStart) return;
    const deltaX = e.clientX - swipeStart.x;
    const deltaY = e.clientY - swipeStart.y;
    swipeStart = null;
    if (Math.abs(deltaX) < 64 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) return;
    if (deltaX < 0) next();
    else previous();
  });
  giftShell.addEventListener('pointercancel', () => { swipeStart = null; });
  
  // Navigation Buttons
  document.getElementById('wordmark-link').addEventListener('click', (e) => { e.preventDefault(); goTo('cover'); });
  document.getElementById('chapter-back-btn').addEventListener('click', () => {
    const prevChap = chapters[Math.max(chapters.indexOf(state.chapter) - 1, 0)];
    goTo(prevChap);
  });
  document.getElementById('open-gift-btn').addEventListener('click', () => goTo('note'));
  document.getElementById('note-next-btn').addEventListener('click', () => next());
  document.getElementById('film-frame-btn').addEventListener('click', () => { state.showVideo = true; update(); });
  document.getElementById('film-next-btn').addEventListener('click', () => goTo('memories'));
  document.getElementById('memory-prev-btn').addEventListener('click', () => { state.memoryIndex = Math.max(state.memoryIndex - 1, 0); update(); });
  document.getElementById('memory-next-btn').addEventListener('click', () => { state.memoryIndex = Math.min(state.memoryIndex + 1, giftContent.memories.length - 1); update(); });
  document.getElementById('memory-finish-btn').addEventListener('click', () => goTo('ending'));
  document.getElementById('ending-restart-btn').addEventListener('click', () => goTo('cover'));
  document.getElementById('memory-photo').addEventListener('click', () => { state.showPhoto = true; update(); });
  
  // Modals
  document.getElementById('video-modal').addEventListener('click', () => { state.showVideo = false; update(); });
  document.getElementById('close-video-btn').addEventListener('click', (e) => { e.stopPropagation(); state.showVideo = false; update(); });
  document.getElementById('cinema-frame-container').addEventListener('click', (e) => e.stopPropagation());
  
  document.getElementById('photo-modal').addEventListener('click', () => { state.showPhoto = false; update(); });
  document.getElementById('close-photo-btn').addEventListener('click', (e) => { e.stopPropagation(); state.showPhoto = false; update(); });
  document.getElementById('photo-modal-prev').addEventListener('click', (e) => { e.stopPropagation(); state.memoryIndex = Math.max(state.memoryIndex - 1, 0); update(); });
  document.getElementById('photo-modal-next').addEventListener('click', (e) => { e.stopPropagation(); state.memoryIndex = Math.min(state.memoryIndex + 1, giftContent.memories.length - 1); update(); });
  document.getElementById('coverflow-stage').addEventListener('click', (e) => e.stopPropagation());
  
  // Cover flow touch swipe
  const coverflowStage = document.getElementById('coverflow-stage');
  coverflowStage.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    swipeStart = { x: touch.clientX, y: touch.clientY };
  });
  coverflowStage.addEventListener('touchend', (e) => {
    if (!swipeStart) return;
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - swipeStart.x;
    swipeStart = null;
    if (diffX > 40) { state.memoryIndex = Math.max(state.memoryIndex - 1, 0); update(); }
    else if (diffX < -40) { state.memoryIndex = Math.min(state.memoryIndex + 1, giftContent.memories.length - 1); update(); }
  });
  
  // Tilt effect for cover art
  const coverArt = document.getElementById('cover-art');
  coverArt.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const bounds = coverArt.getBoundingClientRect();
    const x = (e.clientX - bounds.left) / bounds.width - 0.5;
    const y = (e.clientY - bounds.top) / bounds.height - 0.5;
    coverArt.style.setProperty('--tilt-x', `${-y * 8}deg`);
    coverArt.style.setProperty('--tilt-y', `${x * 10}deg`);
  });
  coverArt.addEventListener('pointerleave', () => {
    coverArt.style.setProperty('--tilt-x', '0deg');
    coverArt.style.setProperty('--tilt-y', '0deg');
  });
}

function update() {
  document.getElementById('login-shell').style.display = state.isUnlocked ? 'none' : 'grid';
  document.getElementById('gift-shell').style.display = state.isUnlocked ? 'flex' : 'none';
  
  if (!state.isUnlocked) {
    const errEl = document.getElementById('login-error');
    const pwdInput = document.getElementById('birthday-password');
    if (state.loginError) {
      errEl.textContent = state.loginError;
      errEl.style.display = 'block';
      pwdInput.setAttribute('aria-invalid', 'true');
    } else {
      errEl.style.display = 'none';
      pwdInput.removeAttribute('aria-invalid');
    }
    pwdInput.type = state.showPassword ? 'text' : 'password';
    document.getElementById('toggle-password-btn').innerHTML = `<i data-lucide="${state.showPassword ? 'eye-off' : 'eye'}"></i>`;
    lucide.createIcons();
    return;
  }
  
  if (state.confettiKey !== lastConfettiKey) {
    const cCont = document.getElementById('confetti-container');
    cCont.innerHTML = '';
    if (state.confettiKey > 0) {
      confettiPieces.forEach(p => {
        const s = document.createElement('span');
        s.className = `confetti-piece confetti-${p.color}`;
        s.style.setProperty('--tx', p.x);
        s.style.setProperty('--ty', p.y);
        s.style.setProperty('--spin', p.spin);
        s.style.setProperty('--delay', p.delay);
        cCont.appendChild(s);
      });
    }
    lastConfettiKey = state.confettiKey;
  }
  
  document.getElementById('sound-toggle').innerHTML = `<i data-lucide="${state.playing ? 'volume-2' : 'volume-x'}"></i><span id="sound-text">${state.playing ? 'Sound on' : 'Sound off'}</span>`;
  
  const shell = document.getElementById('gift-shell');
  shell.className = `gift-shell chapter-${state.chapter}`;
  
  const hideHeaderFooter = state.showPhoto || state.showVideo;
  document.getElementById('gift-header').style.display = hideHeaderFooter ? 'none' : 'flex';
  document.getElementById('gift-footer').style.display = hideHeaderFooter ? 'none' : 'flex';
  
  const showBackRow = state.chapter !== 'cover' && !hideHeaderFooter;
  document.getElementById('chapter-date-art').style.display = showBackRow ? 'flex' : 'none';
  document.getElementById('chapter-back-row').style.display = showBackRow ? 'block' : 'none';
  
  chapters.forEach(ch => {
    const el = document.getElementById(`chapter-${ch}`);
    if (state.chapter === ch && !state.showPhoto && !state.showVideo) {
      el.style.display = ch === 'cover' ? 'grid' : (ch === 'ending' ? 'grid' : 'grid'); // Wait, default for chapter-scene is grid
    } else {
      el.style.display = 'none';
    }
  });
  
  if (state.chapter === 'note') {
    document.getElementById('note-title').textContent = giftContent.note[state.noteLine];
    const progressEl = document.getElementById('note-progress');
    progressEl.innerHTML = '';
    giftContent.note.forEach((_, i) => {
      const sp = document.createElement('span');
      if (i <= state.noteLine) sp.className = 'is-active';
      progressEl.appendChild(sp);
    });
    document.getElementById('note-next-text').textContent = state.noteLine < giftContent.note.length - 1 ? 'Next line' : 'Continue';
  }
  
  if (state.chapter === 'memories') {
    const memory = giftContent.memories[state.memoryIndex];
    const stage = document.getElementById('memory-stage');
    stage.className = `memory-stage memory-${memory.composition}`;
    document.getElementById('memory-img').src = memory.image;
    document.getElementById('memory-img').alt = memory.alt;
    
    // Check if image is loaded for priority/preload logic? The browser will handle caching.
    document.getElementById('memory-number').innerHTML = `${String(state.memoryIndex + 1).padStart(2, '0')} <i>/</i> ${String(giftContent.memories.length).padStart(2, '0')}`;
    document.getElementById('memory-caption-main').textContent = memory.caption;
    document.getElementById('memory-caption-note').textContent = memory.note || '';
    
    document.getElementById('memory-prev-btn').disabled = state.memoryIndex === 0;
    document.getElementById('memory-next-btn').disabled = state.memoryIndex === giftContent.memories.length - 1;
    
    const dotsEl = document.getElementById('memory-dots-container');
    dotsEl.innerHTML = '';
    giftContent.memories.forEach((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = i === state.memoryIndex ? 'active' : '';
      if (i === state.memoryIndex) b.setAttribute('aria-current', 'step');
      b.onclick = () => { state.memoryIndex = i; update(); };
      dotsEl.appendChild(b);
    });
    
    document.getElementById('memory-finish-btn').style.display = state.memoryIndex === giftContent.memories.length - 1 ? 'inline-flex' : 'none';
  }
  
  if (state.chapter === 'ending') {
    const memory = giftContent.memories[state.memoryIndex] || giftContent.memories[0];
    document.getElementById('ending-img').src = memory.image;
    document.getElementById('ending-img').alt = memory.alt;
  }
  
  const progressFooter = document.getElementById('footer-progress');
  progressFooter.innerHTML = '';
  const chapIdx = chapters.indexOf(state.chapter);
  chapters.forEach((_, i) => {
    const sp = document.createElement('span');
    if (i <= chapIdx) sp.className = 'is-active';
    progressFooter.appendChild(sp);
  });
  
  // Modals
  document.getElementById('video-modal').style.display = state.showVideo ? 'flex' : 'none';
  const cFrame = document.getElementById('cinema-frame-container');
  if (state.showVideo) {
    if (giftContent.videoUrl) {
      cFrame.innerHTML = `<video src="${giftContent.videoUrl}" controls autoplay playsinline></video>`;
      cFrame.querySelector('video').onended = () => setTimeout(() => { state.showVideo = false; update(); }, 1600);
    } else {
      cFrame.innerHTML = `
        <div class="cinema-placeholder">
          <img src="${giftContent.video.poster}" alt="Film preview poster" style="position: absolute; width: 100%; height: 100%; object-fit: cover;" />
          <div class="cinema-placeholder-overlay">
            <div class="cinema-play-ring"><span class="play-triangle">▶</span></div>
            <h3>${giftContent.video.title}</h3>
            <p>${giftContent.video.description}</p>
            <span class="cinema-note">Add your video URL in <code>lib/gift-content.ts</code> to play</span>
          </div>
        </div>
      `;
    }
  } else {
    cFrame.innerHTML = '';
  }
  
  document.getElementById('photo-modal').style.display = state.showPhoto ? 'flex' : 'none';
  if (state.showPhoto) {
    document.getElementById('photo-modal-counter').innerHTML = `${String(state.memoryIndex + 1).padStart(2, '0')} <i>/</i> ${String(giftContent.memories.length).padStart(2, '0')}`;
    document.getElementById('photo-modal-prev').disabled = state.memoryIndex === 0;
    document.getElementById('photo-modal-next').disabled = state.memoryIndex === giftContent.memories.length - 1;
    
    const track = document.getElementById('coverflow-track');
    track.innerHTML = '';
    giftContent.memories.forEach((mem, i) => {
      const offset = i - state.memoryIndex;
      const absOffset = Math.abs(offset);
      const isCenter = offset === 0;
      
      const div = document.createElement('div');
      div.className = `coverflow-card ${isCenter ? 'is-active' : ''} ${offset < 0 ? 'is-left' : ''} ${offset > 0 ? 'is-right' : ''}`;
      div.style.setProperty('--offset', offset);
      div.style.setProperty('--abs-offset', absOffset);
      div.style.zIndex = 50 - absOffset;
      div.onclick = (e) => { e.stopPropagation(); state.memoryIndex = i; update(); };
      
      div.innerHTML = `
        <div class="coverflow-card-inner">
          <img src="${mem.image}" alt="${mem.alt}" draggable="false" style="position: absolute; width: 100%; height: 100%; object-fit: cover;" />
        </div>
      `;
      track.appendChild(div);
    });
    
    const curMem = giftContent.memories[state.memoryIndex];
    document.getElementById('coverflow-caption-main').textContent = curMem.caption;
    document.getElementById('coverflow-caption-sub').textContent = curMem.note || '';
  }
  
  lucide.createIcons();
}

window.addEventListener('DOMContentLoaded', init);
