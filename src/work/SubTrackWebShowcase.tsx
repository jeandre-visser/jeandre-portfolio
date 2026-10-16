import { useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Buildings,
  CalendarBlank,
  CaretDown,
  CaretRight,
  ChartBar,
  ClipboardText,
  FolderSimple,
  Gear,
  HardHat,
  MagnifyingGlass,
  Package,
  Percent,
  Plus,
  UserCheck,
  UserGear,
  Users,
  Wrench,
} from "@phosphor-icons/react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import { BrowserFrame, CountUp, Tilt } from "./Kit";
import { useSequence } from "./hooks";

type Tone = "neutral" | "info" | "warning" | "success" | "danger";

type Ticket = {
  id: string;
  date: string;
  project: string;
  status: string;
  tone: Tone;
  client: string;
  total: number;
  labor: number;
  equipment: number;
  materials: number;
};

const tickets: Ticket[] = [
  {
    id: "LEM-20261013-001",
    date: "2026-Oct-13",
    project: "North yard",
    status: "Pending client approval",
    tone: "warning",
    client: "Client A",
    total: 6427.5,
    labor: 2172.5,
    equipment: 3780,
    materials: 475,
  },
  {
    id: "LEM-20261011-002",
    date: "2026-Oct-11",
    project: "Pipeline tie-in",
    status: "In Progress",
    tone: "neutral",
    client: "Client B",
    total: 487.5,
    labor: 487.5,
    equipment: 0,
    materials: 0,
  },
  {
    id: "LEM-20261008-001",
    date: "2026-Oct-08",
    project: "Site 4 grading",
    status: "Submitted",
    tone: "info",
    client: "Client C",
    total: 9840,
    labor: 3120,
    equipment: 5940,
    materials: 780,
  },
  {
    id: "LEM-20260920-002",
    date: "2026-Sep-20",
    project: "Site 4 grading",
    status: "Approved",
    tone: "success",
    client: "Client C",
    total: 15165.5,
    labor: 5205.5,
    equipment: 8610,
    materials: 1350,
  },
  {
    id: "LEM-20260918-003",
    date: "2026-Sep-18",
    project: "Culvert repair",
    status: "Rejected",
    tone: "danger",
    client: "Client A",
    total: 2310,
    labor: 1440,
    equipment: 720,
    materials: 150,
  },
  {
    id: "LEM-20260915-001",
    date: "2026-Sep-15",
    project: "North yard",
    status: "Approved",
    tone: "success",
    client: "Client A",
    total: 4120,
    labor: 1980,
    equipment: 1890,
    materials: 250,
  },
];

const projects = [
  { name: "All projects", count: 24 },
  { name: "North yard", count: 9 },
  { name: "Pipeline tie-in", count: 5 },
  { name: "Site 4 grading", count: 7 },
  { name: "Culvert repair", count: 3 },
];

const workspaceNav = [
  { label: "LEMs", icon: <ClipboardText /> },
  { label: "Projects", icon: <FolderSimple /> },
  { label: "Clients", icon: <Users /> },
  { label: "Reports", icon: <ChartBar /> },
];

const resourceNav = [
  { label: "Workers", icon: <HardHat /> },
  { label: "Equipment", icon: <Wrench /> },
  { label: "Materials", icon: <Package /> },
  { label: "Subcontractors", icon: <UserCheck /> },
  { label: "Rate Sheets", icon: <Percent /> },
];

// Line items for the toured ticket; they add up to its labor and equipment totals.
const laborRows = [
  { worker: "J. Smith", position: "Foreman", hours: 10, rate: 95 },
  { worker: "R. Diaz", position: "Operator", hours: 9, rate: 85 },
  { worker: "K. Lee", position: "Labourer", hours: 7.5, rate: 61 },
];
const equipmentRows = [
  { name: "210 Excavator · 9 hrs", amount: 1890 },
  { name: "Tandem dump truck · 9 hrs", amount: 1890 },
];

/** list → hover → expand → open detail → back */
const TOUR_STEPS = [1600, 900, 2200, 4200];
const TOUR_ROW = 0;

const money = (value: number) =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function StatusPill({ status, tone }: { status: string; tone: Tone }) {
  return (
    <span className={`wk-sw-pill is-${tone}`}>
      <i />
      {status}
    </span>
  );
}

