"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type TVShow = {
  id: number;
  title: string;
};

export default function AddSeasonPage() {
  const [tvShows, setTvShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [tvShowId, setTvShowId] = useState("");
  const [number, setNumber] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    async function loadTVShows() {
      try {
        const res = await fetch("/api/tvshows");

        if (!res.ok) {
          throw new Error("TV Shows load nahi huay");
        }

        const data = await res.json();
        setTvShows(data);
      } catch (error) {
        console.error(error);
        alert("TV Shows load nahi huay ❌");
      } finally {
        setLoading(false);
      }
    }

    loadTVShows();
  }, []);

  async function addSeason(e: React.FormEvent) {
    e.preventDefault();

    if (!tvShowId || !number) {
      alert("TV Show aur Season Number select karo.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/seasons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tvShowId: Number(tvShowId),
          number: Number(number),
          title: title || null,
          description: description || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Season add nahi hui"
        );
      }

      alert("Season Added Successfully ✅");

      setNumber("");
      setTitle("");
      setDescription("");
    } catch (error: any) {
      console.error("ADD SEASON ERROR:", error);

      alert(
        error.message || "Season add nahi hui ❌"
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
          Add Season
        </h1>

        {loading ? (
          <p className="text-zinc-400">
            TV Shows loading...
          </p>
        ) : tvShows.length === 0 ? (
          <div className="bg-zinc-900 rounded-xl p-6">
            <h2 className="text-xl font-bold">
              No TV Shows Found
            </h2>

            <p className="text-zinc-400 mt-2">
              Pehle TV Show add karo.
            </p>

            <Link
              href="/dashboard/tvshows/new"
              className="inline-block mt-5 bg-red-600 hover:bg-red-700 px-5 py-3 rounded-lg font-semibold"
            >
              ➕ Add TV Show
            </Link>
          </div>
        ) : (
          <form
            onSubmit={addSeason}
            className="bg-zinc-900 rounded-2xl p-6 space-y-5"
          >

            {/* TV Show */}
            <div>
              <label className="block mb-2 font-semibold">
                TV Show
              </label>

              <select
                value={tvShowId}
                onChange={(e) => setTvShowId(e.target.value)}
                className="w-full bg-zinc-800 rounded-lg px-4 py-3 outline-none"
              >
                <option value="">
                  Select TV Show
                </option>

                {tvShows.map((show) => (
                  <option
                    key={show.id}
                    value={show.id}
                  >
                    {show.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Season Number */}
            <div>
              <label className="block mb-2 font-semibold">
                Season Number
              </label>

              <input
                type="number"
                min="1"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="1"
                className="w-full bg-zinc-800 rounded-lg px-4 py-3 outline-none"
              />
            </div>

            {/* Season Title */}
            <div>
              <label className="block mb-2 font-semibold">
                Season Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Season 1"
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
                rows={4}
                placeholder="Season description..."
                className="w-full bg-zinc-800 rounded-lg px-4 py-3 outline-none resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold disabled:opacity-50"
            >
              {saving ? "Adding Season..." : "➕ Add Season"}
            </button>

          </form>
        )}
      </div>
    </main>
  );
}