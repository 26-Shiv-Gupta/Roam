import React from 'react'

// Roam logo for the captain side: green hexagon with a steering-wheel mark,
// the "Roam" wordmark and a CAPTAIN badge.
const CaptainRoamLogo = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        aria-hidden="true"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" fill="#16a34a" />
        <circle cx="12" cy="12" r="4.6" stroke="white" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="1.5" fill="white" />
        <path
          d="M12 7.4v2.6M8.1 14.3l2.3-1.3M15.9 14.3l-2.3-1.3"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>

      <span className="text-[22px] font-extrabold tracking-tight text-[#14112E]">
        Roam
      </span>

      <span className="rounded-md bg-green-600/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-green-700">
        Captain
      </span>
    </div>
  )
}

export default CaptainRoamLogo