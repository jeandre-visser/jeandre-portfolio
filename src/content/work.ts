/**
 * Copy for the /work page. The product renders on that page are drawn in code
 * from the real apps, so their sample data lives next to each render.
 */
import {
  siClaude,
  siConfluence,
  siCursor,
  siDatadog,
  type SimpleIcon,
} from "simple-icons";

export type ProcessStep = {
  title: string;
  headline: string;
  text: string;
};

export type Tool = { name: string; note?: string; icon?: SimpleIcon };

export type Build = {
  id: string;
  kicker: string;
  title: string;
  text: string;
  points: string[];
  href: string;
  linkLabel: string;
};

export const work = {
  documentTitle: "How I build | Jeandré Visser",
  roleLine: "Full-stack engineer, leaning front-end",
  title: "How I build.",
  statement:
    "I design and build product UI end to end. Research, design, code and review, in one loop.",
  intro:
    "I’m a full-stack engineer who leans front-end, with strong design and product skills and real back-end experience.",

  processKicker: "The loop",
  processHeading: "Every release feeds the next round of research.",
  processSteps: [
    {
      title: "Research",
      headline: "Learn how the work runs today.",
      text: "I read the docs and flow charts, look at the tools people use today, and talk to the people who know the work best.",
    },
    {
      title: "Observe",
      headline: "Watch real use, not guesses.",
      text: "I talk with users and watch session recordings to see where people slow down or get stuck.",
    },
    {
      title: "Design",
      headline: "Compare before choosing.",
      text: "I make flows, mocks and components, often a few variants side by side at desktop, tablet and phone sizes. Then I review them with the team.",
    },
    {
      title: "Build",
      headline: "Ship small, reviewed changes.",
      text: "I build the front end and help on the back end, using Cursor and Claude. I break large features into reviewable chunks and review every change before it ships.",
    },
    {
      title: "Release",
      headline: "Ship it, tell users, watch it land.",
      text: "I publish an in-app changelog so users know what is new and what is fixed. Then I review Datadog session recordings to see how people use the change. What I see feeds the next round of research.",
    },
  ] satisfies ProcessStep[],

  builtKicker: "Built",
  builtHeading: "Things I’ve designed and built.",
  builtIntro:
    "Web and mobile apps I’ve designed and built, from field crews to dietitians.",
  builds: [
    {
      id: "subtrack",
      kicker: "SubTrack · iOS and Android",
      title: "Daily tickets, built for the field.",
      text: "Crews log labour, equipment and materials on a daily ticket. Project managers review it and send it to the client. I design and build the front end.",
      points: [
        "Ticket list, detail and approval",
        "Bottom sheet for every create action",
        "Rate sheets for projects and templates",
        "Light and dark themes",
      ],
      href: "https://www.subtrackfield.com/",
      linkLabel: "Visit SubTrack",
    },
    {
      id: "subtrack-web",
      kicker: "SubTrack · Web app",
      title: "The office side of the same tickets.",
      text: "Project managers filter, review and approve daily tickets from the browser. The same data as the field app, laid out for a desk with a table, a project rail and a cost summary.",
      points: [
        "Ticket table with status and totals",
        "Projects and clients side rail",
        "Ticket detail with cost summary",
      ],
      href: "https://www.subtrackfield.com/",
      linkLabel: "Visit SubTrack",
    },
    {
      id: "subtrack-timesheets",
      kicker: "SubTrack · Timesheets",
      title: "Drag time where it belongs.",
      text: "A week view for crews and supervisors. Drag a time card to another day or crew member and the daily and weekly totals update. Built with dnd-kit. In progress and not yet released.",
      points: [
        "Week and month views",
        "Drag and drop time cards",
        "Live daily and weekly totals",
      ],
      href: "https://www.subtrackfield.com/",
      linkLabel: "Visit SubTrack",
    },
    {
      id: "nurishd-app",
      kicker: "Nurish’d · Web app",
      title: "Meals and dietitians near you.",
      text: "People enter an address, then find meals from local partners, book a dietitian or pick a program. I built most of the app, including the meals and dietitian pages.",
      points: [
        "Care, Nutrition and Meal Plans in one place",
        "Meal menus with nutrition facts",
        "Dietitian profiles and booking",
      ],
      href: "https://app.nurishd.store/",
      linkLabel: "Open the app",
    },
  ] satisfies Build[],

  toolsKicker: "Toolbox",
  toolsHeading: "Tools I use.",
  tools: [
    {
      name: "Confluence",
      note: "Research and flow charts",
      icon: siConfluence,
    },
    { name: "Datadog", note: "Session recordings", icon: siDatadog },
    { name: "Cursor", note: "Code", icon: siCursor },
    { name: "Claude Code", note: "Code and review", icon: siClaude },
    { name: "Claude Design", note: "Mocks and variants", icon: siClaude },
  ] satisfies Tool[],

  aiKicker: "With AI",
  aiHeading: "AI moves me faster. Judgment stays with me.",
  aiText:
    "I built a private design toolkit for Claude. Every run follows the same rules, and I review every change before it ships.",
  aiSteps: [
    "Learn the codebase’s components and design tokens",
    "Check accessibility and loading, empty, error and disabled states",
    "Mock a few variants at desktop, tablet, phone and native sizes",
    "Write a dated note on the decision and why",
    "Stop before commit. I review every change before it ships",
  ],

  closing: "Let’s connect.",
};
