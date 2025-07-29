import useAxiosPublic from "../hook/useAxiosPublic";
const useUserApi = () => {
  const axiosPublic = useAxiosPublic();
  const fetchUsers = async () => {
    try {
      const response = await axiosPublic.get("/users");
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }};
  return { fetchUsers };
};

export default useUserApi;
