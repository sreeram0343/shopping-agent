import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Sliders, Shield, Zap } from 'lucide-react';

export default function GravityCore() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [metrics, setMetrics] = useState({
    gravityIntensity: 88,
    spinVelocity: '0.042 rad/s',
    coreSingularity: 'STABLE',
    fluxDensity: '4.85 Tb/s'
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = canvas.width = 300;
    let height = canvas.height = 300;

    const resizeCanvas = () => {
      if (containerRef.current) {
        width = canvas.width = containerRef.current.clientWidth;
        height = canvas.height = Math.max(containerRef.current.clientHeight, 350);
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse coordinates relative to canvas
    let mouse = { x: null, y: null, active: false, targetX: null, targetY: null };

    // Accretion disk dust particles
    const dustCount = 120;
    const dustParticles = [];
    for (let i = 0; i < dustCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 110;
      dustParticles.push({
        angle: angle,
        distance: distance,
        speed: (0.015 + Math.random() * 0.02) * (70 / distance), // Closer spins faster
        size: 0.6 + Math.random() * 1.5,
        color: Math.random() > 0.4 ? 'rgba(0, 242, 254, ' + (0.3 + Math.random() * 0.5) + ')' : 'rgba(217, 70, 239, ' + (0.3 + Math.random() * 0.5) + ')'
      });
    }

    // 3D Orbiting Data Nodes
    const dataNodes = [
      { id: 1, label: 'ANC Node', symbol: 'ANC', value: '98%', radius: 65, speed: 0.007, angle: 0, phaseY: 0.5, size: 6, color: '#00F2FE' },
      { id: 2, label: 'Bass Node', symbol: 'BASS', value: '95Hz', radius: 95, speed: -0.005, angle: Math.PI / 3, phaseY: -0.8, size: 7, color: '#D946EF' },
      { id: 3, label: 'Latency Node', symbol: 'LAT', value: '40ms', radius: 120, speed: 0.004, angle: (Math.PI * 2) / 3, phaseY: 0.2, size: 5, color: '#10B981' },
      { id: 4, label: 'Battery Node', symbol: 'BATT', value: '60h', radius: 135, speed: -0.003, angle: Math.PI, phaseY: 0.9, size: 6, color: '#F59E0B' },
      { id: 5, label: 'Spatial Node', symbol: '3D', value: '9.1.2', radius: 80, speed: 0.006, angle: (Math.PI * 4) / 3, phaseY: -0.3, size: 5, color: '#3B82F6' }
    ];

    // Constellation link definitions
    const constellationLinks = [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 2], [1, 3]
    ];

    // Lensing ring configurations
    let lensePhase = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2 - 20;

      // Update Mouse coordinates smoothing
      if (mouse.active && mouse.targetX !== null) {
        if (mouse.x === null) {
          mouse.x = mouse.targetX;
          mouse.y = mouse.targetY;
        } else {
          mouse.x += (mouse.targetX - mouse.x) * 0.1;
          mouse.y += (mouse.targetY - mouse.y) * 0.1;
        }
      } else {
        mouse.x = null;
        mouse.y = null;
      }

      // 1. Volumetric Deep Space Nebula background
      const gradNebula = ctx.createRadialGradient(cx, cy, 10, cx, cy, 180);
      gradNebula.addColorStop(0, 'rgba(13, 12, 53, 0.4)');
      gradNebula.addColorStop(0.5, 'rgba(7, 6, 31, 0.2)');
      gradNebula.addColorStop(1, 'rgba(3, 3, 16, 0)');
      ctx.fillStyle = gradNebula;
      ctx.beginPath();
      ctx.arc(cx, cy, 200, 0, Math.PI * 2);
      ctx.fill();

      // 2. Holographic concentric ticker rings
      lensePhase += 0.003;
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.06)';
      ctx.lineWidth = 1;
      
      // Ring 1 (Inner grid)
      ctx.beginPath();
      ctx.arc(cx, cy, 55, 0, Math.PI * 2);
      ctx.stroke();

      // Ring 2 (Outer tick ring)
      ctx.strokeStyle = 'rgba(217, 70, 239, 0.04)';
      ctx.beginPath();
      ctx.arc(cx, cy, 115, 0, Math.PI * 2);
      ctx.stroke();
      
      // Draw ticks on Outer Ring
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 18) {
        const x1 = cx + Math.cos(a + lensePhase) * 112;
        const y1 = cy + Math.sin(a + lensePhase) * 112;
        const x2 = cx + Math.cos(a + lensePhase) * 118;
        const y2 = cy + Math.sin(a + lensePhase) * 118;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // 3. Draw Constellation lines between orbiting 3D data nodes
      ctx.lineWidth = 1;
      const projectedNodes = dataNodes.map(node => {
        // Simple 3D projection
        // Orbit on XZ plane, tilted on Y
        node.angle += node.speed;
        
        let nodeX = Math.cos(node.angle) * node.radius;
        let nodeZ = Math.sin(node.angle) * node.radius;
        
        // Tilt
        let nodeY = nodeZ * node.phaseY;
        
        // Lens distort towards cursor if mouse is nearby
        if (mouse.x !== null) {
          const dx = nodeX + cx - mouse.x;
          const dy = nodeY + cy - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const force = (100 - dist) / 100 * 18;
            nodeX -= (dx / dist) * force;
            nodeY -= (dy / dist) * force;
          }
        }

        const screenX = cx + nodeX;
        const screenY = cy + nodeY;
        const scale = (nodeZ + node.radius * 2) / (node.radius * 3); // 0.33 to 1.0

        return {
          ...node,
          x: screenX,
          y: screenY,
          scale: scale,
          zDepth: nodeZ
        };
      });

      // Draw lines between nodes
      const sortedLinks = [...constellationLinks].sort((a, b) => {
        const depthA = projectedNodes[a[0]].zDepth + projectedNodes[a[1]].zDepth;
        const depthB = projectedNodes[b[0]].zDepth + projectedNodes[b[1]].zDepth;
        return depthA - depthB;
      });

      sortedLinks.forEach(([u, v]) => {
        const n1 = projectedNodes[u];
        const n2 = projectedNodes[v];
        
        const avgScale = (n1.scale + n2.scale) / 2;
        const gradLink = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
        gradLink.addColorStop(0, n1.color + Math.floor(avgScale * 25).toString(16).padStart(2, '0'));
        gradLink.addColorStop(1, n2.color + Math.floor(avgScale * 25).toString(16).padStart(2, '0'));
        
        ctx.strokeStyle = gradLink;
        ctx.lineWidth = 1 * avgScale;
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.stroke();
      });

      // 4. Update and render accretion dust particles
      dustParticles.forEach(p => {
        p.angle += p.speed;
        
        // Gravitational pull / distortion towards cursor
        let dist = p.distance;
        let px = cx + Math.cos(p.angle) * dist;
        let py = cy + Math.sin(p.angle) * dist;

        if (mouse.x !== null) {
          const dx = px - mouse.x;
          const dy = py - mouse.y;
          const mouseDist = Math.sqrt(dx * dx + dy * dy);
          if (mouseDist < 80) {
            const pullForce = (80 - mouseDist) / 80 * 8;
            px -= (dx / mouseDist) * pullForce;
            py -= (dy / mouseDist) * pullForce;
          }
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 5. Draw Black Hole Singularity at Center
      // Singularity core (Pure event horizon)
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx.fill();

      // Accretion inner disk hot glow
      const gradCore = ctx.createRadialGradient(cx, cy, 16, cx, cy, 38);
      gradCore.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
      gradCore.addColorStop(0.15, 'rgba(0, 242, 254, 0.85)'); // Hot cyan edge
      gradCore.addColorStop(0.4, 'rgba(217, 70, 239, 0.4)'); // Purple corona
      gradCore.addColorStop(1, 'rgba(8, 7, 30, 0)');
      
      ctx.fillStyle = gradCore;
      ctx.beginPath();
      ctx.arc(cx, cy, 40, 0, Math.PI * 2);
      ctx.fill();

      // Gravitational lens deflection ring
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#00F2FE';
      ctx.beginPath();
      ctx.arc(cx + Math.cos(lensePhase * 5) * 1.5, cy + Math.sin(lensePhase * 5) * 1.5, 21, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow

      // 6. Draw 3D Orbiting Data Nodes
      // Sort nodes by depth for correct 3D overlapping
      const sortedNodes = [...projectedNodes].sort((a, b) => a.zDepth - b.zDepth);

      sortedNodes.forEach(node => {
        const isHovered = mouse.x !== null && Math.sqrt(Math.pow(node.x - mouse.x, 2) + Math.pow(node.y - mouse.y, 2)) < 15;
        
        if (isHovered) {
          setHoveredNode(node);
        }

        ctx.shadowBlur = isHovered ? 15 : 6;
        ctx.shadowColor = node.color;
        
        // Node Glow Ring
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 1.5 * node.scale;
        ctx.beginPath();
        ctx.arc(node.x, node.y, (node.size + 4) * node.scale, 0, Math.PI * 2);
        ctx.stroke();

        // Node Solid Core
        ctx.fillStyle = isHovered ? '#FFFFFF' : node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size * node.scale, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0; // Reset glow

        // Node Text Labels (Only for front-facing nodes)
        if (node.zDepth > -node.radius * 0.4) {
          ctx.fillStyle = 'rgba(255, 255, 255, ' + (0.45 + node.scale * 0.55) + ')';
          ctx.font = `bold ${Math.round(8.5 * node.scale)}px Outfit, sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText(node.symbol, node.x, node.y - (node.size + 8) * node.scale);
        }
      });

      // Clear hovered node if mouse is inactive
      if (mouse.x === null) {
        setHoveredNode(null);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Mouse handlers on canvas
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.targetX = null;
      mouse.targetY = null;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('mouseenter', () => mouse.active = true);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="glass-panel rounded-[24px] border border-white/7 p-5 flex flex-col justify-between flex-1 min-h-[380px] relative overflow-hidden select-none">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-cyan-400/30 rounded-tl-md" />
      <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-cyan-400/30 rounded-tr-md" />
      <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-cyan-400/30 rounded-bl-md" />
      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-cyan-400/30 rounded-br-md" />

      {/* Volumetric background lights */}
      <div className="absolute top-1/4 right-0 w-32 h-32 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-32 h-32 rounded-full bg-purple-500/5 blur-3xl pointer-events-none" />

      <div className="flex flex-col gap-1.5 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse bg-glow-cyan" />
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-cyan-400 text-glow-cyan">Gravity Core</h3>
          </div>
          <span className="text-[9px] font-mono text-purple-400 border border-purple-500/20 bg-purple-500/5 px-2 py-0.5 rounded-full">
            {metrics.coreSingularity}
          </span>
        </div>
        <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
          AI spatial vector core sorting real-time marketplace specs.
        </p>
      </div>

      {/* Main interactive Canvas */}
      <div className="flex-1 flex items-center justify-center relative min-h-[220px]">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-crosshair pointer-events-auto" />
        
        {/* Holographic Tooltip node overlay */}
        {hoveredNode && (
          <div 
            className="absolute z-20 pointer-events-none glass-panel border border-cyan-400/40 rounded-xl p-2.5 text-center shadow-lg shadow-cyan-500/10 animate-slide-up"
            style={{
              left: `${Math.min(Math.max(10, hoveredNode.x - 60), 180)}px`,
              top: `${Math.min(Math.max(10, hoveredNode.y - 85), 180)}px`
            }}
          >
            <div className="text-[8px] font-extrabold text-cyan-400 uppercase tracking-widest leading-none">{hoveredNode.label}</div>
            <div className="text-base font-black text-white mt-1 leading-none">{hoveredNode.value}</div>
            <div className="text-[7px] text-slate-500 font-bold mt-1 leading-none">Vector Lock: ACTIVE</div>
          </div>
        )}
      </div>

      {/* Interactive Core telemetry readings */}
      <div className="grid grid-cols-2 gap-2 mt-2 pt-3.5 border-t border-white/5 relative z-10">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-white/2 border border-white/3">
          <Sliders className="h-3.5 w-3.5 text-cyan-400" />
          <div className="leading-tight">
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Intensity</span>
            <span className="text-[10px] font-extrabold text-white">{metrics.gravityIntensity}%</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-white/2 border border-white/3">
          <Zap className="h-3.5 w-3.5 text-purple-400" />
          <div className="leading-tight">
            <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Scan Flux</span>
            <span className="text-[10px] font-extrabold text-white truncate max-w-[70px] inline-block">{metrics.fluxDensity}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
