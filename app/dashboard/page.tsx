export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import Link from "next/link";
import prisma from "@/lib/prisma";
import AdminActions from "@/components/AdminActions";

export default async function Dashboard() {
  const [movies, tvShows, totalSeasons, totalEpisodes] =
    await Promise.all([
      prisma.movie.findMany({
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.tVShow.findMany({
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
      }),

      prisma.season.count(),

      prisma.episode.count(),
    ]);

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Admin Dashboard
            </h1>

            <p className="text-zinc-400 mt-2">
              Movies, TV Shows, Seasons & Episodes
            </p>
          </div>

          <Link
            href="/"
            className="bg-zinc-800 hover:bg-zinc-700 px-5 py-3 rounded-lg w-fit"
          >
            ← Website
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">

          <div className="bg-zinc-900 rounded-2xl p-6">
            <p className="text-zinc-400">
              🎬 Movies
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {movies.length}
            </h2>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-6">
            <p className="text-zinc-400">
              📺 TV Shows
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {tvShows.length}
            </h2>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-6">
            <p className="text-zinc-400">
              📚 Seasons
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {totalSeasons}
            </h2>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-6">
            <p className="text-zinc-400">
              🎞️ Episodes
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {totalEpisodes}
            </h2>
          </div>

        </div>

        {/* Add Buttons */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">

          <Link
            href="/movies/new"
            className="bg-red-600 hover:bg-red-700 rounded-xl p-5 text-center font-bold text-lg"
          >
            ➕ Add Movie
          </Link>

          <Link
            href="/tvshows/new"
            className="bg-red-600 hover:bg-red-700 rounded-xl p-5 text-center font-bold text-lg"
          >
            ➕ Add TV Show
          </Link>

          <Link
            href="/dashboard/seasons"
            className="bg-zinc-800 hover:bg-zinc-700 rounded-xl p-5 text-center font-bold text-lg"
          >
            ➕ Add Season
          </Link>

          <Link
            href="/dashboard/episodes"
            className="bg-zinc-800 hover:bg-zinc-700 rounded-xl p-5 text-center font-bold text-lg"
          >
            ➕ Add Episode
          </Link>

        </div>

        {/* ================= MOVIES ================= */}
        <section className="mb-14">

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">
              🎬 Movies
            </h2>

            <Link
              href="/movies"
              className="text-zinc-400 hover:text-white"
            >
              View All →
            </Link>
          </div>

          {movies.length === 0 ? (
            <div className="bg-zinc-900 rounded-xl p-8 text-center text-zinc-400">
              No movies added yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">

              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-zinc-900 rounded-xl overflow-hidden"
                >

                  {/* Poster */}
                  {movie.posterUrl ? (
                    <img
                      src={movie.posterUrl}
                      alt={movie.title}
                      className="w-full aspect-[2/3] object-cover"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-zinc-800 flex items-center justify-center text-zinc-500">
                      No Poster
                    </div>
                  )}

                  {/* Details */}
                  <div className="p-3">

                    <h3 className="font-semibold truncate">
                      {movie.title}
                    </h3>

                    <p className="text-sm text-zinc-500 mt-1">
                      {movie.releaseYear}
                    </p>

                    {/* Edit + Delete */}
                    <AdminActions
                      type="movie"
                      id={movie.id}
                    />

                  </div>

                </div>
              ))}

            </div>
          )}

        </section>

        {/* ================= TV SHOWS ================= */}
        <section className="mb-14">

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">
              📺 TV Shows
            </h2>

            <Link
              href="/tvshows"
              className="text-zinc-400 hover:text-white"
            >
              View All →
            </Link>
          </div>

          {tvShows.length === 0 ? (
            <div className="bg-zinc-900 rounded-xl p-8 text-center text-zinc-400">
              No TV Shows added yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">

              {tvShows.map((show) => {

                const episodeCount = show.seasons.reduce(
                  (total, season) =>
                    total + season.episodes.length,
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

                      <h3 className="font-bold text-lg truncate">
                        {show.title}
                      </h3>

                      {show.genre && (
                        <p className="text-sm text-zinc-500 truncate mt-1">
                          {show.genre}
                        </p>
                      )}

                      <div className="text-sm text-zinc-400 mt-3 space-y-1">

                        <p>
                          📚 {show.seasons.length}{" "}
                          {show.seasons.length === 1
                            ? "Season"
                            : "Seasons"}
                        </p>

                        <p>
                          🎞️ {episodeCount}{" "}
                          {episodeCount === 1
                            ? "Episode"
                            : "Episodes"}
                        </p>

                      </div>

                      <Link
                        href={`/tvshows/${show.id}`}
                        className="block text-center bg-zinc-800 hover:bg-zinc-700 rounded-lg py-2 mt-4"
                      >
                        View Show
                      </Link>

                      {/* Edit + Delete */}
                      <AdminActions
                        type="tvshow"
                        id={show.id}
                      />

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}