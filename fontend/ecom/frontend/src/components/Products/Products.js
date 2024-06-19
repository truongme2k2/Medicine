import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../style.css';
import './Products.css';

function Products({ categoryId, typeId, minPrice, maxPrice }) {
    const [medicines, setMedicines] = useState([]);
    const navigate = useNavigate();
    const [selectedSort, setSelectedSort] = useState('id');

    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                const accessToken = localStorage.getItem('access_token');
                if (!accessToken) {
                    console.error('Access token not found in local storage');
                    return;
                }
    
                let url = 'http://127.0.0.1:8000/api/getAllMedicine/';
    
                if (categoryId) {
                    url = `http://127.0.0.1:8000/api/getByCategory/${categoryId}/`;
                } else if (typeId) {
                    url = `http://127.0.0.1:8000/api/getByType/${typeId}/`;
                }else if (minPrice && maxPrice) {
                    url = `http://127.0.0.1:8000/api/getByPrice/?min=${minPrice}&max=${maxPrice}`;
                }
    
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
    
                setMedicines(response.data);
            } catch (error) {
                console.error('Error fetching medicines:', error);
            }
        };
    
        fetchMedicines();
    }, [categoryId, typeId]);

    const handleProductClick = (med_id) => {
        console.log(med_id)
        navigate(`/product/${med_id}`);
    };

    const sortMedicinesByPrice = (order) => {
        setSelectedSort(order);
        const sortedMedicines = [...medicines];
        sortedMedicines.sort((a, b) => {
            if (order === 'desc') {
                return a.buy_price - b.buy_price;
            } else if (order === 'id'){
                return a.med_id - b.med_id;
            } else {
                return b.buy_price - a.buy_price;
            }
        });
        setMedicines(sortedMedicines);
    };

    return (
        <Container>
            <div className='sort mb-3'>
                <h5 className='m-0'>Danh sách sản phẩm</h5>
                <div className='d-flex' style={{alignItems:"center"}}>
                    <h6 className='m-0' style={{paddingRight:"5px"}}>Sắp xếp theo</h6>
                    <ul className='d-flex m-0 p-0' style={{ alignItems: "center" }}>
                        <li className='item-sort' style={{ color: selectedSort === 'id' ? "#ffffff" : "#4A4F63", border: `1px solid ${selectedSort === 'id' ? "var(--color-blue)" : "#4A4F63"}`, backgroundColor: selectedSort === 'id' ? "var(--color-blue)" : "transparent" }} onClick={() => sortMedicinesByPrice('id')}>Bán chạy</li>
                        <li className='item-sort' style={{ color: selectedSort === 'asc' ? "#ffffff" : "#4A4F63", border: `1px solid ${selectedSort === 'asc' ? "var(--color-blue)" : "#4A4F63"}`, backgroundColor: selectedSort === 'asc' ? "var(--color-blue)" : "transparent" }} onClick={() => sortMedicinesByPrice('asc')}>Giá cao</li>
                        <li className='item-sort' style={{ color: selectedSort === 'desc' ? "#ffffff" : "#4A4F63", border: `1px solid ${selectedSort === 'desc' ? "var(--color-blue)" : "#4A4F63"}`, backgroundColor: selectedSort === 'desc' ? "var(--color-blue)" : "transparent" }} onClick={() => sortMedicinesByPrice('desc')}>Giá thấp</li>
                    </ul>

                </div>
            </div>
            <Row  className="equal-height-row">
                {medicines.map(medicine => (
                    <Col key={medicine.med_id} md={4} style={{marginBottom:"15px" }}>
                        <Card style={{ width: '18rem', height: '100%'}}  onClick={() => handleProductClick(medicine.med_id)} className='card'>
                            <Card.Img variant="top" src={`http://127.0.0.1:8000/media/${medicine.img}`} style={{ height:"280px"}} />
                            <Card.Body>
                                <Card.Text className='title-product'>{medicine.name}</Card.Text>
                                <Card.Text className='price-product'>{(medicine.buy_price / 1000).toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ</Card.Text>
                            </Card.Body>
                            <div className='d-flex justify-content-center'>
                                <button type='button' className='btn-primary bg-primary'>Chọn mua</button>
                            </div>
                        </Card> 
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default Products;