function Rail() {
  return (
    <aside className="wk-sw-rail">
      <span className="wk-sw-wordmark">
        <span className="wk-sw-logo" aria-hidden="true" />
        SubTrack
      </span>
      <span className="wk-sw-cta">
        <Plus weight="bold" />
        New LEM
      </span>
      <p className="wk-sw-heading">Workspace</p>
      {workspaceNav.map((item, index) => (
        <span
          className={`wk-sw-link${index === 0 ? " is-on" : ""}`}
          key={item.label}
        >
          {item.icon}
          {item.label}
        </span>
      ))}
      <p className="wk-sw-heading">Resources</p>
      {resourceNav.map((item) => (
        <span className="wk-sw-link" key={item.label}>
          {item.icon}
          {item.label}
        </span>
      ))}
      <div className="wk-sw-rail-foot">
        <span>
          <Buildings />
          Company
        </span>
        <span>
          <UserGear />
          Team
        </span>
        <span>
          <Gear />
          Settings
        </span>
      </div>
    </aside>
  );
}

function TicketTable({
  hovered,
  expanded,
  onOpen,
}: {
  hovered?: number;
  expanded?: number;
  onOpen: (index: number) => void;
}) {
  return (
    <motion.div
      className="wk-sw-tablecard"
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
    >
      <div className="wk-sw-row is-head">
        <span />
        <span>ID</span>
        <span>Work Date</span>
        <span>Project</span>
        <span>Status</span>
        <span>Client</span>
        <span className="is-num">Total</span>
      </div>
      {tickets.map((ticket, index) => (
        <div key={ticket.id} className="wk-sw-rowwrap">
          <button
            type="button"
            className="wk-sw-row"
            data-hover={hovered === index}
            onClick={() => onOpen(index)}
            aria-label={`Open ${ticket.id}`}
          >
            <motion.span
              className="wk-sw-chevron"
              animate={{ rotate: expanded === index ? 90 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 26 }}
            >
              <CaretRight weight="bold" />
            </motion.span>
            <span className="wk-sw-id">{ticket.id}</span>
            <span className="is-muted">{ticket.date}</span>
            <span>{ticket.project}</span>
            <span>
              <StatusPill status={ticket.status} tone={ticket.tone} />
            </span>
            <span className="is-muted">{ticket.client}</span>
            <span className="is-num">{money(ticket.total)}</span>
          </button>
          <AnimatePresence initial={false}>
            {expanded === index && (
              <motion.div
                className="wk-sw-expand"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
              >
                <div className="wk-sw-expand-inner">
                  {[
                    { label: "Labor", value: ticket.labor, tone: "labor" },
                    {
                      label: "Equipment",
                      value: ticket.equipment,
                      tone: "equipment",
                    },
                    {
                      label: "Materials",
                      value: ticket.materials,
                      tone: "materials",
                    },
                  ].map((part) => (
                    <span key={part.label}>
                      <i className={`is-${part.tone}`} />
                      {part.label}
                      <b>{money(part.value)}</b>
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
      <div className="wk-sw-tablefoot">
        <span>24 LEMs</span>
        <span className="wk-sw-pager">
          <i>
            <ArrowLeft />
          </i>
          <i>
            <ArrowRight />
          </i>
        </span>
      </div>
    </motion.div>
  );
}

function TicketDetail({
  ticket,
  onBack,
}: {
  ticket: Ticket;
  onBack: () => void;
}) {
  const isToured = ticket.id === tickets[TOUR_ROW].id;
  const labor = isToured
    ? laborRows
    : [{ worker: "Crew", position: "Mixed", hours: 1, rate: ticket.labor }];
  const equipment = isToured
    ? equipmentRows
    : ticket.equipment > 0
      ? [{ name: "Equipment", amount: ticket.equipment }]
      : [];
  const summary = [
    { label: "Labor", value: ticket.labor, tone: "labor" },
    { label: "Equipment", value: ticket.equipment, tone: "equipment" },
    { label: "Materials", value: ticket.materials, tone: "materials" },
  ];

  return (
    <motion.div
      className="wk-sw-detail"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
    >
      <button type="button" className="wk-sw-back" onClick={onBack}>
        <ArrowLeft weight="bold" />
        Back
      </button>
      <div className="wk-sw-panel wk-sw-detail-head">
        <span>
          <b>{ticket.id}</b>
          <StatusPill status={ticket.status} tone={ticket.tone} />
        </span>
        <span className="wk-sw-actions">
          <i>Sign</i>
          <i className="is-solid">Submit</i>
        </span>
      </div>
      <div className="wk-sw-detail-grid">
        <div className="wk-sw-panel">
          <p className="wk-sw-section">
            <i className="is-labor" />
            Labor
          </p>
          <div className="wk-sw-subtable">
            <span className="is-head">Worker</span>
            <span className="is-head">Position</span>
            <span className="is-head is-num">Reg. Hrs</span>
            <span className="is-head is-num">Reg. Rate</span>
            <span className="is-head is-num">Subtotal</span>
            {labor.map((row, index) => (
              <motion.span
                className="wk-sw-subrow"
                key={row.worker}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.08 }}
              >
                <span>{row.worker}</span>
                <span className="is-muted">{row.position}</span>
                <span className="is-num">{row.hours}</span>
                <span className="is-num">{money(row.rate)}</span>
                <span className="is-num">{money(row.hours * row.rate)}</span>
              </motion.span>
            ))}
          </div>
          <p className="wk-sw-section">
            <i className="is-equipment" />
            Equipment
          </p>
          {equipment.map((row) => (
            <div className="wk-sw-line" key={row.name}>
              <span>{row.name}</span>
              <b>{money(row.amount)}</b>
            </div>
          ))}
        </div>
        <aside className="wk-sw-side">
          <div className="wk-sw-panel">
            <p className="wk-sw-card-title">Details</p>
            <dl>
              <dt>Date</dt>
              <dd>{ticket.date}</dd>
              <dt>Project</dt>
              <dd>{ticket.project}</dd>
              <dt>Client</dt>
              <dd>{ticket.client}</dd>
            </dl>
          </div>
          <div className="wk-sw-panel">
            <p className="wk-sw-card-title">Summary</p>
            {summary.map((part) => (
              <div className="wk-sw-sum" key={part.label}>
                <span>
                  <i className={`is-${part.tone}`} />
                  {part.label}
                </span>
                <b>
                  <CountUp value={part.value} decimals={2} prefix="$" />
                </b>
              </div>
            ))}
            <div className="wk-sw-sum is-total">
              <span>Total</span>
              <b>
                <CountUp value={ticket.total} decimals={2} prefix="$" />
              </b>
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
}

export function SubTrackWebShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.35 });
  const reduceMotion = useReducedMotion();
  const [opened, setOpened] = useState<number | null | undefined>(undefined);
  const [step] = useSequence(
    TOUR_STEPS,
    isInView && !reduceMotion && opened === undefined,
  );

  // undefined means the tour is driving; a number or null means the viewer took over.
  const isTour = opened === undefined;
  const openIndex = isTour ? (step === 3 ? TOUR_ROW : null) : opened;
  const hovered = isTour && step >= 1 && step <= 2 ? TOUR_ROW : undefined;
  const expanded = isTour && step === 2 ? TOUR_ROW : undefined;

  return (
    <div className="wk-showcase wk-sw-showcase" ref={ref}>
      <p className="sr-only">
        The SubTrack web app. A dark sidebar holds the workspace and resources.
        A table lists daily tickets with their work date, project, status,
        client and total. Opening a ticket shows its labor and equipment with a
        cost summary.
      </p>
      <Tilt max={2.5}>
        <BrowserFrame
          url="app.subtrackfield.com/lems"
          className="wk-sw-browser"
        >
          <div className="wk-sw-app">
            <Rail />
            <aside className="wk-sw-context">
              <div className="wk-sw-tabs">
                <span className="is-on">
                  Projects <i>4</i>
                </span>
                <span>
                  Clients <i>3</i>
                </span>
              </div>
              <span className="wk-sw-input">
                <MagnifyingGlass />
                Search
              </span>
              {projects.map((project, index) => (
                <span
                  className={`wk-sw-project${index === 0 ? " is-on" : ""}`}
                  key={project.name}
                >
                  {index === 0 ? <ClipboardText /> : <FolderSimple />}
                  {project.name}
                  <i>{project.count}</i>
                </span>
              ))}
            </aside>
            <div className="wk-sw-main">
              <header className="wk-sw-header">
                <span className="wk-sw-org">
                  <span className="wk-sw-orglogo">CA</span>
                  Company A
                  <CaretDown />
                  <i>Project Manager</i>
                </span>
                <span className="wk-sw-header-end">
                  <Bell />
                  <small>Fri Oct 16, 2026</small>
                </span>
              </header>
              <div className="wk-sw-toolbar">
                <span className="wk-sw-input is-wide">
                  <MagnifyingGlass />
                  Search LEMs by ID or location
                </span>
                <span className="wk-sw-iconbtn">
                  <CalendarBlank />
                </span>
                <span className="wk-sw-select">
                  Status: All <CaretDown />
                </span>
                <span className="wk-sw-toggle">
                  <i />
                  Voided
                </span>
              </div>
              <div className="wk-sw-view">
                <AnimatePresence mode="wait" initial={false}>
                  {openIndex === null || openIndex === undefined ? (
                    <TicketTable
                      key="table"
                      hovered={hovered}
                      expanded={expanded}
                      onOpen={(index) => setOpened(index)}
                    />
                  ) : (
                    <TicketDetail
                      key="detail"
                      ticket={tickets[openIndex]}
                      onBack={() => setOpened(null)}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </BrowserFrame>
      </Tilt>
      {!isTour && (
        <button
          type="button"
          className="wk-replay-demo"
          onClick={() => setOpened(undefined)}
        >
          Play the tour again
          <ArrowRight weight="bold" />
        </button>
      )}
    </div>
  );
}
