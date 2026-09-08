import { useEffect, useState, type ReactNode } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
  Moon,
  Sun,
} from '@phosphor-icons/react'
import { motion, MotionConfig, useReducedMotion } from 'motion/react'
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
    detail:
      'Own product direction, product design, and frontend delivery for field-first T&M and LEM software.',
    featured: true,
  },
  {
    period: '2023-2025',
    role: 'Intermediate Full Stack Developer',
    company: 'Nurish’d',
    logo: '/assets/nurishd-logo.png',
    detail:
      'Built food-as-medicine product experiences across TypeScript, Next.js, Python, and FastAPI.',
  },
  {
    period: '2022-2023',
    role: 'Jr. Full Stack Developer',
    company: 'nutrimeals',
    logo: '/assets/nutrimeals-logo.png',
    detail:
      'Shipped customer-facing features and internal workflows for a growing prepared-meal platform.',
  },
  {
    period: '2020-2022',
    role: 'Junior Project Manager',
    company: 'TerraLogix Solutions',
    logo: '/assets/terralogix.png',
    detail:
      'Worked close to field operations, schedules, and the realities that now shape how I build software.',
  },
  {
    period: '2017-2019',
    role: 'Junior Operator',
    company: 'Cenovus Energy',
    logo: '/assets/cenovus.png',
    detail:
      'Built an early understanding of oil and gas operations, field teams, and safety-led work.',
  },
]

const work = [
  {
    title: 'SubTrack',
    type: 'Product leadership / Frontend',
    description:
      'Field-first software that turns labor, equipment, and materials into approved, billable records.',
    image: '/assets/subtrack-field.png',
    href: 'https://www.subtrackfield.com/',
    className: 'work-featured',
    alt: 'Construction crew working beside an open trench and excavation equipment',
    subtrackLogo: true,
  },
  {
    title: 'Nurish’d',
    type: 'Full stack / Product delivery',
    description:
      'A nutrition care platform connecting meal plans, dietitian appointments, health tracking, and food-as-medicine.',
    image: '/assets/nurishd-homepage.png',
    href: 'https://www.nurishd.store/',
    className: 'work-wide',
    alt: 'Nurish’d nutrition care platform homepage',
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

function App() {
  const [theme, setTheme] = useState<Theme>(
    () => (document.documentElement.dataset.theme as Theme) || 'light',
  )

  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    )
    meta?.setAttribute('content', theme === 'dark' ? '#0c0c0b' : '#f7f7f4')
  }, [theme])

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    document.documentElement.dataset.theme = nextTheme
    document.documentElement.style.colorScheme = nextTheme
    localStorage.setItem('theme', nextTheme)
    setTheme(nextTheme)
  }

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
            <a href="#now">Now</a>
            <a href="#path">Path</a>
            <a href="#work">Work</a>
          </div>
          <div className="nav-actions">
            <a className="nav-contact" href="mailto:jeandrev1414@gmail.com">
              Get in touch
            </a>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </nav>
      </motion.header>

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
            <h1>Jeandré Visser.</h1>
            <p className="hero-statement">
              I design and ship the product field crews actually use.
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

          <motion.figure
            className="portrait-frame"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 70,
              damping: 20,
              delay: 0.18,
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
        </section>

        <section className="section shell" id="now">
          <Reveal>
            <p className="eyebrow">Building now</p>
            <h2>Software that starts in the field.</h2>
          </Reveal>

          <Reveal className="featured-bezel" delay={0.08}>
            <div className="featured-media">
              <img
                src="/assets/building-now.jpg"
                alt="Excavators and haul trucks working on an active construction site"
                width="1024"
                height="576"
                loading="lazy"
              />
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
                    <span className="company">
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
                    </span>
                  </div>
                  <p>{experience.detail}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section shell" id="work">
          <Reveal className="work-heading">
            <h2>Selected work.</h2>
            <p>
              Two products shaped by hands-on frontend work, product thinking,
              and close attention to the people using them.
            </p>
          </Reveal>

          <div className="work-grid">
            {work.map((project, index) => (
              <Reveal
                className={`work-item ${project.className}`}
                delay={index * 0.05}
                key={project.title}
              >
                <motion.a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                >
                  <div className="work-image">
                    <img
                      src={project.image}
                      alt={project.alt}
                      loading="lazy"
                      width="1200"
                      height="760"
                    />
                  </div>
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
            <h2>Craft, grouped by the work.</h2>
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
            <h2>Let’s build something people will use.</h2>
            <a
              className="contact-email"
              href="mailto:jeandrev1414@gmail.com"
            >
              Get in touch
              <ArrowUpRight size={30} />
            </a>
            <div className="social-links">
              <a
                href="https://github.com/jeandre-visser"
                target="_blank"
                rel="noreferrer"
              >
                <GithubLogo size={18} />
                GitHub
              </a>
              <a
                href="http://www.linkedin.com/in/jeandre-visser"
                target="_blank"
                rel="noreferrer"
              >
                <LinkedinLogo size={18} />
                LinkedIn
              </a>
              <a href="mailto:jeandrev1414@gmail.com">
                <EnvelopeSimple size={18} />
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
