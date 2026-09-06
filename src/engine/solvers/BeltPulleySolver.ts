import type { Point2D } from '../types';

interface BeltPulleyParams {
  r1: number;      // Radius of driver
  r2: number;      // Radius of driven
  dx: number;      // X distance to driven
  dy: number;      // Y distance to driven
  theta: number;   // Angle of driver
  crossed?: boolean; // If true, belt is crossed (reverses direction)
}

export function solveBeltPulley(params: BeltPulleyParams): { 
  p0: Point2D, 
  p1: Point2D, 
  theta2: number, 
  valid: boolean 
} {
  const { r1, r2, dx, dy, theta, crossed = false } = params;
  
  const p0: Point2D = { x: 0, y: 0 };
  const p1: Point2D = { x: dx, y: dy };
  
  // Distance between centers
  const d = Math.sqrt(dx * dx + dy * dy);
  
  // Check validity
  const minD = crossed ? r1 + r2 : Math.abs(r1 - r2);
  if (d <= minD) {
    return { p0, p1, theta2: 0, valid: false }; // Pulleys overlap too much
  }
  
  // Gear ratio
  const ratio = r1 / r2;
  
  const direction = crossed ? -1 : 1;
  const theta2 = direction * theta * ratio;
  
  return { p0, p1, theta2, valid: true };
}
