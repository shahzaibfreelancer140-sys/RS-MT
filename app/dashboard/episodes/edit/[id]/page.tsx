"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type Season = {
  id: number;
  number: number;
  title: string | null;
  tvShow: {
    id: number;
    title: string;
  };
};

type Episode = {
  id: number;
  seasonId: number;
  number: number;
  title: string;
  description: string | null;
  videoUrl: string;
  duration: number | null;
  season: Season;
};

export default function EditEpisodePage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [episode, setEpisode] = useState<Episode | null>(null);
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
    async function loadData() {
      try {
        const [episodeRes, seasonsRes] = await Promise.all([
          fetch(`/api/episodes/${id}`),
          fetch("/api/seasons"),
        ]);

        if (!episodeRes.ok) {
          throw new Error("Episode load nahi hui");
        }

        if (!seasonsRes.ok) {
          throw new Error("Seasons load nahi huay");
        }

        const episodeData = await episodeRes.json();
        const seasonsData = await seasonsRes.json();

        setEpisode(episodeData);
        setSeasons(seasonsData);

        setSeasonId(String(episodeData.seasonId));
        setNumber(String(episodeData.number));
        setTitle(episodeData.title || "");
        setDescription(episodeData.description || "");
        setVideoUrl(episodeData.videoUrl || "");
        setDuration(
          episodeData.duration
            ? String(episodeData.duration)
            : ""
        );
      } catch (error: any) {
        console.error("LOAD EPISODE ERROR:", error);

        alert(
          error.message || "Episode load nahi hui ❌"
        );

        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadData();
    }
  }, [id, router]);

  async function updateEpisode(e: React.FormEvent) {
    e.preventDefault();

    if (!seasonId || !number || !title.trim()) {
      alert(
        "Season, Episode Number aur Title zaroor fill karo."
      );
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`/api/episodes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          seasonId: Number(seasonId),
          number: Number(number),
          title,
          description,
          videoUrl,
          duration: duration
            ? Number(duration)
            : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Episode update nahi hui"
        );
      }

      alert("Episode Updated Successfully ✅");

      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      console.error("UPDATE EPISODE ERROR:", error);

      alert(
        error.message || "Episode update nahi hui ❌"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400">
          Episode loading...
        </p>
      </main>
    );
  }

  if (!episode) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400">
          Episode not found.
        </p>
      </main>
    );
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
          Edit Episode
        </h1>

        <form
          onSubmit={updateEpisode}
          className="bg-zinc-900 rounded-2xl p-6 space-y-5"
        >

          {/* Current Show */}
          <div className="bg-zinc-800 rounded-lg p-4">
            <p className="text-sm text-zinc-500">
              Current TV Show
            </p>

            <p className="font-bold mt-1">
              {episode.season.tvShow.title}
            </p>
          </div>

          {/* Season */}
          <div>
            <label className="block mb-2 font-semibold">
              Season
            </label>

            <select
              value={seasonId}
              onChange={(e) =>
                setSeasonId(e.target.value)
              }
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
              onChange={(e) =>
                setNumber(e.target.value)
              }
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
              onChange={(e) =>
                setTitle(e.target.value)
              }
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
              License milne ke baad authorized video URL
              yahan add karna.
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

          {/* Buttons */}
          <div className="flex gap-3">

            <Link
              href="/dashboard"
              className="w-1/2 text-center bg-zinc-700 hover:bg-zinc-600 py-3 rounded-lg font-bold"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="w-1/2 bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "💾 Save Changes"}
            </button>

          </div>

        </form>
      </div>
    </main>
  );
}

