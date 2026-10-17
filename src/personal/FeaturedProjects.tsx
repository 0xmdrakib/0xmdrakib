import { ArrowRight, ArrowUpRight, Github } from "lucide-react";
import { projects, type Project } from "../data/projects";

function ProjectCard({ project }: { project: Project }) {
  const flagship = project.featured;
  return (
    <article className={`work-card work-card--${project.slug}${flagship ? " work-card--featured" : ""}`}>
      <a
        className="work-visual"
        href={project.liveUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`Visit ${project.name}`}
      >
        <span className="work-visual-grid" aria-hidden="true" />
        <img
          className={flagship ? "work-cover" : "work-icon"}
          src={project.image}
          alt=""
          loading="lazy"
          decoding="async"
          width={flagship ? 1731 : 128}
          height={flagship ? 909 : 128}
        />
        <span className="work-visual-caption" aria-hidden="true">{project.category}</span>
        <span className="work-visual-arrow" aria-hidden="true"><ArrowUpRight size={18} /></span>
      </a>
      <div className="work-copy">
        <div className="work-meta">
          <span>{project.index} / {project.category}</span>
          <span className="work-status"><i aria-hidden="true" />{project.status}</span>
        </div>
        <h3>{project.name}</h3>
        <p className="work-tagline">{project.tagline}</p>
        <p className="work-description">{project.description}</p>
        <ul className="work-stack" aria-label={`${project.name} technologies`}>
          {project.stack.slice(0, 3).map(technology => <li key={technology}>{technology}</li>)}
        </ul>
        <div className="work-actions">
          <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`Visit ${project.name} product`}>
            Visit product <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <a className="work-source" href={project.repoUrl} target="_blank" rel="noreferrer" aria-label={`View ${project.name} source on GitHub`}>
            <Github size={15} aria-hidden="true" /> Source
          </a>
        </div>
      </div>
    </article>
  );
}

export default function FeaturedProjects() {
  const selected = projects.slice(0, 7);
  return (
    <div className="mw">
      <div className="work-heading r">
        <div>
          <span className="work-eyebrow">Selected projects</span>
          <h2 className="sec-h" id="selected-work-title">What I’ve <em>Built</em></h2>
          <p className="sec-sub">Independent products, from agent infrastructure to applied AI.</p>
        </div>
        <a className="work-view-all" href="/hq/">View All <ArrowRight size={17} aria-hidden="true" /></a>
      </div>
      <div className="work-grid">
        {selected.map(project => <ProjectCard key={project.slug} project={project} />)}
      </div>
      <div className="work-colophon r">
        <div className="work-colophon-copy">
          <span>{String(selected.length).padStart(2, "0")} projects, and counting</span>
          <span>Built independently in Khulna, Bangladesh</span>
        </div>
        <a className="work-view-all work-view-all--bottom" href="/hq/">View All <ArrowRight size={17} aria-hidden="true" /></a>
      </div>
    </div>
  );
}
