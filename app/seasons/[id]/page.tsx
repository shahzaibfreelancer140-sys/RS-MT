import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function SeasonDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const seasonId = Number(id);

  if (isNaN(seasonId)) {
    notFound();
  }

  const season = await prisma.season.findUnique({
    where: {
      id: seasonId,
    },
    include: {
      tvShow: true,
      episodes: {
        orderBy: {
          number: "asc",
        },
      },
    },
  });

  if (!season) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Back */}
        <Link
          href={`/tvshows/${season.tvShowId}`}
          className="inline-block mb-8 text-zinc-400 hover:text-white"
        >
          ← Back to {season.tvShow.title}
        </Link>

        {/* Header */}
        <h1 className="text-4xl md:text-5xl font-bold">
          {season.tvShow.title}
        </h1>

        <h2 className="text-2xl text-zinc-400 mt-3">
          Season {season.number}
        </h2>

        {season.title && (
          <p className="text-zinc-500 mt-2">
            {season.title}
          </p>
        )}

        {season.description && (
          <p className="text-zinc-300 mt-5 max-w-3xl leading-7">
            {season.description}
          </p>
        )}

        {/* Episodes */}
        <section className="mt-10">

          <h2 className="text-3xl font-bold mb-6">
            Episodes
          </h2>

          {season.episodes.length === 0 ? (
            <div className="bg-zinc-900 rounded-xl p-8 text-center">
              <h3 className="text-xl font-bold">
                No Episodes Found
              </h3>

              <p className="text-zinc-400 mt-2">
                Abhi is season mein koi episode available nahi hai.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {season.episodes.map((episode) => (
                <div
                  key={episode.id}
                  className="bg-zinc-900 hover:bg-zinc-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >

                  <div>
                    <p className="text-zinc-400 text-sm">
                      Episode {episode.number}
                    </p>

                    <h3 className="text-xl font-bold mt-1">
                      {episode.title}
                    </h3>

                    {episode.description && (
                      <p className="text-zinc-400 mt-2">
                        {episode.description}
                      </p>
                    )}
                  </div>

                  {/* Watch */}
                  {episode.videoUrl ? (
                    <Link
                      href={`/watch/episode/${episode.id}`}
                      className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-bold text-center"
                    >
                      ▶ Watch
                    </Link>
                  ) : (
                    <span className="text-yellow-400 text-sm">
                      Video Not Available
                    </span>
                  )}

                </div>
              ))}

            </div>
          )}

        </section>
      </div>
    </main>
  );
}