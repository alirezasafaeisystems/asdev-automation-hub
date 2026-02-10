import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const migrationsDir = join(root, 'prisma', 'migrations');
const entries = readdirSync(migrationsDir).filter((name) => statSync(join(migrationsDir, name)).isDirectory());

if (entries.length === 0) {
  throw new Error('No migration directories found.');
}

for (const dir of entries) {
  const sqlPath = join(migrationsDir, dir, 'migration.sql');
  const content = readFileSync(sqlPath, 'utf8').trim();
  if (!content) {
    throw new Error(`Empty migration file: ${sqlPath}`);
  }
}

console.log('Migration check passed.');
