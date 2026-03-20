export interface WheelSector {
  id: number;
  label: string;
  subLabel?: string;
  color: 'black' | 'white';
}

// 10 sectors to accommodate 5 FS while keeping reference sectors
// Reference has 8: 100FS, 100%НД, 300FS, JACKPOT, 500FS, 50%НД, 150%НД, JACKPOT
// Adding 2x "5 FS" sectors for fixed outcomes
export const WHEEL_SECTORS: WheelSector[] = [
  { id: 0, label: '100', subLabel: 'FS', color: 'white' },
  { id: 1, label: '100%', subLabel: 'НА ДЕПОЗИТ', color: 'black' },
  { id: 2, label: '5', subLabel: 'FS', color: 'white' },
  { id: 3, label: '300', subLabel: 'FS', color: 'black' },
  { id: 4, label: 'JACKPOT', color: 'white' },
  { id: 5, label: '500', subLabel: 'FS', color: 'black' },
  { id: 6, label: '50%', subLabel: 'НА ДЕПОЗИТ', color: 'white' },
  { id: 7, label: '5', subLabel: 'FS', color: 'black' },
  { id: 8, label: '150%', subLabel: 'НА ДЕПОЗИТ', color: 'white' },
  { id: 9, label: 'JACKPOT', color: 'black' },
];

export const SECTOR_COUNT = WHEEL_SECTORS.length;
export const SECTOR_ANGLE = 360 / SECTOR_COUNT; // 36 degrees each

export type AttemptOutcome = {
  sectorId: number;
  rewardLabel: string;
  rewardType: 'freespins' | 'deposit_bonus';
};

// Fixed outcomes: spin 1 -> 5FS (sector 2), spin 2 -> 5FS (sector 7), spin 3 -> 150% (sector 8)
export const FIXED_OUTCOMES: AttemptOutcome[] = [
  { sectorId: 2, rewardLabel: '5 FS', rewardType: 'freespins' },
  { sectorId: 7, rewardLabel: '5 FS', rewardType: 'freespins' },
  { sectorId: 8, rewardLabel: '150%', rewardType: 'deposit_bonus' },
];

// Spin durations per attempt (seconds) — 3rd attempt is longest/most dramatic
export const SPIN_DURATIONS = [2.5, 2.8, 3.2];

export type GameState =
  | 'intro'
  | 'ready_attempt_1'
  | 'spin_1'
  | 'result_1'
  | 'ready_attempt_2'
  | 'spin_2'
  | 'result_2'
  | 'ready_attempt_3'
  | 'spin_3'
  | 'final_offer_reveal'
  | 'final_offer_hold';
