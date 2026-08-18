import Navbar from "@/components/Navbar";
import MovieCard from "@/components/MovieCard";
import TMDBHeroSlider from "@/components/TMDBHeroSlider";
import Link from "next/link";
import prisma from "@/lib/prisma";

type TMDBItem = {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  backdrop_path?: string | null;
  poster_path?: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  media_type: "movie" | "tv";
};

async function getTMDBData() {
  const token = process.env.TMDB_ACCESS_TOKEN;

  if (!token) {
    console.error("TMDB_ACCESS_TOKEN is missing");
    return {
      slider: [],
      movies: [],
      tvShows: [],
    };
  }

  try {
    const headers = {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    };

    const [trendingRes, moviesRes, tvRes] = await Promise.all([
      fetch(
        "https://api.themoviedb.org/3/trending/all/week?language=en-US",
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
        "https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=1",
        {
          headers,
          cache: "no-store",
        }
      ),
    ]);

    if (!trendingRes.ok || !moviesRes.ok || !tvRes.ok) {
      throw new Error("TMDB request failed");
    }

    const [trendingData, moviesData, tvData] = await Promise.all([
      trendingRes.json(),
      moviesRes.json(),
      tvRes.json(),
    ]);

    const slider: TMDBItem[] = (trendingData.results || [])
      .filter(
        (item: TMDBItem) =>
          (item.media_type === "movie" || item.media_type === "tv") &&
          item.backdrop_path
      )
      .slice(0, 8);

    const movies: TMDBItem[] = (moviesData.results || [])
      .filter((movie: TMDBItem) => movie.poster_path)
      .slice(0, 12)
      .map((movie: TMDBItem) => ({
        ...movie,
        media_type: "movie",
      }));

    const tvShows: TMDBItem[] = (tvData.results || [])
      .filter((show: TMDBItem) => show.poster_path)
      .slice(0, 12)
      .map((show: TMDBItem) => ({
        ...show,
        media_type: "tv",
      }));

    return {
      slider,
      movies,
      tvShows,
    };
  } catch (error) {
    console.error("TMDB HOME ERROR:", error);

    return {
      slider: [],
      movies: [],
      tvShows: [],
    };
  }
}

