import React from 'react';
import './AddOrderBtn.css';

const AddBtn = ({ onClick }) => {
  return (
    <button className="add-btn flex justify-between items-center p-4 rounded-md shadow-md" onClick={onClick}>
      <span className="font-bold">Agregar Orden</span>
      <i className="bi bi-plus-lg text-xl"></i>
    </button>
  );
};

export default AddBtn;