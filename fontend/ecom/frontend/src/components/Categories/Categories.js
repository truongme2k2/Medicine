import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, FormCheck } from 'react-bootstrap';
import './Categories.css';

function Categories({ onCategoryClick, onTypeClick, onPriceRangeClick }) {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [selectedType, setSelectedType] = useState(null);
    const [types, setTypes] = useState([]);

    const handlePriceRangeClick = (priceRange) => {
        onPriceRangeClick(priceRange);
    };

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

        const fetchTypes = async () => {
            try {
                const accessToken = localStorage.getItem('access_token');
                if (!accessToken) {
                    console.error('Access token not found in local storage');
                    return;
                }
                const response = await axios.get('http://127.0.0.1:8000/api/getAllType/', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setTypes(response.data);
            } catch (error) {
                console.error('Error fetching types:', error);
            }
        };

        fetchCategories();
        fetchTypes();
    }, []);

    const handleClick = (category_id) => {
        setSelectedCategory(category_id);
        onCategoryClick(category_id);
    };

    const handleClickType = (id) => {
        setSelectedType(id);
        onTypeClick(id);
    };

    return (
        <div style={{backgroundColor: "#ffffff", padding:"10px 20px", borderRadius:"15px"}}>
            <h5>Bộ lọc nâng cao</h5>
            <h6 style={{paddingTop:"10px" , borderTop:"1px solid #c8d0e9"}}>Danh mục sản phẩm</h6>
            <Form>
                {categories.map(category => (
                    <Form.Check
                        key={category.category_id}
                        type="checkbox"
                        id={category.category_id}
                        label={category.name}
                        checked={selectedCategory === category.category_id}
                        onChange={() => handleClick(category.category_id)}
                    />
                ))}
            </Form>

            <h6 style={{paddingTop:"10px", borderTop:"1px solid #c8d0e9"}}>Đối tượng sản phẩm</h6>
            <Form>
                {types.map(type => (
                <FormCheck 
                    key={type.id}
                    type="checkbox"
                    id={type.id}
                    label={type.name}
                    checked={selectedType === type.id}
                    onChange={() => handleClickType(type.id)}
                    />
                ))}
            </Form>
           
            <h6 style={{paddingTop:"10px", borderTop:"1px solid #c8d0e9"}}>Giá bán</h6>
            <ul className='p-0 m-0'>
                <li className='select-price' onClick={() => handlePriceRangeClick('under_100000')}>Dưới 100.000đ</li>
                <li className='select-price' onClick={() => handlePriceRangeClick('100000_to_300000')}>100.000đ đến 300.000đ</li>
                <li className='select-price' onClick={() => handlePriceRangeClick('300000_to_500000')}>300.000đ đến 500.000đ</li>
                <li className='select-price' onClick={() => handlePriceRangeClick('over_500000')}>Trên 500.000đ</li>
            </ul>
        </div>
    );
}

export default Categories;
