import React, { useState, useRef, useEffect, useContext } from 'react'
import gsap from 'gsap'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import LocationSearchPanel from '../components/LocationSearchPanel'
import VechilePanel from '../components/VechilePanel'
import ConfirmRide from '../components/ConfirmRide'
import LookingForRide from '../components/LookingForRide'
import WaitingForDriver from '../components/WaitingForDriver'
import LiveLocationMap from '../components/LiveLocationMap'
import UserRoamLogo from '../components/UserRoamLogo'
import { SocketContext } from '../context/SocketContext'
import { UserDataContext } from '../context/UserContext'

export default function Home() {
  const [activeField, setActiveField] = useState(null)
  const [pickup, setPickup] = useState('')
  const [pickupSuggestions, setPickupSuggestions] = useState([])
  const [destination, setDestination] = useState('')
  const [destinationSuggestions, setDestinationSuggestions] = useState([])
  const [panelOpen, setPanelOpen] = useState(false)
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false)
  const [confirmRidePanelOpen, setConfirmRidePanelOpen] = useState(false)
  const [fare, setFare] = useState(0)
  const [vechileFound, setVechileFound] = useState(false)
  const [waitingForDriver, setWaitingForDriver] = useState(false)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [ride, setRide] = useState(null)
  const [finding, setFinding] = useState(false)

  const panelRef = useRef(null)
  const vehiclePanelRef = useRef(null)
  const confirmRidePanelRef = useRef(null)
  const vechileFoundRef = useRef(null)
  const waitingForDriverRef = useRef(null)

  const { user } = useContext(UserDataContext)
  const { socket } = useContext(SocketContext)
  const navigate = useNavigate()

  useEffect(() => {
    socket.emit('join', { userType: 'user', userId: user._id })
  }, [user])

  // Register socket listeners once (and clean up), not on every render
  useEffect(() => {
    const onConfirmed = (data) => {
      setWaitingForDriver(true)
      setVechileFound(false)
      setRide(data)
    }
    const onStarted = (ride) => navigate('/riding', { state: { ride } })
    const onEnded = () => navigate('/home')

    socket.on('ride-confirmed', onConfirmed)
    socket.on('ride-started', onStarted)
    socket.on('ride-ended', onEnded)

    return () => {
      socket.off('ride-confirmed', onConfirmed)
      socket.off('ride-started', onStarted)
      socket.off('ride-ended', onEnded)
    }
  }, [socket, navigate])

  // Search panel grows to full height while the user is typing
  useEffect(() => {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: '100%',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        duration: 0.45,
        ease: 'power2.out',
      })
    } else {
      gsap.to(panelRef.current, {
        height: 'auto',
        borderTopLeftRadius: '32px',
        borderTopRightRadius: '32px',
        duration: 0.35,
        ease: 'power2.inOut',
      })
    }
  }, [panelOpen])

  // Bottom panels slide up over everything else
  const slide = (ref, open) => {
    if (!ref.current) return
    gsap.to(ref.current, {
      yPercent: open ? 0 : 100,
      duration: 0.45,
      ease: 'power3.out',
    })
  }
  useEffect(() => slide(vehiclePanelRef, vehiclePanelOpen), [vehiclePanelOpen])
  useEffect(() => slide(confirmRidePanelRef, confirmRidePanelOpen), [confirmRidePanelOpen])
  useEffect(() => slide(vechileFoundRef, vechileFound), [vechileFound])
  useEffect(() => slide(waitingForDriverRef, waitingForDriver), [waitingForDriver])

  const fetchSuggestions = async (value, setter) => {
    try {
      if (value.length < 3) {
        setter([])
        return
      }
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { address: value },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      )
      setter(response.data)
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    }
  }

  const handlePickupChange = (e) => {
    setPickup(e.target.value)
    fetchSuggestions(e.target.value, setPickupSuggestions)
  }

  const handleDestinationChange = (e) => {
    setDestination(e.target.value)
    fetchSuggestions(e.target.value, setDestinationSuggestions)
  }

  const handleFindRide = async () => {
    if (!pickup || !destination) return

    setFinding(true)
    setPanelOpen(false)
    setVehiclePanelOpen(true)

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
        {
          params: { pickup, destination },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      )
      setFare(response.data)
    } catch (error) {
      console.error('Error fetching fare:', error)
      setVehiclePanelOpen(false)
    } finally {
      setFinding(false)
    }
  }

  const inputClass =
    'h-14 w-full rounded-2xl border border-transparent bg-[#F4F5FA] pl-11 pr-4 text-[15px] font-medium text-[#14112E] outline-none transition placeholder:text-[#9AA0BA] focus:border-[#2B2F77] focus:bg-white focus:ring-4 focus:ring-[#2B2F77]/15'

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#F4F5FA] font-sans">
      {/* Map */}
      <LiveLocationMap />

      {/* Logo chip, readable on top of any map */}
      <UserRoamLogo />

      {/* Find a trip panel */}
      <div
        ref={panelRef}
        className="absolute bottom-0 left-0 w-full overflow-hidden rounded-t-4xl bg-white px-6 pb-6 pt-6 shadow-[0_-8px_30px_rgba(20,17,46,0.12)]"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold tracking-tight text-[#14112E]">
            Find a trip
          </h2>
          {panelOpen && (
            <button
              type="button"
              onClick={() => setPanelOpen(false)}
              aria-label="Collapse panel"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F4F5FA] text-[#4B5069] hover:text-[#2B2F77]"
            >
              <svg
                aria-hidden="true"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          )}
        </div>

        <div className="relative flex flex-col gap-3">
          {/* Route markers: pick-up dot, line, destination square */}
          <span
            aria-hidden="true"
            className="absolute left-4.5 top-5.5 h-3 w-3 rounded-full border-[3px] border-[#2B2F77] bg-white"
          />
          <span
            aria-hidden="true"
            className="absolute left-5.75 top-[38px] h-[50px] w-0.5 rounded-full bg-[#CBD0E6]"
          />
          <span
            aria-hidden="true"
            className="absolute left-[18px] top-[90px] h-3 w-3 rounded-[3px] bg-[#C2410C]"
          />

          <input
            type="text"
            aria-label="Pick-up location"
            placeholder="Add a pick-up location"
            value={pickup}
            onClick={() => setActiveField('pickup')}
            onFocus={() => setPanelOpen(true)}
            onChange={handlePickupChange}
            className={inputClass}
          />
          <input
            type="text"
            aria-label="Destination"
            placeholder="Enter your destination"
            value={destination}
            onClick={() => setActiveField('destination')}
            onFocus={() => setPanelOpen(true)}
            onChange={handleDestinationChange}
            className={inputClass}
          />
        </div>

        <button
          type="button"
          onClick={handleFindRide}
          disabled={!pickup || !destination || finding}
          className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#2B2F77] text-base font-bold text-white shadow-[0_8px_20px_rgba(43,47,119,0.28)] transition hover:bg-[#3a3fa0] active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
        >
          {finding ? 'Finding rides…' : 'Find ride'}
        </button>

        {panelOpen && (
          <LocationSearchPanel
            suggestions={
              activeField === 'pickup' ? pickupSuggestions : destinationSuggestions
            }
            activeField={activeField}
            setPickup={setPickup}
            setDestination={setDestination}
          />
        )}
      </div>

      {/* Vehicle panel */}
      <div ref={vehiclePanelRef} className="absolute bottom-0 w-full">
        <VechilePanel
          setVehiclePanelOpen={setVehiclePanelOpen}
          setConfirmRidePanelOpen={setConfirmRidePanelOpen}
          fare={fare}
          setSelectedVehicle={setSelectedVehicle}
        />
      </div>

      {/* Confirm ride panel */}
      <div ref={confirmRidePanelRef} className="absolute bottom-0 w-full">
        <ConfirmRide
          setConfirmRidePanelOpen={setConfirmRidePanelOpen}
          setVechileFound={setVechileFound}
          pickup={pickup}
          destination={destination}
          selectedVehicle={selectedVehicle}
          fare={fare}
        />
      </div>

      {/* Looking for ride panel */}
      <div ref={vechileFoundRef} className="absolute bottom-0 w-full">
        <LookingForRide
          setVechileFound={setVechileFound}
          pickup={pickup}
          destination={destination}
          selectedVehicle={selectedVehicle}
          fare={fare}
        />
      </div>

      {/* Waiting for driver panel */}
      <div ref={waitingForDriverRef} className="absolute bottom-0 w-full">
        <WaitingForDriver ride={ride} setWaitingForDriver={setWaitingForDriver} />
      </div>
    </div>
  )
}