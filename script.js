// ==========================================================================
// STATE & INIT
// ==========================================================================
let activeWindowId = null;
let zIndexCounter = 100;
const WELCOME_STORAGE_KEY = 'emanuel-portfolio.welcome-seen.v1';
const projectApi = window.PortfolioProjects;
const projectUi = window.PortfolioProjectsUi;
const profileApi = window.PortfolioProfile;
const profileUi = window.PortfolioProfileUi;
let projectNavigator = projectApi ? projectApi.createProjectNavigator(projectApi.PROJECTS) : null;
let selectedProjectId = projectApi ? projectApi.getFeaturedProjects(projectApi.PROJECTS)[0]?.id || null : null;
let activeProjectId = null;
let selectedHobbyId = profileApi?.HOBBIES[0]?.id || null;
let activeHobbyId = null;
let activeHobbyPhotoIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  // The icon assets carry the visual affordance; labels keep every caption
  // control explicit for assistive technology without rendering text glyphs.
  document.querySelectorAll('.win-btn').forEach((button) => {
    const label = button.classList.contains('win-close')
      ? 'Close'
      : button.classList.contains('win-max')
        ? 'Maximize'
        : 'Minimize';
    button.textContent = '';
    button.setAttribute('aria-label', label);
  });

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

  initializeProjectsExperience();
  initializeProfileExperience();
});

function initializeProfileExperience() {
  renderAbout();
  renderExperience();
  renderContact();
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
    if (event.key === 'Escape' && activeHobbyId && !document.getElementById('win-hobbies')?.classList.contains('hidden')) closeHobby();
    if (!activeHobbyId || document.getElementById('win-hobbies')?.classList.contains('hidden')) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      navigateHobbyPhotos(-1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      navigateHobbyPhotos(1);
    }
  });
}

function renderAbout() { profileUi?.renderAbout(); }
function renderExperience() { profileUi?.renderExperience(); }
function renderContact() { profileUi?.renderContact(); }
function renderHobbies() {
  profileUi?.renderHobbies({ selectedId: selectedHobbyId, activeId: activeHobbyId, photoIndex: activeHobbyPhotoIndex });
  updateHobbyChrome();
}

function selectHobby(hobbyId) {
  if (!profileApi?.HOBBIES.some((item) => item.id === hobbyId)) return;
  selectedHobbyId = hobbyId;
  document.querySelectorAll('#hobbies-content [data-hobby-id]').forEach((button) => {
    const isSelected = button.dataset.hobbyId === hobbyId;
    button.classList.toggle('selected', isSelected);
    button.setAttribute('aria-pressed', String(isSelected));
  });
  updateHobbyChrome();
}

function openHobby(hobbyId) {
  if (!profileApi?.HOBBIES.some((item) => item.id === hobbyId)) return;
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
  if (!profileApi?.HOBBIES.length) return;
  const current = Math.max(0, profileApi.HOBBIES.findIndex((item) => item.id === activeHobbyId));
  const next = (current + direction + profileApi.HOBBIES.length) % profileApi.HOBBIES.length;
  openHobby(profileApi.HOBBIES[next].id);
}

function navigateHobbyPhotos(direction) {
  const active = profileApi?.HOBBIES.find((item) => item.id === activeHobbyId);
  const count = active?.photos?.length || 0;
  if (count < 2) return;

  activeHobbyPhotoIndex = (activeHobbyPhotoIndex + direction + count) % count;
  renderHobbies();
  const content = document.getElementById('hobbies-content');
  if (content) content.scrollTop = 0;
}

