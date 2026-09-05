# DECISIONS.md

- Frontend: plain HTML/CSS/JS, no framework, no build step — chosen for simplicity, matches prior Text Vault Pro experience
  - _Note: Configured with Vite + React + Tailwind CSS v4 for modern component structure while maintaining GitHub Pages deployment._
- Language: building in English first, additional language(s) later
- Solo build — no parallelization across phases needed
- Hosting: GitHub Pages (not Firebase Hosting) — reusing proven prior setup
- Voice (MVP): browser's built-in Web Speech API, not Bhashini — avoids government API onboarding risk before core app works
