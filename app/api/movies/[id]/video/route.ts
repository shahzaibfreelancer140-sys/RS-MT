import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!body.videoUrl) {
      return NextResponse.json(
        { message: "Video URL is required" },
        { status: 400 }
      );
    }

    const movie = await prisma.movie.update({
      where: {
        id: Number(id),
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
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}