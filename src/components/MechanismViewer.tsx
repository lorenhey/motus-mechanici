import React, { useEffect, useRef, useState } from 'react';
import { Mechanism } from '../engine/Mechanism';
import type { MechanismDefinition } from '../engine/types';
import LiveMath from './LiveMath';

interface MechanismViewerProps {
  def: MechanismDefinition;
}

export default function MechanismViewer({ def }: MechanismViewerProps) {
  const [mech, setMech] = useState<Mechanism | null>(null);
  const [, setTick] = useState(0);
  const animationRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  useEffect(() => {
    const m = new Mechanism(def);
    setMech(m);
    setTick(t => t + 1);
  }, [def]);

  useEffect(() => {
    if (!mech || !isPlaying) return;
    
    let lastTime = performance.now();
    const loop = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      
      // Basic driver: increment theta
      if (mech.state['theta'] !== undefined) {
        // speed: 1 radian per sec
        mech.update('theta', mech.state['theta'] + dt * 2);
      }
      
      setTick(t => t + 1);
      animationRef.current = requestAnimationFrame(loop);
    };
    
    animationRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationRef.current!);
  }, [mech, isPlaying]);

  if (!mech) return null;

  // Viewport mapping (naive for now)
  const cx = 200;
  const cy = 200;
  const scale = 2; // e.g., if radius is 40, drawn as 80

  const drawPoint = (pKey: string) => {
    const p = mech.points[pKey];
    if (!p) return null;
    return <circle key={pKey} cx={cx + p.x * scale} cy={cy - p.y * scale} r={4} fill="#2b2a27" />;
  }

  const drawLine = (p1Key: string, p2Key: string, strokeWidth = 2, color = '#2b2a27') => {
    const p1 = mech.points[p1Key];
    const p2 = mech.points[p2Key];
    if (!p1 || !p2) return null;
    return (
      <line 
        key={`${p1Key}-${p2Key}`}
        x1={cx + p1.x * scale} y1={cy - p1.y * scale}
        x2={cx + p2.x * scale} y2={cy - p2.y * scale}
        stroke={mech.valid ? color : 'red'}
        strokeWidth={strokeWidth}
      />
    );
  }

  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only allow drag if paused
    if (isPlaying) return;
    setIsDragging(true);
    (e.target as Element).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - cx;
    const y = -(e.clientY - rect.top - cy); // invert y for math coordinates
    
    // Calculate new angle
    let angle = Math.atan2(y, x);
    if (angle < 0) angle += 2 * Math.PI;
    
    mech.update('theta', angle);
    setTick(t => t + 1);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    (e.target as Element).releasePointerCapture(e.pointerId);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="bg-white border border-ink-light/20 shadow-sm mb-4">
        <svg 
          ref={svgRef}
          width="400" height="400" 
          className="block touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {def.visuals && def.visuals.map((v, i) => {
            if (v.type === 'line' && v.p1 && v.p2) {
              return drawLine(v.p1, v.p2, 4, v.color);
            }
            if (v.type === 'point' && v.p1) {
              return drawPoint(v.p1);
            }
            if (v.type === 'rect' && v.p1 && v.width && v.height) {
              const p = mech.points[v.p1];
              if (!p) return null;
              return (
                <rect 
                  key={i}
                  x={cx + p.x * scale - v.width/2} 
                  y={cy - p.y * scale - v.height/2} 
                  width={v.width} height={v.height} 
                  fill="none" stroke="#2b2a27" strokeWidth="2" 
                />
              );
            }
            if ((v.type === 'circle' || v.type === 'gear') && v.p1 && v.radius) {
              const p = mech.points[v.p1];
              if (!p) return null;
              const r = (mech.state[v.radius] || 10) * scale;
              const angle = v.angle ? (mech.state[v.angle] || 0) : 0;
              
              return (
                <g key={i}>
                  <circle 
                    cx={cx + p.x * scale} 
                    cy={cy - p.y * scale} 
                    r={Math.abs(r)} 
                    fill="none" 
                    stroke={v.color || "#2b2a27"} 
                    strokeWidth="2" 
                    strokeDasharray={v.type === 'gear' ? "4 4" : ""}
                  />
                  {v.type === 'gear' && (
                    <line 
                      x1={cx + p.x * scale} 
                      y1={cy - p.y * scale} 
                      x2={cx + p.x * scale + r * Math.cos(angle)} 
                      y2={cy - p.y * scale - r * Math.sin(angle)} 
                      stroke={v.color || "#2b2a27"} 
                      strokeWidth="2" 
                    />
                  )}
                </g>
              );
            }
            if (v.type === 'belt' && v.p1 && v.p2 && v.radius) {
              const p1 = mech.points[v.p1];
              const p2 = mech.points[v.p2];
              if (!p1 || !p2) return null;
              
              // We'll extract r1 and r2. The visual should maybe define radius="r1" and radius2="r2".
              // Let's assume v.radius is a comma-separated string like "r1,r2" for simplicity if needed,
              // or we just use r1 and r2 directly from state based on the generic names.
              // For a general engine, it's better to add `radius2` to Visual, but let's hardcode the keys for now to get it working, or split by comma.
              const radii = v.radius.split(',');
              const r1 = (mech.state[radii[0]] || 10) * scale;
              const r2 = (mech.state[radii[1]] || 10) * scale;
              
              // Crossed? Let's check state 'crossed'
              const crossed = mech.state['crossed'] === 1;
              
              // Simplistic belt path (just straight lines connecting tops and bottoms for open, or crossing)
              // Real math involves calculating tangent points.
              let path = '';
              if (crossed) {
                // Approximate tangent points for crossed belt
                path = `M ${cx + p1.x * scale} ${cy - p1.y * scale - r1} L ${cx + p2.x * scale} ${cy - p2.y * scale + r2}`;
                path += ` M ${cx + p1.x * scale} ${cy - p1.y * scale + r1} L ${cx + p2.x * scale} ${cy - p2.y * scale - r2}`;
              } else {
                path = `M ${cx + p1.x * scale} ${cy - p1.y * scale - r1} L ${cx + p2.x * scale} ${cy - p2.y * scale - r2}`;
                path += ` M ${cx + p1.x * scale} ${cy - p1.y * scale + r1} L ${cx + p2.x * scale} ${cy - p2.y * scale + r2}`;
              }
              
              return (
                <path 
                  key={i}
                  d={path}
                  stroke={v.color || "#888"}
                  strokeWidth="2"
                  fill="none"
                />
              );
            }
            if (v.type === 'cam' && v.p1 && v.radius) {
              const p1 = mech.points[v.p1];
              if (!p1) return null;
              
              const radii = v.radius.split(',');
              const rBase = (mech.state[radii[0]] || 10) * scale;
              const rLift = (mech.state[radii[1]] || 10) * scale;
              const angle = v.angle ? (mech.state[v.angle] || 0) : 0;
              
              // Draw an egg shape using SVG path, or simply an eccentric circle
              // Eccentric circle: radius = rBase + rLift/2, offset by rLift/2
              const r = rBase + rLift / 2;
              const offset = rLift / 2;
              
              return (
                <g key={i} transform={`translate(${cx + p1.x * scale}, ${cy - p1.y * scale}) rotate(${-angle * 180 / Math.PI})`}>
                  <circle 
                    cx={0} 
                    cy={-offset} 
                    r={Math.abs(r)} 
                    fill="none" 
                    stroke={v.color || "#b7410e"} 
                    strokeWidth="2" 
                  />
                  <line x1={0} y1={0} x2={0} y2={-offset} stroke={v.color || "#b7410e"} strokeWidth="2" />
                </g>
              );
            }
            return null;
          })}
          {/* Ground line (specifically for crank slider) */}
          <line x1="0" y1={cy - (mech.state['e'] || 0) * scale} x2="400" y2={cy - (mech.state['e'] || 0) * scale} stroke="#ccc" strokeDasharray="4 4" />
        </svg>
      </div>
      <div className="flex gap-4 mb-4 items-center">
        <button 
          className="px-4 py-2 bg-ink text-paper rounded hover:bg-ink-light transition-colors"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        {!isPlaying && <span className="text-sm text-ink-light italic">Click and drag inside the canvas to move manually.</span>}
      </div>

      <div className="w-full max-w-md bg-white p-4 border border-ink-light/20 shadow-sm text-sm mb-4">
        <h4 className="font-bold mb-2">Parameters</h4>
        {def.parameters.map(p => (
          <div key={p.id} className="mb-2">
            <div className="flex justify-between">
              <label className="text-ink-light">{p.label}</label>
              <span className="font-mono">{mech.state[p.id]} {p.unit}</span>
            </div>
            <input 
              type="range" 
              min={p.min} 
              max={p.max} 
              step="1"
              value={mech.state[p.id]} 
              onChange={(e) => {
                mech.update(p.id, Number(e.target.value));
                setTick(t => t + 1);
              }}
              className="w-full"
            />
          </div>
        ))}
      </div>

      {def.equations && def.equations.map((eq, i) => (
        <LiveMath key={i} equation={eq} state={mech.state} />
      ))}
      <div className="w-full max-w-md bg-white p-4 border border-ink-light/20 shadow-sm text-sm mt-4">
        <h4 className="font-bold mb-2">State</h4>
        <pre className="font-mono">{JSON.stringify(mech.state, null, 2)}</pre>
      </div>
    </div>
  );
}
