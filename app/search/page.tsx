import Link from "next/link";
import prisma from "@/lib/prisma";
import MovieCard from "@/components/MovieCard";

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;

  const query = q?.trim() || "";

  if (!query) {
    return (
      <main className="min-h-screen bg-[#0d0d0d] text-white px-6 py-12">
        <div className="max-w-7xl mx-auto">

          <h1 className="text-4xl font-bold mb-4">
            Search
          </h1>

          <p className="text-zinc-400">
            Search for movies or TV shows.
          </p>

        </div>
      </main>
    );
  }

  const [movies, tvShows] = await Promise.all([
    prisma.movie.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.tVShow.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const totalResults = movies.length + tvShows.length;

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white px-6 py-12">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">

          <Link
            href="/"
            className="text-zinc-400 hover:text-white transition"
          >
            ← Home
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold mt-6">
            Search Results
          </h1>

          <p className="text-zinc-400 mt-2">
            Results for:{" "}
            <span className="text-white font-semibold">
              "{query}"
            </span>
          </p>

        </div>

        {totalResults === 0 ? (
          <div className="bg-zinc-900 rounded-2xl p-10 text-center">

            <div className="text-5xl mb-4">
              🔍
            </div>

            <h2 className="text-2xl font-bold">
              No Results Found
            </h2>

            <p className="text-zinc-400 mt-2">
              Movie ya TV Show nahi mila.
            </p>

          </div>
        ) : (
          <>

            {/* Movies */}
            {movies.length > 0 && (
              <section className="mb-14">

                <h2 className="text-3xl font-bold mb-6">
                  🎬 Movies
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">

                  {movies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      id={movie.id}
                      title={movie.title}
                      image={movie.posterUrl}
                    />
                  ))}

                </div>

              </section>
            )}

            {/* TV Shows */}
            {tvShows.length > 0 && (
              <section>

                <h2 className="text-3xl font-bold mb-6">
                  📺 TV Shows
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">

                  {tvShows.map((show) => (
                    <Link
                      key={show.id}
                      href={`/tvshows/${show.id}`}
                      className="group bg-zinc-900 rounded-xl overflow-hidden hover:bg-zinc-800 transition"
                    >

                      {show.posterUrl ? (
                        <img
                          src={show.posterUrl}
                          alt={show.title}
                          className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div className="w-full aspect-[2/3] bg-zinc-800 flex items-center justify-center text-zinc-500">
                          No Poster
                        </div>
                      )}

                      <div className="p-3">

                        <h3 className="font-semibold truncate">
                          {show.title}
                        </h3>

                        {show.genre && (
                          <p className="text-sm text-zinc-500 truncate mt-1">
                            {show.genre}
                          </p>
                        )}

                      </div>

                    </Link>
                  ))}

                </div>

              </section>
            )}

          </>
        )}

      </div>

    </main>
  );
}