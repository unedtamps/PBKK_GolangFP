import axios from 'axios';

export const register = async (data) => {
  const response = await axios.post('http://localhost:8081/account/register', data);
  return response;
};
