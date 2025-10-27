
import React from 'react';
import { Mode } from '../types';
import { MODE_CONFIG } from '../constants';

interface TimerProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  timeRemaining: number;
  isActive: boolean;
  onStartStop: () => void;
  totalDuration: number;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const Timer: React.FC<TimerProps> = ({ mode, setMode, timeRemaining, isActive, onStartStop, totalDuration }) => {
  const progress = (totalDuration - timeRemaining) / totalDuration;
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  
  const currentModeConfig = MODE_CONFIG[mode];

  return (
    <div className={`w-full max-w-lg mx-auto rounded-lg p-6 md:p-8 ${currentModeConfig.color} transition-colors duration-500`}>
      <div className="flex justify-center gap-2 mb-6">
        {(Object.keys(MODE_CONFIG) as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-3 py-1.5 text-sm rounded-md font-semibold transition-colors ${
              mode === m ? 'bg-black/10 text-white' : 'text-white/70 hover:bg-black/10'
            }`}
          >
            {MODE_CONFIG[m].name}
          </button>
        ))}
      </div>
      <div className="relative flex justify-center items-center my-4">
          <svg className="w-52 h-52 md:w-60 md:h-60" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="rgba(0,0,0,0.1)"
              strokeWidth="10"
            />
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="white"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 100 100)"
              style={{ transition: 'stroke-dashoffset 0.5s linear' }}
            />
          </svg>
          <span className="absolute text-5xl md:text-6xl font-bold text-white tracking-wider">
            {formatTime(timeRemaining)}
          </span>
      </div>
      <div className="flex justify-center mt-6">
        <button
          onClick={onStartStop}
          className={`w-48 h-14 text-2xl font-bold rounded-md shadow-lg transition-all transform hover:scale-105 ${
            isActive
              ? 'bg-white text-gray-800'
              : `bg-white text-gray-800`
          } text-[${MODE_CONFIG[mode].color.replace('bg-[','').replace(']','')}]`}
          style={{ boxShadow: '0 6px 0 0 rgba(0,0,0,0.2)' }}
        >
          {isActive ? 'PAUSE' : 'START'}
        </button>
      </div>
    </div>
  );
};
