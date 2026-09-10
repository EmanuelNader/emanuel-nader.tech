(function initProfileUi(root, factory) {
  const api = factory(root.PortfolioProfile);
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PortfolioProfileUi = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createProfileUi(data) {
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));

  function renderAbout() {
    if (!data) return;
    const { PROFILE } = data;
    const target = document.getElementById('about-content');
    if (!target) return;
    const biography = String(PROFILE.biography || '')
      .split(/\n\n+/)
      .filter(Boolean)
      .map((paragraph) => `<p class="about-biography">${escapeHtml(paragraph)}</p>`)
      .join('');
    target.innerHTML = `
      <div class="about-header">
        <img class="about-avatar" src="assets/icons/face.jpg" alt="Portrait of Emanuel Nader">
        <div class="about-intro"><h1>${escapeHtml(PROFILE.name)}</h1><p class="about-subtitle">${escapeHtml(PROFILE.headline)}</p></div>
      </div>
      ${biography}
      <div class="welcome-actions" aria-label="Portfolio shortcuts">
        <button type="button" class="welcome-primary" onclick="dismissWelcomeAndOpen('projects')">Explore Projects</button>
        <button type="button" onclick="dismissWelcomeAndOpen('resume')">View Résumé</button>
        <button type="button" onclick="dismissWelcomeAndOpen('contact')">Contact</button>
      </div>
      <fieldset class="xp-group about-details"><legend>Current information</legend>
        <dl><div><dt>Location</dt><dd>${escapeHtml(PROFILE.location)}</dd></div><div><dt>Education</dt><dd>${escapeHtml(PROFILE.school)}</dd></div><div><dt>Role</dt><dd>${escapeHtml(PROFILE.status)}</dd></div></dl>
      </fieldset>`;
  }

  function renderExperience() {
    if (!data) return;
    const target = document.getElementById('experience-content');
    if (!target) return;
    target.innerHTML = `<div class="experience-tiles" role="list">${data.EXPERIENCE.map((item) => `
      <article class="experience-tile" role="listitem" tabindex="0">
        <img src="assets/icons/bag.png" alt="" aria-hidden="true">
        <div><div class="experience-heading"><div><h2>${escapeHtml(item.role)}</h2><strong>${escapeHtml(item.company)}</strong></div><div class="experience-when"><span>${escapeHtml(item.dates)}</span><span>${escapeHtml(item.location)}</span></div></div>
        <ul>${item.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}</ul></div>
      </article>`).join('')}</div>`;
  }

  function renderContact() {
    if (!data) return;
    const p = data.PROFILE;
    const target = document.getElementById('contact-content');
    if (!target) return;
    const rows = [
      ['Email', `mailto:${p.email}`, p.email], ['LinkedIn', p.linkedinUrl, 'linkedin.com/in/emanuelnader'],
      ['GitHub', p.githubUrl, 'github.com/EmanuelNader'], ['Website', p.websiteUrl, p.websiteLabel]
    ];
    target.innerHTML = `<fieldset class="xp-group contact-sheet"><legend>Internet</legend>
      ${rows.map(([label, href, text]) => `<div class="contact-property"><span>${escapeHtml(label)}:</span><a href="${escapeHtml(href)}"${href.startsWith('http') ? ' target="_blank" rel="noopener noreferrer"' : ''}>${escapeHtml(text)}</a></div>`).join('')}
      </fieldset><p class="contact-availability">${escapeHtml(p.availability)}</p><p class="contact-live" id="contact-live" aria-live="polite"></p>`;
  }

  function hobbyButton(item, selectedId) {
    const image = item.photos?.[0] || item.image;
    return `<button class="hobby-thumb${item.id === selectedId ? ' selected' : ''}" type="button" data-hobby-id="${escapeHtml(item.id)}" aria-pressed="${item.id === selectedId}">
      <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}"><span>${escapeHtml(item.name)}</span><small>${escapeHtml(item.summary)}</small></button>`;
  }

  function renderHobbies(state = {}) {
    if (!data) return;
    const target = document.getElementById('hobbies-content');
    if (!target) return;
    const selected = data.HOBBIES.find((item) => item.id === state.selectedId) || data.HOBBIES[0];
    const active = data.HOBBIES.find((item) => item.id === state.activeId);
    const photos = active?.photos?.length ? active.photos : active ? [active.image] : [];
    const photoIndex = photos.length ? Math.min(Math.max(0, state.photoIndex || 0), photos.length - 1) : 0;
    const activePhoto = photos[photoIndex];
    const imageNote = activePhoto?.kind === 'personal photo' ? 'Personal photo.' : activePhoto?.kind === 'supplied media' ? 'Supplied media.' : 'Illustrative image - not a personal photograph.';
    const photoCaption = activePhoto?.caption ? `<span class="hobby-photo-caption">${escapeHtml(activePhoto.caption)}</span>` : '';
    const photoControls = photos.length > 1 ? `<button class="hobby-photo-arrow hobby-photo-prev" type="button" data-hobby-photo-direction="-1" aria-label="Previous photo"></button><button class="hobby-photo-arrow hobby-photo-next" type="button" data-hobby-photo-direction="1" aria-label="Next photo"></button>` : '';
    const imageClass = `hobby-photo-image${activePhoto?.tone ? ` tone-${escapeHtml(activePhoto.tone)}` : ''}`;
    const imageStyle = activePhoto?.position ? ` style="object-position:${escapeHtml(activePhoto.position)}"` : '';
    target.innerHTML = active ? `<div class="hobby-filmstrip">
      <figure><div class="hobby-photo-frame"><img class="${imageClass}" src="${escapeHtml(activePhoto.src)}" alt="${escapeHtml(activePhoto.alt)}"${imageStyle}>${photoControls}</div><figcaption><strong>${escapeHtml(active.name)}</strong>${photoCaption}<span>${escapeHtml(active.detail)}</span><small>${escapeHtml(imageNote)}</small></figcaption></figure>
      <div class="filmstrip-thumbs">${data.HOBBIES.map((item) => hobbyButton(item, active.id)).join('')}</div></div>` : `<div class="hobbies-grid">${data.HOBBIES.map((item) => hobbyButton(item, selected.id)).join('')}</div>`;
  }

  return { renderAbout, renderExperience, renderContact, renderHobbies };
});
