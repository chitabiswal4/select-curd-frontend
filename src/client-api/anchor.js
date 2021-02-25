import axios from 'axios';
import {BASE_URL} from '../config/axios-config';

const client = axios.create({
  baseURL: BASE_URL,
});

export const saveAnchor = (payload) => client.post(`/post-anchor`, payload);
export const getAllAnchor = (payload) =>
  client.get(`/get-anchor`, {params: {payload}});
export const updateAnchorById = (payload) => client.put(`/update`, payload);
export const deleteAnchorById = (payload) =>
  client.delete('/delete', {data: payload});

const AnchorClientApi = {
  getAllAnchor,
  saveAnchor,
  updateAnchorById,
  deleteAnchorById,
};

export default AnchorClientApi;
