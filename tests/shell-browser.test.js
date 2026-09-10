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

test('desktop taskbar is slightly taller while the Start asset stays native-sized', async () => {
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
      const startImage = document.querySelector('.start-img-btn img').getBoundingClientRect();
      return {
        taskbarHeight: taskbar.height,
        desktopBottom: desktop.bottom,
        taskbarTop: taskbar.top,
        startWidth: startImage.width,
        startHeight: startImage.height,
      };
    });

    assert.equal(geometry.taskbarHeight, 34);
    assert.equal(geometry.desktopBottom, geometry.taskbarTop);
    assert.equal(geometry.startWidth, 54);
    assert.equal(geometry.startHeight, 29);
  } finally {
    await browser.close();
  }
});
