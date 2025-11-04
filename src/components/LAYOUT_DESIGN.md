# Station Master UI Layout Specification

## Overall Structure

**Three-column layout with header:**
- **Left Column** (25% width): Station info & inventory
- **Middle Column** (40% width): Active installations (Factory/Entertainment)
- **Right Column** (35% width): Management interfaces

## Header Bar

```
┌────────────────────────────────────────────────────────────────────────┐
│ station wing info          system          time/event info             │
└────────────────────────────────────────────────────────────────────────┘
```

**Contents:**
- **Left:** Current wing name (e.g., "Alpha Wing")
- **Center:** System status indicators
- **Right:** Game time, active events, notifications

---

## Left Column: Station Wing Info

### Resource Inventory (Top)

```
┌─────────────────────────────────┐
│ Resource Inventory              │
├─────────────────────────────────┤
│ Resource Name  stock/max  prod  │
│                                 │
│ Iron           125/1000   +15/s │
│ Energy         45/500     +8/s  │
│ Food           32/200     +3/s  │
│ Water          28/200     +2/s  │
│ Steel          0/100      +0/s  │
│                                 │
└─────────────────────────────────┘
```

**Layout:**
- Fixed width table
- Three columns: Name | Current/Max | Production Rate
- Scrollable if many resources
- Color-coded based on stock level:
  - Red: < 25% capacity
  - Yellow: 25-50% capacity
  - Green: > 50% capacity

### Additional Info (Below Resources)

- Resident count and satisfaction average
- Current wing tier/level
- Time in current wing
- Promotion progress bar

---

## Middle Column: System (Active Installations)

### Factory Space (Top Half)

```
┌─────────────────────────────────────────────┐
│ Factory Space                               │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────┐  ┌─────────────┐         │
│  │             │  │             │         │
│  │   FACTORY   │  │  [EMPTY]    │         │
│  │   SLOT 1    │  │   SLOT 2    │         │
│  │             │  │  (Locked)   │         │
│  │  [Install]  │  │             │         │
│  │             │  │             │         │
│  └─────────────┘  └─────────────┘         │
│                                             │
│  ┌─────────────┐                           │
│  │  [EMPTY]    │                           │
│  │   SLOT 3    │                           │
│  │  (Locked)   │                           │
│  └─────────────┘                           │
│                                             │
└─────────────────────────────────────────────┘
```

**Factory Slot Card:**
- **Empty State:** Gray/dark, shows lock icon if locked
- **Occupied State:** 
  - Factory name with rarity color border
  - Key stats (Success %, Crit %, Production)
  - Activate button (if manual)
  - Progress bar (if auto-activating)
  - Right-click or button to manage/uninstall

**Layout:**
- Grid of factory slots (2-3 columns depending on total slots)
- Visual indicator for automation status
- Cooldown timer overlay when active

### Entertainment Space (Bottom Half)

```
┌─────────────────────────────────────────────┐
│ Entertainment Space                         │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────┐  ┌─────────────┐         │
│  │             │  │             │         │
│  │ RESTAURANT  │  │    BAR      │         │
│  │   [Empty]   │  │  [Empty]    │         │
│  │             │  │  (Locked)   │         │
│  │  [Install]  │  │             │         │
│  │             │  │             │         │
│  └─────────────┘  └─────────────┘         │
│                                             │
│  ┌─────────────┐  ┌─────────────┐         │
│  │  THEATER    │  │    GYM      │         │
│  │  [Empty]    │  │  [Empty]    │         │
│  │  (Locked)   │  │  (Locked)   │         │
│  └─────────────┘  └─────────────┘         │
│                                             │
└─────────────────────────────────────────────┘
```

**Entertainment Slot Card:**
- **Category labeled** (Restaurant, Bar, etc.)
- **Empty State:** Shows category icon, install button
- **Occupied State:**
  - Entertainment name with rarity color
  - Defense stats (Reduction %, Evasion %, etc.)
  - Capacity indicator (X/Y residents served)
  - Satisfaction bonus indicator
  - Uninstall/replace button

**Layout:**
- Grid showing one slot per category
- 2-4 columns depending on unlocked categories
- Each slot labeled with category icon

---

## Right Column: Management

### Top Section: Crafting Materials

