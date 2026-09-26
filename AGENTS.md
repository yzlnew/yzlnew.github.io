# Repository Syntax Documentation

This document describes the specific syntax and formatting conventions used in this Hugo blog repository. Agents working on this repository should follow these guidelines.

## Front Matter

Blog posts typically use the following Front Matter fields (TOML/YAML compatible):

```yaml
---
date: "YYYY-MM-DD"
title: "Post Title"
tags:
  - Tag1
  - Tag2
toc: true # Enable Table of Contents
draft: false
---
```

## Content Structure

### Heading Levels

Headings in the post content should start from Level 3 (`###`). This is because the post title usually serves as H1, and the site layout might use H2 for other structural elements or the user prefers this style.

### Summary Splitter

Use `<!--more-->` to split the post summary from the rest of the content. This allows the first part of the post to be shown in the post list.

```markdown
First paragraph or intro sentence.

<!--more-->

Rest of the content...
```

### Shortcodes

#### Notice

Use the `notice` shortcode to display alerts or important information.

Syntax:
```markdown
{{< notice type >}}
Content goes here.
{{< /notice >}}
```

Types: `info`, `tip`, `warning` (inferred from common usage, e.g., `frequent-itemset-mining.md` uses `info` and `tip`).

Example:
```markdown
{{< notice info >}}
注意，本文主要是来源 1 第二章的中文翻译。
{{< /notice >}}
```

#### MyGist

(Observed in `layouts/shortcodes/mygist.html`, if applicable to usage)
Usage: `{{< mygist id="gist_id" file="filename" >}}` (Standard Hugo gist or custom implementation).

## Code Blocks

Standard Markdown code blocks are used.

## Multilingual Content

The site supports Chinese (`zh-cn`, default) and English (`en`) via Hugo's [multilingual mode](https://gohugo.io/content-management/multilingual/).

- **Default language (Chinese):** files with no language suffix, e.g. `content/blog/foo.md`, render at the root (`/2026/03/foo/`).
- **English translations:** add a sibling file with the `.en.md` suffix, e.g. `content/blog/foo.en.md`, which renders under `/en/` (e.g. `/en/2026/03/foo/`).
- Both files should share the same `date` and `slug` so Hugo pairs them as translations and the language switcher links between them.
- Per-language site title, subtitle, and menu are configured under `[languages.zh-cn]` and `[languages.en]` in `config.toml`.
- UI strings live in `i18n/zh-cn.yaml` and `i18n/en.yaml`; reference them in templates with `{{ i18n "key" }}`.

## Loop Theme Maintenance

- Active theme: `themes/loop`; keep `themes/ink` as historical reference. Do not edit its submodule for new features.
- Use Hugo extended **0.161.1**, pinned in `.hugo-version`, Node.js 22 and `npm ci`. Build via `npm run build` so local KaTeX/ECharts/Mermaid assets are available. Generated `public/`, `resources/` and `themes/loop/static/vendor/` are ignored.
- Run `npm run check:site`, `npm run check:rendering` and `npm test` after rendering or interaction changes. Install Chromium with `npx playwright install chromium` when needed. Tests start their own local server unless port 4173 already serves the built site.
- Preserve dates, slugs, language paths, `<!--more-->`, and existing content. New body headings start at `###`; the TOC also accepts legacy `##` headings.
- Keep UI strings in root `i18n/zh-cn.yaml` / `i18n/en.yaml`. Both `/style-guide/` pages should demonstrate new components with `hidden: true` and `comments: false`.
- `hidden: true` excludes a page from lists, archives, search and RSS, but does not protect its URL. Search indexes are per language and must exclude drafts even during draft preview.
- Math requires `katex: true`. New articles should use `\(...\)`, `$$...$$` or `\[...\]`; old `$...$` is supported through passthrough. Use inline code for currency amounts in math-enabled prose. Never run auto-render twice or on code/chart sources.
- Code fences retain Hugo highlighting options, e.g. `python {linenos=table,linenostart=7,hl_lines=[2]}`. Copy from the raw source, never rendered line numbers.
- `echarts` fences accept JSON only; `mermaid` fences use strict mode. Both accept `title` and `description` fence attributes; ECharts also accepts integer `height`. Do not add executable configuration or inline JS callbacks.
- Chart files: `{{< chart src="week.json" title="一周" height="360" description="每日分钟数。" >}}`. Resolve page bundle resources first, then `data/charts`. Keep descriptions/source readable if loading fails or JavaScript is disabled.
- Folding content: `{{< details title="更多" >}}…{{< /details >}}`. Tabs: `{{< tabs label="视角" >}}{{< tab title="一" >}}…{{< /tab >}}{{< tab title="二" >}}…{{< /tab >}}{{< /tabs >}}`. Tab content is Markdown; no-JS must show every panel.
- Preserve both `{{< mygist USER ID >}}` and named `{{< mygist id="ID" file="FILE" >}}`, the `figure` shortcode, raw HTML, RSS identity and Utterances enable settings.
- Respect reduced motion, keyboard navigation/focus restoration, local horizontal scrolling and the system/light/dark preference. Ordinary articles must not fetch chart libraries.
- Do not replace external content images automatically. Record confirmed broken image URLs as content issues. See README for copyable examples and docs/verification.md for the migration results.
