import axios from 'axios'
import React, { useContext, useRef, useState } from 'react'
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

// Indian number plate:  SS DD LLL NNNN   e.g. MH 12 AB 1234
//   SS  = state code (2 letters)      DD   = RTO district (2 digits)
//   LLL = series (1-3 letters)        NNNN = number (4 digits, 0001-9999)
const PLATE_REGEX = /^[A-Z]{2}\d{2}[A-Z]{1,3}\d{4}$/
const PLATE_GROUPS = [
  { re: /[A-Z]/, min: 2, max: 2 },
  { re: /\d/, min: 2, max: 2 },
  { re: /[A-Z]/, min: 1, max: 3 },
  { re: /\d/, min: 4, max: 4 },
]

// Uppercases, drops anything invalid for the position, and adds the spaces
// as the user types:  "mh12ab1234" -> "MH 12 AB 1234"
const formatPlate = (raw) => {
  const chars = raw.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const groups = ['', '', '', '']
  let g = 0

  for (const ch of chars) {
    while (g < 4) {
      const part = PLATE_GROUPS[g]
      if (part.re.test(ch) && groups[g].length < part.max) {
        groups[g] += ch
        break
      }
      // move on to the next group only once this one is complete enough
      if (groups[g].length >= part.min && g < 3) g++
      else break
    }
  }

  return groups.filter(Boolean).join(' ')
}

const LETTERS_ONLY = /^[\p{L}\s.'-]+$/u
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Every field is required. Each rule returns an error message, or '' if valid.
const nameRule = (label) => (v, form) => {
  const s = v.trim()
  if (!s) return `Enter your ${label}`
  if (s.length < 3) return `${cap(label)} must be at least 3 characters`
  if (!LETTERS_ONLY.test(s)) return 'Use letters only'
  return ''
}
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

const RULES = {
  firstname: nameRule('first name'),
  lastname: nameRule('last name'),
  email: (v) => {
    const s = v.trim()
    if (!s) return 'Enter your email'
    if (!EMAIL.test(s)) return 'Enter a valid email'
    return ''
  },
  password: (v) => {
    if (!v) return 'Create a password'
    if (v.length < 8) return 'Password must be at least 8 characters'
    return ''
  },
  confirmPassword: (v, form) => {
    if (!v) return 'Re-enter your password'
    if (v !== form.password) return 'Passwords do not match'
    return ''
  },
  vechileColor: (v) => {
    const s = v.trim()
    if (!s) return 'Enter the vehicle color'
    if (!LETTERS_ONLY.test(s)) return 'Use letters only'
    return ''
  },
  vechilePlate: (v) => {
    const compact = v.replace(/\s/g, '')
    if (!compact) return 'Enter the number plate'
    if (!PLATE_REGEX.test(compact)) return 'Use the format MH 12 AB 1234'
    if (compact.endsWith('0000')) return 'Plate number cannot be 0000'
    return ''
  },
  vechileCapacity: (v) => {
    if (v === '') return 'Enter the seat count'
    const n = Number(v)
    if (!Number.isInteger(n)) return 'Enter a whole number'
    if (n < 1) return 'Minimum 1 seat'
    if (n > 10) return 'Maximum 10 seats'
    return ''
  },
  vechileType: (v) => (v ? '' : 'Select a vehicle type'),
}

// Backend validation field names -> our form field names
const SERVER_FIELD_MAP = {
  'fullname.firstname': 'firstname',
  'fullname.lastname': 'lastname',
  email: 'email',
  password: 'password',
  'vechile.color': 'vechileColor',
  'vechile.plate': 'vechilePlate',
  'vechile.capacity': 'vechileCapacity',
  'vechile.vechileType': 'vechileType',
}

const INITIAL_FORM = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  confirmPassword: '',
  vechileColor: '',
  vechilePlate: '',
  vechileCapacity: '',
  vechileType: '',
}

