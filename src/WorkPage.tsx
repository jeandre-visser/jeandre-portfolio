import { useRef, type PointerEvent, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  LockSimple,
} from "@phosphor-icons/react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useInView,
  useReducedMotion,
} from "motion/react";
import {
  BrandMark,
  Reveal,
  SiteFooter,
  SiteNav,
  SocialLinks,
} from "./SiteChrome";
import { work, type Build } from "./content/work";
import { NurishdAppShowcase } from "./work/NurishdShowcase";
import { ProcessStory } from "./work/ProcessStory";
import { SubTrackShowcase } from "./work/SubTrackShowcase";
import { SubTrackWebShowcase } from "./work/SubTrackWebShowcase";
import { TimesheetsShowcase } from "./work/TimesheetsShowcase";
import { WordsReveal } from "./work/Kit";
import { useSequence } from "./work/hooks";
import { useDocumentTitle } from "./useDocumentTitle";
import { useScrollToHash } from "./useScrollToHash";

const HERO_STEPS = [2200, 2200, 2200, 2200, 2800];
const AI_STEPS = [800, 800, 800, 800, 800, 2600];

/**
 * Phone version of the hero orbit: story-style segments that fill one after
 * another, with the current step sliding in below.
 */
function HeroTicker({ active }: { active: number }) {
  const reduceMotion = useReducedMotion();
  const steps = work.processSteps;
  const step = steps[active];

  return (
    <motion.div
      className="wk-ticker"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55, type: "spring", stiffness: 120, damping: 20 }}
    >
      <ol className="wk-ticker-bars" aria-label="My process">
        {steps.map((item, index) => (
          <li key={item.title}>
            <span className="sr-only">{item.title}</span>
            <motion.i
              initial={
                index === active && !reduceMotion ? { scaleX: 0 } : false
              }
              animate={{
                scaleX:
                  index < active || reduceMotion ? 1 : index === active ? 1 : 0,
              }}
              transition={
                index === active && !reduceMotion
                  ? { duration: HERO_STEPS[index] / 1000, ease: "linear" }
                  : { duration: 0.25 }
              }
              key={index === active ? `${item.title}-on` : item.title}
              style={{ originX: 0 }}
            />
          </li>
        ))}
      </ol>
      <div className="wk-ticker-body" aria-hidden="true">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={active}
            className="wk-ticker-step"
            initial={{ y: 28, opacity: 0, filter: "blur(6px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: -28, opacity: 0, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
          >
            <small>
              <em>{String(active + 1).padStart(2, "0")}</em>
              {step.title}
            </small>
            <b>{step.headline}</b>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

const ORBIT_RADIUS = 150;

/** The five steps placed on a ring, with an arc that fills up to the current one. */
function HeroOrbit({ active }: { active: number }) {
  const steps = work.processSteps;
  const progress = active / steps.length;

  return (
    <motion.div
      className="wk-orbit-hero"
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.9, rotate: -12 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 60, damping: 16, delay: 0.25 }}
    >
      <svg viewBox="0 0 400 400">
        <circle className="wk-orbit-outer" cx="200" cy="200" r="186" />
        <circle className="wk-orbit-track" cx="200" cy="200" r={ORBIT_RADIUS} />
        <motion.circle
          className="wk-orbit-arc"
          cx="200"
          cy="200"
          r={ORBIT_RADIUS}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: progress }}
          transition={{ type: "spring", stiffness: 60, damping: 18 }}
        />
      </svg>
      {steps.map((step, index) => {
        const angle = (index / steps.length) * Math.PI * 2 - Math.PI / 2;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const isOn = index === active;
        const isPast = index < active;
        // Labels sit outside the ring, anchored on the side facing away from it.
        const side =
          cos > 0.3
            ? "right"
            : cos < -0.3
              ? "left"
              : sin < 0
                ? "top"
                : "bottom";
        return (
          <span
            key={step.title}
            data-state={isOn ? "on" : isPast ? "past" : "next"}
          >
            <span
              className="wk-orbit-node"
              style={{
                left: `${50 + (cos * ORBIT_RADIUS) / 4}%`,
                top: `${50 + (sin * ORBIT_RADIUS) / 4}%`,
              }}
            >
              <motion.i
                animate={{ scale: isOn ? 1 : 0.6 }}
                transition={{ type: "spring", stiffness: 400, damping: 22 }}
              />
            </span>
            <b
              className="wk-orbit-label"
              data-side={side}
              style={{
                left: `${50 + (cos * (ORBIT_RADIUS + 24)) / 4}%`,
                top: `${50 + (sin * (ORBIT_RADIUS + 24)) / 4}%`,
              }}
            >
              {step.title}
            </b>
          </span>
        );
      })}
      <div className="wk-orbit-center">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={active}
            initial={{ y: 30, opacity: 0, filter: "blur(6px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: -30, opacity: 0, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
          >
            <small>{String(active + 1).padStart(2, "0")}</small>
            {steps[active].headline}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function SectionHead({
  id,
  kicker,
  heading,
  children,
}: {
  id: string;
  kicker: string;
  heading: string;
  children?: ReactNode;
}) {
  return (
    <div className="wk-head">
      <Reveal>
        <p className="eyebrow">{kicker}</p>
      </Reveal>
      <h2 id={id}>
        <WordsReveal text={heading} isOnView />
      </h2>
      {children && <Reveal delay={0.1}>{children}</Reveal>}
    </div>
  );
}

const showcases: Record<string, ReactNode> = {
  subtrack: <SubTrackShowcase />,
  "subtrack-web": <SubTrackWebShowcase />,
  "subtrack-timesheets": <TimesheetsShowcase />,
  "nurishd-app": <NurishdAppShowcase />,
};

function BuildBlock({ build, index }: { build: Build; index: number }) {
  return (
    <article className="wk-build-block" aria-labelledby={`${build.id}-title`}>
      <Reveal className="wk-build-copy">
        <span className="wk-build-index">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div>
          <p className="wk-build-kicker">{build.kicker}</p>
          <h3 id={`${build.id}-title`}>{build.title}</h3>
        </div>
        <div className="wk-build-text">
          <p>{build.text}</p>
          <ul>
            {build.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <a
            className="text-link"
            href={build.href}
            target="_blank"
            rel="noreferrer"
          >
            {build.linkLabel}
            <ArrowUpRight size={17} />
          </a>
        </div>
      </Reveal>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ type: "spring", stiffness: 70, damping: 18 }}
      >
        {showcases[build.id]}
      </motion.div>
    </article>
  );
}

function ToolTile({
  tool,
  index,
}: {
  tool: (typeof work.tools)[number];
  index: number;
}) {
  // Feeds the cursor position to the CSS spotlight on hover.
  const onPointerMove = (event: PointerEvent<HTMLLIElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      "--x",
      `${event.clientX - box.left}px`,
    );
    event.currentTarget.style.setProperty(
      "--y",
      `${event.clientY - box.top}px`,
    );
  };

  return (
    <motion.li
      className="wk-tool"
      onPointerMove={onPointerMove}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{
        type: "spring",
        stiffness: 160,
        damping: 20,
        delay: index * 0.06,
      }}
    >
      <span className="wk-tool-icon">
        {tool.icon && <BrandMark icon={tool.icon} />}
      </span>
      <b>{tool.name}</b>
      {tool.note && <small>{tool.note}</small>}
    </motion.li>
  );
}

