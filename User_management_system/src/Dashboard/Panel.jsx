import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginBarChart from "../BarChart/LoginBarChart";
import { FaUnlock } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import useUserApi from "./useUserApi";
import useDeletedAction from "./useDeletedAction";
import useAxiosPublic from "../hook/useAxiosPublic";
import blockSelectedUsers from "./blockSelectedUser";
import unblockSelectedUsers from "./unBlockUsers";
import { sortUsersByLastLoginDesc } from "./sortUser";

const Panel = () => {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState({});
  const navigate = useNavigate();
  const { fetchUsers } = useUserApi();
  const { deleteSelectedUsers } = useDeletedAction();
  const axiosPublic = useAxiosPublic();
  const sortedUsers = sortUsersByLastLoginDesc(users);
  

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) return navigate("/login");

    const loadUsers = async () => {
      const data = await fetchUsers();
      setUsers(data);
    };

    loadUsers();
  }, [navigate, fetchUsers]);


  const toggleCheckbox = (id) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Batch delete
    const handleDelete = () => {
    deleteSelectedUsers(selected, setUsers, users, setSelected);
  };
// batch block
    const handleBlock = () => {
    blockSelectedUsers(axiosPublic, selected, setUsers, setSelected);
  };
  // unblock user
 const handleUnblock = () => {
    unblockSelectedUsers(axiosPublic, selected, setUsers, setSelected);
  };


  return (
    <div className="container mt-4">
      <h2>Admin Panel</h2>
      <div className="mb-3">
        <button className="btn btn-warning me-2" onClick={handleBlock}><FaLock /> Block</button>
        <button className="btn btn-success me-2" onClick={handleUnblock}> <FaUnlock /></button>
        <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
      </div>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>
              <input type="checkbox" disabled />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Last Login</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map((user, index) => (
            <tr key={user._id} className={user.blocked ? "table-danger" : ""}>
              <td>{index + 1}</td>
              <td>
                <input type="checkbox" checked={!!selected[user._id]} onChange={() => toggleCheckbox(user._id)}/>
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <div> {user.lastLogin ? `${Math.floor( (Date.now() - new Date(user.lastLogin)) / 60000)} mins ago`: "Never"}</div>
                <LoginBarChart lastLogin={user.lastLogin} />
              </td>
             <td>{user.blocked ? "Blocked" : "Active"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Panel;
