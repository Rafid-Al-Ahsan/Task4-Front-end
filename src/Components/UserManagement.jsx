import { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import { FaUnlock, FaTrashAlt } from 'react-icons/fa';  // Icons for Unblock and Delete

const UserManagement = () => {
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

  // Handle checkbox change for individual users
  const handleCheckboxChange = (userId) => {
    setSelectedUsers(prevSelected => 
      prevSelected.includes(userId) 
        ? prevSelected.filter(id => id !== userId) 
        : [...prevSelected, userId]
    );
  };

  // Handle "Select/Deselect All" checkbox
  const handleSelectAllChange = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user._id));
    }
    setSelectAll(!selectAll);
  };

  // Placeholder functions for block/unblock/delete actions
  const handleBlock = () => {
    console.log('Blocked users:', selectedUsers);
  };
  
  const handleUnblock = () => {
    console.log('Unblocked users:', selectedUsers);
  };

  const handleDelete = () => {
    console.log('Deleted users:', selectedUsers);
  };

  if (loading) {
    return <p>Loading users...</p>;
  }

  return (
    <div>
      <h2>User Management</h2>

      {/* Toolbar with action buttons */}
      <div className="mb-3">
        <Button variant="danger" onClick={handleBlock}>Block</Button>{' '}
        <Button variant="outline-success" onClick={handleUnblock}><FaUnlock /></Button>{' '}
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
          {users.map(user => (
            <tr key={user._id}>
              <td>
                <input 
                  type="checkbox" 
                  checked={selectedUsers.includes(user._id)} 
                  onChange={() => handleCheckboxChange(user._id)} 
                />
              </td>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.lastlogin}</td>
              <td>{user.time}</td>
              <td>{user.status === 'active' ? 'Active' : 'Blocked'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserManagement;
