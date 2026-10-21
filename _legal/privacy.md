---
title: Privacy Policy
slug: privacy
description: What Onyx reads, what leaves your iPhone, who handles it, and how to remove it.
---

*Last updated: 20 October 2026*

**Onyx: Fitness & AI Coach** is made by The Miller Brand ("we"). This policy
explains what Onyx reads, what leaves your iPhone, who handles it, and how to
remove it. The short version: your health data lives on your iPhone. Before you
use the app, Onyx asks about two optional things, separately: AI features,
which send what's needed to our AI provider, Anthropic, only when you use them;
and ad measurement, which tells Meta about installs and purchases. Each is off
unless you turn it on, and everything else works either way. Your health data is never sold or
used for advertising.

## 1. What Onyx reads from Apple Health

Only what you allow in the Health permission sheet, and only to compute your
scores, trends and Coach's reads:

- **Activity:** steps, active and resting energy, exercise and stand time,
  distance (walking, running, cycling, swimming), stair speed, workouts.
- **Heart:** heart rate, resting heart rate, heart rate variability, walking
  heart rate, cardio fitness (VO₂ max), high/low heart rate and irregular
  rhythm notifications, AFib burden.
- **Sleep and recovery:** sleep stages and times, respiratory rate,
  **sleeping wrist temperature**.
- **Body:** weight, height, BMI, body fat, lean mass, waist circumference.
- **Mobility:** walking speed, step length, asymmetry, double support,
  steadiness, six-minute walk distance, **falls**.
- **Other health records you may have in Health:** **blood pressure**,
  **blood glucose**, **menstrual flow** (to put recovery in the context of your
  cycle), water, caffeine and **alcoholic drinks**, mindful minutes.
- **Characteristics:** **date of birth** and **biological sex**, used for
  calorie and heart-rate calculations.

- **Health Records lab results**, only if you choose "Connect Health
  Records": the lab results your provider has shared with Apple Health.
  Onyx reads them into your Labs, on your iPhone; they never pass through our
  server or go to iCloud.

Items in bold are sensitive. Onyx does not use any Health data for
advertising or marketing, and never sells it.

## 2. What Onyx writes to Apple Health

When you ask it to: workouts you record (with heart rate, distance and, for
outdoor sessions, the route), weigh-ins and body measurements you enter, and —
unless you turn it off in You → Privacy & data — **the meals you log**, with
their calories and nutrients. Edits and deletions in Onyx are reflected in
Health.

## 3. Location

Onyx uses your location **only while a run, walk, ride or hike you started in
Onyx is in progress**, to measure distance and pace and draw the route. The
route is saved to Apple Health with the workout. It is not sent to our server.

## 4. On your iPhone, and Apple Intelligence

Scores, trends, the notification plan, food scores and most of Coach's written
reads are computed on your iPhone. Where Apple Intelligence is available,
Onyx's written summaries — and the reading of a training goal you type in
your own words — are produced by Apple's on-device model. We don't receive
that data.

## 5. Our server and our AI provider (Anthropic)

Some features need a larger model than your iPhone has. For those, Onyx sends
the minimum needed to our server (hosted by **Railway**, in the United States),
which forwards it to **Anthropic, PBC** (the maker of the Claude AI) and
returns the answer.

**Onyx asks first.** Before you start using Onyx (and again after an update
that changes this policy), a privacy screen explains what these features send,
who receives it and what happens to it, with its own switch, off until you turn
it on (or tap **Allow both**). Left off, these features stay off and nothing
is sent; everything else in Onyx keeps working. You can change
this any time in **You → Privacy & data → AI features**; turning it on shows
the full details again and asks you to allow it.

What each feature sends:

| Feature | What is sent |
| --- | --- |
| Coach chat | Your messages, recent conversation, facts you've asked Coach to remember, the training goal you typed (if you set one), the names and distances of places to eat near you when you ask Dot for them (your location itself stays on your iPhone), and a summary of your current numbers (readiness, sleep, training, nutrition targets, and your age, sex, height and weight). Not your name. |
| Log a meal by description or photo | The text, or the photo of your meal. |
| Menu scan | A photo of the menu. |
| Lab import | **Photos or PDF pages of your lab report.** These often show your name; you can crop it out — only the results are needed. |
| Meal plan, swaps, pantry recipes | Your targets, preferences, the ingredients you list, and the training goal you typed (if you set one). |
| Your own training goal | The words you type, only when no Apple model on your iPhone can read them. |
| Food alternatives | The product's name and nutrition. |
| Build a workout / new exercise | Your request, or the exercise name. |
| Written reads (fallback) | A summary of the metric being described, when no Apple model is available. |

