# Handoff: Grub — vegan & vegetarian restaurant discovery (mobile)

## Overview
A geo-targeted mobile app for finding vegan and vegetarian restaurants nearby or in a city you're travelling to. The user is onboarded in three steps, lands on a filterable list/map of every nearby spot with vegan or vegetarian options, and can open a restaurant page for dish-level detail, photos, reviews and turn-by-turn handoff to Google Maps or Waze. Contributions (reviews, photos) are incentivised with a points/quests/stickers layer surfaced on the profile screen.

## About the design files
The files in this bundle are **design references created in HTML** — a working prototype of the intended look and behavior, not production code to copy. The task is to **recreate these designs in the target codebase's existing environment** (React Native, Swift/SwiftUI, Kotlin/Compose, Flutter, React web, etc.) using its established patterns, component library and navigation. If no codebase exists yet, pick the framework that best fits the product (this is a phone-first app; React Native or SwiftUI/Compose are natural) and implement there.

`Vegan Eats v2.dc.html` is the current design. `Vegan Eats.dc.html` (in the parent project, not bundled) is an earlier, superseded visual direction — ignore it.

## Fidelity
**High-fidelity.** Colors, typography, spacing, radii, borders and shadows are final and specified below. Recreate pixel-accurately using the codebase's own primitives. Two things are deliberately placeholder:
- All photography is a diagonal-stripe placeholder block. Real restaurant photos replace them at the same dimensions/radii.
- The map is a placeholder grid with absolutely-positioned pins. Replace with the real map SDK (MapKit / Google Maps / Mapbox); pin and peek-card behavior is specified below.

## Design language
Bold "neo-brutalist" poster style:
- Cream page background, saturated flat card colors, **2px solid #000 borders on nearly every surface**, and **hard offset shadows** (`4px 4px 0 #000`, `5px 5px 0 #000` on larger cards) — no blur, no gradients.
- Headings are condensed uppercase display type; body is a geometric sans.
- Buttons and chips are fully rounded pills (`border-radius: 100px`) with 2px black borders; the primary state is black fill with the surrounding card's color as the label.
- Selected/active state is almost always **black fill, white (or accent) text**; unselected is white fill, black text.

## Design tokens

### Colors
| Token | Hex | Use |
| --- | --- | --- |
| Cream | `#FDF2EC` | App background, filter sheet background |
| Black | `#000000` | All borders, shadows, ink, active fills |
| White | `#FFFFFF` | Cards, inputs, inactive pills |
| Green | `#A2DB69` | Onboarding step 1, primary CTAs, "offline" badge, active nav pill, points card |
| Purple | `#B089F4` | Profile header, avatar, quest card, "hidden gem" badge |
| Coral | `#F98875` | Onboarding step 2, home primary card, map peek card |
| Yellow | `#F4DC3D` | Filters button, "fast food" badge, review-star badge, contribution nudge |
| Blue | `#73A3F5` | Onboarding step 3, Saved card on home, Waze button |
| Orange | `#F4A03B` | 6th card color in rotation |
| Map surface | `#EDE3DA` | Map placeholder fill |
| Heart active | `#D9403A` | Favorited heart glyph |

Card colors rotate over the restaurant list in the order **green → purple → coral → yellow → blue → orange**, keyed to the restaurant's index in the source data so a given restaurant always keeps its color (list card, saved row, detail hero).

Overlays: filter sheet scrim `rgba(0,0,0,0.4)`. Photo placeholders: `repeating-linear-gradient(45deg, rgba(0,0,0,0.08–0.10) 0 6px, #fff 6px 12px)` (over colored cards use `rgba(255,255,255,0.5)` as the light stripe).

### Typography
- **Display / headings:** Big Shoulders Display, weights 800–900, `text-transform: uppercase`. Line-height must be **≥ 1.0** (1.0 for 900-weight multi-line hero text, 1.05–1.1 for 800-weight section headings) — tighter values clip the caps. Any heading intended as one line needs `white-space: nowrap`.
- **Body / UI:** Josefin Sans, 400–700.

