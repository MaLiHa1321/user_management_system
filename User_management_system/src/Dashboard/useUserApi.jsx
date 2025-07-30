import useAxiosPublic from "../hook/useAxiosPublic";

const useUserApi = () => {
  const axiosPublic = useAxiosPublic();

  const fetchUsers = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.email) {
        console.warn("No logged-in user email found.");
        return [];
      }
      const response = await axiosPublic.get(`/users?email=${encodeURIComponent(user.email)}`);
      // Convert lastLogin strings to Date objects for frontend convenience
      const users = response.data.map(u => ({
        ...u,
        lastLogin: u.lastLogin ? new Date(u.lastLogin) : null,
      }));
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  return { fetchUsers };
};

export default useUserApi;
