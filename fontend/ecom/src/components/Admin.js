import React, { useState, useEffect }from 'react'
import NavigationBar from './NavigationBar'
import { ListGroup } from 'react-bootstrap';
import NewProduct from './NewProduct';
import UpdateProduct from './UpdateProduct';
import Report from './Report';
import ImportReport from './ImportReport';

function Admin() {
    const [selectedComponent, setSelectedComponent] = useState(null);
    const handleClickOne = () => {
        setSelectedComponent(<NewProduct />);
    }

    const handleClickTwo = () => {
        setSelectedComponent(<UpdateProduct />);
    }

    const handleClickThree = () => {
        setSelectedComponent(<Report />);
    }

    const handleClickFour = () => {
        setSelectedComponent(<ImportReport />);
    }

    return (
        <div>
            <div>
                <NavigationBar />
            </div>
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
    )
}

export default Admin
