# Personal blog

This repository is a small Jekyll blog published to GitHub Pages.

The intended site URL is <https://wallrick.github.io>.

## Writing a post

Add a Markdown file under `_posts/` using this filename format:

```text
YYYY-MM-DD-title-in-kebab-case.md
```

Include YAML front matter at the top of the file, then write the post in Markdown.

## Night mode

The site header includes a light/dark mode toggle. Until a visitor chooses a
mode, the site follows the browser's system preference. A selected mode is saved
in the browser's local storage and restored on later visits.

## Publishing

When GitHub Pages is enabled for the repository, pushing to `main` starts
`.github/workflows/pages.yml`. The workflow builds the Jekyll site and deploys
it to GitHub Pages.
