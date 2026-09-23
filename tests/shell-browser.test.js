const test = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const BASE_URL = 'http://127.0.0.1:4173/';

test('login opens About even when the previous tab hash pointed at a project', async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1024 } });
  try {
    await page.goto(`${BASE_URL}#projects/trackbench`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      localStorage.setItem('emanuel-portfolio.welcome-seen.v1', '1');
      window.doLogin();
    });
    await page.locator('#win-about:not(.hidden)').waitFor();

    assert.equal(await page.locator('#win-about').evaluate((el) => el.classList.contains('hidden')), false);
    assert.equal(await page.locator('#win-projects').evaluate((el) => el.classList.contains('hidden')), true);
    assert.equal(new URL(page.url()).hash, '#about');
  } finally {
    await browser.close();
  }
});

test('desktop Start button fills the taskbar height and extends to authentic Luna width', async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1024 } });
  try {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      document.getElementById('login-screen').classList.add('hidden');
      document.getElementById('desktop').classList.remove('hidden');
    });

    const geometry = await page.evaluate(() => {
      const taskbar = document.getElementById('taskbar').getBoundingClientRect();
      const desktop = document.getElementById('desktop').getBoundingClientRect();
      const startButton = document.querySelector('.start-btn').getBoundingClientRect();
      const startImage = document.querySelector('.start-btn img');
      return {
        taskbarHeight: taskbar.height,
        desktopBottom: desktop.bottom,
        taskbarTop: taskbar.top,
        startLeft: startButton.left,
        startButtonHeight: startButton.height,
        startWidth: startButton.width,
        startImageSrc: startImage?.getAttribute('src') || '',
      };
    });

    assert.equal(geometry.taskbarHeight, 40);
    assert.equal(geometry.desktopBottom, geometry.taskbarTop);
    assert.equal(geometry.startLeft, 0);
    assert.equal(geometry.startButtonHeight, 40);
    assert.match(geometry.startImageSrc, /start\.png/);
    assert.ok(Math.abs(geometry.startWidth - (40 * 97) / 30) < 2);
  } finally {
    await browser.close();
  }
});

test('opening About after a maximized Resume does not shrink Resume to 100px', async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1024 } });
  try {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => {
      localStorage.setItem('emanuel-portfolio.welcome-seen.v1', '1');
      window.doLogin();
    });
    await page.locator('#win-about:not(.hidden)').waitFor();

    const sizes = await page.evaluate(() => {
      window.openWindow('resume');
      window.openWindow('about');
      window.openWindow('resume');
      const resume = document.getElementById('win-resume').getBoundingClientRect();
      const desktop = document.getElementById('desktop').getBoundingClientRect();
      return {
        resumeWidth: resume.width,
        resumeHeight: resume.height,
        desktopWidth: desktop.width,
        desktopHeight: desktop.height,
        maximized: document.getElementById('win-resume').dataset.maximized,
      };
    });

    assert.equal(sizes.maximized, 'true');
    assert.ok(sizes.resumeWidth >= sizes.desktopWidth - 4, `resume width ${sizes.resumeWidth} vs desktop ${sizes.desktopWidth}`);
    assert.ok(sizes.resumeHeight >= sizes.desktopHeight - 4, `resume height ${sizes.resumeHeight} vs desktop ${sizes.desktopHeight}`);
  } finally {
    await browser.close();
  }
});
