---
name: modernize-time-tracking-ui
overview: Redesign the Angular frontend of the time-tracking app with a modern, dashboard-style UI inspired by the provided example image, while keeping colors easy to retheme later.
todos:
  - id: shell-layout
    content: Create a shared shell layout with sidebar and top header, and wrap main routes in it.
    status: pending
  - id: theme-tokens
    content: Introduce global theme tokens (colors, spacing, radii, shadows) and connect Angular Material theme to them.
    status: pending
  - id: projects-ui-refresh
    content: Redesign projects list and project detail to use the new dashboard-style cards and layout.
    status: pending
  - id: time-tracking-ui-refresh
    content: Redesign the main time-tracking screen into sections similar to the inspiration image with modern cards and right-side info.
    status: pending
  - id: reports-ui-refresh
    content: Update reports page to use summary cards, filter toolbar, and refreshed table styling.
    status: pending
  - id: dialogs-consistency
    content: Standardize add/edit dialogs for projects, tasks, and time entries with consistent modern styling.
    status: pending
  - id: responsive-tweaks
    content: Add responsive rules to ensure shell and key pages work well on smaller screens.
    status: pending
isProject: false
---

### Goals

- **Unify the UI** into a modern, dashboard-style layout across the whole app (auth, main layout, time tracking, projects/tasks, reports).
- **Take inspiration from the example image** (card-based layout, clear sections, prominent header, left navigation, right-side panels) while keeping color tokens configurable.
- **Improve usability** (spacing, typography hierarchy, visual grouping, clear CTAs) without changing core backend behavior.

### High-level approach

- **1. Establish design system**
  - Create a central theming setup (CSS variables or SASS map) for colors, radii, shadows, and spacing.
  - Define reusable layout primitives: `AppShell` (sidebar + header + content), `SectionCard`, `StatChip`, `Toolbar`.
  - Align Angular Material theme (primary/accent/warn) to these tokens; keep the palette neutral with blue/purple accents to match the inspiration.
- **2. Redesign global layout (shell)**
  - Update the main app layout in `[frontend/src/app/app.html](frontend/src/app/app.html)` and `[frontend/src/app/app.ts](frontend/src/app/app.ts)`:
    - Add a **fixed left sidebar** with navigation (Home/Time, Projects, Reports, Settings) similar to the example's left rail.
    - Add a **top header bar** in the content area with search, current user avatar/name, and optional quick actions (e.g., "New entry", "New project").
    - Ensure the content area scrolls while sidebar/header remain fixed.
  - Introduce a shared `ShellComponent` (or similar) in `[frontend/src/app/core/layout]` to wrap feature routes with this layout.
- **3. Modernize typography, spacing, and cards**
  - Define global typography and spacing in a stylesheet (e.g. `[frontend/src/styles.scss]` or a dedicated `theme.scss`):
    - Larger, semi-bold section titles; subtle muted subtitles.
    - Increased base spacing (8/12/16px scale) and consistent card paddings.
    - Softer card backgrounds, subtle borders or shadows, and rounded corners similar to the example.
  - Apply these via utility classes (e.g., `.page-title`, `.page-subtitle`, `.section-card`, `.pill`, `.muted-text`).
- **4. Redesign key screens as mini dashboards**
  - **Time tracking / home view**:
    - Organize into sections like in the inspiration: "Today", "This week", "My Work"/"LineUp", with task/time cards.
    - Use card lists with small meta info rows (duration, project, task, date) and avatar group if applicable.
    - Add a compact right-hand panel for **calendar snippet / upcoming work**, inspired by the example's right column.
  - **Projects & tasks configuration** (`features/projects`):
    - Turn project list into a cards grid or grouped list with clear project tiles (name, domain, active flag, task count, quick actions).
    - Redesign project detail page to a 2-column layout: left for project info and actions, right for tasks list styled similarly to the "My Work" / card rows in the example.
    - Use pill badges for status (Active/Inactive) and domain.
  - **Reports view**:
    - Wrap filters and tables in well-defined sections (top filter toolbar, main cards showing totals, and data table below).
    - Add summary cards for total hours by period/project, in the style of the example's top cards.
- **5. Unify and modernize dialogs and forms**
  - Update add/edit dialogs for projects, tasks, and time entries to:
    - Use consistent titles, spacing, and buttons (primary right-aligned, subtle text secondary).
    - Use full-width outlined fields with clear labels and helper text where appropriate.
  - Ensure dialog widths and padding match a shared spec (e.g. `max-width: 480px`, consistent margins).
- **6. Responsive behavior**
  - Add breakpoints so that:
    - Sidebar collapses to icons-only or a top nav on smaller screens.
    - Two/three-column dashboards stack vertically on mobile.
    - Tables and lists remain usable (horizontal scroll if necessary, but prefer wrapping layout).
- **7. Cleanup and consistency pass**
  - Remove leftover inline styles and ad-hoc spacing in feature components, replacing them with the new utility classes.
  - Ensure all pages use the shell layout and follow the same typography scale and card patterns.
  - Verify buttons, links, and icons are consistent (sizes, colors, hover states) throughout.

### Example implementation details (non-exhaustive)

- **Theme tokens (pseudo-code)** in `styles.scss` or `theme.scss`:
  - Define `--color-bg`, `--color-surface`, `--color-primary`, `--color-accent`, `--color-border-subtle`, `--radius-card`, `--shadow-card` so colors can be swapped easily later.
- **Sidebar structure** in `app.html`:
  - Outer flex container with a fixed-width left panel (logo/app name, navigation links) and a flex:1 content area containing header + router outlet.
- **Card layout** for lists:
  - Each row is a card-like `mat-card` or customized `div` with left-aligned info block (title, subtitle line), and right-aligned meta (date, totals, icons) similar to the example's "My Work" section.

### Todos

- **shell-layout**: Create a shared shell layout with sidebar and top header, and wrap main routes in it.
- **theme-tokens**: Introduce global theme tokens (colors, spacing, radii, shadows) and connect Angular Material theme to them.
- **projects-ui-refresh**: Redesign projects list and project detail to use the new dashboard-style cards and layout.
- **time-tracking-ui-refresh**: Redesign the main time-tracking screen into sections similar to "LineUp" / "My Work" with modern cards and right-side info.
- **reports-ui-refresh**: Update reports page to use summary cards + clear filter toolbar + modernized table.
- **dialogs-consistency**: Standardize dialogs (add/edit project, task, time entry) to consistent modern styling.
- **responsive-tweaks**: Add responsive rules for shell, cards, and tables to look good on smaller screens.

