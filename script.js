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
    win.style.height = 'calc(100% - 42px)'; // Account for taskbar
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
// UTILS
// ==========================================================================
function openExternal(url) {
  window.open(url, '_blank');
}
