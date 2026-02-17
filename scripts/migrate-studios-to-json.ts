/**
 * Migration script: Convert TypeScript studio configs to JSON files
 *
 * Usage: npx tsx scripts/migrate-studios-to-json.ts
 *
 * Reads all studio configs from lib/studios/index.ts and writes each
 * as a JSON file to data/studios/{slug}.json. Also generates _index.json.
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs'
import path from 'path'
import { studios } from '../lib/studios/index'

const OUTPUT_DIR = path.join(__dirname, '..', 'data', 'studios')

// Ensure output directory exists
if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true })
}

const slugs: string[] = []
let successCount = 0
let errorCount = 0

for (const [slug, config] of Object.entries(studios)) {
    try {
        const filePath = path.join(OUTPUT_DIR, `${slug}.json`)
        writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf-8')
        slugs.push(slug)
        successCount++
        console.log(`  ✓ ${slug}`)
    } catch (err) {
        errorCount++
        console.error(`  ✗ ${slug}: ${err}`)
    }
}

// Write the index file
const indexPath = path.join(OUTPUT_DIR, '_index.json')
writeFileSync(indexPath, JSON.stringify(slugs.sort(), null, 2), 'utf-8')

console.log(`\nMigration complete: ${successCount} studios converted, ${errorCount} errors`)
console.log(`Index written to ${indexPath} (${slugs.length} slugs)`)
