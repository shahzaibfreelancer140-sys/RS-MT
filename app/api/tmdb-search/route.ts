import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const token = process.env.TMDB_ACCESS_TOKEN;

    if (!token) {
      return NextResponse.json(
        { message: "TMDB_ACCESS_TOKEN is missing" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.trim();

    if (!query) {
      return NextResponse.json({
        movies: [],
        tvShows: [],
      });
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
        query
      )}&language=en-US&page=1&include_adult=false`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: "TMDB search failed" },
        { status: response.status }
      );
    }

    const data = await response.json();

    const results = data.results || [];

    const movies = results
      .filter((item: any) => item.media_type === "movie")
      .slice(0, 5);

    const tvShows = results
      .filter((item: any) => item.media_type === "tv")
      .slice(0, 5);

    return NextResponse.json({
      movies,
      tvShows,
    });
  } catch (error) {
    console.error("TMDB SEARCH ERROR:", error);

    return NextResponse.json(
      {
        message: "Search failed",
        movies: [],
        tvShows: [],
      },
      { status: 500 }
    );
  }
}