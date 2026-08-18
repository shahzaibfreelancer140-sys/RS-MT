"use client";

import VideoUploader from "@/components/VideoUploader";
import { useState } from "react";

export default function AddMovie() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseYear, setReleaseYear] = useState("");

  const [poster, setPoster] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  const [videoUrl, setVideoUrl] = useState("");
  const [posterUrl, setPosterUrl] = useState("");

  async function uploadPoster(file: File) {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "movie_upload");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/ansahbbi/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.log(data);
      throw new Error(
        data.error?.message || "Poster Upload Failed"
      );
    }

    return data.secure_url;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!poster) {
      alert("Select Poster");
      return;
    }

    if (!videoUrl) {
      alert("Upload Video first");
      return;
    }

    setLoading(true);

    try {
      // Upload poster
      const uploadedPosterUrl = await uploadPoster(poster);

      setPosterUrl(uploadedPosterUrl);

      // Movie data
      const movie = {
        title,
        description,
        genre,
        releaseYear,
        posterUrl: uploadedPosterUrl,
        videoUrl: videoUrl,
      };

      console.log("MOVIE DATA =>", movie);

      // Save movie in Prisma
      const res = await fetch("/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(movie),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Movie Added Successfully ✅");

        setTitle("");
        setDescription("");
        setGenre("");
        setReleaseYear("");
        setPoster(null);
        setVideoUrl("");
        setPosterUrl("");
      } else {
        console.log(data);

        alert(
          data.message || "Failed to save movie."
        );
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Add New Movie
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Movie Title */}
          <input
            placeholder="Movie Title"
            className="w-full p-3 rounded bg-zinc-800"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            required
          />

          {/* Description */}
          <textarea
            placeholder="Description"
            className="w-full p-3 rounded bg-zinc-800 min-h-32"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            required
          />

          {/* Genre */}
          <input
            placeholder="Genre"
            className="w-full p-3 rounded bg-zinc-800"
            value={genre}
            onChange={(e) =>
              setGenre(e.target.value)
            }
            required
          />

          {/* Release Year */}
          <input
            placeholder="Release Year"
            type="number"
            className="w-full p-3 rounded bg-zinc-800"
            value={releaseYear}
            onChange={(e) =>
              setReleaseYear(e.target.value)
            }
            required
          />

          {/* Poster */}
          <div>
            <label className="block mb-2 font-semibold">
              Movie Poster
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setPoster(
                  e.target.files?.[0] || null
                )
              }
              required
            />
          </div>

          {/* Video */}
          <div>
            <label className="block mb-2 font-semibold">
              Movie Video
            </label>

            <VideoUploader
              onSuccess={(url) => {
                setVideoUrl(url);

                alert(
                  "Video Uploaded Successfully ✅"
                );
              }}
            />

            {videoUrl && (
              <div className="mt-4">

                <p className="text-green-400 mb-2">
                  ✅ Video uploaded successfully
                </p>

                <video
                  src={videoUrl}
                  controls
                  className="w-full rounded-xl max-h-96"
                />

              </div>
            )}
          </div>

          {/* Save */}
          <button
            type="submit"
            disabled={loading || !videoUrl}
            className="bg-red-600 hover:bg-red-700 w-full py-3 rounded-lg font-bold disabled:opacity-50"
          >
            {loading
              ? "Saving..."
              : "Save Movie"}
          </button>

        </form>

      </div>
    </div>
  );
}