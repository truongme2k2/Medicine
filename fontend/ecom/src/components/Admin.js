import React, { useState, useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import axios from 'axios';
import NewProduct from './NewProduct';
import ViewChart from './ViewChart';
import ExportReport from './ExportReport';
import NavigationBar from './NavigationBar/NavigationBar';
import ChoosenProduct from './ChoosenProduct';

function Admin() {
    const [selectedComponent, setSelectedComponent] = useState(null);

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

    return (
        <div>
            <NavigationBar />
            <div className="container">
                <div className="row">
                    <div className="col-md-3">
                        <ListGroup>
                            <ListGroup.Item onClick={handleClickOne}>Thêm mới sản phẩm</ListGroup.Item>
                            <ListGroup.Item onClick={handleClickTwo}>Cập nhật sản phẩm</ListGroup.Item>
                            <ListGroup.Item onClick={handleClickThree}>Xem báo cáo</ListGroup.Item>
                            <ListGroup.Item onClick={handleClickFour}>Xuất báo cáo</ListGroup.Item>
                        </ListGroup>
                    </div>
                    <div className="col-md-9">
                        {selectedComponent}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Admin;
