## 2025-05-15 - [Scroll Spy & Accessible Toggles]
**Learning:** Vanilla JS portfolios often lack visual feedback for navigation (Scroll Spy) and accessible attributes for interactive toggles like "Read More" buttons. Using `IntersectionObserver` with `aria-current="location"` provides a seamless and accessible way to track the user's position.
**Action:** Always implement `IntersectionObserver` for Scroll Spy and ensure toggles use `aria-expanded` and `aria-controls` for screen reader support.

## 2025-05-20 - [Dynamic Avatars & Aria Synchronization]
**Learning:** Hardcoded image paths for testimonials can easily break. Using a fallback service like ui-avatars.com ensures the UI remains polished even when assets are missing. Additionally, synchronizing the `aria-expanded` state in JavaScript is critical for maintaining an accurate accessibility tree during user interaction.
**Action:** Use dynamic avatar fallbacks for user-generated content and always update ARIA states in event listeners.

## 2025-05-25 - [Dynamic ARIA Feedback for Async Forms]
**Learning:** Visual-only state changes (like "Message Sent") in async forms are invisible to screen readers if not paired with `aria-live` regions. Adding a loading state also prevents duplicate submissions and manages user expectations during simulated or real network latency.
**Action:** Always pair visual form feedback with an `aria-live="polite"` region to announce status updates to assistive technologies.

## 2025-06-05 - [Overlay Visibility & Focus Management]
**Learning:** Overlays like mobile menus and modals that only use `opacity: 0` for transitions remain in the tab order and are accessible to screen readers while invisible. Combining `opacity` with `visibility: hidden/visible` effectively removes them from the accessibility tree. Furthermore, programmatic focus management (focusing the first link on open and returning to the trigger on close) is essential to prevent focus loss.
**Action:** Always use `visibility` for overlay components and implement programmatic focus management for all modal/drawer interactions.

## 2025-06-15 - [Scroll Progress Bar & Enhanced Scroll Spy]
**Learning:** A scroll progress bar provides valuable visual feedback for long editorial-style pages. Using hardware-accelerated CSS `transform: scaleX()` instead of `width` ensures a smooth 60fps experience even on mobile devices. Additionally, ensuring Scroll Spy highlights active sections in mobile overlay menus is a often-overlooked micro-UX detail that improves orientation during mobile navigation.
**Action:** Implement scroll progress with `scaleX` for performance and always synchronize active navigation states across both desktop and mobile menus.
