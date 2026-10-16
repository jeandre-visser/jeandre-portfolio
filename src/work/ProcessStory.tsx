import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowsClockwise,
  Bell,
  Bug,
  Check,
  ChartLine,
  Clock,
  FileText,
  FolderSimple,
  Gear,
  GitMerge,
  GitPullRequest,
  House,
  Play,
  Question,
  Sparkle,
  Target,
  UsersThree,
  Wrench,
} from "@phosphor-icons/react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
  useScroll,
} from "motion/react";
import type { ProcessStep } from "../content/work";
import { MacCursor } from "./Kit";
import { useMediaQuery, useSequence } from "./hooks";

const EASE = [0.22, 1, 0.36, 1] as const;
const COMPACT_QUERY = "(max-width: 720px)";

/* ------------------------------------------------------------------ */
/* Research: my research workflow as a structured diagram              */
/* ------------------------------------------------------------------ */

type FlowNode = {
  id: string;
  label: string;
  x: number;
  y: number;
  icon: ReactNode;
  kind?: "core" | "out" | "later";
};

type FlowLayout = {
  width: number;
  height: number;
  columns: { label: string; x: number }[];
  nodes: FlowNode[];
  edges: { d: string; delay: number; isLater?: boolean }[];
  joints: { x: number; y: number }[];
  travel: string;
};

const flowLabels = {
  docs: { label: "Docs and flow charts", icon: <FileText /> },
  people: { label: "Users", icon: <UsersThree /> },
  tools: { label: "Tools used today", icon: <Wrench /> },
  problem: { label: "Define the problem", icon: <Target /> },
  now: { label: "Build now", icon: <Check weight="bold" /> },
  later: { label: "Later", icon: <Clock /> },
};

// Orthogonal connectors on a fixed grid. Coordinates share one box with the
// HTML nodes, so both layouts line up at any stage size.
const wideFlow: FlowLayout = {
  width: 400,
  height: 300,
  columns: [
    { label: "Inputs", x: 78 },
    { label: "Problem", x: 205 },
    { label: "Plan", x: 335 },
  ],
  nodes: [
    { id: "docs", x: 78, y: 95, ...flowLabels.docs },
    { id: "people", x: 78, y: 160, ...flowLabels.people },
    { id: "tools", x: 78, y: 225, ...flowLabels.tools },
    { id: "problem", x: 205, y: 160, kind: "core", ...flowLabels.problem },
    { id: "now", x: 335, y: 115, kind: "out", ...flowLabels.now },
    { id: "later", x: 335, y: 205, kind: "later", ...flowLabels.later },
  ],
  edges: [
    { d: "M78 95 H145 V160", delay: 0.55 },
    { d: "M78 225 H145 V160", delay: 0.55 },
    { d: "M78 160 H205", delay: 0.75 },
    { d: "M205 160 H272 V115 H335", delay: 1.15 },
    { d: "M272 160 V205 H335", delay: 1.3, isLater: true },
  ],
  joints: [
    { x: 145, y: 160 },
    { x: 272, y: 160 },
  ],
  travel: "M78 160 H205 H272 V115 H335",
};

const tallFlow: FlowLayout = {
  width: 300,
  height: 375,
  columns: [],
  nodes: [
    { id: "docs", x: 165, y: 40, ...flowLabels.docs },
    { id: "people", x: 165, y: 100, ...flowLabels.people },
    { id: "tools", x: 165, y: 160, ...flowLabels.tools },
    { id: "problem", x: 150, y: 240, kind: "core", ...flowLabels.problem },
    { id: "now", x: 82, y: 335, kind: "out", ...flowLabels.now },
    { id: "later", x: 218, y: 335, kind: "later", ...flowLabels.later },
  ],
  edges: [
    { d: "M165 40 H26 V240 H150", delay: 0.5 },
    { d: "M165 100 H26", delay: 0.6 },
    { d: "M165 160 H26", delay: 0.7 },
    { d: "M150 240 V290 H82 V335", delay: 1.1 },
    { d: "M150 290 H218 V335", delay: 1.25, isLater: true },
  ],
  joints: [
    { x: 26, y: 240 },
    { x: 150, y: 290 },
  ],
  travel: "M165 100 H26 V240 H150 V290 H82 V335",
};

