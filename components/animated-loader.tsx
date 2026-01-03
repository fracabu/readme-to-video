'use client';

/**
 * Animated loader components for README2Video
 * Inspired by Mux's design aesthetic
 */

// Animated wave loader - shows during video generation
export function WaveLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="w-1 bg-primary rounded-full animate-wave"
          style={{
            animationDelay: `${i * 0.1}s`,
            height: '24px',
          }}
        />
      ))}
    </div>
  );
}

// Pulsing rings loader
export function PulseRings({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-16 h-16 ${className}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping"
          style={{
            animationDelay: `${i * 0.4}s`,
            animationDuration: '1.5s',
          }}
        />
      ))}
      <div className="absolute inset-3 rounded-full bg-primary/20 animate-pulse" />
    </div>
  );
}

// Orbiting dots loader
export function OrbitLoader({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-12 h-12 ${className}`}>
      <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${i * 90}deg) translateX(20px) translateY(-50%)`,
              opacity: 1 - i * 0.2,
            }}
          />
        ))}
      </div>
      <div className="absolute inset-3 rounded-full bg-primary/10" />
    </div>
  );
}

// Video generation specific loader with film reel aesthetic
export function VideoGenerationLoader({ progress = 0 }: { progress?: number }) {
  return (
    <div className="relative w-32 h-32">
      {/* Outer ring */}
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted/20"
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${progress * 2.83} 283`}
          className="transition-all duration-500"
        />
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(24, 100%, 60%)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-2xl font-bold font-mono text-primary">
          {Math.round(progress)}%
        </div>
        <div className="text-xs text-muted-foreground">generating</div>
      </div>

      {/* Animated particles around the circle */}
      <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <div
            key={deg}
            className="absolute w-1.5 h-1.5 bg-primary/40 rounded-full animate-pulse"
            style={{
              top: '50%',
              left: '50%',
              transform: `rotate(${deg}deg) translateX(55px) translateY(-50%)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Animated background gradient
export function AnimatedBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl animate-blob"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-orange-500/5 rounded-full blur-3xl animate-blob"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-primary/3 rounded-full blur-3xl animate-blob"
          style={{ animationDelay: '4s' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Floating particles effect
export function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary/20 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`,
          }}
        />
      ))}
    </div>
  );
}
