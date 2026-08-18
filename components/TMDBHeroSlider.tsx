"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Item = {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  backdrop_path?: string | null;
  poster_path?: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  media_type: "movie" | "tv";
};

type Props = {
  items: Item[];
};

export default function TMDBHeroSlider({ items }: Props) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [items.length]);

  if (!items.length) return null;

  const item = items[current];

  const title = item.title || item.name || "Unknown";

  const year =
    item.release_date?.substring(0, 4) ||
    item.first_air_date?.substring(0, 4);

  const detailsUrl =
    item.media_type === "movie"
      ? `/movies/tmdb/${item.id}`
      : `/tvshows/tmdb/${item.id}`;

  return (
    <section className="relative h-[75vh] min-h-[600px] overflow-hidden bg-black">

      {/* Background */}
      {item.backdrop_path && (
        <div
          key={item.id}
          className="absolute inset-0 animate-[heroFade_0.8s_ease-in-out]"
        >
          <img
            src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20" />

      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-black/30" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-6 md:px-10 flex items-center">

        <div
          key={`content-${item.id}`}
          className="max-w-3xl animate-[heroContent_0.8s_ease-in-out]"
        >

          {/* Badge */}
          <div className="flex items-center gap-3 mb-5">

            <span className="bg-red-600 px-4 py-1 rounded-full text-xs md:text-sm font-bold">
              {item.media_type === "movie"
                ? "LATEST MOVIE"
                : "LATEST TV SHOW"}
            </span>

            {year && (
              <span className="text-zinc-300">
                {year}
              </span>
            )}

            {item.vote_average !== undefined && (
              <span className="text-yellow-400 font-semibold">
                ⭐ {item.vote_average.toFixed(1)}
              </span>
            )}

          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-tight">
            {title}
          </h1>

          {/* Description */}
          <p className="text-zinc-300 text-base md:text-xl leading-8 mt-6 max-w-2xl line-clamp-3">
            {item.overview || "Discover this title on RS-MT."}
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-4 mt-8">

            <Link
              href={detailsUrl}
              className="bg-red-600 hover:bg-red-700 px-7 py-3.5 rounded-xl font-bold transition transform hover:scale-105"
            >
              ▶ View Details
            </Link>

            <span className="border border-white/20 bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-xl text-sm">
              {item.media_type === "movie"
                ? "🎬 Movie"
                : "📺 TV Show"}
            </span>

          </div>

        </div>
      </div>

      {/* Dots */}
      <div className="absolute z-20 bottom-8 left-1/2 -translate-x-1/2 flex gap-2">

        {items.map((slide, index) => (
          <button
            key={`${slide.media_type}-${slide.id}`}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === current
                ? "w-8 bg-red-600"
                : "w-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}

      </div>

      {/* Previous */}
      <button
        onClick={() =>
          setCurrent(
            (current - 1 + items.length) % items.length
          )
        }
        className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 items-center justify-center text-2xl hover:bg-red-600 transition"
        aria-label="Previous"
      >
        ‹
      </button>

      {/* Next */}
      <button
        onClick={() =>
          setCurrent((current + 1) % items.length)
        }
        className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 items-center justify-center text-2xl hover:bg-red-600 transition"
        aria-label="Next"
      >
        ›
      </button>

    </section>
  );
}