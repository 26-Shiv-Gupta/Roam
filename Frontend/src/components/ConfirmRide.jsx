import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import axios from 'axios'
import { VEHICLE_IMAGES, VEHICLE_NAMES } from '../../public/vechileImages'

export default function ConfirmRide(props) {
  const panelRef = useRef(null)

  const vehicle = props.selectedVehicle
  const image = VEHICLE_IMAGES[vehicle]
  const name = VEHICLE_NAMES[vehicle] || 'Ride'
  const price = props.fare?.[vehicle]

  // Slide the confirm sheet up on mount, same feel as the vehicle panel
  useEffect(() => {
    if (!panelRef.current) return
    gsap.fromTo(
      panelRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
    )
  }, [])

  const handleConfirmRide = async () => {
    props.setVechileFound(true)
    props.setConfirmRidePanelOpen(false)

    const newRide = {
      pickup: props.pickup,
      destination: props.destination,
      vehicleType: props.selectedVehicle,
    }

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create-ride`, newRide, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
    } catch (error) {
      console.error('Could not create ride:', error)
      props.setVechileFound(false)
      props.setConfirmRidePanelOpen(true)
    }
  }

  return (
    <div
      ref={panelRef}
      className="mx-auto w-full max-w-md rounded-t-[32px] bg-white px-6 pb-8 pt-2 font-sans shadow-[0_-8px_30px_rgba(20,17,46,0.12)]"
    >
      {/* Handle (tap to close) */}
      <button
        type="button"
        onClick={() => props.setConfirmRidePanelOpen(false)}
        aria-label="Close confirm panel"
        className="group mx-auto flex h-8 w-16 items-center justify-center"
      >
        <span className="h-1.5 w-10 rounded-full bg-[#CBD0E6] transition group-hover:bg-[#9AA0BA]" />
      </button>

      <h2 className="mb-3 text-xl font-extrabold tracking-tight text-[#14112E]">
        Confirm your ride
      </h2>

      {/* Chosen vehicle image */}
      <div className="mb-4 flex flex-col items-center rounded-2xl bg-[#F4F5FA]">
        {image && (
          <img
            src={image}
            alt={name}
            draggable={false}
            className="h-44 w-50 object-contain"
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
          <span
            aria-hidden="true"
            className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center"
          >
            <span className="h-3.5 w-3.5 rounded-[4px] bg-[#C2410C]" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-wide text-[#9AA0BA]">Destination</p>
            <p className="font-semibold leading-snug text-[#14112E]">{props.destination}</p>
          </div>
        </div>
      </div>

      {/* Fare + payment */}
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

      <button
        type="button"
        onClick={handleConfirmRide}
        className="mt-5 flex h-14 w-full items-center justify-center rounded-2xl bg-[#2B2F77] text-base font-bold text-white shadow-[0_8px_20px_rgba(43,47,119,0.28)] transition hover:bg-[#3a3fa0] active:scale-[0.98]"
      >
        Confirm ride
      </button>
    </div>
  )
}