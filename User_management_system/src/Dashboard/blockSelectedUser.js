
const blockSelectedUsers = async (axiosPublic, selected, setUsers, setSelected) => {
  const ids = Object.keys(selected).filter(id => selected[id]);
  if (!ids.length) return { success: false, message: "No users selected." };
  try { const { data } = await axiosPublic.patch("/users/block", { ids });
    if (data.success) { setUsers(u => u.map(user => ids.includes(user._id) ? { ...user, blocked: true } : user)); setSelected({}); return { success: true, message: `${data.modifiedCount} user(s) blocked.` }; }
  } catch (e) { console.error(e); }
  return { success: false, message: "Failed to block selected users." };
};

export default blockSelectedUsers;

