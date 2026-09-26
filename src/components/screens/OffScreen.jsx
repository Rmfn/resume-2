import { useControls } from "../../lib/controls.js";

export default function OffScreen() {
  useControls({}, [["P", "power on"]]);
  return (
    <div className="scr scr--off">
      <p className="off__title">press power</p>
      <p className="off__sub only-kbd">
        or hit <kbd>P</kbd>
      </p>
      <p className="off__sub only-touch">or tap the centre</p>
    </div>
  );
}
