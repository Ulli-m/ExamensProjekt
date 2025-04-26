import React from "react";
import "../styles/bookingStep2.css";

const WeekNavigator = ({ currentWeekStart, onPrevious, onNext }) => {
  const getFormattedDate = (date) =>
    date.toLocaleDateString("sv-SE", { day: "numeric", month: "long" });

  const monday = new Date(currentWeekStart);
  const sunday = new Date(currentWeekStart);
  sunday.setDate(monday.getDate() + 6);

  return (
    <div className="week-navigator">
      <button onClick={onPrevious}>← Föregående vecka</button>
      <span>
        {getFormattedDate(monday)} – {getFormattedDate(sunday)}
      </span>
      <button onClick={onNext}>Nästa vecka →</button>
    </div>
  );
};

export default WeekNavigator;
