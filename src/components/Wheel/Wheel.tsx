import { useRef, useImperativeHandle, forwardRef } from 'react';
import { WHEEL_SECTORS, SECTOR_COUNT, SECTOR_ANGLE } from '../../config/outcomes';
import { spinWheel } from '../../animation/wheelSpin';
import './Wheel.css';

export interface WheelRef {
  spin: (sectorId: number, attemptIndex: number, onComplete: () => void) => void;
}

interface WheelProps {
  disabled?: boolean;
  onCenterClick?: () => void;
}

const WHEEL_SIZE = 380;
const CENTER = WHEEL_SIZE / 2;
const OUTER_RADIUS = 175;
const INNER_RADIUS = 48;
const TEXT_RADIUS_MAIN = 125;
const TEXT_RADIUS_SUB = 105;
const SPARKLE_COUNT = 40;
const SPARKLE_RADIUS = OUTER_RADIUS + 12;

const Wheel = forwardRef<WheelRef, WheelProps>(({ disabled, onCenterClick }, ref) => {
  const wheelGroupRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    spin: (sectorId: number, attemptIndex: number, onComplete: () => void) => {
      if (!wheelGroupRef.current) return;
      spinWheel(wheelGroupRef.current, sectorId, attemptIndex, onComplete);
    },
  }));

  const sectors = WHEEL_SECTORS.map((sector, i) => {
    const startAngleDeg = i * SECTOR_ANGLE - 90;
    const endAngleDeg = (i + 1) * SECTOR_ANGLE - 90;
    const startAngle = startAngleDeg * (Math.PI / 180);
    const endAngle = endAngleDeg * (Math.PI / 180);

    // Outer arc points
    const ox1 = CENTER + OUTER_RADIUS * Math.cos(startAngle);
    const oy1 = CENTER + OUTER_RADIUS * Math.sin(startAngle);
    const ox2 = CENTER + OUTER_RADIUS * Math.cos(endAngle);
    const oy2 = CENTER + OUTER_RADIUS * Math.sin(endAngle);

    // Inner arc points
    const ix1 = CENTER + INNER_RADIUS * Math.cos(startAngle);
    const iy1 = CENTER + INNER_RADIUS * Math.sin(startAngle);
    const ix2 = CENTER + INNER_RADIUS * Math.cos(endAngle);
    const iy2 = CENTER + INNER_RADIUS * Math.sin(endAngle);

    const path = [
      `M ${ix1} ${iy1}`,
      `L ${ox1} ${oy1}`,
      `A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 0 1 ${ox2} ${oy2}`,
      `L ${ix2} ${iy2}`,
      `A ${INNER_RADIUS} ${INNER_RADIUS} 0 0 0 ${ix1} ${iy1}`,
      'Z',
    ].join(' ');

    // Text position — rotated radially
    const midAngle = ((i + 0.5) * SECTOR_ANGLE - 90) * (Math.PI / 180);
    const textRotation = (i + 0.5) * SECTOR_ANGLE;

    const fillColor = sector.color === 'black' ? '#0a0a0a' : '#f5f5f5';
    const textColor = sector.color === 'black' ? '#ffffff' : '#0a0a0a';

    // For JACKPOT, use different color
    const isJackpot = sector.label === 'JACKPOT';
    const mainColor = isJackpot
      ? (sector.color === 'black' ? '#4caf50' : '#e53935')
      : textColor;

    const hasSubLabel = !!sector.subLabel;
    const mainFontSize = isJackpot ? 16 : (sector.label.length <= 3 ? 28 : (sector.label.length <= 4 ? 22 : 16));

    // Main label position
    const mainTx = CENTER + (hasSubLabel ? TEXT_RADIUS_MAIN : TEXT_RADIUS_MAIN - 10) * Math.cos(midAngle);
    const mainTy = CENTER + (hasSubLabel ? TEXT_RADIUS_MAIN : TEXT_RADIUS_MAIN - 10) * Math.sin(midAngle);

    // Sub label position
    const subTx = CENTER + TEXT_RADIUS_SUB * Math.cos(midAngle);
    const subTy = CENTER + TEXT_RADIUS_SUB * Math.sin(midAngle);

    return (
      <g key={sector.id}>
        <path d={path} fill={fillColor} />
        {/* Main label */}
        <text
          x={mainTx}
          y={mainTy}
          fill={mainColor}
          fontSize={mainFontSize}
          fontWeight="900"
          fontFamily="'Inter', 'Arial Black', sans-serif"
          textAnchor="middle"
          dominantBaseline="central"
          transform={`rotate(${textRotation}, ${mainTx}, ${mainTy})`}
          style={{ letterSpacing: isJackpot ? '2px' : '0.5px' }}
        >
          {sector.label}
        </text>
        {/* Sub label */}
        {hasSubLabel && (
          <text
            x={subTx}
            y={subTy}
            fill={textColor}
            fontSize={sector.subLabel === 'НА ДЕПОЗИТ' ? 8 : 12}
            fontWeight="700"
            fontFamily="'Inter', 'Arial', sans-serif"
            textAnchor="middle"
            dominantBaseline="central"
            transform={`rotate(${textRotation}, ${subTx}, ${subTy})`}
            style={{ letterSpacing: '0.5px' }}
          >
            {sector.subLabel}
          </text>
        )}
      </g>
    );
  });

  // Separator lines
  const separators = Array.from({ length: SECTOR_COUNT }, (_, i) => {
    const angle = (i * SECTOR_ANGLE - 90) * (Math.PI / 180);
    const x1 = CENTER + INNER_RADIUS * Math.cos(angle);
    const y1 = CENTER + INNER_RADIUS * Math.sin(angle);
    const x2 = CENTER + OUTER_RADIUS * Math.cos(angle);
    const y2 = CENTER + OUTER_RADIUS * Math.sin(angle);
    return (
      <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#333" strokeWidth="1.5" />
    );
  });

  // Sparkle dots around rim (like reference's glitter dots)
  const sparkles = Array.from({ length: SPARKLE_COUNT }, (_, i) => {
    const angle = (i * (360 / SPARKLE_COUNT) - 90) * (Math.PI / 180);
    const sx = CENTER + SPARKLE_RADIUS * Math.cos(angle);
    const sy = CENTER + SPARKLE_RADIUS * Math.sin(angle);
    const size = i % 3 === 0 ? 2.5 : 1.5;
    return (
      <circle
        key={i}
        cx={sx}
        cy={sy}
        r={size}
        className={`sparkle sparkle-${i % 3}`}
      />
    );
  });

  return (
    <div className="wheel-container">
      {/* Pointer at top */}
      <div className="wheel-pointer">
        <svg viewBox="0 0 30 36" width="30" height="36">
          <polygon points="15,36 0,0 30,0" fill="#4caf50" />
          <polygon points="15,36 3,3 27,3" fill="#66bb6a" />
        </svg>
      </div>

      {/* Rotating wheel group */}
      <div className="wheel-rotator" ref={wheelGroupRef}>
        <svg
          viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}
          width={WHEEL_SIZE}
          height={WHEEL_SIZE}
          className="wheel-svg"
        >
          {/* Outer dark rim */}
          <circle cx={CENTER} cy={CENTER} r={OUTER_RADIUS + 8} fill="#1a1a1a" />
          <circle cx={CENTER} cy={CENTER} r={OUTER_RADIUS + 6} fill="#111" stroke="#333" strokeWidth="1" />

          {/* Sectors */}
          {sectors}
          {separators}

          {/* Inner hub circle */}
          <circle cx={CENTER} cy={CENTER} r={INNER_RADIUS} fill="#111" stroke="#333" strokeWidth="2" />

          {/* Sparkle dots on rim */}
          {sparkles}
        </svg>
      </div>

      {/* Center green button (doesn't rotate) */}
      <button
        className={`wheel-center-btn ${disabled ? 'disabled' : ''}`}
        onClick={onCenterClick}
        disabled={disabled}
      >
        <span className="wheel-center-btn-text">КРУТИТЬ</span>
      </button>
    </div>
  );
});

Wheel.displayName = 'Wheel';
export default Wheel;
