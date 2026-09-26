import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ControlsCtx, toggleMute } from "./lib/controls.js";
import Device from "./components/Device.jsx";
import SidePanels from "./components/SidePanels.jsx";
import OffScreen from "./components/screens/OffScreen.jsx";
import BootScreen from "./components/screens/BootScreen.jsx";
import WorkScreen from "./components/screens/WorkScreen.jsx";
import AboutScreen from "./components/screens/AboutScreen.jsx";
import SkillsScreen from "./components/screens/SkillsScreen.jsx";
import ContactScreen from "./components/screens/ContactScreen.jsx";

// Wheel layout: top / right / bottom / left
export const CHANNELS = ["work", "about", "contact", "skills"];
const ARROW_CHANNEL = { ArrowUp: "work", ArrowRight: "about", ArrowDown: "contact", ArrowLeft: "skills" };

const SCREENS = {
  work: WorkScreen,
  about: AboutScreen,
  skills: SkillsScreen,
  contact: ContactScreen,
};

export default function App() {
  // off → boot → on → shutdown → off
  const [power, setPower] = useState("off");
  const [channel, setChannel] = useState("work");
  const [hints, setHints] = useState([]);
  const handlers = useRef({});
  const powerRef = useRef(power);
  powerRef.current = power;

  const ctx = useMemo(() => ({ handlers, setHints }), []);

  const dispatch = useCallback((action, arg) => {
    const p = powerRef.current;
    if (action === "power") {
      if (p === "off") setPower("boot");
      else if (p === "on" || p === "boot") setPower("shutdown");
      return;
    }
    if (p === "off") {
      if (action === "enter") setPower("boot");
      return;
    }
    if (p === "boot") {
      if (action === "enter") handlers.current.skip?.();
      return;
    }
    if (p !== "on") return;
    if (action === "channel") return setChannel(arg);
    if (action === "back") {
      if (!handlers.current.back?.()) setChannel("work");
      return;
    }
    handlers.current[action]?.(arg);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey) return;
      const k = e.key;
      if (e.altKey && ARROW_CHANNEL[k]) {
        e.preventDefault();
        return dispatch("channel", ARROW_CHANNEL[k]);
      }
      const map = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
        Enter: "enter",
        Escape: "back",
        Backspace: "back",
      };
      if (k === "p" || k === "P") return dispatch("power");
      if (k === "m" || k === "M") return toggleMute();
      if (/^[1-9]$/.test(k)) return dispatch("digit", Number(k));
      if (map[k]) {
        e.preventDefault();
        dispatch(map[k]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dispatch]);

  const onShutdownDone = useCallback(() => {
    setPower("off");
    setChannel("work");
  }, []);

  let screenKey, screen;
  if (power === "off") {
    screenKey = "off";
    screen = <OffScreen />;
  } else if (power === "boot") {
    screenKey = "boot";
    screen = <BootScreen onDone={() => setPower("on")} />;
  } else {
    const Screen = SCREENS[channel];
    screenKey = channel;
    screen = <Screen dispatch={dispatch} />;
  }

  return (
    <ControlsCtx.Provider value={ctx}>
      <main className="stage">
        <SidePanels hints={hints} power={power} channel={channel} />
        <Device power={power} channel={channel} dispatch={dispatch} onShutdownDone={onShutdownDone}>
          <AnimatePresence mode="wait" initial={false}>
            <ScreenSlot key={screenKey}>{screen}</ScreenSlot>
          </AnimatePresence>
        </Device>
      </main>
    </ControlsCtx.Provider>
  );
}

function ScreenSlot({ children }) {
  return (
    <motion.div
      className="slot"
      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
