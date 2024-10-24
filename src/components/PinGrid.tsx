import React from 'react';
import Masonry from 'react-masonry-css';
import { Pin } from '../types';

interface PinGridProps {
  pins: Pin[];
}

export function PinGrid({ pins }: PinGridProps) {
  const breakpointColumns = {
    default: 5,
    1536: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 1
  };

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="flex -ml-4 w-auto"
      columnClassName="pl-4 bg-clip-padding"
    >
      {pins.map((pin) => (
        <div
          key={pin.id}
          className="mb-4 break-inside-avoid"
        >
          <div className="relative group rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-xl transition-shadow duration-300">
            <img
              src={pin.imageUrl}
              alt={pin.title}
              className="w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-4">
              <h3 className="text-white font-semibold text-lg">{pin.title}</h3>
              <p className="text-white text-sm mt-1">{pin.description}</p>
              <div className="flex items-center mt-2">
                <img
                  src={pin.authorAvatar}
                  alt={pin.author}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-white text-sm ml-2">{pin.author}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </Masonry>
  );
}