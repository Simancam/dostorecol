import React, { useState } from 'react';
import AddOrderBtn from './AddOrderBtn/AddOrderBtn';
import OrdersTable from './OrderTable/OrderTable';
import AddOrderModal from './AddOrderModal/AddOrderModal';
import { useAuth } from '../../../context/AuthContext';

const OrdersContent = () => {
  const { token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddOrderClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold">Pedidos</h1>
      <AddOrderBtn onClick={handleAddOrderClick} />
      <OrdersTable setTotalCount={() => {}} />
      <AddOrderModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        token={token}
        onSuccess={() => {}}
      />
    </div>
  );
};

export default OrdersContent;
