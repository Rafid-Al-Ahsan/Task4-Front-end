import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";

const Home = () => {

    const {user} = useContext(AuthContext);
    console.log(user)

    return (
        <div>
            <h2>Welcome to Dashboard, {user?.displayName}</h2>

        </div>
    );
};

export default Home;