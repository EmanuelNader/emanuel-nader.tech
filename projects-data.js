(function initPortfolioProjects(root, factory) {
  const api = factory();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  root.PortfolioProjects = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createPortfolioProjects() {
  const PROJECTS = [
    {
      id: 'trackbench',
      name: 'trackbench',
      category: 'Computer Vision + Systems',
      completed: 'August 2026',
      summary: 'A deterministic multi-object tracking and evaluation pipeline for measuring, diagnosing, and preventing identity-switch regressions.',
      role: 'Software Engineer',
      outcomeHeadline: '53% fewer identity switches — 890 to 415',
      whatIBuilt: 'I built a C++17 Constant-Velocity EKF tracker with Hungarian/greedy association, a Python ingest pipeline, Postgres failure triage, a React bird’s-eye interface, and regression-blocking CI.',
      impact: [
        'Cut identity switches by 53% (890 to 415) and lifted MOTA from −1.351 to +0.666',
        'Made association 29× faster at p99 (0.531ms to 0.018ms)',
        'Validated across a 24-cell ablation grid of 3,840 benchmark runs with CI gating'
      ],
      engineeringDetails: [
        'Tuned Mahalanobis gating, a soft lateral-velocity cost, and track-birth thresholds against measured tracking results.',
        'Normalized public detections into ego-frame JSONL and clustered identity-switch failures in PostgreSQL.',
        'Added GoogleTest and golden-output checks in CI to block tracking regressions.'
      ],
      stack: ['C++17', 'Python', 'PostgreSQL', 'React', 'Docker', 'nuScenes'],
      repositoryUrl: 'https://github.com/EmanuelNader/trackbench',
      demoUrl: null,
      screenshots: [],
      featuredRank: 1
    },
    {
      id: 'shortstack',
      name: 'ShortStack',
      category: 'Platform Architecture',
      completed: 'April 2026',
      summary: 'A production-style URL shortener with Redis caching, load-balanced Nginx, Dockerized services, and full observability.',
      role: 'Full Stack Engineer',
      outcomeHeadline: '93% faster redirects — 30ms to under 2ms',
      whatIBuilt: 'I built a production-style URL shortener with Redis caching, Nginx load balancing, container orchestration, automated tests, and monitoring from request to deployment.',
      impact: [
        '93% faster redirects on cache hits',
        'Validated under 500 concurrent users',
        '84% coverage across 25 automated tests'
      ],
      engineeringDetails: [
        'Cached hot redirects in Redis and distributed traffic across three Nginx-backed application replicas.',
        'Orchestrated seven Docker containers with health checks and restart policies.',
        'Added GitHub Actions CI plus Prometheus and Grafana monitoring.'
      ],
      stack: ['Flask', 'PostgreSQL', 'Redis', 'Nginx', 'Docker', 'Prometheus'],
      repositoryUrl: null,
      demoUrl: null,
      screenshots: [],
      featuredRank: 2
    },
    {
      id: 'healthbook',
      name: 'HealthBook',
      category: 'AI + Automation',
      completed: 'March 2026',
      summary: 'An AI agent that finds and books medical appointments, places calls, and remembers relevant health history between sessions.',
      role: 'Full Stack Engineer',
      outcomeHeadline: '90% faster appointment booking — 30 minutes to under 3',
      whatIBuilt: 'I connected a browser automation agent, an AI calling workflow, and semantic memory so patients could move from search to appointment without repeatedly entering the same context.',
      impact: [
        'Reduced booking time from 30 minutes to under 3',
        'Retrieved the 3 most relevant memory chunks per task',
        'Connected browser navigation with real AI phone calls'
      ],
      engineeringDetails: [
        'Used Browser Use SDK to automate provider search and scheduling flows.',
        'Placed calls with the OpenAI Realtime API and Twilio.',
        'Stored semantic memory in Supabase pgvector and retrieved context with cosine similarity.'
      ],
      stack: ['Next.js', 'FastAPI', 'Browser Use SDK', 'OpenAI', 'Supabase', 'pgvector'],
      repositoryUrl: 'https://github.com/EmanuelNader/healthbook',
      demoUrl: null,
      screenshots: [],
      featuredRank: 3
    },
    {
      id: 'nutribase',
      name: 'Nutribase',
      category: 'IoT Tracking',
      completed: 'May 2025',
      summary: 'A smart-fridge tracker that streams live ESP32 weight data into a MERN application with role-based access and analytics.',
      role: 'Software Project Lead',
      outcomeHeadline: '60% fewer tracking errors and unauthorized-access events',
      whatIBuilt: 'I led delivery of the web application and connected custom ESP32 firmware to a Node.js backend for live inventory, access control, and waste analytics.',
      impact: [
        'Reduced tracking errors and unauthorized access by 60%',
        'Streamed more than 10 sensor payloads per second',
        'Combined live inventory with role-based analytics'
      ],
      engineeringDetails: [
        'Programmed ESP32 firmware in C++ for continuous weight sampling.',
        'Sent device data through low-latency MQTT and HTTP pipelines.',
        'Built the dashboard with MongoDB, Express, React, and Node.js.'
      ],
      stack: ['MongoDB', 'Express.js', 'React', 'Node.js', 'C++'],
      repositoryUrl: 'https://github.com/EmanuelNader/Nutribase',
      demoUrl: null,
      screenshots: [],
      featuredRank: null
    },
    {
      id: 'quizki',
      name: 'Quizki',
      category: 'Fullstack Application',
      completed: '2025',
      summary: 'A gamified study platform with progress dashboards, secure login, and personalized AI study prompts.',
      role: 'Software Engineer',
      outcomeHeadline: 'Personalized study sessions with progress built in',
      whatIBuilt: 'I built a study workflow that combines progress dashboards, Auth0 authentication, and Gemini-generated prompts to make sessions quicker to start and easier to continue.',
      impact: [
        'Gamified study progress in one dashboard',
        'Protected accounts with Auth0 authentication',
        'Generated personalized prompts with Gemini'
      ],
      engineeringDetails: [
        'Built the client in React and the application API in Node.js.',
        'Stored study and progress data in MongoDB.',
        'Integrated Google Gemini API for personalized prompts.'
      ],
      stack: ['React', 'Node.js', 'Google Gemini API', 'Auth0', 'MongoDB'],
      repositoryUrl: null,
      demoUrl: null,
      screenshots: [],
      featuredRank: null
    },
    {
      id: 'autobook',
      name: 'AutoBook',
      category: 'Automation Engine',
      completed: '2025',
      summary: 'A browser automation tool that books high-demand UCSD library rooms as soon as reservations open.',
      role: 'Software Engineer',
      outcomeHeadline: 'Automated a repetitive five-step reservation flow',
      whatIBuilt: 'I automated the UCSD room-booking flow with Python, Selenium, and WebDriver so reservations could be attempted as soon as availability opened.',
      impact: [
        'Replaced a five-step manual booking flow',
        'Triggered booking as availability opened',
        'Automated browser navigation and submission'
      ],
      engineeringDetails: [
        'Used Selenium and WebDriver for deterministic browser control.',
        'Coordinated timing and page-state checks around reservation availability.',
        'Integrated the workflow with Python and supporting web APIs.'
      ],
      stack: ['Python', 'Selenium', 'WebDriver', 'REST APIs'],
      repositoryUrl: null,
      demoUrl: null,
      screenshots: [],
      featuredRank: null
    },
    {
      id: 'lockedin',
      name: 'LockedIn',
      category: 'IoT + Fullstack',
      completed: '2025',
      summary: 'An IoT and web platform for real-time device monitoring and automated workflow triggers.',
      role: 'Software Project Lead',
      outcomeHeadline: 'Connected physical devices to real-time web workflows',
      whatIBuilt: 'I led a full-stack implementation that connected ESP32 devices to a React and Node.js application for monitoring and automated responses.',
      impact: [
        'Connected ESP32 devices to a web application',
        'Delivered real-time monitoring',
        'Triggered automated workflows from device events'
      ],
      engineeringDetails: [
        'Built the client with React and the API with Node.js and Express.',
        'Stored application state and device data in MongoDB.',
        'Designed the event flow between embedded devices and the application.'
      ],
      stack: ['React', 'Node.js', 'Express', 'MongoDB', 'ESP32'],
      repositoryUrl: null,
      demoUrl: null,
      screenshots: [],
      featuredRank: null
    },
    {
      id: 'internship-job-board',
      name: 'Internship Job Board Bot',
      category: 'Scraping + Alerts',
      completed: '2025',
      summary: 'A Discord bot that collects early-career opportunities, removes duplicates, and routes new listings to relevant channels.',
      role: 'Software Engineer',
      outcomeHeadline: 'Turned scattered postings into organized Discord alerts',
      whatIBuilt: 'I built a Discord automation pipeline that scrapes internship, co-op, and fellowship postings, deduplicates them, and publishes each listing to the appropriate role-family channel.',
      impact: [
        'Collected internships, co-ops, and fellowships',
        'Removed duplicate listings before publishing',
        'Routed alerts with optional title-based pings'
      ],
      engineeringDetails: [
        'Built the bot and channel workflow with Discord.js and Node.js.',
        'Normalized scraped listings before duplicate detection.',
        'Mapped job titles to role-family channels and opt-in ping roles.'
      ],
      stack: ['Discord.js', 'Node.js', 'Web Scraping', 'Automation'],
      repositoryUrl: null,
      demoUrl: null,
      screenshots: [],
      featuredRank: null
    },
    {
      id: 'shotclock',
      name: 'ShotClock',
      category: 'Mobile App · In Progress',
      completed: 'In progress',
      summary: 'An iOS-first social memory app for collecting moments, people, and stories from a night out in one place.',
      role: 'Mobile Engineer',
      outcomeHeadline: 'An iOS-first home for shared memories from a night out',
      whatIBuilt: 'I am building the MVP in Expo and React Native with Supabase as the backend for shared moments, people, and stories.',
      impact: [
        'Keeps moments, people, and stories together',
        'Designed as an iOS-first mobile experience',
        'Built with Expo, React Native, and Supabase'
      ],
      engineeringDetails: [
        'Uses Expo and React Native for the iOS-first client.',
        'Uses Supabase for application data and backend services.',
        'The project is currently in MVP development.'
      ],
      stack: ['Expo', 'React Native', 'Supabase', 'iOS'],
      repositoryUrl: null,
      demoUrl: null,
      screenshots: [],
      featuredRank: null
    }
  ];

  const REQUIRED_STRING_FIELDS = [
    'id', 'name', 'category', 'completed', 'summary', 'role',
    'outcomeHeadline', 'whatIBuilt'
  ];

  function isAbsoluteHttpUrl(value) {
    if (value === null) return true;
    if (typeof value !== 'string') return false;

    try {
      const url = new URL(value);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_error) {
      return false;
    }
  }

  function validateProjects(projects) {
    const errors = [];
    const ids = new Set();
    const ranks = new Set();

    projects.forEach((project, index) => {
      const label = project.id || `project-${index + 1}`;

      REQUIRED_STRING_FIELDS.forEach(field => {
        if (typeof project[field] !== 'string' || project[field].trim() === '') {
          errors.push(`${label}: ${field} is required`);
        }
      });

      if (ids.has(project.id)) errors.push(`${label}: id must be unique`);
      ids.add(project.id);

      if (!Array.isArray(project.impact) || project.impact.length !== 3) {
        errors.push(`${label}: impact must contain exactly 3 items`);
      }
      if (!Array.isArray(project.engineeringDetails)) {
        errors.push(`${label}: engineeringDetails must be an array`);
      }
      if (!Array.isArray(project.stack) || project.stack.length < 1) {
        errors.push(`${label}: stack must contain at least 1 item`);
      }

      ['repositoryUrl', 'demoUrl'].forEach(field => {
        if (!isAbsoluteHttpUrl(project[field])) {
          errors.push(`${label}: ${field} must be an absolute http(s) URL or null`);
        }
      });

      if (!Array.isArray(project.screenshots)) {
        errors.push(`${label}: screenshots must be an array`);
      } else {
        project.screenshots.forEach((screenshot, screenshotIndex) => {
          if (!screenshot.src || !screenshot.alt || !screenshot.caption) {
            errors.push(`${label}: screenshot ${screenshotIndex + 1} requires src, alt, and caption`);
          }
        });
      }

      if (project.featuredRank !== null) {
        if (!Number.isInteger(project.featuredRank) || project.featuredRank < 1 || project.featuredRank > 3) {
          errors.push(`${label}: featuredRank must be 1, 2, 3, or null`);
        } else if (ranks.has(project.featuredRank)) {
          errors.push(`${label}: featuredRank must be unique`);
        }
        ranks.add(project.featuredRank);
      }
    });

    return errors;
  }

  function getFeaturedProjects(projects) {
    return projects
      .filter(project => project.featuredRank !== null)
      .sort((a, b) => a.featuredRank - b.featuredRank);
  }

  function getMoreProjects(projects) {
    return projects.filter(project => project.featuredRank === null);
  }

  function getProjectById(id, projects) {
    return projects.find(project => project.id === id) || null;
  }

  function parseProjectRoute(hash, projects) {
    const normalized = String(hash || '').replace(/^#/, '').replace(/^\//, '');
    const parts = normalized.split('/').filter(Boolean);

    if (parts[0] !== 'projects' || parts.length < 2) {
      return { view: 'list', projectId: null };
    }

    const projectId = decodeURIComponent(parts[1]);
    return getProjectById(projectId, projects)
      ? { view: 'detail', projectId }
      : { view: 'list', projectId: null };
  }

  function projectRouteFor(projectId) {
    return projectId ? `#projects/${encodeURIComponent(projectId)}` : '#projects';
  }

  function canonicalProjectRoute(hash, projects) {
    const route = parseProjectRoute(hash, projects);
    return projectRouteFor(route.projectId);
  }

  function createProjectNavigator(projects) {
    const validIds = new Set(projects.map(project => project.id));
    let history = [null];
    let index = 0;

    return {
      current() {
        return history[index];
      },
      open(projectId) {
        if (!validIds.has(projectId)) return false;
        if (history[index] === projectId) return true;
        history = history.slice(0, index + 1);
        history.push(projectId);
        index += 1;
        return true;
      },
      close() {
        if (history[index] === null) return null;
        history = history.slice(0, index + 1);
        history.push(null);
        index += 1;
        return null;
      },
      navigate(direction) {
        const nextIndex = Math.min(history.length - 1, Math.max(0, index + Math.sign(direction)));
        index = nextIndex;
        return history[index];
      },
      canGoBack() {
        return index > 0;
      },
      canGoForward() {
        return index < history.length - 1;
      }
    };
  }

  return {
    PROJECTS,
    validateProjects,
    getFeaturedProjects,
    getMoreProjects,
    getProjectById,
    parseProjectRoute,
    projectRouteFor,
    canonicalProjectRoute,
    createProjectNavigator
  };
});
