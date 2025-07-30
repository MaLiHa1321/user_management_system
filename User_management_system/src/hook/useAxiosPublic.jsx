import axios from "axios";
const axiosPublic = axios.create({
    baseURL: 'https://server-mocha-kappa-40.vercel.app',
     headers: {
    'Content-Type': 'application/json'
  }
})
const useAxiosPublic = () => {
    return axiosPublic;
};

export default useAxiosPublic;