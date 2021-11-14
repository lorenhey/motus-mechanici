interface DirectParams {
  speed: number;
  theta: number;
}

export function solveDirect({ speed, theta }: DirectParams) {
  // Simple continuous rotation
  const angle = theta * speed;
  
  return {
    p0: { x: 0, y: 0 },
    p1: { x: 0, y: 0 },
    angle: angle,
    valid: true
  };
}
