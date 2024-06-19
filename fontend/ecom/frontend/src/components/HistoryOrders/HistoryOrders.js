import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';
import NavigationBar from '../NavigationBar/NavigationBar';
import { format } from 'date-fns';
import './HistoryOrders.css'

const Orders = () => {
    const [orderData, setOrderData] = useState([]);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await axios.get('http://127.0.0.1:8000/api/getHistoryOrders/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const orders = response.data;

                const orderDetailsPromises = orders.map(order => 
                    axios.get(`http://127.0.0.1:8000/api/getOrderDetail/${order.order_id}/`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }).then(response => ({
                        ...order,
                        details: response.data
                    }))
                );

                const ordersWithDetails = await Promise.all(orderDetailsPromises);
                setOrderData(ordersWithDetails);
            } catch (error) {
                console.error('Error fetching order:', error);
            }
        };

        fetchOrder();
    }, []);

    return (
        <div style={{backgroundColor:"var(--color-gray)"}}>
            <NavigationBar />
            <div className='container mt-3'>
                <Link to="/" className='call-back'>Quay lại</Link>
                <h5 className='mb-3 mt-3'>Đơn hàng của tôi</h5>
                {orderData.length > 0 ? (
                    orderData.map((order) => (
                        <div key={order.order_id} className="order-item">
                            <div className='order-detail'>
                                <Table className='table-order-detail'>
                                    <thead>
                                        <tr>
                                            <th style={{paddingLeft: "20px"}}>Tên sản phẩm</th>
                                            <th className='text-center'>Hình ảnh</th>
                                            <th className='text-center'>Số lượng</th>
                                            <th className='text-center'>Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.details.data.map((item, index) => (
                                            <tr key={index}>
                                                <td style={{paddingLeft: "20px"}}>{item.name}</td>
                                                <td className='text-center'><img src={`http://127.0.0.1:8000/media/${item.image}`} style={{ width: '80px', height: '90px' }} /></td>
                                                <td className='text-center'>{item.quantity}</td>
                                                <td className='text-center' style={{color:"var(--color-blue)",fontWeight:"600"}}>{item.price.toLocaleString('vi-VN')}đ</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                                <div className='order-price'>
                                    <p>Thời gian hoàn thành đơn: {format(new Date(order.time), "HH:mm dd/MM/yyyy")}</p>
                                    <p style={{color:"var(--color-blue)",fontWeight:"600"}}>Thành tiền: {order.total_price.toLocaleString('vi-VN')}đ</p>
                                </div>
                                <div className='action-order'>
                                    <div></div>
                                    <div>
                                        <button className='btn btn-primary'>Liên hệ người bán</button>
                                        <button className='btn btn-primary '>Đánh giá</button>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No orders found.</div>
                )}
            </div>
        </div>
    );
};

export default Orders;
