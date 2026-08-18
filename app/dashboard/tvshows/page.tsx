import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function TVShowsAdminPage() {
  const tvShows = await prisma.tVShow.findMany({
    include: {
      seasons: {
        include: {
          episodes: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">
              TV Shows
            </h1>

            <p className="text-zinc-400 mt-2">
              {tvShows.length} TV Shows Added
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/dashboard"
              className="bg-zinc-800 hover:bg-zinc-700 px-5 py-3 rounded-lg"
            >
              ← Dashboard
            </Link>

            <Link
              href="/tvshows/new"
              className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-lg font-semibold"
            >
              + Add TV Show
            </Link>
          </div>
        </div>

        {/* Empty */}
        {tvShows.length === 0 ? (
          <div className="bg-zinc-900 rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-bold">
              No TV Shows Added
            </h2>

            <p className="text-zinc-400 mt-2">
              Abhi koi TV Show database mein nahi hai.
            </p>
          </div>
        ) : (

          /* TV Shows */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">

            {tvShows.map((show) => {

              const totalEpisodes = show.seasons.reduce(
                (total, season) => total + season.episodes.length,
                0
              );

              return (
                <div
                  key={show.id}
                  className="bg-zinc-900 rounded-xl overflow-hidden"
                >

                  {/* Poster */}
                  {show.posterUrl ? (
                    <img
                      src={show.posterUrl}
                      alt={show.title}
                      className="w-full aspect-[2/3] object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-zinc-800 flex items-center justify-center text-zinc-500">
                      No Poster
                    </div>
                  )}

                  {/* Details */}
                  <div className="p-4">

                    <h2 className="font-bold text-lg truncate">
                      {show.title}
                    </h2>

                    {show.genre && (
                      <p className="text-sm text-zinc-500 mt-1 truncate">
                        {show.genre}
                      </p>
                    )}

                    <div className="text-sm text-zinc-400 mt-3 space-y-1">
                      <p>
                        📺 {show.seasons.length}{" "}
                        {show.seasons.length === 1
                          ? "Season"
                          : "Seasons"}
                      </p>

                      <p>
                        🎬 {totalEpisodes}{" "}
                        {totalEpisodes === 1
                          ? "Episode"
                          : "Episodes"}
                      </p>
                    </div>

                    {/* Open */}
                    <Link
                      href={`/tvshows/${show.id}`}
                      className="block text-center bg-zinc-800 hover:bg-zinc-700 rounded-lg py-2 mt-4"
                    >
                      View Show
                    </Link>

                  </div>
                </div>
              );
            })}

          </div>
        )}

      </div>
    </main>
  );
}