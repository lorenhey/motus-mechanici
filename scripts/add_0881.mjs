import fs from 'fs';

const path = 'src/data/catalog.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const newEntry = {
  id: "HISCOX-0881",
  title: "Ordinary Rack and Pinion",
  families: ["gear", "rack-pinion", "linear"],
  degreesOfFreedom: 1,
  fidelity: "KINEMATICALLY_RECONSTRUCTED",
  source: {
    edition: "1899",
    year: 1899,
    page: 253,
    figureNumber: "881",
    originalTitle: "ORDINARY RACK AND PINION",
    originalDescription: "- Reciprocating motion, from circular or rectilinear motion as desired.",
    url: "https://archive.org/details/1800-mechanical-movements-devices-and-appliances_202005"
  },
  assumptions: [],
  relatedMechanisms: [],
  parameters: [
    { id: "r", label: "Pinion Radius", value: 30, min: 10, max: 80, unit: "mm" },
    { id: "y0", label: "Rack Offset", value: -30, min: -80, max: 80, unit: "mm" }
  ],
  variables: [
    { id: "theta", label: "Pinion Angle", unit: "rad" },
    { id: "x", label: "Rack Position", unit: "mm" }
  ],
  components: [],
  joints: [],
  visuals: [
    { type: "gear", p1: "p0", radius: "r", angle: "theta", color: "#b7410e" },
    { type: "rect", p1: "p1", width: 200, height: 10, color: "#5a5854" }
  ],
  solver: {
    type: "RACK_PINION"
  },
  equations: [
    "x = -r \\theta"
  ]
};

const idx = data.findIndex(e => e.id > "HISCOX-0881");
if (idx !== -1) {
  data.splice(idx, 0, newEntry);
} else {
  data.push(newEntry);
}

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Added HISCOX-0881');
