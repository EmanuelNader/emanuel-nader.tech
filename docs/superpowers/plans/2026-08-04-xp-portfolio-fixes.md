# XP Portfolio Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix broken shutdown actions, keyboard login, mobile icon/window usability, and small content polish on the static Windows XP portfolio.

**Architecture:** Keep the existing static site (`index.html` + `style.css` + `script.js`). Fix behavior in `script.js`, layout in `style.css`, and small markup/content in `index.html`. Verify with `npx @playwright/cli` against a local `python3 -m http.server` — there is no unit-test framework.

**Tech Stack:** Vanilla HTML/CSS/JS, GitHub Pages static hosting, Playwright CLI for verification

## Global Constraints

- Preserve the Windows XP aesthetic and existing desktop metaphor; no framework migration
- Touch only `index.html`, `style.css`, `script.js`, and optional `assets/` / cleanup of accidental Playwright artifacts
- Do not add npm dependencies or a build step
- Commits must not include Playwright screenshots/yaml dumps (`*.png` exploration artifacts, `.playwright-cli/`)
- Prefer minimal diffs; do not rewrite the whole desktop system

## File Structure

- `script.js` — login keyboard, shutdown actions, optional mobile single-tap open, window size clamp on open
- `style.css` — narrow-viewport icon layout + window max-size rules
- `index.html` — wire shutdown onclick handlers, Experience status text, favicon link
- Cleanup: delete untracked Playwright exploration artifacts from repo root

---

### Task 1: Fix shutdown Stand By / Turn Off / Restart

**Files:**
- Modify: `script.js` (`doRestart` and related helpers)
- Modify: `index.html` (shutdown action `onclick` handlers around the shutdown overlay)

**Interfaces:**
- Consumes: existing `hideShutdown()`, `doShutdown()`, `#shutdown-overlay`
- Produces:
  - `doStandBy()` — blanks the screen (black full-viewport div)
  - `doTurnOff()` — blanks the screen (same as Stand By / classic XP “off”)
  - `doRestart()` — `window.location.reload()` (no `.shutdown-select` lookup)
  - Cancel / Stand By header cancel still call `hideShutdown()` only

**Bug context:** HTML buttons call `doRestart()` for both Turn Off and Restart; Stand By calls `hideShutdown()`. `doRestart()` reads missing `.shutdown-select` and throws.

- [ ] **Step 1: Replace shutdown helpers in `script.js`**

```js
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
```

Remove the old `.shutdown-select` implementation entirely.

- [ ] **Step 2: Wire `index.html` shutdown actions**

In `#shutdown-overlay`:
- Stand By → `onclick="doStandBy()"`
- Turn Off → `onclick="doTurnOff()"`
- Restart → `onclick="doRestart()"`
- Cancel stays `onclick="hideShutdown()"`

- [ ] **Step 3: Verify with Playwright**

```bash
python3 -m http.server 8765 &
npx --yes @playwright/cli open http://127.0.0.1:8765/
# login, open Start → Turn Off Computer
npx --yes @playwright/cli --raw eval "doShutdown(); true"
npx --yes @playwright/cli eval "doRestart()"
# expect page back at login after reload
npx --yes @playwright/cli --raw eval "!!document.getElementById('login-screen')"
# fresh session: doTurnOff should blank
npx --yes @playwright/cli goto http://127.0.0.1:8765/
# login then:
npx --yes @playwright/cli --raw eval "doTurnOff(); document.body.innerText.trim()==='' || document.body.querySelector('div')!==null"
```

Expected: no TypeError; Restart returns to login; Turn Off/Stand By show black screen.

- [ ] **Step 4: Commit**

```bash
git add script.js index.html
git commit -m "$(cat <<'EOF'
fix: wire Stand By, Turn Off, and Restart actions

EOF
)"
```

---

### Task 2: Keyboard activation for login

**Files:**
- Modify: `script.js` (DOMContentLoaded / login handlers)

**Interfaces:**
- Consumes: `#user-card`, existing `doLogin()`
- Produces: Enter and Space on focused `#user-card` call `doLogin()`; prevent Space scroll default

- [ ] **Step 1: Add keydown handler**

In `DOMContentLoaded` (or next to login setup):

```js
const userCard = document.getElementById('user-card');
if (userCard) {
  userCard.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      doLogin();
    }
  });
}
```

- [ ] **Step 2: Verify with Playwright**

```bash
npx --yes @playwright/cli goto http://127.0.0.1:8765/
npx --yes @playwright/cli click "getByRole('button', { name: 'Log in as Emanuel Nader' })"  # focus
# OR focus via:
npx --yes @playwright/cli eval "document.getElementById('user-card').focus()"
npx --yes @playwright/cli press Enter
# wait ~600ms for fade
npx --yes @playwright/cli --raw eval "JSON.stringify({loginHidden: document.getElementById('login-screen').classList.contains('hidden'), desktopShown: !document.getElementById('desktop').classList.contains('hidden')})"
```

Expected: `loginHidden: true`, `desktopShown: true`.

- [ ] **Step 3: Commit**

```bash
git add script.js
git commit -m "$(cat <<'EOF'
fix: allow Enter and Space to log in from user card

EOF
)"
```

---

