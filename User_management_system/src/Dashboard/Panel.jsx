import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { FaUnlock } from "react-icons/fa";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const LoginBarChart = ({ lastLogin }) => {
  const maxMinutes = 10080; // 7 days
  let minutesAgo = maxMinutes;

  if (lastLogin) {
    const now = Date.now();
    const loginTime = new Date(lastLogin).getTime();
    minutesAgo = (now - loginTime) / (1000 * 60);
    if (minutesAgo > maxMinutes) minutesAgo = maxMinutes;
  }

  const value = maxMinutes - minutesAgo;

  const data = {
    labels: [""],
    datasets: [
      {
        label: "Login Recency (min)",
        data: [value],
        backgroundColor: "#28a745",
        barPercentage: 1.0,
        categoryPercentage: 1.0,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    scales: {
      x: { min: 0, max: maxMinutes, display: false },
      y: { display: false },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: () =>
            lastLogin
              ? `Last login: ${new Date(lastLogin).toLocaleString()}`
              : "Never logged in",
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: 120, height: 25 }}>
      <Bar data={data} options={options} />
    </div>
  );
};

const Panel = () => {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) return navigate("/login");

    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, [navigate]);

  const toggleCheckbox = (id) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Batch delete
  const deleteSelectedUsers = async () => {
    const selectedIds = Object.entries(selected)
      .filter(([_, checked]) => checked)
      .map(([id]) => id);

    if (selectedIds.length === 0) return alert("No users selected.");

    try {
      const res = await axios.delete("http://localhost:5000/users", {
        data: { ids: selectedIds },
      });

      alert(`${res.data.deletedCount} user(s) deleted.`);
      setUsers(users.filter((user) => !selectedIds.includes(user._id)));
      setSelected({});
    } catch (err) {
      console.error("Error deleting users:", err);
      alert("Failed to delete users.");
    }
  };

  const blockSelectedUsers = async () => {
  const selectedIds = Object.entries(selected)
    .filter(([_, checked]) => checked)
    .map(([id]) => id);
  if (selectedIds.length === 0) return alert("No users selected.");

  try {
    const res = await axios.patch("http://localhost:5000/users/block", {
      ids: selectedIds,
    });
    if (res.data.success) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          selectedIds.includes(user._id) ? { ...user, blocked: true } : user
        )
      );
      setSelected({});
      alert(`${res.data.modifiedCount} user(s) blocked.`);
    } else {
      alert("Failed to block selected users.");
    }
  } catch (err) {
    console.error("Batch block error:", err);
    alert("Failed to block selected users.");
  }
};

const unblockSelectedUsers = async () => {
  const selectedIds = Object.entries(selected)
    .filter(([_, checked]) => checked)
    .map(([id]) => id);
  if (selectedIds.length === 0) return alert("No users selected.");

  try {
    const res = await axios.patch("http://localhost:5000/users/unblock", {
      ids: selectedIds,
    });
    if (res.data.success) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          selectedIds.includes(user._id) ? { ...user, blocked: false } : user
        )
      );
      setSelected({});
      alert(`${res.data.modifiedCount} user(s) unblocked.`);
    } else {
      alert("Failed to unblock selected users.");
    }
  } catch (err) {
    console.error("Batch unblock error:", err);
    alert("Failed to unblock selected users.");
  }
};

 

  const sortedUsers = [...users].sort((a, b) => {
    const aTime = new Date(a.lastLogin || 0).getTime();
    const bTime = new Date(b.lastLogin || 0).getTime();
    return bTime - aTime;
  });

  return (
    <div className="container mt-4">
      <h2>Admin Panel</h2>

      <div className="mb-3">
        <button className="btn btn-warning me-2" onClick={blockSelectedUsers}>
  Block Selected
</button>
<button className="btn btn-success me-2" onClick={unblockSelectedUsers}>
  Unblock Selected
</button>
<button className="btn btn-danger" onClick={deleteSelectedUsers}>
  Delete Selected
</button>

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
                <input
                  type="checkbox"
                  checked={!!selected[user._id]}
                  onChange={() => toggleCheckbox(user._id)}
                />
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <div>
                  {user.lastLogin
                    ? `${Math.floor(
                        (Date.now() - new Date(user.lastLogin)) / 60000
                      )} mins ago`
                    : "Never"}
                </div>
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
