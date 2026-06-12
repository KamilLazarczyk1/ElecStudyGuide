# Electronics Exam Study Guide

A self-contained static study site built from the Electronics lecture slides (Lectures 1–7),
with explanations cross-checked against Boylestad, *Introductory Circuit Analysis*.

## Features

- 4 study sections (DC Circuits, Capacitors & Inductors, AC Circuits, Resonance & Transformers), 35 topics
- 61 original figures extracted from the lecture slides (click to zoom)
- Searchable, printable formula cheat sheet (73 formulas, KaTeX-rendered)
- 16-question self-test quiz with instant feedback
- Dark mode (saved in localStorage, follows system preference on first visit)
- Fully responsive — hamburger menu and collapsible page outline on phones
- Per-topic progress checkboxes persisted in the browser

## Running locally

No build step. Just open `index.html` in a browser, or serve the folder:

```bash
python -m http.server   # then visit http://localhost:8000
```

## Deploying to GitHub Pages

1. Create a repository and push the **contents of this folder** to it (including the
   `.nojekyll` file and the `vendor/` directory — KaTeX is bundled locally, no CDN needed).
2. On GitHub: **Settings → Pages → Source: Deploy from a branch**, pick `main` and `/ (root)`.
3. Your site appears at `https://<username>.github.io/<repo>/`.

All asset paths are relative, so the site works at any subpath.

## Structure

```
index.html                    home / dashboard
dc-circuits.html              Lectures 1–2
capacitors-inductors.html     Lecture 3
ac-circuits.html              Lectures 4–6
resonance-transformers.html   Lecture 7
formulas.html                 formula cheat sheet (searchable, printable)
quiz.html                     self-test quiz
css/style.css                 styles incl. dark theme + responsive rules
js/main.js                    shared scripts (KaTeX render, theme, nav, progress)
assets/img/                   61 figures extracted from the lecture PDF
vendor/katex/                 KaTeX 0.17.0 (CSS, JS, fonts) — served locally
```

Figures © their original sources; reproduced from the lecture PDF for personal study.
