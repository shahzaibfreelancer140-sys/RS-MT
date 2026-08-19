import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

// GET - All Movies
export async function GET() {
  try {
    const movies = await prisma.movie.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(movies);
  } catch (error) {
    console.error("MOVIE GET ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to get movies",
      },
      {
        status: 500,
      }
    );
  }
}

// POST - Add Movie
export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const body = await request.json();

    console.log("BODY =>", body);

    const tmdbId = body.tmdbId
      ? Number(body.tmdbId)
      : null;

    // Check duplicate TMDB movie
    if (tmdbId) {
      const existingMovie = await prisma.movie.findFirst({
        where: {
          tmdbId: tmdbId,
        },
      });

      if (existingMovie) {
        return NextResponse.json(
          {
            message: "Movie already exists",
            movie: existingMovie,
          },
          {
            status: 409,
          }
        );
      }
    }

    // Create movie
    const movie = await prisma.movie.create({
      data: {
        title: body.title,
        description: body.description || "",
        posterUrl: body.posterUrl || "",
        videoUrl: body.videoUrl || "",
        genre: body.genre || "",
        releaseYear: parseInt(body.releaseYear) || 0,
        tmdbId: tmdbId,
      },
    });

    return NextResponse.json(movie, {
      status: 201,
    });
  } catch (error: any) {
    console.error("MOVIE ERROR =>", error);

    return NextResponse.json(
      {
        message: error.message || "Failed to add movie",
      },
      {
        status: 500,
      }
    );
  }
}