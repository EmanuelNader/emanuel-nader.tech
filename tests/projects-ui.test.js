const test = require('node:test');
const assert = require('node:assert/strict');

const { PROJECTS } = require('../projects-data.js');
const {
  renderProjectListMarkup,
  renderProjectDetailMarkup,
  renderProjectSidebarMarkup
} = require('../projects-ui.js');

test('project list renders semantic featured and archive buttons', () => {
  const markup = renderProjectListMarkup(PROJECTS, 'trackbench');

  assert.match(markup, /<h2[^>]*>Featured Projects<\/h2>/);
  assert.match(markup, /<h2[^>]*>More Projects<\/h2>/);
  assert.match(markup, /<button[^>]+data-project-id="trackbench"[^>]+aria-pressed="true"/);
  assert.match(markup, /<button[^>]+data-project-id="shotclock"[^>]+aria-pressed="false"/);
  assert.equal((markup.match(/<button class="project-entry/g) || []).length, 9);
});

test('project detail omits unavailable evidence and shows a concise three-item impact summary', () => {
  const shortStack = PROJECTS.find(project => project.id === 'shortstack');
  const markup = renderProjectDetailMarkup(shortStack);

  assert.doesNotMatch(markup, /View GitHub/);
  assert.doesNotMatch(markup, /Live demo/);
  assert.doesNotMatch(markup, /project-gallery/);
  assert.equal((markup.match(/class="project-impact-item"/g) || []).length, 3);
  assert.match(markup, /<details class="engineering-details">/);
  assert.match(markup, /Engineering details/);
});

test('project detail renders verified links and limits a screenshot gallery to one hero plus two thumbnails', () => {
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
  assert.equal((markup.match(/<button class="project-thumbnail"/g) || []).length, 2);
  assert.doesNotMatch(markup, /four\.png/);
});

test('project sidebar switches from selection details to project tasks without fake actions', () => {
  const shortStack = PROJECTS.find(project => project.id === 'shortstack');
  const listMarkup = renderProjectSidebarMarkup(shortStack, 'list');
  const detailMarkup = renderProjectSidebarMarkup(shortStack, 'detail');

  assert.match(listMarkup, /Project Details/);
  assert.match(listMarkup, /93% faster redirects/);
  assert.doesNotMatch(listMarkup, /View GitHub/);
  assert.match(detailMarkup, /Back to My Projects/);
  assert.match(detailMarkup, /Full Stack Engineer/);
  assert.doesNotMatch(detailMarkup, /Open live demo/);
});