function updateHobbyChrome() {
  if (!profileApi) return;
  const selected = profileApi.HOBBIES.find((item) => item.id === selectedHobbyId) || profileApi.HOBBIES[0];
  const active = profileApi.HOBBIES.find((item) => item.id === activeHobbyId);
  const activePhotos = active?.photos?.length ? active.photos : active ? [active.image] : [];
  const activePhoto = activePhotos[activeHobbyPhotoIndex] || activePhotos[0];
  const sidebar = document.getElementById('hobbies-sidebar');
  const address = document.getElementById('hobbies-address');
  const status = document.getElementById('hobbies-status');
  if (sidebar && selected) sidebar.textContent = selected.detail;
  if (address) address.value = active ? `C:\\Users\\EmanuelNader\\My Pictures\\Hobbies\\${active.name}` : 'C:\\Users\\EmanuelNader\\My Pictures\\Hobbies';
  if (status) {
    const imageKind = activePhoto?.kind === 'personal photo' ? 'Personal photo' : activePhoto?.kind === 'supplied media' ? 'Supplied media' : 'Illustrative image';
    status.textContent = active ? `${activeHobbyPhotoIndex + 1} of ${activePhotos.length} pictures • ${active.name} • ${imageKind}` : `${profileApi.HOBBIES.length} folders • Mixed personal and supplied images`;
  }
  ['hobbies-back', 'hobbies-up'].forEach((id) => { const el = document.getElementById(id); if (el) el.disabled = !active; });
  ['hobbies-previous', 'hobbies-next'].forEach((id) => { const el = document.getElementById(id); if (el) el.hidden = !active; });
}

async function copyContactValue(value, label) {
  const live = document.getElementById('contact-live');
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(value);
    if (live) live.textContent = `${label} copied to the clipboard.`;
  } catch (_error) {
    if (live) live.textContent = `Could not copy ${label.toLowerCase()}. Please select it manually.`;
  }
}

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
    handlePostLoginRoute();
  }, 500);
}

function handlePostLoginRoute() {
  if (window.location.hash.startsWith('#projects')) {
    window.history.replaceState({ section: 'about' }, '', '#about');
  }

  openWindow('about');
}

function hasSeenWelcome() {
  try {
    return window.localStorage.getItem(WELCOME_STORAGE_KEY) === '1';
  } catch (_error) {
    return false;
  }
}

function markWelcomeSeen() {
  try {
    window.localStorage.setItem(WELCOME_STORAGE_KEY, '1');
  } catch (_error) {
    // The portfolio remains usable when storage is blocked.
  }
}

