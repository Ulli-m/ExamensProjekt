
import React, { useState } from "react";
import "../styles/bookingStep4.css"; 


const BookingStep4 = ({ treatment, hairdresser, selectedDate, selectedTime, resetBooking, }) => {
    return (
      <div className="booking-confirmation">
        <h2>Tack för din bokning!</h2>
        <p><strong>Behandling:</strong> {treatment?.namn}</p>
        <p><strong>Frisör:</strong> {hairdresser?.namn}</p>
        <p><strong>Datum:</strong> {selectedDate?.toLocaleDateString("sv-SE")}</p>
        <p><strong>Tid:</strong> {selectedTime}</p>

        <button onClick={resetBooking}>Boka en ny tid</button>
        
      </div>
    );
  };
  
  export default BookingStep4;
  