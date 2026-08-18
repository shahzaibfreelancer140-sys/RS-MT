"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditTVShowPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [genre, setGenre] = useState("");

  useEffect(() => {
    async function getTVShow() {
      try {
        const res = await fetch(`/api/tvshows/${id}`);

        if (!res.ok) {
          throw new Error("TV Show not found");
        }

        const show = await res.json();

        setTitle(show.title || "");
        setDescription(show.description || "");
        setPosterUrl(show.posterUrl || "");
        setGenre(show.genre || "");
      } catch (error) {
        console.error("GET TV SHOW ERROR:", error);

        alert("TV Show load nahi hui ❌");

        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    getTVShow();
  }, [id, router]);

  async function updateTVShow(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);

    try {
      const res = await fetch(`/api/tvshows/${id}`, {
        method: "PUT",
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
          data.message || "TV Show update nahi hui"
        );
      }

      alert("TV Show updated successfully ✅");

      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      console.error("UPDATE TV SHOW ERROR:", error);

      alert(
        error.message || "TV Show update nahi hui ❌"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl text-zinc-400">
          Loading TV Show...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-3xl mx-auto">

        <button
          onClick={() => router.push("/dashboard")}
          className="text-zinc-400 hover:text-white"
        >
          ← Dashboard
        </button>

        <h1 className="text-4xl font-bold mt-8 mb-8">
          Edit TV Show
        </h1>

        <form
          onSubmit={updateTVShow}
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
              className="w-full bg-zinc-800 rounded-lg px-4 py-3 outline-none"
              required
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
              className="w-full bg-zinc-800 rounded-lg px-4 py-3 outline-none"
              placeholder="Drama, Action"
            />
          </div>

          {/* Save */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 py-3 rounded-lg font-bold"
          >
            {saving
              ? "Saving..."
              : "💾 Save Changes"}
          </button>

        </form>
      </div>
    </main>
  );
}