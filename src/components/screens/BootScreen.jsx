import { useRef } from "react";
import { gsap, useGSAP, reducedMotion } from "../../lib/gsap.js";
import { useControls } from "../../lib/controls.js";

const LINES = [
  ["mounting /work", "ok"],
  ["mounting /about", "ok"],
  ["indexing skills", "8"],
  ["opening channels", "4"],
];

export default function BootScreen({ onDone }) {
  const root = useRef(null);
  const tl = useRef(null);

  useControls({ skip: () => tl.current?.progress(1) }, [
    ["↵", "skip"],
    ["P", "power off"],
  ]);

  useGSAP(
    () => {
      const t = gsap.timeline({ onComplete: onDone, delay: 0.35 });
      tl.current = t;
      t.to(".boot__word", {
        duration: 0.9,
        scrambleText: { text: "roya", chars: "░▒▓/<>", speed: 0.6, revealDelay: 0.3 },
        ease: "none",
      })
        .from(".boot__dot", { scale: 0, duration: 0.5, ease: "back.out(3)" }, "-=0.2")
        .from(".boot__sub", { opacity: 0, y: 4, duration: 0.3 }, "<")
        .addLabel("lines")
        .from(".boot__line", { opacity: 0, x: -6, duration: 0.25, stagger: 0.2 }, "lines")
        .from(".boot__status", { opacity: 0, duration: 0.1, stagger: 0.2 }, "lines+=0.18")
        .fromTo(
          ".boot__bar i",
          { scaleX: 0 },
          { scaleX: 1, duration: 1, ease: "steps(14)" },
          "lines"
        )
        .to(".boot__ready", { opacity: 1, duration: 0.2 })
        .to({}, { duration: 0.45 });
      if (reducedMotion()) t.timeScale(4);
    },
    { scope: root }
  );

  return (
    <div className="scr scr--boot" ref={root}>
      <div className="boot__logo">
        <span className="boot__word" aria-label="roya" />
        <span className="boot__dot">.</span>
      </div>
      <p className="boot__sub">os 1.0 · jeddah build</p>
      <ul className="boot__lines">
        {LINES.map(([label, status]) => (
          <li key={label} className="boot__line">
            <span>› {label}</span>
            <span className="boot__leader" />
            <span className="boot__status">{status}</span>
          </li>
        ))}
      </ul>
      <div className="boot__bar" aria-hidden>
        <i />
      </div>
      <p className="boot__ready">ready.</p>
    </div>
  );
}