Scale as used:
| Role | Font | Size / weight | Notes |
| --- | --- | --- | --- |
| Onboarding hero | Big Shoulders | 110px / 900, lh 1.0 | Step 1 wordmark; steps 2–3 headings use 52px |
| Screen title (Explore) | Big Shoulders | 36px / 900, lh 1.05 | 2 lines, nowrap |
| Screen title (Saved) | Big Shoulders | 44px / 900 | |
| Profile name | Big Shoulders | 34px / 900 | |
| Home hero | Big Shoulders | 52px / 900, lh 1.0 | "What are you craving?" |
| Detail restaurant name | Big Shoulders | 44px / 900, lh 1.0 | |
| Section heading | Big Shoulders | 26px / 800, lh 1.08–1.1 | "Reviews", "My diet", etc. |
| Card title (grid) | Big Shoulders | 23px / 800, lh 1.05 | |
| Big number (points) | Big Shoulders | 42px / 900, lh 1.05 | |
| CTA label | Big Shoulders | 22px / 800, uppercase, ls 0.04em | Primary buttons |
| Secondary CTA | Big Shoulders | 17–19px / 800 | |
| Body | Josefin Sans | 15–16px / 400–600, lh 1.4 | |
| Card meta | Josefin Sans | 12–13px / 600, opacity 0.72–0.78 | |
| Pill / chip | Josefin Sans | 12.5px / 700 | |
| Micro badge | Josefin Sans | 10.5–11.5px / 700, uppercase, ls 0.06em | |
| Eyebrow label | Josefin Sans | 11–12px / 700, uppercase, ls 0.08em | nowrap |

### Spacing, radii, borders
- Screen padding: `18–22px` horizontal `20px`, bottom `12–32px`.
- Gaps: `6px` (chip rows), `8–10px` (button rows, badge rows), `10–12px` (card stacks and grids), `14–24px` between sections.
- Radii: pills `100px`; cards `20–22px`; inner blocks and menu rows `14–18px`; sticker tiles `16px`; filter sheet `26px 26px 0 0`.
- Borders: `2px solid #000` standard; `1.5px solid #000` on micro badges inside cards.
- Shadows: `4px 4px 0 #000` (cards, rows, small stats), `5px 5px 0 #000` (hero/emphasis cards), `3px 3px 0 #000` (avatar, sticker tiles). Locked stickers have **no** shadow.

## Screens

### 0. Shell
The prototype renders inside an iPhone frame with a title bar; the title changes per screen (`Grub`, `Home`, `Explore`, `Saved`, `You`, or the restaurant name). In a native app this maps to the navigation bar title. Note: every screen relies on that bar for status-bar clearance — if you build without one, add the safe-area inset yourself.

A **bottom nav** appears on Explore, Saved and Profile only (not onboarding, home or detail): a black pill container, `padding 5px`, `border-radius 100px`, 2px black border, holding 4 equal-width pill buttons — **Explore / Map / Saved / You** in Big Shoulders 18px/800 uppercase. Active pill: green fill, black text. Inactive: transparent, white text. Explore and Map are the same screen with the list/map toggle switched.

### 1. Onboarding (3 steps)
Full-bleed colored screen; background changes per step: **1 green, 2 coral, 3 blue**. Header row: progress dots on the left (3 dots, 9px tall, 2px black border, `border-radius 100px`; the active one is 26px wide and filled black, completed ones filled black, upcoming transparent), and a "Skip" underlined text link on the right (hidden on step 3, jumps to Home).

**Step 1 — Location.** Hero wordmark "GRUB" (110px/900). One-line pitch: "Find the closest place you can actually order from, whether you're fully vegan or just skipping the meat." White card (`border-radius 20px`, `5px 5px 0` shadow, 16px padding): heading "WHERE ARE YOU?" (26px/800) + "We use your location to sort spots by how far you'd have to walk or drive. Nothing is shared." Two stacked buttons: primary black pill "USE MY LOCATION" (label in green), then a transparent-with-black-border pill "ENTER A CITY INSTEAD". Both advance to step 2 (in production: the first triggers the OS location permission, the second opens a city search).

**Step 2 — Diet.** Heading "HOW DO / YOU EAT?" + "Pick anything that applies. This becomes your default filter — change it any time." Three full-width multi-select cards (`border-radius 20px`, 2px border, `4px 4px 0` shadow, 14px 16px padding), each a display title + one line of body:
- **100% VEGAN** — "Only kitchens with no animal products at all."
- **VEGAN OPTIONS** — "Any restaurant with dishes marked vegan."
- **VEGETARIAN OPTIONS** — "Meat-free dishes, dairy and egg are fine."

