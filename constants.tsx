
import { PlayerColor } from './types';

export const COLORS = {
  [PlayerColor.RED]: {
    bg: 'bg-red-500',
    text: 'text-red-500',
    light: 'bg-red-100',
    hex: '#ef4444',
    border: 'border-red-600'
  },
  [PlayerColor.BLUE]: {
    bg: 'bg-blue-500',
    text: 'text-blue-500',
    light: 'bg-blue-100',
    hex: '#3b82f6',
    border: 'border-blue-600'
  },
  [PlayerColor.YELLOW]: {
    bg: 'bg-yellow-400',
    text: 'text-yellow-400',
    light: 'bg-yellow-100',
    hex: '#fbbf24',
    border: 'border-yellow-500'
  },
  [PlayerColor.GREEN]: {
    bg: 'bg-green-500',
    text: 'text-green-500',
    light: 'bg-green-100',
    hex: '#22c55e',
    border: 'border-green-600'
  },
};

export const START_POSITIONS = {
  [PlayerColor.RED]: 1,
  [PlayerColor.BLUE]: 14,
  [PlayerColor.YELLOW]: 27,
  [PlayerColor.GREEN]: 40,
};

export const HOME_STRETCH_START = 51;
export const MAX_BOARD_STEPS = 52;

// Indices for safe spots on the board
export const SAFE_SPOTS = [1, 9, 14, 22, 27, 35, 40, 48];
