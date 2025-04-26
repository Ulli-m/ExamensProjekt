import React from "react";
import "../styles/stepindicator.css";

const StepIndicator = ({ currentStep, onStepClick }) => {
  const steps = [1, 2, 3, 4];

  return (
    <div className="step-indicator">
      {steps.map((step) => {
        // Avgör om detta är ett slutfört, aktivt eller kommande steg
        const isCompleted = step < currentStep;
        const isActive = step === currentStep;
        const isInactive = step > currentStep;

        // Förhindra klick när man är på steg 4 (bokningen bekräftad)
        const handleClick = () => {
          if (onStepClick && currentStep !== 4) {
            onStepClick(step);
          }
        };

        return (
          <div
            key={step}
            className={`step-item ${
              isCompleted ? "completed" : isActive ? "active" : "inactive"
            }`}
            onClick={handleClick}
          >
            <div className="step-circle">{step}</div>
            <div className="step-label">Steg {step}</div>
          </div>
        );
      })}
    </div>
  );
};

export default StepIndicator;


