// ==========================================================================
// STATE & INIT
// ==========================================================================
let activeWindowId = null;
let zIndexCounter = 100;

document.addEventListener('DOMContentLoaded', () => {
  // Start clock
  updateClock();
  setInterval(updateClock, 1000);

  // Desktop icon selection handling
  const icons = document.querySelectorAll('.desktop-icon');
  icons.forEach(icon => {
    icon.addEventListener('click', (e) => {
      e.stopPropagation();
      icons.forEach(i => i.classList.remove('selected'));
      icon.classList.add('selected');
    });
  });

  // Single-tap open on phones / narrow viewports (dblclick stays for desktop mouse)
  document.querySelectorAll('.desktop-icon[data-window]').forEach(icon => {
    icon.addEventListener('click', (e) => {
      if (!isTouchFriendlyViewport()) return;
      e.stopPropagation();
      openWindow(icon.dataset.window);
    });
  });

  // Deselect icons when clicking empty desktop
  document.getElementById('desktop').addEventListener('click', () => {
    icons.forEach(i => i.classList.remove('selected'));
    // Also close start menu if open
    hideStartMenu();
  });

  // Setup window focus listeners
  document.querySelectorAll('.xp-window').forEach(win => {
    win.addEventListener('mousedown', () => bringToFront(win.id));
  });

  const userCard = document.getElementById('user-card');
  if (userCard) {
    userCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        doLogin();
      }
    });
  }

  const runInput = document.getElementById('run-input');
  if (runInput) {
    runInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        executeRun();
      } else if (e.key === 'Escape') {
        hideRunDialog();
      }
    });
  }

  initializeHobbies();
});

// ==========================================================================
// CLOCK
// ==========================================================================
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  // We want AM/PM string, 12-hour format like classic XP
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutes = now.getMinutes().toString().padStart(2, '0');
  
  const timeStr = `${hours}:${minutes} ${ampm}`;
  
  // XP only has clock in the system tray, login screen has no clock in the reference image
  const trayClock = document.getElementById('systray-clock');
  if (trayClock) trayClock.textContent = timeStr;
}

// ==========================================================================
// LOGIN SCREEN TRANSITION
// ==========================================================================
function doLogin() {
  const loginScreen = document.getElementById('login-screen');
  const desktop = document.getElementById('desktop');
  
  // Fade out login audio effect usually plays here (optional)
  loginScreen.style.transition = 'opacity 0.5s ease-out';
  loginScreen.style.opacity = '0';
  
  setTimeout(() => {
    loginScreen.classList.add('hidden');
    desktop.classList.remove('hidden');
  }, 500);
}

// ==========================================================================
// START MENU
// ==========================================================================
function toggleStartMenu(e) {
  if (e) {
    e.stopPropagation();
  }
  const menu = document.getElementById('start-menu');
  const btn = document.getElementById('start-btn');
  if (menu.classList.contains('hidden')) {
    menu.classList.remove('hidden');
    btn.classList.add('active');
    bringToFront('start-menu');
  } else {
    hideStartMenu();
  }
}

function hideStartMenu() {
  document.getElementById('start-menu').classList.add('hidden');
  document.getElementById('start-btn').classList.remove('active');
}

function startMenuOpen(winId) {
  openWindow(winId);
  hideStartMenu();
}

function showRunDialog() {
  hideStartMenu();
  const overlay = document.getElementById('run-overlay');
  const input = document.getElementById('run-input');
  overlay.classList.remove('hidden');
  if (input) {
    input.value = '';
    setTimeout(() => input.focus(), 0);
  }
}

function hideRunDialog() {
  document.getElementById('run-overlay').classList.add('hidden');
}

