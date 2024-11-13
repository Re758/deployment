import React, { useState, useEffect } from 'react';

const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [soldProducts, setSoldProducts] = useState([]);
    const [product, setProduct] = useState({
        id: '',
        name: '',
        description: '',
        category: '',
        price: '',
        quantity: '',
    });
    const [sellProductId, setSellProductId] = useState('');
    const [sellQuantity, setSellQuantity] = useState('');

    useEffect(() => {
        loadProducts();
        loadSoldProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products');
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            const formattedData = data.map(product => ({
                ...product,
                price: parseFloat(product.price),
            }));
            setProducts(formattedData);
        } catch (err) {
            console.error(err);
        }
    };

    const loadSoldProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/sold-products');
            if (!response.ok) throw new Error('Failed to fetch sold products');
            const data = await response.json();
            setSoldProducts(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleInputChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        const newProduct = {
            name: product.name,
            description: product.description,
            category: product.category,
            price: parseFloat(product.price),
            quantity: parseInt(product.quantity),
        };

        try {
            let response;
            if (product.id) {
                response = await fetch(`http://localhost:5000/api/products/${product.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newProduct),
                });
            } else {
                response = await fetch('http://localhost:5000/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newProduct),
                });
            }
            if (!response.ok) throw new Error('Failed to save product');
            loadProducts();
            resetProductForm();
        } catch (err) {
            console.error(err);
        }
    };

    const editProduct = (id) => {
        const productToEdit = products.find(p => p.id === id);
        setProduct({
            id: productToEdit.id,
            name: productToEdit.name,
            description: productToEdit.description,
            category: productToEdit.category,
            price: productToEdit.price.toString(),
            quantity: productToEdit.quantity.toString(),
        });
    };

    const deleteProduct = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/products/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete product');
            loadProducts();
        } catch (err) {
            console.error(err);
        }
    };

    const resetProductForm = () => {
        setProduct({
            id: '',
            name: '',
            description: '',
            category: '',
            price: '',
            quantity: '',
        });
    };

    const handleSellProduct = async (e) => {
        e.preventDefault();
        console.log("Selected Product ID:", sellProductId); // Log selected product ID
        console.log("Available Products:", products); // Log available products
    
        // Find the product to sell based on sellProductId
        const productToSell = products.find(p => p.id.toString() === sellProductId);
        
        if (!productToSell) {
            alert('Selected product not found!');   // This will trigger if product is not found
            return;
        }
    
        const quantityToSell = parseInt(sellQuantity);
        const updatedQuantity = productToSell.quantity - quantityToSell;
    
        if (updatedQuantity < 0) {
            alert("Not enough stock to sell this quantity!");
            return;
        }
    
        const soldProduct = {
            name: productToSell.name,
            quantity: quantityToSell,
            time: new Date().toLocaleString(),
        };
    
        try {
            // Update the product quantity
            const updateResponse = await fetch(`http://localhost:5000/api/products/${sellProductId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...productToSell, quantity: updatedQuantity }),
            });
            if (!updateResponse.ok) throw new Error('Failed to update product quantity');
    
            // Record the sold product
            const soldResponse = await fetch('http://localhost:5000/api/sold-products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(soldProduct),
            });
            if (!soldResponse.ok) throw new Error('Failed to record sold product');
    
            loadProducts();
            loadSoldProducts();
            setSellProductId('');
            setSellQuantity('');
        } catch (err) {
            console.error(err);
        }
    };

    const deleteSoldProduct = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/sold-products/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete sold product');
            loadSoldProducts();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>Manage Products</h2>
            <h3>Add/Edit Product</h3>
            <form onSubmit={handleProductSubmit}>
                <input type="hidden" value={product.id} />
                <label>Product Name:</label>
                <input type="text" name="name" value={product.name} required onChange={handleInputChange} />
                <label>Description:</label>
                <input type="text" name="description" value={product.description} required onChange={handleInputChange} />
                <label>Category:</label>
                <input type="text" name="category" value={product.category} required onChange={handleInputChange} />
                <label>Price:</label>
                <input type="number" name="price" value={product.price} required onChange={handleInputChange} />
                <label>Initial Quantity:</label>
                <input type="number" name="quantity" value={product.quantity} required onChange={handleInputChange} />
                <button type="submit">{product.id ? 'Update Product' : 'Add Product'}</button>
                <button type="button" onClick={resetProductForm}>Cancel</button>
            </form>

            <h3>Existing Products</h3>
            <table id="productTable">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td>{product.description}</td>
                            <td>{product.category}</td>
                            <td>{!isNaN(product.price) ? product.price.toFixed(2) : 'N/A'}</td>
                            <td>{product.quantity}</td>
                            <td>
                                <button onClick={() => editProduct(product.id)}>Edit</button>
                                <button onClick={() => deleteProduct(product.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h3>Sell Product</h3>
            <form onSubmit={handleSellProduct}>
                <label>Select Product:</label>
                <select value={sellProductId} onChange={e => setSellProductId(e.target.value)} required>
                    <option value="">Select a product</option>
                    {products.map(product => (
                        <option key={product.id} value={product.id}>{product.name}</option>
                    ))}
                </select>
                <label>Quantity to Sell:</label>
                <input type="number" value={sellQuantity} required onChange={e => setSellQuantity(e.target.value)} />
                <button type="submit">Sell Product</button>
            </form>

            <h3>Sold Products</h3>
            <table id="soldProductTable">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Quantity Sold</th>
                        <th>Time Sold</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {soldProducts.map(sold => (
                        <tr key={sold.id}>
                            <td>{sold.name}</td>
                            <td>{sold.quantity}</td>
                            <td>{sold.time}</td>
                            <td>
                                <button onClick={() => deleteSoldProduct(sold.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageProducts;