import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import NavigationBar from '../NavigationBar/NavigationBar';
import { format } from 'date-fns';

const OrderDetail = () => {
  const [orderData, setOrderData] = useState(null);
  const { orderId } = useParams();

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`http://127.0.0.1:8000/api/getOrderDetail/${orderId}/`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }); // Thay đổi ID của đơn hàng tại đây nếu cần
        setOrderData(response.data);
        console.log(orderData)
      } catch (error) {
        console.error('Error fetching order detail:', error);
      }
    };

    fetchOrderDetail();
  }, []);

  return (
    <div className="container">
      <NavigationBar />
      <h1>Order Details</h1>
      {orderData && (
        <div>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Image</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {orderData.data.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td><img src={`http://127.0.0.1:8000/media/${item.img}`} style={{ width: '50px', height: '50px' }} /></td>
                  <td>{item.quantity}</td>
                  <td>{item.price}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div>
            <p>Time: {format(new Date(orderData.order.time), "HH:mm dd/MM/yyyy")}</p>
            <p>Total Price: {orderData.order.total_price}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetail;
