import React, { useState } from 'react';
import './AddInvModal.css';
import { Spinner } from 'flowbite-react';

const AddInvModal = ({ isOpen, onClose, onSubmit, shoeId }) => {
  const [sizes, setSizes] = useState([{ size: '', amount: '' }]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...sizes];
    newSizes[index][field] = value;
    setSizes(newSizes);
  };

  const addSizeField = () => {
    setSizes([...sizes, { size: '', amount: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await onSubmit(sizes);
    setSizes([{ size: '', amount: '' }]);  
    setIsLoading(false);
    onClose();
  };

  return (
    <div className={`custom-modal ${isOpen ? 'show' : ''}`}>
      <div className="custom-modal-content">
        <div className="custom-modal-header">
          <h2>Añadir Tallas</h2>
          <button onClick={onClose}>&times;</button>
        </div>
        <div className="custom-modal-body">
          <form onSubmit={handleSubmit}>
            {sizes.map((item, index) => (
              <div key={index} className="size-entry">
                <label>Talla:</label>
                <input
                  type="number"
                  value={item.size}
                  onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                  required
                />
                <label>Cantidad:</label>
                <input
                  type="number"
                  value={item.amount}
                  onChange={(e) => handleSizeChange(index, 'amount', e.target.value)}
                  required
                />
              </div>
            ))}
            <button type="button" onClick={addSizeField} className="add-size-btn">+</button>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? (
                <Spinner
                  size="sm"
                  light={true}
                  className="mr-2"
                />
              ) : 'Guardar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddInvModal;