import { useRef } from "react";
import { motion } from "motion/react";
import { gsap } from "../../lib/gsap.js";
import { useControls, scrollBy } from "../../lib/controls.js";
import { profile } from "../../data.js";
import { ScreenHeader, Prompt, Scramble, stagger, rise } from "./parts.jsx";

export default function AboutScreen() {
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

  const { education: ed } = profile;

  return (
    <div className="scr">
      <ScreenHeader path="/about" meta="bio" />
      <motion.div className="scr__body" ref={body} variants={stagger} initial="hidden" animate="show">
        <motion.h2 variants={rise} className="about__name">
          <Scramble text={profile.name} chars="abcdefghijklmnopqrstuvwxyz" duration={0.8} />
        </motion.h2>
        <motion.p variants={rise} className="about__role">
          {profile.role}
        </motion.p>
        {profile.bio.map((p) => (
          <motion.p variants={rise} key={p} className="about__bio">
            {p}
          </motion.p>
        ))}

        <motion.section variants={rise} className="block">
          <h3>education</h3>
          <p className="strong">{ed.degree}</p>
          <p className="dim">
            {ed.school} · {ed.years}
          </p>
        </motion.section>

        <motion.section variants={rise} className="block">
          <h3>courses</h3>
          <ul className="bullets">
            {profile.courses.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </motion.section>

        <motion.section variants={rise} className="block">
          <h3>interests</h3>
          <ul className="chips">
            {profile.interests.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </motion.section>

        <motion.section variants={rise} className="block">
          <h3>languages</h3>
          <ul className="kv">
            {profile.languages.map((l) => (
              <li key={l.name}>
                <span>{l.name}</span>
                <span className="kv__lead" />
                <span className="accent">{l.level}</span>
              </li>
            ))}
          </ul>
        </motion.section>
      </motion.div>
      <Prompt>spin or scroll to read</Prompt>
    </div>
  );
}
