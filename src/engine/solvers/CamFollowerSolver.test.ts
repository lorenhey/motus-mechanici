import { describe, it, expect } from 'vitest';
import { solveCamFollower } from './CamFollowerSolver';

describe('CamFollowerSolver', () => {
  it('should calculate correct maximum lift at theta = 0', () => {
    const params = { r_base: 20, r_lift: 10, r_follower: 5, theta: 0 };
    const res = solveCamFollower(params);
    
    expect(res.valid).toBe(true);
    // L = 20 + 10 = 30. y = 30 + 5 = 35.
    expect(res.y).toBe(35);
  });

  it('should calculate correct minimum lift at theta = PI', () => {
    const params = { r_base: 20, r_lift: 10, r_follower: 5, theta: Math.PI };
    const res = solveCamFollower(params);
    
    expect(res.valid).toBe(true);
    // L = 20 + 0 = 20. y = 20 + 5 = 25.
    expect(res.y).toBe(25);
  });
});
