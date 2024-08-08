import React, { useState, useEffect } from 'react';
import { API_URL } from '../../../../config';
import AddInvModal from '../AddInvModal/AddInvModal';
import EditShoeForm from '../EditReference/EditReference';
import { useAuth } from '../../../../context/AuthContext';
import './InventoryTable.css';

const InventoryTable = ({ inventory, fetchInventory }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { token } = useAuth();
  const [editingShoe, setEditingShoe] = useState(null);
  const [sortedInventory, setSortedInventory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const sorted = [...inventory].sort((a, b) =>
      a.shoe.modelName.localeCompare(b.shoe.modelName)
    );
    setSortedInventory(sorted);
  }, [inventory]);

  useEffect(() => {
    const interval1 = setTimeout(() => {
      fetchInventory();
    }, 5000); // 5 segundos

    const interval2 = setTimeout(() => {
      fetchInventory();
    }, 10000); // 10 segundos

    return () => {
      clearTimeout(interval1);
      clearTimeout(interval2);
    };
  }, [fetchInventory]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedInventory.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddClick = (id) => {
    setEditingShoe({ id });
    setModalOpen(true);
  };

  const handleModalSubmit = async (sizes) => {
    try {
      const requestBody = JSON.stringify({
        shoeId: editingShoe.id,
        sizes: sizes.map((size) => parseInt(size.size)),
        amounts: sizes.map((size) => parseInt(size.amount)),
      });
      const response = await fetch(`${API_URL}inventory`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      showAlert({ type: 'success', message: 'Inventario actualizado' });
      await fetchInventory();
      setModalOpen(false);
    } catch (error) {
      console.error('Error adding sizes:', error);
      showAlert({ type: 'error', message: 'Error al actualizar inventario' });
    }
  };

  const handleEditClick = (shoe) => {
    setEditingShoe(shoe);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (editedShoe) => {
    try {
      const response = await fetch(`${API_URL}shoe/${editedShoe.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedShoe),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      showAlert({ type: 'success', message: 'Zapato editado' });
      await fetchInventory();
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error editing shoe:', error);
      showAlert({ type: 'error', message: 'Error al editar zapato' });
    }
  };

  const handleDeleteClick = async (id) => {
    try {
      const response = await fetch(`${API_URL}shoe/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      showAlert({ type: 'success', message: 'Zapato eliminado' });
      await fetchInventory();
    } catch (error) {
      console.error('Error deleting shoe:', error);
      showAlert({ type: 'error', message: 'Error al eliminar zapato' });
    }
  };

  const showAlert = (alertObj) => {
    const alertBox = document.createElement('div');
    alertBox.className = `alert ${alertObj.type}`;
    alertBox.textContent = alertObj.message;
    document.body.appendChild(alertBox);

    setTimeout(() => {
      alertBox.classList.add('show');
    }, 100);

    setTimeout(() => {
      alertBox.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(alertBox);
      }, 500);
    }, 3000);
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
          {currentItems.map((item) => (
            <tr key={item.shoe.id} className="group">
              <td className="border px-4 py-2">{item.shoe.modelName}</td>
              <td className="border px-4 py-2">{item.shoe.brand}</td>
              <td className="border px-4 py-2">{item.totalAmount}</td>
              <td className="border px-4 py-2">
                {item.sizes.map((size) => `${size.size} (${size.amount})`).join(', ')}
              </td>
              <td className="border px-4 py-2">{item.totalAmount}</td>
              <td className="border px-4 py-2 text-center actions-column">
                <i
                  className="bi bi-plus-circle text-green-500 mx-2 cursor-pointer"
                  onClick={() => handleAddClick(item.shoe.id)}
                ></i>
                <i
                  className="bi bi-pencil-fill text-gray-500 mx-2 cursor-pointer"
                  onClick={() => handleEditClick(item.shoe)}
                ></i>
                <i
                  className="bi bi-x text-red-500 mx-2 cursor-pointer"
                  onClick={() => handleDeleteClick(item.shoe.id)}
                ></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </button>

        {Array.from({ length: Math.ceil(sortedInventory.length / itemsPerPage) }).map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
          </button>
        ))}

        <button
          className="pagination-button"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(sortedInventory.length / itemsPerPage)}
        >
          Siguiente
        </button>

        <span className="pagination-info">
          Página {currentPage} de {Math.ceil(sortedInventory.length / itemsPerPage)}
        </span>
      </div>
      <AddInvModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        shoeId={editingShoe?.id}
      />
      <EditShoeForm
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        item={editingShoe}
        token={token}
        fetchInventory={fetchInventory}
        setAlert={showAlert}
      />
    </div>
  );
};

export default InventoryTable;
