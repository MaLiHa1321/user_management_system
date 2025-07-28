// src/actions/blockUsers.js

const blockSelectedUsers = async (axiosPublic, selected, setUsers, setSelected) => {
  const selectedIds = Object.entries(selected)
    .filter(([_, checked]) => checked)
    .map(([id]) => id);

  if (selectedIds.length === 0) {
    alert("No users selected.");
    return;
  }

  try {
    const res = await axiosPublic.patch("/users/block", {
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

export default blockSelectedUsers;
