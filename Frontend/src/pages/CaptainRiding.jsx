import React, { useRef, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import FinishRide from '../components/FinishRide'
import LiveLocationMap from '../components/LiveLocationMap'
import CaptainRoamLogo from '../components/CaptainRoamLogo'

const CaptainRiding = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { ride } = location.state || {}

  const [finishRidePanel, setFinishRidePanel] = useState(false)
  const FinishRidePanelRef = useRef(null)

  // Finish Ride panel slides up from the bottom over everything else
  useEffect(() => {
    if (!FinishRidePanelRef.current) return
    gsap.to(FinishRidePanelRef.current, {
      yPercent: finishRidePanel ? 0 : 100,
      duration: 0.45,
      ease: 'power3.out',
    })
  }, [finishRidePanel])

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#F4F5FA] font-sans">
      {/* Map */}
      <LiveLocationMap />

      {/* Logo chip */}
      <div className="absolute left-4 top-4 z-10 rounded-2xl bg-white px-3 py-2 shadow-[0_6px_20px_rgba(20,17,46,0.15)]">
        <CaptainRoamLogo />
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={() => navigate('/captain-logout')}
        aria-label="Logout"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#14112E] shadow-[0_6px_20px_rgba(20,17,46,0.15)] transition hover:text-[#2B2F77] active:scale-95"
      >
        <svg
          aria-hidden="true"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 4H6a2 2 0 00-2 2v12a2 2 0 002 2h3M16 16l4-4-4-4M20 12H9" />
        </svg>
      </button>

      {/* Trip sheet */}
      <div className="absolute bottom-0 left-0 w-full rounded-t-[32px] bg-white px-6 pb-7 pt-6 shadow-[0_-8px_30px_rgba(20,17,46,0.12)]">
        <div className="mb-4 flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-600" />
          </span>
          <p className="text-xs font-bold uppercase tracking-wide text-green-700">Ride in progress</p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-[#9AA0BA]">Drop-off</p>
            <p className="mt-0.5 line-clamp-2 font-semibold leading-snug text-[#14112E]">
              {ride?.destination || 'Destination'}
            </p>
          </div>

          <div className="shrink-0 text-right">
            {/* Placeholder: replace with the real remaining distance */}
            <p className="text-2xl font-extrabold tracking-tight text-[#14112E]">4 km</p>
            <p className="text-xs font-semibold text-[#4B5069]">away</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setFinishRidePanel(true)}
          className="mt-5 flex h-14 w-full items-center justify-center rounded-2xl bg-[#2B2F77] text-base font-bold text-white shadow-[0_8px_20px_rgba(43,47,119,0.28)] transition hover:bg-[#3a3fa0] active:scale-[0.98]"
        >
          Complete ride
        </button>
      </div>

      {/* Finish ride panel */}
      <div ref={FinishRidePanelRef} className="absolute bottom-0 w-full">
        <FinishRide ride={ride} onClose={() => setFinishRidePanel(false)} />
      </div>
    </div>
  )
}

export default CaptainRiding