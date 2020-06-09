import { describe, it, expect } from 'vitest';
import { solveBeltPulley } from './BeltPulleySolver';

describe('BeltPulleySolver', () => {
  it('should calculate correct rotation for open belt', () => {
    const params = { r1: 30, r2: 60, dx: 100, dy: 0, theta: Math.PI / 2, crossed: false };
    const res = solveBeltPulley(params);
    
    expect(res.valid).toBe(true);
    // ratio = 1/2. theta2 = (PI/2) * (1/2) = PI/4
    expect(res.theta2).toBeCloseTo(Math.PI / 4);
  });
  
  it('should calculate correct rotation for crossed belt', () => {
    const params = { r1: 30, r2: 60, dx: 100, dy: 0, theta: Math.PI / 2, crossed: true };
    const res = solveBeltPulley(params);
    
    expect(res.valid).toBe(true);
    // ratio = 1/2. theta2 = -1 * (PI/2) * (1/2) = -PI/4
    expect(res.theta2).toBeCloseTo(-Math.PI / 4);
  });
  
  it('should be invalid if pulleys overlap too much', () => {
    const params = { r1: 30, r2: 60, dx: 20, dy: 0, theta: 0, crossed: false };
    const res = solveBeltPulley(params);
    expect(res.valid).toBe(false); // distance 20 < abs(30 - 60)
  });
});
