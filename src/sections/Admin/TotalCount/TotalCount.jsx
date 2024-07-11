import React from 'react';
import './TotalCount.css';

const TotalCount = ({ totalCount }) => {
  return (
    <div className="total-count">
      <h2 className="text-2xl font-bold">Cantidad Total de Zapatos</h2>
      <p className="text-xl">{totalCount}</p>
    </div>
  );
};

export default TotalCount;
