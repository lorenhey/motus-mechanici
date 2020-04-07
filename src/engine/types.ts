export type FidelityLevel = 
  | 'EXACT'
  | 'KINEMATICALLY_RECONSTRUCTED'
  | 'INTERPRETATIVE'
  | 'ILLUSTRATIVE_ONLY'
  | 'STATIC';

export interface SourceReference {
  edition: string;
  year: number;
  page: number;
  figureNumber?: string;
  originalTitle: string;
  originalDescription: string;
  url: string;
}

// metadata integrated into definition

// Geometric/Kinematic model
export interface Parameter {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
}

export interface Variable {
  id: string;
  label: string;
  unit: string;
}

export interface Point2D {
  x: number;
  y: number;
}

export interface Component {
  id: string;
  type: 'LINK' | 'GROUND' | 'SLIDER' | 'WHEEL' | 'GEAR' | 'CAM' | string;
  label?: string;
  // Visuals can be separated or attached
}

export interface Joint {
  id: string;
  type: 'REVOLUTE' | 'PRISMATIC' | 'FIXED' | 'GEAR' | 'CAM_FOLLOWER';
  component1: string;
  component2: string;
  // relative local coordinates on each component
  local1?: Point2D;
  local2?: Point2D;
}

export interface SolverDefinition {
  type: 'CRANK_SLIDER' | 'FOUR_BAR' | 'GEAR_TRAIN' | 'DIRECT' | 'NUMERICAL';
  // Mapping of solver inputs to parameters/components
}

export interface Visual {
  type: 'line' | 'point' | 'rect';
  p1?: string; // point ID
  p2?: string;
  width?: number;
  height?: number;
  color?: string;
}

export interface MechanismDefinition {
  id: string; // e.g. HISCOX-0001
  title: string;
  families: string[];
  degreesOfFreedom: number;
  fidelity: FidelityLevel;
  source: SourceReference;
  assumptions: string[];
  relatedMechanisms: string[]; // array of IDs
  parameters: Parameter[];
  variables: Variable[]; 
  components: Component[];
  joints: Joint[];
  visuals?: Visual[];
  solver: SolverDefinition;
  equations?: string[];
}
