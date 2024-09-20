/* eslint-disable react/no-unescaped-entities */
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from '../firebase/firebase.config';

import { format } from 'date-fns';


const auth = getAuth(app);

const Login = () => {

    const [error, setError] = useState();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const handleLogin = event => {
        event.preventDefault();
        const form = event.target;
        const email = form.emailfield.value;
        const password = form.passwordfield.value;
        

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

                navigate(from, { replace: true });
            })
            .catch(error => {
                setError(error.message);
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

                    <Form.Text className="text-danger">
                        {error}
                    </Form.Text>

                </Col>
            </Row>

        </Container>
    );
};

export default Login;