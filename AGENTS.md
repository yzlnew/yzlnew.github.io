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
