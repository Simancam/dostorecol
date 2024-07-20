import React, { useState, useEffect } from 'react';
import './SessionTimer.css'; // Archivo de estilos

const SessionTimer = ({ tokenExpirationTime }) => {
  const [timeLeft, setTimeLeft] = useState(tokenExpirationTime - Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(tokenExpirationTime - Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [tokenExpirationTime]);

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="session-timer">
      Tiempo de sesión restante: {formatTime(timeLeft)}
    </div>
  );
};

export default SessionTimer;