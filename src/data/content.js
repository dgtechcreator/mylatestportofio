/**
 * Default site content. The admin panel saves an edited copy on the server; whatever is
 * missing there falls back to these values. Images left empty ('') use the bundled defaults.
 */
export const defaultContent = {
  profile: {
    name: 'Vivek Pal',
    initials: 'VP',
    email: 'dgtechcreator@gmail.com',
    phone: '+91 78605 14180',
    location: 'Marol, Andheri (E), Mumbai',
    linkedin: '#',
    github: '#',
  },

  nav: {
    links: [
      { id: 'about', label: 'About' },
      { id: 'skills', label: 'Skills' },
      { id: 'projects', label: 'Projects' },
      { id: 'experience', label: 'Experience' },
      { id: 'contact', label: 'Contact' },
    ],
    hireLabel: 'Hire Me',
  },

  hero: {
    eyebrow: 'Full Stack .NET Developer',
    greeting: "Hi, I'm",
    name: 'Vivek Pal',
    ghost: 'VIVEK',
    paragraph:
      'I build clean, scalable and human-centered digital experiences using ASP.NET, C#, SQL Server and modern frontend technologies.',
    primaryLabel: 'Hire Me',
    secondaryLabel: 'View Projects →',
    note: '3+ yrs shipping real products',
    photo: '',
    stickers: [
      { label: '.NET', badge: 'N', color: '#512bd4', yellow: false },
      { label: 'C#', badge: 'C', color: '#2fa84f', yellow: false },
      { label: 'SQL', badge: 'S', color: '#d6362f', yellow: false },
      { label: 'API', badge: '', color: '#512bd4', yellow: true },
    ],
  },

  marquee: [
    'FULL STACK DEVELOPER',
    'C# / .NET',
    'UI/UX DESIGNER',
    'SQL SERVER',
    'FIGMA DESIGNER',
    'REST API',
  ],

  about: {
    label: '01 — About me',
    headingPre: 'I build software that solves',
    headingEm: 'real problems.',
    paragraphs: [
      "I'm a B.Sc. IT student and Full-Stack Developer at JMM InfoTech. I enjoy turning messy business workflows — shipping, billing, admissions, orders — into clean systems people actually like using.",
      'Alongside my job I run DG-TECH Creator with a small team, taking on freelance web projects from design to deployment.',
    ],
    chips: ['Full Stack .NET Developer', 'ASP.NET Core', 'C#', 'SQL Server', 'JavaScript', 'Flutter', 'AI / modern tech'],
    photo: '',
    caption: 'vivek · mumbai ✌',
    stats: [
      { value: '3+', label: 'Years' },
      { value: '9+', label: 'Projects' },
      { value: '3', label: 'Team' },
    ],
  },

  skills: {
    label: '02 — Skills',
    title: 'The technology wall',
    categories: [
      { title: 'BACKEND', items: ['C#', '.NET', 'ASP.NET CORE', 'WEB API'] },
      { title: 'DATABASE', items: ['SQL SERVER', 'MYSQL', 'ENTITY FRAMEWORK'] },
      { title: 'FRONTEND', items: ['HTML', 'CSS', 'JAVASCRIPT', 'BOOTSTRAP'] },
      { title: 'TOOLS & MORE', items: ['GIT / GITHUB', 'FIGMA', 'FLUTTER', 'AI TOOLS'] },
    ],
  },

  /**
   * `tint` is the preview-block background, `note` the little handwritten sticker,
   * `rotate` the card tilt in degrees and `image` (optional) replaces the abbreviation block.
   */
  projects: {
    label: '03 — Portfolio',
    title: 'Selected Projects',
    linkLabel: 'View Project →',
    items: [
      {
        tag: 'APP',
        abbr: 'GC',
        glyph: '</>',
        title: 'GoCamle',
        desc: 'Camera renting application — browse gear, book and manage rentals.',
        stack: 'ASP.NET Core • C# • SQL Server • JavaScript',
        rotate: -0.6,
        tint: '',
        note: '',
        href: '#',
        image: '',
      },
      {
        tag: 'HEALTHCARE',
        abbr: 'UM',
        glyph: '[ ]',
        title: 'UMBA',
        desc: 'Healthcare management application.',
        stack: 'ASP.NET Core • C# • SQL Server',
        rotate: 0.5,
        tint: 'var(--accent2)',
        note: 'care + data',
        href: '#',
        image: '',
      },
      {
        tag: 'PORTAL',
        abbr: 'WC',
        glyph: '#',
        title: 'The Write Connect',
        desc: 'Student admission management portal.',
        stack: 'ASP.NET • C# • SQL Server',
        rotate: 0.4,
        tint: '#d6d4fb',
        note: '',
        href: '#',
        image: '',
      },
      {
        tag: 'LOGISTICS',
        abbr: 'ISA',
        glyph: '=>',
        title: 'ISA Logistics',
        desc: 'Shipping & billing system for a logistics business.',
        stack: 'ASP.NET • C# • SQL Server • JavaScript',
        rotate: -0.5,
        tint: 'var(--card)',
        note: 'ship it →',
        href: '#',
        image: '',
      },
      {
        tag: 'PORTAL',
        abbr: 'GF',
        glyph: '/',
        title: 'Guilt-Free',
        desc: 'Complaint & feedback management portal.',
        stack: 'ASP.NET • C# • SQL Server',
        rotate: -0.4,
        tint: '',
        note: '',
        href: '#',
        image: '',
      },
      {
        tag: 'ENTERPRISE',
        abbr: 'OMS',
        glyph: '{ }',
        title: 'Order Management System',
        desc: 'Orders, tracking and admin workflows in one place.',
        stack: 'ASP.NET • C# • SQL Server • API',
        rotate: 0.6,
        tint: 'var(--accent2)',
        note: '',
        href: '#',
        image: '',
      },
    ],
    more: {
      show: true,
      range: '07 — 09',
      badge: '+ MORE',
      title: 'VMS · Ved Universal Shipping · HEM',
      desc: 'Viraj Profiles management system, shipping management and a manufacturing admin panel.',
      button: 'Ask for details →',
    },
  },

  experience: {
    label: '04 — Experience',
    title: 'The journey so far',
    items: [
      {
        year: '2022—23',
        title: 'HSC · Eden High School & Jr. College',
        desc: 'Finished with 79.83% and got hooked on programming.',
      },
      {
        year: '2024',
        title: 'B.Sc. IT · Ramniranjan Jhunjhunwala College',
        desc: 'Studying Information Technology — GPA 8.50 so far.',
      },
      {
        year: '2024 → now',
        title: 'Full-Stack Developer · JMM InfoTech',
        desc: 'Started as an intern, now building enterprise web applications, APIs and database-driven systems — plus query & technical support.',
      },
      {
        year: 'Now',
        title: 'DG-TECH Creator',
        desc: 'Freelance web development, UI/UX and SEO with my own small team.',
      },
    ],
  },

  contact: {
    label: '05 — Contact',
    line1: "Let's build",
    line2: 'something',
    highlight: 'great.',
    button: "Let's talk →",
  },

  footer: {
    tagline: 'Full Stack .NET Developer',
    icons: ['</>', 'C#', '.NET', '{ }'],
  },
};

export const trailSymbols = ['</>', '{ }', '*', '+', '#', '=>', '/', '01'];

/** Combines saved content with the defaults so newly added fields never come back undefined. */
export function mergeContent(saved) {
  if (!saved || typeof saved !== 'object') return defaultContent;
  const out = {};
  for (const key of Object.keys(defaultContent)) {
    const base = defaultContent[key];
    const value = saved[key];
    out[key] =
      value && typeof value === 'object' && !Array.isArray(value) && !Array.isArray(base)
        ? { ...base, ...value }
        : (value ?? base);
  }
  return out;
}
