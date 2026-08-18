import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function getMovie(id: string) {
  const token = process.env.TMDB_ACCESS_TOKEN;

  if (!token) {
    throw new Error("TMDB_ACCESS_TOKEN is missing");
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
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

export default async function TMDBMovieDetails({ params }: Props) {
  const { id } = await params;

  const movie = await getMovie(id);

  if (!movie) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Back */}
        <Link
          href="/"
          className="inline-block mb-8 bg-zinc-800 hover:bg-zinc-700 px-5 py-3 rounded-lg transition"
        >
          ← Back
        </Link>

        <div className="grid md:grid-cols-[300px_1fr] gap-10">

          {/* Poster */}
          <div>
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full rounded-2xl"
              />
            ) : (
              <div className="aspect-[2/3] bg-zinc-800 rounded-2xl flex items-center justify-center">
                No Poster
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">

            <h1 className="text-4xl md:text-6xl font-bold mb-5">
              {movie.title}
            </h1>

            {/* Info */}
            <div className="flex flex-wrap gap-5 text-zinc-400 mb-6">

              {movie.release_date && (
                <span>
                  📅 {movie.release_date.substring(0, 4)}
                </span>
              )}

              <span className="text-yellow-400">
                ⭐ {movie.vote_average?.toFixed(1)}
              </span>

              {movie.runtime && (
                <span>
                  ⏱️ {movie.runtime} min
                </span>
              )}

            </div>

            {/* Genres */}
            {movie.genres?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">

                {movie.genres.map((genre: any) => (
                  <span
                    key={genre.id}
                    className="bg-zinc-800 px-3 py-1 rounded-full text-sm"
                  >
                    {genre.name}
                  </span>
                ))}

              </div>
            )}

            {/* Description */}
            <p className="text-lg text-zinc-300 leading-8 mb-8">
              {movie.overview || "No description available."}
            </p>

            {/* Watch unavailable */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 max-w-xl">

              <p className="text-zinc-400">
                🎬 Watch option will be available here when the
                movie is officially licensed and a legal video
                source is available.
              </p>

            </div>

          </div>
        </div>

      </div>
    </main>
  );
}