Selected card inverts to black fill / white text. Selections write straight into the app's diet filter. CTA label is copy-switched: "LOOKS RIGHT" when at least one is selected, "SHOW ME EVERYTHING" when none.

**Step 3 — Teaser.** Heading "{n} SPOTS / ARE READY" where n is the live filtered count. Body switches on whether a diet was chosen ("Matching your diet, closest first. Tap any spot for dish-level detail." / "Everything nearby with vegan or vegetarian options, closest first."). Then the 3 closest matches as white rows (48px placeholder thumb + name + `★ rating · distance mi · diet label`). CTA: black pill "START EXPLORING" (label in blue) → Explore.

### 2. Home
Reachable by skipping onboarding. Header row: eyebrow `📍 {Current location | destination | "Planning a trip"}` and a 40px circular purple avatar button ("MR", 2px border, `3px 3px 0` shadow) → Profile. Hero "WHAT ARE / YOU CRAVING?" (52px/900).

Segmented pill (white, 2px border, 4px padding) with **Near me / Plan a trip**; active segment is a black pill with white text. Choosing "Plan a trip" reveals a text input ("Where are you headed?", `border-radius 16px`, 2px border) whose value becomes the location eyebrow.

Body: a coral hero card (`border-radius 22px`, `5px 5px 0`, 20px padding) — "BROWSE / EVERY SPOT" + "Filter by 100% vegan, vegan options or vegetarian options." + a black "FIND FOOD" pill → Explore. Below it a blue card button — "SAVED · {n}" + "Works offline" + a `♥` glyph → Saved.

### 3. Explore (results)
Header row: "{n} SPOTS / NEAR YOU" (36px/900, nowrap, 2 lines) and a yellow **Filters** pill (2px border, 13px/700) which shows a black count badge when filters are active.

Search input: full-width white pill (`border-radius 100px`, 2px border, 13px 16px padding), placeholder "Search food, restaurants, cafés…". Matches name, cuisine, or address, case-insensitive substring.

Control row (all `flex: 0 0 auto`, nowrap): a white sort segmented pill **Distance / Rating**; a white view segmented pill **List / Map**; and, when filters are active, an underlined "Clear" text button that resets diet, mood and distance (not the search text).

**List view** — 2-column CSS grid, 12px gap, `align-content: start`, scrollable. Each card: colored background (rotating palette), 2px border, `border-radius 20px`, `4px 4px 0` shadow, 10px padding, containing
1. an 88px-tall photo placeholder (2px border, `border-radius 14px`) with a 26px circular white favorite button top-right (`♡` / `♥`, heart turns `#D9403A` when saved; tapping must not open the detail — stop propagation);
2. the restaurant name (Big Shoulders 23px/800);
3. `{cuisine} · {price}` meta line;
4. a wrapping row of micro badges: `★ {rating}` (white), `{distance} mi` (white), and the diet label (black fill, white text). Badges must be `display:inline-block; white-space:nowrap` so pills never split across lines.

Tapping the card opens the detail screen.

**Map view** — a row of collection chips **All / Popular / Hidden gems** (active = black fill), then the map (2px border, `border-radius 22px`). Collections filter the pins: *Popular* = ≥150 reviews; *Hidden gems* = rating ≥ 4.7 and < 200 reviews. Pins are `📍`, or `💎` for hidden gems, and grow from 27px to 34px when selected. Tapping a pin opens a **peek card** pinned 10px from the bottom edge: coral, 2px border, `border-radius 18px`, `4px 4px 0` shadow — 46px thumb, name (22px/800), `★ rating · price · distance mi`, and a black "VIEW" pill that opens the detail screen.

**Filter sheet** — bottom sheet over a `rgba(0,0,0,0.4)` scrim; tapping the scrim or the ✕ closes it. Cream background, 2px top border, `border-radius 26px 26px 0 0`, 22px/20px padding, max-height 82%, scrollable. Title "FILTERS" (32px/800) + a 32px circular white ✕. Three labelled chip groups (eyebrow label, wrapping chip row; chips are white/black-bordered, black-filled when active):
- **Diet** (multi-select): 100% Vegan · Vegan Options · Vegetarian Options
- **Mood** (single-select): Anything · Italian · Mexican · Asian · American
- **Distance** (single-select): Less than 3 mi · 3 to 10 mi · More than 10 mi

