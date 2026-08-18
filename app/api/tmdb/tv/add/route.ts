import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import AddTMDBTVButton from "@/components/AddTMDBTVButton";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const tmdbId = Number(body.tmdbId);

    if (!tmdbId) {
      return NextResponse.json(
        { message: "TMDB ID is required" },
        { status: 400 }
      );
    }

    const token = process.env.TMDB_ACCESS_TOKEN;

    if (!token) {
      return NextResponse.json(
        { message: "TMDB_ACCESS_TOKEN is missing" },
        { status: 500 }
      );
    }

    // TMDB se complete TV show data
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${tmdbId}?language=en-US`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { message: "TV Show TMDB se nahi mila" },
        { status: response.status }
      );
    }

    const show = await response.json();

    // TV Show create/update
    const tvShow = await prisma.tVShow.upsert({
      where: {
        tmdbId: tmdbId,
      },
      update: {
        title: show.name,
        description: show.overview || "",
        posterUrl: show.poster_path
          ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
          : "",
        genre:
          show.genres?.map((genre: any) => genre.name).join(", ") || "",
      },
      create: {
        tmdbId: tmdbId,
        title: show.name,
        description: show.overview || "",
        posterUrl: show.poster_path
          ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
          : "",
        genre:
          show.genres?.map((genre: any) => genre.name).join(", ") || "",
      },
    });

    // Seasons database mein add karo
    const seasons = show.seasons || [];

    for (const season of seasons) {
      if (season.season_number <= 0) continue;

      const existingSeason = await prisma.season.findFirst({
        where: {
          tvShowId: tvShow.id,
          number: season.season_number,
        },
      });

      if (existingSeason) {
        await prisma.season.update({
          where: {
            id: existingSeason.id,
          },
          data: {
            title: season.name || `Season ${season.season_number}`,
            description: "",
          },
        });
      } else {
        await prisma.season.create({
          data: {
            number: season.season_number,
            title: season.name || `Season ${season.season_number}`,
            description: "",
            tvShowId: tvShow.id,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: "TV Show and seasons added successfully",
      tvShow,
    });
  } catch (error) {
    console.error("ADD TMDB TV ERROR:", error);

    return NextResponse.json(
      { message: "TV Show add nahi ho saka" },
      { status: 500 }
    );
  }
}