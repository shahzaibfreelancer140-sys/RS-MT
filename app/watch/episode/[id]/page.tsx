import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function WatchEpisode({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const episodeId = Number(id);

  if (isNaN(episodeId)) {
    notFound();
  }

  const episode = await prisma.episode.findUnique({
    where: {
      id: episodeId,
    },
    include: {
      season: {
        include: {
          tvShow: true,
        },
      },
    },
  });

  if (!episode) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-8">
      <div className="max-w-6xl mx-auto">

        {/* Back */}
        <Link
          href={`/seasons/${episode.seasonId}`}
          className="inline-block mb-6 text-zinc-400 hover:text-white"
        >
          ← Back to Season {episode.season.number}
        </Link>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {episode.season.tvShow.title}
        </h1>

        <h2 className="text-xl md:text-2xl text-zinc-400 mb-6">
          Season {episode.season.number} — Episode{" "}
          {episode.number}: {episode.title}
        </h2>

        {/* Video */}
        {episode.videoUrl ? (
          <div className="bg-zinc-900 rounded-xl overflow-hidden">
            <video
              controls
              playsInline
              className="w-full aspect-video bg-black"
              src={episode.videoUrl}
            >
              Your browser does not support the video player.
            </video>
          </div>
        ) : (
          <div className="bg-zinc-900 rounded-xl p-10 text-center">
            <h2 className="text-2xl font-bold">
              Video Not Available
            </h2>

            <p className="text-zinc-400 mt-2">
              Is episode ka video abhi available nahi hai.
            </p>
          </div>
        )}

        {/* Description */}
        {episode.description && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-2">
              Description
            </h3>

            <p className="text-zinc-400 leading-7">
              {episode.description}
            </p>
          </div>
        )}

      </div>
    </main>
  );
}