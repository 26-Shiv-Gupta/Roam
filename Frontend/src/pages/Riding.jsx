import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { Link } from "react-router-dom";

export default function Riding(props) {
    const panelRef = useRef(null);
    const mapRef = useRef(null);

    useEffect(() => {
        if (!panelRef.current) return;
        gsap.fromTo(
            panelRef.current,
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }
        );
    }, []);

    return (
        <div className="relative w-full h-screen bg-neutral-100 overflow-hidden">
            <div ref={mapRef} className="bg-cover">
                <img
                    src="https://media.wired.com/photos/59269cd37034dc5f91bec0f1/3:2/w_2560%2Cc_limit/GoogleMapTA.jpg"
                    className="h-screen w-full object-cover"
                />
                <Link to='/home' className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M3 12l9-9 9 9M5 10v9a1 1 0 001 1h4v-6h4v6h4a1 1 0 001-1v-9"
                            stroke="#111827"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </Link>
            </div>

            <div ref={panelRef} className="absolute bottom-0 w-full">
                <div className="bg-white rounded-t-2xl shadow-[0_-4px_16px_rgba(0,0,0,0.08)] px-5 pt-3 pb-10 max-w-md mx-auto">

                    {/* Driver + vehicle */}
                    <div className="flex items-center justify-between mb-5">
                        <svg width="88" height="52" viewBox="0 0 130 70" fill="none">
                            <ellipse cx="65" cy="60" rx="45" ry="5" fill="#f3f4f6" />
                            <path
                                d="M18 44l6-16a8 8 0 017.4-5h47.2a8 8 0 017.4 5l6 16"
                                fill="white"
                                stroke="#111827"
                                strokeWidth="1.6"
                            />
                            <path
                                d="M14 44h102v6a3 3 0 01-3 3H17a3 3 0 01-3-3v-6z"
                                fill="#111827"
                            />
                            <rect x="30" y="26" width="70" height="14" rx="4" fill="#e5e7eb" />
                            <circle cx="34" cy="53" r="7" fill="#111827" />
                            <circle cx="34" cy="53" r="3" fill="white" />
                            <circle cx="96" cy="53" r="7" fill="#111827" />
                            <circle cx="96" cy="53" r="3" fill="white" />
                        </svg>

                        <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">shiv gupta</p>
                            <p className="text-lg font-extrabold tracking-wide text-gray-900">
                                ABCD!@#$
                            </p>
                            <p className="text-sm text-gray-500">Maruti suzuki alto</p>
                        </div>
                    </div>

                    {/* Destination */}
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
                                sfsfsfsfsdf
                            </p>
                            <p className="text-sm text-gray-500">
                                sgsdgasgasdfd
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
                            <p className="font-semibold text-gray-900">₹654</p>
                            <p className="text-sm text-gray-500">Cash Cash</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={props.onMakePayment}
                        className="mt-4 w-full rounded-md bg-green-600 py-3.5 text-base font-bold text-white active:opacity-80 transition-opacity"
                    >
                        Make a Payment
                    </button>
                </div>
            </div>
        </div>
    );
}