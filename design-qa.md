# Orbital background verification

final result: passed

## Clouds and city traffic (orbital-4)

- Request: add moving clouds and cars so motion is present throughout the city, using the Instagram highway crop as a movement reference (`.preview/road-motion-reference.png`). The original generated city remains the environment source (`assets/orbital-city.webp`).
- Added three softly overlapping cloud banks with different phases, heights, and speeds, using an original transparent cloud texture (165,152 bytes). Each layer drifts and changes scale slightly, with transparent endpoints and overlapping playback.
- Added 28 small vehicle sprites (one shared 2,124-byte transparent asset) traveling in two directions along a sampled curve fitted to the painted highway. Vehicle heading follows the curve; size and apparent speed increase toward the foreground.
- Responsive registration: traffic positions are calculated in the original 1672 × 941 artwork coordinates, then mapped through the same cover scale and object-position as the image. The traffic layer is inside the camera-drift container, so the road and vehicles move together.
- Evidence: `.preview/city-motion-a.png`, `.preview/city-motion-b.png`, and `.preview/city-paused.png` (1253 × 1244, 1:1 CSS/image pixels); `.preview/city-motion-portfolio.png` shows the layers behind the existing UI. Source normalized to a matching cover crop in `.preview/city-source-normalized.png`. Both were opened together in `.preview/city-motion-comparison.png`; the small crop/zoom difference is the intended moving camera, and the light-theme scrim intentionally lightens the artwork.
- Focused road inspection: `.preview/traffic-road-check.png` is an enlarged crop of the captured runtime image, compared against `.preview/road-detail.png`. Sampled vehicle bounding boxes align with the diagonal road. No cars were observed crossing the building facades in this sample.
- Motion: vehicle and cloud transforms changed between observations. After pause, the sampled car and cloud transforms stayed identical in two later observations. Resume restored playback. Reduced-motion and page visibility use the shared scene control.
- Typography, layout rhythm, and copy are unchanged. Existing light-glass tokens remain in place; the new layers are decorative, excluded from accessibility content, and outside page layout. New image colors match the coral/lavender/blue environment. No actionable P0/P1/P2 findings in the inspected states.
- Mobile evidence: `.preview/city-motion-mobile.png`, a fully initialized 390 × 844 CSS-pixel iframe. Crop/controls/readability inspected. One MutationObserver error appeared during wrapper reload; the project contains no MutationObserver/observe call, the frame subsequently initialized, and the main portfolio view had no console errors. This wrapper-only observation is retained as a test limitation.
- Checks passed: JavaScript syntax, whitespace, existing motion/flight checks, and `.preview/check-traffic.cjs` (two directions, finite route samples, hidden endpoints, mobile cover/object-position mapping, preserved phase, paused resize, and no duplicate cars on resize).
- Limits: this remains a layered animated scene, not a full 3D simulation. The painted original clouds/window lights remain in the source image; the new cloud banks and vehicle streams add independent movement. Full 230-second far-cloud cycle was not watched in real time; endpoint behavior was inspected in the animation definition.
- Both CSS and script cache versions updated to `orbital-4`.
- Final result: passed.

## Transparency and flight correction (orbital-3)

The user's next screenshots exposed two earlier misses: L1 remained visually opaque, and the light terminal/stat boxes retained solid-white overrides even at L5. These were P1 findings; the earlier light-glass acceptance was too narrow.

