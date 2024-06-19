import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import NavigationBar from '../NavigationBar/NavigationBar';
import './Order.css';

const Order = () => {
    const [orderData, setOrderData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPrice, setTotalPrice] = useState(0);
    const [orderId, setOrderId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await axios.get('http://127.0.0.1:8000/api/getOrder/', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setOrderData(response.data['data']);
                setOrderId(response.data['order_id']);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching order:', error);
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, []);

    useEffect(() => {
        if (orderData && Array.isArray(orderData)) {
            const totalPrice = orderData.reduce((acc, item) => acc + item.price, 0);
            setTotalPrice(totalPrice);
        }
    }, [orderData]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const handlePayment = async () => {
        if (!orderData || orderData.length === 0) {
            alert('Chưa có mặt hàng nào trong đơn hàng của bạn!');
            return;
        }

        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.post(
                'http://127.0.0.1:8000/api/order/',
                {
                    order_id: orderId,
                    total_price: totalPrice + 30000
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            alert('Bạn đã mua hàng thành công');
            navigate('/getHistoryOrders');
            console.log('Order updated successfully:', response.data);
        } catch (error) {
            console.error('Error updating order:', error);
            throw error;
        }
    };

    return (
        <div className='body'>
            <div>
                <NavigationBar />
            </div>
            <div className='order-ctn'>
                <div className="container pt-3">
                    <Link to="/" className='call-back'>Tiếp tục mua sắm</Link>
                    <div className='row'>
                        <div className='col-8'>
                            <table className="table table-order">
                                <thead className="thead-dark">
                                    <tr>
                                        <th className='text-center'>Hình ảnh</th>
                                        <th>Tên sản phẩm</th>
                                        <th className='text-center'>Số lượng</th>
                                        <th className='text-center'>Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderData && Array.isArray(orderData) && orderData.length > 0 ? (
                                        orderData.map((item, index) => (
                                            <tr key={index}>
                                                <td className='text-center'>
                                                    <img
                                                        src={`http://127.0.0.1:8000/media/${item.img}`}
                                                        style={{ width: '80px', height: '90px' }}
                                                        className='img-product-order'
                                                    />
                                                </td>
                                                <td style={{ width: "500px" }}>{item.name}</td>
                                                <td className='text-center' style={{ width: "100px" }}>{item.quantity}</td>
                                                <td className='text-center' style={{ color: "var(--color-blue)", fontWeight: "600" }}>{item.price.toLocaleString('vi-VN')}đ</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" style={{ paddingLeft: "20px" }}>Chưa có mặt hàng nào!</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <div className='text-sale'>Giảm 20% cho đơn hàng đầu tiên</div>
                        </div>
                        <div className='col'>
                            <div className='total-price'>
                                <div className='d-flex justify-content-between'>
                                    <h6>Tổng tiền</h6>
                                    <p style={{ color: "var(--color-blue)", fontWeight: "600" }}>{totalPrice.toLocaleString('vi-VN')}đ</p>
                                </div>
                                <div className='d-flex justify-content-between'>
                                    <h6>Chi phí vận chuyển</h6>
                                    <p style={{ color: "var(--color-blue)", fontWeight: "600" }}>30.000đ</p>
                                </div>
                                <div className='d-flex justify-content-between pt-3' style={{ borderTop: "1px solid var(--color-blue-5)" }}>
                                    <h6>Thành tiền</h6>
                                    <p style={{ color: "var(--color-blue)", fontWeight: "600" }}>{(totalPrice + 30000).toLocaleString('vi-VN')}đ</p>
                                </div>
                                <button className='btn btn-primary w-100' onClick={handlePayment}>Mua hàng</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Order;
