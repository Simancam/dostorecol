import React, { useState } from 'react';
import CustomModal from '../../../components/Modal/Modal';
import ModalForm from '../Forms/ReferenceForm/ReferenceForm';
import './OrderModal.css';

const Modal = ({ isOpen, onClose, item, token, fetchInventory }) => { // Agrega fetchInventory aquí
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <CustomModal isOpen={isOpen} onClose={onClose} title="Añadir Modelo de Zapato">
      <ModalForm 
        item={item}
        token={token}
        onClose={onClose}
        setLoading={setLoading}
        loading={loading}
        fetchInventory={fetchInventory} // Y pásalo aquí
      />
    </CustomModal>
  );
};

export default Modal;
