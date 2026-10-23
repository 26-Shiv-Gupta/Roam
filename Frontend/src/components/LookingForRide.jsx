import React, { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import axios from 'axios'
import { VEHICLE_IMAGES, VEHICLE_NAMES } from '../../public/vechileImages'

const LookingForRide = (props) => {
  const panelRef = useRef(null)
  const [confirming, setConfirming] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState('')

  // Close the confirmation with the Escape key
  useEffect(() => {
    if (!confirming) return
    const onKey = (e) => e.key === 'Escape' && !cancelling && setConfirming(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [confirming, cancelling])

  const handleCancelRide = async () => {
    setCancelling(true)
    setCancelError('')
    try {
      // TODO: match this to your backend's cancel route
      if (props.rideId) {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/rides/cancel`,
          { rideId: props.rideId },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        )
      }
      setConfirming(false)
      props.setVechileFound(false)
    } catch (error) {
      setCancelError(
        error.response?.data?.message || 'Could not cancel the ride. Please try again.'
      )
    } finally {
      setCancelling(false)
    }
  }

  const vehicle = props.selectedVehicle
  const image = VEHICLE_IMAGES[vehicle]
  const name = VEHICLE_NAMES[vehicle] || 'Ride'
  const price = props.fare?.[vehicle]

  // Slide the sheet up on mount, same feel as the other panels
  useEffect(() => {
    if (!panelRef.current) return
    gsap.fromTo(
      panelRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
    )
  }, [])

  return (
    <div
      ref={panelRef}
      className="relative mx-auto w-full max-w-md overflow-hidden rounded-t-[32px] bg-white px-6 pb-8 pt-0 font-sans shadow-[0_-8px_30px_rgba(20,17,46,0.12)]"
    >
      <style>{`
        @keyframes roam-search-bar { 0% { transform: translateX(-100%) } 100% { transform: translateX(350%) } }
        @keyframes roam-pulse { 0% { transform: scale(0.6); opacity: .5 } 100% { transform: scale(1.5); opacity: 0 } }
        @media (prefers-reduced-motion: reduce) {
          .roam-search-bar, .roam-pulse { animation: none !important }
        }
      `}</style>

      {/* Searching bar, runs along the top edge of the sheet */}
      <div className="-mx-6 h-1 overflow-hidden bg-[#E3E6F2]" role="progressbar" aria-label="Searching for a driver">
        <div
          className="roam-search-bar h-full w-1/3 rounded-full bg-[#2B2F77]"
          style={{ animation: 'roam-search-bar 1.4s ease-in-out infinite' }}
        />
      </div>

      <h2 className="mt-5 text-xl font-extrabold tracking-tight text-[#14112E]">
        Looking for a driver
      </h2>
      <p className="mt-1 text-sm font-medium text-[#4B5069]">
        Hang tight, we're finding a {name.toLowerCase()} near you.
      </p>

      {/* Vehicle with pulsing rings */}
      <div className="relative my-4 flex items-center justify-center rounded-2xl bg-[#F4F5FA] py-5">
        <span
          aria-hidden="true"
          className="roam-pulse absolute h-24 w-24 rounded-full border-2 border-[#2B2F77]/40"
          style={{ animation: 'roam-pulse 1.8s ease-out infinite' }}
        />
        <span
          aria-hidden="true"
          className="roam-pulse absolute h-24 w-24 rounded-full border-2 border-[#2B2F77]/40"
          style={{ animation: 'roam-pulse 1.8s ease-out 0.9s infinite' }}
        />
        {image && (
          <img
            src={image}
            alt={name}
            draggable={false}
            className="relative h-20 w-36 object-contain"
          />
        )}
      </div>

      {/* Route */}
      <div className="relative flex flex-col gap-1">
        <span
          aria-hidden="true"
          className="absolute left-[9px] top-8 h-[calc(100%-4rem)] w-0.5 rounded-full bg-[#CBD0E6]"
        />

        <div className="flex items-start gap-3 py-2.5">
          <span
            aria-hidden="true"
            className="mt-1 h-5 w-5 shrink-0 rounded-full border-[5px] border-[#2B2F77] bg-white"
          />
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-[#9AA0BA]">Pick-up</p>
            <p className="font-semibold leading-snug text-[#14112E]">{props.pickup}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 py-2.5">
          <span aria-hidden="true" className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center">
            <span className="h-3.5 w-3.5 rounded-[4px] bg-[#C2410C]" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-[#9AA0BA]">Destination</p>
            <p className="font-semibold leading-snug text-[#14112E]">{props.destination}</p>
          </div>
        </div>
      </div>

      {/* Fare */}
      <div className="mt-2 flex items-center justify-between rounded-2xl border-2 border-[#E3E6F2] px-4 py-3">
        <div className="flex items-center gap-3">
          <svg
            aria-hidden="true"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#2B2F77"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="6" width="18" height="13" rx="2" />
            <path d="M3 10h18" />
          </svg>
          <span className="text-sm font-semibold text-[#4B5069]">Cash</span>
        </div>
        <span className="text-xl font-extrabold text-[#14112E]">
          {price != null ? `₹${price}` : '—'}
        </span>
      </div>

      {/* Cancel */}
      <button
        type="button"
        onClick={() => {
          setCancelError('')
          setConfirming(true)
        }}
        className="mt-5 flex h-14 w-full items-center justify-center rounded-2xl border-2 border-red-200 bg-white text-base font-bold text-red-600 transition hover:bg-red-50 active:scale-[0.98]"
      >
        Cancel ride
      </button>

      {/* Confirmation dialog */}
      {confirming && (
        <div
          className="absolute inset-0 z-20 flex items-end bg-[#14112E]/50"
          onClick={() => !cancelling && setConfirming(false)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="cancel-title"
            aria-describedby="cancel-desc"
            onClick={(e) => e.stopPropagation()}
            className="w-full rounded-t-[28px] bg-white px-6 pb-8 pt-6 shadow-[0_-8px_30px_rgba(20,17,46,0.2)]"
          >
            <h3 id="cancel-title" className="text-xl font-extrabold tracking-tight text-[#14112E]">
              Cancel this ride?
            </h3>
            <p id="cancel-desc" className="mt-1.5 text-sm font-medium text-[#4B5069]">
              We're still looking for a driver. If you cancel, you'll need to
              book again.
            </p>

            {cancelError && (
              <p role="alert" className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {cancelError}
              </p>
            )}

            <button
              type="button"
              autoFocus
              onClick={() => setConfirming(false)}
              disabled={cancelling}
              className="mt-5 flex h-14 w-full items-center justify-center rounded-2xl bg-[#2B2F77] text-base font-bold text-white shadow-[0_8px_20px_rgba(43,47,119,0.28)] transition hover:bg-[#3a3fa0] active:scale-[0.98] disabled:opacity-60"
            >
              Keep searching
            </button>
            <button
              type="button"
              onClick={handleCancelRide}
              disabled={cancelling}
              className="mt-3 flex h-14 w-full items-center justify-center rounded-2xl border-2 border-red-200 bg-white text-base font-bold text-red-600 transition hover:bg-red-50 active:scale-[0.98] disabled:opacity-60"
            >
              {cancelling ? 'Cancelling…' : 'Yes, cancel ride'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LookingForRide