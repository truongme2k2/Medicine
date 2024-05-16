import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown, Container, Form, FormControl, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './NavigationBar.css'

function NavigationBar({ handleSearchResult }) { // Receive handleSearchResult function as props
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.clear();
        navigate("/login");
    };

    const handleSearch = async () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            console.error('Access token not found in local storage');
            return;
        }
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/getByName/?name=${searchTerm}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            // Set searchResult using handleSearchResult function
            handleSearchResult(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    return (
        <Navbar expand="md" style={{backgroundColor:"#4084EA"}}>
            <Container>
                <Navbar.Brand href="/">
                    <span style={{ color: "#ffffff", fontSize: "30px", fontWeight:"bolder"}}>IHC Pharmacy</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Form inline className="ml-auto align-items-center mr-auto d-flex">
                        <FormControl type="text" placeholder="Tìm kiếm" className="mr-sm-2" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <Button variant="outline-light" onClick={handleSearch}>Tìm</Button>
                    </Form>
                    <Nav className="ml-auto align-items-center">
                        <Nav.Link href="/cart">
                            <div className='link-cart'>
                                <svg width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 0.857143C0 0.383756 0.383756 0 0.857143 0H1.49516C2.58141 0 3.2318 0.730277 3.60371 1.40914C3.85162 1.86165 4.03095 2.38649 4.17123 2.86166C4.20922 2.85867 4.2477 2.85714 4.28663 2.85714H18.5692C19.518 2.85714 20.2032 3.76505 19.943 4.67748L17.8542 12.0022C17.4692 13.3522 16.2357 14.2832 14.8319 14.2832H8.03402C6.61861 14.2832 5.37783 13.337 5.00323 11.9721L4.1341 8.8052L2.6957 3.94946L2.69337 3.94096C2.51542 3.29201 2.34842 2.68577 2.10026 2.2328C1.85927 1.79292 1.66716 1.71429 1.49516 1.71429H0.857143C0.383756 1.71429 0 1.33053 0 0.857143ZM7.42857 20C8.69094 20 9.71429 18.9767 9.71429 17.7143C9.71429 16.4519 8.69094 15.4286 7.42857 15.4286C6.16621 15.4286 5.14286 16.4519 5.14286 17.7143C5.14286 18.9767 6.16621 20 7.42857 20ZM15.4286 20C16.6909 20 17.7143 18.9767 17.7143 17.7143C17.7143 16.4519 16.6909 15.4286 15.4286 15.4286C14.1662 15.4286 13.1429 16.4519 13.1429 17.7143C13.1429 18.9767 14.1662 20 15.4286 20Z" fill="currentColor"></path>
                                </svg>
                                <h6 className='m-0'>Giỏ hàng</h6>
                            </div>
                        </Nav.Link>
                        <NavDropdown title="Người dùng" id="basic-nav-dropdown" alignRight className='navbar-user'>
                            <NavDropdown.Item href="/getHistoryOrders">Lịch sử giao dịch</NavDropdown.Item>
                            <NavDropdown.Item href="/updatePassword">Thay đổi mật khẩu</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={handleLogout}>Đăng xuất</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;
