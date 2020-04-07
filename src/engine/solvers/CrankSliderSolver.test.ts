import { describe, it, expect } from 'vitest';
import { solveCrankSlider } from './CrankSliderSolver';

describe('CrankSliderSolver', () => {
  it('should correctly calculate slider position for theta = 0', () => {
    // crank horizontal right
    const params = { r: 40, l: 100, e: 0, theta: 0 };
    const res = solveCrankSlider(params);
    
    expect(res.valid).toBe(true);
    expect(res.p1.x).toBeCloseTo(40);
    expect(res.p1.y).toBeCloseTo(0);
    expect(res.p2.y).toBeCloseTo(0);
    // At theta=0, p1 is at (40,0). The rod goes from p1 to p2. 
    // l^2 = dx^2 + dy^2 => 100^2 = dx^2 + 0 => dx = 100.
    // p2 = p1.x + dx = 140
    expect(res.p2.x).toBeCloseTo(140);
  });

  it('should preserve linkage lengths', () => {
    const params = { r: 35.5, l: 90.2, e: 10, theta: Math.PI / 3 };
    const res = solveCrankSlider(params);
    
    expect(res.valid).toBe(true);
    
    // Check crank length
    const cr = Math.sqrt(res.p1.x ** 2 + res.p1.y ** 2);
    expect(cr).toBeCloseTo(35.5);
    
    // Check rod length
    const dx = res.p2.x - res.p1.x;
    const dy = res.p2.y - res.p1.y;
    const cl = Math.sqrt(dx * dx + dy * dy);
    expect(cl).toBeCloseTo(90.2);
  });
  
  it('should be invalid if offset is too large', () => {
    const params = { r: 40, l: 100, e: 150, theta: 0 };
    const res = solveCrankSlider(params);
    expect(res.valid).toBe(false);
  });
});
