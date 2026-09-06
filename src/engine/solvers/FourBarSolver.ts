import type { Point2D } from '../types';

interface FourBarParams {
  a: number;      // Input link length
  b: number;      // Coupler link length
  c: number;      // Output link length
  d: number;      // Ground link length
  theta: number;  // Input angle (radians)
  branch?: number; // 1 or -1 for the two assembly modes
}

export function solveFourBar(params: FourBarParams): { p0: Point2D, p1: Point2D, p2: Point2D, p3: Point2D, valid: boolean } {
  const { a, b, c, d, theta, branch = 1 } = params;
  
  const p0: Point2D = { x: 0, y: 0 };
  const p3: Point2D = { x: d, y: 0 };
  
  const p1: Point2D = { x: a * Math.cos(theta), y: a * Math.sin(theta) };
  
  // Distance from p1 to p3
  const dx = p3.x - p1.x;
  const dy = p3.y - p1.y;
  const D = Math.sqrt(dx * dx + dy * dy);
  
  // Check validity (triangle inequality)
  if (D > b + c || D < Math.abs(b - c)) {
    // In valid, just return a broken state where it stretches toward it
    return { p0, p1, p2: { x: p1.x + dx/D * b, y: p1.y + dy/D * b }, p3, valid: false };
  }
  
  // Intersection of two circles
  const a_dist = (b * b - c * c + D * D) / (2 * D);
  const h = Math.sqrt(b * b - a_dist * a_dist);
  
  const p_mid = {
    x: p1.x + a_dist * (p3.x - p1.x) / D,
    y: p1.y + a_dist * (p3.y - p1.y) / D
  };
  
  // Branch determines which intersection to take
  const p2 = {
    x: p_mid.x + branch * h * (p3.y - p1.y) / D,
    y: p_mid.y - branch * h * (p3.x - p1.x) / D
  };
  
  return { p0, p1, p2, p3, valid: true };
}
