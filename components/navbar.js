import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

class Navigation extends React.Component {
    render() {
        return (
            <Navbar bg="primary" variant="dark" expand="sm">
                <Navbar.Brand>aselva.org</Navbar.Brand>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href='/'>Home</Nav.Link>
                        <Nav.Link>Projects</Nav.Link>
                        <Nav.Link href='/tn-covid'>TN COVID-19 Data</Nav.Link>
                        <Nav.Link>About</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default Navigation;
