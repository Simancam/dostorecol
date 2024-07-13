// src/components/OrdersContent.js
import React, { useState } from 'react';
import AddOrderBtn from './AddOrderBtn/AddOrderBtn';
import OrdersTable from './OrderTable/OrderTable';
import AddOrderModal from './AddOrderModal/AddOrderModal';
import { useAuth } from '../../../context/AuthContext';
import { Alert } from 'flowbite-react';

const OrdersContent = () => {
  const { token } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const handleAddOrderClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    setShowSuccessAlert(true);
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 2000);
  };

  return (
    <div>
      {showSuccessAlert && (
        <div className="fixed top-4 right-4 z-50">
          <Alert color="green">
            Orden añadida correctamente
          </Alert>
        </div>
      )}
      <h1 className="text-4xl font-bold">Pedidos</h1>
      <AddOrderBtn onClick={handleAddOrderClick} />
      <OrdersTable setTotalCount={() => {}} />
      <AddOrderModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        token={token}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default OrdersContent;
