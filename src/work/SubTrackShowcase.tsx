import { useRef, useState } from "react";
import {
  ArrowClockwise,
  ArrowRight,
  Bell,
  CalendarBlank,
  CaretDown,
  CaretLeft,
  CaretRight,
  ChartBar,
  ClipboardText,
  DotsThree,
  FilePlus,
  FolderSimple,
  HardHat,
  List,
  MagnifyingGlass,
  Moon,
  Package,
  PaperPlaneTilt,
  Percent,
  Plus,
  Question,
  SlidersHorizontal,
  Stack,
  Sun,
  UserCheck,
  Users,
  Wrench,
} from "@phosphor-icons/react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { CountUp, PhoneFrame, Tilt } from "./Kit";
import { useSequence } from "./hooks";

type Theme = "light" | "dark";

const tickets = [
  {
    id: "LEM-20261013-001",
    total: "$6,427.50",
    status: "Pending client approval",
    tone: "pending",
    tag: "Email not sent",
    project: "North yard",
    meta: "Client A · 2026-Oct-13",
  },
  {
    id: "LEM-20261011-002",
    total: "$487.50",
    status: "In Progress",
    tone: "progress",
    project: "Pipeline tie-in",
    meta: "Client B · 2026-Oct-11",
  },
  {
    id: "LEM-20260920-002",
    total: "$15,165.50",
    status: "Approved",
    tone: "approved",
    project: "Site 4 grading",
    meta: "Client C · 2026-Sep-20",
  },
  {
    id: "LEM-20260920-001",
    total: "$195.00",
    status: "In Progress",
    tone: "progress",
    project: "Culvert repair",
    meta: "Client A · 2026-Sep-20",
  },
];

const sheetGroups = [
  {
    title: "Workspace",
    items: [
      { label: "Add project", icon: <FolderSimple /> },
      { label: "Add client", icon: <Users /> },
      { label: "Reporting", icon: <ChartBar /> },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Create rate template", icon: <FilePlus /> },
      { label: "Add worker", icon: <HardHat /> },
      { label: "Add equipment", icon: <Wrench /> },
      { label: "Add equipment type", icon: <Stack /> },
      { label: "Add material", icon: <Package /> },
      { label: "Add subcontractor", icon: <UserCheck /> },
    ],
  },
];

const rateSheets = [
  {
    name: "North yard PRS",
    project: "North yard",
    counts: [7, 10, 2, 1],
    created: "Oct 10, 2026",
  },
  {
    name: "Pipeline tie-in PRS",
    project: "Pipeline tie-in",
    counts: [4, 7, 2, 0],
    created: "Aug 31, 2026",
  },
  {
    name: "Site 4 grading PRS",
    project: "Site 4 grading",
    counts: [5, 6, 3, 2],
    created: "Jul 18, 2026",
  },
];
const countLabels = ["Labour", "Equipment", "Materials", "Subs."];

/** list → tap → detail → sheet, then back to the list. */
const FLOW_STEPS = [2200, 450, 2600, 2800];
const RATE_STEPS = [2400, 2400];

function TabBar({
  active,
  isSheetOpen = false,
}: {
  active: "lems" | "rates";
  isSheetOpen?: boolean;
}) {
  return (
    <div className="wk-st-tabbar">
      <span>
        <List />
        Menu
      </span>
      <span className={active === "lems" ? "is-on" : undefined}>
        <ClipboardText />
        LEMs
      </span>
      <motion.span
        className="wk-st-plus"
        animate={{ rotate: isSheetOpen ? 45 : 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 20 }}
      >
        <Plus weight="bold" />
      </motion.span>
      <span className={active === "rates" ? "is-on" : undefined}>
        <Percent />
        Rates
      </span>
      <span>
        <span className="wk-st-bell">
          <Bell />
          <i>9+</i>
        </span>
        Alerts
      </span>
    </div>
  );
}

