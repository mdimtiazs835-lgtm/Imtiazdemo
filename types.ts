
export enum PlayerColor {
  RED = 'red',
  BLUE = 'blue',
  YELLOW = 'yellow',
  GREEN = 'green'
}

export interface Token {
  id: number;
  playerColor: PlayerColor;
  position: number;
  isSafe: boolean;
}

export interface Player {
  id: string;
  name: string;
  color: PlayerColor;
  tokens: Token[];
  isBot: boolean;
  luckFactor: number;
  level: number;
  avatar: string;
}

export interface GameState {
  id: string;
  players: Player[];
  currentPlayerIndex: number;
  diceValue: number | null;
  isRolling: boolean;
  gameStatus: 'WAITING' | 'PLAYING' | 'FINISHED';
  winners: string[];
  history: string[];
  consecutiveSixes: number;
  turnTimeLeft: number;
  khuaMode: boolean;
  khuaTurnsLeft: number;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar: string;
  level: number;
  rank: string;
  country: string;
  countryCode: string;
  status: 'Online' | 'Offline';
  balance: number;
  bonusBalance: number;
  winBalance: number;
  gullaBalance: number;
  fairPlayScore: number;
  banStatus: boolean;
  stats: {
    played: number;
    wins: number;
    losses: number;
    winRate: number;
    tournamentWins: number;
    bestStreak: number;
  };
}

export interface Tournament {
  id: string;
  title: string;
  entryFee: string;
  prizePool: string;
  participants: number;
  maxParticipants: number;
  status: 'UPCOMING' | 'RUNNING' | 'JOINED' | 'FINISHED' | 'WAITING_FOR_PLAYERS';
  type: 'Pro' | 'Blitz' | 'Grand' | 'Classic';
  startTime: number;
  isFull: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'Deposit' | 'Withdraw' | 'Win' | 'Bonus' | 'Gulla';
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
  desc: string;
}
