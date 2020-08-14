import type { Point2D } from '../types';

interface CamFollowerParams {
  r_base: number;      // Base radius
  r_lift: number;      // Maximum lift
  r_follower: number;  // Follower roller radius
  theta: number;       // Cam angle
}

export function solveCamFollower(params: CamFollowerParams): { 
  p0: Point2D, 
  p1: Point2D, 
  p2: Point2D,
  y: number, 
  valid: boolean 
} {
  const { r_base, r_lift, r_follower, theta } = params;
  
  const p0: Point2D = { x: 0, y: 0 };
  
  // Harmonic cam profile for smooth motion
  // L = r_base + lift/2 * (1 - cos(theta))
  // We want the peak to be at theta = 0, so let's use 1 + cos(theta)
  // At theta=0: r_base + r_lift
  // At theta=pi: r_base
  const L = r_base + r_lift * (1 + Math.cos(theta)) / 2;
  
  // Follower center position (assuming it's directly above the cam)
  const y = L + r_follower;
  const p1: Point2D = { x: 0, y };
  const p2: Point2D = { x: 0, y: y + 50 }; // rod end
  
  return { p0, p1, p2, y, valid: true };
}
