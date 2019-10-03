import React, { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

import api from '../../services/api';

import './styles.css';

export default function Dashboard({ history }) {

    const [spots, setSpots] = useState(null);

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

            console.log(response.data);

            setSpots(response.data);
        }

        loadSpots();

    }, []);


    return (
        <>
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
