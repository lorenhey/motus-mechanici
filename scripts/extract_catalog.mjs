import fs from 'fs';

const text = fs.readFileSync('hiscox.txt', 'utf8');
const lines = text.split('\n');

const catalog = [];
let currentEntry = null;

// More permissive regex
const entryRegex = /^\s*(\d+[a-zA-Z\s]*)\.\s+(.*)/;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const match = line.match(entryRegex);
  
  if (match) {
    if (currentEntry) {
      catalog.push(currentEntry);
    }
    
    // Clean up number
    let numStr = match[1].replace(/\s+/g, '').toLowerCase();
    
    // The rest of the line is title and potentially description
    let rest = match[2].trim();
    let title = rest;
    let description = '';
    
    // Attempt to split title and description
    // Titles are usually uppercase and end with a dash or dot.
    const titleMatch = rest.match(/^([A-Z0-9\s,\-&'"]+)(?:.-|\.|-)(.*)/);
    if (titleMatch) {
      title = titleMatch[1].trim();
      description = titleMatch[2].trim();
    }
    
    currentEntry = {
      id: `HISCOX-${numStr.padStart(4, '0')}`,
      title: title,
      families: [],
      degreesOfFreedom: 0,
      fidelity: "STATIC", 
      source: {
        edition: "1899",
        year: 1899,
        page: 0,
        figureNumber: numStr,
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
    // Append to description if it's not a capitalized heading or index
    if (currentEntry.source.originalDescription.length < 500 && !line.match(/^[A-Z\s]{10,}$/)) {
        currentEntry.source.originalDescription += " " + line.trim();
    }
  }
}

if (currentEntry) {
  catalog.push(currentEntry);
}

const filtered = [];
const seen = new Set();
for (const entry of catalog) {
  // Only keep things that look like numbers 1-1800
  const match = entry.id.match(/HISCOX-0*(\d+)/);
  if (match) {
    const num = parseInt(match[1], 10);
    if (num > 0 && num <= 1800 && !seen.has(entry.id)) {
      entry.source.originalDescription = entry.source.originalDescription.replace(/\s+/g, ' ').trim();
      filtered.push(entry);
      seen.add(entry.id);
    }
  }
}

console.log(`Extracted ${filtered.length} entries.`);

const existingPath = 'src/data/catalog.json';
let existing = [];
if (fs.existsSync(existingPath)) {
  existing = JSON.parse(fs.readFileSync(existingPath, 'utf8'));
}

const existingMap = new Map(existing.map(e => [e.id, e]));
let added = 0;

for (const entry of filtered) {
  if (!existingMap.has(entry.id)) {
    existing.push(entry);
    added++;
  }
}

existing.sort((a, b) => a.id.localeCompare(b.id));

fs.writeFileSync(existingPath, JSON.stringify(existing, null, 2));
console.log(`Added ${added} new entries to catalog.json. Total is now ${existing.length}.`);
