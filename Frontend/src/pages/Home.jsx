import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VechilePanel from "../components/VechilePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForRide from "../components/LookingForRide";
import WaitingForDriver from "../components/WaitingForDriver";

export default function Home() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const [confirmRidePanelOpen, setConfirmRidePanelOpen] = useState(false);
  const [vechileFound, setVechileFound] = useState(false)
  const [waitingForDriver, setWaitingForDriver] = useState(false)

  const mapRef = useRef(null);
  const panelRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const confirmRidePanelRef = useRef(null);
  const vechileFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);

  // Map shrinks / Find-a-trip panel grows when the user starts searching
  useEffect(() => {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: "100%",
        borderRadius: 0,
        duration: 0.45,
        ease: "power2.out",
      });
    } else {
      gsap.to(panelRef.current, {
        height: "auto",
        borderTopLeftRadius: "20px",
        borderTopRightRadius: "20px",
        duration: 0.35,
        ease: "power2.inOut",
      });
    }
  }, [panelOpen]);

  // Vehicle panel slides up from the bottom over everything else
  useEffect(() => {
    if (!vehiclePanelRef.current) return;
    gsap.to(vehiclePanelRef.current, {
      yPercent: vehiclePanelOpen ? 0 : 100,
      duration: 0.45,
      ease: "power3.out",
    });
  }, [vehiclePanelOpen]);

  // Confirm Ride panel slides up from the bottom over everything else
  useEffect(() => {
    if (!confirmRidePanelRef.current) return;
    gsap.to(confirmRidePanelRef.current, {
      yPercent: confirmRidePanelOpen ? 0 : 100,
      duration: 0.45,
      ease: "power3.out",
    });
  }, [confirmRidePanelOpen]);

  // Vechile Found panel slides up from the bottom over everything else
  useEffect(() => {
    if (!vechileFoundRef.current) return;
    gsap.to(vechileFoundRef.current, {
      yPercent: vechileFound ? 0 : 100,
      duration: 0.45,
      ease: "power3.out",
    });
  }, [vechileFound]);

  // Vechile Found panel slides up from the bottom over everything else
  useEffect(() => {
    if (!waitingForDriverRef.current) return;
    gsap.to(waitingForDriverRef.current, {
      yPercent: waitingForDriver ? 0 : 100,
      duration: 0.45,
      ease: "power3.out",
    });
  }, [waitingForDriver]);

  const handleSelectAddress = (address) => {
    setDestination(address);
    setPanelOpen(false);
    setVehiclePanelOpen(true);
  };

  return (
    <div className="relative w-full h-screen bg-neutral-100 overflow-hidden">

      {/* Map and Logo section */}
      <div className="bg-cover">
        <img
          src="https://media.wired.com/photos/59269cd37034dc5f91bec0f1/3:2/w_2560%2Cc_limit/GoogleMapTA.jpg"
          className="h-screen w-full object-cover"
        />
        <div className="absolute top-5 left-5 text-2xl font-bold text-gray-900">
          <div className="flex items-center gap-2 mb-8">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" fill="black" />
              <circle cx="12" cy="12" r="3.2" fill="white" />
            </svg>
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              Roam
            </span>
          </div>
        </div>
      </div>

      {/* Find a trip / search panel */}
      <div
        ref={panelRef}
        className="absolute bottom-0 left-0 w-full bg-white px-5 pt-5 pb-6 rounded-t-2xl shadow-[0_-4px_12px_rgba(0,0,0,0.06)] overflow-hidden"
      >
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Find a trip</h2>
            {panelOpen && (
              <button
                type="button"
                onClick={() => setPanelOpen(false)}
                aria-label="Collapse panel"
                className="text-gray-500"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>

          <div className="w-1 h-15 absolute bg-black top-[45%] left-[5%] rounded-2xl"></div>

          <input
            type="text"
            placeholder="Add a pick-up location"
            value={pickup}
            onFocus={() => setPanelOpen(true)}
            onChange={(e) => setPickup(e.target.value)}
            className="w-full rounded-md bg-neutral-100 pl-8 pr-3 py-3 text-base text-gray-900 placeholder-gray-400 outline-none mb-3"
          />
          <input
            type="text"
            placeholder="Enter your destination"
            value={destination}
            onFocus={() => setPanelOpen(true)}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full rounded-md border border-transparent bg-neutral-100 pl-8 pr-3 py-3 text-base text-gray-900 placeholder-gray-400 outline-none"
          />
        </div>

        {panelOpen && (
          <LocationSearchPanel onSelectAddress={handleSelectAddress} />
        )}
      </div>

      {/* Vehicle panel */}
      <div
        ref={vehiclePanelRef}
        className="absolute bottom-0"
      >
        <VechilePanel setVehiclePanelOpen={setVehiclePanelOpen} setConfirmRidePanelOpen={setConfirmRidePanelOpen} />
      </div>

      {/* Confirm Ride panel */}
      <div
        ref={confirmRidePanelRef} 
        className="absolute bottom-0 w-full"
      >
        <ConfirmRide setConfirmRidePanelOpen={setConfirmRidePanelOpen} setVechileFound={setVechileFound} />
      </div>

      {/* Confirm Ride panel */}
      <div
        ref={vechileFoundRef} 
        className="absolute bottom-0 w-full"
      >
        <LookingForRide setVechileFound={setVechileFound}/>
      </div>

      {/* Waiting for ride panel */}
      <div
        ref={waitingForDriverRef} 
        className="absolute bottom-0 w-full"
      >
        <WaitingForDriver setWaitingForDriver={setWaitingForDriver} />
      </div>

    </div>
  );
}