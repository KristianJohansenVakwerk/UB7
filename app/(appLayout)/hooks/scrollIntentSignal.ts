// Module-scoped, mutable scroll-intent signal. Writers (useSectionScroll) update
// `value` on every wheel/touch event; readers (GradientPlane useFrame) sample it
// per-frame. Bypasses React state so a 60Hz scroll doesn't re-render the tree.
export const scrollIntentSignal = { value: 0 };
