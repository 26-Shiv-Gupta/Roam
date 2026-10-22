import React from 'react'

// The active dot stretches into a pill and fills up over `duration` ms,
// so the dots visibly "run" one after another. Dots are tappable.
const PaginationDots = ({ total = 3, active = 0, duration = 4000, paused = false, onSelect }) => {
  return (
    <>
      <style>{`
        @keyframes roam-dot-fill { from { width: 0% } to { width: 100% } }
        @media (prefers-reduced-motion: reduce) {
          .roam-dot-fill { animation: none !important; width: 100% !important }
        }
      `}</style>

      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => {
          const isActive = i === active
          return (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={isActive}
              onClick={() => onSelect?.(i)}
              className={`relative h-1.5 overflow-hidden rounded-full bg-[#CBD0E6] transition-all duration-300 ${
                isActive ? 'w-7' : 'w-1.5'
              }`}
            >
              {isActive && (
                <span
                  key={active /* restart the fill on every slide */}
                  className="roam-dot-fill absolute inset-y-0 left-0 rounded-full bg-[#2B2F77]"
                  style={{
                    animation: `roam-dot-fill ${duration}ms linear forwards`,
                    animationPlayState: paused ? 'paused' : 'running',
                  }}
                />
              )}
            </button>
          )
        })}
      </div>
    </>
  )
}

export default PaginationDots