function executeRun() {
  const raw = (document.getElementById('run-input')?.value || '').trim().toLowerCase();
  const aliases = {
    about: 'about',
    'about me': 'about',
    'my computer': 'about',
    projects: 'projects',
    'my projects': 'projects',
    search: 'projects',
    experience: 'experience',
    skills: 'skills',
    'control panel': 'skills',
    contact: 'contact',
    hobbies: 'hobbies',
    'my pictures': 'hobbies',
    resume: 'resume',
    'my documents': 'resume',
    github: null,
    linkedin: null
  };

  hideRunDialog();

  if (raw.includes('github')) {
    openExternal('https://github.com/EmanuelNader');
    return;
  }
  if (raw.includes('linkedin')) {
    openExternal('https://linkedin.com/in/emanuelnader');
    return;
  }

  const winId = aliases[raw];
  if (winId) {
    openWindow(winId);
    return;
  }

  // Partial match fallback
  const keys = Object.keys(aliases);
  const hit = keys.find(k => k.includes(raw) || raw.includes(k));
  if (hit && aliases[hit]) {
    openWindow(aliases[hit]);
  }
}

function doLogoff() {
  // reload to return to login screen
  window.location.reload();
}

function doShutdown() {
  hideStartMenu();
  document.getElementById('shutdown-overlay').classList.remove('hidden');
  document.body.classList.add('shutdown-active');
}

function hideShutdown() {
  document.getElementById('shutdown-overlay').classList.add('hidden');
  document.body.classList.remove('shutdown-active');
}

function doStandBy() {
  hideShutdown();
  document.body.innerHTML = '<div style="background:black;width:100vw;height:100vh;"></div>';
}

function doTurnOff() {
  hideShutdown();
  document.body.innerHTML = '<div style="background:black;width:100vw;height:100vh;"></div>';
}

function doRestart() {
  hideShutdown();
  window.location.reload();
}

// ==========================================================================
// WINDOW MANAGEMENT
// ==========================================================================
function isTouchFriendlyViewport() {
  return window.matchMedia('(max-width: 640px), (pointer: coarse)').matches;
}

function clampWindowToDesktop(win) {
  if (isTouchFriendlyViewport()) return; // CSS full-bleeds windows on narrow screens
  const desk = document.getElementById('desktop');
  if (!desk || !win) return;
  const deskRect = desk.getBoundingClientRect();
  const maxW = Math.max(280, deskRect.width - 8);
  const maxH = Math.max(200, deskRect.height - 8);
  const style = win.style;
  const w = Math.min(parseFloat(style.width) || win.offsetWidth, maxW);
  const h = Math.min(parseFloat(style.height) || win.offsetHeight, maxH);
  style.width = w + 'px';
  style.height = h + 'px';
  let left = parseFloat(style.left) || 0;
  let top = parseFloat(style.top) || 0;
  left = Math.min(Math.max(0, left), Math.max(0, deskRect.width - w));
  top = Math.min(Math.max(0, top), Math.max(0, deskRect.height - h));
  style.left = left + 'px';
  style.top = top + 'px';
}

function openWindow(id) {
  const winId = `win-${id}`;
  const win = document.getElementById(winId);
  if (!win) {
    console.warn(`Window ${winId} not found`);
    return;
  }
  
  // If hidden, show it
  if (win.classList.contains('hidden')) {
    win.classList.remove('hidden');
    createTaskbarButton(winId, id);
  }

  if (isTouchFriendlyViewport()) {
    win.dataset.maximized = 'true';
  } else {
    clampWindowToDesktop(win);
  }

  bringToFront(winId);
  hideStartMenu();
}

function closeWindow(winId) {
  const win = document.getElementById(winId);
  win.classList.add('hidden');
  
  // Remove from taskbar
  const tbBtn = document.getElementById(`tb-btn-${winId}`);
  if (tbBtn) tbBtn.remove();

  if (winId === 'win-hobbies') {
    closeHobby();
  }
}

function minimizeWindow(winId) {
  const win = document.getElementById(winId);
  win.classList.add('hidden');
  
  const tbBtn = document.getElementById(`tb-btn-${winId}`);
  if (tbBtn) tbBtn.classList.remove('active');
}

