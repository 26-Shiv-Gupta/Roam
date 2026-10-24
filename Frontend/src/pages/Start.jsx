import React from 'react'
import { Link } from 'react-router-dom'
import PaginationDots from '../components/Paginationdots'
import { useState, useRef, useEffect } from 'react'
import backgroundImage from '../assets/Roam_background_img.png'
import UserRoamLogo from '../components/UserRoamLogo'

const Start = () => {

  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const touchStartX = useRef(null)

  // Auto-advance: when the active dot finishes filling, go to the next slide
  useEffect(() => {
    if (paused) return
    const t = setTimeout(
      () => setIndex((i) => (i + 1) % slides.length),
      SLIDE_DURATION
    )
    return () => clearTimeout(t)
  }, [index, paused])

  // Swipe left / right to change slide
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    setPaused(true)
  }
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) {
      setIndex((i) =>
        dx < 0 ? (i + 1) % slides.length : (i - 1 + slides.length) % slides.length
      )
    }
    touchStartX.current = null
    setPaused(false)
  }

  const SLIDE_DURATION = 4000

  const slides = [
    {
      title: ['Explore the city,', 'your way.'],
      text: 'Find rides, hidden spots and local favourites, all in one easy app.',
    },
    {
      title: ['Book a ride', 'in seconds.'],
      text: 'Pick your destination, see the fare upfront and get picked up fast.',
    },
    {
      title: ['Travel safe,', 'every time.'],
      text: 'Share your trip live with friends and family, and ride with verified drivers.',
    },
  ]

  return (
    <div className="flex h-dvh w-full justify-center overflow-hidden bg-[#14112E] font-sans">
      {/* Mobile frame: capped width on large screens, full viewport on phones */}
      <div className="relative flex h-dvh w-full max-w-md flex-col overflow-hidden bg-white">
        {/* Logo */}
        <div className="relative min-h-0 flex-1 overflow-hidden bg-[#1E1B4B]">
          <img src={backgroundImage} alt='Background-image' />
          {/* <div className="absolute left-6 top-7">
            <div className={`flex items-center gap-2.5`}>
              <svg
                aria-hidden="true"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="32" height="32" rx="10" fill="#fff" />
                <path
                  d="M16 7L23 11V21L16 25L9 21V11Z"
                  stroke="#2B2F77"
                  strokeWidth="2.4"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-[22px] font-extrabold tracking-tight text-white">
                Roam
              </span>
            </div>
          </div> */}
          <UserRoamLogo className='#fff' />
        </div>

        {/* Bottom sheet */}
        <div className="relative z-10 -mt-8 flex shrink-0 flex-col gap-3.5 overflow-hidden rounded-t-4xl bg-white px-6 pb-8 pt-7">
          <PaginationDots
            total={slides.length}
            active={index}
            duration={SLIDE_DURATION}
            paused={paused}
            onSelect={setIndex}
          />

          {/* Sliding text area */}
          <div
            className="overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            aria-live="polite"
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {slides.map((s, i) => (
                <div
                  key={i}
                  className="flex w-full shrink-0 flex-col gap-3.5"
                  aria-hidden={i !== index}
                >
                  <h1 className="mt-1 text-[30px] font-extrabold leading-[1.15] tracking-tight text-[#14112E]">
                    {s.title[0]}
                    <br />
                    {s.title[1]}
                  </h1>
                  <p className="min-h-17 text-[15px] font-medium leading-relaxed text-[#4B5069]">
                    {s.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/user-login"
            className="mt-2 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#2B2F77] text-base font-bold text-white shadow-[0_8px_20px_rgba(43,47,119,0.28)] transition hover:bg-[#3a3fa0] active:scale-[0.98]"
          >
            Get started
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>

          <p className="text-center text-sm font-medium text-[#4B5069]">
            New here?{' '}
            <Link to="/user-login" className="font-bold text-[#2B2F77] hover:underline">
              Create new account
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default Start