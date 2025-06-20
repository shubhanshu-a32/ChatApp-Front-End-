import axios from 'axios';

const useAxios = () => {
  const token = localStorage.getItem('token');

  const instance = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL || '',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  return instance;
};

export default useAxios;