import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Register once, before any component runs useGSAP.
gsap.registerPlugin(useGSAP, ScrambleTextPlugin, ScrollToPlugin);
gsap.defaults({ ease: "power2.out", duration: 0.5 });

export const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, useGSAP };
