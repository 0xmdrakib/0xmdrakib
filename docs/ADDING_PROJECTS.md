# Adding a Project to RakibHQ

The website project registry is driven by one file:

```text
src/data/projects.ts
```

Add a new object to the exported `projects` array. The website search, category
filters, status labels, links, technology tags, and project count update from
that data automatically.

## Project shape

```ts
{
  name: "ProjectName",
  slug: "project-name",
  category: "AI",
  status: "Live",
  index: "04",
  tagline: "A short product position.",
  description: "What the product does.",
  value: "Why the product is useful or meaningfully different.",
  repoUrl: "https://github.com/0xmdrakib/ProjectName",
  liveUrl: "https://project.rakibhq.xyz",
  stack: ["Next.js", "TypeScript"],
  capabilities: ["Capability one", "Capability two"],
  featured: false,
  accent: "coral",
  image: "/projects/project-name.png",
}
```

Place the associated image in:

```text
public/projects/
```

Use `featured: true` only for the current flagship. Keep project descriptions
specific, outcome-focused, and short enough to scan in the registry.
