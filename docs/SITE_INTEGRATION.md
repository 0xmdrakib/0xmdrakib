# Personal website and RakibHQ

The `0xmdrakib` repository remains the main codebase. Its root `README.md` is
the GitHub profile README. Its design and content are protected; the user-approved
AgentDomain source URL update to `https://github.com/Talvono/AgentDomain` is the
only permitted README change during this integration.
The Personal Web README is not imported. The original Personal Web folder was
used as a source reference; neither that folder nor its GitHub repository is
required to build or run the merged site. The imported code and assets live in
this repository and must be committed and pushed here before removing the old
remote repository if it is still the only remote backup.

## Routes and source

| Route | Experience | Source |
| --- | --- | --- |
| `/` | Existing Md. Rakib personal website | `src/personal/page.html`, `styles.css`, `runtime.ts` |
| `/hq/` | Existing RakibHQ product registry | `hq/index.html`, `src/App.tsx` |

Both URLs boot one app in `src/main.tsx`. The permanent header and both views
come from `src/shell.html`; Vite injects that shell into each HTML entry while
preserving its own canonical and social metadata. Internal links use the History
API and toggle cached views, with no document fetch, page refresh, iframe, or
React remount. Browser Back/Forward restores the route and scroll position.
Form drafts and registry filters survive tab switches. Personal image assets
remain in `public/personal/`; the external source folder is not required.

Shared tab and responsive header styles are in `src/shared/site-switcher.css`.
The same header DOM element remains in place throughout navigation. The build
scopes each design's CSS to its active theme, so their styles do not conflict.
Supported browsers use a 160 ms same-document transition; reduced-motion and
unsupported browsers switch immediately without reloading. Returning to Personal
skips its delayed hero entrance. A direct first visit retains that entrance.
The HQ header's divider and blurred surface appear after 50 pixels of scrolling.
At 900 pixels and below, the shared header stays on one 64-pixel row. Personal,
RakibHQ and Contact use Lucide person, building and mail icons with accessible
names; HQ retains its GitHub action. The controls form a compact group to the
right of the name, with an eight-pixel gap before the final action. The visible
controls are 36 pixels; the two tabs and final action keep 44-pixel touch targets.
Both mobile headers show their tinted surface and bottom divider before scrolling;
the desktop HQ header still reveals its divider after scrolling.
The HQ project search and category filters continue to use
`src/data/projects.ts`.

Both routes share the approved social card at
`public/brand/mdrakib-social-preview-v4.png` (1730 by 909 pixels). Their initial
Open Graph and Twitter metadata and the client-side route metadata use the same
versioned image URL. Rejected drafts, generation prompts and temporary browser
reports are not part of the source; `/output/` and `/.playwright-cli/` are ignored.

## Domains

`mdrakib.xyz` is the canonical domain for both pages. `vercel.json` declares
permanent redirects from the exact `rakibhq.xyz` and `www.rakibhq.xyz` hosts to
the same path on `mdrakib.xyz`. Project subdomains such as
`nexoraswap.rakibhq.xyz` are not matched by these rules.

The redirect configuration takes effect after deployment and after the domains
are attached to this Vercel project. This source integration does not change
DNS or the current live sites.

## Verification

```sh
npm ci
npm run build
npm run check:integration
npm run preview -- --host 127.0.0.1 --port 4174
```

Check both production routes at 320, 390, 768, 850, 1024, and 1440 pixels.
Verify the two site links, current-page state, responsive header actions, HQ filters, search,
empty results, assets, headings, and horizontal overflow. Browser screenshots
and local test reports belong in the ignored `output/playwright/` directory.

The switcher regression asserts zero document requests, unchanged header/form
identity and navigation time origin, stable tab coordinates, responsive layouts,
retained form/search state, Back/Forward scroll restoration, rapid repeated
switches, reduced-motion/unsupported API behavior, and direct HQ deep links:

```sh
npx --yes --package @playwright/cli playwright-cli -s=site-switcher open http://127.0.0.1:4174/ --browser chrome --headed
npx --yes --package @playwright/cli playwright-cli -s=site-switcher --raw run-code --filename scripts/check-site-switcher.playwright.js
npx --yes --package @playwright/cli playwright-cli -s=site-switcher close
```

The homepage's “What I’ve Built” showcase is in
`src/personal/FeaturedProjects.tsx`. It uses the same `src/data/projects.ts`
records as HQ and displays up to seven projects, with the current three shown.
The hero's Explore Projects link opens this section; View All appears above and
at the lower right of the projects and switches to `/hq/`
without reloading. Product and source links open their real destinations in a
new tab. Broader visual redesign and expanded HQ presentation remain future work.

At 980 pixels and below, a centered SVG solar system sits behind the Personal
hero copy. It includes shaded planets, a ringed planet, continuous orbit paths,
trails and a slow corona pulse. Container width and height determine a bounded,
square artwork size; the hero fills the viewport on tall phones and grows with
its content on short screens. A symmetric paper veil and darker body copy keep
text readable. Grid, crosshairs and diagonal lines are removed. Reduced-motion
preferences stop the orbital animation. Desktop uses the same detailed SVG in
the right-hand panel, scaled to that panel's width and height, with full planet
contrast and quieter background guides. Mobile uses softer planets and a
stronger paper veil so moving details stay behind readable copy.

The responsive showcase regression verifies real project images, the one-row
icon header, touch target sizes, stable switcher coordinates, footer padding and
matching footer heights on both pages. It also checks keyboard activation of
View All, contact/section anchors and zero internal document requests:

```sh
npx --yes --package @playwright/cli playwright-cli -s=showcase open http://127.0.0.1:4174/ --browser chrome
npx --yes --package @playwright/cli playwright-cli -s=showcase --raw run-code --filename scripts/check-project-showcase.playwright.js
npx --yes --package @playwright/cli playwright-cli -s=showcase close
```

`scripts/check-personal-hero.playwright.js` checks the orbital background at
319, 390, 497, 547, 768, 900 and 980 pixels and the preserved split layout above
980 pixels, including short, tall and landscape viewport heights. It verifies
exact centering, circular proportions, animation/reduced-motion behavior, unobstructed
hero buttons, the lower View All alignment, and the current AgentDomain tagline
and source URL on both pages. Run it with the same `run-code --filename` command.
