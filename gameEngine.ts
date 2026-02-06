
import { GameState, PlayerColor, Token, Player } from '../types';

const circuitPath = [
  [6,0],[6,1],[6,2],[6,3],[6,4],[6,5], [5,6],[4,6],[3,6],[2,6],[1,6],[0,6],
  [0,7],[0,8], [1,8],[2,8],[3,8],[4,8],[5,8],[6,9], [6,10],[6,11],[6,12],[6,13],[6,14],
  [7,14],[8,14], [8,13],[8,12],[8,11],[8,10],[8,9],[9,8], [10,8],[11,8],[12,8],[13,8],[14,8],
  [14,7],[14,6], [13,6],[12,6],[11,6],[10,6],[9,6],[8,5], [8,4],[8,3],[8,2],[8,1],[8,0], [7,0]
];

const SAFE_INDICES = [0, 8, 13, 21, 26, 34, 39, 47];

export const getGridCoords = (color: PlayerColor, pos: number, tokenId: number): { r: number, c: number } => {
  if (pos === -1) {
    const bases = {
      [PlayerColor.GREEN]: { r: 1, c: 1 },
      [PlayerColor.RED]: { r: 1, c: 10 },
      [PlayerColor.YELLOW]: { r: 10, c: 1 },
      [PlayerColor.BLUE]: { r: 10, c: 10 }
    };
    const b = bases[color];
    return { r: b.r + Math.floor(tokenId / 2) + 1, c: b.c + (tokenId % 2) + 1 };
  }
  const colorOffsets = { [PlayerColor.GREEN]: 1, [PlayerColor.RED]: 14, [PlayerColor.BLUE]: 27, [PlayerColor.YELLOW]: 40 };
  if (pos < 51) {
    const idx = (pos + colorOffsets[color]) % 52;
    const cell = circuitPath[idx];
    return { r: cell[0], c: cell[1] };
  }
  const homeSteps = pos - 51;
  const homePaths = {
    [PlayerColor.GREEN]: [7,1, 7,2, 7,3, 7,4, 7,5, 7,6],
    [PlayerColor.RED]: [1,7, 2,7, 3,7, 4,7, 5,7, 6,7],
    [PlayerColor.BLUE]: [7,13, 7,12, 7,11, 7,10, 7,9, 7,8],
    [PlayerColor.YELLOW]: [13,7, 12,7, 11,7, 10,7, 9,7, 8,7]
  };
  const path = homePaths[color];
  const rIdx = Math.min(homeSteps, 5) * 2;
  return { r: path[rIdx], c: path[rIdx+1] };
};

