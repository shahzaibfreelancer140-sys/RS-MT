"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type SearchMovie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  media_type?: "movie";
};

type SearchTV = {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date?: string;
  media_type?: "tv";
};

export default function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  const [movies, setMovies] = useState<SearchMovie[]>([]);
  const [tvShows, setTvShows] = useState<SearchTV[]>([]);
  const [loading, setLoading] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  // =========================
  // Scroll Effect
  // =========================

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // =========================
  // TMDB Live Search
  // =========================

  useEffect(() => {
    const searchTMDB = async () => {
      const value = query.trim();

      if (!value) {
        setMovies([]);
        setTvShows([]);
        return;
      }

      setLoading(true);

      try {
        const res = await fetch(
          `/api/tmdb-search?query=${encodeURIComponent(value)}`
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Search failed");
        }

        setMovies(data.movies || []);
        setTvShows(data.tvShows || []);
      } catch (error) {
        console.error("SEARCH ERROR:", error);

        setMovies([]);
        setTvShows([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(searchTMDB, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // =========================
  // Search Submit
  // =========================

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    if (!query.trim()) return;

    router.push(`/search?q=${encodeURIComponent(query.trim())}`);

    setSearchOpen(false);
    setMobileMenuOpen(false);
  }

  // =========================
  // Open Movie
  // =========================

  function openMovie(id: number) {
    setSearchOpen(false);
    setMobileMenuOpen(false);
    setQuery("");

    router.push(`/movies/tmdb/${id}`);
  }

  // =========================
  // Open TV Show
  // =========================

  function openTVShow(id: number) {
    setSearchOpen(false);
    setMobileMenuOpen(false);
    setQuery("");

    router.push(`/tvshows/tmdb/${id}`);
  }

  // =========================
  // Mobile Navigation
  // =========================

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-[100]
        text-white
        transition-all duration-500 ease-out
        ${
          scrolled
            ? "bg-black/55 backdrop-blur-xl border-b border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.35)]"
            : "bg-black/10 backdrop-blur-[6px] border-b border-white/5"
        }
      `}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* =========================
            MAIN NAVBAR
        ========================= */}

        <div className="h-[72px] flex items-center justify-between gap-4">

          {/* =========================
              LOGO
          ========================= */}

          <Link
            href="/"
            onClick={closeMobileMenu}
            className="
              relative
              text-2xl sm:text-3xl
              font-black
              text-red-600
              tracking-tight
              shrink-0
              transition-all duration-300
              hover:scale-105
            "
          >
            RS-MT

            {/* Logo Glow */}
            <span
              className="
                absolute
                -inset-2
                rounded-xl
                bg-red-600/10
                blur-xl
                opacity-0
                hover:opacity-100
                transition-opacity
                duration-500
                -z-10
              "
            />
          </Link>

          {/* =========================
              DESKTOP MENU
          ========================= */}

          <div className="hidden md:flex items-center gap-2">

            <Link
              href="/"
              className="
                px-4 py-2
                rounded-lg
                text-sm font-medium
                text-zinc-300
                hover:text-white
                hover:bg-white/10
                transition-all duration-300
              "
            >
              Home
            </Link>

            <Link
              href="/movies"
              className="
                px-4 py-2
                rounded-lg
                text-sm font-medium
                text-zinc-300
                hover:text-white
                hover:bg-white/10
                transition-all duration-300
              "
            >
              Movies
            </Link>

            <Link
              href="/tvshows"
              className="
                px-4 py-2
                rounded-lg
                text-sm font-medium
                text-zinc-300
                hover:text-white
                hover:bg-white/10
                transition-all duration-300
              "
            >
              TV Shows
            </Link>

            <Link
              href="/dashboard"
              className="
                px-4 py-2
                rounded-lg
                text-sm font-medium
                text-zinc-300
                hover:text-white
                hover:bg-white/10
                transition-all duration-300
              "
            >
              Dashboard
            </Link>

          </div>

          {/* =========================
              RIGHT SIDE
          ========================= */}

          <div className="flex items-center gap-2">

            {/* SEARCH BUTTON */}

            <button
              type="button"
              onClick={() => {
                setSearchOpen((prev) => !prev);
                setMobileMenuOpen(false);
              }}
              className="
                w-10 h-10 sm:w-11 sm:h-11
                rounded-full
                bg-white/5
                border border-white/10
                backdrop-blur-md
                flex items-center justify-center
                hover:bg-red-600
                hover:border-red-500
                hover:scale-105
                transition-all duration-300
              "
              aria-label="Search"
            >
              <span
                className={`
                  transition-all duration-300
                  ${searchOpen ? "rotate-90" : "rotate-0"}
                `}
              >
                {searchOpen ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6L6 18" />
                    <path d="M6 6L18 18" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20L16.5 16.5" />
                  </svg>
                )}
              </span>
            </button>

            {/* =========================
                MOBILE TOGGLE
            ========================= */}

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="
                md:hidden
                relative
                w-10 h-10
                rounded-full
                bg-white/5
                border border-white/10
                backdrop-blur-md
                flex items-center justify-center
                hover:bg-white/10
                transition-all duration-300
              "
              aria-label="Menu"
              aria-expanded={mobileMenuOpen}
            >
              <div className="w-5 h-4 relative">

                <span
                  className={`
                    absolute left-0 top-0
                    w-5 h-[2px]
                    bg-white rounded-full
                    transition-all duration-300
                    ${
                      mobileMenuOpen
                        ? "rotate-45 top-[7px]"
                        : ""
                    }
                  `}
                />

                <span
                  className={`
                    absolute left-0 top-[7px]
                    w-5 h-[2px]
                    bg-white rounded-full
                    transition-all duration-300
                    ${
                      mobileMenuOpen
                        ? "opacity-0 scale-0"
                        : "opacity-100"
                    }
                  `}
                />

                <span
                  className={`
                    absolute left-0 top-[14px]
                    w-5 h-[2px]
                    bg-white rounded-full
                    transition-all duration-300
                    ${
                      mobileMenuOpen
                        ? "-rotate-45 top-[7px]"
                        : ""
                    }
                  `}
                />

              </div>
            </button>

          </div>

        </div>

        {/* =========================
            MOBILE MENU
        ========================= */}

        <div
          className={`
            md:hidden
            overflow-hidden
            transition-all duration-500 ease-out
            ${
              mobileMenuOpen
                ? "max-h-[400px] opacity-100 pb-5"
                : "max-h-0 opacity-0"
            }
          `}
        >

          <div
            className="
              mt-2
              p-3
              rounded-2xl
              bg-black/50
              backdrop-blur-2xl
              border border-white/10
              shadow-2xl
            "
          >

            <div className="flex flex-col gap-1">

              <Link
                href="/"
                onClick={closeMobileMenu}
                className="
                  flex items-center
                  px-4 py-3.5
                  rounded-xl
                  text-zinc-300
                  hover:text-white
                  hover:bg-red-600/20
                  hover:translate-x-1
                  transition-all duration-300
                "
              >
                <span className="mr-3">⌂</span>
                Home
              </Link>

              <Link
                href="/movies"
                onClick={closeMobileMenu}
                className="
                  flex items-center
                  px-4 py-3.5
                  rounded-xl
                  text-zinc-300
                  hover:text-white
                  hover:bg-red-600/20
                  hover:translate-x-1
                  transition-all duration-300
                "
              >
                <span className="mr-3">🎬</span>
                Movies
              </Link>

              <Link
                href="/tvshows"
                onClick={closeMobileMenu}
                className="
                  flex items-center
                  px-4 py-3.5
                  rounded-xl
                  text-zinc-300
                  hover:text-white
                  hover:bg-red-600/20
                  hover:translate-x-1
                  transition-all duration-300
                "
              >
                <span className="mr-3">📺</span>
                TV Shows
              </Link>

              <Link
                href="/dashboard"
                onClick={closeMobileMenu}
                className="
                  flex items-center
                  px-4 py-3.5
                  rounded-xl
                  text-zinc-300
                  hover:text-white
                  hover:bg-red-600/20
                  hover:translate-x-1
                  transition-all duration-300
                "
              >
                <span className="mr-3">⚙️</span>
                Dashboard
              </Link>

            </div>

          </div>

        </div>

        {/* =========================
            SEARCH
        ========================= */}

        <div
          className={`
            overflow-visible
            transition-all duration-500 ease-out
            ${
              searchOpen
                ? "max-h-[650px] opacity-100 pb-5"
                : "max-h-0 opacity-0 pointer-events-none"
            }
          `}
        >

          <div
            ref={searchRef}
            className="relative pt-1"
          >

            {/* Search Form */}

            <form onSubmit={handleSearch}>

              <div className="relative">

                <input
                  autoFocus={searchOpen}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search movies or TV shows..."
                  className="
                    w-full
                    bg-black/50
                    backdrop-blur-xl
                    border border-white/10
                    rounded-2xl
                    px-5 py-4
                    pr-14
                    text-white
                    placeholder:text-zinc-500
                    outline-none
                    focus:border-red-500/60
                    focus:ring-2
                    focus:ring-red-500/10
                    transition-all duration-300
                  "
                />

                <button
                  type="submit"
                  className="
                    absolute
                    right-2
                    top-1/2
                    -translate-y-1/2
                    w-10 h-10
                    rounded-xl
                    bg-red-600
                    hover:bg-red-700
                    hover:scale-105
                    flex items-center justify-center
                    transition-all duration-300
                  "
                >
                  <svg
                    width="19"
                    height="19"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="M20 20L16.5 16.5" />
                  </svg>
                </button>

              </div>

            </form>

            {/* =========================
                SEARCH SUGGESTIONS
            ========================= */}

            {query.trim() && (

              <div
                className="
                  absolute
                  left-0 right-0
                  mt-2
                  bg-black/90
                  backdrop-blur-2xl
                  border border-white/10
                  rounded-2xl
                  overflow-hidden
                  shadow-2xl
                  animate-[fadeIn_.25s_ease-out]
                "
              >

                {loading ? (

                  <div className="p-6 text-center text-zinc-400">
                    <div className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" />
                      <span
                        className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <span
                        className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />

                      <span className="ml-2">
                        Searching TMDB...
                      </span>
                    </div>
                  </div>

                ) : movies.length === 0 &&
                  tvShows.length === 0 ? (

                  <div className="p-6 text-center text-zinc-400">
                    No movies or TV shows found.
                  </div>

                ) : (

                  <div className="max-h-[500px] overflow-y-auto">

                    {/* =========================
                        MOVIES
                    ========================= */}

                    {movies.length > 0 && (

                      <div>

                        <div
                          className="
                            px-4 py-3
                            text-xs font-bold
                            uppercase
                            tracking-wider
                            text-zinc-500
                            border-b border-white/10
                          "
                        >
                          🎬 Movies
                        </div>

                        {movies.map((movie) => (

                          <button
                            key={`movie-${movie.id}`}
                            type="button"
                            onClick={() => openMovie(movie.id)}
                            className="
                              w-full
                              flex items-center
                              gap-4
                              px-4 py-3
                              hover:bg-white/5
                              transition-all duration-300
                              text-left
                              group
                            "
                          >

                            {movie.poster_path ? (

                              <img
                                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                alt={movie.title}
                                className="
                                  w-12 h-16
                                  rounded-md
                                  object-cover
                                  group-hover:scale-105
                                  transition-transform duration-300
                                "
                              />

                            ) : (

                              <div
                                className="
                                  w-12 h-16
                                  rounded-md
                                  bg-zinc-800
                                  flex items-center
                                  justify-center
                                  text-xs
                                  text-zinc-500
                                "
                              >
                                No Image
                              </div>

                            )}

                            <div className="min-w-0">

                              <h3 className="font-semibold truncate">
                                {movie.title}
                              </h3>

                              {movie.release_date && (
                                <p className="text-sm text-zinc-500 mt-1">
                                  {movie.release_date.substring(0, 4)}
                                </p>
                              )}

                              <p className="text-xs text-red-500 mt-1">
                                Movie
                              </p>

                            </div>

                          </button>

                        ))}

                      </div>

                    )}

                    {/* =========================
                        TV SHOWS
                    ========================= */}

                    {tvShows.length > 0 && (

                      <div>

                        <div
                          className="
                            px-4 py-3
                            text-xs font-bold
                            uppercase
                            tracking-wider
                            text-zinc-500
                            border-b border-white/10
                          "
                        >
                          📺 TV Shows
                        </div>

                        {tvShows.map((show) => (

                          <button
                            key={`tv-${show.id}`}
                            type="button"
                            onClick={() => openTVShow(show.id)}
                            className="
                              w-full
                              flex items-center
                              gap-4
                              px-4 py-3
                              hover:bg-white/5
                              transition-all duration-300
                              text-left
                              group
                            "
                          >

                            {show.poster_path ? (

                              <img
                                src={`https://image.tmdb.org/t/p/w92${show.poster_path}`}
                                alt={show.name}
                                className="
                                  w-12 h-16
                                  rounded-md
                                  object-cover
                                  group-hover:scale-105
                                  transition-transform duration-300
                                "
                              />

                            ) : (

                              <div
                                className="
                                  w-12 h-16
                                  rounded-md
                                  bg-zinc-800
                                  flex items-center
                                  justify-center
                                  text-xs
                                  text-zinc-500
                                "
                              >
                                No Image
                              </div>

                            )}

                            <div className="min-w-0">

                              <h3 className="font-semibold truncate">
                                {show.name}
                              </h3>

                              {show.first_air_date && (
                                <p className="text-sm text-zinc-500 mt-1">
                                  {show.first_air_date.substring(0, 4)}
                                </p>
                              )}

                              <p className="text-xs text-red-500 mt-1">
                                TV Show
                              </p>

                            </div>

                          </button>

                        ))}

                      </div>

                    )}

                  </div>

                )}

              </div>

            )}

          </div>

        </div>

      </nav>
    </header>
  );
}