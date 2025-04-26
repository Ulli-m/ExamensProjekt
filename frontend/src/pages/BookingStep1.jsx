import React, { useState, useEffect } from "react";
import { fetchBehandlingar, fetchFrisorer } from "../utils/fetch";
import TreatmentSelector from "../components/TreatmentSelector";
import HairdresserSelector from "../components/HairdresserSelector";
import NextButton from "../components/NextButton";
import "../styles/bookingstep1.css";

const BookingStep1 = ({ treatment, hairdresser, onTreatmentChange, onHairdresserChange, onNext }) => {
  const [behandlingar, setBehandlingar] = useState([]);
  const [frisorer, setFrisorer] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Hämta data för behandlingar och frisörer
    Promise.all([fetchBehandlingar(), fetchFrisorer()])
      .then(([behandlingData, frisorData]) => {
        setBehandlingar(behandlingData || []);
        setFrisorer(frisorData || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fel vid hämtning av data:", error);
        setLoading(false);
      });
  }, []);

  const handleTreatmentChange = (selectedTreatment) => {
    onTreatmentChange(selectedTreatment); // Skicka objektet till parent
  };

  const handleHairdresserChange = (selectedHairdresser) => {
    onHairdresserChange(selectedHairdresser); // Skicka objektet till parent
  };

  if (loading) {
    return <div>Laddar...</div>;
  }

  return (
    <div className="booking-step-1">
      

      <h2>Välj behandling</h2>
      <div className="dropdown-wrapper">
      <TreatmentSelector
        behandlingar={behandlingar}
        selectedTreatment={treatment}
        onChange={handleTreatmentChange}
      />
      </div>

      <h2>Välj frisör</h2>
      <div className="dropdown-wrapper">
      <HairdresserSelector
        frisorer={frisorer}
        selectedHairdresser={hairdresser}
        onChange={handleHairdresserChange}
      />
      </div>

      {/* Aktivera knappen när både behandling och frisör är valda */}
      {treatment && hairdresser && (
        <NextButton onClick={onNext} label="Fortsätt" />
      )}
    </div>
  );
};

export default BookingStep1;


