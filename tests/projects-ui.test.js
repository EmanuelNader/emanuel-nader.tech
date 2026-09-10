const test = require('node:test');
const assert = require('node:assert/strict');

const { PROJECTS } = require('../projects-data.js');
const {
  renderProjectListMarkup,
  renderProjectDetailMarkup,
  renderProjectSidebarMarkup
} = require('../projects-ui.js');

test('project list renders one folder list without featured and more headings', () => {
  const markup = renderProjectListMarkup(PROJECTS, 'trackbench');

  assert.doesNotMatch(markup, /Featured Projects/);
  assert.doesNotMatch(markup, /More Projects/);
  assert.match(markup, /<button[^>]+data-project-id="trackbench"[^>]+aria-pressed="true"/);
  assert.match(markup, /<button[^>]+data-project-id="shotclock"[^>]+aria-pressed="false"/);
  assert.match(markup, /project-entry-summary">A multi-object tracker that diagnoses identity-switch failures on driving data\./);
  assert.doesNotMatch(markup, /project-entry-summary">53% fewer identity switches/);
  assert.equal((markup.match(/<button class="project-entry/g) || []).length, 9);
});

test('project detail omits unavailable evidence and shows a concise three-item impact summary', () => {
  const autoBook = PROJECTS.find(project => project.id === 'autobook');
  const markup = renderProjectDetailMarkup(autoBook);

  assert.doesNotMatch(markup, /View GitHub/);
  assert.doesNotMatch(markup, /Live demo/);
  assert.doesNotMatch(markup, /project-gallery/);
  assert.equal((markup.match(/class="project-impact-item"/g) || []).length, 3);
  assert.doesNotMatch(markup, /<details/);
  assert.match(markup, /<section class="engineering-details"/);
  assert.match(markup, /Engineering details/);
});

test('project detail renders verified links and shows every screenshot in the thumbnail strip', () => {
  const project = {
    ...PROJECTS[0],
    repositoryUrl: 'https://github.com/example/shortstack',
    demoUrl: 'https://example.com/shortstack',
    screenshots: [
      { src: 'one.png', alt: 'Dashboard overview', caption: 'Dashboard' },
      { src: 'two.png', alt: 'Analytics screen', caption: 'Analytics' },
      { src: 'three.png', alt: 'Monitoring screen', caption: 'Monitoring' },
      { src: 'four.png', alt: 'Ignored screen', caption: 'Ignored' }
    ]
  };

  const markup = renderProjectDetailMarkup(project);

  assert.match(markup, /href="https:\/\/github\.com\/example\/shortstack"/);
  assert.match(markup, /href="https:\/\/example\.com\/shortstack"/);
  assert.match(markup, /class="project-hero-image"[^>]+src="one\.png"[^>]+alt="Dashboard overview"/);
  assert.match(markup, /data-screenshot-src="one\.png"/);
  assert.equal((markup.match(/<button class="project-thumbnail/g) || []).length, 4);
  assert.match(markup, /four\.png/);
});

test('project sidebar switches from selection details to project tasks without fake actions', () => {
  const shortStack = PROJECTS.find(project => project.id === 'shortstack');
  const listMarkup = renderProjectSidebarMarkup(shortStack, 'list');
  const detailMarkup = renderProjectSidebarMarkup(shortStack, 'detail');

  assert.match(listMarkup, /Project Details/);
  assert.match(listMarkup, /93% faster redirects/);
  assert.match(listMarkup, /View GitHub/);
  assert.match(detailMarkup, /Back to My Projects/);
  assert.match(detailMarkup, /Full Stack Engineer/);
  assert.match(detailMarkup, /View GitHub/);
  assert.doesNotMatch(detailMarkup, /Open live demo/);
});
