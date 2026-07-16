import { SriBhramaraImporter } from '../importers/SriBhramaraImporter';
import { ImportService } from '../services/import.service';
import { NormalizedProject } from '../types';

export class ImportPipeline {
  constructor(
    private parser: SriBhramaraImporter,
    private normalizer: { normalize(raw: any): NormalizedProject },
    private validator: { validate(p: any): p is NormalizedProject },
    private loader: ImportService,
    private isDryRun: boolean = false
  ) {}

  async run() {
    const startTime = performance.now();

    console.log('\n══════════════════════════════════════════════════');
    console.log('   SriBhramara Importer Pipeline');
    if (this.isDryRun) {
      console.log('   ⚠️  DRY RUN — No data will be written');
    }
    console.log('══════════════════════════════════════════════════\n');

    // ── Stage 1 + 2: Parse (discovery + per-page extraction) ────────────────
    console.log('📡 Fetching and parsing project pages...\n');
    const rawProjects = await this.parser.parse();

    // ── Normalize ────────────────────────────────────────────────────────────
    console.log(`\n🔄 Normalizing ${rawProjects.length} parsed projects...`);
    const normalizedProjects = rawProjects.map(raw => {
      try {
        return this.normalizer.normalize(raw);
      } catch (err: any) {
        console.error(`  ❌ Normalization failed for '${raw.rawTitle}': ${err.message}`);
        return null;
      }
    }).filter((p): p is NormalizedProject => p !== null);

    // ── Validate ─────────────────────────────────────────────────────────────
    console.log(`\n✅ Validating ${normalizedProjects.length} normalized projects...`);
    const validProjects = normalizedProjects.filter(p => this.validator.validate(p));

    console.log(
      `\n📊 Summary: ${rawProjects.length} fetched → ` +
      `${normalizedProjects.length} normalized → ` +
      `${validProjects.length} valid\n`
    );

    if (validProjects.length === 0) {
      console.log('⚠️  No valid projects found. Exiting.');
      return;
    }

    // ── Load ─────────────────────────────────────────────────────────────────
    console.log(`💾 Loading ${validProjects.length} projects into database...\n`);

    const stats = {
      inserted: 0,
      updated: 0,
      failed: 0,
      imagesUploaded: 0,
    };

    for (let i = 0; i < validProjects.length; i++) {
      const project = validProjects[i];
      const label = `[${i + 1}/${validProjects.length}] ${project.title}`;

      try {
        const result = await this.loader.load(project);

        if (result.status === 'inserted' || result.status === 'dry-run') {
          console.log(`  ✓ ${label} — Inserted (${result.imagesUploaded} images)`);
          stats.inserted++;
        } else if (result.status === 'updated') {
          console.log(`  ↺ ${label} — Updated (${result.imagesUploaded} images)`);
          stats.updated++;
        } else {
          console.log(`  ✗ ${label} — Failed`);
          stats.failed++;
        }
        stats.imagesUploaded += result.imagesUploaded;
      } catch (err: any) {
        console.error(`  ✗ ${label} — Unexpected error: ${err.message}`);
        stats.failed++;
      }
    }

    const durationSec = ((performance.now() - startTime) / 1000).toFixed(1);

    console.log('\n══════════════════════════════════════════════════');
    console.log(`  Pages Discovered : ${rawProjects.length}`);
    console.log(`  Valid & Processed: ${validProjects.length}`);
    if (!this.isDryRun) {
      console.log(`  Inserted         : ${stats.inserted}`);
      console.log(`  Updated          : ${stats.updated}`);
      console.log(`  Failed           : ${stats.failed}`);
      console.log(`  Images Uploaded  : ${stats.imagesUploaded}`);
    } else {
      console.log(`  (DRY RUN — nothing written)`);
    }
    console.log(`  Duration         : ${durationSec}s`);
    console.log('══════════════════════════════════════════════════\n');
  }
}
