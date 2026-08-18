import { notFound } from "next/navigation";
import Link from "next/link";
import AddTMDBTVButton from "@/components/AddTMDBTVButton";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function getTVShow(id: string) {
  const token = process.env.TMDB_ACCESS_TOKEN;

  if (!token) {
    throw new Error("TMDB_ACCESS_TOKEN is missing");
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?language=en-US`,
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

export default async function TMDBTVShowDetails({ params }: Props) {
  const { id } = await params;

  const show = await getTVShow(id);

  if (!show) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">

        <Link
          href="/tvshows"
          className="inline-block mb-8 bg-zinc-800 hover:bg-zinc-700 px-5 py-3 rounded-lg"
        >
          ← TV Shows
        </Link>

        <div className="grid md:grid-cols-[300px_1fr] gap-10">

          {/* Poster */}
          <div>
            {show.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                alt={show.name}
                className="w-full rounded-2xl"
              />
            ) : (
              <div className="aspect-[2/3] bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500">
                No Poster
              </div>
            )}
          </div>

          {/* Details */}
          <div>

            <h1 className="text-4xl md:text-6xl font-bold mb-5">
              {show.name}
            </h1>

            <div className="flex flex-wrap gap-5 text-zinc-400 mb-6">

              {show.first_air_date && (
                <span>
                  📅 {show.first_air_date.substring(0, 4)}
                </span>
              )}

              <span className="text-yellow-400">
                ⭐ {show.vote_average?.toFixed(1)}
              </span>

              <span>
                📺 {show.number_of_seasons} Seasons
              </span>

              <span>
                🎬 {show.number_of_episodes} Episodes
              </span>

            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {show.genres?.map((genre: any) => (
                <span
                  key={genre.id}
                  className="bg-zinc-800 px-3 py-1 rounded-full text-sm"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="text-lg text-zinc-300 leading-8 mb-10">
              {show.overview || "No description available."}
            </p>
            <AddTMDBTVButton tmdbId={show.id} />

            {/* Seasons */}
            <h2 className="text-3xl font-bold mb-6">
              Seasons
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">

              {show.seasons
                ?.filter((season: any) => season.season_number > 0)
                .map((season: any) => (
                  <Link
                    key={season.id}
                    href={`/tvshows/tmdb/${show.id}/season/${season.season_number}`}
                    className="group bg-zinc-900 rounded-xl overflow-hidden hover:bg-zinc-800 transition"
                  >

                    {season.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${season.poster_path}`}
                        alt={season.name}
                        className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="aspect-[2/3] bg-zinc-800 flex items-center justify-center text-zinc-500">
                        No Poster
                      </div>
                    )}

                    <div className="p-4">

                      <h3 className="font-bold text-lg">
                        {season.name}
                      </h3>

                      <p className="text-sm text-zinc-400 mt-1">
                        {season.episode_count} Episodes
                      </p>

                      {season.air_date && (
                        <p className="text-xs text-zinc-500 mt-1">
                          {season.air_date.substring(0, 4)}
                        </p>
                      )}

                    </div>

                  </Link>
                ))}

            </div>

          </div>
        </div>

      </div>
    </main>
  );
}