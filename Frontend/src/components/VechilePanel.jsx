import React, { useRef, useEffect } from "react";
import gsap from "gsap";

const vehicles = [
  {
    id: "car",
    name: "RoamGo",
    capacity: 4,
    eta: "2 mins away",
    price: "₹193.20",
    tagline: "Affordable, compact rides",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 13l1.5-4.5A2 2 0 016.4 7h11.2a2 2 0 011.9 1.5L21 13v5a1 1 0 01-1 1h-1a1 1 0 01-1-1v-1H6v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-5z"
          stroke="#111827"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <circle cx="7" cy="17.5" r="1.4" fill="#111827" />
        <circle cx="17" cy="17.5" r="1.4" fill="#111827" />
      </svg>
    ),
  },
  {
    id: "moto",
    name: "Moto",
    capacity: 1,
    eta: "3 mins away",
    price: "₹65",
    tagline: "Affordable motorcycle rides",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <circle cx="6" cy="17" r="2.2" stroke="#111827" strokeWidth="1.4" />
        <circle cx="18" cy="17" r="2.2" stroke="#111827" strokeWidth="1.4" />
        <path
          d="M6 17h4l3-6h4M13 11l2 2 3-1"
          stroke="#111827"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "auto",
    name: "RoamAuto",
    capacity: 3,
    eta: "3 mins away",
    price: "₹118.86",
    tagline: "Affordable Auto rides",
    icon: (
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 16l1-6h9l2 3h3v3"
          stroke="#111827"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <circle cx="7" cy="17.5" r="1.4" fill="#111827" />
        <circle cx="16" cy="17.5" r="1.4" fill="#111827" />
      </svg>
    ),
  },
];

export default function  VechilePanel(props) {
  const listRef = useRef(null);

  useEffect(() => {
    if (!listRef.current) return;
    gsap.fromTo(
      listRef.current.children,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.08, ease: "power2.out" }
    );
  }, []);

  return (
    <div className="bg-white rounded-t-2xl shadow-[0_-4px_16px_rgba(0,0,0,0.08)] px-5 pt-3 pb-10 max-w-md mx-auto">
      {/* Drag handle */}
      <button
        type="button"
        onClick={()=> {props.setVehiclePanelOpen(false)}}
        aria-label="Close vehicle panel"
        className="mx-auto mb-3 block h-1.5 w-10 rounded-full bg-gray-300"
      />

      <h2 className="text-lg font-bold text-gray-900 mb-4">Choose a Vehicle</h2>

      <div ref={listRef} className="flex flex-col gap-3">
        {vehicles.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={()=> {
              props.setConfirmRidePanelOpen(true)
              props.setVehiclePanelOpen(false)
            }}
            className="flex items-center gap-4 rounded-xl border border-gray-200 px-3 py-3 text-left active:bg-gray-50"
          >
            <div className="shrink-0">{v.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-gray-900">{v.name}</span>
                <span className="flex items-center gap-0.5 text-xs text-gray-500">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  {v.capacity}
                </span>
                <span className="h-1 w-1 rounded-full bg-gray-400" />
                <span className="text-xs text-gray-500">{v.eta}</span>
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{v.tagline}</p>
            </div>
            <span className="font-bold text-gray-900">{v.price}</span>
          </button>
        ))}
      </div>
    </div>
  );
}