import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SessionTimer = ({ tokenExpirationTime }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const inactivityTimeout = 15 * 60 * 1000; // 15 minutos en milisegundos

  useEffect(() => {
    let tokenInterval;
    let inactivityTimer;

    const resetInactivityTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(handleSessionEnd, inactivityTimeout);
    };

    const handleSessionEnd = () => {
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        window.location.reload();
        navigate('/login');
      }, 3000);
    };

    const checkTokenExpiration = () => {
      if (Date.now() >= tokenExpirationTime) {
        clearInterval(tokenInterval);
        handleSessionEnd();
      }
    };

    tokenInterval = setInterval(checkTokenExpiration, 1000);
    resetInactivityTimer();

    // Agregar event listeners para resetear el timer de inactividad
    const events = ['mousedown', 'keypress', 'scroll', 'mousemove'];
    events.forEach(event => document.addEventListener(event, resetInactivityTimer));

    return () => {
      clearInterval(tokenInterval);
      clearTimeout(inactivityTimer);
      events.forEach(event => document.removeEventListener(event, resetInactivityTimer));
    };
  }, [tokenExpirationTime, navigate, inactivityTimeout]);

  const Modal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">Sesión Expirada</h2>
        <p>Su sesión ha expirado. Será redirigido al login.</p>
      </div>
    </div>
  );

  return showModal ? <Modal /> : null;
};

export default SessionTimer;