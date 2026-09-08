import { useEffect, useState, type ReactNode } from 'react'
import { SubTrackDemo } from './SubTrackDemo'
import {
  ArrowDownRight,
  ArrowUpRight,
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
  List,
  Moon,
  Sun,
  X,
} from '@phosphor-icons/react'
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useReducedMotion,
} from 'motion/react'
import {
  siFastapi,
  siFigma,
  siGit,
  siJavascript,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPython,
  siReact,
  siTailwindcss,
  siTypescript,
  siVite,
  type SimpleIcon,
} from 'simple-icons'

type Theme = 'light' | 'dark'

const experiences = [
  {
    period: 'Nov 2025-present',
    role: 'Co-Founder & CPO / Product Engineer',
    company: 'SubTrack',
    logo: 'subtrack',
    href: 'https://www.subtrackfield.com/',
    detail:
      'Own product direction, product design, and frontend delivery for field-first construction SaaS.',
    featured: true,
  },
  {
    period: '2023-2025',
    role: 'Intermediate Full Stack Developer',
    company: 'Nurish’d',
    logo: '/assets/nurishd-logo.png',
    href: 'https://www.nurishd.store/',
    detail:
      'Built food-as-medicine product experiences across TypeScript, Next.js, Python, and FastAPI.',
  },
  {
    period: '2022-2023',
    role: 'Jr. Full Stack Developer',
    company: 'nutrimeals',
    logo: '/assets/nutrimeals-logo.png',
    href: 'https://nutrimeals.ca/',
    detail:
      'Shipped customer-facing features and internal workflows for a growing prepared-meal platform.',
  },
  {
    period: '2020-2022',
    role: 'Junior Project Manager',
    company: 'TerraLogix Solutions',
    logo: '/assets/terralogix.png',
    href: 'https://www.terralogix.ca/',
    detail:
      'Worked close to field operations, schedules, and the realities that now shape how I build software.',
  },
  {
    period: '2017-2019',
    role: 'Junior Operator',
    company: 'Cenovus Energy',
    logo: '/assets/cenovus.png',
    href: 'https://www.cenovus.com/',
    detail:
      'Built an early understanding of oil and gas operations, field teams, and safety-led work.',
  },
]

const work = [
  {
    title: 'SubTrack',
    type: 'Product engineer / Frontend / UI UX',
    description:
      'Field-first software that turns labor, equipment, and materials into approved, billable records.',
    href: 'https://www.subtrackfield.com/',
    subtrackLogo: true,
  },
  {
    title: 'Nurish’d',
    type: 'Full stack / Product delivery',
    description:
      'A nutrition care platform connecting meal plans, dietitian appointments, health tracking, and food-as-medicine.',
    href: 'https://www.nurishd.store/',
    brandLogo: '/assets/nurishd-logo.png',
  },
]

const craft = [
  {
    title: 'Product & UI',
    note: 'Product strategy, interaction design, prototyping, design systems',
    icons: [siFigma],
  },
  {
    title: 'Frontend',
    note: 'React, Next.js, TypeScript, Tailwind, accessible interfaces',
    icons: [siReact, siNextdotjs, siTypescript, siTailwindcss],
  },
  {
    title: 'Backend',
    note: 'Python, FastAPI, Node.js, PostgreSQL, API design',
    icons: [siPython, siFastapi, siNodedotjs, siPostgresql],
  },
  {
    title: 'Tools',
    note: 'Git, Vite, JavaScript, delivery from idea to production',
    icons: [siGit, siVite, siJavascript],
  },
]

const navItems = [
  { href: '#now', label: 'Now' },
  { href: '#path', label: 'Experience' },
  { href: '#work', label: 'Work' },
  { href: '#education', label: 'Education' },
]

function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: Theme
  onToggle: () => void
}) {
  const nextTheme = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      className="icon-button"
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}

function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        type: 'spring',
        stiffness: 88,
        damping: 20,
        delay: reduceMotion ? 0 : delay,
      }}
    >
      {children}
    </motion.div>
  )
}

function SubTrackMark({ label = false }: { label?: boolean }) {
  return (
    <span className="subtrack-lockup">
      <span className="subtrack-mark" aria-hidden="true" />
      {label && <span>SubTrack</span>}
    </span>
  )
}

function TechIcon({ icon }: { icon: SimpleIcon }) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-label={icon.title}
      className="tech-icon"
    >
      <path d={icon.path} fill="currentColor" />
    </svg>
  )
}

