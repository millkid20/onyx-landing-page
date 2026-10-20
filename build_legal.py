#!/usr/bin/env python3
"""Builds the policy pages from the Markdown in _legal/.

Edit a file in _legal/, run `python3 build_legal.py`, commit both. Each
source starts with a small header (title, slug, description) and uses
plain Markdown: ## and ### headings, paragraphs, - lists, | tables,
**bold**, *italic* and [links](url).
"""
import html
import pathlib
import re

ROOT = pathlib.Path(__file__).parent
STORE = "https://apps.apple.com/us/app/onyx-fitness-ai-coach/id6758569382?uo=4"
PAGES = [("privacy", "Privacy"), ("terms", "Terms"), ("medical", "Medical Disclaimer"),
         ("support", "Support"), ("accessibility", "Accessibility")]


def inline(t):
    t = html.escape(t, quote=False)
    t = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2">\1</a>', t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"(?<![*\w])\*(?!\s)(.+?)(?<!\s)\*(?![*\w])", r"<em>\1</em>", t)
    t = re.sub(r"(?<![\w/\"'>])([\w.+-]+@[\w-]+\.[\w.]+)", r'<a href="mailto:\1">\1</a>', t)
    return t


def slug(t):
    return re.sub(r"[^a-z0-9]+", "-", re.sub(r"^\d+\.\s*", "", t).lower()).strip("-")


def render(md):
    out, para, lines, i = [], [], md.split("\n"), 0

    def flush():
        if para:
            out.append("<p>" + inline(" ".join(x.strip() for x in para)) + "</p>")
            para.clear()

    while i < len(lines):
        line = lines[i]
        if not line.strip():
            flush(); i += 1; continue
        m = re.match(r"(#{2,3}) (.*)", line)
        if m:
            flush(); level = len(m.group(1)); text = m.group(2).strip()
            out.append(f'<h{level} id="{slug(text)}">{inline(text)}</h{level}>'); i += 1; continue
        if line.lstrip().startswith("- "):
            flush(); items = []
            while i < len(lines) and (lines[i].lstrip().startswith("- ") or (lines[i].startswith("  ") and lines[i].strip() and items)):
                if lines[i].lstrip().startswith("- "):
                    items.append(lines[i].lstrip()[2:])
                else:
                    items[-1] += " " + lines[i].strip()
                i += 1
            out.append("<ul>" + "".join("<li>" + inline(x) + "</li>" for x in items) + "</ul>"); continue
        if line.startswith("|"):
            flush(); rows = []
            while i < len(lines) and lines[i].startswith("|"):
                rows.append([c.strip() for c in lines[i].strip().strip("|").split("|")]); i += 1
            head, body = rows[0], [r for r in rows[1:] if not set("".join(r)) <= set("-: ")]
            out.append('<div class="table-wrap"><table><thead><tr>' + "".join("<th>" + inline(c) + "</th>" for c in head) +
                       "</tr></thead><tbody>" + "".join("<tr>" + "".join("<td>" + inline(c) + "</td>" for c in r) + "</tr>" for r in body) +
                       "</tbody></table></div>"); continue
        para.append(line); i += 1
    flush()
    return "\n".join(out)


def page(meta, content, updated):
    tabs = "".join(
        f'<a href="{s}.html"{" aria-current=page" if s == meta["slug"] else ""}>{name}</a>' for s, name in PAGES)
    when = f'<p class="updated">Last updated: {updated}</p>' if updated else ""
    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="color-scheme" content="dark" />
  <meta name="theme-color" content="#000000" />
  <title>{meta['title']} · Onyx</title>
  <meta name="description" content="{html.escape(meta['description'])}" />
  <link rel="icon" href="assets/icon.jpg" />
  <link rel="stylesheet" href="assets/site.css" />
</head>
<body>
  <header class="site">
    <div class="nav">
      <a class="brand" href="./" aria-label="Onyx home"><img src="assets/icon.jpg" alt="" />ONYX</a>
      <nav class="nav-links" aria-label="Page">
        <a class="nl" href="./#features">Features</a>
        <a class="nl" href="./#pricing">Pricing</a>
        <a class="nl" href="support.html">Support</a>
        <a class="btn-pill" href="{STORE}" target="_blank" rel="noopener">Download</a>
      </nav>
    </div>
  </header>
  <main class="legal">
    <nav class="legal-tabs" aria-label="Policies">{tabs}</nav>
    <h1>{meta['title']}</h1>
    {when}
{content}
  </main>
  <footer class="site">
    <div class="foot">
      <div class="brandline"><img src="assets/icon.jpg" alt="" />Onyx: Fitness &amp; AI Coach</div>
      <nav aria-label="Footer"><a href="./">Home</a>{tabs}</nav>
      <p>Onyx is not a medical device and does not diagnose. © 2026 TheMillerBrand.</p>
    </div>
  </footer>
</body>
</html>
"""


for src in sorted((ROOT / "_legal").glob("*.md")):
    text = src.read_text()
    head, body = re.match(r"---\n(.*?)\n---\n(.*)", text, re.S).groups()
    meta = dict(l.split(": ", 1) for l in head.splitlines())
    m = re.search(r"^\*Last updated: (.+?)\*$", body, re.M)
    updated = m.group(1) if m else ""
    if m:
        body = body.replace(m.group(0), "")
    (ROOT / f"{meta['slug']}.html").write_text(page(meta, render(body.strip()), updated))
    print("built", meta["slug"] + ".html")
