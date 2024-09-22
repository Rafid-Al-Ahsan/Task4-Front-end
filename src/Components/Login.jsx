/* eslint-disable react/no-unescaped-entities */
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from '../firebase/firebase.config';
import { format } from 'date-fns';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';

const auth = getAuth(app);

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const [users, setUsers] = useState([]);

    // Use useEffect to log the users when it updates
    

    const handleLogin = event => {
        event.preventDefault();
        const form = event.target;
        const email = form.emailfield.value;
        const password = form.passwordfield.value;
    
        // Fetch user data from the server using email
        fetch(`http://localhost:5000/users/${email}`)
            .then(response => response.json())
            .then(data => {
                // Check if the user's status is blocked
                if (data.status === "blocked") {
                    toast.error('Your account is blocked. Please contact support.', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                    return; // Stop further execution if the user is blocked
                }
    
                // If the status is not blocked, proceed with login
                signInWithEmailAndPassword(auth, email, password)
                    .then(result => {
                        const loggedUser = result.user;
                        console.log(loggedUser);
    
                        // Format the current date and time
                        const formattedDate = format(new Date(), 'dd-MM-yyyy HH:mm:ss');
    
                        // Prepare the object to send to the server
                        const saveUser = { lastlogin: formattedDate };
    
                        // Make the PUT request to update the last login time in MongoDB
                        fetch(`http://localhost:5000/users/${loggedUser.email}`, {
                            method: 'PUT',
                            headers: {
                                'content-type': 'application/json',
                            },
                            body: JSON.stringify(saveUser),
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Last login updated:', data);
                        })
                        .catch(error => console.error('Error updating last login:', error));
    
                        // Navigate the user to the desired page after login
                        navigate(from, { replace: true });
                    })
                    .catch(error => {
                        toast.error('Incorrect username or password', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                        });
                        console.error(error.message);
                    });
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                toast.error('An error occurred while trying to log you in.', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            });
    }
    

    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <h2 className="text-center my-4">Login</h2>
                    <Form onSubmit={handleLogin}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control type="email" name="emailfield" placeholder="Enter email" required />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword" className="mt-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="passwordfield" placeholder="Password" required />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="w-100 mt-4 py-2" height="34">
                            Login
                        </Button>
                    </Form>

                    <Form.Text className="text-secondary">
                        Don't have an account? <Link to="/registration">Register</Link><br />
                    </Form.Text>

                    <ToastContainer />
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
