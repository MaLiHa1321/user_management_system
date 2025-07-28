// src/actions/unblockUsers.js

const unblockSelectedUsers = async (axiosPublic, selected, setUsers, setSelected) => {
  const selectedIds = Object.entries(selected)
    .filter(([_, checked]) => checked)
    .map(([id]) => id);

  if (selectedIds.length === 0) {
    alert("No users selected.");
    return;
  }

  try {
    const res = await axiosPublic.patch("/users/unblock", {
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

export default unblockSelectedUsers;
