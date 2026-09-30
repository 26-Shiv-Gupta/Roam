import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import gsap from 'gsap'

const CaptainRiding = () => {

    const [finishRidePanel, setFinishRidePanel] = useState(false)

    const FinishRidePanelRef = useRef(null)

    // Finish Ride panel slides up from the bottom over everything else
    useEffect(() => {
        if (!FinishRidePanelRef.current) return;
        gsap.to(FinishRidePanelRef.current, {
            yPercent: finishRidePanel ? 0 : 100,
            duration: 0.45,
            ease: "power3.out",
        });
    }, [finishRidePanel]);

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

            <div className='absolute w-full bottom-0 bg-yellow-100'>
                <div className="relative mx-5 mt-5 mb-6 rounded-lg px-4 py-5">
                    <div className="grid grid-cols-2 gap-2 items-center">
                        <h3 className='text-center font-semibold'>4 KM away</h3>
                        <button
                            onClick={() => { setFinishRidePanel(true) }}
                            className=" w-full rounded-md bg-green-600 py-2 text-base font-bold text-white active:opacity-80 transition-opacity"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>

            {/* Finish Ride panel */}
            <div
                ref={FinishRidePanelRef}
                className="absolute bottom-0 w-full"
            >
                <FinishRide  />
            </div>



        </div>
    )
}

export default CaptainRiding