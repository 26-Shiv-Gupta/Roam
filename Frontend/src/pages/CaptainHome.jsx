import React, { useRef, useState, useEffect } from 'react'
import RidePopUp from '../components/RidePopUp';
import gsap from "gsap";
import ConfirmRidePopUp from '../components/ConfirmRidePopUp';

const stats = [
  {
    label: "Hours Online",
    value: "10.2",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#111827" strokeWidth="1.6" />
        <path
          d="M12 7v5l3.5 2"
          stroke="#111827"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "Hours Online",
    value: "10.2",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 21a9 9 0 100-18 9 9 0 000 18z"
          stroke="#111827"
          strokeWidth="1.6"
        />
        <path
          d="M12 12l4-3"
          stroke="#111827"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path d="M8 16l1-1M16 16l-1-1M6 12h1M17 12h1" stroke="#111827" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Hours Online",
    value: "10.2",
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="3" width="14" height="18" rx="2" stroke="#111827" strokeWidth="1.6" />
        <path d="M9 8h6M9 12h6M9 16h3" stroke="#111827" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

const CaptainHome = ({
  captainName = "Harsh Patel",
  captainAvatar = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=200&q=80",
  earnings = "295.20",
  arrivalMinutes = 6,
  onLogout,
}) => {

  const [RidePopUpPanel, setRidePopUpPanel] = useState(true)
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false)

  const RidePopUpRef = useRef(null)
  const ConfirmRidePopUpRef = useRef(null)

  // Confirm Ride popup slides up from the bottom over everything else
  useEffect(() => {
    if (!ConfirmRidePopUpRef.current) return;
    gsap.to(ConfirmRidePopUpRef.current, {
      yPercent: confirmRidePopUpPanel ? 0 : 100,
      duration: 0.45,
      ease: "power3.out",
    });
  }, [confirmRidePopUpPanel]);

  // Ride popup slides up from the bottom over everything else
  useEffect(() => {
    if (!RidePopUpRef.current) return;
    gsap.to(RidePopUpRef.current, {
      yPercent: RidePopUpPanel ? 0 : 100,
      duration: 0.45,
      ease: "power3.out",
    });
  }, [RidePopUpPanel]);

  return (
    <div className="relative w-full h-screen bg-neutral-100 overflow-hidden">
      {/* Map and Logo section */}
      <div className="bg-cover">
        <img
          src="https://media.wired.com/photos/59269cd37034dc5f91bec0f1/3:2/w_2560%2Cc_limit/GoogleMapTA.jpg"
          className="h-screen w-full object-cover"
        />
        {/* Logo */}
        <div className="absolute top-5 left-5 text-2xl font-bold text-gray-900">
          <div className="flex items-center gap-2 mb-8">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" fill="#16a34a" />
              <circle cx="12" cy="12" r="4.6" stroke="white" strokeWidth="1.6" />
              <circle cx="12" cy="12" r="1.5" fill="white" />
              <path
                d="M12 7.4v2.6M8.1 14.3l2.3-1.3M15.9 14.3l-2.3-1.3"
                stroke="white"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              Roam
            </span>
            <span className="rounded bg-green-600/10 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-green-700">
              Captain
            </span>
          </div>
        </div>
        {/* Logout Button */}
        <button
          type="button"
          aria-label="Logout"
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 4H6a2 2 0 00-2 2v12a2 2 0 002 2h3M16 16l4-4-4-4M20 12H9"
              stroke="#111827"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className='absolute w-full bottom-0 bg-white'>
        <div className="flex items-center justify-between px-5 pt-5">
          <div className="flex items-center gap-3">
            <img
              src={captainAvatar}
              alt={captainName}
              className="h-11 w-11 rounded-full object-cover"
            />
            <p className="font-semibold text-gray-900">{captainName}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">₹{earnings}</p>
            <p className="text-sm text-gray-500">Earned</p>
          </div>
        </div>

        {/* Stats */}
        <div className="relative mx-5 mt-5 mb-6 rounded-2xl bg-neutral-100 px-4 py-5">
          <span className="absolute top-3 right-4 h-1.5 w-1.5 rounded-full bg-gray-400" />
          <div className="grid grid-cols-3 gap-2">
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                {s.icon}
                <p className="text-base font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ride Popup panel */}
      <div
        ref={RidePopUpRef}
        className="absolute bottom-0 w-full"
      >
        <RidePopUp setRidePopUpPanel={setRidePopUpPanel} setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}/>
      </div>

      {/* Confirm Ride popup Panel */}
      <div
        ref={ConfirmRidePopUpRef}
        className="absolute bottom-0 w-full h-screen bg-white"
      >
        <ConfirmRidePopUp setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}/>
      </div>

    </div>
  )
}

export default CaptainHome