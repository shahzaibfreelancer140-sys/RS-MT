import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - All Seasons
export async function GET() {
  try {
    const seasons = await prisma.season.findMany({
      include: {
        tvShow: true,
      },
      orderBy: [
        {
          tvShowId: "asc",
        },
        {
          number: "asc",
        },
      ],
    });

    return NextResponse.json(seasons);
  } catch (error) {
    console.error("SEASONS GET ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to get seasons",
      },
      {
        status: 500,
      }
    );
  }
}

// POST - Add Season
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const tvShowId = Number(body.tvShowId);
    const seasonNumber = Number(body.number);

    if (isNaN(tvShowId)) {
      return NextResponse.json(
        {
          message: "Invalid TV Show ID",
        },
        {
          status: 400,
        }
      );
    }

    if (isNaN(seasonNumber)) {
      return NextResponse.json(
        {
          message: "Invalid season number",
        },
        {
          status: 400,
        }
      );
    }

    // Check TV Show
    const tvShow = await prisma.tVShow.findUnique({
      where: {
        id: tvShowId,
      },
    });

    if (!tvShow) {
      return NextResponse.json(
        {
          message: "TV Show not found",
        },
        {
          status: 404,
        }
      );
    }

    // Check duplicate season
    const existingSeason = await prisma.season.findFirst({
      where: {
        tvShowId: tvShowId,
        number: seasonNumber,
      },
    });

    if (existingSeason) {
      return NextResponse.json(
        {
          message: "Season already exists",
          season: existingSeason,
        },
        {
          status: 409,
        }
      );
    }

    // Create Season
    const season = await prisma.season.create({
      data: {
        number: seasonNumber,
        title: body.title || null,
        description: body.description || null,
        tvShowId: tvShowId,
      },
    });

    return NextResponse.json(season, {
      status: 201,
    });
  } catch (error: any) {
    console.error("SEASON POST ERROR:", error);

    return NextResponse.json(
      {
        message: error.message || "Failed to add season",
      },
      {
        status: 500,
      }
    );
  }
}