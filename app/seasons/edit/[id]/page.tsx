"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type TVShow = {
  id: number;
  title: string;
};

type Season = {
  id: number;
  number: number;
  title: string | null;
  description: string | null;
  tvShowId: number;
};

export default function EditSeasonPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [tvShows, setTVShows] = useState<TVShow[]>([]);
  const [season, setSeason] = useState<Season | null>(null);

  const [tvShowId, setTVShowId] = useState("");
  const [number, setNumber] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [seasonRes, showsRes] = await Promise.all([
          fetch(`/api/seasons/${id}`),
          fetch("/api/tvshows"),
        ]);

        if (!seasonRes.ok) {
          throw new Error("Season load nahi hui");
        }

        if (!showsRes.ok) {
          throw new Error("TV Shows load nahi huay");
        }

        const seasonData = await seasonRes.json();
        const showsData = await showsRes.json();

        setSeason(seasonData);
        setTVShows(showsData);

        setTVShowId(String(seasonData.tvShowId));
        setNumber(String(seasonData.number));
        setTitle(seasonData.title || "");
        setDescription(seasonData.description || "");
      } catch (error) {
        console.error("LOAD SEASON ERROR:", error);
        alert("Season load nahi hui ❌");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  async function updateSeason(e: React.FormEvent) {
    e.preventDefault();

    if (!tvShowId || !number) {
      alert("TV Show aur Season Number zaroor select karo.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`/api/seasons/${id}`, {
        method: "PUT",
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
          data.message || "Season update nahi hui"
        );
      }

      alert("Season Updated Successfully ✅");

      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      console.error("UPDATE SEASON ERROR:", error);

      alert(
        error.message || "Season update nahi hui ❌"
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteSeason() {
    const confirmDelete = confirm(
      "Kya tum ye Season delete karna chahte ho?\n\nIs Season ke saare Episodes bhi delete ho jayenge."
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const res = await fetch(`/api/seasons/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Season delete nahi hui"
        );
      }

      alert("Season Deleted Successfully ✅");

      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      console.error("DELETE SEASON ERROR:", error);

      alert(
        error.message || "Season delete nahi hui ❌"
      );
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400">
          Season loading...
        </p>
      </main>
    );
  }

  if (!season) {
    return (
      <main className="min-h-screen bg-black text-white px-6 py-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold">
            Season Not Found
          </h1>

          <Link
            href="/dashboard"
            className="inline-block mt-5 bg-zinc-800 hover:bg-zinc-700 px-5 py-3 rounded-lg"
          >
            ← Dashboard
          </Link>
        </div>
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

        <div className="flex items-center justify-between mt-8 mb-8">
          <div>
            <h1 className="text-4xl font-bold">
              Edit Season
            </h1>

            <p className="text-zinc-400 mt-2">
              Season ID: {season.id}
            </p>
          </div>

          <button
            type="button"
            onClick={deleteSeason}
            className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-lg font-semibold"
          >
            🗑️ Delete
          </button>
        </div>

        <form
          onSubmit={updateSeason}
          className="bg-zinc-900 rounded-2xl p-6 space-y-5"
        >

          {/* TV Show */}
          <div>
            <label className="block mb-2 font-semibold">
              TV Show
            </label>

            <select
              value={tvShowId}
              onChange={(e) =>
                setTVShowId(e.target.value)
              }
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
              onChange={(e) =>
                setNumber(e.target.value)
              }
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
              onChange={(e) =>
                setTitle(e.target.value)
              }
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
              rows={5}
              placeholder="Season description..."
              className="w-full bg-zinc-800 rounded-lg px-4 py-3 outline-none resize-none"
            />
          </div>

          {/* Update */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold disabled:opacity-50"
          >
            {saving
              ? "Updating Season..."
              : "💾 Update Season"}
          </button>

        </form>
      </div>
    </main>
  );
}