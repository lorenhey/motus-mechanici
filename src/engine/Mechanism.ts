import type { MechanismDefinition, Point2D } from './types';
import { solveCrankSlider } from './solvers/CrankSliderSolver';
import { solveFourBar } from './solvers/FourBarSolver';

export class Mechanism {
  def: MechanismDefinition;
  
  // Current state of parameters and variables
  state: Record<string, number> = {};
  
  // Computed positions of all joints/points for rendering
  points: Record<string, Point2D> = {};

  // Validity of the current geometric configuration
  valid: boolean = true;

  constructor(def: MechanismDefinition) {
    this.def = def;
    for (const p of def.parameters) {
      this.state[p.id] = p.value;
    }
    for (const v of def.variables) {
      this.state[v.id] = 0;
    }
    this.solve();
  }

  update(key: string, value: number) {
    this.state[key] = value;
    this.solve();
  }

  solve() {
    if (this.def.solver.type === 'CRANK_SLIDER') {
      const r = this.state['r'];
      const l = this.state['l'];
      const e = this.state['e'] || 0;
      const theta = this.state['theta'];
      
      const res = solveCrankSlider({ r, l, e, theta });
      this.points['p0'] = res.p0;
      this.points['p1'] = res.p1;
      this.points['p2'] = res.p2;
      this.valid = res.valid;
      
      // Update dependent variables (e.g., slider position)
      this.state['x'] = res.p2.x;
    } else if (this.def.solver.type === 'FOUR_BAR') {
      const a = this.state['a'];
      const b = this.state['b'];
      const c = this.state['c'];
      const d = this.state['d'];
      const theta = this.state['theta'];
      const branch = this.state['branch'] || 1;
      
      const res = solveFourBar({ a, b, c, d, theta, branch });
      this.points['p0'] = res.p0;
      this.points['p1'] = res.p1;
      this.points['p2'] = res.p2;
      this.points['p3'] = res.p3;
      this.valid = res.valid;
      
      // Calculate output angle phi
      let phi = Math.atan2(res.p2.y - res.p3.y, res.p2.x - res.p3.x);
      if (phi < 0) phi += 2 * Math.PI;
      this.state['phi'] = phi;
    }
  }
}
