"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Movie = {
  id: number;
  title: string;
  description: string;
  posterUrl: string;
  videoUrl: string;
  genre: string;
  releaseYear: string;
  tmdbId?: number | null;
};

export default function ManageMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function loadMovies() {
    try {
      const res = await fetch("/api/movies");

      if (!res.ok) {
        throw new Error("Failed to load movies");
      }

      const data = await res.json();

      setMovies(data);
    } catch (error) {
      console.error("LOAD MOVIES ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMovies();
  }, []);

  async function deleteMovie(id: number, title: string) {
    const confirmDelete = confirm(
      `"${title}" ko delete karna hai?`
    );

    if (!confirmDelete) return;

    setDeletingId(id);

    try {
      const res = await fetch(`/api/movies/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Movie delete nahi hui.");
        return;
      }

      setMovies((currentMovies) =>
        currentMovies.filter((movie) => movie.id !== id)
      );

      alert("Movie deleted successfully ✅");
    } catch (error) {
      console.error("DELETE ERROR:", error);
      alert("Movie delete karte waqt error aa gaya.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Manage Movies
            </h1>

            <p className="text-zinc-400 mt-2">
              Total Movies: {movies.length}
            </p>
          </div>

          <Link
            href="/dashboard"
            className="bg-zinc-800 hover:bg-zinc-700 px-5 py-3 rounded-lg font-semibold w-fit"
          >
            ← Dashboard
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-zinc-900 rounded-xl p-10 text-center">
            <p className="text-zinc-400">
              Movies loading...
            </p>
          </div>
        )}

        {/* No Movies */}
        {!loading && movies.length === 0 && (
          <div className="bg-zinc-900 rounded-xl p-10 text-center">
            <h2 className="text-2xl font-bold mb-2">
              No Movies Found
            </h2>

            <p className="text-zinc-400 mb-6">
              Abhi database mein koi movie nahi hai.
            </p>

            <Link
              href="/movies/new"
              className="inline-block bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-bold"
            >
              ➕ Add Movie
            </Link>
          </div>
        )}

        {/* Movies */}
        {!loading && movies.length > 0 && (
          <div className="space-y-4">

            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-zinc-900 rounded-xl p-4 md:p-5"
              >
                <div className="flex flex-col md:flex-row gap-5">

                  {/* Poster */}
                  <div className="w-24 h-36 shrink-0">
                    {movie.posterUrl ? (
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-800 rounded-lg flex items-center justify-center text-xs text-zinc-500">
                        No Poster
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">

                    <h2 className="text-2xl font-bold mb-2">
                      {movie.title}
                    </h2>

                    <p className="text-sm text-zinc-400 mb-1">
                      ID: {movie.id}
                    </p>

                    <p className="text-sm text-zinc-400 mb-1">
                      TMDB ID: {movie.tmdbId ?? "Not available"}
                    </p>

                    <p className="text-sm text-zinc-400 mb-3">
                      Year: {movie.releaseYear}
                    </p>

                    {/* Video URL */}
                    <div className="bg-black rounded-lg p-3">
                      <p className="text-xs text-zinc-500 mb-1">
                        Video URL
                      </p>

                      {movie.videoUrl ? (
                        <p className="text-sm text-green-400 break-all">
                          {movie.videoUrl}
                        </p>
                      ) : (
                        <p className="text-sm text-red-400">
                          Video Not Added
                        </p>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-3 mt-4">

                      {/* Details */}
                      <Link
                        href={`/movies/${movie.id}`}
                        className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg font-semibold"
                      >
                        View Details
                      </Link>
                      {/* Edit */}
                      <Link
                        href={`/dashboard/movies/edit/${movie.id}`}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
                      >
                        ✏️ Edit
                      </Link>

                      {/* Watch */}
                      {movie.videoUrl && (
                        <Link
                          href={`/watch/movie/${movie.id}`}
                          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold"
                        >
                          ▶ Watch
                        </Link>
                      )}

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() =>
                          deleteMovie(movie.id, movie.title)
                        }
                        disabled={deletingId === movie.id}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
                      >
                        {deletingId === movie.id
                          ? "Deleting..."
                          : "🗑 Delete"}
                      </button>

                    </div>

                  </div>
                </div>
              </div>
            ))}

          </div>
        )}

      </div>
    </main>
  );
}