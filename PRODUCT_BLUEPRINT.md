# HomeAssistant-Nova 2.0 Product Blueprint

## Product Mission

Stop food waste before it happens.

The product is not an inventory notebook. It is a household freshness operating system:
- Detect risk early
- Trigger action quickly
- Build a repeatable daily habit

## Core User Problem

Users do not fail because they cannot "record" food.
Users fail because they cannot see urgency, decide fast, and execute in time.

## Design Principles

1. Action over data entry
- Every screen must answer: what should I eat/use today?

2. Urgency visibility
- Risk is shown with text + badge + countdown, not color alone.

3. Minimum friction
- Quick add, voice capture, one-tap consume/discard.

4. Habit loop
- Daily audit button + streak + rescue queue to reinforce behavior.

5. Cost awareness
- Track potential loss and actual waste value.

## Product Architecture

### 1) Freshness Command Center
- Health KPIs:
  - Total items
  - Critical (expired)
  - Rescue in 48h
  - Potential value at risk
- Rescue Queue:
  - Sorted by urgency and value
  - Explicit recommendation for each item

### 2) Visual Fridge Simulator
- Realistic fridge cabinet with zones (boxes/shelves)
- Per-zone occupancy and urgency indicator
- Tap any zone to manage quickly

### 3) Execution Layer
- Item form with full properties:
  - name, amount, unit, price, calculated price
  - added date, out-of-value date
  - status, left-valid-day
  - category, notes
- Voice input for text fields
- One-tap actions:
  - Consume
  - Discard (waste logging)
  - Edit/move

### 4) Behavior Loop
- Daily audit check-in
- Streak tracking
- Suggested "rescue meals" based on expiring categories

### 5) Accountability
- Waste ledger with recent disposal cost
- Monthly waste value KPI

## Prioritization Logic

### Freshness Status (auto)
- Expired: left-valid-day < 0
- Critical: left-valid-day = 0
- Rescue now: left-valid-day in [1, 2]
- Watch: left-valid-day in [3, 5]
- Fresh: left-valid-day > 5

### Rescue Score
- Higher when:
  - fewer days left
  - higher total value
  - larger quantity

## UX Flow

1. Open app -> see immediate rescue list
2. Tap urgent item -> consume/discard/edit
3. Quick add new groceries (voice supported)
4. Complete daily audit in one tap

## MVP Success Metrics

- Reduction of expired items week-over-week
- Reduction of waste value month-over-month
- Daily audit completion rate
- Rescue action completion in 48 hours

## Visual Direction

- Bright kitchen-lab aesthetic (not dark dashboard)
- High-contrast status chips, tactile cards
- Subtle motion, reduced-motion compatible
- Mobile-first responsive behavior

## Future Expansion

- Predictive reminders before item-level expiry
- Meal planner integration
- Shared household tasks and notifications
- Barcode and receipt parsing
