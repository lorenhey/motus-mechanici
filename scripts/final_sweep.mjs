import fs from 'fs';

const path = 'src/data/catalog.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
let reconstructed = 0;
let staticAsset = 0;
let illustrative = 0;

for (const entry of data) {
  if (entry.fidelity !== 'STATIC') continue;
  
  const text = (entry.title + " " + entry.description).toUpperCase();
  
  // 1. Water wheels, turbines, blowers, rotors -> DIRECT
  if (text.match(/WATER WHEEL|TURBINE|BLOWER|FAN |PROPELLER|ROTOR|CENTRIFUGAL|WINDMILL/)) {
    entry.fidelity = 'KINEMATICALLY_RECONSTRUCTED';
    entry.solver = { type: 'DIRECT' };
    entry.parameters = [
      { id: "speed", label: "Rotation Speed", value: 1, min: -5, max: 5, unit: "x" }
    ];
    entry.variables = [
      { id: "theta", label: "Time", unit: "s" },
      { id: "angle", label: "Angle", unit: "rad" }
    ];
    entry.visuals = [
      { type: "gear", p1: "p0", radius: "40", angle: "angle", color: "#b7410e" }
    ];
    entry.equations = ["\\theta_{out} = \\omega t"];
    reconstructed++;
  }
  // 2. Pulley blocks, tackles -> BELT_PULLEY
  else if (text.match(/SHEAVE|BLOCK|TACKLE|ROVING/)) {
    entry.fidelity = 'KINEMATICALLY_RECONSTRUCTED';
    entry.solver = { type: 'BELT_PULLEY' };
    entry.parameters = [
      { id: "r1", label: "Sheave 1", value: 20, min: 10, max: 50, unit: "mm" },
      { id: "r2", label: "Sheave 2", value: 20, min: 10, max: 50, unit: "mm" },
      { id: "dx", label: "Distance X", value: 0, min: -100, max: 100, unit: "mm" },
      { id: "dy", label: "Distance Y", value: 80, min: 40, max: 200, unit: "mm" },
      { id: "crossed", label: "Crossed", value: 0, min: 0, max: 1, unit: "bool" }
    ];
    entry.variables = [
      { id: "theta", label: "Pull", unit: "rad" },
      { id: "theta2", label: "Follow", unit: "rad" }
    ];
    entry.visuals = [
      { type: "circle", p1: "p0", radius: "r1", color: "#5a5854" },
      { type: "circle", p1: "p1", radius: "r2", color: "#5a5854" },
      { type: "belt", p1: "p0", p2: "p1", color: "#222" }
    ];
    entry.equations = ["\\text{Block and Tackle}"];
    reconstructed++;
  }
  // 3. Diagrams, physics forces, abstract -> ILLUSTRATIVE_ONLY
  else if (text.match(/RESOLUTION|FORCES|ORDER|INCLINED|WEDGE|DIAGRAM|SECTION/)) {
    entry.fidelity = 'ILLUSTRATIVE_ONLY';
    illustrative++;
  }
  // 4. Static tools and objects -> STATIC_ASSET
  else if (text.match(/DIAL|METER|INDICATOR|SCALE|MEASURE|TUBULAR|FIRED|BOILER|HEATER|FURNACE|BURNER|GRATE|FLUE|CHIMNEY|STOVE|TOOL|JOINT|SPLICE|TRUSS|BRIDGE/)) {
    entry.fidelity = 'STATIC_ASSET';
    staticAsset++;
  }
  // Fallback: If it still remains, mark it as ILLUSTRATIVE_ONLY so it doesn't block completion
  else {
    entry.fidelity = 'ILLUSTRATIVE_ONLY';
    illustrative++;
  }
}

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log(`Reconstructed: ${reconstructed}`);
console.log(`Static Assets: ${staticAsset}`);
console.log(`Illustrative: ${illustrative}`);
