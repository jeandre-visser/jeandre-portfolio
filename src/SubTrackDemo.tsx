import { useEffect, useRef, useState } from 'react'
import {
  Bell,
  Briefcase,
  CaretDown,
  ClipboardText,
  DotsThree,
  File,
  HardHat,
  Plus,
  Receipt,
  Wrench,
} from '@phosphor-icons/react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react'

const LABOR = 760
const EQUIPMENT = 1040
const MATERIALS = 825
const SUBS = 1560
const TOTAL = LABOR + EQUIPMENT + MATERIALS + SUBS

const TIMELINE = [720, 1500, 2280, 3040, 3800, 4560, 5600, 7400] as const
const LOOP_AT = 12400

const easeOut = [0.22, 1, 0.36, 1] as const
const workflowEase = [0.22, 0.72, 0.18, 1] as const
const workflowTransition = { duration: 0.55, ease: workflowEase }

const photos = [
  {
    src: '/assets/subtrack-field.png',
    alt: 'Crew working a trench with excavation equipment',
  },
  {
    src: '/assets/building-now.jpg',
    alt: 'Active construction site',
  },
  {
    src: '/assets/building-now-poster.jpg',
    alt: 'Aerial view of earthworks',
  },
]

function formatMoney(value: number) {
  return `$${value.toLocaleString('en-US')}`
}

function Money({
  value,
  play,
  reduced,
}: {
  value: number
  play: boolean
  reduced: boolean
}) {
  const [shown, setShown] = useState(reduced ? value : 0)
  const shownRef = useRef(reduced ? value : 0)

  useEffect(() => {
    if (reduced) {
      shownRef.current = value
      setShown(value)
      return
    }
    if (!play) {
      shownRef.current = 0
      setShown(0)
      return
    }

    let frame = 0
    const from = shownRef.current
    const start = performance.now()
    const duration = 720
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) ** 3
      const next = Math.round(from + (value - from) * eased)
      shownRef.current = next
      setShown(next)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [play, reduced, value])

  return <>{formatMoney(shown)}</>
}

function LineItem({
  color,
  title,
  hint,
  name,
  detail,
  show,
}: {
  color: string
  title: string
  hint: string
  name: string
  detail: string
  show: boolean
}) {
  return (
    <div className={`lem-rowcard${show ? '' : ' is-collapsed'}`}>
      <div className="lem-rowcard-head">
        <span className="lem-title">
          <span className="lem-dot" style={{ background: color }} />
          {title}
        </span>
        <span className="lem-hint">{hint}</span>
      </div>
      {show && (
        <motion.div
          className="lem-entry"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, ease: easeOut }}
        >
          <span>{name}</span>
          <span>{detail}</span>
        </motion.div>
      )}
    </div>
  )
}

