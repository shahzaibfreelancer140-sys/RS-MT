import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{
    id: string;
    seasonNumber: string;
  }>;
};

async function getSeason(showId: string, seasonNumber: string) {
  const token = process.env.TMDB_ACCESS_TOKEN;

  if (!token) {
    throw new Error("TMDB_ACCESS_TOKEN is missing");
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${showId}/season/${seasonNumber}?language=en-US`,
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

export default async function SeasonPage({ params }: Props) {
  const { id, seasonNumber } = await params;

  const [show, season] = await Promise.all([
    getTVShow(id),
    getSeason(id, seasonNumber),
  ]);

  if (!show || !season) {
    notFound();
  }

  // TV Show poster
  const showPoster = show.poster_path
    ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
    : "";

  // Season image:
  // 1. Season ki original image
  // 2. Agar season image nahi hai to TV Show poster
  const seasonImage = season.poster_path
    ? `https://image.tmdb.org/t/p/w500${season.poster_path}`
    : showPoster;

  return (
    <main className="min-h-screen bg-black text-white px-4 sm:px-6 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto">

        {/* Back Button */}
        <Link
          href={`/tvshows/tmdb/${id}`}
          className="inline-block mb-8 bg-zinc-800 hover:bg-zinc-700 px-5 py-3 rounded-lg transition"
        >
          ← Back to {show.name}
        </Link>

        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row gap-8 mb-12">

          {/* Season Image / TV Show Poster Fallback */}
          <div className="shrink-0">

            {seasonImage ? (
              <img
                src={seasonImage}
                alt={season.name || `Season ${seasonNumber}`}
                className="w-full md:w-60 max-w-[260px] rounded-2xl object-cover"
              />
            ) : (
              <div className="w-full md:w-60 max-w-[260px] aspect-[2/3] bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500">
                No Image
              </div>
            )}

          </div>

          {/* Season Details */}
          <div className="flex flex-col justify-center">

            <h1 className="text-4xl md:text-5xl font-bold">
              {show.name}
            </h1>

            <h2 className="text-2xl text-zinc-400 mt-3">
              {season.name || `Season ${seasonNumber}`}
            </h2>

            <p className="text-zinc-400 mt-3">
              🎬 {season.episodes?.length || 0} Episodes
            </p>

            {season.air_date && (
              <p className="text-zinc-500 mt-2">
                📅 {season.air_date}
              </p>
            )}

            {season.overview && (
              <p className="text-zinc-300 leading-8 mt-6 max-w-3xl">
                {season.overview}
              </p>
            )}

          </div>

        </div>

        {/* ================= EPISODES ================= */}

        <h2 className="text-3xl font-bold mb-6">
          Episodes
        </h2>

        {!season.episodes || season.episodes.length === 0 ? (

          <div className="bg-zinc-900 rounded-xl p-6 text-zinc-400">
            No Episodes Found
          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {season.episodes.map((episode: any) => {

              /*
                Episode image priority:

                1. Original episode still_path
                2. Season image
                3. TV Show poster
                4. No Image
              */

              const episodeImage = episode.still_path
                ? `https://image.tmdb.org/t/p/w500${episode.still_path}`
                : seasonImage;

              return (

                <Link
                  key={episode.id}
                  href={`/watch/tv/${id}/${seasonNumber}/${episode.episode_number}`}
                  className="bg-zinc-900 rounded-xl overflow-hidden block hover:bg-zinc-800 transition group"
                >

                  {/* Episode Image */}

                  {episodeImage ? (

                    <img
                      src={episodeImage}
                      alt={episode.name || `Episode ${episode.episode_number}`}
                      className="w-full aspect-video object-cover group-hover:scale-105 transition duration-300"
                    />

                  ) : (

                    <div className="aspect-video bg-zinc-800 flex items-center justify-center text-zinc-500">
                      No Image
                    </div>

                  )}

                  {/* Episode Details */}

                  <div className="p-4">

                    <p className="text-sm text-zinc-500">
                      Episode {episode.episode_number}
                    </p>

                    <h3 className="font-bold text-lg mt-1 line-clamp-2">
                      {episode.name}
                    </h3>

                    {episode.air_date && (
                      <p className="text-sm text-zinc-500 mt-2">
                        📅 {episode.air_date}
                      </p>
                    )}

                    {episode.runtime && (
                      <p className="text-sm text-zinc-500 mt-1">
                        ⏱️ {episode.runtime} min
                      </p>
                    )}

                    {episode.vote_average > 0 && (
                      <p className="text-sm text-yellow-400 mt-1">
                        ⭐ {episode.vote_average.toFixed(1)}
                      </p>
                    )}

                    {episode.overview && (
                      <p className="text-sm text-zinc-400 mt-3 line-clamp-3">
                        {episode.overview}
                      </p>
                    )}

                  </div>

                </Link>

              );
            })}

          </div>

        )}

      </div>
    </main>
  );
}