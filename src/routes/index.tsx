import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect } from 'react';
import StartButton from '@/components/StartButton';
import GameBoard from '@/components/GameBoard';
import GameOver from '@/components/GameOver';
import { useGameLogic } from '@/hooks/useGameLogic';
import { API_URL, GameState } from '../utils/game';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const {
    gameState,
    currentRound,
    userInput,
    roundNumber,
    timeLeft,
    score,
    startGame,
    handleKeyPress,
  } = useGameLogic();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newscore: { name: string, score: number }) => {
      const response = await fetch(`${API_URL}/leaderboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newscore),
      });
      if (!response.ok) throw new Error(response.statusText);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leaderboard']});
    },
  })

  const handleGameOver = async () => {
    const playerName = prompt("Enter your name for the leaderboard:") || "Anonymous";
    try {
      await mutation.mutateAsync({ name: playerName, score });
      alert("Score submitted successfully!");
    } catch (error) {
      console.error("Failed to submit score:", error);
      alert("Failed to submit score. Please try again.");
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {gameState === GameState.NotStarted && (
        <div className="flex flex-col space-y-4">
          <StartButton onStart={startGame} />
          <Link
            to="/leaderboard"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            View Leaderboard
          </Link>
        </div>
      )}
      {gameState === GameState.Playing && (
        <GameBoard
          roundNumber={roundNumber}
          score={score}
          timeLeft={timeLeft}
          currentRound={currentRound}
          userInput={userInput}
        />
      )}
      {gameState === GameState.GameOver && (
        <div className="flex-col flex space-y-4">
          <GameOver score={score} onRestart={startGame} />
          <button
            onClick={handleGameOver}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            disabled={mutation.isPending}
            >{mutation.isPending ? 'Submitting...' : 'Submit Score'}</button>
          <Link
            to="/leaderboard"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            View Leaderboard
          </Link>
        </div>
      )}
    </div>
  );
}

export default Index;