export default async function Home() {
  const [tmdb, databaseData] = await Promise.all([
    getTMDBData(),

    Promise.all([
      prisma.movie.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 12,
      }),

      prisma.tVShow.findMany({
        orderBy: {
          createdAt: "desc",
        },
        take: 12,
      }),
    ]),
  ]);

  const [databaseMovies, databaseTVShows] = databaseData;

  return (
    <>
      <Navbar />

      <main className="pt-20 bg-[#0d0d0d] text-white min-h-screen">

        {/* HERO SLIDER */}
        {tmdb.slider.length > 0 ? (
          <TMDBHeroSlider items={tmdb.slider} />
        ) : (
          <section className="min-h-[70vh] flex items-center bg-gradient-to-r from-black via-[#111] to-black">
            <div className="max-w-7xl mx-auto w-full px-6 md:px-10">

              <span className="inline-block bg-red-600 px-4 py-1 rounded-full text-sm font-semibold">
                RS-MT
              </span>

              <h1 className="text-5xl md:text-7xl font-black mt-6">
                Movies & TV Shows
              </h1>

              <p className="text-zinc-400 text-lg mt-5">
                Discover movies, TV shows and web series.
              </p>

            </div>
          </section>
        )}

        {/* TMDB MOVIES */}
        <section className="max-w-7xl mx-auto px-6 md:px-10 py-14">

          <div className="flex items-center justify-between mb-8">

            <div>
              <p className="text-red-500 text-sm font-semibold mb-2">
                TMDB
              </p>

              <h2 className="text-3xl md:text-4xl font-bold">
                Now Playing Movies
              </h2>
            </div>

            <Link
              href="/movies"
              className="text-zinc-400 hover:text-white transition"
            >
              View All →
            </Link>

          </div>

          {tmdb.movies.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">

              {tmdb.movies.map((movie) => (
                <Link
                  key={movie.id}
                  href={`/movies/tmdb/${movie.id}`}
                  className="group bg-zinc-900 rounded-xl overflow-hidden hover:bg-zinc-800 transition"
                >

                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title || "Movie"}
                      className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-zinc-800 flex items-center justify-center text-zinc-500">
                      No Poster
                    </div>
                  )}

                  <div className="p-3">

                    <h3 className="font-semibold truncate">
                      {movie.title}
                    </h3>

                    <p className="text-sm text-yellow-400 mt-1">
                      ⭐ {movie.vote_average?.toFixed(1)}
                    </p>

                  </div>

                </Link>
              ))}

            </div>
          ) : (
            <div className="bg-zinc-900 rounded-xl p-10 text-center text-zinc-400">
              No TMDB movies available.
            </div>
          )}

        </section>

        {/* TMDB TV SHOWS */}
        <section className="max-w-7xl mx-auto px-6 md:px-10 pb-16">

          <div className="flex items-center justify-between mb-8">

            <div>
              <p className="text-red-500 text-sm font-semibold mb-2">
                TMDB
              </p>

              <h2 className="text-3xl md:text-4xl font-bold">
                Latest TV Shows
              </h2>
            </div>

            <Link
              href="/tvshows"
              className="text-zinc-400 hover:text-white transition"
            >
              View All →
            </Link>

          </div>

          {tmdb.tvShows.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">

              {tmdb.tvShows.map((show) => (
                <Link
                  key={show.id}
                  href={`/tvshows/tmdb/${show.id}`}
                  className="group bg-zinc-900 rounded-xl overflow-hidden hover:bg-zinc-800 transition"
                >

                  {show.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                      alt={show.name || "TV Show"}
                      className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-zinc-800 flex items-center justify-center text-zinc-500">
                      No Poster
                    </div>
                  )}

                  <div className="p-3">

                    <h3 className="font-semibold truncate">
                      {show.name}
                    </h3>

                    <p className="text-sm text-yellow-400 mt-1">
                      ⭐ {show.vote_average?.toFixed(1)}
                    </p>

                  </div>

                </Link>
              ))}

            </div>
          ) : (
            <div className="bg-zinc-900 rounded-xl p-10 text-center text-zinc-400">
              No TMDB TV shows available.
            </div>
          )}

        </section>

        {/* YOUR DATABASE MOVIES */}
        {databaseMovies.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 md:px-10 pb-16">

            <div className="flex items-center justify-between mb-8">

              <div>
                <p className="text-red-500 text-sm font-semibold mb-2">
                 RS-MT
                </p>

                <h2 className="text-3xl md:text-4xl font-bold">
                  Our Movies
                </h2>
              </div>

              <Link
                href="/movies"
                className="text-zinc-400 hover:text-white transition"
              >
                View All →
              </Link>

            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">

              {databaseMovies.map((movie) => (
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

        {/* YOUR DATABASE TV SHOWS */}
        {databaseTVShows.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 md:px-10 pb-20">

            <div className="flex items-center justify-between mb-8">

              <div>
                <p className="text-red-500 text-sm font-semibold mb-2">
                 RS-MT
                </p>

                <h2 className="text-3xl md:text-4xl font-bold">
                  Our TV Shows
                </h2>
              </div>

              <Link
                href="/tvshows"
                className="text-zinc-400 hover:text-white transition"
              >
                View All →
              </Link>

            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">

              {databaseTVShows.map((show) => (
                <Link
                  key={show.id}
                  href={`/tvshows/${show.id}`}
                  className="group bg-zinc-900 rounded-xl overflow-hidden hover:bg-zinc-800 transition"
                >

                  {show.posterUrl ? (
                    <img
                      src={show.posterUrl}
                      alt={show.title}
                      className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full aspect-[2/3] bg-zinc-800 flex items-center justify-center text-zinc-500">
                      No Poster
                    </div>
                  )}

                  <div className="p-3">

                    <h3 className="font-semibold truncate">
                      {show.title}
                    </h3>

                    {show.genre && (
                      <p className="text-sm text-zinc-500 truncate mt-1">
                        {show.genre}
                      </p>
                    )}

                  </div>

                </Link>
              ))}

            </div>

          </section>
        )}

      </main>
    </>
  );
}