function useIsNarrow(query = '(max-width: 720px)') {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )

  useEffect(() => {
    const media = window.matchMedia(query)
    const onChange = () => setMatches(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [query])

  return matches
}

function PortraitStack({ reduceMotion }: { reduceMotion: boolean | null }) {
  const isNarrow = useIsNarrow()
  const spring = {
    type: 'spring' as const,
    stiffness: 58,
    damping: 18,
    mass: 0.95,
  }
  const viewport = { once: true, amount: 0.45, margin: '0px 0px -8% 0px' }

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
          type: 'spring',
          stiffness: 64,
          damping: 18,
          mass: 0.85,
          delay: reduceMotion ? 0 : 0.04,
        }}
      >
        <img
          src="/assets/jeandre.jpg"
          alt="Jeandré Visser"
          width="1024"
          height="1024"
          fetchPriority="high"
        />
      </motion.figure>
    </div>
  )
}

function App() {
  const [theme, setTheme] = useState<Theme>(
    () => (document.documentElement.dataset.theme as Theme) || 'dark',
  )
  const [menuOpen, setMenuOpen] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    )
    meta?.setAttribute('content', theme === 'dark' ? '#0c0c0b' : '#f7f7f4')
  }, [theme])

  useEffect(() => {
    if (!menuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    document.documentElement.dataset.theme = nextTheme
    document.documentElement.style.colorScheme = nextTheme
    localStorage.setItem('theme', nextTheme)
    setTheme(nextTheme)
  }

  const closeMenu = () => setMenuOpen(false)

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <motion.header
        className="nav-wrap"
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      >
        <nav className="nav-island" aria-label="Primary navigation">
          <a className="brand-mark" href="#top" aria-label="Jeandré Visser home">
            JV
          </a>
          <div className="nav-links">
            {navItems.map((item) => (
              <a href={item.href} key={item.href}>
                {item.label}
              </a>
            ))}
          </div>
          <div className="nav-actions">
            <a className="nav-contact" href="mailto:jeandrev1414@gmail.com">
              Get in touch
            </a>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <button
              className="icon-button menu-toggle"
              type="button"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
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
              initial={reduceMotion ? false : { x: '100%' }}
              animate={{ x: 0 }}
              exit={reduceMotion ? undefined : { x: '100%' }}
              transition={{
                type: 'spring',
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
                    onClick={closeMenu}
                    initial={reduceMotion ? false : { opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      type: 'spring',
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
                href="mailto:jeandrev1414@gmail.com"
                onClick={closeMenu}
              >
                Get in touch
                <ArrowUpRight size={17} />
              </a>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <main id="main">
        <section className="hero shell" id="top">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
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
            <p className="hero-statement">
              I design, build, and ship product.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#work">
                View work
                <ArrowDownRight size={17} />
              </a>
              <a
                className="button button-secondary"
                href="mailto:jeandrev1414@gmail.com"
              >
                Get in touch
              </a>
            </div>
          </motion.div>

          <PortraitStack reduceMotion={reduceMotion} />
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
                T&M and LEM software built for crews who need proof before the
                invoice.
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
                  experience.featured ? 'is-featured' : ''
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
                      {experience.logo === 'subtrack' ? (
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
              Two products shaped by hands-on fullstack work, product thinking,
              and close attention to the people using them.
            </p>
          </Reveal>

          <div className="work-grid">
            {work.map((project, index) => (
              <Reveal
                className="work-item"
                delay={index * 0.05}
                key={project.title}
              >
                <motion.a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -3 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                >
                  <div className="work-meta">
                    <div>
                      <h3>
                        {project.subtrackLogo && <SubTrackMark />}
                        {project.brandLogo && (
                          <img
                            className="work-brand-logo"
                            src={project.brandLogo}
                            alt=""
                            aria-hidden="true"
                          />
                        )}
                        {project.title}
                      </h3>
                      <p className="work-type">{project.type}</p>
                    </div>
                    <ArrowUpRight size={20} />
                  </div>
                  <p className="work-description">{project.description}</p>
                </motion.a>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section craft-section shell" id="craft">
          <Reveal>
            <h2>How the work gets made.</h2>
          </Reveal>

          <div className="craft-grid">
            {craft.map((group, index) => (
              <Reveal
                className="craft-group"
                delay={index * 0.04}
                key={group.title}
              >
                <div className="craft-icons" aria-label={`${group.title} tools`}>
                  {group.icons.map((icon) => (
                    <TechIcon icon={icon} key={icon.slug} />
                  ))}
                </div>
                <h3>{group.title}</h3>
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
              <a href="mailto:jeandrev1414@gmail.com">
                <EnvelopeSimple size={28} />
                Email
              </a>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="footer shell">
        <span>Jeandré Visser</span>
        <span>Co-Founder, product engineer, CPO.</span>
      </footer>
    </MotionConfig>
  )
}

export default App
