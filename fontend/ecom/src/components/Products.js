import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Container, Row, Col } from 'react-bootstrap';
import './style.css'
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function Products({ categoryId }) {
    const [medicines, setMedicines] = useState([]);
    const navigate = useNavigate();

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
    }, [categoryId]);

    const handleProductClick = (med_id) => {
      // Chuyển hướng đến trang chi tiết sản phẩm với id của sản phẩm được chọn
      console.log(med_id)
      navigate(`/product/${med_id}`);
    };

    return (
        
        <Container>
            <h2>Products</h2>
            <Row  className="equal-height-row">
                {medicines.map(medicine => (
                    <Col key={medicine.med_id} md={4}>
                        <Card style={{ width: '18rem', height: '100%' }}  onClick={() => handleProductClick(medicine.med_id)}>
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
