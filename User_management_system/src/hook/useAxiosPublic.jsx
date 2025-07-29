import axios from "axios";
const axiosPublic = axios.create({
    baseURL: 'https://server-mocha-kappa-40.vercel.app'
})
const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;