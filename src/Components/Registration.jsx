/* eslint-disable no-unused-vars */
import { Button, Container, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, signOut, updateProfile } from 'firebase/auth';
import app from '../firebase/firebase.config';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const Registration = () => {

    const auth = getAuth(app);

    const handleRegister = (event) => {
        event.preventDefault();
        const form = event.target;
        const photo = form.photo.value;
        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;


        createUserWithEmailAndPassword(auth, email, password)
            .then(result => {
                const createdUser = result.user;

                updateProfile(createdUser, { photoURL: photo, displayName: name })
                    .then(() => {
                        console.log('User profile updated successfully.');
                        const saveUser = { name: createdUser.displayName, email: createdUser.email,  img: createdUser.photoURL, time: createdUser.metadata.creationTime, lastlogin: "----", status: 'Not-blocked'};
                        fetch('https://task4-pink.vercel.app/users', {
                            method: 'POST',
                            headers: {
                                'content-type': 'application/json'
                            },
                            body: JSON.stringify(saveUser)
                        })
                        .then(response => response.json())
                        .then(data => {});
                    })
                    .catch((updateError) => {
                        console.error('Error updating user profile:', updateError);
                      
                    });

                signOut(auth);
                // console.log(createdUser);

                toast.success('User created successful! Please go to the login page and login', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    });

                
                event.target.reset();
            })
            .catch(error => {
                // setError(error.message);
                toast.error(error.message, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            })

    }

    return (
        <Container className='w-25 mx-auto my-5'>
            <h3>Please Register</h3>
            <Form onSubmit={handleRegister}>
                <Form.Group className="mb-3">
                    <Form.Label>Photo URL</Form.Label>
                    <Form.Control type="text" name="photo" placeholder="Photo URL" />

                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="name" name="name" placeholder="Your Name" required />

                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" name="email" placeholder="Enter email" required />

                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password" placeholder="Password" required />
                </Form.Group>


                <Button variant="primary" /*disabled={!accepted}*/ type="submit">
                    Register
                </Button>

                <ToastContainer />

                {/* <br />
                <Form.Text className="text-success">
                    {success}
                </Form.Text>

                <br />

                <Form.Text className="text-danger">
                    {error}
                </Form.Text>
                <br /> */}

                <br />

                <Form.Text className="text-secondary">
                    Already Have an Account? <Link to="/login">Login</Link>
                </Form.Text>


            </Form>

            
        </Container>
    );
};

export default Registration;