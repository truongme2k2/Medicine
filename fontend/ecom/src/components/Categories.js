import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ListGroup } from 'react-bootstrap';

function Categories({ onCategoryClick }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const accessToken = localStorage.getItem('access_token');
                if (!accessToken) {
                    console.error('Access token not found in local storage');
                    return;
                }

                const response = await axios.get('http://127.0.0.1:8000/api/getAllCategories/', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });

                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleClick = (category_id) => {
        // Gửi category_id đã chọn lên Home component
        onCategoryClick(category_id);
    };

    return (
        <div>
            <h2>Categories</h2>
            <ListGroup>
                {categories.map(category => (
                    <ListGroup.Item
                        key={category.category_id}
                        onClick={() => handleClick(category.category_id)}
                        action // Thêm prop action để biến ListGroup.Item thành một nút có thể click
                    >
                        {category.name}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
}

export default Categories;
