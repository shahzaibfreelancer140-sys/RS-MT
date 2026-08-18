"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function MovieSearch() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function searchMovies(value?: string) {
    const searchQuery = (value ?? query).trim();

    if (!searchQuery) {
      setMovies([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `/api/tmdb-search?query=${encodeURIComponent(searchQuery)}`,
        {
          cache: "no-store",
        }
      );

      if (!res.ok) {
        console.error("Movie search failed:", res.status);
        setMovies([]);
        return;
      }

      const data = await res.json();

      setMovies(data.movies || []);
    } catch (error) {
      console.error("MOVIE SEARCH ERROR:", error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }

  // Automatic Search
  useEffect(() => {
    const searchQuery = query.trim();

    if (!searchQuery) {
      setMovies([]);
      return;
    }

    const timer = setTimeout(() => {
      searchMovies(searchQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative mb-12 w-full max-w-full min-w-0 overflow-hidden">

      {/* Search Bar */}
      <div className="flex w-full min-w-0 gap-2 sm:gap-3">

        <input
          type="text"
          value={query}
          placeholder="Search Movies..."
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              searchMovies();
            }
          }}
          className="
            min-w-0
            flex-1
            w-0
            bg-zinc-900
            border border-zinc-800
            rounded-xl
            px-3 sm:px-5
            py-3 sm:py-4
            text-base sm:text-lg
            text-white
            placeholder:text-zinc-500
            outline-none
            focus:border-red-600
            transition
          "
        />

        <button
          type="button"
          onClick={() => searchMovies()}
          disabled={loading}
          className="
            shrink-0
            bg-red-600
            hover:bg-red-700
            disabled:opacity-60
            disabled:cursor-not-allowed
            px-3 sm:px-7
            py-3 sm:py-4
            rounded-xl
            font-bold
            text-sm sm:text-base
            transition
            whitespace-nowrap
          "
        >
          {loading ? "Searching..." : "Search"}
        </button>

      </div>

      {/* Loading */}
      {loading && (
        <p className="text-zinc-400 mt-5">
          Searching movies...
        </p>
      )}

      {/* Search Results */}
      {movies.length > 0 && (
        <div
          className="
            grid
            w-full
            min-w-0
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-6
            gap-3
            sm:gap-6
            mt-8
          "
        >
          {movies.map((movie) => (
            <Link
              key={movie.id}
              href={`/movies/tmdb/${movie.id}`}
              className="group block min-w-0 overflow-hidden"
            >
              {/* Poster */}
              <div className="w-full overflow-hidden rounded-xl bg-zinc-900">

                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title || "Movie"}
                    className="
                      block
                      w-full
                      max-w-full
                      aspect-[2/3]
                      object-cover
                      group-hover:scale-105
                      transition
                      duration-300
                    "
                  />
                ) : (
                  <div
                    className="
                      w-full
                      aspect-[2/3]
                      bg-zinc-800
                      flex
                      items-center
                      justify-center
                      text-zinc-500
                      text-sm
                    "
                  >
                    No Poster
                  </div>
                )}

              </div>

              {/* Movie Title */}
              <h3 className="mt-3 font-semibold truncate">
                {movie.title}
              </h3>

              {/* Year + Rating */}
              <div className="flex min-w-0 justify-between gap-2 text-sm text-zinc-400 mt-1">
                <span className="shrink-0">
                  {movie.release_date
                    ? movie.release_date.substring(0, 4)
                    : "N/A"}
                </span>

                <span className="shrink-0 text-yellow-400">
                  ⭐{" "}
                  {typeof movie.vote_average === "number"
                    ? movie.vote_average.toFixed(1)
                    : "N/A"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* No Results */}
      {query.trim() && !loading && movies.length === 0 && (
        <p className="text-zinc-500 mt-5">
          No Movies Found
        </p>
      )}

    </div>
  );
}