import './FloatingProps.css';

interface FloatingPropsProps {
  variant?: 'wheel' | 'offer';
}

export default function FloatingProps({ variant = 'wheel' }: FloatingPropsProps) {
  if (variant === 'offer') {
    return (
      <div className="floating-props">
        {/* Glass dice - top left (like reference) */}
        <div className="floating-prop fp-offer-dice-tl">
          <svg viewBox="0 0 60 60" width="60" height="60">
            <rect x="5" y="5" width="50" height="50" rx="10" fill="rgba(180,180,200,0.25)" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />
            <circle cx="20" cy="20" r="4" fill="rgba(255,255,255,0.7)" />
            <circle cx="40" cy="20" r="4" fill="rgba(255,255,255,0.7)" />
            <circle cx="30" cy="30" r="4" fill="rgba(255,255,255,0.7)" />
            <circle cx="20" cy="40" r="4" fill="rgba(255,255,255,0.7)" />
            <circle cx="40" cy="40" r="4" fill="rgba(255,255,255,0.7)" />
          </svg>
        </div>

        {/* Dark chip - right (like reference) */}
        <div className="floating-prop fp-offer-chip-r">
          <svg viewBox="0 0 56 56" width="56" height="56">
            <circle cx="28" cy="28" r="26" fill="#1a1a2e" stroke="#333" strokeWidth="2" />
            <circle cx="28" cy="28" r="20" fill="none" stroke="#444" strokeWidth="1.5" strokeDasharray="6 4" />
            <circle cx="28" cy="28" r="10" fill="none" stroke="#555" strokeWidth="1" />
          </svg>
        </div>

        {/* Dark chip - bottom */}
        <div className="floating-prop fp-offer-chip-b">
          <svg viewBox="0 0 50 50" width="50" height="50">
            <circle cx="25" cy="25" r="23" fill="#111" stroke="#2a2a3a" strokeWidth="2" />
            <circle cx="25" cy="25" r="17" fill="none" stroke="#333" strokeWidth="1.5" strokeDasharray="5 3" />
            <circle cx="25" cy="25" r="8" fill="none" stroke="#444" strokeWidth="1" />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="floating-props">
      {/* Dark casino chip - bottom left (like reference) */}
      <div className="floating-prop fp-chip-bl">
        <svg viewBox="0 0 70 70" width="70" height="70">
          <circle cx="35" cy="35" r="33" fill="#111" stroke="#2a2a3a" strokeWidth="2.5" />
          <circle cx="35" cy="35" r="26" fill="none" stroke="#333" strokeWidth="1.5" strokeDasharray="6 4" />
          <circle cx="35" cy="35" r="12" fill="none" stroke="#444" strokeWidth="1.5" />
          {/* Edge notches */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => {
            const rad = (angle - 90) * Math.PI / 180;
            const x = 35 + 33 * Math.cos(rad);
            const y = 35 + 33 * Math.sin(rad);
            return <circle key={angle} cx={x} cy={y} r="3" fill="#1a1a2e" stroke="#333" strokeWidth="0.5" />;
          })}
        </svg>
      </div>

      {/* Gift box - bottom right (like reference) */}
      <div className="floating-prop fp-gift-br">
        <svg viewBox="0 0 65 65" width="65" height="65">
          {/* Box body */}
          <rect x="8" y="22" width="50" height="38" rx="4" fill="#8ecae6" stroke="#6fb5d8" strokeWidth="1" />
          {/* Box lid */}
          <rect x="5" y="16" width="56" height="12" rx="3" fill="#95d5f0" stroke="#6fb5d8" strokeWidth="1" />
          {/* Ribbon vertical */}
          <rect x="28" y="16" width="10" height="44" fill="#c9c9c9" opacity="0.4" />
          {/* Ribbon horizontal */}
          <rect x="5" y="18" width="56" height="8" fill="#c9c9c9" opacity="0.3" />
          {/* Bow */}
          <ellipse cx="28" cy="14" rx="10" ry="7" fill="#c0c0c0" stroke="#aaa" strokeWidth="0.5" />
          <ellipse cx="38" cy="14" rx="10" ry="7" fill="#d0d0d0" stroke="#aaa" strokeWidth="0.5" />
          <circle cx="33" cy="15" r="4" fill="#b0b0b0" />
        </svg>
      </div>

      {/* Small dark chip - top right */}
      <div className="floating-prop fp-chip-tr">
        <svg viewBox="0 0 40 40" width="40" height="40">
          <circle cx="20" cy="20" r="18" fill="#1a1a2e" stroke="#333" strokeWidth="1.5" />
          <circle cx="20" cy="20" r="13" fill="none" stroke="#444" strokeWidth="1" strokeDasharray="4 3" />
        </svg>
      </div>

      {/* Decorative abstract shape - top left */}
      <div className="floating-prop fp-abstract-tl">
        <svg viewBox="0 0 50 80" width="35" height="56">
          <path d="M25,0 C35,15 40,25 38,40 C36,55 20,65 15,80 C10,65 5,50 8,35 C11,20 15,10 25,0Z"
            fill="rgba(100,200,240,0.15)" stroke="rgba(100,200,240,0.2)" strokeWidth="0.5" />
          <path d="M20,10 C28,22 32,30 30,42 C28,52 18,58 15,68"
            fill="none" stroke="rgba(140,220,255,0.2)" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}
