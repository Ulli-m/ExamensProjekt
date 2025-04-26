import React, { useState } from "react";
import "../styles/bookingStep3.css"; 
import { submitBooking } from "../utils/fetch"; 



const BookingStep3 = ({
  treatment,
  hairdresser,
  selectedDate,
  selectedTime,
  onBack,
  onConfirm,
}) => {
  const [formData, setFormData] = useState({
    kund_fornamn: "",
    kund_efternamn: "",
    kund_email: "",
    kund_mobilnummer: "",
    kund_meddelande: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatTime = (time) => {
    if (typeof time === "string" && time.includes(":")) {
      return time;
    }
    // Om det bara är en timme, som "9", gör det till "09:00"
    const hour = String(time).padStart(2, "0");
    return `${hour}:00`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("Valt datum innan validering:", selectedDate); // Debug-utskrift
  
    // Kolla om selectedDate är ett giltigt datum
    const validDate = new Date(selectedDate);
  
    // Kontrollera om det är ett ogiltigt datum
    if (isNaN(validDate.getTime())) {
      console.error("Ogiltigt datum:", validDate);
      alert("Det valda datumet är ogiltigt.");
      return; // Avbryt om datumet är ogiltigt
    }
  
    // Om datumet är giltigt, fortsätt med submission
    const isoDate = validDate.toISOString();
    console.log("Valt datum:", isoDate);
  
    if (!selectedDate || !selectedTime) {
      alert("Vänligen välj både datum och tid innan du bokar.");
      return;
    }
  
    const bookingData = {
      frisor_id: hairdresser.id,
      behandling_id: treatment.id,
      datum: selectedDate.toISOString().split("T")[0],
      tid: formatTime(selectedTime),
      status: "bokad",
      ...formData,
    };
  
    console.log("BookingData som skickas:", bookingData);
    console.log("Valt datum i BookingStep3:", selectedDate);
    console.log("Vald tid i BookingStep3:", selectedTime);
  
    try {
      // Använd submitBooking för att skicka bokningen
      const result = await submitBooking(bookingData);
      alert("Bokning skickad!");
      onConfirm(); // Gå vidare till nästa steg eller visa bekräftelse
    } catch (error) {
      alert(error.message); // Hantera fel
    }
  };
  

  console.log("Hairdresser:", hairdresser);
  console.log("Treatment:", treatment);
  console.log("Valt datum:", selectedDate);
  console.log("Vald tid:", selectedTime);



  return (
    <div className="booking-step-3">
      <h2>Bekräfta bokning</h2>

      <div className="booking-summary">
        <p><strong>Behandling:</strong> {treatment.namn}</p>
        <p><strong>Frisör:</strong> {hairdresser.namn}</p>
        <p><strong>Datum:</strong> {selectedDate ? selectedDate.toLocaleDateString("sv-SE") : "Inget datum valt"}</p>
        <p><strong>Tid:</strong> {selectedTime}</p>
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        <input
          type="text"
          name="kund_fornamn"
          placeholder="Förnamn"
          value={formData.kund_fornamn}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="kund_efternamn"
          placeholder="Efternamn"
          value={formData.kund_efternamn}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="kund_email"
          placeholder="E-post"
          value={formData.kund_email}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="kund_mobilnummer"
          placeholder="Mobilnummer"
          value={formData.kund_mobilnummer}
          pattern="[0-9]{6,15}"
          title="Ange ett giltigt nummer utan mellanslag"
          onChange={handleChange}
          required
        />
        <textarea
          name="kund_meddelande"
          placeholder="Meddelande (valfritt)"
          value={formData.kund_meddelande}
          onChange={handleChange}
        />
        <div className="buttons">
          <button type="button" onClick={onBack}>← Tillbaka</button>
          <button type="submit">Bekräfta bokning</button>
        </div>
      </form>
    </div>
  );
};

export default BookingStep3;

