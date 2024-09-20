import React from 'react'
import ReactDOM from 'react-dom/client'
import Main from './Components/Main'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import Dashboard from './Components/Dashboard';
import Login from './Components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import Registration from './Components/Registration';
import AuthProvider from './provider/AuthProvider';
import PrivateRoute from './Routes/PrivateRoute';
import UserManagement from './Components/UserManagement';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main></Main>,
    children: [
      {
        path: "/",
        element: <PrivateRoute><Dashboard></Dashboard></PrivateRoute>
      },
      {
        path: "/login",
        element: <Login></Login>
      },
      {
        path: "/registration",
        element: <Registration></Registration>
      },
      {
        path: "/usermanagement",
        element: <PrivateRoute><UserManagement></UserManagement></PrivateRoute>
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
        <RouterProvider router={router} />
     </AuthProvider>
  </React.StrictMode>
);