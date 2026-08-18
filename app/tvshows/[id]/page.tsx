import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function TVShowDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const showId = Number(id);

  if (isNaN(showId)) {
    notFound();
  }

  const show = await prisma.tVShow.findUnique({
    where: {
      id: showId,
    },
    include: {
      seasons: {
        orderBy: {
          number: "asc",
        },
      },
    },
  });

  if (!show) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">

        {/* Back */}
        <Link
          href="/tvshows"
          className="inline-block mb-8 text-zinc-400 hover:text-white"
        >
          ← Back to TV Shows
        </Link>

        <div className="grid md:grid-cols-[300px_1fr] gap-10">

          {/* Poster */}
          <div>
            {show.posterUrl ? (
              <img
                src={show.posterUrl}
                alt={show.title}
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
            <h1 className="text-4xl md:text-5xl font-bold">
              {show.title}
            </h1>

            {show.genre && (
              <p className="text-zinc-400 mt-4">
                🎭 {show.genre}
              </p>
            )}

            <p className="text-lg text-zinc-300 leading-8 mt-6">
              {show.description || "No description available."}
            </p>

            {/* Seasons */}
            <div className="mt-10">

              <h2 className="text-3xl font-bold mb-5">
                Seasons
              </h2>

              {show.seasons.length === 0 ? (
                <div className="bg-zinc-900 rounded-xl p-6">
                  <p className="text-zinc-400">
                    Abhi is TV Show ki koi season available nahi hai.
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">

                  {show.seasons.map((season) => (
                    <Link
                      key={season.id}
                      href={`/seasons/${season.id}`}
                      className="bg-zinc-900 hover:bg-zinc-800 rounded-xl p-5 transition"
                    >
                      <h3 className="text-xl font-bold">
                        Season {season.number}
                      </h3>

                      {season.title && (
                        <p className="text-zinc-400 mt-1">
                          {season.title}
                        </p>
                      )}
                    </Link>
                  ))}

                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </main>
  );
}