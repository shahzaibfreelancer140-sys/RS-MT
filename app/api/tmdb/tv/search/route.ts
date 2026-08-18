import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("query");

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    const token = process.env.TMDB_ACCESS_TOKEN;

    if (!token) {
      return NextResponse.json(
        { message: "TMDB_ACCESS_TOKEN is missing" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(
        query
      )}&language=en-US&page=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("TMDB TV SEARCH ERROR:", errorText);

      return NextResponse.json(
        { message: "TMDB TV search failed" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("TV SEARCH ERROR:", error);

    return NextResponse.json(
      { message: "Failed to search TV Shows" },
      { status: 500 }
    );
  }
}