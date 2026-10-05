import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CalendarBlank,
  CaretDown,
  Check,
  ClipboardText,
  FolderSimple,
  List,
  MagnifyingGlass,
  Percent,
  Plus,
} from "@phosphor-icons/react";

function Flag() {
  return (
    <svg className="st-flag" viewBox="0 0 16 11" aria-hidden="true">
      <rect width="16" height="11" fill="#b22234" />
      <path
        d="M0 1.6h16M0 3.9h16M0 6.2h16M0 8.5h16"
        stroke="#fff"
        strokeWidth="1.1"
      />
      <rect width="7" height="5.6" fill="#3c3b6e" />
    </svg>
  );
}

function SubTrackMark() {
  return <span className="subtrack-mark st-mark" aria-hidden="true" />;
}

function StatusIcons() {
  return (
    <span className="st-status-icons" aria-hidden="true">
      <svg className="st-signal" viewBox="0 0 18 12">
        <rect x="0" y="7.5" width="3" height="4.5" rx="0.6" />
        <rect x="5" y="5" width="3" height="7" rx="0.6" />
        <rect x="10" y="2.5" width="3" height="9.5" rx="0.6" />
        <rect x="15" y="0" width="3" height="12" rx="0.6" />
      </svg>
      <svg className="st-wifi" viewBox="0 0 16 12">
        <path d="M8 2.15c2.5 0 4.75.96 6.42 2.52l-1.42 1.34A6.9 6.9 0 0 0 8 4.3c-1.82 0-3.48.7-4.72 1.85L1.86 4.8A8.8 8.8 0 0 1 8 2.15Z" />
        <path d="M8 6.05c1.42 0 2.7.55 3.66 1.44L10.24 8.8A3.5 3.5 0 0 0 8 7.85c-.86 0-1.64.3-2.26.8L4.32 7.32A5 5 0 0 1 8 6.05Z" />
        <circle cx="8" cy="10.45" r="1.25" />
      </svg>
      <svg className="st-battery" viewBox="0 0 28 13">
        <rect
          x="0.7"
          y="0.7"
          width="22.6"
          height="11.6"
          rx="2.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <rect x="2.4" y="2.35" width="16" height="8.3" rx="1.1" />
        <rect x="24.5" y="4.15" width="2.1" height="4.7" rx="0.8" />
      </svg>
    </span>
  );
}

const tickets = [
  {
    id: "LEM-20260911-002",
    status: "In Progress",
    tone: "progress",
    total: "$1,662.00",
    meta: "2026-Sep-11  ·  Project J  ·  Client A",
  },
  {
    id: "LEM-20260911-001",
    status: "In Progress",
    tone: "progress",
    total: "$2,715.00",
    meta: "2026-Sep-11  ·  Project D  ·  Client B",
  },
  {
    id: "LEM-20260810-001",
    status: "Pending client approval",
    tone: "pending",
    total: "$1,662.00",
    meta: "2026-Aug-10  ·  Project J  ·  Client A",
  },
];

function CrewPhone() {
  return (
    <div className="device device-back">
      <div className="device-screen st-screen-green">
        <div className="st-status">
          <span>2:23</span>
          <StatusIcons />
        </div>
        <div className="st-top">
          <span className="st-brand">
            <SubTrackMark />
            SubTrack
          </span>
          <span className="st-lang">
            <Flag />
            EN
          </span>
        </div>
        <div className="st-progress" aria-hidden="true">
          <span className="is-done" />
          <span className="is-on" />
          <span />
        </div>
        <div className="st-steps">
          <span>Field problems</span>
          <span className="is-on">Crew size</span>
          <span>Your details</span>
        </div>
        <h3>How big is your crew?</h3>
        <div className="st-choices">
          <span>Just me</span>
          <span>2-5</span>
          <span>6-15</span>
          <span className="is-selected">16+</span>
        </div>
        <div className="st-crew-foot">
          <span className="st-back">
            <ArrowLeft size={16} />
          </span>
          <span className="st-continue">Continue</span>
        </div>
      </div>
    </div>
  );
}

