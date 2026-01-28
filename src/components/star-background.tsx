function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
}

function generateStars(count: number, seed: number, maxDelay: number) {
  return Array.from({ length: count }, (_, i) => ({
    left: seededRandom(seed + i * 3) * 100,
    top: seededRandom(seed + i * 3 + 1) * 100,
    delay: seededRandom(seed + i * 3 + 2) * maxDelay,
  }));
}

const DISTANT_STARS = generateStars(80, 1000, 5);
const MEDIUM_STARS = generateStars(40, 2000, 4);
const BRIGHT_STARS = generateStars(15, 3000, 3);

export function StarBackground() {
  return (
    <div
      className='pointer-events-none fixed inset-0 -z-10 overflow-hidden'
      aria-hidden='true'
    >
      {/* Layer 1: Distant stars (small, dim) */}
      <div className='absolute inset-0'>
        {DISTANT_STARS.map((star, i) => (
          <div
            key={`star-1-${i}`}
            className='animate-twinkle-slow absolute size-px rounded-full bg-white/40'
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Layer 2: Medium stars */}
      <div className='absolute inset-0'>
        {MEDIUM_STARS.map((star, i) => (
          <div
            key={`star-2-${i}`}
            className='animate-twinkle absolute size-[2px] rounded-full bg-white/60'
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Layer 3: Bright stars */}
      <div className='absolute inset-0'>
        {BRIGHT_STARS.map((star, i) => (
          <div
            key={`star-3-${i}`}
            className='animate-twinkle-bright absolute size-[3px] rounded-full bg-white/80'
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Subtle grid overlay */}
      <div
        className='absolute inset-0 opacity-[0.02]'
        style={{
          backgroundImage: `
            linear-gradient(to right, white 1px, transparent 1px),
            linear-gradient(to bottom, white 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}
