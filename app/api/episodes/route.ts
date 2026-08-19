import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

// GET - All Episodes
// Public
export async function GET() {
  try {
    const episodes = await prisma.episode.findMany({
      include: {
        season: {
          include: {
            tvShow: true,
          },
        },
      },
      orderBy: {
        number: "asc",
      },
    });

    return NextResponse.json(episodes);
  } catch (error) {
    console.error("EPISODES GET ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to get episodes",
      },
      {
        status: 500,
      }
    );
  }
}

// POST - Add Episode
// Admin only
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

    const seasonId = Number(body.seasonId);
    const episodeNumber = Number(body.number);

    if (isNaN(seasonId)) {
      return NextResponse.json(
        {
          message: "Invalid season ID",
        },
        {
          status: 400,
        }
      );
    }

    if (isNaN(episodeNumber)) {
      return NextResponse.json(
        {
          message: "Invalid episode number",
        },
        {
          status: 400,
        }
      );
    }

    // Check season
    const season = await prisma.season.findUnique({
      where: {
        id: seasonId,
      },
    });

    if (!season) {
      return NextResponse.json(
        {
          message: "Season not found",
        },
        {
          status: 404,
        }
      );
    }

    // Check duplicate episode
    const existingEpisode = await prisma.episode.findFirst({
      where: {
        seasonId: seasonId,
        number: episodeNumber,
      },
    });

    if (existingEpisode) {
      return NextResponse.json(
        {
          message: "Episode already exists",
          episode: existingEpisode,
        },
        {
          status: 409,
        }
      );
    }

    // Create episode
    const episode = await prisma.episode.create({
      data: {
        number: episodeNumber,
        title: body.title || `Episode ${episodeNumber}`,
        description: body.description || "",
        videoUrl: body.videoUrl || "",
        duration: body.duration
          ? Number(body.duration)
          : null,
        seasonId: seasonId,
      },
    });

    return NextResponse.json(episode, {
      status: 201,
    });
  } catch (error: any) {
    console.error("EPISODE POST ERROR:", error);

    return NextResponse.json(
      {
        message:
          error.message || "Failed to add episode",
      },
      {
        status: 500,
      }
    );
  }
}