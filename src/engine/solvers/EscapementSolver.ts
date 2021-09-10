interface EscapementParams {
  teeth: number;
  amplitude: number; // Pendulum swing amplitude (radians)
  theta: number; // Continuous driving variable representing time
}

export function solveEscapement({ teeth, amplitude, theta }: EscapementParams) {
  // Pendulum oscillates harmonically with time 'theta'
  const pendulumAngle = amplitude * Math.sin(theta);
  
  // The escape wheel advances one half-tooth per half-swing
  const stepAngle = (2 * Math.PI) / teeth;
  
  // Create a continuous-looking tick based on the sine wave
  const cycles = Math.floor(theta / Math.PI);
  const phase = (theta % Math.PI) / Math.PI; // 0 to 1
  
  let wheelAngle = (cycles * stepAngle) / 2;
  
  // Rapid tick at the peak of velocity (around phase 0.5)
  if (phase > 0.45 && phase < 0.55) {
    const tickPhase = (phase - 0.45) / 0.1;
    const smoothTick = (1 - Math.cos(tickPhase * Math.PI)) / 2;
    wheelAngle += smoothTick * (stepAngle / 2);
  } else if (phase >= 0.55) {
    wheelAngle += stepAngle / 2;
  }
  
  return {
    p0: { x: 0, y: 0 },
    p1: { x: 0, y: 0 },
    pendulum_angle: pendulumAngle,
    wheel_angle: -wheelAngle, // escape wheels usually turn opposite to standard math positive
    valid: true
  };
}
