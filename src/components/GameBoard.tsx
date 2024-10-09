import React from 'react';
import Arrow from './Arrow';
import type { ArrowDirection } from '../utils/game';

interface GameBoardProps {
  roundNumber: number;
  score: number;
  timeLeft: number;
  currentRound: ArrowDirection[];
  userInput: ArrowDirection[];
}

const GameBoard: React.FC<GameBoardProps> = ({
  roundNumber,
  score,
  timeLeft,
  currentRound,
  userInput,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full p-6 space-y-6">
        <header className="text-center">
          <p className="text-sm">HIGH SCORE: {score}</p>
        </header>

        <div className="text-center">
          <div className="text-8xl font-bold mb-4">{timeLeft}</div>
          <p className="text-lg font-semibold">Round: {roundNumber}</p>
        </div>

        <div className="flex justify-center space-x-4">
          {currentRound.map((direction, index) => (
            <Arrow
              key={index}
              direction={direction}
              isCurrent={index === userInput.length}
              status={
                userInput[index] === undefined
                  ? 'neutral'
                  : userInput[index] === direction
                    ? 'correct'
                    : 'incorrect'
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameBoard;
