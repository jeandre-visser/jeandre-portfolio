import { useEffect, useRef, useState, type RefObject } from "react";
import { NurishdSite, SubTrackField } from "./ShippedMockups";
import { SubTrackDemo } from "./SubTrackDemo";
import { useScrollToHash } from "./useScrollToHash";
import {
  BrandMark,
  CONTACT_EMAIL,
  Reveal,
  SiteFooter,
  SiteNav,
  SocialLinks,
  SubTrackMark,
  type CraftIcon,
} from "./SiteChrome";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
} from "@phosphor-icons/react";
import {
  motion,
  MotionConfig,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import {
  siArm,
  siCapacitor,
  siChakraui,
  siClaude,
  siCss,
  siCursor,
  siDocker,
  siExpo,
  siFastapi,
  siGithub,
  siMongodb,
  siNextdotjs,
  siNodedotjs,
  siPoetry,
  siPostgresql,
  siPython,
  siReact,
  siRedux,
  siTanstack,
  siTerraform,
  siShadcnui,
  siTailwindcss,
  siTypescript,
} from "simple-icons";

const experiences = [
  {
    period: "Nov 2025-present",
    role: "Co-Founder & CPO / Product Engineer",
    company: "SubTrack",
    logo: "subtrack",
    href: "https://www.subtrackfield.com/",
    detail:
      "Own product direction, product design, and frontend delivery for field-first construction SaaS.",
    featured: true,
  },
  {
    period: "2023-2025",
    role: "Intermediate Full Stack Developer",
    company: "Nurish’d",
    logo: "/assets/nurishd-logo.png",
    href: "https://www.nurishd.store/",
    detail:
      "Built food-as-medicine product experiences across TypeScript, Next.js, Python, and FastAPI.",
  },
  {
    period: "2022-2023",
    role: "Jr. Full Stack Developer",
    company: "nutrimeals",
    logo: "/assets/nutrimeals-logo.png",
    href: "https://nutrimeals.ca/",
    detail:
      "Shipped customer-facing features and internal workflows for a growing prepared-meal platform.",
  },
  {
    period: "2020-2022",
    role: "Junior Project Manager",
    company: "TerraLogix Solutions",
    logo: "/assets/terralogix.png",
    href: "https://www.terralogix.ca/",
    detail:
      "Worked close to field operations, schedules, and the realities that now shape how I build software.",
  },
  {
    period: "2017-2019",
    role: "Junior Operator",
    company: "Cenovus Energy",
    logo: "/assets/cenovus.png",
    href: "https://www.cenovus.com/",
    detail:
      "Built an early understanding of oil and gas operations, field teams, and safety-led work.",
  },
];

const siChatgpt: CraftIcon = {
  title: "ChatGPT",
  slug: "chatgpt",
  path: "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z",
};

const siAws: CraftIcon = {
  title: "AWS",
  slug: "amazonaws",
  path: "M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167zM21.698 16.207c-2.626 1.94-6.442 2.969-9.722 2.969-4.598 0-8.74-1.7-11.87-4.526-.247-.223-.024-.527.272-.351 3.384 1.963 7.559 3.153 11.877 3.153 2.914 0 6.114-.607 9.06-1.852.439-.2.814.287.383.607zM22.792 14.961c-.336-.43-2.22-.207-3.074-.103-.255.032-.295-.192-.063-.36 1.5-1.053 3.967-.75 4.254-.399.287.36-.08 2.826-1.485 4.007-.215.184-.423.088-.327-.151.32-.79 1.03-2.57.695-2.994z",
};

const siLambda: CraftIcon = {
  title: "AWS Lambda",
  slug: "awslambda",
  path: "M4.9855 0c-.2941.0031-.5335.2466-.534.5482L4.446 5.456c0 .1451.06.2835.159.3891a.5322.5322 0 0 0 .3806.1562h3.4282l8.197 17.6805a.5365.5365 0 0 0 .4885.3181h5.811c.2969 0 .5426-.2448.5426-.5482V18.544c0-.3035-.2392-.5482-.5425-.5482h-2.0138L12.7394.3153C12.647.124 12.4564 0 12.2452 0h-7.254Zm.5397 1.0907h6.3678l8.16 17.6804a.5365.5365 0 0 0 .4885.3181h1.8178v3.8173H17.437L9.2402 5.226a.536.536 0 0 0-.4885-.318H5.5223Zm2.0137 8.2366c-.2098.0011-.3937.1193-.4857.3096L.6002 23.2133a.5506.5506 0 0 0 .0313.5282.5334.5334 0 0 0 .4544.25h6.169a.5468.5468 0 0 0 .497-.3096l3.38-7.166a.5405.5405 0 0 0-.0029-.4686L8.036 9.637a.5468.5468 0 0 0-.4942-.3096Zm.0057 1.8036 2.488 5.1522-3.1214 6.6206H1.9465Z",
};

const siAmplify: CraftIcon = {
  title: "Amplify",
  slug: "awsamplify",
  path: "M5.223 17.905h6.76l1.731 3.047H0l4.815-8.344 2.018-3.494 1.733 3.002zm2.52-10.371L9.408 4.65l9.415 16.301h-3.334zm2.59-4.486h3.33L24 20.952h-3.334z",
};

const craft: {
  title: string;
  note: string;
  brands: CraftIcon[];
}[] = [
  {
    title: "Product",
    note: "I decide what to build and design the screens a crew uses on site.",
    brands: [],
  },
  {
    title: "Design",
    note: "Chakra UI, Tailwind, and shadcn.",
    brands: [siChakraui, siTailwindcss, siShadcnui],
  },
  {
    title: "Frontend",
    note: "React, Next.js, TypeScript, CSS, Redux, Redux Toolkit, and TanStack Query.",
    brands: [siReact, siNextdotjs, siTypescript, siCss, siRedux, siTanstack],
  },
  {
    title: "Mobile",
    note: "Capacitor, Expo, and React Native.",
    brands: [siCapacitor, siExpo, siReact],
  },
  {
    title: "Backend",
    note: "Python, Poetry, FastAPI, Node, Postgres, and MongoDB.",
    brands: [
      siPython,
      siPoetry,
      siFastapi,
      siNodedotjs,
      siPostgresql,
      siMongodb,
    ],
  },
  {
    title: "Delivery",
    note: "GitHub, AWS, Amplify, Terraform, Docker, and Lambda on ARM64. I deploy to production with these.",
    brands: [
      siGithub,
      siAws,
      siAmplify,
      siTerraform,
      siDocker,
      siLambda,
      siArm,
    ],
  },
  {
    title: "AI Agents",
    note: "Cursor, ChatGPT, and Claude, with my own rules, workflows, and guidelines for coding with AI agents.",
    brands: [siCursor, siChatgpt, siClaude],
  },
];

function useIsNarrow(query = "(max-width: 720px)") {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

const PORTRAIT_HANDOFF = 320;

function PortraitStack({
  reduceMotion,
  frameRef,
}: {
  reduceMotion: boolean | null;
  frameRef: RefObject<HTMLElement | null>;
}) {
  const isNarrow = useIsNarrow();
  const spring = {
    type: "spring" as const,
    stiffness: 58,
    damping: 18,
    mass: 0.95,
  };
  const viewport = { once: true, amount: 0.45, margin: "0px 0px -8% 0px" };

  return (
    <div className="portrait-stack">
      {[4, 3, 2, 1].map((layer) => (
        <motion.span
          className="portrait-disc"
          aria-hidden="true"
          data-layer={layer}
          key={layer}
          initial={
            reduceMotion
              ? false
              : isNarrow
                ? { x: 0, y: 180 + layer * 40, opacity: 0, scale: 0.98 }
                : { x: 200 + layer * 48, y: 0, opacity: 0, scale: 0.98 }
          }
          whileInView={
            isNarrow
              ? { x: 0, y: layer * 28, opacity: 1, scale: 1 }
              : { x: layer * 28, y: 0, opacity: 1, scale: 1 }
          }
          viewport={viewport}
          transition={{
            ...spring,
            delay: reduceMotion ? 0 : layer * 0.09,
          }}
        />
      ))}
      <motion.figure
        ref={frameRef}
        className="portrait-frame"
        initial={
          reduceMotion
            ? false
            : isNarrow
              ? { x: 0, y: 180, opacity: 0, scale: 0.98 }
              : { x: 200, y: 0, opacity: 0, scale: 0.98 }
        }
        whileInView={{ x: 0, y: 0, opacity: 1, scale: 1 }}
        viewport={viewport}
        transition={{
          type: "spring",
          stiffness: 64,
          damping: 18,
          mass: 0.85,
          delay: reduceMotion ? 0 : 0.04,
        }}
      >
        <img
          src="/assets/jeandre.webp"
          alt="Jeandré Visser"
          width="3072"
          height="3072"
          fetchPriority="high"
        />
      </motion.figure>
    </div>
  );
}

function App() {
  const reduceMotion = useReducedMotion();
  const portraitRef = useRef<HTMLElement>(null);
  const initialsRef = useRef<HTMLSpanElement>(null);
  const flyerRef = useRef<HTMLImageElement>(null);
  const { scrollYProgress } = useScroll({
    target: portraitRef,
    offset: ["end 72px", `end ${72 - PORTRAIT_HANDOFF}px`],
  });

  const placePortrait = (value: number) => {
    const flyer = flyerRef.current;
    const initials = initialsRef.current;
    if (!flyer || !initials) return;

    const t = Math.min(1, Math.max(0, value));
    const reduced = reduceMotion === true;
    const eased = reduced ? (t > 0.02 ? 1 : 0) : t * t * (3 - 2 * t);
    const fade = reduced ? eased : Math.min(1, eased / 0.18);
    const letters = reduced
      ? 1 - eased
      : t < 0.28
        ? 1
        : Math.max(0, 1 - (t - 0.28) / 0.5);

    flyer.style.transform = `scale(${eased})`;
    flyer.style.opacity = String(fade);
    flyer.style.visibility = fade === 0 ? "hidden" : "visible";
    initials.style.opacity = String(letters);
  };

  useMotionValueEvent(scrollYProgress, "change", placePortrait);

  useEffect(() => {
    placePortrait(scrollYProgress.get());
    const onResize = () => placePortrait(scrollYProgress.get());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [reduceMotion, scrollYProgress]);

  useScrollToHash();

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <SiteNav
        homeHref="#top"
        portraitRef={flyerRef}
        initialsRef={initialsRef}
      />

      <main id="main">
        <section className="hero shell" id="top">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 84,
              damping: 18,
              delay: 0.1,
            }}
          >
            <p className="role-line">Co-Founder and CPO, SubTrack</p>
            <h1>
              Jeandré
              <br />
              Visser.
            </h1>
            <p className="hero-statement">I design, build, and ship product.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">
                View work
                <ArrowDownRight size={17} />
              </a>
              <a className="button button-secondary" href={CONTACT_EMAIL}>
                Get in touch
              </a>
            </div>
          </motion.div>

          <PortraitStack reduceMotion={reduceMotion} frameRef={portraitRef} />
        </section>

        <section className="section shell" id="now">
          <Reveal>
            <p className="eyebrow">Building now</p>
            <h2>Software that starts in the field.</h2>
          </Reveal>

          <Reveal className="featured-bezel" delay={0.08}>
            <div className="featured-media is-product">
              <SubTrackDemo />
            </div>
            <div className="featured-copy">
              <SubTrackMark label />
              <p className="featured-lead">
                T&M and LEM software for tracking labor, equipment, and
                materials in the field.
              </p>
              <p>
                I lead product and frontend, translating field workflows into a
                product crews can open and use on day one.
              </p>
              <div className="responsibilities" aria-label="Responsibilities">
                <span>Product direction</span>
                <span>Product design</span>
                <span>Frontend</span>
              </div>
              <a
                className="text-link"
                href="https://www.subtrackfield.com/"
                target="_blank"
                rel="noreferrer"
              >
                Visit SubTrack
                <ArrowUpRight size={17} />
              </a>
            </div>
          </Reveal>
        </section>

        <section className="section path-section shell" id="path">
          <Reveal>
            <h2>From project delivery to product ownership.</h2>
          </Reveal>

          <div className="timeline">
            {experiences.map((experience, index) => (
              <Reveal
                className={`timeline-item ${
                  experience.featured ? "is-featured" : ""
                }`}
                delay={index * 0.04}
                key={`${experience.company}-${experience.role}`}
              >
                <div className="timeline-period">{experience.period}</div>
                <div className="timeline-content">
                  <div className="timeline-heading">
                    <h3>{experience.role}</h3>
                    <a
                      className="company"
                      href={experience.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {experience.logo === "subtrack" ? (
                        <SubTrackMark />
                      ) : (
                        <img
                          className="experience-logo"
                          src={experience.logo}
                          alt=""
                          aria-hidden="true"
                        />
                      )}
                      {experience.company}
                    </a>
                  </div>
                  <p>{experience.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section shell" id="work">
          <Reveal className="work-heading">
            <h2>Products I’ve shipped.</h2>
            <p>
              SubTrack is the product I own. Nurish’d is earlier fullstack work.
              Both are live.
            </p>
            <a className="text-link work-process-link" href="/work">
              See how I build
              <ArrowRight size={17} />
            </a>
          </Reveal>

          <div className="project">
            <Reveal delay={0.06}>
              <div className="project-head">
                <SubTrackMark label />
                <p className="work-type">
                  Product engineer / Frontend / UI UX · 2025–present
                </p>
              </div>
              <p className="project-lede">
                T&M and LEM software for tracking labor, equipment, and
                materials in the field. I lead product, design, and frontend.
              </p>
              <ul className="project-shipped">
                <li>
                  Ticket capture for labor, equipment, materials, and subs
                </li>
                <li>Cost summary and an approval path a PM can run</li>
                <li>
                  A field app crews open on site, from crew size to the ticket
                </li>
              </ul>
            </Reveal>
            <SubTrackField />
            <a
              className="text-link"
              href="https://www.subtrackfield.com/"
              target="_blank"
              rel="noreferrer"
            >
              Visit SubTrack
              <ArrowUpRight size={17} />
            </a>
          </div>

          <Reveal className="project" delay={0.08}>
            <div className="project-head">
              <h3>
                <img
                  className="work-brand-logo"
                  src="/assets/nurishd-logo.png"
                  alt=""
                  aria-hidden="true"
                />
                Nurish’d
              </h3>
              <p className="work-type">
                Full stack / Product delivery · 2023–2025
              </p>
            </div>
            <p className="project-lede">
              A nutrition care platform: meal plans, dietitian appointments, and
              health tracking. Built across TypeScript, Next.js, Python, and
              FastAPI.
            </p>
            <ul className="project-shipped">
              <li>Customer-facing product across web and care workflows</li>
              <li>Appointment and meal-plan flows in production</li>
            </ul>
            <NurishdSite />
            <a
              className="text-link"
              href="https://www.nurishd.store/"
              target="_blank"
              rel="noreferrer"
            >
              Visit Nurish’d
              <ArrowUpRight size={17} />
            </a>
          </Reveal>
        </section>

        <section className="section craft-section shell" id="craft">
          <Reveal>
            <h2>How the work gets made.</h2>
          </Reveal>

          <div className="craft-list">
            {craft.map((group, index) => (
              <Reveal
                className="craft-item"
                delay={index * 0.04}
                key={group.title}
              >
                <div className="craft-head">
                  <h3>{group.title}</h3>
                  {group.brands.length > 0 && (
                    <ul
                      className="craft-brands"
                      aria-label={`${group.title} tools`}
                    >
                      {group.brands.map((icon) => (
                        <li key={icon.slug}>
                          <BrandMark icon={icon} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <p>{group.note}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section education-section shell" id="education">
          <Reveal className="education-layout">
            <h2>Education.</h2>
            <div className="education-list">
              <div className="education-item">
                <div className="education-logo-wrap">
                  <img
                    src="/assets/lighthouse-labs.png"
                    alt=""
                    aria-hidden="true"
                  />
                </div>
                <div className="education-detail">
                  <p className="education-school">Lighthouse Labs</p>
                  <p>Diploma of Full Stack Web Development</p>
                </div>
                <span className="education-year">2022</span>
              </div>
              <div className="education-item">
                <div className="education-logo-wrap">
                  <img src="/assets/uofa.png" alt="" aria-hidden="true" />
                </div>
                <div className="education-detail">
                  <p className="education-school">University of Alberta</p>
                  <p>Bachelor of Science</p>
                </div>
                <span className="education-year">2020</span>
              </div>
            </div>
          </Reveal>
        </section>

        <section className="contact-section shell" id="contact">
          <Reveal>
            <h2>Let’s connect.</h2>
            <SocialLinks />
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </MotionConfig>
  );
}

export default App;
