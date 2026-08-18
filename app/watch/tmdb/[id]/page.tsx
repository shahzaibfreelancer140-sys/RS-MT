import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function WatchMovie({ params }: Props) {
  const { id } = await params;

  const tmdbId = Number(id);

  if (isNaN(tmdbId)) {
    notFound();
  }

  const movie = await prisma.movie.findUnique({
    where: {
      tmdbId: tmdbId,
    },
  });

  if (!movie) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          {movie.title}
        </h1>

        {movie.videoUrl ? (
          <video
            controls
            playsInline
            className="w-full rounded-2xl"
            src={movie.videoUrl}
          />
        ) : (
          <div className="bg-zinc-900 rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-bold mb-3">
              Video Not Available
            </h2>

            <p className="text-zinc-400">
              Is movie ka video abhi available nahi hai.
            </p>
          </div>
        )}

      </div>
    </main>
  );
}