function dismissWelcomeAndOpen(windowId) {
  markWelcomeSeen();
  closeWindow('win-about');
  openWindow(windowId);
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

// ===========================================================================
// PROJECT EXPLORER
// ==========================================================================
function initializeProjectsExperience() {
  if (!projectApi || !projectUi) return;

  const validationErrors = projectApi.validateProjects(projectApi.PROJECTS);
  if (validationErrors.length) {
    console.error('Project data failed validation:', validationErrors);
  }

  renderProjectList();

  const content = document.getElementById('projects-content');
  const sidebar = document.getElementById('projects-sidebar');

  content.addEventListener('click', event => {
    const projectButton = event.target.closest('[data-project-id]');
    if (projectButton) {
      const projectId = projectButton.dataset.projectId;
      selectProject(projectId);
      if (isTouchFriendlyViewport()) openProject(projectId);
      return;
    }

    const thumbnail = event.target.closest('[data-screenshot-src]');
    if (thumbnail) selectProjectScreenshot(thumbnail);
  });

  content.addEventListener('dblclick', event => {
    const projectButton = event.target.closest('[data-project-id]');
    if (projectButton) openProject(projectButton.dataset.projectId);
  });

  content.addEventListener('keydown', event => {
    const projectButton = event.target.closest('[data-project-id]');
    if (!projectButton) {
      if (event.key === 'Escape' && activeProjectId) closeProject();
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      openProject(projectButton.dataset.projectId);
    } else if (event.key === ' ') {
      event.preventDefault();
      selectProject(projectButton.dataset.projectId);
    }
  });

  sidebar.addEventListener('click', event => {
    const action = event.target.closest('[data-project-action]')?.dataset.projectAction;
    if (action === 'back') closeProject();
    if (action === 'open' && selectedProjectId) openProject(selectedProjectId);
  });

  window.addEventListener('popstate', () => {
    if (window.location.hash.startsWith('#projects')) syncProjectRoute();
  });
  window.addEventListener('hashchange', () => {
    if (window.location.hash.startsWith('#projects')) syncProjectRoute();
  });

  if (window.location.hash.startsWith('#projects')) syncProjectRoute();
}

function renderProjectList() {
  if (!projectApi || !projectUi) return;
  const content = document.getElementById('projects-content');
  const sidebar = document.getElementById('projects-sidebar');
  if (!content || !sidebar) return;

  activeProjectId = null;
  content.innerHTML = projectUi.renderProjectListMarkup(projectApi.PROJECTS, selectedProjectId);
  const selectedProject = projectApi.getProjectById(selectedProjectId, projectApi.PROJECTS);
  sidebar.innerHTML = projectUi.renderProjectSidebarMarkup(selectedProject, 'list');
  updateProjectChrome(null);
}

function selectProject(projectId) {
  const project = projectApi?.getProjectById(projectId, projectApi.PROJECTS);
  if (!project || activeProjectId) return false;

  selectedProjectId = projectId;
  document.querySelectorAll('#projects-content [data-project-id]').forEach(button => {
    const selected = button.dataset.projectId === projectId;
    button.classList.toggle('selected', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  document.getElementById('projects-sidebar').innerHTML = projectUi.renderProjectSidebarMarkup(project, 'list');
  document.getElementById('projects-status').textContent = `${project.name} selected — double-click to open`;
  return true;
}

function openProject(projectId, options = {}) {
  const project = projectApi?.getProjectById(projectId, projectApi.PROJECTS);
  if (!project || !projectNavigator.open(projectId)) return false;

  selectedProjectId = projectId;
  activeProjectId = projectId;
  renderProjectDetail(project);

  if (!options.skipRoute && window.location.hash !== projectApi.projectRouteFor(projectId)) {
    window.history.pushState({ projectId }, '', projectApi.projectRouteFor(projectId));
  }
  return true;
}

function closeProject(options = {}) {
  if (!projectApi || !projectNavigator) return;

  if (activeProjectId) projectNavigator.close();
  renderProjectList();

  if (!options.skipRoute && window.location.hash !== projectApi.projectRouteFor()) {
    window.history.pushState({ projectId: null }, '', projectApi.projectRouteFor());
  }
  document.getElementById('projects-content')?.focus();
}

function navigateProjects(direction) {
  if (!projectNavigator) return;
  const projectId = projectNavigator.navigate(direction);

  if (projectId) {
    const project = projectApi.getProjectById(projectId, projectApi.PROJECTS);
    selectedProjectId = projectId;
    activeProjectId = projectId;
    renderProjectDetail(project);
  } else {
    renderProjectList();
  }

  window.history.replaceState({ projectId }, '', projectApi.projectRouteFor(projectId));
  document.getElementById('projects-content')?.focus();
}

function syncProjectRoute() {
  if (!projectApi || !projectUi) return;
  const route = projectApi.parseProjectRoute(window.location.hash, projectApi.PROJECTS);
  const canonicalHash = projectApi.canonicalProjectRoute(window.location.hash, projectApi.PROJECTS);
  if (window.location.hash !== canonicalHash) {
    window.history.replaceState({ projectId: route.projectId }, '', canonicalHash);
  }

  if (route.view === 'detail') {
    if (projectNavigator.current() !== route.projectId) projectNavigator.open(route.projectId);
    openProject(route.projectId, { skipRoute: true });
  } else {
    if (projectNavigator.current() !== null) projectNavigator.close();
    renderProjectList();
  }
}

function renderProjectDetail(project) {
  const content = document.getElementById('projects-content');
  const sidebar = document.getElementById('projects-sidebar');
  if (!content || !sidebar) return;

  content.innerHTML = projectUi.renderProjectDetailMarkup(project);
  sidebar.innerHTML = projectUi.renderProjectSidebarMarkup(project, 'detail');
  updateProjectChrome(project);
  content.scrollTop = 0;
}

function updateProjectChrome(project) {
  const projectWindow = document.getElementById('win-projects');
  const title = project ? `${project.name} — My Projects` : 'My Projects';
  const address = project
    ? `C:\\Users\\EmanuelNader\\My Projects\\${project.name}`
    : 'C:\\Users\\EmanuelNader\\My Projects';

  const titleElement = projectWindow?.querySelector('.win-title');
  const addressElement = document.getElementById('projects-address');
  const statusElement = document.getElementById('projects-status');
  if (titleElement) titleElement.textContent = title;
  if (addressElement) addressElement.value = address;
  if (statusElement) statusElement.textContent = project ? `1 object — ${project.name}` : `${projectApi.PROJECTS.length} objects`;

  const backButton = document.getElementById('projects-back');
  const forwardButton = document.getElementById('projects-forward');
  const upButton = document.getElementById('projects-up');
  if (backButton) backButton.disabled = !projectNavigator?.canGoBack();
  if (forwardButton) forwardButton.disabled = !projectNavigator?.canGoForward();
  if (upButton) upButton.disabled = !project;

  const taskbarTitle = document.querySelector('#tb-btn-win-projects .taskbar-win-title');
  if (taskbarTitle) taskbarTitle.textContent = title;
}

function selectProjectScreenshot(thumbnail) {
  const hero = document.querySelector('#projects-content .project-hero-image');
  const caption = document.querySelector('#projects-content .project-gallery-caption');
  if (!hero) return;

  hero.src = thumbnail.dataset.screenshotSrc;
  hero.alt = thumbnail.dataset.screenshotAlt;
  if (caption) caption.textContent = thumbnail.dataset.screenshotCaption;
  document.querySelectorAll('#projects-content .project-thumbnail').forEach(button => {
    button.classList.toggle('selected', button === thumbnail);
  });
}

function printResume() {
  openWindow('resume');
  window.print();
}

// ===========================================================================
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
  const pageZoom = parseFloat(window.getComputedStyle(document.body).zoom) || 1;
  const desktopWidth = deskRect.width / pageZoom;
  const desktopHeight = deskRect.height / pageZoom;
  const maxW = Math.max(280, desktopWidth - 8);
  const maxH = Math.max(200, desktopHeight - 8);
  const style = win.style;
  const w = Math.min(parseFloat(style.width) || win.offsetWidth, maxW);
  const h = Math.min(parseFloat(style.height) || win.offsetHeight, maxH);
  style.width = w + 'px';
  style.height = h + 'px';
  let left = parseFloat(style.left) || 0;
  let top = parseFloat(style.top) || 0;
  left = Math.min(Math.max(0, left), Math.max(0, desktopWidth - w));
  top = Math.min(Math.max(0, top), Math.max(0, desktopHeight - h));
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
  } else if (win.dataset.openMode === 'maximized' && win.dataset.maximized !== 'true') {
    maximizeWindow(winId);
  } else {
    clampWindowToDesktop(win);
  }

  bringToFront(winId);
  hideStartMenu();

  if (id === 'projects' && projectApi) {
    if (!window.location.hash.startsWith('#projects')) {
      window.history.pushState({ projectId: null }, '', projectApi.projectRouteFor());
    }
    syncProjectRoute();
  }
}

function closeWindow(winId) {
  const win = document.getElementById(winId);
  if (!win) return;
  win.classList.add('hidden');

  if (winId === 'win-about') markWelcomeSeen();
  
  // Remove from taskbar
  const tbBtn = document.getElementById(`tb-btn-${winId}`);
  if (tbBtn) tbBtn.remove();
}

function minimizeWindow(winId) {
  const win = document.getElementById(winId);
  if (!win) return;
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
    win.style.height = '100%'; // #desktop already excludes the taskbar
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
    'about': 'About Emanuel Nader',
    'projects': 'My Projects',
    'experience': 'Experience',
    'skills': 'Skills',
    'contact': 'Contact',
    'hobbies': 'Hobbies',
    'resume': 'Resume.pdf'
  };
  
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id = `tb-btn-${winId}`;
  btn.className = 'taskbar-win-btn active';
  btn.innerHTML = `<span class="tb-icon icon-${type}" aria-hidden="true"></span><span class="taskbar-win-title">${titleMap[type]}</span>`;
  
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
