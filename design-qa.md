# Design QA — Recruiter-First Windows XP Portfolio

## Visual truth and capture setup

- Selected XP direction: `/Users/emanuelnader/.codex/generated_images/01a04eea-5586-7c02-84bc-6fb1efd2eb4a/exec-7fe06b2b-05e2-4e38-b485-88777dad6717.png` (1488×1058)
- Original overview source: `/Users/emanuelnader/.codex/generated_images/01a04eea-5586-7c02-84bc-6fb1efd2eb4a/exec-1f06e914-5337-442a-a3b7-2577fd7ddc4a.png` (1487×1058)
- Case-study source: `/Users/emanuelnader/.codex/generated_images/01a04eea-5586-7c02-84bc-6fb1efd2eb4a/exec-0ec53a8b-8063-447f-959f-4f73ebaf2880.png` (1487×1058)
- Desktop overview capture: `/Users/emanuelnader/projects/emanuel-nader.tech/.worktrees/recruiter-xp-refresh/qa-desktop-overview.png` (1440×1024)
- Desktop case-study capture: `/Users/emanuelnader/projects/emanuel-nader.tech/.worktrees/recruiter-xp-refresh/qa-desktop-detail.png` (1440×1024)
- Mobile overview capture: `/Users/emanuelnader/projects/emanuel-nader.tech/.worktrees/recruiter-xp-refresh/qa-mobile-overview.png` (390×844)
- Mobile case-study capture: `/Users/emanuelnader/projects/emanuel-nader.tech/.worktrees/recruiter-xp-refresh/qa-mobile-detail.png` (390×844)
- Same-input visual comparison: `/Users/emanuelnader/projects/emanuel-nader.tech/.worktrees/recruiter-xp-refresh/qa-visual-comparison.png`
- Browser capture scale: CSS pixels, density 1.
- Compared states: selected ShortStack in the project overview and the collapsed ShortStack case study.

The selected source and final desktop capture were placed beside one another in a single comparison page and inspected in the same browser input. The mobile captures were inspected as the responsive adaptation; there was no separate mobile visual source.

## Mandatory fidelity surfaces

- XP desktop, taskbar, Explorer chrome, address bar, sidebar, and window framing remain intact.
- At 1440×1024, the Projects window is 1200×830 at x=174/y=66, matching the selected composition's placement and proportions.
- The shell uses a 40px blue title bar, 29px menu strip, 57px Explorer toolbar, 350px task pane, and 42px taskbar to preserve the selected direction's readable XP scale.
- The overview preserves three high-emphasis featured rows, a compact five-project archive, left preview pane, and a single Projects taskbar item.
- The detail state preserves the simplified folder-led header, strongest result, two-column build/impact summary, exactly three impact bullets, and collapsed Engineering details.
- Missing proof remains hidden: no repository/demo actions or screenshot gallery appear when their records are empty.
- Mobile uses the same hierarchy in a full-screen Explorer window with one-tap project opening and no horizontal overflow.

## QA history

1. **P1 — 390px horizontal overflow:** the address bar's desktop left margin extended the document to 393px. Removed that margin in the mobile grid and applied border-box sizing. Post-fix evidence: document and body widths both equal 390px.
2. **P1 — undersized mobile controls:** Back, Up, window controls, and the Engineering details disclosure were below the 44px touch target. Increased their mobile hit areas. Post-fix evidence: all measure 44px; project rows measure 82px.
3. **P2 — overview archive clipping:** the last compact row sat below the Explorer content edge. Matched the approved archive density by reducing compact-only vertical padding. Post-fix evidence: all eight projects are visible in the desktop window.
4. **P1 — Résumé window clipping at 1280×720:** the desktop clamp compared zoomed bounds to unscaled CSS dimensions. Normalized bounds by page zoom and removed duplicate taskbar subtraction from maximize. Post-fix evidence: the résumé bottom equals the desktop bottom without horizontal overflow; maximized windows fill the desktop exactly.
5. **P2 — shell fidelity drift:** the initial refresh was too small beside the selected visual. Increased the title bar, menu strip, toolbar, task pane, project-row density, and taskbar, then repeated the same-input comparison.
6. **P1 — mobile toolbar wrapping:** separators and a redundant Go control forced the address bar into a clipped third row. Hidden those nonessential controls below 640px and made the address bar span the full toolbar. Post-fix evidence: document width and scroll width both equal 390px; Back and Up remain 44px tall.

