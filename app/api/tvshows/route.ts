import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

// GET - All TV Shows
// Public
export async function GET() {
  try {
    const tvShows = await prisma.tVShow.findMany({
      include: {
        seasons: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(tvShows);
  } catch (error) {
    console.error("TV SHOW GET ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to get TV Shows",
      },
      {
        status: 500,
      }
    );
  }
}

// POST - Add TV Show
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

    const tvShow = await prisma.tVShow.create({
      data: {
        title: body.title,
        description: body.description || "",
        posterUrl: body.posterUrl || "",
        genre: body.genre || "",
      },
    });

    return NextResponse.json(tvShow, {
      status: 201,
    });
  } catch (error: any) {
    console.error("TV SHOW POST ERROR:", error);

    return NextResponse.json(
      {
        message: error.message || "Failed to add TV Show",
      },
      {
        status: 500,
      }
    );
  }
}