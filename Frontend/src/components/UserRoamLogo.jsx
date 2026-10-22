import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'

const UserRoamLogo = ({ className = '' }) => {
    const [stroke, setStroke] = useState('#fff')

    useEffect(() => {
        if (className === '#fff') {
            setStroke('#000')
        } else {
            setStroke('#fff')
        }
    }, [className])
    return (
        <div className="absolute left-6 top-7">
            <div className={`flex items-center gap-2.5`}>
                <svg
                    aria-hidden="true"
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill={`${className}`}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect width="32" height="32" rx="10" />
                    <path
                        d="M16 7L23 11V21L16 25L9 21V11Z"
                        stroke={`${stroke}`}
                        strokeWidth="2.4"
                        fill={`${className}`}
                        strokeLinejoin="round"
                    />
                </svg>
                <span
                    className="text-[22px] font-extrabold tracking-tight"
                    style={{ color: className }}
                >
                    Roam
                </span>
            </div>
        </div>
    )
}

export default UserRoamLogo         