import fs from 'fs';

const path = 'src/data/catalog.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const entry = data.find(e => e.id === 'HISCOX-0128');
if (entry) {
  entry.families = ["gear", "rotary"];
  entry.degreesOfFreedom = 1;
  entry.fidelity = "KINEMATICALLY_RECONSTRUCTED";
  entry.title = "Internal Spur Gear and Pinion";
  entry.parameters = [
    { id: "r1", label: "Pinion Radius (r1)", value: 20, min: 10, max: 60, unit: "mm" },
    { id: "r2", label: "Ring Radius (r2)", value: 80, min: 40, max: 150, unit: "mm" },
    { id: "angle", label: "Alignment Angle", value: 0, min: -3.14159, max: 3.14159, unit: "rad" },
    { id: "internal", label: "Internal", value: 1, min: 1, max: 1, unit: "bool" }
  ];
  entry.variables = [
    { id: "theta", label: "Driver Angle", unit: "rad" },
    { id: "theta2", label: "Driven Angle", unit: "rad" }
  ];
  entry.visuals = [
    { type: "gear", p1: "p0", radius: "r1", angle: "theta", color: "#b7410e" },
    { type: "gear", p1: "p1", radius: "r2", angle: "theta2", color: "#5a5854" }
  ];
  entry.solver = { type: "SIMPLE_GEAR" };
  entry.equations = [
    "\\theta_2 = \\theta_1 \\frac{r_1}{r_2} \\text{ (same direction)}"
  ];
}

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Updated HISCOX-0128');
