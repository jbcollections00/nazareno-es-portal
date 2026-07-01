"use client";

import { useState } from "react";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
} from "react-icons/fa";

export default function GalleryViewer({
  media,
}) {
  const [selectedIndex, setSelectedIndex] =
    useState(null);

  const selectedMedia =
    selectedIndex !== null
      ? media[selectedIndex]
      : null;

  const openMedia = (index) => {
    setSelectedIndex(index);
  };

  const closeMedia = () => {
    setSelectedIndex(null);
  };

  const previousMedia = () => {
    setSelectedIndex((prev) =>
      prev === 0
        ? media.length - 1
        : prev - 1
    );
  };

  const nextMedia = () => {
    setSelectedIndex((prev) =>
      prev === media.length - 1
        ? 0
        : prev + 1
    );
  };

  const fullscreenVideo = () => {
    const video =
      document.getElementById(
        "gallery-video"
      );

    if (
      video &&
      video.requestFullscreen
    ) {
      video.requestFullscreen();
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {media.map((item, index) => (
          <div
            key={item.id}
            onClick={() =>
              openMedia(index)
            }
            className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
          >
            {item.file_type ===
            "video" ? (
              <video
                preload="metadata"
                className="w-full aspect-square object-cover bg-black"
              >
                <source
                  src={item.file_url}
                  type="video/mp4"
                />
              </video>
            ) : (
              <img
                src={item.file_url}
                alt="Gallery Media"
                loading="lazy"
                className="w-full aspect-square object-cover hover:scale-105 transition-transform duration-300"
              />
            )}
          </div>
        ))}
      </div>

      {selectedMedia && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={closeMedia}
            className="absolute top-5 right-5 text-white text-3xl z-50"
          >
            <FaTimes />
          </button>

          {media.length > 1 && (
            <>
              <button
                onClick={previousMedia}
                className="absolute left-5 text-white text-3xl z-50"
              >
                <FaChevronLeft />
              </button>

              <button
                onClick={nextMedia}
                className="absolute right-5 text-white text-3xl z-50"
              >
                <FaChevronRight />
              </button>
            </>
          )}

          {selectedMedia.file_type ===
          "video" ? (
            <div className="relative w-full max-w-6xl">
              <video
                id="gallery-video"
                controls
                autoPlay
                className="w-full max-h-[85vh] rounded-xl"
              >
                <source
                  src={
                    selectedMedia.file_url
                  }
                  type="video/mp4"
                />
                Your browser does not
                support the video tag.
              </video>

              <button
                onClick={
                  fullscreenVideo
                }
                className="absolute top-4 right-4 bg-black/70 text-white p-3 rounded-full"
              >
                <FaExpand />
              </button>
            </div>
          ) : (
            <img
              src={
                selectedMedia.file_url
              }
              alt="Gallery Media"
              className="max-w-full max-h-[85vh] rounded-xl"
            />
          )}
        </div>
      )}
    </>
  );
}