export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();

    const file = data.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    
const result = await new Promise((resolve, reject) => {
  cloudinary.uploader
    .upload_stream(
      {
        resource_type: "video",
        folder: "elora-lume",
        chunk_size: 999999999, // 6MB chunks
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    )
    .end(buffer);
});

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("FULL ERROR =>", err);

    return NextResponse.json(
      {
        error: err.message,
      },
      { status: 500 }
    );
  }
}
