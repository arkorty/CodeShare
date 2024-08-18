import React, { useEffect, useState } from "react";

const Notification = ({ message, type, onClose }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => setFade(true), 4800);
    const closeTimer = setTimeout(onClose, 5000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  const getBackgroundColor = () => {
    console.log("Notification type:", type); // Debugging line
    switch (type) {
      case "success":
        return "bg-green-600";
      case "warning":
        return "bg-amber-600";
      case "error":
        return "bg-red-600";
      default:
        return "bg-green-600";
    }
  };

  return (
    <div
      className={`fixed top-20 right-4 z-50 ${
        fade ? "animate-fadeOut" : "animate-slideIn"
      }`}
      onClick={onClose}
    >
      <div
        className={`${getBackgroundColor()} text-white px-4 py-2 rounded shadow-lg cursor-pointer`}
      >
        {message}
      </div>
      <style jsx>{`
        .animate-slideIn {
          animation: slideIn 0.5s ease-out;
        }

        .animate-fadeOut {
          animation: fadeOut 0.2s ease-in forwards;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Notification;