Footer: full-width green pill "SHOW {n} RESULTS" (live count) which closes the sheet.

### 4. Restaurant detail
200px hero in the restaurant's card color with the stripe texture, 2px bottom border: a white "← BACK" pill top-left (nowrap) and a 36px circular white favorite button top-right.

Body (20px padding):
1. Name, Big Shoulders 44px/900, lh 1.0.
2. Badge row: `★ {rating} ({reviewCount})`, price, diet label (black fill), plus **Fast food** (yellow) and **Hidden gem** (purple) when they apply.
3. `{distance} mi away · {address}` then the hours line in bold.
4. Three equal action pills: **MAPS** (green) → `https://www.google.com/maps/search/?api=1&query={name address}`, **WAZE** (blue) → `https://waze.com/ul?q={name address}&navigate=yes`, **CALL** (white) → `tel:{phone}`. On native, prefer the platform's native map/dialer intents with the same fallbacks.
5. **Contribution nudge** — yellow card, `5px 5px 0` shadow: "EATEN HERE?" + "You're the 3rd person to open this page today. Be the one who says what's actually vegan." + two pills, black "REVIEW +100" and white "PHOTO +50", + "First review here earns the ⭐ Trailblazer sticker." (Wire these to the review/photo composers.)
6. **Vegan & veg options** — one white row per menu item (2px border, `border-radius 16px`, 11px/14px padding): dish name left, a micro badge right — green for `vegan`, yellow for `vegetarian`.
7. The free-text note about the kitchen (e.g. cross-contact practices).
8. **Photos** — heading with "{n} photos" on the right, then a 3-up row of square placeholders (2px border, `border-radius 14px`).
9. **Reviews · {n}** — white cards (2px border, `border-radius 18px`, 14px padding): author name, a yellow `★ {rating}` badge, and the review body.

### 5. Saved
"← HOME" pill, "SAVED" (44px/900), then a green "AVAILABLE OFFLINE" badge. Rows use the restaurant's card color, 2px border, `border-radius 20px`, `4px 4px 0` shadow, 12px padding: 58px thumb, name (25px/800), `★ rating · price · distance mi`, and a 26px circular favorite button top-right that un-saves. Empty state, centered at 70% opacity: a large `♡` and "Tap the heart on any spot to keep it here — no signal needed."

Favorites are the offline set: cache each saved restaurant's full record (menu, hours, address, photos) at save time so the detail screen opens with no network.

