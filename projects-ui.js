(function initProjectsUi(root, factory) {
  const api = factory();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  root.PortfolioProjectsUi = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createProjectsUi() {
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function projectEntryMarkup(project, selectedId) {
    const selected = project.id === selectedId;
    const stack = project.stack.slice(0, 5).map(escapeHtml).join(' • ');

    return `
      <button class="project-entry${selected ? ' selected' : ''}"
        type="button"
        data-project-id="${escapeHtml(project.id)}"
        aria-pressed="${selected}"
        aria-label="${escapeHtml(project.name)}, ${escapeHtml(project.category)}. Open project details.">
        <img class="project-entry-icon" src="assets/icons/folder.png" alt="" aria-hidden="true" />
        <span class="project-entry-copy">
          <strong class="project-entry-name">${escapeHtml(project.name)}</strong>
          <span class="project-entry-summary">${escapeHtml(project.summary)}</span>
          <span class="project-entry-meta">${escapeHtml(stack)}</span>
        </span>
        <span class="project-entry-open" aria-hidden="true">Open</span>
      </button>`;
  }

  function renderProjectListMarkup(projects, selectedId) {
    return `
      <div class="projects-explorer-list" aria-label="Project folders">
        <div class="project-list">
          ${projects.map(project => projectEntryMarkup(project, selectedId)).join('')}
        </div>
      </div>`;
  }

  function projectActionsMarkup(project) {
    const actions = [];

    if (project.repositoryUrl) {
      actions.push(`<a class="project-action" href="${escapeHtml(project.repositoryUrl)}" target="_blank" rel="noopener noreferrer">View GitHub</a>`);
    }
    if (project.demoUrl) {
      actions.push(`<a class="project-action project-action-primary" href="${escapeHtml(project.demoUrl)}" target="_blank" rel="noopener noreferrer">Live demo</a>`);
    }

    return actions.length ? `<div class="project-detail-actions">${actions.join('')}</div>` : '';
  }

  function projectGalleryMarkup(project) {
    const screenshots = project.screenshots.slice(0, 8);
    if (!screenshots.length) return '';

    const hero = screenshots[0];
    const thumbnailMarkup = screenshots.length > 1
      ? `<div class="project-thumbnails" aria-label="Project screenshots">
          ${screenshots.map((screenshot, index) => `
            <button class="project-thumbnail${index === 0 ? ' selected' : ''}" type="button"
              data-screenshot-src="${escapeHtml(screenshot.src)}"
              data-screenshot-alt="${escapeHtml(screenshot.alt)}"
              data-screenshot-caption="${escapeHtml(screenshot.caption)}"
              aria-pressed="${index === 0}"
              aria-label="Show ${escapeHtml(screenshot.caption)}">
              <img src="${escapeHtml(screenshot.src)}" alt="" aria-hidden="true" />
            </button>`).join('')}
        </div>`
      : '';

    return `
      <figure class="project-gallery">
        <img class="project-hero-image" src="${escapeHtml(hero.src)}" alt="${escapeHtml(hero.alt)}" />
        <figcaption class="project-gallery-caption">${escapeHtml(hero.caption)}</figcaption>
        ${thumbnailMarkup}
      </figure>`;
  }

  function renderProjectDetailMarkup(project) {
    return `
      <article class="project-case-study" data-active-project="${escapeHtml(project.id)}">
        <header class="project-case-header">
          <div class="project-case-title">
            <img class="project-case-folder" src="assets/icons/folder.png" alt="" aria-hidden="true" />
            <div>
              <h1>${escapeHtml(project.name)}</h1>
              <p>${escapeHtml(project.summary)}</p>
            </div>
          </div>
          ${projectActionsMarkup(project)}
        </header>
        <p class="project-outcome">${escapeHtml(project.outcomeHeadline)}</p>
        ${projectGalleryMarkup(project)}
        <div class="project-case-summary">
          <section aria-labelledby="what-i-built-heading">
            <h2 id="what-i-built-heading">What I built</h2>
            <p>${escapeHtml(project.whatIBuilt)}</p>
          </section>
          <section aria-labelledby="project-impact-heading">
            <h2 id="project-impact-heading">Impact</h2>
            <ul>
              ${project.impact.map(item => `<li class="project-impact-item">${escapeHtml(item)}</li>`).join('')}
            </ul>
          </section>
          <section class="engineering-details" aria-labelledby="engineering-details-heading">
            <h2 id="engineering-details-heading">Engineering details</h2>
            <ul>${project.engineeringDetails.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
            <p class="engineering-stack"><strong>Stack:</strong> ${project.stack.map(escapeHtml).join(' • ')}</p>
          </section>
        </div>
      </article>`;
  }

  function sidebarLinkMarkup(project, field, label) {
    if (!project[field]) return '';
    return `<a class="sidebar-link" href="${escapeHtml(project[field])}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
  }

  function renderProjectSidebarMarkup(project, view) {
    if (!project) {
      return `
        <div class="sidebar-section">
          <div class="sidebar-title">Project Details</div>
          <p class="project-sidebar-empty">Select a project to see its role, outcome, and stack.</p>
        </div>`;
    }

    if (view === 'detail') {
      return `
        <div class="sidebar-section">
          <div class="sidebar-title">Project Tasks</div>
          <button class="sidebar-link sidebar-button" type="button" data-project-action="back">Back to My Projects</button>
          ${sidebarLinkMarkup(project, 'repositoryUrl', 'View GitHub')}
          ${sidebarLinkMarkup(project, 'demoUrl', 'Open live demo')}
        </div>
        <div class="sidebar-section">
          <div class="sidebar-title">Project Details</div>
          <dl class="project-sidebar-facts">
            <div><dt>Role</dt><dd>${escapeHtml(project.role)}</dd></div>
            <div><dt>Completed</dt><dd>${escapeHtml(project.completed)}</dd></div>
            <div><dt>Tech stack</dt><dd>${project.stack.slice(0, 4).map(escapeHtml).join(' • ')}</dd></div>
          </dl>
        </div>`;
    }

    return `
      <div class="sidebar-section">
        <div class="sidebar-title">Project Details</div>
        <div class="project-sidebar-preview">
          <img src="assets/icons/folder.png" alt="" aria-hidden="true" />
          <strong>${escapeHtml(project.name)}</strong>
          <p class="project-sidebar-outcome">${escapeHtml(project.outcomeHeadline)}</p>
          <p>${escapeHtml(project.summary)}</p>
          <span>${escapeHtml(project.role)}</span>
        </div>
      </div>
      <div class="sidebar-section">
        <div class="sidebar-title">Actions</div>
        <button class="sidebar-link sidebar-button" type="button" data-project-action="open">Open case study</button>
        ${sidebarLinkMarkup(project, 'repositoryUrl', 'View GitHub')}
        ${sidebarLinkMarkup(project, 'demoUrl', 'Open live demo')}
      </div>`;
  }

  return {
    escapeHtml,
    renderProjectListMarkup,
    renderProjectDetailMarkup,
    renderProjectSidebarMarkup
  };
});
