# my-first-project

A simple, responsive personal website built with plain **HTML, CSS and JavaScript**. It has no frameworks and no build step.

## Pages

| Page | File | What it contains |
| --- | --- | --- |
| Home | `index.html` | Intro hero section with call-to-action buttons and a "What I do" card grid |
| About | `about.html` | Short bio, avatar, skills list and an experience timeline |
| Contact | `contact.html` | Contact form layout (name, email, subject, message) with client-side validation |

### Features

- **Responsive layout:** the CSS grid and flexbox layout adapts to phones, tablets and desktops. Below 720px the navigation collapses into a hamburger menu, and the form and About layout switch to a single column.
- **Accessible:** semantic HTML, a skip link, labelled form fields, `aria-current` on the active nav link, `aria-invalid` and live regions for form errors, visible focus styles, and support for reduced motion.
- **Dark mode:** follows the operating system's `prefers-color-scheme` setting.
- **Form validation:** the name, email and message fields are required, the email must be valid, and the message must be at least 10 characters long. The form is **layout only**: it has no backend, so a valid submission shows a confirmation message and resets the form.

## Project structure

```
.
├── index.html          # Home page
├── about.html          # About page
├── contact.html        # Contact form page
├── css/
│   └── styles.css      # All styles (design tokens, layout, responsive rules)
├── js/
│   └── main.js         # Nav toggle, footer year, form validation
├── tests/
│   ├── validation.test.js  # Unit tests for the validation functions
│   └── pages.test.js       # Structural checks on the HTML/CSS
├── server.js           # Tiny static file server for local development
└── package.json
```

## Running the site

**Option 1: open the file directly.** Double-click `index.html` or open it in any browser. Everything works without a server.

**Option 2: use the local dev server** (requires [Node.js](https://nodejs.org/) 18 or newer):

```bash
npm start
```

Then visit <http://localhost:8080>. To use a different port, run `PORT=3000 npm start`.

You don't need to run `npm install` because the project has no dependencies.

## Running the tests

```bash
npm test
```

The tests use Node's built-in test runner (`node --test`), so you don't need to install anything. They cover:

- **Validation logic** (`tests/validation.test.js`): email checks, required fields, whitespace-only input and the minimum message length.
- **Page structure** (`tests/pages.test.js`): each page has a doctype, `lang`, a viewport meta tag, a title and exactly one `<h1>`; it links to the shared CSS and JS; the navigation reaches every page and marks the current one; no local links are broken; the contact form fields are labelled and required; and the stylesheet includes the responsive breakpoints.

## Customising

- Replace "Your Name", "Your City" and the placeholder text in the HTML files with your own details.
- Change the colours and spacing in the `:root` design tokens at the top of `css/styles.css`.
- To make the contact form actually send messages, set an `action` on the `<form>` that points to a form service or your own backend. Then update the submit handler in `js/main.js` so it sends the data instead of only showing the confirmation.
