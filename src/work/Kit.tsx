import {
  Fragment,
  useEffect,
  useRef,
  type PointerEvent,
  type ReactNode,
} from "react";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Headline whose words rise out of a mask one after another. */
export function WordsReveal({
  text,
  delay = 0,
  isOnView = false,
}: {
  text: string;
  delay?: number;
  /** Play when scrolled into view instead of on mount. */
  isOnView?: boolean;
}) {
  const words = text.split(" ");
  const variants = {
    hidden: { y: "110%", rotate: 4 },
    visible: (index: number) => ({
      y: "0%",
      rotate: 0,
      transition: {
        type: "spring" as const,
        stiffness: 110,
        damping: 18,
        delay: delay + index * 0.06,
      },
    }),
  };

  // The in-view check sits on the wrapper: each word starts clipped by its
  // mask, so watching the words themselves would never fire.
  return (
    <>
      <span className="sr-only">{text}</span>
      <motion.span
        className="wk-words"
        aria-hidden="true"
        initial="hidden"
        animate={isOnView ? undefined : "visible"}
        whileInView={isOnView ? "visible" : undefined}
        viewport={{ once: true, amount: 0.5 }}
      >
        {words.map((word, index) => (
          <Fragment key={`${word}-${index}`}>
            <span className="wk-word">
              <motion.span custom={index} variants={variants}>
                {word}
              </motion.span>
            </span>
            {/* A real space keeps copied text readable. */}
            {index < words.length - 1 && " "}
          </Fragment>
        ))}
      </motion.span>
    </>
  );
}

/** Tilts its children toward the mouse. Does nothing for touch or reduced motion. */
export function Tilt({
  children,
  className,
  max = 6,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 140, damping: 18, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), spring);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), spring);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - box.left) / box.width - 0.5);
    y.set((event.clientY - box.top) / box.height - 0.5);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={className}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      style={
        reduceMotion
          ? undefined
          : { rotateX, rotateY, transformPerspective: 1400 }
      }
    >
      {children}
    </motion.div>
  );
}

function formatCount(
  value: number,
  decimals: number,
  prefix: string,
  suffix: string,
) {
  const number = value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return `${prefix}${number}${suffix}`;
}

/** Counts from zero to `value` when `isActive` turns on. */
export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  isActive = true,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  isActive?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const format = (current: number) =>
    formatCount(current, decimals, prefix, suffix);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduceMotion || !isActive) {
      node.textContent = formatCount(
        isActive ? value : 0,
        decimals,
        prefix,
        suffix,
      );
      return;
    }
    const controls = animate(0, value, {
      duration: 1.2,
      ease: EASE,
      onUpdate: (current) => {
        node.textContent = formatCount(current, decimals, prefix, suffix);
      },
    });
    return () => controls.stop();
  }, [value, isActive, reduceMotion, decimals, prefix, suffix]);

  return (
    <span ref={ref} className="wk-num">
      {format(reduceMotion ? value : 0)}
    </span>
  );
}

function StatusIcons() {
  return (
    <span className="wk-status-icons">
      <svg viewBox="0 0 18 12">
        <rect x="0" y="7.5" width="3" height="4.5" rx="0.7" />
        <rect x="5" y="5" width="3" height="7" rx="0.7" />
        <rect x="10" y="2.5" width="3" height="9.5" rx="0.7" />
        <rect x="15" y="0" width="3" height="12" rx="0.7" />
      </svg>
      <svg viewBox="0 0 16 12">
        <path d="M8 2.2c2.4 0 4.6.9 6.2 2.5l1.3-1.4A10.6 10.6 0 0 0 8 .3 10.6 10.6 0 0 0 .5 3.3l1.3 1.4A8.7 8.7 0 0 1 8 2.2Zm0 3.8c1.4 0 2.6.5 3.6 1.4l1.3-1.4A7 7 0 0 0 8 4.1 7 7 0 0 0 3.1 6l1.3 1.4C5.4 6.5 6.6 6 8 6Zm0 3.7c.5 0 1 .2 1.3.5L8 11.7l-1.3-1.5c.3-.3.8-.5 1.3-.5Z" />
      </svg>
      <svg viewBox="0 0 27 12">
        <rect
          x="0.6"
          y="0.6"
          width="22.8"
          height="10.8"
          rx="3.2"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.4"
          strokeWidth="1.1"
        />
        <rect x="2.3" y="2.3" width="19.4" height="7.4" rx="1.8" />
        <rect x="24.5" y="4" width="2" height="4" rx="0.8" opacity="0.45" />
      </svg>
    </span>
  );
}

export function PhoneFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`wk-phone ${className}`}>
      <div className="wk-phone-screen">
        <div className="wk-status">
          <span>9:41</span>
          <span className="wk-island" />
          <StatusIcons />
        </div>
        {children}
      </div>
    </div>
  );
}

export function BrowserFrame({
  url,
  children,
  className = "",
}: {
  url: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`wk-browser ${className}`}>
      <div className="wk-browser-bar">
        <span className="wk-browser-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="wk-browser-url">{url}</span>
      </div>
      <div className="wk-browser-body">{children}</div>
    </div>
  );
}

/** macOS-style arrow pointer. */
export function MacCursor() {
  return (
    <svg className="wk-mac-cursor" viewBox="0 0 18 26" aria-hidden="true">
      <path d="M1.6 1.6v19.6l4.7-4.5 3.1 7.2 3.4-1.5-3.1-7.1h6.6Z" />
    </svg>
  );
}
