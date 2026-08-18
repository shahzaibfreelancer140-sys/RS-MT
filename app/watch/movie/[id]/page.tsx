import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function getProviders(tmdbId: number) {
  const token = process.env.TMDB_ACCESS_TOKEN;

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${tmdbId}/watch/providers`,
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
  } catch {
    return null;
  }
}

export default async function WatchMovie({ params }: Props) {
  const { id } = await params;

  const movie = await prisma.movie.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!movie) {
    notFound();
  }

  const providers = movie.tmdbId
    ? await getProviders(movie.tmdbId)
    : null;

  const country =
    providers?.results?.PK ||
    providers?.results?.US ||
    null;
  const providerLink = country?.link;
  const watchProviders = country?.flatrate || [];
  const rentProviders = country?.rent || [];
  const buyProviders = country?.buy || [];

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-8">

        <h1 className="text-4xl font-bold mb-8">
          {movie.title}
        </h1>

        {/* Own / Licensed Video */}
        {movie.videoUrl ? (
          <div className="mb-12">
            <video
              controls
              playsInline
              className="w-full rounded-xl bg-black"
              src={movie.videoUrl}
            />
          </div>
        ) : (
          <div className="bg-zinc-900 rounded-xl p-8 mb-10">
            <h2 className="text-2xl font-bold mb-3">
              Video Not Available
            </h2>

            <p className="text-zinc-400">
              Is movie ki direct video file abhi available nahi hai.
            </p>
          </div>
        )}

        {/* Streaming Providers */}
        {watchProviders.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-5">
              ▶ Available to Watch
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {watchProviders.map((provider: any) => (
                <div
                  key={provider.provider_id}
                  className="bg-zinc-900 rounded-xl p-5"
                >
                  {provider.logo_path && (
                    <img
                      src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                      alt={provider.provider_name}
                      className="w-16 h-16 rounded-xl mb-3"
                    />
                  )}

                  <h3 className="font-bold">
                    {provider.provider_name}
                  </h3>

                  <p className="text-sm text-zinc-400 mt-1">
                    Streaming provider
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Rent */}
        {rentProviders.length > 0 && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-5">
              🎬 Rent
            </h2>

            <div className="flex flex-wrap gap-4">
              {rentProviders.map((provider: any) => (
                <div
                  key={provider.provider_id}
                  className="bg-zinc-900 px-5 py-4 rounded-xl"
                >
                  {provider.provider_name}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Buy */}
        {buyProviders.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-5">
              💳 Buy
            </h2>

            <div className="flex flex-wrap gap-4">
              {buyProviders.map((provider: any) => (
                <a
                  key={provider.provider_id}
                  href={providerLink || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-zinc-900 hover:bg-zinc-800 px-6 py-4 rounded-xl transition"
                >
                  <div className="flex items-center gap-3">

                    {provider.logo_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                        alt={provider.provider_name}
                        className="w-10 h-10 rounded-lg"
                      />
                    )}

                    <div>
                      <p className="font-bold">
                        {provider.provider_name}
                      </p>

                      <p className="text-sm text-red-400">
                        Buy / Watch →
                      </p>
                    </div>

                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {!movie.videoUrl &&
          watchProviders.length === 0 &&
          rentProviders.length === 0 &&
          buyProviders.length === 0 && (
            <div className="text-zinc-500">
              No streaming provider found for this movie.
            </div>
          )}

      </div>
    </main>
  );
}