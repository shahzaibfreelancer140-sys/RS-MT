"use client";

import { useState } from "react";

type Props = {
  tmdbId: number;
  title: string;
  description: string;
  posterUrl: string;
  genre: string;
  releaseYear: string;
};

export default function AddMovieButton({
  tmdbId,
  title,
  description,
  posterUrl,
  genre,
  releaseYear,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function addMovie() {
    setLoading(true);

    try {
      const res = await fetch("/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tmdbId,
          title,
          description,
          posterUrl,
          videoUrl: "",
          genre,
          releaseYear,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || data.message || "Failed to add movie"
        );
      }

      alert("Movie Added Successfully ✅");
    } catch (error: any) {
      console.error("ADD MOVIE ERROR:", error);
      alert(error.message || "Movie add nahi hui ❌");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={addMovie}
      disabled={loading}
      className="bg-zinc-800 hover:bg-zinc-700 px-8 py-4 rounded-xl font-bold disabled:opacity-50"
    >
      {loading ? "Adding..." : "＋ Add to My Movies"}
    </button>
  );
}