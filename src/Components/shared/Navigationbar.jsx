import { Button, Image } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import './Navigationbar.css';
import { useContext } from 'react';
import { AuthContext } from '../../provider/AuthProvider';
import { getAuth, signOut } from 'firebase/auth';
import app from '../../firebase/firebase.config';
import Nav from 'react-bootstrap/Nav';
import '../shared/Navigationbar.css';

const Navigationbar = () => {
    const { user } = useContext(AuthContext);
    const auth = getAuth(app);
    const location = useLocation(); // Get current location

    const handleLogOut = () => {
        signOut(auth).then(() => {});
    };

    // Conditionally determine the button text and link
    const isLoginPage = location.pathname === '/login';  // If current page is login
    const isRegistrationPage = location.pathname === '/registration';  // If current page is registration

    return (
        <div>
            <section className="navbar-dark bg-dark">
                <Container>
                    <Navbar expand="lg">
                        <Navbar.Brand href="/" className="text-white">iLearing/Task4</Navbar.Brand>
                        <Navbar.Toggle />
                        <Navbar.Collapse className="justify-content-end">
                            <Nav className="mx-auto">
                                {user && <Link to="/usermanagement" className="text-white">User Management</Link>}
                            </Nav>
                            <div>
                                {user && (
                                    <Image
                                        src={user?.photoURL}
                                        alt="Profile Photo"
                                        roundedCircle
                                        fluid
                                        style={{ width: "3rem", height: "3rem" }}
                                        title={user?.displayName}
                                    />
                                )}
                            </div>
                            <Navbar.Text className="mx-3">
                                {user ? (
                                    <Button onClick={handleLogOut} variant="secondary bg-success">Logout</Button>
                                ) : (
                                    // Conditionally render either 'Login' or 'Sign Up' button
                                    isLoginPage ? (
                                        <Link to='/registration'><Button variant="secondary bg-success">Sign Up</Button></Link>
                                    ) : isRegistrationPage ? (
                                        <Link to='/login'><Button variant="secondary bg-success">Login</Button></Link>
                                    ) : (
                                        // Default to 'Sign Up' if it's not on login/registration pages
                                        <Link to='/registration'><Button variant="secondary bg-success">Sign Up</Button></Link>
                                    )
                                )}
                            </Navbar.Text>
                        </Navbar.Collapse>
                    </Navbar>
                </Container>
            </section>
        </div>
    );
};

export default Navigationbar;
