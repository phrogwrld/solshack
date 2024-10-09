import React from 'react';

interface StartButtonProps {
  onStart: () => void;
}

const StartButton: React.FC<StartButtonProps> = ({ onStart }) => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      onClick={onStart}
    >
      Start
    </button>
  );
};

export default StartButton;
