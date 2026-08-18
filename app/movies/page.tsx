import MovieCard from "@/components/MovieCard";
import prisma from "@/lib/prisma";
import MovieSearch from "@/components/MovieSearch";
import Link from "next/link";

async function getTMDBMovies() {
  try {
    const response = await fetch(
      "http://localhost:3000/api/tmdb",
      {
        cache: "no-store",
      }
    );

    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    console.error("TMDB ERROR:", error);
    return null;
  }
}

function TMDBCard({ movie }: { movie: any }) {
  return (
    <a
      href={`/movies/tmdb/${movie.id}`}
      className="group block"
    >
      <div className="overflow-hidden rounded-xl bg-zinc-900">
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "/placeholder.jpg"
          }
          alt={movie.title}
          className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition"
        />
      </div>

      <h3 className="mt-3 font-semibold truncate">
        {movie.title}
      </h3>

      <div className="flex justify-between text-sm text-zinc-400 mt-1">
        <span>
          {movie.release_date
            ? movie.release_date.substring(0, 4)
            : "N/A"}
        </span>

        <span className="text-yellow-400">
          ⭐ {movie.vote_average?.toFixed(1)}
        </span>
      </div>
    </a>
  );
}

function Section({
  title,
  movies,
}: {
  title: string;
  movies: any[];
}) {
  if (!movies?.length) return null;

  return (
    <section className="mb-14">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">
        {title}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
        {movies.map((movie) => (
          <TMDBCard
            key={movie.id}
            movie={movie}
          />
        ))}
      </div>
    </section>
  );
}

export default async function MoviesPage() {
  const movies = await prisma.movie.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  const tmdb = await getTMDBMovies();

  return (
    <main className="min-h-screen bg-black text-white px-4 sm:px-6 md:px-10 py-8 sm:py-10">

      <div className="max-w-7xl mx-auto">

        {/* =========================
            BACK BUTTON
        ========================= */}

        <Link
          href="/"
          className="
            inline-flex items-center gap-2
            mb-6 sm:mb-8
            px-4 sm:px-5
            py-2.5 sm:py-3
            rounded-xl
            bg-zinc-900/80
            border border-zinc-800
            text-zinc-300
            hover:text-white
            hover:bg-zinc-800
            hover:border-zinc-700
            transition-all duration-300
          "
        >
          <span className="text-lg">
            ←
          </span>

          <span>
            Back to Home
          </span>
        </Link>

        {/* =========================
            PAGE TITLE
        ========================= */}

        <h1 className="text-4xl sm:text-5xl font-bold mb-8 sm:mb-12">
          Movies
        </h1>

        {/* =========================
            SEARCH
        ========================= */}

        <MovieSearch />

        {/* =========================
            YOUR MOVIES
        ========================= */}

        {movies.length > 0 && (
          <section className="mb-14 mt-10 sm:mt-12">

            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              🎬 My Movies
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">

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

        {/* =========================
            TMDB MOVIES
        ========================= */}

        {tmdb && (
          <>

            <Section
              title="🔥 Popular Movies"
              movies={tmdb.popular}
            />

            <Section
              title="🆕 Now Playing"
              movies={tmdb.nowPlaying}
            />

            <Section
              title="⭐ Top Rated"
              movies={tmdb.topRated}
            />

            <Section
              title="🚀 Upcoming"
              movies={tmdb.upcoming}
            />

          </>
        )}

      </div>

    </main>
  );
}