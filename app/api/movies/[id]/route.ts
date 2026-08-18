import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - single movie
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const movieId = Number(id);

    if (isNaN(movieId)) {
      return NextResponse.json(
        { error: "Invalid movie ID" },
        { status: 400 }
      );
    }

    const movie = await prisma.movie.findUnique({
      where: {
        id: movieId,
      },
    });

    if (!movie) {
      return NextResponse.json(
        { error: "Movie not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(movie);
  } catch (error) {
    console.error("GET MOVIE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to get movie" },
      { status: 500 }
    );
  }
}

// PUT - update movie
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const movieId = Number(id);

    if (isNaN(movieId)) {
      return NextResponse.json(
        { error: "Invalid movie ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const {
      title,
      description,
      genre,
      releaseYear,
      posterUrl,
      videoUrl,
    } = body;

    const movie = await prisma.movie.findUnique({
      where: {
        id: movieId,
      },
    });

    if (!movie) {
      return NextResponse.json(
        { error: "Movie not found" },
        { status: 404 }
      );
    }

    const updatedMovie = await prisma.movie.update({
      where: {
        id: movieId,
      },
      data: {
        title,
        description,
        genre,
        releaseYear: Number(releaseYear),
        posterUrl,
        videoUrl,
      },
    });

    return NextResponse.json(updatedMovie);
  } catch (error) {
    console.error("UPDATE MOVIE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to update movie" },
      { status: 500 }
    );
  }
}

// DELETE - delete movie
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const movieId = Number(id);

    if (isNaN(movieId)) {
      return NextResponse.json(
        { error: "Invalid movie ID" },
        { status: 400 }
      );
    }

    const movie = await prisma.movie.findUnique({
      where: {
        id: movieId,
      },
    });

    if (!movie) {
      return NextResponse.json(
        { error: "Movie not found" },
        { status: 404 }
      );
    }

    await prisma.movie.delete({
      where: {
        id: movieId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    console.error("DELETE MOVIE ERROR:", error);

    return NextResponse.json(
      { error: "Failed to delete movie" },
      { status: 500 }
    );
  }
}