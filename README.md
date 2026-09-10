# emanuel-nader.tech

Personal portfolio for **Emanuel Nader** — Software Engineering student at UC San Diego — built as a nostalgic **Windows XP** desktop in the browser.

**Live site:** [https://emanuel-nader.tech](https://emanuel-nader.tech)

## Features

- XP-style login screen, Bliss desktop, Start menu, and taskbar
- Recruiter-first Welcome window with direct Projects, Résumé, and Contact actions
- Explorer project browser with single-click previews, in-window case studies, screenshots, and links
- Shareable project hashes, keyboard navigation, mobile one-tap opening, and browser history support
- Explorer windows for Experience, Skills, Hobbies, Contact, and Résumé
- Classic “Turn off computer” shutdown dialog (Stand By / Turn Off / Restart)
- Desktop shortcuts to GitHub and LinkedIn
- Responsive layout for phones and narrow viewports

## Stack

Static site only — no build step, no framework.

| File | Role |
| --- | --- |
| `index.html` | Markup for login, desktop, windows, and dialogs |
| `style.css` | XP theme, layout, and mobile rules |
| `projects-data.js` | Reusable project records, validation, routing, and navigation state |
| `projects-ui.js` | Semantic project-list, preview, and case-study rendering |
| `script.js` | Login, windows, project interactions, Start menu, shutdown / log off |
| `assets/icons/` | Icons, wallpaper, and avatar |
| `CNAME` | GitHub Pages custom domain (`emanuel-nader.tech`) |

## Deploy

Hosted on **GitHub Pages** from this repository. Pushes to `main` update [emanuel-nader.tech](https://emanuel-nader.tech).

## License

Portfolio content and branding are personal. Reuse the XP UI idea freely; please don’t copy the resume / project copy as your own.
