
const unblockSelectedUsers = async (axiosPublic, selected, setUsers, setSelected) => {
  const ids = Object.keys(selected).filter(id => selected[id]);
  if (!ids.length) return { success: false, message: "No users selected." };
  try { const { data } = await axiosPublic.patch("/users/unblock", { ids });
    if (data.success) { setUsers(u => u.map(user => ids.includes(user._id) ? { ...user, blocked: false } : user)); setSelected({}); return { success: true, message: `${data.modifiedCount} users unblocked.` }; }
  } catch (e) { console.error(e); }
  return { success: false, message: "Failed to unblock selected users." };
};

export default unblockSelectedUsers;

