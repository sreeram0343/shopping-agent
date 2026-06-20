import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, ShieldAlert, Radio, Compass, Disc } from 'lucide-react';

export default function FloatingElements() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      
      {/* 1. Serene White Lotus Flower (Bottom Left) */}
      <div className="absolute bottom-8 left-8 z-10 w-24 h-24 select-none animate-float-slow pointer-events-auto">
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full filter drop-shadow-[0_0_15px_rgba(255,255,255,0.7)] hover:scale-110 transition-transform duration-500 cursor-pointer"
          title="Lotus of Serenity"
        >
          {/* Back Petals */}
          <path d="M50 20 C42 35, 30 45, 15 50 C32 50, 45 42, 50 20" fill="#EAEBFF" opacity="0.6" />
          <path d="M50 20 C58 35, 70 45, 85 50 C68 50, 55 42, 50 20" fill="#EAEBFF" opacity="0.6" />
          
          {/* Middle Petals */}
          <path d="M50 28 C38 42, 22 55, 10 70 C30 65, 45 52, 50 28" fill="#F3F4FF" opacity="0.85" />
          <path d="M50 28 C62 42, 78 55, 90 70 C70 65, 55 52, 50 28" fill="#F3F4FF" opacity="0.85" />
          
          <path d="M50 15 C45 35, 30 55, 25 75 C38 70, 48 55, 50 15" fill="#FFFFFF" />
          <path d="M50 15 C55 35, 70 55, 75 75 C62 70, 52 55, 50 15" fill="#FFFFFF" />

          {/* Front Center Petals */}
          <path d="M50 35 C40 50, 35 68, 35 85 C45 82, 48 68, 50 35" fill="#FFFFFF" />
          <path d="M50 35 C60 50, 65 68, 65 85 C55 82, 52 68, 50 35" fill="#FFFFFF" />
          
          <path d="M50 45 C45 60, 42 75, 45 88 C49 84, 50 72, 50 45" fill="#FFFFFF" opacity="0.9" />
          <path d="M50 45 C55 60, 58 75, 55 88 C51 84, 50 72, 50 45" fill="#FFFFFF" opacity="0.9" />
          
          {/* Center pistil / glow */}
          <ellipse cx="50" cy="78" rx="8" ry="4" fill="#FFECB3" className="animate-pulse" />
          <circle cx="50" cy="74" r="2" fill="#FFE082" />
          <circle cx="46" cy="76" r="1.5" fill="#FFE082" />
          <circle cx="54" cy="76" r="1.5" fill="#FFE082" />
        </svg>
      </div>

      {/* 2. Realistic Floating Microchips */}
      {/* Microchip 1 (Left Middle) */}
      <div 
        className="absolute top-1/4 left-10 w-24 h-16 glass-panel border border-cyan-400/25 rounded-lg flex items-center justify-center p-2 animate-float-medium pointer-events-auto"
        style={{ animationDelay: '1s' }}
      >
        <div className="relative w-full h-full bg-[#0a0625] rounded-md border border-white/5 overflow-hidden flex flex-col items-center justify-center">
          {/* Circuit tracks */}
          <svg className="absolute inset-0 w-full h-full stroke-cyan-400/30" strokeWidth="0.8">
            <path d="M 0 10 H 30 V 25 H 45" fill="none" />
            <path d="M 80 15 H 50 V 30 H 45" fill="none" />
            <path d="M 10 40 H 40 V 25" fill="none" />
          </svg>
          {/* Silicon Core */}
          <div className="w-6 h-6 rounded bg-gradient-to-tr from-cyan-400 to-purple-500 shadow-neon-cyan flex items-center justify-center text-[7px] font-black font-mono text-black relative z-10">
            R1
          </div>
          <span className="text-[6px] font-mono text-slate-500 mt-1 font-bold">ANTIGRAV-C1</span>
        </div>
      </div>

      {/* Microchip 2 (Bottom Right near gravity core) */}
      <div 
        className="absolute bottom-16 right-[28%] w-20 h-20 glass-panel border border-purple-500/25 rounded-xl p-2 animate-float-slow pointer-events-auto"
        style={{ animationDelay: '3.5s' }}
      >
        <div className="w-full h-full bg-[#08051e] rounded-lg border border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
          <svg className="absolute inset-0 w-full h-full stroke-purple-400/20" strokeWidth="0.8">
            <path d="M 10 10 L 30 30 V 60" fill="none" />
            <path d="M 60 10 L 40 30 V 60" fill="none" />
          </svg>
          <div className="w-5 h-5 rounded-full bg-purple-500/20 border border-purple-400/60 animate-pulse flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-purple-400 shadow-neon-purple" />
          </div>
          <span className="text-[6px] font-mono text-purple-400 font-extrabold tracking-wider mt-1.5">CORE-FLUX</span>
        </div>
      </div>

      {/* 3. Glowing Quartz Crystals */}
      {/* Crystal 1 (Top Left) */}
      <div className="absolute top-10 left-[20%] w-12 h-16 animate-float-fast pointer-events-auto">
        <svg 
          viewBox="0 0 40 60" 
          className="w-full h-full filter drop-shadow-[0_0_12px_rgba(0,242,254,0.4)] hover:scale-125 transition-transform duration-300"
        >
          {/* Front Face Left */}
          <path d="M 20 0 L 5 15 L 20 45 Z" fill="rgba(0, 242, 254, 0.4)" stroke="rgba(0, 242, 254, 0.8)" strokeWidth="1" />
          {/* Front Face Right */}
          <path d="M 20 0 L 35 15 L 20 45 Z" fill="rgba(0, 242, 254, 0.2)" stroke="rgba(0, 242, 254, 0.8)" strokeWidth="1" />
          {/* Bottom Face Left */}
          <path d="M 20 45 L 5 15 L 20 60 Z" fill="rgba(0, 242, 254, 0.15)" stroke="rgba(0, 242, 254, 0.6)" strokeWidth="1" />
          {/* Bottom Face Right */}
          <path d="M 20 45 L 35 15 L 20 60 Z" fill="rgba(0, 242, 254, 0.3)" stroke="rgba(0, 242, 254, 0.6)" strokeWidth="1" />
        </svg>
      </div>

      {/* Crystal 2 (Right Top near header) */}
      <div className="absolute top-8 right-[24%] w-10 h-14 animate-float-slow pointer-events-auto" style={{ animationDelay: '2s' }}>
        <svg 
          viewBox="0 0 40 60" 
          className="w-full h-full filter drop-shadow-[0_0_12px_rgba(217,70,239,0.35)] hover:scale-125 transition-transform duration-300"
        >
          <path d="M 20 0 L 8 18 L 20 42 Z" fill="rgba(217, 70, 239, 0.4)" stroke="rgba(217, 70, 239, 0.8)" strokeWidth="1" />
          <path d="M 20 0 L 32 18 L 20 42 Z" fill="rgba(217, 70, 239, 0.2)" stroke="rgba(217, 70, 239, 0.8)" strokeWidth="1" />
          <path d="M 20 42 L 8 18 L 20 60 Z" fill="rgba(217, 70, 239, 0.1)" stroke="rgba(217, 70, 239, 0.6)" strokeWidth="1" />
          <path d="M 20 42 L 32 18 L 20 60 Z" fill="rgba(217, 70, 239, 0.3)" stroke="rgba(217, 70, 239, 0.6)" strokeWidth="1" />
        </svg>
      </div>

      {/* 4. Scattered 3D App Icons */}
      {/* Icon 1: Cart */}
      <div 
        className="absolute bottom-24 left-[18%] w-10 h-10 rounded-xl glass-panel border border-cyan-400/20 flex items-center justify-center text-cyan-400 shadow-sm animate-float-medium pointer-events-auto"
        style={{ animationDelay: '1.5s' }}
      >
        <ShoppingCart className="h-4.5 w-4.5 animate-pulse" />
      </div>

      {/* Icon 2: Alert */}
      <div 
        className="absolute top-1/3 right-[30%] w-9 h-9 rounded-full glass-panel border border-red-500/20 flex items-center justify-center text-red-400 animate-float-fast pointer-events-auto"
        style={{ animationDelay: '0.5s' }}
      >
        <ShieldAlert className="h-4 w-4" />
      </div>

      {/* Icon 3: Frequency */}
      <div 
        className="absolute top-12 left-[36%] w-10 h-10 rounded-xl glass-panel border border-purple-400/25 flex items-center justify-center text-purple-400 animate-float-slow pointer-events-auto"
        style={{ animationDelay: '2.8s' }}
      >
        <Radio className="h-4.5 w-4.5 animate-spin-slow" />
      </div>

      {/* 5. Disconnected UI Component (Float widget on Left Margin) */}
      <div 
        className="absolute top-1/2 left-3 w-40 glass-panel border border-white/5 rounded-2xl p-3 shadow-2xl flex flex-col gap-2 animate-float-slow pointer-events-auto"
        style={{ animationDelay: '2.2s' }}
      >
        <div className="flex justify-between items-center text-[7px] font-extrabold text-slate-500 uppercase tracking-widest leading-none">
          <span>Telemetry node</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] font-bold text-white leading-none">V-Stab</span>
          <span className="text-[9px] font-mono text-cyan-400 font-black leading-none">99.8%</span>
        </div>
        {/* Mock slider */}
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative">
          <div className="absolute left-0 top-0 h-full w-[80%] bg-cyan-400" />
        </div>
        <div className="flex items-center gap-1.5 mt-1 text-[7px] text-slate-500 font-bold leading-none">
          <Compass className="h-2.5 w-2.5" />
          <span>Pitch & Yaw Lock</span>
        </div>
      </div>

    </div>
  );
}
