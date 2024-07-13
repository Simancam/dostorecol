// src/components/CustomModal.js
import React from 'react';
import './Modal.css';

const CustomModal = ({ isOpen, onClose, title, children }) => {
  return (
    <div className={`custom-modal ${isOpen ? 'show' : ''}`}>
      <div className="custom-modal-content">
        <div className="custom-modal-header">
          <h2>{title}</h2>
          <button onClick={onClose}>&times;</button>
        </div>
        <div className="custom-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;