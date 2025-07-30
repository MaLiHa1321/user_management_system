const blockSelectedUsers = async (axiosPublic, selected, setUsers, setSelected, users) => {
  const ids = Object.keys(selected).filter(id => selected[id]);
  if (!ids.length) return { success: false, message: "No users selected." };
  try {
    const { data } = await axiosPublic.patch("/users/block", { ids });
    if (!data.success) throw new Error();
    const email = JSON.parse(localStorage.getItem("user"))?.email;
    const logout = users.some(u => ids.includes(u._id) && u.email === email);
    if (logout) return { success: true, message: `${data.modifiedCount} user(s) blocked.`, logout };
    setUsers(u => u.map(user => ids.includes(user._id) ? { ...user, blocked: true } : user));
    setSelected({});
    return { success: true, message: `${data.modifiedCount} user(s) blocked.`, logout: false };
  } catch {
    return { success: false, message: "Failed to block selected users." };
  }
};
export default blockSelectedUsers;
