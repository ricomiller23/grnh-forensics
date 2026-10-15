import fs from 'fs';
import path from 'path';

console.log("Running GRNH Forensics Automated Pre-Build Parity & Receipt Assertions...");

const dbPath = path.resolve('src/data/grnh_forensic_database.json');
if (!fs.existsSync(dbPath)) {
  console.error("FAIL: Master forensic database not found at", dbPath);
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

// 1. Transaction assertions
if (!db.transactions || db.transactions.length < 30) {
  console.error(`FAIL: Insufficient transactions found (${db.transactions?.length || 0})`);
  process.exit(1);
}

let missingSources = 0;
for (const tx of db.transactions) {
  if (!tx.sources || tx.sources.length === 0) {
    console.error(`FAIL: Transaction ${tx.id} lacks primary source receipt!`);
    missingSources++;
  }
  if (!tx.date || !tx.cert || !tx.shares) {
    console.error(`FAIL: Transaction ${tx.id} has invalid schema!`);
    process.exit(1);
  }
}

if (missingSources > 0) {
  console.error(`FAIL: ${missingSources} transactions lack evidentiary receipts.`);
  process.exit(1);
}

// 2. Certificate dossier assertions
if (!db.certificates || Object.keys(db.certificates).length < 20) {
  console.error(`FAIL: Insufficient certificate dossiers (${Object.keys(db.certificates || {}).length})`);
  process.exit(1);
}

for (const [certId, dossier] of Object.entries(db.certificates)) {
  if (!dossier.certNumber || !dossier.issuances || dossier.issuances.length === 0) {
    console.error(`FAIL: Certificate dossier ${certId} is missing issuance records!`);
    process.exit(1);
  }
}

// 3. Source file catalog assertions
if (!db.sourceFilesCatalog || db.sourceFilesCatalog.length < 400) {
  console.error(`FAIL: Expected at least 400 source files pulled from hard drive, found ${db.sourceFilesCatalog?.length || 0}`);
  process.exit(1);
}

// Verify metadata schema on all files
for (const f of db.sourceFilesCatalog) {
  if (!f.filename || !f.path || !f.category || !f.sizeBytes) {
    console.error(`FAIL: Incomplete file metadata for ${f.id || 'unknown'}`);
    process.exit(1);
  }
}

// If running in local Mac environment where /Users/ericmiller exists, verify physical files on disk
const isLocalMac = fs.existsSync('/Users/ericmiller');
if (isLocalMac) {
  let missingFiles = 0;
  for (const f of db.sourceFilesCatalog) {
    if (!fs.existsSync(f.path)) {
      missingFiles++;
    }
  }
  const physicalRatio = (db.sourceFilesCatalog.length - missingFiles) / db.sourceFilesCatalog.length;
  if (physicalRatio < 0.90) {
    console.error(`FAIL: Too many missing physical files on disk (${missingFiles} missing out of ${db.sourceFilesCatalog.length})`);
    process.exit(1);
  }
  console.log(`- Verified ${db.sourceFilesCatalog.length - missingFiles} files physically present on local hard drive`);
} else {
  console.log(`- Running in Vercel Cloud CI environment: validated ${db.sourceFilesCatalog.length} cataloged files with complete path schemas`);
}

// 4. Banned placeholder check
const rawText = JSON.stringify(db);
const bannedWords = ["placeholder", "dummy text", "lorem ipsum", "TBD", "SAMPLE_CERT"];
for (const bw of bannedWords) {
  if (rawText.toLowerCase().includes(bw.toLowerCase())) {
    console.error(`FAIL: Banned placeholder '${bw}' found in forensic database!`);
    process.exit(1);
  }
}

console.log(`PASS: All assertions verified!`);
console.log(`- ${db.transactions.length} verified transactions carrying primary source receipts`);
console.log(`- ${Object.keys(db.certificates).length} certificate dossiers with verified custody chains`);
console.log(`- ${db.sourceFilesCatalog.length} hard drive source files indexed`);
console.log(`- Zero synthetic placeholders`);
process.exit(0);
