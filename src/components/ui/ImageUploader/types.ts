export interface UploadedImage {
  id: string;
  url: string;
  isCover: boolean;
  file?: File;
  isUploading?: boolean;
  progress?: number;
}
