import axios from 'axios'
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import FormField from '../components/FormField'
import CaptainRoamLogo from '../components/CaptainRoamLogo'

const CaptainLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { setCaptain } = useContext(CaptainDataContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/login`,
        { email, password }
      )

      if (response.status === 200) {
        const data = response.data
        setCaptain(data.captain)
        localStorage.setItem('token', data.token)
        navigate('/captain-home')
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Check your email and password.'
      )
      setPassword('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-dvh w-full justify-center overflow-hidden bg-white font-sans">
      <div className="flex h-dvh w-full max-w-md flex-col overflow-hidden bg-white">
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pb-6 pt-7">
          {/* Logo + Captain badge */}
          <div className="flex items-center gap-3">
            <CaptainRoamLogo />
            <div className='h-5'></div>
          </div>

          <h1 className="mt-8 text-[28px] font-extrabold leading-tight tracking-tight text-[#14112E]">
            Welcome back, Captain
          </h1>
          <p className="mt-1.5 text-[15px] font-medium text-[#4B5069]">
            Log in to start accepting rides.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
            <FormField
              label="Email"
              type="email"
              inputMode="email"
              placeholder="email@example.com"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <FormField
              label="Password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex h-14 w-full items-center justify-center rounded-2xl bg-[#2B2F77] text-base font-bold text-white shadow-[0_8px_20px_rgba(43,47,119,0.28)] transition hover:bg-[#3a3fa0] active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </form>

          <div className="my-4 flex items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-[#E3E6F2]" />
            <span className="text-xs font-semibold uppercase tracking-wide text-[#9AA0BA]">
              or
            </span>
            <span className="h-px flex-1 bg-[#E3E6F2]" />
          </div>

          <Link
            to="/user-login"
            className="flex h-14 w-full shrink-0 items-center justify-center gap-2 rounded-2xl border-2 border-[#2B2F77] bg-white text-base font-bold text-[#2B2F77] transition hover:bg-[#F4F5FA] active:scale-[0.98]"
          >
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21a8 8 0 0 1 16 0" />
            </svg>
            Sign in as User
          </Link>

          <p className="mt-4 text-center text-sm font-medium text-[#4B5069]">
            New here?{' '}
            <Link
              to="/captain-register"
              className="font-bold text-[#2B2F77] hover:underline"
            >
              Create new account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default CaptainLogin