function ResearchScene() {
  const reduceMotion = useReducedMotion();
  const isCompact = useMediaQuery(COMPACT_QUERY);
  const flow = isCompact ? tallFlow : wideFlow;
  const at = (x: number, y: number) => ({
    left: `${(x / flow.width) * 100}%`,
    top: `${(y / flow.height) * 100}%`,
  });

  return (
    <div className="wk-scene wk-research">
      <div className="wk-flow-area">
        {flow.columns.map((column) => (
          <span
            className="wk-flow-col"
            key={column.label}
            style={at(column.x, 22)}
          >
            {column.label}
          </span>
        ))}
        <svg
          className="wk-flow-lines"
          viewBox={`0 0 ${flow.width} ${flow.height}`}
          preserveAspectRatio="none"
        >
          {flow.edges.map((edge) => (
            <motion.path
              key={edge.d}
              d={edge.d}
              className={edge.isLater ? "is-later" : undefined}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, ease: EASE, delay: edge.delay }}
            />
          ))}
          {!reduceMotion && (
            <circle r="3" className="wk-flow-dot">
              <animateMotion
                dur="3s"
                repeatCount="indefinite"
                path={flow.travel}
              />
            </circle>
          )}
        </svg>
        {flow.joints.map((joint, index) => (
          <motion.span
            className="wk-flow-joint"
            key={`${joint.x}-${joint.y}`}
            style={at(joint.x, joint.y)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 20,
              delay: 0.9 + index * 0.4,
            }}
          />
        ))}
        {flow.nodes.map((node, index) => (
          <motion.div
            className={`wk-flow-node${node.kind ? ` is-${node.kind}` : ""}`}
            key={node.id}
            style={at(node.x, node.y)}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1 + index * 0.14,
            }}
          >
            <span className="wk-flow-icon">{node.icon}</span>
            {node.label}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Observe: a session replay that hunts through a menu                 */
/* ------------------------------------------------------------------ */

const menuItems = [
  { label: "Overview", icon: <House /> },
  { label: "Projects", icon: <FolderSimple /> },
  { label: "Settings", icon: <Gear /> },
  { label: "Reports", icon: <ChartLine /> },
  { label: "Help", icon: <Question /> },
];

type ReplayPhase = {
  x: number;
  y: number;
  hover?: number;
  isClick?: boolean;
  isPause?: boolean;
  isFound?: boolean;
  note?: string;
};

// Cursor positions are percentages of the replay frame.
const replayPhases: ReplayPhase[] = [
  { x: 64, y: 60 },
  { x: 12, y: 23, hover: 0, note: "Searched the menu" },
  { x: 12, y: 37, hover: 1, note: "Searched the menu" },
  { x: 12, y: 51, hover: 2, isPause: true, note: "Hesitated" },
  { x: 12, y: 51, hover: 2, isClick: true, note: "Hesitated" },
  { x: 82, y: 36, isFound: true, note: "Found it" },
  { x: 82, y: 36, isFound: true, isClick: true, note: "Found it" },
];
const REPLAY_STEPS = [900, 800, 800, 1800, 500, 1000, 1400];

function ObserveScene({ isActive }: { isActive: boolean }) {
  const reduceMotion = useReducedMotion();
  const [step] = useSequence(REPLAY_STEPS, isActive && !reduceMotion);
  const phase = replayPhases[reduceMotion ? 3 : step];

  return (
    <div className="wk-scene wk-observe">
      <div className="wk-replay-top">
        <span className="wk-rec">
          <i />
          Session replay
        </span>
        <span className="wk-replay-url">app / dashboard</span>
      </div>
      <div className="wk-replay-frame">
        <div className="wk-replay-side">
          {menuItems.map((item, index) => (
            <span
              key={item.label}
              className="wk-replay-item"
              data-hover={phase.hover === index}
              data-active={phase.isFound && index === 2}
            >
              {item.icon}
              {item.label}
              {phase.isPause && index === 2 && (
                <motion.i
                  className="wk-hesitate"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: [0.9, 0.35, 0.9], scale: [1, 1.04, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
              )}
            </span>
          ))}
        </div>
        <div className="wk-replay-main">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={phase.isFound ? "settings" : "overview"}
              className="wk-replay-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <b>{phase.isFound ? "Settings" : "Overview"}</b>
              <div className="wk-replay-cards">
                {[0, 1, 2, 3].map((card) => (
                  <span
                    className="wk-replay-card"
                    key={card}
                    data-target={phase.isFound && card === 1}
                  >
                    <i />
                    <span className="wk-skel" />
                    <span className="wk-skel is-short" />
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {phase.isClick && (
            <motion.span
              key={step}
              className="wk-ripple"
              style={{ left: `${phase.x}%`, top: `${phase.y}%` }}
              initial={{ scale: 0, opacity: 0.55 }}
              animate={{ scale: 1.8, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>
        <motion.span
          className="wk-cursor"
          initial={false}
          animate={{
            left: `${phase.x}%`,
            top: `${phase.y}%`,
            scale: phase.isClick ? 0.86 : 1,
          }}
          transition={{
            left: { duration: 0.7, ease: [0.45, 0, 0.2, 1] },
            top: { duration: 0.7, ease: [0.45, 0, 0.2, 1] },
            scale: { type: "spring", stiffness: 600, damping: 20 },
          }}
        >
          <MacCursor />
        </motion.span>
      </div>
      <div className="wk-timeline">
        <span className="wk-timeline-track">
          {[1, 3, 6].map((at) => (
            <i
              key={at}
              style={{ left: `${(at / replayPhases.length) * 100}%` }}
            />
          ))}
          <motion.span
            className="wk-playhead"
            initial={false}
            animate={{ left: `${((step + 1) / replayPhases.length) * 100}%` }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        </span>
        <AnimatePresence mode="wait">
          {phase.note && (
            <motion.span
              key={phase.note}
              className="wk-timeline-note"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              {phase.note}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Design: variants that resize across breakpoints                     */
/* ------------------------------------------------------------------ */

// Widths are in stage container units so three cards always fit side by side.
const sizes = [
  { label: "Desktop", ratio: 16 / 10, width: "27cqw" },
  { label: "Tablet", ratio: 3 / 4, width: "25cqw" },
  { label: "Phone", ratio: 9 / 17, width: "20cqw" },
];
const DESIGN_STEPS = [1500, 1500, 1500, 1500, 1500, 1800];

function VariantSkeleton({ kind }: { kind: number }) {
  if (kind === 0)
    return (
      <>
        <span className="wk-skel is-title" />
        <span className="wk-var-cols">
          <span />
          <span />
        </span>
      </>
    );
  if (kind === 1)
    return (
      <>
        <span className="wk-skel is-title" />
        {[0, 1, 2].map((row) => (
          <span className="wk-var-row" key={row}>
            <i />
            <span className="wk-skel" />
          </span>
        ))}
      </>
    );
  return (
    <>
      <span className="wk-var-hero" />
      <span className="wk-var-grid">
        <span />
        <span />
        <span />
        <span />
      </span>
    </>
  );
}

function DesignScene({ isActive }: { isActive: boolean }) {
  const [step] = useSequence(DESIGN_STEPS, isActive);
  const size = sizes[step % sizes.length];
  const isPicked = step >= 3;

  return (
    <div className="wk-scene wk-design">
      <div className="wk-size-tabs">
        {sizes.map((item) => (
          <span
            key={item.label}
            className={item === size ? "is-on" : undefined}
          >
            {item === size && (
              <motion.i
                layoutId="wk-size-pill"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <b>{item.label}</b>
          </span>
        ))}
      </div>
      <div className="wk-variants">
        {["A", "B", "C"].map((name, index) => {
          const isChosen = isPicked && index === 1;
          return (
            <motion.div
              layout
              className={`wk-variant${isChosen ? " is-chosen" : ""}${isPicked && !isChosen ? " is-dim" : ""}`}
              key={name}
              style={{ aspectRatio: size.ratio, width: size.width }}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                layout: { type: "spring", stiffness: 200, damping: 26 },
                delay: index * 0.12,
              }}
            >
              <span className="wk-variant-label">Variant {name}</span>
              <div className="wk-variant-body">
                <VariantSkeleton kind={index} />
              </div>
              <AnimatePresence>
                {isChosen && (
                  <motion.span
                    className="wk-variant-pick"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 420, damping: 22 }}
                  >
                    <Check weight="bold" />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          className="wk-design-note"
          key={isPicked ? "picked" : "compare"}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
        >
          {isPicked
            ? "Variant B, reviewed with the team"
            : "Comparing three layouts"}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Build: a queue of PRs of different sizes                             */
/* ------------------------------------------------------------------ */

type PullRequest = {
  title: string;
  tags: { label: string; tone: string }[];
  added: number;
  removed: number;
  files: number;
};

const pullRequests: PullRequest[] = [
  {
    title: "Bulk edit for list views",
    tags: [
      { label: "Feature", tone: "feature" },
      { label: "Large", tone: "size" },
    ],
    added: 1284,
    removed: 312,
    files: 24,
  },
  {
    title: "Fix date picker time zone shift",
    tags: [
      { label: "Bug fix", tone: "bug" },
      { label: "High priority", tone: "urgent" },
    ],
    added: 18,
    removed: 6,
    files: 2,
  },
  {
    title: "Tighten card spacing on phones",
    tags: [
      { label: "UI", tone: "ui" },
      { label: "Small", tone: "size" },
    ],
    added: 42,
    removed: 57,
    files: 5,
  },
  {
    title: "Retry failed uploads",
    tags: [
      { label: "Feature", tone: "feature" },
      { label: "Medium", tone: "size" },
    ],
    added: 236,
    removed: 41,
    files: 9,
  },
];
const checks = ["Lint", "Types", "Tests", "Review"];
const PR_SUBSTEPS = [700, 450, 450, 450, 1300];
const BUILD_STEPS = pullRequests.flatMap(() => PR_SUBSTEPS);

/** Five squares split between additions and deletions, like a diffstat. */
function DiffBlocks({ added, removed }: { added: number; removed: number }) {
  const green = Math.max(1, Math.round((added / (added + removed)) * 5));
  return (
    <span className="wk-diff-blocks">
      {[0, 1, 2, 3, 4].map((block) => (
        <i key={block} className={block < green ? "is-add" : "is-remove"} />
      ))}
    </span>
  );
}

function BuildScene({ isActive }: { isActive: boolean }) {
  const reduceMotion = useReducedMotion();
  const [step] = useSequence(BUILD_STEPS, isActive && !reduceMotion);
  const current = Math.floor(step / PR_SUBSTEPS.length);
  const subStep = step % PR_SUBSTEPS.length;

  return (
    <div className="wk-scene wk-build">
      <div className="wk-pr-head">
        <GitPullRequest weight="bold" />
        <b>Pull requests</b>
        <span>Large features, broken into chunks</span>
      </div>
      <motion.ul className="wk-pr-list" layout>
        {pullRequests.map((pr, index) => {
          const isCurrent = index === current;
          const isMerged = index < current || (isCurrent && subStep === 4);
          return (
            <motion.li
              layout
              key={pr.title}
              className="wk-pr"
              data-current={isCurrent}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                layout: { type: "spring", stiffness: 260, damping: 30 },
                delay: index * 0.08,
              }}
            >
              <motion.div layout="position" className="wk-pr-row">
                <span className={`wk-pr-state${isMerged ? " is-merged" : ""}`}>
                  {isMerged ? (
                    <GitMerge weight="bold" />
                  ) : (
                    <GitPullRequest weight="bold" />
                  )}
                </span>
                <span className="wk-pr-title">
                  <b>{pr.title}</b>
                  <span className="wk-pr-tags">
                    {pr.tags.map((tag) => (
                      <i key={tag.label} className={`is-${tag.tone}`}>
                        {tag.label}
                      </i>
                    ))}
                  </span>
                </span>
                <span className="wk-pr-diff">
                  <span>
                    <em className="is-add">
                      +{pr.added.toLocaleString("en-US")}
                    </em>
                    <em className="is-remove">
                      −{pr.removed.toLocaleString("en-US")}
                    </em>
                  </span>
                  <DiffBlocks added={pr.added} removed={pr.removed} />
                </span>
              </motion.div>
              <AnimatePresence initial={false}>
                {isCurrent && (
                  <motion.div
                    className="wk-pr-checks"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 30 }}
                  >
                    <ul>
                      {checks.map((check, checkIndex) => {
                        const isDone = checkIndex < subStep;
                        return (
                          <li
                            key={check}
                            className={isDone ? "is-done" : undefined}
                          >
                            <span className="wk-check">
                              {isDone ? (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 24,
                                  }}
                                >
                                  <Check weight="bold" />
                                </motion.span>
                              ) : (
                                <span className="wk-spinner" />
                              )}
                            </span>
                            {check}
                          </li>
                        );
                      })}
                    </ul>
                    <span className="wk-pr-files">{pr.files} files</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
          );
        })}
      </motion.ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Measure: replays and feedback that loop back to research            */
/* ------------------------------------------------------------------ */

const changelog = [
  { kind: "New", title: "Bulk edit for list views" },
  { kind: "New", title: "Retry failed uploads" },
  { kind: "Fixed", title: "Date picker time zone shift" },
  { kind: "Improved", title: "Card spacing on phones" },
];

const recordings = [
  { path: "/lists", note: "Used bulk edit", length: "4:12" },
  { path: "/uploads", note: "Retried an upload", length: "2:38" },
  { path: "/lists", note: "Opened the changelog", length: "1:05" },
];

/** changelog → users notified → review recordings */
const RELEASE_STEPS = [1800, 1600, 2200, 2200, 2200];

function ReleaseScene({ isActive }: { isActive: boolean }) {
  const reduceMotion = useReducedMotion();
  const [step] = useSequence(RELEASE_STEPS, isActive && !reduceMotion);
  const isNotified = reduceMotion || step >= 1;
  const playing = reduceMotion ? 0 : step >= 2 ? step - 2 : -1;

  return (
    <div className="wk-scene wk-release">
      <section className="wk-changelog">
        <div className="wk-changelog-head">
          <span>
            <b>What’s new</b>
            <small>In-app changelog</small>
          </span>
          <span className="wk-bell">
            <Bell weight="bold" />
            <AnimatePresence>
              {isNotified && (
                <motion.i
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.25, 1] }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.45 }}
                />
              )}
            </AnimatePresence>
          </span>
        </div>
        <ul>
          {changelog.map((item, index) => (
            <motion.li
              key={item.title}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: "spring",
                stiffness: 240,
                damping: 24,
                delay: 0.15 + index * 0.12,
              }}
            >
              <span className={`wk-change-tag is-${item.kind.toLowerCase()}`}>
                {item.kind === "New" ? (
                  <Sparkle weight="fill" />
                ) : item.kind === "Fixed" ? (
                  <Bug weight="bold" />
                ) : (
                  <Wrench weight="bold" />
                )}
                {item.kind}
              </span>
              {item.title}
            </motion.li>
          ))}
        </ul>
      </section>

      <section className="wk-recordings">
        <p className="wk-recordings-head">
          <span className="wk-rec-dot" />
          Datadog session recordings
        </p>
        {recordings.map((recording, index) => {
          const isPlaying = index === playing;
          const isWatched = playing > index || reduceMotion;
          return (
            <div
              className="wk-recording"
              key={recording.note}
              data-playing={isPlaying}
            >
              <span className="wk-recording-play">
                {isWatched ? <Check weight="bold" /> : <Play weight="fill" />}
              </span>
              <span className="wk-recording-copy">
                <b>{recording.note}</b>
                <small>
                  {recording.path} · {recording.length}
                </small>
              </span>
              <span className="wk-recording-track">
                <motion.i
                  initial={false}
                  animate={{
                    width: isPlaying ? "100%" : isWatched ? "100%" : "0%",
                  }}
                  transition={
                    isPlaying
                      ? { duration: 2.1, ease: "linear" }
                      : { duration: 0.2 }
                  }
                />
              </span>
            </div>
          );
        })}
        <span className="wk-release-loop">
          <ArrowsClockwise weight="bold" />
          Feeds the next round of research
        </span>
      </section>
    </div>
  );
}

function Scene({ index, isActive }: { index: number; isActive: boolean }) {
  switch (index) {
    case 0:
      return <ResearchScene />;
    case 1:
      return <ObserveScene isActive={isActive} />;
    case 2:
      return <DesignScene isActive={isActive} />;
    case 3:
      return <BuildScene isActive={isActive} />;
    default:
      return <ReleaseScene isActive={isActive} />;
  }
}

/* ------------------------------------------------------------------ */
/* Scroll story                                                         */
/* ------------------------------------------------------------------ */

function Stage({
  active,
  steps,
  children,
}: {
  active: number;
  steps: ProcessStep[];
  children: ReactNode;
}) {
  return (
    <div className="wk-stage" aria-hidden="true">
      <div className="wk-stage-screen">{children}</div>
      <div className="wk-stage-foot">
        <span className="wk-stage-label">
          {String(active + 1).padStart(2, "0")} · {steps[active].title}
        </span>
        <span className="wk-stage-dots">
          {steps.map((step, index) => (
            <i
              key={step.title}
              className={index === active ? "is-on" : undefined}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

function StepBlock({
  steps,
  step,
  index,
  isActive,
  isNarrow,
  onEnter,
}: {
  steps: ProcessStep[];
  step: ProcessStep;
  index: number;
  isActive: boolean;
  isNarrow: boolean;
  onEnter: (index: number) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const isCentered = useInView(ref, { margin: "-45% 0px -45% 0px" });
  const isVisible = useInView(ref, { amount: 0.3 });

  useEffect(() => {
    if (isCentered) onEnter(index);
  }, [index, isCentered, onEnter]);

  return (
    <li ref={ref} className="wk-step" data-active={isNarrow || isActive}>
      <span className="wk-step-index">
        {String(index + 1).padStart(2, "0")}
      </span>
      <p className="wk-step-title">{step.title}</p>
      <h3>{step.headline}</h3>
      <p className="wk-step-text">{step.text}</p>
      {isNarrow && (
        <Stage active={index} steps={steps}>
          {isVisible && <Scene index={index} isActive={isVisible} />}
        </Stage>
      )}
    </li>
  );
}

export function ProcessStory({ steps }: { steps: ProcessStep[] }) {
  const [active, setActive] = useState(0);
  const isNarrow = useMediaQuery("(max-width: 900px)");
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 60%", "end 60%"],
  });

  return (
    <div className="wk-story" ref={railRef}>
      <div className="wk-rail" aria-hidden="true">
        <motion.i style={{ scaleY: scrollYProgress }} />
      </div>
      <ol className="wk-steps">
        {steps.map((step, index) => (
          <StepBlock
            key={step.title}
            steps={steps}
            step={step}
            index={index}
            isActive={index === active}
            isNarrow={isNarrow}
            onEnter={setActive}
          />
        ))}
      </ol>
      {!isNarrow && (
        <div className="wk-stage-sticky">
          <Stage active={active} steps={steps}>
            <AnimatePresence initial={false}>
              <motion.div
                key={active}
                className="wk-scene-layer"
                initial={{ opacity: 0, scale: 0.96, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.03, filter: "blur(8px)" }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <Scene index={active} isActive />
              </motion.div>
            </AnimatePresence>
          </Stage>
        </div>
      )}
    </div>
  );
}
