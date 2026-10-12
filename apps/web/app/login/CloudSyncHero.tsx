/**
 * Hero (Figma 17-174, "Lottie: cloud-sync"): habit cards float up into the cloud,
 * the cloud check pops — 2.4s loop. Layers are the Figma assets, motion is CSS keyframes
 * (no runtime dependency); respects prefers-reduced-motion.
 */
export function CloudSyncHero() {
  return (
    <div className="hero" aria-hidden>
      <div className="hero__stage">
        <img className="hero__glow" src="/hero/glow.svg" width={150} height={150} alt="" />
        <img className="hero__cloud" src="/hero/cloud.svg" width={132} height={88} alt="" />
        <span className="hero__cloud-check"><img src="/hero/cloud-check.svg" width={18} height={18} alt="" /></span>
        <img className="hero__dot hero__dot--1" src="/hero/dot1.svg" width={6} height={6} alt="" />
        <img className="hero__dot hero__dot--2" src="/hero/dot2.svg" width={5} height={5} alt="" />
        <img className="hero__dot hero__dot--3" src="/hero/dot3.svg" width={4} height={4} alt="" />
        <HeroCard emoji="💧" className="hero__card--water" />
        <HeroCard emoji="📖" className="hero__card--book" />
        <HeroCard emoji="🏃" className="hero__card--run" />
      </div>
    </div>
  );
}
function HeroCard({ emoji, className }: { emoji: string; className: string }) {
  return (
    <span className={`hero__card ${className}`}>
      <span className="hero__card-emoji">{emoji}</span><span className="hero__card-line" />
      <span className="hero__card-check"><img src="/hero/check.svg" width={16} height={16} alt="" /></span>
    </span>
  );
}