### Task 3: Mobile-usable desktop icons and windows

**Files:**
- Modify: `style.css` (media query for narrow viewports)
- Modify: `script.js` (`openWindow` clamp + touch-friendly open)

**Interfaces:**
- Consumes: `.desktop-icon[data-window]`, `openWindow(id)`, `.xp-window`
- Produces:
  - At `max-width: 640px` (use `@media (max-width: 640px)`), icons laid out in a vertical column on the left (`position: static` or reset absolute offsets) so all 9 icons are on-screen
  - `openWindow` clamps width/height/left/top so windows fit within the desktop (viewport minus taskbar ~42px)
  - On coarse pointers / touch: single click/tap on `.desktop-icon[data-window]` opens the window (keep dblclick for mouse)

- [ ] **Step 1: Add narrow-viewport CSS**

Append to `style.css`:

```css
@media (max-width: 640px) {
  .desktop-icons {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: flex-start;
    gap: 8px;
    padding: 8px;
    height: 100%;
    overflow-y: auto;
  }

  .desktop-icon {
    position: static;
    width: 72px;
  }

  .xp-window {
    max-width: calc(100vw / 1.2 - 8px);
    max-height: calc(100vh / 1.2 - 50px);
  }
}
```

(Adjust if body zoom math needs tweaking — goal is every icon visible at 390×844 without horizontal overflow.)

- [ ] **Step 2: Clamp on open + touch open in `script.js`**

After showing a window in `openWindow`, clamp geometry:

```js
function clampWindowToDesktop(win) {
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
```

Call `clampWindowToDesktop(win)` from `openWindow` after unhiding.

Add touch / coarse-pointer single activation in `DOMContentLoaded`:

```js
const coarse = window.matchMedia('(pointer: coarse)').matches;
document.querySelectorAll('.desktop-icon[data-window]').forEach(icon => {
  if (!coarse) return;
  icon.addEventListener('click', (e) => {
    e.stopPropagation();
    openWindow(icon.dataset.window);
  });
});
```

(Keep existing dblclick attributes for mouse users.)

- [ ] **Step 3: Verify at 390×844**

```bash
npx --yes @playwright/cli open http://127.0.0.1:8765/
npx --yes @playwright/cli resize 390 844
# login
npx --yes @playwright/cli --raw eval "JSON.stringify([...document.querySelectorAll('.desktop-icon')].map(i=>{const r=i.getBoundingClientRect();return{label:i.querySelector('.icon-label').textContent,off:r.right>innerWidth||r.bottom>innerHeight-40||r.left<0}}))"
npx --yes @playwright/cli eval "openWindow('projects')"
npx --yes @playwright/cli --raw eval "(()=>{const r=document.getElementById('win-projects').getBoundingClientRect();return JSON.stringify({w:Math.round(r.width),h:Math.round(r.height),rightOk:r.right<=innerWidth+1,bottomOk:r.bottom<=innerHeight-40+2})})()"
```

Expected: all icons `off:false`; projects window fits viewport.

- [ ] **Step 4: Commit**

```bash
git add style.css script.js
git commit -m "$(cat <<'EOF'
fix: make XP desktop usable on narrow viewports

EOF
)"
```

---

### Task 4: Content polish + cleanup artifacts

**Files:**
- Modify: `index.html` (Experience statusbar text; add favicon link)
- Optional: add or reuse an icon under `assets/icons/` as favicon (e.g. `assets/icons/computer.png` or `face.jpg`)
- Delete untracked Playwright dumps from repo root: `*.png`, `*.yaml` exploration files, `.playwright-cli/` (do not delete `assets/`)

**Interfaces:**
- Produces: Experience statusbar text matches item count (`2 objects`); `<link rel="icon" href="assets/icons/computer.png">` (or chosen asset) in `<head>`

- [ ] **Step 1: Fix Experience statusbar**

Change `#win-experience .win-statusbar` from `4 objects` to `2 objects`.

- [ ] **Step 2: Add favicon**

In `<head>` after the stylesheet link:

```html
<link rel="icon" href="assets/icons/computer.png" type="image/png" />
```

- [ ] **Step 3: Delete exploration artifacts**

```bash
rm -rf .playwright-cli
rm -f login.png desktop.png all-windows.png win-about.png win-projects.png \
  start-menu.png start-menu-2.png shutdown.png shutdown-dialog.png \
  after-logoff.png controls-test.png resume-max.png mobile-*.png phone-390.png \
  *.yaml
# keep docs/ and source files
```

Ensure `.gitignore` ignores `.playwright-cli/` and accidental root screenshots if not already.

- [ ] **Step 4: Verify**

```bash
npx --yes @playwright/cli goto http://127.0.0.1:8765/
npx --yes @playwright/cli --raw eval "JSON.stringify({favicon: !!document.querySelector('link[rel~=icon]'), expStatus: document.querySelector('#win-experience .win-statusbar')?.textContent})"
```

- [ ] **Step 5: Commit**

```bash
git add index.html .gitignore
git commit -m "$(cat <<'EOF'
fix: correct Experience count and add favicon

EOF
)"
```

(Only stage deleted artifacts if they were previously tracked — they should be untracked; no need to commit deletions of untracked files.)
