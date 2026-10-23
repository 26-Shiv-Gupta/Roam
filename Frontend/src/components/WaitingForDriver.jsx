import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { VEHICLE_IMAGES, VEHICLE_NAMES } from '../../public/vechileImages'

// Captains register "moto", while rides use "motorcycle"
const normalizeType = (t) => (t === 'moto' ? 'motorcycle' : t)

export default function WaitingForDriver(props) {
  const panelRef = useRef(null)

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
        className="w-full rounded-t-[32px] bg-white px-6 pb-8 pt-2 font-sans shadow-[0_-8px_30px_rgba(20,17,46,0.12)]"
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
      </div>
    </div>
  )
}