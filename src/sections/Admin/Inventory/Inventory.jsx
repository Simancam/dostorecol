// src/components/Inventory.js
import React, { useState, useEffect } from 'react';
import AddBtn from './AddBtn/AddBtn';
import InventoryTable from './InventoryTable/InventoryTable';
import TotalCount from './TotalCount/TotalCount';
import CustomModal from '../../../components/Modal/Modal';
import ReferenceForm from './ReferenceForm/ReferenceForm';
import { useAuth } from '../../../context/AuthContext';
import { API_URL } from '../../../config';
import { Alert } from 'flowbite-react';

const Inventory = () => {
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const handleAddClick = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleAddItemClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = async (formData) => {
    try {
      const response = await fetch(`${API_URL}shoe`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
      setAlert({ type: 'success', message: 'Referencia añadida correctamente' });
      setTimeout(() => {
        setAlert(null);
      }, 2000);
      return Promise.resolve();
    } catch (error) {
      console.error('Error:', error);
      setAlert({ type: 'error', message: 'Error al añadir zapato' });
      return Promise.reject();
    }
  };

  return (
    <div>
      {alert && (
        <div className="fixed top-4 right-4 z-50">
          <Alert color={alert.type === 'success' ? 'green' : 'red'}>
            {alert.message}
          </Alert>
        </div>
      )}
      <h1 className="text-4xl font-bold">Inventario</h1>
      <AddBtn onClick={handleAddClick} />
      <InventoryTable setTotalCount={setTotalCount} onAdd={handleAddItemClick} shoeId={selectedItem?.id} />
      <TotalCount totalCount={totalCount} />
      <CustomModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Añadir Modelo de Zapato"
      >
        <ReferenceForm
          onSubmit={handleFormSubmit}
          item={selectedItem}
          token={token}
          onClose={handleCloseModal}
          setAlert={setAlert}
          setLoading={setLoading}
          loading={loading}
        />
      </CustomModal>
    </div>
  );
};

export default Inventory;