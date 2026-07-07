## 2025-05-15 - [Scroll Spy & Accessible Toggles]
**Learning:** Vanilla JS portfolios often lack visual feedback for navigation (Scroll Spy) and accessible attributes for interactive toggles like "Read More" buttons. Using `IntersectionObserver` with `aria-current="location"` provides a seamless and accessible way to track the user's position.
**Action:** Always implement `IntersectionObserver` for Scroll Spy and ensure toggles use `aria-expanded` and `aria-controls` for screen reader support.
