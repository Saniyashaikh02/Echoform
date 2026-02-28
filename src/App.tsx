import React, { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Rect, Circle, Text, Group } from 'react-konva';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Skull, 
  Zap, 
  Heart, 
  Timer, 
  Sword, 
  Shield, 
  Ghost, 
  Wind, 
  Flame, 
  Dna,
  BookOpen,
  Play,
  ChevronRight,
  Info
} from 'lucide-react';

// --- Types ---
type EnemyType = {
  name: string;
  color: string;
  abilityName: string;
  abilityDesc: string;
  weakness: string;
  speed: number;
  health: number;
};

const ENEMY_TYPES: Record<string, EnemyType> = {
  'Slime': { name: 'Slime', color: '#4ade80', abilityName: 'Acid Trail', abilityDesc: 'Leave a trail that slows enemies.', weakness: 'Reduced Speed', speed: 1.5, health: 50 },
  'Bat': { name: 'Bat', color: '#a78bfa', abilityName: 'Vampirism', abilityDesc: 'Heal 1HP on hit.', weakness: 'Low Max HP', speed: 3, health: 30 },
  'Knight': { name: 'Knight', color: '#94a3b8', abilityName: 'Shield Bash', abilityDesc: 'Knockback enemies.', weakness: 'Heavy Movement', speed: 1, health: 100 },
  'Ghost': { name: 'Ghost', color: '#e2e8f0', abilityName: 'Phase', abilityDesc: 'Briefly pass through walls.', weakness: 'Fragile Soul', speed: 2, health: 40 },
  'Flame': { name: 'Flame', color: '#f87171', abilityName: 'Burn', abilityDesc: 'Attacks deal fire damage.', weakness: 'Water Vulnerable', speed: 2.5, health: 60 },
};

