import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useControls } from "../../lib/controls.js";
import { contact } from "../../data.js";
import { ScreenHeader, Prompt, List } from "./parts.jsx";

export default function ContactScreen() {
  const [cursor, setCursor] = useState(0);
  const [status, setStatus] = useState(null);

  const activate = async (i) => {
    const c = contact[i];
    setCursor(i);
    if (!c.href) return;
    if (c.key === "email") {
      // Copy as well as open, since many visitors have no mail client set up.
      try {
        await navigator.clipboard.writeText(c.value);
        setStatus("email copied · opening mail");
      } catch {
        setStatus("opening mail");
      }
      window.location.href = c.href;
    } else if (c.href.startsWith("http")) {
      setStatus(`opening ${c.key}`);
      window.open(c.href, "_blank", "noopener");
    } else {
      setStatus(`calling`);
      window.location.href = c.href;
    }
    setTimeout(() => setStatus(null), 2200);
  };

  useControls(
    {
      up: () => setCursor((c) => (c - 1 + contact.length) % contact.length),
      down: () => setCursor((c) => (c + 1) % contact.length),
      enter: () => activate(cursor),
      digit: (n) => n <= contact.length && activate(n - 1),
    },
    [
      ["↑ ↓", "select"],
      ["↵", "open"],
      [`1–${contact.length}`, "jump"],
      ["alt ← ↑ → ↓", "channel"],
    ]
  );

  return (
    <div className="scr">
      <ScreenHeader path="/contact" meta="say hi" />
      <div className="scr__body scr__body--fixed">
        <p className="contact__lead">
          Pick a line to get in touch.
        </p>
        <List
          items={contact}
          cursor={cursor}
          setCursor={setCursor}
          onOpen={activate}
          render={(c) => (
            <>
              <span className="row__t row__t--key">{c.key}</span>
              <span className="row__v">{c.value}</span>
            </>
          )}
        />
      </div>
      <Prompt>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={status ?? "idle"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className={status ? "accent" : undefined}
          >
            {status ?? `type 1–${contact.length}`}
          </motion.span>
        </AnimatePresence>
      </Prompt>
    </div>
  );
}