function TicketPhone() {
  return (
    <div className="device device-front">
      <div className="device-screen st-screen-light">
        <div className="st-status is-dark">
          <span>2:22</span>
          <StatusIcons />
        </div>
        <div className="st-sheet">
          <div className="st-field">
            <FolderSimple size={15} />
            <span>Filter by Project or Client</span>
            <CaretDown size={12} />
          </div>
          <div className="st-field">
            <MagnifyingGlass size={15} />
            <span className="is-placeholder">Search</span>
          </div>
          <div className="st-split">
            <div className="st-field">
              <span>All</span>
              <CaretDown size={12} />
            </div>
            <div className="st-field st-voided">
              <i />
              Voided
            </div>
          </div>
          <div className="st-field">
            <CalendarBlank size={15} />
            <span>Sort by Work Date</span>
            <CaretDown size={12} />
          </div>
          <div className="st-new">
            <Plus size={14} weight="bold" />
            New Ticket
          </div>
          {tickets.map((ticket, index) => (
            <article
              className={`st-card${index === 0 ? " is-linked" : ""}`}
              key={ticket.id}
            >
              <div className="st-card-top">
                <strong>{ticket.id}</strong>
                <b>{ticket.total}</b>
              </div>
              <span className={`st-pill is-${ticket.tone}`}>{ticket.status}</span>
              <p>{ticket.meta}</p>
              <div className="st-card-actions">
                <span>
                  More <CaretDown size={11} />
                </span>
                <span>Open</span>
              </div>
            </article>
          ))}
        </div>
        <div className="st-tabbar">
          <span className="st-tab">
            <List size={15} />
            Menu
          </span>
          <span className="st-tab">
            <Percent size={15} />
            Rates
          </span>
          <span className="st-plus">
            <Plus size={15} weight="bold" />
          </span>
          <span className="st-tab is-on">
            <ClipboardText size={15} />
            LEMs
          </span>
          <span className="st-tab">
            <span className="st-bell">
              <Bell size={15} />
              <i>9</i>
            </span>
            Alerts
          </span>
        </div>
      </div>
    </div>
  );
}

const deskLines = [
  {
    label: "Labor",
    detail: "J. Smith, Foreman · 8.0 hrs @ $95",
    amount: "$760.00",
    color: "#1e4a3b",
  },
  {
    label: "Equipment",
    detail: "210 Excavator · 4.0 hrs @ $130",
    amount: "$520.00",
    color: "#2f6f86",
  },
  {
    label: "Materials",
    detail: "Pipe and bedding",
    amount: "$382.00",
    color: "#8d5a2b",
  },
];

function DeskLine({
  label,
  detail,
  amount,
  color,
  compact = false,
}: {
  label: string;
  detail?: string;
  amount: string;
  color: string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "st-sum-line" : "st-desk-line"}>
      <i style={{ background: color }} />
      <span>
        <strong>{label}</strong>
        {detail && <small>{detail}</small>}
      </span>
      <b>{amount}</b>
    </div>
  );
}

