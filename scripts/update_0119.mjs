import fs from 'fs';

const path = 'src/data/catalog.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const entry = data.find(e => e.id === 'HISCOX-0119');
if (entry) {
  entry.families = ["pulley", "belt", "rotary"];
  entry.degreesOfFreedom = 1;
  entry.fidelity = "KINEMATICALLY_RECONSTRUCTED";
  entry.title = "Link Belt and Pulley";
  entry.parameters = [
    { id: "r1", label: "Driver Radius (r1)", value: 30, min: 10, max: 80, unit: "mm" },
    { id: "r2", label: "Driven Radius (r2)", value: 30, min: 10, max: 80, unit: "mm" },
    { id: "dx", label: "Horizontal Distance", value: 120, min: 50, max: 200, unit: "mm" },
    { id: "dy", label: "Vertical Distance", value: 0, min: -50, max: 50, unit: "mm" },
    { id: "crossed", label: "Crossed Belt", value: 0, min: 0, max: 1, unit: "bool" }
  ];
  entry.variables = [
    { id: "theta", label: "Driver Angle", unit: "rad" },
    { id: "theta2", label: "Driven Angle", unit: "rad" }
  ];
  entry.visuals = [
    { type: "circle", p1: "p0", radius: "r1", color: "#b7410e" },
    { type: "circle", p1: "p1", radius: "r2", color: "#5a5854" },
    { type: "gear", p1: "p0", radius: "r1", angle: "theta", color: "#b7410e" },
    { type: "gear", p1: "p1", radius: "r2", angle: "theta2", color: "#5a5854" },
    { type: "belt", p1: "p0", p2: "p1", radius: "r1,r2", color: "#888888" }
  ];
  entry.solver = { type: "BELT_PULLEY" };
  entry.equations = [
    "\\theta_2 = \\theta_1 \\frac{r_1}{r_2}"
  ];
}

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Updated HISCOX-0119');
