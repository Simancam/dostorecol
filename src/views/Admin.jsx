// src/components/Admin.js
import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../sections/Admin/Sidebar/Sidebar';
import Inventory from '../sections/Admin/Inventory/Inventory';
import OrdersContent from '../sections/Admin/Order/Order';
import { API_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import './Admin.css';

function Admin() {
  const [content, setContent] = useState('Contenido de Inventario');
  const { token, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      console.log('Token:', token);
    }
  }, [loading, token]);

  const handleAddOrderClick = () => {
    // Lógica para manejar el clic en "Añadir Pedido"
  };

  const handleFormSubmit = async (formData) => {
    try {
      const response = await fetch(`${API_URL}order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
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
        return <Inventory />;
      case 'Contenido de Pedidos':
        return <OrdersContent handleAddOrderClick={handleAddOrderClick} />;
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
    <div className={`flex`}>
      <Sidebar setContent={setContent} />
      <div className="content p-4">
        {renderContent()}
      </div>
    </div>
  );
}

export default Admin;