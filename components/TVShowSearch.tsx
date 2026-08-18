"use client";

import Link from "next/link";
import { useState } from "react";

export default function TVShowSearch() {
  const [query, setQuery] = useState("");
  const [shows, setShows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function searchShows(value: string) {
    setQuery(value);

    if (!value.trim()) {
      setShows([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `/api/tmdb/tv/search?query=${encodeURIComponent(value)}`
      );

      if (!res.ok) {
        setShows([]);
        return;
      }

      const data = await res.json();

      setShows(data.results || []);
    } catch (error) {
      console.error("TV SEARCH ERROR:", error);
      setShows([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative mb-12 w-full max-w-full min-w-0 overflow-hidden">

      {/* Search Bar */}
      <div className="flex w-full min-w-0 gap-2 sm:gap-3">

        <input
          type="text"
          value={query}
          onChange={(e) => searchShows(e.target.value)}
          placeholder="Search TV Shows..."
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
          className="
            shrink-0
            bg-red-600
            hover:bg-red-700
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
          Searching TV Shows...
        </p>
      )}

      {/* Search Results */}
      {shows.length > 0 && (
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
          {shows.map((show) => (
            <Link
              key={show.id}
              href={`/tvshows/tmdb/${show.id}`}
              className="group block min-w-0 overflow-hidden"
            >
              {/* Poster */}
              <div className="w-full overflow-hidden rounded-xl bg-zinc-900">

                {show.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                    alt={show.name || "TV Show"}
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

              {/* Title */}
              <h3 className="mt-3 font-semibold truncate">
                {show.name}
              </h3>

              {/* Year + Rating */}
              <div className="flex min-w-0 justify-between gap-2 text-sm text-zinc-400 mt-1">
                <span className="shrink-0">
                  {show.first_air_date
                    ? show.first_air_date.substring(0, 4)
                    : "N/A"}
                </span>

                <span className="shrink-0 text-yellow-400">
                  ⭐{" "}
                  {typeof show.vote_average === "number"
                    ? show.vote_average.toFixed(1)
                    : "N/A"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* No Results */}
      {query.trim() && !loading && shows.length === 0 && (
        <p className="text-zinc-500 mt-5">
          No TV Shows Found
        </p>
      )}

    </div>
  );
}