import { useEffect, useState, type ReactNode, type Ref } from "react";
import {
  ArrowUpRight,
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
  List,
  Moon,
  Sun,
  X,
} from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type Theme = "light" | "dark";

export type CraftIcon = {
  title: string;
  slug: string;
  path: string;
};

export const CONTACT_EMAIL = "mailto:jeandrev1414@gmail.com";

// Root-relative so the same links work from the home page and the /work pages.
const navItems = [
  { href: "/#now", label: "Now" },
  { href: "/#path", label: "Experience" },
  { href: "/#work", label: "Work" },
  { href: "/work", label: "Process" },
  { href: "/#education", label: "Education" },
];

export function BrandMark({ icon }: { icon: CraftIcon }) {
  return (
    <svg
      className="craft-brand"
      viewBox="0 0 24 24"
      role="img"
      aria-label={icon.title}
    >
      <path d={icon.path} />
    </svg>
  );
}

function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: Theme;
  onToggle: () => void;
}) {
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      className="icon-button"
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { y: 16 }}
      whileInView={{ y: 0 }}
      viewport={{ once: true, amount: 0.08, margin: "80px 0px" }}
      transition={{
        type: "spring",
        stiffness: 88,
        damping: 20,
        delay: reduceMotion ? 0 : delay,
      }}
    >
      {children}
    </motion.div>
  );
}

export function SubTrackMark({ label = false }: { label?: boolean }) {
  return (
    <span className="subtrack-lockup">
      <img className="subtrack-mark" src="/subtrack-logo.svg" alt="" />
      {label && <span>SubTrack</span>}
    </span>
  );
}

export function SiteNav({
  currentHref,
  homeHref = "/",
  portraitRef,
  initialsRef,
}: {
  /** Nav item to mark as the current page. */
  currentHref?: string;
  homeHref?: string;
  /** Portrait that scales into the mark as the hero photo scrolls away. */
  portraitRef?: Ref<HTMLImageElement>;
  initialsRef?: Ref<HTMLSpanElement>;
}) {
  const [theme, setTheme] = useState<Theme>(
    () => (document.documentElement.dataset.theme as Theme) || "dark",
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    meta?.setAttribute("content", theme === "dark" ? "#0c0c0b" : "#f7f7f4");
  }, [theme]);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
  };

  const closeMenu = () => setMenuOpen(false);
  const currentFor = (href: string) =>
    href === currentHref ? ("page" as const) : undefined;

  return (
    <>
      <motion.header
        className="nav-wrap"
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
      >
        <nav className="nav-island" aria-label="Primary navigation">
          <a
            className="brand-mark"
            href={homeHref}
            aria-label="Jeandré Visser home"
          >
            <span ref={initialsRef}>JV</span>
            {portraitRef && (
              <img
                ref={portraitRef}
                className="nav-portrait"
                src="/assets/jeandre.webp"
                alt=""
                width="36"
                height="36"
              />
            )}
          </a>
          <div className="nav-links">
            {navItems.map((item) => (
              <a
                href={item.href}
                key={item.href}
                aria-current={currentFor(item.href)}
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="nav-actions">
            <a className="nav-contact" href={CONTACT_EMAIL}>
              Get in touch
            </a>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <button
              className="icon-button menu-toggle"
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? (
                <X size={18} weight="bold" />
              ) : (
                <List size={18} weight="bold" />
              )}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <div className="mobile-nav" id="mobile-nav">
            <motion.button
              className="mobile-nav-backdrop"
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.22 }}
              onClick={closeMenu}
            />
            <motion.aside
              className="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={reduceMotion ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={reduceMotion ? undefined : { x: "100%" }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 34,
                mass: 0.85,
              }}
            >
              <div className="mobile-nav-links">
                {navItems.map((item, index) => (
                  <motion.a
                    href={item.href}
                    key={item.href}
                    aria-current={currentFor(item.href)}
                    onClick={closeMenu}
                    initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 220,
                      damping: 24,
                      delay: reduceMotion ? 0 : 0.06 + index * 0.05,
                    }}
                  >
                    {item.label}
                  </motion.a>
                ))}
              </div>
              <a
                className="button button-primary mobile-nav-contact"
                href={CONTACT_EMAIL}
                onClick={closeMenu}
              >
                Get in touch
                <ArrowUpRight size={17} />
              </a>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export function SocialLinks() {
  return (
    <div className="social-links">
      <a
        href="https://github.com/jeandre-visser"
        target="_blank"
        rel="noreferrer"
      >
        <GithubLogo size={28} />
        GitHub
      </a>
      <a
        href="http://www.linkedin.com/in/jeandre-visser"
        target="_blank"
        rel="noreferrer"
      >
        <LinkedinLogo size={28} />
        LinkedIn
      </a>
      <a href={CONTACT_EMAIL}>
        <EnvelopeSimple size={28} />
        Email
      </a>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer shell">
      <span>Jeandré Visser</span>
      <span>Co-Founder, product engineer, CPO.</span>
    </footer>
  );
}
