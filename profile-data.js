(function initPortfolioProfile(root, factory) {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PortfolioProfile = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function createPortfolioProfile() {
  const PROFILE = {
    name: 'Emanuel Nader',
    headline: 'Software engineer building reliable systems, developer tools, and high-impact products.',
    biography: "I'm a Mathematics-Computer Science student at UC San Diego and a Technical Program Manager Intern on Tesla's Chassis Controls team. I build dependable systems that turn complex engineering work into clear, usable products.",
    school: 'UC San Diego — B.S. Mathematics-Computer Science (Expected June 2028)',
    status: 'Technical Program Manager Intern — Chassis Controls at Tesla',
    location: 'San Diego / Palo Alto, CA',
    email: 'EmanuelSNader@gmail.com',
    linkedinUrl: 'https://linkedin.com/in/emanuelnader',
    githubUrl: 'https://github.com/EmanuelNader',
    websiteUrl: 'https://emanuelnader.dev',
    websiteLabel: 'emanuelnader.dev',
    availability: 'Open to software engineering opportunities and collaborations.'
  };

  const PROOF_POINTS = [
    { value: '75%', label: 'less manual cross-checking', detail: 'for 7 Vehicle Software teams' },
    { value: '53%', label: 'fewer tracking identity switches', detail: 'from 890 to 415 across 10 driving scenes' },
    { value: '93%', label: 'lower redirect latency', detail: 'from 30 ms to under 2 ms on cache hits' }
  ];

  const EXPERIENCE = [
    {
      id: 'tesla', company: 'Tesla', role: 'Technical Program Manager Intern — Chassis Controls',
      dates: 'Jun 2026 – Present', location: 'Palo Alto, CA',
      bullets: [
        'Rebuilt and shipped an internal fleet-planning console in React/Vite/Tailwind on a Flask REST API and SQLite, consolidating 4 planner workflows into one interface and cutting manual cross-checking by 75% for 7 Vehicle Software teams.',
        'Designed a weighted release-scoring algorithm ranking 350+ vehicles 0 to 100 on 5 metrics with scarcity-protection caps, turning quarterly decommission review into a ranked list guiding 25-45 releases per quarter and recovering fleet carrying cost.',
        'Implemented config-driven eligibility validation on hardware-pedigree and firmware-branch predicates, flagging a significant share of the campaign population as unsupported so parts and technician hours went only to reworkable vehicles.',
        'Reconciled 3 internal systems into 4-stage source-of-truth tables tracking approval, parts, technician, and completion, eliminating ownership ambiguity across 2 concurrent multi-site retrofit campaigns.'
      ]
    },
    {
      id: 'hp-tech-ventures', company: 'HP Tech Ventures', role: 'Software Engineering Extern (Technical Analyst)',
      dates: 'Feb 2026 – Apr 2026', location: 'Remote',
      bullets: [
        'Cut due diligence cycle time by 40%, saving 15+ hours/week, by building Python scrapers that aggregated and cleaned 10,000+ market records into structured investment reports.',
        'Halved technical risk analysis time (4 hrs to under 2 hrs/report) by building an LLM-powered research tool using NLP pipelines to auto-generate structured competitive landscape briefs.'
      ]
    },
    {
      id: 'theta-tau', company: 'Theta Tau — Professional Engineering Fraternity', role: 'Software Project Lead',
      dates: 'May 2025 – Present', location: 'San Diego, CA',
      bullets: [
        'Led Agile delivery of Garnett, a production React/Node.js app for 70+ members, maintaining 99%+ uptime and supporting 500+ monthly transactions across dues, events, and merit tracking.',
        'Drove 100% on-time delivery across 2 full-stack projects (Nutribase, LockedIn) by mentoring 12 engineers through structured code reviews, sprint planning, and technical design sessions.'
      ]
    }
  ];

  const HOBBIES = [
    {
      id: 'motorcycle', name: 'Motorcycle riding', summary: 'Kawasaki Ninja ZX-6R',
      image: { src: 'assets/hobbies/motorcycle-personal.png', alt: 'Black sport motorcycle parked on wet pavement at night with a helmet resting on the seat', kind: 'personal photo', caption: 'Night ride' },
      photos: [
        { src: 'assets/hobbies/motorcycle-personal.png', alt: 'Black sport motorcycle parked on wet pavement at night with a helmet resting on the seat', kind: 'personal photo', caption: 'Night ride' }
      ],
      detail: 'I ride a 2006 Kawasaki Ninja ZX-6R and enjoy scenic evening rides.'
    },
    {
      id: 'bodybuilding', name: 'Bodybuilding', summary: 'My working set',
      image: { src: 'assets/hobbies/bench-press-working-set.png', alt: 'Loaded bench press bar with multiple black plates in a gym', kind: 'personal photo', caption: 'My working set' },
      photos: [
        { src: 'assets/hobbies/bench-press-working-set.png', alt: 'Loaded bench press bar with multiple black plates in a gym', kind: 'personal photo', caption: 'My working set' }
      ],
      detail: 'I lost over 100 pounds and now train five to six days a week.'
    },
    {
      id: 'cooking', name: 'Cooking', summary: 'Meals I made',
      image: { src: 'assets/hobbies/cooking-yogurt-bites.jpg', alt: 'Frozen yogurt fruit bites with granola', kind: 'personal photo', caption: 'Yogurt fruit bites' },
      photos: [
        { src: 'assets/hobbies/cooking-yogurt-bites.jpg', alt: 'Frozen yogurt fruit bites with granola', kind: 'personal photo', caption: 'Yogurt fruit bites' },
        { src: 'assets/hobbies/cooking-ribs.jpg', alt: 'Smoked ribs and beef on a foil tray', kind: 'personal photo', caption: 'Smoked ribs' },
        { src: 'assets/hobbies/cooking-katsu-curry.jpg', alt: 'Chicken katsu curry with rice, corn, and cucumber salad', kind: 'personal photo', caption: 'Katsu curry' },
        { src: 'assets/hobbies/cooking-cookie-ice-cream.jpg', alt: 'Cookies and cream ice cream on a cookie bar', kind: 'personal photo', caption: 'Cookie ice cream' }
      ],
      detail: 'Enjoy cooking and preparing meals'
    },
    {
      id: 'exploration', name: 'Exploration', summary: 'Coastlines and evening views',
      image: { src: 'assets/hobbies/exploration-personal.png', alt: 'Blue evening view of the ocean, beach, and distant coastline from above', kind: 'personal photo', caption: 'Evening coastline' },
      photos: [
        { src: 'assets/hobbies/exploration-personal.png', alt: 'Blue evening view of the ocean, beach, and distant coastline from above', kind: 'personal photo', caption: 'Evening coastline' },
        { src: 'assets/hobbies/exploration-night-stairs.png', alt: 'Dark outdoor stairs at night with a bright handrail leading into shadow', kind: 'personal photo', caption: 'Night stairs', position: '64% 50%', tone: 'night' },
        { src: 'assets/hobbies/exploration-golden-gate.png', alt: 'Golden Gate Bridge spanning across the bay under cloudy skies', kind: 'personal photo', caption: 'Golden Gate' },
        { src: 'assets/hobbies/exploration-night-gate.png', alt: 'Open chain-link gate at night with branches and dirt lit by a flashlight', kind: 'personal photo', caption: 'Night gate', position: '50% 50%', tone: 'night' }
      ],
      detail: 'I like exploring scenic places, taking night walks, and finding memorable sunset views.'
    },
    {
      id: 'manga-anime', name: 'Manga & anime', summary: 'One Piece, Tokyo Ghoul, and more',
      image: { src: 'assets/hobbies/one-piece.png', alt: 'One Piece volume 103 cover, Liberation Warrior', kind: 'supplied media', caption: 'One Piece' },
      photos: [
        { src: 'assets/hobbies/one-piece.png', alt: 'One Piece volume 103 cover, Liberation Warrior', kind: 'supplied media', caption: 'One Piece' },
        { src: 'assets/hobbies/tokyo-ghoul.png', alt: 'Tokyo Ghoul manga cover featuring Kaneki seated on a chair', kind: 'supplied media', caption: 'Tokyo Ghoul' }
      ],
      detail: 'I love tons of manga and anime like One Piece, Tokyo Ghoul and way more.'
    },
    {
      id: 'gaming', name: 'Gaming', summary: 'Persona 5, Minecraft, and Terraria',
      image: { src: 'assets/hobbies/terraria.png', alt: 'Terraria cover art with an armored character carrying a torch and pickaxe', kind: 'supplied media', caption: 'Terraria' },
      photos: [
        { src: 'assets/hobbies/terraria.png', alt: 'Terraria cover art with an armored character carrying a torch and pickaxe', kind: 'supplied media', caption: 'Terraria' },
        { src: 'assets/hobbies/minecraft.png', alt: 'Minecraft cover art with Steve, Alex, a creeper, and a pig', kind: 'supplied media', caption: 'Minecraft' },
        { src: 'assets/hobbies/persona-5-royal.jpg', alt: 'Persona 5 Royal cover featuring Joker and the Phantom Thieves', kind: 'supplied media', caption: 'Persona 5 Royal' }
      ],
      detail: 'I love open world survival games and story games like Persona 5, Minecraft, and Terraria.'
    }
  ];

  const RESUME_ASSETS = {
    pdfUrl: 'assets/resume/Emanuel_Nader_resume.pdf',
    previewUrl: 'assets/resume/Emanuel_Nader_resume-preview.png',
    fileName: 'Emanuel_Nader_resume.pdf',
    sizeLabel: '120 KB',
    updated: 'September 2026'
  };

  function validateProfileData() {
    const errors = [];
    ['name', 'headline', 'biography', 'school', 'status', 'location', 'email', 'linkedinUrl', 'githubUrl', 'websiteUrl'].forEach((key) => {
      if (!PROFILE[key]) errors.push(`PROFILE.${key} is required`);
    });
    if (PROOF_POINTS.length !== 3) errors.push('PROOF_POINTS must contain exactly 3 records');
    if (EXPERIENCE.length !== 3 || EXPERIENCE.reduce((sum, item) => sum + item.bullets.length, 0) !== 8) errors.push('EXPERIENCE must contain 3 positions and 8 bullets');
    if (HOBBIES.length !== 6 || HOBBIES.some((item) => !item.image?.src || !item.image?.alt || !item.image?.kind || !item.photos?.length)) errors.push('HOBBIES must contain 6 image records with photos');
    return errors;
  }

  return { PROFILE, PROOF_POINTS, EXPERIENCE, HOBBIES, RESUME_ASSETS, validateProfileData };
});
