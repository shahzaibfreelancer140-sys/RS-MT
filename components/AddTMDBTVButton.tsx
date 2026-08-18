"use client";

import { useState } from "react";

export default function AddTMDBTVButton({
  tmdbId,
}: {
  tmdbId: number;
}) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  async function addShow() {
    setLoading(true);

    try {
      const response = await fetch("/api/tmdb/tv/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tmdbId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "TV Show add nahi hua");
      }

      setAdded(true);

      alert("TV Show aur Seasons successfully add ho gaye ✅");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "TV Show add nahi hua ❌");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={addShow}
      disabled={loading || added}
      className="bg-red-600 hover:bg-red-700 disabled:opacity-50 px-7 py-4 rounded-xl font-bold"
    >
      {loading
        ? "Adding..."
        : added
        ? "✓ Added"
        : "➕ Add to My TV Shows"}
    </button>
  );
}