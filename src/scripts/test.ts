import { SriBhramaraImporter } from '../modules/importer/importers/SriBhramaraImporter';
import { SriBhramaraNormalizer } from '../modules/importer/normalizers/SriBhramaraNormalizer';
import { ProjectValidator } from '../modules/importer/validators/project.validator';
import { ImportService } from '../modules/importer/services/import.service';
import { ImportPipeline } from '../modules/importer/pipeline/ImportPipeline';

async function main() {
  const isDryRun = process.argv.includes('--dry-run');

  const parser    = new SriBhramaraImporter();
  const normalizer = new SriBhramaraNormalizer();
  const validator  = new ProjectValidator();
  const loader    = new ImportService(isDryRun);

  const pipeline = new ImportPipeline(parser, normalizer, validator, loader, isDryRun);

  await pipeline.run();
}

main().catch(console.error);
