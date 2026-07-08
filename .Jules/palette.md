## 2025-05-15 - [Scroll Spy & Accessible Toggles]
**Learning:** Vanilla JS portfolios often lack visual feedback for navigation (Scroll Spy) and accessible attributes for interactive toggles like "Read More" buttons. Using `IntersectionObserver` with `aria-current="location"` provides a seamless and accessible way to track the user's position.
**Action:** Always implement `IntersectionObserver` for Scroll Spy and ensure toggles use `aria-expanded` and `aria-controls` for screen reader support.

## 2025-05-20 - [Dynamic Avatars & Aria Synchronization]
**Learning:** Hardcoded image paths for testimonials can easily break. Using a fallback service like ui-avatars.com ensures the UI remains polished even when assets are missing. Additionally, synchronizing the `aria-expanded` state in JavaScript is critical for maintaining an accurate accessibility tree during user interaction.
**Action:** Use dynamic avatar fallbacks for user-generated content and always update ARIA states in event listeners.