function maximizeWindow(winId) {
  const win = document.getElementById(winId);
  
  // Toggle maximize state
  if (win.dataset.maximized === 'true') {
    // Restore
    win.style.left = win.dataset.origLeft || '100px';
    win.style.top = win.dataset.origTop || '100px';
    win.style.width = win.dataset.origWidth || '600px';
    win.style.height = win.dataset.origHeight || '400px';
    win.dataset.maximized = 'false';
  } else {
    // Save original state
    win.dataset.origLeft = win.style.left || window.getComputedStyle(win).left;
    win.dataset.origTop = win.style.top || window.getComputedStyle(win).top;
    win.dataset.origWidth = win.style.width || window.getComputedStyle(win).width;
    win.dataset.origHeight = win.style.height || window.getComputedStyle(win).height;
    
    // Maximize
    win.style.left = '0px';
    win.style.top = '0px';
    win.style.width = '100%';
    const taskbarH = getComputedStyle(document.getElementById('taskbar')).height;
    win.style.height = `calc(100% - ${taskbarH})`;
    win.dataset.maximized = 'true';
  }
  bringToFront(winId);
}

function bringToFront(winId) {
  // Reset all active states
  document.querySelectorAll('.xp-window').forEach(w => {
    w.classList.remove('active');
  });
  document.querySelectorAll('.taskbar-win-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  const win = document.getElementById(winId);
  if (win) {
    zIndexCounter++;
    win.style.zIndex = zIndexCounter;
    win.classList.add('active');
    win.classList.remove('hidden'); // In case it was minimized
  }
  
  // Highlight taskbar button
  const tbBtn = document.getElementById(`tb-btn-${winId}`);
  if (tbBtn) tbBtn.classList.add('active');
  
  // If Start Menu is frontmost, it needs a higher stack
  const sm = document.getElementById('start-menu');
  if (sm && !sm.classList.contains('hidden') && winId === 'start-menu') {
    zIndexCounter++;
    sm.style.zIndex = zIndexCounter;
  }
}

// ==========================================================================
// WINDOW DRAGGING
// ==========================================================================
let isDragging = false;
let currentDragWin = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

function startDrag(e, winId) {
  // Prevent dragging if maximizing/minimizing/closing buttons clicked
  if (e.target.tagName.toLowerCase() === 'button') return;
  
  const win = document.getElementById(winId);
  if (win.dataset.maximized === 'true') return; // Cannot drag maximized windows
  
  isDragging = true;
  currentDragWin = win;
  
  // Calculate offset of click relative to window's current position
  const rect = win.getBoundingClientRect();
  dragOffsetX = e.clientX - rect.left;
  dragOffsetY = e.clientY - rect.top;
  
  bringToFront(winId);
  e.preventDefault();
}

document.addEventListener('mousemove', (e) => {
  if (!isDragging || !currentDragWin) return;
  
  // New position
  let newX = e.clientX - dragOffsetX;
  let newY = e.clientY - dragOffsetY;
  
  // Ensure titlebar remains accessible (at least partially visible)
  if (newY < 0) newY = 0;
  
  currentDragWin.style.left = `${newX}px`;
  currentDragWin.style.top = `${newY}px`;
});

document.addEventListener('mouseup', () => {
  isDragging = false;
  currentDragWin = null;
});

// ==========================================================================
// TASKBAR BUTTONS
// ==========================================================================
function createTaskbarButton(winId, type) {
  const tbContainer = document.getElementById('taskbar-windows');
  
  // Check if exists
  if (document.getElementById(`tb-btn-${winId}`)) return;
  
  const titleMap = {
    'about': 'About Emanuel',
    'projects': 'My Projects',
    'experience': 'Experience',
    'skills': 'Skills',
    'contact': 'Contact',
    'hobbies': 'Hobbies',
    'resume': 'Resume.pdf'
  };
  
  const btn = document.createElement('div');
  btn.id = `tb-btn-${winId}`;
  btn.className = 'taskbar-win-btn active';
  btn.innerHTML = `<div class="tb-icon icon-${type}"></div><span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${titleMap[type]}</span>`;
  
  btn.addEventListener('click', () => {
    const win = document.getElementById(winId);
    if (!win) return;
    
    // Toggle active/minimize logic
    if (win.classList.contains('active') && !win.classList.contains('hidden')) {
      minimizeWindow(winId);
    } else {
      bringToFront(winId);
    }
  });
  
  tbContainer.appendChild(btn);
}

// ==========================================================================
// HOBBIES (XP My Pictures filmstrip)
// ==========================================================================
const HOBBY_ROOT = 'C:\\Users\\EmanuelNader\\My Pictures\\Hobbies';

const HOBBIES = [
  {
    id: 'motorcycle',
    name: 'Motorcycle',
    summary: 'Kawasaki Ninja ZX-6R',
    detail: 'I ride a 2006 Ninja Kawazaki ZX6r',
    photos: [
      { src: 'assets/hobbies/motorcycle-personal.png', alt: 'Black sport motorcycle parked on wet pavement at night with a helmet on the seat', kind: 'personal photo', caption: 'Night ride' }
    ]
  },
  {
    id: 'bodybuilding',
    name: 'Bodybuilding',
    summary: 'My working set',
    detail: 'Lost over 100 lbs and lift 5-6 times a week',
    photos: [
      { src: 'assets/hobbies/bench-press-working-set.png', alt: 'Loaded bench press bar with multiple black plates in a gym', kind: 'personal photo', caption: 'My working set' }
    ]
  },
  {
    id: 'cooking',
    name: 'Cooking',
    summary: 'Meals I made',
    detail: 'Enjoy cooking and preparing meals',
    photos: [
      { src: 'assets/hobbies/cooking-yogurt-bites.jpg', alt: 'Frozen yogurt fruit bites with granola', kind: 'personal photo', caption: 'Yogurt fruit bites' },
      { src: 'assets/hobbies/cooking-ribs.jpg', alt: 'Smoked ribs and beef on a foil tray', kind: 'personal photo', caption: 'Smoked ribs' },
      { src: 'assets/hobbies/cooking-katsu-curry.jpg', alt: 'Chicken katsu curry with rice, corn, and cucumber salad', kind: 'personal photo', caption: 'Katsu curry' },
      { src: 'assets/hobbies/cooking-cookie-ice-cream.jpg', alt: 'Cookies and cream ice cream on a cookie bar', kind: 'personal photo', caption: 'Cookie ice cream' }
    ]
  },
  {
    id: 'exploration',
    name: 'Exploration',
    summary: 'Haunted buildings and sunsets',
    detail: 'Love exploring random haunted buildings in the woods, and hiking for sunsets',
    photos: [
      { src: 'assets/hobbies/exploration-personal.png', alt: 'Blue evening view of the ocean, beach, and distant coastline from above', kind: 'personal photo', caption: 'Evening coastline' },
      { src: 'assets/hobbies/exploration-night-stairs.png', alt: 'Dark outdoor stairs at night with a bright handrail leading into shadow', kind: 'personal photo', caption: 'Night stairs', position: '64% 50%', tone: 'night' },
      { src: 'assets/hobbies/exploration-golden-gate.png', alt: 'Golden Gate Bridge spanning across the bay under cloudy skies', kind: 'personal photo', caption: 'Golden Gate' },
      { src: 'assets/hobbies/exploration-night-gate.png', alt: 'Open chain-link gate at night with branches and dirt lit by a flashlight', kind: 'personal photo', caption: 'Night gate', tone: 'night' }
    ]
  },
  {
    id: 'manga-anime',
    name: 'Manga & anime',
    summary: 'One Piece, Tokyo Ghoul, and more',
    detail: 'I love tons of manga and anime like One Piece, Tokyo Ghoul and way more.',
    photos: [
      { src: 'assets/hobbies/one-piece.png', alt: 'One Piece volume 103 cover, Liberation Warrior', kind: 'supplied media', caption: 'One Piece' },
      { src: 'assets/hobbies/tokyo-ghoul.png', alt: 'Tokyo Ghoul manga cover featuring Kaneki seated on a chair', kind: 'supplied media', caption: 'Tokyo Ghoul' }
    ]
  },
  {
    id: 'gaming',
    name: 'Gaming',
    summary: 'Persona 5, Minecraft, and Terraria',
    detail: 'I love open world survival games and story games like Persona 5, Minecraft, and Terraria.',
    photos: [
      { src: 'assets/hobbies/terraria.png', alt: 'Terraria cover art with an armored character carrying a torch and pickaxe', kind: 'supplied media', caption: 'Terraria' },
      { src: 'assets/hobbies/minecraft.png', alt: 'Minecraft cover art with Steve, Alex, a creeper, and a pig', kind: 'supplied media', caption: 'Minecraft' },
      { src: 'assets/hobbies/persona-5-royal.jpg', alt: 'Persona 5 Royal cover featuring Joker and the Phantom Thieves', kind: 'supplied media', caption: 'Persona 5 Royal' }
    ]
  }
];

let selectedHobbyId = HOBBIES[0].id;
let activeHobbyId = null;
let activeHobbyPhotoIndex = 0;

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[char]));
}

