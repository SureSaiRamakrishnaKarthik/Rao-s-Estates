import React from 'react';
import { Trash2, Star, Loader2 } from 'lucide-react';
import { UploadedImage } from './types';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface UploadItemProps {
  image: UploadedImage;
  onRemove: (id: string) => void;
  onSetCover: (id: string) => void;
}

export function UploadItem({ image, onRemove, onSetCover }: UploadItemProps) {
  // If it's still uploading, show the local preview (ObjectURL from File)
  const previewUrl = image.isUploading && image.file 
    ? URL.createObjectURL(image.file) 
    : image.url;

  return (
    <div className={cn(
      "relative group rounded-xl overflow-hidden border bg-gray-100 aspect-video",
      image.isCover ? "border-blue-500 ring-2 ring-blue-500/50" : "border-gray-200"
    )}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={previewUrl}
        alt="Upload preview"
        className="w-full h-full object-cover"
        onLoad={() => {
          if (image.isUploading && image.file) {
            URL.revokeObjectURL(previewUrl);
          }
        }}
      />
      
      {/* Upload Progress Overlay */}
      {image.isUploading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center">
          <Loader2 className="w-6 h-6 text-blue-600 animate-spin mb-2" />
          <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${image.progress || 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Hover Actions Overlay */}
      {!image.isUploading && (
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
          <div className="flex justify-between items-start">
            <button
              type="button"
              onClick={() => onSetCover(image.id)}
              className={cn(
                "p-1.5 rounded-md backdrop-blur-md transition-colors",
                image.isCover 
                  ? "bg-blue-600 text-white" 
                  : "bg-black/20 text-white hover:bg-black/40"
              )}
              title="Set as Cover"
            >
              <Star className={cn("w-4 h-4", image.isCover ? "fill-current" : "")} />
            </button>
            <button
              type="button"
              onClick={() => onRemove(image.id)}
              className="p-1.5 rounded-md bg-black/20 text-white hover:bg-red-500/90 backdrop-blur-md transition-colors"
              title="Remove Image"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          {image.isCover && (
            <div className="self-center px-2 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-medium rounded">
              Cover Image
            </div>
          )}
        </div>
      )}
    </div>
  );
}
