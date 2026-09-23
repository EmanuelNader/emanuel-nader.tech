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
      summary: 'A multi-object tracker that diagnoses identity-switch failures on driving data.',
      role: 'Software Engineer',
      outcomeHeadline: '53% fewer identity switches — MOTA −1.351 to +0.666',
      whatIBuilt: 'I built a C++17 Constant-Velocity EKF pipeline with Hungarian and greedy association solvers on nuScenes driving data, then scored MOTA, mined ID-switch failures, and gated regressions in CI.',
      impact: [
        'Cut identity switches 53% (890 → 415) and improved MOTA from −1.351 to +0.666',
        'Accelerated association 29× at p99 (0.531ms → 0.018ms) with greedy matching',
        'Validated across a 24-cell ablation grid of 3,840 benchmark runs with CI gating'
      ],
      engineeringDetails: [
        'Ran a classical tracker on public nuScenes detections, then scored MOTA/AMOTA and clustered identity-switch failures in PostgreSQL.',
        'Exposed failures in a React bird’s-eye triage UI so a swapped ID is a one-click inspect instead of a frame-by-frame hunt.',
        'Blocked regressions with GoogleTest, golden-output checks, and CI gates after the 24-cell ablation sweep.'
      ],
      stack: ['C++17', 'Python', 'PostgreSQL', 'React', 'Docker', 'nuScenes'],
      repositoryUrl: 'https://github.com/EmanuelNader/trackbench',
      demoUrl: null,
      screenshots: [
        {
          src: 'assets/projects/trackbench/triage-bev.jpg',
          alt: "trackbench bird's-eye triage UI with blue ground-truth boxes and orange tracker IDs, a selected identity switch highlighted",
          caption: "Bird's-eye triage UI — blue = ground truth, orange = tracker IDs. Selected failure explains was track 3 → now track 2."
        },
        {
          src: 'assets/projects/trackbench/pareto-amota-latency.png',
          alt: 'Scatter plot of AMOTA versus p99 per-frame latency across a 24-cell trackbench ablation grid',
          caption: 'AMOTA-vs-latency Pareto chart — each dot is one config from the 24-cell ablation grid. Hover for details in the triage UI.'
        },
        {
          src: 'assets/projects/trackbench/architecture.jpg',
          alt: 'trackbench architecture flowchart from ingest and C++ tracker through eval, Postgres, the triage UI, and CI',
          caption: 'Architecture — ingest and the C++ tracker feed eval, failure mining, Postgres, the BEV triage UI, and CI.'
        }
      ]
    },
    {
      id: 'shortstack',
      name: 'ShortStack',
      category: 'Platform Architecture',
      completed: 'April 2026',
      summary: 'A production-style URL shortener with caching, load balancing, and monitoring.',
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
      repositoryUrl: 'https://github.com/marcusmdza/WeMadeIt_PE_Project',
      demoUrl: null,
      screenshots: [
        {
          src: 'assets/projects/shortstack/architecture.png',
          alt: 'ShortStack Docker Compose architecture with a client hitting Nginx on port 5000, three Flask apps, PostgreSQL, Redis, Prometheus, and Grafana',
          caption: 'Architecture — Nginx load-balances three Flask apps, with Postgres, Redis, Prometheus, and Grafana in Docker Compose.'
        }
      ]
    },
    {
      id: 'healthbook',
      name: 'HealthBook',
      category: 'AI + Automation',
      completed: 'March 2026',
      summary: 'An AI agent that finds doctors, books appointments, and places the phone calls.',
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
      screenshots: [
        {
          src: 'assets/projects/healthbook/login.jpg',
          alt: 'HealthBook login screen with phone number and password fields',
          caption: 'Login — phone number and password to get back into HealthBook.'
        },
        {
          src: 'assets/projects/healthbook/dashboard.jpg',
          alt: 'HealthBook dashboard search for a doctor type or symptoms with insurance profile on the side',
          caption: 'Dashboard — search by doctor type or symptoms, with insurance and location already on file.'
        },
        {
          src: 'assets/projects/healthbook/searching.jpg',
          alt: 'HealthBook searching for a back-pain doctor while the agent logs Zocdoc browser steps',
          caption: 'Finding a doctor — the agent searches Zocdoc for in-network back-pain appointments.'
        },
        {
          src: 'assets/projects/healthbook/results.jpg',
          alt: 'HealthBook results list with Hannah Hartin as the best match and live agent activity',
          caption: 'Results — ranked in-network providers with next available slots and agent activity.'
        },
        {
          src: 'assets/projects/healthbook/booked.jpg',
          alt: 'HealthBook confirmation that an appointment with Hannah Hartin is booked',
          caption: 'Appointment booked — confirmation with time, location, and in-network coverage.'
        }
      ]
    },
    {
      id: 'nutribase',
      name: 'Nutribase',
      category: 'IoT Tracking',
      completed: 'May 2025',
      summary: 'A smart-fridge scale that streams live inventory into a web dashboard.',
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
      screenshots: [
        {
          src: 'assets/projects/nutribase/enclosure-cad.png',
          alt: 'CAD drawing of the Nutribase load-cell enclosure with overall dimensions of 5 by 3 by 4 inches',
          caption: 'Enclosure CAD — housing for the scale tray and load-cell mount.'
        },
        {
          src: 'assets/projects/nutribase/lid-cad.jpg',
          alt: 'CAD drawing of the Nutribase enclosure lid with interlocking notches and dimensions',
          caption: 'Lid CAD — interlocking cover plate for the tracker enclosure.'
        },
        {
          src: 'assets/projects/nutribase/wiring-diagram.png',
          alt: 'Wiring diagram of an HX711 load-cell amplifier, ESP32, and LCD display',
          caption: 'Wiring — ESP32, HX711 load-cell amp, and LCD for live weight readout.'
        }
      ]
    },
    {
      id: 'quizki',
      name: 'Quizki',
      category: 'Fullstack Application',
      completed: '2025',
      summary: 'A gamified flashcard app with Smiski gacha and an AI study tutor.',
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
      screenshots: [
        {
          src: 'assets/projects/quizki/home.jpg',
          alt: 'Quizki home with a Smiski collection row and Spanish and Chinese flashcard decks',
          caption: 'Home — Smiski collection and flashcard decks in one place.'
        },
        {
          src: 'assets/projects/quizki/edit-flashcards.jpg',
          alt: 'Quizki Edit Flashcards screen for creating or choosing groups like Spanish, Chinese, History, and Math',
          caption: 'Edit flashcards — create a group or open an existing deck.'
        },
        {
          src: 'assets/projects/quizki/gacha.jpg',
          alt: 'Quizki Gacha screen with a Spin button and 1510 points',
          caption: 'Gacha — spend study points to spin for Smiski figures.'
        },
        {
          src: 'assets/projects/quizki/collection.jpg',
          alt: 'Quizki Smiski collection grid with unlocked and locked figures across series',
          caption: 'Collection — unlocked Smiski figures grouped by series.'
        },
        {
          src: 'assets/projects/quizki/professor-smiski.jpg',
          alt: 'Professor Smiski chat answering what is 2 plus 2',
          caption: 'Professor Smiski — Gemini study chat with a character tutor.'
        }
      ]
    },
    {
      id: 'autobook',
      name: 'AutoBook',
      category: 'Automation Engine',
      completed: '2025',
      summary: 'A browser bot that books UCSD library rooms as soon as they open.',
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
      screenshots: []
    },
    {
      id: 'lockedin',
      name: 'LockedIn',
      category: 'IoT + Fullstack',
      completed: '2025',
      summary: 'An IoT platform that connects physical devices to real-time web workflows.',
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
      screenshots: []
    },
    {
      id: 'internship-job-board',
      name: 'Internship Job Board Bot',
      category: 'Scraping + Alerts',
      completed: '2025',
      summary: 'A Discord bot that scrapes internships and routes them to the right channels.',
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
      repositoryUrl: 'https://github.com/EmanuelNader/discord-internship-job-board-bot',
      demoUrl: null,
      screenshots: [
        {
          src: 'assets/projects/internship-job-board/mascot.png',
          alt: 'Cute blue robot mascot in a graduation cap with a Discord logo, holding a wrench beside job-board and code icons',
          caption: 'Bot mascot — Discord internship, co-op, and fellowship alerts.'
        }
      ]
    },
    {
      id: 'shotclock',
      name: 'ShotClock',
      category: 'Mobile App · In Progress',
      completed: 'In progress',
      summary: 'An iOS app for collecting moments, people, and stories from a night out.',
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
      screenshots: [
        {
          src: 'assets/projects/shotclock/app-icon.png',
          alt: 'ShotClock app icon on a purple gradient with the tagline remember every night out',
          caption: 'ShotClock — remember every night out.'
        }
      ]
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
    });

    return errors;
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
    getProjectById,
    parseProjectRoute,
    projectRouteFor,
    canonicalProjectRoute,
    createProjectNavigator
  };
});