function SubTrackDesk() {
  return (
    <div className="st-laptop">
      <div className="st-desk">
        <div className="st-desk-screen">
          <div className="st-desk-bar">
            <span className="st-desk-chip">Project manager</span>
          </div>
          <div className="st-desk-body">
            <header className="st-desk-head">
              <div>
                <strong>LEM-20260911-002</strong>
                <p>2026-Sep-11 · Project J · Client A</p>
              </div>
              <em className="st-pill is-progress">In Progress</em>
            </header>
            <div className="st-desk-facts">
              <span>
                <small>Crew</small>
                <b>16+</b>
              </span>
              <span>
                <small>Work date</small>
                <b>Sep 11</b>
              </span>
              <span>
                <small>Foreman</small>
                <b>J. Smith</b>
              </span>
              <span>
                <small>Client</small>
                <b>Client A</b>
              </span>
            </div>
            <div className="st-desk-split">
              <div className="st-desk-lines">
                {deskLines.map((line) => (
                  <DeskLine key={line.label} {...line} />
                ))}
              </div>
              <aside className="st-desk-summary">
                <p className="st-desk-kicker">Cost summary</p>
                {deskLines.map((line) => (
                  <DeskLine
                    key={line.label}
                    compact
                    label={line.label}
                    amount={line.amount}
                    color={line.color}
                  />
                ))}
                <div className="st-desk-total">
                  <span>Charge-out</span>
                  <strong>$1,662.00</strong>
                </div>
                <div className="st-desk-actions">
                  <span>Send back</span>
                  <span className="is-approve">
                    <Check size={14} weight="bold" />
                    Approve
                  </span>
                </div>
              </aside>
            </div>
            <div className="st-desk-note">
              <p className="st-desk-kicker">From the field</p>
              <p>
                Toolbox talk at 7:00, before anyone went in the trench. Covered
                shoring, spotters, and overhead lines. No incidents.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SubTrackField() {
  return (
    <div className="st-track">
      <p className="sr-only">
        SubTrack on a phone and on the desk. The phone asks how big the crew
        is, with 16+ selected, and lists field tickets, including
        LEM-20260911-002 in progress for $1,662. On the desktop that ticket
        shows labor at $760, equipment at $520, and materials at $382. The
        field note records a 7:00 toolbox talk on trench shoring, spotters,
        and overhead lines, with no incidents.
      </p>
      <div className="st-scene" aria-hidden="true">
        <div className="st-phones">
          <div className="field-cluster">
            <CrewPhone />
            <TicketPhone />
          </div>
        </div>
        <SubTrackDesk />
      </div>
    </div>
  );
}

export function NurishdSite() {
  return (
    <div className="nd-stage">
      <p className="sr-only">
        Nurish’d homepage. The headline is Healthy Meal Plans and Dietitian
        Appointments, with a free assessment button, Jenn’s meal plan, and a
        note that 95% of users pay nothing for nutrition counselling.
      </p>
      <div className="nd-browser" aria-hidden="true">
        <div className="nd-bar">
          <span className="nd-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="nd-url">nurishd.store</span>
        </div>
        <div className="nd-page">
          <div className="nd-nav">
            <img src="/assets/nurishd-logo.png" alt="" />
            <span className="nd-nav-links">
              <b>Home</b>
              <span>Nutrition</span>
              <span>Wellness</span>
              <span>Resources</span>
            </span>
            <span className="nd-nav-end">
              <span>Log in</span>
              <span className="nd-pill">Free Assessment</span>
            </span>
          </div>
          <div className="nd-hero">
            <div className="nd-copy">
              <h3>
                Healthy Meal Plans &
                <br />
                Dietitian Appointments
              </h3>
              <p>
                Nutrition isn’t one-size-fits-all. Get personalized tools and
                expert guidance to help you reach your goals with confidence.
              </p>
              <span className="nd-pill nd-pill-lg">
                Free 15 Minute Assessment
                <ArrowRight size={14} />
              </span>
              <p className="nd-proof">
                <Check size={13} weight="bold" />
                95% of Nurish'd users pay $0 for Nutrition Counselling
              </p>
            </div>
            <div className="nd-meals">
              <div className="nd-meals-head">
                <span className="nd-plan-mark" aria-hidden="true">
                  <svg viewBox="0 0 35 35">
                    <path
                      d="M 9.333 35 C 4.179 35 0 30.821 0 25.667 L 0 9.333 C 0 4.179 4.179 0 9.333 0 L 25.667 0 C 30.821 0 35 4.179 35 9.333 L 35 25.667 C 35 30.821 30.821 35 25.667 35 Z"
                      fill="rgb(210,251,208)"
                    />
                    <path
                      d="M 17.501 9.917 C 17.501 8.735 16.543 7.778 15.362 7.778 L 9.917 7.778 C 8.736 7.778 7.779 8.735 7.779 9.917 L 7.779 15.431 C 7.779 16.612 8.736 17.57 9.917 17.57 L 15.362 17.57 C 16.543 17.57 17.501 18.528 17.501 19.709 L 17.501 25.083 C 17.501 26.265 18.458 27.222 19.64 27.222 L 25.084 27.222 C 26.265 27.222 27.223 26.265 27.223 25.083 L 27.223 19.569 C 27.223 18.388 26.265 17.43 25.084 17.43 L 19.64 17.43 C 18.458 17.43 17.501 16.472 17.501 15.291 Z"
                      fill="rgb(1,184,1)"
                    />
                  </svg>
                </span>
                <strong>Jenn's Meal Plan</strong>
              </div>
              <div className="nd-meal-row">
                <img src="/assets/nurishd-burrito.png" alt="" />
                <span>
                  Breakfast Burrito
                  <small>Breakfast</small>
                </span>
              </div>
              <div className="nd-meal-row">
                <img src="/assets/nurishd-brisket.png" alt="" />
                <span>
                  Beef Brisket
                  <small>Dinner</small>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
