import React, { useContext, useEffect } from 'react'
import { UserDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';

const UserProtectWrapper = ({ children }) => {

    const {user, setUser} = useContext(UserDataContext);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/user-login')
        }
    })

    axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        if (response.status === 200) {
            setUser(response.data.user);
        }
    }).catch((err) => {
        console.log(err);
        localStorage.removeItem('token');
        navigate('/user-login');
    })

    return (
        <>
            {children}
        </>
    )
}

export default UserProtectWrapper