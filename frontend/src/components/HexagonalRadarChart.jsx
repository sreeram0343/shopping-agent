import React, { useState } from 'react';

const specs = [
  { name: 'ANC', label: 'Noise Cancellation' },
  { name: 'Bass', label: 'Bass Response' },
  { name: 'Treble', label: 'High Treble' },
  { name: 'Stage', label: 'Soundstage' },
  { name: 'Comfort', label: 'Comfort Rate' },
  { name: 'Battery', label: 'Battery Life' }
];

const headphoneData = [
  {
    name: 'Sony WH-1000XM5',
    color: '#00F2FE', // Neon Cyan
    values: { ANC: 0.98, Bass: 0.85, Treble: 0.90, Stage: 0.85, Comfort: 0.90, Battery: 0.75 }
  },
  {
    name: 'Bose QC 45',
    color: '#E02424', // Red / Crimson
    values: { ANC: 0.95, Bass: 0.75, Treble: 0.85, Stage: 0.80, Comfort: 0.98, Battery: 0.70 }
  },
  {
    name: 'Sennheiser M4',
    color: '#D946EF', // Neon Magenta/Purple
    values: { ANC: 0.92, Bass: 0.95, Treble: 0.95, Stage: 0.95, Comfort: 0.85, Battery: 0.98 }
  }
];

export default function HexagonalRadarChart() {
  const [activeItem, setActiveItem] = useState(null);
  
  const cx = 110;
  const cy = 110;
  const r = 75;
  const numAxes = 6;

  // Calculate coordinates for a given value on a specific axis (0 to 5)
  const getCoords = (axisIdx, val) => {
    const angle = -Math.PI / 2 + (axisIdx * (2 * Math.PI)) / numAxes;
    const x = cx + r * val * Math.cos(angle);
    const y = cy + r * val * Math.sin(angle);
    return { x, y };
  };

  // Generate grid points for concentric hexagons (levels 0.2, 0.4, 0.6, 0.8, 1.0)
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Audio Spec Analysis</h3>
        <div className="flex gap-2">
          {headphoneData.map((hp) => (
            <button
              key={hp.name}
              onMouseEnter={() => setActiveItem(hp.name)}
              onMouseLeave={() => setActiveItem(null)}
              className="flex items-center gap-1.5 text-[9px] font-bold transition-all px-2 py-0.5 rounded-full border border-white/5 bg-white/3"
              style={{ color: hp.color }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: hp.color }} />
              <span>{hp.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center p-2.5 bg-white/2 rounded-2xl border border-white/5 relative overflow-hidden">
        {/* Decorative Grid Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 pointer-events-none" />
        
        <svg className="w-56 h-56 select-none relative z-10" viewBox="0 0 220 220">
          {/* Outer Ring Ambient Glow */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="8" />

          {/* Draw Hexagonal Concentric Grid Lines */}
          {gridLevels.map((lvl, index) => {
            const points = Array.from({ length: numAxes }, (_, i) => {
              const { x, y } = getCoords(i, lvl);
              return `${x},${y}`;
            }).join(' ');
            
            return (
              <polygon
                key={index}
                points={points}
                fill="none"
                stroke="rgba(255, 255, 255, 0.06)"
                strokeWidth="1.2"
                strokeDasharray={lvl === 1.0 ? '0' : '2,2'}
              />
            );
          })}

          {/* Draw Radial Axis Lines */}
          {Array.from({ length: numAxes }).map((_, i) => {
            const { x, y } = getCoords(i, 1);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1.2"
              />
            );
          })}

          {/* Draw Spec Labels */}
          {specs.map((spec, i) => {
            const { x, y } = getCoords(i, 1.22);
            let textAnchor = 'middle';
            let dy = '0.35em';
            
            if (x < cx - 10) textAnchor = 'end';
            else if (x > cx + 10) textAnchor = 'start';
            
            if (y < cy - 20) dy = '-0.2em';
            else if (y > cy + 20) dy = '0.9em';

            return (
              <text
                key={spec.name}
                x={x}
                y={y}
                fill="rgba(255, 255, 255, 0.6)"
                fontSize="8"
                fontWeight="800"
                fontFamily="Outfit, sans-serif"
                textAnchor={textAnchor}
                dy={dy}
              >
                {spec.name}
              </text>
            );
          })}

          {/* Draw Product Polygons */}
          {headphoneData.map((hp) => {
            const points = specs.map((spec, i) => {
              const val = hp.values[spec.name];
              const { x, y } = getCoords(i, val);
              return `${x},${y}`;
            }).join(' ');

            const isDimmed = activeItem && activeItem !== hp.name;
            const isHighlighted = activeItem === hp.name;

            return (
              <g key={hp.name} style={{ transition: 'opacity 0.3s ease' }} className={isDimmed ? 'opacity-25' : 'opacity-100'}>
                {/* Polygon Shape */}
                <polygon
                  points={points}
                  fill={`${hp.color}15`}
                  stroke={hp.color}
                  strokeWidth={isHighlighted ? 2.5 : 1.5}
                  className="transition-all"
                  style={{
                    filter: isHighlighted ? `drop-shadow(0 0 4px ${hp.color})` : 'none'
                  }}
                />
                {/* Vertex Dots */}
                {specs.map((spec, i) => {
                  const val = hp.values[spec.name];
                  const { x, y } = getCoords(i, val);
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r={isHighlighted ? 3.5 : 2.5}
                      fill="#030310"
                      stroke={hp.color}
                      strokeWidth={isHighlighted ? 2 : 1.5}
                      style={{ transition: 'all 0.2s ease' }}
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* Spec labels legend detailing axis details */}
      <div className="grid grid-cols-3 gap-2 mt-1">
        {specs.slice(0, 3).map((spec, idx) => (
          <div key={spec.name} className="flex flex-col items-center p-1.5 rounded-lg bg-white/2 border border-white/5 text-center">
            <span className="text-[8px] font-extrabold text-slate-400 tracking-wider uppercase">{spec.name}</span>
            <span className="text-[7px] text-slate-500 font-semibold truncate w-full">{spec.label}</span>
          </div>
        ))}
        {specs.slice(3, 6).map((spec, idx) => (
          <div key={spec.name} className="flex flex-col items-center p-1.5 rounded-lg bg-white/2 border border-white/5 text-center">
            <span className="text-[8px] font-extrabold text-slate-400 tracking-wider uppercase">{spec.name}</span>
            <span className="text-[7px] text-slate-500 font-semibold truncate w-full">{spec.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
