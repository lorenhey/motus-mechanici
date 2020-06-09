import { describe, it, expect } from 'vitest';
import { solvePlanetaryGear } from './PlanetaryGearSolver';

describe('PlanetaryGearSolver', () => {
  it('should calculate correct ring angle when carrier is stationary', () => {
    // If carrier is stationary (wc = 0), ring rotates opposite to sun
    // wr = -ws * (rs/rr)
    const params = { rs: 20, rp: 10, theta_s: Math.PI, theta_c: 0 };
    // rr = 20 + 2*10 = 40. rs/rr = 20/40 = 0.5
    // wr should be -Math.PI * 0.5 = -PI/2
    const res = solvePlanetaryGear(params);
    
    expect(res.valid).toBe(true);
    expect(res.theta_r).toBeCloseTo(-Math.PI / 2);
  });
  
  it('should calculate correct sun angle when ring is stationary (implied check)', () => {
    // If ring is stationary (wr = 0), then (rr+rs)*wc = rs*ws => wc = ws * rs/(rr+rs)
    // Let's test the forward function with this wc and check if wr is 0
    const rs = 20;
    const rp = 10;
    const rr = 40;
    const theta_s = Math.PI;
    const theta_c = theta_s * rs / (rr + rs); // PI * 20 / 60 = PI/3
    
    const params = { rs, rp, theta_s, theta_c };
    const res = solvePlanetaryGear(params);
    
    expect(res.valid).toBe(true);
    expect(res.theta_r).toBeCloseTo(0);
  });
});
