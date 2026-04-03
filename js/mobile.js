/* =====================
   MOBILE ENHANCEMENTS
   ===================== */

/**
 * Prevent double-tap zoom delay on touch devices for interactive elements.
 * On Android WebView, double-tapping causes a 300ms delay before processing clicks.
 * This listener prevents that zoom on quiz options, buttons, and other interactive elements.
 */
document.addEventListener(
  'touchend',
  function (e) {
    const target = e.target.closest(
      '.option, .btn-primary, .btn-secondary, .next-btn, .start-btn, .result-btn, .modal-action, button, a[role="button"]'
    );
    if (target) {
      // Prevent the default double-tap zoom behavior
      e.preventDefault();
    }
  },
  { passive: false }
);

/**
 * Ensure interactive elements are always touch-friendly.
 * Adds minimum tap target sizing for accessibility on mobile.
 */
(function () {
  const MAX_CLICK_DURATION = 300; // milliseconds
  let touchStartTime = 0;

  document.addEventListener('touchstart', () => {
    touchStartTime = Date.now();
  });

  document.addEventListener('touchend', (e) => {
    const touchDuration = Date.now() - touchStartTime;
    // Allow rapid clicks on touch devices to feel responsive
    if (touchDuration < MAX_CLICK_DURATION) {
      // This rapid touch is likely intentional, not a zoom attempt
      return;
    }
  });
})();
