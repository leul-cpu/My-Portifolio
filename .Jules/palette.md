## 2025-05-15 - [Scroll Spy & Accessible Toggles]
**Learning:** Vanilla JS portfolios often lack visual feedback for navigation (Scroll Spy) and accessible attributes for interactive toggles like "Read More" buttons. Using `IntersectionObserver` with `aria-current="location"` provides a seamless and accessible way to track the user's position.
**Action:** Always implement `IntersectionObserver` for Scroll Spy and ensure toggles use `aria-expanded` and `aria-controls` for screen reader support.

## 2025-05-20 - [Dynamic Avatars & Aria Synchronization]
**Learning:** Hardcoded image paths for testimonials can easily break. Using a fallback service like ui-avatars.com ensures the UI remains polished even when assets are missing. Additionally, synchronizing the `aria-expanded` state in JavaScript is critical for maintaining an accurate accessibility tree during user interaction.
**Action:** Use dynamic avatar fallbacks for user-generated content and always update ARIA states in event listeners.

## 2025-05-25 - [Dynamic ARIA Feedback for Async Forms]
**Learning:** Visual-only state changes (like "Message Sent") in async forms are invisible to screen readers if not paired with `aria-live` regions. Adding a loading state also prevents duplicate submissions and manages user expectations during simulated or real network latency.
**Action:** Always pair visual form feedback with an `aria-live="polite"` region to announce status updates to assistive technologies.
