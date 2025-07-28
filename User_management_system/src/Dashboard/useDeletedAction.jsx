import React from 'react';
import useAxiosPublic from '../hook/useAxiosPublic';

const useDeletedAction = () => {
  const axiosPublic = useAxiosPublic();

  const deleteSelectedUsers = async (selected, setUsers, users, setSelected) => {
    const selectedIds = Object.entries(selected)
      .filter(([_, checked]) => checked)
      .map(([id]) => id);

    if (selectedIds.length === 0) {
      alert("No users selected.");
      return;
    }

    try {
      const res = await axiosPublic.delete("/users", {
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

  return { deleteSelectedUsers };
};


export default useDeletedAction;