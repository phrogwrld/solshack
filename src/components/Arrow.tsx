import React, { useEffect, useState } from 'react';

export const rotation: Record<ArrowDirection, number> = {
  w: 90, // Up
  a: 0, // Left
  s: 270, // Down
  d: 180, // Right
};

export type ArrowDirection = 'w' | 'a' | 's' | 'd';
export type ArrowStatus = 'neutral' | 'correct' | 'incorrect';

interface ArrowProps {
  direction: ArrowDirection;
  status?: ArrowStatus;
  isCurrent: boolean;
}

const Arrow: React.FC<ArrowProps> = ({
  direction,
  status = 'neutral',
  isCurrent,
}) => {
  const statusColors = {
    neutral: 'bg-gray-200',
    correct: 'bg-green-500',
    incorrect: 'bg-red-500',
  };

  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (status === 'incorrect') {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 1000);
    }
  }, [status]);

  return (
    <div
      className={`relative w-12 h-12 transition-all ease-linear duration-50 ${isShaking ? 'animate-shake' : ''} ${isCurrent ? '-translate-y-2' : ''}`}
    >
      <div
        className={`absolute inset-0 rounded-full ${statusColors[status]}`}
      ></div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute inset-0 text-black/80"
        style={{ transform: `rotate(${rotation[direction]}deg)` }}
      >
        <path d="M19 15V9" />
        <path d="M15 15h-3v4l-7-7 7-7v4h3v6z" />
      </svg>
    </div>
  );
};

export default Arrow;
