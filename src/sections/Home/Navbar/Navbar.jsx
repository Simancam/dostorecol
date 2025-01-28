import React, { useState } from 'react';

// Componente Navbar
const Navbar = ({ onFilter, activeFilter }) => {
    const brands = ['Todos', 'Nike', 'Adidas', 'Puma', 'New Balance', 'Reebok'];
    
    return (
        <nav className="w-full bg-white shadow-md p-4">
            <div className="flex justify-center space-x-8">
                {brands.map((brand) => (
                    <button
                        key={brand}
                        onClick={() => onFilter(brand)}
                        className={`relative px-3 py-2 text-lg transition-colors duration-300
                            ${activeFilter === brand 
                                ? 'text-red-600 font-medium' 
                                : 'text-gray-600 hover:text-red-400'
                            }`}
                    >
                        {brand}
                        <div
                            className={`absolute bottom-0 left-0 w-full h-0.5 transition-transform duration-300
                                ${activeFilter === brand 
                                    ? 'bg-red-600 scale-x-100' 
                                    : 'bg-red-400 scale-x-0'
                                } 
                                hover:scale-x-100 origin-left`}
                        />
                    </button>
                ))}
            </div>
        </nav>
    );
};

// Componente principal
const ShoeCatalog = () => {
    const [activeFilter, setActiveFilter] = useState('Todos');
    const [shoes] = useState([
        {
            "id": 1,
            "imageUrl": "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/skwgyqrbfzhu6uyeh0gg/air-max-90-shoes-kRsBnD.png",
            "modelName": "Nike Air Max 90",
            "brand": "Nike",
            "description": "Un clásico atemporal con una amortiguación cómoda y diseño icónico.",
            "price": 450000,
            "sizes": [38, 39, 40, 41, 42, 43, 44],
            "category": "Deportivo"
          },
          {
            "id": 2,
            "imageUrl": "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fbaf991a78bc4896a3e9ad7800abcec6_9366/Ultraboost_22_Shoes_Black_GZ0127_01_standard.jpg",
            "modelName": "Adidas Ultraboost 22",
            "brand": "Adidas",
            "description": "Máximo confort y rendimiento con tecnología Boost para mejor retorno de energía.",
            "price": 600000,
            "sizes": [37, 38, 39, 40, 41, 42, 43, 44],
            "category": "Running"
          },
          {
            "id": 3,
            "imageUrl": "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/368499/02/sv01/fnd/PNA/fmt/png/RS-X-Efekt-Shoes",
            "modelName": "Puma RS-X",
            "brand": "Puma",
            "description": "Diseño retro-futurista con excelente amortiguación y estilo urbano.",
            "price": 380000,
            "sizes": [38, 39, 40, 41, 42, 43],
            "category": "Casual"
          },
          {
            "id": 4,
            "imageUrl": "https://nb.scene7.com/is/image/NB/ml574evn_nb_02_i?$pdpflexf2$&wid=440&hei=440",
            "modelName": "New Balance 574",
            "brand": "New Balance",
            "description": "Comodidad y estilo en un zapato versátil para cualquier ocasión.",
            "price": 420000,
            "sizes": [39, 40, 41, 42, 43, 44, 45],
            "category": "Casual"
          },
          {
            "id": 5,
            "imageUrl": "https://assets.reebok.com/images/h_840,f_auto,q_auto:sensitive,fl_lossy,c_fill,g_auto/a3683f33720a45ea82a3ac8a00f91fd7_9366/Classic_Leather_Shoes_White_49797_01_standard.jpg",
            "modelName": "Reebok Classic Leather",
            "brand": "Reebok",
            "description": "Un icono del streetwear con diseño elegante y atemporal.",
            "price": 350000,
            "sizes": [38, 39, 40, 41, 42, 43, 44],
            "category": "Casual"
          }
    ]);

    // Filtrar los zapatos basado en la marca seleccionada
    const filteredShoes = activeFilter === 'Todos' 
        ? shoes 
        : shoes.filter(shoe => shoe.brand === activeFilter);

    const handleFilter = (brand) => {
        setActiveFilter(brand);
        console.log('Filtering by:', brand); // Para debugging
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar onFilter={handleFilter} activeFilter={activeFilter} />
            
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredShoes.map(shoe => (
                        <div key={shoe.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <img 
                                src={shoe.imageUrl} 
                                alt={shoe.modelName}
                                className="w-full h-64 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-xl font-bold">{shoe.modelName}</h3>
                                <p className="text-gray-600">{shoe.brand}</p>
                                <p className="text-red-600 font-bold mt-2">
                                    ${shoe.price.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShoeCatalog;