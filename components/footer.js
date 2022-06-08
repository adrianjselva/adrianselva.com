import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

class Footer extends React.Component {
    render() {
        return (
        <Navbar className="justify-content-center" bg="primary" variant="dark" expand="sm" sticky="bottom">
            <Nav className="justify-content-center">
                <Nav.Item>
                        <Nav.Link href="http://github.com/adrianjselva">Github</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                        <Nav.Link href="https://www.linkedin.com/in/adrian-selva-a72298176/">LinkedIn</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                        <Nav.Link href="mailto:selva.a@northeastern.edu">Email</Nav.Link>
                </Nav.Item>
            </Nav>
        </Navbar>
        );
    }
}

export default Footer;
