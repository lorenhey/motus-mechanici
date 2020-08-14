import fs from 'fs';

const path = 'src/data/catalog.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const entry = data.find(e => e.id === 'HISCOX-1104');
if (entry) {
  entry.visuals = [
    { type: "cam", p1: "p0", radius: "r_base,r_lift", angle: "theta", color: "#b7410e" },
    { type: "circle", p1: "p1", radius: "r_follower", color: "#5a5854" },
    { type: "line", p1: "p1", p2: "p2", width: 4, color: "#888" }
  ];
}

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Updated HISCOX-1104 visual');
