import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function MovieDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const movie = await prisma.movie.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!movie) return notFound();

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto py-14 px-8">

        {/* Back */}
        <Link
          href="/movies"
          className="inline-block mb-8 text-zinc-400 hover:text-white"
        >
          ← Back to Movies
        </Link>

        <div className="grid md:grid-cols-[300px_1fr] gap-10">

          {/* Poster */}
          <div>
            {movie.posterUrl ? (
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-full rounded-xl"
              />
            ) : (
              <div className="aspect-[2/3] bg-zinc-800 rounded-xl flex items-center justify-center">
                No Poster
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">
              {movie.title}
            </h1>

            <div className="flex flex-wrap gap-4 mt-5 text-zinc-400">
              <span>📅 {movie.releaseYear}</span>

              {movie.genre && (
                <span>🎭 {movie.genre}</span>
              )}
            </div>

            <p className="mt-6 text-lg text-zinc-300 leading-8">
              {movie.description || "No description available."}
            </p>

            {/* Watch */}
            {movie.videoUrl ? (
              <Link
                href={`/watch/movie/${movie.id}`}
                className="inline-block mt-8 bg-red-600 hover:bg-red-700 px-8 py-3 rounded-lg font-bold"
              >
                ▶ Watch Movie
              </Link>
            ) : (
              <div className="mt-8 bg-zinc-900 border border-zinc-800 px-6 py-4 rounded-lg">
                <p className="text-yellow-400 font-semibold">
                  🎬 Video Not Available
                </p>

                <p className="text-zinc-500 text-sm mt-1">
                  Is movie ka authorized video abhi available nahi hai.
                </p>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}