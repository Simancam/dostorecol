import React, { useEffect, useState } from 'react';
import { API_URL } from '../../../../config';
import { useAuth } from '../../../../context/AuthContext';
import './OrderTable.css';

const OrdersTable = ({ setTotalCount }) => {
  const [orders, setOrders] = useState([]);
  const { token } = useAuth();
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}order`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const fetchedOrders = await response.json();
        // Ordenar las órdenes por estado
        const sortedOrders = fetchedOrders.sort((a, b) => {
          const orderPriority = {
            'Pagado': 1,
            'Enviado': 2,
            'Recibido': 3,
            'Cancelado': 4
          };
          return orderPriority[a.status] - orderPriority[b.status];
        });
        setOrders(sortedOrders);
        setTotalCount(sortedOrders.length);
      } catch (error) {
        console.error('Error fetching orders:', error);
        handleAlert('Failed to fetch orders', 'error');
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [setTotalCount, token]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await fetch(`${API_URL}order`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      const { newOrder } = await response.json();
      setOrders((prevOrders) =>
        prevOrders.map((prevOrder) =>
          prevOrder.id === orderId ? { ...prevOrder, status: newOrder.status } : prevOrder
        )
      );
      handleAlert(`Order status updated to ${status}`, 'success');
    } catch (error) {
      console.error('Error updating order status:', error);
      handleAlert('Failed to update order status', 'error');
    }
  };

  const handleAlert = (message, type) => {
    setAlertContent(message);
    setAlertType(type);
    setShowAlert(true);
    console.log('Alert should be shown with message:', message);

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  // Calcular el índice del primer y último elemento de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="table-container">
      {showAlert && (
        <div className={`alert ${alertType} ${showAlert ? 'show' : ''}`}>
          {alertContent}
        </div>
      )}
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">ID del Zapato</th>
            <th className="px-4 py-2">Talla</th>
            <th className="px-4 py-2">Estado</th>
            <th className="px-4 py-2 actions-column">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((order) => (
            <tr key={order.id} className="group">
              <td className="border px-4 py-2">{order.clientName}</td>
              <td className="border px-4 py-2">{order.shoeId}</td>
              <td className="border px-4 py-2">{order.size}</td>
              <td className="border px-4 py-2">{order.status}</td>
              <td className="border px-4 py-2 text-center actions-column">
                <i
                  className="bi bi-check-circle text-green-500 cursor-pointer"
                  onClick={() => updateOrderStatus(order.id, 'Pagado')}
                  title="Pagado"
                ></i>
                <i
                  className="bi bi-x-circle text-red-500 cursor-pointer ml-2"
                  onClick={() => updateOrderStatus(order.id, 'Cancelado')}
                  title="Cancelado"
                ></i>
                <i
                  className="bi bi-truck text-blue-500 cursor-pointer ml-2"
                  onClick={() => updateOrderStatus(order.id, 'Enviado')}
                  title="Enviado"
                ></i>
                <i
                  className="bi bi-box-arrow-in-down text-yellow-500 cursor-pointer ml-2"
                  onClick={() => updateOrderStatus(order.id, 'Recibido')}
                  title="Recibido"
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
        
        {Array.from({ length: Math.ceil(orders.length / itemsPerPage) }).map((_, index) => (
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
          disabled={currentPage === Math.ceil(orders.length / itemsPerPage)}
        >
          Siguiente
        </button>
        
        <span className="pagination-info">
          Página {currentPage} de {Math.ceil(orders.length / itemsPerPage)}
        </span>
      </div>
    </div>
  );
};

export default OrdersTable;