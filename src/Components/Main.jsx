import { Outlet } from "react-router-dom";
import Navigationbar from "./shared/NavigationBar";

const Main = () => {
    return (
        <div>
            <Navigationbar></Navigationbar>
            <Outlet></Outlet>
        </div>
    );
};

export default Main;