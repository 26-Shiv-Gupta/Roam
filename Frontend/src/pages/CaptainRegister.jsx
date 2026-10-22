import axios from 'axios'
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import CaptainRoamLogo from '../components/CaptainRoamLogo'
import FormField from '../components/FormField'
import SelectField from '../components/SelectField'

const VEHICLE_TYPES = [
  { value: 'car', label: 'Car' },
  { value: 'auto', label: 'Auto' },
  { value: 'moto', label: 'Motorcycle' },
]

const CaptainRegister = () => {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    vechileColor: '',
    vechilePlate: '',
    vechileCapacity: '',
    vechileType: '',
  })
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const { setCaptain } = useContext(CaptainDataContext)
  const navigate = useNavigate()

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setErrors((er) => ({ ...er, [key]: undefined }))
  }

  const validate = () => {
    const er = {}
    if (!form.firstname.trim()) er.firstname = 'Enter your first name'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = 'Enter a valid email'
    if (form.password.length < 6) er.password = 'Use at least 6 characters'
    if (form.confirmPassword !== form.password)
      er.confirmPassword = 'Passwords do not match'
    if (!form.vechileColor.trim()) er.vechileColor = 'Enter color'
    if (!form.vechilePlate.trim()) er.vechilePlate = 'Enter plate'
    if (!form.vechileCapacity || Number(form.vechileCapacity) < 1)
      er.vechileCapacity = 'Min 1'
    if (!form.vechileType) er.vechileType = 'Select type'
    setErrors(er)
    return Object.keys(er).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')
    if (!validate()) return

    const newCaptain = {
      fullname: {
        firstname: form.firstname,
        lastname: form.lastname,
      },
      email: form.email,
      password: form.password,
      vechile: {
        color: form.vechileColor,
        plate: form.vechilePlate,
        capacity: form.vechileCapacity,
        vechileType: form.vechileType,
      },
    }

    setLoading(true)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/register`,
        newCaptain
      )

      if (response.status === 201) {
        const data = response.data
        setCaptain(data.captain)
        localStorage.setItem('token', data.token)
        navigate('/captain-home')
      }
    } catch (err) {
      setServerError(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.msg ||
          'Could not create your account. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-dvh w-full justify-center overflow-hidden bg-white font-sans">
      <div className="flex h-dvh w-full max-w-md flex-col overflow-hidden bg-white">
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-7">
          <CaptainRoamLogo />

          <h1 className="mt-8 text-[28px] font-extrabold leading-tight tracking-tight text-[#14112E]">
            Become a Captain
          </h1>
          <p className="mt-1.5 text-[15px] font-medium text-[#4B5069]">
            Create your account and start earning with Roam.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-7 flex flex-col">
            <div className="flex flex-col gap-4">
              {/* Personal */}
              <div className="flex gap-3">
                <FormField
                  label="First name"
                  className="flex-1"
                  placeholder="First name"
                  autoComplete="given-name"
                  value={form.firstname}
                  onChange={update('firstname')}
                  error={errors.firstname}
                />
                <FormField
                  label="Last name"
                  className="flex-1"
                  placeholder="Last name"
                  autoComplete="family-name"
                  value={form.lastname}
                  onChange={update('lastname')}
                />
              </div>

              <FormField
                label="Email"
                type="email"
                inputMode="email"
                placeholder="email@example.com"
                autoComplete="email"
                value={form.email}
                onChange={update('email')}
                error={errors.email}
              />

              <FormField
                label="Password"
                type="password"
                placeholder="Create a password"
                autoComplete="new-password"
                value={form.password}
                onChange={update('password')}
                error={errors.password}
              />

              <FormField
                label="Confirm password"
                type="password"
                placeholder="Re-enter your password"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={update('confirmPassword')}
                error={errors.confirmPassword}
              />

              {/* Vehicle */}
              <h2 className="mt-2 border-t border-[#E3E6F2] pt-5 text-base font-extrabold text-[#14112E]">
                Vehicle details
              </h2>

              <div className="flex gap-3">
                <FormField
                  label="Color"
                  className="flex-1"
                  placeholder="e.g. White"
                  value={form.vechileColor}
                  onChange={update('vechileColor')}
                  error={errors.vechileColor}
                />
                <FormField
                  label="Plate"
                  className="flex-1"
                  placeholder="e.g. MH 12 AB 1234"
                  value={form.vechilePlate}
                  onChange={update('vechilePlate')}
                  error={errors.vechilePlate}
                />
              </div>

              <div className="flex gap-3">
                <FormField
                  label="Capacity"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  className="flex-1"
                  placeholder="Seats"
                  value={form.vechileCapacity}
                  onChange={update('vechileCapacity')}
                  error={errors.vechileCapacity}
                />
                <SelectField
                  label="Vehicle type"
                  className="flex-1"
                  placeholder="Select"
                  options={VEHICLE_TYPES}
                  value={form.vechileType}
                  onChange={update('vechileType')}
                  error={errors.vechileType}
                />
              </div>
            </div>

            {serverError && (
              <p
                role="alert"
                className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
              >
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex h-14 w-full items-center justify-center rounded-2xl bg-[#2B2F77] text-base font-bold text-white shadow-[0_8px_20px_rgba(43,47,119,0.28)] transition hover:bg-[#3a3fa0] active:scale-[0.98] disabled:opacity-60"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>

            <div className="my-4 flex items-center gap-3" aria-hidden="true">
              <span className="h-px flex-1 bg-[#E3E6F2]" />
              <span className="text-xs font-semibold uppercase tracking-wide text-[#9AA0BA]">
                or
              </span>
              <span className="h-px flex-1 bg-[#E3E6F2]" />
            </div>

            <Link
              to="/user-register"
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#2B2F77] bg-white text-base font-bold text-[#2B2F77] transition hover:bg-[#F4F5FA] active:scale-[0.98]"
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
              Sign up as User
            </Link>

            <p className="mt-4 text-center text-sm font-medium text-[#4B5069]">
              Already have an account?{' '}
              <Link
                to="/captain-login"
                className="font-bold text-[#2B2F77] hover:underline"
              >
                Login here
              </Link>
            </p>
          </form>

          <p className="mt-8 text-[11px] leading-relaxed text-[#6B7190]">
            By proceeding, you consent to get calls, WhatsApp or SMS messages,
            including by automated means, from Roam and its affiliates to the
            number provided.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CaptainRegister