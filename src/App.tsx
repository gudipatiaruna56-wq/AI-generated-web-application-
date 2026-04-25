/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Activity, Zap, Cpu, Ghost } from 'lucide-react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import GlitchText from './components/GlitchText';

export default function App() {
  const [score, setScore] = useState(0);
  const [logs, setLogs] = useState<string[]>(['INITIALIZING_CORE_SYSTEM...', 'READY_FOR_INPUT']);
  const [glitchIntensity, setGlitchIntensity] = useState(0);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 5));
  };

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    addLog(`SNAKE_GROWTH_DETECTED: OFFSET_${newScore}`);
    setGlitchIntensity(prev => prev + 1);
  };

  const handleGameOver = () => {
    addLog('CRITICAL_ERROR: COLLISION_DETECTED');
    addLog('REBOOTING_NEURAL_PATHWAY...');
    setScore(0);
    setGlitchIntensity(0);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden text-neon-cyan selection:bg-neon-magenta selection:text-white">
      {/* HUD Layer */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col p-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center border-2 border-neon-cyan bg-neon-cyan/10">
              <Cpu size={24} className="animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tighter">
                <GlitchText text="NEON_SYNTH_HACKER" intensity="high" />
              </h1>
              <div className="flex items-center gap-2 text-[8px] opacity-60">
                <div className="h-1.5 w-1.5 rounded-full bg-[#39ff14]" />
                <span>CONNECTION: STEADY</span>
                <span className="ml-4">PORT: 8080</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-6">
            <div className="text-right">
              <div className="text-[10px] text-neon-magenta">SYSTEM_TEMP</div>
              <div className="flex items-center gap-1 font-mono text-sm">
                <span>{32 + glitchIntensity}°C</span>
                <Activity size={12} className="text-neon-magenta" />
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-neon-cyan">ALLOCATED_RAM</div>
              <div className="font-mono text-sm">{(1024 + score * 4).toLocaleString()}KB</div>
            </div>
          </div>
        </header>

        <div className="mt-auto flex items-end justify-between">
          {/* Logs */}
          <div className="w-64 space-y-1 font-mono text-[9px] leading-tight text-[#39ff14]/70">
            {logs.map((log, i) => (
              <motion.div
                key={i + log}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 - i * 0.2 }}
                className="flex items-center gap-2"
              >
                <span>[{new Date().toLocaleTimeString()}]</span>
                <span className="truncate">{log}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-4">
            <Ghost size={16} className="animate-bounce opacity-30" />
            <Zap size={16} className="animate-pulse opacity-30" />
            <Terminal size={16} className="opacity-30" />
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <main className="relative z-0 flex h-screen w-full items-center justify-center gap-12 px-12 pt-16">
        {/* Left: Music Player */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-shrink-0"
        >
          <MusicPlayer />
        </motion.div>

        {/* Center: Snake Game */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="flex-grow flex flex-col items-center"
        >
          <div className="relative">
            {/* Background Glitch Elements */}
            <div className="absolute -inset-10 -z-10 opacity-10">
               <div className="h-full w-full border-[1px] border-dashed border-neon-cyan animate-[spin_20s_linear_infinite]" />
            </div>
            <SnakeGame onScoreChange={handleScoreChange} onGameOver={handleGameOver} />
          </div>
          
          <div className="mt-8 text-[10px] tracking-[0.4em] text-neon-cyan/40">
             &lt; MANUAL_OVERRIDE_ENABLED &gt;
          </div>
        </motion.div>

        {/* Right: Abstract Metadata / Stats */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="hidden w-64 flex-shrink-0 flex-col gap-6 lg:flex"
        >
          <div className="border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <h4 className="mb-3 border-b border-white/10 pb-1 text-[10px] font-bold text-neon-magenta">OBJECTIVE</h4>
            <p className="text-[11px] leading-relaxed opacity-60">
              NAVIGATE THE VIRTUAL SERPENT THROUGH THE VOLATILE DATA GRID. CONSUME 
              FRAGMENTS TO ENHANCE SYNCHRONIZATION.
            </p>
          </div>

          <div className="border border-white/10 bg-white/5 p-4 backdrop-blur-md">
            <h4 className="mb-3 border-b border-white/10 pb-1 text-[10px] font-bold text-neon-cyan">ANOMALIES</h4>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="flex justify-between text-[8px] opacity-40">
                    <span>BIT_ROT_{i}</span>
                    <span>{Math.floor(Math.random() * 100)}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/5">
                    <motion.div 
                      animate={{ width: [`${Math.random() * 100}%`, `${Math.random() * 100}%`] }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "mirror" }}
                      className="h-full bg-neon-cyan/50 shadow-[0_0_5px_var(--color-neon-cyan)]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Extreme Glitch Overlays */}
      <AnimatePresence>
        {glitchIntensity > 10 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.2, 0, 0.4, 0] }}
            transition={{ duration: 0.2, repeat: (glitchIntensity - 10) }}
            className="pointer-events-none absolute inset-0 z-50 bg-neon-magenta mix-blend-overlay"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

