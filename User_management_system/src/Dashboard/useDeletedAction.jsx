import useAxiosPublic from '../hook/useAxiosPublic';

const useDeletedAction = () => {
  const axiosPublic = useAxiosPublic();
const deleteSelectedUsers = async (selected, setUsers, users, setSelected) => {
    const ids = Object.keys(selected).filter(id => selected[id]);
    if (!ids.length) return { success: false, message: "No users selected." };
    try {
      const { data } = await axiosPublic.delete("/users", { data: { ids } });
      if (!data.success) return { success: false, message: "Failed to delete users." };
      setUsers(users.filter(user => !ids.includes(user._id))); setSelected({});
      return { success: true, message: `${data.deletedCount} users deleted.` };
    } catch (e) {
      console.error(e); return { success: false, message: "Failed to delete users." };
    }
  };
  return { deleteSelectedUsers };
};

export default useDeletedAction;