```
┌─────────────────────────────────────┐
│ Crafting Materials                  │
├─────────────────────────────────────┤
│                                     │
│ Orb of Transmutation    x 5         │
│ Orb of Alteration       x 3         │
│ Orb of Augmentation     x 1         │
│ Orb of Annulment        x 0         │
│                                     │
│ Iron Scrap              x 45        │
│ Energy Cell             x 12        │
│                                     │
└─────────────────────────────────────┘
```

**Layout:**
- List of crafting currencies and materials
- Item icon + name + quantity
- Hoverable tooltips explaining each
- Grouped by type (Orbs, Materials, etc.)

### Middle Section: Quick Orders Interface

```
┌─────────────────────────────────────┐
│ Quick Orders Interface              │
├─────────────────────────────────────┤
│                                     │
│ [Tab: Active] [Tab: Completed]     │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ Marcus Chen (Engineer)       │   │
│ │ Satisfaction: 75%  ▓▓▓▓▓░░░ │   │
│ │                              │   │
│ │ DEMAND: 50 Iron              │   │
│ │ Priority: HIGH 🔴           │   │
│ │ Deadline: 42s                │   │
│ │                              │   │
│ │ You have: 125 Iron ✓        │   │
│ │                              │   │
│ │         [FULFILL]            │   │
│ └─────────────────────────────┘   │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ (Next demand in queue)       │   │
│ └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Demand Card Layout:**
- **Resident info:** Name, role, satisfaction bar
- **Demand details:**
  - Resource type and amount needed
  - Priority indicator (color-coded)
  - Deadline countdown (if applicable)
  - Your current stock of that resource
- **Action button:** 
  - "FULFILL" (green) if you have enough
  - "Need X more" (red) if insufficient
- **Auto-fulfill toggle** (if unlocked)

**Priority Colors:**
- 🔴 **Critical:** Red (with deadline)
- 🟠 **High:** Orange
- 🟡 **Normal:** Yellow
- 🟢 **Low:** Green

### Bottom Section: Unused Factory/Entertainment Devices

```
┌─────────────────────────────────────┐
│ Unused Factory/Entertainment        │
│ Devices                             │
├─────────────────────────────────────┤
│                                     │
│ [Tab: Factories] [Tab: Entertainment]│
│                                     │
│ ┌─────────────────────────────┐   │
│ │ Efficient Iron Forge        │   │
│ │ of Speed                    │   │
│ │ ━━━━━━━━━━━━━━━━━━━━       │   │
│ │ Uncommon • Level 2          │   │
│ │                              │   │
│ │ Success: 85%                │   │
│ │ Critical: 15%               │   │
│ │ Base Prod: 5                │   │
│ │                              │   │
│ │ [Install] [Craft] [Scrap]   │   │
│ └─────────────────────────────┘   │
│                                     │
│ ┌─────────────────────────────┐   │
│ │ Basic Energy Reactor        │   │
│ │ ━━━━━━━━━━━━━━━━━━━━       │   │
│ │ Common • Level 1            │   │
│ └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Inventory Card Layout:**
- **Item name** with affix naming (prefix + base + suffix)
- **Rarity indicator** (colored bar/border)
- **Level and type**
- **Preview of key stats**
- **Action buttons:**
  - Install (opens slot selector)
  - Craft (opens crafting interface)
  - Scrap (convert to materials)
- **Sortable/Filterable** by rarity, type, level

---

## Color Scheme (Dark Theme)

### Base Colors
- **Background:** `#1a1d2e` (dark navy)
- **Panel Background:** `#252837` (slightly lighter)
- **Border/Divider:** `#3d4158` (subtle contrast)
- **Text Primary:** `#e0e6ed` (off-white)
- **Text Secondary:** `#8b92a8` (gray-blue)

### Rarity Colors
- **Common:** `#ffffff` (white)
- **Uncommon:** `#8888ff` (blue)
- **Rare:** `#ffff00` (yellow)
- **Unique:** `#ff8000` (orange)

### Status Colors
- **Success/Positive:** `#4ade80` (green)
- **Warning:** `#fbbf24` (yellow)
- **Critical/Negative:** `#ef4444` (red)
- **Info:** `#60a5fa` (blue)

### Accent Colors
- **Factory Space:** `#6366f1` (indigo) - as shown in your purple box
- **Entertainment Space:** `#92702d` (gold/bronze) - as shown in your gold box
- **Crafting:** `#a855f7` (purple)
- **Demands:** `#ec4899` (pink)

