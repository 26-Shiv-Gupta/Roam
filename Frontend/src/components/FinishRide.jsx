import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FinishRide(props) {
  const panelRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!panelRef.current) return;
    gsap.fromTo(
      panelRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }
    );
  }, []);

  const handleCompleteRide = async () => {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/finish-ride`, {
      rideId: props.ride?._id
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    if(response.status === 200) {
      navigate('/captain-home')
    }
  }

  return (
    <div className="w-full bg-neutral-100 flex justify-center">
      <div className="w-full max-w-md bg-white flex flex-col overflow-hidden">

        {/* Ride panel */}
        <div
          ref={panelRef}
          className="flex-1 rounded-t-2xl px-5 pt-2 pb-6 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Finish this Ride
          </h2>

          {/* Rider card */}
          <div className="flex items-center justify-between rounded-xl bg-amber-400 px-4 py-3 mb-4">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
                alt="profile pic"
                className="h-10 w-10 rounded-full object-cover"
              />
              <p className="font-semibold text-gray-900">{props.ride?.user.fullname.firstname + " " + props.ride?.user.fullname.lastname}</p>
            </div>
            <p className="font-semibold text-gray-900">544 Km</p>
          </div>

          {/* Pickup */}
          <div className="flex items-start gap-3 py-3 border-b border-gray-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0">
              <path
                d="M12 21s-7-6.5-7-11a7 7 0 1114 0c0 4.5-7 11-7 11z"
                stroke="#111827"
                strokeWidth="1.6"
              />
              <circle cx="12" cy="10" r="2.2" stroke="#111827" strokeWidth="1.6" />
            </svg>
            <div>
              <p className="font-semibold text-gray-900">
                {props.ride?.pickup}
              </p>
            </div>
          </div>

          {/* Destination */}
          <div className="flex items-start gap-3 py-3 border-b border-gray-100">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0">
              <rect x="5" y="5" width="14" height="14" rx="2" stroke="#111827" strokeWidth="1.6" />
              <circle cx="12" cy="12" r="2.2" fill="#111827" />
            </svg>
            <div>
              <p className="font-semibold text-gray-900">
                {props.ride?.destination}
              </p>
            </div>
          </div>

          {/* Payment */}
          <div className="flex items-start gap-3 py-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mt-0.5 shrink-0">
              <rect x="3" y="6" width="18" height="13" rx="2" stroke="#111827" strokeWidth="1.6" />
              <path d="M3 10h18" stroke="#111827" strokeWidth="1.6" />
            </svg>
            <div>
              <p className="font-semibold text-gray-900">₹{props.ride?.fare}</p>
              <p className="text-sm text-gray-500">Cash</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCompleteRide}
            className="mt-5 w-full rounded-md bg-green-600 py-3.5 text-base font-bold text-white active:opacity-80 transition-opacity"
          >
            Complete Ride
          </button>
        </div>
      </div>
    </div>
  );
}