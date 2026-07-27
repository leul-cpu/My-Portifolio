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


## 2026-07-16 - [Contextual Accessibility & Browser UI Integration]
**Learning:** Repetitive "Read More" buttons are a major accessibility hurdle for screen reader users as they lack context when navigated out of sequence. Deriving descriptive labels from nearby headings (e.g., "Read more about Full-Stack MVP Development") restores that context. Furthermore, dynamically synchronizing the 'theme-color' meta tag provides a premium feel by matching the mobile browser's UI with the site's dark/light modes.
**Action:** Always provide descriptive, unique aria-labels for generic repetitive toggles and synchronize meta theme colors with runtime theme changes.

## 2026-07-18 - [Dynamic Character Counters & Custom Cursor Lifecycles]
**Learning:** Text areas with character limits need both visual and auditory cues to be highly usable. Adding an inline character counter with `aria-live="polite"` and `aria-atomic="true"` provides screen readers with gentle, non-disruptive feedback on form entry progression. Pairing this with a premium color-changing threshold warning (e.g., changing text to warm warning amber at 90% capacity) delights users with clear visual feedback before they hit native truncation limits. Furthermore, custom cursors require explicit window lifecycle listeners (`mouseleave` and `mouseenter`) to prevent them from freezing awkwardly at boundaries when the mouse leaves the browser viewport.
**Action:** Always implement ARIA-live dynamic counters for character-constrained inputs and handle document boundary events for high-fidelity custom cursors.

## 2026-07-22 - [Temporary Copy Success States & Toast Accessibility]
**Learning:** Copy-to-clipboard buttons can leave users confused if there is no immediate visual and non-visual feedback. Using temporary success states that dynamically alter `aria-label` and `title` to "Email address copied!" ensures screen readers receive explicit, real-time auditory confirmation of the action. Coupling this with custom CSS classes like `.copied` to change colors to a positive theme accent for exactly 3 seconds prevents visual clutter while remaining intuitive.
**Action:** Always pair clipboard success states with dynamic ARIA label updates and temporary visual styling indicators that revert gracefully.

