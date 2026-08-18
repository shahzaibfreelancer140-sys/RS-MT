"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Season = {
  id: number;
  number: number;
  title: string | null;
  tvShow: {
    id: number;
    title: string;
  };
};

export default function AddEpisodePage() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [seasonId, setSeasonId] = useState("");
  const [number, setNumber] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    async function loadSeasons() {
      try {
        const res = await fetch("/api/seasons");

        if (!res.ok) {
          throw new Error("Seasons load nahi huay");
        }

        const data = await res.json();
        setSeasons(data);
      } catch (error) {
        console.error(error);
        alert("Seasons load nahi huay ❌");
      } finally {
        setLoading(false);
      }
    }

    loadSeasons();
  }, []);

  async function addEpisode(e: React.FormEvent) {
    e.preventDefault();

    if (!seasonId || !number || !title) {
      alert("Season, episode number aur title zaroor fill karo.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/episodes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seasonId: Number(seasonId),
          number: Number(number),
          title,
          description,
          videoUrl,
          duration: duration ? Number(duration) : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Episode add nahi hui"
        );
      }

      alert("Episode Added Successfully ✅");

      setNumber("");
      setTitle("");
      setDescription("");
      setVideoUrl("");
      setDuration("");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Episode add nahi hui ❌");
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
          Add Episode
        </h1>

        {loading ? (
          <p className="text-zinc-400">
            Seasons loading...
          </p>
        ) : seasons.length === 0 ? (
          <div className="bg-zinc-900 rounded-xl p-6">
            <h2 className="text-xl font-bold">
              No Seasons Found
            </h2>

            <p className="text-zinc-400 mt-2">
              Pehle TV Show ke liye season add karo.
            </p>
          </div>
        ) : (
          <form
            onSubmit={addEpisode}
            className="bg-zinc-900 rounded-2xl p-6 space-y-5"
          >

            {/* Season */}
            <div>
              <label className="block mb-2 font-semibold">
                Season
              </label>

              <select
                value={seasonId}
                onChange={(e) => setSeasonId(e.target.value)}
                className="w-full bg-zinc-800 rounded-lg px-4 py-3 outline-none"
              >
                <option value="">
                  Select Season
                </option>

                {seasons.map((season) => (
                  <option
                    key={season.id}
                    value={season.id}
                  >
                    {season.tvShow.title} — Season{" "}
                    {season.number}
                  </option>
                ))}
              </select>
            </div>

            {/* Episode Number */}
            <div>
              <label className="block mb-2 font-semibold">
                Episode Number
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

            {/* Title */}
            <div>
              <label className="block mb-2 font-semibold">
                Episode Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Episode 1"
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
                placeholder="Episode description..."
                className="w-full bg-zinc-800 rounded-lg px-4 py-3 outline-none resize-none"
              />
            </div>

            {/* Video URL */}
            <div>
              <label className="block mb-2 font-semibold">
                Video URL
              </label>

              <input
                type="url"
                value={videoUrl}
                onChange={(e) =>
                  setVideoUrl(e.target.value)
                }
                placeholder="https://example.com/episode.mp4"
                className="w-full bg-zinc-800 rounded-lg px-4 py-3 outline-none"
              />

              <p className="text-xs text-zinc-500 mt-2">
                Sirf authorized/licensed video URL use karo.
              </p>
            </div>

            {/* Duration */}
            <div>
              <label className="block mb-2 font-semibold">
                Duration (minutes)
              </label>

              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) =>
                  setDuration(e.target.value)
                }
                placeholder="45"
                className="w-full bg-zinc-800 rounded-lg px-4 py-3 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold disabled:opacity-50"
            >
              {saving ? "Adding Episode..." : "➕ Add Episode"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}