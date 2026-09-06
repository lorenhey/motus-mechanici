import { describe, it, expect } from 'vitest';
import { solveFourBar } from './FourBarSolver';

describe('FourBarSolver', () => {
  it('should preserve all linkage lengths', () => {
    const params = { a: 30, b: 80, c: 60, d: 90, theta: Math.PI / 4, branch: 1 };
    const res = solveFourBar(params);
    
    expect(res.valid).toBe(true);
    
    // Check crank length (a)
    const da = Math.sqrt(res.p1.x ** 2 + res.p1.y ** 2);
    expect(da).toBeCloseTo(params.a);
    
    // Check coupler length (b)
    const db = Math.sqrt((res.p2.x - res.p1.x)**2 + (res.p2.y - res.p1.y)**2);
    expect(db).toBeCloseTo(params.b);
    
    // Check rocker length (c)
    const dc = Math.sqrt((res.p2.x - res.p3.x)**2 + (res.p2.y - res.p3.y)**2);
    expect(dc).toBeCloseTo(params.c);
    
    // Check ground length (d)
    const dd = Math.sqrt((res.p3.x - res.p0.x)**2 + (res.p3.y - res.p0.y)**2);
    expect(dd).toBeCloseTo(params.d);
  });
  
  it('should be invalid for impossible geometries', () => {
    // b is too short to reach from a to c
    const params = { a: 100, b: 10, c: 10, d: 200, theta: 0, branch: 1 };
    const res = solveFourBar(params);
    expect(res.valid).toBe(false);
  });
});
