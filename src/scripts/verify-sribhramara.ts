import { SriBhramaraImporter } from '../modules/importer/importers/SriBhramaraImporter';
import { SriBhramaraNormalizer } from '../modules/importer/normalizers/SriBhramaraNormalizer';
import fs from 'fs/promises';
import path from 'path';

async function main() {
  console.log('--- Verification Script: Sri Bhramara Importer ---');
  
  const parser = new SriBhramaraImporter();
  const normalizer = new SriBhramaraNormalizer();
  
  console.log('Fetching & Parsing...');
  const rawProjects = await parser.parse();
  const projects = rawProjects.map(raw => normalizer.normalize(raw));
  
  const validation = {
    totalProjects: projects.length,
    missingFields: {} as Record<string, number>,
    totalImages: 0,
    brokenImages: 0
  };

  projects.forEach((p, idx) => {
    // Check required fields
    const fieldsToCheck = [
      'title', 'slug', 'location', 'projectType', 'approvalType', 
      'price', 'description', 'amenities', 'images', 'brochureUrl', 'googleMapsUrl'
    ];

    fieldsToCheck.forEach(field => {
      const val = (p as any)[field];
      if (
        val === undefined || 
        val === null || 
        val === '' || 
        (Array.isArray(val) && val.length === 0)
      ) {
        validation.missingFields[field] = (validation.missingFields[field] || 0) + 1;
      }
    });

    validation.totalImages += p.images.length;
    p.images.forEach(img => {
      if (!img.startsWith('http')) {
        validation.brokenImages++;
      }
    });
  });

  const output = {
    summary: validation,
    projects
  };

  const outputPath = path.resolve(process.cwd(), 'output.json');
  await fs.writeFile(outputPath, JSON.stringify(output, null, 2));
  console.log(`\nVerification complete! Wrote results to ${outputPath}`);
  console.log('Summary:', validation);
}

main().catch(console.error);
