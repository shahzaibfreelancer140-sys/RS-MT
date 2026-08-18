import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const token = process.env.TMDB_ACCESS_TOKEN;

    if (!token) {
      return NextResponse.json(
        { message: "TMDB_ACCESS_TOKEN is missing" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/watch/providers`,
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
        { message: "Failed to get providers" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("TMDB PROVIDERS ERROR:", error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}