function TicketCard({
  ticket,
  isPressed = false,
}: {
  ticket: (typeof tickets)[number];
  isPressed?: boolean;
}) {
  return (
    <motion.article
      className="wk-st-card"
      animate={{ scale: isPressed ? 0.97 : 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
    >
      <div className="wk-st-card-top">
        <strong>{ticket.id}</strong>
        <b>{ticket.total}</b>
        <CaretDown />
      </div>
      <div className="wk-st-pills">
        <span className={`wk-st-pill is-${ticket.tone}`}>
          <i />
          {ticket.status}
        </span>
        {ticket.tag && <span className="wk-st-pill is-tag">{ticket.tag}</span>}
      </div>
      <p className="wk-st-project">{ticket.project}</p>
      <p className="wk-st-meta">{ticket.meta}</p>
    </motion.article>
  );
}

function ListScreen({ pressedIndex }: { pressedIndex?: number }) {
  return (
    <div className="wk-st-body">
      <div className="wk-st-field">
        <FolderSimple />
        <span>Filter by Project or Client</span>
        <CaretDown />
      </div>
      <div className="wk-st-search">
        <div className="wk-st-field">
          <MagnifyingGlass />
          <span className="is-muted">Search</span>
        </div>
        <span className="wk-st-round">
          <SlidersHorizontal />
        </span>
      </div>
      {tickets.map((ticket, index) => (
        <div className="wk-st-card-wrap" key={ticket.id}>
          <TicketCard ticket={ticket} isPressed={pressedIndex === index} />
          <AnimatePresence>
            {pressedIndex === index && (
              <motion.span
                className="wk-st-tap"
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 2.4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

function DetailScreen() {
  return (
    <div className="wk-st-body">
      <div className="wk-st-toolbar">
        <Question />
        <ArrowClockwise />
        <span />
        <CaretLeft />
        <CalendarBlank />
        <CaretRight className="is-muted" />
      </div>
      <section className="wk-st-panel">
        <h4>LEM-20261013-001</h4>
        <div className="wk-st-pills">
          <span className="wk-st-pill is-pending">
            <i />
            Pending client approval
          </span>
          <span className="wk-st-pill is-tag">R1</span>
          <span className="wk-st-pill is-current">Current</span>
        </div>
        <span className="wk-st-more">
          <DotsThree weight="bold" />
          More
        </span>
        <dl className="wk-st-facts">
          {[
            ["Date", "2026-Oct-13"],
            ["Project", "North yard"],
            ["Client", "Client A"],
            ["Location", "Site 4"],
          ].map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="wk-st-panel">
        <div className="wk-st-approval-head">
          <PaperPlaneTilt />
          <b>Client approval</b>
          <span className="wk-st-pill is-tag">Email not sent</span>
        </div>
        <p className="wk-st-approval-text">Ready to send to the client</p>
        <span className="wk-st-primary">
          <PaperPlaneTilt />
          Send for approval
        </span>
      </section>
      <section className="wk-st-panel">
        <p className="wk-st-section-title">
          <i className="is-labour" />
          Labour
        </p>
        <div className="wk-st-line">
          <span>
            <b>J. Smith</b>
            <small>Foreman</small>
          </span>
          <b>$855.00</b>
        </div>
      </section>
    </div>
  );
}

function CreateSheet() {
  return (
    <>
      <motion.div
        className="wk-st-scrim"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      />
      <motion.div
        className="wk-st-sheet"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
      >
        {sheetGroups.map((group) => (
          <div key={group.title}>
            <p className="wk-st-kicker">{group.title}</p>
            {group.items.map((item, index) => (
              <motion.div
                className="wk-st-sheet-row"
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + index * 0.04 }}
              >
                <span className="wk-st-sheet-icon">{item.icon}</span>
                {item.label}
                <CaretRight className="is-muted" />
              </motion.div>
            ))}
          </div>
        ))}
        <span className="wk-st-primary">
          <ClipboardText />
          New LEM
        </span>
      </motion.div>
    </>
  );
}

const pushVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-28%",
    zIndex: direction > 0 ? 2 : 0,
  }),
  center: { x: "0%", zIndex: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? "-28%" : "100%",
    zIndex: direction > 0 ? 0 : 2,
  }),
};

function FlowPhone({ isActive }: { isActive: boolean }) {
  const [step] = useSequence(FLOW_STEPS, isActive);
  const screen = step >= 2 ? "detail" : "list";
  const direction = screen === "detail" ? 1 : -1;
  const isSheetOpen = step === 3;

  return (
    <PhoneFrame className="is-center">
      <div className="wk-st-stack">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={screen}
            className="wk-st-layer"
            custom={direction}
            variants={pushVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 240, damping: 32 }}
          >
            {screen === "list" ? (
              <ListScreen pressedIndex={step === 1 ? 0 : undefined} />
            ) : (
              <DetailScreen />
            )}
          </motion.div>
        </AnimatePresence>
        <AnimatePresence>{isSheetOpen && <CreateSheet />}</AnimatePresence>
      </div>
      <TabBar active="lems" isSheetOpen={isSheetOpen} />
    </PhoneFrame>
  );
}

function RatesPhone({ isActive }: { isActive: boolean }) {
  const [step] = useSequence(RATE_STEPS, isActive);
  const isTemplates = step === 1;

  return (
    <PhoneFrame className="is-left">
      <div className="wk-st-body">
        <h4 className="wk-st-title">Rate Sheets</h4>
        <p className="wk-st-subtitle">
          Create and manage rate sheets to use in your projects
        </p>
        <div className="wk-st-compare">
          Difference between TRS and PRS?
          <b>
            Compare <ArrowRight />
          </b>
        </div>
        <div className="wk-st-segment">
          {["Project Rate Sheets", "Template Rate Sheets"].map(
            (label, index) => {
              const isOn = (index === 1) === isTemplates;
              return (
                <span key={label} className={isOn ? "is-on" : undefined}>
                  {isOn && (
                    <motion.i
                      layoutId="wk-st-segment"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}
                  <b>{label}</b>
                </span>
              );
            },
          )}
        </div>
        <span className="wk-st-primary">
          <Plus weight="bold" />
          New Template
          <CaretDown />
        </span>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={isTemplates ? "templates" : "projects"}
            className="wk-st-rate-list"
            initial={{ opacity: 0, x: isTemplates ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isTemplates ? -30 : 30 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          >
            {(isTemplates ? rateSheets.slice().reverse() : rateSheets).map(
              (sheet) => (
                <article className="wk-st-rate" key={sheet.name}>
                  <b>
                    {isTemplates
                      ? sheet.name.replace("PRS", "template")
                      : sheet.name}
                  </b>
                  <p className="wk-st-meta">
                    {isTemplates ? "Template" : `Project: ${sheet.project}`}
                  </p>
                  <div className="wk-st-counts">
                    {sheet.counts.map((count, index) => (
                      <span
                        key={countLabels[index]}
                        className={`is-${index}${count === 0 ? " is-zero" : ""}`}
                      >
                        {count} {countLabels[index]}
                      </span>
                    ))}
                  </div>
                  <p className="wk-st-meta">Created: {sheet.created}</p>
                </article>
              ),
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <TabBar active="rates" />
    </PhoneFrame>
  );
}

function CostsPhone({ isActive }: { isActive: boolean }) {
  const sections = [
    {
      title: "Labour",
      tone: "labour",
      rows: [
        { name: "J. Smith", sub: "Foreman · 9 hrs @ $95", amount: 855 },
        { name: "R. Diaz", sub: "Operator · 9 hrs @ $65", amount: 585 },
      ],
      total: 1440,
    },
    {
      title: "Equipment",
      tone: "equipment",
      rows: [{ name: "210 Excavator", sub: "9 hrs @ $210", amount: 1890 }],
      total: 1890,
    },
    {
      title: "Materials",
      tone: "materials",
      rows: [
        { name: '3/4" gravel', sub: "5 m3 @ $30 · 10% markup", amount: 165 },
      ],
      total: 165,
    },
  ];

  return (
    <PhoneFrame className="is-right">
      <div className="wk-st-body">
        {sections.map((section, sectionIndex) => (
          <motion.section
            className="wk-st-panel"
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={isActive ? { opacity: 1, y: 0 } : undefined}
            transition={{
              delay: 0.2 + sectionIndex * 0.15,
              type: "spring",
              stiffness: 200,
              damping: 24,
            }}
          >
            <p className="wk-st-section-title">
              <i className={`is-${section.tone}`} />
              {section.title}
            </p>
            {section.rows.map((row) => (
              <div className="wk-st-line" key={row.name}>
                <span>
                  <b>{row.name}</b>
                  <small>{row.sub}</small>
                </span>
                <b>${row.amount.toLocaleString("en-US")}</b>
              </div>
            ))}
            <div className="wk-st-total">
              Total
              <b>
                <CountUp
                  value={section.total}
                  decimals={2}
                  prefix="$"
                  isActive={isActive}
                />
              </b>
            </div>
          </motion.section>
        ))}
      </div>
      <TabBar active="lems" />
    </PhoneFrame>
  );
}

export function SubTrackShowcase() {
  const [theme, setTheme] = useState<Theme>("light");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.3 });
  const reduceMotion = useReducedMotion();
  const isPlaying = isInView && !reduceMotion;

  return (
    <div className="wk-showcase wk-st-showcase" ref={ref}>
      <div className="wk-theme-switch" role="group" aria-label="App theme">
        {(["light", "dark"] as const).map((option) => (
          <button
            type="button"
            key={option}
            aria-pressed={theme === option}
            onClick={() => setTheme(option)}
          >
            {theme === option && (
              <motion.i
                layoutId="wk-theme-pill"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <span>
              {option === "light" ? <Sun /> : <Moon />}
              {option === "light" ? "Light" : "Dark"}
            </span>
          </button>
        ))}
      </div>
      <p className="sr-only">
        The SubTrack app on three phones. One plays a short flow: the daily
        ticket list, a tap into a ticket, then the create menu sliding up. The
        others show rate sheets and a ticket’s labour, equipment and materials
        totals.
      </p>
      <Tilt className="wk-st-stage" max={5}>
        <div className="wk-st-phones" data-theme={theme} aria-hidden="true">
          <RatesPhone isActive={isPlaying} />
          <FlowPhone isActive={isPlaying} />
          <CostsPhone isActive={isInView} />
        </div>
      </Tilt>
    </div>
  );
}
