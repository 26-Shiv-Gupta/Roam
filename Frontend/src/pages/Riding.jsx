import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { Link, useLocation } from 'react-router-dom'
import LiveLocationMap from '../components/LiveLocationMap'
import UserRoamLogo from '../components/UserRoamLogo'
import { VEHICLE_IMAGES, VEHICLE_NAMES } from '../../public/vechileImages'

// Captains register "moto", while rides use "motorcycle"
const normalizeType = (t) => (t === 'moto' ? 'motorcycle' : t)

export default function Riding(props) {
  const location = useLocation()
  const { ride } = location.state || {}
  const panelRef = useRef(null)

  const captain = ride?.captain
  const first = captain?.fullname?.firstname || ''
  const last = captain?.fullname?.lastname || ''
  const driverName = `${first} ${last}`.trim() || 'Your driver'
  const plate = captain?.vechile?.plate
  const type = normalizeType(captain?.vechile?.vechileType)
  const image = VEHICLE_IMAGES[type]
  const typeName = VEHICLE_NAMES[type] || captain?.vechile?.vechileType

  useEffect(() => {
    if (!panelRef.current) return
    gsap.fromTo(
      panelRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
    )
  }, [])

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#F4F5FA] font-sans">
      {/* Map */}
      <LiveLocationMap />

      {/* Logo chip */}
      <div className="absolute left-4 top-4 z-10 rounded-2xl bg-white px-3 py-2 shadow-[0_6px_20px_rgba(20,17,46,0.15)]">
        <UserRoamLogo />
      </div>

      {/* Home */}
      <Link
        to="/home"
        aria-label="Go to home"
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
          <path d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9" />
        </svg>
      </Link>

      {/* Trip sheet */}
      <div ref={panelRef} className="absolute bottom-0 w-full">
        <div className="mx-auto w-full max-w-md rounded-t-[32px] bg-white px-6 pb-8 pt-6 shadow-[0_-8px_30px_rgba(20,17,46,0.12)]">
          <div className="mb-4 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-600" />
            </span>
            <p className="text-xs font-bold uppercase tracking-wide text-green-700">
              You're on your way
            </p>
          </div>

          {/* Driver + vehicle */}
          <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl bg-[#F4F5FA] px-4 py-3">
            {image && (
              <img
                src={image}
                alt={typeName || 'Vehicle'}
                draggable={false}
                className="h-14 w-24 shrink-0 object-contain"
              />
            )}

            <div className="min-w-0 flex-1 text-right">
              <p className="truncate text-base font-bold text-[#14112E]">{driverName}</p>
              {plate && (
                <p className="mt-0.5 inline-block rounded-lg border-2 border-[#14112E] bg-white px-2 py-0.5 text-sm font-extrabold tracking-wider text-[#14112E]">
                  {plate}
                </p>
              )}
              {typeName && (
                <p className="mt-1 text-xs font-semibold capitalize text-[#4B5069]">{typeName}</p>
              )}
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-start gap-3 py-2.5">
            <span aria-hidden="true" className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center">
              <span className="h-3.5 w-3.5 rounded-[4px] bg-[#C2410C]" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-[#9AA0BA]">Destination</p>
              <p className="font-semibold leading-snug text-[#14112E]">{ride?.destination}</p>
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
              {ride?.fare != null ? `₹${ride.fare}` : '—'}
            </span>
          </div>

          <button
            type="button"
            onClick={props.onMakePayment}
            className="mt-5 flex h-14 w-full items-center justify-center rounded-2xl bg-[#2B2F77] text-base font-bold text-white shadow-[0_8px_20px_rgba(43,47,119,0.28)] transition hover:bg-[#3a3fa0] active:scale-[0.98]"
          >
            Make a payment
          </button>
        </div>
      </div>
    </div>
  )
}