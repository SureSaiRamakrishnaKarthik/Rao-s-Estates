"use client";

import React, { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  disabled?: boolean;
}

export function DropZone({ onFilesSelected, multiple = true, accept = "image/*", disabled = false }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.match(accept.replace('*', '.*'))
    );
    
    if (files.length > 0) {
      if (!multiple && files.length > 1) {
        onFilesSelected([files[0]]);
      } else {
        onFilesSelected(files);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
    // Reset input so the same file can be selected again if deleted
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && fileInputRef.current?.click()}
      className={cn(
        "relative flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200",
        isDragging 
          ? "border-blue-500 bg-blue-50/50" 
          : "border-gray-300 bg-gray-50/50 hover:bg-gray-100 hover:border-gray-400",
        disabled && "opacity-50 cursor-not-allowed hover:bg-gray-50 hover:border-gray-300"
      )}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        multiple={multiple}
        accept={accept}
        disabled={disabled}
        className="hidden"
      />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-white rounded-full shadow-sm border border-gray-100">
          <UploadCloud className="w-8 h-8 text-blue-500" />
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-900">
            Click to upload <span className="font-normal text-gray-500">or drag and drop</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            SVG, PNG, JPG or GIF (max. 10MB)
          </p>
        </div>
      </div>
    </div>
  );
}
