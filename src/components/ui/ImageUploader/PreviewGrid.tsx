import React from 'react';
import { UploadItem } from './UploadItem';
import { UploadedImage } from './types';

interface PreviewGridProps {
  images: UploadedImage[];
  onRemove: (id: string) => void;
  onSetCover: (id: string) => void;
}

export function PreviewGrid({ images, onRemove, onSetCover }: PreviewGridProps) {
  if (images.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
      {images.map((image) => (
        <UploadItem
          key={image.id}
          image={image}
          onRemove={onRemove}
          onSetCover={onSetCover}
        />
      ))}
    </div>
  );
}
