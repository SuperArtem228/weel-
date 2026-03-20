import gsap from 'gsap';
import { SECTOR_ANGLE, SPIN_DURATIONS } from '../config/outcomes';

/**
 * Calculate the target rotation angle to land on a specific sector.
 * Sectors are laid out clockwise from top (12 o'clock position).
 * The pointer is at top, so we need the target sector centered at top.
 */
function getTargetAngle(sectorId: number, currentRotation: number): number {
  // Each sector spans SECTOR_ANGLE degrees
  // Sector 0 starts at 0 degrees, sector 1 at SECTOR_ANGLE, etc.
  // To land pointer (top) on sector center:
  const sectorCenter = sectorId * SECTOR_ANGLE + SECTOR_ANGLE / 2;
  // We rotate clockwise, pointer is fixed at top (0 deg)
  // So target = 360 - sectorCenter (to bring that sector to top)
  const targetOffset = 360 - sectorCenter;

  // Normalize current rotation to 0-360
  const currentNorm = ((currentRotation % 360) + 360) % 360;

  // Add full rotations for visual effect (minimum 3 full spins)
  const fullSpins = 360 * 5;
  const target = fullSpins + targetOffset;

  // Ensure we always rotate forward from current position
  const delta = target - currentNorm;
  return currentRotation + delta;
}

/**
 * Rich wheel spin animation with 6 phases:
 * 1. Launch - fast start
 * 2. Cruise - stable high speed
 * 3. Irregular drag - slight tempo variation
 * 4. Long deceleration
 * 5. Near-stop tension
 * 6. Final settle with micro-overshoot
 */
export function spinWheel(
  wheelElement: HTMLElement,
  sectorId: number,
  attemptIndex: number,
  onComplete: () => void
): gsap.core.Timeline {
  const currentRotation = gsap.getProperty(wheelElement, 'rotation') as number || 0;
  const targetAngle = getTargetAngle(sectorId, currentRotation);
  const duration = SPIN_DURATIONS[attemptIndex];

  // Scale phases by duration
  const tl = gsap.timeline({ onComplete });

  // Total angle to cover
  const totalDelta = targetAngle - currentRotation;

  // Phase breakpoints (cumulative fractions of total angle)
  const phase1End = currentRotation + totalDelta * 0.08; // Launch 8%
  const phase2End = currentRotation + totalDelta * 0.45; // Cruise to 45%
  const phase3End = currentRotation + totalDelta * 0.65; // Irregular drag to 65%
  const phase4End = currentRotation + totalDelta * 0.88; // Deceleration to 88%
  const phase5End = currentRotation + totalDelta * 0.97; // Near-stop tension to 97%
  const overshoot = targetAngle + 1.5; // Micro-overshoot 1.5 degrees

  // Phase 1: Launch - fast start
  tl.to(wheelElement, {
    rotation: phase1End,
    duration: duration * 0.06,
    ease: 'power2.in',
  });

  // Phase 2: Cruise - stable high speed
  tl.to(wheelElement, {
    rotation: phase2End,
    duration: duration * 0.25,
    ease: 'none',
  });

  // Phase 3: Irregular drag - slight tempo variation
  tl.to(wheelElement, {
    rotation: phase3End,
    duration: duration * 0.18,
    ease: 'power1.out',
  });

  // Phase 4: Long deceleration
  tl.to(wheelElement, {
    rotation: phase4End,
    duration: duration * 0.22,
    ease: 'power2.out',
  });

  // Phase 5: Near-stop tension (slow crawl)
  tl.to(wheelElement, {
    rotation: overshoot,
    duration: duration * 0.2,
    ease: 'power3.out',
  });

  // Phase 6: Final settle - micro correction back
  tl.to(wheelElement, {
    rotation: targetAngle,
    duration: duration * 0.09,
    ease: 'power1.inOut',
  });

  return tl;
}
