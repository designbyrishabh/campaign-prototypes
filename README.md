# Ad Schedule · Bid Adjustments

Interactive prototype for setting a weekly ad schedule and applying per-hour bid increases or decreases (a.k.a. **dayparting with bid adjustments**). Built as a single self-contained `index.html` — no build step, no dependencies, no framework.

**▶ Live demo:** https://designbyrishabh.github.io/ad-schedule-bid-adjustments/

## What it does

- **7 × 24 grid** of dots, one per hour-of-week. Click or drag to deselect hours.
- **Two modes**, toggled at the top:
  - **Schedule** — opt hours in/out. Default is "all on".
  - **Adjust Bid** — drag a range of active hours to open a popup and apply a bid increase or decrease (`+/− %`).
- **Color intensity scales with the largest adjustment on the grid** — the maximum % is fully saturated; smaller adjustments fade proportionally. Re-scales live as you edit.
- **Outlined pills** group contiguous runs of the same adjustment, with a `+15%` / `−10%` badge above each. Multi-day runs of the same range merge into one vertical block.
- **Auto-save** — every edit commits automatically; the header shows `Saving…` → `Saved · just now` with a relative timestamp that updates over time. A **Reset** button restores the all-selected default.
- **Read-only context in Schedule mode** — adjusted hours still show their green/red dot color so you can see at a glance where bid changes exist, but the outlined pills + badges are hidden (switch to Adjust Bid to edit).
- **Disabled cells in Adjust Bid** — any hour deselected in Schedule mode shows as a `not-allowed` cursor and can't be included in an adjustment selection. Schedule is the source of truth.

## Tech notes

- Single HTML file with inline CSS + vanilla JS. No build step, no framework.
- Intensity gradient uses CSS `color-mix()` with a `--strength` custom property set per-cell.
- Drag interaction uses Pointer Events with `setPointerCapture` for reliable cross-row drags.
- All state is in-memory only — no backend, no persistence between page loads. The "auto-save" indicator simulates a save cycle (snapshot + debounce + ticker) so the UX can be evaluated; wire it to a real endpoint when productionizing.

## Local development

```bash
git clone https://github.com/designbyrishabh/ad-schedule-bid-adjustments.git
cd ad-schedule-bid-adjustments
python3 -m http.server 4599
# open http://localhost:4599
```

That's it. Edit `index.html`, refresh, done.

## Context

Designed for the **Media.net Select Activation** campaign-setup flow. The "circle" grid layout was chosen over a heatmap so individual hours stay tap-able on touch devices and visual density matches the rest of the Select design system.
