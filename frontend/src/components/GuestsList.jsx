import React, { useState, useEffect } from 'react';

const GuestsList = () => {
    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://127.0.0.1:5000/guests')
          .then(response => response.json())
          .then(data => {
            setGuests(data);
            setLoading(false);
          })
          .catch(error => {
            console.error('Error fetching guests:', error);
            setLoading(false);
          });
      }, []);

      if (loading){
        return <div>Loading...</div>;
      }
      else{
        return(
            <div>
                <h2>Guests List</h2>
            </div>
        );
      };
};

export default GuestsList;