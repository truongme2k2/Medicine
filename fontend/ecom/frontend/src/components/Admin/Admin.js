import React, { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import axios from 'axios';
import NewProduct from '../NewProduct';
import ViewChart from '../ViewChart';
import ExportReport from '../ExportReport';
import NavigationBar from '../NavigationBar/NavigationBar';
import ChoosenProduct from '../ChoosenProduct';
import "./Admin.css";
import { useNavigate } from 'react-router-dom';

function Admin() {
    const [selectedComponent, setSelectedComponent] = useState(null);
    const navigate = useNavigate();

    const handleClickOne = () => {
        setSelectedComponent(<NewProduct />);
    };

    const handleClickTwo = () => {
        setSelectedComponent(<ChoosenProduct />);
    };

    const handleClickThree = () => {
        setSelectedComponent(<ViewChart />);
        openPowerBI();
    };

    const handleClickFour = () => {
        setSelectedComponent(<ExportReport />);
    };

    const openPowerBI = async () => {
        try {
            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                console.error('Access token not found in local storage');
                return;
            }

            let url = 'http://127.0.0.1:8000/api/viewChart/';

            const response = await axios.post(url, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        const userRole = localStorage.getItem('is_staff');
        if (userRole !== 'true') {
            alert("Bạn không phải là quản trị viên")
            navigate('/');
        }
    }, [navigate]);

    return (
        <div className='admin-ctn' >
            <NavigationBar />
            <div className='list-admin-ctn'>
                <div className='container' >
                    <ul className="d-flex list-admin">
                        <li onClick={handleClickOne}>Thêm mới sản phẩm</li>
                        <li onClick={handleClickTwo}>Cập nhật sản phẩm</li>
                        <li onClick={handleClickThree}>Xem báo cáo</li>
                        <li onClick={handleClickFour}>Xuất báo cáo</li>
                    </ul>
                </div>
            </div>
            <div className="container">
                <div className=" mt-3">
                    {selectedComponent}
                </div>
            </div>
        </div>
    );
}

export default Admin;
