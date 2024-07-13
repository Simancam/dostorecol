import React, { useState } from 'react';
import CustomModal from '../../../components/Modal/Modal';
import ModalForm from '../Forms/ReferenceForm/ReferenceForm';
import './OrderModal.css';

const Modal = ({ isOpen, onClose, onSubmit, item, token }) => {
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Añadir Modelo de Zapato">
      <ModalForm 
        onSubmit={onSubmit}
        item={item}
        token={token}
        onClose={onClose}
        setAlert={setAlert}
        setLoading={setLoading}
        loading={loading}
      />
    </CustomModal>
  );
};

export default Modal;