import React, { useEffect } from "react";

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`notification ${type === "error" ? "is-danger" : "is-success"}`}>
      <button className="delete" onClick={onClose}></button>
      {message}
    </div>
  );
};

export default Notification;