function initializeHobbies() {
  renderHobbies();

  const hobbiesContent = document.getElementById('hobbies-content');
  if (hobbiesContent) {
    hobbiesContent.addEventListener('click', (event) => {
      const photoControl = event.target.closest('[data-hobby-photo-direction]');
      if (photoControl) {
        event.preventDefault();
        event.stopPropagation();
        navigateHobbyPhotos(Number(photoControl.dataset.hobbyPhotoDirection));
        return;
      }
      const button = event.target.closest('[data-hobby-id]');
      if (!button) return;
      if (isTouchFriendlyViewport() || activeHobbyId) openHobby(button.dataset.hobbyId);
      else selectHobby(button.dataset.hobbyId);
    });
    hobbiesContent.addEventListener('dblclick', (event) => {
      const button = event.target.closest('[data-hobby-id]');
      if (button) openHobby(button.dataset.hobbyId);
    });
    hobbiesContent.addEventListener('keydown', (event) => {
      const button = event.target.closest('[data-hobby-id]');
      if (!button) return;
      if (event.key === 'Enter') {
        event.preventDefault();
        openHobby(button.dataset.hobbyId);
      } else if (event.key === ' ') {
        event.preventDefault();
        selectHobby(button.dataset.hobbyId);
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    const hobbiesWin = document.getElementById('win-hobbies');
    if (!hobbiesWin || hobbiesWin.classList.contains('hidden')) return;
    if (event.key === 'Escape' && activeHobbyId) {
      closeHobby();
      return;
    }
    if (!activeHobbyId) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      navigateHobbyPhotos(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      navigateHobbyPhotos(1);
    }
  });
}

function hobbyThumbMarkup(item, selectedId) {
  const image = item.photos[0];
  return `<button class="hobby-thumb${item.id === selectedId ? ' selected' : ''}" type="button" data-hobby-id="${escapeHtml(item.id)}" aria-pressed="${item.id === selectedId}">
      <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}"><span>${escapeHtml(item.name)}</span><small>${escapeHtml(item.summary)}</small></button>`;
}

function renderHobbies() {
  const target = document.getElementById('hobbies-content');
  if (!target) return;
  const selected = HOBBIES.find((item) => item.id === selectedHobbyId) || HOBBIES[0];
  const active = HOBBIES.find((item) => item.id === activeHobbyId);
  if (!active) {
    target.innerHTML = `<div class="hobbies-grid">${HOBBIES.map((item) => hobbyThumbMarkup(item, selected.id)).join('')}</div>`;
    updateHobbyChrome();
    return;
  }

  const photos = active.photos;
  const photoIndex = Math.min(Math.max(0, activeHobbyPhotoIndex), photos.length - 1);
  const activePhoto = photos[photoIndex];
  const imageNote = activePhoto.kind === 'personal photo'
    ? 'Personal photo.'
    : activePhoto.kind === 'supplied media'
      ? 'Supplied media.'
      : 'Illustrative image.';
  const photoCaption = activePhoto.caption ? `<span class="hobby-photo-caption">${escapeHtml(activePhoto.caption)}</span>` : '';
  const photoControls = photos.length > 1
    ? `<button class="hobby-photo-arrow hobby-photo-prev" type="button" data-hobby-photo-direction="-1" aria-label="Previous photo"></button><button class="hobby-photo-arrow hobby-photo-next" type="button" data-hobby-photo-direction="1" aria-label="Next photo"></button>`
    : '';
  const imageClass = `hobby-photo-image${activePhoto.tone ? ` tone-${escapeHtml(activePhoto.tone)}` : ''}`;
  const imageStyle = activePhoto.position ? ` style="object-position:${escapeHtml(activePhoto.position)}"` : '';

  target.innerHTML = `<div class="hobby-filmstrip">
      <figure><div class="hobby-photo-frame"><img class="${imageClass}" src="${escapeHtml(activePhoto.src)}" alt="${escapeHtml(activePhoto.alt)}"${imageStyle}>${photoControls}</div><figcaption><strong>${escapeHtml(active.name)}</strong>${photoCaption}<span>${escapeHtml(active.detail)}</span><small>${escapeHtml(imageNote)}</small></figcaption></figure>
      <div class="filmstrip-thumbs">${HOBBIES.map((item) => hobbyThumbMarkup(item, active.id)).join('')}</div></div>`;
  updateHobbyChrome();
}

function selectHobby(hobbyId) {
  if (!HOBBIES.some((item) => item.id === hobbyId)) return;
  selectedHobbyId = hobbyId;
  document.querySelectorAll('#hobbies-content [data-hobby-id]').forEach((button) => {
    const isSelected = button.dataset.hobbyId === hobbyId;
    button.classList.toggle('selected', isSelected);
    button.setAttribute('aria-pressed', String(isSelected));
  });
  updateHobbyChrome();
}

function openHobby(hobbyId) {
  if (!HOBBIES.some((item) => item.id === hobbyId)) return;
  selectedHobbyId = hobbyId;
  activeHobbyId = hobbyId;
  activeHobbyPhotoIndex = 0;
  renderHobbies();
  const content = document.getElementById('hobbies-content');
  if (content) content.scrollTop = 0;
  document.querySelector('#hobbies-content .hobby-thumb.selected')?.focus({ preventScroll: true });
}

function closeHobby() {
  activeHobbyId = null;
  activeHobbyPhotoIndex = 0;
  renderHobbies();
  const content = document.getElementById('hobbies-content');
  if (content) content.scrollTop = 0;
  document.querySelector(`#hobbies-content [data-hobby-id="${selectedHobbyId}"]`)?.focus({ preventScroll: true });
}

function navigateHobbies(direction) {
  const current = Math.max(0, HOBBIES.findIndex((item) => item.id === activeHobbyId));
  const next = (current + direction + HOBBIES.length) % HOBBIES.length;
  openHobby(HOBBIES[next].id);
}

function navigateHobbyPhotos(direction) {
  const active = HOBBIES.find((item) => item.id === activeHobbyId);
  const count = active?.photos?.length || 0;
  if (count < 2) return;
  activeHobbyPhotoIndex = (activeHobbyPhotoIndex + direction + count) % count;
  renderHobbies();
  const content = document.getElementById('hobbies-content');
  if (content) content.scrollTop = 0;
}

function updateHobbyChrome() {
  const selected = HOBBIES.find((item) => item.id === selectedHobbyId) || HOBBIES[0];
  const active = HOBBIES.find((item) => item.id === activeHobbyId);
  const activePhotos = active?.photos || [];
  const activePhoto = activePhotos[activeHobbyPhotoIndex] || activePhotos[0];
  const sidebar = document.getElementById('hobbies-sidebar');
  const address = document.getElementById('hobbies-address');
  const status = document.getElementById('hobbies-status');
  if (sidebar) sidebar.textContent = (active || selected).detail;
  if (address) address.value = active ? `${HOBBY_ROOT}\\${active.name}` : HOBBY_ROOT;
  if (status) {
    if (active) {
      const imageKind = activePhoto?.kind === 'personal photo' ? 'Personal photo' : 'Supplied media';
      status.textContent = `${activeHobbyPhotoIndex + 1} of ${activePhotos.length} pictures • ${active.name} • ${imageKind}`;
    } else {
      status.textContent = `${HOBBIES.length} pictures`;
    }
  }
  ['hobbies-back', 'hobbies-up'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.disabled = !active;
  });
  ['hobbies-previous', 'hobbies-next'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.hidden = !active;
  });
}

// ==========================================================================
// UTILS
// ==========================================================================
function openExternal(url) {
  window.open(url, '_blank');
}
