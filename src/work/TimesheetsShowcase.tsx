import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  CaretLeft,
  CaretRight,
  ChartBar,
  ClipboardText,
  Clock,
  FolderSimple,
  HardHat,
  HandGrabbing,
  Plus,
  Users,
  Wrench,
} from "@phosphor-icons/react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useInView,
  useReducedMotion,
  type PanInfo,
} from "motion/react";
import { BrowserFrame, MacCursor } from "./Kit";
import { useMediaQuery, useSequence } from "./hooks";

type Card = {
  id: string;
  worker: number;
  day: number;
  hours: number;
  project: "north" | "site4" | "pipeline";
};

const workers = [
  { name: "J. Smith", role: "Foreman", initials: "JS" },
  { name: "R. Diaz", role: "Operator", initials: "RD" },
  { name: "K. Lee", role: "Labourer", initials: "KL" },
  { name: "M. Chen", role: "Labourer", initials: "MC" },
];

const days = [
  { label: "Mon", date: 12 },
  { label: "Tue", date: 13 },
  { label: "Wed", date: 14 },
  { label: "Thu", date: 15 },
  { label: "Fri", date: 16 },
];

const projectNames: Record<Card["project"], string> = {
  north: "North yard",
  site4: "Site 4 grading",
  pipeline: "Pipeline tie-in",
};

const initialCards: Card[] = [
  { id: "a1", worker: 0, day: 0, hours: 10, project: "north" },
  { id: "a2", worker: 0, day: 1, hours: 10, project: "north" },
  { id: "a3", worker: 0, day: 3, hours: 8, project: "site4" },
  { id: "b1", worker: 1, day: 0, hours: 9, project: "north" },
  { id: "b2", worker: 1, day: 2, hours: 9, project: "site4" },
  { id: "b3", worker: 1, day: 4, hours: 6, project: "pipeline" },
  { id: "c1", worker: 2, day: 1, hours: 7.5, project: "north" },
  { id: "c2", worker: 2, day: 2, hours: 8, project: "site4" },
  { id: "d1", worker: 3, day: 0, hours: 8, project: "pipeline" },
  { id: "d2", worker: 3, day: 3, hours: 8, project: "pipeline" },
];

/** Scripted moves for the demo; each one is undone by the next. */
const demoMoves = [
  { id: "c2", to: { worker: 2, day: 3 } },
  { id: "c2", to: { worker: 2, day: 2 } },
  { id: "b3", to: { worker: 3, day: 4 } },
  { id: "b3", to: { worker: 1, day: 4 } },
];
/** idle → point at card → lift → carry → drop */
const DEMO_STEPS = [1400, 800, 350, 900, 900];

type Point = { x: number; y: number };

const cellKey = (worker: number, day: number) => `${worker}-${day}`;
/** Drop target for a whole day; used by the phone layout's day tabs. */
const dayKey = (day: number) => `day:${day}`;

const applyMoves = (base: Card[], moves: typeof demoMoves) =>
  moves.reduce(
    (current, demoMove) =>
      current.map((card) =>
        card.id === demoMove.id ? { ...card, ...demoMove.to } : card,
      ),
    base,
  );
const formatHours = (hours: number) =>
  `${Number.isInteger(hours) ? hours : hours.toFixed(1)}h`;

function Total({ value }: { value: number }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.b
        key={value}
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
      >
        {formatHours(value)}
      </motion.b>
    </AnimatePresence>
  );
}

