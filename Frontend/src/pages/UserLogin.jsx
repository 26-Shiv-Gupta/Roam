import axios from 'axios';
import React, { useContext } from 'react'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {user, setUser} = useContext(UserDataContext);
  const navigate = useNavigate();

  const userData = {
    email: email,
    password: password
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData)
    console.log(response)

    if(response.status === 200) {
      const data = response.data
      setUser(data.user)
      localStorage.setItem('token', data.token);
      navigate('/home')
    }

    setEmail('');
    setPassword('');
  }

  return (
    <div className="w-full min-h-screen bg-neutral-100 flex justify-center">
      {/* Mobile frame: fills the viewport on phones, capped on larger screens */}
      <div className="w-full max-w-md min-h-screen bg-white flex flex-col px-5 pt-8 pb-8">
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

        {/* Email */}
        <form action="" onSubmit={handleSubmit}>
          <label
            htmlFor="email"
            className="block text-base font-semibold text-gray-900 mb-2"
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
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-transparent bg-neutral-100 px-3 py-3 text-base text-gray-900 placeholder-gray-400 outline-none focus:border-amber-500 focus:bg-white"
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
            autoComplete="current-password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-transparent bg-neutral-100 px-3 py-3 text-base text-gray-900 placeholder-gray-400 outline-none focus:border-amber-500 focus:bg-white"
          />

          {/* Login */}
          <button
            type="submit"
            className="mt-6 w-full rounded-md bg-black py-3.5 text-base font-bold text-white active:opacity-80 transition-opacity"
          >
            Login
          </button>
        </form>

        <p className="mt-3 text-center text-sm text-gray-700">
          New here?{" "}
          <Link to='/user-register' className="text-blue-600 hover:underline">
            Create new Account
          </Link>
        </p>

        {/* Pushed to the bottom of the screen */}
        <Link
          to='/captain-login'
          className="flex items-center justify-center mt-auto w-full rounded-md bg-green-600 py-3.5 text-base font-bold text-white active:opacity-80 transition-opacity"
        >
          Sign in as Captain
        </Link>
      </div>
    </div>
  );
}

export default UserLogin