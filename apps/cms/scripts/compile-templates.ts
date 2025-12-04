#!/usr/bin/env node
/**
 * scripts/compile-templates.ts
 * - Reads templates/snapshots/*.json
 * - Normalizes each via normalizeSnapshot()
 * - Writes templates/compiled/<slug>.json
 *
 * Run: node ./scripts/compile-templates.ts
 */

import fs from 'fs/promises';
import path from 'path';
import { normalizeSnapshot } from '../src/lib/templates/normalize-snapshot';

const SNAPSHOT_DIR = path.resolve(process.cwd(), 'templates', 'snapshots');
const COMPILED_DIR = path.resolve(process.cwd(), 'templates', 'compiled');

async function ensureDir(dir: string) {
  try { await fs.mkdir(dir, { recursive: true }); } catch {}
}

async function compileAll() {
  await ensureDir(COMPILED_DIR);
  const files = await fs.readdir(SNAPSHOT_DIR);
  for (const f of files) {
    if (!f.endsWith('.json')) continue;
    const p = path.join(SNAPSHOT_DIR, f);
    const raw = await fs.readFile(p, 'utf8');
    let json: any;
    try {
      json = JSON.parse(raw);
    } catch (err) {
      console.error(`Skipping ${f} — invalid JSON`, err);
      continue;
    }
    const normalized = normalizeSnapshot(json);
    const slug = (json.slug || path.basename(f, '.json')).replace(/\s+/g, '-').toLowerCase();
    const outPath = path.join(COMPILED_DIR, `${slug}.json`);
    await fs.writeFile(outPath, JSON.stringify(normalized), 'utf8');
    console.log(`Compiled ${f} → compiled/${slug}.json`);
  }
  console.log('All templates compiled.');
}

compileAll().catch(err => { console.error(err); process.exit(1); });
