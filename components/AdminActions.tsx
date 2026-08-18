"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  type: "movie" | "tvshow";
  id: number;
};

export default function AdminActions({ type, id }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    const name = type === "movie" ? "Movie" : "TV Show";

    const confirmed = confirm(
      `Kya aap "${name}" ko delete karna chahte hain?`
    );

    if (!confirmed) return;

    setDeleting(true);

    try {
      const endpoint =
        type === "movie"
          ? `/api/movies/${id}`
          : `/api/tvshows/${id}`;

      const res = await fetch(endpoint, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || data.message || "Delete failed"
        );
      }

      alert(`${name} deleted successfully ✅`);

      router.refresh();
    } catch (error: any) {
      console.error("DELETE ERROR:", error);
      alert(error.message || "Delete failed ❌");
    } finally {
      setDeleting(false);
    }
  }

  const editUrl =
    type === "movie"
      ? `/movies/edit/${id}`
      : `/tvshows/edit/${id}`;

  return (
    <div className="flex gap-2 mt-3">

      <Link
        href={editUrl}
        className="flex-1 text-center bg-blue-600 hover:bg-blue-700 rounded-lg py-2 text-sm font-semibold"
      >
        ✏️ Edit
      </Link>

      <button
        onClick={handleDelete}
        disabled={deleting}
        className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg py-2 text-sm font-semibold"
      >
        {deleting ? "Deleting..." : "🗑️ Delete"}
      </button>

    </div>
  );
}