const CaptainRegister = () => {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const formRef = useRef(null)
  const { setCaptain } = useContext(CaptainDataContext)
  const navigate = useNavigate()

  const focusFirstError = () => {
    requestAnimationFrame(() => {
      formRef.current?.querySelector('[aria-invalid="true"]')?.focus()
    })
  }

  const update = (key) => (e) => {
    const value = e.target.value
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((er) => ({ ...er, [key]: undefined }))
    setServerError('')
  }

  // Check a single field when the user leaves it
  const blur = (key) => () => {
    const message = RULES[key](form[key], form)
    setErrors((er) => ({ ...er, [key]: message || undefined }))
  }

  const validate = () => {
    const er = {}
    Object.keys(RULES).forEach((key) => {
      const message = RULES[key](form[key], form)
      if (message) er[key] = message
    })
    setErrors(er)
    return Object.keys(er).length === 0
  }

  // Turn a failed request into field errors / a friendly message
  const handleRequestError = (err) => {
    // No response at all: server down or no internet
    if (!err.response) {
      setServerError('Cannot reach the server. Check your internet connection and try again.')
      return
    }

    const { status, data } = err.response
    const message = data?.message || ''

    // Validation errors from express-validator
    if (status === 400 && Array.isArray(data?.errors)) {
      const fieldErrors = {}
      const other = []

      data.errors.forEach((e) => {
        const key = SERVER_FIELD_MAP[e.path || e.param]
        if (key) fieldErrors[key] = fieldErrors[key] || e.msg
        else other.push(e.msg)
      })

      setErrors((er) => ({ ...er, ...fieldErrors }))
      if (other.length) setServerError(other.join('. '))
      else if (Object.keys(fieldErrors).length) setServerError('Please fix the highlighted fields.')
      else setServerError('Please check your details and try again.')
      focusFirstError()
      return
    }

    // Email already used
    if (status === 409 || /already|duplicate|E11000/i.test(message)) {
      setErrors((er) => ({ ...er, email: 'This email is already registered. Try logging in.' }))
      setServerError('')
      focusFirstError()
      return
    }

    if (status >= 500) {
      setServerError('Something went wrong on our side. Please try again in a moment.')
      return
    }

    setServerError(message || 'Could not create your account. Please try again.')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setServerError('')

    if (!validate()) {
      setServerError('Please fix the highlighted fields.')
      focusFirstError()
      return
    }

    const newCaptain = {
      fullname: {
        firstname: form.firstname.trim(),
        lastname: form.lastname.trim(),
      },
      email: form.email.trim().toLowerCase(),
      password: form.password,
      vechile: {
        color: form.vechileColor.trim(),
        plate: form.vechilePlate,
        capacity: Number(form.vechileCapacity),
        vechileType: form.vechileType,
      },
    }

    setLoading(true)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/captains/register`,
        newCaptain
      )

      if (response.status === 201 && response.data?.token) {
        const data = response.data
        setCaptain(data.captain)
        localStorage.setItem('token', data.token)
        navigate('/captain-home')
      } else {
        setServerError('Unexpected response from the server. Please try again.')
      }
    } catch (err) {
      handleRequestError(err)
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
            Create your account and start earning with Roam. All fields are required.
          </p>

          <form ref={formRef} onSubmit={handleSubmit} noValidate className="mt-7 flex flex-col">
            <div className="flex flex-col gap-4">
              {/* Personal */}
              <div className="flex gap-3">
                <FormField
                  label="First name *"
                  className="flex-1"
                  placeholder="First name"
                  autoComplete="given-name"
                  required
                  value={form.firstname}
                  onChange={update('firstname')}
                  onBlur={blur('firstname')}
                  error={errors.firstname}
                />
                <FormField
                  label="Last name *"
                  className="flex-1"
                  placeholder="Last name"
                  autoComplete="family-name"
                  required
                  value={form.lastname}
                  onChange={update('lastname')}
                  onBlur={blur('lastname')}
                  error={errors.lastname}
                />
              </div>

              <FormField
                label="Email *"
                type="email"
                inputMode="email"
                placeholder="email@example.com"
                autoComplete="email"
                required
                value={form.email}
                onChange={update('email')}
                onBlur={blur('email')}
                error={errors.email}
              />

              <FormField
                label="Password *"
                type="password"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                required
                value={form.password}
                onChange={update('password')}
                onBlur={blur('password')}
                error={errors.password}
              />

              <FormField
                label="Confirm password *"
                type="password"
                placeholder="Re-enter your password"
                autoComplete="new-password"
                required
                value={form.confirmPassword}
                onChange={update('confirmPassword')}
                onBlur={blur('confirmPassword')}
                error={errors.confirmPassword}
              />

              {/* Vehicle */}
              <h2 className="mt-2 border-t border-[#E3E6F2] pt-5 text-base font-extrabold text-[#14112E]">
                Vehicle details
              </h2>

              <FormField
                label="Number plate *"
                placeholder="MH 12 AB 1234"
                autoCapitalize="characters"
                autoComplete="off"
                spellCheck={false}
                maxLength={13}
                required
                value={form.vechilePlate}
                onChange={(e) =>
                  update('vechilePlate')({ target: { value: formatPlate(e.target.value) } })
                }
                onBlur={blur('vechilePlate')}
                error={errors.vechilePlate}
              />

              <div className="flex gap-3">
                <FormField
                  label="Color *"
                  className="flex-1"
                  placeholder="e.g. White"
                  required
                  value={form.vechileColor}
                  onChange={update('vechileColor')}
                  onBlur={blur('vechileColor')}
                  error={errors.vechileColor}
                />
                <FormField
                  label="Seats *"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max="10"
                  step="1"
                  className="flex-1"
                  placeholder="e.g. 4"
                  required
                  // block characters that are valid in a number input but not here
                  onKeyDown={(e) => ['e', 'E', '+', '-', '.'].includes(e.key) && e.preventDefault()}
                  value={form.vechileCapacity}
                  onChange={update('vechileCapacity')}
                  onBlur={blur('vechileCapacity')}
                  error={errors.vechileCapacity}
                />
              </div>

              <SelectField
                label="Vehicle type *"
                placeholder="Select vehicle type"
                options={VEHICLE_TYPES}
                required
                value={form.vechileType}
                onChange={update('vechileType')}
                onBlur={blur('vechileType')}
                error={errors.vechileType}
              />
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
        </div>
      </div>
    </div>
  )
}

export default CaptainRegister