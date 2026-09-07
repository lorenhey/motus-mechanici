import type { Point2D } from '../types';

interface RackPinionParams {
  r: number;       // Radius of pinion
  y0: number;      // Y offset of the rack
  theta: number;   // Angle of pinion
}

export function solveRackPinion(params: RackPinionParams): { 
  p0: Point2D, 
  p1: Point2D, 
  x: number, 
  valid: boolean 
} {
  const { r, y0, theta } = params;
  
  const p0: Point2D = { x: 0, y: 0 };
  
  // The linear displacement of the rack is the arc length of the pinion's rotation.
  // Assuming standard coordinate system, if rack is at bottom (y0 < 0), a CCW rotation (positive theta)
  // moves the bottom of the pinion to the right, so the rack moves right.
  // x = r * theta * Math.sign(-y0)
  const sign = y0 >= 0 ? -1 : 1;
  const x = sign * r * theta;
  
  // Point on the rack to draw it
  const p1: Point2D = { x, y: y0 };
  
  return { p0, p1, x, valid: true };
}
