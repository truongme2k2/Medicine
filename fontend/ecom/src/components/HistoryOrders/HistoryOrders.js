import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import NavigationBar from '../NavigationBar/NavigationBar';
import { Table, Button } from 'react-bootstrap'; // Import Table and Button from react-bootstrap
import { format } from 'date-fns'; // Import format function from date-fns

function HistoryOrders() {
    const [orderData, setOrderData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const token = localStorage.getItem('access_token'); // Lấy token từ local storage
                const response = await axios.get('http://127.0.0.1:8000/api/getHistoryOrders/', {
                    headers: {
                        'Authorization': `Bearer ${token}` // Thêm token vào header Authorization
                    }
                });
                setOrderData(response.data);
            } catch (error) {
                console.error('Error fetching order:', error);
            }
        };

        fetchOrder();
    }, []);

    // Hàm chuyển đổi định dạng thời gian từ ISO 8601 sang ngày và giờ mong muốn
    const formatDateTime = (isoDateTime) => {
        return format(new Date(isoDateTime), "HH:mm dd/MM/yyyy");
    };

    // Hàm để xem chi tiết đơn hàng
    const handleViewDetail = (orderId) => {
        navigate(`/orderDetail/${orderId}`)
    };

    return (
        <div >
            <NavigationBar />
            <div className='container'>
                <h1>Danh sách đơn hàng</h1>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Time</th>
                            <th>Total Price</th>
                            <th>Actions</th> {/* Thêm cột mới cho nút "Detail" */}
                        </tr>
                    </thead>
                    <tbody>
                        {orderData && orderData.length > 0 ? (
                            orderData.map((order, index) => ( // Sử dụng index của mảng để hiển thị STT
                                <tr key={order.order_id}>
                                    <td>{index + 1}</td> {/* Hiển thị STT tự tăng */}
                                    <td>{formatDateTime(order.time)}</td> {/* Sử dụng hàm formatDateTime để chuyển đổi */}
                                    <td>{order.total_price}đ</td>
                                    <td>
                                        <Button className="bg-primary" onClick={() => handleViewDetail(order.order_id)}>Detail</Button> {/* Tạo nút "Detail" */}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No orders found.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

        </div>
    );
}

export default HistoryOrders;
