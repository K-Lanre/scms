import React, { useState, useEffect } from "react";
import BaseModal from "./BaseModal";
import { FiX, FiDelete, FiLock, FiCheckCircle, FiShield } from "react-icons/fi";

const ChangePinModal = ({
  isOpen,
  onClose,
  onComplete,
  isLoading = false,
  error = null,
}) => {
  const [pin, setPin] = useState("");
  const [step, setStep] = useState(1); // 1 = old PIN, 2 = new PIN, 3 = confirm new PIN
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [localError, setLocalError] = useState("");

  React.useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  const displayError = localError;

  let displayTitle = "Enter Current PIN";
  let displayMessage = "Please enter your current 4-digit PIN.";

  if (step === 2) {
    displayTitle = "Enter New PIN";
    displayMessage = "Enter exactly 4 digits for your new PIN.";
  } else if (step === 3) {
    displayTitle = "Confirm New PIN";
    displayMessage = "Please re-enter your new PIN to confirm.";
  }

  // Reset PIN when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPin("");
      setStep(1);
      setOldPin("");
      setNewPin("");
      setLocalError("");
    }
  }, [isOpen]);

  const handleKeyPress = (num) => {
    if (pin.length < 4 && !isLoading) {
      const updatedPin = pin + num;
      setPin(updatedPin);
      if (localError) setLocalError("");

      if (updatedPin.length === 4) {
        if (step === 1) {
          setTimeout(() => {
            setOldPin(updatedPin);
            setPin("");
            setStep(2);
          }, 200);
        } else if (step === 2) {
          setTimeout(() => {
            setNewPin(updatedPin);
            setPin("");
            setStep(3);
          }, 200);
        } else if (step === 3) {
          if (updatedPin === newPin) {
            onComplete(oldPin, updatedPin);
          } else {
            setLocalError("New PINs do not match. Please try again.");
            setTimeout(() => {
              setPin("");
              setStep(2);
              setNewPin("");
              setLocalError("");
            }, 1500);
          }
        }
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0 && !isLoading) {
      setPin((prev) => prev.slice(0, -1));
      if (localError) setLocalError("");
    }
  };

  const renderDots = () => {
    const dots = [];
    for (let i = 0; i < 4; i++) {
      dots.push(
        <div
          key={i}
          className={`w-4 h-4 rounded-full mx-2 transition-all duration-200 ${
            i < pin.length
              ? "bg-blue-600 scale-110 shadow-sm"
              : displayError
                ? "bg-red-200"
                : "bg-gray-200"
          }`}
        />,
      );
    }
    return dots;
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={!isLoading ? onClose : () => {}}
      maxWidthClass="max-w-sm"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center text-blue-600">
            <FiShield className="mr-2 text-xl" />
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">
              {displayTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="text-center mb-8 h-20">
          <p className="text-gray-500 text-sm mb-4 h-10">{displayMessage}</p>

          <div className="flex justify-center items-center h-12 mb-2">
            {isLoading ? (
              <div className="flex items-center justify-center text-blue-600 font-bold space-x-2">
                <FiLock className="animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <div
                className={`flex justify-center ${
                  displayError ? "animate-shake" : ""
                }`}
              >
                {renderDots()}
              </div>
            )}
          </div>

          {displayError && (
            <p className="text-red-500 text-xs font-bold mt-2 animate-pulse absolute w-full left-0 text-center">
              {displayError}
            </p>
          )}
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-4 max-w-[260px] mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num.toString())}
              disabled={isLoading}
              className="w-16 h-16 rounded-full bg-gray-50 text-gray-800 text-2xl font-light mx-auto hover:bg-gray-200 active:bg-gray-300 transition-colors disabled:opacity-50 flex items-center justify-center font-mono"
            >
              {num}
            </button>
          ))}
          <div className="w-16 h-16 pointer-events-none"></div>{" "}
          {/* Empty space for alignment */}
          <button
            onClick={() => handleKeyPress("0")}
            disabled={isLoading}
            className="w-16 h-16 rounded-full bg-gray-50 text-gray-800 text-2xl font-light mx-auto hover:bg-gray-200 active:bg-gray-300 transition-colors disabled:opacity-50 flex items-center justify-center font-mono"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading || pin.length === 0}
            className="w-16 h-16 rounded-full text-gray-500 text-2xl mx-auto hover:bg-gray-100 hover:text-gray-800 active:bg-gray-200 transition-colors disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-center"
          >
            <FiDelete />
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ChangePinModal;
