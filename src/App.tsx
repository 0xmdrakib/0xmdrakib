import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Boxes,
  CircleDot,
  Github,
  Menu,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import {
  projectCategories,
  projects,
  type Project,
  type ProjectFilter,
} from "./data/projects";

function ExternalAction({
  href,
  children,
  variant = "secondary",
  ariaLabel,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "quiet";
  ariaLabel?: string;
}) {
  return (
    <a
      className={`action action--${variant}`}
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={ariaLabel}
    >
      <span>{children}</span>
      <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.8} />
    </a>
  );
}

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <img src="/brand/rakibhq-logo-64.png" alt="" />
    </span>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const wasMenuOpen = useRef(false);

  useEffect(() => {
    if (!menuOpen) {
      if (wasMenuOpen.current) {
        requestAnimationFrame(() => {
          if (window.innerWidth <= 820) {
            menuButtonRef.current?.focus();
          }
        });
      }
      wasMenuOpen.current = false;
      return;
    }

    wasMenuOpen.current = true;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };
    const closeOnDesktopResize = () => {
      if (window.innerWidth > 820) {
        setMenuOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    window.addEventListener("resize", closeOnDesktopResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
      window.removeEventListener("resize", closeOnDesktopResize);
    };
  }, [menuOpen]);

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="RakibHQ home">
        <BrandMark />
        <span className="brand-word">RakibHQ</span>
      </a>

      <nav className="desktop-nav" aria-label="Primary navigation">
        <a href="#ecosystem">Ecosystem</a>
        <a href="#profile">Profile</a>
      </nav>

      <a
        className="header-github"
        href="https://github.com/0xmdrakib"
        target="_blank"
        rel="noreferrer"
        aria-label="Open Md. Rakib's GitHub profile"
      >
        <Github size={17} aria-hidden="true" />
        <span>0xmdrakib</span>
        <ArrowUpRight size={14} aria-hidden="true" />
      </a>

      <button
        ref={menuButtonRef}
        className="menu-button"
        type="button"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-controls="mobile-navigation"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {menuOpen && (
        <>
          <button
            className="mobile-nav-backdrop"
            type="button"
            tabIndex={-1}
            aria-label="Close navigation"
            onClick={() => setMenuOpen(false)}
          />
          <nav
            className="mobile-nav"
            id="mobile-navigation"
            aria-label="Mobile navigation"
          >
            <a href="#ecosystem" onClick={() => setMenuOpen(false)}>
              Ecosystem
            </a>
            <a href="#profile" onClick={() => setMenuOpen(false)}>
              Profile
            </a>
            <a
              href="https://github.com/0xmdrakib"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              GitHub <ArrowUpRight size={15} />
            </a>
          </nav>
        </>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-inner page-shell">
        <div className="eyebrow">
          <span>Md. Rakib / Independent product builder</span>
          <span className="eyebrow-status">
            <i />
            Khulna &middot; Building globally
          </span>
        </div>
        <h1 id="hero-title">RakibHQ</h1>
        <img
          className="hero-artwork"
          src="/brand/rakibhq-hero-artwork-optimized.png"
          alt=""
          aria-hidden="true"
        />
        <p className="hero-lede">
          The product headquarters for autonomous agent infrastructure,
          onchain execution, and AI-native tools built with clarity,
          usefulness, and long-term ambition.
        </p>
        <div className="hero-actions">
          <a className="action action--primary" href="#ecosystem">
            <span>Explore projects</span>
            <ArrowDown size={17} aria-hidden="true" />
          </a>
          <ExternalAction href="https://github.com/0xmdrakib" variant="quiet">
            GitHub profile
          </ExternalAction>
        </div>
      </div>
    </section>
  );
}

function SignalStrip() {
  const signals = [
    "Independent product studio",
    "Agent identity",
    "Onchain execution",
    "Applied AI",
    "Open source",
    "Built from Khulna",
  ];

  return (
    <div className="signal-strip" aria-label="RakibHQ focus areas">
      <div className="signal-strip__track">
        {[0, 1].map((groupIndex) => (
          <div
            className="signal-strip__group"
            aria-hidden={groupIndex === 1}
            key={groupIndex}
          >
            {signals.map((signal) => (
              <span key={signal}>
                <CircleDot size={13} aria-hidden="true" />
                {signal}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectRow({ project }: { project: Project }) {
  return (
    <article
      className={`registry-row registry-row--${project.accent} ${
        project.featured ? "registry-row--featured" : ""
      }`}
    >
      <div className="registry-index">
        <span>{project.index}</span>
        <i />
      </div>
      <div className="registry-title">
        <div className="project-meta">
          <span className="project-index-mobile">{project.index}</span>
          <div className="project-status">
            <span>{project.status}</span>
            <span>{project.category}</span>
          </div>
        </div>
        <h3>{project.name}</h3>
        <p>{project.tagline}</p>
      </div>
      <div className="registry-description">
        <p className="registry-summary">{project.description}</p>
        <div className="registry-value">
          <span>Why it matters</span>
          <p>{project.value}</p>
        </div>
        <div
          className="capability-list"
          aria-label={`${project.name} key capabilities`}
        >
          {project.capabilities.slice(0, 3).map((capability) => (
            <span key={capability}>{capability}</span>
          ))}
        </div>
        <div
          className="stack-list"
          aria-label={`${project.name} technology stack`}
        >
          {project.stack.slice(0, 4).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
      <div className="registry-actions">
        <ExternalAction
          href={project.liveUrl}
          variant="primary"
          ariaLabel={`Open ${project.name} live website`}
        >
          Visit product
        </ExternalAction>
        <ExternalAction
          href={project.repoUrl}
          variant="secondary"
          ariaLabel={`Open ${project.name} GitHub repository`}
        >
          Source
        </ExternalAction>
      </div>
    </article>
  );
}

function EcosystemRegistry() {
  const [filter, setFilter] = useState<ProjectFilter>("All");
  const [query, setQuery] = useState("");

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesFilter = filter === "All" || project.category === filter;
      const matchesQuery =
        !normalizedQuery ||
        [
          project.name,
          project.tagline,
          project.description,
          project.value,
          project.category,
          ...project.capabilities,
          ...project.stack,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  return (
    <section className="ecosystem section-band" id="ecosystem">
      <div className="page-shell">
        <div className="section-heading">
          <div>
            <span className="section-number">01 / Product ecosystem</span>
            <h2>A growing body of work.</h2>
          </div>
          <p>
            One searchable home for every RakibHQ project. The registry is
            designed to expand as new products move from idea to release.
          </p>
        </div>

        <div className="registry-tools">
          <div className="filter-tabs" aria-label="Filter projects">
            {projectCategories.map((category) => (
              <button
                type="button"
                key={category}
                className={filter === category ? "is-active" : ""}
                aria-pressed={filter === category}
                onClick={() => setFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <label className="search-control">
            <Search size={17} aria-hidden="true" />
            <span className="sr-only">Search projects</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the registry"
            />
            <kbd>{filteredProjects.length}</kbd>
          </label>
        </div>

        <div className="registry-list" aria-live="polite">
          {filteredProjects.map((project) => (
            <ProjectRow key={project.slug} project={project} />
          ))}
          {filteredProjects.length === 0 && (
            <div className="empty-state">
              <Search size={24} aria-hidden="true" />
              <p>No project matches this view.</p>
              <button
                type="button"
                onClick={() => {
                  setFilter("All");
                  setQuery("");
                }}
              >
                Reset registry
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ProfileSection() {
  return (
    <section className="profile section-band" id="profile">
      <div className="page-shell profile-grid">
        <div className="profile-title">
          <span className="section-number">02 / Builder profile</span>
          <h2>
            Md. Rakib
            <span>Building useful systems for the open internet.</span>
          </h2>
        </div>

        <div className="profile-statement">
          <Sparkles size={24} aria-hidden="true" />
          <p>
            I work where autonomous agents, onchain infrastructure, and
            thoughtful product engineering meet. RakibHQ is the public record
            of that work and the home it will keep growing from.
          </p>
        </div>

        <div className="operating-system">
          <div className="operating-system__head">
            <span>How I build</span>
          </div>
          <ol>
            <li>
              <span>01</span>
              <p>Find a problem with real weight.</p>
            </li>
            <li>
              <span>02</span>
              <p>Build the smallest complete system.</p>
            </li>
            <li>
              <span>03</span>
              <p>Expose it to the real world early.</p>
            </li>
            <li>
              <span>04</span>
              <p>Polish the details that earn trust.</p>
            </li>
            <li>
              <span>05</span>
              <p>Ship, learn, and compound the work.</p>
            </li>
          </ol>
        </div>

        <div className="profile-links">
          <div>
            <Boxes size={21} aria-hidden="true" />
            <span>Headquarters</span>
            <strong>rakibhq.xyz</strong>
          </div>
          <div>
            <Github size={21} aria-hidden="true" />
            <span>Open source</span>
            <strong>@0xmdrakib</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-bar">
        <a className="footer-brand" href="#top" aria-label="Back to RakibHQ">
          <BrandMark />
          <span>RakibHQ</span>
        </a>
        <p>
          &copy; 2026 RakibHQ &bull; The product headquarters of Md. Rakib
        </p>
        <a
          className="footer-github"
          href="https://github.com/0xmdrakib"
          target="_blank"
          rel="noreferrer"
        >
          <Github size={16} aria-hidden="true" />
          <span>0xmdrakib</span>
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#ecosystem">
        Skip to projects
      </a>
      <Header />
      <main>
        <Hero />
        <SignalStrip />
        <EcosystemRegistry />
        <ProfileSection />
      </main>
      <Footer />
    </>
  );
}
