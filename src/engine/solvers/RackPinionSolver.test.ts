import { describe, it, expect } from 'vitest';
import { solveRackPinion } from './RackPinionSolver';

describe('RackPinionSolver', () => {
  it('should calculate correct rack position when rack is below pinion', () => {
    // Pinion radius 20, rack at y = -20
    const params = { r: 20, y0: -20, theta: Math.PI / 2 }; // 90 degrees CCW
    const res = solveRackPinion(params);
    
    expect(res.valid).toBe(true);
    // x = -(Math.PI/2) * -20 = 10 * PI ≈ 31.4159
    expect(res.x).toBeCloseTo(10 * Math.PI);
    expect(res.p1.x).toBeCloseTo(10 * Math.PI);
    expect(res.p1.y).toBe(-20);
  });

  it('should calculate correct rack position when rack is above pinion', () => {
    // Pinion radius 20, rack at y = 20
    const params = { r: 20, y0: 20, theta: Math.PI / 2 }; // 90 degrees CCW
    const res = solveRackPinion(params);
    
    expect(res.valid).toBe(true);
    // x = -(Math.PI/2) * 20 = -10 * PI ≈ -31.4159
    expect(res.x).toBeCloseTo(-10 * Math.PI);
  });
});
