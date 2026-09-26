import { createContext, useContext, useLayoutEffect } from "react";

// The device has one set of physical inputs (wheel, keys). Whichever screen is
// showing registers handlers for them; App routes every input to those handlers.
export const ControlsCtx = createContext(null);

/**
 * @param handlers {up, down, left, right, enter, back, digit, skip} — back returns true if handled
 * @param hints    [[key, label], ...] shown in the keyboard panel
 */
export function useControls(handlers, hints) {
  const ctx = useContext(ControlsCtx);
  useLayoutEffect(() => {
    ctx.handlers.current = handlers;
  });
  const key = hints.map((h) => h.join(":")).join("|");
  useLayoutEffect(() => {
    ctx.setHints(hints);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}

// Scroll a screen body by a step, used by list-less screens for up/down.
export function scrollBy(el, gsap, dir) {
  if (!el) return;
  gsap.to(el, { scrollTo: { y: el.scrollTop + dir * 64 }, duration: 0.35, overwrite: true });
}

let audio;
let muted = false;
export const toggleMute = () => (muted = !muted);
export const isMuted = () => muted;

// A short, quiet tick for the click wheel.
export function tick(freq = 1800) {
  if (muted) return;
  try {
    audio ??= new (window.AudioContext || window.webkitAudioContext)();
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = "square";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.025, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.03);
    osc.connect(gain).connect(audio.destination);
    osc.start();
    osc.stop(audio.currentTime + 0.035);
  } catch {
    /* audio is decoration only */
  }
}
