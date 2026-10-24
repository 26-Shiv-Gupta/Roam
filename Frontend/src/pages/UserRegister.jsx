import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import UserRoamLogo from '../components/UserRoamLogo'
import FormField from '../components/FormField'
import axios from 'axios'
import { useContext } from 'react'
import { UserDataContext } from '../context/UserContext'

const UserRegister = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})

  const { user, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setErrors((er) => ({ ...er, [key]: undefined }))
  }

  const validate = () => {
    const er = {}
    if (!form.firstName.trim()) er.firstName = 'Enter your first name'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) er.email = 'Enter a valid email'
    if (form.password.length < 6) er.password = 'Use at least 6 characters'
    if (form.confirmPassword !== form.password)
      er.confirmPassword = 'Passwords do not match'
    setErrors(er)
    return Object.keys(er).length === 0
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    if (!validate()) return

    const newUser = {
      fullname: {
        firstname: form.firstName,
        lastname: form.lastName
      },
      email: form.email,
      password: form.password,
    }

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);

    console.log(response)

    if (response.status === 201) {
      const data = response.data;

      setUser(data.user)
      localStorage.setItem('token', data.token);
      navigate('/home')
    }

    setForm({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    })
  }

  return (
    <div className="flex h-dvh w-full justify-center overflow-hidden bg-white font-sans">
      {/* Plain white frame. Only the form area scrolls on short screens. */}
      <div className="flex h-dvh w-full max-w-md flex-col overflow-hidden bg-white">
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 pt-7">
          <UserRoamLogo className='#000' />
          <div className='h-5'></div>
          <h1 className="mt-8 text-[28px] font-extrabold leading-tight tracking-tight text-[#14112E]">
            Create your account
          </h1>
          <p className="mt-1.5 text-[15px] font-medium text-[#4B5069]">
            Join Roam and start moving around the city.
          </p>

          <form onSubmit={submitHandler} noValidate className="mt-7 flex flex-col">
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <FormField
                  label="First name"
                  className="flex-1"
                  placeholder="First name"
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={update('firstName')}
                  error={errors.firstName}
                />
                <FormField
                  label="Last name"
                  className="flex-1"
                  placeholder="Last name"
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={update('lastName')}
                />
              </div>

              <FormField
                label="Email"
                type="email"
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
            </div>

            <button
              type="submit"
              className="mt-6 flex h-14 w-full items-center justify-center rounded-2xl bg-[#2B2F77] text-base font-bold text-white shadow-[0_8px_20px_rgba(43,47,119,0.28)] transition hover:bg-[#3a3fa0] active:scale-[0.98]"
            >
              Create Account
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