import fs from 'fs';

const path = 'src/data/catalog.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const entry = data.find(e => e.id === 'HISCOX-1039');
if (entry) {
  entry.visuals = [
    { type: "line", p1: "p0", p2: "p1", color: "#b7410e" },
    { type: "point", p1: "p0" },
    { type: "point", p1: "p1" },
    // Yoke slot (vertical rect if horizontal motion)
    { type: "rect", p1: "p2", width: 20, height: 100, color: "#5a5854" },
    // Rod
    { type: "rect", p1: "p2", width: 120, height: 8, color: "#5a5854" }
  ];
}

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Updated HISCOX-1039 visuals');
