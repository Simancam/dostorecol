import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../sections/Admin/Sidebar/Sidebar';
import AddBtn from '../sections/Admin/AddBtn/AddBtn';
import InventoryTable from '../sections/Admin/Tables/InventoryTable';
import OrdersTable from '../sections/Admin/Tables/OrderTable';
import TotalCount from '../sections/Admin/TotalCount/TotalCount';
import CustomModal from '../sections/Admin/Modal/Modal';
import { API_URL } from '../config';
import './Admin.css';
import { useAuth } from '../context/AuthContext';

function Admin() {
  const [content, setContent] = useState('Contenido de Inventario');
  const [totalCount, setTotalCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      console.log('Token:', token);
    }
  }, [loading, token]);

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
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
      return Promise.resolve();
    } catch (error) {
      console.error('Error:', error);
      return Promise.reject();
    }
  };

  const fetchInventory = useCallback(async () => {
    if (loading) return;

    try {
      const response = await fetch(`${API_URL}inventory`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  }, [loading]);

  const renderContent = () => {
    switch (content) {
      case 'Contenido de Inventario':
        return (
          <div>
            <h1 className="text-4xl font-bold">Inventario</h1>
            <AddBtn onClick={handleAddClick} />
            <InventoryTable setTotalCount={setTotalCount} onAdd={handleAddItemClick} shoeId={selectedItem?.id} />
            <TotalCount totalCount={totalCount} />
          </div>
        );
      case 'Contenido de Pedidos':
        return (
          <div>
            <h1 className="text-4xl font-bold">Pedidos</h1>
            <OrdersTable setTotalCount={setTotalCount} />
          </div>
        );
      default:
        return <p>{content}</p>;
    }
  };

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={`flex ${isModalOpen ? 'modal-open' : ''}`}>
      <Sidebar setContent={setContent} />
      <div className="content p-4">
        {renderContent()}
      </div>
      <CustomModal
        token={token}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        item={selectedItem}
      />
    </div>
  );
}

export default Admin;