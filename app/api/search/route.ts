import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get("q")?.trim() || "";

    if (!query) {
      return NextResponse.json({
        movies: [],
        tvShows: [],
      });
    }

    const [movies, tvShows] = await Promise.all([
      prisma.movie.findMany({
        where: {
          title: {
            contains: query,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      }),

      prisma.tVShow.findMany({
        where: {
          title: {
            contains: query,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
      }),
    ]);

    return NextResponse.json({
      movies,
      tvShows,
    });
  } catch (error) {
    console.error("SEARCH API ERROR:", error);

    return NextResponse.json(
      {
        message: "Search failed",
        movies: [],
        tvShows: [],
      },
      {
        status: 500,
      }
    );
  }
}