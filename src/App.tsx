import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Bot,
  Boxes,
  Check,
  CircleDot,
  Github,
  Globe2,
  Mail,
  Menu,
  Network,
  Radio,
  Search,
  ShieldCheck,
  Sparkles,
  SquareTerminal,
  X,
  Zap,
} from "lucide-react";
import {
  projectCategories,
  projects,
  type Project,
  type ProjectFilter,
} from "./data/projects";

const capabilityIcons = [Globe2, Mail, Network, ShieldCheck, SquareTerminal, Radio];

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
        <span className="brand-domain">.xyz</span>
      </a>

      <nav className="desktop-nav" aria-label="Primary navigation">
        <a href="#ecosystem">Ecosystem</a>
        <a href="#flagship">Flagship</a>
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
          <a href="#flagship" onClick={() => setMenuOpen(false)}>
            Flagship
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
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProject = projects[activeIndex];

  return (
    <section
      className={`hero hero--${activeProject.accent}`}
      id="top"
      aria-labelledby="hero-title"
    >
      <div className="hero-art" aria-hidden="true">
        <div className="hero-art__wash" />
        <img src={activeProject.image} alt="" />
        <div className="hero-art__grid" />
        <div className="signal-node signal-node--one">
          <i />
          IDENTITY
        </div>
        <div className="signal-node signal-node--two">
          <i />
          EXECUTION
        </div>
        <div className="signal-node signal-node--three">
          <i />
          INTELLIGENCE
        </div>
        <div className="scan-line" />
      </div>

      <div className="hero-inner page-shell">
        <div className="hero-copy">
          <div className="eyebrow">
            <span>Independent product headquarters</span>
            <span className="eyebrow-status">
              <i />
              Dhaka / Building globally
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

        <div className="hero-console" aria-label="Featured project selector">
          <div className="hero-console__meta">
            <span>ACTIVE SYSTEM</span>
            <span>{activeProject.index} / 03</span>
          </div>
          <div className="hero-console__active">
            <span className="hero-console__status">
              <i />
              {activeProject.status}
            </span>
            <strong>{activeProject.name}</strong>
            <p>{activeProject.tagline}</p>
          </div>
          <div className="hero-selector" role="tablist" aria-label="Select project">
            {projects.map((project, index) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeIndex === index}
                className={activeIndex === index ? "is-active" : ""}
                key={project.slug}
                onClick={() => setActiveIndex(index)}
              >
                <span>{project.index}</span>
                {project.name}
              </button>
            ))}
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
        {[...signals, ...signals].map((signal, index) => (
          <span key={`${signal}-${index}`}>
            <CircleDot size={13} aria-hidden="true" />
            {signal}
          </span>
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
        <p>{project.description}</p>
        <div className="stack-list" aria-label={`${project.name} technology stack`}>
          {project.stack.slice(0, 4).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
      <div className="registry-actions">
        <ExternalAction
          href={project.liveUrl}
          variant={project.featured ? "primary" : "secondary"}
          ariaLabel={`Open ${project.name} live website`}
        >
          Live product
        </ExternalAction>
        <ExternalAction
          href={project.repoUrl}
          variant="quiet"
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
          project.category,
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

function FlagshipSection() {
  const project = projects[0];

  return (
    <section className="flagship section-band" id="flagship">
      <div className="page-shell">
        <div className="flagship-heading">
          <span className="section-number section-number--light">
            02 / FLAGSHIP SYSTEM
          </span>
          <div>
            <h2>AgentDomain</h2>
            <span>Identity, assembled.</span>
          </div>
        </div>

        <div className="flagship-grid">
          <div className="flagship-copy">
            <p className="flagship-intro">{project.description}</p>
            <p className="flagship-value">{project.value}</p>
            <div className="flagship-actions">
              <ExternalAction href={project.liveUrl} variant="primary">
                Launch AgentDomain
              </ExternalAction>
              <ExternalAction href={project.repoUrl} variant="quiet">
                Inspect source
              </ExternalAction>
            </div>
          </div>

          <div className="identity-map" aria-label="AgentDomain identity stack">
            {project.capabilities.map((capability, index) => {
              const Icon = capabilityIcons[index];
              return (
                <div className="identity-module" key={capability}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <Icon size={21} aria-hidden="true" strokeWidth={1.5} />
                  <strong>{capability}</strong>
                  <Check size={15} aria-hidden="true" />
                </div>
              );
            })}
          </div>
        </div>

        <figure className="flagship-visual">
          <img
            src={project.image}
            alt="AgentDomain identity and discovery layer for AI agents"
          />
          <figcaption>
            <span>AGENTDOMAIN / SYSTEM OVERVIEW</span>
            <span>DOMAIN + DNS + EMAIL + SSL + ONCHAIN IDENTITY</span>
          </figcaption>
        </figure>

        <div className="flagship-metrics" aria-label="AgentDomain highlights">
          <div>
            <strong>01</strong>
            <span>Registration flow</span>
          </div>
          <div>
            <strong>06</strong>
            <span>Identity primitives</span>
          </div>
          <div>
            <strong>2X</strong>
            <span>Onchain networks</span>
          </div>
          <div>
            <strong>24/7</strong>
            <span>Renewal automation</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function SupportingProduct({ project }: { project: Project }) {
  const isNexora = project.slug === "nexoraswap";

  return (
    <article
      className={`supporting-product supporting-product--${project.accent}`}
    >
      <div className="supporting-product__head">
        <span>{project.index}</span>
        <span>{project.category}</span>
        <span>{project.status}</span>
      </div>
      <div className="supporting-product__visual">
        <img src={project.image} alt="" />
        {isNexora ? (
          <div className="swap-demo" aria-hidden="true">
            <div>
              <span>FROM</span>
              <strong>ETH</strong>
              <em>1.00</em>
            </div>
            <Zap size={19} />
            <div>
              <span>TO</span>
              <strong>USDC</strong>
              <em>Best route</em>
            </div>
          </div>
        ) : (
          <div className="atlas-demo" aria-hidden="true">
            <div className="atlas-signal">
              <span>AI DIGEST</span>
              <i />
            </div>
            <p>Signal over noise.</p>
            <div className="atlas-lines">
              <i />
              <i />
              <i />
            </div>
          </div>
        )}
      </div>
      <div className="supporting-product__copy">
        <span className="project-kicker">{project.tagline}</span>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
      </div>
      <div className="supporting-product__footer">
        <div className="stack-list">
          {project.stack.slice(0, 4).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div>
          <ExternalAction href={project.liveUrl} variant="secondary">
            Open product
          </ExternalAction>
          <ExternalAction href={project.repoUrl} variant="quiet">
            Source
          </ExternalAction>
        </div>
      </div>
    </article>
  );
}

function SupportingSection() {
  return (
    <section className="supporting section-band">
      <div className="page-shell">
        <div className="section-heading">
          <div>
            <span className="section-number">03 / SELECTED PRODUCTS</span>
            <h2>Different problems.<br />One standard.</h2>
          </div>
          <p>
            Each product is designed around a clear job: reduce complexity,
            expose the useful details, and make the final interaction feel
            inevitable.
          </p>
        </div>
        <div className="supporting-grid">
          {projects.slice(1).map((project) => (
            <SupportingProduct project={project} key={project.slug} />
          ))}
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
          <span className="section-number">04 / BUILDER PROFILE</span>
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
            <span>RKHQ / 1.0</span>
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
            <Bot size={21} aria-hidden="true" />
            <span>Current focus</span>
            <strong>Agent infrastructure</strong>
          </div>
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
      <div className="page-shell">
        <div className="footer-main">
          <div>
            <BrandMark />
            <h2>RakibHQ</h2>
          </div>
          <p>
            The headquarters is being assembled now.
            <br />
            Full launch at <strong>rakibhq.xyz</strong>.
          </p>
          <ExternalAction href="https://github.com/0xmdrakib" variant="primary">
            Follow the build
          </ExternalAction>
        </div>
        <div className="footer-base">
          <span>© 2026 Md. Rakib</span>
          <span>Built from Dhaka for the open internet.</span>
          <span className="footer-status">
            <i />
            Launch sequence active
          </span>
        </div>
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
        <FlagshipSection />
        <SupportingSection />
        <ProfileSection />
      </main>
      <Footer />
    </>
  );
}
