import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const GuestAcc = () => {

    const location = useLocation();
    const currentGuest = location.state?.user;

    return (
        <>
            <header>
                
            </header>

            <section>

            </section>
        </>
    );
};

export default GuestAcc;
