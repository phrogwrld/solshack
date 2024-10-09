import { useState, useCallback, useEffect } from "react";
import {
  GameState,
  type ArrowDirection,
  calculateRoundParameters,
  keys,
  arrowMapping,
} from "../utils/game";
import { playPopSound } from "@/components/Sound";

interface GameLogic {
  gameState: GameState;
  currentRound: ArrowDirection[];
  userInput: ArrowDirection[];
  roundNumber: number;
  timeLeft: number;
  score: number;
  startGame: () => void;
  handleKeyPress: (event: KeyboardEvent) => void;
}

const calculateScore = (count: number, timeLeft: number): number => {
  const baseScore = count * 10;
  const timeBonus = Math.floor(timeLeft * 5);
  return baseScore + timeBonus;
};

export const useGameLogic = (): GameLogic => {
  const [gameState, setGameState] = useState<GameState>(GameState.NotStarted);
  const [currentRound, setCurrentRound] = useState<ArrowDirection[]>([]);
  const [userInput, setUserInput] = useState<ArrowDirection[]>([]);
  const [roundNumber, setRoundNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [incorrectIndex, setIncorrectIndex] = useState<number | null>(null);

  const generateRound = useCallback(() => {
    const { count, duration } = calculateRoundParameters(roundNumber);
    const newRound = Array.from(
      { length: count },
      () => keys[Math.floor(Math.random() * keys.length)]
    );
    setCurrentRound(newRound);
    setTimeLeft(duration);
    setUserInput([]);
    setIncorrectIndex(null);
  }, [roundNumber]);

  useEffect(() => {
    if (gameState === GameState.Playing) {
      generateRound();
    }
  }, [gameState, generateRound]);

  useEffect(() => {
    if (timeLeft > 0 && gameState === GameState.Playing) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === GameState.Playing) {
      setGameState(GameState.GameOver);
    }
  }, [timeLeft, gameState]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (gameState !== GameState.Playing || incorrectIndex !== null) return;

      const key = arrowMapping[event.key as keyof typeof arrowMapping];
      if (key) {
        playPopSound();
        const newInput = [...userInput, key];
        const currentIndex = newInput.length - 1;

        if (newInput[currentIndex] !== currentRound[currentIndex]) {
          // Incorrect input
          setIncorrectIndex(currentIndex);
          setUserInput(newInput);

          setScore(
            (prevScore) => prevScore + calculateScore(newInput.length, timeLeft)
          );

          // Delay game over to allow for animation
          setTimeout(() => setGameState(GameState.GameOver), 1000);
          return;
        }

        setUserInput(newInput);

        if (newInput.length === currentRound.length) {
          setScore(
            (prevScore) => prevScore + calculateScore(newInput.length, timeLeft)
          );
          setRoundNumber((prevRound) => prevRound + 1);
          generateRound();
        }
      }
    },
    [currentRound, gameState, generateRound, userInput]
  );

  const startGame = useCallback(() => {
    setGameState(GameState.Playing);
    setRoundNumber(1);
    setScore(0);
    generateRound();
  }, [generateRound]);

  return {
    gameState,
    currentRound,
    userInput,
    roundNumber,
    timeLeft,
    score,
    startGame,
    handleKeyPress,
  };
};
