"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";

type Props = {
  movieId: number;
};

export default function VideoUploadForMovie({
  movieId,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function saveVideo(url: string) {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/movies/${movieId}/video`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            videoUrl: url,
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Video save failed");
      }

      alert("Video successfully added ✅");

      window.location.reload();
    } catch (error) {
      console.error("VIDEO SAVE ERROR:", error);
      alert("Video save nahi hui ❌");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CldUploadWidget
      uploadPreset="movie_upload"
      options={{
        resourceType: "video",
        maxFiles: 1,
      }}
      onSuccess={(result: any) => {
        const url = result?.info?.secure_url;

        if (!url) {
          alert("Cloudinary video URL nahi mila ❌");
          return;
        }

        saveVideo(url);
      }}
    >
      {({ open }) => (
        <button
          type="button"
          disabled={loading}
          onClick={() => open()}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold disabled:opacity-50"
        >
          {loading ? "Saving Video..." : "🎬 Upload Video"}
        </button>
      )}
    </CldUploadWidget>
  );
}