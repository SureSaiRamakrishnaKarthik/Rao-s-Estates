"use client";

import React, { useState, useEffect } from 'react';
import { DropZone } from './DropZone';
import { PreviewGrid } from './PreviewGrid';
import { UploadedImage } from './types';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface ImageUploaderProps {
  bucket: string;
  value: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxFiles?: number;
  multiple?: boolean;
  accept?: string;
  error?: string;
}

export function ImageUploader({ 
  bucket, 
  value = [], 
  onChange, 
  maxFiles = 20,
  multiple = true,
  accept = "image/*",
  error 
}: ImageUploaderProps) {
  
  const supabase = createClient();
  
  // Keep local state for uploads in progress to show UI immediately
  const [localImages, setLocalImages] = useState<UploadedImage[]>(value);

  // Sync when external value changes (e.g. initial load)
  useEffect(() => {
    setLocalImages(value);
  }, [value]);

  const handleFilesSelected = async (files: File[]) => {
    if (value.length + files.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} images.`);
      return;
    }

    const newUploads: UploadedImage[] = files.map(file => ({
      id: crypto.randomUUID(),
      url: '',
      isCover: false, // If it's the very first image, we'll set it as cover after upload
      file,
      isUploading: true,
      progress: 0
    }));

    // Optimistically update UI
    setLocalImages(prev => [...prev, ...newUploads]);

    // Process uploads
    const completedUploads = [...value];

    for (const uploadItem of newUploads) {
      try {
        const fileExt = uploadItem.file!.name.split('.').pop();
        const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError, data } = await supabase.storage
          .from(bucket)
          .upload(filePath, uploadItem.file!, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        // Mark as complete
        const isFirstImage = completedUploads.length === 0;
        completedUploads.push({
          id: uploadItem.id,
          url: publicUrl,
          isCover: isFirstImage, // Auto-set first image as cover
        });

      } catch (err: any) {
        toast.error(`Failed to upload ${uploadItem.file!.name}`);
        console.error("Upload error:", err);
      }
    }

    // Update parent form with completed uploads
    onChange(completedUploads);
  };

  const handleRemove = async (id: string) => {
    // 1. Find the image to remove
    const imageToRemove = value.find(img => img.id === id);
    if (!imageToRemove) return;

    // 2. Remove from local state immediately
    const updatedImages = value.filter(img => img.id !== id);
    
    // 3. If we removed the cover, make the first remaining image the cover
    if (imageToRemove.isCover && updatedImages.length > 0) {
      updatedImages[0].isCover = true;
    }

    onChange(updatedImages);

    // 4. (Optional) Delete from Supabase Storage
    // The url looks like: https://[project].supabase.co/storage/v1/object/public/[bucket]/[filePath]
    try {
      const urlParts = imageToRemove.url.split('/');
      const filePath = urlParts[urlParts.length - 1]; // very basic extraction
      if (filePath && !imageToRemove.isUploading) {
        await supabase.storage.from(bucket).remove([filePath]);
      }
    } catch (e) {
      console.error("Failed to delete from storage", e);
    }
  };

  const handleSetCover = (id: string) => {
    const updatedImages = value.map(img => ({
      ...img,
      isCover: img.id === id
    }));
    onChange(updatedImages);
  };

  return (
    <div className="w-full">
      <DropZone 
        onFilesSelected={handleFilesSelected} 
        multiple={multiple}
        accept={accept}
        disabled={value.length >= maxFiles}
      />
      <PreviewGrid 
        images={localImages} 
        onRemove={handleRemove} 
        onSetCover={handleSetCover} 
      />
      {error && <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>}
    </div>
  );
}