function AiRun() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.4 });
  const reduceMotion = useReducedMotion();
  const [step] = useSequence(AI_STEPS, isInView && !reduceMotion);
  const doneCount = reduceMotion ? work.aiSteps.length : step;

  return (
    <div className="wk-ai-run" ref={ref}>
      <div className="wk-ai-bar">
        <span className="wk-browser-dots">
          <i />
          <i />
          <i />
        </span>
        <span>design toolkit · run</span>
      </div>
      <ol>
        {work.aiSteps.map((item, index) => {
          const isDone = index < doneCount;
          const isRunning = index === doneCount;
          const isLast = index === work.aiSteps.length - 1;
          return (
            <li
              key={item}
              data-state={isDone ? "done" : isRunning ? "running" : "waiting"}
            >
              <span className="wk-check">
                <AnimatePresence initial={false} mode="wait">
                  {isDone ? (
                    <motion.span
                      key="done"
                      initial={{ scale: 0, rotate: -40 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 22,
                      }}
                    >
                      {isLast ? (
                        <LockSimple weight="bold" />
                      ) : (
                        <Check weight="bold" />
                      )}
                    </motion.span>
                  ) : isRunning ? (
                    <motion.span
                      key="run"
                      className="wk-spinner"
                      exit={{ opacity: 0 }}
                    />
                  ) : null}
                </AnimatePresence>
              </span>
              {item}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function WorkPage() {
  useDocumentTitle(work.documentTitle);
  useScrollToHash();
  const reduceMotion = useReducedMotion();
  const [heroStep] = useSequence(HERO_STEPS, !reduceMotion);

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <SiteNav currentHref="/work" />

      <main id="main" className="wk-page">
        <section className="wk-hero shell">
          <div className="wk-hero-copy">
            <motion.p
              className="role-line"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {work.roleLine}
            </motion.p>
            <h1>
              <WordsReveal text={work.title} delay={0.1} />
            </h1>
            <motion.p
              className="hero-statement"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.35,
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
            >
              {work.statement}
            </motion.p>
            <motion.p
              className="wk-intro"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.45,
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
            >
              {work.intro}
            </motion.p>
            <HeroTicker active={heroStep} />
            <a className="wk-scroll-cue" href="#process">
              <span>See the process</span>
              <motion.span
                animate={{ y: [0, 5, 0] }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <ArrowDown size={16} />
              </motion.span>
            </a>
          </div>
          <HeroOrbit active={heroStep} />
        </section>

        <section
          className="section wk-section shell"
          id="process"
          aria-labelledby="process-heading"
        >
          <SectionHead
            id="process-heading"
            kicker={work.processKicker}
            heading={work.processHeading}
          />
          <ProcessStory steps={work.processSteps} />
        </section>

        <section
          className="section wk-section shell"
          id="built"
          aria-labelledby="built-heading"
        >
          <SectionHead
            id="built-heading"
            kicker={work.builtKicker}
            heading={work.builtHeading}
          >
            <p className="wk-head-text">{work.builtIntro}</p>
          </SectionHead>
          {work.builds.map((build, index) => (
            <BuildBlock build={build} index={index} key={build.id} />
          ))}
        </section>

        <section
          className="section wk-section shell"
          id="tools"
          aria-labelledby="tools-heading"
        >
          <SectionHead
            id="tools-heading"
            kicker={work.toolsKicker}
            heading={work.toolsHeading}
          />
          <ul className="wk-tools">
            {work.tools.map((tool, index) => (
              <ToolTile tool={tool} index={index} key={tool.name} />
            ))}
          </ul>
        </section>

        <section
          className="section wk-section wk-ai shell"
          id="ai"
          aria-labelledby="ai-heading"
        >
          <SectionHead
            id="ai-heading"
            kicker={work.aiKicker}
            heading={work.aiHeading}
          >
            <p className="wk-head-text">{work.aiText}</p>
          </SectionHead>
          <Reveal delay={0.1}>
            <AiRun />
          </Reveal>
        </section>

        <section className="contact-section shell" id="contact">
          <Reveal>
            <h2>{work.closing}</h2>
            <SocialLinks />
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </MotionConfig>
  );
}
