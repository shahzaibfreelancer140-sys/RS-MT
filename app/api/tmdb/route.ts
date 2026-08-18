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

    const [popular, nowPlaying, topRated, upcoming] =
      await Promise.all([
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
      ]);

    if (
      !popular.ok ||
      !nowPlaying.ok ||
      !topRated.ok ||
      !upcoming.ok
    ) {
      throw new Error("TMDB request failed");
    }

    const data = await Promise.all([
      popular.json(),
      nowPlaying.json(),
      topRated.json(),
      upcoming.json(),
    ]);

    return NextResponse.json({
      popular: data[0].results,
      nowPlaying: data[1].results,
      topRated: data[2].results,
      upcoming: data[3].results,
    });
  } catch (error) {
    console.error("TMDB ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch TMDB movies",
        error: String(error),
      },
      { status: 500 }
    );
  }
}