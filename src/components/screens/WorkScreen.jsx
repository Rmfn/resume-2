import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { gsap } from "../../lib/gsap.js";
import { useControls, scrollBy } from "../../lib/controls.js";
import { projects, certs } from "../../data.js";
import { ArrowOut } from "../Icons.jsx";
import { ScreenHeader, Prompt, Tabs, List, Scramble, pad, stagger, rise } from "./parts.jsx";

const TABS = ["projects", "certificates"];
const LISTS = [projects, certs];

export default function WorkScreen() {
  const [tab, setTab] = useState(0);
  const [cursor, setCursor] = useState(0);
  const [open, setOpen] = useState(null); // index into current list
  const [dir, setDir] = useState(1);
  const detailBody = useRef(null);

  const list = LISTS[tab];
  const item = open != null ? list[open] : null;
  const total = projects.length + certs.length;

  const switchTab = (t) => {
    if (t === tab) return;
    setDir(t > tab ? 1 : -1);
    setTab(t);
    setCursor(0);
  };
  const openLink = () => item?.link && window.open(item.link.href, "_blank", "noopener");
  const step = (d) => {
    setDir(d);
    setOpen((o) => (o + d + list.length) % list.length);
  };

  useControls(
    item
      ? {
          up: () => scrollBy(detailBody.current, gsap, -1),
          down: () => scrollBy(detailBody.current, gsap, 1),
          left: () => step(-1),
          right: () => step(1),
          enter: openLink,
          back: () => (setOpen(null), true),
        }
      : {
          up: () => setCursor((c) => (c - 1 + list.length) % list.length),
          down: () => setCursor((c) => (c + 1) % list.length),
          left: () => switchTab(0),
          right: () => switchTab(1),
          enter: () => setOpen(cursor),
          digit: (n) => n <= list.length && (setCursor(n - 1), setOpen(n - 1)),
        },
    item
      ? [
          ["↑ ↓", "scroll"],
          ["← →", "prev / next"],
          ...(item.link ? [["↵", "open pdf"]] : []),
          ["esc", "back"],
          ["alt ← ↑ → ↓", "channel"],
        ]
      : [
          ["↑ ↓", "select"],
          ["← →", "tabs"],
          ["↵", "open"],
          [`1–${list.length}`, "jump"],
          ["alt ← ↑ → ↓", "channel"],
        ]
  );

  return (
    <div className="scr">
      <ScreenHeader path={item ? `/work/${item.id}` : "/work"} meta={item ? `${pad(open + 1)} / ${pad(list.length)}` : `${total} items`} />
      <AnimatePresence mode="wait" initial={false} custom={dir}>
        {item ? (
          <motion.div
            key={item.id}
            className="scr__body"
            ref={detailBody}
            custom={dir}
            initial={{ opacity: 0, x: 14 * dir }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 * dir }}
            transition={{ duration: 0.2 }}
          >
            <Detail item={item} onLink={openLink} />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            className="scr__body scr__body--fixed"
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.2 }}
          >
            <Tabs items={TABS} value={tab} onChange={switchTab} />
            <p className="hint">tap a line or spin the wheel</p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={tab}
                initial={{ opacity: 0, x: 10 * dir }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 * dir }}
                transition={{ duration: 0.16 }}
              >
                <List
                  items={list}
                  cursor={cursor}
                  setCursor={setCursor}
                  onOpen={(i) => (setCursor(i), setOpen(i))}
                  render={(it) => (
                    <>
                      <span className="row__t">{it.title}</span>
                      <span className="row__k">{it.kind}</span>
                    </>
                  )}
                />
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${tab}-${cursor}`}
                className="peek"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <p className="peek__ctx">{list[cursor].context}</p>
                <p className="peek__sum">{list[cursor].summary}</p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      <Prompt>{item ? (item.link ? "↵ open the pdf · esc back" : "esc to go back") : `type 1–${list.length}`}</Prompt>
    </div>
  );
}

function Detail({ item, onLink }) {
  return (
    <motion.article variants={stagger} initial="hidden" animate="show" className="detail">
      <motion.h2 variants={rise} className="detail__title">
        <Scramble text={item.title} chars="abcdefghijklmnop" duration={0.6} />
      </motion.h2>
      <motion.p variants={rise} className="detail__ctx">
        {item.kind} · {item.context}
      </motion.p>
      <motion.p variants={rise} className="detail__sum">
        {item.summary}
      </motion.p>
      <motion.ul variants={rise} className="chips">
        {item.stack.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </motion.ul>
      <motion.ul variants={rise} className="points">
        {item.points.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </motion.ul>
      {item.link && (
        <motion.a
          variants={rise}
          className="cta"
          href={item.link.href}
          target="_blank"
          rel="noopener"
          onClick={(e) => (e.preventDefault(), onLink())}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.97 }}
        >
          {item.link.label} <ArrowOut />
        </motion.a>
      )}
    </motion.article>
  );
}
