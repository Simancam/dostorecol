import React, { useState, useEffect } from 'react';
import Marquee from '../../src/components/Marquee/Marquee';
import Header from '../sections/Home/Header/Header';
import Navbar from '../sections/Home/Navbar/Navbar';
import Cards from '../sections/Home/Cards/Cards';
import Footer from '../../src/components/Footer/Footer';
import { API_URL } from '../config';
import './Home.css';

const Home = () => {
    
    // Estado para almacenar los datos originales de los zapatos y los datos filtrados
    const [shoesData, setShoesData] = useState([]);
    const [filteredShoes, setFilteredShoes] = useState([]);

    // useEffect: Se ejecuta al montar el componente para obtener los datos de inventario desde la API y almacenarlos en los estados
    useEffect(() => {
        fetch(`${API_URL}inventory`)
            .then(response => response.json())
            .then(inventory => {
                setShoesData(inventory);
                setFilteredShoes(inventory); 
            })
            .catch(error => console.error('Error fetching shoes data:', error));
    }, []);

    // Función para filtrar zapatos según la marca seleccionada
    const handleFilter = (brand) => {
        if (brand === 'Otros') {
            setFilteredShoes(shoesData.filter(item => !['Nike', 'Adidas', 'New Balance'].includes(item.shoe.brand)));
        } else {
            setFilteredShoes(shoesData.filter(item => item.shoe.brand === brand));
        }
    };

    return (
        <>
            <Marquee text="| ‎ ‎ ‎ ENVIOS A TODA COLOMBIA ‎ ‎ ‎ | | ‎ ‎ ‎ ENVIOS A TODA COLOMBIA ‎ ‎ ‎ | | ‎ ‎ ‎ ENVIOS A TODA COLOMBIA ‎ ‎ ‎ | | ‎ ‎ ‎ ENVIOS A TODA COLOMBIA ‎ ‎ ‎ | | ‎ ‎ ‎ ENVIOS A TODA COLOMBIA ‎ ‎ ‎ | | ‎ ‎ ‎ ENVIOS A TODA COLOMBIA ‎ ‎ ‎ | | ‎ ‎ ‎ ENVIOS A TODA COLOMBIA ‎ ‎ ‎ | | ‎ ‎ ‎ ENVIOS A TODA COLOMBIA ‎ ‎ ‎ |" />
            <Header />
            <Navbar onFilter={handleFilter} />
            <Cards filteredShoes={filteredShoes} />
            <Footer />
        </>
    );
};

export default Home;
