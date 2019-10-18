import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import socketio from 'socket.io-client';

import api from '../../services/api';

import './styles.css';

export default function Dashboard({ history }) {

    const [spots, setSpots] = useState(null);

    const [requests, setRequests] = useState([]);

    const user_id = localStorage.getItem('user');

    const socket = useMemo(() => socketio('http://localhost:3333', {
        query: { user_id },
    }), [user_id]);

    useEffect(() => {

        socket.on('booking_request', data => {
            setRequests([ ...requests, data]);
        });

    }, [requests, socket]);

    useEffect(() => {

        const user_id = localStorage.getItem('user');

        if(!user_id)
        {
            history.push('/');
        }

        async function loadSpots() {

            const user_id = localStorage.getItem('user');

            const response = await api.get('/dashboard', {
                headers: { user_id },
            });

            console.log("Spots encontrados:", response.data);

            setSpots(response.data);
        }

        loadSpots();

    }, [history]);

    async function handleAccept(booking_id) {

        await api.post(`/bookings/${booking_id}/approvals`);

        setRequests(requests.filter(request => request._id !== booking_id));
    }

    async function handleReject(booking_id) {

        await api.post(`/bookings/${booking_id}/rejections`);

        setRequests(requests.filter(request => request._id !== booking_id));
    }


    return (
        <>
            <ul className="notifications">
                {
                    requests.map(request => (
                        <li key={request._id}>
                            <p>
                                <strong>{request.user.email}</strong> está solicitando uma reserva em <strong>{request.spot.company}</strong> para a data: <strong>{request.date}</strong>
                            </p>
                            <button className="accept" onClick={() => handleAccept(request._id)}>
                                Aceitar
                            </button>
                            <button className="reject" onClick={() => handleReject(request._id)}>
                                Rejeitar
                            </button>
                        </li>
                        )
                    )
                }
            </ul>
            <h1 className="title">Dashboard</h1>

            {
                spots == null ?
                <div className="loader-holder"><div className="loader"></div></div>
                :
                <ul className="spot-list">
                {
                    spots.map(spot => (
                        <li key={spot._id}>
                            <header style={{ backgroundImage: `url(${spot.thumbnail_url})` }} />
                            <strong>{spot.company}</strong>
                            <span>{spot.price ? `R$${spot.price}/dia` : 'GRATUITO'}</span>
                        </li>
                    ))
                }
                </ul>
            }


            <Link to="/new">
                <button className="btn">
                    Cadastrar novo spot
                </button>
            </Link>
        </>
    )
}
