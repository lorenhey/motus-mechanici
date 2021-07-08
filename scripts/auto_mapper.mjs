import fs from 'fs';

const path = 'src/data/catalog.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

let count = 0;
const LIMIT = 2000;

for (const entry of data) {
  if (entry.fidelity !== 'STATIC') continue;
  if (count >= LIMIT) break;

  const title = entry.source?.originalTitle || entry.title || '';
  const desc = entry.source?.originalDescription || '';
  const text = (title + ' ' + desc).toUpperCase();
  
  if (text.includes('RACK') && (text.includes('PINION') || text.includes('GEAR'))) {
    entry.fidelity = 'KINEMATICALLY_RECONSTRUCTED';
    entry.solver = { type: 'RACK_PINION' };
    entry.parameters = [
      { id: "r", label: "Pinion Radius", value: 30, min: 10, max: 80, unit: "mm" },
      { id: "y0", label: "Rack Offset", value: -30, min: -80, max: 80, unit: "mm" }
    ];
    entry.variables = [
      { id: "theta", label: "Pinion Angle", unit: "rad" },
      { id: "x", label: "Rack Position", unit: "mm" }
    ];
    entry.visuals = [
      { type: "gear", p1: "p0", radius: "r", angle: "theta", color: "#b7410e" },
      { type: "rect", p1: "p1", width: 200, height: 10, color: "#5a5854" }
    ];
    entry.equations = ["x = r \\cdot \\theta"];
    count++;
  }
  else if (text.includes('GEAR') && !text.includes('RACK') && !text.includes('INTERNAL')) {
    entry.fidelity = 'KINEMATICALLY_RECONSTRUCTED';
    entry.solver = { type: 'SIMPLE_GEAR' };
    entry.parameters = [
      { id: "r1", label: "Radius 1", value: 30, min: 10, max: 80, unit: "mm" },
      { id: "r2", label: "Radius 2", value: 30, min: 10, max: 80, unit: "mm" }
    ];
    entry.variables = [
      { id: "theta1", label: "Angle 1", unit: "rad" },
      { id: "theta2", label: "Angle 2", unit: "rad" }
    ];
    entry.visuals = [
      { type: "gear", p1: "p0", radius: "r1", angle: "theta1", color: "#b7410e" },
      { type: "gear", p1: "p1", radius: "r2", angle: "theta2", color: "#5a5854" }
    ];
    entry.equations = ["\\theta_2 = -\\theta_1 \\frac{r_1}{r_2}"];
    count++;
  } 
  else if (text.includes('PULLEY') || text.includes('BELT') || text.includes('ROPE')) {
    entry.fidelity = 'KINEMATICALLY_RECONSTRUCTED';
    entry.solver = { type: 'BELT_PULLEY' };
    entry.parameters = [
      { id: "r1", label: "Pulley 1", value: 30, min: 10, max: 80, unit: "mm" },
      { id: "r2", label: "Pulley 2", value: 30, min: 10, max: 80, unit: "mm" },
      { id: "d", label: "Distance", value: 100, min: 50, max: 200, unit: "mm" },
      { id: "crossed", label: "Crossed Belt", value: 0, min: 0, max: 1, unit: "bool" }
    ];
    entry.variables = [
      { id: "theta1", label: "Angle 1", unit: "rad" },
      { id: "theta2", label: "Angle 2", unit: "rad" }
    ];
    entry.visuals = [
      { type: "circle", p1: "p0", radius: "r1", color: "#b7410e" },
      { type: "circle", p1: "p1", radius: "r2", color: "#5a5854" },
      { type: "belt", p1: "p0", p2: "p1", radius: "r1,r2", color: "#222" }
    ];
    entry.equations = ["\\theta_2 = \\theta_1 \\frac{r_1}{r_2} \\times (\\text{crossed} ? -1 : 1)"];
    count++;
  }
  else if (text.includes('PARALLEL')) {
    entry.fidelity = 'KINEMATICALLY_RECONSTRUCTED';
    entry.solver = { type: 'FOUR_BAR' };
    entry.parameters = [
      { id: "a", label: "Crank", value: 40, min: 10, max: 80, unit: "mm" },
      { id: "b", label: "Coupler", value: 80, min: 20, max: 200, unit: "mm" },
      { id: "c", label: "Rocker", value: 40, min: 10, max: 80, unit: "mm" },
      { id: "d", label: "Ground", value: 80, min: 20, max: 200, unit: "mm" }
    ];
    entry.variables = [
      { id: "theta", label: "Crank Angle", unit: "rad" },
      { id: "phi", label: "Rocker Angle", unit: "rad" }
    ];
    entry.visuals = [
      { type: "line", p1: "p0", p2: "p1", color: "#b7410e" },
      { type: "line", p1: "p1", p2: "p2", color: "#888" },
      { type: "line", p1: "p2", p2: "p3", color: "#5a5854" },
      { type: "line", p1: "p3", p2: "p0", color: "#222" },
      { type: "point", p1: "p0" }, { type: "point", p1: "p1" },
      { type: "point", p1: "p2" }, { type: "point", p1: "p3" }
    ];
    entry.equations = ["\\text{Vector Loop: } \\vec{a} + \\vec{b} - \\vec{c} - \\vec{d} = 0"];
    count++;
  }
  else if (text.includes('LEVER') || text.includes('LINK') || text.includes('JOINT') || text.includes('STRAIGHT')) {
    entry.fidelity = 'KINEMATICALLY_RECONSTRUCTED';
    entry.solver = { type: 'FOUR_BAR' };
    entry.parameters = [
      { id: "a", label: "Crank", value: 30, min: 10, max: 80, unit: "mm" },
      { id: "b", label: "Coupler", value: 100, min: 20, max: 200, unit: "mm" },
      { id: "c", label: "Rocker", value: 60, min: 10, max: 80, unit: "mm" },
      { id: "d", label: "Ground", value: 100, min: 20, max: 200, unit: "mm" }
    ];
    entry.variables = [
      { id: "theta", label: "Crank Angle", unit: "rad" },
      { id: "phi", label: "Rocker Angle", unit: "rad" }
    ];
    entry.visuals = [
      { type: "line", p1: "p0", p2: "p1", color: "#b7410e" },
      { type: "line", p1: "p1", p2: "p2", color: "#888" },
      { type: "line", p1: "p2", p2: "p3", color: "#5a5854" },
      { type: "line", p1: "p3", p2: "p0", color: "#222" },
      { type: "point", p1: "p0" }, { type: "point", p1: "p1" },
      { type: "point", p1: "p2" }, { type: "point", p1: "p3" }
    ];
    entry.equations = ["\\text{Vector Loop: } \\vec{a} + \\vec{b} - \\vec{c} - \\vec{d} = 0"];
    count++;
  }
  else if (text.includes('VALVE') || text.includes('SLIDE')) {
    entry.fidelity = 'KINEMATICALLY_RECONSTRUCTED';
    entry.solver = { type: 'CRANK_SLIDER' };
    entry.parameters = [
      { id: "r", label: "Eccentric", value: 15, min: 5, max: 40, unit: "mm" },
      { id: "l", label: "Valve Rod", value: 100, min: 40, max: 200, unit: "mm" }
    ];
    entry.variables = [
      { id: "theta", label: "Angle", unit: "rad" },
      { id: "x", label: "Valve Pos", unit: "mm" }
    ];
    entry.visuals = [
      { type: "line", p1: "p0", p2: "p1", color: "#b7410e" },
      { type: "line", p1: "p1", p2: "p2", color: "#5a5854" },
      { type: "point", p1: "p0" },
      { type: "point", p1: "p1" },
      { type: "rect", p1: "p2", width: 30, height: 15, color: "#222" }
    ];
    entry.equations = ["x = r \\cos(\\theta) + \\sqrt{l^2 - r^2 \\sin^2(\\theta)}"];
    count++;
  }
  else if (text.includes('CAM ') || text.includes('WIPER')) {
    entry.fidelity = 'KINEMATICALLY_RECONSTRUCTED';
    entry.solver = { type: 'CAM_FOLLOWER' };
    entry.parameters = [
      { id: "r_base", label: "Base Radius", value: 30, min: 10, max: 80, unit: "mm" },
      { id: "r_lift", label: "Max Lift", value: 20, min: 5, max: 60, unit: "mm" },
      { id: "r_follower", label: "Follower", value: 5, min: 2, max: 20, unit: "mm" }
    ];
    entry.variables = [
      { id: "theta", label: "Cam Angle", unit: "rad" },
      { id: "y", label: "Position", unit: "mm" }
    ];
    entry.visuals = [
      { type: "cam", p1: "p0", radius: "r_base,r_lift", angle: "theta", color: "#b7410e" },
      { type: "circle", p1: "p1", radius: "r_follower", color: "#5a5854" },
      { type: "line", p1: "p1", p2: "p2", width: 4, color: "#888" }
    ];
    entry.equations = ["y = r_{base} + \\frac{r_{lift}}{2} (1 + \\cos(\\theta)) + r_{follower}"];
    count++;
  }
  else if (text.includes('CRANK') && (text.includes('SLOT') || text.includes('YOKE'))) {
    entry.fidelity = 'KINEMATICALLY_RECONSTRUCTED';
    entry.solver = { type: 'SCOTCH_YOKE' };
    entry.parameters = [
      { id: "r", label: "Crank Radius", value: 30, min: 10, max: 80, unit: "mm" },
      { id: "vertical", label: "Vertical", value: 0, min: 0, max: 1, unit: "bool" }
    ];
    entry.variables = [
      { id: "theta", label: "Angle", unit: "rad" },
      { id: "pos", label: "Position", unit: "mm" }
    ];
    entry.visuals = [
      { type: "line", p1: "p0", p2: "p1", color: "#b7410e" },
      { type: "point", p1: "p0" },
      { type: "point", p1: "p1" },
      { type: "rect", p1: "p2", width: 20, height: 100, color: "#5a5854" }
    ];
    entry.equations = ["pos = r \\cos(\\theta)"];
    count++;
  }
  else if (text.includes('CRANK') || text.includes('RECIPROCATING') || text.includes('PUMP')) {
    entry.fidelity = 'KINEMATICALLY_RECONSTRUCTED';
    entry.solver = { type: 'CRANK_SLIDER' };
    entry.parameters = [
      { id: "r", label: "Crank Radius", value: 30, min: 10, max: 80, unit: "mm" },
      { id: "l", label: "Rod Length", value: 100, min: 40, max: 200, unit: "mm" }
    ];
    entry.variables = [
      { id: "theta", label: "Angle", unit: "rad" },
      { id: "x", label: "Slider Pos", unit: "mm" }
    ];
    entry.visuals = [
      { type: "line", p1: "p0", p2: "p1", color: "#b7410e" },
      { type: "line", p1: "p1", p2: "p2", color: "#5a5854" },
      { type: "point", p1: "p0" },
      { type: "point", p1: "p1" },
      { type: "rect", p1: "p2", width: 40, height: 20, color: "#222" }
    ];
    entry.equations = ["x = r \\cos(\\theta) + \\sqrt{l^2 - r^2 \\sin^2(\\theta)}"];
    count++;
  }
  else if (text.includes('SCREW') || text.includes('THREAD') || text.includes('WORM')) {
    entry.fidelity = 'KINEMATICALLY_RECONSTRUCTED';
    entry.solver = { type: 'SCREW' };
    entry.parameters = [
      { id: "pitch", label: "Thread Pitch", value: 10, min: 2, max: 50, unit: "mm" }
    ];
    entry.variables = [
      { id: "theta", label: "Rotation", unit: "rad" },
      { id: "x", label: "Linear Pos", unit: "mm" }
    ];
    entry.visuals = [
      { type: "gear", p1: "p0", radius: "15", angle: "theta", color: "#b7410e" },
      { type: "rect", p1: "p1", width: 60, height: 10, color: "#5a5854" }
    ];
    entry.equations = ["x = \\text{pitch} \\times \\frac{\\theta}{2\\pi}"];
    count++;
  }
}

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log(`Auto-mapped ${count} mechanisms heuristically.`);
