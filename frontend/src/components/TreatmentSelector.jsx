import React from "react";

const TreatmentSelector = ({ behandlingar, selectedTreatment, onChange }) => {
  return (
    <select
      className="treatment-dropdown"
      value={selectedTreatment ? selectedTreatment.id : ""}
      onChange={(e) => {
        const selectedId = e.target.value;
        const selected = behandlingar.find(b => b.id === selectedId);
        onChange(selected);
      }}
    >
      <option value="">Välj behandling</option>
      {behandlingar.map((behandling) => (
        <option key={behandling.id} value={behandling.id}>
          {behandling.namn}
        </option>
      ))}
    </select>
  );
};

export default TreatmentSelector;










