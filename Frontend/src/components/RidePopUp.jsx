import React, { useRef, useEffect } from "react";
import gsap from "gsap";

export default function RidePopUp({
  riderName = "Harsh Patel",
  riderAvatar = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=200&q=80",
  distance = "2.2 KM",
  pickup = "562/11-A, Kankariya Talab, Bhopal",
  destination = "562/11-A, Kankariya Talab, Bhopal",
  price = "193.20",
  onConfirm,
  onIgnore,
  setRidePopUpPanel,
  setConfirmRidePopUpPanel
}) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!panelRef.current) return;
    gsap.fromTo(
      panelRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }
    );
  }, []);

  return (
    <div className="w-full bg-neutral-100 flex justify-center items-end sm:items-center">
      <div
        ref={panelRef}
        className="w-full max-w-md rounded-t-2xl sm:rounded-2xl px-5 pt-3 pb-6 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]"
      >
        {/* Drag handle */}
        <div onClick={()=>{setRidePopUpPanel(false)}} className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-gray-300" />

        <h2 className="text-xl font-bold text-gray-900 mb-4">
          New Ride Available!
        </h2>

        {/* Rider card */}
        <div className="flex items-center justify-between rounded-xl bg-amber-400 px-4 py-3 mb-4">
          <div className="flex items-center gap-3">
            <img
              src={riderAvatar}
              alt={riderName}
              className="h-10 w-10 rounded-full object-cover"
            />
            <p className="font-semibold text-gray-900">{riderName}</p>
          </div>
          <p className="font-semibold text-gray-900">{distance}</p>
        </div>

        {/* Pickup */}
        <div className="flex items-start gap-3 py-3 border-b border-gray-100">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0">
            <path
              d="M12 21s-7-6.5-7-11a7 7 0 1114 0c0 4.5-7 11-7 11z"
              stroke="#111827"
              strokeWidth="1.6"
            />
            <circle cx="12" cy="10" r="2.2" stroke="#111827" strokeWidth="1.6" />
          </svg>
          <div>
            <p className="font-semibold text-gray-900">
              {pickup.split(",")[0]}
            </p>
            <p className="text-sm text-gray-500">
              {pickup.split(",").slice(1).join(",").trim()}
            </p>
          </div>
        </div>

        {/* Destination */}
        <div className="flex items-start gap-3 py-3 border-b border-gray-100">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0">
            <rect x="5" y="5" width="14" height="14" rx="2" stroke="#111827" strokeWidth="1.6" />
            <circle cx="12" cy="12" r="2.2" fill="#111827" />
          </svg>
          <div>
            <p className="font-semibold text-gray-900">
              {destination.split(",")[0]}
            </p>
            <p className="text-sm text-gray-500">
              {destination.split(",").slice(1).join(",").trim()}
            </p>
          </div>
        </div>

        {/* Payment */}
        <div className="flex items-start gap-3 py-3">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0">
            <rect x="3" y="6" width="18" height="13" rx="2" stroke="#111827" strokeWidth="1.6" />
            <path d="M3 10h18" stroke="#111827" strokeWidth="1.6" />
          </svg>
          <div>
            <p className="font-semibold text-gray-900">₹{price}</p>
            <p className="text-sm text-gray-500">Cash Cash</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setConfirmRidePopUpPanel(true)
            setRidePopUpPanel(false)
        }}
          className="mt-5 w-full rounded-md bg-green-600 py-3.5 text-base font-bold text-white active:opacity-80 transition-opacity"
        >
          Accept
        </button>
        <button
          type="button"
          onClick={()=>{setRidePopUpPanel(false)}}
          className="mt-3 w-full rounded-md bg-gray-200 py-3.5 text-base font-bold text-gray-800 active:opacity-80 transition-opacity"
        >
          Ignore
        </button>
      </div>
    </div>
  );
}