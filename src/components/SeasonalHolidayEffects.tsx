import React, { useEffect, useRef } from 'react';
import { useTheme, HolidaySeason } from '../context/ThemeContext';
import halloweenBg from '../assets/images/halloween_spooky_bg_1790866168656.jpg';
import christmasBg from '../assets/images/christmas_wonderland_bg_1790866190429.jpg';
import newYearBg from '../assets/images/new_year_fireworks_bg_1790866209046.jpg';

interface SeasonalHolidayEffectsProps {
  seasonOverride?: HolidaySeason;
}

export const SeasonalHolidayEffects: React.FC<SeasonalHolidayEffectsProps> = ({ seasonOverride }) => {
  const { season: contextSeason, currentYear } = useTheme();
  const season = seasonOverride || contextSeason;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas animation for falling snow (Christmas) or fireworks (New Year)
  useEffect(() => {
    if (season !== 'christmas' && season !== 'christmas_eve' && season !== 'new_year') {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // ==========================================
    // CHRISTMAS / CHRISTMAS EVE: Falling Snow
    // ==========================================
    if (season === 'christmas' || season === 'christmas_eve') {
      const snowflakeCount = Math.min(85, Math.floor(width / 16));
      interface Snowflake {
        x: number;
        y: number;
        radius: number;
        density: number;
        speedY: number;
        speedX: number;
        opacity: number;
        swingAngle: number;
        swingSpeed: number;
      }

      const snowflakes: Snowflake[] = Array.from({ length: snowflakeCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.8 + 0.8,
        density: Math.random() * snowflakeCount,
        speedY: Math.random() * 1.2 + 0.6,
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.6 + 0.25,
        swingAngle: Math.random() * Math.PI * 2,
        swingSpeed: Math.random() * 0.02 + 0.01,
      }));

      const renderSnow = () => {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < snowflakes.length; i++) {
          const flake = snowflakes[i];
          flake.swingAngle += flake.swingSpeed;
          flake.y += flake.speedY;
          flake.x += flake.speedX + Math.sin(flake.swingAngle) * 0.5;

          // Wrap around edges
          if (flake.y > height) {
            flake.y = -10;
            flake.x = Math.random() * width;
          }
          if (flake.x > width + 10) flake.x = -10;
          if (flake.x < -10) flake.x = width + 10;

          ctx.beginPath();
          ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
          ctx.shadowBlur = flake.radius > 2 ? 4 : 0;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
          ctx.fill();
        }

        animationFrameId = requestAnimationFrame(renderSnow);
      };

      renderSnow();
    }

    // ==========================================
    // NEW YEAR: Exploding Fireworks Animation
    // ==========================================
    if (season === 'new_year') {
      interface Particle {
        x: number;
        y: number;
        vx: number;
        vy: number;
        alpha: number;
        decay: number;
        color: string;
        size: number;
      }

      interface Firework {
        x: number;
        y: number;
        targetY: number;
        vy: number;
        color: string;
        exploded: boolean;
        particles: Particle[];
      }

      const fireworks: Firework[] = [];
      const colors = [
        '#FBBF24', // Gold
        '#F59E0B', // Amber
        '#38BDF8', // Cyan
        '#F43F5E', // Rose
        '#A855F7', // Violet
        '#34D399', // Emerald
        '#FEF08A', // Pale Gold
      ];

      const createFirework = (): Firework => {
        const x = Math.random() * (width * 0.8) + width * 0.1;
        const targetY = Math.random() * (height * 0.45) + 60;
        return {
          x,
          y: height,
          targetY,
          vy: -(Math.random() * 3 + 8),
          color: colors[Math.floor(Math.random() * colors.length)],
          exploded: false,
          particles: [],
        };
      };

      let timer = 0;

      const renderFireworks = () => {
        // Soft trail fade effect
        ctx.fillStyle = 'rgba(6, 13, 30, 0.18)';
        ctx.fillRect(0, 0, width, height);

        timer++;
        if (timer % 55 === 0 && fireworks.length < 6) {
          fireworks.push(createFirework());
        }

        for (let i = fireworks.length - 1; i >= 0; i--) {
          const fw = fireworks[i];

          if (!fw.exploded) {
            fw.y += fw.vy;

            // Rocket head
            ctx.beginPath();
            ctx.arc(fw.x, fw.y, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = fw.color;
            ctx.shadowBlur = 6;
            ctx.shadowColor = fw.color;
            ctx.fill();

            // Explode when reaching peak
            if (fw.y <= fw.targetY || fw.vy >= 0) {
              fw.exploded = true;
              const count = Math.floor(Math.random() * 30) + 35;
              for (let p = 0; p < count; p++) {
                const angle = (Math.PI * 2 * p) / count + (Math.random() - 0.5) * 0.2;
                const speed = Math.random() * 4.5 + 1.2;
                fw.particles.push({
                  x: fw.x,
                  y: fw.y,
                  vx: Math.cos(angle) * speed,
                  vy: Math.sin(angle) * speed,
                  alpha: 1,
                  decay: Math.random() * 0.018 + 0.012,
                  color: fw.color,
                  size: Math.random() * 2 + 1,
                });
              }
            }
          } else {
            // Render burst particles
            for (let j = fw.particles.length - 1; j >= 0; j--) {
              const p = fw.particles[j];
              p.x += p.vx;
              p.y += p.vy;
              p.vy += 0.05; // gentle gravity
              p.alpha -= p.decay;

              if (p.alpha <= 0) {
                fw.particles.splice(j, 1);
                continue;
              }

              ctx.beginPath();
              ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
              ctx.fillStyle = p.color;
              ctx.globalAlpha = p.alpha;
              ctx.shadowBlur = 4;
              ctx.shadowColor = p.color;
              ctx.fill();
              ctx.globalAlpha = 1;
            }

            if (fw.particles.length === 0) {
              fireworks.splice(i, 1);
            }
          }
        }

        animationFrameId = requestAnimationFrame(renderFireworks);
      };

      renderFireworks();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [season]);

  if (season === 'none') {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* ============================================================
          1. HALLOWEEN THEME (October 20 - November 30)
          Haunted cemetery / house, flying bats, floating ghosts, flying witch
          ============================================================ */}
      {season === 'halloween' && (
        <div className="absolute inset-0">
          {/* Spooky Cemetery / Haunted House Background */}
          <div className="absolute inset-0">
            <img
              src={halloweenBg}
              alt="Haunted Cemetery Background"
              className="w-full h-full object-cover object-center opacity-85 dark:opacity-80 filter contrast-115 saturate-125 transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#090314]/50 via-[#120524]/30 to-[#06020c]/65" />
            {/* Eerie full moon glow in top-right */}
            <div className="absolute top-8 right-12 sm:right-28 w-48 h-48 rounded-full bg-amber-500/25 blur-3xl animate-pulse" />
            <div className="absolute top-12 right-16 sm:right-32 w-28 h-28 rounded-full bg-amber-100/25 border border-amber-300/40 blur-xs shadow-[0_0_60px_rgba(245,158,11,0.5)]" />
          </div>

          {/* Flying Witch across the night sky */}
          <div className="absolute top-16 left-0 animate-witch-fly">
            <svg
              className="w-20 h-16 text-amber-200/80 drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]"
              viewBox="0 0 100 80"
              fill="currentColor"
            >
              {/* Broom handle */}
              <line x1="10" y1="52" x2="90" y2="40" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
              {/* Broom bristles */}
              <path d="M5 54 L18 48 L16 57 Z" fill="#d97706" />
              {/* Witch silhouette */}
              <circle cx="56" cy="30" r="6" fill="#180b2a" stroke="#fbbf24" strokeWidth="1" />
              {/* Witch hat */}
              <polygon points="56,12 48,27 66,26" fill="#2e1065" stroke="#a855f7" strokeWidth="1" />
              <ellipse cx="57" cy="27" rx="11" ry="3" fill="#a855f7" />
              {/* Witch body & flowing cape */}
              <path d="M52 35 C42 42, 35 48, 38 54 C48 52, 60 48, 62 42 Z" fill="#180b2a" stroke="#a855f7" strokeWidth="0.8" />
              {/* Trailing magic sparkles */}
              <circle cx="28" cy="51" r="1.5" fill="#fde047" className="animate-ping" />
              <circle cx="20" cy="53" r="1" fill="#facc15" />
            </svg>
          </div>

          {/* Flying Bats with Flapping Wings */}
          <div className="absolute top-24 left-1/4 animate-bat-fly-1">
            <BatSvg className="w-10 h-7 text-slate-900/90 dark:text-purple-300/80 drop-shadow-md" />
          </div>
          <div className="absolute top-36 right-1/3 animate-bat-fly-2">
            <BatSvg className="w-14 h-9 text-slate-900/95 dark:text-amber-300/75 drop-shadow-lg" />
          </div>
          <div className="absolute top-14 right-1/4 animate-bat-fly-3">
            <BatSvg className="w-8 h-5 text-slate-800 dark:text-purple-400/70" />
          </div>
          <div className="absolute top-48 left-1/6 animate-bat-fly-4">
            <BatSvg className="w-11 h-8 text-slate-950 dark:text-orange-400/80" />
          </div>

          {/* Translucent Glowing Ghosts floating across the screen */}
          <div className="absolute top-44 left-10 sm:left-24 animate-ghost-float-1">
            <GhostSvg className="w-14 h-20 text-cyan-200/60 dark:text-purple-200/50 drop-shadow-[0_0_15px_rgba(168,85,247,0.4)]" />
          </div>
          <div className="absolute top-72 right-12 sm:right-28 animate-ghost-float-2">
            <GhostSvg className="w-18 h-24 text-purple-100/70 dark:text-cyan-200/55 drop-shadow-[0_0_20px_rgba(56,189,248,0.35)]" />
          </div>
          <div className="absolute top-1/3 left-1/2 animate-ghost-float-3">
            <GhostSvg className="w-12 h-16 text-amber-100/50 dark:text-amber-200/40 drop-shadow-[0_0_14px_rgba(245,158,11,0.3)]" />
          </div>

          {/* Bottom Jack-o'-Lantern Pumpkins & Spooky Graveyard Mist */}
          <div className="absolute bottom-2 left-6 sm:left-14 flex items-end gap-3 opacity-80 animate-pulse">
            <PumpkinSvg className="w-14 h-12 text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]" />
            <PumpkinSvg className="w-10 h-9 text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.7)]" />
          </div>
          <div className="absolute bottom-2 right-8 sm:right-20 flex items-end gap-2.5 opacity-80 animate-pulse">
            <PumpkinSvg className="w-11 h-10 text-orange-600 drop-shadow-[0_0_12px_rgba(234,88,12,0.8)]" />
            <PumpkinSvg className="w-16 h-14 text-orange-500 drop-shadow-[0_0_18px_rgba(249,115,22,0.85)]" />
          </div>
        </div>
      )}

      {/* ============================================================
          2. CHRISTMAS & CHRISTMAS EVE THEMES
          Falling snow canvas, visible snowman, reindeer, decorated Christmas trees
          ============================================================ */}
      {(season === 'christmas' || season === 'christmas_eve') && (
        <div className="absolute inset-0">
          {/* Snowy Wonderland Background */}
          <div className="absolute inset-0">
            <img
              src={christmasBg}
              alt="Christmas Winter Wonderland Background"
              className="w-full h-full object-cover object-center opacity-85 dark:opacity-80 filter contrast-110 saturate-115 transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#03150f]/50 via-[#06241a]/30 to-[#02100b]/60 dark:from-[#02140d]/60 dark:via-[#051c14]/40 dark:to-[#010905]/70" />
          </div>

          {/* Full-screen Falling Snow Canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          {/* Visible Snowman in bottom right */}
          <div className="absolute bottom-4 right-6 sm:right-16 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
            <SnowmanSvg className="w-24 sm:w-32 h-32 sm:h-40" />
          </div>

          {/* Graceful Reindeer with antlers in bottom left */}
          <div className="absolute bottom-4 left-6 sm:left-14 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] animate-reindeer-gentle">
            <ReindeerSvg className="w-24 sm:w-32 h-28 sm:h-36 text-amber-200/90 dark:text-amber-100/80" />
          </div>

          {/* Decorated Glowing Christmas Trees with Twinkling Fairy Lights */}
          <div className="absolute bottom-2 left-1/4 hidden md:block">
            <ChristmasTreeSvg className="w-20 sm:w-28 h-28 sm:h-36 text-emerald-600/90" />
          </div>
          <div className="absolute bottom-2 right-1/4 hidden md:block">
            <ChristmasTreeSvg className="w-18 sm:w-24 h-24 sm:h-32 text-emerald-700/85" />
          </div>
        </div>
      )}

      {/* ============================================================
          3. NEW YEAR THEME (January 1 - 15)
          Current Year (2026), fireworks animations, wines & champagne toast
          ============================================================ */}
      {season === 'new_year' && (
        <div className="absolute inset-0">
          {/* Fireworks Night Sky Background */}
          <div className="absolute inset-0">
            <img
              src={newYearBg}
              alt="New Year Celebration Fireworks"
              className="w-full h-full object-cover object-center opacity-90 dark:opacity-85 filter contrast-120 saturate-125 transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#050b18]/50 via-[#091530]/30 to-[#040812]/60" />
          </div>

          {/* Interactive Fireworks Particle Canvas */}
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

          {/* Prominent Current Year Watermark Display (e.g. 2026) */}
          <div className="absolute top-20 right-6 sm:right-16 flex flex-col items-end opacity-90 drop-shadow-[0_0_35px_rgba(245,158,11,0.5)]">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-[10px] font-mono font-bold tracking-widest text-amber-300 uppercase shadow-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              HAPPY NEW YEAR
            </div>
            <div className="font-display text-4xl sm:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 select-none animate-pulse">
              {currentYear || 2026}
            </div>
          </div>

          {/* Celebratory Clinking Champagne & Wine Glasses in bottom right */}
          <div className="absolute bottom-4 right-8 sm:right-20 drop-shadow-[0_10px_25px_rgba(245,158,11,0.4)]">
            <WineGlassesSvg className="w-20 sm:w-28 h-24 sm:h-32" />
          </div>

          {/* Celebratory Champagne Bottle & Stars in bottom left */}
          <div className="absolute bottom-4 left-6 sm:left-16 drop-shadow-[0_10px_25px_rgba(245,158,11,0.3)]">
            <ChampagneBottleSvg className="w-18 sm:w-24 h-28 sm:h-36" />
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// SVG ARTWORK & ANIMATION COMPONENTS
// ==========================================

function BatSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 36" fill="currentColor">
      <path
        d="M32 14 C30 9, 23 4, 14 5 C6 6, 2 12, 1 17 C4 18, 9 17, 13 21 C15 23, 17 29, 21 28 C23 27, 26 24, 28 25 C30 26, 31 31, 32 32 C33 31, 34 26, 36 25 C38 24, 41 27, 43 28 C47 29, 49 23, 51 21 C55 17, 60 18, 63 17 C62 12, 58 6, 50 5 C41 4, 34 9, 32 14 Z"
        className="animate-bat-wing"
      />
      {/* Bat head & ears */}
      <polygon points="30,12 28,6 31,8" fill="currentColor" />
      <polygon points="34,12 36,6 33,8" fill="currentColor" />
      {/* Red/orange eyes */}
      <circle cx="30.5" cy="14" r="0.8" fill="#f97316" />
      <circle cx="33.5" cy="14" r="0.8" fill="#f97316" />
    </svg>
  );
}

function GhostSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 50 70" fill="currentColor">
      <path
        d="M25 5 C13 5, 8 16, 8 30 C8 45, 6 52, 9 60 C12 65, 17 60, 20 63 C23 66, 27 66, 30 63 C33 60, 38 65, 41 60 C44 52, 42 45, 42 30 C42 16, 37 5, 25 5 Z"
        fillOpacity="0.8"
      />
      {/* Ghost glowing eyes */}
      <ellipse cx="19" cy="24" rx="2.5" ry="3.5" fill="#090314" />
      <ellipse cx="31" cy="24" rx="2.5" ry="3.5" fill="#090314" />
      <circle cx="18" cy="23" r="0.8" fill="#a855f7" />
      <circle cx="30" cy="23" r="0.8" fill="#a855f7" />
      {/* O-shaped spooky mouth */}
      <ellipse cx="25" cy="34" rx="2.5" ry="4" fill="#090314" />
    </svg>
  );
}

function PumpkinSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 50" fill="currentColor">
      {/* Stem */}
      <rect x="27" y="2" width="6" height="8" rx="2" fill="#15803d" />
      {/* Pumpkin Body */}
      <ellipse cx="30" cy="28" rx="26" ry="19" fill="#ea580c" />
      <ellipse cx="22" cy="28" rx="16" ry="19" fill="#f97316" />
      <ellipse cx="38" cy="28" rx="16" ry="19" fill="#f97316" />
      <ellipse cx="30" cy="28" rx="11" ry="18.5" fill="#fb923c" />
      {/* Glowing Carved Eyes */}
      <polygon points="20,22 25,27 17,27" fill="#fef08a" />
      <polygon points="40,22 43,27 35,27" fill="#fef08a" />
      {/* Nose */}
      <polygon points="30,28 32,32 28,32" fill="#fef08a" />
      {/* Jagged Smile */}
      <path d="M18 36 Q30 46 42 36 L39 37 L36 35 L33 37 L30 35 L27 37 L24 35 L21 37 Z" fill="#fef08a" />
    </svg>
  );
}

function SnowmanSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 130">
      {/* Snowman Body - Bottom Ball */}
      <circle cx="50" cy="95" r="32" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
      {/* Middle Ball */}
      <circle cx="50" cy="55" r="22" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
      {/* Head */}
      <circle cx="50" cy="25" r="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
      {/* Top Hat */}
      <ellipse cx="50" cy="13" rx="18" ry="3" fill="#0f172a" />
      <rect x="40" y="0" width="20" height="13" rx="1" fill="#0f172a" />
      <rect x="40" y="9" width="20" height="3" fill="#dc2626" />
      {/* Coal Eyes */}
      <circle cx="44" cy="22" r="2" fill="#0f172a" />
      <circle cx="56" cy="22" r="2" fill="#0f172a" />
      {/* Carrot Nose */}
      <polygon points="50,26 62,28 50,30" fill="#f97316" stroke="#ea580c" strokeWidth="0.5" />
      {/* Smile */}
      <circle cx="43" cy="33" r="1" fill="#0f172a" />
      <circle cx="47" cy="35" r="1" fill="#0f172a" />
      <circle cx="53" cy="35" r="1" fill="#0f172a" />
      <circle cx="57" cy="33" r="1" fill="#0f172a" />
      {/* Cozy Red & Green Scarf */}
      <rect x="36" y="38" width="28" height="7" rx="3.5" fill="#dc2626" />
      <rect x="52" y="44" width="8" height="20" rx="2" fill="#dc2626" />
      <rect x="52" y="56" width="8" height="3" fill="#15803d" />
      {/* Buttons */}
      <circle cx="50" cy="53" r="2" fill="#0f172a" />
      <circle cx="50" cy="62" r="2" fill="#0f172a" />
      <circle cx="50" cy="85" r="2.5" fill="#0f172a" />
      <circle cx="50" cy="98" r="2.5" fill="#0f172a" />
    </svg>
  );
}

function ReindeerSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="currentColor">
      {/* Reindeer Body */}
      <ellipse cx="50" cy="65" rx="22" ry="14" />
      {/* Neck */}
      <path d="M64 62 L74 38 L82 44 L70 68 Z" />
      {/* Head */}
      <ellipse cx="80" cy="36" rx="8" ry="6" />
      {/* Ears */}
      <ellipse cx="76" cy="31" rx="4" ry="2" transform="rotate(-30 76 31)" />
      {/* Antlers */}
      <path
        d="M78 30 L74 16 L70 12 M74 16 L78 12 M74 22 L70 20 M82 28 L84 14 L88 10 M84 14 L80 10 M84 20 L88 18"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Red nose (Rudolph touch) */}
      <circle cx="87" cy="38" r="2" fill="#ef4444" className="animate-pulse" />
      {/* Legs */}
      <rect x="36" y="74" width="4" height="22" rx="2" />
      <rect x="44" y="76" width="4" height="20" rx="2" />
      <rect x="58" y="74" width="4" height="22" rx="2" />
      <rect x="66" y="76" width="4" height="20" rx="2" />
      {/* Tail */}
      <ellipse cx="30" cy="60" rx="4" ry="3" />
    </svg>
  );
}

function ChristmasTreeSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 110">
      {/* Trunk */}
      <rect x="35" y="90" width="10" height="16" fill="#78350f" rx="1" />
      {/* Tree Layers */}
      <polygon points="40,65 10,92 70,92" fill="#047857" />
      <polygon points="40,42 18,68 62,68" fill="#059669" />
      <polygon points="40,20 25,45 55,45" fill="#10b981" />
      {/* Glowing Gold Star on top */}
      <polygon
        points="40,8 43,16 51,16 45,21 47,29 40,24 33,29 35,21 29,16 37,16"
        fill="#facc15"
        stroke="#eab308"
        strokeWidth="1"
        className="animate-pulse"
      />
      {/* Twinkling Colorful Fairy Ornaments */}
      <circle cx="32" cy="40" r="2" fill="#ef4444" className="animate-ping" />
      <circle cx="48" cy="36" r="2" fill="#facc15" />
      <circle cx="26" cy="62" r="2.5" fill="#38bdf8" />
      <circle cx="52" cy="58" r="2.5" fill="#ef4444" />
      <circle cx="40" cy="52" r="2" fill="#facc15" className="animate-pulse" />
      <circle cx="22" cy="85" r="3" fill="#facc15" />
      <circle cx="36" cy="78" r="2.5" fill="#ef4444" />
      <circle cx="58" cy="84" r="3" fill="#a855f7" />
      <circle cx="48" cy="80" r="2.5" fill="#38bdf8" />
    </svg>
  );
}

function WineGlassesSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 90 90">
      {/* Left Champagne Flute */}
      <g transform="rotate(-12 35 45)">
        {/* Flute Bowl */}
        <path d="M25 15 C25 35, 30 42, 35 45 L35 65 L28 65 L28 67 L42 67 L42 65 L35 65 L35 45 C40 42, 45 35, 45 15 Z" fill="none" stroke="#facc15" strokeWidth="1.5" />
        {/* Golden Champagne Liquid */}
        <path d="M27 24 C27 34, 30 38, 35 40 C40 38, 43 34, 43 24 Z" fill="#fef08a" fillOpacity="0.75" />
        {/* Bubbles */}
        <circle cx="33" cy="32" r="1" fill="#ffffff" className="animate-ping" />
        <circle cx="37" cy="27" r="1" fill="#ffffff" />
      </g>
      {/* Right Champagne Flute */}
      <g transform="rotate(12 55 45)">
        {/* Flute Bowl */}
        <path d="M45 15 C45 35, 50 42, 55 45 L55 65 L48 65 L48 67 L62 67 L62 65 L55 65 L55 45 C60 42, 65 35, 65 15 Z" fill="none" stroke="#facc15" strokeWidth="1.5" />
        {/* Golden Champagne Liquid */}
        <path d="M47 24 C47 34, 50 38, 55 40 C60 38, 63 34, 63 24 Z" fill="#fef08a" fillOpacity="0.75" />
        {/* Bubbles */}
        <circle cx="53" cy="30" r="1" fill="#ffffff" className="animate-ping" />
        <circle cx="57" cy="26" r="1" fill="#ffffff" />
      </g>
      {/* Sparkle of the "Clink" */}
      <polygon points="45,18 47,23 52,23 48,26 50,31 45,28 40,31 42,26 38,23 43,23" fill="#fde047" className="animate-pulse" />
    </svg>
  );
}

function ChampagneBottleSvg({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 70 100">
      {/* Bottle Body */}
      <path d="M25 45 C25 35, 30 25, 30 15 L40 15 C40 25, 45 35, 45 45 L46 85 C46 88, 43 90, 40 90 L30 90 C27 90, 24 88, 24 85 Z" fill="#042f2e" stroke="#14b8a6" strokeWidth="1" />
      {/* Golden Foil Neck */}
      <path d="M30 15 L40 15 L40 28 L30 28 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
      {/* Cork */}
      <rect x="32" y="8" width="6" height="7" rx="1.5" fill="#d97706" />
      {/* Label */}
      <rect x="26" y="55" width="18" height="22" rx="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
      <text x="35" y="68" fontSize="6" fontWeight="bold" textAnchor="middle" fill="#78350f" fontFamily="sans-serif">2026</text>
      {/* Golden celebratory stars spraying out of bottle */}
      <circle cx="35" cy="4" r="1.5" fill="#fde047" className="animate-ping" />
      <circle cx="28" cy="2" r="1" fill="#facc15" />
      <circle cx="42" cy="1" r="1.2" fill="#f59e0b" />
    </svg>
  );
}
