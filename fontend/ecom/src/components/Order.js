import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import NavigationBar from './NavigationBar/NavigationBar';

const Order = () => {
    const [orderData, setOrderData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [totalPrice, setTotalPrice] = useState(0);
    const [orderId, setOrderId] = useState(null)
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const token = localStorage.getItem('access_token'); // Lấy token từ local storage
                const response = await axios.get('http://127.0.0.1:8000/api/getOrder/', {
                    headers: {
                        'Authorization': `Bearer ${token}` // Thêm token vào header Authorization
                    }
                });
                setOrderData(response.data['data']);
                setOrderId(response.data['order_id'])

                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching order:', error);
                setIsLoading(false);
            }
        };

        fetchOrder();
    }, []);

    useEffect(() => {
        // Tính tổng giá trị của tất cả các mặt hàng trong đơn hàng
        if (orderData && Array.isArray(orderData)) {
            const totalPrice = orderData.reduce((acc, item) => acc + item.price, 0);
            setTotalPrice(totalPrice);
        }
    }, [orderData]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const handlePayment = async () => {
        try {
            const token = localStorage.getItem('access_token'); // Lấy token từ local storage
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
            // Xử lý dữ liệu response nếu cần
            navigate('/')
            console.log('Order updated successfully:', response.data);
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error('Error updating order:', error);
            throw error; // Ném lỗi để xử lý ở mức cao hơn nếu cần
        }
    };


    return (
        <div >
            <div>
                <NavigationBar />
            </div>
            <div className="container">
                <h1>Order Details</h1>
                <table className="table">
                    <thead className="thead-dark">
                        <tr>
                            <th>Name</th>
                            <th>Image</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            {/* Add more headers as needed */}
                        </tr>
                    </thead>
                    <tbody>
                        {orderData && Array.isArray(orderData) && orderData.length > 0 ? (
                            orderData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td><img src={`http://127.0.0.1:8000/media/${item.img}`} style={{ width: '50px', height: '50px' }} /></td>
                                    <td>{item.quantity}</td>
                                    <td>{item.price} VND</td>
                                    {/* Add more cells as needed */}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">Chưa có mặt hàng nào.</td>
                            </tr>
                        )}
                        <tr>
                            <td>Phí vận chuyển cố định</td>
                            <td></td>
                            <td></td>
                            <td>30000 VND</td>
                        </tr>
                        <tr>
                            <td>Tổng hóa đơn</td>
                            <td></td>
                            <td></td>
                            <td>{totalPrice + 30000} VND</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td><button className="btn btn-primary bg-primary" onClick={handlePayment} >Thanh toán</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>


        </div>
    );

};

export default Order;
