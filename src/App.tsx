import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  CircleDot,
  Github,
  Search,
  Sparkles,
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
          src="/brand/rakibhq-hero-artwork-v2.png"
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
            <ArrowRight size={17} aria-hidden="true" />
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
            <strong>mdrakib.xyz/hq</strong>
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
      <div className="ft">
        <div className="fl-left">Built with clarity<br />and purpose, 2026.</div>
        <div className="fl-center">
          <div className="fl-brand">Rakib<span>HQ</span></div>
          <div className="fl-tagline">Product studio · Bangladesh</div>
        </div>
        <div className="fl-right">
          <a className="sa" href="https://x.com/0xmdrakib" target="_blank" rel="noopener" aria-label="X (Twitter)"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/></svg></a>
          <a className="sa" href="https://t.me/Oxmdrakib" target="_blank" rel="noopener" aria-label="Telegram"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09"/></svg></a>
          <a className="sa" href="mailto:0xmdrakib@gmail.com" aria-label="Email"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/></svg></a>
          <a className="sa" href="https://github.com/0xmdrakib" target="_blank" rel="noopener" aria-label="GitHub"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/></svg></a>
        </div>
      </div>
      <div className="fb2">
        <div className="fc">© 2026 RakibHQ • Crafted with precision.</div>
      </div>
    </footer>
  );
}

export default function App() {

  return (
    <>
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
