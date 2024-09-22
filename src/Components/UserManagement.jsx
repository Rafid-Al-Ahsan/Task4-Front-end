import { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { FaUnlock, FaTrashAlt } from 'react-icons/fa';  // Icons for Unblock and Delete

import { useContext } from 'react';
import { AuthContext } from '../provider/AuthProvider';
import { getAuth, signOut } from 'firebase/auth';
import app from '../firebase/firebase.config';

import Swal from 'sweetalert2'

const UserManagement = () => {
 
  const { firebaseUser } = useContext(AuthContext);
  const auth = getAuth(app);

  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectAll, setSelectAll] = useState(false);

  // Fetch data when the component mounts
  useEffect(() => {
    fetch('http://localhost:5000/users')
      .then(response => response.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        setLoading(false);
      });
  }, []);

   //Handle Signout
  const handleLogOut = () => {
    signOut(auth).then(() => {});
  };

  // Handle checkbox change for individual users
  const handleCheckboxChange = (email) => {
    setSelectedUsers(prevSelected => 
      prevSelected.includes(email) 
        ? prevSelected.filter(e => e !== email) 
        : [...prevSelected, email]
    );
  };

  // Handle "Select/Deselect All" checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user.email));
    }
    setSelectAll(!selectAll);
  };

  // Function to delete selected users by email
  const handleDelete = () => {
    
    // using sweetalert for conformation 
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        
        // Main function begins
    // Filter out users that are not selected
    const usersToDelete = users.filter(user => selectedUsers.includes(user.email));

    // Make a DELETE request to remove each selected user by email
    usersToDelete.forEach(user => {
      fetch(`http://localhost:5000/users/${user.email}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
      })
        .then(response => response.json())
        .then(data => {
          console.log(`User ${user.name} deleted successfully.`);
          // Update the UI by removing the deleted user from the users state
          setUsers(prevUsers => prevUsers.filter(u => u.email !== user.email));
          // Clear the selected users list
          setSelectedUsers(prevSelected => prevSelected.filter(email => email !== user.email));

          // Check if the deleted user is the current user
          if (user.email === firebaseUser.email) { // Replace `currentUserEmail` with the actual email of the logged-in user
            handleLogOut(); // Call the logout function
          }

          console.log(data);

        })
        .catch(error => {
          console.error(`Error deleting user ${user.name}:`, error);
        });
    });
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });





  };

  if (loading) {
    return <p>Loading users...</p>;
  }

  return (
    <div>
      <h2 style={{textAlign: 'center'}}>User Management</h2>

      {/* Toolbar with action buttons */}
      <div className="mb-3">
        <Button variant="danger">Block</Button>{' '}
        <Button variant="outline-success"><FaUnlock /></Button>{' '}
        <Button variant="outline-dark" onClick={handleDelete}><FaTrashAlt /></Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>
              <input 
                type="checkbox" 
                onChange={handleSelectAllChange} 
                checked={selectAll} 
              />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Last Login</th>
            <th>Registration Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.email}>
              <td>
                <input 
                  type="checkbox" 
                  checked={selectedUsers.includes(user.email)} 
                  onChange={() => handleCheckboxChange(user.email)} 
                />
              </td>
              <td>{index + 1}</td> {/* Serial number */}
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.lastlogin}</td>
              <td>{user.time}</td>
              <td>{user.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserManagement;
