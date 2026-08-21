import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = process.env.TMDB_ACCESS_TOKEN;

    if (!token) {
      return NextResponse.json(
        { message: "TMDB_ACCESS_TOKEN is missing" },
        { status: 500 }
      );
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      accept: "application/json",
    };

    const [
      popular,
      nowPlaying,
      topRated,
      upcoming,
      tvPopular,
      tvAiringToday,
    ] = await Promise.all([
      fetch(
        "https://api.themoviedb.org/3/movie/popular?language=en-US&page=1",
        { headers }
      ),

      fetch(
        "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
        { headers }
      ),

      fetch(
        "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
        { headers }
      ),

      fetch(
        "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1",
        { headers }
      ),

      fetch(
        "https://api.themoviedb.org/3/tv/popular?language=en-US&page=1",
        { headers }
      ),

      fetch(
        "https://api.themoviedb.org/3/tv/airing_today?language=en-US&page=1",
        { headers }
      ),
    ]);

    if (
      !popular.ok ||
      !nowPlaying.ok ||
      !topRated.ok ||
      !upcoming.ok ||
      !tvPopular.ok ||
      !tvAiringToday.ok
    ) {
      throw new Error("TMDB request failed");
    }

    const [
      popularData,
      nowPlayingData,
      topRatedData,
      upcomingData,
      tvPopularData,
      tvAiringTodayData,
    ] = await Promise.all([
      popular.json(),
      nowPlaying.json(),
      topRated.json(),
      upcoming.json(),
      tvPopular.json(),
      tvAiringToday.json(),
    ]);

    return NextResponse.json({
      popular: popularData.results,
      nowPlaying: nowPlayingData.results,
      topRated: topRatedData.results,
      upcoming: upcomingData.results,
      tvPopular: tvPopularData.results,
      tvAiringToday: tvAiringTodayData.results,
    });
  } catch (error) {
    console.error("TMDB ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch TMDB data",
        error: String(error),
      },
      { status: 500 }
    );
  }
}