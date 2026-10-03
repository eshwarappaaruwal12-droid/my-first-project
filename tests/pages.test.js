// Structural checks on the HTML pages and stylesheet (no browser needed).
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(ROOT, file), "utf8");
const PAGES = ["index.html", "about.html", "contact.html"];

for (const page of PAGES) {
  test(`${page} has the basic document structure`, () => {
    const html = read(page);
    assert.match(html, /^<!DOCTYPE html>/i);
    assert.match(html, /<html lang="en">/);
    assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1.0">/);
    assert.match(html, /<title>[^<]+<\/title>/);
    assert.match(html, /<main id="main"/);
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, "exactly one <h1>");
  });

  test(`${page} links to the shared stylesheet and script`, () => {
    const html = read(page);
    assert.match(html, /<link rel="stylesheet" href="css\/styles.css">/);
    assert.match(html, /<script src="js\/main.js"><\/script>/);
  });

  test(`${page} navigation links to every page and marks itself current`, () => {
    const html = read(page);
    for (const target of PAGES) {
      assert.ok(html.includes(`href="${target}"`), `missing link to ${target}`);
    }
    const current = html.match(/<a href="([^"]+)" aria-current="page">/);
    assert.ok(current, "a nav link should have aria-current");
    assert.equal(current[1], page);
  });
}

test("every local href and src points to an existing file", () => {
  for (const page of PAGES) {
    const html = read(page);
    const refs = [...html.matchAll(/(?:href|src)="([^"#]+)"/g)].map((m) => m[1]);
    for (const ref of refs) {
      if (/^[a-z]+:/i.test(ref)) continue;
      assert.ok(fs.existsSync(path.join(ROOT, ref)), `${page} references missing file ${ref}`);
    }
  }
});

test("contact form has labelled name, email and message fields", () => {
  const html = read("contact.html");
  assert.match(html, /<form id="contact-form"/);
  for (const field of ["name", "email", "message"]) {
    assert.match(html, new RegExp(`<label for="${field}">`), `label for ${field}`);
    assert.match(html, new RegExp(`id="${field}"[^>]*required`), `${field} is required`);
    assert.match(html, new RegExp(`id="${field}-error"`), `error element for ${field}`);
  }
  assert.match(html, /<input id="email" name="email" type="email"/);
  assert.match(html, /<button class="btn btn-primary" type="submit">/);
});

test("stylesheet includes responsive breakpoints", () => {
  const css = read("css/styles.css");
  assert.match(css, /@media \(max-width: 720px\)/);
  assert.match(css, /\.site-nav\.is-open/);
  assert.match(css, /prefers-reduced-motion/);
});
