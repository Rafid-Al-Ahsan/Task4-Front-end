import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { Container } from "react-bootstrap";

const Home = () => {

    const { firebaseUser } = useContext(AuthContext);
    console.log(firebaseUser)

    return (
        <div>
            <Container>
                <h2>Welcome to Dashboard, {firebaseUser?.displayName}</h2>
            </Container>
        </div>
    );
};

export default Home;