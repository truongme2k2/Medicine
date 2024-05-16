import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, ListGroup, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './DetailProduct.css'
import NavigationBar from '../NavigationBar/NavigationBar';

function DetailProduct() {
    const { id } = useParams(); // Lấy id từ URL
    const [medicine, setMedicine] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();

    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
    };

    const handleBuyButtonClick = async () => {
        try {
            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                console.error('Access token not found in local storage');
                return;
            }
    
            const response = await axios.post('http://127.0.0.1:8000/api/addToCart/', {
                medicine_id: medicine.med_id,
                quantity: quantity
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
    
            console.log(response.data); // Xử lý kết quả từ server sau khi thêm vào giỏ hàng
            navigate('/cart')
        } catch (error) {
            console.error('Error adding medicine to cart:', error);
        }
    };
    

    useEffect(() => {
        const fetchMedicine = async () => {
            try {
                const accessToken = localStorage.getItem('access_token');
                if (!accessToken) {
                    console.error('Access token not found in local storage');
                    return;
                }

                const response = await axios.get(`http://127.0.0.1:8000/api/getDetailMedicine/${id}/`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setMedicine(response.data); // Lưu thông tin sản phẩm vào state
            } catch (error) {
                console.error('Error fetching medicine details:', error);
            }

        };

        fetchMedicine();
    }, [id]); // Khi id thay đổi, fetch lại thông tin của sản phẩm

    return (
        <div style={{backgroundColor:"var(--color-bg"}}>
            <div >
                <NavigationBar />
            </div>
            <div className='container ctn-product-detail'>
                <div className="row">
                    <div className="col">
                        {medicine && (
                            <Row className='ctn-card'>
                                <Col md={4}>
                                    <Card>
                                        <Card.Img variant="top" src={`http://127.0.0.1:8000/media/${medicine.img}`} alt={medicine.name} style={{ width: '100%', height: 'auto' }} />
                                    </Card>
                                </Col>
                                <Col md={8}>
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>{medicine.name}</Card.Title>
                                            <Card.Text className="description">{medicine.description}</Card.Text>
                                            <ListGroup className="list-group-flush">
                                                <ListGroup.Item>Quantity: {medicine.quantity}</ListGroup.Item>
                                                <ListGroup.Item>Category: {medicine.category}</ListGroup.Item>
                                                <ListGroup.Item className='price-product'>{(medicine.buy_price / 1000).toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ</ListGroup.Item>
                                            </ListGroup>
                                            <Form>
                                                <Form.Group controlId="quantity">
                                                    <Form.Label>Chọn số lượng</Form.Label>
                                                    <Form.Control type="number" value={quantity} onChange={handleQuantityChange} />
                                                </Form.Group>
                                                <p></p>
                                                <Button variant="primary bg-primary" onClick={handleBuyButtonClick}>Chọn mua</Button>
                                            </Form>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}

export default DetailProduct;