export const createInitialState = (playerData: Partial<Player>[]): GameState => {
  const players: Player[] = playerData.map((p, idx) => ({
    id: p.id || `p-${idx}`,
    name: p.name || 'Unknown',
    color: p.color || PlayerColor.GREEN,
    isBot: p.isBot || false,
    luckFactor: p.luckFactor ?? 0.5,
    level: p.level || 1,
    avatar: p.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`,
    tokens: [0, 1, 2, 3].map(tid => ({
      id: tid,
      playerColor: p.color || PlayerColor.GREEN,
      position: -1,
      isSafe: false
    }))
  }));

  return {
    id: Math.random().toString(36).substr(2, 9),
    players,
    currentPlayerIndex: 0,
    diceValue: null,
    isRolling: false,
    gameStatus: 'PLAYING',
    winners: [],
    history: ['Match Started'],
    consecutiveSixes: 0,
    turnTimeLeft: 15,
    khuaMode: true, // Internal mode for capturing tokens
    khuaTurnsLeft: 999
  };
};

export const rollDice = (luckFactor: number = 0.5): number => {
  const rand = Math.random();
  if (luckFactor > 0.8 && rand < 0.25) return 6;
  if (luckFactor < 0.2 && rand < 0.4) return 1;
  return Math.floor(Math.random() * 6) + 1;
};

export const canMoveToken = (token: Token, diceValue: number): boolean => {
  if (token.position === 57) return false;
  if (token.position === -1) return diceValue === 6;
  return token.position + diceValue <= 57;
};

export const getBestBotMove = (state: GameState): number | null => {
  const player = state.players[state.currentPlayerIndex];
  const dice = state.diceValue;
  if (dice === null) return null;

  const movableTokens = player.tokens.filter(t => canMoveToken(t, dice));
  if (movableTokens.length === 0) return null;

  let bestTokenId = movableTokens[0].id;
  let maxScore = -1000;

  movableTokens.forEach(token => {
    let score = 0;
    const futurePos = token.position === -1 ? 0 : token.position + dice;
    if (token.position === -1 && dice === 6) score += 500;
    if (futurePos === 57) score += 1000;
    if (futurePos > 51) score += 100;

    if (state.khuaMode && futurePos < 51 && !SAFE_INDICES.includes(futurePos)) {
      const myCoords = getGridCoords(token.playerColor, futurePos, token.id);
      const targets = state.players.filter(p => p.id !== player.id).some(p => 
        p.tokens.some(t => {
           if (t.position < 0 || t.position >= 51) return false;
           const opCoords = getGridCoords(t.playerColor, t.position, t.id);
           return opCoords.r === myCoords.r && opCoords.c === myCoords.c;
        })
      );
      if (targets) score += 800;
    }
    if (SAFE_INDICES.includes(futurePos)) score += 300;
    score += token.position;

    if (score > maxScore) {
      maxScore = score;
      bestTokenId = token.id;
    }
  });

  return bestTokenId;
};

export const processMove = (state: GameState, tokenId: number): GameState => {
  if (state.diceValue === null) return state;
  const newState = JSON.parse(JSON.stringify(state)) as GameState;
  const player = newState.players[newState.currentPlayerIndex];
  const token = player.tokens.find(t => t.id === tokenId);

  if (!token || !canMoveToken(token, state.diceValue)) return state;

  if (token.position === -1 && state.diceValue === 6) {
    token.position = 0;
  } else {
    token.position += state.diceValue;
  }

  const killOccurred = checkCollisions(newState, player.id, token);

  const allFinished = player.tokens.every(t => t.position === 57);
  if (allFinished && !newState.winners.includes(player.id)) {
    newState.winners.push(player.id);
  }

  const extraTurn = state.diceValue === 6 || killOccurred;

  if (!extraTurn) {
    newState.currentPlayerIndex = (newState.currentPlayerIndex + 1) % newState.players.length;
    newState.consecutiveSixes = 0;
  } else {
    if (state.diceValue === 6) {
      newState.consecutiveSixes++;
      if (newState.consecutiveSixes >= 3) {
        newState.currentPlayerIndex = (newState.currentPlayerIndex + 1) % newState.players.length;
        newState.consecutiveSixes = 0;
      }
    } else {
      newState.consecutiveSixes = 0;
    }
  }
  
  newState.diceValue = null;
  newState.turnTimeLeft = 15;
  return newState;
};

const checkCollisions = (state: GameState, movingPlayerId: string, movedToken: Token): boolean => {
  if (!state.khuaMode) return false;
  if (movedToken.position < 0 || movedToken.position >= 51) return false;
  if (SAFE_INDICES.includes(movedToken.position)) return false;

  const myCoords = getGridCoords(movedToken.playerColor, movedToken.position, movedToken.id);
  let killCount = 0;

  state.players.forEach(p => {
    if (p.id === movingPlayerId) return;

    const opponentTokensOnCell = p.tokens.filter(t => {
      if (t.position < 0 || t.position >= 51) return false;
      const otherCoords = getGridCoords(t.playerColor, t.position, t.id);
      return myCoords.r === otherCoords.r && myCoords.c === otherCoords.c;
    });

    if (opponentTokensOnCell.length === 1) {
      opponentTokensOnCell[0].position = -1;
      killCount++;
      state.history.unshift(`CAPTURED! ${state.players.find(p => p.id === movingPlayerId)?.name} sent ${p.name} home!`);
    }
  });

  return killCount > 0;
};
