export const arrowMapping: Record<string, ArrowDirection> = {
  ArrowUp: "w",
  ArrowDown: "s",
  ArrowLeft: "a",
  ArrowRight: "d",
  w: "w",
  a: "a",
  s: "s",
  d: "d",
};

export const keys = ["w", "a", "s", "d"] as const;
export type ArrowDirection = (typeof keys)[number];

interface RoundParameters {
  count: number;
  duration: number;
}

export const API_URL = "http://solshack-worker.aaronah02.workers.dev";

export const calculateRoundParameters = (
  roundNumber: number
): RoundParameters => ({
  count: Math.min(3 + Math.floor(roundNumber / 2), 10),
  duration: Math.max(10 - Math.floor(roundNumber / 3), 3),
});

export enum GameState {
  NotStarted,
  Playing,
  GameOver,
}
