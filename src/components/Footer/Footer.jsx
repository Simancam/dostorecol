import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="bg-black text-white py-6">
            <div className="w-full max-w-screen-xl mx-auto px-4 md:px-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-6 sm:space-y-0">
                    <div className="text-center sm:text-left">
                        <img src="/logo.svg" alt="Logo" className="footer-logo mb-4" />
                        <div className="flex flex-col items-center sm:items-start space-y-2">
                            <a href="mailto:example@example.com" className="footer-link flex items-center space-x-2">
                                <i className="bi bi-envelope"></i>
                                <span className="footer-text">example@example.com</span>
                            </a>
                            <a href="tel:+1234567890" className="footer-link flex items-center space-x-2">
                                <i className="bi bi-telephone"></i>
                                <span className="footer-text">+123 456 7890</span>
                            </a>
                        </div>
                    </div>
                    <div className="flex justify-center sm:justify-start space-x-6">
                        <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer" className="footer-icon text-2xl">
                            <i className="bi bi-whatsapp"></i>
                        </a>
                        <a href="https://www.instagram.com/dostore.col/" target="_blank" rel="noopener noreferrer" className="footer-icon text-2xl">
                            <i className="bi bi-instagram"></i>
                        </a>
                    </div>
                </div>
                <span className="block text-sm text-gray-400 text-center mt-6">© 2024 Dostorecol. Todos los derechos reservados.</span>
            </div>
        </footer>
    );
};

export default Footer;