import React, { useState, useEffect, useCallback } from 'react';
import AddBtn from './AddBtn/AddBtn';
import InventoryTable from './InventoryTable/InventoryTable';
import TotalCount from './TotalCount/TotalCount';
import CustomModal from '../../../components/Modal/Modal';
import ReferenceForm from './ReferenceForm/ReferenceForm';
import { useAuth } from '../../../context/AuthContext';
import { API_URL } from '../../../config';
import { Alert } from 'flowbite-react';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetchInventory = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}inventory`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Error fetching inventory');
      }
      console.log('Inventory Fetching:');
      const data = await response.json();
      setInventory(data);
      setTotalCount(data.reduce((total, item) => total + item.totalAmount, 0));
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  }, [token]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

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
      await fetchInventory();
      console.log('Inventory updated after adding reference');
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
      <h1 className="text-4xl font-bold mb-4">Inventario</h1>
      <div className="flex items-center mb-4">
        <AddBtn onClick={handleAddClick} />
        <button
          onClick={fetchInventory}
          className="ml-4 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200"
          title="Actualizar Inventario"
        >
          <i className="bi bi-arrow-repeat text-xl"></i>
        </button>
      </div>
      <InventoryTable inventory={inventory} fetchInventory={fetchInventory} setAlert={setAlert}/>
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
          fetchInventory={fetchInventory}
        />
      </CustomModal>
    </div>
  );
};

export default Inventory;