"use client";

import { useState } from "react";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaExpand,
} from "react-icons/fa";

export default function GalleryViewer({ media }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const selectedMedia =
    selectedIndex !== null ? media[selectedIndex] : null;

  function openMedia(index) {
    setSelectedIndex(index);
  }

  function closeMedia() {
    setSelectedIndex(null);
  }

  function previousMedia() {
    setSelectedIndex((prev) =>
      prev === 0 ? media.length - 1 : prev - 1
    );
  }

  function nextMedia() {
    setSelectedIndex((prev) =>
      prev === media.length - 1 ? 0 : prev + 1
    );
  }

  function fullscreenVideo(id) {
    const video = document.getElementById(id);

    if (video?.requestFullscreen) {
      video.requestFullscreen();
    }
  }

  return (
    <>
      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
        {media.map((item, index) => (
          <div
            key={item.id}
            className="break-inside-avoid mb-4 bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
            onClick={() => openMedia(index)}
          >
            {item.file_type === "video" ? (
              <video
                preload="metadata"
                className="w-full h-auto object-cover"
              >
                <source src={item.file_url} />
              </video>
            ) : (
              <img
                src={item.file_url}
                alt="Gallery Media"
                loading="lazy"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
              />
            )}
          </div>
        ))}
      </div>

      {selectedMedia && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button
            onClick={closeMedia}
            className="absolute top-5 right-5 text-white text-3xl"
          >
            <FaTimes />
          </button>

          <button
            onClick={previousMedia}
            className="absolute left-5 text-white text-3xl"
          >
            <FaChevronLeft />
          </button>

          <button
            onClick={nextMedia}
            className="absolute right-5 text-white text-3xl"
          >
            <FaChevronRight />
          </button>

          {selectedMedia.file_type === "video" ? (
            <div className="relative w-full max-w-6xl">
              <video
                id="gallery-video"
                controls
                autoPlay
                className="w-full max-h-[85vh] rounded-xl"
              >
                <source src={selectedMedia.file_url} />
              </video>

              <button
                onClick={() => fullscreenVideo("gallery-video")}
                className="absolute top-4 right-4 bg-black/70 text-white p-3 rounded-full"
              >
                <FaExpand />
              </button>
            </div>
          ) : (
            <img
              src={selectedMedia.file_url}
              alt="Gallery Media"
              loading="lazy"
              className="max-w-full max-h-[85vh] rounded-xl object-contain"
            />
          )}
        </div>
      )}
    </>
  );
}