export function SubTrackDemo() {
  const rootRef = useRef<HTMLDivElement>(null)
  const inView = useInView(rootRef, { amount: 0.28 })
  const reduceMotion = useReducedMotion()
  const reduced = Boolean(reduceMotion)
  const [step, setStep] = useState(reduced ? 8 : 0)
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    if (reduced) {
      setStep(8)
      return
    }
    if (!inView) return

    setStep(0)
    const timers = [
      ...TIMELINE.map((ms, index) =>
        setTimeout(() => setStep(index + 1), ms),
      ),
      setTimeout(() => setCycle((current) => current + 1), LOOP_AT),
    ]
    return () => timers.forEach(clearTimeout)
  }, [cycle, inView, reduced])

  const showProject = step >= 1
  const showLabor = step >= 2
  const showEquipment = step >= 3
  const showMaterials = step >= 4
  const showSubs = step >= 5
  const showDocs = step >= 6
  const showSubmit = step >= 7
  const showDone = step >= 8

  const runningTotal =
    (showLabor ? LABOR : 0) +
    (showEquipment ? EQUIPMENT : 0) +
    (showMaterials ? MATERIALS : 0) +
    (showSubs ? SUBS : 0)

  return (
    <div
      ref={rootRef}
      className="lem-demo"
      role="img"
      aria-label="SubTrack ticket filling in for a water main replacement: labor, equipment, materials, and subcontractors totaling $4,185"
    >
      <header className="lem-nav">
        <div className="lem-nav-left">
          <span className="lem-company">
            SubTrack
            <CaretDown size={14} weight="bold" />
          </span>
          <span className="lem-role">Admin</span>
          <span className="lem-role">Project Manager</span>
        </div>
        <div className="lem-nav-right">
          <span className="lem-more">
            <DotsThree size={16} weight="bold" />
            <CaretDown size={12} weight="bold" />
          </span>
          <span className="lem-bell">
            <Bell size={16} />
            <span>5</span>
          </span>
        </div>
      </header>

      <div className="lem-shell">
        <aside className="lem-sidebar">
          <span className="lem-plus">
            <Plus size={18} weight="bold" />
          </span>
          <span className="lem-icon is-active">
            <ClipboardText size={20} weight="regular" />
          </span>
          <span className="lem-icon">
            <Briefcase size={20} />
          </span>
          <span className="lem-icon">
            <HardHat size={20} />
          </span>
          <span className="lem-icon">
            <Wrench size={20} />
          </span>
          <span className="lem-avatar">J</span>
        </aside>

        <div className="lem-body" key={cycle}>
          <div className="lem-ticket">
            <div className="lem-project">
              <span className="lem-kicker">Project</span>
              <div className="lem-select">
                <span className={showProject ? 'is-filled' : 'is-placeholder'}>
                  {showProject
                    ? 'Water Main Replacement'
                    : 'Select a project…'}
                </span>
                <CaretDown size={14} weight="bold" />
              </div>
              <div className="lem-meta">
                <div>
                  <span>Client</span>
                  <strong className={showProject ? 'is-on' : ''}>
                    {showProject ? 'City Municipal' : '—'}
                  </strong>
                </div>
                <div>
                  <span>PO</span>
                  <strong className={showProject ? 'is-on' : ''}>
                    {showProject ? 'PO-4521' : '—'}
                  </strong>
                </div>
              </div>
            </div>

            <div className="lem-lines">
              <LineItem
                color="#00742b"
                title="Labor"
                hint="Hours & rates"
                name="J. Smith, Foreman"
                detail="8.0 reg @ $95"
                show={showLabor}
              />
              <LineItem
                color="#126dfb"
                title="Equipment"
                hint="Operator hours"
                name="210 Excavator"
                detail="8.0 hrs @ $130"
                show={showEquipment}
              />
              <LineItem
                color="#e91e63"
                title="Materials"
                hint="Qty & markup"
                name="Gravel, 50 tons"
                detail="$750 + 10% markup"
                show={showMaterials}
              />
              <LineItem
                color="#e65100"
                title="Subcontractors"
                hint="Passed to client"
                name="Hydrovac"
                detail="8.0 hrs @ $195"
                show={showSubs}
              />
            </div>

            <div className={`lem-docs${showDocs ? ' is-on' : ''}`}>
              <span className="lem-docs-label">Site documentation</span>
              <div className="lem-docs-row">
                <div className="lem-file">
                  <File size={18} weight="fill" />
                  <span>PDF</span>
                </div>
                <div className="lem-file is-receipt">
                  <Receipt size={18} weight="fill" />
                  <span>RCPT</span>
                </div>
                {photos.map((photo) => (
                  <img
                    key={photo.src}
                    src={photo.src}
                    alt=""
                    width="120"
                    height="80"
                  />
                ))}
              </div>
            </div>
          </div>

          <aside className="lem-summary">
            <p className="lem-summary-kicker">Cost summary</p>
            <div className="lem-totals">
              <div>
                <span>
                  <i style={{ background: '#00742b' }} />
                  Labor
                </span>
                <b>
                  <Money value={LABOR} play={showLabor} reduced={reduced} />
                </b>
              </div>
              <div>
                <span>
                  <i style={{ background: '#126dfb' }} />
                  Equipment
                </span>
                <b>
                  <Money
                    value={EQUIPMENT}
                    play={showEquipment}
                    reduced={reduced}
                  />
                </b>
              </div>
              <div>
                <span>
                  <i style={{ background: '#e91e63' }} />
                  Materials
                </span>
                <b>
                  <Money
                    value={MATERIALS}
                    play={showMaterials}
                    reduced={reduced}
                  />
                </b>
              </div>
              <div>
                <span>
                  <i style={{ background: '#e65100' }} />
                  Subcontractors
                </span>
                <b>
                  <Money value={SUBS} play={showSubs} reduced={reduced} />
                </b>
              </div>
            </div>

            <div className="lem-charge">
              <span>Charge-out total</span>
              <strong>
                <Money
                  value={reduced ? TOTAL : runningTotal}
                  play={showLabor}
                  reduced={reduced}
                />
              </strong>
            </div>

            <div className="lem-workflow">
              <AnimatePresence mode="sync" initial={false}>
                {showDone ? (
                  <motion.div
                    className="lem-complete"
                    key="done"
                    initial={reduced ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={workflowTransition}
                  >
                    <motion.span
                      className="lem-status"
                      initial={reduced ? false : { opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...workflowTransition, delay: 0.06 }}
                    >
                      Completed
                    </motion.span>
                    <motion.div
                      className="lem-actions"
                      initial={reduced ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...workflowTransition, delay: 0.14 }}
                    >
                      <span className="lem-reject">Reject</span>
                      <span className="lem-approve">Approve</span>
                    </motion.div>
                    <motion.small
                      initial={reduced ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.45, delay: 0.28, ease: workflowEase }}
                    >
                      Ready for final approval
                    </motion.small>
                  </motion.div>
                ) : showSubmit ? (
                  <motion.span
                    className="lem-submit"
                    key="submit"
                    initial={reduced ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={workflowTransition}
                  >
                    Submit for approval
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
