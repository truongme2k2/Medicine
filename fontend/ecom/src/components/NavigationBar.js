import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function NavigationBar() {
    const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

    const handleLogout = () => {
        localStorage.removeItem("access_token")
        localStorage.clear();
        navigate("/login");
    };

    return (
        <Navbar bg="light" expand="md">
            <Container>
                <Navbar.Brand href="/">
                    <span style={{ color: "#39BAF0", fontSize: "40px" }}>IHC Pharmacy</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto align-items-center">
                        <Nav.Link href="/cart">
                            <img src="./static/images/cart.png" width="50" height="50" />
                        </Nav.Link>
                        <NavDropdown title="User" id="basic-nav-dropdown" alignRight>
                            <NavDropdown.Item href="/orderHistory">Order History</NavDropdown.Item>
                            <NavDropdown.Item href="/updatePassword">Update Password</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavigationBar;