// --- Main App Component ---
export default function App() {
  const [view, setView] = useState<'menu' | 'game' | 'guide'>('menu');

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-emerald-500/30">
      <AnimatePresence mode="wait">
        {view === 'menu' && (
          <motion.div 
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen p-6 text-center"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="mb-12"
            >
              <h1 className="text-8xl font-black tracking-tighter uppercase italic text-emerald-500 mb-2">
                VESSEL
              </h1>
              <p className="text-zinc-500 font-mono tracking-widest uppercase text-sm">
                Soul Shifter Roguelike
              </p>
            </motion.div>

            <div className="flex flex-col gap-4 w-full max-w-xs">
              <MenuButton icon={<Play size={20} />} label="Start Run" onClick={() => setView('game')} primary />
              <MenuButton icon={<BookOpen size={20} />} label="Dev Guide" onClick={() => setView('guide')} />
            </div>

            <div className="mt-24 grid grid-cols-3 gap-8 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
              <div className="flex flex-col items-center gap-2">
                <Skull size={32} />
                <span className="text-[10px] uppercase font-bold tracking-widest">Absorb</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Dna size={32} />
                <span className="text-[10px] uppercase font-bold tracking-widest">Shift</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Timer size={32} />
                <span className="text-[10px] uppercase font-bold tracking-widest">Decay</span>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'guide' && (
          <motion.div 
            key="guide"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-4xl mx-auto p-8 py-16"
          >
            <button 
              onClick={() => setView('menu')}
              className="mb-8 flex items-center gap-2 text-zinc-500 hover:text-emerald-400 transition-colors uppercase text-xs font-bold tracking-widest"
            >
              <ChevronRight className="rotate-180" size={16} /> Back to Menu
            </button>
            
            <DevGuide />
          </motion.div>
        )}

        {view === 'game' && (
          <motion.div 
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full h-screen overflow-hidden bg-black"
          >
            <GamePrototype onExit={() => setView('menu')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Components ---

function MenuButton({ icon, label, onClick, primary = false }: { icon: React.ReactNode, label: string, onClick: () => void, primary?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center justify-between px-6 py-4 rounded-xl border transition-all duration-300 group
        ${primary 
          ? 'bg-emerald-500 border-emerald-400 text-black hover:bg-emerald-400 hover:scale-105' 
          : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800'}
      `}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-bold tracking-tight uppercase">{label}</span>
      </div>
      <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

function DevGuide() {
  return (
    <div className="space-y-16">
      <section>
        <h2 className="text-5xl font-black italic uppercase tracking-tighter text-emerald-500 mb-6">01. Design Document</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800">
            <h3 className="text-emerald-400 font-bold uppercase text-xs tracking-widest mb-4">The Hook</h3>
            <p className="text-zinc-400 leading-relaxed">
              You are a soul without a body. To survive, you must inhabit the corpses of your enemies. 
              But every body is a "vessel" that decays. You must choose between the raw power of a new body 
              or the permanent knowledge of its abilities.
            </p>
          </div>
          <div className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800">
            <h3 className="text-emerald-400 font-bold uppercase text-xs tracking-widest mb-4">Core Loop</h3>
            <ol className="space-y-3 text-zinc-400">
              <li className="flex gap-3"><span className="text-emerald-500 font-mono">1.</span> Explore rooms and fight enemies.</li>
              <li className="flex gap-3"><span className="text-emerald-500 font-mono">2.</span> Defeat an enemy to drop its "Soul Core".</li>
              <li className="flex gap-3"><span className="text-emerald-500 font-mono">3.</span> Decide: Swap Body (Full HP, New Stats) OR Steal Ability (Permanent Buff).</li>
              <li className="flex gap-3"><span className="text-emerald-500 font-mono">4.</span> Manage the Decay Timer (Max HP drops over time).</li>
            </ol>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-5xl font-black italic uppercase tracking-tighter text-emerald-500 mb-6">02. Enemy Manifest</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(ENEMY_TYPES).map((enemy, i) => (
            <div key={i} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: enemy.color }} />
                <h4 className="font-bold uppercase tracking-tight">{enemy.name}</h4>
              </div>
              <div className="text-[10px] uppercase font-bold text-emerald-500 mb-1">Ability: {enemy.abilityName}</div>
              <p className="text-xs text-zinc-500 mb-2">{enemy.abilityDesc}</p>
              <div className="text-[10px] uppercase font-bold text-red-500">Weakness: {enemy.weakness}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-5xl font-black italic uppercase tracking-tighter text-emerald-500 mb-6">03. Development Roadmap</h2>
        <div className="space-y-4">
          {[
            { title: 'Phase 1: The Skeleton', desc: 'Player movement, basic attack, and one enemy type.' },
            { title: 'Phase 2: The Soul', desc: 'Implement the Swap/Steal choice system and Decay timer.' },
            { title: 'Phase 3: The World', desc: 'Procedural room generation (simple grid) and 5+ enemies.' },
            { title: 'Phase 4: The Boss', desc: 'Create one major boss that tests your ability combinations.' },
            { title: 'Phase 5: Polish', desc: 'Screen shake, sound effects, and Steam integration.' },
          ].map((phase, i) => (
            <div key={i} className="flex gap-6 items-start p-6 bg-zinc-900/30 rounded-2xl border border-zinc-800/50">
              <div className="text-2xl font-black text-zinc-700">0{i+1}</div>
              <div>
                <h4 className="font-bold uppercase tracking-tight text-zinc-200">{phase.title}</h4>
                <p className="text-sm text-zinc-500">{phase.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="p-8 bg-emerald-500 rounded-3xl text-black">
        <h2 className="text-4xl font-black uppercase italic mb-4">Senior Advice</h2>
        <p className="font-medium text-lg mb-6">
          "Don't build a massive world. Build one fun room. If fighting one enemy feels good, 
          fighting a hundred will feel great. Keep your scope small: 3 enemies, 1 boss, 10 minutes per run."
        </p>
        <div className="flex gap-4">
          <div className="px-4 py-2 bg-black/10 rounded-full text-xs font-bold uppercase tracking-widest">Price: $4.99</div>
          <div className="px-4 py-2 bg-black/10 rounded-full text-xs font-bold uppercase tracking-widest">Engine: Unity/Godot</div>
        </div>
      </section>
    </div>
  );
}

// --- Game Prototype ---

function GamePrototype({ onExit }: { onExit: () => void }) {
  const [player, setPlayer] = useState({
    x: 400,
    y: 300,
    hp: 100,
    maxHp: 100,
    decay: 100,
    body: 'Human',
    abilities: [] as string[],
    color: '#3b82f6'
  });

  const [enemies, setEnemies] = useState<{ id: number, x: number, y: number, type: EnemyType, hp: number }[]>([]);
  const [souls, setSouls] = useState<{ id: number, x: number, y: number, type: EnemyType }[]>([]);
  const [choice, setChoice] = useState<{ soulId: number, type: EnemyType } | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const requestRef = useRef<number>(null);
  const keys = useRef<Record<string, boolean>>({});

  // Spawn initial enemies
  useEffect(() => {
    const initialEnemies = Array.from({ length: 3 }).map((_, i) => ({
      id: i,
      x: Math.random() * 700 + 50,
      y: Math.random() * 500 + 50,
      type: Object.values(ENEMY_TYPES)[Math.floor(Math.random() * Object.values(ENEMY_TYPES).length)],
      hp: 50
    }));
    setEnemies(initialEnemies);
  }, []);

  // Game Loop
  useEffect(() => {
    const update = () => {
      if (gameOver || choice) return;

      setPlayer(prev => {
        let dx = 0;
        let dy = 0;
        const speed = 4;
        if (keys.current['ArrowUp'] || keys.current['w']) dy -= speed;
        if (keys.current['ArrowDown'] || keys.current['s']) dy += speed;
        if (keys.current['ArrowLeft'] || keys.current['a']) dx -= speed;
        if (keys.current['ArrowRight'] || keys.current['d']) dx += speed;

        const newDecay = Math.max(0, prev.decay - 0.05);
        const newHp = newDecay === 0 ? Math.max(0, prev.hp - 0.1) : prev.hp;

        if (newHp <= 0) setGameOver(true);

        return {
          ...prev,
          x: Math.max(20, Math.min(780, prev.x + dx)),
          y: Math.max(20, Math.min(580, prev.y + dy)),
          decay: newDecay,
          hp: newHp
        };
      });

      // Simple enemy AI (move towards player)
      setEnemies(prev => prev.map(e => {
        const dx = player.x - e.x;
        const dy = player.y - e.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 20) {
          // Damage player
          setPlayer(p => ({ ...p, hp: Math.max(0, p.hp - 0.5) }));
        }
        return {
          ...e,
          x: e.x + (dx / (dist || 1)) * 1.2,
          y: e.y + (dy / (dist || 1)) * 1.2
        };
      }));

      requestRef.current = requestAnimationFrame(update);
    };

    requestRef.current = requestAnimationFrame(update);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [player.x, player.y, gameOver, choice]);

  // Input listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key] = true;
      if (e.key === ' ' && !choice && !gameOver) {
        // Attack
        setEnemies(prev => {
          const hit = prev.find(en => Math.sqrt((en.x - player.x)**2 + (en.y - player.y)**2) < 60);
          if (hit) {
            const newEnemies = prev.filter(en => en.id !== hit.id);
            if (hit.hp <= 25) {
              setSouls(s => [...s, { id: Date.now(), x: hit.x, y: hit.y, type: hit.type }]);
              setScore(s => s + 100);
              // Respawn enemy
              setTimeout(() => {
                setEnemies(curr => [...curr, {
                  id: Date.now(),
                  x: Math.random() * 700 + 50,
                  y: Math.random() * 500 + 50,
                  type: Object.values(ENEMY_TYPES)[Math.floor(Math.random() * Object.values(ENEMY_TYPES).length)],
                  hp: 50
                }]);
              }, 2000);
              return newEnemies;
            }
            return prev.map(en => en.id === hit.id ? { ...en, hp: en.hp - 25 } : en);
          }
          return prev;
        });

        // Check for soul pickup
        const soul = souls.find(s => Math.sqrt((s.x - player.x)**2 + (s.y - player.y)**2) < 40);
        if (soul) {
          setChoice({ soulId: soul.id, type: soul.type });
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => keys.current[e.key] = false;

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [player, souls, choice, gameOver]);

  const handleChoice = (isSwap: boolean) => {
    if (!choice) return;
    if (isSwap) {
      setPlayer(prev => ({
        ...prev,
        body: choice.type.name,
        color: choice.type.color,
        decay: 100,
        hp: prev.maxHp // Heal on swap
      }));
    } else {
      setPlayer(prev => ({
        ...prev,
        abilities: [...prev.abilities, choice.type.abilityName].slice(-3) // Keep last 3
      }));
    }
    setSouls(prev => prev.filter(s => s.id !== choice.soulId));
    setChoice(null);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* HUD */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10 pointer-events-none">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-emerald-500 text-black">
              <Heart size={20} />
            </div>
            <div>
              <div className="text-[10px] uppercase font-black tracking-widest text-emerald-500">Vessel Integrity</div>
              <div className="w-48 h-2 bg-zinc-800 rounded-full overflow-hidden mt-1">
                <motion.div 
                  className="h-full bg-emerald-500" 
                  animate={{ width: `${player.hp}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-amber-500 text-black">
              <Timer size={20} />
            </div>
            <div>
              <div className="text-[10px] uppercase font-black tracking-widest text-amber-500">Decay Timer</div>
              <div className="w-48 h-2 bg-zinc-800 rounded-full overflow-hidden mt-1">
                <motion.div 
                  className="h-full bg-amber-500" 
                  animate={{ width: `${player.decay}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 text-right">
            <div className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Current Body</div>
            <div className="text-xl font-black italic uppercase text-white">{player.body}</div>
          </div>
          <div className="flex gap-2">
            {player.abilities.map((a, i) => (
              <div key={i} className="bg-emerald-500/20 border border-emerald-500/50 px-3 py-1 rounded-full text-[10px] font-bold uppercase text-emerald-400">
                {a}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Game Canvas */}
      <div className="flex-1 bg-[#050505]">
        <Stage width={800} height={600} className="mx-auto mt-12 border border-white/5 rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/5">
          <Layer>
            {/* Grid background */}
            {Array.from({ length: 20 }).map((_, i) => (
              <Rect key={`v-${i}`} x={i * 40} y={0} width={1} height={600} fill="rgba(255,255,255,0.03)" />
            ))}
            {Array.from({ length: 15 }).map((_, i) => (
              <Rect key={`h-${i}`} x={0} y={i * 40} width={800} height={1} fill="rgba(255,255,255,0.03)" />
            ))}

            {/* Souls */}
            {souls.map(s => (
              <Group key={s.id} x={s.x} y={s.y}>
                <Circle radius={25} fill={s.type.color} opacity={0.3} />
                <Circle radius={10} fill="white" shadowBlur={10} shadowColor="white" />
                <Text text="SOUL" x={-15} y={15} fill="white" fontSize={10} fontStyle="bold" />
              </Group>
            ))}

            {/* Enemies */}
            {enemies.map(e => (
              <Group key={e.id} x={e.x} y={e.y}>
                <Rect width={30} height={30} x={-15} y={-15} fill={e.type.color} cornerRadius={4} />
                <Rect width={30} height={4} x={-15} y={-25} fill="#333" />
                <Rect width={(e.hp / 50) * 30} height={4} x={-15} y={-25} fill="#ef4444" />
              </Group>
            ))}

            {/* Player */}
            <Group x={player.x} y={player.y}>
              <Circle radius={20} fill={player.color} shadowBlur={20} shadowColor={player.color} />
              <Rect width={4} height={15} x={-2} y={-25} fill="white" />
            </Group>
          </Layer>
        </Stage>
      </div>

      {/* Instructions */}
      <div className="p-6 text-center text-zinc-600 text-[10px] uppercase font-bold tracking-[0.2em]">
        WASD to Move • Space to Attack / Interact • Kill enemies to drop souls
      </div>

      {/* Choice Modal */}
      <AnimatePresence>
        {choice && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl"
          >
            <div className="max-w-md w-full p-8 text-center">
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto rounded-3xl mb-4 flex items-center justify-center" style={{ backgroundColor: choice.type.color }}>
                  <Skull size={40} className="text-black" />
                </div>
                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Soul of {choice.type.name}</h2>
                <p className="text-zinc-500 text-sm mt-2">Choose your path of evolution.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleChoice(true)}
                  className="p-6 bg-white text-black rounded-2xl hover:scale-105 transition-transform text-left group"
                >
                  <Dna className="mb-4" />
                  <div className="font-black uppercase italic leading-none mb-1">Swap Body</div>
                  <div className="text-[10px] font-bold opacity-60 uppercase">Reset Decay & Heal</div>
                </button>

                <button 
                  onClick={() => handleChoice(false)}
                  className="p-6 bg-zinc-900 border border-zinc-800 text-white rounded-2xl hover:scale-105 transition-transform text-left group"
                >
                  <Zap className="mb-4 text-emerald-500" />
                  <div className="font-black uppercase italic leading-none mb-1">Steal Ability</div>
                  <div className="text-[10px] font-bold text-emerald-500 uppercase">{choice.type.abilityName}</div>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over */}
      <AnimatePresence>
        {gameOver && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-red-950/90 backdrop-blur-2xl text-center"
          >
            <Skull size={80} className="text-white mb-6" />
            <h2 className="text-7xl font-black italic uppercase tracking-tighter text-white mb-2">Vessel Destroyed</h2>
            <p className="text-red-200/60 uppercase tracking-widest font-bold text-sm mb-12">Final Score: {score}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-12 py-4 bg-white text-black font-black uppercase italic rounded-full hover:scale-110 transition-transform"
            >
              Try Again
            </button>
            <button 
              onClick={onExit}
              className="mt-4 text-red-200/40 hover:text-white transition-colors uppercase text-[10px] font-bold tracking-widest"
            >
              Return to Menu
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
