import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'

const Start = () => {

  return (
    <div className="w-full min-h-screen bg-black flex justify-center">
      {/* Mobile frame: caps width on larger screens, fills viewport on phones */}
      <div className="relative w-full max-w-md min-h-screen bg-white flex flex-col overflow-hidden">
        {/* Hero image section */}
        <div className="relative flex-3 min-h-[60vh]">
          <img
            src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=80"
            alt="City street scene"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* subtle top-to-bottom gradient so the logo stays readable */}
          <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/0 to-black/10" />
 
          {/* Logo */}
          <div className="absolute top-6 left-5 flex items-center gap-2">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2L2 7v10l10 5 10-5V7L12 2z"
                fill="white"
              />
              <circle cx="12" cy="12" r="3.2" fill="black" />
            </svg>
            <span className="text-white text-xl font-semibold tracking-tight">
              Roam
            </span>
          </div>
        </div>
 
        {/* Bottom content section */}
        <div className="flex flex-col px-5 pt-6 pb-8 bg-white">
          <h1 className="text-[28px] leading-tight font-bold text-gray-900">
            Get started with Roam
          </h1>
 
          <Link
            to='/user-login'
            className="mt-6 flex items-center justify-center w-full bg-black text-white text-base font-medium rounded-sm py-4 active:opacity-80 transition-opacity"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Start