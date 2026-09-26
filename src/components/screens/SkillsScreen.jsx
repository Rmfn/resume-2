import { useRef } from "react";
import { gsap, useGSAP, reducedMotion } from "../../lib/gsap.js";
import { useControls, scrollBy } from "../../lib/controls.js";
import { skills } from "../../data.js";
import { ScreenHeader, Prompt } from "./parts.jsx";

const CMD = "ls ~/skills";
const count = skills.reduce((n, g) => n + g.items.length, 0);

export default function SkillsScreen() {
  const root = useRef(null);
  const body = useRef(null);

  useControls(
    {
      up: () => scrollBy(body.current, gsap, -1),
      down: () => scrollBy(body.current, gsap, 1),
    },
    [
      ["↑ ↓", "scroll"],
      ["esc", "back"],
      ["alt ← ↑ → ↓", "channel"],
    ]
  );

  // Terminal-style reveal: type the command, then print each group.
  useGSAP(
    () => {
      if (reducedMotion()) return;
      gsap
        .timeline({ delay: 0.15 })
        .fromTo(".cmd__text", { width: 0 }, { width: `${CMD.length}ch`, duration: CMD.length * 0.045, ease: `steps(${CMD.length})` })
        .from(".group", { opacity: 0, duration: 0.01, stagger: 0.28 }, "+=0.15")
        .from(".group__name", { opacity: 0, x: -4, duration: 0.2, stagger: 0.28 }, "<")
        .from(".group .skill", { opacity: 0, y: 6, scale: 0.9, duration: 0.3, stagger: 0.07, ease: "back.out(2)" }, "<0.1");
    },
    { scope: root }
  );

  return (
    <div className="scr" ref={root}>
      <ScreenHeader path="/skills" meta={`${count} items`} />
      <div className="scr__body" ref={body}>
        <p className="cmd">
          <span className="accent">$</span> <span className="cmd__text">{CMD}</span>
        </p>
        {skills.map((g) => (
          <section className="group" key={g.group}>
            <h3 className="group__name">
              {g.group}/ <span className="dim">{g.items.length}</span>
            </h3>
            <ul className="skills">
              {g.items.map((s) => (
                <li key={s} className="skill">
                  {s}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <Prompt>always learning</Prompt>
    </div>
  );
}
