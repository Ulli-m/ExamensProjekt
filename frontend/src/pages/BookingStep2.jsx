import React, { useState, useEffect } from "react";
import "../styles/bookingStep2.css";
import WeekNavigator from "../components/WeekNavigator";
import NextButton from "../components/NextButton";
import { fetchLedigaTider } from "../utils/fetch";

const BookingStep2 = ({ treatment, hairdresser, onPrevious, onNext, onDateChange, onTimeChange,  }) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const startDate = getStartOfWeek(new Date(), weekOffset);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);

  useEffect(() => {
    if (treatment && hairdresser) {
      fetchAvailableTimes();
    }
  }, [treatment, hairdresser, weekOffset]);

  const fetchAvailableTimes = async () => {
    try {
      const times = await fetchLedigaTider(
        hairdresser.id,
        treatment.id,
        startDate.toISOString().split("T")[0],
        endDate.toISOString().split("T")[0]
      );
      setAvailableTimes(times);
    } catch (err) {
      console.error("Kunde inte hämta tider", err);
    }
  };

  const handleSelectSlot = (slot) => {
    console.log("slotKey:", slot); // Ex: 2025-04-18T10:00
  
    setSelectedSlot(slot);
  
    const [datePart, timePart] = slot.split("T"); // Separera datum och tid
  
    const selectedDate = new Date(datePart); // Skapar ett Date-objekt från datumet
  
    if (isNaN(selectedDate.getTime())) {
      console.error("Ogiltigt datum:", selectedDate);
      return;
    }
  
    if (onDateChange) onDateChange(selectedDate);
    if (onTimeChange) onTimeChange(timePart); // Skicka vidare tiden
  };
  
  
  
  
  
  



  return (
    <div className="booking-step-2">
      <h2>Välj tid</h2>

      <WeekNavigator
  currentWeekStart={startDate}
  onPrevious={() => setWeekOffset(weekOffset - 1)}
  onNext={() => setWeekOffset(weekOffset + 1)}
/>

      <div className="calendar-grid">
        {availableTimes.map((day) => (
          <div key={day.date} className="day-column">
            <div className="day-header">
              {new Date(day.date).toLocaleDateString("sv-SE", {
                weekday: "short",
                day: "numeric",
                month: "numeric",
              })}
            </div>
            {day.times.map((time) => {
              const slotKey = `${day.date}T${time}`; // t.ex. 2025-04-18T10:00
              const slotDateTime = new Date(slotKey);
              const now = new Date();

              if (slotDateTime < now) return null; // Visa inte tider i det förflutna

              const isSelected = selectedSlot === slotKey;
              return (
                <button
                  key={slotKey}
                  className={`time-slot ${isSelected ? "selected" : ""}`}
                  onClick={() => handleSelectSlot(slotKey)}
                >
                  {time}
                </button>
              );
            })}
          </div>
        ))}
      </div>
        
      <div>
        <button onClick={onPrevious} className="step-button">Tillbaka</button>
        
        <NextButton
  onClick={() => {
    if (selectedSlot) {
      onNext(); // först nu går man vidare
    }
  }}
  disabled={!selectedSlot}
/>

    </div> 
    </div>
  );
};

export default BookingStep2;

// Hjälpfunktion: Få måndagen för veckan med offset
function getStartOfWeek(date, offset = 0) {
  const d = new Date(date);
  const day = d.getDay() === 0 ? 7 : d.getDay(); // Söndag = 7
  d.setDate(d.getDate() - day + 1 + offset * 7); // Måndag = start
  return d;
}




