import axios from 'axios';
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { CaptainDataContext } from '../context/CaptainContext';

const CaptainProtectWrapper = ({ children }) => {

    const { captain, setCaptain } = useContext(CaptainDataContext);
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/captain-login')
        }

        const fetchCaptain = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setCaptain(response.data);
            } catch (err) {
                console.error(err);
                localStorage.removeItem('token');
                navigate('/captain-login');
            }
        }

        fetchCaptain();

    }, [navigate, setCaptain]);



    return (
        <>
            {children}
        </>
    )
}

export default CaptainProtectWrapper