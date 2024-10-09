import React from 'react';

interface GameOverProps {
  score: number;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, onRestart }) => {
  return (
    <div className="game-over text-center">
      <h2 className="text-2xl mb-4">Game Over!</h2>
      <p className="text-xl mb-4">Your score: {score}</p>
      <button
        onClick={onRestart}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
      >
        Play Again
      </button>
    </div>
  );
};

export default GameOver;
