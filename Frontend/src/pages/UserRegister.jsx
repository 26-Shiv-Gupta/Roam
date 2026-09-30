import React, { useContext } from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';

const UserRegister = () => {

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {user, setUser} = useContext(UserDataContext)
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      'fullname': {
        'firstname': firstname,
        'lastname': lastname
      },
      'email':email,
      'password': password
    }
    
    const response = await axios.post(`http://localhost:3000/users/register`, newUser);

    if(response.status === 201) {
      const data = response.data;

      setUser(data.user)
      localStorage.setItem('token', data.token);
      navigate('/home')
    }

    setFirstname('');
    setLastname('');
    setEmail('');
    setPassword('');
  }

  return (
    <div className="w-full min-h-screen bg-neutral-100 flex justify-center">
      {/* Mobile frame: fills the viewport on phones, capped on larger screens */}
      <div className="w-full max-w-md min-h-screen bg-white flex flex-col px-5 pt-8 pb-6">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-8">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" fill="black" />
            <circle cx="12" cy="12" r="3.2" fill="white" />
          </svg>
          <span className="text-2xl font-bold tracking-tight text-gray-900">
            Roam
          </span>
        </div>

        {/* Name */}
        <form action="" onSubmit={handleSubmit}>
          <label className="block text-base font-semibold text-gray-900 mb-2">
            What's your name
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              autoComplete="given-name"
              placeholder="First name"
              value={firstname}
              onChange={(e) => { setFirstname(e.target.value) }}
              className="w-1/2 rounded-md border border-transparent bg-neutral-100 px-3 py-3 text-base text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white"
            />
            <input
              type="text"
              autoComplete="family-name"
              placeholder="Last name"
              value={lastname}
              onChange={(e) => { setLastname(e.target.value) }}
              className="w-1/2 rounded-md border border-transparent bg-neutral-100 px-3 py-3 text-base text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white"
            />
          </div>

          {/* Email */}
          <label
            htmlFor="email"
            className="block text-base font-semibold text-gray-900 mt-6 mb-2"
          >
            What's your email
          </label>
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value) }}
            className="w-full rounded-md border border-transparent bg-neutral-100 px-3 py-3 text-base text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white"
          />

          {/* Password */}
          <label
            htmlFor="password"
            className="block text-base font-semibold text-gray-900 mt-6 mb-2"
          >
            Enter Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value) }}
            className="w-full rounded-md border border-transparent bg-neutral-100 px-3 py-3 text-base text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:bg-white"
          />

          {/* Submit */}
          <button
            type="submit"
            className="mt-6 w-full rounded-md bg-black py-3.5 text-base font-bold text-white active:opacity-80 transition-opacity"
          >
            Create Account
          </button>
        </form>

        <p className="mt-3 text-center text-sm text-gray-700">
          Already have an account?{" "}
          <Link to='/user-login' className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>

        {/* Legal note pinned to the bottom */}
        <p className="mt-auto pt-10 text-[11px] leading-snug text-gray-500">
          By proceeding, you consent to get calls, WhatsApp or SMS messages,
          including by automated means, from Roam and its affiliates to the
          number provided.
        </p>
      </div>
    </div>
  );
}

export default UserRegister