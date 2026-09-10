const test = require('node:test');
const assert = require('node:assert/strict');
const { chromium } = require('playwright');

const BASE_URL = 'http://127.0.0.1:4173/';

async function openPortfolio(page) {
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('desktop').classList.remove('hidden');
  });
}

test('desktop gallery keeps a 3x2 grid and double-click opens Filmstrip', async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1024 } });
  try {
    await openPortfolio(page);
    await page.locator('.desktop-icon[data-window="hobbies"]').dblclick();
    const gridColumns = await page.locator('.hobbies-grid').evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length);
    assert.equal(gridColumns, 3);
    assert.equal(await page.locator('#hobbies-previous').isVisible(), false);
    assert.equal(await page.locator('#hobbies-next').isVisible(), false);
    assert.match(await page.locator('.hobby-thumb').first().locator('img').getAttribute('src'), /motorcycle-personal\.png$/);
    const thumbBox = await page.locator('.hobby-thumb').first().locator('img').boundingBox();
    assert.ok(Math.abs(thumbBox.width - thumbBox.height) <= 1, 'gallery thumbnails should be square');

    await page.locator('.hobby-thumb').nth(1).dblclick();
    await page.locator('.hobby-filmstrip').waitFor();
    assert.equal(await page.locator('#hobbies-status').textContent(), '1 of 1 pictures • Bodybuilding • Personal photo');
    assert.equal(await page.locator('.hobby-filmstrip figcaption small').textContent(), 'Personal photo.');
    assert.equal(await page.locator('.hobby-photo-caption').textContent(), 'My working set');
    assert.match(await page.locator('.hobby-photo-frame img').getAttribute('src'), /bench-press-working-set\.png$/);
    const heroBox = await page.locator('.hobby-photo-frame').boundingBox();
    assert.ok(Math.abs(heroBox.width - heroBox.height) <= 1, 'filmstrip photo frame should be square');
  } finally {
    await browser.close();
  }
});

test('filmstrip photo arrows cycle multiple photos inside one hobby', async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1024 } });
  try {
    await openPortfolio(page);
    await page.locator('.desktop-icon[data-window="hobbies"]').dblclick();
    await page.locator('.hobby-thumb').nth(4).dblclick();
    await page.locator('.hobby-filmstrip').waitFor();

    assert.match(await page.locator('.hobby-photo-frame img').getAttribute('src'), /one-piece\.png$/);
    assert.equal(await page.locator('#hobbies-status').textContent(), '1 of 2 pictures • Manga & anime • Supplied media');
    assert.equal(await page.locator('.hobby-photo-arrow').count(), 2);

    await page.locator('.hobby-photo-next').click();
    assert.match(await page.locator('.hobby-photo-frame img').getAttribute('src'), /tokyo-ghoul\.png$/);
    assert.equal(await page.locator('.hobby-photo-caption').textContent(), 'Tokyo Ghoul');

    await page.locator('.filmstrip-thumbs .hobby-thumb').nth(5).click();
    assert.match(await page.locator('.hobby-photo-frame img').getAttribute('src'), /terraria\.png$/);
    await page.locator('.hobby-photo-next').click();
    assert.match(await page.locator('.hobby-photo-frame img').getAttribute('src'), /one-piece\.png$/);
  } finally {
    await browser.close();
  }
});

test('exploration album includes the added night and bridge photos', async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1024 } });
  try {
    await openPortfolio(page);
    await page.locator('.desktop-icon[data-window="hobbies"]').dblclick();
    await page.locator('.hobby-thumb').nth(3).dblclick();
    await page.locator('.hobby-filmstrip').waitFor();

    assert.equal(await page.locator('#hobbies-status').textContent(), '1 of 4 pictures • Exploration • Personal photo');
    assert.match(await page.locator('.hobby-photo-frame img').getAttribute('src'), /exploration-personal\.png$/);

    await page.locator('.hobby-photo-next').click();
    assert.match(await page.locator('.hobby-photo-frame img').getAttribute('src'), /exploration-night-stairs\.png$/);
    assert.equal(await page.locator('.hobby-photo-caption').textContent(), 'Night stairs');

    await page.locator('.hobby-photo-next').click();
    assert.match(await page.locator('.hobby-photo-frame img').getAttribute('src'), /exploration-golden-gate\.png$/);
    assert.equal(await page.locator('.hobby-photo-caption').textContent(), 'Golden Gate');

    await page.locator('.hobby-photo-next').click();
    assert.match(await page.locator('.hobby-photo-frame img').getAttribute('src'), /exploration-night-gate\.png$/);
    assert.equal(await page.locator('.hobby-photo-caption').textContent(), 'Night gate');
  } finally {
    await browser.close();
  }
});

test('desktop gallery remains 3x2 at a compact laptop viewport', async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 1097, height: 915 } });
  try {
    await openPortfolio(page);
    await page.locator('.desktop-icon[data-window="hobbies"]').dblclick();
    const gridColumns = await page.locator('.hobbies-grid').evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length);
    assert.equal(gridColumns, 3);
    assert.equal(await page.locator('#hobbies-previous').isVisible(), false);
    assert.equal(await page.locator('#hobbies-next').isVisible(), false);
  } finally {
    await browser.close();
  }
});

test('mobile gallery is compact and Filmstrip navigation remains visible', async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  try {
    await openPortfolio(page);
    await page.locator('.desktop-icon[data-window="hobbies"]').click();
    const gridColumns = await page.locator('.hobbies-grid').evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length);
    assert.equal(gridColumns, 2);

    await page.locator('.hobby-thumb').first().click();
    await page.locator('.hobby-filmstrip').waitFor();
    assert.equal(await page.locator('#hobbies-status').textContent(), '1 of 1 pictures • Motorcycle riding • Personal photo');
    for (const id of ['hobbies-back', 'hobbies-previous', 'hobbies-next', 'hobbies-up']) {
      const control = page.locator(`#${id}`);
      assert.equal(await control.isVisible(), true, `${id} should remain visible`);
      const box = await control.boundingBox();
      assert.ok(box.height >= 44, `${id} should be at least 44px tall`);
    }
    assert.equal(await page.evaluate(() => document.body.scrollWidth <= innerWidth), true);
  } finally {
    await browser.close();
  }
});
