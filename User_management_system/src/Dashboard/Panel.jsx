import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginBarChart from "../BarChart/LoginBarChart";
import { FaUnlock } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import useUserApi from "./useUserApi";
import useDeletedAction from "./useDeletedAction";
import useAxiosPublic from "../hook/useAxiosPublic";
// import blockSelectedUsers from "./blockSelectedUser";
import unblockSelectedUsers from "./unBlockUsers";
import { sortUsersByLastLoginDesc } from "./sortUser";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatTimeAgo } from "./timeUtilis";
import blockSelectedUsers from "./blockSelectedUser";

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
    // Convert lastLogin strings to Date objects before setting state
    const usersWithDate = data.map(user => ({
      ...user,
      lastLogin: user.lastLogin ? new Date(user.lastLogin) : null,
    }));
    setUsers(usersWithDate);
  };

  loadUsers();
}, [navigate, fetchUsers]);
  const toggleCheckbox = (id) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleActionResult = (result) => {
  result.success ? toast.success(result.message) : toast.error(result.message);
};

    const handleDelete = async () => {
    const result = await deleteSelectedUsers(selected, setUsers, users, setSelected);
    handleActionResult(result);
};

const handleBlock = async () => {
  const result = await blockSelectedUsers(axiosPublic, selected, setUsers, setSelected, users);
  if (result.logout) return toast.success(result.message), localStorage.removeItem("user"), navigate("/login");
  handleActionResult(result);
};

 const handleUnblock = async () => {
   const result = await unblockSelectedUsers(axiosPublic, selected, setUsers, setSelected);
    handleActionResult(result);
  };

  const handleLogout = () => {
  localStorage.removeItem("token"); 
  navigate("/login");
  }
  return (
 <div className="container-fluid mt-4 px-2 px-md-4">
 <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 mb-3">
  <h2 className="text-center text-md-start mb-0">Admin Panel</h2>

  <div className="d-flex gap-2 align-items-center">
    <select className="form-select" aria-label="Select option" style={{ minWidth: "150px" }}>
      <option value="" disabled selected>Filtered</option>
    </select>
    <button className="btn btn-outline-secondary" onClick={handleLogout}>
      Logout
    </button>
  </div>
</div>
  <div className="d-flex flex-wrap gap-2 mb-3">
    <button className="btn btn-warning" onClick={handleBlock}>
      <FaLock /> Block
    </button>
    <button className="btn btn-success" onClick={handleUnblock}>
      <FaUnlock /> 
    </button>
    <button className="btn btn-danger" onClick={handleDelete}>
      < FaTrash />
    </button>
     <ToastContainer position="top-right" autoClose={3000} />
  </div>
  <div className="table-responsive" style={{ overflowX: 'auto' }}>
    <table className="table table-bordered table-striped table-sm text-nowrap align-middle mb-0">
      <thead className="table-light">
        <tr>
          <th>#</th>
          <th><input type="checkbox" disabled /></th>
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
              <input
                type="checkbox"
                checked={!!selected[user._id]}
                onChange={() => toggleCheckbox(user._id)}
              />
            </td>
            <td>{user.name}</td>
            <td className="text-break" style={{ minWidth: "150px" }}>{user.email}</td>
            <td style={{ minWidth: "120px" }}>
           <div className="small">
             {user.lastLogin ? formatTimeAgo(user.lastLogin) : "Never"}
            </div>
              <LoginBarChart lastLogin={user.lastLogin} />
            </td>
            <td>{user.blocked ? "Blocked" : "Active"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
  );
}

export default Panel;
