import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { gsap, useGSAP } from "../lib/gsap.js";
import Wheel from "./Wheel.jsx";

const BASE_W = 332;
const BASE_H = 600;

function useFitScale() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => {
      const s = Math.min((window.innerHeight - 56) / BASE_H, (window.innerWidth - 32) / BASE_W, 1.25);
      setScale(Math.max(0.55, s));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  return scale;
}

export default function Device({ power, channel, dispatch, onShutdownDone, children }) {
  const root = useRef(null);
  const body = useRef(null);
  const content = useRef(null);
  const line = useRef(null);
  const scale = useFitScale();
  const on = power === "boot" || power === "on";

  // Entrance and pointer tilt — skipped for reduced motion, tilt only with a mouse.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", hover: "(hover: hover) and (pointer: fine)" },
        ({ conditions }) => {
          if (!conditions.motion) return;
          gsap.set(body.current, { transformPerspective: 1400 });
          gsap.from(body.current, { y: 70, rotationX: 18, opacity: 0, duration: 1.4, ease: "expo.out", delay: 0.1 });
          if (!conditions.hover) return;
          const rx = gsap.quickTo(body.current, "rotationX", { duration: 0.9, ease: "power3" });
          const ry = gsap.quickTo(body.current, "rotationY", { duration: 0.9, ease: "power3" });
          const move = (e) => {
            ry((e.clientX / window.innerWidth - 0.5) * 9);
            rx(-(e.clientY / window.innerHeight - 0.5) * 7);
          };
          window.addEventListener("pointermove", move);
          return () => window.removeEventListener("pointermove", move);
        }
      );
      return () => mm.revert();
    },
    { scope: root }
  );

  // CRT power on / off.
  useGSAP(
    () => {
      if (power === "boot") {
        gsap
          .timeline()
          .fromTo(line.current, { opacity: 1, scaleX: 0, scaleY: 1 }, { scaleX: 1, duration: 0.18, ease: "power3.out" })
          .fromTo(
            content.current,
            { scaleY: 0.01, opacity: 1, filter: "brightness(3)" },
            { scaleY: 1, filter: "brightness(1)", duration: 0.45, ease: "expo.out" }
          )
          .to(line.current, { opacity: 0, scaleY: 30, duration: 0.3 }, "<");
      } else if (power === "shutdown") {
        gsap
          .timeline({ onComplete: onShutdownDone })
          .set(line.current, { opacity: 0, scaleX: 1, scaleY: 1 })
          .to(content.current, { scaleY: 0.01, filter: "brightness(4)", duration: 0.2, ease: "power4.in" })
          .to(line.current, { opacity: 1, duration: 0.05 }, ">-0.05")
          .set(content.current, { opacity: 0 })
          .to(line.current, { scaleX: 0, duration: 0.22, ease: "power3.in" })
          .to(line.current, { opacity: 0, duration: 0.12 });
      } else if (power === "off") {
        gsap.fromTo(content.current, { opacity: 0, scaleY: 1 }, { opacity: 1, duration: 0.5, clearProps: "all" });
      }
    },
    { dependencies: [power], scope: root }
  );

  return (
    <div className="device-wrap" ref={root} style={{ "--s": scale }}>
      <div className="device" ref={body}>
        <div className="device__top">
          <div className="brand">
            <span className="brand__word">
              roya<i>.</i>
            </span>
            <span className="brand__ver">v1.0.0</span>
          </div>
          <div className="grille" aria-hidden>
            {Array.from({ length: 7 }, (_, i) => (
              <i key={i} />
            ))}
          </div>
          <motion.span
            className="led"
            aria-hidden
            animate={
              power === "boot"
                ? { opacity: [1, 0.3, 1], transition: { repeat: Infinity, duration: 0.5 } }
                : { opacity: 1 }
            }
            data-on={on}
          />
        </div>

        <div className="bezel">
          <div className="screen">
            <div className="screen__content" ref={content}>
              {children}
            </div>
            <div className="crt-line" ref={line} aria-hidden />
            <div className="screen__glass" aria-hidden />
          </div>
        </div>

        <div className="controls">
          <div className="side-ctl">
            <motion.button
              type="button"
              className="power"
              aria-label={on ? "Power off" : "Power on"}
              aria-pressed={on}
              onClick={() => dispatch("power")}
              whileTap={{ scale: 0.94 }}
            >
              <motion.span
                className="power__knob"
                animate={{ y: on ? 0 : 20 }}
                transition={{ type: "spring", stiffness: 520, damping: 26 }}
              />
            </motion.button>
            <span className="side-ctl__label">power</span>
          </div>

          <Wheel dispatch={dispatch} channel={channel} on={power === "on"} />

          <div className="side-ctl">
            <motion.button
              type="button"
              className="back"
              aria-label="Back"
              onClick={() => dispatch("back")}
              whileTap={{ y: 3, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 700, damping: 20 }}
            />
            <span className="side-ctl__label">back</span>
          </div>
        </div>
      </div>
    </div>
  );
}