Each Coach message is also checked, before Coach answers, for signs of a
medical emergency, self-harm or disordered eating, so Onyx can show the right
help instead of coaching. That check uses Claude too and sees only the message
itself. **Results from your Health Records are never sent**, and neither is
your location (only, when you ask Coach for somewhere to eat, the names and
distances of nearby places).

Our server does not store the content of these requests; it is processed to
return the answer and discarded. Operational logs may briefly record that a
request happened and whether it failed. Anthropic processes the content under
its commercial terms, which do not permit training on it, and deletes it
within 30 days — longer only if its automated safety systems flag a request
for review. Requests carry no name, email or account identifier.

## 6. Proving it's really Onyx, and that you have Pro

To stop our server being misused, Onyx uses Apple's **App Attest**: your
iPhone creates a key in its secure hardware and Apple confirms it belongs to
Onyx on a genuine device. When you have Pro, Onyx sends Apple's signed record of
your purchase (product, dates and transaction ID — no name, email or payment
details) so the server can confirm it. These produce a short-lived token stored
on your iPhone. We don't link them to you.

## 7. Anonymous usage and diagnostics

Unless you turn off **You → Privacy & data → Share anonymous usage**, Onyx
sends:

- **Usage events** — for example that onboarding was completed, which screen
  opened the Pro offer, whether a purchase completed, which way a meal was
  logged — tagged with a random identifier created for this install. It is not
  your Apple ID, email, name or device identifier, and contains no health
  values.
- **Diagnostics** from Apple's MetricKit: crash reports, freezes, launch time
  and scrolling smoothness. These contain technical details about the app, not
  your data.

We keep these for up to 90 days to understand what's working. Turning the
setting off stops both and deletes the install identifier.

## 8. Measuring our ads (Meta)

We advertise Onyx on Facebook and Instagram. To learn which ads lead people to
install and subscribe, Onyx includes **Meta's App Events SDK**. It runs only if
you turn it on on the privacy screen, or later turn on **You → Privacy & data → Ad
measurement**; until then it isn't started and nothing reaches Meta. When it's
on, it sends Meta (Meta Platforms, Inc.):

- that Onyx was installed and opened;
- that a free trial started or a subscription was bought — the plan, price and
  currency;
- technical details Meta's SDK collects with these, such as your device model,
  iOS and app versions, and IP address.

**No health or fitness data, nothing you've logged and nothing you've told Coach
is ever sent to Meta.** Onyx doesn't ask for permission to track you, so Meta's
SDK doesn't receive your device's advertising identifier. Meta handles this
data under its own terms and privacy policy. Turning **Ad measurement** off
stops it.

## 9. Your iCloud

If you're signed in to iCloud, Onyx syncs your **settings and preferences** —
exercise preferences, custom exercises, workout templates, recipes, your
grocery list and pantry, how your coach looks, and your privacy choices — to **your private iCloud
database**, which only you can access; we can't read it. **No health
information is stored in iCloud.** (Versions before 3.7 synced some health data;
Onyx 3.7 deletes it from your iCloud the first time it runs.) To remove what's
there, use You → Privacy & data → Delete account & data in Onyx, or remove Onyx's data in
iOS Settings → [your name] → iCloud.

## 10. Sign in with Apple

If you use it, Apple shares a name and an email (which may be a private relay
address) with Onyx on your device. We don't send them to our server.

## 11. The report for your doctor

"Make a report for my doctor" builds a PDF on your iPhone from your labs
and Health data. Nothing is sent anywhere until you choose to share it.

## 12. Notifications

Notifications are planned and scheduled on your iPhone. No notification
content is sent through our server.

## 13. What we don't do

We don't sell data, show ads inside Onyx, or ask to track you across other
apps and websites. We share data only with the companies named above (Apple,
Anthropic, Railway, and Meta for ad measurement) for the purposes described.

## 14. Children

Onyx is not directed at children under 13, and we don't knowingly collect
their data.

## 15. Your choices

- Turn AI features and ad measurement on or off in You → Privacy & data. Your
  choice is saved to your private iCloud, so a new iPhone remembers it.
- Change Health permissions any time in iOS Settings → Health → Data Access.
- Turn off meals to Health or anonymous usage in You → Privacy & data, and any
  notification in You → Notifications.
- Export everything Onyx holds (You → Privacy & data → Export everything).
- Delete your data with You → Privacy & data → Delete account & data.
- On Onyx 3.7 and earlier, these settings are under Settings → Your data.

## 16. Changes and contact

We'll update this page when what Onyx does changes, and note the date at the
top. Questions: see the Support page in You → Help & legal.
