# Select Campaign Modules — Figma Plugin

A one-shot Figma plugin that builds 5 modules in your current page using the Select Design System library:

1. Advertisers List
2. Create Advertiser
3. Campaign Listing
4. Create Campaign – Details (with Goal & Budget)
5. Create Campaign – Creatives

## How to run

1. Open the **Figma desktop app** (the plugin needs the desktop app — it does not run in the browser).
2. Open the file you want the modules built in (e.g. the Campaign file). Make sure you have **edit access** and are in **Design mode** (not Dev Mode).
3. Make sure the file is subscribed to the **Select Design System** library (Assets panel → Libraries → enable "Pooja Shetti's team library" / Select DS). Without it, components and variables can't be imported.
4. Open **Menu → Plugins → Development → Import plugin from manifest…**
5. Select `manifest.json` from this folder.
6. With the file still active, run **Menu → Plugins → Development → Select Campaign Modules**.

The plugin will:
- Import all required components and color/spacing variables from Select DS by key
- Build the 5 modules side by side on your current page
- Zoom to fit them when done

## Notes

- Each module is `1440 × 900` and uses auto layout end-to-end (header, sidebar, body, cards, table rows, fields).
- All component instances come from Select DS — Header, Navigation Menu, Buttons, Input, Dropdown, Switch, Badge, Table Header/Content/Actions, Pagination, Stepper, etc.
- Colors and radii are bound to semantic variables (`bg`, `bgLight`, `text`, `textSec`, `border`, `brand`, `radius/md`, etc.) where applied directly; component instances retain their internal token bindings.
- If a component or variable fails to import, the plugin keeps going and surfaces a notification — most often this means the Select DS library isn't enabled on the file.

## Re-running

The plugin appends new module frames each run; rerun freely. Delete previous frames first if you want a clean canvas.