- Sources: `.preview/glass-v3-source-l1.png` (1213 × 1113) and `.preview/glass-v3-source-l5.png` (1219 × 872).
- Corrected captures: `.preview/glass-v3-l1.png`, `.preview/glass-v3-l5.png`, and `.preview/glass-v3-dark.png` (1280 × 720, 1:1 CSS/image pixels).
- Combined comparison opened: `.preview/glass-v3-comparison.png`. It aligns the first 600 pixels of each overview, scaled proportionally. Source viewport heights differ, so only matching above-the-fold surfaces are compared.
- Fix: light panel alpha now ranges from 0.56 at L1 to 0.22 at L5. Blur ranges from 6 to 14 pixels, retaining visible background structure. Restrained sheen avoids adding another heavy white layer. Nested terminal alpha ranges from 0.30 to 0.14, and stat/chip/button surfaces share translucent tokens instead of opaque white fills.
- Typography/content: existing type sizes, wrapping, section layout, copy, and imagery retained. Darker body/secondary text and deeper terminal accent colors support readability on the newly transparent surfaces. Both L1 and L5 now show the city through the terminal and stat boxes. Dark theme inspected; original dark surface tokens retained.
- Flight correction: three native browser animations sample smooth curved routes with heading derived from the path tangent and scale varying with depth. Independent local banking and a generated transparent ion-plume asset add motion beyond translation. This remains animated 2D artwork, not a fully rendered 3D spacecraft or video.
- Motion evidence: `.preview/flight-motion-a.png` and `.preview/flight-motion-b.png` capture different positions/attitudes in an isolated background verification view. Live computed transforms changed independently for travel, banking, and exhaust. After pause, all three transforms remained identical on a subsequent observation. Resume restored motion.
- Responsive evidence: `.preview/glass-v3-mobile.png`, a 390 × 844 CSS-pixel iframe captured inside the desktop browser. Mobile layout, glass readability, and controls inspected.
- Focused checks passed: `.preview/check-motion.cjs` now checks native-animation pause/play as well as preferences/visibility; `.preview/check-flight.cjs` checks finite smooth samples, hidden loop endpoints, responsive path rebuilding, phase preservation, and paused resize. JavaScript syntax and whitespace checks passed. No browser console errors/warnings observed.
- Image quality: original city/ship assets retained, with a new 40,290-byte transparent exhaust WebP. The plume is placed at the engine outlet and modulated separately from the hull.
- Post-fix result: no actionable P0/P1/P2 findings in the requested glass/flight scope. Full 142-second distant-ship cycle was not watched end-to-end; endpoints and trajectory samples were checked directly.
- CSS and application cache versions both updated to `orbital-3`.
- Final result: passed.

## Light-glass follow-up

- User requested more transparency in the light-theme experience, skills, and footer panels. Source screenshot saved as `.preview/light-glass-reference.png` (1226 × 858).
- Reduced white panel opacity and, especially, the opaque sheen/top overlays across light glass levels L1–L5. Reduced the strongest white inset shadows. L1 now also has a translucent surface. Dark-theme tokens are unchanged.
- Darkened the light-theme secondary text color to `#475569` to retain readability over the scene.
- Implementation: `.preview/light-glass-after.png` (1280 × 720, 1:1 CSS/image pixels, light/L3/experience) and `.preview/light-glass-l5.png` (same viewport, light/L5).
- Combined source/implementation comparison: `.preview/light-glass-comparison.png`. Both were opened together; proportional scaling only. Source and implementation have different viewport heights and scroll offsets, so this compares the panel treatment rather than exact framing.
- Required surfaces: existing typography, layout, imagery, and copy retained; reduced light-surface opacity is the intended token change. Large panels visibly carry the pink/blue background colors, and small labels remain readable. L1/L3/L5 inspected in browser; no console warnings/errors. No actionable P0/P1/P2 findings remain.
- Stylesheet version updated to `orbital-2` so returning visitors receive the new treatment.
- Follow-up final result: passed.

## Scope and visual truth

- Reference: https://www.instagram.com/p/DcYZC3dzFwN/
- Source capture: `.preview/instagram-reference.png` (665 × 1182 pixels).
- Implementation captures: `.preview/portfolio-dark.png`, `.preview/portfolio-light.png` (1280 × 720 pixels), and `.preview/portfolio-mobile.png` (1265 × 884 wrapper capture containing a 390 × 844 CSS-pixel iframe).
- Full-view comparison: `.preview/comparison.png` (1600 × 1000). Reference and both rendered themes were opened together in this comparison.
- State: portfolio overview, glass level 3. Dark theme running; light capture paused. Mobile uses a 390 × 844 iframe because browser viewport emulation is unavailable.
- Density: desktop captures are 1 image pixel per CSS pixel. Comparison images were proportionally reduced, not stretched. The source is portrait and the portfolio is landscape; this is a style adaptation, not a pixel-for-pixel reproduction of Instagram or its video framing.

## Findings and fidelity surfaces

No actionable P0/P1/P2 findings within the background change.

