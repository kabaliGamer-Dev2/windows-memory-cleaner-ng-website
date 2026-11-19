# Windows Memory Cleaner NG — official website

The product website for Windows Memory Cleaner NG. Static HTML, CSS and vanilla
JavaScript. No framework, no build step, no third-party scripts.

```
website/
├── index.html            the product page
├── terms.html            terms of use
├── privacy.html          privacy policy (site and application, separately)
├── license.html          licence summary, third-party credits, attribution
├── 404.html              GitHub Pages fallback
├── styles.css            design system and layout
├── app.js                navigation, gallery, FAQ, copy-to-clipboard
├── robots.txt
├── sitemap.xml
├── site.webmanifest
└── assets/
    ├── icon.png, icon-256.png
    ├── fonts/            DM Sans (SIL OFL 1.1) + licence notice
    └── shots/            eight screenshots captured from the running application
```

## Deploying to GitHub Pages

1. Create a public repository named `windows-memory-cleaner-ng-website`.
2. Push the contents of this `website/` folder to its `main` branch — not the
   folder itself, its contents.
3. In **Settings → Pages**, set the source to *Deploy from a branch*, branch
   `main`, folder `/ (root)`.
4. The site appears at `https://<username>.github.io/windows-memory-cleaner-ng-website/`.

No workflow file is needed, and there is no build step. `.nojekyll` is included so
GitHub serves the folder as-is without running Jekyll.

## Updating the canonical URL

If the repository name or owner changes, update the absolute URLs in:

- `index.html` — `<link rel="canonical">`, `og:url`, `og:image`, `twitter:image`,
  and the two JSON-LD blocks;
- `terms.html`, `privacy.html`, `license.html` — `<link rel="canonical">`;
- `sitemap.xml` and `robots.txt`.

## Publishing a release (filling in the download section)

The download section currently states, accurately, that no release has been
published, and offers no fake download links. To publish:

1. Attach the installer and the portable executable to a GitHub Release on the
   application repository, plus `SHA256SUMS.txt`.
2. In `index.html`, in the `#download` section:
   - replace the two `<div class="dl dl--unavailable">` blocks with anchors whose
     `href` is the release asset URL;
   - fill in the real file sizes in `.dl__meta`;
   - put the real checksum in `#shaValue` and in `data-copy` on `#copySha`;
   - remove the "not published yet" notice from `#downloadState`.
3. Update `softwareVersion` in the JSON-LD block if the version changed.

Never put a placeholder URL in `href`. An unavailable download that says so is
worth more than a button that fails.

## Design notes

The palette is the desktop application's own (`src/styles/tokens.css`): background
`#08090b`, surface `#101317`, accent `hsl(36 68% 68%)`, plus its ok/warn/danger/info
colours. The typeface is the application's bundled DM Sans, self-hosted.

The layout is deliberately editorial rather than card-per-feature: alternating
narrative blocks, oversized section numerals, real screenshots in a window frame.
Every screenshot on the page was captured from the running application — none are
mockups, and the failed-run badge visible in the dashboard shot is a real failed
run, kept because it demonstrates the application's failure reporting.

## Accessibility and performance

Verified with Lighthouse on the built page, desktop and mobile profiles: 100 for
Accessibility, Best Practices and SEO on both. Keyboard navigation, visible focus
rings, a focus trap in the lightbox, `prefers-reduced-motion` support, and text
contrast checked against the palette.

## Licence

The website content is copyright © 2026 Kabali Gamer, all rights reserved. The
DM Sans font is licensed under the SIL Open Font License 1.1 — see
`assets/fonts/OFL-NOTICE.md`.
