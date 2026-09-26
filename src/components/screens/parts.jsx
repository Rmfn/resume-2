import { useRef } from "react";
import { motion } from "motion/react";
import { gsap, useGSAP, reducedMotion } from "../../lib/gsap.js";

export const pad = (n) => String(n).padStart(2, "0");

/** Text that decodes itself with GSAP ScrambleText whenever `text` changes. */
export function Scramble({ text, className, chars = "/<>_01#", duration = 0.7, delay = 0 }) {
  const ref = useRef(null);
  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap.fromTo(
        ref.current,
        { scrambleText: { text: " ", chars } },
        { duration, delay, scrambleText: { text, chars, speed: 0.5, revealDelay: duration * 0.3 }, ease: "none" }
      );
    },
    { dependencies: [text] }
  );
  return (
    <span ref={ref} className={className} aria-label={text}>
      {text}
    </span>
  );
}

export function ScreenHeader({ path, meta }) {
  return (
    <header className="scr__head">
      <Scramble text={path} className="scr__path" />
      <span className="scr__meta">{meta}</span>
    </header>
  );
}

export function Prompt({ children }) {
  return (
    <footer className="scr__prompt">
      <span className="accent">&gt;</span>
      <span className="caret" aria-hidden />
      <span className="dim">{children}</span>
    </footer>
  );
}

/** Two-way tab bar with a sliding highlight driven by Motion. */
export function Tabs({ items, value, onChange }) {
  return (
    <div className="tabs" role="tablist" style={{ "--n": items.length }}>
      <motion.span
        className="tabs__hl"
        animate={{ x: `${value * 100}%` }}
        transition={{ type: "spring", stiffness: 520, damping: 40 }}
      />
      {items.map((label, i) => (
        <button
          key={label}
          type="button"
          role="tab"
          aria-selected={value === i}
          className={value === i ? "is-on" : ""}
          onClick={() => onChange(i)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export const ROW_H = 28;

/** A selectable list with a spring-driven cursor bar. */
export function List({ items, cursor, setCursor, onOpen, render }) {
  return (
    <ul className="list" style={{ height: items.length * ROW_H }}>
      <motion.span
        className="list__hl"
        aria-hidden
        animate={{ y: cursor * ROW_H }}
        transition={{ type: "spring", stiffness: 600, damping: 42 }}
      />
      {items.map((it, i) => (
        <li key={it.id ?? it.key} className={i === cursor ? "row is-on" : "row"}>
          <button type="button" onMouseEnter={() => setCursor(i)} onFocus={() => setCursor(i)} onClick={() => onOpen(i)}>
            <span className="row__n">{pad(i + 1)}</span>
            {render(it, i)}
          </button>
        </li>
      ))}
    </ul>
  );
}

// Stagger helper for Motion sections.
export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};
export const rise = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};
