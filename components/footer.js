import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

class Footer extends React.Component {
    render() {
        return (
        <Navbar className="justify-content-center" bg="primary" variant="dark" expand="lg" fixed="bottom">
            <Nav className="justify-content-center">
                <Nav.Item> 
                        <Nav.Link>Github</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                        <Nav.Link>
                            Twitter
                        </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                        <Nav.Link>Email</Nav.Link>
                </Nav.Item>
            </Nav>
        </Navbar>
        );
    }
}

export default Footer;