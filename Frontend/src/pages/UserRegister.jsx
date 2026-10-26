import React, { useContext, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import UserRoamLogo from '../components/UserRoamLogo'
import FormField from '../components/FormField'
import { UserDataContext } from '../context/UserContext'

const LETTERS_ONLY = /^[\p{L}\s.'-]+$/u
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

// Every field is required. Each rule returns an error message, or '' if valid.
const nameRule = (label) => (v) => {
  const s = v.trim()
  if (!s) return `Enter your ${label}`
  if (s.length < 3) return `${cap(label)} must be at least 3 characters`
  if (!LETTERS_ONLY.test(s)) return 'Use letters only'
  return ''
}

const RULES = {
  firstName: nameRule('first name'),
  lastName: nameRule('last name'),
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
}

// Backend validation field names -> our form field names
const SERVER_FIELD_MAP = {
  'fullname.firstname': 'firstName',
  'fullname.lastname': 'lastName',
  email: 'email',
  password: 'password',
}

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const UserRegister = () => {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const formRef = useRef(null)
  const { setUser } = useContext(UserDataContext)
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

  const submitHandler = async (e) => {
    e.preventDefault()
    setServerError('')

    if (!validate()) {
      setServerError('Please fix the highlighted fields.')
      focusFirstError()
      return
    }

    const newUser = {
      fullname: {
        firstname: form.firstName.trim(),
        lastname: form.lastName.trim(),
      },
      email: form.email.trim().toLowerCase(),
      password: form.password,
    }

    setLoading(true)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/users/register`,
        newUser
      )

      if (response.status === 201 && response.data?.token) {
        const data = response.data
        setUser(data.user)
        localStorage.setItem('token', data.token)
        navigate('/home')
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
      {/* Plain white frame. Only the form area scrolls on short screens. */}
      <div className="flex h-dvh w-full max-w-md flex-col overflow-hidden bg-white">
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-7">
          <UserRoamLogo className="#000" />
          <div className="h-5"></div>
          <h1 className="mt-8 text-[28px] font-extrabold leading-tight tracking-tight text-[#14112E]">
            Create your account
          </h1>
          <p className="mt-1.5 text-[15px] font-medium text-[#4B5069]">
            Join Roam and start moving around the city. All fields are required.
          </p>

          <form ref={formRef} onSubmit={submitHandler} noValidate className="mt-7 flex flex-col">
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <FormField
                  label="First name *"
                  className="flex-1"
                  placeholder="First name"
                  autoComplete="given-name"
                  required
                  value={form.firstName}
                  onChange={update('firstName')}
                  onBlur={blur('firstName')}
                  error={errors.firstName}
                />
                <FormField
                  label="Last name *"
                  className="flex-1"
                  placeholder="Last name"
                  autoComplete="family-name"
                  required
                  value={form.lastName}
                  onChange={update('lastName')}
                  onBlur={blur('lastName')}
                  error={errors.lastName}
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
              to="/captain-register"
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
                <path d="M5 16l1.5-5.5A2 2 0 0 1 8.4 9h7.2a2 2 0 0 1 1.9 1.5L19 16" />
                <path d="M3 16h18v3a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1v-1h-9v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
                <circle cx="7.5" cy="13.5" r="0.8" fill="currentColor" />
                <circle cx="16.5" cy="13.5" r="0.8" fill="currentColor" />
              </svg>
              Sign up as Captain
            </Link>

            <p className="mt-4 text-center text-sm font-medium text-[#4B5069]">
              Already have an account?{' '}
              <Link to="/user-login" className="font-bold text-[#2B2F77] hover:underline">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UserRegister