import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { VEHICLE_IMAGES } from '../../public/vechileImages'

// Put the images in your project's  public/images/  folder
// (transparent PNG / WebP, side view, roughly 200x120 or larger).
const VEHICLES = [
  {
    type: 'car',
    name: 'Car',
    seats: 3,
    desc: 'Comfortable, everyday rides',
    img: VEHICLE_IMAGES.car,
  },
  {
    type: 'motorcycle',
    name: 'Bike',
    seats: 1,
    desc: 'Fastest through traffic',
    img: VEHICLE_IMAGES.motorcycle,
  },
  {
    type: 'auto',
    name: 'Auto',
    seats: 3,
    desc: 'Affordable, compact rides',
    img: VEHICLE_IMAGES.auto,
  },
]

export default function VechilePanel(props) {
  const listRef = useRef(null)

  useEffect(() => {
    if (!listRef.current) return
    gsap.fromTo(
      listRef.current.children,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.08, ease: 'power2.out' }
    )
  }, [])

  const handleSelectVehicle = (vehicleType) => {
    props.setVehiclePanelOpen(false)
    props.setConfirmRidePanelOpen(true)
    props.setSelectedVehicle(vehicleType)
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-t-[32px] bg-white px-6 pb-8 pt-2 font-sans shadow-[0_-8px_30px_rgba(20,17,46,0.12)]">
      {/* Handle (tap to close) */}
      <button
        type="button"
        onClick={() => props.setVehiclePanelOpen(false)}
        aria-label="Close vehicle panel"
        className="group mx-auto flex h-8 w-16 items-center justify-center"
      >
        <span className="h-1.5 w-10 rounded-full bg-[#CBD0E6] transition group-hover:bg-[#9AA0BA]" />
      </button>

      <h2 className="mb-4 text-xl font-extrabold tracking-tight text-[#14112E]">
        Choose a ride
      </h2>

      <div ref={listRef} className="flex flex-col gap-3">
        {VEHICLES.map((v) => {
          const price = props.fare?.[v.type]
          return (
            <button
              key={v.type}
              type="button"
              onClick={() => handleSelectVehicle(v.type)}
              className="flex items-center gap-4 rounded-2xl border-2 border-[#E3E6F2] bg-white p-3 text-left transition hover:border-[#2B2F77] hover:bg-[#F4F5FA] active:scale-[0.98]"
            >
              <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl bg-[#F4F5FA]">
                <img
                  src={v.img}
                  alt={v.name}
                  loading="lazy"
                  draggable={false}
                  className="object-contain"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-[#14112E]">{v.name}</span>
                  <span className="flex items-center gap-0.5 text-xs font-semibold text-[#4B5069]">
                    <svg
                      aria-hidden="true"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    >
                      <path d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0" />
                    </svg>
                    {v.seats}
                  </span>
                </div>
                <p className="mt-0.5 text-xs font-medium text-[#4B5069]">{v.desc}</p>
                <p className="mt-0.5 text-xs font-semibold text-[#C2410C]">2 min away</p>
              </div>

              <span className="text-md font-extrabold text-[#14112E]">
                {price != null ? `₹${price}` : '—'}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}