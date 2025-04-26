import React from "react";

const HairdresserSelector = ({ frisorer, selectedHairdresser, onChange }) => {
  return (
    <select
      className="hairdresser-dropdown"
      value={selectedHairdresser ? selectedHairdresser.id : ""}
      onChange={(e) => {
        const selectedId = e.target.value;
        const selected = frisorer.find(f => f.id === selectedId);
        onChange(selected);
      }}
    >
      <option value="">Välj frisör</option>
      {frisorer.map((frisör) => (
        <option key={frisör.id} value={frisör.id}>
          {frisör.namn}
        </option>
      ))}
    </select>
  );
};

export default HairdresserSelector;