## Final assessment

- Open P0 findings: none.
- Open P1 findings: none.
- Open P2 findings: none.
- Intentional difference: project-specific screenshots, repository links, and demo links are omitted because verified source assets/URLs were not supplied. This follows the no-invented-proof requirement.

final result: passed

## Hobbies regression QA — September 9, 2026

- User-reported state: `/var/folders/5k/k4d6fr9s2vd7yf5gz4bbncfw0000gn/T/codex-clipboard-d99adf5b-22a9-4ad8-a52f-ee50443f6ee0.png` (3680×2226 app screenshot; maximized Filmstrip).
- Corrected desktop gallery: `/Users/emanuelnader/projects/emanuel-nader.tech/.worktrees/recruiter-xp-refresh/qa-hobbies-desktop-gallery.png` (1440×1024).
- Corrected desktop Filmstrip: `/Users/emanuelnader/projects/emanuel-nader.tech/.worktrees/recruiter-xp-refresh/qa-hobbies-desktop-filmstrip.png` (1440×1024).
- Corrected mobile gallery and Filmstrip: `/Users/emanuelnader/projects/emanuel-nader.tech/.worktrees/recruiter-xp-refresh/qa-hobbies-mobile-gallery.png` and `/Users/emanuelnader/projects/emanuel-nader.tech/.worktrees/recruiter-xp-refresh/qa-hobbies-mobile-filmstrip.png` (390×844).
- Same-input comparison: `/Users/emanuelnader/projects/emanuel-nader.tech/.worktrees/recruiter-xp-refresh/qa-hobbies-comparison.png` (1480×570).
- State mismatch is intentional: the report showed a maximized detail state, while the corrected desktop evidence also verifies the default 980×700 Explorer window and its gallery-to-Filmstrip transition.

### Findings and fixes

1. **P1 — live browser retained stale CSS and JavaScript:** the cached `v=13` stylesheet preserved the broken two-column/oversized state even after source fixes. Incremented the stylesheet and profile/script cache keys; live inspection confirms `style.css?v=14` and `script.js?v=7`.
2. **P1 — desktop double-click lost its target:** single-click previously replaced the gallery DOM before `dblclick` could fire. Selection now updates the existing buttons in place, and double-click opens Filmstrip reliably.
3. **P1 — responsive gallery override order:** the legacy one-column rule overrode the intended gallery layout. The refresh styles now load last. Verified three columns at 1440×1024 and 1097×915, and two columns at 390×844.
4. **P1 — mobile navigation disappeared:** legacy mobile CSS hid Back, Previous, Next, and Up. The Hobbies toolbar now exposes 44px controls in Filmstrip and retains no horizontal document overflow.
5. **P2 — cramped default desktop window:** Hobbies now opens at 980×700 so the complete 3×2 gallery fits without the sparse or clipped layout shown in the report.
6. **P2 — taskbar felt undersized:** increased the shared desktop shell height from 30px to 34px while retaining the native 54×29 Start asset. Live measurement confirms the desktop bottom and taskbar top both resolve to 881px at the active 1097×915 viewport, with no gap or overlap. Mobile remains 52px for touch access.
7. **P2 — generated Hobbies images felt impersonal:** replaced the Motorcycle, Cooking, and Exploration hobby assets with user-supplied personal photos, kept generated assets for categories without supplied photos, and made the Filmstrip/status labels distinguish personal photos from illustrative images. Browser evidence: `/Users/emanuelnader/projects/emanuel-nader.tech/.worktrees/recruiter-xp-refresh/qa-hobbies-personal-photos.png`.
8. **P2 — Hobbies needed albums and square crops:** converted hobby images to per-hobby photo albums, added in-photo left/right arrows for albums, made thumbnails and the Filmstrip viewer square with cover cropping, and added supplied media for One Piece, Tokyo Ghoul, Terraria, and the bench press working set. Browser evidence: `/Users/emanuelnader/projects/emanuel-nader.tech/.worktrees/recruiter-xp-refresh/qa-hobbies-albums-square.png`.

- Open P0 findings: none.
- Open P1 findings: none.
- Open P2 findings: none.

final result: passed
