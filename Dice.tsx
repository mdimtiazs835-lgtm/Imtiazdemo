
import React, { useState, useEffect } from 'react';

interface DiceProps {
  value: number | null;
  onRoll: () => void;
  isRolling: boolean;
  disabled: boolean;
  color: string;
}

const Dice: React.FC<DiceProps> = ({ value, onRoll, isRolling, disabled, color }) => {
  const [tempValue, setTempValue] = useState(1);

  // Realistic rolling cycle animation
  useEffect(() => {
    let interval: number;
    if (isRolling) {
      interval = window.setInterval(() => {
        setTempValue(Math.floor(Math.random() * 6) + 1);
      }, 80);
    }
    return () => clearInterval(interval);
  }, [isRolling]);

  const displayValue = isRolling ? tempValue : (value || 1);

  const dots = {
    1: [4],
    2: [0, 8],
    3: [0, 4, 8],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 2, 3, 5, 6, 8]
  };

  const currentDots = dots[displayValue as keyof typeof dots];

  return (
    <button
      onClick={onRoll}
      disabled={disabled || isRolling}
      className={`relative w-full h-full rounded-xl shadow-[0_6px_12px_rgba(0,0,0,0.3)] transition-all duration-300 transform active:scale-95 border-b-4 border-slate-300
        ${isRolling ? 'dice-shake-anim border-b-0 translate-y-1' : ''}
        ${disabled && !isRolling ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer hover:scale-105 shadow-yellow-500/20'}
        ${color} flex items-center justify-center p-2
      `}
    >
      <div className="grid grid-cols-3 grid-rows-3 gap-0.5 w-full h-full p-1">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="flex items-center justify-center">
            {currentDots.includes(i) && (
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#1e293b] shadow-inner"></div>
            )}
          </div>
        ))}
      </div>
    </button>
  );
};

export default Dice;
