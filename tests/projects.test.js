const test = require('node:test');
const assert = require('node:assert/strict');

const {
  PROJECTS,
  validateProjects,
  getFeaturedProjects,
  getMoreProjects,
  parseProjectRoute,
  projectRouteFor,
  canonicalProjectRoute,
  createProjectNavigator
} = require('../projects-data.js');

test('the shipped project records satisfy the public content contract', () => {
  assert.deepEqual(validateProjects(PROJECTS), []);
  assert.equal(PROJECTS.length, 9);
});

test('project validation reports missing required content and malformed evidence', () => {
  const errors = validateProjects([{
    id: 'broken-project',
    name: '',
    category: 'Demo',
    completed: 'April 2026',
    summary: 'Summary',
    role: 'Engineer',
    outcomeHeadline: 'Outcome',
    whatIBuilt: 'Build notes',
    impact: ['Only one'],
    engineeringDetails: [],
    stack: [],
    repositoryUrl: 'not-a-url',
    demoUrl: null,
    screenshots: [{ src: '', alt: '', caption: '' }],
    featuredRank: null
  }]);

  assert.ok(errors.includes('broken-project: name is required'));
  assert.ok(errors.includes('broken-project: impact must contain exactly 3 items'));
  assert.ok(errors.includes('broken-project: stack must contain at least 1 item'));
  assert.ok(errors.includes('broken-project: repositoryUrl must be an absolute http(s) URL or null'));
  assert.ok(errors.includes('broken-project: screenshot 1 requires src, alt, and caption'));
});

test('featured projects are ordered by rank and the remaining projects preserve recency order', () => {
  assert.deepEqual(
    getFeaturedProjects(PROJECTS).map(project => project.id),
    ['trackbench', 'shortstack', 'healthbook']
  );
  assert.deepEqual(
    getMoreProjects(PROJECTS).map(project => project.id),
    ['nutribase', 'quizki', 'autobook', 'lockedin', 'internship-job-board', 'shotclock']
  );
});

test('project routes parse valid IDs and gracefully reject unknown IDs', () => {
  assert.deepEqual(parseProjectRoute('#projects', PROJECTS), { view: 'list', projectId: null });
  assert.deepEqual(parseProjectRoute('#projects/shortstack', PROJECTS), { view: 'detail', projectId: 'shortstack' });
  assert.deepEqual(parseProjectRoute('#projects/not-real', PROJECTS), { view: 'list', projectId: null });
  assert.equal(projectRouteFor(), '#projects');
  assert.equal(projectRouteFor('shortstack'), '#projects/shortstack');
  assert.equal(canonicalProjectRoute('#projects/shortstack', PROJECTS), '#projects/shortstack');
  assert.equal(canonicalProjectRoute('#projects/not-real', PROJECTS), '#projects');
});

test('project navigator moves through list and detail history without accepting unknown IDs', () => {
  const navigator = createProjectNavigator(PROJECTS);

  assert.equal(navigator.current(), null);
  assert.equal(navigator.open('shortstack'), true);
  assert.equal(navigator.open('healthbook'), true);
  assert.equal(navigator.open('not-real'), false);
  assert.equal(navigator.current(), 'healthbook');
  assert.equal(navigator.navigate(-1), 'shortstack');
  assert.equal(navigator.navigate(-1), null);
  assert.equal(navigator.navigate(-1), null);
  assert.equal(navigator.navigate(1), 'shortstack');
  assert.equal(navigator.canGoForward(), true);
  assert.equal(navigator.canGoBack(), true);
});
