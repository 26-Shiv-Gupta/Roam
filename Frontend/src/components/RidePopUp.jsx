import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'

export default function RidePopUp(props) {
  const panelRef = useRef(null)

  const first = props.ride?.user?.fullname?.firstname || ''
  const last = props.ride?.user?.fullname?.lastname || ''
  const riderName = `${first} ${last}`.trim() || 'New rider'
  const initials = ((first[0] || '') + (last[0] || '')).toUpperCase() || 'R'

  useEffect(() => {
    if (!panelRef.current) return
    gsap.fromTo(
      panelRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
    )
  }, [])

  return (
    <div className="mx-auto w-full max-w-md">
      <div
        ref={panelRef}
        className="w-full rounded-t-[32px] bg-white px-6 pb-8 pt-2 font-sans shadow-[0_-8px_30px_rgba(20,17,46,0.12)]"
      >
        {/* Handle (tap to dismiss) */}
        <button
          type="button"
          onClick={() => props.setRidePopUpPanel(false)}
          aria-label="Dismiss ride request"
          className="group mx-auto flex h-8 w-16 items-center justify-center"
        >
          <span className="h-1.5 w-10 rounded-full bg-[#CBD0E6] transition group-hover:bg-[#9AA0BA]" />
        </button>

        <h2 className="mb-4 text-xl font-extrabold tracking-tight text-[#14112E]">
          New ride request
        </h2>

        {/* Rider card */}
        <div className="mb-4 flex items-center justify-between rounded-2xl bg-[#F4F5FA] px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden="true"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2B2F77] text-sm font-extrabold text-white"
            >
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate font-bold text-[#14112E]">{riderName}</p>
              <p className="text-xs font-semibold text-[#4B5069]">Rider</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xl font-extrabold text-[#14112E]">
              {props.ride?.fare != null ? `₹${props.ride.fare}` : '—'}
            </p>
            <p className="text-xs font-semibold text-[#4B5069]">Cash</p>
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

        <button
          type="button"
          onClick={() => {
            props.setRidePopUpPanel(false)
            props.confirmRide()
          }}
          className="mt-5 flex h-14 w-full items-center justify-center rounded-2xl bg-[#2B2F77] text-base font-bold text-white shadow-[0_8px_20px_rgba(43,47,119,0.28)] transition hover:bg-[#3a3fa0] active:scale-[0.98]"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={() => props.setRidePopUpPanel(false)}
          className="mt-3 flex h-14 w-full items-center justify-center rounded-2xl border-2 border-[#E3E6F2] bg-white text-base font-bold text-[#4B5069] transition hover:bg-[#F4F5FA] active:scale-[0.98]"
        >
          Ignore
        </button>
      </div>
    </div>
  )
}