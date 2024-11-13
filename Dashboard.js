import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    
    const images = [
        '/food1.png',
        '/food2.png',
        '/food3.png',
        '/drink4.png',
        '/drink3.png',
        '/drink6.png'
    ];

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const calculateTotalStockValue = () => {
        return products.reduce((total, product) => {
            const price = parseFloat(product.price) || 0; 
            const quantity = parseInt(product.quantity) || 0;
            return total + price * quantity;
        }, 0).toFixed(2);
    };

    const chartData = products.map(product => ({
        name: product.name,
        quantity: product.quantity
    }));

    // Image rotating logic
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % images.length);
        }, 3000); // Change image every 3 seconds
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="dashboard-container">
            {/* Image Carousel */}
            <div className="image-carousel">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Slide ${index + 1}`}
                        className={`animated-image ${currentIndex === index ? 'show' : 'hide'}`}
                    />
                ))}
            </div>

            <h2>Stock Levels Available Currently</h2>
            <div className="table-container">
                <table id="stockTable">
                    <thead>
                        <tr>
                            <th><b>Name</b></th>
                            <th><b>Description</b></th>
                            <th><b>Category</b></th>
                            <th><b>Price</b></th>
                            <th><b>Quantity</b></th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>{product.description}</td>
                                    <td>{product.category}</td>
                                    <td>{parseFloat(product.price).toFixed(2)}</td>
                                    <td>{product.quantity}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No products available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <h3>Total stock value: ${calculateTotalStockValue()}</h3>
            {products.length > 0 && (
                <div className="bar-chart-container">
                    <h3 className="bar-chart-title">Product Quantity Chart</h3>
                    <BarChart width={600} height={300} data={chartData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Bar dataKey="quantity" fill="#8884d8" />
                    </BarChart>
                </div>
            )}
        </div>
    );
};

export default Dashboard;