import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

// GET - Single Episode
// Public
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const episodeId = Number(id);

    if (isNaN(episodeId)) {
      return NextResponse.json(
        { message: "Invalid episode ID" },
        { status: 400 }
      );
    }

    const episode = await prisma.episode.findUnique({
      where: {
        id: episodeId,
      },
      include: {
        season: {
          include: {
            tvShow: true,
          },
        },
      },
    });

    if (!episode) {
      return NextResponse.json(
        { message: "Episode not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(episode);
  } catch (error) {
    console.error("GET EPISODE ERROR:", error);

    return NextResponse.json(
      { message: "Failed to get episode" },
      { status: 500 }
    );
  }
}

// PUT - Update Episode
// Admin only
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const episodeId = Number(id);

    if (isNaN(episodeId)) {
      return NextResponse.json(
        { message: "Invalid episode ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const {
      seasonId,
      number,
      title,
      description,
      videoUrl,
      duration,
    } = body;

    const episode = await prisma.episode.findUnique({
      where: {
        id: episodeId,
      },
    });

    if (!episode) {
      return NextResponse.json(
        { message: "Episode not found" },
        { status: 404 }
      );
    }

    const updatedEpisode = await prisma.episode.update({
      where: {
        id: episodeId,
      },
      data: {
        seasonId: Number(seasonId),
        number: Number(number),
        title,
        description: description || null,
        videoUrl: videoUrl || "",
        duration: duration ? Number(duration) : null,
      },
    });

    return NextResponse.json(updatedEpisode);
  } catch (error) {
    console.error("UPDATE EPISODE ERROR:", error);

    return NextResponse.json(
      { message: "Failed to update episode" },
      { status: 500 }
    );
  }
}

// DELETE - Delete Episode
// Admin only
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const episodeId = Number(id);

    if (isNaN(episodeId)) {
      return NextResponse.json(
        { message: "Invalid episode ID" },
        { status: 400 }
      );
    }

    const episode = await prisma.episode.findUnique({
      where: {
        id: episodeId,
      },
    });

    if (!episode) {
      return NextResponse.json(
        { message: "Episode not found" },
        { status: 404 }
      );
    }

    await prisma.episode.delete({
      where: {
        id: episodeId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Episode deleted successfully",
    });
  } catch (error) {
    console.error("DELETE EPISODE ERROR:", error);

    return NextResponse.json(
      { message: "Failed to delete episode" },
      { status: 500 }
    );
  }
}