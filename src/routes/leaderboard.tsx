import { API_URL } from '@/utils/game';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/leaderboard')({
  component: Leaderboard,
})

interface LeaderboardEntry {
  id: number;
  name: string;
  score: number;
}

function Leaderboard() {

    const { data: leaderboard, isLoading, isError } = useQuery({
        queryKey: ['leaderboard'],
        queryFn: async (): Promise<LeaderboardEntry[]> => {
            const response = await fetch(`${API_URL}/leaderboard`);
            return response.json();
        },
    });

    if (isLoading) return (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">Loading...</h1>
        </div>
    )
    if (isError) return <div>Error: {isError}</div>


    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">Leaderboard</h1>
          <ul className="space-y-2">
            {leaderboard?.map((entry, index) => (
              <li key={entry.id} className="text-lg">
                {index + 1}. {entry.name}: {entry.score}
              </li>
            ))}
          </ul>
          <Link
            to="/"
            className="mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Game
          </Link>
        </div>
      );
    }