### 6. Profile ("You")
1. **Header card** — purple, `border-radius 22px`, `5px 5px 0`: 66px circular photo placeholder, "MAYA REYES" (34px/900), "Los Angeles · joined 2024".
2. **Stats row** — three equal cards (green / yellow / coral, `4px 4px 0`): big number (30px/800) + uppercase label — Reviews `24`, Photos `68`, Saved (live favorites count).
3. **Sprout points card** — green, `5px 5px 0`: eyebrow "SPROUT POINTS" (nowrap), the balance (42px/900, e.g. `1,240`), a white tier pill ("SPROUT II", nowrap) and "🔥 {n} week streak" right-aligned; a 16px progress track (white, 2px border, `border-radius 100px`) filled black to `points / nextTier`; caption "{n} points to {nextTier} — unlocks {perk}." (sample: 1,240 / 1,500 → Sapling, "early access to new city maps").
4. **This month's quests** — heading + "Resets in 9 days"; one colored card per quest (`border-radius 20px`, `4px 4px 0`): title (23px/800), a black `+{points}` badge, one line of detail, a 12px progress track, and "{done} of {goal} done". Samples: *Photo run* — "Add photos at 3 different spots", +150, 2/3 (coral); *Say the details* — "Write a review that names a vegan dish", +100, 0/1 (blue); *Off the beaten path* — "Review a hidden gem more than 5 mi out", +200, 1/2 (purple).
5. **Sticker book** — heading + "Earn one for every milestone. Trade nothing, brag freely."; a 4-column grid of square tiles (2px border, `border-radius 16px`): icon + uppercase label. Earned = white fill, `3px 3px 0` shadow, full opacity; locked = `rgba(0,0,0,0.06)` fill, no shadow, `opacity 0.45`. Set: 🌱 First review · 📸 10 photos · ⭐ Trailblazer · 🔥 4 wk streak (earned) · 💎 Gem hunter · 🗺️ 3 cities · 🥑 50 reviews · 👑 Top local (locked).
6. **My diet** — the same three diet chips as the filter sheet, described as "Used as the default filter every time you search." These are the *same* state as the Explore diet filter.
7. **Activity** — white rows (2px border, `border-radius 18px`), label + sub-label + a `›` chevron: My reviews (24 places reviewed) · My photos (68 uploads) · Saved places ({n} available offline) · Suggest a spot (Add somewhere we're missing).
8. An underlined "Back to home" text link.

## Interactions & behavior
- **Navigation:** Onboarding 1→2→3 → Explore (Skip → Home). Home → Explore, Saved, Profile. Explore ⇄ Map (same screen, toggle). Any card/pin → Detail → back to Explore. Bottom nav switches Explore / Map / Saved / Profile.
- **Filtering** is applied together and live: diet (multi, OR within the group), mood (single, `any` = no constraint), distance bucket (single), text search (substring over name, cuisine, address). Map view additionally applies the collection filter. Sort is by ascending distance or descending rating. The filtered count drives the Explore header, the filter sheet CTA and the onboarding teaser.
- **Distance buckets:** `< 3 mi` = near, `3–10 mi` = mid, `> 10 mi` = far.
- **Hidden gem** rule: rating ≥ 4.7 **and** reviewCount < 200. **Popular:** reviewCount ≥ 150.
- **Favoriting** toggles from the list card, the detail hero and the Saved row; it must never trigger the parent card's navigation.
- No animations are specified. If you add them, keep them short (150–200ms) and note that the flat/hard-shadow style suits a small "press down" translate (e.g. offset the element by the shadow distance and remove the shadow on press) better than fades.
- Real-world states the prototype does not cover and will need designing/wiring: location permission denied, no results for a filter combination, offline (beyond saved), loading skeletons, review/photo submission forms and their validation.

## State
```
screen            'onboarding' | 'home' | 'results' | 'detail' | 'saved' | 'profile'
onboardStep       1 | 2 | 3
mode              'near' | 'trip'          // home segmented control
destination       string                    // trip city
diet              string[]                  // 'vegan' | 'veganOptions' | 'vegetarian' (multi)
mood              'any' | cuisine
distance          'any' | 'near' | 'mid' | 'far'
search            string
sort              'distance' | 'rating'
resultsView       'list' | 'map'
collection        'all' | 'popular' | 'gems'
filtersOpen       boolean
selectedId        restaurant id | null      // detail screen
peekId            restaurant id | null      // map peek card
favorites         restaurant id[]           // persisted + cached offline
```
Server-side/data needs: geolocation, a nearby-restaurant query with distance, per-restaurant detail (menu items tagged vegan/vegetarian, hours, phone, address, photo count, reviews), review and photo submission, and the rewards state (points, tier, streak, quest progress, earned stickers). The prototype's restaurant list, review counts and rewards numbers are sample data.

### Restaurant record shape
```
id, name, cuisine, distance (mi), address, phone, hours,
isFastFood: boolean,
dietCategory: 'vegan' | 'veganOptions' | 'vegetarian',
rating, reviewCount, photoCount, price: 1 | 2 | 3,
menu: [{ name, tag: 'vegan' | 'vegetarian' }],
note: string,
reviews: [{ author, rating, text }]
```

## Assets
No image or icon assets — all imagery is placeholder, and the few glyphs used are plain characters/emoji (`📍 💎 ♥ ♡ ★ 🔥 ⭐ 🌱 📸 🗺️ 🥑 👑 ✕ ← ›`). Replace them with the codebase's icon set where an icon system exists; keep the emoji only for the sticker book, where they are content rather than UI.

Fonts are Google Fonts: **Big Shoulders Display** (800, 900) and **Josefin Sans** (400–700). Bundle them in a native app.

## Files
- `Vegan Eats v2.dc.html` — the design. Open it directly in a browser: a Prototype/Flow map toggle sits at the top; Prototype is the interactive phone, Flow map is the 6-step flow diagram.
- `ios-frame.jsx`, `support.js` — the phone frame and runtime that make the prototype run. Prototype scaffolding only; nothing here belongs in production.
