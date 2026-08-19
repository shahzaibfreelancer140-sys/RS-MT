import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

// GET - Single TV Show
// Public
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tvShowId = Number(id);

    if (isNaN(tvShowId)) {
      return NextResponse.json(
        { message: "Invalid TV Show ID" },
        { status: 400 }
      );
    }

    const tvShow = await prisma.tVShow.findUnique({
      where: {
        id: tvShowId,
      },
      include: {
        seasons: {
          include: {
            episodes: true,
          },
          orderBy: {
            number: "asc",
          },
        },
      },
    });

    if (!tvShow) {
      return NextResponse.json(
        { message: "TV Show not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(tvShow);
  } catch (error) {
    console.error("GET TV SHOW ERROR:", error);

    return NextResponse.json(
      { message: "Failed to get TV Show" },
      { status: 500 }
    );
  }
}

// PUT - Update TV Show
// Admin only
export async function PUT(
  request: Request,
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
    const tvShowId = Number(id);

    if (isNaN(tvShowId)) {
      return NextResponse.json(
        { message: "Invalid TV Show ID" },
        { status: 400 }
      );
    }

    const body = await request.json();

    const tvShow = await prisma.tVShow.findUnique({
      where: {
        id: tvShowId,
      },
    });

    if (!tvShow) {
      return NextResponse.json(
        { message: "TV Show not found" },
        { status: 404 }
      );
    }

    const updatedTVShow = await prisma.tVShow.update({
      where: {
        id: tvShowId,
      },
      data: {
        title: body.title,
        description: body.description || "",
        posterUrl: body.posterUrl || "",
        genre: body.genre || "",
      },
    });

    return NextResponse.json(updatedTVShow);
  } catch (error) {
    console.error("UPDATE TV SHOW ERROR:", error);

    return NextResponse.json(
      { message: "Failed to update TV Show" },
      { status: 500 }
    );
  }
}

// DELETE - Delete TV Show
// Admin only
export async function DELETE(
  request: Request,
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
    const tvShowId = Number(id);

    if (isNaN(tvShowId)) {
      return NextResponse.json(
        { message: "Invalid TV Show ID" },
        { status: 400 }
      );
    }

    const tvShow = await prisma.tVShow.findUnique({
      where: {
        id: tvShowId,
      },
      include: {
        seasons: {
          include: {
            episodes: true,
          },
        },
      },
    });

    if (!tvShow) {
      return NextResponse.json(
        { message: "TV Show not found" },
        { status: 404 }
      );
    }

    // Delete episodes first
    for (const season of tvShow.seasons) {
      await prisma.episode.deleteMany({
        where: {
          seasonId: season.id,
        },
      });
    }

    // Delete seasons
    await prisma.season.deleteMany({
      where: {
        tvShowId: tvShowId,
      },
    });

    // Delete TV Show
    await prisma.tVShow.delete({
      where: {
        id: tvShowId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "TV Show deleted successfully",
    });
  } catch (error) {
    console.error("DELETE TV SHOW ERROR:", error);

    return NextResponse.json(
      { message: "Failed to delete TV Show" },
      { status: 500 }
    );
  }
}