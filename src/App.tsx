import { useMemo, useState } from "react";
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
      <span>R</span>
      <i />
    </span>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

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
        className="menu-button"
        type="button"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {menuOpen && (
        <nav className="mobile-nav" aria-label="Mobile navigation">
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
          >
            GitHub <ArrowUpRight size={15} />
          </a>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-inner page-shell">
        <div className="hero-copy">
          <div className="eyebrow">
            <span>Independent product headquarters</span>
            <span className="eyebrow-status">
              <i />
              Khulna / Building globally
            </span>
          </div>
          <h1 id="hero-title">RakibHQ</h1>
          <p className="hero-lede">
            A focused ecosystem of autonomous agent infrastructure, onchain
            products, and AI-native tools built by Md. Rakib.
          </p>
          <div className="hero-actions">
            <a className="action action--primary" href="#ecosystem">
              <span>Explore the ecosystem</span>
              <ArrowDown size={17} aria-hidden="true" />
            </a>
            <ExternalAction href="https://github.com/0xmdrakib" variant="quiet">
              GitHub profile
            </ExternalAction>
          </div>
        </div>
      </div>
    </section>
  );
}

function SignalStrip() {
  const signals = [
    "Agent infrastructure",
    "Onchain execution",
    "AI intelligence",
    "Open source",
    "Product engineering",
    "RakibHQ / 2026",
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
        <div className="project-status">
          <span>{project.status}</span>
          <span>{project.category}</span>
        </div>
        <h3>{project.name}</h3>
        <p>{project.tagline}</p>
      </div>
      <div className="registry-description">
        <p className="registry-summary">{project.description}</p>
        <div className="registry-value">
          <span>WHY IT MATTERS</span>
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
          Live product
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
            <span className="section-number">01 / ECOSYSTEM</span>
            <h2>Product registry</h2>
          </div>
          <p>
            A growing index of products built to give people and autonomous
            systems more capable tools for the open internet.
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
          <span className="section-number">02 / BUILDER PROFILE</span>
          <h2>
            Md. Rakib
            <span>Independent product builder.</span>
          </h2>
        </div>

        <div className="profile-statement">
          <Sparkles size={24} aria-hidden="true" />
          <p>
            I build at the intersection of autonomous agents, onchain
            infrastructure, and product engineering. RakibHQ is where those
            systems become one coherent body of work.
          </p>
        </div>

        <div className="operating-system">
          <div className="operating-system__head">
            <span>OPERATING SYSTEM</span>
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
        <p>© 2026 · Product headquarters by Md. Rakib</p>
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
