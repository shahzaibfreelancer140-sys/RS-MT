import Link from "next/link";
import TVShowSearch from "@/components/TVShowSearch";

type TVShow = {
  id: number;
  name: string;
  poster_path: string | null;
  vote_average: number;
  first_air_date: string;
};

async function getTVShows(type: string) {
  const token = process.env.TMDB_ACCESS_TOKEN;

  if (!token) {
    throw new Error("TMDB_ACCESS_TOKEN is missing");
  }

  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${type}?language=en-US&page=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        accept: "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch ${type}`);
  }

  const data = await response.json();

  return data.results as TVShow[];
}

function TVShowCard({ show }: { show: TVShow }) {
  return (
    <Link
      href={`/tvshows/tmdb/${show.id}`}
      className="group block min-w-0 max-w-full overflow-hidden"
    >
      <div className="w-full max-w-full overflow-hidden rounded-xl bg-zinc-900">
        {show.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
            alt={show.name}
            className="
              block
              w-full
              max-w-full
              aspect-[2/3]
              object-cover
              group-hover:scale-105
              transition
              duration-300
            "
          />
        ) : (
          <div
            className="
              w-full
              aspect-[2/3]
              bg-zinc-800
              flex
              items-center
              justify-center
              text-zinc-500
            "
          >
            No Poster
          </div>
        )}
      </div>

      <h2 className="mt-3 font-semibold text-lg truncate">
        {show.name}
      </h2>

      <div className="flex min-w-0 justify-between gap-2 text-sm mt-1">
        <span className="text-zinc-500 shrink-0">
          {show.first_air_date
            ? show.first_air_date.substring(0, 4)
            : "N/A"}
        </span>

        <span className="text-yellow-400 shrink-0">
          ⭐ {show.vote_average?.toFixed(1)}
        </span>
      </div>
    </Link>
  );
}

function Section({
  title,
  shows,
}: {
  title: string;
  shows: TVShow[];
}) {
  if (!shows?.length) return null;

  return (
    <section className="mb-14 w-full max-w-full min-w-0">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">
        {title}
      </h2>

      <div
        className="
          grid
          w-full
          max-w-full
          min-w-0
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-6
          gap-3
          sm:gap-6
        "
      >
        {shows.map((show) => (
          <TVShowCard
            key={show.id}
            show={show}
          />
        ))}
      </div>
    </section>
  );
}

export default async function TVShowsPage() {
  const [
    popular,
    airingToday,
    topRated,
    onTheAir,
  ] = await Promise.all([
    getTVShows("popular"),
    getTVShows("airing_today"),
    getTVShows("top_rated"),
    getTVShows("on_the_air"),
  ]);

  return (
    <main
      className="
        min-h-screen
        w-full
        max-w-full
        overflow-x-hidden
        bg-black
        text-white
        px-4
        sm:px-6
        md:px-10
        py-8
        sm:py-10
      "
    >
      <div
        className="
          w-full
          max-w-7xl
          min-w-0
          mx-auto
          overflow-x-hidden
        "
      >
        {/* BACK BUTTON */}

        <Link
          href="/"
          className="
            inline-flex
            items-center
            gap-2
            mb-6
            sm:mb-8
            px-4
            sm:px-5
            py-2.5
            sm:py-3
            rounded-xl
            bg-zinc-900/80
            border
            border-zinc-800
            text-zinc-300
            hover:text-white
            hover:bg-zinc-800
            hover:border-zinc-700
            transition-all
            duration-300
          "
        >
          <span className="text-lg">
            ←
          </span>

          <span>
            Back to Home
          </span>
        </Link>

        {/* PAGE TITLE */}

        <div className="mb-8 sm:mb-10 min-w-0">
          <h1 className="text-4xl sm:text-5xl font-bold">
            TV Shows
          </h1>

          <p className="text-zinc-400 mt-2">
            Discover TV Shows
          </p>
        </div>

        {/* SEARCH */}

        <div className="w-full max-w-full min-w-0">
          <TVShowSearch />
        </div>

        {/* SECTIONS */}

        <Section
          title="🔥 Popular TV Shows"
          shows={popular}
        />

        <Section
          title="📺 Airing Today"
          shows={airingToday}
        />

        <Section
          title="⭐ Top Rated"
          shows={topRated}
        />

        <Section
          title="🚀 On The Air"
          shows={onTheAir}
        />
      </div>
    </main>
  );
}