// InventoryTable.jsx
import React, { useState } from 'react';
import { API_URL } from '../../../../config';
import AddInvModal from '../AddInvModal/AddInvModal';
import EditReference from '../EditReference/EditReference';
import { useAuth } from '../../../../context/AuthContext';
import './InventoryTable.css';

const InventoryTable = ({ inventory, fetchInventory }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { token } = useAuth();
  const [editingShoe, setEditingShoe] = useState(null);

  const handleAddClick = (id) => {
    setEditingShoe({ id });
    setModalOpen(true);
  };

  const handleModalSubmit = async (sizes) => {
    try {
      const requestBody = JSON.stringify({
        shoeId: editingShoe.id,
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

      fetchInventory(); // Actualizar inventario después de añadir
      showAlert('Inventario actualizado');
    } catch (error) {
      console.error('Error adding sizes:', error);
      showAlert('Error al actualizar inventario');
    }
  };

  const handleEditClick = (shoe) => {
    console.log('handleEditClick:', shoe); // Debug log
    setEditingShoe(shoe);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (editedShoe) => {
    try {
      const response = await fetch(`${API_URL}shoe/${editedShoe.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedShoe)
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      showAlert('Zapato editado');
      fetchInventory(); // Update inventory after editing
    } catch (error) {
      console.error('Error editing shoe:', error);
      showAlert('Error al editar zapato');
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
      fetchInventory(); // Actualizar inventario después de eliminar
    } catch (error) {
      console.error('Error deleting shoe:', error);
      showAlert('Error al eliminar zapato');
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
            <tr key={item.shoe.id} className="group">
              <td className="border px-4 py-2">{item.shoe.modelName}</td>
              <td className="border px-4 py-2">{item.shoe.brand}</td>
              <td className="border px-4 py-2">{item.totalAmount}</td>
              <td className="border px-4 py-2">{item.sizes.map(size => `${size.size} (${size.amount})`).join(', ')}</td>
              <td className="border px-4 py-2">{item.totalAmount}</td>
              <td className="border px-4 py-2 text-center actions-column">
                <i className="bi bi-plus-circle text-green-500 mx-2 cursor-pointer" onClick={() => handleAddClick(item.shoe.id)}></i>
                <i className="bi bi-pencil-fill text-gray-500 mx-2 cursor-pointer" onClick={() => handleEditClick(item.shoe)}></i>
                <i className="bi bi-x text-red-500 mx-2 cursor-pointer" onClick={() => handleDeleteClick(item.shoe.id)}></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <AddInvModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleModalSubmit} shoeId={editingShoe?.id} />
      <EditReference isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} onSubmit={handleEditSubmit} shoeData={editingShoe} />
    </div>
  );
};

export default InventoryTable;