---

## Responsive Behavior

### Desktop (1920x1080+)
- Full three-column layout as described
- All panels visible simultaneously

### Medium (1366x768 - 1920x1080)
- Maintain three columns
- Reduce padding/margins
- Slightly smaller cards

### Small (< 1366x768)
- Convert to tabbed interface:
  - Tab 1: Resources + System
  - Tab 2: Crafting + Orders
  - Tab 3: Inventory

### Mobile (Future consideration)
- Single column
- Collapsible sections
- Swipe navigation between main areas

---

## Interaction Patterns

### Factory Activation
**Manual Mode:**
1. Click factory card
2. Activation animation plays
3. Result popup shows (Success/Crit/Fail + resources gained)
4. Cooldown timer starts on card

**Auto Mode:**
1. Factory has permanent progress bar
2. Activates when bar fills
3. Brief flash/pulse on activation
4. Resources increment in top-left smoothly

### Demand Fulfillment
1. Click "FULFILL" button on demand card
2. Resources deduct with animation
3. Satisfaction bar fills
4. Reward popup appears (if any)
5. Card slides out, next demand slides in

### Installing Equipment
1. Click "Install" on inventory item
2. Modal/overlay shows available slots
3. Click target slot
4. Confirmation if replacing existing
5. Card moves from inventory to active space
6. Stats update immediately

### Crafting
1. Click "Craft" on inventory item
2. Modal shows available crafting operations
3. Select operation (e.g., "Transmute to Uncommon")
4. Show material cost
5. Confirm → Animation → New item revealed
6. Can continue crafting or close

---

## Animation & Feedback

### Factory Activation
- **Idle:** Subtle pulse/glow
- **Activating:** Spinning/charging animation
- **Success:** Green flash, particles
- **Critical:** Gold/orange burst effect
- **Failure:** Red flash, shake

### Resource Changes
- **Gain:** Number ticks up with +X floating text (green)
- **Spend:** Number ticks down with -X floating text (red)
- **Production:** Small "+X/s" indicator pulses periodically

### Demand Events
- **New Demand:** Card slides in from right with sound
- **Deadline Warning:** Card border pulses red when < 10s
- **Fulfilled:** Satisfaction bar fills smoothly, reward sparkle
- **Failed:** Resident satisfaction drops, sad sound/animation

### Entertainment Effects
- **Active:** Subtle ambient animation (lights, movement)
- **Defense Trigger:** Brief shield effect when demand reduced
- **Evasion Success:** Demand card "dodges" away with whoosh

---

## Typography

### Fonts
- **Headers:** `'Orbitron', sans-serif` (sci-fi, geometric)
- **Body/Stats:** `'Roboto Mono', monospace` (technical, readable)
- **UI Elements:** `'Inter', sans-serif` (clean, modern)

### Sizes
- **Page Title:** 24px, bold
- **Section Headers:** 18px, semi-bold
- **Card Titles:** 16px, medium
- **Body Text:** 14px, regular
- **Small Text/Stats:** 12px, regular
- **Tiny Labels:** 10px, regular

---

## Accessibility

- **Keyboard Navigation:** Full support for tab/enter/space
- **Screen Reader:** ARIA labels on all interactive elements
- **Color Blind:** Use icons + text, not color alone
- **High Contrast Mode:** Ensure sufficient contrast ratios
- **Text Scaling:** Support up to 200% zoom without breaking

---

## Additional UI Elements

### Top-Right Corner Actions
- **Settings Gear:** Game options, audio, graphics
- **Save Button:** Manual save (if auto-save enabled, just indicator)
- **Prestige Button:** When eligible, glowing/pulsing

### Tooltips
- Appear on hover over any stat/item
- Show detailed explanations
- Include calculations (e.g., "Base 10 + Flat 5 + 20% = 18 total")

### Notifications/Toast Messages
- Top-center, below header
- Auto-dismiss after 3-5 seconds
- Types: Info, Success, Warning, Error

### Modal Overlays
- Darken background
- Center content
- Click outside to close
- Used for: Crafting, Slot Selection, Settings, Prestige

---

This layout provides a clean, organized interface that separates information (left), action (center), and management (right), making it easy for players to understand their station at a glance while having quick access to all key functions.