import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{
    id: string;
    season: string;
    episode: string;
  }>;
};

async function getEpisode(
  showId: string,
  seasonNumber: string,
  episodeNumber: string
) {
  const token = process.env.TMDB_ACCESS_TOKEN;

  if (!token) {
    throw new Error("TMDB_ACCESS_TOKEN is missing");
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${showId}/season/${seasonNumber}/episode/${episodeNumber}?language=en-US`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}

async function getTVShow(showId: string) {
  const token = process.env.TMDB_ACCESS_TOKEN;

  if (!token) {
    throw new Error("TMDB_ACCESS_TOKEN is missing");
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${showId}?language=en-US`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export default async function EpisodeWatchPage({
  params,
}: Props) {
  const { id, season, episode } = await params;

  const [show, episodeData] = await Promise.all([
    getTVShow(id),
    getEpisode(id, season, episode),
  ]);

  if (!show || !episodeData) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Back */}
        <Link
          href={`/tvshows/tmdb/${id}/season/${season}`}
          className="inline-block mb-8 bg-zinc-800 hover:bg-zinc-700 px-5 py-3 rounded-lg"
        >
          ← Back to Episodes
        </Link>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold">
          {show.name}
        </h1>

        <p className="text-zinc-400 text-xl mt-3">
          Season {season} • Episode {episode}
        </p>

        {/* Video Player */}
        <div className="mt-8 bg-zinc-900 rounded-2xl overflow-hidden">

          <div className="aspect-video flex items-center justify-center">

            <div className="text-center px-6">

              <div className="text-7xl mb-5">
                ▶️
              </div>

              <h2 className="text-2xl md:text-3xl font-bold">
                Video Not Available
              </h2>

              <p className="text-zinc-400 mt-3 max-w-xl">
                Is episode ka video abhi available nahi hai.
                License aur authorized video source available
                hone ke baad yahan video play hoga.
              </p>

            </div>

          </div>

        </div>

        {/* Episode Image */}
        {episodeData.still_path && (
          <img
            src={`https://image.tmdb.org/t/p/w1280${episodeData.still_path}`}
            alt={episodeData.name}
            className="w-full rounded-2xl mt-8"
          />
        )}

        {/* Episode Information */}
        <div className="mt-8">

          <h2 className="text-3xl font-bold">
            {episodeData.name}
          </h2>

          <div className="flex flex-wrap gap-4 text-zinc-400 mt-4">

            <span>
              🎬 Episode {episodeData.episode_number}
            </span>

            {episodeData.air_date && (
              <span>
                📅 {episodeData.air_date}
              </span>
            )}

            {episodeData.runtime && (
              <span>
                ⏱️ {episodeData.runtime} min
              </span>
            )}

            <span className="text-yellow-400">
              ⭐ {episodeData.vote_average?.toFixed(1)}
            </span>

          </div>

          <p className="text-lg text-zinc-300 leading-8 mt-6">
            {episodeData.overview ||
              "No description available."}
          </p>

        </div>

      </div>
    </main>
  );
}