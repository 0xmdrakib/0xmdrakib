import React from "react";
import ReactDOM from "react-dom/client";
import { flushSync } from "react-dom";
import "@fontsource-variable/manrope";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/600.css";
import App from "./App";
import FeaturedProjects from "./personal/FeaturedProjects";
import { initializePersonalPage } from "./personal/runtime";
import "./personal/styles.css";
import "./styles.css";
import "./shared/site-switcher.css";
import "./shared/site-footer.css";

type Site = "personal" | "hq";
type RouteState = { site: Site; scrollY: number };
const panels: Record<Site, HTMLElement> = {
  personal: document.getElementById("personal-page")!,
  hq: document.getElementById("hq-page")!,
};
const header = document.getElementById("nav")!;
const tabs = header.querySelectorAll<HTMLAnchorElement>(".site-switcher a");
const siteFor = (url: URL): Site => /^\/hq\/?$/.test(url.pathname) ? "hq" : "personal";
let activeSite = siteFor(new URL(location.href));
let requestNumber = 0;
let transition: ViewTransition | null = null;

// Both views mount once. Switching keeps the header, form and registry state alive.
flushSync(() => {
  ReactDOM.createRoot(document.getElementById("featured-projects")!).render(
    <React.StrictMode><FeaturedProjects /></React.StrictMode>,
  );
  ReactDOM.createRoot(document.getElementById("hq-content")!).render(
    <React.StrictMode><App /></React.StrictMode>,
  );
});
const personal = initializePersonalPage(panels.personal);
personal.setActive(activeSite === "personal");
const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 50);
window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("pageshow", updateHeader);
updateHeader();

// Warm the second view before it is selected; navigation never fetches HTML.
void document.fonts.load('400 16px "Manrope Variable"').catch(() => undefined);
void document.fonts.load('400 11px "IBM Plex Mono"').catch(() => undefined);
const artwork = panels.hq.querySelector<HTMLImageElement>(".hero-artwork");
void artwork?.decode().catch(() => undefined);

function updateMetadata(site: Site) {
  const hq = site === "hq";
  const title = hq ? "RakibHQ" : "Md. Rakib";
  const canonical = `https://mdrakib.xyz${hq ? "/hq/" : "/"}`;
  const description = hq
    ? "RakibHQ is the product headquarters for Md. Rakib: autonomous agent infrastructure, onchain products, and AI-native tools."
    : "Md. Rakib Digital Architect & Innovation Engineer. Blockchain, AI, Web Development & more.";
  const preview = "https://mdrakib.xyz/brand/mdrakib-social-preview-v4.png";
  const previewAlt = "Md. Rakib, Independent Product Builder. Personal and RakibHQ, with a golden solar illustration on an ivory background.";
  document.title = title;
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')!.href = canonical;
  for (const [key, value] of Object.entries({
    description, "theme-color": hq ? "#f7f7f4" : "#faf6ed",
    "og:title": title, "og:description": description, "og:url": canonical,
    "og:image": preview, "og:image:secure_url": preview,
    "og:image:type": "image/png",
    "og:image:width": "1730", "og:image:height": "909",
    "og:image:alt": previewAlt, "twitter:title": title,
    "twitter:description": description, "twitter:image": preview, "twitter:image:alt": previewAlt,
  })) {
    document.querySelector<HTMLMetaElement>(`meta[name="${key}"],meta[property="${key}"]`)?.setAttribute("content", value);
  }
  document.querySelectorAll<HTMLLinkElement>('link[rel="icon"],link[rel="apple-touch-icon"]').forEach(link => {
    link.href = hq ? "/brand/favicon-32.png" : "/personal/favicon.png";
  });
}

function scrollToRoute(url: URL, site: Site, savedY?: number, smooth = false) {
  if (savedY !== undefined) {
    window.scrollTo({ top: savedY, behavior: "instant" });
    return;
  }
  let id = url.hash.slice(1);
  try { id = decodeURIComponent(id); } catch { /* Keep a malformed hash literal. */ }
  const target = id ? document.getElementById(id) : null;
  if (target && panels[site].contains(target)) {
    target.scrollIntoView({ behavior: smooth ? "smooth" : "instant", block: "start" });
  } else {
    window.scrollTo({ top: 0, behavior: "instant" });
  }
}

function navigate(url: URL, options: { push?: boolean; savedY?: number } = {}) {
  const site = siteFor(url);
  const changed = site !== activeSite;
  const version = ++requestNumber;
  transition?.skipTransition();
  const commit = () => {
    if (version !== requestNumber) return;
    if (options.push) {
      history.replaceState({ site: activeSite, scrollY: window.scrollY } satisfies RouteState, "", location.href);
      if (url.href !== location.href) history.pushState({ site, scrollY: 0 } satisfies RouteState, "", url);
    }
    document.documentElement.dataset.site = site;
    document.documentElement.classList.add("site-switch-arrival");
    for (const key of ["personal", "hq"] as const) {
      panels[key].hidden = key !== site;
      panels[key].inert = key !== site;
    }
    activeSite = site;
    tabs.forEach(tab => {
      if (siteFor(new URL(tab.href)) === site) tab.setAttribute("aria-current", "page");
      else tab.removeAttribute("aria-current");
    });
    personal.setActive(site === "personal");
    updateMetadata(site);
    scrollToRoute(url, site, options.savedY, !changed && !!url.hash && options.push);
    updateHeader();
    document.querySelector(".route-announcement")!.textContent = `${site === "hq" ? "RakibHQ" : "Personal"} page`;
    document.dispatchEvent(new CustomEvent("site:change", { detail: { site, version } }));
  };
  if (changed && document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const next = document.startViewTransition(commit);
    transition = next;
    void next.ready.catch(() => undefined);
    void next.finished.finally(() => { if (transition === next) transition = null; });
  } else {
    commit();
  }
}

history.scrollRestoration = "manual";
history.replaceState({ site: activeSite, scrollY: window.scrollY } satisfies RouteState, "", location.href);
document.addEventListener("click", event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
  if (!anchor || anchor.hasAttribute("download") || (anchor.target && anchor.target !== "_self")) return;
  const url = new URL(anchor.href);
  if (url.origin !== location.origin || !["/", "/hq", "/hq/"].includes(url.pathname)) return;
  event.preventDefault();
  navigate(url, { push: true });
});
window.addEventListener("popstate", event => {
  navigate(new URL(location.href), { savedY: (event.state as RouteState | null)?.scrollY ?? 0 });
});

// Initial deep links must wait for layout, but cannot overwrite a later tab click.
if (location.hash) {
  void Promise.all([document.fonts.ready, artwork?.decode().catch(() => undefined)]).then(() => {
    if (requestNumber !== 0) return;
    scrollToRoute(new URL(location.href), activeSite);
    updateHeader();
    history.replaceState({ site: activeSite, scrollY: window.scrollY } satisfies RouteState, "", location.href);
  });
}
