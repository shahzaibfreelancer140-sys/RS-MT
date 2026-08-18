"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditMovie() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function getMovie() {
      try {
        const res = await fetch(`/api/movies/${id}`);

        if (!res.ok) {
          throw new Error("Movie not found");
        }

        const movie = await res.json();

        setTitle(movie.title || "");
        setDescription(movie.description || "");
        setGenre(movie.genre || "");
        setReleaseYear(movie.releaseYear?.toString() || "");
        setPosterUrl(movie.posterUrl || "");
        setVideoUrl(movie.videoUrl || "");
      } catch (error) {
        console.error(error);
        alert("Movie load nahi hui.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      getMovie();
    }
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);

    try {
      const res = await fetch(`/api/movies/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          genre,
          releaseYear,
          posterUrl,
          videoUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Update failed");
      }

      alert("Movie updated successfully ✅");

      router.push("/dashboard/movies");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Movie update nahi hui.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400">
          Movie loading...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Edit Movie
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 rounded-2xl p-6 space-y-5"
        >

          {/* Title */}
          <div>
            <label className="block mb-2 font-semibold">
              Movie Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 rounded-lg bg-zinc-800 outline-none"
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
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-lg bg-zinc-800 min-h-32 outline-none"
              required
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
              className="w-full p-3 rounded-lg bg-zinc-800 outline-none"
            />
          </div>

          {/* Release Year */}
          <div>
            <label className="block mb-2 font-semibold">
              Release Year
            </label>

            <input
              type="number"
              value={releaseYear}
              onChange={(e) => setReleaseYear(e.target.value)}
              className="w-full p-3 rounded-lg bg-zinc-800 outline-none"
            />
          </div>

          {/* Poster URL */}
          <div>
            <label className="block mb-2 font-semibold">
              Poster URL
            </label>

            <input
              type="url"
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
              className="w-full p-3 rounded-lg bg-zinc-800 outline-none"
              placeholder="https://..."
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
              onChange={(e) => setVideoUrl(e.target.value)}
              className="w-full p-3 rounded-lg bg-zinc-800 outline-none"
              placeholder="https://example.com/movie.mp4"
            />

            <p className="text-sm text-zinc-500 mt-2">
              Authorized/licensed video URL yahan add karo.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">

            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/dashboard/movies")}
              className="bg-zinc-700 hover:bg-zinc-600 px-6 rounded-lg font-bold"
            >
              Cancel
            </button>

          </div>

        </form>
      </div>
    </main>
  );
}