function TimeCard({
  card,
  isLifted,
  isDraggable,
  onDragStart,
  onDrag,
  onDragEnd,
}: {
  card: Card;
  isLifted: boolean;
  isDraggable: boolean;
  onDragStart: () => void;
  onDrag: (point: Point) => void;
  onDragEnd: (card: Card, point: Point) => void;
}) {
  return (
    <motion.div
      layoutId={card.id}
      className={`wk-ts-card is-${card.project}`}
      data-card={card.id}
      drag={isDraggable}
      dragSnapToOrigin
      dragElastic={0.6}
      dragMomentum={false}
      onDragStart={onDragStart}
      onDrag={(_, info: PanInfo) => onDrag(info.point)}
      onDragEnd={(_, info: PanInfo) => onDragEnd(card, info.point)}
      whileDrag={{
        scale: 1.06,
        rotate: -2,
        zIndex: 20,
        boxShadow: "0 14px 30px rgb(0 0 0 / 22%)",
      }}
      animate={
        isLifted
          ? {
              scale: 1.06,
              rotate: -2,
              zIndex: 20,
              boxShadow: "0 14px 30px rgb(0 0 0 / 22%)",
            }
          : {
              scale: 1,
              rotate: 0,
              zIndex: 1,
              boxShadow: "0 1px 2px rgb(0 0 0 / 6%)",
            }
      }
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
    >
      <b>{formatHours(card.hours)}</b>
      <span>{projectNames[card.project]}</span>
    </motion.div>
  );
}

