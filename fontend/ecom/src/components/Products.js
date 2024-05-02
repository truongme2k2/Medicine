import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col } from 'react-bootstrap';
import './style.css'

function Products() {
    const [medicines, setMedicines] = useState([]);

    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                const accessToken = localStorage.getItem('access_token');
                if (!accessToken) {
                    console.error('Access token not found in local storage');
                    return;
                }

                const response = await axios.get('http://127.0.0.1:8000/api/getAllMedicine/', {
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
    }, []);

    return (
        <Container>
            <h2>Products</h2>
            <Row  className="equal-height-row">
                {medicines.map(medicine => (
                    <Col key={medicine.med_id} md={4}>
                        <Card style={{ width: '18rem', height: '100%' }}>
                            <Card.Img variant="top" src={`http://127.0.0.1:8000/media/${medicine.img}`} />
                            <Card.Body>
                                <Card.Title>{medicine.name}</Card.Title>
                                <Card.Text className="description">{medicine.description}</Card.Text>
                                <Card.Text>Số lượng: {medicine.quantity}</Card.Text>
                                <Card.Text>Giá bán: {medicine.buy_price}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default Products;
