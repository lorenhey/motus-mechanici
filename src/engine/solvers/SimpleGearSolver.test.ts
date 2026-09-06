import { describe, it, expect } from 'vitest';
import { solveSimpleGear } from './SimpleGearSolver';

describe('SimpleGearSolver', () => {
  it('should calculate correct rotation and distance for external gears', () => {
    const params = { r1: 20, r2: 40, angle: 0, theta: Math.PI / 2, internal: false };
    const res = solveSimpleGear(params);
    
    expect(res.valid).toBe(true);
    expect(res.p0.x).toBe(0);
    expect(res.p1.x).toBe(60); // 20 + 40
    // ratio = 1/2. theta2 = -1 * (PI/2) * (1/2) = -PI/4
    expect(res.theta2).toBeCloseTo(-Math.PI / 4);
  });
  
  it('should calculate correct rotation and distance for internal gears', () => {
    const params = { r1: 20, r2: 60, angle: Math.PI / 2, theta: Math.PI, internal: true };
    const res = solveSimpleGear(params);
    
    expect(res.valid).toBe(true);
    expect(res.p1.x).toBeCloseTo(0);
    expect(res.p1.y).toBeCloseTo(40); // 60 - 20
    // ratio = 1/3. theta2 = 1 * (PI) * (1/3) = PI/3
    expect(res.theta2).toBeCloseTo(Math.PI / 3);
  });
});
