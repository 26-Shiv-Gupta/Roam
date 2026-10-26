import React, { useRef, useState, useEffect, useContext } from 'react'
import gsap from 'gsap'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import RidePopUp from '../components/RidePopUp'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import LiveLocationMap from '../components/LiveLocationMap'
import CaptainRoamLogo from '../components/CaptainRoamLogo'
import { SocketContext } from '../context/SocketContext'
import { CaptainDataContext } from '../context/CaptainContext'

const ICON = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const stats = [
  {
    label: 'Hours online',
    value: '10.2',
    icon: (
      <svg {...ICON}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </svg>
    ),
  },
  {
    label: 'Distance (km)',
    value: '10.2',
    icon: (
      <svg {...ICON}>
        <path d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
        <path d="M12 12l4-3M8 16l1-1M16 16l-1-1M6 12h1M17 12h1" />
      </svg>
    ),
  },
  {
    label: 'Total jobs',
    value: '10',
    icon: (
      <svg {...ICON}>
        <rect x="5" y="3" width="14" height="18" rx="2" />
        <path d="M9 8h6M9 12h6M9 16h3" />
      </svg>
    ),
  },
]

const CaptainHome = ({
  captainName = 'Harsh Patel',
  captainAvatar = 'j',
  earnings = '295.20',
}) => {
  const [RidePopUpPanel, setRidePopUpPanel] = useState(false)
  const [confirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false)
  const [ride, setRide] = useState(null)

  const RidePopUpRef = useRef(null)
  const ConfirmRidePopUpRef = useRef(null)

  const { socket } = useContext(SocketContext)
  const { captain } = useContext(CaptainDataContext)
  const navigate = useNavigate()

  useEffect(() => {
    socket.emit('join', { userType: 'captain', userId: captain._id })
  }, [socket, captain?._id])

  // Send the captain's location every 10s (and stop when leaving the page)
  useEffect(() => {
    const updateLocation = () => {
      if (!navigator.geolocation) return
      navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('update-location-captain', {
          userId: captain._id,
          location: {
            ltd: position.coords.latitude,
            lng: position.coords.longitude,
          },
        })
      })
    }

    updateLocation()
    const id = setInterval(updateLocation, 10000)
    return () => clearInterval(id)
  }, [socket, captain?._id])

  // Listen for new rides once, and clean up
  useEffect(() => {
    const onNewRide = (data) => {
      setRide(data)
      setRidePopUpPanel(true)
    }
    const onCancelled = () => {
      navigate('/captain-home')
    }
    socket.on('new-ride', onNewRide)
    return () => {
      socket.off('new-ride', onNewRide)
      socket.off('ride-cancelled', onCancelled)
    }
  }, [socket])

  // Popups slide up from the bottom over everything else
  const slide = (ref, open) => {
    if (!ref.current) return
    gsap.to(ref.current, {
      yPercent: open ? 0 : 100,
      duration: 0.45,
      ease: 'power3.out',
    })
  }
  useEffect(() => slide(ConfirmRidePopUpRef, confirmRidePopUpPanel), [confirmRidePopUpPanel])
  useEffect(() => slide(RidePopUpRef, RidePopUpPanel), [RidePopUpPanel])

  const confirmRide = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/confirm-ride`,
        { rideId: ride._id, captainId: captain._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      setConfirmRidePopUpPanel(true)
    } catch (error) {
      console.error('Could not confirm ride:', error)
    }
  }

  socket.on('cancel-ride', () => {
    navigate('/captain-home')
  })

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#F4F5FA] font-sans">
      {/* Map */}
      <LiveLocationMap />

      {/* Logo chip */}
      <div className="absolute left-4 top-4 z-10 rounded-2xl bg-white px-3 py-2 shadow-[0_6px_20px_rgba(20,17,46,0.15)]">
        <CaptainRoamLogo />
      </div>

      {/* Logout */}
      <button
        type="button"
        onClick={() => navigate('/captain-logout')}
        aria-label="Logout"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#14112E] shadow-[0_6px_20px_rgba(20,17,46,0.15)] transition hover:text-[#2B2F77] active:scale-95"
      >
        <svg
          aria-hidden="true"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 4H6a2 2 0 00-2 2v12a2 2 0 002 2h3M16 16l4-4-4-4M20 12H9" />
        </svg>
      </button>

      {/* Captain summary sheet */}
      <div className="absolute bottom-0 left-0 w-full rounded-t-4xl bg-white px-6 pb-7 pt-6 shadow-[0_-8px_30px_rgba(20,17,46,0.12)]">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <img
              src='https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=200&q=80'
              alt='Profile image'
              className="h-12 w-12 shrink-0 rounded-full border-2 border-white object-cover shadow-[0_0_0_2px_#16a34a]"
            />
            <div className="min-w-0">
              <p className="truncate text-base font-extrabold text-[#14112E]">{captain.fullname.firstname + " " + captain.fullname.lastname}</p>
              <p className="flex items-center gap-1.5 text-xs font-semibold text-green-700">
                <span className="h-2 w-2 rounded-full bg-green-600" />
                Online
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-2xl font-extrabold tracking-tight text-[#14112E]">₹{earnings}</p>
            <p className="text-xs font-semibold text-[#4B5069]">Earned today</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col items-center gap-1.5 rounded-2xl bg-[#F4F5FA] px-2 py-4 text-center"
            >
              <span className="text-[#2B2F77]">{s.icon}</span>
              <p className="text-lg font-extrabold text-[#14112E]">{s.value}</p>
              <p className="text-xs font-semibold leading-tight text-[#4B5069]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ride popup panel */}
      <div ref={RidePopUpRef} className="absolute bottom-0 w-full">
        <RidePopUp
          ride={ride}
          setRidePopUpPanel={setRidePopUpPanel}
          confirmRide={confirmRide}
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
        />
      </div>

      {/* Confirm ride popup panel */}
      <div ref={ConfirmRidePopUpRef} className="absolute bottom-0 h-dvh w-full bg-white">
        <ConfirmRidePopUp
          ride={ride}
          captainId={captain?._id}
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
        />
      </div>
    </div>
  )
}

export default CaptainHome