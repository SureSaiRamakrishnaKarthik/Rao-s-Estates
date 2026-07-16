# Feature: Image Uploader

## Overview
The custom `ImageUploader` component (`src/components/ui/ImageUploader`) is a robust, client-side utility for directly uploading media assets to Supabase Storage. It is designed to work seamlessly with `react-hook-form` via the `Controller` component.

## File Structure
- `index.tsx`: The main orchestrator. Manages state, coordinates uploads to the Supabase client, and triggers `onChange` with the final URL array.
- `DropZone.tsx`: An interactive drag-and-drop area. Validates file types and triggers the upload pipeline.
- `PreviewGrid.tsx`: Maps over the current state of uploaded (and uploading) images.
- `UploadItem.tsx`: Renders individual images, handles loading states with a progress bar, and provides hover actions to remove the image or set it as the cover.
- `types.ts`: Defines the `UploadedImage` interface containing `id`, `url`, `isCover`, and local file reference metadata.

## Upload Flow
1. **Selection:** User drops files into the `DropZone`.
2. **Optimistic UI:** The component instantly renders local object URLs (`URL.createObjectURL`) to show the user what they selected, along with a loading spinner.
3. **Direct Upload:** Files are passed to the `supabase-js` browser client, bypassing the Next.js API route to save server bandwidth. They are uploaded to the specified bucket (e.g., `projects`) with a unique UUID-based filename to prevent collisions.
4. **Form Synchronization:** Upon successful upload, the public URL is retrieved and the internal `react-hook-form` state is updated. 

## Cover Selection
The uploader allows users to mark a specific image as the "Cover" by clicking the Star icon on the image overlay. The first uploaded image is automatically designated as the cover. The `ProjectService` uses this designation to extract the `thumbnail` URL for the project during database insertion.
