import axios from 'axios';
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { CaptainDataContext } from '../context/CaptainContext';

const CaptainProtectWrapper = ({ children }) => {

    const {captain, setCaptain} = useContext(CaptainDataContext);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/captain-login')
        }
    }, [token])

    axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then((response) => {
        if(response.status === 200) {
            setCaptain(response.data.captain);
        }
    }).catch((err) => {
        console.log(err);
        localStorage.removeItem('token')
        navigate('/captain-login')
    })

    return (
        <>
            {children}
        </>
    )
}

export default CaptainProtectWrapper