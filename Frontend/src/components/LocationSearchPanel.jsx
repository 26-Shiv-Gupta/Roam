import React, { useRef, useEffect } from "react";
import gsap from "gsap";

const sampleAddresses = [
  "24B, Near Kapoor's cafe, Sheryians Coding School, Bhopal",
  "22C, Near Malholtra's cafe, Sheryians Coding School, Bhopal",
  "20B, Near Singhai's cafe, Sheryians Coding School, Bhopal",
  "18A, Near Sharma's cafe, Sheryians Coding School, Bhopal",
];

export default function LocationSearchPanel({ onSelectAddress }) {
  const listRef = useRef(null);

  // Fade + slide the list in each time the panel becomes visible
  useEffect(() => {
    if (!listRef.current) return;
    gsap.fromTo(
      listRef.current.children,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: "power2.out" }
    );
  }, []);

  return (
    <div ref={listRef} className="mt-4 flex flex-col divide-y divide-gray-100 overflow-y-auto">
      {sampleAddresses.map((address, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelectAddress(address)}
          className="flex items-start gap-3 py-3 text-left active:bg-gray-50"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className="mt-0.5 flex-shrink-0 text-gray-500"
          >
            <path
              d="M12 21s-7-6.5-7-11a7 7 0 1114 0c0 4.5-7 11-7 11z"
              stroke="currentColor"
              strokeWidth="1.6"
            />
            <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.6" />
          </svg>
          <span className="text-sm text-gray-900 leading-snug">{address}</span>
        </button>
      ))}
    </div>
  );
}