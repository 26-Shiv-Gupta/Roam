import React, { useRef, useEffect, useState } from 'react'
import gsap from 'gsap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function ConfirmRidePopUp(props) {
  const panelRef = useRef(null)
  const navigate = useNavigate()

  const [otp, setOtp] = useState('')
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
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
    )
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
        {
          rideId: props.ride?._id,
          otp,
          captainId: props.captainId,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )

      if (response.status === 200) {
        navigate('/captain-riding', { state: { ride: props.ride } })
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Wrong OTP. Ask the rider and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    props.setConfirmRidePopUpPanel(false);

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/cancel-ride`, {
      rideId: props.ride?._id
    }, {
      headers: {    
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    if (response.status === 200) {
      navigate('/captain-home')
    }
  }

  return (
    <div className="mx-auto flex h-full w-full max-w-md flex-col overflow-hidden bg-white font-sans">
      <div ref={panelRef} className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pb-8 pt-4">
        {/* Top bar */}
        <div className="mb-5 flex items-center gap-3">
          <button
            type="button"
            onClick={() => props.setConfirmRidePopUpPanel(false)}
            aria-label="Back"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F4F5FA] text-[#14112E] transition hover:text-[#2B2F77] active:scale-95"
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
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <h2 className="text-xl font-extrabold tracking-tight text-[#14112E]">
            Start this ride
          </h2>
        </div>

        {/* Rider card */}
        <div className="mb-4 flex items-center justify-between rounded-2xl bg-[#F4F5FA] px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
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

          <div className="text-right">
            <p className="text-xl font-extrabold text-[#14112E]">
              {props.ride?.fare != null ? `₹${props.ride.fare}` : '—'}
            </p>
            <p className="text-xs font-semibold text-[#4B5069]">Cash</p>
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

        {/* OTP */}
        <form onSubmit={handleSubmit} className="mt-auto flex flex-col pt-6">
          <label htmlFor="otp" className="mb-2 text-sm font-bold text-[#14112E]">
            Enter the OTP from the rider
          </label>
          <input
            id="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="• • • • • •"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, ''))
              setError('')
            }}
            aria-invalid={!!error}
            className={`h-14 w-full rounded-2xl border bg-[#F4F5FA] px-4 text-center text-xl font-extrabold tracking-[0.4em] text-[#14112E] outline-none transition placeholder:text-[#9AA0BA] focus:bg-white focus:ring-4 focus:ring-[#2B2F77]/15 ${error ? 'border-red-500' : 'border-transparent focus:border-[#2B2F77]'
              }`}
          />

          {error && (
            <p role="alert" className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!otp || loading}
            className="mt-5 flex h-14 w-full items-center justify-center rounded-2xl bg-[#2B2F77] text-base font-bold text-white shadow-[0_8px_20px_rgba(43,47,119,0.28)] transition hover:bg-[#3a3fa0] active:scale-[0.98] disabled:opacity-50 disabled:shadow-none"
          >
            {loading ? 'Starting…' : 'Start ride'}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="mt-3 flex h-14 w-full items-center justify-center rounded-2xl border-2 border-red-200 bg-white text-base font-bold text-red-600 transition hover:bg-red-50 active:scale-[0.98]"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  )
}