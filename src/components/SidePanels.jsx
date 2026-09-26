import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { gsap, useGSAP } from "../lib/gsap.js";
import { profile, projects, certs } from "../data.js";

function useClock(tz) {
  const fmt = () =>
    new Intl.DateTimeFormat("en-GB", {
      timeZone: tz,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date());
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return t;
}

const LOG = [
  ...projects.map((p) => [p.title.toLowerCase(), p.kind]),
  ...certs.map((c) => [c.title.toLowerCase(), c.context.split(",")[0].toLowerCase()]),
];

export default function SidePanels({ hints, power, channel }) {
  const root = useRef(null);
  const time = useClock(profile.timezone);
  const status = { off: "standby", boot: "booting", on: `on · /${channel}`, shutdown: "powering down" }[power];

  useGSAP(
    () => {
      gsap.from(".panel", { opacity: 0, y: 10, duration: 0.8, stagger: 0.12, delay: 0.7, ease: "power3.out" });
    },
    { scope: root }
  );

  return (
    <div className="panels" ref={root}>
      <section className="panel panel--tl">
        <h4>local time · jeddah</h4>
        <p className="panel__big">{time}</p>
        <p className="panel__row">
          <span className={`dot ${power === "on" ? "dot--on" : ""}`} /> {status}
        </p>
      </section>

      <section className="panel panel--r" aria-label="Keyboard shortcuts">
        <h4>keyboard</h4>
        <ul className="keys">
          <AnimatePresence mode="popLayout" initial={false}>
            {hints.map(([k, label], i) => (
              <motion.li
                key={k + label}
                layout
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0, transition: { delay: i * 0.03 } }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
              >
                <kbd>{k}</kbd>
                <span>{label}</span>
              </motion.li>
            ))}
          </AnimatePresence>
          {power !== "off" && (
            <li className="keys__static">
              <kbd>M</kbd>
              <span>sound</span>
            </li>
          )}
        </ul>
      </section>

      <section className="panel panel--bl">
        <h4>log</h4>
        <ul className="log">
          <li>
            <span className="log__when">2022 →</span> b.sc. software engineering · university of jeddah
          </li>
          {LOG.map(([what, where]) => (
            <li key={what}>
              <span className="log__when">›</span> {what} · {where}
            </li>
          ))}
        </ul>
      </section>

      <p className="panel panel--foot">copyright {new Date().getFullYear()} © — roya bawazir</p>

      <motion.a
        className="panel panel--tab"
        href="https://github.com/Rmfn"
        target="_blank"
        rel="noopener"
        whileHover={{ x: -4 }}
      >
        <span className="tab__mark">gh.</span>
        <span className="tab__label">GitHub</span>
      </motion.a>
    </div>
  );
}
