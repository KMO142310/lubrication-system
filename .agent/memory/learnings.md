# Learnings & Patterns

## Code Quality (Audit Cycle 1)
- **Duplication Pattern**: Navigation cards (Visual Links) tend to be copied between dashboards. *Solution*: Extracted `NavigationCard` component.
- **Dead Code**: Auth helper functions (`canAccess`) were replaced by `ProtectedRoute` logic but left behind. *Action*: Removed.
- **False Positives**: `check-dead-code` flags Next.js page exports. Added to ignore list.

## React Patterns
- Used `dangerouslySetInnerHTML` for styles in `ReportsPage` to handle keyframe animations in CSS-in-JS (Quick win vs CSS Modules).
- `Skeleton` component improves perceived performance significantly over plain text loading states.

## Database
- Supabase Realtime requires explicit channel subscription cleanup in `useEffect` return.
