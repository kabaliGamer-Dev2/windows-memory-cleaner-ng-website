# Bundled font licence

## DM Sans

The file `dm-sans-latin.woff2` and `dm-sans-latin-ext.woff2` in this directory
are subsets of **DM Sans**, obtained from Google Fonts.

- Copyright 2014–2024 The DM Sans Project Authors
  (<https://github.com/googlefonts/dm-fonts>)
- Licensed under the **SIL Open Font License, Version 1.1**
  (<https://openfontlicense.org/open-font-license-official-text/>)
- SIL OFL 1.1 is compatible with this project's GPL-3.0-or-later licence: the
  font is distributed as a separate work and is not linked into the
  application's source.

The full licence text was not vendored alongside the files because the upstream
text is long; it is available verbatim at the URL above. If you redistribute
this application, you must keep this notice and the licence reference.

### Why it is bundled rather than fetched

This application makes no network requests of any kind — that is a deliberate
security property, not an oversight. Fetching a webfont from a CDN would
contradict it and would also make the interface render in a fallback face for
offline users.

### Fallback

`Segoe UI Variable` (the native Windows 11 UI font) is the first fallback, so
the application remains fully legible if the bundled files are ever missing.
Characters outside the Latin subsets — including CJK — fall through to Windows
font linking automatically.
