import { describe, it, expect } from 'vitest';
import { solveScotchYoke } from './ScotchYokeSolver';

describe('ScotchYokeSolver', () => {
  it('should calculate pure harmonic motion horizontally', () => {
    const params = { r: 50, theta: 0, vertical: false };
    const res = solveScotchYoke(params);
    
    expect(res.valid).toBe(true);
    expect(res.pos).toBe(50);
  });
  
  it('should calculate pure harmonic motion vertically', () => {
    const params = { r: 50, theta: Math.PI / 2, vertical: true };
    const res = solveScotchYoke(params);
    
    expect(res.valid).toBe(true);
    expect(res.pos).toBeCloseTo(50);
  });
});
