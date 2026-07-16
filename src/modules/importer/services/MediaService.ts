import { adminClient } from '../../../lib/supabase/admin';
import config from '../config/sribhramara';

export class MediaService {
  /**
   * Downloads an image from an external URL and uploads it to Supabase Storage.
   * Returns the Supabase public URL or null if failed.
   */
  private bucketVerified = false;

  private async ensureBucketExists() {
    if (this.bucketVerified) return;
    try {
      const { data: bucket, error: getError } = await adminClient.storage.getBucket(config.bucket);
      if (getError || !bucket) {
        console.log(`[Media] Bucket '${config.bucket}' not found. Creating it...`);
        const { error: createError } = await adminClient.storage.createBucket(config.bucket, {
          public: true,
          fileSizeLimit: 10485760, // 10MB
          allowedMimeTypes: ['image/*']
        });
        if (createError) {
          console.error(`[Media] Failed to create bucket '${config.bucket}':`, createError.message);
        } else {
          console.log(`[Media] ✅ Successfully created public bucket '${config.bucket}'`);
        }
      }
    } catch (err: any) {
      console.error(`[Media] Error verifying bucket:`, err.message);
    }
    this.bucketVerified = true;
  }

  async uploadExternalImage(imageUrl: string, filename: string): Promise<string | null> {
    try {
      await this.ensureBucketExists();
      // console.log(`      [Media] Downloading ${imageUrl}...`);
      const response = await fetch(imageUrl);
      
      if (!response.ok) {
        console.error(`      ❌ Failed to download image: ${response.statusText}`);
        return null;
      }
      
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      
      const { data, error } = await adminClient.storage
        .from(config.bucket)
        .upload(`imports/${filename}`, buffer, {
          contentType,
          upsert: true
        });
        
      if (error) {
        console.error(`      ❌ Supabase Storage upload failed:`, error.message);
        return null;
      }
      
      const { data: publicUrlData } = adminClient.storage
        .from(config.bucket)
        .getPublicUrl(data.path);
        
      return publicUrlData.publicUrl;
    } catch (err) {
      console.error(`      ❌ Error processing image ${imageUrl}:`, err);
      return null;
    }
  }
}
