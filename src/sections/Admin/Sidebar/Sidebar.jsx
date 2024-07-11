import React from 'react';
import './Sidebar.css';

const Sidebar = ({ setContent }) => {
  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-2">
        <img src="/logo.svg" alt="Logo" className="w-full" />
      </div>
      <nav className="mt-8">
        <ul>
          <li
            className="flex items-center justify-center p-4 hover:bg-gray-700 cursor-pointer"
            onClick={() => setContent('Contenido de Inventario')}
          >
            <i className="bi bi-box-seam text-xl mr-7"></i>
            <span>Inventario</span>
          </li>
          <li
            className="flex items-center justify-center p-4 hover:bg-gray-700 cursor-pointer"
            onClick={() => setContent('Contenido de Pedidos')}
          >
            <i className="bi bi-receipt text-xl mr-7"></i>
            <span>Pedidos</span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
