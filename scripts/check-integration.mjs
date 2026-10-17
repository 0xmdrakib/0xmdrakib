import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

// Check the emitted production pages, including their generated asset URLs.
const read = (path) => readFileSync(path, "utf8");
const pages = [
  { path: "dist/index.html", site: "personal", canonical: "https://mdrakib.xyz/" },
  { path: "dist/hq/index.html", site: "hq", canonical: "https://mdrakib.xyz/hq/" },
];

for (const page of pages) {
  const html = read(page.path);
  assert.ok(html.includes(`data-site="${page.site}"`), `${page.path}: wrong entry point`);
  assert.ok(html.includes(`rel="canonical" href="${page.canonical}"`), `${page.path}: wrong canonical URL`);
  const meta = (key) => html.match(new RegExp(`<meta[^>]+(?:property|name)="${key}"[^>]+content="([^"]+)"`))?.[1];
  for (const key of ["og:image", "og:image:secure_url", "twitter:image"]) {
    assert.equal(meta(key), "https://mdrakib.xyz/brand/mdrakib-social-preview-v4.png", `${page.path}: stale ${key}`);
  }
  assert.equal(meta("og:image:type"), "image/png", `${page.path}: wrong preview type`);
  assert.equal(meta("og:image:width"), "1730", `${page.path}: wrong preview width`);
  assert.equal(meta("og:image:height"), "909", `${page.path}: wrong preview height`);
  // Both headers must be present before JavaScript or web fonts arrive.
  assert.ok(html.includes('href="/"'), `${page.path}: missing Personal tab`);
  assert.ok(html.includes('href="/hq/"'), `${page.path}: missing RakibHQ tab`);
  assert.ok(html.includes('aria-label="Website sections"'), `${page.path}: missing initial navigation`);
  for (const id of ["nav", "personal-page", "hq-page", "hq-content"]) {
    assert.equal([...html.matchAll(new RegExp(`id="${id}"`, "g"))].length, 1, `${page.path}: expected one persistent ${id}`);
  }
  for (const [, url] of html.matchAll(/(?:src|href)="(\/[^"#]*)"/g)) {
    if (url === "/" || url === "/hq/") continue;
    assert.ok(existsSync(resolve("dist", url.slice(1))), `${page.path}: missing asset ${url}`);
  }
}

const home = read(pages[0].path);
const hq = read(pages[1].path);
const preview = readFileSync("dist/brand/mdrakib-social-preview-v4.png");
assert.equal(preview.subarray(0, 8).toString("hex"), "89504e470d0a1a0a", "Invalid social preview PNG");
assert.equal(preview.readUInt32BE(16), 1730, "The preview width does not match its metadata");
assert.equal(preview.readUInt32BE(20), 909, "The preview height does not match its metadata");
for (const oldPreview of ["personal/social-preview-v1.jpg", "brand/rakibhq-social-preview-v3.png"]) {
  assert.ok(!existsSync(resolve("dist", oldPreview)), `Obsolete preview still shipped: ${oldPreview}`);
}
assert.ok(home.includes("Innovation"), "The original personal homepage must remain the front door");
const entry = (html) => html.match(/<script[^>]+type="module"[^>]+src="([^"]+)"/)?.[1];
assert.equal(entry(home), entry(hq), "Both URLs must boot the same app instead of separate documents");
assert.ok(/<script[^>]+type="module"/.test(hq), "The HQ entry must load its production app");
assert.ok(/<script[^>]+blocking="render"[^>]+type="module"/.test(hq), "The first HQ paint must include the app");
assert.ok(!existsSync("public/personal/README.md"), "Do not import the Personal Web README");

const deployment = JSON.parse(read("vercel.json"));
assert.equal(deployment.trailingSlash, true, "Use one canonical trailing-slash URL for HQ");
assert.ok(deployment.rewrites.some(rule => rule.source === "/hq/" && rule.destination === "/hq/index.html"));
assert.ok(!deployment.rewrites.some(rule => rule.source === "/(.*)"), "A homepage catch-all would swallow the HQ page");
for (const host of ["rakibhq.xyz", "www.rakibhq.xyz"]) {
  assert.ok(deployment.redirects.some(rule =>
    rule.has?.some(condition => condition.type === "host" && condition.value === host) &&
    rule.destination === "https://mdrakib.xyz/:path*" && rule.permanent === true
  ), `Missing permanent redirect for ${host}`);
}

// Preserve the profile README apart from the user's approved AgentDomain source URL migration.
const profileBaseline = execFileSync("git", ["show", "HEAD:README.md"], { encoding: "utf8" }).replace(/\r\n/g, "\n");
const approvedProfile = profileBaseline.replaceAll("https://github.com/0xmdrakib/AgentDomain", "https://github.com/Talvono/AgentDomain");
assert.equal(read("README.md").replace(/\r\n/g, "\n"), approvedProfile, "Only the approved AgentDomain source link may change in the profile README");
console.log("Integration checks passed: both production entries, assets, navigation, canonical URLs, redirect configuration, and protected README.");
