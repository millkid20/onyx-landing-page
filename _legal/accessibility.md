---
title: Accessibility Statement
slug: accessibility
description: How Onyx supports VoiceOver, Dynamic Type, Reduce Motion and more, and where it still falls short.
---

*Last updated: 19 October 2026*

Onyx should work for everyone who wants to understand their body, including people who use VoiceOver, larger text, or reduced motion. This page says what Onyx supports, where it still falls short, and how to tell us about a problem.

## What Onyx supports

### Seeing and hearing

- VoiceOver labels on controls, scores and cards, with charts carrying a spoken trend summary
- Dynamic Type, from the default size through the largest accessibility sizes
- Bold Text, Increase Contrast and Reduce Transparency
- Scores, states and warnings come with words, not just colour
- Dark mode is designed independently rather than inverted

### Motion

- Reduce Motion is respected throughout: animations settle immediately, and Coach holds still instead of bouncing, while still changing expression

### Haptics

- Confirm meaningful actions: workout completion, set logged, ring closed, food logged
- Respect the system Haptics setting, and an in-app toggle in You → Preferences

## Standards

We aim for WCAG 2.1 AA and follow Apple's Human Interface Guidelines for iOS accessibility.

## Where we know we fall short

Being specific here is more useful than claiming completeness.

- **Charts.** Line and bar charts on the Weight, Vitals and Sleep detail screens carry a spoken trend summary, but not the underlying values. A full text alternative ("seven readings, ranging 48 to 61 ms") is still to come.
- **Complex gestures.** Swipe-to-delete and drawer drags all have button alternatives, but those alternatives aren't always easy to discover.
- **Today screen grouping.** VoiceOver order is correct, but several users have asked to adjust how cards are grouped. Tracked.
- **Apple Watch.** The set logger relies on the Digital Crown for reps and weight. There are on-screen alternatives for moving between sets, but Crown-free entry of a specific value is not yet possible.
- **Smart Invert** has limited support: charts and the Coach character don't invert cleanly.

## Reporting an accessibility issue

Email millkid20@gmail.com with "accessibility" in the subject. Include:

- The screen or feature affected
- Which assistive technology you're using
- iPhone (or Apple Watch) model and OS version
- What you expected versus what happened

Accessibility issues get the same priority as security issues. I'll respond within 2 business days and aim to ship a fix in the next release.

## Tested with

VoiceOver · Reduce Motion · Dynamic Type (default through largest accessibility size) · Bold Text · Reduce Transparency · Increase Contrast · Smart Invert (limited)

If you use something not listed and hit a problem, please report it.

## Contact

millkid20@gmail.com
