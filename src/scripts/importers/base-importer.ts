import { createClient } from '@/lib/supabase/server';
import { Project } from '@/types/project';
import crypto from 'crypto';

export interface ParsedProject extends Partial<Project> {
  // Contains raw scraped data before inserting
  source_project_id: string;
}

export abstract class BaseImporter {
  abstract getSourceDomain(): string;
  abstract getDeveloperId(): string;
  abstract extractData(html: string): Promise<ParsedProject[]>;

  async fetchHTML(url: string): Promise<string> {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
    return await response.text();
  }

  async downloadAndUploadImage(imageUrl: string, bucket: string, path: string): Promise<string> {
    const supabase = await createClient();
    
    // Download image
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    
    // Upload to our bucket
    const { data, error } = await supabase.storage.from(bucket).upload(path, blob, {
      upsert: true
    });
    
    if (error) throw new Error(error.message);
    return data.path;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generateHash(data: any): string {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
  }

  async generateSyncPreview(scrapedProjects: ParsedProject[]) {
    const supabase = await createClient();
    const developerId = this.getDeveloperId();
    
    // 1. Fetch existing projects for this developer
    const { data: existingProjects } = await supabase
      .from('projects')
      .select('id, source_project_id, sync_hash')
      .eq('developer_id', developerId);
      
    const pendingChanges = {
      new_projects: [] as ParsedProject[],
      updated_projects: [] as ParsedProject[],
      unchanged_count: 0
    };

    // 2. Diffing logic
    for (const scraped of scrapedProjects) {
      scraped.sync_hash = this.generateHash(scraped);
      
      const existing = existingProjects?.find(p => p.source_project_id === scraped.source_project_id);
      
      if (!existing) {
        pendingChanges.new_projects.push(scraped);
      } else if (existing.sync_hash !== scraped.sync_hash) {
        pendingChanges.updated_projects.push(scraped);
      } else {
        pendingChanges.unchanged_count++;
      }
    }

    // 3. Log to import_logs as "needs_review"
    const { error } = await supabase.from('import_logs').insert({
      developer_id: developerId,
      status: 'needs_review',
      projects_synced: scrapedProjects.length,
      pending_changes: pendingChanges,
      started_at: new Date().toISOString()
    });
    
    if (error) throw new Error(error.message);
    
    return pendingChanges;
  }

  async run() {
    console.log(`Starting import for ${this.getSourceDomain()}`);
    const html = await this.fetchHTML(this.getSourceDomain());
    const projects = await this.extractData(html);
    const preview = await this.generateSyncPreview(projects);
    
    console.log('Sync Preview Generated:', preview);
    return preview;
  }
}
