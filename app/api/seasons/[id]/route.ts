import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - Single Season
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const seasonId = Number(id);

    if (isNaN(seasonId)) {
      return NextResponse.json(
        { message: "Invalid season ID" },
        { status: 400 }
      );
    }

    const season = await prisma.season.findUnique({
      where: {
        id: seasonId,
      },
      include: {
        tvShow: true,
        episodes: true,
      },
    });

    if (!season) {
      return NextResponse.json(
        { message: "Season not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(season);
  } catch (error) {
    console.error("GET SEASON ERROR:", error);

    return NextResponse.json(
      { message: "Failed to get season" },
      { status: 500 }
    );
  }
}

// PUT - Update Season
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const seasonId = Number(id);

    if (isNaN(seasonId)) {
      return NextResponse.json(
        { message: "Invalid season ID" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const {
      number,
      title,
      description,
      tvShowId,
    } = body;

    const season = await prisma.season.findUnique({
      where: {
        id: seasonId,
      },
    });

    if (!season) {
      return NextResponse.json(
        { message: "Season not found" },
        { status: 404 }
      );
    }

    const updatedSeason = await prisma.season.update({
      where: {
        id: seasonId,
      },
      data: {
        number: Number(number),
        title: title || null,
        description: description || null,
        tvShowId: Number(tvShowId),
      },
    });

    return NextResponse.json(updatedSeason);
  } catch (error) {
    console.error("UPDATE SEASON ERROR:", error);

    return NextResponse.json(
      { message: "Failed to update season" },
      { status: 500 }
    );
  }
}

// DELETE - Delete Season + Episodes
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const seasonId = Number(id);

    if (isNaN(seasonId)) {
      return NextResponse.json(
        { message: "Invalid season ID" },
        { status: 400 }
      );
    }

    const season = await prisma.season.findUnique({
      where: {
        id: seasonId,
      },
      include: {
        episodes: true,
      },
    });

    if (!season) {
      return NextResponse.json(
        { message: "Season not found" },
        { status: 404 }
      );
    }

    // Pehle episodes delete
    await prisma.episode.deleteMany({
      where: {
        seasonId: seasonId,
      },
    });

    // Phir season delete
    await prisma.season.delete({
      where: {
        id: seasonId,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Season and its episodes deleted successfully",
    });
  } catch (error) {
    console.error("DELETE SEASON ERROR:", error);

    return NextResponse.json(
      { message: "Failed to delete season" },
      { status: 500 }
    );
  }
}