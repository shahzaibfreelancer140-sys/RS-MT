"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditMoviePage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

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
        alert("Movie load nahi hui");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    getMovie();
  }, [id, router]);

  async function updateMovie(e: React.FormEvent) {
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
        throw new Error(
          data.error || "Movie update nahi hui"
        );
      }

      alert("Movie updated successfully ✅");

      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      console.error("UPDATE MOVIE ERROR:", error);

      alert(
        error.message || "Movie update nahi hui ❌"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl text-zinc-400">
          Loading movie...
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
          Edit Movie
        </h1>

        <form
          onSubmit={updateMovie}
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
              onChange={(e) =>
                setReleaseYear(e.target.value)
              }
              className="w-full bg-zinc-800 rounded-lg px-4 py-3 outline-none"
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

          {/* Video */}
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
              className="w-full bg-zinc-800 rounded-lg px-4 py-3 outline-none"
            />
          </div>

          {/* Button */}
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