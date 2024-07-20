import React, { useEffect, useState } from 'react';
import { API_URL } from '../../../../config';
import './OrderTable.css';
import { useAuth } from '../../../../context/AuthContext';

const OrdersTable = ({ setTotalCount }) => {
  const [orders, setOrders] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_URL}order`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.json().message}`);
        }

        const order = await response.json();
        setOrders(order);
        setTotalCount(order.length);
      } catch (error) {
        console.error('Error fetching orders:', error);
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
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, status }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update order status: ${response.statusText}`);
      }

      const { newOrder } = await response.json();
      console.log(newOrder);
      setOrders((prevOrders) =>
        prevOrders.map((prevOrder) =>
          prevOrder.id === orderId ? { ...prevOrder, status: newOrder.status } : prevOrder
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="table-container">
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
          {orders.map((order) => (
            <tr key={order.id} className="group">
              <td className="border px-4 py-2">{order.clientName}</td>
              <td className="border px-4 py-2">{order.shoeId}</td>
              <td className="border px-4 py-2">{order.size}</td>
              <td className="border px-4 py-2">{order.status}</td>
              <td className="border px-4 py-2 text-center actions-column">
                <i className="bi bi-check-circle text-green-500 cursor-pointer" onClick={() => updateOrderStatus(order.id, 'Pagado')} title="Pagado"></i>
                <i className="bi bi-x-circle text-red-500 cursor-pointer ml-2" onClick={() => updateOrderStatus(order.id, 'Cancelado')} title="Cancelado"></i>
                <i className="bi bi-truck text-blue-500 cursor-pointer ml-2" onClick={() => updateOrderStatus(order.id, 'Enviado')} title="Enviado"></i>
                <i className="bi bi-box-arrow-in-down text-yellow-500 cursor-pointer ml-2" onClick={() => updateOrderStatus(order.id, 'Recibido')} title="Recibido"></i>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;