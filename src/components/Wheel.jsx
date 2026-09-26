import { useRef } from "react";
import { motion } from "motion/react";
import { gsap, useGSAP, reducedMotion } from "../lib/gsap.js";
import { tick } from "../lib/controls.js";
import { CHANNEL_ICONS } from "./Icons.jsx";

const STEP = 28; // degrees of rotation per list step
// atan2 quadrants (0 = right, 1 = bottom, 2 = left, 3 = top) → channel
const QUADRANT = ["about", "contact", "skills", "work"];
const POSITIONS = { work: "top", about: "right", contact: "bottom", skills: "left" };
const LABELS = { work: "Work", about: "About", contact: "Contact", skills: "Skills" };

const norm = (d) => ((d + 540) % 360) - 180;

export default function Wheel({ dispatch, channel, on }) {
  const wheel = useRef(null);
  const groove = useRef(null);
  const drag = useRef(null);
  const spin = useRef(0);

  const { contextSafe } = useGSAP({ scope: wheel });

  const polar = (e) => {
    const r = wheel.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    return (Math.atan2(e.clientY - cy, e.clientX - cx) * 180) / Math.PI;
  };

  // The wheel rocks toward the side you press, like a physical d-pad.
  const rock = contextSafe((quadrant) => {
    if (reducedMotion()) return;
    const [rx, ry] = [[0, 7], [-7, 0], [0, -7], [7, 0]][quadrant];
    gsap.fromTo(
      wheel.current,
      { rotationX: rx, rotationY: ry },
      { rotationX: 0, rotationY: 0, duration: 0.6, ease: "elastic.out(1, 0.45)", transformPerspective: 500 }
    );
  });

  const spinGroove = contextSafe((delta) => {
    spin.current += delta;
    gsap.to(groove.current, { rotation: spin.current, duration: 0.25, ease: "power3.out", overwrite: true });
  });

  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { last: polar(e), acc: 0, moved: 0 };
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const a = polar(e);
    const delta = norm(a - d.last);
    d.last = a;
    d.acc += delta;
    d.moved += Math.abs(delta);
    if (d.moved > 6) spinGroove(delta);
    while (d.acc >= STEP) {
      d.acc -= STEP;
      dispatch("down");
      tick();
    }
    while (d.acc <= -STEP) {
      d.acc += STEP;
      dispatch("up");
      tick();
    }
  };

  const onPointerUp = (e) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.moved > 6) return;
    // A tap, not a spin: pick the side that was pressed.
    const q = Math.round(((polar(e) + 360) % 360) / 90) % 4;
    rock(q);
    tick(900);
    dispatch("channel", QUADRANT[q]);
  };

  return (
    <div className="wheel" ref={wheel}>
      <div
        className="wheel__ring"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (drag.current = null)}
      >
        <div className="wheel__groove" ref={groove}>
          <i />
        </div>
        {Object.entries(POSITIONS).map(([ch, pos]) => {
          const Icon = CHANNEL_ICONS[ch];
          return (
            <button
              key={ch}
              type="button"
              className={`wheel__icon wheel__icon--${pos} ${on && channel === ch ? "is-active" : ""}`}
              aria-label={LABELS[ch]}
              aria-current={on && channel === ch ? "page" : undefined}
              // Pointer taps are handled by the ring; this handles keyboard activation.
              onClick={(e) => e.detail === 0 && dispatch("channel", ch)}
            >
              <Icon />
            </button>
          );
        })}
      </div>
      <motion.button
        type="button"
        className="wheel__center"
        aria-label="Select"
        whileTap={{ scale: 0.92 }}
        transition={{ type: "spring", stiffness: 600, damping: 22 }}
        onClick={() => {
          tick(1200);
          dispatch("enter");
        }}
      />
    </div>
  );
}
