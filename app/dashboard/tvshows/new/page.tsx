"use client";

import { useState } from "react";
import Link from "next/link";

export default function AddTVShowPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [genre, setGenre] = useState("");
  const [saving, setSaving] = useState(false);

  async function addTVShow(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      alert("TV Show ka title zaroor likho.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/tvshows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          posterUrl,
          genre,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "TV Show add nahi hui"
        );
      }

      alert("TV Show Added Successfully ✅");

      setTitle("");
      setDescription("");
      setPosterUrl("");
      setGenre("");
    } catch (error: any) {
      console.error("ADD TV SHOW ERROR:", error);

      alert(
        error.message || "TV Show add nahi hui ❌"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-3xl mx-auto">

        <Link
          href="/dashboard"
          className="text-zinc-400 hover:text-white"
        >
          ← Dashboard
        </Link>

        <h1 className="text-4xl font-bold mt-8 mb-8">
          Add TV Show
        </h1>

        <form
          onSubmit={addTVShow}
          className="bg-zinc-900 rounded-2xl p-6 space-y-5"
        >

          {/* Title */}
          <div>
            <label className="block mb-2 font-semibold">
              TV Show Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Breaking Bad"
              className="w-full bg-zinc-800 rounded-lg px-4 py-3 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 font-semibold">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              rows={5}
              placeholder="TV Show description..."
              className="w-full bg-zinc-800 rounded-lg px-4 py-3 outline-none resize-none"
            />
          </div>

          {/* Poster */}
          <div>
            <label className="block mb-2 font-semibold">
              Poster URL
            </label>

            <input
              type="url"
              value={posterUrl}
              onChange={(e) =>
                setPosterUrl(e.target.value)
              }
              placeholder="https://image.tmdb.org/..."
              className="w-full bg-zinc-800 rounded-lg px-4 py-3 outline-none"
            />
          </div>

          {/* Genre */}
          <div>
            <label className="block mb-2 font-semibold">
              Genre
            </label>

            <input
              type="text"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              placeholder="Drama, Action"
              className="w-full bg-zinc-800 rounded-lg px-4 py-3 outline-none"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold disabled:opacity-50"
          >
            {saving
              ? "Adding TV Show..."
              : "➕ Add TV Show"}
          </button>

        </form>
      </div>
    </main>
  );
}