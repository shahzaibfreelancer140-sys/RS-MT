"use client";

import { CldUploadWidget } from "next-cloudinary";

type Props = {
  onSuccess: (url: string) => void;
};

export default function VideoUploader({ onSuccess }: Props) {
  return (
    <CldUploadWidget
      uploadPreset="movie_upload"
      options={{
        resourceType: "video",
        maxFiles: 1,
        maxChunkSize: 6000000,
      }}
      onSuccess={(result: any) => {
        const url = result?.info?.secure_url;

        if (url) {
          onSuccess(url);
        }
      }}
    >
      {({ open }) => (
        <button
          type="button"
          onClick={() => open()}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg font-bold"
        >
          Upload Large Movie
        </button>
      )}
    </CldUploadWidget>
  );
}