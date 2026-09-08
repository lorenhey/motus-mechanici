interface IntermittentParams {
  teeth: number;
  theta: number;
}

export function solveIntermittent({ teeth, theta }: IntermittentParams) {
  // Convert continuous input rotation into discrete output rotation steps
  const stepAngle = (2 * Math.PI) / teeth;
  
  // Create a continuous-looking step by dwelling, then moving quickly
  // Normalize theta to 0..2pi
  const normalizedTheta = (theta % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
  
  // Calculate which tooth we are on
  const toothIndex = Math.floor(normalizedTheta / stepAngle);
  
  // Calculate phase within the current step (0 to 1)
  const phase = (normalizedTheta % stepAngle) / stepAngle;
  
  // Make it dwell for 80% of the cycle, then advance smoothly for 20%
  let outputTheta = toothIndex * stepAngle;
  if (phase > 0.8) {
    const movePhase = (phase - 0.8) / 0.2;
    // Smooth step (cosine interpolation)
    const smoothStep = (1 - Math.cos(movePhase * Math.PI)) / 2;
    outputTheta += smoothStep * stepAngle;
  }
  
  // Also pass the input theta for the driving wheel
  return {
    p0: { x: 0, y: 0 },
    p1: { x: 0, y: 0 },
    theta_out: outputTheta,
    theta_in: theta,
    valid: true
  };
}
