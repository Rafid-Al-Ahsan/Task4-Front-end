import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { Container } from "react-bootstrap";

const Home = () => {

    const { user } = useContext(AuthContext);
    console.log(user)

    return (
        <div>
            <Container>
                <h2>Welcome to Dashboard, {user?.displayName}</h2>
            </Container>
        </div>
    );
};

export default Home;