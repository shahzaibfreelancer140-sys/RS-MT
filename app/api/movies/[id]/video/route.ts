import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Admin authentication
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
    const { id } = await params;
    const movieId = Number(id);

    if (isNaN(movieId)) {
      return NextResponse.json(
        {
          message: "Invalid movie ID",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    if (!body.videoUrl) {
      return NextResponse.json(
        {
          message: "Video URL is required",
        },
        {
          status: 400,
        }
      );
    }

    const movie = await prisma.movie.update({
      where: {
        id: movieId,
      },
      data: {
        videoUrl: body.videoUrl,
      },
    });

    return NextResponse.json(movie);
  } catch (error: any) {
    console.error("VIDEO UPDATE ERROR:", error);

    return NextResponse.json(
      {
        message: error.message || "Failed to update video",
      },
      {
        status: 500,
      }
    );
  }
}