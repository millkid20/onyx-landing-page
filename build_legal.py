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
VERSION = "5"   # bump when site.css changes, so browsers fetch the new one

# One line under each card, and its colour and icon.
CARDS = {
    "privacy": ("Your data, and who sees it", "#5cd973",
                '<path d="M12 3l7 3v5c0 4.6-3 8.4-7 10-4-1.6-7-5.4-7-10V6z"/><path d="M9 12l2 2 4-4"/>'),
    "terms": ("The rules, and your subscription", "#598cff",
              '<path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/><path d="M10 13h6M10 17h6"/>'),
    "medical": ("What Onyx is, and isn't", "#ff6b81",
                '<path d="M3 12h4l2-5 4 10 2-5h6"/>'),
    "support": ("Answers, and how to reach me", "#e2ac5f",
                '<path d="M4 5h16v11H9l-5 4z"/><path d="M10 9.5a2 2 0 1 1 2.6 1.9c-.4.1-.6.5-.6.9v.2M12 14.5h.01"/>'),
    "accessibility": ("For every way you use Onyx", "#5ce6c7",
                      '<circle cx="12" cy="4.5" r="1.8"/><path d="M5 8.5l7 1.5 7-1.5M12 10v5l-3.5 6M12 15l3.5 6"/>'),
}


def icon(slug, size=22):
    return (f'<svg viewBox="0 0 24 24" width="{size}" height="{size}" fill="none" stroke="currentColor" '
            f'stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{CARDS[slug][2]}</svg>')


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


def sections(content):
    """Intro (before the first heading) and one card per ## section."""
    parts = re.split(r'(?=<h2 id=)', content)
    intro = parts[0].strip()
    cards = [p.strip() for p in parts[1:]]
    toc = [(m.group(1), re.sub("<[^>]+>", "", m.group(2))) for m in
           (re.match(r'<h2 id="([^"]+)">(.*?)</h2>', c) for c in cards) if m]
    return intro, cards, toc


def page(meta, content, updated):
    me = meta["slug"]
    color = CARDS[me][1]
    cards = "".join(
        f'<a class="pcard{" current" if s == me else ""}" href="{s}.html" style="--tint:{CARDS[s][1]}"'
        f'{" aria-current=page" if s == me else ""}><span class="pico">{icon(s)}</span>'
        f'<b>{name}</b><span>{CARDS[s][0]}</span></a>' for s, name in PAGES)
    links = "".join(f'<a href="{s}.html">{name}</a>' for s, name in PAGES)
    intro, blocks, toc = sections(content)
    when = f'<span class="chip">Updated {updated}</span>' if updated else ""
    intro_html = f'<div class="lead-card glass">{intro}</div>' if intro else ""
    body = "".join(f'<section class="lcard glass">{b}</section>' for b in blocks)
    toc_html = ("<aside class=\"toc\"><div class=\"cap\">On this page</div>" +
                "".join(f'<a href="#{i}">{t}</a>' for i, t in toc) + "</aside>") if len(toc) > 2 else ""
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
  <link rel="stylesheet" href="assets/site.css?v={VERSION}" />
</head>
<body class="legal-page" style="--tint:{color}">
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
  <main class="legal-wrap">
    <p class="label" style="text-align:left">Policies</p>
    <nav class="policy-cards" aria-label="Policies">{cards}</nav>

    <header class="legal-hero glass">
      <span class="hero-ico">{icon(me, 30)}</span>
      <div>
        <h1>{meta['title']}</h1>
        <p class="desc">{html.escape(meta['description'])}</p>
        {when}
      </div>
    </header>

    <div class="legal-body">
      {toc_html}
      <article class="legal">
        {intro_html}
        {body}
      </article>
    </div>
  </main>
  <footer class="site">
    <div class="foot">
      <div class="brandline"><img src="assets/icon.jpg" alt="" />Onyx: Fitness &amp; AI Coach</div>
      <nav aria-label="Footer"><a href="./">Home</a>{links}</nav>
      <p><a class="social" href="https://www.instagram.com/getonyxapp/" target="_blank" rel="noopener" aria-label="Onyx on Instagram, @getonyxapp"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>@getonyxapp</a></p>
      <p>Onyx is not a medical device and does not diagnose. © 2026 TheMillerBrand.</p>
    </div>
  </footer>
  <script>
    // Highlight the section you're reading in "On this page".
    (function () {{
      var links = document.querySelectorAll(".toc a");
      if (!links.length || !("IntersectionObserver" in window)) return;
      var byId = {{}};
      links.forEach(function (a) {{ byId[a.getAttribute("href").slice(1)] = a; }});
      var io = new IntersectionObserver(function (es) {{
        es.forEach(function (e) {{
          if (!e.isIntersecting) return;
          links.forEach(function (a) {{ a.classList.remove("on"); }});
          var h = e.target.querySelector("h2"), a = h && byId[h.id];
          if (a) a.classList.add("on");
        }});
      }}, {{ rootMargin: "-30% 0px -60% 0px" }});
      document.querySelectorAll(".lcard").forEach(function (c) {{ io.observe(c); }});
    }})();
  </script>
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
