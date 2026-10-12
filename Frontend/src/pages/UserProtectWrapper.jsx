import React, { useContext, useEffect } from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const UserProtectWrapper = ({ children }) => {

    const { user, setUser } = useContext(UserDataContext);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (!token) {
            navigate('/user-login', { replace: true })
            return
        }

        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/users/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                setUser(response.data)
            } catch (err) {
                console.error(err)
                localStorage.removeItem('token')
                navigate('/user-login', { replace: true })
            }
        }

        fetchUser()
    }, [navigate, setUser])

    return (
        <>
            {children}
        </>
    )
}

export default UserProtectWrapper