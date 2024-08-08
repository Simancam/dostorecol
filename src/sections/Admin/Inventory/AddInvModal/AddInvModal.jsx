import React, { useState } from 'react';
import { Button, TextInput, Spinner, Alert } from 'flowbite-react';
import './AddInvModal.css';

const AddInvModal = ({ isOpen, onClose, onSubmit, shoeId }) => {
  const [sizes, setSizes] = useState([{ size: '', amount: '' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState('');
  const [alertType, setAlertType] = useState('success');

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...sizes];
    newSizes[index][field] = value;
    setSizes(newSizes);
  };

  const addSizeField = () => {
    setSizes([...sizes, { size: '', amount: '' }]);
  };

  const handleAlert = (message, type) => {
    setAlertContent(message);
    setAlertType(type);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(sizes);
      handleAlert('Tallas añadidas correctamente', 'success');
      setSizes([{ size: '', amount: '' }]);
    } catch (error) {
      handleAlert('Error al añadir las tallas', 'error');
      console.error('Error en la solicitud:', error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <div className={`custom-modal ${isOpen ? 'show' : ''}`}>
      <div className="custom-modal-content">
        <div className="custom-modal-header">
          <h2>Añadir Tallas</h2>
          <button onClick={onClose}>&times;</button>
        </div>
        <div className="custom-modal-body">
          {showAlert && (
            <div className={`alert ${alertType} ${showAlert ? 'show' : ''}`}>
              {alertContent}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
            <div className="w-full sm:w-1/2">
              {sizes.map((item, index) => (
                <div key={index} className="flex items-center gap-2 mb-2">
                  <TextInput
                    placeholder="Talla"
                    type="number"
                    value={item.size}
                    onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <TextInput
                    placeholder="Cantidad"
                    type="number"
                    value={item.amount}
                    onChange={(e) => handleSizeChange(index, 'amount', e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              ))}
              <Button color="gray" onClick={addSizeField} disabled={isLoading}>
                +
              </Button>
            </div>
            <div className="w-full flex justify-end space-x-2">
              <Button type="button" color="gray" onClick={onClose} disabled={isLoading}>
                Cancelar
              </Button>
              <Button type="submit" color="blue" disabled={isLoading}>
                {isLoading ? (
                  <Spinner size="sm" />
                ) : (
                  'Guardar'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddInvModal;