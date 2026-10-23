import React, { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function FinishRide(props) {
  const panelRef = useRef(null)
  const navigate = useNavigate()

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const first = props.ride?.user?.fullname?.firstname || ''
  const last = props.ride?.user?.fullname?.lastname || ''
  const riderName = `${first} ${last}`.trim() || 'Rider'
  const initials = ((first[0] || '') + (last[0] || '')).toUpperCase() || 'R'

  useEffect(() => {
    if (!panelRef.current) return
    gsap.fromTo(
      panelRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
    )
  }, [])

  const handleCompleteRide = async () => {
    setError('')
    setLoading(true)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/finish-ride`,
        { rideId: props.ride?._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )

      if (response.status === 200) {
        navigate('/captain-home')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not complete the ride. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div
        ref={panelRef}
        className="w-full rounded-t-[32px] bg-white px-6 pb-8 pt-2 font-sans shadow-[0_-8px_30px_rgba(20,17,46,0.12)]"
      >
        {/* Handle (tap to close, when the parent allows it) */}
        {props.onClose ? (
          <button
            type="button"
            onClick={props.onClose}
            aria-label="Close finish ride panel"
            className="group mx-auto flex h-8 w-16 items-center justify-center"
          >
            <span className="h-1.5 w-10 rounded-full bg-[#CBD0E6] transition group-hover:bg-[#9AA0BA]" />
          </button>
        ) : (
          <div className="h-4" />
        )}

        <h2 className="mb-4 text-xl font-extrabold tracking-tight text-[#14112E]">
          Finish this ride
        </h2>

        {/* Rider card */}
        <div className="mb-4 flex items-center gap-3 rounded-2xl bg-[#F4F5FA] px-4 py-3">
          <span
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#2B2F77] text-sm font-extrabold text-white"
          >
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate font-bold text-[#14112E]">{riderName}</p>
            <p className="text-xs font-semibold text-[#4B5069]">Rider</p>
          </div>
        </div>

        {/* Route */}
        <div className="relative flex flex-col gap-1">
          <span
            aria-hidden="true"
            className="absolute left-[9px] top-8 h-[calc(100%-4rem)] w-0.5 rounded-full bg-[#CBD0E6]"
          />

          <div className="flex items-start gap-3 py-2.5">
            <span
              aria-hidden="true"
              className="mt-1 h-5 w-5 shrink-0 rounded-full border-[5px] border-[#2B2F77] bg-white"
            />
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-[#9AA0BA]">Pick-up</p>
              <p className="font-semibold leading-snug text-[#14112E]">{props.ride?.pickup}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 py-2.5">
            <span aria-hidden="true" className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center">
              <span className="h-3.5 w-3.5 rounded-[4px] bg-[#C2410C]" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-[#9AA0BA]">Destination</p>
              <p className="font-semibold leading-snug text-[#14112E]">{props.ride?.destination}</p>
            </div>
          </div>
        </div>

        {/* Cash to collect */}
        <div className="mt-2 flex items-center justify-between rounded-2xl border-2 border-[#2B2F77] bg-[#2B2F77]/5 px-4 py-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#2B2F77]">Collect in cash</p>
            <p className="text-xs font-medium text-[#4B5069]">Before completing the ride</p>
          </div>
          <span className="text-2xl font-extrabold text-[#14112E]">
            {props.ride?.fare != null ? `₹${props.ride.fare}` : '—'}
          </span>
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleCompleteRide}
          disabled={loading}
          className="mt-5 flex h-14 w-full items-center justify-center rounded-2xl bg-[#2B2F77] text-base font-bold text-white shadow-[0_8px_20px_rgba(43,47,119,0.28)] transition hover:bg-[#3a3fa0] active:scale-[0.98] disabled:opacity-60"
        >
          {loading ? 'Completing…' : 'Complete ride'}
        </button>
      </div>
    </div>
  )
}