import Link from "next/link";

type MovieCardProps = {
  id: number;
  title: string;
  image: string;
};

export default function MovieCard({
  id,
  title,
  image,
}: MovieCardProps) {
  return (
    <div className="group">
      {/* Poster */}
      <Link href={`/watch/movie/${id}`}>
        <div className="overflow-hidden rounded-xl bg-zinc-900">
          <img
            src={image}
            alt={title}
            className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition duration-300"
          />
        </div>
      </Link>

      {/* Title */}
      <h3 className="mt-3 text-lg font-semibold truncate">
        {title}
      </h3>

      {/* Watch Button */}
      <Link
        href={`/watch/movie/${id}`}
        className="mt-2 block w-full bg-red-600 hover:bg-red-700 py-2 rounded-lg text-center font-semibold transition"
      >
        ▶ Watch Now
      </Link>
    </div>
  );
}