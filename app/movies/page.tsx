export const dynamic = "force-dynamic";


import MovieCard from "@/components/MovieCard";
import prisma from "@/lib/prisma";
import MovieSearch from "@/components/MovieSearch";
import Link from "next/link";


async function getTMDBMovies() {
  try {
    const token = process.env.TMDB_ACCESS_TOKEN;

    if (!token) {
      console.error("TMDB_ACCESS_TOKEN is missing");
      return null;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    };

    const [popular, nowPlaying, topRated, upcoming] =
      await Promise.all([
        fetch(
          "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
          {
            headers,
            cache: "no-store",
          }
        ),
        fetch(
          "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
          {
            headers,
            cache: "no-store",
          }
        ),
        fetch(
          "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
          {
            headers,
            cache: "no-store",
          }
        ),
        fetch(
          "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1",
          {
            headers,
            cache: "no-store",
          }
        ),
      ]);

    if (
      !popular.ok ||
      !nowPlaying.ok ||
      !topRated.ok ||
      !upcoming.ok
    ) {
      throw new Error("TMDB request failed");
    }

    const data = await Promise.all([
      popular.json(),
      nowPlaying.json(),
      topRated.json(),
      upcoming.json(),
    ]);

    return {
      popular: data[0].results,
      nowPlaying: data[1].results,
      topRated: data[2].results,
      upcoming: data[3].results,
    };
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