import { Button, Image} from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import './Navigationbar.css';
import { useContext } from 'react';
import { AuthContext } from '../../provider/AuthProvider';
import { getAuth, signOut } from 'firebase/auth';
import app from '../../firebase/firebase.config';
import Nav from 'react-bootstrap/Nav';
import '../shared/Navigationbar.css'

const Navigationbar = () => {

    const { user } = useContext(AuthContext);
    const auth = getAuth(app);
    const handleLogOut = () => {
        signOut(auth)
            .then(() => { })
           
    };

    return (
        <div>
            <section className="bg-body-tertiary">
                <Container>
                    <Navbar expand="lg"> {/* Added Navbar wrapper */}
                        <Navbar.Brand href="/">Task 3</Navbar.Brand>
                        <Navbar.Toggle />
                        <Navbar.Collapse className="justify-content-end">
                            <Nav className="mx-auto">
                                {user && <Link to="/usermanagement">User Management</Link>}
                            </Nav>
                            <div >
                                {user &&
                                    <Image
                                        src={user?.photoURL}
                                        alt="Profile Photo"
                                        roundedCircle // Apply Bootstrap's roundedCircle class
                                        fluid // Make the image responsive
                                        style={{ width: "3rem", height: "3rem" }}
                                        title={user?.displayName}
                                    />}

                            </div>
                            <Navbar.Text className='mx-3'>
                                {user ? <Button onClick={handleLogOut} variant="secondary">Logout
                                </Button> :
                                    <Link to='/registration'><Button variant="secondary">Sign Up</Button></Link>
                                }
                            </Navbar.Text>
                        </Navbar.Collapse>
                    </Navbar>
                </Container>
            </section>
        </div>
    );
};

export default Navigationbar;
