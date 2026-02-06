
import React from 'react';
import { PlayerColor, Token } from '../types';
import { COLORS } from '../constants';
import { Star, ChevronRight, ChevronDown, ChevronLeft, ChevronUp, Trophy } from 'lucide-react';
import { getGridCoords } from '../services/gameEngine';

interface BoardProps {
  tokens: Token[];
  onTokenClick: (tokenId: number) => void;
  activePlayerColor: PlayerColor;
  canMove: boolean;
  diceValue: number | null;
}

const Board: React.FC<BoardProps> = ({ tokens, onTokenClick, activePlayerColor, canMove, diceValue }) => {
  const renderBaseArea = (color: PlayerColor) => (
    <div className={`w-full h-full ${COLORS[color].bg} p-1.5 sm:p-2 flex items-center justify-center relative border-[2px] sm:border-[3px] border-white/30 shadow-inner rounded-sm`}>
      <div className="bg-white/95 w-[90%] h-[90%] rounded-sm grid grid-cols-2 grid-rows-2 p-1.5 sm:p-4 gap-1.5 sm:gap-4 shadow-sm">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`rounded-full border-[1px] sm:border-[1.5px] border-slate-200 shadow-inner flex items-center justify-center ${COLORS[color].light} aspect-square`}>
             <div className={`w-1/2 h-1/2 rounded-full ${COLORS[color].bg} opacity-10`}></div>
          </div>
        ))}
      </div>
    </div>
  );

  // Group tokens by their grid coordinates to handle stacking
  const tokenGroups: Record<string, Token[]> = {};
  tokens.forEach(t => {
    const coords = getGridCoords(t.playerColor, t.position, t.id);
    const key = `${coords.r}-${coords.c}`;
    if (!tokenGroups[key]) tokenGroups[key] = [];
    tokenGroups[key].push(t);
  });

  return (
    <div className="relative w-full aspect-square bg-[#fcfcfc] shadow-2xl rounded-xl border-[4px] sm:border-[10px] border-[#2c0000] overflow-hidden select-none touch-none transform transition-transform duration-500">
      <div className="ludo-grid w-full h-full">
        {/* Top Section */}
        <div className="col-span-6 row-span-6">{renderBaseArea(PlayerColor.GREEN)}</div>
        <div className="col-span-3 row-span-6 grid grid-cols-3 grid-rows-6">
           {Array.from({length: 18}).map((_, i) => (
             <div key={i} className={`path-cell border-[0.5px] border-slate-100 flex items-center justify-center ${i % 3 === 1 && i > 0 ? COLORS[PlayerColor.RED].bg + ' opacity-30' : ''}`}>
               {i === 1 && <ChevronDown size={12} className="text-red-600 font-black opacity-30" />}
               {i === 4 && <Star size={14} className="safe-star opacity-60" />}
             </div>
           ))}
        </div>
        <div className="col-span-6 row-span-6">{renderBaseArea(PlayerColor.RED)}</div>

        {/* Middle Section */}
        <div className="col-span-6 row-span-3 grid grid-cols-6 grid-rows-3">
          {Array.from({length: 18}).map((_, i) => (
             <div key={i} className={`path-cell border-[0.5px] border-slate-100 flex items-center justify-center ${Math.floor(i / 6) === 1 && i % 6 > 0 ? COLORS[PlayerColor.GREEN].bg + ' opacity-30' : ''}`}>
               {i === 6 && <ChevronRight size={12} className="text-green-600 font-black opacity-30" />}
               {i === 8 && <Star size={14} className="safe-star opacity-60" />}
             </div>
           ))}
        </div>
        <div className="col-span-3 row-span-3 bg-white relative overflow-hidden shadow-2xl border border-slate-200">
          <div style={{ clipPath: 'polygon(0 0, 50% 50%, 0 100%)' }} className={`absolute inset-0 ${COLORS[PlayerColor.GREEN].bg} opacity-90`}></div>
          <div style={{ clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)' }} className={`absolute inset-0 ${COLORS[PlayerColor.BLUE].bg} opacity-90`}></div>
          <div style={{ clipPath: 'polygon(0 0, 100% 0, 50% 50%)' }} className={`absolute inset-0 ${COLORS[PlayerColor.RED].bg} opacity-90`}></div>
          <div style={{ clipPath: 'polygon(0 100%, 100% 100%, 50% 50%)' }} className={`absolute inset-0 ${COLORS[PlayerColor.YELLOW].bg} opacity-90`}></div>
          <div className="absolute inset-[15%] bg-white/40 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center border border-white/40">
             <Trophy size={20} className="text-white drop-shadow-lg animate-pulse" />
          </div>
        </div>
        <div className="col-span-6 row-span-3 grid grid-cols-6 grid-rows-3">
          {Array.from({length: 18}).map((_, i) => (
             <div key={i} className={`path-cell border-[0.5px] border-slate-100 flex items-center justify-center ${Math.floor(i / 6) === 1 && i % 6 < 5 ? COLORS[PlayerColor.BLUE].bg + ' opacity-30' : ''}`}>
               {i === 11 && <ChevronLeft size={12} className="text-blue-500 font-black opacity-30" />}
               {i === 9 && <Star size={14} className="safe-star opacity-60" />}
             </div>
           ))}
        </div>

        {/* Bottom Section */}
        <div className="col-span-6 row-span-6">{renderBaseArea(PlayerColor.YELLOW)}</div>
        <div className="col-span-3 row-span-6 grid grid-cols-3 grid-rows-6">
          {Array.from({length: 18}).map((_, i) => (
             <div key={i} className={`path-cell border-[0.5px] border-slate-100 flex items-center justify-center ${i % 3 === 1 && i < 17 ? COLORS[PlayerColor.YELLOW].bg + ' opacity-30' : ''}`}>
               {i === 16 && <ChevronUp size={12} className="text-yellow-600 font-black opacity-30" />}
               {i === 13 && <Star size={14} className="safe-star opacity-60" />}
             </div>
           ))}
        </div>
        <div className="col-span-6 row-span-6">{renderBaseArea(PlayerColor.BLUE)}</div>
      </div>

      {/* Render grouped tokens with stacking logic */}
      {Object.entries(tokenGroups).map(([key, group]) => {
        const [r, c] = key.split('-').map(Number);
        const leftBase = (c * 100) / 15;
        const topBase = (r * 100) / 15;

        return group.map((token, idx) => {
          const isClickable = canMove && token.playerColor === activePlayerColor && 
            (token.position === -1 ? diceValue === 6 : (token.position + (diceValue || 0) <= 57));

          // Mobile Optimization: Tokens are slightly larger than cells to improve touch visibility
          // Stacking logic: arrange tokens in a grid for clear individual selection on mobile
          let left = leftBase;
          let top = topBase;
          
          if (group.length > 1) {
            const spacing = 1.1; // Offset within cell
            const row = Math.floor(idx / 2);
            const col = idx % 2;
            left += col * spacing;
            top += row * spacing;
          }

          return (
            <div
              key={`${token.playerColor}-${token.id}`}
              onClick={() => isClickable && onTokenClick(token.id)}
              className={`absolute w-[6.66%] h-[6.66%] transition-all duration-300 transform z-50
                ${isClickable ? 'cursor-pointer' : 'pointer-events-none'}
              `}
              style={{ 
                left: `${left}%`, 
                top: `${top}%`, 
                zIndex: isClickable ? 200 + idx : 100 + idx 
              }}
            >
               {/* 
                 Touch Target Optimization: 
                 We add an invisible 'tap area' that is larger than the visual token 
               */}
               <div className="absolute inset-[-4px] sm:inset-[-8px] pointer-events-auto" />
               
               <div className={`w-full h-full rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.5)] border-[1.5px] sm:border-[2.5px] border-white flex items-center justify-center
                  ${COLORS[token.playerColor].bg}
                  ${isClickable ? 'ring-[4px] ring-yellow-400 ring-offset-0 scale-140 animate-bounce' : 'scale-105'}
                  transition-all
               `}>
                  <div className="w-[45%] h-[45%] rounded-full bg-white/30 border border-black/10 shadow-inner"></div>
               </div>

               {/* Indicator for multiple tokens on same cell */}
               {idx === 0 && group.length > 1 && !isClickable && (
                  <div className="absolute -top-1 -right-1 bg-white text-slate-800 text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-slate-200 shadow-sm z-[60]">
                    {group.length}
                  </div>
               )}
            </div>
          );
        });
      })}
    </div>
  );
};

export default Board;
