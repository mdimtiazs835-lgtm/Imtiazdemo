
import React, { useState, useEffect, useRef } from 'react';
import Board from '../components/Board';
import Dice from '../components/Dice';
import { GameState, PlayerColor, Tournament } from '../types';
import { createInitialState, rollDice, processMove, canMoveToken, getBestBotMove } from '../services/gameEngine';
import { Trophy, MessageSquare, Volume2, VolumeX, Clock, ChevronLeft, Zap, Loader2, Play, Users, Share2 } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { audioService } from '../services/audioService';
import { tournamentService } from '../services/tournamentService';
import { authService } from '../services/authService';

const GameView: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode') || 'tournament';
  const tourId = searchParams.get('id');
  const roomCode = searchParams.get('room');
  const isHost = searchParams.get('host') === 'true';
  const user = authService.getUser();
  const currentUsername = user?.username || "Player";

  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isMatching, setIsMatching] = useState(true);
  const [matchingProgress, setMatchingProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(!audioService.isEnabled());
  const [currentTournament, setCurrentTournament] = useState<Tournament | null>(null);
  
  // Lobby states for Friend Mode
  const [friendJoined, setFriendJoined] = useState(false);
  const [lobbyStarted, setLobbyStarted] = useState(false);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (mode === 'friends') {
      // Simulate a friend joining after 5 seconds if we're the host
      if (isHost) {
        setTimeout(() => setFriendJoined(true), 5000);
      } else {
        // If we joined, friend is already there (the host)
        setFriendJoined(true);
      }
      return;
    }

    if (mode === 'tournament' && tourId) {
      const tour = tournamentService.getTournaments().find(t => t.id === tourId);
      if (tour) {
        setCurrentTournament(tour);
        if (tour.participants < tour.maxParticipants) {
          setIsMatching(true);
          return;
        }
      }
    }
    
    const interval = setInterval(() => {
      setMatchingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsMatching(false), 800);
          return 100;
        }
        return prev + Math.random() * 25;
      });
    }, 400);
    return () => clearInterval(interval);
  }, [mode, tourId, isHost]);

  useEffect(() => {
    if (mode === 'tournament' && isMatching && tourId) {
      const interval = setInterval(() => {
        const tour = tournamentService.getTournaments().find(t => t.id === tourId);
        if (tour) {
          setCurrentTournament(tour);
          if (tour.participants >= tour.maxParticipants) {
             setIsMatching(false);
             clearInterval(interval);
          }
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isMatching, mode, tourId]);

  // Start the actual game when lobby is ready
  useEffect(() => {
    if ((!isMatching && mode !== 'friends') || (mode === 'friends' && lobbyStarted)) {
      const players = [
        { id: 'p-0', name: currentUsername, color: PlayerColor.GREEN, isBot: false, luckFactor: 0.6, avatar: user?.avatar },
        { id: 'p-1', name: mode === 'friends' ? 'Opponent' : 'Pro_Bot', color: PlayerColor.RED, isBot: mode !== 'friends', luckFactor: 0.5 },
      ];
      setGameState(createInitialState(players));
    }
  }, [isMatching, lobbyStarted, mode, currentUsername, user?.avatar]);

  useEffect(() => {
    if (gameState && gameState.gameStatus === 'PLAYING') {
      timerRef.current = window.setInterval(() => {
        setGameState(prev => {
          if (!prev) return null;
          if (prev.turnTimeLeft <= 1) {
            return {
              ...prev,
              currentPlayerIndex: (prev.currentPlayerIndex + 1) % prev.players.length,
              turnTimeLeft: 15,
              diceValue: null
            };
          }
          return { ...prev, turnTimeLeft: prev.turnTimeLeft - 1 };
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameState?.currentPlayerIndex, gameState?.gameStatus]);

  // Bot Turn Handling Logic
  useEffect(() => {
    if (gameState && !isMatching) {
      const currentPlayer = gameState.players[gameState.currentPlayerIndex];
      if (currentPlayer.isBot && !gameState.isRolling) {
        if (gameState.diceValue === null) {
          setTimeout(() => handleRoll(), 1000);
        } else {
          setTimeout(() => {
            const bestMoveId = getBestBotMove(gameState);
            if (bestMoveId !== null) {
              handleTokenClick(bestMoveId);
            }
          }, 1500);
        }
      }
    }
  }, [gameState?.currentPlayerIndex, gameState?.diceValue, gameState?.isRolling]);

  const handleRoll = () => {
    if (!gameState || gameState.isRolling || gameState.diceValue !== null) return;
    audioService.play('DICE_ROLL');
    setGameState(prev => prev ? { ...prev, isRolling: true } : null);
    
    setTimeout(() => {
      setGameState(prev => {
        if (!prev) return null;
        const currentPlayer = prev.players[prev.currentPlayerIndex];
        const val = rollDice(currentPlayer.luckFactor);
        const canMoveAny = currentPlayer.tokens.some(t => canMoveToken(t, val));
        
        if (!canMoveAny && val !== 6) {
           setTimeout(() => {
             setGameState(s => s ? {
               ...s,
               diceValue: null,
               isRolling: false,
               currentPlayerIndex: (s.currentPlayerIndex + 1) % s.players.length,
               turnTimeLeft: 15
             } : null);
           }, 1200);
        }
        return { ...prev, diceValue: val, isRolling: false };
      });
    }, 800);
  };

  const handleTokenClick = (tokenId: number) => {
    if (!gameState || gameState.diceValue === null) return;
    const nextState = processMove(gameState, tokenId);
    const killedSomething = nextState.history[0]?.includes("KILL!");
    
    if (killedSomething) audioService.play('TOKEN_KILL');
    else audioService.play(nextState.currentPlayerIndex === gameState.currentPlayerIndex ? 'EXTRA_TURN' : 'TOKEN_MOVE');
    
    setGameState(nextState);
  };

  // Friend Lobby UI
  if (mode === 'friends' && !lobbyStarted) {
    return (
      <div className="h-screen bg-[#140101] flex flex-col items-center justify-center p-6 text-white text-center">
        <div className="w-full max-w-sm space-y-12 animate-in fade-in duration-500">
           <div className="space-y-4">
              <div className="w-24 h-24 bg-blue-600 rounded-[40px] flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/20 rotate-12">
                <Users size={48} />
              </div>
              <h2 className="text-3xl font-black uppercase italic tracking-tighter">Lobby Code: {roomCode}</h2>
              <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Waiting for challenger...</p>
           </div>

           <div className="grid grid-cols-2 gap-6 relative">
              <div className="space-y-4">
                 <div className="w-20 h-20 rounded-3xl border-2 border-blue-500 p-1 mx-auto bg-slate-900">
                    <img className="w-full h-full rounded-2xl object-cover" src={user?.avatar} />
                 </div>
                 <span className="block text-[10px] font-black uppercase tracking-widest">{currentUsername}</span>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                 <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center font-black italic text-xs text-blue-500">VS</div>
              </div>
              <div className="space-y-4">
                 <div className={`w-20 h-20 rounded-3xl border-2 ${friendJoined ? 'border-green-500' : 'border-slate-800 border-dashed'} p-1 mx-auto bg-slate-900 flex items-center justify-center`}>
                    {friendJoined ? <img className="w-full h-full rounded-2xl object-cover" src="https://api.dicebear.com/7.x/avataaars/svg?seed=Friend" /> : <Loader2 size={24} className="animate-spin text-slate-700" />}
                 </div>
                 <span className={`block text-[10px] font-black uppercase tracking-widest ${friendJoined ? 'text-green-500' : 'text-slate-700'}`}>{friendJoined ? 'Challenger' : 'Waiting...'}</span>
              </div>
           </div>

           <div className="space-y-4 pt-8">
             {isHost ? (
               <button 
                onClick={() => setLobbyStarted(true)}
                disabled={!friendJoined}
                className={`w-full py-5 rounded-[28px] font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all ${friendJoined ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20 active:scale-95' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
               >
                 <Play size={18} fill="currentColor" /> Start Battle
               </button>
             ) : (
               <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 text-slate-400 font-bold text-xs">
                 Waiting for the host to start the match...
               </div>
             )}
             <button onClick={() => navigate('/')} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-white transition-colors">Leave Room</button>
           </div>
        </div>
      </div>
    );
  }

  // Standard Matching UI
  if (isMatching && mode !== 'friends') return (
    <div className="h-screen bg-[#140101] flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
      <div className="w-full max-w-xs space-y-10 text-center relative z-10">
        <Trophy size={80} className="text-yellow-500 mx-auto animate-bounce" />
        <h2 className="text-3xl font-black uppercase italic tracking-tighter">{mode === 'computer' ? 'Training Mode' : 'Matchmaking'}</h2>
        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${matchingProgress}%` }}></div>
        </div>
        <button onClick={() => navigate('/')} className="px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Cancel</button>
      </div>
    </div>
  );

  if (!gameState) return null;

  const currentPlayerObj = gameState.players[gameState.currentPlayerIndex];
  const opponent = gameState.players.find(p => p.id !== 'p-0') || gameState.players[1];

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto bg-[#140101] relative overflow-hidden select-none touch-none">
      
      {/* Banner removed as requested: Khua Mode Active ay lekha jno na ashe */}

      <header className="p-4 flex justify-between items-center z-20 bg-[#140101]/80 backdrop-blur-md border-b border-white/5">
        <button onClick={() => navigate('/')} className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-90 transition-all">
          <ChevronLeft size={24} />
        </button>
        <div className="bg-gradient-to-b from-yellow-400 to-orange-500 px-6 py-1.5 rounded-full text-orange-950 font-black flex items-center gap-2 shadow-xl border border-yellow-300">
          <Clock size={16} /> 0:{gameState.turnTimeLeft.toString().padStart(2, '0')}
        </div>
        <button onClick={() => { setIsMuted(!isMuted); audioService.toggle(isMuted); }} className="w-11 h-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
          {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-between px-2 pt-6 pb-12">
        <div className={`flex flex-col items-center gap-2 transition-all duration-300 ${gameState.currentPlayerIndex !== 0 ? 'scale-110' : 'opacity-40 grayscale scale-95'}`}>
           <div className={`w-16 h-16 rounded-3xl border-2 p-1 ${gameState.currentPlayerIndex !== 0 ? 'border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.5)]' : 'border-slate-800'}`}>
              <img className="w-full h-full rounded-2xl object-cover" src={opponent.avatar} alt="Opponent" />
           </div>
           <span className="text-[11px] font-black text-white uppercase tracking-wider">{opponent.name}</span>
        </div>

        <div className="w-full max-w-[380px] px-2 relative">
          <Board tokens={gameState.players.flatMap(p => p.tokens)} onTokenClick={handleTokenClick} activePlayerColor={currentPlayerObj.color} canMove={gameState.diceValue !== null && !currentPlayerObj.isBot} diceValue={gameState.diceValue} />
          <div className="absolute -bottom-10 left-0 right-0 h-8 overflow-hidden pointer-events-none">
             <div className="text-center text-[10px] text-yellow-500/80 font-black uppercase italic tracking-widest">
               {gameState.history[0]}
             </div>
          </div>
        </div>

        <div className="w-full flex items-end justify-between px-4">
          <div className="flex flex-col items-start gap-6">
             <div className={`bg-gradient-to-br from-yellow-300 to-yellow-500 p-2.5 rounded-[32px] shadow-2xl border-2 border-yellow-200 relative transition-transform duration-300 ${gameState.currentPlayerIndex === 0 ? 'scale-110' : 'scale-90 opacity-60'}`}>
                <div className="w-20 h-20">
                  <Dice value={gameState.diceValue} onRoll={handleRoll} isRolling={gameState.isRolling} disabled={gameState.diceValue !== null || currentPlayerObj.isBot} color="bg-white" />
                </div>
                {gameState.diceValue === null && !currentPlayerObj.isBot && !gameState.isRolling && (
                   <div className="absolute -top-4 -right-4 bg-red-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full animate-bounce shadow-xl">ROLL</div>
                )}
             </div>
             <button className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-[10px] font-black text-white uppercase flex items-center gap-2 hover:bg-white/10">
               <MessageSquare size={16} fill="currentColor" /> Shout
             </button>
          </div>
          
          <div className={`flex flex-col items-end gap-2 transition-all duration-300 ${gameState.currentPlayerIndex === 0 ? 'scale-110' : 'opacity-40 grayscale scale-95'}`}>
            <div className={`w-16 h-16 rounded-3xl border-2 p-1 ${gameState.currentPlayerIndex === 0 ? 'border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.5)]' : 'border-slate-800'}`}>
              <img className="w-full h-full rounded-2xl object-cover" src={gameState.players[0].avatar} alt="You" />
            </div>
            <span className="text-[11px] font-black text-white uppercase tracking-wider">YOU</span>
          </div>
        </div>
      </div>

      {gameState.winners.length > 0 && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6 text-center text-white animate-in zoom-in duration-500 backdrop-blur-xl">
           <div className="space-y-10 w-full max-w-sm">
             <Trophy size={140} className="text-yellow-400 mx-auto drop-shadow-[0_0_40px_rgba(234,179,8,0.6)] animate-bounce" />
             <div className="space-y-3">
               <h2 className="text-6xl font-black italic uppercase tracking-tighter leading-none">{gameState.winners[0] === 'p-0' ? 'LEGEND!' : 'DEFEAT'}</h2>
               <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">{gameState.winners[0] === 'p-0' ? 'Transferring prize pool...' : 'Better luck next time'}</p>
             </div>
             <button onClick={() => navigate('/')} className="w-full bg-yellow-500 text-orange-950 px-12 py-5 rounded-[28px] font-black uppercase tracking-widest shadow-xl hover:bg-yellow-400 active:scale-95 transition-all">Lobby</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default GameView;
