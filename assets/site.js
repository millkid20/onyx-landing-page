/* Onyx landing page: the interactive pieces.
   Every widget starts when it scrolls into view, and settles straight to
   its final state for people who prefer reduced motion. */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  document.documentElement.classList.add("js");

  /** Run `fn` once when `el` first comes into view. */
  function whenSeen(el, fn, threshold) {
    if (!el) return;
    if (!("IntersectionObserver" in window)) { fn(); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); fn(); } });
    }, { threshold: threshold == null ? 0.35 : threshold });
    io.observe(el);
  }

  var easeOut = function (t) { return 1 - Math.pow(1 - t, 3); };

  /** Tween a number from `from` to `to`, calling `step(v)` each frame. */
  function tween(from, to, ms, step, done) {
    if (reduce) { step(to); if (done) done(); return; }
    var t0 = performance.now();
    (function frame(now) {
      var t = Math.min(1, (now - t0) / ms);
      step(from + (to - from) * easeOut(t));
      if (t < 1) requestAnimationFrame(frame); else if (done) done();
    })(t0);
  }

  function fmt(v, dec, sep) {
    var s = v.toFixed(dec || 0);
    if (sep) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return s;
  }

  /** Count every [data-count] inside `root` up from zero. */
  function countUp(root) {
    $$("[data-count]", root).forEach(function (el) {
      var to = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec || "0", 10), sep = !!el.dataset.sep;
      tween(0, to, 1400, function (v) { el.textContent = fmt(v, dec, sep); });
    });
  }

  /** Fill every ring circle with [data-ring] inside `root`. */
  function fillRings(root) {
    $$("circle[data-ring]", root).forEach(function (c) {
      var len = 2 * Math.PI * c.r.baseVal.value;
      c.style.strokeDasharray = len;
      c.style.strokeDashoffset = len;
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { c.style.strokeDashoffset = len * (1 - parseFloat(c.dataset.ring)); });
      });
    });
  }

  /** Grow every bar with [data-w] inside `root`. */
  function fillBars(root, delay) {
    $$("[data-w]", root).forEach(function (b, i) {
      setTimeout(function () { b.style.width = b.dataset.w + "%"; }, reduce ? 0 : (delay || 0) + i * 90);
    });
  }

  /** Draw an SVG path along its length. */
  function drawPath(p, ms, delay) {
    if (!p) return;
    var len = p.getTotalLength();
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = reduce ? 0 : len;
    if (reduce) return;
    p.getBoundingClientRect();
    p.style.transition = "stroke-dashoffset " + ms + "ms cubic-bezier(.65,0,.35,1) " + (delay || 0) + "ms";
    p.style.strokeDashoffset = 0;
  }

  /* ---------- reveal + scroll progress ---------- */
  var items = $$(".rv");
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
    items.forEach(function (el) { io.observe(el); });
    setTimeout(function () { items.forEach(function (el) { el.classList.add("in"); }); }, 12000);
  } else items.forEach(function (el) { el.classList.add("in"); });

  var progress = $("#progress");
  var stage = $("#heroStage");
  var floats = $$(".float", stage);
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var h = document.documentElement;
      var p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
      if (progress) progress.style.transform = "scaleX(" + p + ")";
      if (!reduce && stage) {
        var y = window.scrollY;
        floats.forEach(function (f) { f.style.transform = "translateY(" + (-y * 0.18 * parseFloat(f.dataset.depth)) + "px)"; });
      }
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- hero ---------- */
  setTimeout(function () { fillRings(stage); countUp(stage); }, reduce ? 0 : 500);

  /* ---------- statement: words light up as you scroll ---------- */
  var st = $("#statement");
  if (st && !reduce) {
    var dim = $(".dim", st);
    var words = dim.textContent.split(" ");
    dim.innerHTML = words.map(function (w) { return '<span class="w">' + w + "</span>"; }).join(" ");
    var spans = $$(".w", dim);
    window.addEventListener("scroll", function () {
      var r = st.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (window.innerHeight * 0.85 - r.top) / (window.innerHeight * 0.55)));
      var lit = Math.round(p * spans.length);
      spans.forEach(function (s, i) { s.classList.toggle("lit", i < lit); });
    }, { passive: true });
  }

  /* ---------- readiness ---------- */
  (function () {
    var ring = $("#rdRing"); if (!ring) return;
    var len = 2 * Math.PI * 50;
    ring.style.strokeDasharray = len; ring.style.strokeDashoffset = len;
    var sSleep = $("#sSleep"), sHrv = $("#sHrv"), sRhr = $("#sRhr");
    var score = $("#rdScore"), verdict = $("#rdVerdict"), sub = $("#rdSub");
    var shown = 0;
    function hm(h) { var m = Math.round(h * 60); return Math.floor(m / 60) + "h " + (m % 60) + "m"; }
    function compute() {
      var sleep = parseFloat(sSleep.value), hrv = parseFloat(sHrv.value), rhr = parseFloat(sRhr.value);
      $("#vSleep").textContent = hm(sleep);
      $("#vHrv").textContent = (hrv > 0 ? "+" : hrv < 0 ? "−" : "") + Math.abs(hrv) + "%";
      $("#vRhr").textContent = (rhr > 0 ? "+" : rhr < 0 ? "−" : "") + Math.abs(rhr) + " bpm";
      // Shaped like the app's weighting: HRV leads, then resting HR, then sleep.
      var v = 58 + hrv * 0.9 - rhr * 1.6 + (sleep - 7) * 8;
      return Math.max(4, Math.min(99, Math.round(v)));
    }
    function show(v, animate) {
      var color = v >= 67 ? "#5cd973" : v >= 34 ? "#ffb347" : "#ff5c5c";
      ring.style.stroke = color; ring.style.color = color;
      ring.style.strokeDashoffset = len * (1 - v / 100);
      verdict.style.color = color;
      verdict.textContent = v >= 67 ? "Primed" : v >= 34 ? "Steady" : "Recovery day";
      sub.textContent = v >= 67 ? "Push today." : v >= 34 ? "Train, but don't test yourself." : "Go easy. You'll be back tomorrow.";
      var from = shown; shown = v;
      if (animate) tween(from, v, 700, function (x) { score.textContent = Math.round(x); });
      else score.textContent = v;
    }
    [sSleep, sHrv, sRhr].forEach(function (s) { s.addEventListener("input", function () { show(compute(), false); }); });
    score.textContent = "0";
    whenSeen($("#readiness"), function () { show(compute(), true); });
  })();

  /* ---------- early warning ---------- */
  (function () {
    var box = $("#warning"); if (!box) return;
    var sigs = $$(".signal", box);
    whenSeen(box, function () {
      sigs.forEach(function (s, i) {
        setTimeout(function () { s.classList.add("in"); drawPath($("path", s), 900); }, reduce ? 0 : i * 450);
      });
      setTimeout(function () { $("#alert").classList.add("in"); }, reduce ? 0 : sigs.length * 450 + 300);
    });
    var btn = $("#recoveryBtn"), days = $$(".day", box);
    var normal = [["heavy", "Heavy"], ["mod", "Moderate"], ["heavy", "Heavy"], ["mod", "Moderate"], ["rest", "Rest"]];
    var eased = [["rest", "Rest"], ["easy", "Easy walk"], ["mod", "Moderate"], ["easy", "Easy"], ["mod", "Moderate"]];
    btn.addEventListener("click", function () {
      var on = btn.getAttribute("aria-pressed") !== "true";
      btn.setAttribute("aria-pressed", on);
      btn.textContent = on ? "Recovery Mode is on ✓" : "Start Recovery Mode";
      days.forEach(function (d, i) {
        setTimeout(function () {
          var p = (on ? eased : normal)[i];
          d.className = "day d-" + p[0];
          $("b", d).textContent = p[1];
        }, reduce ? 0 : i * 90);
      });
    });
  })();

  /* ---------- coach chat ---------- */
  (function () {
    var log = $("#chatLog"); if (!log) return;
    var Q = [
      ["Should I train today?",
       "Yes. Your HRV is 58 ms, above your usual 51, and you slept 7h 38m. Go heavy on upper body today."],
      ["Why has my HRV been low?",
       "On the 3 nights you logged drinks, your HRV averaged 41 ms against your usual 51. Two 3pm espressos didn't help. Try caffeine before noon this week and I'll watch what happens."],
      ["Build me 45 minutes with dumbbells.",
       "Upper Body, 45 minutes: incline press 4×8, one-arm row 4×10, seated press 3×10, lateral raise 3×12, curls 3×10. Weights start from last time.", true],
      ["What should I eat before my long run?",
       "Make tonight's dinner carb-forward: rice or pasta with a lean protein, easy on fat and fibre. Tomorrow, a banana and toast about an hour before you head out. You've got 750 kcal left today, so there's room."]
    ];
    var busy = false, chips = $$("#qchips button");
    function bubble(cls, html) {
      var d = document.createElement("div");
      d.className = "msg " + cls; d.innerHTML = html;
      log.appendChild(d); log.scrollTop = log.scrollHeight; return d;
    }
    function ask(i) {
      if (busy) return; busy = true;
      chips.forEach(function (c) { c.setAttribute("aria-pressed", c.dataset.q == i); });
      var q = Q[i];
      bubble("me", q[0]);
      var t = bubble("coach typing", "<i></i><i></i><i></i>");
      setTimeout(function () {
        t.className = "msg coach"; t.textContent = "";
        var words = q[1].split(" "), n = 0;
        (function type() {
          n++;
          t.textContent = words.slice(0, n).join(" ");
          log.scrollTop = log.scrollHeight;
          if (n < words.length) setTimeout(type, reduce ? 0 : 38);
          else {
            if (q[2]) {
              var b = document.createElement("button");
              b.className = "approve"; b.type = "button"; b.textContent = "Approve";
              b.addEventListener("click", function () { b.textContent = "Added to today ✓"; b.disabled = true; });
              t.appendChild(document.createElement("br")); t.appendChild(b);
              log.scrollTop = log.scrollHeight;
            }
            busy = false;
          }
        })();
      }, reduce ? 0 : 900);
    }
    chips.forEach(function (c) { c.addEventListener("click", function () { ask(parseInt(c.dataset.q, 10)); }); });
    whenSeen($("#chat"), function () { setTimeout(function () { ask(0); }, reduce ? 0 : 400); }, 0.5);
  })();

  /* ---------- labs ---------- */
  (function () {
    var box = $("#labs"); if (!box) return;
    var ms = $$(".marker", box);
    ms.forEach(function (m) {
      var min = +m.dataset.min, max = +m.dataset.max, pct = function (v) { return Math.max(2, Math.min(98, (v - min) / (max - min) * 100)); };
      var ok = $(".ok", m), lo = pct(+m.dataset.lo), hi = pct(+m.dataset.hi);
      ok.style.left = lo + "%"; ok.style.width = (hi - lo) + "%";
      m._target = pct(+m.dataset.v);
    });
    var line = $("#ldlLine");
    whenSeen(box, function () {
      ms.forEach(function (m, i) { setTimeout(function () { $(".dot", m).style.left = m._target + "%"; }, reduce ? 0 : 200 + i * 250); });
      drawPath(line, 1200, 900);
    });
  })();

  /* ---------- fuel ---------- */
  whenSeen($("#fuel"), function () { var f = $("#fuel"); fillRings(f); countUp(f); fillBars(f, 200); });

  (function () {
    var DATA = {
      product: [
        { n: 8.9, why: "Minimally processed, high protein, live cultures. A genuinely strong product by any standard measure." },
        { n: 2.3, why: "Heavily processed, refined carbs and flavour packets. Low on nutrients before your body even enters the picture." },
        { n: 8.4, why: "Just nuts and salt: nutrient-dense healthy fats, no additives. Scores well as a product, full stop." }
      ],
      you: [
        { n: 9.2, why: "High protein, barely processed. And you're 55 g short on protein today. This is exactly what your day is missing." },
        { n: 1.8, why: "Already a low scorer. For you it's worse: a full day's sodium in one pack, landing on a low-readiness day after training." },
        { n: 6.9, why: "Clean and nutrient-dense. But calorie-heavy, and you're already most of the way to today's fat target. A spoon, not a jar." }
      ]
    };
    var cards = $$("#scoreGrid .score-card"), bP = $("#segProduct"), bY = $("#segYou"), knob = $("#segKnob");
    if (!cards.length) return;
    var current = cards.map(function () { return 0; });
    function place(btn) { knob.style.left = btn.offsetLeft + "px"; knob.style.width = btn.offsetWidth + "px"; }
    function setMode(mode) {
      var btn = mode === "product" ? bP : bY;
      bP.setAttribute("aria-pressed", mode === "product"); bY.setAttribute("aria-pressed", mode === "you");
      place(btn);
      cards.forEach(function (card, i) {
        var d = DATA[mode][i], num = $("[data-num]", card), bar = $("[data-bar]", card), from = current[i];
        current[i] = d.n;
        tween(from, d.n, 600, function (v) { num.textContent = v.toFixed(1); });
        bar.style.width = d.n * 10 + "%";
        bar.style.background = d.n >= 7 ? "var(--green)" : d.n >= 4 ? "var(--amber)" : "var(--red)";
        $("[data-why]", card).textContent = d.why;
      });
    }
    bP.addEventListener("click", function () { setMode("product"); });
    bY.addEventListener("click", function () { setMode("you"); });
    window.addEventListener("resize", function () { place(bY.getAttribute("aria-pressed") === "true" ? bY : bP); });
    cards.forEach(function (c) { $("[data-num]", c).textContent = "0.0"; $("[data-bar]", c).style.width = "0"; });
    whenSeen($("#scoreGrid"), function () { setMode("you"); });
    place(bY);
  })();

  /* ---------- set logger ---------- */
  (function () {
    var list = $("#setList"); if (!list) return;
    var N = 4, done = 0, timer = null;
    for (var i = 0; i < N; i++) {
      list.insertAdjacentHTML("beforeend",
        '<div class="set' + (i === 0 ? " next" : "") + '"><span class="n">' + (i + 1) + '</span><span class="w num">185 lb</span><span class="r">× 7</span>' +
        '<button class="tick" type="button" aria-label="Finish set ' + (i + 1) + '"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7"/></svg></button></div>');
    }
    var rows = $$(".set", list), rest = $("#rest"), rRing = $("#restRing"), rTime = $("#restTime"), toast = $("#setToast");
    var len = 2 * Math.PI * 48;
    rRing.style.strokeDasharray = len;
    function startRest() {
      clearInterval(timer);
      rest.classList.add("on");
      var total = 90, left = total;
      rRing.style.strokeDashoffset = 0;
      rTime.textContent = "1:30";
      // A real 90 seconds is long for a web page; this one runs fifteen times faster.
      timer = setInterval(function () {
        left -= 1;
        rTime.textContent = Math.floor(left / 60) + ":" + ("0" + (left % 60)).slice(-2);
        rRing.style.strokeDashoffset = len * (1 - left / total);
        if (left <= 0) { clearInterval(timer); rest.classList.remove("on"); }
      }, reduce ? 1 : 66);
    }
    rows.forEach(function (row, i) {
      $(".tick", row).addEventListener("click", function () {
        if (row.classList.contains("done")) return;
        row.classList.add("done"); row.classList.remove("next");
        done++;
        if (rows[i + 1] && !rows[i + 1].classList.contains("done")) rows[i + 1].classList.add("next");
        if (done < N) startRest();
        else {
          clearInterval(timer); rest.classList.remove("on");
          toast.textContent = "All 7s again. Next time: 190 lb ↗";
        }
      });
    });
  })();

  /* ---------- run map ---------- */
  (function () {
    var box = $("#run"); if (!box) return;
    var route = $("#route"), glow = $("#routeGlow"), runner = $("#runner");
    var len = route.getTotalLength();
    [route, glow].forEach(function (p) { p.style.strokeDasharray = len; p.style.strokeDashoffset = len; });
    function play() {
      var ms = reduce ? 1 : 4200, t0 = performance.now();
      fillBars($(".zones", box), reduce ? 0 : 600);
      (function frame(now) {
        var t = Math.min(1, (now - t0) / ms), e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        var off = len * (1 - e);
        route.style.strokeDashoffset = off; glow.style.strokeDashoffset = off;
        var pt = route.getPointAtLength(len * e);
        runner.setAttribute("cx", pt.x); runner.setAttribute("cy", pt.y);
        $("#rDist").textContent = (5.21 * e).toFixed(2);
        var secs = Math.round(2538 * e);
        $("#rTime").textContent = Math.floor(secs / 60) + ":" + ("0" + (secs % 60)).slice(-2);
        $("#rHr").textContent = e < .02 ? "—" : Math.round(128 + 26 * Math.min(1, e * 3) + Math.sin(now / 180) * 3);
        if (t < 1) requestAnimationFrame(frame); else $("#rHr").textContent = "152";
      })(t0);
    }
    whenSeen(box, play, 0.45);
  })();

  /* ---------- biological age ---------- */
  (function () {
    var box = $("#bioage"); if (!box) return;
    var C = 130, R = 104;
    // 270° track, open at the bottom. Angles in degrees, clockwise from 12 o'clock.
    function pt(a) { var r = (a - 90) * Math.PI / 180; return [C + R * Math.cos(r), C + R * Math.sin(r)]; }
    function arc(a0, a1) {
      var p0 = pt(a0), p1 = pt(a1), large = Math.abs(a1 - a0) > 180 ? 1 : 0, sweep = a1 > a0 ? 1 : 0;
      return "M" + p0[0] + " " + p0[1] + " A" + R + " " + R + " 0 " + large + " " + sweep + " " + p1[0] + " " + p1[1];
    }
    $("#gTrack").setAttribute("d", arc(-135, 135));
    var tick0 = pt(0), tIn = [C + (R - 16) * Math.cos(-Math.PI / 2), C + (R - 16) * Math.sin(-Math.PI / 2)];
    var tick = $("#gTick");
    tick.setAttribute("x1", tick0[0]); tick.setAttribute("y1", tick0[1] - 12); tick.setAttribute("x2", tIn[0]); tick.setAttribute("y2", tIn[1] + 4);
    var val = $("#gVal"), knob = $("#gKnob"), years = $("#gYears"), age = $("#gAge"), lever = $("#gLever");
    var sSteps = $("#bSteps"), sCardio = $("#bCardio"), sSwing = $("#bSwing");
    var shown = 0;
    function draw(d) {
      // −10 years at the far left end, +10 at the far right.
      var a = Math.max(-135, Math.min(135, d / 10 * 135));
      val.setAttribute("d", Math.abs(a) < .5 ? "M0 0" : arc(0, a));
      var p = pt(a); knob.setAttribute("cx", p[0]); knob.setAttribute("cy", p[1]);
      knob.setAttribute("fill", d <= 0 ? "#598cff" : "#ffb347");
      years.textContent = (d < 0 ? "−" : d > 0 ? "+" : "") + Math.abs(d).toFixed(1);
      age.textContent = (34 + d).toFixed(1) + " vs 34";
    }
    function model() {
      var steps = +sSteps.value, cardio = +sCardio.value, swing = +sSwing.value;
      $("#vSteps").textContent = steps.toLocaleString("en-US");
      $("#vCardio").textContent = cardio + " min";
      $("#vSwing").textContent = swing + " min";
      var d = -3.1 - (steps - 8000) * 0.00015 - (cardio - 120) * 0.006 + (swing - 40) * 0.012;
      // Which habit would buy the most years from here, by the same next step.
      var gains = [
        ["more steps", steps < 15000 ? 0.00015 * 2000 : 0],
        ["more cardio", cardio < 300 ? 0.006 * 60 : 0],
        ["a steadier bedtime", swing > 10 ? 0.012 * 20 : 0]
      ].sort(function (a, b) { return b[1] - a[1]; });
      lever.innerHTML = gains[0][1] > 0 ? "Biggest lever: <b>" + gains[0][0] + "</b>" : "You've maxed out these three. <b>Nice.</b>";
      return Math.round(d * 10) / 10;
    }
    function update(animate) {
      var d = model(), from = shown; shown = d;
      if (animate) tween(from, d, 1300, draw); else draw(d);
    }
    [sSteps, sCardio, sSwing].forEach(function (s) { s.addEventListener("input", function () { update(false); }); });
    draw(0);
    whenSeen(box, function () { update(true); });
  })();

  /* ---------- sleep ---------- */
  (function () {
    var box = $("#sleep"); if (!box) return;
    var line = $("#hypnoLine");
    line.style.strokeDasharray = line.getTotalLength(); line.style.strokeDashoffset = line.getTotalLength();
    whenSeen(box, function () { countUp(box); drawPath(line, 2200, 200); fillBars($(".stages", box), 600); });
  })();

  /* ---------- week ---------- */
  whenSeen($("#tiles"), function () { countUp($("#tiles")); });
  (function () {
    var pl = $("#planner"); if (!pl) return;
    var on = $$(".on", pl);
    on.forEach(function (d) { d.classList.remove("on"); d.classList.add("off"); });
    whenSeen(pl, function () {
      on.forEach(function (d, i) { setTimeout(function () { d.classList.remove("off"); d.classList.add("on"); }, reduce ? 0 : 250 + i * 220); });
    });
  })();

  /* ---------- QR code to the App Store (a bonus; the badge always works) ---------- */
  try {
    if (typeof qrcode !== "undefined") {
      var qr = qrcode(0, "M");
      qr.addData("https://apps.apple.com/us/app/onyx-fitness-ai-coach/id6758569382?uo=4");
      qr.make();
      $("#qrCode").innerHTML = qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
      var svg = $("#qrCode svg");
      if (svg) { svg.setAttribute("width", "116"); svg.setAttribute("height", "116"); }
      $("#qrBox").hidden = false;
    }
  } catch (e) { /* ignore */ }
})();
