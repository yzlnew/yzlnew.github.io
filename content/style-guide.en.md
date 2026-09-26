---
title: "Style guide"
date: "2026-09-17"
slug: style-guide
type: page
hidden: true
comments: false
toc: true
katex: true
---

A notebook for the details: typography, images, equations, and interactive diagrams.

<!--more-->

### Words & rhythm

Good typography leaves room to think. This page uses the same components as every post: **a clear emphasis**, *a softer aside*, and [a link to the archive](/en/archives/).

> We write to remember what we noticed along the way.

A footnote keeps additional context close, without interrupting the sentence.[^note]

- A short observation
- An idea worth returning to

### Notices & details

{{< notice info >}}
This is a note with **Markdown** support.
{{< /notice >}}

{{< notice tip >}}
Use the table of contents to move through a longer article.
{{< /notice >}}

{{< notice warning >}}
Check the assumptions before interpreting a chart.
{{< /notice >}}

{{< details title="A little more context" >}}
This content is still available with JavaScript disabled.
{{< /details >}}

{{< tabs label="Two perspectives" >}}
{{< tab title="Observation" >}}
Start with what you can see. Use the arrow keys to switch tabs.
{{< /tab >}}
{{< tab title="Reflection" >}}
Then consider what the observation might mean.
{{< /tab >}}
{{< /tabs >}}

### Code

Copy the source without line numbers, or wrap long lines.

```python {linenos=table,linenostart=7,hl_lines=[2]}
def greet(name):
    message = f"Hello, {name} — a deliberately long line to demonstrate horizontal scrolling without widening the article on a small screen."
    return message
```

```text {linenos=false}
Plain text remains readable, too.
```

Legacy code indented with four spaces also supports copy and line wrapping:

    legacy_example = "Indented Markdown keeps its original text."
    print(legacy_example)

### Equations

Inline notation: \(a_{n+1} = a_n + 1\). Legacy notation: $E = mc^2$.

$$
\sum_{i=1}^n i = \frac{n(n+1)}{2}
$$

\[
\begin{aligned}
f(x) &= \int_0^x t^2\,dt \\
     &= \frac{x^3}{3}
\end{aligned}
\]

### Tables

| Component | Keyboard | Small screens | Without JavaScript |
| :--- | :--- | :--- | :--- |
| Table | Tab / ← → | Scroll locally | Full data |
| Code | Tab / Enter | Scroll or wrap | Highlighted source |
| Diagram | Tab / Enter | Responsive container | Description and source |

### Images

![Two concentric circles and a small yellow dot](/loop-study.svg "A study in repetition. Select to enlarge; Escape to close.")

{{< figure src="/loop-study.svg" width="320px" alt="Loop detail" caption="The existing figure shortcode is supported." >}}

### A week in numbers

```echarts {title="Reading and writing" description="Reading rises from 30 minutes on Monday to 75 on Saturday. Toggle a legend or drag the zoom slider."}
{
  "tooltip": {
    "trigger": "axis"
  },
  "legend": {
    "top": 0,
    "left": 64,
    "data": [
      "Reading",
      "Writing"
    ]
  },
  "grid": {
    "left": 64,
    "right": 20,
    "top": 52,
    "bottom": 112
  },
  "xAxis": {
    "type": "category",
    "data": [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun"
    ]
  },
  "yAxis": {
    "type": "value",
    "name": "Minutes",
    "nameLocation": "middle",
    "nameGap": 44,
    "nameRotate": 90
  },
  "dataZoom": [
    {
      "type": "slider",
      "start": 0,
      "end": 100,
      "height": 18,
      "bottom": 8
    }
  ],
  "series": [
    {
      "name": "Reading",
      "type": "bar",
      "data": [
        30,
        45,
        35,
        60,
        40,
        75,
        65
      ]
    },
    {
      "name": "Writing",
      "type": "bar",
      "data": [
        15,
        20,
        30,
        25,
        35,
        50,
        40
      ]
    }
  ]
}
```

{{< chart src="week.json" title="The same data, from a file" height="320" description="Daily reading and writing time, loaded with the chart shortcode." >}}

```echarts {title="Time and pages" description="Four observations: more reading time generally corresponds to more pages." height="300"}
{"tooltip":{},"xAxis":{"name":"min"},"yAxis":{"name":"pages"},"series":[{"type":"scatter","data":[[15,8],[30,18],[45,22],[60,35]]}]}
```

### Flows & conversations

```mermaid {title="From idea to note" description="An idea becomes a draft, then a published note, and eventually a new idea."}
flowchart LR
    A[Idea] --> B[Draft]
    B --> C[Note]
    C --> A
```

```mermaid {title="A quiet exchange" description="The reader opens a note and receives a thought to take away."}
sequenceDiagram
    Reader->>Notebook: Open a note
    Notebook-->>Reader: A thought to take away
```

### Raw HTML

<details class="disclosure"><summary>Native HTML still works</summary><div><p>Existing content remains compatible.</p></div></details>

[^note]: A small reference, with a link back to the text.

### Loop study & typography

The navigation sits in the central space beneath the torus. Its four plain text links use the 12px glyphs of [Ark Pixel Font](https://github.com/TakWolf/ark-pixel-font), rendered at 18px. Amber text and an underline mark the current page. The language, sun, moon, monitor and search controls use square pixel icons. Arrow keys also change the appearance selection.

Noto Sans SC for Chinese, Geist for Latin text, and JetBrains Mono for code and annotations. Variable weights keep headings clear and prose comfortable. All three fonts are served by this site.

Start with a question; leave a trail for the next exploration.

{{< loop-study >}}

### The Loop mark

The avatar, masthead and favicon share one tilted torus. At small sizes, fewer grid lines and stronger contours keep the amber orbit and open center legible.

{{< figure src="/loop-avatar.svg" width="160px" alt="A tilted wireframe torus with a amber orbit" caption="The Loop mark" >}}
