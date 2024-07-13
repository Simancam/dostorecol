import React, { useEffect, useState, useCallback } from 'react';
import { API_URL } from '../../../../config';
import AddInvModal from '../AddInvModal/AddInvModal';
import { useAuth } from '../../../../context/AuthContext';
import './InventoryTable.css';

const InventoryTable = ({ setTotalCount }) => {
  const [inventory, setInventory] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const { token } = useAuth();
  const [shoeId, setShoeId] = useState("");

  const fetchInventory = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}inventory`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log(`inventoryHeaders: ${response.headers}`);

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      const data = await response.json();
      setInventory(data.inventory);
      const totalCount = data.inventory.reduce((total, item) => total + item.totalAmount, 0);
      setTotalCount(totalCount);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  }, [setTotalCount]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleAddClick = (id) => {
    setShoeId(id);
    setModalOpen(true);
  };

  const handleModalSubmit = async (sizes) => {
    try {
      const requestBody = JSON.stringify({
        shoeId: shoeId,
        sizes: sizes.map(size => parseInt(size.size)),
        amounts: sizes.map(size => parseInt(size.amount))
      });
      const response = await fetch(`${API_URL}inventory`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: requestBody
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      fetchInventory();
    } catch (error) {
      console.error('Error adding sizes:', error);
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      const response = await fetch(`${API_URL}shoe/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      showAlert('Zapato eliminado');

      fetchInventory();
    } catch (error) {
      console.error('Error deleting shoe:', error);
    }
  };

  const showAlert = (message) => {
    const alertBox = document.createElement('div');
    alertBox.className = 'alert';
    alertBox.textContent = message;
    document.body.appendChild(alertBox);

    setTimeout(() => {
      alertBox.classList.add('show');
    }, 100); // Delay to trigger transition

    setTimeout(() => {
      alertBox.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(alertBox);
      }, 500); // Wait for the transition to complete
    }, 3000); // Show the alert for 3 seconds
  };

  return (
    <div className="table-container">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Marca</th>
            <th className="px-4 py-2">Cantidad</th>
            <th className="px-4 py-2">Tallas</th>
            <th className="px-4 py-2">Cantidad Total</th>
            <th className="px-4 py-2 actions-column">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id} className="group">
              <td className="border px-4 py-2">{item.shoe.modelName}</td>
              <td className="border px-4 py-2">{item.shoe.brand}</td>
              <td className="border px-4 py-2">{item.totalAmount}</td>
              <td className="border px-4 py-2">{item.sizes.map(size => `${size.size} (${size.amount})`).join(', ')}</td>
              <td className="border px-4 py-2">{item.totalAmount}</td>
              <td className="border px-4 py-2 text-center actions-column">
                <i className="bi bi-plus-circle text-green-500 mx-2 cursor-pointer" onClick={() => handleAddClick(item.shoe.id)}></i>
                <i className="bi bi-pencil-fill text-gray-500 mx-2 cursor-pointer"></i>
                <i className="bi bi-x text-red-500 mx-2 cursor-pointer" onClick={() => handleDeleteClick(item.shoe.id)}></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddInvModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleModalSubmit} shoeId={shoeId} />
    </div>
  );
};

export default InventoryTable;