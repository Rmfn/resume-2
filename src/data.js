// All resume content lives here — edit this file to update the site.
const BASE = "https://rmfn.github.io/Resume/files/";

export const profile = {
  name: "Roya Bawazir",
  role: "Software Engineering Student",
  location: "Jeddah, Saudi Arabia",
  timezone: "Asia/Riyadh",
  bio: [
    "Software Engineering student with a strong interest in web development, app development, user interface design, and building user-friendly digital solutions.",
    "Through academic projects I've grown my interest in software design, problem-solving, and responsive development. Motivated to learn, improve, and explore new technologies.",
  ],
  education: {
    degree: "B.Sc. Software Engineering",
    school: "University of Jeddah",
    years: "2022 — present",
  },
  courses: [
    "Software Project Management",
    "Software Process Models",
    "Web Development",
    "Software Testing",
  ],
  interests: [
    "Frontend Development",
    "Backend Development",
    "Digital Products",
    "Digital Creativity",
  ],
  languages: [
    { name: "Arabic", level: "native" },
    { name: "English", level: "fluent" },
  ],
};

export const projects = [
  {
    id: "yourdesk",
    title: "YourDesk",
    kind: "mobile app",
    context: "Software Process Models",
    stack: ["Flutter", "Firebase", "Node.js", "Agile", "JIRA"],
    summary:
      "A mobile app that helps university students manage academic life — schedules, tasks and deadlines in one place.",
    points: [
      "Ran the project in Agile sprints: requirements analysis, use case and sequence diagrams, testing.",
      "Built core features: course management, task tracking, timetable visualisation.",
      "Real-time notifications with Flutter and Firebase.",
    ],
    link: { label: "read the report", href: BASE + "YOUR-DESK-REPORT.pdf" },
  },
  {
    id: "fennar",
    title: "Fennar Artisans",
    kind: "project plan",
    context: "Software Project Management",
    stack: ["Planning", "WBS", "Gantt", "Risk Analysis", "SRS"],
    summary:
      "A project plan for a digital marketplace where Saudi artisans showcase and sell handmade products.",
    points: [
      "Project charter, scope definition, risk analysis, budgeting and scheduling.",
      "System requirements, stakeholder analysis and business objectives.",
      "Aligned with Saudi Vision 2030 initiatives.",
    ],
    link: { label: "read the plan", href: BASE + "Fennar-Artisans.pdf" },
  },
];

export const certs = [
  {
    id: "agile",
    title: "Agile Project Management",
    kind: "completion",
    context: "Edraak",
    stack: ["Agile", "Scrum", "Backlogs", "Sprint Planning"],
    summary:
      "Certified course on Agile methodologies and the Scrum framework.",
    points: [
      "Managing product backlogs and sprint planning.",
      "Improving team collaboration and performance.",
    ],
  },
  {
    id: "debug-ai",
    title: "Debugging an AI Journey",
    kind: "attendance",
    context: "AI Club, University of Jeddah",
    stack: ["AI", "Debugging"],
    summary:
      "Session on debugging concepts in AI systems and common challenges in AI development.",
    points: [
      "Practical problem-solving and debugging techniques.",
      "Improving AI model performance.",
    ],
  },
];

export const skills = [
  { group: "code", items: ["HTML", "CSS", "Java"] },
  { group: "craft", items: ["Web Development", "App Development", "UI/UX Design"] },
  { group: "people", items: ["Teamwork", "Communication"] },
];

export const contact = [
  { key: "email", value: "RoyaBawazir@gmail.com", href: "mailto:RoyaBawazir@gmail.com" },
  { key: "phone", value: "+966 56 412 8515", href: "tel:+966564128515" },
  { key: "github", value: "github.com/Rmfn", href: "https://github.com/Rmfn" },
  { key: "based", value: "Jeddah, Saudi Arabia", href: null },
];
