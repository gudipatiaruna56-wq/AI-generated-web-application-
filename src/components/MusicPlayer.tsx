import { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import GlitchText from './GlitchText';

const TRACKS = [
  { id: 1, title: 'NEURON_OVERDRIVE', artist: 'NULL_VOID', duration: '3:42', color: 'from-neon-cyan to-black' },
  { id: 2, title: 'CYBER_SERPENT', artist: 'BIT_STREAM', duration: '4:15', color: 'from-neon-magenta to-black' },
  { id: 3, title: 'KERNEL_PANIC_V2', artist: 'SYS_ERROR', duration: '2:58', color: 'from-hacker-green to-black' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);

  const currentTrack = TRACKS[currentTrackIndex];

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  const prevTrack = () => setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);

  return (
    <div className="w-80 border border-neon-cyan/30 bg-black/40 p-4 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between border-b border-neon-cyan/20 pb-2">
        <div className="text-[10px] tracking-tighter text-neon-cyan/60">AUD_FREQ_OSCILLATOR_01</div>
        <div className="h-2 w-2 animate-pulse rounded-full bg-neon-magenta shadow-[0_0_8px_var(--color-neon-magenta)]" />
      </div>

      {/* Album Art with CSS Glitch */}
      <div className="relative mb-4 aspect-square overflow-hidden bg-zinc-900 border border-neon-cyan/20">
        <div className={`absolute inset-0 bg-gradient-to-br ${currentTrack.color} opacity-40`} />
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTrack.id}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center p-8 text-center"
          >
            <div className="relative">
              <div className="mb-2 text-6xl font-bold opacity-10 blur-sm select-none">
                {currentTrack.id.toString().padStart(2, '0')}
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white/20 select-none">
                 {currentTrack.id.toString().padStart(2, '0')}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Animated Static Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://media.giphy.com/media/oEI9uWUicGLevA7mP3/giphy.gif")' }} />
      </div>

      <div className="mb-6">
        <h3 className="truncate font-sans text-lg font-bold tracking-tight text-white">
          <GlitchText text={currentTrack.title} intensity={isPlaying ? 'high' : 'low'} />
        </h3>
        <p className="text-xs tracking-widest text-[#39ff14] opacity-70">{currentTrack.artist}</p>
      </div>

      {/* Progress Bar (Dummy) */}
      <div className="mb-6">
        <div className="relative h-1 w-full bg-zinc-800">
          <motion.div 
            animate={{ width: isPlaying ? '100%' : '0%' }}
            transition={{ duration: 222, ease: "linear" }}
            className="absolute left-0 top-0 h-full bg-neon-cyan shadow-[0_0_10px_var(--color-neon-cyan)]"
          />
        </div>
        <div className="mt-2 flex justify-between text-[8px] text-gray-500">
          <span>00:43</span>
          <span>{currentTrack.duration}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button onClick={prevTrack} className="text-neon-cyan hover:text-white transition-colors">
          <SkipBack size={20} />
        </button>
        <button 
          onClick={togglePlay}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-neon-magenta text-neon-magenta shadow-[0_0_15px_rgba(255,0,255,0.4)] transition-all hover:scale-110 hover:bg-neon-magenta hover:text-black"
        >
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </button>
        <button onClick={nextTrack} className="text-neon-cyan hover:text-white transition-colors">
          <SkipForward size={20} />
        </button>
      </div>

      <div className="mt-6 flex items-center gap-2">
        <Volume2 size={12} className="text-gray-500" />
        <input 
          type="range" 
          value={volume}
          onChange={(e) => setVolume(parseInt(e.target.value))}
          className="h-1 flex-1 cursor-pointer appearance-none bg-zinc-800 accent-neon-cyan rounded-full"
        />
      </div>
    </div>
  );
}