export function TimesheetsShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.35 });
  const reduceMotion = useReducedMotion();
  const [cards, setCards] = useState(initialCards);
  const [isAuto, setIsAuto] = useState(true);
  const [hoverCell, setHoverCell] = useState<string | null>(null);
  const [step, setStep] = useSequence(
    DEMO_STEPS,
    isInView && isAuto && !reduceMotion,
  );
  const [moveIndex, setMoveIndex] = useState(0);
  const [cursor, setCursor] = useState<Point | null>(null);
  const [selectedDay, setSelectedDay] = useState(2);
  const isCompact = useMediaQuery("(max-width: 720px)");

  const move = demoMoves[moveIndex];
  const isDemoLifted = isAuto && (step === 2 || step === 3);

  // Advance to the next scripted move once a drop finishes and the cycle wraps.
  const previousStep = useRef(step);
  useEffect(() => {
    if (
      isAuto &&
      step === 0 &&
      previousStep.current === DEMO_STEPS.length - 1
    ) {
      setMoveIndex((index) => (index + 1) % demoMoves.length);
    }
    previousStep.current = step;
  }, [isAuto, step]);

  // Demo positions are derived: completed moves this cycle, plus the current one once carried.
  const beforeMove = isAuto
    ? applyMoves(cards, demoMoves.slice(0, moveIndex))
    : cards;
  const shownCards =
    isAuto && step >= 3 ? applyMoves(beforeMove, [move]) : beforeMove;
  const origin = beforeMove.find((card) => card.id === move.id);

  // On phones the demo drops on a day tab when the day changes, otherwise on a crew row.
  const demoTargetKey =
    isCompact && origin && origin.day !== move.to.day
      ? dayKey(move.to.day)
      : cellKey(move.to.worker, move.to.day);

  // The phone layout follows the demo card to its day.
  const visibleDay = isAuto
    ? (shownCards.find((card) => card.id === move.id)?.day ?? selectedDay)
    : selectedDay;

  // Keep the demo cursor on the card it is moving.
  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid || !isAuto || step === 0) return;
    const target =
      step >= 3
        ? grid.querySelector<HTMLElement>(`[data-cell="${demoTargetKey}"]`)
        : grid.querySelector<HTMLElement>(`[data-card="${move.id}"]`);
    if (!target) return;
    const gridBox = grid.getBoundingClientRect();
    const box = target.getBoundingClientRect();
    setCursor({
      x: ((box.left + box.width * 0.55 - gridBox.left) / gridBox.width) * 100,
      y: ((box.top + box.height * 0.5 - gridBox.top) / gridBox.height) * 100,
    });
  }, [isAuto, step, move, moveIndex, cards, demoTargetKey, isCompact]);

  const cellAt = (point: Point) => {
    const hit = document
      .elementsFromPoint(point.x - window.scrollX, point.y - window.scrollY)
      .find(
        (element) => element instanceof HTMLElement && element.dataset.cell,
      );
    return hit instanceof HTMLElement ? (hit.dataset.cell ?? null) : null;
  };

  const onDrag = (point: Point) => {
    const key = cellAt(point);
    if (key !== hoverCell) setHoverCell(key);
  };

  const onDragEnd = (card: Card, point: Point) => {
    setHoverCell(null);
    const key = cellAt(point);
    if (!key) return;
    const isDayTab = key.startsWith("day:");
    const [worker, day] = isDayTab
      ? [card.worker, Number(key.slice(4))]
      : key.split("-").map(Number);
    if (worker === card.worker && day === card.day) return;
    if (isDayTab) setSelectedDay(day);
    setCards((current) =>
      current.map((item) =>
        item.id === card.id ? { ...item, worker, day } : item,
      ),
    );
  };

  const takeOver = () => {
    if (!isAuto) return;
    setCards(shownCards);
    setIsAuto(false);
    setStep(0);
    setCursor(null);
  };

  const workerTotal = (worker: number) =>
    shownCards
      .filter((card) => card.worker === worker)
      .reduce((sum, card) => sum + card.hours, 0);
  const dayTotal = (day: number) =>
    shownCards
      .filter((card) => card.day === day)
      .reduce((sum, card) => sum + card.hours, 0);
  const weekTotal = shownCards.reduce((sum, card) => sum + card.hours, 0);
  const demoTarget = isAuto && step === 3 ? demoTargetKey : null;
  const isTarget = (key: string) => hoverCell === key || demoTarget === key;

  const renderCard = (card: Card) => (
    <TimeCard
      key={card.id}
      card={card}
      isLifted={isDemoLifted && card.id === move.id}
      isDraggable={!reduceMotion}
      onDragStart={takeOver}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
    />
  );

  const demoCursor = cursor && isAuto && step !== 0 && (
    <motion.span
      className="wk-cursor wk-ts-cursor"
      initial={false}
      animate={{
        left: `${cursor.x}%`,
        top: `${cursor.y}%`,
        scale: step === 2 || step === 3 ? 0.88 : 1,
      }}
      transition={{
        left: { duration: 0.75, ease: [0.45, 0, 0.2, 1] },
        top: { duration: 0.75, ease: [0.45, 0, 0.2, 1] },
        scale: { type: "spring", stiffness: 600, damping: 22 },
      }}
    >
      <MacCursor />
    </motion.span>
  );

  const worker = (index: number) => (
    <span className="wk-ts-worker">
      <i>{workers[index].initials}</i>
      <span>
        <b>{workers[index].name}</b>
        <small>{workers[index].role}</small>
      </span>
    </span>
  );

  return (
    <div className="wk-showcase wk-ts-showcase" ref={ref}>
      <p className="sr-only">
        SubTrack timesheets, a week view of the crew. Time cards sit under each
        day and can be dragged to another day or worker; daily and weekly hour
        totals update as they move.
      </p>
      <BrowserFrame
        url="app.subtrackfield.com/timesheets"
        className="wk-ts-browser"
      >
        <div className="wk-ts-app">
          <aside className="wk-ts-rail" aria-hidden="true">
            <span className="wk-sw-logo" />
            {[
              <ClipboardText key="l" />,
              <Clock key="t" />,
              <FolderSimple key="p" />,
              <Users key="c" />,
              <ChartBar key="r" />,
              <HardHat key="w" />,
              <Wrench key="e" />,
            ].map((icon, index) => (
              <span key={index} className={index === 1 ? "is-on" : undefined}>
                {icon}
              </span>
            ))}
          </aside>
          <div className="wk-ts-main">
            <header className="wk-ts-header">
              <span>
                <b>Timesheets</b>
                <small>North yard crew</small>
              </span>
              <span className="wk-ts-week" aria-hidden="true">
                <i>
                  <CaretLeft weight="bold" />
                </i>
                Oct 12 to 16, 2026
                <i>
                  <CaretRight weight="bold" />
                </i>
              </span>
              <span className="wk-ts-views" aria-hidden="true">
                <span className="is-on">Week</span>
                <span>Month</span>
              </span>
              <span className="wk-ts-add" aria-hidden="true">
                <Plus weight="bold" />
                Add time
              </span>
            </header>

            <LayoutGroup>
              {isCompact ? (
                <div
                  className="wk-ts-mobile"
                  ref={gridRef}
                  onPointerDown={takeOver}
                >
                  <div className="wk-ts-days">
                    {days.map((day, dayIndex) => (
                      <button
                        type="button"
                        key={day.label}
                        data-cell={dayKey(dayIndex)}
                        data-target={isTarget(dayKey(dayIndex))}
                        aria-pressed={visibleDay === dayIndex}
                        onClick={() => setSelectedDay(dayIndex)}
                      >
                        {visibleDay === dayIndex && (
                          <motion.i
                            layoutId="wk-ts-day"
                            transition={{
                              type: "spring",
                              stiffness: 420,
                              damping: 34,
                            }}
                          />
                        )}
                        <span>{day.label}</span>
                        <b>{day.date}</b>
                        <small>
                          <Total value={dayTotal(dayIndex)} />
                        </small>
                      </button>
                    ))}
                  </div>
                  <div className="wk-ts-list">
                    {workers.map((_, workerIndex) => {
                      const key = cellKey(workerIndex, visibleDay);
                      const rowCards = shownCards.filter(
                        (card) =>
                          card.worker === workerIndex &&
                          card.day === visibleDay,
                      );
                      return (
                        <div
                          className="wk-ts-mrow"
                          key={workers[workerIndex].name}
                          data-cell={key}
                          data-target={isTarget(key)}
                        >
                          {worker(workerIndex)}
                          <div className="wk-ts-mcards">
                            {rowCards.map(renderCard)}
                            {rowCards.length === 0 && (
                              <span className="wk-ts-empty">No time</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="wk-ts-mfoot">
                    Week total
                    <span>
                      <Total value={weekTotal} />
                    </span>
                  </div>
                  {demoCursor}
                </div>
              ) : (
                <div
                  className="wk-ts-grid"
                  ref={gridRef}
                  onPointerDown={takeOver}
                >
                  <span className="wk-ts-corner">Crew</span>
                  {days.map((day) => (
                    <span className="wk-ts-day" key={day.label}>
                      {day.label}
                      <b>{day.date}</b>
                    </span>
                  ))}
                  <span className="wk-ts-corner is-end">Week</span>

                  {workers.map((_, workerIndex) => (
                    <div className="wk-ts-row" key={workers[workerIndex].name}>
                      {worker(workerIndex)}
                      {days.map((day, dayIndex) => {
                        const key = cellKey(workerIndex, dayIndex);
                        return (
                          <div
                            className="wk-ts-cell"
                            data-cell={key}
                            data-target={isTarget(key)}
                            key={day.label}
                          >
                            {shownCards
                              .filter(
                                (card) =>
                                  card.worker === workerIndex &&
                                  card.day === dayIndex,
                              )
                              .map(renderCard)}
                          </div>
                        );
                      })}
                      <span className="wk-ts-weektotal">
                        <Total value={workerTotal(workerIndex)} />
                      </span>
                    </div>
                  ))}

                  <span className="wk-ts-corner is-foot">Day total</span>
                  {days.map((day, dayIndex) => (
                    <span className="wk-ts-daytotal" key={day.label}>
                      <Total value={dayTotal(dayIndex)} />
                    </span>
                  ))}
                  <span className="wk-ts-daytotal is-week">
                    <Total value={weekTotal} />
                  </span>
                  {demoCursor}
                </div>
              )}
            </LayoutGroup>
          </div>
        </div>
      </BrowserFrame>
      <p className="wk-ts-hint">
        <HandGrabbing weight="bold" />
        Time cards move between days and crew members, and the totals follow
      </p>
    </div>
  );
}
