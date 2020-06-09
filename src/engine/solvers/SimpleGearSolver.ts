import type { Point2D } from '../types';

interface SimpleGearParams {
  r1: number;      // Radius of driver
  r2: number;      // Radius of driven
  angle: number;   // Angle of the line connecting centers
  theta: number;   // Angle of driver gear
  internal?: boolean; // If true, r2 is an internal ring gear
}

export function solveSimpleGear(params: SimpleGearParams): { 
  p0: Point2D, 
  p1: Point2D, 
  theta2: number, 
  valid: boolean 
} {
  const { r1, r2, angle = 0, theta, internal = false } = params;
  
  const p0: Point2D = { x: 0, y: 0 };
  
  // Distance between centers
  const d = internal ? Math.abs(r2 - r1) : r1 + r2;
  
  const p1: Point2D = { 
    x: d * Math.cos(angle), 
    y: d * Math.sin(angle) 
  };
  
  // Gear ratio
  const ratio = r1 / r2;
  
  // If internal, they rotate the same direction. If external, opposite directions.
  const direction = internal ? 1 : -1;
  const theta2 = direction * theta * ratio;
  
  return { p0, p1, theta2, valid: true };
}
