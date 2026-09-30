import React, { useRef, useEffect } from "react";
import gsap from "gsap";

export default function WaitingForDriver(props) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!panelRef.current) return;
    gsap.fromTo(
      panelRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }
    );
  }, []);

  return (
    <div className="w-full min-h-screen bg-neutral-100 flex justify-center">
      <div
        ref={panelRef}
        className="w-full max-w-md min-h-screen bg-white flex flex-col px-5 pt-3 pb-6"
      >
        {/* Collapse handle */}
            <button
                type="button"
                onClick={() => { props.setWaitingForDriver(false) }}
                aria-label="Close vehicle panel"
                className="mx-auto mb-3 block h-1.5 w-10 rounded-full bg-gray-300"
            />

        {/* Driver + vehicle */}
        <div className="flex items-center justify-between mt-2 mb-6">
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
              ACDB1234
            </p>
            <p className="text-sm text-gray-500">maruti suzuki alto</p>
          </div>
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
              asdgsgdaga
            </p>
            <p className="text-sm text-gray-500">
              agasgdasgfasdfasfa
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
              sdffsfsfsf
            </p>
            <p className="text-sm text-gray-500">
              asgdasgasgasdg
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
            <p className="font-semibold text-gray-900">₹936</p>
            <p className="text-sm text-gray-500">Cash Cash</p>
          </div>
        </div>
      </div>
    </div>
  );
}