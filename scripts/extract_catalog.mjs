import fs from 'fs';

const text = fs.readFileSync('hiscox.txt', 'utf8');
const lines = text.split('\n');

const catalog = [];
let currentEntry = null;

// The text starts the main numbered entries around line 1000.
// We look for lines matching: ^\s*(\d+)\.\s+([A-Z\s]+)(?:.-|.)
const entryRegex = /^\s*(\d+)\.\s+([A-Z][A-Z\s,]+(?:.-|.)?)(.*)/;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const match = line.match(entryRegex);
  
  if (match) {
    // If we have an existing entry, save it
    if (currentEntry) {
      catalog.push(currentEntry);
    }
    
    const num = match[1];
    let title = match[2].trim();
    // Clean up trailing dashes or dots
    title = title.replace(/[-.\s]+$/, '');
    
    let description = match[3] ? match[3].trim() : '';
    
    currentEntry = {
      id: `HISCOX-${num.padStart(4, '0')}`,
      title: title,
      families: [],
      degreesOfFreedom: 0,
      fidelity: "STATIC", // default for extraction
      source: {
        edition: "1899",
        year: 1899,
        page: 0, // Need manual or PDF correlation
        figureNumber: num,
        originalTitle: title,
        originalDescription: description,
        url: "https://archive.org/details/1800-mechanical-movements-devices-and-appliances_202005"
      },
      assumptions: [],
      relatedMechanisms: [],
      parameters: [],
      variables: [],
      components: [],
      joints: [],
      visuals: [],
      solver: { type: "DIRECT" }
    };
  } else if (currentEntry && line.trim() !== '') {
    // Append to description if it's the following lines, until we hit a blank line or a new entry
    // We only want a short snippet, maybe max 300 chars
    if (currentEntry.source.originalDescription.length < 300 && !line.match(/^[A-Z\s]{10,}$/)) {
        currentEntry.source.originalDescription += " " + line.trim();
    }
  }
}

// Push last entry
if (currentEntry) {
  catalog.push(currentEntry);
}

// We only want 1 to 1800. Let's filter out false positives (numbers > 2000 or duplicate numbers).
const filtered = [];
const seen = new Set();
for (const entry of catalog) {
  const num = parseInt(entry.id.split('-')[1], 10);
  if (num > 0 && num <= 1800 && !seen.has(num)) {
    // Further cleanup of description formatting
    entry.source.originalDescription = entry.source.originalDescription.replace(/\s+/g, ' ').trim();
    filtered.push(entry);
    seen.add(num);
  }
}

console.log(`Extracted ${filtered.length} entries.`);

// Merge with existing catalog.json to not overwrite my hand-crafted entries
const existingPath = 'src/data/catalog.json';
let existing = [];
if (fs.existsSync(existingPath)) {
  existing = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
}

const existingMap = new Map(existing.map(e => [e.id, e]));

for (const entry of filtered) {
  if (!existingMap.has(entry.id)) {
    existing.push(entry);
  }
}

// Sort by ID
existing.sort((a, b) => a.id.localeCompare(b.id));

fs.writeFileSync(existingPath, JSON.stringify(existing, null, 2));
console.log('Updated src/data/catalog.json');
