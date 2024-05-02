import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, ListGroup, Row, Col, Form, Button } from 'react-bootstrap';
import './style.css'
import NavigationBar from './NavigationBar';
import Categories from './Categories';

function DetailProduct() {
    const { id } = useParams(); // Lấy id từ URL
    const [medicine, setMedicine] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const handleQuantityChange = (event) => {
        setQuantity(event.target.value);
    };

    const handleBuyButtonClick = () => {
        // Xử lý khi người dùng nhấn vào nút mua
        console.log('Buy button clicked with quantity:', quantity);
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
        <div>
            <div>
                <NavigationBar />
            </div>
            <div className="row">
                <div className="col-md-3">
                    <Categories />
                </div>
                <div className="col-md-9">
                    <h2>Product Details</h2>
                    {medicine && (
                        <Row >
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
                                            <ListGroup.Item>Import Price: {medicine.import_price}</ListGroup.Item>
                                            <ListGroup.Item>Buy Price: {medicine.buy_price}</ListGroup.Item>
                                        </ListGroup>
                                        <Form>
                                            <Form.Group controlId="quantity">
                                                <Form.Label>Quantity</Form.Label>
                                                <Form.Control type="number" value={quantity} onChange={handleQuantityChange} />
                                            </Form.Group>
                                            <p></p>
                                            <Button variant="primary" onClick={handleBuyButtonClick}>Buy</Button>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    )}
                </div>

            </div>
        </div>
    );
}

export default DetailProduct;
