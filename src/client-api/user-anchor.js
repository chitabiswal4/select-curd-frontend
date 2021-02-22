import axios from 'axios';
import {BASE_URL} from '../config/axios-config';

const client = axios.create({
  baseURL: BASE_URL,
});

export const saveUserAnchor = (payload) =>
  client.post(`/post-user-anchor`, payload);
export const getAllUserAnchor = () => client.get(`/get-user-anchor`);
export const updateUserAnchorById = (payload) => client.put(`/update`, payload);
export const deleteAnchorById = (payload) =>
  client.delete('/delete', {data: payload});

const userAnchorClientApi = {
  getAllUserAnchor,
  saveUserAnchor,
  updateUserAnchorById,
  deleteAnchorById,
};

export default userAnchorClientApi;
