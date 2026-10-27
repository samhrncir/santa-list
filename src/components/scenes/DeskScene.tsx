import { Candle, CocoaMug, EnvelopeStack, Holly, InkwellQuill, Spectacles } from "./DeskProps";

export default function DeskScene() {
  return (
    <div className="scene-desk">
      <div className="desk-wood" />
      <div className="desk-vignette" />
      <div className="desk-glow" />
      <div className="prop prop-ink"><InkwellQuill /></div>
      <div className="prop prop-holly"><Holly /></div>
      <div className="prop prop-candle"><Candle /></div>
      <div className="prop prop-mug"><CocoaMug /></div>
      <div className="prop prop-envelopes"><EnvelopeStack /></div>
      <div className="prop prop-specs"><Spectacles /></div>
    </div>
  );
}
