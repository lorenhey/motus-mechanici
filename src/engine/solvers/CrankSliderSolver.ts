import type { Point2D } from '../types';

interface CrankSliderParams {
  r: number;      // Crank radius
  l: number;      // Connecting rod length
  e: number;      // Offset
  theta: number;  // Crank angle (radians)
}

export function solveCrankSlider(params: CrankSliderParams): { p0: Point2D, p1: Point2D, p2: Point2D, valid: boolean } {
  const { r, l, e, theta } = params;
  
  const p0: Point2D = { x: 0, y: 0 };
  const p1: Point2D = { x: r * Math.cos(theta), y: r * Math.sin(theta) };
  
  // Distance to be covered by rod in y direction
  const dy = e - p1.y;
  
  // Check if geometrically valid
  if (Math.abs(dy) > l) {
    return { p0, p1, p2: { x: p1.x, y: e }, valid: false }; // Broken linkage
  }
  
  const dx = Math.sqrt(l * l - dy * dy);
  
  // Typically we want the slider to be to the right of the crank (positive dx)
  const p2: Point2D = { x: p1.x + dx, y: e };
  
  return { p0, p1, p2, valid: true };
}
