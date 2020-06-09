import fs from 'fs';

const path = 'src/data/catalog.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const entry = data.find(e => e.id === 'HISCOX-0980');
if (entry) {
  entry.families = ["gear", "epicyclic", "rotary"];
  entry.degreesOfFreedom = 2;
  entry.fidelity = "KINEMATICALLY_RECONSTRUCTED";
  entry.title = "Epicyclic Gear Train (Planetary)";
  entry.parameters = [
    { id: "rs", label: "Sun Radius", value: 30, min: 10, max: 80, unit: "mm" },
    { id: "rp", label: "Planet Radius", value: 20, min: 10, max: 80, unit: "mm" }
  ];
  entry.variables = [
    { id: "theta_s", label: "Sun Angle", unit: "rad" },
    { id: "theta_c", label: "Carrier Angle", unit: "rad" },
    { id: "theta_r", label: "Ring Angle", unit: "rad" },
    { id: "theta_p", label: "Planet Angle", unit: "rad" }
  ];
  entry.visuals = [
    // Carrier arm
    { type: "line", p1: "p0", p2: "p1", color: "#888888" },
    // Sun
    { type: "gear", p1: "p0", radius: "rs", angle: "theta_s", color: "#b7410e" },
    // Planet
    { type: "gear", p1: "p1", radius: "rp", angle: "theta_p", color: "#5a5854" },
    // Ring (internal gear). Represented by a circle of radius rs + 2*rp
    // Since we don't have a parameter for rr, let's just make the visual use a parameter if we added it, but let's just add an 'rr' parameter that is synced or not used for drawing, wait.
    // We can't use an expression for radius in Visual right now. So we'll add rr to parameters, even though it's constrained.
    // Or we just don't draw the ring for now.
  ];
  entry.solver = { type: "PLANETARY_GEAR" };
  entry.equations = [
    "\\omega_r = \\frac{(r_r + r_s)\\omega_c - r_s\\omega_s}{r_r}",
    "\\omega_p = \\frac{(r_s + r_p)\\omega_c - r_s\\omega_s}{r_p}"
  ];
}

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('Updated HISCOX-0980');
