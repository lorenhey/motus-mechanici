import type { Point2D } from '../types';

interface PlanetaryGearParams {
  rs: number;      // Sun radius
  rp: number;      // Planet radius
  theta_s: number; // Sun angle
  theta_c: number; // Carrier angle
}

export function solvePlanetaryGear(params: PlanetaryGearParams): { 
  p0: Point2D, 
  p1: Point2D, 
  theta_r: number, 
  theta_p: number,
  valid: boolean 
} {
  const { rs, rp, theta_s, theta_c } = params;
  
  const p0: Point2D = { x: 0, y: 0 };
  
  // Carrier distance to planet center
  const d = rs + rp;
  
  // Planet center position
  const p1: Point2D = { 
    x: d * Math.cos(theta_c), 
    y: d * Math.sin(theta_c) 
  };
  
  // Ring radius
  const rr = rs + 2 * rp;
  
  // Ring angle (from (rr)*wr + (rs)*ws = (rr+rs)*wc)
  // wr = ((rr+rs)*wc - rs*ws) / rr
  const theta_r = ((rr + rs) * theta_c - rs * theta_s) / rr;
  
  // Planet angle
  // Planet meshes with sun. Velocity of mesh point: rs * ws
  // Center of planet moves at d * wc
  // Rotation of planet wp: d*wc - rp*wp = rs*ws => rp*wp = d*wc - rs*ws
  // wp = (d*wc - rs*ws) / rp
  const theta_p = (d * theta_c - rs * theta_s) / rp;
  
  return { p0, p1, theta_r, theta_p, valid: true };
}
