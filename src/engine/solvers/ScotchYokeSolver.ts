import type { Point2D } from '../types';

interface ScotchYokeParams {
  r: number;       // Crank radius
  theta: number;   // Crank angle
  vertical?: boolean; // if true, motion is vertical (y = r*sin(theta))
}

export function solveScotchYoke(params: ScotchYokeParams): { 
  p0: Point2D, 
  p1: Point2D, 
  p2: Point2D,
  pos: number, 
  valid: boolean 
} {
  const { r, theta, vertical = false } = params;
  
  const p0: Point2D = { x: 0, y: 0 };
  
  // Crank pin
  const p1: Point2D = { 
    x: r * Math.cos(theta), 
    y: r * Math.sin(theta) 
  };
  
  const pos = vertical ? p1.y : p1.x;
  
  // Yoke center
  const p2: Point2D = vertical ? { x: 0, y: pos } : { x: pos, y: 0 };
  
  return { p0, p1, p2, pos, valid: true };
}
