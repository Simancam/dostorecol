import React from 'react';
import Marquee from '../components/Marquee/Marquee';
import ProductDetail from '../components/ProductDetail/ProductDetail';
import Footer from '../components/Footer/Footer';
import './Detail.css';

const Detail = () => (
    <>
        <Marquee text="| ‎ ‎ ‎ ENVIOS A TODA COLOMBIA ‎ ‎ ‎ | | ‎ ‎ ‎ ENVIOS A TODA COLOMBIA ‎ ‎ ‎ | | ‎ ‎ ‎ ENVIOS A TODA COLOMBIA ‎ ‎ ‎ | | ‎ ‎ ‎ ENVIOS A TODA COLOMBIA ‎ ‎ ‎ | | ‎ ‎ ‎ ENVIOS A TODA COLOMBIA ‎ ‎ ‎ | | ‎ ‎ ‎ ENVIOS A TODA COLOMBIA ‎ ‎ ‎ | | ‎ ‎ ‎ ENVIOS A TODA COLOMBIA ‎ ‎ ‎ | | ‎ ‎ ‎ ENVIOS A TODA COLOMBIA ‎ ‎ ‎ |" />
        <div className="desktop-ml-58">
            <div className="animate-fade-in">
                <ProductDetail />
            </div>
        </div>
        <Footer />
    </>
);

export default Detail;