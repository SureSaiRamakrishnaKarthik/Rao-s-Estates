import { SriBhramaraImporter, parseProjectPage } from '../modules/importer/importers/SriBhramaraImporter';
import { SriBhramaraNormalizer } from '../modules/importer/normalizers/SriBhramaraNormalizer';
import { ProjectValidator } from '../modules/importer/validators/project.validator';
import { ImportService } from '../modules/importer/services/import.service';
import { DiscoveredProject } from '../modules/importer/types';

async function redoMarkapur() {
  const normalizer = new SriBhramaraNormalizer();
  const loader = new ImportService(false);
  const validator = new ProjectValidator();

  const discovered: DiscoveredProject = {
    rawTitle: 'Sri City Markapur',
    projectUrl: 'https://sribhramara.com/sri-city-markapuram/',
    rawStatus: 'ongoing',
    rawProjectType: 'OPEN_PLOT'
  };

  const parsed = await parseProjectPage(discovered);
  if (!parsed) {
    console.error('Failed to parse');
    return;
  }
  
  const normalized = normalizer.normalize(parsed);
  const isValid = validator.validate(normalized);
  
  if (isValid) {
    await loader.load(normalized);
    console.log('✅ Successfully loaded Sri City Markapur');
  } else {
    console.error('Validation failed for Sri City Markapur');
  }
}

redoMarkapur().catch(console.error);