- Fonts and typography: existing portfolio typography retained. Both themes remain readable over the image; the new motion control uses the existing monospace font and a 44-pixel minimum target height.
- Spacing and layout rhythm: existing cards, navigation, spacing, and content retained. The decorative scene is fixed, clipped, and excluded from layout. Desktop DOM check found no horizontal overflow. The mobile screenshot shows the card fitting its viewport and the fixed motion control inside the frame.
- Colors and tokens: the generated artwork carries the reference's blue industrial architecture, amber lights, lavender atmosphere, and coral planet. Theme-specific solid scrims preserve the existing foreground contrast.
- Image quality and fidelity: original generated city and transparent spacecraft assets, compressed into WebP (241,564 and 174,598 bytes). All four image instances were confirmed loaded in the browser. Independent ship passes and a gentle camera drift adapt the reference's motion into a lightweight parallax background. This is layered artwork, not a newly rendered 3D video.
- Copy and content: existing portfolio content retained. Only the descriptive Pause/Play background control was added.
- Focused checks: desktop captures clearly show text and control legibility; the full-height mobile frame was separately opened to inspect wrapping, crop, and the bottom-right motion control. No additional region crop was needed.

## Behavior and validation

- Browser: desktop dark/light themes visually inspected; narrow-screen iframe inspected; pause stops all four CSS animations; resume restarts them; paused preference survives reload.
- Existing terminal interaction: Dev Projects switches content, then Infrastructure restores it.
- Browser console: no warnings or errors observed.
- JavaScript syntax and whitespace checks passed.
- Focused motion checks in `.preview/check-motion.cjs` passed: OS reduced-motion priority, explicit playback opt-in, stopping on a new reduced-motion request, saved pause, hidden-page suspension, and operation when storage is blocked. Reduced motion was tested with mocked browser preferences, not OS-level browser emulation.
- Loop continuity: camera keyframes end at the starting transform. Ship opacity is zero at both ends and resets beyond the clipped viewport; transit transforms were observed changing during live playback. Full 190-second longest ship cycle was not watched in real time.

## Comparison history

Initial visual comparison passed without actionable P0/P1/P2 findings. Asset dimensions and compression were finalized before the first browser capture.

## Follow-up polish

The image layers intentionally offer subtler motion than the source's full 3D camera movement. Speed and darkness can be tuned after reviewing the preview.

## Implementation checklist

- [x] Original locally hosted artwork integrated.
- [x] Infinite motion, pause/play, and saved preference implemented.
- [x] Reduced-motion and hidden-tab handling verified.
- [x] Desktop themes and narrow-screen composition inspected.
- [x] Preview retained for review; no deployment performed.

## Scroll rendering follow-up — 23 October 2026

The user reported severe scrolling lag on the public site in Chrome and Opera,
while the in-app browser was smooth. They confirmed that manually pausing the
background made scrolling much smoother. This narrows the issue to the live
scene/rendering interaction; no Chrome GPU trace or frame-rate benchmark was
captured.

- An initial temporary scroll hold (`effe1ea`) improved the user's scrolling,
  but they rejected the frozen background. The final version removes that hold:
  no scroll, wheel, or touch handler pauses, restarts, or rebuilds the scene.
- The fixed scene has paint/layout containment and isolated blending. The
  covered fallback body gradients no longer use fixed background attachment.
  Glass-panel/modal blur is capped at 6px, the motion control uses 6px blur, and
  vehicle sprites no longer add separate drop-shadow filter passes. Glass fill,
  saturation, border tokens, and all cloud/ship/traffic animation layers remain.
- Four committed controller tests pass with `node --test tests/background-motion.test.cjs`,
  covering continuous playback without scroll side effects or timers, saved
  preferences, reduced motion, hidden-tab behavior, and unavailable storage.
- A local in-app browser fixture exercised real CSS/native animation playback
  through four scroll positions at desktop and 390-pixel widths. All 28 assertions
  passed, including advancing route phases, unchanged preferences, 6px effective
  L5 blur, and containment/attachment/filter checks. Evidence and fixture
  remain ignored under `.preview/scroll-qa.html` and `.preview/scroll-checks.txt`.
- Light L5 composition was visually inspected. JavaScript syntax and whitespace
  checks passed. Resource versions are paired at `orbital-6`.
- These checks establish playback behavior and source validity. Smoothness in
  the user's Chrome/Opera installation still requires their confirmation after
  the continuous-motion update; the in-app browser does not establish that result.
