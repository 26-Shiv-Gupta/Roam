import React, { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import axios from 'axios'
import { VEHICLE_IMAGES, VEHICLE_NAMES } from '../../public/vechileImages'

// Captains register "moto", while rides use "motorcycle"
const normalizeType = (t) => (t === 'moto' ? 'motorcycle' : t)

export default function WaitingForDriver(props) {
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
      if (props.ride?._id) {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/rides/cancel-ride`,
          { rideId: props.ride._id },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        )
      }
      setConfirming(false)
      props.setWaitingForDriver(false)
    } catch (error) {
      setCancelError(
        error.response?.data?.message || 'Could not cancel the ride. Please try again.'
      )
    } finally {
      setCancelling(false)
    }
  }

  const captain = props.ride?.captain
  const first = captain?.fullname?.firstname || ''
  const last = captain?.fullname?.lastname || ''
  const driverName = `${first} ${last}`.trim() || 'Your driver'
  const plate = captain?.vechile?.plate
  const type = normalizeType(captain?.vechile?.vechileType)
  const image = VEHICLE_IMAGES[type]
  const typeName = VEHICLE_NAMES[type] || captain?.vechile?.vechileType
  const otp = props.ride?.otp ? String(props.ride.otp) : ''

  useEffect(() => {
    if (!panelRef.current) return
    gsap.fromTo(
      panelRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
    )
  }, [])

  return (
    <div className="mx-auto w-full max-w-md">
      <div
        ref={panelRef}
        className="relative w-full overflow-hidden rounded-t-[32px] bg-white px-6 pb-8 pt-2 font-sans shadow-[0_-8px_30px_rgba(20,17,46,0.12)]"
      >
        {/* Handle (tap to close) */}
        <button
          type="button"
          onClick={() => props.setWaitingForDriver(false)}
          aria-label="Close driver panel"
          className="group mx-auto flex h-8 w-16 items-center justify-center"
        >
          <span className="h-1.5 w-10 rounded-full bg-[#CBD0E6] transition group-hover:bg-[#9AA0BA]" />
        </button>

        <h2 className="text-xl font-extrabold tracking-tight text-[#14112E]">
          Your driver is on the way
        </h2>
        <p className="mt-1 text-sm font-medium text-[#4B5069]">
          Share the OTP with your driver when they arrive.
        </p>

        {/* Driver + vehicle */}
        <div className="my-4 flex items-center justify-between gap-3 rounded-2xl bg-[#F4F5FA] px-4 py-3">
          {image && (
            <img
              src={image}
              alt={typeName || 'Vehicle'}
              draggable={false}
              className="h-24 w-24 shrink-0 object-contain"
            />
          )}

          <div className="min-w-0 flex-1 text-right">
            <p className="truncate text-base font-bold text-[#14112E]">{driverName}</p>
            {plate && (
              <p className="mt-0.5 inline-block rounded-lg border-2 border-[#14112E] bg-white px-2 py-0.5 text-sm font-extrabold tracking-wider text-[#14112E]">
                {plate}
              </p>
            )}
          </div>
        </div>

        {/* OTP */}
        <div className="mb-4 rounded-2xl border-2 border-[#2B2F77] bg-[#2B2F77]/5 px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-wide text-[#2B2F77]">Ride OTP</p>
          <div className="mt-2 flex gap-2" aria-label={`OTP ${otp.split('').join(' ')}`}>
            {otp ? (
              otp.split('').map((d, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className="flex h-12 flex-1 items-center justify-center rounded-xl bg-white text-2xl font-extrabold text-[#14112E] shadow-[0_2px_8px_rgba(20,17,46,0.08)]"
                >
                  {d}
                </span>
              ))
            ) : (
              <span className="text-lg font-extrabold text-[#14112E]">—</span>
            )}
          </div>
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
              <p className="font-semibold leading-snug text-[#14112E]">{props.ride?.pickup}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 py-2.5">
            <span aria-hidden="true" className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center">
              <span className="h-3.5 w-3.5 rounded-[4px] bg-[#C2410C]" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-[#9AA0BA]">Destination</p>
              <p className="font-semibold leading-snug text-[#14112E]">{props.ride?.destination}</p>
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
            {props.ride?.fare != null ? `₹${props.ride.fare}` : '—'}
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
                {driverName} is already on the way. If you cancel, you'll need to
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
                Keep my ride
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
    </div>
  )
}